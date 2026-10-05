"use client";

import { useState } from "react";
import { validatePass, type PassRecord } from "./data/passes";

type Status = "idle" | "loading" | "valid" | "invalid";

export default function PassValidator() {
  const [admissionNo, setAdmissionNo] = useState("");
  const [passId, setPassId] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [result, setResult] = useState<PassRecord | null>(null);

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!admissionNo.trim() || !passId.trim()) return;
    setStatus("loading");
    setResult(null);
    setTimeout(() => {
      const found = validatePass(admissionNo, passId);
      setResult(found);
      setStatus(found ? "valid" : "invalid");
    }, 700);
  };

  const handleReset = () => {
    setAdmissionNo("");
    setPassId("");
    setStatus("idle");
    setResult(null);
  };

  return (
    <div className="root">
      <div className="card">

        {/* Top accent bar */}
        <div className="accent-bar" />

        {/* Header */}
        <div className="header">
          <p className="event-tag">PILLAI HOC · 2026</p>
          <h1 className="jalsa-title">JALSA</h1>
        </div>

        {/* Divider */}
        <div className="rule">
          <span className="rule-line" />
          <span className="rule-diamond">◆</span>
          <span className="rule-line" />
        </div>

        {/* Form */}
        {status !== "valid" && status !== "invalid" && (
          <form id="pass-check-form" className="form" onSubmit={handleCheck}>
            <div className="field-wrap">
              <label className="field-label" htmlFor="admission-input">
                Admission Number
              </label>
              <div className={`field${admissionNo ? " has-value" : ""}`}>
                <svg className="f-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M12 2C9.24 2 7 4.24 7 7s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5z"/>
                  <path d="M21 21v-1a7 7 0 0 0-14 0v1"/>
                </svg>
                <input
                  id="admission-input"
                  type="text"
                  className="f-input"
                  placeholder="e.g. 2301001"
                  value={admissionNo}
                  onChange={(e) => setAdmissionNo(e.target.value)}
                  autoComplete="off"
                  autoFocus
                />
              </div>
            </div>

            <div className="field-wrap">
              <label className="field-label" htmlFor="pass-id-input">
                Pass ID
              </label>
              <div className={`field${passId ? " has-value" : ""}`}>
                <svg className="f-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="2" y="7" width="20" height="14" rx="2"/>
                  <path d="M16 7V5a4 4 0 0 0-8 0v2"/>
                  <circle cx="12" cy="14" r="1.5"/>
                </svg>
                <input
                  id="pass-id-input"
                  type="text"
                  className="f-input"
                  placeholder="e.g. JALSA-001"
                  value={passId}
                  onChange={(e) => setPassId(e.target.value)}
                  autoComplete="off"
                />
              </div>
            </div>

            <button
              id="validate-btn"
              type="submit"
              className={`submit-btn${status === "loading" ? " loading" : ""}`}
              disabled={status === "loading" || !admissionNo.trim() || !passId.trim()}
            >
              {status === "loading" ? (
                <span className="spinner" />
              ) : (
                <>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:16,height:16}}>
                    <path d="M9 12l2 2 4-4"/>
                    <circle cx="12" cy="12" r="10"/>
                  </svg>
                  Validate Pass
                </>
              )}
            </button>
          </form>
        )}

        {/* VALID */}
        {status === "valid" && result && (
          <div className="result-card valid-card" id="valid-result">
            <div className="result-badge valid-badge">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M20 6L9 17l-5-5"/>
              </svg>
            </div>
            <p className="result-title valid-title">Pass Validated</p>

            <div className="info-grid">
              <div className="info-item">
                <span className="info-key">Name</span>
                <span className="info-val">{result.name}</span>
              </div>
              <div className="info-item">
                <span className="info-key">Admission No.</span>
                <span className="info-val">{result.admissionNo}</span>
              </div>
              <div className="info-item">
                <span className="info-key">Pass ID</span>
                <span className="info-val">{result.passId}</span>
              </div>
              <div className="info-item">
                <span className="info-key">Event</span>
                <span className="info-val">{result.event}</span>
              </div>
              {result.seat && (
                <div className="info-item">
                  <span className="info-key">Seat</span>
                  <span className="info-val">{result.seat}</span>
                </div>
              )}
            </div>

            <button id="reset-btn-valid" className="ghost-btn" onClick={handleReset}>
              ← Check Another Pass
            </button>
          </div>
        )}

        {/* INVALID */}
        {status === "invalid" && (
          <div className="result-card invalid-card" id="invalid-result">
            <div className="result-badge invalid-badge">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </div>
            <p className="result-title invalid-title">Pass Not Found</p>
            <p className="result-desc">
              No record matched the provided Admission Number and Pass ID.
              Please verify the details and try again.
            </p>
            <button id="reset-btn-invalid" className="ghost-btn" onClick={handleReset}>
              ← Try Again
            </button>
          </div>
        )}

        {/* Footer */}

      </div>

      <style jsx>{`
        /* ── Root ─────────────────────────────────────────── */
        .root {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px 16px;
          background: #0a0a0f;
          background-image:
            radial-gradient(ellipse at 30% 20%, rgba(99,102,241,0.06) 0%, transparent 60%),
            radial-gradient(ellipse at 70% 80%, rgba(168,85,247,0.05) 0%, transparent 60%);
        }

        /* ── Card ─────────────────────────────────────────── */
        .card {
          width: 100%;
          max-width: 420px;
          background: #111118;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px;
          overflow: hidden;
          box-shadow:
            0 0 0 1px rgba(255,255,255,0.03),
            0 24px 60px rgba(0,0,0,0.7),
            0 8px 20px rgba(0,0,0,0.4);
          display: flex;
          flex-direction: column;
        }

        /* ── Top accent bar ───────────────────────────────── */
        .accent-bar {
          height: 3px;
          background: linear-gradient(90deg, #6366f1, #a855f7, #ec4899, #a855f7, #6366f1);
          background-size: 200% 100%;
          animation: slideGrad 4s linear infinite;
        }

        @keyframes slideGrad {
          0%   { background-position: 0% 0%; }
          100% { background-position: 200% 0%; }
        }

        /* ── Header ───────────────────────────────────────── */
        .header {
          padding: 32px 32px 0;
          text-align: center;
        }

        .event-tag {
          font-size: 0.65rem;
          font-weight: 600;
          letter-spacing: 3px;
          color: rgba(255,255,255,0.3);
          text-transform: uppercase;
          margin-bottom: 8px;
        }

        .jalsa-title {
          font-size: 3rem;
          font-weight: 900;
          letter-spacing: 10px;
          color: #fff;
          margin: 0;
          line-height: 1;
          font-family: 'Georgia', serif;
          background: linear-gradient(135deg, #e2e2ff 0%, #fff 40%, #c4b5fd 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .header-sub {
          font-size: 0.72rem;
          letter-spacing: 2.5px;
          color: rgba(255,255,255,0.25);
          text-transform: uppercase;
          margin-top: 8px;
        }

        /* ── Rule ─────────────────────────────────────────── */
        .rule {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 24px 32px 0;
        }

        .rule-line {
          flex: 1;
          height: 1px;
          background: rgba(255,255,255,0.07);
        }

        .rule-diamond {
          font-size: 0.5rem;
          color: #6366f1;
          opacity: 0.7;
        }

        /* ── Form ─────────────────────────────────────────── */
        .form {
          padding: 24px 32px 32px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .field-wrap {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .field-label {
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: rgba(255,255,255,0.35);
          padding-left: 4px;
        }

        .field {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #1a1a24;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
          padding: 0 16px;
          transition: border-color 0.2s, background 0.2s;
        }

        .field:focus-within {
          border-color: rgba(99,102,241,0.5);
          background: #1e1e2e;
        }

        .field.has-value {
          border-color: rgba(255,255,255,0.12);
        }

        .f-icon {
          width: 16px;
          height: 16px;
          color: rgba(255,255,255,0.2);
          flex-shrink: 0;
          transition: color 0.2s;
        }

        .field:focus-within .f-icon {
          color: #818cf8;
        }

        .f-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          padding: 13px 0;
          font-size: 0.92rem;
          color: #e8e8f0;
          letter-spacing: 0.5px;
          font-family: 'Consolas', 'Monaco', monospace;
        }

        .f-input::placeholder {
          color: rgba(255,255,255,0.18);
          font-family: inherit;
        }

        /* ── Submit button ────────────────────────────────── */
        .submit-btn {
          margin-top: 4px;
          width: 100%;
          padding: 13px;
          border-radius: 10px;
          border: none;
          cursor: pointer;
          background: linear-gradient(135deg, #6366f1, #7c3aed);
          color: #fff;
          font-size: 0.88rem;
          font-weight: 700;
          letter-spacing: 1px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: opacity 0.2s, transform 0.15s;
          box-shadow: 0 4px 16px rgba(99,102,241,0.3);
        }

        .submit-btn:hover:not(:disabled) {
          opacity: 0.9;
          transform: translateY(-1px);
          box-shadow: 0 6px 22px rgba(99,102,241,0.4);
        }

        .submit-btn:active:not(:disabled) {
          transform: translateY(0);
        }

        .submit-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .submit-btn.loading { pointer-events: none; }

        /* ── Spinner ──────────────────────────────────────── */
        .spinner {
          display: inline-block;
          width: 18px;
          height: 18px;
          border: 2.5px solid rgba(255,255,255,0.2);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.65s linear infinite;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        /* ── Result card ──────────────────────────────────── */
        .result-card {
          margin: 24px 32px 32px;
          border-radius: 12px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          animation: popIn 0.3s cubic-bezier(0.34,1.56,0.64,1);
        }

        @keyframes popIn {
          from { opacity: 0; transform: scale(0.92) translateY(8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }

        .valid-card {
          background: rgba(16, 185, 129, 0.08);
          border: 1px solid rgba(16,185,129,0.25);
        }

        .invalid-card {
          background: rgba(239,68,68,0.07);
          border: 1px solid rgba(239,68,68,0.22);
        }

        /* ── Badge ────────────────────────────────────────── */
        .result-badge {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .result-badge svg {
          width: 26px;
          height: 26px;
        }

        .valid-badge {
          background: rgba(16,185,129,0.15);
          border: 1.5px solid rgba(16,185,129,0.4);
          color: #34d399;
        }

        .invalid-badge {
          background: rgba(239,68,68,0.12);
          border: 1.5px solid rgba(239,68,68,0.35);
          color: #f87171;
        }

        .result-title {
          font-size: 1rem;
          font-weight: 800;
          letter-spacing: 2px;
          text-transform: uppercase;
        }

        .valid-title   { color: #34d399; }
        .invalid-title { color: #f87171; }

        /* ── Info grid ────────────────────────────────────── */
        .info-grid {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .info-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 12px;
          background: rgba(0,0,0,0.25);
          border-radius: 7px;
          border: 1px solid rgba(255,255,255,0.04);
          gap: 12px;
        }

        .info-key {
          font-size: 0.68rem;
          font-weight: 600;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: rgba(255,255,255,0.3);
          flex-shrink: 0;
        }

        .info-val {
          font-size: 0.88rem;
          font-weight: 600;
          color: #e8e8f0;
          text-align: right;
          font-family: 'Consolas', monospace;
        }

        /* ── Invalid desc ─────────────────────────────────── */
        .result-desc {
          font-size: 0.8rem;
          color: rgba(255,255,255,0.35);
          text-align: center;
          line-height: 1.7;
        }

        /* ── Ghost button ─────────────────────────────────── */
        .ghost-btn {
          background: transparent;
          border: 1px solid rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.4);
          border-radius: 8px;
          padding: 8px 20px;
          font-size: 0.78rem;
          letter-spacing: 0.5px;
          cursor: pointer;
          transition: border-color 0.2s, color 0.2s;
        }

        .ghost-btn:hover {
          border-color: rgba(99,102,241,0.4);
          color: #818cf8;
        }

        /* ── Footer ───────────────────────────────────────── */
        .footer-note {
          padding: 20px 32px 24px;
          text-align: center;
          font-size: 0.62rem;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: rgba(255,255,255,0.12);
        }

        /* ── Responsive ───────────────────────────────────── */
        @media (max-width: 480px) {
          .card        { border-radius: 0; border-left: none; border-right: none; }
          .jalsa-title { font-size: 2.4rem; }
          .form, .rule, .header { padding-left: 24px; padding-right: 24px; }
          .result-card { margin-left: 24px; margin-right: 24px; }
        }
      `}</style>
    </div>
  );
}
