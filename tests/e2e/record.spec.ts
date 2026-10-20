import { expect, test } from "@playwright/test";
import { enroll, enterStaff } from "./helpers";

test("cada pessoa vê a própria ficha e a equipe consulta outra", async ({ browser }) => {
  const first = await browser.newPage();
  const email = `gina.${Date.now()}@example.com`;
  const href = await enroll(first, "Gina Rocha", email);
  await first.goto(href);
  await expect(first.getByText("Nome: Gina Rocha")).toBeVisible();

  const second = await browser.newPage();
  const other = await enroll(second, "Helena Paz", `helena.${Date.now()}@example.com`);
  await second.goto(other);
  await expect(second.getByText("Gina Rocha")).toHaveCount(0);

  const staff = await browser.newPage();
  await enterStaff(staff);
  await staff.goto(`/registro?email=${encodeURIComponent(email)}`);
  await expect(staff.getByText("Inscrição em")).toBeVisible();
});
