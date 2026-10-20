import { beforeEach, describe, expect, it } from "vitest";
import { messages } from "@/lib/messages/pt-br";
import { RATE_LIMIT_MAX_ATTEMPTS } from "@/lib/rate-limit";
import { createEnrollment, resetState } from "@/lib/store/memory";

describe("inscrição", () => {
  beforeEach(() => resetState());

  it("recusa nome vazio", () => {
    const result = createEnrollment({ fullName: "   ", email: "pessoa@example.com" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.message).toBe(messages.nameRequired);
  });

  it("guarda o e-mail em minúsculas e o estado pendente", () => {
    const result = createEnrollment({ fullName: "  Ana Costa  ", email: "Ana@Example.com" });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.participant.email).toBe("ana@example.com");
      expect(result.participant.fullName).toBe("Ana Costa");
      expect(result.enrollment.status).toBe("pending");
    }
  });

  it("não revela dados quando o e-mail já está inscrito", () => {
    createEnrollment({ fullName: "Ana Costa", email: "ana@example.com" });
    const duplicate = createEnrollment({ fullName: "Outra Pessoa", email: "ANA@example.com" });
    expect(duplicate.ok).toBe(false);
    if (!duplicate.ok) {
      expect(duplicate.message).toBe(messages.duplicate);
      expect(duplicate.message).not.toContain("Ana");
      expect(duplicate.message).not.toContain("pendente");
    }
  });

  it("recusa depois de cinco tentativas inválidas", () => {
    let last = createEnrollment({ fullName: "", email: "invalido" });
    for (let attempt = 1; attempt < RATE_LIMIT_MAX_ATTEMPTS; attempt += 1) {
      last = createEnrollment({ fullName: "", email: "invalido" });
    }
    expect(last.ok).toBe(false);
    if (!last.ok) expect(last.message).toBe(messages.rateLimited);
  });
});
