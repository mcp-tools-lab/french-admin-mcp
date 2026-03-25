import { describe, it, expect } from "vitest";
import { simulerImpots } from "../src/tools/simuler-impots.js";
import { calculerParts, calculerImpotBrut, TAX_BRACKETS_2025 } from "../src/data/tax-brackets.js";

describe("calculerParts", () => {
  it("célibataire sans enfant = 1 part", () => {
    expect(calculerParts("celibataire", 0)).toBe(1);
  });

  it("marié sans enfant = 2 parts", () => {
    expect(calculerParts("marie", 0)).toBe(2);
  });

  it("marié avec 2 enfants = 3 parts", () => {
    expect(calculerParts("marie", 2)).toBe(3);
  });

  it("marié avec 3 enfants = 4 parts", () => {
    expect(calculerParts("marie", 3)).toBe(4);
  });

  it("célibataire avec 1 enfant = 2 parts (parent isolé)", () => {
    expect(calculerParts("celibataire", 1)).toBe(2);
  });

  it("veuf avec 2 enfants = 3 parts", () => {
    expect(calculerParts("veuf", 2)).toBe(3);
  });
});

describe("calculerImpotBrut", () => {
  it("revenu 0 = impôt 0", () => {
    expect(calculerImpotBrut(0, 1)).toBe(0);
  });

  it("revenu sous le seuil = impôt 0", () => {
    expect(calculerImpotBrut(10_000, 1)).toBe(0);
  });

  it("revenu 30000€ célibataire - impôt raisonnable", () => {
    const impot = calculerImpotBrut(30_000, 1);
    expect(impot).toBeGreaterThan(0);
    expect(impot).toBeLessThan(10_000);
  });

  it("2 parts paient moins que 1 part", () => {
    const impot1 = calculerImpotBrut(50_000, 1);
    const impot2 = calculerImpotBrut(50_000, 2);
    expect(impot2).toBeLessThan(impot1);
  });
});

describe("simulerImpots", () => {
  it("simule un salarié célibataire à 30000€", () => {
    const result = simulerImpots({
      revenuBrutAnnuel: 30_000,
      typeRevenu: "salaire",
      situationFamiliale: "celibataire",
    });

    expect(result.revenuBrut).toBe(30_000);
    expect(result.abattement).toBeGreaterThan(0); // 10% abattement
    expect(result.parts).toBe(1);
    expect(result.impotNet).toBeGreaterThanOrEqual(0);
    expect(result.tauxMoyen).toBeLessThan(30);
    expect(result.avertissement).toContain("indicative");
  });

  it("couple marié avec 3 enfants paie moins", () => {
    const celibataire = simulerImpots({
      revenuBrutAnnuel: 60_000,
      typeRevenu: "salaire",
      situationFamiliale: "celibataire",
    });

    const famille = simulerImpots({
      revenuBrutAnnuel: 60_000,
      typeRevenu: "salaire",
      situationFamiliale: "marie",
      enfants: 3,
    });

    expect(famille.impotNet).toBeLessThan(celibataire.impotNet);
    expect(famille.parts).toBe(4); // 2 + 0.5 + 0.5 + 1
  });

  it("BNC applique abattement de 34%", () => {
    const result = simulerImpots({
      revenuBrutAnnuel: 50_000,
      typeRevenu: "bnc",
      situationFamiliale: "celibataire",
    });

    expect(result.abattement).toBe(17_000); // 34% de 50000
  });

  it("charges déductibles réduisent l'impôt", () => {
    const sans = simulerImpots({
      revenuBrutAnnuel: 50_000,
      typeRevenu: "salaire",
      situationFamiliale: "celibataire",
    });

    const avec = simulerImpots({
      revenuBrutAnnuel: 50_000,
      typeRevenu: "salaire",
      situationFamiliale: "celibataire",
      chargesDeductibles: 5_000,
    });

    expect(avec.impotNet).toBeLessThan(sans.impotNet);
  });
});
