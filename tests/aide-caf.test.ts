import { describe, it, expect } from "vitest";
import { estimerAidesCAF } from "../src/tools/aide-caf.js";
import { estimerPrimeActivite, estimerAllocationsFamiliales } from "../src/data/caf-thresholds.js";

describe("estimerPrimeActivite", () => {
  it("salarié au SMIC éligible", () => {
    const result = estimerPrimeActivite(1400, "seul", 0);
    expect(result.eligible).toBe(true);
    expect(result.montantEstime).toBeGreaterThan(0);
  });

  it("haut revenu non éligible", () => {
    const result = estimerPrimeActivite(5000, "seul", 0);
    expect(result.eligible).toBe(false);
  });

  it("enfants augmentent le montant", () => {
    const sans = estimerPrimeActivite(1400, "seul", 0);
    const avec = estimerPrimeActivite(1400, "seul", 2);
    expect(avec.montantEstime).toBeGreaterThan(sans.montantEstime);
  });
});

describe("estimerAllocationsFamiliales", () => {
  it("1 enfant = pas d'allocations", () => {
    const result = estimerAllocationsFamiliales(30_000, 1);
    expect(result.montantMensuel).toBe(0);
  });

  it("2 enfants = allocations", () => {
    const result = estimerAllocationsFamiliales(30_000, 2);
    expect(result.montantMensuel).toBeGreaterThan(100);
  });

  it("hauts revenus = montant réduit", () => {
    const bas = estimerAllocationsFamiliales(30_000, 2);
    const haut = estimerAllocationsFamiliales(100_000, 2);
    expect(haut.montantMensuel).toBeLessThan(bas.montantMensuel);
  });
});

describe("estimerAidesCAF", () => {
  it("retourne un résultat complet", () => {
    const result = estimerAidesCAF({
      situationFamiliale: "seul",
      enfants: 2,
      revenusMensuelsActivite: 1500,
      loyer: 600,
      zoneAPL: "zone_2",
    });

    expect(result.primeActivite).toBeDefined();
    expect(result.allocationsFamiliales).toBeDefined();
    expect(result.aplEstimation).toBeDefined();
    expect(result.demarchesRecommandees.length).toBeGreaterThan(0);
    expect(result.avertissement).toContain("indicative");
  });

  it("sans loyer, pas d'estimation APL", () => {
    const result = estimerAidesCAF({
      situationFamiliale: "couple",
      enfants: 0,
      revenusMensuelsActivite: 2000,
    });

    expect(result.aplEstimation.possible).toBe(false);
  });
});
