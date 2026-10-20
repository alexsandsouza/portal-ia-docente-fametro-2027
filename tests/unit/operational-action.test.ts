import { beforeEach, describe, expect, it } from "vitest";
import { confirmEnrollment, createEnrollment, getState, resetState } from "@/lib/store/memory";

describe("ação operacional", () => {
  beforeEach(() => {
    resetState();
    process.env.OPERATIONAL_EMAILS = "equipe@example.com";
  });

  it("grava autor, ação, alvo e data", () => {
    const created = createEnrollment({ fullName: "Ana Costa", email: "ana@example.com" });
    if (!created.ok) throw new Error("inscrição");
    confirmEnrollment(created.enrollment.id, "equipe@example.com");
    const action = getState().actions[0];
    expect(action?.actorId).toBe("equipe@example.com");
    expect(action?.action).toBe("confirm");
    expect(action?.targetType).toBe("enrollment");
    expect(action?.targetId).toBe(created.enrollment.id);
    expect(action?.createdAt).toBeTruthy();
  });
});
