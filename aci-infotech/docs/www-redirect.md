# Canonical host redirect (www to apex)

The whole site canonicalizes to the apex host `https://aciinfotech.com`
(sitemap, robots, `metadataBase`, and every `<link rel="canonical">`).
Until now `www.aciinfotech.com` also answered every URL with a `200`, so
each page existed at two addresses and Search Console flagged the pair as
duplicate content (~79% of the duplicate-content report was this split).

There are two layers that can do the `www -> apex` redirect. You do not
need both, but having both is the safe default: nginx handles it first in
production, and the app-level redirect is a backstop that travels with the
code to every environment.

---

## Layer 1: app-level (already shipped, deploys automatically)

`src/middleware.ts` 301-redirects any request whose public host starts
with `www.` to the apex, preserving path and query. It reads
`x-forwarded-host` (the header nginx sets), so it works behind the reverse
proxy.

This needs no VPS work. It goes live the next time production builds and
restarts through the normal deploy flow. If you do nothing else, www
duplicates still collapse on the next deploy.

```sh
# after a normal prod deploy, confirm:
curl -sI https://www.aciinfotech.com/        # 301 -> https://aciinfotech.com/
```

---

## Layer 2: nginx (optional, faster)

Doing the redirect in nginx means www requests never reach Node at all
(one less hop). This is a **production** change to the prod nginx config
on the VPS. It is not in this repo (the prod server block lives on the box,
the same way the staging block does in `docs/staging.md`).

Production today proxies both `aciinfotech.com` and `www.aciinfotech.com`
to `127.0.0.1:3002`. The change: stop proxying www, and 301 it instead.

### The server blocks

Find the prod config (typically `/etc/nginx/sites-available/aciinfotech.com`
or a file under `/etc/nginx/conf.d/`). Adjust it to this shape:

```nginx
# 1) Apex over HTTPS — the real site. Serve ONLY the apex here:
#    remove www.aciinfotech.com from this server_name line.
server {
    listen 443 ssl http2;
    server_name aciinfotech.com;

    ssl_certificate     /etc/letsencrypt/live/aciinfotech.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/aciinfotech.com/privkey.pem;

    location / {
        proxy_pass http://127.0.0.1:3002;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# 2) www over HTTPS — 301 to the apex, keeping path + query.
server {
    listen 443 ssl http2;
    server_name www.aciinfotech.com;

    # www already serves valid HTTPS today, so the existing cert covers
    # it. Point at the SAME cert — nginx must finish the TLS handshake
    # before it can return the redirect, so the cert has to be valid for
    # www even though all this block does is redirect.
    ssl_certificate     /etc/letsencrypt/live/aciinfotech.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/aciinfotech.com/privkey.pem;

    return 301 https://aciinfotech.com$request_uri;
}

# 3) Plain HTTP (both hosts) — straight to HTTPS apex in one hop.
server {
    listen 80;
    server_name aciinfotech.com www.aciinfotech.com;
    return 301 https://aciinfotech.com$request_uri;
}
```

### Apply it

```sh
sudo nginx -t                      # validate syntax FIRST
sudo systemctl reload nginx        # zero-downtime reload (only if -t passed)
```

`nginx -t` failing leaves the running config untouched, so a typo never
takes the site down. Fix and re-run.

### Verify

```sh
curl -sI https://www.aciinfotech.com/         # 301 -> https://aciinfotech.com/
curl -sI https://www.aciinfotech.com/blogs    # 301 -> https://aciinfotech.com/blogs
curl -sI "https://www.aciinfotech.com/case-studies?service=applied-ai-ml"
                                              # 301, query preserved
curl -sI https://aciinfotech.com/             # 200 (apex unchanged)
```

### Notes / gotchas

- **Cert must cover www.** Confirmed already true (www serves HTTPS 200
  today). If you ever reissue the cert, keep `www.aciinfotech.com` as a
  SAN, or the HTTPS www block can't complete TLS and the redirect never
  fires. HSTS is sent with `includeSubDomains; preload`, so browsers will
  refuse a www page with a bad cert rather than fall back to HTTP.
- **Order matters less than `server_name` exactness.** nginx matches the
  most specific `server_name`, so the dedicated www block wins for www
  even though the apex block is listed first.
- **With nginx doing the redirect, the middleware redirect never sees
  www** in production. That is fine — it stays as the cross-environment
  backstop. Don't remove it.

---

## After it's live

In Google Search Console: keep both the www and non-www properties
verified, resubmit `https://aciinfotech.com/sitemap.xml`, and request
re-indexing on a few affected URLs to nudge a recrawl. Google drops the
www duplicates on its own once it follows the 301s.
