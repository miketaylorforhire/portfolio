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

type SkillGroup = {
  group: string;
  items: string[];
};

const experience: Job[] = experienceData;
const skills: SkillGroup[] = skillsData;

const AVAILABLE = true; // set to false when no longer looking
const TITLES = ["Front End Developer", "Web Developer", "React & Angular Expert", "Federal Tech Specialist"];

const CONTACT_LINKS = [
  { icon: "✉",   label: "miketaylorforhire@gmail.com",     href: "mailto:miketaylorforhire@gmail.com" },
  { icon: "📞",  label: "410-940-2232",                    href: "tel:14109402232" },
  { icon: "🌐",  label: "mikeetaylor.com",                 href: "https://mikeetaylor.com/" },
  { icon: "in",  label: "linkedin.com/in/miketaylorforhire", href: "https://www.linkedin.com/in/miketaylorforhire/" },
  { icon: "</>", label: "github.com/miketaylorforhire",           href: "https://github.com/miketaylorforhire/" },
];

const STATS: [string, string][] = [
  ["15+", "Years Experience"],
  ["5",   "Federal Clients"],
  ["10+", "Apps Shipped"],
  ["1",   "Security+ Cert"],
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
    <div ref={ref}>
      <div className="stat-num">{count}{hasPlus ? "+" : ""}</div>
      <div className="stat-label">{label}</div>
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
    const handler = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (!t.closest("nav") && !t.closest(".mobile-menu")) setMenuOpen(false);
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
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
      <div className="grid-bg" />
      <div className="noise" />
      <div className="scroll-progress" style={{ width: `${scrollProgress * 100}%` }} />

      {/* NAV */}
      <nav>
        <a className="nav-logo" href="#hero" onClick={e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}><img src="/icon.svg" alt="MT" width={36} height={36} /></a>
        <ul className="nav-links">
          {["experience", "skills", "certifications", "contact"].map(s => (
            <li key={s}><a href={`#${s}`} onClick={e => { e.preventDefault(); scrollTo(s); }} className={activeSection === s ? "active" : ""}>{s}</a></li>
          ))}
        </ul>
        <button className={`hamburger ${menuOpen ? "open" : ""}`} onClick={() => setMenuOpen(o => !o)} aria-label="Toggle menu">
          <span /><span /><span />
        </button>
      </nav>

      {/* MOBILE MENU */}
      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        {["experience", "skills", "certifications", "contact"].map(s => (
          <a key={s} href={`#${s}`} onClick={e => { e.preventDefault(); scrollTo(s); setMenuOpen(false); }} className={activeSection === s ? "active" : ""}>{s}</a>
        ))}
      </div>

      {/* HERO */}
      <section className="hero" id="hero">
        <div className="hero-glow" />
        <div style={{ maxWidth: 1100, margin: "0 auto", width: "100%" }}>
          {AVAILABLE && <div className="hero-eyebrow">Available for opportunities</div>}
          <h1 className="hero-name">Michael<br /><span>Taylor</span></h1>
          <p className="hero-title">
            {TITLES[titleIndex]}<span className="cursor" />
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
              <button className="btn-secondary" onClick={() => setResumeOpen(o => !o)}>
                Download Resume ▾
              </button>
              <div className={`resume-dropdown ${resumeOpen ? "open" : ""}`}>
                <a href="/docs/Mike-Taylor-Resume.pdf" download>PDF</a>
                <a href="/docs/Mike-Taylor-Resume.docx" download>Word (.docx)</a>
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
      <section id="experience">
        <div className="section-inner">
          <div className="section-label">Career</div>
          <h2 className="section-title">Experience</h2>
          <div className="timeline">
            {experience.map((job, i) => (
              <AnimatedItem key={i} className="timeline-item" delay={i * 80}>
                <div className="timeline-dot" />
                <div className="timeline-card">
                  <div className="timeline-meta">
                    <div className="timeline-company">{job.company}</div>
                    <div className="timeline-date">{job.date}</div>
                  </div>
                  <div className="timeline-role">{job.role}</div>
                  <div className="timeline-location">📍 {job.location}</div>
                  <ul className="timeline-bullets">
                    {job.bullets.map((b, j) => <li key={j}>{b}</li>)}
                  </ul>
                  <div className="tech-tags">
                    {job.tech.map(t => <span key={t} className="tech-tag">{t}</span>)}
                  </div>
                </div>
              </AnimatedItem>
            ))}
          </div>
        </div>
      </section>

      {/* SKILLS */}
      <section id="skills" style={{ background: "linear-gradient(to bottom, transparent, rgba(0,212,255,0.02), transparent)" }}>
        <div className="section-inner">
          <div className="section-label">Capabilities</div>
          <h2 className="section-title">Technical Skills</h2>
          <div className="skills-grid">
            {skills.map((sg, i) => (
              <AnimatedItem key={i} className="skill-group" delay={i * 80}>
                <div className="skill-group-title">{sg.group}</div>
                <div className="skill-list">
                  {sg.items.map(s => <span key={s} className="skill-item">{s}</span>)}
                </div>
              </AnimatedItem>
            ))}
          </div>
        </div>
      </section>

      {/* CERTIFICATIONS & EDUCATION */}
      <section id="certifications">
        <div className="section-inner">
          <div className="section-label">Credentials</div>
          <h2 className="section-title">Certifications</h2>
          <AnimatedItem className="cert-card">
            <div className="cert-badge">SEC+</div>
            <div>
              <div className="cert-name">CompTIA Security+</div>
              <div className="cert-meta">Issued <span>April 2021</span></div>
              <div className="cert-meta">ID: <span>COMP001021757831</span></div>
            </div>
          </AnimatedItem>

          <div style={{ marginTop: 64 }}>
            <div className="section-label" style={{ marginBottom: 16 }}>Academic</div>
            <h2 className="section-title" style={{ fontSize: "clamp(28px,4vw,42px)", marginBottom: 32 }}>Education</h2>
            <AnimatedItem className="edu-card">
              <div className="edu-degree">B.S., Computer Science</div>
              <div className="edu-school">Morgan State University</div>
              <div className="edu-location">Baltimore, MD</div>
            </AnimatedItem>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="contact-section">
        <div className="contact-inner">
          <h2 className="contact-heading">Let&apos;s build<br /><span>something.</span></h2>
          <div className="contact-links">
            {CONTACT_LINKS.map(({ icon, label, href }) => (
              <a key={label} className="contact-link" href={href} target="_blank" rel="noreferrer">
                <div className="contact-link-icon">{icon}</div>
                {label}
              </a>
            ))}
          </div>
        </div>
      </section>

      <footer>
        <p>© {new Date().getFullYear()} Michael Taylor</p>
      </footer>

      <button
        className={`back-to-top ${showTop ? "visible" : ""}`}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Back to top"
      >
        ↑
      </button>
    </>
  );
}
