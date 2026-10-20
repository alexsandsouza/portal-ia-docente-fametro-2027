import { expect, test } from "@playwright/test";
import { enroll } from "./helpers";

test("a página de dados não publica os quatro fatos institucionais", async ({ page }) => {
  const href = await enroll(page, "Júlia Campos", `julia.${Date.now()}@example.com`);
  await page.goto(href);
  await page.goto("/meus-dados");
  const text = await page.locator("body").innerText();
  expect(text).not.toMatch(/controlador|encarregado|base legal|prazo de retenção/i);
  await page.getByLabel("Novo nome").fill("Júlia C. Campos");
  await page.getByRole("button", { name: "Corrigir nome" }).click();
  await expect(page.getByText("Nome armazenado: Júlia C. Campos")).toBeVisible();
});
