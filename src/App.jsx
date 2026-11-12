import { useEffect, useRef, useState } from "react";
import {
  profile,
  stats,
  experience,
  projects,
  skills,
  education,
  achievements,
} from "./data.js";
import {
  GithubIcon,
  LinkedinIcon,
  MailIcon,
  DownloadIcon,
  ExternalIcon,
  MenuIcon,
  CloseIcon,
  PinIcon,
} from "./icons.jsx";

const THEMES = [
  { id: "dark", label: "Dark" },
  { id: "light", label: "Light" },
  { id: "matrix", label: "Matrix" },
  { id: "amber", label: "Amber" },
  { id: "dracula", label: "Dracula" },
  { id: "nord", label: "Nord" },
];
const THEME_IDS = THEMES.map((t) => t.id);

const sections = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
];

const SECTION_IDS = ["top", "about", "experience", "projects", "skills", "contact"];

function slugify(s) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  );
}

function scrollToSection(id) {
  const el = document.getElementById(id);
  if (!el) return false;
  el.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
  return true;
}

/* Fade-in on scroll (disabled automatically for reduced-motion users via CSS). */
function Reveal({ children, className = "", as: Tag = "div", delay = 0 }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Tag
      ref={ref}
      className={`reveal ${shown ? "in" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}

function useActiveSection(ids) {
  const [active, setActive] = useState("");
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY + 120;
      let current = "";
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= y) current = id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [ids]);
  return active;
}

function useThemeState() {
  const [theme, setTheme] = useState(
    () => document.documentElement.dataset.theme || "dark"
  );
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem("theme", theme);
    } catch {
      /* storage unavailable, ignore */
    }
  }, [theme]);
  return [theme, setTheme];
}

function WindowDots() {
  return (
    <span className="win-dots" aria-hidden="true">
      <span className="dot red" />
      <span className="dot yellow" />
      <span className="dot green" />
    </span>
  );
}

function Window({ title, children, className = "", as: Tag = "div" }) {
  return (
    <Tag className={`window ${className}`}>
      <div className="window-bar">
        <WindowDots />
        <span className="window-title">{title}</span>
      </div>
      <div className="window-body">{children}</div>
    </Tag>
  );
}

/* ---------- Terminal command engine ---------- */

const FILES = {
  "about.md": () => [profile.intro, "", ...profile.about],
  "skills.yaml": () => skills.flatMap((g) => [`${g.group}:`, ...g.items.map((i) => `  - ${i}`)]),
  "education.yaml": () => [
    education.degree,
    education.school,
    `${education.period} · CGPA ${education.cgpa}`,
  ],
  "achievements.log": () => achievements,
  "contact.sh": () => [
    `email:    ${profile.email}`,
    `github:   ${profile.github}`,
    `linkedin: ${profile.linkedin}`,
  ],
};

const COMMAND_LIST = [
  ["help", "list available commands"],
  ["about", "who I am"],
  ["whoami", "identify the owner of this terminal"],
  ["experience", "print work history"],
  ["projects", "print side projects"],
  ["skills", "print tech stack"],
  ["education", "print degree + achievements"],
  ["contact", "print ways to reach me"],
  ["open <section>", "scroll to about|experience|projects|skills|contact"],
  ["resume", "open my resume PDF"],
  ["github / linkedin / email", "open the respective link"],
  ["theme [name]", "switch theme: dark, light, matrix, amber, dracula, nord"],
  ["ls", "list site sections as files"],
  ["cat <file>", "print a file from ls"],
  ["neofetch", "system info, portfolio edition"],
  ["clear", "clear the screen"],
];

function buildHelp() {
  const width = Math.max(...COMMAND_LIST.map(([c]) => c.length));
  return [
    "Available commands:",
    ...COMMAND_LIST.map(([c, d]) => `  ${c.padEnd(width + 2)}${d}`),
  ];
}

function runCommand(raw, ctx) {
  const trimmed = raw.trim();
  const [cmd, ...args] = trimmed.split(/\s+/);
  const key = cmd.toLowerCase();

  switch (key) {
    case "help":
    case "man":
      return buildHelp();

    case "about":
      return [profile.intro, "", ...profile.about];

    case "whoami":
      return [`${profile.name} — ${profile.role} at ${profile.company}.`, profile.headline];

    case "experience":
      return experience.flatMap((j) => [
        `${j.period}  ${j.title} @ ${j.company}`,
        `  ${j.project}`,
      ]);

    case "projects":
      return projects.flatMap((p) => [
        `${p.name} — ${p.tagline}`,
        `  repo: ${p.repo}`,
        `  demo: ${p.demo}`,
      ]);

    case "skills":
      return FILES["skills.yaml"]();

    case "education":
      return [...FILES["education.yaml"](), "", ...achievements];

    case "contact":
      return FILES["contact.sh"]();

    case "ls":
      return [
        "about.md",
        "experience/",
        "projects/",
        "skills.yaml",
        "education.yaml",
        "achievements.log",
        "contact.sh",
        "resume.pdf",
      ];

    case "cat": {
      const f = args[0];
      if (!f) return ["usage: cat <file>"];
      if (f.replace(/\/$/, "") === "experience" || f.replace(/\/$/, "") === "projects") {
        return [`cat: ${f}: Is a directory. Try "open ${f.replace(/\/$/, "")}" instead.`];
      }
      if (FILES[f]) return FILES[f]();
      if (f === "resume.pdf") return ["binary file — run `resume` to open it"];
      return [`cat: ${f}: No such file or directory`];
    }

    case "open":
    case "cd": {
      const target = (args[0] || "").toLowerCase().replace(/^#|\/$/g, "");
      if (SECTION_IDS.includes(target)) {
        scrollToSection(target);
        return [`→ jumping to #${target}`];
      }
      return [`open: unknown section '${args[0] || ""}'. Try: about, experience, projects, skills, contact`];
    }

    case "resume":
      window.open(profile.resume, "_blank", "noreferrer");
      return ["opening resume.pdf ..."];

    case "github":
      window.open(profile.github, "_blank", "noreferrer");
      return [`opening ${profile.github} ...`];

    case "linkedin":
      window.open(profile.linkedin, "_blank", "noreferrer");
      return [`opening ${profile.linkedin} ...`];

    case "email":
      window.location.href = `mailto:${profile.email}`;
      return [`mailto:${profile.email}`];

    case "social":
      return [`github:   ${profile.github}`, `linkedin: ${profile.linkedin}`];

    case "theme": {
      const arg = (args[0] || "").toLowerCase();
      const next = THEME_IDS.includes(arg)
        ? arg
        : THEME_IDS[(THEME_IDS.indexOf(ctx.theme) + 1) % THEME_IDS.length];
      ctx.setTheme(next);
      return [`theme → ${next}`, `available: ${THEME_IDS.join(", ")}`];
    }

    case "neofetch":
    case "banner":
      return [
        `${profile.name}@portfolio`,
        "-----------------",
        `Role:  ${profile.role}`,
        `Host:  ${profile.company}`,
        `Stack: Java 21 / Spring Boot / Kafka / Vertex AI`,
        `Shell: React + Vite`,
        ...stats.map((s) => `Stat:  ${s.value} ${s.label}`),
      ];

    case "date":
      return [new Date().toString()];

    case "echo":
      return [args.join(" ")];

    case "sudo":
      return ["Nice try. This incident has been logged to /dev/null."];

    case "exit":
    case "logout":
      return ["There is no escaping a portfolio. Try `help` instead."];

    case "":
      return [];

    default:
      return [`bash: ${cmd}: command not found. Type 'help' for a list of commands.`];
  }
}

const URL_OR_EMAIL = /(\bhttps?:\/\/[^\s]+|\b[\w.+-]+@[\w-]+\.[\w.-]+\b)/g;

function linkify(text) {
  const parts = text.split(URL_OR_EMAIL);
  return parts.map((part, i) => {
    if (/^https?:\/\//.test(part)) {
      return (
        <a key={i} href={part} target="_blank" rel="noreferrer" className="term-link">
          {part}
        </a>
      );
    }
    if (/^[\w.+-]+@[\w-]+\.[\w.-]+$/.test(part)) {
      return (
        <a key={i} href={`mailto:${part}`} className="term-link">
          {part}
        </a>
      );
    }
    return part;
  });
}

const QUICK_COMMANDS = ["help", "about", "projects", "skills", "contact", "resume"];
const AUTOCOMPLETE = [
  "help", "about", "whoami", "experience", "projects", "skills", "education",
  "contact", "open", "resume", "github", "linkedin", "email", "social",
  "theme", "ls", "cat", "neofetch", "clear", "date", "echo",
];

function Terminal({ theme, setTheme }) {
  const [history, setHistory] = useState([]);
  const [input, setInput] = useState("");
  const [cmdLog, setCmdLog] = useState([]);
  const [cmdIndex, setCmdIndex] = useState(null);
  const idRef = useRef(0);
  const outputRef = useRef(null);

  const push = (kind, content) => {
    idRef.current += 1;
    setHistory((h) => [...h, { id: idRef.current, kind, content }]);
  };

  useEffect(() => {
    const bootLines = [
      `Last login: ${new Date().toDateString()} on ttys001`,
      "Welcome to abhinav@portfolio.",
      "Type `help` to see what this terminal can do, or just scroll down.",
    ];
    if (prefersReducedMotion()) {
      bootLines.forEach((l) => push("output", l));
      return;
    }
    const timers = bootLines.map((l, i) => setTimeout(() => push("output", l), (i + 1) * 260));
    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const el = outputRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [history]);

  const run = (raw) => {
    const trimmed = raw.trim();
    push("input", trimmed);
    if (trimmed) setCmdLog((log) => [...log, trimmed]);
    setCmdIndex(null);

    const key = trimmed.split(/\s+/)[0]?.toLowerCase();
    if (key === "clear" || key === "cls") {
      setHistory([]);
      return;
    }
    if (!trimmed) return;

    const result = runCommand(trimmed, { theme, setTheme }) || [];
    result.forEach((l) =>
      push(
        /command not found|No such file|unknown section|^usage:/.test(l) ? "error" : "output",
        l
      )
    );
  };

  const onSubmit = (e) => {
    e.preventDefault();
    run(input);
    setInput("");
  };

  const onKeyDown = (e) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!cmdLog.length) return;
      const idx = cmdIndex === null ? cmdLog.length - 1 : Math.max(0, cmdIndex - 1);
      setCmdIndex(idx);
      setInput(cmdLog[idx]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (cmdIndex === null) return;
      const idx = cmdIndex + 1;
      if (idx >= cmdLog.length) {
        setCmdIndex(null);
        setInput("");
      } else {
        setCmdIndex(idx);
        setInput(cmdLog[idx]);
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      const partial = input.trim().toLowerCase();
      if (!partial) return;
      const match = AUTOCOMPLETE.find((c) => c.startsWith(partial));
      if (match) setInput(`${match} `);
    }
  };

  return (
    <Window title="visitor@abhinav: ~/portfolio" className="terminal">
      <div className="term-output" ref={outputRef} role="log" aria-live="polite" aria-label="Terminal output">
        {history.map((h) => (
          <div key={h.id} className={`term-line ${h.kind}`}>
            {h.kind === "input" ? (
              <>
                <span className="term-prompt">visitor@abhinav:~$</span>
                {h.content}
              </>
            ) : (
              linkify(h.content)
            )}
          </div>
        ))}
      </div>
      <form className="term-input-row" onSubmit={onSubmit}>
        <label htmlFor="term-input" className="sr-only">
          Terminal command input
        </label>
        <span className="term-prompt" aria-hidden="true">
          visitor@abhinav:~$
        </span>
        <input
          id="term-input"
          type="text"
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck="false"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="type `help`..."
        />
      </form>
      <div className="term-quick" aria-label="Quick commands">
        {QUICK_COMMANDS.map((c) => (
          <button key={c} type="button" onClick={() => run(c)}>
            {c}
          </button>
        ))}
      </div>
    </Window>
  );
}

/* ---------- Page sections ---------- */

function Header({ theme, setTheme }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const active = useActiveSection(sections.map((s) => s.id));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`header ${scrolled ? "scrolled" : ""}`}>
      <div className="container header-inner">
        <a href="#top" className="brand" aria-label="Back to top">
          <span className="brand-mark" aria-hidden="true">
            &gt;_
          </span>
          <span className="brand-name">Abhinav Anand</span>
        </a>

        <nav className={`nav ${open ? "open" : ""}`} aria-label="Primary">
          {sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className={active === s.id ? "active" : ""}
              onClick={() => setOpen(false)}
            >
              {s.label}
            </a>
          ))}
          <a
            className="btn btn-small btn-outline nav-resume"
            href={profile.resume}
            target="_blank"
            rel="noreferrer"
          >
            Resume
          </a>
        </nav>

        <div className="header-actions">
          <span className="select-wrap">
            <label htmlFor="theme-select" className="sr-only">
              Color theme
            </label>
            <select
              id="theme-select"
              className="theme-select"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
            >
              {THEMES.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
          </span>
          <button
            className="icon-btn menu-btn"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>
    </header>
  );
}

function Hero({ theme, setTheme }) {
  return (
    <section className="hero" id="top">
      <div className="container hero-inner">
        <p className="eyebrow">
          <span className="dot" /> Open to interesting conversations
        </p>
        <h1>
          Hi, I'm <span className="accent-name">{profile.name}</span>.
          <br />
          {profile.headline}
          <span className="cursor" aria-hidden="true" />
        </h1>
        <p className="lead">{profile.intro}</p>
        <p className="meta">
          <PinIcon width={16} height={16} /> {profile.location}
          <span className="sep">•</span>
          {profile.role}, {profile.company}
        </p>
        <div className="cta-row">
          <a className="btn btn-primary" href="#contact">
            <MailIcon /> Get in touch
          </a>
          <a className="btn btn-outline" href={profile.resume} target="_blank" rel="noreferrer">
            <DownloadIcon /> Resume
          </a>
          <a className="btn btn-ghost" href={profile.github} target="_blank" rel="noreferrer">
            <GithubIcon /> GitHub
          </a>
          <a className="btn btn-ghost" href={profile.linkedin} target="_blank" rel="noreferrer">
            <LinkedinIcon /> LinkedIn
          </a>
        </div>

        <dl className="stats">
          {stats.map((s) => (
            <div key={s.label} className="stat">
              <dt>{s.value}</dt>
              <dd>{s.label}</dd>
            </div>
          ))}
        </dl>

        <Terminal theme={theme} setTheme={setTheme} />
      </div>
    </section>
  );
}

function SectionHead({ index, title, sub, cmd }) {
  return (
    <Reveal className="section-head">
      <p className="prompt-line">
        <span className="p-user">visitor@abhinav</span>
        <span className="p-sym">:~$</span> {cmd}
        <span className="comment"> # {index}</span>
      </p>
      <h2>{title}</h2>
      {sub && <p className="section-sub">{sub}</p>}
    </Reveal>
  );
}

function About() {
  return (
    <section id="about" className="section">
      <div className="container">
        <SectionHead index="01" title="About" cmd="cat about.md" />
        <div className="about-grid">
          <Reveal className="about-text">
            <Window title="about.md">
              {profile.about.map((p) => (
                <p key={p.slice(0, 20)}>{p}</p>
              ))}
            </Window>
          </Reveal>
          <div className="about-side">
            <Reveal delay={100}>
              <Window title="education.yaml">
                <p className="edu-degree">{education.degree}</p>
                <p className="muted">{education.school}</p>
                <p className="muted">
                  {education.period} · CGPA {education.cgpa}
                </p>
              </Window>
            </Reveal>
            <Reveal delay={160}>
              <Window title="achievements.log" className="mt-window">
                <ul className="plain">
                  {achievements.map((a) => (
                    <li key={a}>{a}</li>
                  ))}
                </ul>
              </Window>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

function Experience() {
  return (
    <section id="experience" className="section alt">
      <div className="container">
        <SectionHead
          index="02"
          title="Experience"
          cmd="ls -la experience/"
          sub="Three roles at InfoEdge (Naukri), all around the ASTRA GenAI platform and the products built on it."
        />
        <ol className="timeline">
          {experience.map((job) => (
            <Reveal as="li" className="job-item" key={job.title + job.period}>
              <Window title={`${slugify(job.title)}.log`} className="job-window">
                <div className="job-head">
                  <div>
                    <h3>{job.title}</h3>
                    <p className="job-company">
                      {job.company} · {job.location}
                    </p>
                  </div>
                  <span className="period">{job.period}</span>
                </div>
                <p className="job-project">{job.project}</p>
                <ul className="points">
                  {job.points.map((p) => (
                    <li key={p.slice(0, 30)}>{p}</li>
                  ))}
                </ul>
                <ul className="tags">
                  {job.stack.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </Window>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Projects() {
  return (
    <section id="projects" className="section">
      <div className="container">
        <SectionHead index="03" title="Projects" cmd="ls projects/" sub="Things I build outside of work." />
        <div className="project-list">
          {projects.map((p) => (
            <Reveal key={p.name}>
              <Window title={`${p.name.toLowerCase()}/README.md`} className="project-window">
                <div className="project-top">
                  <div>
                    <h3>{p.name}</h3>
                    <p className="muted">{p.tagline}</p>
                  </div>
                  <div className="project-links">
                    <a className="btn btn-small btn-outline" href={p.repo} target="_blank" rel="noreferrer">
                      <GithubIcon width={16} height={16} /> Code
                    </a>
                    <a className="btn btn-small btn-primary" href={p.demo} target="_blank" rel="noreferrer">
                      <ExternalIcon width={16} height={16} /> Live demo
                    </a>
                  </div>
                </div>
                <ul className="points">
                  {p.points.map((pt) => (
                    <li key={pt.slice(0, 30)}>{pt}</li>
                  ))}
                </ul>
                <ul className="tags">
                  {p.stack.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </Window>
            </Reveal>
          ))}
          <Reveal className="more-github" delay={80}>
            <a href={profile.github} target="_blank" rel="noreferrer">
              <GithubIcon /> See more on GitHub <ExternalIcon width={14} height={14} />
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Skills() {
  return (
    <section id="skills" className="section alt">
      <div className="container">
        <SectionHead index="04" title="Skills" cmd="cat skills.yaml" sub="The tools I use day to day." />
        <div className="skill-grid">
          {skills.map((g, i) => (
            <Reveal key={g.group} delay={i * 50}>
              <Window title={`${slugify(g.group)}.yaml`} className="skill-window">
                <ul className="tags">
                  {g.items.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </Window>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="section">
      <div className="container">
        <Reveal>
          <Window title="contact.sh" className="contact-window">
            <p className="prompt-line">
              <span className="p-user">visitor@abhinav</span>
              <span className="p-sym">:~$</span> ./contact.sh
              <span className="comment"> # 05</span>
            </p>
            <h2>Let's talk</h2>
            <p className="lead small">
              I'm always happy to chat about GenAI systems, backend engineering or interesting
              problems. The fastest way to reach me is email.
            </p>
            <div className="term-style-output">
              <p>{profile.email}</p>
              <p>{profile.linkedin.replace("https://www.", "")}</p>
              <p>{profile.github.replace("https://", "")}</p>
            </div>
            <div className="cta-row center">
              <a className="btn btn-primary" href={`mailto:${profile.email}`}>
                <MailIcon /> {profile.email}
              </a>
              <a className="btn btn-outline" href={profile.linkedin} target="_blank" rel="noreferrer">
                <LinkedinIcon /> LinkedIn
              </a>
              <a className="btn btn-outline" href={profile.github} target="_blank" rel="noreferrer">
                <GithubIcon /> GitHub
              </a>
            </div>
          </Window>
        </Reveal>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <p className="footer-prompt">
          <span className="p-user">visitor@abhinav</span>
          <span className="p-sym">:~$</span> echo "© {new Date().getFullYear()} {profile.name}"
        </p>
        <a href="#top" className="footer-back">
          cd ~ <span aria-hidden="true">↑</span>
        </a>
      </div>
    </footer>
  );
}

export default function App() {
  const [theme, setTheme] = useThemeState();
  return (
    <>
      <a className="skip" href="#about">
        Skip to content
      </a>
      <Header theme={theme} setTheme={setTheme} />
      <main>
        <Hero theme={theme} setTheme={setTheme} />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
