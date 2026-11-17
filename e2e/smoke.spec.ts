import { expect, test } from "@playwright/test";

test("ticking all 7 days celebrates, then resets and counts the week", async ({ page }) => {
  await page.goto("/");
  const strip = page.locator(".week-strip");
  for (let d = 1; d <= 7; d++) {
    await strip.getByRole("button", { name: `Mark Day ${d} complete` }).click();
  }
  await expect(page.getByRole("dialog", { name: /Week complete/ })).toBeVisible();
  // The celebration closes by itself after about 3 seconds.
  await expect(page.getByRole("dialog")).toBeHidden({ timeout: 6_000 });
  await expect(strip.locator('[aria-pressed="true"]')).toHaveCount(0);
  await expect(page.getByText("1 completed so far")).toBeVisible();

  await page.reload();
  await expect(page.getByText("1 completed so far")).toBeVisible();
});
