import type { Decorator, Preview } from "@storybook/nextjs-vite";
import { Inter } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { useEffect } from "react";
import { create } from "storybook/theming";
import { defaultLocale } from "../src/i18n/config";
import messages from "../src/i18n/messages/en.json";
import "../src/app/globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// --font-sans is declared on :root, so the Inter variable must live there too
// (the app does the same on <html> in the root layout).
document.documentElement.classList.add(inter.variable);

// Stories show fictional local times as written, so use the viewer's time zone.
const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

// Mirrors the app's root layout: translated strings plus lang/dir on <html>,
// with the direction switchable from the toolbar to check RTL layouts.

function AppShell({
  dir,
  children,
}: {
  dir: "ltr" | "rtl";
  children: React.ReactNode;
}) {
  useEffect(() => {
    document.documentElement.lang = defaultLocale;
    document.documentElement.dir = dir;
  }, [dir]);
  return (
    <NextIntlClientProvider locale={defaultLocale} messages={messages} timeZone={timeZone}>
      {children}
    </NextIntlClientProvider>
  );
}

const withAppShell: Decorator = (Story, context) => (
  <AppShell dir={context.globals.direction === "rtl" ? "rtl" : "ltr"}>
    <Story />
  </AppShell>
);

const preview: Preview = {
  decorators: [withAppShell],
  globalTypes: {
    direction: {
      description: "Text direction",
      toolbar: {
        title: "Direction",
        icon: "transfer",
        items: [
          { value: "ltr", title: "Left to right" },
          { value: "rtl", title: "Right to left" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    direction: "ltr",
    backgrounds: { value: "paper" },
  },
  parameters: {
    layout: "centered",
    backgrounds: {
      options: {
        paper: { name: "Paper", value: "#faf9f7" },
        surface: { name: "Surface", value: "#f4f2ef" },
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      theme: create({
        base: "light",
        appContentBg: "#faf9f7",
        fontBase: "var(--font-sans)",
        textColor: "#24211e",
      }),
    },
    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "error",
    },
  },
};

export default preview;
