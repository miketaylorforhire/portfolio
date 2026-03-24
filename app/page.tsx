"use client";

import { useState, useEffect, useRef, RefObject } from "react";
import experienceData from "./data/experience.json"
import skillsData from "./data/skills.json";

type Job = {
  company: string;
  role: string;
  location: string;
  date: string;
  bullets: string[];
  tech: string[];
};

type SkillItem = { name: string; level: number };
type SkillGroup = {
  group: string;
  items: SkillItem[];
};

const experience: Job[] = experienceData;
const skills: SkillGroup[] = skillsData;

const AVAILABLE = true; // set to false when no longer looking
const TITLES = ["Front End Developer", "Web Developer", "React & Angular Expert", "Federal Tech Specialist"];

const CONTACT_LINKS = [
  { icon: "✉",   label: "miketaylorforhire@gmail.com",     href: "mailto:miketaylorforhire@gmail.com" },
  { icon: "📞",  label: "410-940-2232",                    href: "tel:14109402232" },
  { icon: "🌐",  label: "mikeetaylor.com",                 href: "/" },
  { icon: "in",  label: "linkedin.com/in/miketaylorforhire", href: "https://www.linkedin.com/in/miketaylorforhire/" },
  { icon: "</>", label: "github.com/miketaylorforhire",    href: "https://github.com/miketaylorforhire/" },
];

const STATS: [string, string][] = [
  ["15+", "Years Experience"],
  ["5",   "Federal Clients"],
  ["10+", "Apps Shipped"],
  ["1",   "Security+ Certification"],
];

function useIntersection(ref: RefObject<null>) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return visible;
}

function AnimatedItem({ children, className, delay = 0 }: { children: React.ReactNode; className: string; delay?: number }) {
  const ref = useRef(null);
  const visible = useIntersection(ref);
  return (
    <div ref={ref} className={`${className} ${visible ? "visible" : ""}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

function StatCounter({ num, label }: { num: string; label: string }) {
  const hasPlus = num.endsWith("+");
  const target = parseInt(num);
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const visible = useIntersection(ref);
  useEffect(() => {
    const handler = () => setCount(target);
    window.addEventListener("beforeprint", handler);
    return () => window.removeEventListener("beforeprint", handler);
  }, [target]);

  useEffect(() => {
    if (!visible) return;
    const steps = 40;
    const interval = 900 / steps;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(current));
    }, interval);
    return () => clearInterval(timer);
  }, [visible]);
  return (
    <div ref={ref} role="img" aria-label={`${target}${hasPlus ? "+" : ""} ${label}`}>
      <div className="stat-num" aria-hidden="true">{count}{hasPlus ? "+" : ""}</div>
      <div className="stat-label" aria-hidden="true">{label}</div>
    </div>
  );
}

function AnimatedBar({ name, level }: SkillItem) {
  const ref = useRef(null);
  const visible = useIntersection(ref);
  return (
    <div ref={ref} className="skill-bar-item">
      <div className="skill-bar-header">
        <span className="skill-bar-name">{name}</span>
        <span className="skill-bar-pct" aria-hidden="true">{level}%</span>
      </div>
      <div className="skill-bar-track" role="progressbar" aria-valuenow={level} aria-valuemin={0} aria-valuemax={100} aria-label={`${name} proficiency`}>
        <div className="skill-bar-fill" style={{ width: visible ? `${level}%` : "0%" }} />
      </div>
    </div>
  );
}

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

export default function Portfolio() {
  const [titleIndex, setTitleIndex] = useState(0);
  const [showTop, setShowTop] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [resumeOpen, setResumeOpen] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [copied, setCopied] = useState(false);
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("theme") as "dark" | "light" | null;
    if (saved) setTheme(saved);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const t = setInterval(() => setTitleIndex(i => (i + 1) % TITLES.length), 3000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const SECTIONS = ["experience", "skills", "certifications", "contact"];
    const onScroll = () => {
      const sy = window.scrollY;
      setShowTop(sy > 400);
      const total = document.body.scrollHeight - window.innerHeight;
      setScrollProgress(total > 0 ? sy / total : 0);
      const threshold = sy + 100;
      let active = "";
      for (const id of SECTIONS) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= threshold) active = id;
      }
      setActiveSection(active);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const handleClick = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (!t.closest("header") && !t.closest(".mobile-menu")) setMenuOpen(false);
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setMenuOpen(false); hamburgerRef.current?.focus(); }
    };
    document.addEventListener("click", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("click", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!resumeOpen) return;
    const handler = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (!t.closest(".resume-download")) setResumeOpen(false);
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [resumeOpen]);

  return (
    <>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <div className="grid-bg" aria-hidden="true" />
      <div className="noise" aria-hidden="true" />
      <div className="scroll-progress" aria-hidden="true" style={{ width: `${scrollProgress * 100}%` }} />

      {/* HEADER / NAV */}
      <header>
        <nav aria-label="Main navigation">
          <a className="nav-logo" href="#hero" onClick={e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
            <img src="/icon.svg" alt="Mike E. Taylor - Home" width={36} height={36} />
          </a>
          <ul className="nav-links">
            {["experience", "skills", "certifications", "contact"].map(s => (
              <li key={s}><a href={`#${s}`} onClick={e => { e.preventDefault(); scrollTo(s); }} className={activeSection === s ? "active" : ""} aria-current={activeSection === s ? "true" : undefined}>{s}</a></li>
            ))}
          </ul>
          <div className="nav-right">
          <button
            className="theme-toggle"
            onClick={() => setTheme(t => t === "dark" ? "light" : "dark")}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          />
          <button
            ref={hamburgerRef}
            className={`hamburger ${menuOpen ? "open" : ""}`}
            onClick={() => setMenuOpen(o => !o)}
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            <span /><span /><span />
          </button>
          </div>
        </nav>

        {/* MOBILE MENU */}
        <nav
          id="mobile-menu"
          className={`mobile-menu ${menuOpen ? "open" : ""}`}
          aria-label="Mobile navigation"
          aria-hidden={!menuOpen || undefined}
        >
          {["experience", "skills", "certifications", "contact"].map(s => (
            <a key={s} href={`#${s}`} onClick={e => { e.preventDefault(); scrollTo(s); setMenuOpen(false); }} className={activeSection === s ? "active" : ""} aria-current={activeSection === s ? "true" : undefined} tabIndex={menuOpen ? undefined : -1}>{s}</a>
          ))}
        </nav>
      </header>

      <main id="main-content">
        {/* HERO */}
        <section className="hero" id="hero" aria-labelledby="hero-heading">
          <div className="hero-glow" aria-hidden="true" />
          <div style={{ maxWidth: 1100, margin: "0 auto", width: "100%" }}>
            {AVAILABLE && <div className="hero-eyebrow">Available for opportunities</div>}
            <h1 className="hero-name" id="hero-heading">Mike E.<br /><span>Taylor</span></h1>
            <p className="hero-title" aria-label={TITLES[titleIndex]}>
              {TITLES[titleIndex]}<span className="cursor" aria-hidden="true" />
            </p>
            <p className="hero-bio">
              Mission-driven developer with 15+ years building responsive, accessible web applications
              for federal and defense clients — including NASA and the U.S. Naval Academy. Deep expertise
              in React and Angular, with a track record of delivering under pressure.
            </p>
            <div className="hero-cta">
              <button className="btn-primary" onClick={() => scrollTo("experience")}>
                <span>View Experience</span>
              </button>
              <button className="btn-secondary" onClick={() => scrollTo("contact")}>
                Get In Touch
              </button>
              <div className="resume-download">
                <button
                  className="btn-secondary"
                  onClick={() => setResumeOpen(o => !o)}
                  aria-expanded={resumeOpen}
                  aria-controls="resume-dropdown"
                  aria-haspopup="true"
                >
                  Download Resume <span aria-hidden="true">▾</span>
                </button>
                <div id="resume-dropdown" className={`resume-dropdown ${resumeOpen ? "open" : ""}`} role="menu">
                  <a href="/docs/Mike-Taylor-Resume.pdf" download role="menuitem">PDF</a>
                  <a href="/docs/Mike-Taylor-Resume.docx" download role="menuitem">Word (.docx)</a>
                </div>
              </div>
            </div>
            <div className="hero-stats">
              {STATS.map(([num, label]) => (
                <StatCounter key={label} num={num} label={label} />
              ))}
            </div>
          </div>
        </section>

        {/* EXPERIENCE */}
        <section id="experience" aria-labelledby="experience-heading">
          <div className="section-inner">
            <div className="section-label" aria-hidden="true">Career</div>
            <h2 className="section-title" id="experience-heading">Experience</h2>
            <div className="timeline">
              {experience.map((job, i) => (
                <AnimatedItem key={i} className="timeline-item" delay={i * 80}>
                  <div className="timeline-dot" aria-hidden="true" />
                  <div className="timeline-card">
                    <div className="timeline-meta">
                      <div className="timeline-company">{job.company}</div>
                      <div className="timeline-date">{job.date}</div>
                    </div>
                    <div className="timeline-role">{job.role}</div>
                    <div className="timeline-location"><span aria-hidden="true">📍</span> {job.location}</div>
                    <ul className="timeline-bullets">
                      {job.bullets.map((b, j) => <li key={j}>{b}</li>)}
                    </ul>
                    <div className="tech-tags" aria-label="Technologies used">
                      {job.tech.map(t => <span key={t} className="tech-tag">{t}</span>)}
                    </div>
                  </div>
                </AnimatedItem>
              ))}
            </div>
          </div>
        </section>

        {/* SKILLS */}
        <section id="skills" aria-labelledby="skills-heading" style={{ background: "linear-gradient(to bottom, transparent, rgba(0,212,255,0.02), transparent)" }}>
          <div className="section-inner">
            <div className="section-label" aria-hidden="true">Capabilities</div>
            <h2 className="section-title" id="skills-heading">Technical Skills</h2>
            <div className="skills-grid">
              {skills.map((sg, i) => (
                <AnimatedItem key={i} className="skill-group" delay={i * 80}>
                  <div className="skill-group-title">{sg.group}</div>
                  <div className="skill-list">
                    {sg.items.map(s => <AnimatedBar key={s.name} name={s.name} level={s.level} />)}
                  </div>
                </AnimatedItem>
              ))}
            </div>
          </div>
        </section>

        {/* CERTIFICATIONS & EDUCATION */}
        <section id="certifications" aria-labelledby="certifications-heading">
          <div className="section-inner">
            <div className="section-label" aria-hidden="true">Credentials</div>
            <h2 className="section-title" id="certifications-heading">Certifications</h2>
            <AnimatedItem className="cert-card">
              <div className="cert-badge" aria-hidden="true">SEC+</div>
              <div>
                <div className="cert-name">CompTIA Security+</div>
                <div className="cert-meta">Issued <span>April 2021</span></div>
                <div className="cert-meta">ID: <span>COMP001021757831</span></div>
              </div>
            </AnimatedItem>

            <div style={{ marginTop: 64 }}>
              <div className="section-label" style={{ marginBottom: 16 }} aria-hidden="true">Academic</div>
              <h3 className="section-title" id="education-heading" style={{ fontSize: "clamp(28px,4vw,42px)", marginBottom: 32 }}>Education</h3>
              <AnimatedItem className="edu-card">
                <div className="edu-degree">B.S., Computer Science</div>
                <div className="edu-school">Morgan State University</div>
                <div className="edu-location">Baltimore, MD</div>
              </AnimatedItem>
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="contact-section" aria-labelledby="contact-heading">
          <div className="contact-inner">
            <h2 className="contact-heading" id="contact-heading">Let&apos;s build<br /><span>something.</span></h2>
            <div className="contact-links">
              {CONTACT_LINKS.map(({ icon, label, href }) => {
                const isExternal = href.startsWith("http");
                const isEmail = href.startsWith("mailto:");
                return (
                  <div key={label} className="contact-link-row">
                    <a
                      className="contact-link"
                      href={href}
                      {...(isExternal ? { target: "_blank", rel: "noreferrer", "aria-label": `${label} (opens in new window)` } : {})}
                    >
                      <div className="contact-link-icon" aria-hidden="true">{icon}</div>
                      {label}
                    </a>
                    {isEmail && (
                      <button
                        className={`copy-btn ${copied ? "copied" : ""}`}
                        onClick={() => { navigator.clipboard.writeText(label); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                        aria-label="Copy email address"
                      >
                        {copied ? "✓" : "⧉"}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <footer>
        <p>© {new Date().getFullYear()} Mike E. Taylor</p>
      </footer>

      <button
        className={`back-to-top ${showTop ? "visible" : ""}`}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Back to top"
      >
        <span aria-hidden="true">↑</span>
      </button>
    </>
  );
}
