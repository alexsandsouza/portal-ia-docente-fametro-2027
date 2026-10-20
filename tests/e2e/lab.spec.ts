import { expect, test } from "@playwright/test";
import { enroll, enterStaff } from "./helpers";

test("mostra cinco desafios e conclui só com enunciado", async ({ browser }) => {
  const participant = await browser.newPage();
  const href = await enroll(participant, "Eva Dias", `eva.${Date.now()}@example.com`);
  const staff = await browser.newPage();
  await enterStaff(staff);
  await staff.getByRole("button", { name: "Confirmar Eva Dias" }).click();
  await participant.goto(href);
  await participant.goto("/laboratorio");
  for (const position of [1, 2, 3, 4, 5]) {
    await expect(participant.getByRole("heading", { name: new RegExp(`^${position}\\.`) })).toBeVisible();
  }
  await expect(participant.getByRole("button", { name: "Marcar como concluído" })).toHaveCount(0);

  const challenge = staff.locator("form").filter({ has: staff.getByLabel("Enunciado") }).first();
  await challenge.getByLabel("Enunciado").fill("Escreva um plano de aula.");
  await challenge.getByRole("button", { name: "Atualizar" }).click();
  await expect(staff.getByText("Desafio atualizado.")).toBeVisible();
  await participant.reload();
  await expect(participant.getByText("Escreva um plano de aula.")).toBeVisible();
  await participant.getByRole("button", { name: "Marcar como concluído" }).click();
  await expect(participant.getByText("Estado: concluído")).toBeVisible();
});
