import { expect, test } from "@playwright/test";

for (const width of [390, 1280]) {
  test(`inscrição tem rótulos em português na largura ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 });
    await page.goto("/inscricao");
    await expect(page.getByLabel("Nome completo")).toBeVisible();
    await expect(page.getByLabel("E-mail")).toBeVisible();
    await page.getByLabel("Nome completo").focus();
    await expect(page.getByLabel("Nome completo")).toBeFocused();
  });
}

test("check-in, biblioteca, laboratório e consulta pública têm caminho em texto", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 800 });
  await page.goto("/materiais");
  await expect(page.getByRole("heading", { name: "Materiais" })).toBeVisible();
  await page.goto("/laboratorio");
  await expect(page.getByRole("heading", { name: "Laboratório" })).toBeVisible();
  await page.goto("/certificados/ausente");
  await expect(page.getByRole("heading", { name: "Autenticidade" })).toBeVisible();
  await page.goto("/operacao");
  await page.getByLabel("E-mail operacional").fill("equipe@example.com");
  await page.getByRole("button", { name: "Entrar" }).click();
  await expect(page.getByLabel("Código")).toBeVisible();
});
