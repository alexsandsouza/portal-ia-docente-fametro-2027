import { beforeEach, describe, expect, it } from "vitest";
import { confirmEnrollment, createEnrollment, getState, resetState } from "@/lib/store/memory";

describe("confirmação", () => {
  beforeEach(() => {
    resetState();
    process.env.OPERATIONAL_EMAILS = "equipe@example.com";
  });

  it("só o papel operacional confirma e não há volta", () => {
    const created = createEnrollment({ fullName: "Ana Costa", email: "ana@example.com" });
    if (!created.ok) throw new Error("inscrição");
    expect(confirmEnrollment(created.enrollment.id, "ana@example.com").ok).toBe(false);
    expect(created.enrollment.status).toBe("pending");
    const confirmed = confirmEnrollment(created.enrollment.id, "equipe@example.com");
    expect(confirmed.ok).toBe(true);
    if (confirmed.ok) {
      expect(confirmed.enrollment.status).toBe("confirmed");
      expect(confirmed.enrollment.confirmedAt).toBeTruthy();
      expect(confirmed.enrollment.confirmedBy).toBe("equipe@example.com");
    }
    expect(getState().enrollments.some((item) => item.status === "refused")).toBe(false);
  });
});
