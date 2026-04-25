"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import type { PublicSiteSettings } from "@/lib/site";
import { withDerivedSiteFields } from "@/lib/site";

type SiteSettingsContextValue = {
  settings: ReturnType<typeof withDerivedSiteFields>;
  setSettings: (settings: PublicSiteSettings) => void;
};

const SiteSettingsContext = createContext<SiteSettingsContextValue | undefined>(undefined);

export function SiteSettingsProvider({
  children,
  initialSettings,
}: {
  children: React.ReactNode;
  initialSettings: PublicSiteSettings;
}) {
  const [settings, setSettingsState] = useState(withDerivedSiteFields(initialSettings));

  useEffect(() => {
    let cancelled = false;

    const syncLatestSettings = async () => {
      try {
        const response = await fetch("/api/site-settings/public", { cache: "no-store" });
        if (!response.ok) return;
        const latest = (await response.json()) as PublicSiteSettings;
        if (!cancelled) {
          setSettingsState(withDerivedSiteFields(latest));
        }
      } catch {
        // ignore refresh failures and keep initial settings
      }
    };

    syncLatestSettings();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <SiteSettingsContext.Provider
      value={{
        settings,
        setSettings: (nextSettings) => setSettingsState(withDerivedSiteFields(nextSettings)),
      }}
    >
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  const context = useContext(SiteSettingsContext);
  if (!context) {
    throw new Error("useSiteSettings must be used within a SiteSettingsProvider");
  }
  return context;
}
