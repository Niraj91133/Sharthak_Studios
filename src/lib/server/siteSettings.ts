import "server-only";

import { promises as fs } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import {
  DEFAULT_PUBLIC_SITE_SETTINGS,
  type PublicSiteSettings,
  buildInstagramUrl,
  ensureInstagramHandle,
  normalizeDigits,
  withDerivedSiteFields,
} from "@/lib/site";

type StoredAdminSettings = {
  username: string;
  passwordHash: string;
  passwordSalt: string;
  updatedAt: string;
};

type StoredSiteSettings = {
  public: PublicSiteSettings;
  admin: StoredAdminSettings;
};

export type AdminSettingsInput = {
  username?: string;
  currentPassword?: string;
  newPassword?: string;
};

const DATA_DIR = path.join(process.cwd(), "data");
const SETTINGS_FILE = path.join(DATA_DIR, "site-settings.json");

function hashPassword(password: string, salt: string) {
  return crypto.scryptSync(password, salt, 64).toString("hex");
}

function createHashedPassword(password: string) {
  const salt = crypto.randomBytes(16).toString("hex");
  return {
    passwordSalt: salt,
    passwordHash: hashPassword(password, salt),
  };
}

function sanitizePublicSettings(input: Partial<PublicSiteSettings>): PublicSiteSettings {
  const next: PublicSiteSettings = {
    ...DEFAULT_PUBLIC_SITE_SETTINGS,
    ...input,
  };

  return {
    ...next,
    name: String(next.name || DEFAULT_PUBLIC_SITE_SETTINGS.name).trim().slice(0, 120),
    legalName: String(next.legalName || next.name || DEFAULT_PUBLIC_SITE_SETTINGS.legalName).trim().slice(0, 120),
    founder: String(next.founder || DEFAULT_PUBLIC_SITE_SETTINGS.founder).trim().slice(0, 120),
    phoneDisplay: String(next.phoneDisplay || DEFAULT_PUBLIC_SITE_SETTINGS.phoneDisplay).trim().slice(0, 40),
    phoneDigits: normalizeDigits(String(next.phoneDigits || next.phoneDisplay || DEFAULT_PUBLIC_SITE_SETTINGS.phoneDigits)),
    whatsappNumber: normalizeDigits(String(next.whatsappNumber || next.phoneDigits || next.phoneDisplay || DEFAULT_PUBLIC_SITE_SETTINGS.whatsappNumber)),
    email: String(next.email || DEFAULT_PUBLIC_SITE_SETTINGS.email).trim().slice(0, 120),
    instagramUrl: buildInstagramUrl(String(next.instagramUrl || DEFAULT_PUBLIC_SITE_SETTINGS.instagramUrl).trim()),
    instagramHandle: ensureInstagramHandle(String(next.instagramHandle || DEFAULT_PUBLIC_SITE_SETTINGS.instagramHandle).trim()),
    addressLine1: String(next.addressLine1 || DEFAULT_PUBLIC_SITE_SETTINGS.addressLine1).trim().slice(0, 200),
    city: String(next.city || DEFAULT_PUBLIC_SITE_SETTINGS.city).trim().slice(0, 120),
    state: String(next.state || DEFAULT_PUBLIC_SITE_SETTINGS.state).trim().slice(0, 120),
    postalCode: String(next.postalCode || DEFAULT_PUBLIC_SITE_SETTINGS.postalCode).trim().slice(0, 20),
    country: String(next.country || DEFAULT_PUBLIC_SITE_SETTINGS.country).trim().slice(0, 2).toUpperCase(),
    serviceAreas: Array.isArray(next.serviceAreas)
      ? next.serviceAreas
          .map((item) => String(item || "").trim())
          .filter(Boolean)
          .slice(0, 20)
      : DEFAULT_PUBLIC_SITE_SETTINGS.serviceAreas,
  };
}

async function ensureSettingsFile() {
  try {
    await fs.access(SETTINGS_FILE);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
    const seedPassword = process.env.ADMIN_PASS?.trim() || "admin1234";
    const seedUsername = process.env.ADMIN_USER?.trim() || "admin";
    const seeded: StoredSiteSettings = {
      public: DEFAULT_PUBLIC_SITE_SETTINGS,
      admin: {
        username: seedUsername,
        ...createHashedPassword(seedPassword),
        updatedAt: new Date().toISOString(),
      },
    };
    await fs.writeFile(SETTINGS_FILE, JSON.stringify(seeded, null, 2), "utf8");
  }
}

async function readStoredSettings(): Promise<StoredSiteSettings> {
  await ensureSettingsFile();
  const raw = await fs.readFile(SETTINGS_FILE, "utf8");
  const parsed = JSON.parse(raw) as Partial<StoredSiteSettings>;
  const publicSettings = sanitizePublicSettings(parsed.public || {});
  const admin = parsed.admin;

  if (!admin?.username || !admin.passwordHash || !admin.passwordSalt) {
    const seeded: StoredSiteSettings = {
      public: publicSettings,
      admin: {
        username: process.env.ADMIN_USER?.trim() || "admin",
        ...createHashedPassword(process.env.ADMIN_PASS?.trim() || "admin1234"),
        updatedAt: new Date().toISOString(),
      },
    };
    await fs.writeFile(SETTINGS_FILE, JSON.stringify(seeded, null, 2), "utf8");
    return seeded;
  }

  return {
    public: publicSettings,
    admin: {
      username: String(admin.username).trim(),
      passwordHash: admin.passwordHash,
      passwordSalt: admin.passwordSalt,
      updatedAt: admin.updatedAt || new Date().toISOString(),
    },
  };
}

async function writeStoredSettings(settings: StoredSiteSettings) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(SETTINGS_FILE, JSON.stringify(settings, null, 2), "utf8");
}

export async function getPublicSiteSettings() {
  const settings = await readStoredSettings();
  return withDerivedSiteFields(settings.public);
}

export async function getAdminUsername() {
  const settings = await readStoredSettings();
  return settings.admin.username;
}

export async function verifyAdminCredentials(username: string, password: string) {
  const settings = await readStoredSettings();
  const normalizedUsername = username.trim();
  if (!normalizedUsername || normalizedUsername !== settings.admin.username) {
    return false;
  }

  const computed = hashPassword(password, settings.admin.passwordSalt);
  return crypto.timingSafeEqual(
    Buffer.from(computed, "hex"),
    Buffer.from(settings.admin.passwordHash, "hex"),
  );
}

export async function updatePublicSiteSettings(input: Partial<PublicSiteSettings>) {
  const settings = await readStoredSettings();
  const next: StoredSiteSettings = {
    ...settings,
    public: sanitizePublicSettings({
      ...settings.public,
      ...input,
    }),
  };
  await writeStoredSettings(next);
  return withDerivedSiteFields(next.public);
}

export async function updateAdminSettings(input: AdminSettingsInput) {
  const settings = await readStoredSettings();
  const username = input.username?.trim() || settings.admin.username;
  const wantsPasswordChange = Boolean(input.newPassword);

  if (!input.currentPassword) {
    throw new Error("Current password is required to update admin credentials.");
  }

  const isValidCurrentPassword = await verifyAdminCredentials(settings.admin.username, input.currentPassword);
  if (!isValidCurrentPassword) {
    throw new Error("Current password is incorrect.");
  }

  if (!username) {
    throw new Error("Username cannot be empty.");
  }

  let nextAdmin: StoredAdminSettings = {
    ...settings.admin,
    username,
    updatedAt: new Date().toISOString(),
  };

  if (wantsPasswordChange) {
    if ((input.newPassword || "").trim().length < 6) {
      throw new Error("New password must be at least 6 characters long.");
    }
    nextAdmin = {
      ...nextAdmin,
      ...createHashedPassword(input.newPassword!.trim()),
    };
  }

  const next: StoredSiteSettings = {
    ...settings,
    admin: nextAdmin,
  };
  await writeStoredSettings(next);
  return { username: next.admin.username, updatedAt: next.admin.updatedAt };
}
