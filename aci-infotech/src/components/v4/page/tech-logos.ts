// Registry mapping technology and partner names, as they appear in
// offering chips, to a real logo asset. Icons under /brand/tech are
// extracted from the simple-icons set and tinted with each brand's own
// hex; wider lockups come from the existing /brand and Solution-Partners
// assets. Names without a sourceable mark (Adobe, Tableau, MuleSoft,
// CrowdStrike and the long tail of niche tools) stay text: an invented
// logo would be worse than none.

const T = '/brand/tech';

/** Exact-name matches first. */
const EXACT: Record<string, string> = {
  '.NET': `${T}/dotnet.svg`,
  Alation: '',
  Ansible: `${T}/ansible.svg`,
  Anthropic: `${T}/anthropic.svg`,
  'Apache Iceberg': '',
  ArgoCD: `${T}/argo.svg`,
  ArqAI: '/images/ArqAI-Logo-no-tagline.png',
  Backstage: `${T}/backstage.svg`,
  Braze: '/images/Solution-Partners/braze.png',
  'Braze Canvas': '/images/Solution-Partners/braze.png',
  Camunda: `${T}/camunda.svg`,
  Claude: `${T}/claude.svg`,
  'Custom agents': '',
  Cypress: `${T}/cypress.svg`,
  Datadog: `${T}/datadog.svg`,
  'Delta Lake': `${T}/databricks.svg`,
  Docker: `${T}/docker.svg`,
  Dynatrace: `${T}/dynatrace.svg`,
  FastAPI: `${T}/fastapi.svg`,
  Gatling: `${T}/gatling.svg`,
  GraphQL: `${T}/graphql.svg`,
  Grafana: `${T}/grafana.svg`,
  'Google Analytics 4': `${T}/googleanalytics.svg`,
  'Google Document AI': '/brand/googlecloud-color.svg',
  GCP: '/brand/googlecloud-color.svg',
  GKE: '/brand/googlecloud-color.svg',
  Hadoop: `${T}/apachehadoop.svg`,
  Istio: `${T}/istio.svg`,
  Jenkins: `${T}/jenkins.svg`,
  Jest: `${T}/jest.svg`,
  k6: `${T}/k6.svg`,
  Kafka: `${T}/apachekafka.svg`,
  Kubernetes: `${T}/kubernetes.svg`,
  LangChain: `${T}/langchain.svg`,
  Looker: `${T}/looker.svg`,
  'Next.js': `${T}/nextdotjs.svg`,
  'Node.js': `${T}/nodedotjs.svg`,
  Okta: `${T}/okta.svg`,
  'OWASP Tools': `${T}/owasp.svg`,
  'OWASP ZAP': `${T}/owasp.svg`,
  OpenShift: `${T}/redhatopenshift.svg`,
  PostgreSQL: `${T}/postgresql.svg`,
  Pulumi: `${T}/pulumi.svg`,
  Pytest: `${T}/pytest.svg`,
  Python: `${T}/python.svg`,
  Qualys: `${T}/qualys.svg`,
  React: `${T}/react.svg`,
  SAP: '/brand/sap-color.svg',
  Selenium: `${T}/selenium.svg`,
  ServiceNow: '/images/Solution-Partners/servicenow.png',
  Snyk: `${T}/snyk.svg`,
  SonarQube: `${T}/sonarqubeserver.svg`,
  Splunk: `${T}/splunk.svg`,
  'Spring Boot': `${T}/springboot.svg`,
  Teradata: `${T}/teradata.svg`,
  Terraform: `${T}/terraform.svg`,
  TypeScript: `${T}/typescript.svg`,
  'VMware Cloud': `${T}/vmware.svg`,
  dbt: '',
  'scikit-learn': `${T}/scikitlearn.svg`,
};

/** Family prefixes for suites where one mark covers every product. */
const PREFIXES: [string, string][] = [
  ['AWS', '/brand/aws-color.png'],
  ['Amazon', '/brand/aws-color.png'],
  ['EKS', '/brand/aws-color.png'],
  ['Kinesis', '/brand/aws-color.png'],
  ['SageMaker', '/brand/aws-color.png'],
  ['CloudFormation', '/brand/aws-color.png'],
  ['Spot Instances', '/brand/aws-color.png'],
  ['Azure', '/brand/azure-color.png'],
  ['AKS', '/brand/azure-color.png'],
  ['Power ', '/brand/microsoft-mono.svg'],
  ['Microsoft', '/brand/microsoft-mono.svg'],
  ['Salesforce', '/brand/salesforce-color.png'],
  ['Einstein', '/brand/salesforce-color.png'],
  ['Journey Builder', '/brand/salesforce-color.png'],
  ['Service Cloud', '/brand/salesforce-color.png'],
  ['Loyalty Management', '/brand/salesforce-color.png'],
  ['Databricks', `${T}/databricks.svg`],
  ['Snowflake', `${T}/snowflake.svg`],
  ['Snowpark', `${T}/snowflake.svg`],
  ['Unity Catalog', `${T}/databricks.svg`],
  ['MLflow', `${T}/mlflow.svg`],
  ['TensorFlow', `${T}/tensorflow.svg`],
  ['Spark', `${T}/apachespark.svg`],
  ['UiPath', `${T}/uipath.svg`],
  ['GitHub', `${T}/githubactions.svg`],
  ['GitLab', `${T}/gitlab.svg`],
  ['Playwright', ''],
];

/** Resolve a chip name to a logo asset, or undefined to render text only. */
export function techLogo(name: string): string | undefined {
  const exact = EXACT[name];
  if (exact !== undefined) return exact || undefined;
  for (const [prefix, src] of PREFIXES) {
    if (name.startsWith(prefix)) return src || undefined;
  }
  return undefined;
}
