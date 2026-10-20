import { expect, test } from "@playwright/test";
import { enroll, enterStaff } from "./helpers";

test("o PDF só sai depois da autorização e a consulta pública não mostra e-mail", async ({ browser }) => {
  const email = `ivo.${Date.now()}@example.com`;
  const participant = await browser.newPage();
  const href = await enroll(participant, "Ivo Reis", email);
  await participant.goto(href);
  await participant.goto("/certificado");
  await expect(participant.getByText("A emissão ainda não foi autorizada.")).toBeVisible();

  const staff = await browser.newPage();
  await enterStaff(staff);
  await staff.getByRole("button", { name: "Autorizar" }).last().click();
  await participant.reload();
  await expect(participant.getByRole("link", { name: "Baixar PDF" })).toBeVisible();
  const pdfHref = await participant.getByRole("link", { name: "Baixar PDF" }).getAttribute("href");
  const code = pdfHref?.split("/").at(-2) ?? "";
  const publicPage = await browser.newPage();
  await publicPage.goto(`/certificados/${code}`);
  await expect(publicPage.locator("#conteudo").getByText("Centro Universitário CEUNI FAMETRO")).toBeVisible();
  await expect(publicPage.getByText(email)).toHaveCount(0);
  await publicPage.goto("/certificados/codigo-desconhecido");
  await expect(publicPage.getByText("Não há certificado correspondente.")).toBeVisible();
});
