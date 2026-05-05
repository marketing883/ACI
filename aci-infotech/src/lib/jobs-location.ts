// Format the structured location columns (city, state_region, country)
// into the single denormalized `location` string that every display
// surface still reads. Empty/whitespace components are skipped so the
// output never contains stray commas like "Atlanta, , USA".
//
// Returns the trimmed legacy value when no structured component is
// present — this keeps existing rows readable on the public site
// until an admin edits them and supplies the structured fields.
export function formatJobLocation(parts: {
  city?: string | null;
  state_region?: string | null;
  country?: string | null;
  legacy?: string | null;
}): string {
  const components = [parts.city, parts.state_region, parts.country]
    .map((p) => (typeof p === 'string' ? p.trim() : ''))
    .filter((p) => p.length > 0);
  if (components.length > 0) return components.join(', ');
  return (parts.legacy ?? '').trim();
}
