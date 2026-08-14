import { expect, test } from "@playwright/test";
test("homepage to project details", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Explore projects" }).click();
  await page.getByRole("link", { name: "Five Borough Commons Core" }).first().click();
  await expect(page.getByRole("heading", { name: "Current tasks" })).toBeVisible();
});
test("contribution finder explains a recommendation", async ({ page }) => {
  await page.goto("/contribute");
  await expect(page.getByText("Recommended because:").first()).toBeVisible();
});
test("need preview stays local", async ({ page }) => {
  await page.goto("/needs/new");
  await expect(page.getByRole("heading", { name: "Preview" })).toBeVisible();
});
test("community and governance pages disclose real context", async ({ page }) => {
  await page.goto("/community");
  await expect(page.getByText("A public workshop, not a leaderboard.")).toBeVisible();
  await page.goto("/governance");
  await expect(page.getByText("RFC 0001")).toBeVisible();
});
