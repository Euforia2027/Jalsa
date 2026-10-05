"use client";

import { useState, useEffect, useRef } from "react";

type Status = "idle" | "loading" | "valid" | "duplicate" | "invalid" | "error";

interface StudentResult {
  id: string;
  name: string;
  passNo: string | number;
}

export default function PassValidator() {
  const [admissionNo, setAdmissionNo] = useState("");
  const [passNo, setPassNo] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [student, setStudent] = useState<StudentResult | null>(null);
  const [errMsg, setErrMsg] = useState("");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-dismiss after 3 seconds
  useEffect(() => {
    if (["valid", "duplicate", "invalid", "error"].includes(status)) {
      timerRef.current = setTimeout(() => {
        setStatus("idle");
        setStudent(null);
        setErrMsg("");
      }, 3000);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [status]);

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!admissionNo.trim() || !passNo.trim()) return;

    setStatus("loading");
    setStudent(null);
    setErrMsg("");

    try {
      const res = await fetch("/api/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ admissionNo: admissionNo.trim(), passNo: passNo.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrMsg(data.error ?? "Something went wrong.");
        setStatus("error");
        return;
      }

      if (!data.found) {
        setStatus("invalid");
        return;
      }

      setStudent(data.student);
      setStatus(data.alreadyChecked ? "duplicate" : "valid");
      // Clear admission input, auto-increment pass number by 1
      setAdmissionNo("");
      const currentPass = parseInt(passNo, 10);
      setPassNo(isNaN(currentPass) ? "1" : String(currentPass + 1));
    } catch {
      setErrMsg("Network error. Is the server running?");
      setStatus("error");
    }
  };

  const dismissToast = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setStatus("idle");
    setStudent(null);
    setErrMsg("");
  };

  const isToastShown = ["valid", "duplicate", "invalid", "error"].includes(status);

  return (
    <div className="root">
      <div className="card">
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

        {/* Form — always visible */}
        <form id="pass-check-form" className="form" onSubmit={handleCheck}>
          <div className="field-wrap">
            <label className="field-label" htmlFor="admission-input">
              Admission Number
            </label>
            <div className={`field${admissionNo ? " has-value" : ""}`}>
              <svg className="f-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M12 2C9.24 2 7 4.24 7 7s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5z" />
                <path d="M21 21v-1a7 7 0 0 0-14 0v1" />
              </svg>
              <input
                id="admission-input"
                type="text"
                className="f-input"
                placeholder="e.g. 2021HA0001"
                value={admissionNo}
                onChange={(e) => setAdmissionNo(e.target.value)}
                autoComplete="off"
                autoFocus
              />
            </div>
          </div>

          <div className="field-wrap">
            <label className="field-label" htmlFor="pass-input">
              Pass Number
            </label>
            <div className={`field${passNo ? " has-value" : ""}`}>
              <svg className="f-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 0 0-2 2v3a2 2 0 1 1 0 4v3a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-3a2 2 0 1 1 0-4V7a2 2 0 0 0-2-2H5z" />
              </svg>
              <input
                id="pass-input"
                type="text"
                className="f-input"
                placeholder="e.g. 1"
                value={passNo}
                onChange={(e) => setPassNo(e.target.value)}
                autoComplete="off"
              />
            </div>
          </div>

          <button
            id="validate-btn"
            type="submit"
            className={`submit-btn${status === "loading" ? " loading" : ""}`}
            disabled={status === "loading" || !admissionNo.trim() || !passNo.trim()}
          >
            {status === "loading" ? (
              <span className="spinner" />
            ) : (
              <>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 16, height: 16 }}>
                  <path d="M9 12l2 2 4-4" />
                  <circle cx="12" cy="12" r="10" />
                </svg>
                Validate Pass
              </>
            )}
          </button>
        </form>

        {/* ── Toast Message Area ── */}
        {isToastShown && (
          <div className={`toast toast-${status}`} id={`toast-${status}`}>
            <div className="toast-body">
              {/* Icon */}
              <div className={`toast-icon toast-icon-${status}`}>
                {status === "valid" && (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                )}
                {status === "duplicate" && (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M12 9v4M12 17h.01" />
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                )}
                {(status === "invalid" || status === "error") && (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                )}
              </div>

              {/* Content */}
              <div className="toast-content">
                {status === "valid" && student && (
                  <>
                    <p className="toast-title valid-title">Entry Granted</p>
                    <div className="toast-details">
                      <span>Pass #{student.passNo}</span>
                      <span className="toast-sep">·</span>
                      <span>{student.id}</span>
                      <span className="toast-sep">·</span>
                      <span>{student.name}</span>
                    </div>
                  </>
                )}
                {status === "duplicate" && student && (
                  <>
                    <p className="toast-title duplicate-title">Already Checked In</p>
                    <div className="toast-details">
                      <span>Pass #{student.passNo}</span>
                      <span className="toast-sep">·</span>
                      <span>{student.id}</span>
                      <span className="toast-sep">·</span>
                      <span>{student.name}</span>
                    </div>
                  </>
                )}
                {status === "invalid" && (
                  <>
                    <p className="toast-title invalid-title">Not Found</p>
                    <p className="toast-sub">No matching record. Check the admission number.</p>
                  </>
                )}
                {status === "error" && (
                  <>
                    <p className="toast-title invalid-title">Error</p>
                    <p className="toast-sub">{errMsg}</p>
                  </>
                )}
              </div>

              {/* Dismiss */}
              <button className="toast-close" onClick={dismissToast} aria-label="Dismiss">×</button>
            </div>

            {/* Countdown progress bar */}
            <div className="toast-progress">
              <div className={`toast-progress-bar progress-${status}`} />
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
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
        }

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
          margin: 0;
          line-height: 1;
          font-family: 'Georgia', serif;
          background: linear-gradient(135deg, #e2e2ff 0%, #fff 40%, #c4b5fd 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .rule {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 24px 32px 0;
        }
        .rule-line    { flex: 1; height: 1px; background: rgba(255,255,255,0.07); }
        .rule-diamond { font-size: 0.5rem; color: #6366f1; opacity: 0.7; }

        /* ── Form ── */
        .form {
          padding: 24px 32px 32px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .field-wrap { display: flex; flex-direction: column; gap: 6px; }
        .field-label {
          font-size: 0.7rem; font-weight: 600; letter-spacing: 1.5px;
          text-transform: uppercase; color: rgba(255,255,255,0.35); padding-left: 4px;
        }
        .field {
          display: flex; align-items: center; gap: 10px;
          background: #1a1a24; border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px; padding: 0 16px;
          transition: border-color 0.2s, background 0.2s;
        }
        .field:focus-within { border-color: rgba(99,102,241,0.5); background: #1e1e2e; }
        .field.has-value    { border-color: rgba(255,255,255,0.12); }
        .f-icon {
          width: 16px; height: 16px; color: rgba(255,255,255,0.2);
          flex-shrink: 0; transition: color 0.2s;
        }
        .field:focus-within .f-icon { color: #818cf8; }
        .f-input {
          flex: 1; background: transparent; border: none; outline: none;
          padding: 13px 0; font-size: 0.92rem; color: #e8e8f0;
          letter-spacing: 0.5px; font-family: 'Consolas','Monaco', monospace;
        }
        .f-input::placeholder { color: rgba(255,255,255,0.18); }

        /* ── Submit button ── */
        .submit-btn {
          width: 100%; padding: 13px; border-radius: 10px; border: none;
          cursor: pointer;
          background: linear-gradient(135deg, #6366f1, #7c3aed);
          color: #fff; font-size: 0.88rem; font-weight: 700; letter-spacing: 1px;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: opacity 0.2s, transform 0.15s;
          box-shadow: 0 4px 16px rgba(99,102,241,0.3);
        }
        .submit-btn:hover:not(:disabled) {
          opacity: 0.9; transform: translateY(-1px);
          box-shadow: 0 6px 22px rgba(99,102,241,0.4);
        }
        .submit-btn:active:not(:disabled) { transform: translateY(0); }
        .submit-btn:disabled { opacity: 0.3; cursor: not-allowed; }
        .submit-btn.loading { pointer-events: none; }

        /* ── Spinner ── */
        .spinner {
          display: inline-block; width: 18px; height: 18px;
          border: 2.5px solid rgba(255,255,255,0.2); border-top-color: #fff;
          border-radius: 50%; animation: spin 0.65s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* ── Toast messages ── */
        .toast {
          margin: 0 16px 16px;
          border-radius: 12px;
          overflow: hidden;
          animation: slideUp 0.3s cubic-bezier(0.34,1.56,0.64,1);
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .toast-valid     { background: rgba(16,185,129,0.08); border: 1px solid rgba(16,185,129,0.25); }
        .toast-duplicate { background: rgba(234,179,8,0.07);  border: 1px solid rgba(234,179,8,0.25); }
        .toast-invalid   { background: rgba(239,68,68,0.07);  border: 1px solid rgba(239,68,68,0.22); }
        .toast-error     { background: rgba(239,68,68,0.07);  border: 1px solid rgba(239,68,68,0.22); }

        .toast-body {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 14px 16px;
        }

        .toast-icon {
          width: 36px; height: 36px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .toast-icon svg { width: 18px; height: 18px; }
        .toast-icon-valid     { background: rgba(16,185,129,0.15); border: 1.5px solid rgba(16,185,129,0.4); color: #34d399; }
        .toast-icon-duplicate { background: rgba(234,179,8,0.15);  border: 1.5px solid rgba(234,179,8,0.4);  color: #fbbf24; }
        .toast-icon-invalid   { background: rgba(239,68,68,0.12);  border: 1.5px solid rgba(239,68,68,0.35); color: #f87171; }
        .toast-icon-error     { background: rgba(239,68,68,0.12);  border: 1.5px solid rgba(239,68,68,0.35); color: #f87171; }

        .toast-content {
          flex: 1;
          min-width: 0;
        }
        .toast-title {
          font-size: 0.82rem; font-weight: 800; letter-spacing: 1.5px;
          text-transform: uppercase; margin: 0 0 4px;
        }
        .valid-title     { color: #34d399; }
        .duplicate-title { color: #fbbf24; }
        .invalid-title   { color: #f87171; }

        .toast-details {
          font-size: 0.78rem; color: rgba(255,255,255,0.55);
          font-family: 'Consolas', monospace;
          display: flex; flex-wrap: wrap; gap: 4px; align-items: center;
        }
        .toast-sep { color: rgba(255,255,255,0.15); }

        .toast-sub {
          font-size: 0.75rem; color: rgba(255,255,255,0.35);
          margin: 0; line-height: 1.5;
        }

        .toast-close {
          background: none; border: none; color: rgba(255,255,255,0.25);
          font-size: 1.2rem; cursor: pointer; padding: 0 2px;
          line-height: 1; flex-shrink: 0;
          transition: color 0.2s;
        }
        .toast-close:hover { color: rgba(255,255,255,0.6); }

        /* ── Countdown progress bar ── */
        .toast-progress {
          height: 3px;
          background: rgba(255,255,255,0.05);
        }
        .toast-progress-bar {
          height: 100%;
          animation: countdown 3s linear forwards;
        }
        .progress-valid     { background: #34d399; }
        .progress-duplicate { background: #fbbf24; }
        .progress-invalid   { background: #f87171; }
        .progress-error     { background: #f87171; }

        @keyframes countdown {
          from { width: 100%; }
          to   { width: 0%; }
        }

        @media (max-width: 480px) {
          .card        { border-radius: 0; border-left: none; border-right: none; }
          .jalsa-title { font-size: 2.4rem; }
          .form, .rule, .header { padding-left: 24px; padding-right: 24px; }
          .toast { margin-left: 12px; margin-right: 12px; }
        }
      `}</style>
    </div>
  );
}
