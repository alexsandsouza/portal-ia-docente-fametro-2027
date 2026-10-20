import { expect, test } from "@playwright/test";

test("inscrição pendente e repetição sem revelar dados", async ({ page }) => {
  const email = `ana.${Date.now()}@example.com`;
  await page.goto("/inscricao");
  await page.getByLabel("Nome completo").fill("Ana Costa");
  await page.getByLabel("E-mail").fill(email);
  await page.getByRole("button", { name: "Enviar inscrição" }).click();
  await expect(page.getByText("Estado: pendente")).toBeVisible();
  await expect(page.getByText("Identificador:")).toBeVisible();

  await page.goto("/inscricao");
  await page.getByLabel("Nome completo").fill("Outra Pessoa");
  await page.getByLabel("E-mail").fill(email.toUpperCase());
  await page.getByRole("button", { name: "Enviar inscrição" }).click();
  await expect(page.getByText("este e-mail já possui inscrição")).toBeVisible();
  await expect(page.getByText("Ana Costa")).toHaveCount(0);
});

test("área operacional recusa sessão sem papel", async ({ page }) => {
  await page.goto("/operacao");
  await expect(page.getByRole("heading", { name: "Acesso recusado." })).toBeVisible();
});
