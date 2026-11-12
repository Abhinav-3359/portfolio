// All portfolio content lives here. Edit this file to update the site.

export const profile = {
  name: "Abhinav Anand",
  role: "Senior Software Engineer",
  company: "InfoEdge (Naukri)",
  location: "Noida, India",
  email: "abhinavanand031@gmail.com",
  github: "https://github.com/Abhinav-3359",
  linkedin: "https://www.linkedin.com/in/abhinav-anand-324b13223/",
  resume: "/Abhinav_Anand_Resume.pdf",
  headline: "I build the backend systems behind GenAI products.",
  intro:
    "Senior Software Engineer at InfoEdge (Naukri), working on ASTRA, an internal GenAI platform used across product teams. I work on LLM streaming, intelligent model routing and fault-tolerant async inference with Java, Spring Boot and Kafka.",
  about: [
    "I joined InfoEdge as an intern in January 2025 and grew into a Senior Software Engineer role within about 15 months. Most of my work sits where distributed systems meet LLMs: making model calls fast, cheap, observable and reliable for the teams that depend on them.",
    "Outside of work I build full-stack projects such as Sakha, a RAG chatbot platform with real-time voice. I also enjoy competitive programming, with ICPC and several Codathons behind me and 500+ DSA problems solved.",
  ],
};

export const stats = [
  { value: "10+", label: "internal teams using my Gemini adapter" },
  { value: "7-8", label: "production use cases on the async SLM pipeline" },
  { value: "95%", label: "confidence threshold in the Bayesian model router" },
  { value: "500+", label: "DSA problems solved" },
];

export const experience = [
  {
    title: "Senior Software Engineer",
    company: "InfoEdge (Naukri)",
    period: "Apr 2026 - Present",
    location: "Noida",
    project: "ASTRA — Internal GenAI Platform",
    stack: ["Java 21", "Spring Boot", "Kafka", "MySQL", "Aerospike", "SSE", "Vertex AI", "Azure OpenAI"],
    points: [
      "Built end-to-end streaming (SSE) for LLM and SLM execution, including streaming of tool calls and tool responses. Integrated it into Saarthi, the AI Sales agent, with cancellation handling, timeout fallbacks and a persisted usecase-level streaming flag, so users get token-level responses instead of blocking calls.",
      "Designed a Bayesian multi-armed-bandit model router that races LLM candidates on live traffic per usecase using Thompson sampling over Beta posteriors. An async LLM-as-judge scores each response in the background, losing models are eliminated at 95% confidence, and the winner is locked at 100% traffic with an auto-generated report, adding no latency on the request path.",
      "Engineered an async SLM batch inference pipeline with Kafka-driven completion delivery, MySQL request state tracking, a polling fallback for Kafka-unavailable environments, TTL/expiry handling and retry logic, enabling fault-tolerant non-blocking execution across 7–8 production use cases.",
    ],
  },
  {
    title: "Software Engineer",
    company: "InfoEdge (Naukri)",
    period: "Jul 2025 - Mar 2026",
    location: "Noida",
    project: "ASTRA — Internal GenAI Platform",
    stack: ["Java 21", "Spring Boot", "Kafka", "MySQL", "Aerospike", "Vertex AI", "Azure OpenAI", "React"],
    points: [
      "Developed a Gemini execution adapter translating internal ASTRA request schemas to Vertex AI Gemini APIs. It supports function/tool calling, multi-turn tool response chaining, Google Search and Maps grounding, multimodal input, image generation output and per-request grounding cost attribution, and is adopted by 10+ internal teams.",
      "Built subscription-aware LLM routing for Azure OpenAI, resolving per-team deployment configurations at request time to enable multi-tenant model access across product teams.",
      "Designed a team-level GenAI analytics platform with daily/monthly/overall usage aggregation, service-level token-and-cost attribution, date-range filtering and paginated APIs, paired with a React.js operator dashboard for cross-team spend visibility.",
      "Extended a Git-backed prompt SDLC (Test → Stage → Prod) with merge-request validation, pre-MR Git diff checks via JGit, batch Git config APIs and a React operator UI for governed production prompt deployments.",
      "Automated use-case onboarding with a self-serve registration system featuring approval flows and budget requests, reducing manual template creation overhead for platform teams.",
      "Built a Kafka consumer onboarding toolkit that configures per-team queue routing across environments and ships with integration tests, enabling reliable async delivery for multiple product teams.",
    ],
  },
  {
    title: "Software Engineering Intern",
    company: "InfoEdge (Naukri)",
    period: "Jan 2025 - Jun 2025",
    location: "Noida",
    project: "Recruiter & resume-builder products",
    stack: ["React.js", "JavaScript", "HTML", "CSS"],
    points: [
      "Migrated legacy HTML/CSS/JS operator workflows to a modular React.js component architecture, improving maintainability and enabling reuse across recruiter-facing flows.",
      "Introduced a configurable theming system for the resume-builder product with adjustable font sizes, spacing variants and layout presets, expanding end-user customization control.",
    ],
  },
];

export const projects = [
  {
    name: "Sakha",
    tagline: "Full-stack RAG chatbot platform with real-time voice",
    stack: ["Java 21", "Spring Boot", "React", "Python / FastAPI", "MySQL", "Pinecone", "Groq LLM", "WebSockets"],
    points: [
      "Multi-tenant RAG platform where users create chatbots scoped to their own uploaded documents. The Spring Boot backend handles JWT auth, document ingestion via Apache Tika, chunking and embedding into Pinecone, and Groq-backed LLM responses grounded in retrieved context.",
      "Real-time voice interface over WebSockets with server-side VAD to detect utterance boundaries, Whisper for transcription and sentence-streamed Kokoro TTS for low-latency speech. Client-side barge-in lets users interrupt the assistant mid-response.",
    ],
    repo: "https://github.com/Abhinav-3359/chatBot",
    demo: "https://chat-bot-chi-six.vercel.app/",
  },
];

export const skills = [
  { group: "Languages", items: ["Java", "Python", "JavaScript", "C++"] },
  {
    group: "Backend",
    items: ["Spring Boot", "Flask", "REST APIs", "Async Processing", "Event-Driven Systems"],
  },
  { group: "Frontend", items: ["React.js", "Next.js", "HTML", "CSS"] },
  { group: "Data & Messaging", items: ["MySQL", "MongoDB", "Aerospike", "Apache Kafka", "Queue Routing"] },
  {
    group: "AI / LLM Systems",
    items: [
      "Gemini (Vertex AI)",
      "OpenAI",
      "Azure OpenAI",
      "Anthropic",
      "Tool Calling",
      "Multimodal Systems",
      "Prompt Orchestration",
    ],
  },
  { group: "DevOps & Tools", items: ["Git", "Docker", "Kubernetes", "GitLab CI", "Jenkins", "JGit", "Postman"] },
];

export const education = {
  degree: "B.Tech in Computer Science & Engineering",
  school: "National Institute of Technology (NIT), Jamshedpur",
  period: "Dec 2021 – May 2025",
  cgpa: "7.5",
};

export const achievements = [
  "Competitive programmer: ICPC, Codathon and CodeRush (AIR 49–463).",
  "500+ data structures and algorithms problems solved.",
];
