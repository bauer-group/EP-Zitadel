import { notFound } from "next/navigation";
import { PreviewIdpsClient } from "./preview-idps-client";

// Dev-only UI preview for the branded IdP buttons — see ../README.md.
//
// This page is a quick visual-validation harness, NOT a shipped feature. It is
// gated out of production builds: a deployed login (NODE_ENV=production) returns
// 404 so the page is never publicly reachable. The ENABLE_UI_PREVIEW escape
// hatch is the only way to expose it against a prod build (e.g. CI screenshots).
export const dynamic = "force-dynamic";

export default function PreviewIdpsPage() {
  if (process.env.NODE_ENV === "production" && process.env.ENABLE_UI_PREVIEW !== "true") {
    notFound();
  }

  return <PreviewIdpsClient />;
}
