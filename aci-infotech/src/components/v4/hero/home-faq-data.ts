/**
 * Homepage FAQ — single source for both the visible accordion
 * (HomeFaq.tsx) and the FAQPage JSON-LD in src/app/page.tsx, so the
 * markup and the schema can never drift apart. Answers are written to
 * stand alone when quoted by a search or answer engine: plain
 * sentences, entities named in full.
 */

export type HomeFaqItem = { question: string; answer: string };

export const HOME_FAQ: HomeFaqItem[] = [
  {
    question: 'What does ACI Infotech do?',
    answer:
      'ACI Infotech is an enterprise engineering firm. We build the data foundation, put AI on top of it, and run both in production. That covers data engineering and lakehouse platforms, applied AI and GenAI, cloud modernization, and 24/7 managed operations with SRE.',
  },
  {
    question: 'Which platforms does ACI Infotech work with?',
    answer:
      'Databricks, Snowflake, Microsoft Azure, AWS, Google Cloud, SAP, ServiceNow, Salesforce, and Braze. For AI delivery we also work with frontier model providers and tooling such as Anthropic, OpenAI, and LangGraph.',
  },
  {
    question: 'Which industries does ACI Infotech serve?',
    answer:
      'Financial services, healthcare, retail and consumer, hospitality, manufacturing, energy and utilities, and transportation. Most engagements are with large enterprises that need regulated, production-grade systems.',
  },
  {
    question: 'What is ArqAI Labs?',
    answer:
      'ArqAI is our strategic AI engineering partner, and ArqAI Labs is the forward-deployed practice we run together. Engineers embed inside the problem and ship with accelerators built from years of delivery work. It lives at thearq.ai.',
  },
  {
    question: 'What is ACI Interactive?',
    answer:
      'ACI Interactive is our specialized division for marketing, MarTech, and CDP services. It brings strategy, customer data platforms, and journey orchestration under one roof, with new products planned under the same name.',
  },
  {
    question: 'How does an engagement start?',
    answer:
      'Start with a conversation at aciinfotech.com/contact. Advisory engagements produce a written plan within 48 hours, and a build pod can be shipping within two weeks. Many projects start from one of our documented playbooks, so the first mile is already mapped.',
  },
];
