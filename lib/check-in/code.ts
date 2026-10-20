import { randomBytes } from "node:crypto";

export function createOpaqueCode(): string {
  return randomBytes(16).toString("hex");
}
