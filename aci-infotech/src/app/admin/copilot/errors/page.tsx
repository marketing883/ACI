import StubPage from '../_components/StubPage';

export default function AtherosErrorsStub() {
  return (
    <StubPage
      title="Chat Error Log"
      summary="Every log.error / log.warn from the Atheros stack lands in chat_errors. This dashboard groups by fingerprint, lets you silence noisy ones, and links each occurrence back to the session replay scrubbed to that moment."
      phase="Phase C"
      previewItems={[
        'Filter by stage, severity, time range, session_id.',
        'sha256(stage + normalized message) fingerprint clusters same-root errors with count + last-seen.',
        'Silence-for-24h button writes to chat_error_silences (already migrated this commit).',
        'Per-error "jump to session" deep-link.',
        'Sparkline of error rate per hour for the last 7 days.',
      ]}
    />
  );
}
