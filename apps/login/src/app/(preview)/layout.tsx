import "@/styles/globals.scss";
import React from "react";

// Minimal root layout for the dev-only UI preview routes (see ./README.md).
// Deliberately isolated from the (login) root layout so it does NOT call
// getServiceConfig() (which throws without ZITADEL_API_URL) or pull in the full
// login chrome — a preview must render without a ZITADEL backend.
export default function PreviewRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning>
      <head />
      <body>{children}</body>
    </html>
  );
}
