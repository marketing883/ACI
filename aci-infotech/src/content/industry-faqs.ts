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
