"use client";

import type { ComponentProps } from "react";
import { openTab } from "@/components/vgui/tab-store";

export function TabLink({ tab, onClick, ...props }: ComponentProps<"a"> & { tab: string }) {
  return (
    <a
      href={`#${tab}`}
      data-sfx=""
      {...props}
      onClick={(event) => {
        event.preventDefault();
        onClick?.(event);
        openTab(tab);
        document.getElementById("okno")?.scrollIntoView({ block: "start" });
      }}
    />
  );
}
