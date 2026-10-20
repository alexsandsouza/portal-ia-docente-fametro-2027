import { beforeEach, describe, expect, it } from "vitest";
import { authorizeCertificate, createEnrollment, getState, resetState } from "@/lib/store/memory";

describe("certificado", () => {
  beforeEach(() => {
    resetState();
    process.env.OPERATIONAL_EMAILS = "equipe@example.com";
  });

  it("mantém um código de 128 bits por pessoa", () => {
    const created = createEnrollment({ fullName: "Ana Costa", email: "ana@example.com" });
    if (!created.ok) throw new Error("inscrição");
    const first = authorizeCertificate(created.participant.id, "equipe@example.com");
    const second = authorizeCertificate(created.participant.id, "equipe@example.com");
    if (!first.ok || !second.ok) throw new Error("certificado");
    expect(first.certificate.authenticityCode).toMatch(/^[0-9a-f]{32}$/);
    expect(second.certificate.authenticityCode).toBe(first.certificate.authenticityCode);
    expect(getState().certificates).toHaveLength(1);
  });
});
