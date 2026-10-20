import { expect, test } from "@playwright/test";
import { enroll } from "./helpers";

test("participante não entra no painel", async ({ page }) => {
  const href = await enroll(page, "Lia Souza", `lia.${Date.now()}@example.com`);
  await page.goto(href);
  await page.goto("/operacao");
  await expect(page.getByRole("heading", { name: "Acesso recusado." })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Painel operacional" })).toHaveCount(0);
});
