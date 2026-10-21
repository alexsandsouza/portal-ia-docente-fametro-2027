export function normalizeCpf(input: string): string | null {
  const digits = input.replace(/\D/g, "");
  if (digits.length !== 11 || /^(\d)\1{10}$/.test(digits)) return null;
  const digit = (length: number) => {
    let sum = 0;
    for (let index = 0; index < length; index += 1) sum += Number(digits[index]) * (length + 1 - index);
    const rest = (sum * 10) % 11;
    return rest === 10 ? 0 : rest;
  };
  if (digit(9) !== Number(digits[9]) || digit(10) !== Number(digits[10])) return null;
  return digits;
}

export function maskCpf(cpf: string): string {
  const digits = cpf.replace(/\D/g, "");
  if (digits.length !== 11) return "";
  return `${digits.slice(0, 3)}.***.***-${digits.slice(9)}`;
}
