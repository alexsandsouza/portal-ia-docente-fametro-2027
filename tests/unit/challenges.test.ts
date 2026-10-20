import { beforeEach, describe, expect, it } from "vitest";
import { completeChallenge, confirmEnrollment, createEnrollment, getState, resetState, updateChallenge } from "@/lib/store/memory";

describe("desafios", () => {
  beforeEach(() => {
    resetState();
    process.env.OPERATIONAL_EMAILS = "equipe@example.com";
  });

  it("mantém cinco posições e não apaga a conclusão", () => {
    expect(getState().challenges.map((item) => item.position)).toEqual([1, 2, 3, 4, 5]);
    const created = createEnrollment({ fullName: "Ana Costa", email: "ana@example.com" });
    if (!created.ok) throw new Error("inscrição");
    const waiting = getState().progress.find((item) => item.participantId === created.participant.id);
    expect(waiting?.status).toBe("waiting_for_content");
    confirmEnrollment(created.enrollment.id, "equipe@example.com");
    updateChallenge(1, "Desafio 1", "Enunciado", "equipe@example.com");
    expect(completeChallenge("ana@example.com", 1).ok).toBe(true);
    updateChallenge(1, "Desafio 1 revisado", "Enunciado novo", "equipe@example.com");
    const progress = getState().progress.find((item) => item.participantId === created.participant.id && item.challengeId === "challenge-1");
    expect(progress?.status).toBe("completed");
  });
});
