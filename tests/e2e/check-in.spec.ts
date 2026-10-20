import { expect, test } from "@playwright/test";
import { enroll, enterStaff } from "./helpers";

test("check-in por texto aceita uma vez e recusa repetido e inválido", async ({ browser }) => {
  const participant = await browser.newPage();
  const href = await enroll(participant, "Caio Lima", `caio.${Date.now()}@example.com`);
  const staff = await browser.newPage();
  await enterStaff(staff);
  await participant.goto(href);
  await participant.goto("/check-in/codigo");
  const text = await participant.getByText("Código em texto:").textContent();
  const code = text?.replace("Código em texto:", "").trim() ?? "";

  await staff.goto("/operacao");
  await staff.getByLabel("Código").fill(code);
  await staff.getByRole("button", { name: "Registrar" }).click();
  await expect(staff.getByText("Check-in registrado.")).toBeVisible();

  await staff.getByLabel("Código").fill(code);
  await staff.getByRole("button", { name: "Registrar" }).click();
  await expect(staff.getByText("O check-in já foi feito.")).toBeVisible();

  await staff.getByLabel("Código").fill("codigo-inexistente");
  await staff.getByRole("button", { name: "Registrar" }).click();
  await expect(staff.getByText("Código recusado.")).toBeVisible();
});
