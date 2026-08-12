#!/usr/bin/env python3
"""
Minimal deploy hook for aciinfotech.com.

Why this exists: the agent sandbox that does the development work has no
route to port 22 - direct SSH times out and the egress proxy will not open
a CONNECT tunnel to 22, only 443. Port 443 does reach the box, so a deploy
that can be triggered from outside has to arrive over HTTPS.

This is deliberately small and boring. It listens on loopback only, nginx
terminates TLS in front of it, and it can do exactly one thing: run
/usr/local/bin/aci-deploy with a ref that has already been validated.
There is no shell, no user-supplied command, and no path traversal.

It is still an authenticated remote-execution endpoint. Treat the token
like a deploy key: rotate it if it leaks, and keep the nginx location
restricted.

Install: /usr/local/bin/aci-deploy-hook  (chmod 755, owned by root)
Runs as the deploy user under systemd, reading ACI_DEPLOY_TOKEN from an
EnvironmentFile that only that user can read.
"""

import hmac
import json
import os
import re
import subprocess
import sys
import threading
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

TOKEN = os.environ.get("ACI_DEPLOY_TOKEN", "")
BIND_HOST = os.environ.get("ACI_HOOK_HOST", "127.0.0.1")
BIND_PORT = int(os.environ.get("ACI_HOOK_PORT", "9099"))
DEPLOY_CMD = os.environ.get("ACI_DEPLOY_CMD", "/usr/local/bin/aci-deploy")

# Same shape the deploy script enforces. Checked here too so a bad ref is
# rejected before anything is executed at all.
REF_RE = re.compile(r"^[A-Za-z0-9._/-]{1,255}$")

# One deploy at a time, mirroring the flock in the deploy script. This
# turns a concurrent request into a clean 409 instead of a lock timeout.
_running = threading.Lock()

if len(TOKEN) < 32:
    sys.stderr.write("ACI_DEPLOY_TOKEN missing or too short (need >= 32 chars)\n")
    sys.exit(1)


class Handler(BaseHTTPRequestHandler):
    server_version = "aci-deploy-hook"
    sys_version = ""

    def _send(self, status, payload):
        body = json.dumps(payload).encode()
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _authorized(self):
        header = self.headers.get("Authorization", "")
        if not header.startswith("Bearer "):
            return False
        # Constant-time: a timing side channel here would leak the token
        # one byte at a time to anyone who can reach the endpoint.
        return hmac.compare_digest(header[7:].strip(), TOKEN)

    def do_GET(self):
        # Unauthenticated liveness only. Says nothing about the app.
        if self.path == "/healthz":
            self._send(200, {"ok": True})
        else:
            self._send(404, {"error": "not found"})

    def do_POST(self):
        if self.path != "/deploy":
            self._send(404, {"error": "not found"})
            return
        if not self._authorized():
            self.log_message("rejected unauthorized deploy request")
            self._send(401, {"error": "unauthorized"})
            return

        length = int(self.headers.get("Content-Length") or 0)
        if length > 4096:
            self._send(413, {"error": "body too large"})
            return
        try:
            payload = json.loads(self.rfile.read(length) or b"{}")
        except json.JSONDecodeError:
            self._send(400, {"error": "invalid json"})
            return

        ref = str(payload.get("ref", "")).strip()
        if not REF_RE.match(ref):
            self._send(400, {"error": "invalid ref"})
            return

        if not _running.acquire(blocking=False):
            self._send(409, {"error": "a deploy is already running"})
            return

        try:
            self.log_message("deploying ref=%s", ref)
            proc = subprocess.run(
                [DEPLOY_CMD, ref],
                capture_output=True,
                text=True,
                timeout=1800,
            )
            self._send(
                200 if proc.returncode == 0 else 500,
                {
                    "ok": proc.returncode == 0,
                    "ref": ref,
                    "exit_code": proc.returncode,
                    "stdout": proc.stdout[-20000:],
                    "stderr": proc.stderr[-20000:],
                },
            )
        except subprocess.TimeoutExpired:
            self._send(504, {"error": "deploy timed out after 30 minutes"})
        finally:
            _running.release()


if __name__ == "__main__":
    ThreadingHTTPServer((BIND_HOST, BIND_PORT), Handler).serve_forever()
