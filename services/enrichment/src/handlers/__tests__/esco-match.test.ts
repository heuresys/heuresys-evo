import { describe, it, expect, vi } from "vitest";
import { handleEscoMatch } from "../esco-match";

const ECONOVA = "11111111-1111-1111-1111-111111111111";

function makeDeps() {
  let t = 1000;
  return {
    now: vi.fn(() => {
      t += 7;
      return t;
    }),
    log: vi.fn(),
  };
}

describe("handleEscoMatch", () => {
  it("returns a keyword match for a known skill ('machine learning')", async () => {
    const deps = makeDeps();
    const result = await handleEscoMatch(
      { skillName: "Machine Learning", tenantId: ECONOVA },
      deps,
    );
    expect(result.source).toBe("keyword");
    expect(result.matchedOccupationCode).toBe("2511.4");
    expect(result.confidence).toBe(0.95);
    expect(result.inputSkillName).toBe("Machine Learning");
  });

  it("normalizes case and trims whitespace before lookup", async () => {
    const deps = makeDeps();
    const result = await handleEscoMatch(
      { skillName: "  REACT  ", tenantId: ECONOVA },
      deps,
    );
    expect(result.matchedOccupationCode).toBe("2512.1");
  });

  it("returns source='none' with confidence 0 for unknown skill", async () => {
    const deps = makeDeps();
    const result = await handleEscoMatch(
      { skillName: "underwater basket weaving", tenantId: ECONOVA },
      deps,
    );
    expect(result.source).toBe("none");
    expect(result.matchedOccupationCode).toBeNull();
    expect(result.matchedOccupationLabel).toBeNull();
    expect(result.confidence).toBe(0);
  });

  it("populates durationMs from injected clock", async () => {
    const deps = makeDeps();
    const result = await handleEscoMatch(
      { skillName: "sql", tenantId: ECONOVA },
      deps,
    );
    expect(result.durationMs).toBeGreaterThan(0);
    expect(deps.now).toHaveBeenCalledTimes(2);
  });

  it("logs an info entry on completion with tenant + duration", async () => {
    const deps = makeDeps();
    await handleEscoMatch({ skillName: "leadership", tenantId: ECONOVA }, deps);
    expect(deps.log).toHaveBeenCalledOnce();
    const [msg, meta] = deps.log.mock.calls[0]!;
    expect(msg).toBe("esco-match completed");
    expect(meta.tenantId).toBe(ECONOVA);
    expect(meta.matchedCode).toBe("1213.0");
  });

  it("rejects invalid input (missing tenantId) via Zod", async () => {
    const deps = makeDeps();
    await expect(handleEscoMatch({ skillName: "sql" }, deps)).rejects.toThrow();
  });

  it("rejects invalid input (skillName too long) via Zod", async () => {
    const deps = makeDeps();
    await expect(
      handleEscoMatch(
        { skillName: "x".repeat(256), tenantId: ECONOVA },
        deps,
      ),
    ).rejects.toThrow();
  });
});
