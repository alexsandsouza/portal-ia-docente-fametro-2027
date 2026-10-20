import { beforeEach, describe, expect, it } from "vitest";
import { confirmEnrollment, createEnrollment, getState, resetState } from "@/lib/store/memory";

describe("confirmação", () => {
  beforeEach(() => {
    resetState();
    process.env.OPERATIONAL_EMAILS = "equipe@example.com";
  });

  it("nasce confirmada e um segundo ato não cria outro código", () => {
    const created = createEnrollment({ fullName: "Ana Costa", email: "ana@example.com" });
    if (!created.ok) throw new Error("inscrição");
    expect(created.enrollment.status).toBe("confirmed");
    expect(created.enrollment.confirmedBy).toBe("ana@example.com");
    const again = confirmEnrollment(created.enrollment.id, "equipe@example.com");
    expect(again.ok).toBe(true);
    expect(getState().codes).toHaveLength(1);
    expect(getState().enrollments.some((item) => item.status === "refused")).toBe(false);
  });
});
