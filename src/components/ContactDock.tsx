"use client";

import { useState } from "react";
import { shop, whatsappLink } from "@/lib/site";

export function ContactDock() {
  const [open, setOpen] = useState(false);
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-2">
      {open ? (
        <div className="mb-1 flex w-64 flex-col gap-2 rounded-3xl border border-navy/10 bg-white p-3 shadow-2xl">
          <a className="rounded-2xl bg-navy px-4 py-3 text-center font-semibold text-white" href={whatsappLink(`Hello ${shop.name}, I would like some help.`)}>
            WhatsApp
          </a>
          {shop.phones.map((phone) => (
            <a key={phone.tel} className="rounded-2xl bg-ice px-4 py-3 text-center font-semibold" href={`tel:${phone.tel}`}>
              Call {phone.display}
            </a>
          ))}
        </div>
      ) : null}
      <button
        type="button"
        className="pulse-ring relative grid h-16 w-16 place-items-center rounded-full bg-aqua text-navy shadow-xl"
        aria-expanded={open}
        aria-label={open ? "Close contact options" : "WhatsApp or call the shop"}
        onClick={() => setOpen((value) => !value)}
      >
        <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor" aria-hidden="true">
          <path d="M12 3a9 9 0 0 0-7.7 13.5L3 21l4.7-1.2A9 9 0 1 0 12 3zm4.8 12.7c-.2.6-1.2 1.1-1.7 1.1-.4 0-.9.1-3.1-.9-2.6-1.2-4.2-3.8-4.3-4-.1-.2-1-1.3-1-2.5s.6-1.8.9-2 .6-.4.8-.4h.6c.2 0 .4 0 .6.5.2.6.8 2 .8 2.1.1.2 0 .4-.1.5l-.4.5c-.1.2-.3.3-.1.6.2.3.7 1.2 1.6 1.9 1.1.9 2 1.1 2.3 1.3.3.1.4.1.6-.1l.5-.6c.2-.2.3-.2.6-.1l2 .9c.3.1.4.2.5.4.1.1.1.7-.1 1.3z" />
        </svg>
      </button>
    </div>
  );
}
