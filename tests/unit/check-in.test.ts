import { beforeEach, describe, expect, it } from "vitest";
import { createEnrollment, getState, recordCheckIn, resetState } from "@/lib/store/memory";

describe("check-in", () => {
  beforeEach(() => {
    resetState();
    process.env.OPERATIONAL_EMAILS = "equipe@example.com";
  });

  it("gera 128 bits e impede o segundo registro", () => {
    const created = createEnrollment({ fullName: "Ana Costa", email: "ana@example.com" });
    if (!created.ok) throw new Error("inscrição");
    expect(getState().codes).toHaveLength(1);
    const code = getState().codes[0]!.code;
    expect(code).toMatch(/^[0-9a-f]{32}$/);
    expect(code).not.toContain("ana");
    expect(recordCheckIn(code, "equipe@example.com").ok).toBe(true);
    expect(recordCheckIn(code, "equipe@example.com").ok).toBe(false);
    expect(getState().checkIns).toHaveLength(1);
  });
});
