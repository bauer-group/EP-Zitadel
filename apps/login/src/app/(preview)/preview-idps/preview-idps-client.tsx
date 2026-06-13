"use client";

import { SignInWithGeneric } from "@/components/idps/sign-in-with-generic";
import { setTheme } from "@/helpers/colors";
import { useEffect } from "react";

// Names chosen to exercise every entry in BRAND_ICONS (sign-in-with-generic.tsx)
// plus two non-matching names that fall through to the unchanged name-only
// upstream button — so the branded vs. fallback rendering is visible side by
// side. Keep this list in sync when BRAND_ICONS gains/loses a provider.
const MATCHING = [
  "Facebook",
  "Meta",
  "WeChat",
  "KakaoTalk",
  "Naver",
  "TikTok",
  "Weibo",
  "Zalo",
  "LINE",
  "QQ",
  "Tencent",
  "VK",
  "X",
  "Twitter",
];
const FALLBACK = ["Acme Corp SSO", "Keycloak"];
const NAMES = [...MATCHING, ...FALLBACK];

function Panel({ dark }: { dark: boolean }) {
  // darkMode is "class" (tailwind.config.mjs) and setTheme() writes BOTH the
  // light and dark CSS-variable sets onto documentElement, so a single page can
  // show both themes at once: this column just opts into the dark variant.
  return (
    <div className={dark ? "dark" : ""} style={{ flex: 1 }}>
      <div className="bg-background-light-600 dark:bg-background-dark-600 flex min-h-screen flex-col items-center justify-center p-8">
        <div className="w-full max-w-[440px]">
          <p className="ztdl-p mb-4 text-center">{dark ? "Dark theme" : "Light theme"} — or sign in with</p>
          <div className="flex w-full flex-col space-y-2 text-sm">
            {NAMES.map((name) => (
              <form key={name} className="flex" onSubmit={(e) => e.preventDefault()}>
                <SignInWithGeneric name={name} />
              </form>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function PreviewIdpsClient() {
  // setTheme writes the default --theme-* CSS variables (no backend branding) so
  // both the light and the dark column resolve their colours.
  useEffect(() => {
    setTheme(document);
  }, []);

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Panel dark={false} />
      <Panel dark={true} />
    </div>
  );
}
