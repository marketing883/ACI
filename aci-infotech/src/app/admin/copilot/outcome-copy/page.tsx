import StubPage from '../_components/StubPage';

export default function AtherosOutcomeCopyStub() {
  return (
    <StubPage
      title="Outcome Copy Overrides"
      summary="Edit pill copy, peek narration, panel CTAs, and chip labels per route or persona without redeploying. Outcome Copy is the renamed CTO surface (renamed to avoid the C-suite acronym collision)."
      phase="Phase B"
      previewItems={[
        'CRUD over the outcome_copy_overrides table (already migrated this commit).',
        'Surface enum: idle / peek.proactive / peek.narration / panel.primary_oc / chip / welcome.',
        'Per-persona variants for cio / cdo / cto / ciso / ceo / cmo / any.',
        'Save-time voice lint: blocks "$" or "architect" or "!" or em-dash before write.',
        'Live preview against any route URL before saving.',
      ]}
    />
  );
}
