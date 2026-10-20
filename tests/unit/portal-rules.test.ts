import { beforeEach, describe, expect, it } from "vitest";
import { messages } from "@/lib/messages/pt-br";
import {
  authorizeCertificate,
  completeChallenge,
  confirmEnrollment,
  confirmLink,
  createEnrollment,
  getState,
  lookupCertificate,
  publishMaterial,
  recordCheckIn,
  recordDataRequest,
  resetState,
  sendNewLink,
  updateChallenge,
} from "@/lib/store/memory";

describe("regras do portal", () => {
  beforeEach(() => {
    resetState();
    process.env.OPERATIONAL_EMAILS = "equipe@example.com";
  });

  it("só confirma com e-mail operacional e gera um código", () => {
    const created = createEnrollment({ fullName: "Ana Costa", email: "ana@example.com" });
    if (!created.ok) throw new Error("inscrição");
    expect(confirmEnrollment(created.enrollment.id, "outra@example.com").ok).toBe(false);
    const confirmed = confirmEnrollment(created.enrollment.id, "equipe@example.com");
    expect(confirmed.ok).toBe(true);
    expect(getState().codes).toHaveLength(1);
    expect(getState().actions[0]?.action).toBe("confirm");
  });

  it("invalida o vínculo anterior", () => {
    const created = createEnrollment({ fullName: "Ana Costa", email: "ana@example.com" });
    if (!created.ok) throw new Error("inscrição");
    const first = created.participant.accessToken;
    const next = sendNewLink("ana@example.com");
    expect(confirmLink("ana@example.com", 1, first)).toBeNull();
    expect(confirmLink("ana@example.com", next!.accessLinkVersion, next!.accessToken)).not.toBeNull();
  });

  it("faz um único check-in e recusa código desconhecido", () => {
    const created = createEnrollment({ fullName: "Ana Costa", email: "ana@example.com" });
    if (!created.ok) throw new Error("inscrição");
    confirmEnrollment(created.enrollment.id, "equipe@example.com");
    const code = getState().codes[0]!.code;
    expect(recordCheckIn(code, "equipe@example.com").ok).toBe(true);
    expect(recordCheckIn(code, "equipe@example.com").ok).toBe(false);
    expect(recordCheckIn("nao-existe", "equipe@example.com").ok).toBe(false);
  });

  it("publica só destino do Drive e conclui só desafio com enunciado", () => {
    const created = createEnrollment({ fullName: "Ana Costa", email: "ana@example.com" });
    if (!created.ok) throw new Error("inscrição");
    expect(publishMaterial({
      title: "Roteiro",
      description: "Leitura",
      destinationUrl: "https://example.com/arquivo",
      published: true,
      actorEmail: "equipe@example.com",
    }).ok).toBe(false);
    expect(publishMaterial({
      title: "Roteiro",
      description: "Leitura",
      destinationUrl: "https://drive.google.com/file/d/abc",
      published: true,
      actorEmail: "equipe@example.com",
    }).ok).toBe(true);
    expect(completeChallenge("ana@example.com", 1).ok).toBe(false);
    confirmEnrollment(created.enrollment.id, "equipe@example.com");
    expect(completeChallenge("ana@example.com", 1).ok).toBe(false);
    updateChallenge(1, "Desafio 1", "Enunciado publicado", "equipe@example.com");
    expect(completeChallenge("ana@example.com", 1).ok).toBe(true);
  });

  it("autoriza um certificado por pessoa e consulta sem e-mail", () => {
    const created = createEnrollment({ fullName: "Ana Costa", email: "ana@example.com" });
    if (!created.ok) throw new Error("inscrição");
    const first = authorizeCertificate(created.participant.id, "equipe@example.com");
    const second = authorizeCertificate(created.participant.id, "equipe@example.com");
    if (!first.ok || !second.ok) throw new Error("certificado");
    expect(first.certificate.authenticityCode).toBe(second.certificate.authenticityCode);
    const lookup = lookupCertificate(first.certificate.authenticityCode);
    expect(lookup.ok).toBe(true);
    if (lookup.ok) {
      expect(lookup.institution).toBe(messages.institution);
      expect(JSON.stringify(lookup)).not.toContain("ana@example.com");
    }
  });

  it("corrige o nome e mantém o pedido de exclusão sem apagar a inscrição", () => {
    const created = createEnrollment({ fullName: "Ana Costa", email: "ana@example.com" });
    if (!created.ok) throw new Error("inscrição");
    recordDataRequest("ana@example.com", "correction", "Ana C. Costa");
    recordDataRequest("ana@example.com", "deletion");
    expect(getState().participants[0]?.fullName).toBe("Ana C. Costa");
    expect(getState().enrollments).toHaveLength(1);
    expect(getState().requests.find((item) => item.kind === "deletion")?.executedAt).toBeNull();
  });
});
