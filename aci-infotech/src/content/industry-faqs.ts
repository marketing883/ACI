import type { FaqItem } from '@/components/seo/FaqBlock';

// Vertical FAQ sets: the pains, platforms, compliance, and timelines each
// industry's buyers actually ask about. Voice: plain, concrete, no fluff.

export const retailFaqs: FaqItem[] = [
  {
    q: 'What data problems do retailers usually come to you with?',
    a: 'Three, mostly: customer data scattered across POS, ecommerce, and loyalty; demand forecasts that miss; and personalization that cannot keep up in real time. We unify the customer record first, because everything downstream depends on it.',
  },
  {
    q: 'Which platforms do you use for retail data and martech?',
    a: 'Snowflake or Databricks for the data foundation, Salesforce and Braze for the customer and engagement layer. We integrate them so an action in one shows up in the others without waiting on a nightly batch.',
  },
  {
    q: 'How do you handle peak traffic like Black Friday?',
    a: 'Auto-scaling on the pipelines and warehouses, load-tested before the season, with cost guardrails so the bill does not balloon on a quiet Tuesday. We rehearse the spike rather than hope.',
  },
  {
    q: 'Can you actually improve demand forecasting?',
    a: 'Yes, and it usually pays for itself in inventory. We replace spreadsheet forecasts with models that read sales, promotions, and seasonality, and we measure the lift against what you do today before claiming anything.',
  },
  {
    q: 'How long until a retail data platform shows value?',
    a: 'A first governed customer view and a working use case in 8 to 12 weeks. We start with the use case that moves a number you care about, not a year-long platform build.',
  },
];

export const financialServicesFaqs: FaqItem[] = [
  {
    q: 'How do you handle compliance and audit in financial services?',
    a: 'Lineage, access control, and audit trails designed in from day one, mapped to the controls your regulators and internal audit expect. When examiners ask where a number came from, it should be a query, not a fire drill.',
  },
  {
    q: 'What projects do you most often run for banks and insurers?',
    a: 'Post-merger system consolidation, AI-ready data platforms, CRM and advisor productivity, and compliance-ready cloud migration. The thread through all of them is trustworthy data that survives an audit.',
  },
  {
    q: 'Can you modernize without disrupting regulated workloads?',
    a: 'Yes. Parallel run, phased cutover, and reconciliation against the source until the numbers match. We do not cut over a reporting system on faith.',
  },
  {
    q: 'How do you approach AI in a regulated firm?',
    a: 'Governed data, a model registry, evaluation, and human review where the stakes need it. Explainability is not optional here, so we build it in rather than bolt it on.',
  },
  {
    q: 'What about data residency and security?',
    a: 'Encryption, least-privilege access, and residency controls per jurisdiction baked into the landing zone. The security review should be a checkbox you already passed, not a surprise at the end.',
  },
];

export const manufacturingFaqs: FaqItem[] = [
  {
    q: 'What manufacturing problems do you typically solve?',
    a: 'Supply-chain visibility, predictive maintenance, quality analytics, and pulling SAP and shop-floor data into one place you can report on. The common complaint is data trapped in systems that do not talk.',
  },
  {
    q: 'Do you work with IoT and shop-floor data?',
    a: 'Yes. We bring sensor and machine data together with ERP and quality systems so you can see the whole line, not one slice. Real-time where it earns its keep, batch where it does not.',
  },
  {
    q: 'Can you reduce unplanned downtime?',
    a: 'Predictive maintenance models that read sensor and maintenance history flag failures before they stop the line. We measure the downtime avoided against your baseline, not against a brochure.',
  },
  {
    q: 'How do you integrate SAP with everything else?',
    a: 'We move SAP data into a governed platform alongside MES, quality, and logistics, with the lineage to trace any number back to source. SAP stays the system of record; the platform makes its data usable.',
  },
  {
    q: 'How long does a manufacturing data project take?',
    a: 'A first governed use case, like supply-chain visibility or downtime prediction, in 10 to 14 weeks. We prove it on one line or plant before rolling it across the network.',
  },
];

export const healthcareFaqs: FaqItem[] = [
  {
    q: 'How do you handle HIPAA and HITRUST compliance?',
    a: 'Controls designed in from day one: encryption, least-privilege access, BAAs, and audit logging mapped to HIPAA and the HITRUST CSF. When an assessor asks who touched a record and when, the answer is a query, not a week of meetings.',
  },
  {
    q: 'Can you integrate EHR data through FHIR?',
    a: 'Yes. We integrate Epic, Cerner, and other EHRs through FHIR APIs and HL7 feeds into one governed platform, so clinical, claims, and operational data share a single patient view instead of twelve.',
  },
  {
    q: 'How long does a claims analytics project take?',
    a: 'A governed claims dataset and a first working use case, like denial analysis, in 10 to 14 weeks. We start with the number the revenue cycle team already argues about, then expand from there.',
  },
  {
    q: 'How do you govern AI on clinical data?',
    a: 'De-identification where it belongs, a model registry, documented evaluation, and human review for anything that touches a care decision. If a model cannot explain itself to a clinician, it does not ship.',
  },
  {
    q: 'Which healthcare metrics can this actually move?',
    a: 'The ones you already report: readmission rates, HEDIS measures, denial rates, days in A/R. We pick one per phase and measure against your baseline, not an industry brochure.',
  },
];

export const energyFaqs: FaqItem[] = [
  {
    q: 'Can you help with NERC CIP compliance?',
    a: 'Yes. We build the security controls, evidence collection, and monitoring that NERC CIP audits look for, automated where it spares your team screenshot season. FERC and state regulators read the same evidence.',
  },
  {
    q: 'How do you approach OT/IT convergence securely?',
    a: 'Segmented networks, one-way data flows where the risk warrants them, and controls aligned to IEC 62443, so grid and plant data reach analysts without opening a path back into control systems.',
  },
  {
    q: 'What do you build for grid and asset analytics?',
    a: 'Platforms that pull SCADA, meter, and asset data together for outage prediction, load forecasting, and maintenance planning. Operators see the grid as it is right now, not as last night\'s batch left it.',
  },
  {
    q: 'Do you support renewable integration?',
    a: 'Yes. Solar and wind forecasting, storage optimization, and the balancing analytics that keep intermittent generation from becoming an operations problem. It is a data problem before it is a turbine problem.',
  },
  {
    q: 'Do you work with our existing historians and SCADA vendors?',
    a: 'We integrate what you already run, historians like PI, SCADA, and your EMS, rather than proposing a rip and replace. Utilities do not get maintenance windows for science projects.',
  },
];

export const hospitalityFaqs: FaqItem[] = [
  {
    q: 'Can you unify guest data across properties and franchises?',
    a: 'Yes. We build one guest profile across properties, brands, and franchisees, with identity resolution that survives a loyalty number typed wrong at the front desk. That single record is what personalization actually runs on.',
  },
  {
    q: 'Do you integrate POS and PMS systems?',
    a: 'Both sides of the house: PMS platforms like Opera and POS systems like Toast, plus booking and loyalty channels, feeding one governed platform instead of a folder of nightly exports.',
  },
  {
    q: 'How does loyalty personalization get better?',
    a: 'Offers and journeys read the unified guest record, so a guest who checked out this morning is not greeted like a stranger by tomorrow\'s email. We measure lift against your current program before claiming anything.',
  },
  {
    q: 'How do you handle GDPR and CCPA for guest data?',
    a: 'Consent tracking, retention rules, and deletion workflows built into the platform, so a subject access request is a routine job instead of a scramble across ten systems.',
  },
  {
    q: 'What results should a hotel or restaurant group expect?',
    a: 'Movement in the numbers you already run the business on: RevPAR, direct booking share, waste, labor cost. We baseline first, pick one metric per phase, and report against it.',
  },
];

export const transportationFaqs: FaqItem[] = [
  {
    q: 'Can you integrate TMS, telematics, and EDI data?',
    a: 'Yes. We wire TMS, telematics, and EDI partner feeds into one governed platform, so dispatch, maintenance, and customer service work from the same numbers instead of three versions of the truth.',
  },
  {
    q: 'What do you do with ELD and FMCSA data?',
    a: 'More than store it for the audit. ELD hours-of-service data feeds planning, so loads are assigned to drivers who can legally run them, and the records are ready when FMCSA asks. Same data, twice the use.',
  },
  {
    q: 'How does route optimization actually work?',
    a: 'Models read orders, traffic, hours of service, and fuel data to plan and re-plan routes through the day. We measure fuel, miles, and on-time performance against your current planning, not a vendor benchmark.',
  },
  {
    q: 'Can you improve our OTIF performance?',
    a: 'Yes. OTIF failures usually trace to visibility gaps between order, warehouse, and transit systems. We connect them so exceptions surface while there is still time to act, before the chargeback letter arrives.',
  },
  {
    q: 'How long until a logistics data platform shows value?',
    a: 'A unified operational view and one working use case, like ETA accuracy or empty-mile reduction, in 10 to 14 weeks. We prove it on one lane or region before scaling to the network.',
  },
];

export const oilGasFaqs: FaqItem[] = [
  {
    q: 'Where does ACI help across the oil and gas value chain?',
    a: 'Upstream, midstream, and downstream: production and drilling analytics, pipeline and asset monitoring, and refinery and trading data. The shared problem is decades of data in systems that were never meant to talk to each other.',
  },
  {
    q: 'Can you bring SCADA and historian data into a modern platform?',
    a: 'Yes. We integrate SCADA, historians like PI, and ERP into a governed cloud platform so engineers and analysts work from one source instead of exporting CSVs. Real-time where operations need it.',
  },
  {
    q: 'How do you handle predictive maintenance for field assets?',
    a: 'Models that read sensor, historian, and maintenance data flag equipment issues before they become failures or safety incidents. In this industry a missed failure is rarely just downtime, so the bar for reliability is high.',
  },
  {
    q: 'What about HSE, emissions, and regulatory reporting?',
    a: 'We build the data foundation for emissions tracking and regulatory reporting with the lineage to back every figure. When a regulator or auditor asks, the numbers should hold up.',
  },
  {
    q: 'Do you support energy transition and ESG data needs?',
    a: 'Yes. The same governed platform that runs production analytics can carry emissions, ESG, and energy-transition reporting, so sustainability data is as trustworthy as financial data, not a separate spreadsheet exercise.',
  },
];
