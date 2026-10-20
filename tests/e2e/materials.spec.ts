import { expect, test } from "@playwright/test";
import { enroll, enterStaff } from "./helpers";

test("publica, lista e retira material", async ({ browser }) => {
  const outsider = await browser.newPage();
  await outsider.goto("/materiais");
  await expect(outsider.getByText("Abra o vínculo vigente da inscrição para ver os materiais.")).toBeVisible();

  const participant = await browser.newPage();
  const href = await enroll(participant, "Dora Melo", `dora.${Date.now()}@example.com`);
  await participant.goto(href);
  await participant.goto("/materiais");
  await expect(participant.getByText("Os materiais serão liberados ao final do evento.")).toBeVisible();

  const title = `Roteiro ${Date.now()}`;
  const staff = await browser.newPage();
  await enterStaff(staff);
  await staff.getByRole("textbox", { name: "Título", exact: true }).fill(title);
  await staff.getByLabel("Descrição").fill("Leitura inicial");
  await staff.getByLabel("Destino no Drive").fill("https://drive.google.com/file/d/abc");
  await staff.getByRole("checkbox", { name: "Publicado" }).check();
  await staff.getByRole("button", { name: "Guardar" }).click();
  await expect(staff.getByText("Material guardado.")).toBeVisible();

  await participant.reload();
  await expect(participant.getByRole("heading", { name: title })).toBeVisible();

  await staff.getByRole("button", { name: `Retirar ${title}` }).click();
  await expect(staff.getByText("Material retirado.")).toBeVisible();
  await participant.reload();
  await expect(participant.getByRole("heading", { name: title })).toHaveCount(0);
});
