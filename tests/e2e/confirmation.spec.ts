import { expect, test } from "@playwright/test";
import { enroll } from "./helpers";

test("a inscrição já libera a ficha confirmada", async ({ page }) => {
  const href = await enroll(page, "Bia Nunes", `bia.${Date.now()}@example.com`);
  await page.goto(href);
  await expect(page.getByText("Estado: confirmado")).toBeVisible();
  await page.goto("/materiais");
  await expect(page.getByText("Os materiais serão liberados ao final do evento.")).toBeVisible();
  await page.goto("/certificado");
  await expect(page.getByText("O certificado será gerado ao final do evento.")).toBeVisible();
});
