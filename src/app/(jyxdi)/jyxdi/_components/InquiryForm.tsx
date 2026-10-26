'use client';

import { useState } from "react";
import { SITE } from "@/lib/jyxdi";
import { BUDGET_RANGES, EVENT_TYPES, type InquiryKind } from "@/lib/jyxdiInquiry";

type Status = { state: "idle" } | { state: "sending" } | { state: "sent" } | { state: "error"; message: string };

const inputClass =
  "w-full rounded-xl border border-[var(--jx-line)] bg-[var(--jx-surface)] px-4 py-3 text-base outline-none transition focus:border-[var(--jx-accent)] focus:ring-2 focus:ring-[var(--jx-accent-soft)]";

function Field({ label, htmlFor, required, children }: { label: string; htmlFor: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium">
        {label}
        {required && <span className="text-[var(--jx-accent)]"> *</span>}
      </label>
      {children}
    </div>
  );
}

export default function InquiryForm({ kind, artwork }: { kind: InquiryKind; artwork?: string }) {
  const [status, setStatus] = useState<Status>({ state: "idle" });
  const isLivePaint = kind === "live-paint";

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus({ state: "sending" });
    const data = Object.fromEntries(new FormData(event.currentTarget).entries());

    try {
      const response = await fetch("/api/jyxdi/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, kind }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "Something went wrong.");
      setStatus({ state: "sent" });
    } catch (error: any) {
      setStatus({ state: "error", message: error.message || "Something went wrong." });
    }
  }

  if (status.state === "sent") {
    return (
      <div className="rounded-2xl border border-[var(--jx-line)] bg-[var(--jx-surface)] p-6 text-center sm:p-8">
        <p className="jx-serif text-2xl">Thank you!</p>
        <p className="mt-2 text-[var(--jx-muted)]">
          Your request has been sent. You&apos;ll hear back by email soon, usually within a few days.
        </p>
      </div>
    );
  }

  const today = new Date().toISOString().slice(0, 10);

  return (
    <form onSubmit={onSubmit} className="space-y-5 rounded-2xl border border-[var(--jx-line)] bg-[var(--jx-surface)] p-5 sm:p-8">
      {/* Honeypot: hidden from people, often filled in by spam bots. */}
      <div aria-hidden="true" className="hidden">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name" htmlFor="name" required>
          <input id="name" name="name" required maxLength={120} autoComplete="name" className={inputClass} />
        </Field>
        <Field label="Email" htmlFor="email" required>
          <input id="email" name="email" type="email" required maxLength={200} autoComplete="email" className={inputClass} />
        </Field>
        <Field label="Phone" htmlFor="phone" required={isLivePaint}>
          <input id="phone" name="phone" type="tel" required={isLivePaint} maxLength={40} autoComplete="tel" className={inputClass} />
        </Field>
        <Field label="Budget" htmlFor="budget" required>
          <select id="budget" name="budget" required defaultValue="" className={inputClass}>
            <option value="" disabled>
              Choose a range
            </option>
            {BUDGET_RANGES.map((range) => (
              <option key={range}>{range}</option>
            ))}
          </select>
        </Field>
      </div>

      {isLivePaint ? (
        <>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Type of event" htmlFor="eventType" required>
              <select id="eventType" name="eventType" required defaultValue="" className={inputClass}>
                <option value="" disabled>
                  Choose one
                </option>
                {EVENT_TYPES.map((type) => (
                  <option key={type}>{type}</option>
                ))}
              </select>
            </Field>
            <Field label="Event date" htmlFor="eventDate" required>
              <input id="eventDate" name="eventDate" type="date" required min={today} className={inputClass} />
            </Field>
            <Field label="Start time" htmlFor="eventTime">
              <input id="eventTime" name="eventTime" type="time" className={inputClass} />
            </Field>
            <Field label="Number of guests" htmlFor="guests">
              <input id="guests" name="guests" type="number" min={1} max={100000} inputMode="numeric" className={inputClass} />
            </Field>
          </div>
          <Field label="Venue and address" htmlFor="location" required>
            <input id="location" name="location" required maxLength={300} placeholder="Venue name, street, city" className={inputClass} />
          </Field>
          <Field label="Event details" htmlFor="details" required>
            <textarea
              id="details"
              name="details"
              required
              rows={5}
              maxLength={4000}
              placeholder="What's the occasion? What would you like painted (the ceremony, first dance, guests, a scene)? Any canvas size or style in mind?"
              className={inputClass}
            />
          </Field>
        </>
      ) : (
        <>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Type of piece" htmlFor="pieceType" required>
              <select id="pieceType" name="pieceType" required defaultValue={artwork ? "Purchase an existing piece" : ""} className={inputClass}>
                <option value="" disabled>
                  Choose one
                </option>
                <option>Digital artwork</option>
                <option>Canvas painting</option>
                <option>Purchase an existing piece</option>
                <option>Not sure yet</option>
              </select>
            </Field>
            <Field label="Needed by" htmlFor="deadline">
              <input id="deadline" name="deadline" type="date" min={today} className={inputClass} />
            </Field>
          </div>
          <Field label="Tell me about your idea" htmlFor="details" required>
            <textarea
              id="details"
              name="details"
              required
              rows={6}
              maxLength={4000}
              defaultValue={artwork ? `I'm interested in "${artwork}".` : undefined}
              placeholder="Subject, size, colours, where it will hang or be used, and any reference photos you can share by email."
              className={inputClass}
            />
          </Field>
        </>
      )}

      {status.state === "error" && (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">
          {status.message} You can also email{" "}
          <a href={`mailto:${SITE.email}`} className="underline">
            {SITE.email}
          </a>
          .
        </p>
      )}

      <button
        type="submit"
        disabled={status.state === "sending"}
        className="w-full rounded-full bg-[var(--jx-ink)] px-6 py-3.5 font-medium text-[var(--jx-bg)] transition hover:opacity-90 disabled:opacity-60 sm:w-auto"
      >
        {status.state === "sending" ? "Sending…" : isLivePaint ? "Request a booking" : "Send request"}
      </button>
    </form>
  );
}
