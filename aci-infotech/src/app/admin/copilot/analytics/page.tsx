import StubPage from '../_components/StubPage';

export default function AtherosAnalyticsStub() {
  return (
    <StubPage
      title="Atheros Analytics"
      summary="Sessions, qualified leads, handoffs, average turns, average cost / session, average first-token latency, conversion. Plus the Content Gap feed: questions where retrieval similarity was low or the model answered generically."
      phase="Phase C"
      previewItems={[
        'Top cards: sessions today, qualified leads, handoffs, avg turns, avg cost, p95 first-token latency, conversion.',
        'Charts: top pages, top tools called, top cited sources, top auto-nav destinations, throttle-drops.',
        'Content Gap feed: low-similarity queries with one-click "Draft a content brief".',
        'Cost dashboard: $/day, $/session, $/lead, hour-of-day heatmap.',
        'Role breakdown of qualified leads (CIO / CDO / CTO / CISO / CEO / CMO).',
      ]}
    />
  );
}
