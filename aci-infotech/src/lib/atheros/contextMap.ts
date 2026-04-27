/**
 * Atheros context manifest.
 *
 * One declarative file describing what Atheros should say in the
 * proactive nudge bubble for every page and section across the site.
 * The manifest is consulted in declaration order; the first entry
 * whose `match` resolves true wins, so order entries from MOST
 * SPECIFIC (route + section) to LEAST SPECIFIC (universal fallback).
 *
 * Voice rules (see CLAUDE.md):
 *   - Dry, specific, never "Hi I'm Atheros 👋".
 *   - Each line is a question that suggests Atheros has a useful
 *     next step in mind.
 *   - The seedPrompt is what the chat input is pre-filled with when
 *     the visitor clicks the bubble. It should be a natural sentence
 *     the visitor might type themselves, NOT a marketing line.
 */

export type RouteMatcher = string | RegExp;

export interface AtherosContextEntry {
  /** Where this context applies. */
  match: {
    /**
     * One or more route matchers. A string matches the path exactly.
     * A RegExp is tested against the path. Any match in the array is
     * sufficient.
     */
    route: RouteMatcher | RouteMatcher[];
    /**
     * Optional CSS selector identifying the homepage (or any page)
     * section that triggers this entry. When present, the entry is
     * only considered if that section is the most-visible one in the
     * viewport. Use `#playbooks`, `#case-studies`, etc.
     */
    section?: string;
  };
  /** The bubble copy. Plain English, one or two short sentences. */
  message: string;
  /**
   * Pre-filled chat input when the visitor clicks the bubble.
   * Defaults to the message itself if omitted.
   */
  seedPrompt?: string;
}

export const ATHEROS_CONTEXTS: AtherosContextEntry[] = [
  // ---------- Tier 1: section contexts on the new homepage ----------
  {
    match: { route: ['/', '/preview/home'], section: '#playbooks' },
    message: 'Want me to find the playbook that fits your stack?',
    seedPrompt:
      'I am looking for a playbook that fits my stack. Help me pick the right one.',
  },
  {
    match: { route: ['/', '/preview/home'], section: '#case-studies' },
    message: 'Want to talk to the team that built one of these?',
    seedPrompt:
      'I want to talk to the team behind one of these case studies.',
  },
  {
    match: { route: ['/', '/preview/home'], section: '#arqai' },
    message: 'Want a walkthrough of how ArqAI actually deploys?',
    seedPrompt: 'Walk me through how ArqAI deploys in an enterprise.',
  },

  // ---------- Tier 2: specific routes ----------
  // Case study + playbook detail pages (slug routes)
  {
    match: { route: /^\/case-studies\/[^/]+$/ },
    message: 'Want to talk to the architect on this engagement?',
    seedPrompt: 'I want to talk to the architect on this engagement.',
  },
  {
    match: { route: /^\/playbooks\/[^/]+$/ },
    message: 'Want this playbook adapted to your environment?',
    seedPrompt: 'Help me adapt this playbook to my environment.',
  },

  // Services index + detail
  {
    match: { route: '/services' },
    message: 'Want help picking the right service for your problem?',
    seedPrompt: 'Help me pick the right service for my problem.',
  },
  {
    match: { route: '/services/data-engineering' },
    message: 'Want a recommendation for your data stack?',
    seedPrompt: 'Recommend a data stack for my organization.',
  },
  {
    match: { route: '/services/applied-ai-ml' },
    message: 'Want to scope an AI use case before you brief the team?',
    seedPrompt: 'Help me scope an AI use case before I brief the team.',
  },
  {
    match: { route: '/services/cloud-modernization' },
    message: 'Want a quick read on your cloud migration risk?',
    seedPrompt: 'Help me read the risk on my cloud migration.',
  },
  {
    match: { route: '/services/cyber-security' },
    message: 'Want a posture review framed for executives?',
    seedPrompt: 'I want a security posture review framed for executives.',
  },
  {
    match: { route: '/services/quality-engineering' },
    message: 'Want a QE strategy for your release cadence?',
    seedPrompt: 'Help me build a quality engineering strategy for our release cadence.',
  },
  {
    match: { route: '/services/martech-cdp' },
    message: 'Want a CDP shortlist tailored to your data?',
    seedPrompt: 'Help me shortlist a CDP for our data.',
  },
  {
    match: { route: '/services/digital-transformation' },
    message: 'Want a phased plan for the rollout?',
    seedPrompt: 'Help me build a phased rollout plan.',
  },
  {
    match: { route: '/services/app-development' },
    message: 'Want me to scope your build before you call?',
    seedPrompt: 'Help me scope an application build.',
  },

  // Platforms index + detail
  {
    match: { route: '/platforms' },
    message: 'Want to know if a specific platform fits your environment?',
    seedPrompt: 'Tell me which platform fits my environment.',
  },
  {
    match: { route: '/platforms/databricks' },
    message: 'Want a Databricks fit check for your stack?',
    seedPrompt: 'Run a Databricks fit check for my stack.',
  },
  {
    match: { route: '/platforms/snowflake' },
    message: 'Want to compare Snowflake against your current warehouse?',
    seedPrompt: 'Compare Snowflake to my current warehouse.',
  },
  {
    match: { route: ['/platforms/aws', '/platforms/azure'] },
    message: 'Want a multi-cloud read on your environment?',
    seedPrompt: 'Give me a multi-cloud read on my environment.',
  },
  {
    match: { route: '/platforms/sap' },
    message: 'Want to scope an SAP modernization before you call?',
    seedPrompt: 'Help me scope an SAP modernization.',
  },
  {
    match: { route: '/platforms/salesforce' },
    message: 'Want a CRM-stack recommendation?',
    seedPrompt: 'Recommend a CRM stack for my organization.',
  },
  {
    match: { route: '/platforms/braze' },
    message: 'Want help wiring Braze to your data layer?',
    seedPrompt: 'Help me wire Braze to my data layer.',
  },
  {
    match: { route: '/platforms/servicenow' },
    message: 'Want help with a ServiceNow integration plan?',
    seedPrompt: 'Help me plan a ServiceNow integration.',
  },
  {
    match: { route: '/platforms/microsoft-dynamics' },
    message: 'Want a Dynamics fit check for your stack?',
    seedPrompt: 'Run a Microsoft Dynamics fit check for my stack.',
  },

  // Industries index + detail
  {
    match: { route: '/industries' },
    message: 'Want a case study from your industry?',
    seedPrompt: 'Show me a case study from my industry.',
  },
  {
    match: { route: '/industries/financial-services' },
    message:
      'Want to talk to the team that built our finance modernization stack?',
    seedPrompt:
      'I want to talk to the team that built the finance modernization stack.',
  },
  {
    match: { route: '/industries/healthcare' },
    message: 'Want HIPAA-grade architecture options for your data?',
    seedPrompt: 'Give me HIPAA-grade architecture options for our data.',
  },
  {
    match: { route: '/industries/retail' },
    message: 'Want a real-time data plan for multi-location retail?',
    seedPrompt:
      'Help me plan real-time data for our multi-location retail footprint.',
  },
  {
    match: { route: '/industries/hospitality' },
    message: 'Want a unified-operations plan across regions?',
    seedPrompt: 'Help me unify operations across regions.',
  },
  {
    match: { route: '/industries/manufacturing' },
    message: 'Want a predictive-maintenance scope for your lines?',
    seedPrompt: 'Help me scope predictive maintenance for our lines.',
  },
  {
    match: { route: '/industries/energy' },
    message: 'Want a real-time grid analytics scope?',
    seedPrompt: 'Help me scope real-time grid analytics.',
  },
  {
    match: { route: '/industries/transportation' },
    message: 'Want a logistics visibility plan?',
    seedPrompt: 'Help me build a logistics visibility plan.',
  },

  // Library / index pages
  {
    match: { route: '/playbooks' },
    message:
      'Tell me what you are building. I will find the playbook that fits.',
    seedPrompt: 'I am building something. Find the right playbook for me.',
  },
  {
    match: { route: '/case-studies' },
    message: 'Want to filter these by your industry?',
    seedPrompt: 'Filter case studies by my industry.',
  },
  { match: { route: '/whitepapers' },
    message: 'Want me to find the whitepaper that fits your problem?',
    seedPrompt: 'Find the whitepaper that fits my problem.',
  },
  {
    match: { route: '/blogs' },
    message: 'Want me to find posts on a specific topic?',
    seedPrompt: 'Find me posts on a specific topic.',
  },
  {
    match: { route: '/news' },
    message: 'Want me to find news on a specific topic?',
    seedPrompt: 'Find me news on a specific topic.',
  },
  {
    match: { route: /^\/blogs\/[^/]+$/ },
    message: 'Want me to find more posts on this topic?',
    seedPrompt: 'Find me more posts on this topic.',
  },

  // About / careers / contact
  {
    match: { route: '/contact' },
    message: 'Want me to brief the team before you call?',
    seedPrompt: 'Brief the team before I get on the call.',
  },
  {
    match: { route: '/careers' },
    message: 'Want to know what working here looks like?',
    seedPrompt: 'Tell me what working at ACI looks like.',
  },
  {
    match: { route: '/about' },
    message: 'Want to know who would be on your team?',
    seedPrompt: 'Tell me who would be on my engagement team.',
  },

  // ---------- Tier 4: universal fallback ----------
  {
    match: { route: /.*/ },
    message:
      'Tell me what you are working on. I will get you to the right answer.',
    seedPrompt: 'I am working on something. Help me figure out the next step.',
  },
];

/**
 * How long an entry's match holds before yielding to a sibling that
 * also matches. Used by the hook to debounce section-context swaps so
 * a fast scroll past three sections does not flicker the bubble copy.
 */
export const SECTION_DEBOUNCE_MS = 600;
