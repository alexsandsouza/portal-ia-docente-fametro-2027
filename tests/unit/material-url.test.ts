import { describe, expect, it } from "vitest";
import { isDriveUrl } from "@/lib/materials/url";

describe("destino do material", () => {
  it("aceita apenas https no Drive ou no Docs", () => {
    expect(isDriveUrl("https://drive.google.com/file/d/abc")).toBe(true);
    expect(isDriveUrl("https://docs.google.com/document/d/abc")).toBe(true);
    expect(isDriveUrl("http://drive.google.com/file/d/abc")).toBe(false);
    expect(isDriveUrl("https://example.com")).toBe(false);
  });
});
