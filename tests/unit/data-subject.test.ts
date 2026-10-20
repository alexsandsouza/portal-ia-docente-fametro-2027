import { beforeEach, describe, expect, it } from "vitest";
import { createEnrollment, getState, recordDataRequest, resetState } from "@/lib/store/memory";

describe("direitos da titular", () => {
  beforeEach(() => resetState());

  it("registra acesso, correção e exclusão sem apagar a inscrição", () => {
    const created = createEnrollment({ fullName: "Ana Costa", email: "ana@example.com" });
    if (!created.ok) throw new Error("inscrição");
    recordDataRequest("ana@example.com", "access");
    recordDataRequest("ana@example.com", "correction", "Ana C. Costa");
    recordDataRequest("ana@example.com", "deletion");
    const kinds = getState().requests.map((item) => item.kind);
    expect(kinds).toEqual(["access", "correction", "deletion"]);
    expect(getState().requests.find((item) => item.kind === "deletion")?.executedAt).toBeNull();
    expect(getState().enrollments).toHaveLength(1);
  });
});