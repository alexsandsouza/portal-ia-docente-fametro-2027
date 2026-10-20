import { expect, test } from "@playwright/test";
import { enroll, enterStaff } from "./helpers";

test("a equipe confirma e a participante vê o estado", async ({ browser }) => {
  const email = `bia.${Date.now()}@example.com`;
  const participant = await browser.newPage();
  const href = await enroll(participant, "Bia Nunes", email);
  await participant.goto(href);
  await expect(participant.getByText("Estado: pendente")).toBeVisible();

  const staff = await browser.newPage();
  await enterStaff(staff);
  await staff.getByRole("button", { name: "Confirmar Bia Nunes" }).click();

  await participant.goto("/ficha");
  await expect(participant.getByText("Estado: confirmado")).toBeVisible();
});
