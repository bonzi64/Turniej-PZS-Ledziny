"use client";

import { type ComponentProps, type ReactNode, useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { CheckIcon, CloseIcon } from "@/components/hx/icons";
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
        <p key={state.at} role="status" className={`flex basis-full items-center gap-1.5 text-[13px] ${state.ok ? "text-ui-ok" : "animate-shake text-ui-danger"}`}>
          {state.ok ? <CheckIcon size={13} /> : <CloseIcon size={13} />}
          {state.message}
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
      className={`ui-btn ${armed ? "animate-blink" : ""} ${className}`}
      {...rest}
    >
      {pending ? "..." : armed ? confirm : children}
    </button>
  );
}
