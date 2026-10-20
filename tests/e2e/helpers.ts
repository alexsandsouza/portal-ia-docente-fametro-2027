import { expect, type Page } from "@playwright/test";

export async function enroll(page: Page, name: string, email: string) {
  await page.goto("/inscricao");
  await page.getByLabel("Nome completo").fill(name);
  await page.getByLabel("E-mail").fill(email);
  await page.getByRole("button", { name: "Enviar inscrição" }).click();
  await expect(page.getByText("Estado: pendente")).toBeVisible();
  const href = await page.getByRole("link", { name: "Abrir o vínculo vigente" }).getAttribute("href");
  if (!href) throw new Error("vínculo ausente");
  return href;
}

export async function enterStaff(page: Page) {
  await page.goto("/operacao");
  if (await page.getByLabel("E-mail operacional").count()) {
    await page.getByLabel("E-mail operacional").fill("equipe@example.com");
    await page.getByRole("button", { name: "Entrar" }).click();
  }
  await expect(page.getByRole("heading", { name: "Painel operacional" })).toBeVisible();
}
