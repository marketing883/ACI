import StubPage from '../_components/StubPage';

export default function AtherosHandoffsStub() {
  return (
    <StubPage
      title="Handoff Inbox"
      summary="Sessions where Atheros emitted handoff_to_human appear here for an admin to claim and continue, in either relay (admin types) or copilot (admin edits AI drafts) mode."
      phase="Phase B"
      previewItems={[
        'Real-time Supabase Realtime alert when handoff_at is set on chat_sessions.',
        'Pre-packed handoff payload (reason, summary, sticky context) inline.',
        'Claim button writes admin_claimed_by + admin_mode; user-side chat shows "[Admin] is here →".',
        'Audit log entry on every claim, send, and release.',
      ]}
    />
  );
}
