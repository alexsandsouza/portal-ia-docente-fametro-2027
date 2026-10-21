import { expect, type Page } from "@playwright/test";

function cpfFromSeed(seed: number) {
  const digits = String(Math.abs(seed)).padStart(9, "1").slice(-9);
  const check = (value: string) => {
    let sum = 0;
    for (let index = 0; index < value.length; index += 1) sum += Number(value[index]) * (value.length + 1 - index);
    const rest = (sum * 10) % 11;
    return rest === 10 ? 0 : rest;
  };
  const first = check(digits);
  return `${digits}${first}${check(digits + first)}`;
}

export async function enroll(page: Page, name: string, email: string) {
  const [given, ...family] = name.split(" ");
  await page.goto("/inscricao");
  await page.getByLabel("Nome", { exact: true }).fill(given);
  await page.getByLabel("Sobrenome").fill(family.join(" ") || "Silva");
  await page.getByLabel("CPF").fill(cpfFromSeed(Date.now()));
  await page.getByLabel("E-mail").fill(email);
  await page.getByRole("button", { name: "Enviar inscrição" }).click();
  await expect(page.getByText("Estado: confirmado")).toBeVisible();
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
