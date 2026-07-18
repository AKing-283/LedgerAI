import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { decodeToken } from "../services/api";

const MONO = { fontFamily: '"IBM Plex Mono", monospace' };

function SignatureVisual() {
  return (
    <div
      style={{
        width: "380px",
        maxWidth: "100%",
        position: "relative",
        flexShrink: 0,
      }}
    >
      {/* Invoice card — tilted left */}
      <div
        style={{
          position: "absolute",
          left: "0",
          top: "10px",
          width: "160px",
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "12px",
          padding: "14px 16px",
          transform: "rotate(-6deg)",
          zIndex: 1,
        }}
      >
        <div
          style={{
            ...MONO,
            fontSize: "10px",
            color: "rgba(255,255,255,0.25)",
            lineHeight: 1.8,
          }}
        >
          <div>INV-2847</div>
          <div>Sharma & Assoc.</div>
          <div>₹42,500.00</div>
          <div>GSTIN: 27AAAC</div>
          <div>12 Mar 2026</div>
        </div>
      </div>

      {/* Connecting dots */}
      <div
        style={{
          position: "absolute",
          left: "148px",
          top: "50px",
          display: "flex",
          gap: "6px",
          zIndex: 2,
        }}
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "#818cf8",
              animation: `pulseDot 1.5s ease-in-out ${i * 0.3}s infinite`,
            }}
          />
        ))}
      </div>

      {/* Structured table — right side */}
      <div
        style={{
          position: "absolute",
          right: "0",
          top: "0",
          width: "200px",
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "12px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "0",
            fontSize: "9px",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "8px 10px",
              color: "rgba(255,255,255,0.35)",
              fontWeight: 500,
              fontSize: "8px",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            Vendor
          </div>
          <div
            style={{
              padding: "8px 10px",
              color: "rgba(255,255,255,0.35)",
              fontWeight: 500,
              fontSize: "8px",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            Sharma & Assoc.
          </div>

          {/* Row 2 */}
          <div
            style={{
              padding: "8px 10px",
              color: "rgba(255,255,255,0.35)",
              fontWeight: 500,
              fontSize: "8px",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            Invoice #
          </div>
          <div
            style={{
              ...MONO,
              padding: "8px 10px",
              color: "rgba(255,255,255,0.7)",
              fontSize: "9px",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            INV-2847
          </div>

          {/* Row 3 */}
          <div
            style={{
              padding: "8px 10px",
              color: "rgba(255,255,255,0.35)",
              fontWeight: 500,
              fontSize: "8px",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            GST
          </div>
          <div
            style={{
              ...MONO,
              padding: "8px 10px",
              color: "rgba(255,255,255,0.7)",
              fontSize: "9px",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            27AAAC...
          </div>

          {/* Row 4 */}
          <div
            style={{
              padding: "8px 10px",
              color: "rgba(255,255,255,0.35)",
              fontWeight: 500,
              fontSize: "8px",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Amount
          </div>
          <div
            style={{
              ...MONO,
              padding: "8px 10px",
              color: "rgba(255,255,255,0.7)",
              fontSize: "9px",
            }}
          >
            ₹42,500
          </div>
        </div>
      </div>
    </div>
  );
}

function StepCard({ number, title, children }) {
  return (
    <div
      className="glass-card"
      style={{
        padding: "32px",
        position: "relative",
        overflow: "hidden",
        flex: "1",
        minWidth: "240px",
      }}
    >
      <div
        style={{
          ...MONO,
          fontSize: "64px",
          fontWeight: 500,
          color: "rgba(255,255,255,0.06)",
          position: "absolute",
          top: "8px",
          right: "16px",
          lineHeight: 1,
          userSelect: "none",
        }}
      >
        {number}
      </div>
      <h3
        style={{
          fontSize: "18px",
          fontWeight: 600,
          marginBottom: "10px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {title}
      </h3>
      <p
        style={{
          color: "rgba(255,255,255,0.55)",
          fontSize: "14px",
          lineHeight: 1.6,
          position: "relative",
          zIndex: 1,
        }}
      >
        {children}
      </p>
    </div>
  );
}

function FeatureCard({ title, children }) {
  return (
    <div
      className="glass-card"
      style={{
        padding: "28px",
        flex: "1",
        minWidth: "240px",
      }}
    >
      <h3
        style={{
          fontSize: "16px",
          fontWeight: 600,
          marginBottom: "10px",
        }}
      >
        {title}
      </h3>
      <p
        style={{
          color: "rgba(255,255,255,0.55)",
          fontSize: "14px",
          lineHeight: 1.6,
        }}
      >
        {children}
      </p>
    </div>
  );
}

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [userEmail, setUserEmail] = useState(null);
  const heroRef = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = decodeToken();
      if (decoded && decoded.email) {
        setUserEmail(decoded.email);
      }
    }
  }, []);

  return (
    <div
      style={{
        background: "#0F172A",
        minHeight: "100vh",
      }}
    >
      {/* ─── NAV ─── */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          padding: "16px 40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          transition: "background 0.3s ease, backdrop-filter 0.3s ease",
          background: scrolled
            ? "rgba(15,23,42,0.85)"
            : "transparent",
          backdropFilter: scrolled ? "blur(16px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(16px)" : "none",
        }}
      >
        <Link
          to="/"
          className="gradient-text"
          style={{
            fontSize: "20px",
            fontWeight: 700,
            letterSpacing: "0.3px",
          }}
        >
          LedgerAI
        </Link>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            flexWrap: "wrap",
            justifyContent: "flex-end",
          }}
        >
          <Link
            to="/about"
            style={{
              color: "rgba(255,255,255,0.6)",
              fontSize: "14px",
              fontWeight: 500,
              outlineOffset: "4px",
            }}
          >
            About
          </Link>

          <Link
            to="/dashboard"
            style={{
              color: "rgba(255,255,255,0.6)",
              fontSize: "14px",
              fontWeight: 500,
              outlineOffset: "4px",
            }}
          >
            Dashboard
          </Link>

          {userEmail ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                background: "rgba(255,255,255,0.05)",
                padding: "8px 16px",
                borderRadius: "14px",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <span
                style={{
                  color: "rgba(255,255,255,0.7)",
                  fontSize: "13px",
                  fontWeight: 500,
                }}
              >
                {userEmail}
              </span>
            </div>
          ) : (
            <>
              <Link
                to="/login"
                style={{
                  color: "#818cf8",
                  fontSize: "14px",
                  fontWeight: 500,
                  outlineOffset: "4px",
                }}
              >
                Log in
              </Link>

              <Link
                to="/register"
                className="btn-primary"
                style={{
                  padding: "10px 22px",
                  fontSize: "14px",
                  display: "inline-block",
                  textDecoration: "none",
                  outlineOffset: "2px",
                }}
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section
        ref={heroRef}
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "80px 40px 100px",
          display: "flex",
          alignItems: "center",
          gap: "60px",
        }}
      >
        {/* Left column */}
        <div
          style={{
            flex: "1",
            minWidth: 0,
          }}
        >
          {/* Eyebrow */}
          <p
            style={{
              fontSize: "12px",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              color: "rgba(255,255,255,0.4)",
              marginBottom: "20px",
              animation: "fadeSlideUp 0.4s ease both",
            }}
          >
            Built for Indian CA firms
          </p>

          {/* Headline */}
          <h1
            className="gradient-text"
            style={{
              fontSize: "clamp(34px, 5vw, 52px)",
              fontWeight: 700,
              lineHeight: 1.1,
              marginBottom: "20px",
              animation: "fadeSlideUp 0.4s ease 0.1s both",
            }}
          >
            Stop digging through PDFs for answers your firm already has.
          </h1>

          {/* Subheadline */}
          <p
            style={{
              color: "rgba(255,255,255,0.6)",
              fontSize: "clamp(15px, 1.6vw, 18px)",
              lineHeight: 1.6,
              maxWidth: "480px",
              marginBottom: "36px",
              animation: "fadeSlideUp 0.4s ease 0.2s both",
            }}
          >
            Upload invoices and GST documents once. Ask LedgerAI plain-English
            questions and get instant, cited answers across every client,
            every filing.
          </p>

          {/* CTAs */}
          <div
            style={{
              display: "flex",
              gap: "16px",
              flexWrap: "wrap",
              animation: "fadeSlideUp 0.4s ease 0.3s both",
            }}
          >
            {userEmail ? (
              <Link
                to="/dashboard"
                className="btn-primary"
                style={{
                  padding: "14px 36px",
                  fontSize: "15px",
                  display: "inline-block",
                  textDecoration: "none",
                  outlineOffset: "2px",
                }}
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="btn-primary"
                  style={{
                    padding: "14px 36px",
                    fontSize: "15px",
                    display: "inline-block",
                    textDecoration: "none",
                    outlineOffset: "2px",
                  }}
                >
                  Start free
                </Link>

                <Link
                  to="/login"
                  style={{
                    padding: "14px 36px",
                    fontSize: "15px",
                    borderRadius: "14px",
                    border: "1px solid rgba(255,255,255,0.15)",
                    background: "transparent",
                    color: "white",
                    fontWeight: 500,
                    display: "inline-block",
                    textDecoration: "none",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    outlineOffset: "2px",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#818cf8";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
                  }}
                >
                  Log in
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Right column — signature visual */}
        <div
          style={{
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            animation: "fadeSlideUp 0.4s ease 0.15s both",
          }}
        >
          <div
            style={{
              position: "relative",
              width: "380px",
              maxWidth: "100%",
              height: "160px",
            }}
          >
            <SignatureVisual />
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 40px 100px",
        }}
      >
        <h2
          className="gradient-text"
          style={{
            fontSize: "clamp(24px, 3vw, 32px)",
            fontWeight: 700,
            textAlign: "center",
            marginBottom: "48px",
          }}
        >
          How it works
        </h2>

        <div
          style={{
            display: "flex",
            gap: "24px",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <StepCard number="01" title="Upload">
            Drop in invoices, receipts, and GST filings. PDFs, scans, whatever
            you've got.
          </StepCard>

          <StepCard number="02" title="LedgerAI reads them">
            Every document is parsed, extracted, and indexed — vendor, amount,
            GST number, invoice date, all of it.
          </StepCard>

          <StepCard number="03" title="Ask anything">
            "Did we pay Sharma & Associates in March?" Get a direct answer,
            with the source document linked.
          </StepCard>
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 40px 100px",
        }}
      >
        <h2
          className="gradient-text"
          style={{
            fontSize: "clamp(24px, 3vw, 32px)",
            fontWeight: 700,
            textAlign: "center",
            marginBottom: "48px",
          }}
        >
          Built for the way CA firms work
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "24px",
          }}
        >
          <FeatureCard title="Multi-tenant by design">
            Every client's documents stay isolated. Built for firms managing
            dozens of organizations at once.
          </FeatureCard>

          <FeatureCard title="GST-aware extraction">
            Understands Indian invoice formats and GST numbers out of the box,
            not generic OCR guesswork.
          </FeatureCard>

          <FeatureCard title="Cited answers, not guesses">
            Every response points back to the actual document it came from, so
            you can verify before you file.
          </FeatureCard>

          <FeatureCard title="Your data, your infra">
            Deployed on your own cloud nothing about your clients' financials
            sits on a shared server you don't control.
          </FeatureCard>
        </div>
      </section>

      {/* ─── CLOSING CTA ─── */}
      <section
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 40px 100px",
        }}
      >
        <div
          className="glass-card"
          style={{
            padding: "64px 40px",
            textAlign: "center",
          }}
        >
          <h2
            className="gradient-text"
            style={{
              fontSize: "clamp(24px, 3vw, 36px)",
              fontWeight: 700,
              marginBottom: "32px",
            }}
          >
            See what's actually in your ledgers.
          </h2>

          <Link
            to="/register"
            className="btn-primary"
            style={{
              padding: "14px 40px",
              fontSize: "15px",
              display: "inline-block",
              textDecoration: "none",
              outlineOffset: "2px",
            }}
          >
            Start free
          </Link>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "24px 40px 40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <p
          style={{
            color: "rgba(255,255,255,0.3)",
            fontSize: "13px",
          }}
        >
          LedgerAI &copy; 2026
        </p>

        <p
          style={{
            color: "rgba(255,255,255,0.3)",
            fontSize: "13px",
          }}
        >
          <span style={{ color: "rgba(255,255,255,0.2)" }}>Contact: </span>
          <a
            href="mailto:amrutamai.in@gmail.com"
            style={{
              color: "#818cf8",
              textDecoration: "none",
            }}
          >
            amrutamai.in@gmail.com
          </a>
        </p>
      </footer>
    </div>
  );
}