"use client";

import { type ComponentProps, type ReactNode, useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import type { ActionResult } from "@/lib/action-result";

type ServerAction = (prev: ActionResult | null, form: FormData) => Promise<ActionResult>;

export function ActionForm({
  action,
  children,
  className = "",
  quiet = false,
}: {
  action: ServerAction;
  children: ReactNode;
  className?: string;
  quiet?: boolean;
}) {
  const [state, formAction] = useActionState(action, null);

  return (
    <form action={formAction} className={className}>
      {children}
      {state && !(quiet && state.ok) && (
        <p key={state.at} role="status" className={`basis-full text-[11px] ${state.ok ? "text-vg-green" : "animate-shake text-[#ff9f8a]"}`}>
          {state.ok ? "✓" : "✕"} {state.message}
        </p>
      )}
    </form>
  );
}

export function Submit({
  children,
  tone,
  confirm,
  className = "",
  disabled,
  ...rest
}: Omit<ComponentProps<"button">, "type" | "onClick"> & { tone?: "gold" | "danger" | "default"; confirm?: string }) {
  const { pending } = useFormStatus();
  const [armed, setArmed] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  return (
    <button
      type="submit"
      data-sfx=""
      data-tone={armed ? "danger" : tone}
      data-default={armed ? "" : undefined}
      disabled={pending || disabled}
      onClick={(event) => {
        if (!confirm || armed) return;
        event.preventDefault();
        setArmed(true);
        timer.current = setTimeout(() => setArmed(false), 4000);
      }}
      className={`vg-btn ${armed ? "animate-blink" : ""} ${className}`}
      {...rest}
    >
      {pending ? "..." : armed ? confirm : children}
    </button>
  );
}
