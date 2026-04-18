"use client";

import { useState, useEffect } from "react";

export default function NotFound() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const saved = localStorage.getItem("theme") as "dark" | "light" | null;
    if (saved) setTheme(saved);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <div className="grid-bg" aria-hidden="true" />
      <div className="noise" aria-hidden="true" />

      <header>
        <nav aria-label="Main navigation">
          <a className="nav-logo" href="/" aria-label="Mike E. Taylor - Home">
            <img src="/icon.svg" alt="Mike E. Taylor - Home" width={36} height={36} />
          </a>
          <ul className="nav-links">
            {["experience", "projects", "skills", "certifications", "contact"].map(s => (
              <li key={s}><a href={`/#${s}`}>{s}</a></li>
            ))}
          </ul>
          <div className="nav-right">
            <button
              className="theme-toggle"
              onClick={() => setTheme(t => t === "dark" ? "light" : "dark")}
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            />
          </div>
        </nav>
      </header>

      <main id="main-content">
        <section className="hero" aria-labelledby="notfound-heading">
          <div className="hero-glow" aria-hidden="true" />
          <div style={{ maxWidth: 1100, margin: "0 auto", width: "100%", textAlign: "center" }}>
            <div className="hero-eyebrow">404 — Page Not Found</div>
            <h1 className="hero-name" id="notfound-heading" style={{ fontSize: "clamp(80px, 20vw, 180px)" }}>
              4<span>0</span>4
            </h1>
            <p className="hero-bio" style={{ maxWidth: 520, margin: "0 auto 40px" }}>
              This page doesn&apos;t exist. It may have been moved, deleted, or you may have followed a broken link.
            </p>
            <div className="hero-cta" style={{ justifyContent: "center" }}>
              <a className="btn-primary" href="/" style={{ display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
                <span>Back to Home</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <p>© {new Date().getFullYear()} Mike E. Taylor</p>
      </footer>
    </>
  );
}
