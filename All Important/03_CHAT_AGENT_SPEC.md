# ACI WEBSITE - INTELLIGENT CHAT AGENT SPECIFICATION

## OVERVIEW

The chat agent is a **critical differentiator** for the ACI website. It's not a basic chatbot—it's an intelligent conversational assistant powered by Claude that can:
- Understand complex technical questions
- Recommend relevant case studies and services
- Qualify leads intelligently
- Book meetings with architects
- Provide genuine value to visitors

---

## CORE CAPABILITIES

### 1. Context-Aware Conversations

**The Agent Knows:**
- All ACI services (Data Engineering, AI/ML, Cloud, MarTech, Digital Transformation, Cyber Security)
- All platforms (Salesforce, Snowflake, Databricks, AWS, Azure, SAP, ServiceNow, Mulesoft, Adobe)
- All industries served (Banking, Healthcare, Retail, Manufacturing, etc.)
- All case studies (with challenges, solutions, results)
- Technology stack details
- Team capabilities and expertise

**The Agent Can:**
- Answer technical questions ("How do you implement Databricks Unity Catalog?")
- Explain service offerings ("What's included in your data engineering services?")
- Share relevant case studies ("Show me healthcare clients you've worked with")
- Recommend next steps ("Should I talk to someone about our data platform?")
- Understand context across multiple messages
- Handle ambiguous questions ("We need help with our data")

---

### 2. Lead Qualification (Smart, Not Pushy)

**Early in Conversation:**
- "I'm Claude, ACI's assistant. I can help you explore our work or connect you with an architect. What brings you here today?"

**Natural Information Gathering:**
- What industry? (understand context)
- What challenge? (qualify need)
- What timeline? (understand urgency)
- Who should we connect? (get contact info)

**No Aggressive Sales:**
- Don't push for contact info immediately
- Provide value first, capture lead naturally
- If visitor just wants info, give info
- Offer meeting booking only when appropriate

---

### 3. Resource Recommendations

**The Agent Can Suggest:**
- Relevant case studies ("Check out our RaceTrac case study—similar retail environment")
- Blog posts ("We wrote about this exact issue")
- Whitepapers ("Download our data governance whitepaper")
- Service pages ("Learn more about our MarTech practice")

**How It Works:**
- Vector search against case studies, blog posts
- Match visitor question to relevant content
- Present with brief context
- Track which resources visitor engaged with

---

### 4. Meeting Scheduling

**When Appropriate:**
- Visitor shows clear buying intent
- Question requires custom solution
- Visitor explicitly asks to talk to someone

**How It Works:**
- Agent: "Would you like to schedule a 30-minute call with one of our architects?"
- If yes: Embed Calendly widget directly in chat
- Or: "I can connect you with the right architect. What's your email?"
- Then: Hand off to contact form or calendar

**What Agent Communicates:**
- "Our architects are technical experts, not salespeople"
- "First call is usually 30 minutes, focused on your specific challenge"
- "No pressure, no obligation—just honest engineering advice"

---

## PERSONALITY & VOICE

### Core Personality Traits

**Technical but Approachable:**
- Can discuss Databricks architecture or data governance
- But explains simply when needed
- No jargon unless visitor uses it first

**Direct, Not Salesy:**
- Answers questions honestly
- Admits when ACI might not be the right fit
- Doesn't oversell or make unrealistic promises

**Helpful, Not Pushy:**
- Prioritizes answering visitor's question
- Offers meeting only when it makes sense
- Provides value even if visitor doesn't convert

---

### Sample Conversation Flows

**Flow 1: Technical Question**

**Visitor:** "Do you work with Databricks Unity Catalog?"

**Agent:** "Yes, we implement Unity Catalog for data governance in Databricks environments. We've deployed it for 40+ enterprise clients. It handles:
- Centralized access control
- Data lineage tracking
- Audit logging for compliance

Are you currently using Databricks, or planning a migration?"

**Visitor:** "Planning migration from on-prem Hadoop"

**Agent:** "Hadoop to Databricks is one of our most common projects. Typical timeline is 6-9 months for enterprise scale. Would you like to see a case study from a similar migration? Or I can connect you with one of our data architects to discuss your specific environment."

---

**Flow 2: Service Inquiry**

**Visitor:** "What's included in your data engineering services?"

**Agent:** "Our data engineering services cover:

**Platform Architecture:**
- Databricks lakehouse design
- Snowflake warehouse optimization
- AWS/Azure data services

**Pipeline Engineering:**
- Real-time streaming (Kafka, Kinesis)
- Batch ETL (Airflow, dbt)
- Data quality & observability

**Production Operations:**
- 24/7 monitoring
- SLA-backed uptime
- Incident response

We typically work with Fortune 500 companies on 6-12 month projects. What kind of data challenge are you facing?"

---

**Flow 3: Case Study Request**

**Visitor:** "Show me healthcare work"

**Agent:** "We've worked with several healthcare organizations on data platforms and compliance. Here are three relevant case studies:

**1. PDS (Healthcare Services):**
- Challenge: Global data fragmentation
- Solution: Unified enterprise data platform
- Result: Single source of truth for patient data

**2. Fortune 500 Healthcare Firm:**
- Challenge: Analytics for 10,000+ advisors
- Solution: Self-service analytics platform
- Result: Real-time insights across operations

Would you like more details on either of these? Or I can connect you with our healthcare practice lead."

---

**Flow 4: Qualification & Handoff**

**Visitor:** "We need help consolidating data after a merger"

**Agent:** "Post-merger data consolidation is one of our core competencies. We've done 20+ M&A integrations. Quick questions to connect you with the right architect:

- What industry? [Banking]
- How many systems to consolidate? [40+ systems]
- Timeline? [Next 12 months]

This sounds like a good fit for our senior data architects. Would you like to schedule a 30-minute technical call? They'll review your specific environment and share relevant experience from similar M&A projects."

**Visitor:** "Yes, let's schedule"

**Agent:** "Perfect. I'll need your email and name to send the calendar invite.

[Capture: name, email, company]

Great! Here's a link to book time with one of our architects: [Calendly embed]

You'll receive a confirmation email with:
- Meeting details
- Questionnaire (optional, helps us prepare)
- Direct contact for the architect"

---

## TECHNICAL IMPLEMENTATION

### Architecture

```
User Interface (Chat Widget)
    ↓
Next.js API Route (/api/chat)
    ↓
Anthropic Claude API (Sonnet 4)
    ↓
Vector Search (Supabase pgvector)
    ↓
Context Retrieval (Case Studies, Blog Posts)
    ↓
Response Generation
    ↓
Stream Response to User
```

---

### Claude API Integration

**System Prompt:**
```
You are an intelligent assistant for ACI Infotech, an enterprise technology consulting firm specializing in data engineering, AI/ML, and cloud modernization.

CORE KNOWLEDGE:
- ACI serves Fortune 500 companies
- 19 years experience, 80+ clients
- 1,250 technologists across 10 countries
- Senior architects (70% have 10+ years experience)
- Production-grade systems with SLAs

SERVICES:
1. Data Engineering (Databricks, Snowflake, AWS/Azure data services)
2. Applied AI & ML (GenAI, MLOps, production ML)
3. Cloud Modernization (AWS, Azure, GCP migrations)
4. MarTech & CDP (Salesforce, Adobe, customer data platforms)
5. Digital Transformation (ServiceNow, automation)
6. Cyber Security (DevSecOps, compliance)

PLATFORMS:
Salesforce, ServiceNow, Snowflake, SAP, Mulesoft, Adobe, AWS, Azure, Databricks, Dynatrace

YOUR PERSONALITY:
- Technical but approachable
- Direct, not salesy
- Helpful, not pushy
- Answer questions honestly
- Admit when ACI might not be right fit
- Focus on visitor's needs, not just lead capture

WHEN TO RECOMMEND MEETING:
- Visitor shows clear buying intent
- Question requires custom solution
- Visitor explicitly asks to talk to someone

NEVER:
- Discuss pricing or rates
- Make unrealistic promises
- Oversell capabilities
- Push aggressively for contact info
- Claim ACI is "the best" without proof

ALWAYS:
- Back claims with proof (case studies, technologies, outcomes)
- Be specific (name actual platforms, clients, metrics)
- Offer relevant case studies when appropriate
- Provide value even if visitor doesn't convert
```

**User Message Structure:**
```json
{
  "role": "user",
  "content": "Do you work with Snowflake?"
}
```

**Assistant Response Structure:**
```json
{
  "role": "assistant",
  "content": "Yes, we're Snowflake certified partners...",
  "suggested_actions": [
    "view_case_study_sodexo",
    "schedule_meeting",
    "learn_more_data_engineering"
  ]
}
```

---

### Context Retrieval System

**Vector Database (Supabase pgvector):**

**Tables:**
- `chat_knowledge_base` - Case studies, blog posts, service descriptions
  - id
  - content_type (case_study, blog_post, service, platform, industry)
  - title
  - summary
  - full_content
  - embedding (vector)
  - metadata (technologies, industry, outcomes)
  - url

**Embedding Generation:**
- Use Anthropic's embedding model or OpenAI embeddings
- Generate embeddings for all case studies, blog posts, services
- Store in pgvector column
- Update embeddings when content changes

**Search Flow:**
1. User asks question
2. Generate embedding for question
3. Vector similarity search in pgvector
4. Retrieve top 3-5 most relevant documents
5. Include in Claude context
6. Claude references specific case studies/resources in response

**Example Query:**
```sql
SELECT 
  id, 
  title, 
  summary, 
  url,
  1 - (embedding <=> $1) AS similarity
FROM chat_knowledge_base
WHERE content_type = ANY($2)
ORDER BY embedding <=> $1
LIMIT 5;
```

---

### Conversation Storage

**Table: chat_conversations**
```sql
CREATE TABLE chat_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT UNIQUE NOT NULL,
  visitor_email TEXT,
  visitor_name TEXT,
  visitor_company TEXT,
  messages JSONB NOT NULL DEFAULT '[]',
  context_documents JSONB DEFAULT '[]',
  lead_captured BOOLEAN DEFAULT FALSE,
  intent_category TEXT, -- exploring/qualifying/ready_to_talk
  recommended_actions JSONB DEFAULT '[]',
  started_at TIMESTAMP DEFAULT NOW(),
  last_message_at TIMESTAMP DEFAULT NOW(),
  ended_at TIMESTAMP,
  
  INDEX idx_session (session_id),
  INDEX idx_lead_captured (lead_captured),
  INDEX idx_last_message (last_message_at)
);
```

**Message Structure in JSONB:**
```json
{
  "messages": [
    {
      "id": "msg_1",
      "role": "assistant",
      "content": "Hi! I'm Claude, ACI's assistant...",
      "timestamp": "2025-01-07T10:00:00Z"
    },
    {
      "id": "msg_2",
      "role": "user",
      "content": "Do you work with Databricks?",
      "timestamp": "2025-01-07T10:01:00Z"
    },
    {
      "id": "msg_3",
      "role": "assistant",
      "content": "Yes, we're Databricks partners...",
      "timestamp": "2025-01-07T10:01:05Z",
      "referenced_documents": ["case_study_msci", "service_data_engineering"]
    }
  ],
  "context_documents": [
    {
      "type": "case_study",
      "id": "msci",
      "title": "MSCI: Scalable Data Automation",
      "relevance": 0.89
    }
  ]
}
```

---

### API Routes

**POST /api/chat/message**

**Request:**
```json
{
  "session_id": "sess_abc123",
  "message": "Do you work with Databricks?",
  "visitor_info": {
    "email": "user@company.com",  // Optional, captured later
    "name": "John Doe",           // Optional
    "company": "Acme Corp"        // Optional
  }
}
```

**Response (Streaming):**
```
data: {"type": "start"}
data: {"type": "token", "content": "Yes, "}
data: {"type": "token", "content": "we're "}
data: {"type": "token", "content": "Databricks "}
...
data: {"type": "end"}
data: {"type": "actions", "actions": ["view_case_study", "schedule_call"]}
```

**POST /api/chat/capture-lead**

**Request:**
```json
{
  "session_id": "sess_abc123",
  "email": "user@company.com",
  "name": "John Doe",
  "company": "Acme Corp"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Lead captured"
}
```

---

### Rate Limiting

**Strategy:**
- Max 50 messages per session
- Max 10 sessions per IP per hour
- Max 1000 API calls per day (to Claude API)
- Graceful degradation if limits hit

**Implementation:**
- Use Redis or Supabase for rate limit tracking
- Return helpful message if limited: "Chat temporarily unavailable. Email insights@aciinfotech.com"

---

## UI/UX SPECIFICATION

### Chat Widget (Collapsed State)

**Location:** Bottom-right corner of screen
**Size:** 60px x 60px circular button
**Color:** ACI brand blue
**Icon:** Chat bubble or message icon
**Badge:** Show unread count if assistant sent initial message

**Behavior:**
- Subtle pulse animation on first load (draw attention)
- Hover: Slight scale up
- Click: Expands to chat window

---

### Chat Window (Expanded State)

**Desktop:**
- Width: 400px
- Height: 600px (or 70% viewport height, whichever smaller)
- Position: Bottom-right, 20px from edges
- Shadow: Prominent but not excessive
- Border-radius: 16px (modern, friendly)

**Mobile:**
- Full screen overlay
- Height: 100vh
- Slide up from bottom animation
- Back button to close

**Layout:**
```
┌─────────────────────────────┐
│  Header                     │
│  [ACI Logo] Chat  [X]       │
├─────────────────────────────┤
│                             │
│  Message 1 (Assistant)      │
│                             │
│       Message 2 (User)      │
│                             │
│  Message 3 (Assistant)      │
│  [Suggested Action Btns]    │
│                             │
│                             │
│  ↓ Scroll for more          │
├─────────────────────────────┤
│  [Type a message...]  [Send]│
└─────────────────────────────┘
```

---

### Message Styling

**Assistant Messages:**
- Align: Left
- Background: Light gray (#F5F5F5)
- Text color: Dark gray (#333)
- Avatar: Small ACI logo or "A" icon
- Markdown support (bold, lists, links)

**User Messages:**
- Align: Right
- Background: ACI brand blue
- Text color: White
- No avatar

**Typing Indicator:**
- Three animated dots
- Shows while Claude is generating response
- "Claude is typing..."

---

### Suggested Actions (Buttons)

**When to Show:**
- After assistant message that suggests next steps
- Examples: "View Case Study", "Schedule Call", "Learn More"

**Styling:**
- Appear below assistant message
- Button style: Outlined, brand blue
- Max 3 buttons per message
- Click: Either open URL or trigger action

**Example:**
```
[View RaceTrac Case Study →]
[Schedule Architecture Call]
[Learn About Data Services]
```

---

### Special UI Elements

**Lead Capture Form (Inline):**
When agent asks for contact info, show inline form:
```
┌─────────────────────────────┐
│ Name:     [____________]    │
│ Email:    [____________]    │
│ Company:  [____________]    │
│           [Submit]          │
└─────────────────────────────┘
```

**Calendly Embed (Inline):**
When scheduling meeting, embed Calendly:
```
┌─────────────────────────────┐
│  [Calendly iframe]          │
│                             │
│  Or email insights@aci...   │
└─────────────────────────────┘
```

**Resource Cards:**
When sharing case study or blog post:
```
┌─────────────────────────────┐
│ 📄 MSCI Case Study          │
│                             │
│ $12M operational savings    │
│ Challenge: 40+ systems...   │
│                             │
│ [Read Full Story →]         │
└─────────────────────────────┘
```

---

### Header Actions

**In Chat Header:**
- **Close button (X):** Minimize chat (don't end session)
- **Minimize button (–):** Collapse to widget
- **Restart button (↻):** Start new conversation

**Menu (Optional):**
- "View transcript"
- "Email transcript to me"
- "Start new conversation"
- "Talk to a human"

---

## ADMIN FEATURES

### Chat Transcripts Dashboard

**Location:** `/admin/leads/chat-transcripts`

**What Admins See:**
- List of all conversations
- Session ID, start time, duration
- Visitor info (if captured): name, email, company
- Lead status: captured / not captured
- Intent category: exploring / qualifying / ready_to_talk
- Last message preview
- Referenced documents (which case studies shown)

**Actions:**
- View full transcript
- Export transcript (PDF or text)
- Mark as "followed up"
- Delete conversation

**Filters:**
- Date range
- Lead captured: Yes/No
- Intent category
- Referenced specific case study

---

### Transcript Detail View

**Shows:**
- Full conversation (all messages)
- Visitor information (if captured)
- Referenced documents (case studies, blog posts)
- Suggested actions that were shown
- Timestamps for each message
- Session metadata (IP, location, referrer)

**Actions:**
- Export as PDF
- Copy transcript
- Send to CRM (future feature)
- Mark conversation stage

---

## ANALYTICS & OPTIMIZATION

### Metrics to Track

**Conversation Metrics:**
- Total conversations started
- Average conversation length (messages)
- Average conversation duration (time)
- Completion rate (% that reached natural end)
- Abandonment rate (% that closed mid-conversation)

**Lead Metrics:**
- Lead capture rate (% conversations that captured email)
- Meeting booking rate (% that scheduled call)
- Resource engagement (% that clicked case study/blog)
- Intent distribution (exploring vs qualifying vs ready)

**Content Performance:**
- Which case studies mentioned most
- Which services discussed most
- Which platforms queried most
- Common questions/patterns

**Conversion Metrics:**
- Chat → Contact form submission
- Chat → Meeting scheduled
- Chat → Resource downloaded
- Chat → Email captured

---

### A/B Testing Opportunities

**Test Different:**
- Initial greeting messages
- Timing of lead capture ask
- Suggested action button copy
- Case study vs blog recommendations
- Meeting scheduling approach

**Measure:**
- Lead capture rate
- Meeting booking rate
- User satisfaction (thumbs up/down)

---

## EDGE CASES & ERROR HANDLING

### Common Edge Cases

**1. API Timeout or Failure**
- Show: "I'm having trouble right now. Can you try again in a moment?"
- Offer: "Or email insights@aciinfotech.com directly"
- Retry: Automatically retry once

**2. User Asks About Pricing**
- Response: "We don't publish rates because every project is unique. Projects typically range from $500K to $5M depending on scope, timeline, and complexity. The best way to understand cost is to talk with an architect about your specific needs. Would you like to schedule a call?"

**3. User Asks Something Completely Off-Topic**
- Response: "I'm specifically here to help with ACI's technology services (data engineering, AI/ML, cloud, MarTech, etc.). For other questions, you might want to check our general contact form."

**4. User Is Frustrated or Angry**
- Response: "I hear your frustration. Let me connect you directly with a human who can help. What's your email and I'll have someone reach out within 24 hours?"
- Escalate: Flag conversation for immediate review

**5. Rate Limit Hit**
- Show: "Our chat is experiencing high volume. Please try again in a few minutes or email insights@aciinfotech.com"

**6. Session Expires (After 30 Minutes Inactive)**
- Show: "Your session timed out. Would you like to continue our conversation?"
- Option: Restart or reload previous messages

---

### Fallback Strategies

**If Claude API Is Down:**
- Show simple contact form instead of chat
- Message: "Chat temporarily unavailable. How can we help?"
- Capture: name, email, message
- Auto-email to insights@aciinfotech.com

**If Vector Search Fails:**
- Continue conversation but without specific case study references
- Rely on Claude's training knowledge
- Gracefully degrade (still useful, just less specific)

**If Database Connection Lost:**
- Store messages in browser localStorage temporarily
- Attempt to save when connection restored
- Don't lose user's conversation

---

## PRIVACY & SECURITY

### Data Collection

**What We Collect:**
- Messages sent by user
- Messages generated by assistant
- Timestamp of each message
- Session ID (generated, not tied to user identity)
- Visitor info (only if voluntarily provided)
- Referenced documents (which case studies shown)
- Browser info (user agent, referrer)

**What We DON'T Collect:**
- Passwords
- Credit card info
- Social security numbers
- Detailed tracking across multiple sites

---

### Data Storage

**Retention:**
- Conversations stored for 12 months
- After 12 months: Delete or anonymize
- Captured leads stored permanently (for CRM)

**Security:**
- All data encrypted at rest (Supabase handles)
- All communication over HTTPS
- Admin access requires authentication
- Row Level Security on database

---

### Privacy Disclosure

**Show in Chat (First Message or Footer):**
"This chat is powered by Claude AI. Conversations are stored to improve our service. We don't share your data. See our [Privacy Policy]."

**User Rights:**
- Request transcript deletion
- Request data export
- Opt out of conversation storage (offer email instead)

---

## LAUNCH CHECKLIST

**Before Going Live:**

- [ ] Claude API integration tested (dev & prod keys)
- [ ] Vector search working (embeddings generated for all content)
- [ ] UI responsive on all devices (mobile, tablet, desktop)
- [ ] Rate limiting implemented and tested
- [ ] Error handling for all failure modes
- [ ] Admin dashboard functional
- [ ] Privacy disclosure visible
- [ ] Analytics tracking set up
- [ ] Load testing (50+ concurrent conversations)
- [ ] Accessibility audit (keyboard nav, screen readers)
- [ ] Content knowledge base populated (all case studies, blogs)
- [ ] Calendly integration working
- [ ] Email notifications set up (for lead capture)
- [ ] Fallback form ready (if chat fails)

---

## SUCCESS METRICS (First 90 Days)

**Targets:**
- 500+ conversations started
- 20%+ lead capture rate
- 5%+ meeting booking rate
- 30%+ resource engagement (clicked case study/blog)
- 4.0+ average satisfaction rating (thumbs up/down)
- <5% error rate (API failures, timeouts)

**If Metrics Lower:**
- Review conversation logs for patterns
- A/B test different approaches
- Refine system prompt
- Improve context retrieval
- Simplify lead capture flow

**If Metrics Higher:**
- Document what's working
- Expand knowledge base
- Add more suggested actions
- Consider multilingual support

---

**Last Updated:** January 2025
**Status:** Ready for Implementation
