import type { FaqItem } from '@/components/seo/FaqBlock';

// Buyer-question FAQ sets for the flagship platform and service pages.
// Each answers what the page is, how long it takes, what drives cost, and
// where the risk sits, so the pages cover the adjacent questions buyers
// and AI answer engines actually ask. Voice: plain, concrete, no fluff.

export const snowflakeFaqs: FaqItem[] = [
  {
    q: 'How long does a Snowflake migration take?',
    a: 'Most enterprise migrations run 3 to 6 months from kickoff to cutover, and a single-source warehouse swap can land in weeks. The long pole is rarely Snowflake itself; it is untangling the pipelines and reports that grew around the old system. We run old and new in parallel until the numbers match, then cut over.',
  },
  {
    q: 'What actually drives the cost of running Snowflake?',
    a: 'Compute, not storage. Snowflake bills per second of warehouse runtime, so cost comes from how queries are written and how warehouses are sized and suspended. We set resource monitors, auto-suspend, and right-sized warehouses on day one, and most teams watch the bill drop once we tune the heavy queries.',
  },
  {
    q: 'Do we have to move everything at once?',
    a: 'No. We migrate by domain, usually starting with the workloads that cost the most to run or hurt the most today. Each domain gets validated against the source before anyone trusts it. Big-bang cutovers are how you end up reconciling numbers at 2am.',
  },
  {
    q: 'How do you keep data governed in Snowflake?',
    a: 'Role-based access, row and column security, masking policies for PII, and object tagging for lineage and cost attribution. We wire this in as we migrate, not as a cleanup project afterward.',
  },
  {
    q: 'What do you need from our team?',
    a: 'A data owner who can settle what the numbers should be, and access to the source systems. We bring the architects and engineers. The work that stalls migrations is usually decisions, not code.',
  },
];

export const databricksFaqs: FaqItem[] = [
  {
    q: 'When is Databricks the right call over a data warehouse?',
    a: 'When the same data has to serve BI, streaming, and ML without keeping three copies of it. The lakehouse holds one governed source for all three. If your work is purely SQL reporting, a warehouse may be simpler, and we will say so.',
  },
  {
    q: 'How long to stand up a production lakehouse?',
    a: 'A governed Bronze, Silver, and Gold platform with Unity Catalog usually reaches its first production workload in 8 to 14 weeks. We do not hand over a notebook and call it a platform.',
  },
  {
    q: 'What does Unity Catalog actually buy us?',
    a: 'One place for access control, lineage, and discovery across every workspace and cloud. Without it, governance drifts per team and you find out at audit time. With it, who-touched-what is a query, not an investigation.',
  },
  {
    q: 'How do you control Databricks cost?',
    a: 'Job clusters over all-purpose clusters, autoscaling with sane floors and ceilings, spot instances where it is safe, and Photon for the heavy SQL. We tag clusters so cost maps back to teams and you can see what each pipeline really costs to run.',
  },
  {
    q: 'Can you take models to production, not just pilots?',
    a: 'That is the point. MLflow for tracking and registry, evaluation gates before anything ships, and monitoring after. A model nobody can retrain or roll back is a liability, not a feature.',
  },
];

export const servicenowFaqs: FaqItem[] = [
  {
    q: 'Which ServiceNow modules do you implement?',
    a: 'ITSM, ITOM, and the workflows around them: incident, problem, change, CMDB, discovery, and service catalog. We also build custom workflows where the out-of-box process does not fit how you actually work.',
  },
  {
    q: 'How long does a ServiceNow implementation take?',
    a: 'A focused ITSM rollout is typically 10 to 16 weeks. The variable is process, not configuration. The cleaner your decisions about how change and incident should flow, the faster it ships.',
  },
  {
    q: 'Will you keep the CMDB accurate?',
    a: 'Discovery plus governance. An auto-populated CMDB with no ownership rots within a quarter. We set discovery schedules, reconciliation rules, and clear ownership so the CMDB stays trustworthy enough to drive change and impact analysis.',
  },
  {
    q: 'Do you offer managed ServiceNow support after go-live?',
    a: 'Yes: upgrades, new workflows, and run support under an SLA. ServiceNow ships two major releases a year, and staying current is a standing job, not a one-time project.',
  },
  {
    q: 'How do you avoid over-customizing the platform?',
    a: 'Configure first, customize only where it earns its keep. Every customization is something you maintain through every future upgrade. We keep the platform close to standard so upgrades stay boring, which is the goal.',
  },
];

export const dataEngineeringFaqs: FaqItem[] = [
  {
    q: 'What is enterprise data engineering?',
    a: 'Building the pipelines, storage, and governance that turn scattered source data into something analytics and AI can use. In practice that is ingestion, a governed lakehouse or warehouse, quality checks, and the lineage to prove where every number came from.',
  },
  {
    q: 'How long before we see working pipelines?',
    a: 'First governed pipelines in production usually within 6 to 10 weeks. We work domain by domain so you get value early instead of waiting a year for a platform reveal.',
  },
  {
    q: 'How do you handle data quality?',
    a: 'Quality gates in the pipeline, not a dashboard you check after the fact. Tests run on every load, bad records get quarantined, and owners get told. The goal is that the people using the data stop re-checking it in spreadsheets.',
  },
  {
    q: 'Should we build on Snowflake or Databricks?',
    a: 'Whichever fits your workloads, and sometimes both. Snowflake is excellent for governed SQL analytics; Databricks earns its place when streaming and ML share the same data. We partner with both and have no reason to push one.',
  },
  {
    q: 'What makes a data platform AI-ready?',
    a: 'Clean, governed, well-described data with lineage, plus a feature layer models can reuse. Most failed AI pilots are not model problems. They are data problems wearing a model costume.',
  },
];

export const appliedAiFaqs: FaqItem[] = [
  {
    q: 'What does a production GenAI implementation require?',
    a: 'More than a prompt and an API key. You need governed data for retrieval, a RAG or agent design that fits the use case, evaluation before launch, guardrails, and monitoring after. The model is the easy part.',
  },
  {
    q: 'How do you pick the first AI use case?',
    a: 'We look for a job with clear value, available data, and room to be wrong sometimes. Chasing the flashiest use case first is how pilots die. We would rather ship one that pays for itself and earns the next one.',
  },
  {
    q: 'How long from idea to production AI?',
    a: 'A scoped use case with data in reasonable shape reaches production in 8 to 14 weeks. If the data is not ready, that comes first, and we will tell you plainly rather than paper over it.',
  },
  {
    q: 'How do you keep models from drifting or misbehaving?',
    a: 'Evaluation gates before launch, then monitoring for drift, cost, and quality after, with a human in the loop where the stakes need it. A model nobody is watching is a model nobody should trust.',
  },
  {
    q: 'Who owns model risk and governance?',
    a: 'We build it in: model registry, versioning, audit trails, and policy checks. Regulated buyers have to show their work, and bolting governance on after the fact never goes well.',
  },
];

export const cloudModernizationFaqs: FaqItem[] = [
  {
    q: 'How do you decide what to migrate, and how?',
    a: 'The 6R framework: rehost, replatform, refactor, repurchase, retire, retain. Not everything should move, and not everything should be rewritten. We sort the estate first so spend goes where it returns something.',
  },
  {
    q: 'How do you keep cloud cost from spiraling?',
    a: 'FinOps from day one: tagging, budgets, right-sizing, and committed-use discounts where usage is steady. Most cloud overspend is not the cloud being expensive. It is workloads nobody turned off.',
  },
  {
    q: 'How long does a cloud modernization program take?',
    a: 'A landing zone and first workloads land in 8 to 12 weeks. A full estate move is a phased program measured in quarters, run wave by wave so the business never waits on a big bang.',
  },
  {
    q: 'How do you migrate without downtime?',
    a: 'Parallel run and phased cutover. The new environment runs alongside the old until it is proven, then traffic shifts. We rehearse the cutover before we do it for real.',
  },
  {
    q: 'What about security and compliance in the cloud?',
    a: 'A landing zone with guardrails, least-privilege access, encryption, and the controls your auditors expect, mapped in from the start. Security designed in is cheaper than security retrofitted, every time.',
  },
];
