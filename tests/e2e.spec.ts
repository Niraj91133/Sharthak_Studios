import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  // Keep E2E stable: stub external services.
  await page.route("**/api/cloudinary/usage", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        ok: true,
        storage: { usedBytes: 123_000_000, limitBytes: 1_000_000_000, usedPct: 0.123 },
        raw: { plan: "Test", last_updated: "2026-03-24" },
      }),
    });
  });

  await page.route("**/api/upload", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        secure_url: "https://example.com/fake-upload.png",
      }),
    });
  });

  // Supabase REST calls (if configured) — return empty arrays / success.
  await page.route("**/rest/v1/**", async (route) => {
    const method = route.request().method();
    if (method === "GET") {
      await route.fulfill({ status: 200, contentType: "application/json", body: "[]" });
      return;
    }
    await route.fulfill({ status: 200, contentType: "application/json", body: "[]" });
  });
});

test("Home loads", async ({ page }) => {
  test.setTimeout(180_000);
  await page.goto("/");
  // Wait for client-only AppContent to finish loading/compiling in dev.
  await expect(page.getByText("LOADING SHARTHAK STUDIO")).toHaveCount(0, { timeout: 120_000 });
  await expect(page.locator("#gallery-section")).toBeVisible({ timeout: 60_000 });
});

test("Admin: add gallery category, batch upload, category appears on landing", async ({ page }) => {
  test.setTimeout(180_000);
  await page.goto("/admin");

  // Open the Gallery collapsible card (ignore sidebar nav; use aria-expanded toggle)
  const galleryToggle = page
    .locator('button[aria-expanded]')
    .filter({ hasText: "03. THE COLLECTION (GALLERY)" })
    .first();
  await galleryToggle.scrollIntoViewIfNeeded();
  await galleryToggle.click({ force: true });
  await expect(galleryToggle).toHaveAttribute("aria-expanded", "true", { timeout: 20_000 });
  await expect(page.getByRole("button", { name: "+ ADD CATEGORY" })).toBeVisible();

  // Add category "AAA"
  const addCategory = page.getByRole("button", { name: "+ ADD CATEGORY" });
  await expect(addCategory).toBeVisible();
  await addCategory.click();
  const input = page.getByPlaceholder("CATEGORY NAME...");
  await input.fill("AAA");
  await input.press("Enter");

  await expect(page.getByRole("button", { name: "AAA", exact: true })).toBeVisible();

  // Upload multiple images to AAA
  const uploadBtn = page.getByRole("button", { name: /Upload Multiple to AAA/i });
  await expect(uploadBtn).toBeEnabled();

  // The file input is hidden but still exists.
  const fileInput = page.locator('input[type="file"][multiple][accept="image/*"]').first();

  const png = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMB/2oN7S8AAAAASUVORK5CYII=",
    "base64",
  );

  await uploadBtn.click();
  await fileInput.setInputFiles([
    { name: "a.png", mimeType: "image/png", buffer: png },
    { name: "b.png", mimeType: "image/png", buffer: png },
    { name: "c.png", mimeType: "image/png", buffer: png },
  ]);

  await expect(page.getByRole("button", { name: /UPLOADING ALL/i })).toBeVisible();
  await expect(page.getByRole("button", { name: /Upload Multiple to AAA/i })).toBeVisible();

  // Landing page: gallery tab should exist
  await page.goto("/");
  const gallery = page.locator("#gallery-section");
  await gallery.scrollIntoViewIfNeeded();
  await expect(page.getByRole("button", { name: "AAA" }).first()).toBeVisible();
});

test("Admin: deleting a category requires confirmation", async ({ page }) => {
  test.setTimeout(180_000);
  await page.goto("/admin");

  // Open the Gallery collapsible card (ignore sidebar nav; use aria-expanded toggle)
  const galleryToggle = page
    .locator('button[aria-expanded]')
    .filter({ hasText: "03. THE COLLECTION (GALLERY)" })
    .first();
  await galleryToggle.scrollIntoViewIfNeeded();
  await galleryToggle.click({ force: true });
  await expect(galleryToggle).toHaveAttribute("aria-expanded", "true", { timeout: 20_000 });

  // Ensure a category exists first
  const addCategory = page.getByRole("button", { name: "+ ADD CATEGORY" });
  await expect(addCategory).toBeVisible();
  await addCategory.click();
  await page.getByPlaceholder("CATEGORY NAME...").fill("AAA");
  await page.getByPlaceholder("CATEGORY NAME...").press("Enter");
  await expect(page.getByRole("button", { name: "AAA", exact: true })).toBeVisible();

  // Dismiss confirm first
  page.once("dialog", (d) => d.dismiss());
  await page.getByLabel("Delete AAA").click();
  await expect(page.getByRole("button", { name: "AAA", exact: true })).toBeVisible();

  // Accept confirm → category removed (after deleting its slots)
  page.once("dialog", (d) => d.accept());
  await page.getByLabel("Delete AAA").click();

  // Category tabs are derived from slots; after delete should disappear.
  await expect(page.getByRole("button", { name: "AAA", exact: true })).toHaveCount(0);
});
