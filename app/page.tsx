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

const TITLES = ["Front End Developer", "React & Angular Expert", "Federal Tech Specialist"];

const CONTACT_LINKS = [
  { icon: "✉",   label: "miketaylorforhire@gmail.com",     href: "mailto:miketaylorforhire@gmail.com" },
  { icon: "📞",  label: "410-940-2232",                    href: "tel:4109402232" },
  { icon: "🌐",  label: "mikeetaylor.com",                 href: "https://mikeetaylor.com" },
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

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

export default function Portfolio() {
  const [titleIndex, setTitleIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setTitleIndex(i => (i + 1) % TITLES.length), 3000);
    return () => clearInterval(t);
  }, []);

  return (
    <>
      <div className="grid-bg" />
      <div className="noise" />

      {/* NAV */}
      <nav>
        <a className="nav-logo">MT</a>
        <ul className="nav-links">
          {["experience", "skills", "certifications", "contact"].map(s => (
            <li key={s}><a onClick={() => scrollTo(s)}>{s}</a></li>
          ))}
        </ul>
      </nav>

      {/* HERO */}
      <section className="hero" id="hero">
        <div className="hero-glow" />
        <div style={{ maxWidth: 1100, margin: "0 auto", width: "100%" }}>
          <div className="hero-eyebrow">Available for opportunities</div>
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
          </div>
          <div className="hero-stats">
            {STATS.map(([num, label]) => (
              <div key={label}>
                <div className="stat-num">{num}</div>
                <div className="stat-label">{label}</div>
              </div>
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
        <p>© 2025 Michael Taylor</p>
      </footer>
    </>
  );
}
