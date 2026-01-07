import { NextRequest, NextResponse } from 'next/server';

// ACI company context for the AI assistant
const ACI_CONTEXT = `You are the ACI Infotech AI assistant. ACI Infotech is a Fortune 500 technology consulting firm specializing in enterprise data, AI, and cloud solutions.

COMPANY OVERVIEW:
- Founded by experienced enterprise architects
- 80+ Fortune 500 and enterprise clients
- Over $500M in client value delivered
- 98% client retention rate
- Offices in Atlanta, New York, and global delivery centers

CORE SERVICES:

1. DATA ENGINEERING
- Modern data platforms with Databricks, Snowflake, dbt
- Real-time streaming with Kafka, Spark Streaming
- Data quality and governance frameworks
- Legacy system migrations
- Data mesh architecture implementation

2. APPLIED AI & ML
- MLOps and production ML deployment
- Predictive analytics and forecasting
- GenAI and LLM integration
- AI governance (ArqAI platform)
- Computer vision and NLP solutions

3. CLOUD MODERNIZATION
- Cloud migrations (AWS, Azure, GCP)
- Kubernetes and containerization
- Infrastructure as Code (Terraform)
- Cost optimization and FinOps
- Hybrid and multi-cloud architectures

4. MARTECH & CDP
- Customer Data Platforms (Segment, mParticle)
- Marketing automation (Braze, Salesforce Marketing Cloud)
- Real-time personalization
- Attribution and analytics
- Adobe and Salesforce implementations

5. DIGITAL TRANSFORMATION
- SAP S/4HANA implementations
- ServiceNow deployments
- Process automation with MuleSoft, Workato
- Enterprise integration
- Change management

6. CYBER SECURITY
- Zero trust architecture
- DevSecOps implementation
- SOC modernization
- Compliance (SOC 2, ISO 27001, HIPAA, PCI-DSS)
- Threat detection and response

KEY DIFFERENTIATORS:
- Senior architects only (10+ years experience minimum)
- Production code with SLAs, not just POCs
- 24/7 support - "we answer the 2am call"
- Business outcomes focused, not just technology delivery

NOTABLE CLIENTS & CASE STUDIES:
- MSCI: $12M savings from SAP S/4HANA consolidation
- RaceTrac: Real-time customer engagement across 600+ locations
- Sodexo: Unified global data platform for 400K+ employees
- Fortune 100 retailer: AI demand forecasting saving $18M annually

TECHNOLOGIES WE SPECIALIZE IN:
- Data: Databricks, Snowflake, dbt, Kafka, Spark, Informatica
- AI/ML: Python, TensorFlow, MLflow, LangChain, Azure ML
- Cloud: AWS, Azure, GCP, Kubernetes, Terraform
- MarTech: Salesforce, Braze, Adobe, Segment
- Enterprise: SAP, ServiceNow, MuleSoft

CONTACT INFORMATION:
- Website: aciinfotech.com
- Email: contact@aciinfotech.com
- Schedule a call: /contact?reason=architecture-call

Be helpful, professional, and conversational. If users ask about pricing, explain that engagements are customized and suggest scheduling an architecture call. For detailed technical questions beyond general capabilities, recommend connecting with our team.`;

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

// Simple keyword-based responses for demo (replace with actual AI API call in production)
function generateResponse(messages: ChatMessage[]): string {
  const lastMessage = messages[messages.length - 1]?.content.toLowerCase() || '';

  // Services overview
  if (lastMessage.includes('services') || lastMessage.includes('what do you do') || lastMessage.includes('what does aci')) {
    return `ACI Infotech offers six core services for enterprise clients:

1. **Data Engineering** - Modern data platforms with Databricks, Snowflake, and real-time streaming
2. **Applied AI & ML** - Production ML systems, GenAI integration, and our ArqAI governance platform
3. **Cloud Modernization** - Migrations to AWS/Azure/GCP, Kubernetes, and cost optimization
4. **MarTech & CDP** - Customer data platforms and marketing automation
5. **Digital Transformation** - SAP, ServiceNow, and process automation
6. **Cyber Security** - Zero trust architecture and compliance

We focus on Fortune 500 and enterprise clients, delivering production-grade solutions with SLAs. Would you like me to dive deeper into any of these areas?`;
  }

  // AI/ML specific
  if (lastMessage.includes('ai') || lastMessage.includes('ml') || lastMessage.includes('machine learning') || lastMessage.includes('artificial intelligence')) {
    return `Our Applied AI & ML practice helps enterprises deploy AI that delivers real business value:

**What We Build:**
- MLOps pipelines for production deployment
- Predictive analytics and demand forecasting
- GenAI and LLM integration for enterprise use cases
- Computer vision and NLP solutions

**ArqAI Platform:**
We've developed ArqAI, our enterprise AI governance platform that provides policy-as-code, model observability, and compliance reporting.

**Results:**
- Fortune 100 retailer: 23% reduction in stockouts, $18M annual savings from AI forecasting
- Financial services: $25M fraud loss reduction with ML detection

We focus on AI that actually ships to production, not just POC demos. Would you like to discuss a specific AI challenge?`;
  }

  // Data engineering
  if (lastMessage.includes('data') || lastMessage.includes('databricks') || lastMessage.includes('snowflake') || lastMessage.includes('pipeline')) {
    return `Our Data Engineering practice builds the foundation for enterprise analytics and AI:

**What We Build:**
- Lakehouse architectures with Databricks or Snowflake
- Real-time streaming with Kafka and Spark
- Data quality frameworks and governance
- Legacy system migrations to modern platforms
- Data mesh implementations

**Technologies:**
Databricks, Snowflake, dbt, Kafka, Spark, Informatica IICS, Azure Data Factory

**Results:**
- MSCI: Consolidated 40+ finance systems, $12M savings
- Sodexo: Unified data platform across 80+ countries

Would you like to discuss your data architecture challenges?`;
  }

  // Cloud
  if (lastMessage.includes('cloud') || lastMessage.includes('aws') || lastMessage.includes('azure') || lastMessage.includes('migration')) {
    return `Our Cloud Modernization practice helps enterprises migrate and optimize:

**What We Do:**
- Cloud migrations (AWS, Azure, GCP)
- Kubernetes and container orchestration
- Infrastructure as Code with Terraform
- Cost optimization and FinOps
- Hybrid and multi-cloud architectures

**Approach:**
We take a lift-and-shift or modernize approach based on your needs, always with zero-downtime migration strategies.

**Results:**
- Healthcare system: 40% cost reduction, 99.99% uptime post-migration
- Energy company: NERC CIP compliant zero-trust architecture

What's your current cloud situation?`;
  }

  // Industries
  if (lastMessage.includes('industr') || lastMessage.includes('clients') || lastMessage.includes('who do you work with')) {
    return `We serve Fortune 500 companies and enterprise clients across industries:

**Key Industries:**
- Financial Services (MSCI, major banks, insurance)
- Retail & Consumer (RaceTrac, Fortune 100 retailers)
- Healthcare (hospital systems, pharma)
- Hospitality (Sodexo, hotel chains)
- Manufacturing
- Energy & Utilities
- Transportation & Logistics

**Our Clients:**
80+ enterprise clients with 98% retention rate. We've delivered over $500M in documented client value.

Which industry are you in? I can share relevant case studies.`;
  }

  // Pricing
  if (lastMessage.includes('price') || lastMessage.includes('cost') || lastMessage.includes('how much') || lastMessage.includes('pricing')) {
    return `Our engagements are customized based on scope, complexity, and timeline. We offer:

**Engagement Models:**
- Fixed-scope projects with defined deliverables
- Managed services with SLAs
- Staff augmentation with senior architects
- Retainer-based advisory

**What's Included:**
- Senior architects only (10+ years experience)
- Production-ready code with documentation
- Knowledge transfer and training
- 24/7 support options

The best way to get a proposal is to schedule a 30-minute architecture call with our team. No sales pitch - just an honest assessment of your needs.

Would you like me to direct you to our contact page to schedule a call?`;
  }

  // Contact/Schedule
  if (lastMessage.includes('contact') || lastMessage.includes('schedule') || lastMessage.includes('talk to') || lastMessage.includes('call')) {
    return `I'd be happy to help you connect with our team!

**Schedule an Architecture Call:**
Visit [/contact?reason=architecture-call](/contact?reason=architecture-call) to book a 30-minute call with one of our senior architects.

**What to Expect:**
- No sales pitch - just an honest technical discussion
- We'll understand your challenges and goals
- You'll get initial recommendations and approach options
- Completely free and no obligation

**Other Options:**
- General inquiries: contact@aciinfotech.com
- Check out our case studies: [/case-studies](/case-studies)
- Read our blog: [/blog](/blog)

Is there anything specific you'd like me to help you prepare for the call?`;
  }

  // Hello/greeting
  if (lastMessage.includes('hello') || lastMessage.includes('hi') || lastMessage.includes('hey') || lastMessage.match(/^hi\b/) || lastMessage.match(/^hello\b/)) {
    return `Hello! Welcome to ACI Infotech. I'm here to help you learn about our enterprise technology services.

I can help you with:
- Understanding our services (Data, AI, Cloud, MarTech, Digital Transformation, Security)
- Learning about our client success stories
- Finding the right solution for your challenges
- Connecting you with our team

What would you like to know about?`;
  }

  // Thank you
  if (lastMessage.includes('thank')) {
    return `You're welcome! I'm glad I could help.

If you have more questions later, feel free to come back anytime. You can also:
- **Schedule a call** with our architects at [/contact](/contact)
- **Explore case studies** at [/case-studies](/case-studies)
- **Read our blog** for technical insights at [/blog](/blog)

Is there anything else I can help you with?`;
  }

  // Default response
  return `Thanks for your question! I can help you learn about ACI Infotech's services:

- **Data Engineering** - Databricks, Snowflake, real-time pipelines
- **AI & ML** - Production ML, GenAI, AI governance
- **Cloud** - AWS, Azure, GCP migrations and optimization
- **MarTech** - CDPs, personalization, marketing automation
- **Digital Transformation** - SAP, ServiceNow, process automation
- **Security** - Zero trust, compliance, DevSecOps

We work with Fortune 500 companies and have delivered over $500M in client value.

What specific area would you like to learn more about? Or if you'd prefer, I can connect you with our team for a more detailed conversation.`;
}

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid messages format' },
        { status: 400 }
      );
    }

    // In production, you would call Claude API here:
    // const response = await anthropic.messages.create({
    //   model: "claude-sonnet-4-20250514",
    //   max_tokens: 1024,
    //   system: ACI_CONTEXT,
    //   messages: messages
    // });

    // For demo, use keyword-based responses
    const response = generateResponse(messages);

    return NextResponse.json({ message: response });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    );
  }
}
