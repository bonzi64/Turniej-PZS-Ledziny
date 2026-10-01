import type { Metadata } from "next";
import { Backdrop } from "@/components/shell/Backdrop";

export const metadata: Metadata = {
  title: { default: "Panel organizatora", template: "%s // Panel PZS E-SPORTS" },
  robots: { index: false, follow: false },
};

export default function AdminRoot({ children }: LayoutProps<"/admin">) {
  return (
    <>
      <Backdrop />
      {children}
    </>
  );
}
