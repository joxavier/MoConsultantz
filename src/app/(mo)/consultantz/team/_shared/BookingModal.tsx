"use client";

import { useState } from "react";

// Booking form for team pages, posting to /api/booking. `host` says who the
// meeting is with (see HOSTS in the booking route).
export type BookingService = { value: string; label: string };

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px",
  borderRadius: "10px",
  border: "1px solid rgba(138, 43, 226, 0.3)",
  background: "rgba(255, 255, 255, 0.1)",
  color: "#ffffff",
  fontSize: "16px",
  boxSizing: "border-box",
};
const labelStyle: React.CSSProperties = { display: "block", color: "#ffffff", marginBottom: "8px", fontSize: "14px", fontWeight: 600 };

export default function BookingModal({
  open,
  onClose,
  host,
  hostName,
  services,
}: {
  open: boolean;
  onClose: () => void;
  host: "joxavier" | "limelight";
  hostName: string;
  services: BookingService[];
}) {
  const [data, setData] = useState({ name: "", email: "", phone: "", date: "", time: "", service: services[0]?.value || "consultation" });
  const [status, setStatus] = useState<{ kind: "idle" | "sending" | "done" | "error"; message?: string }>({ kind: "idle" });

  if (!open) return null;

  const update = (key: keyof typeof data) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setData({ ...data, [key]: e.target.value });

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus({ kind: "sending" });
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, host }),
      });
      const payload = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(payload.error || "Something went wrong. Please try again.");
      setStatus({ kind: "done" });
    } catch (error: any) {
      setStatus({ kind: "error", message: error.message });
    }
  };

  const close = () => {
    setStatus({ kind: "idle" });
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-title"
      style={{ position: "fixed", inset: 0, background: "rgba(0, 0, 0, 0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "20px" }}
    >
      <div style={{ background: "linear-gradient(135deg, #1a1a1a, #2d1b69)", padding: "40px", borderRadius: "20px", width: "100%", maxWidth: "500px", maxHeight: "90vh", overflowY: "auto", border: "1px solid rgba(138, 43, 226, 0.3)", textAlign: "left" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <h2 id="booking-title" style={{ color: "#ffffff", fontSize: "24px", margin: 0 }}>Book a consultation with {hostName}</h2>
          <button onClick={close} aria-label="Close" style={{ background: "none", border: "none", color: "#ffffff", fontSize: "24px", cursor: "pointer", padding: "5px" }}>✕</button>
        </div>

        {status.kind === "done" ? (
          <div role="status" style={{ color: "#ffffff" }}>
            <p style={{ fontSize: "18px", marginBottom: "12px" }}>You&apos;re booked! 🎉</p>
            <p style={{ color: "#cccccc", marginBottom: "24px" }}>
              A confirmation with a calendar invite is on its way to {data.email}.
            </p>
            <button onClick={close} style={{ width: "100%", padding: "16px", borderRadius: "50px", border: "none", background: "linear-gradient(45deg, #8a2be2, #4169e1)", color: "#ffffff", fontSize: "16px", fontWeight: 600, cursor: "pointer" }}>
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={submit}>
            <div style={{ marginBottom: "20px" }}>
              <label htmlFor="booking-name" style={labelStyle}>Name *</label>
              <input id="booking-name" type="text" required maxLength={120} value={data.name} onChange={update("name")} style={inputStyle} />
            </div>
            <div style={{ marginBottom: "20px" }}>
              <label htmlFor="booking-email" style={labelStyle}>Email *</label>
              <input id="booking-email" type="email" required value={data.email} onChange={update("email")} style={inputStyle} />
            </div>
            <div style={{ marginBottom: "20px" }}>
              <label htmlFor="booking-phone" style={labelStyle}>Phone</label>
              <input id="booking-phone" type="tel" value={data.phone} onChange={update("phone")} style={inputStyle} />
            </div>
            <div style={{ display: "flex", gap: "15px", marginBottom: "20px" }}>
              <div style={{ flex: 1 }}>
                <label htmlFor="booking-date" style={labelStyle}>Date *</label>
                <input id="booking-date" type="date" required value={data.date} onChange={update("date")} style={inputStyle} />
              </div>
              <div style={{ flex: 1 }}>
                <label htmlFor="booking-time" style={labelStyle}>Time *</label>
                <input id="booking-time" type="time" required value={data.time} onChange={update("time")} style={inputStyle} />
              </div>
            </div>
            <div style={{ marginBottom: "30px" }}>
              <label htmlFor="booking-service" style={labelStyle}>Meeting type</label>
              <select id="booking-service" value={data.service} onChange={update("service")} style={inputStyle}>
                {services.map((service) => (
                  <option key={service.value} value={service.value}>{service.label}</option>
                ))}
              </select>
            </div>
            {status.kind === "error" && (
              <p role="alert" style={{ color: "#ffb4a2", marginBottom: "16px" }}>{status.message}</p>
            )}
            <button type="submit" disabled={status.kind === "sending"} style={{ width: "100%", padding: "16px", borderRadius: "50px", border: "none", background: "linear-gradient(45deg, #8a2be2, #4169e1)", color: "#ffffff", fontSize: "16px", fontWeight: 600, cursor: "pointer", opacity: status.kind === "sending" ? 0.6 : 1 }}>
              {status.kind === "sending" ? "Booking…" : "Book consultation"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
