#!/usr/bin/env tsx
/**
 * Round-trip test for the registration recovery parser.
 *
 * Renders the REAL notification email by calling sendEventLeadNotificationEmail
 * with a stubbed fetch, then parses the captured HTML back through
 * parseEventLeadEmail() and checks every field survived. Stubbing fetch rather
 * than copying the template is the point: if src/lib/email.ts changes shape,
 * this fails instead of the backfill silently recovering blanks.
 *
 * Usage:
 *   cd aci-infotech
 *   npx tsx scripts/test-event-leads-email-parse.ts
 */
process.env.RESEND_API_KEY = process.env.RESEND_API_KEY || 're_test_key_not_used';

let failures = 0;
function check(name: string, cond: boolean, extra?: unknown) {
  if (cond) {
    console.log(`  PASS  ${name}`);
  } else {
    failures++;
    console.log(`  FAIL  ${name}`, extra ?? '');
  }
}

// Capture the payload Resend would have been sent, and answer as Resend does.
let captured: { subject?: string; html?: string } = {};
const realFetch = globalThis.fetch;
globalThis.fetch = (async (url: string | URL | Request, init?: RequestInit) => {
  const href = String(url instanceof Request ? url.url : url);
  if (href.includes('resend.com')) {
    captured = JSON.parse(String(init?.body ?? '{}'));
    return new Response(JSON.stringify({ id: 'email-abc' }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  }
  return realFetch(url as string, init);
}) as typeof fetch;

async function main() {
  const { sendEventLeadNotificationEmail } = await import('../src/lib/email');
  const { parseEventLeadEmail, REGISTRATION_SUBJECT_PREFIX } = await import(
    '../src/lib/event-leads-email-parse'
  );

  // Awkward on purpose: an ampersand and quotes to exercise the unescaping, a
  // "Something else" free-text answer, and one discovery question left blank
  // so the block is not the full four.
  const lead = {
    fullName: 'Ananya Rao',
    email: 'Ananya.Rao@FinTechBank.com',
    phone: '+91 98765 43210',
    companyName: 'Ranbaxy & Co "APAC"',
    jobTitle: 'CISO',
    painPoints: ['Cybersecurity and digital trust', 'AI risk and compliance', 'Something else'],
    painPointOther: 'Board wants an audit trail we cannot produce',
    journeyStage: 'scaling',
    teamChallenges: 'Too few engineers, too many dashboards',
    reportingChallenges: '',
    aiMlExploration: 'Fraud detection & KYC triage',
    aiAdoptionChallenge: 'Data quality, mostly',
    wantsExpertMeeting: true,
    eventName: 'National Digital Trust Summit, AION 2026',
    utmSource: 'linkedin',
    utmCampaign: 'aion-2026',
  };

  await sendEventLeadNotificationEmail(lead);

  console.log('1. Email captured:');
  check('subject matches the prefix the backfill filters on',
    Boolean(captured.subject?.startsWith(REGISTRATION_SUBJECT_PREFIX)), captured.subject);
  check('html body captured', Boolean(captured.html));
  if (!captured.html) {
    console.log('\nNo HTML captured - cannot continue.');
    process.exit(1);
  }

  const parsed = parseEventLeadEmail(captured.html);
  console.log('2. Round-trip:');
  if (!parsed) {
    check('parsed', false, 'parseEventLeadEmail returned null');
    process.exit(1);
  }

  check('full_name', parsed.full_name === lead.fullName, parsed.full_name);
  check('email lowercased', parsed.email === 'ananya.rao@fintechbank.com', parsed.email);
  check('phone', parsed.phone === lead.phone, parsed.phone);
  check('company_name unescaped (& and quotes)',
    parsed.company_name === 'Ranbaxy & Co "APAC"', parsed.company_name);
  check('job_title', parsed.job_title === lead.jobTitle, parsed.job_title);
  check('pain_points', JSON.stringify(parsed.pain_points) === JSON.stringify(lead.painPoints),
    parsed.pain_points);
  check('pain_point_other', parsed.pain_point_other === lead.painPointOther, parsed.pain_point_other);
  check('journey_stage', parsed.journey_stage === 'scaling', parsed.journey_stage);
  check('wants_expert_meeting', parsed.wants_expert_meeting === true, parsed.wants_expert_meeting);
  check('team_challenges', parsed.team_challenges === lead.teamChallenges, parsed.team_challenges);
  check('reporting_challenges stays null when unanswered',
    parsed.reporting_challenges === null, parsed.reporting_challenges);
  check('ai_ml_exploration unescaped',
    parsed.ai_ml_exploration === 'Fraud detection & KYC triage', parsed.ai_ml_exploration);
  check('ai_adoption_challenge', parsed.ai_adoption_challenge === lead.aiAdoptionChallenge,
    parsed.ai_adoption_challenge);
  check('utm_source', parsed.utm_source === 'linkedin', parsed.utm_source);
  check('utm_campaign', parsed.utm_campaign === 'aion-2026', parsed.utm_campaign);

  // A blank answer must not shift the next answer into the wrong column.
  check('no answer landed in the wrong discovery column',
    parsed.team_challenges !== parsed.ai_ml_exploration);

  // Minimal registration: no phone, no other, no discovery, no UTM.
  captured = {};
  await sendEventLeadNotificationEmail({
    fullName: 'Vikram Shah',
    email: 'vikram@retailco.in',
    companyName: 'RetailCo',
    jobTitle: 'VP Engineering',
    painPoints: ['Scaling AI beyond pilots'],
    journeyStage: 'piloting',
    wantsExpertMeeting: false,
    eventName: 'National Digital Trust Summit, AION 2026',
  });
  const minimal = parseEventLeadEmail(captured.html!);
  console.log('3. Minimal registration:');
  check('parsed', minimal !== null);
  check('phone null when Not provided', minimal?.phone === null, minimal?.phone);
  check('wants_expert_meeting false', minimal?.wants_expert_meeting === false);
  check('no discovery answers invented', minimal?.team_challenges === null && minimal?.ai_ml_exploration === null);
  check('no utm invented', minimal?.utm_source === null && minimal?.utm_campaign === null);
  check('pain_points still read', JSON.stringify(minimal?.pain_points) === JSON.stringify(['Scaling AI beyond pilots']));

  console.log('4. Junk input:');
  check('unrelated html returns null', parseEventLeadEmail('<p>hello</p>') === null);

  console.log(failures === 0 ? '\nAll checks passed.' : `\n${failures} check(s) FAILED.`);
  process.exit(failures === 0 ? 0 : 1);
}

main();
