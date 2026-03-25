import { describe, it, expect } from "vitest";
import { preparerDeclarationUrssaf } from "../src/tools/declaration-urssaf.js";

describe("preparerDeclarationUrssaf", () => {
  it("prépare une déclaration T1 2025", () => {
    const result = preparerDeclarationUrssaf({
      typeActivite: "services_bnc",
      trimestre: 1,
      annee: 2025,
      chiffreAffairesMois1: 3000,
      chiffreAffairesMois2: 4000,
      chiffreAffairesMois3: 3500,
    });

    expect(result.trimestre).toBe("T1 2025");
    expect(result.caTotal).toBe(10_500);
    expect(result.detailMois).toHaveLength(3);
    expect(result.detailMois[0].mois).toBe("Janvier");
    expect(result.totalAPayer).toBeGreaterThan(0);
    expect(result.dateLimite).toContain("avril");
    expect(result.etapes).toHaveLength(7);
  });

  it("gère un CA nul (obligation de déclarer)", () => {
    const result = preparerDeclarationUrssaf({
      typeActivite: "services_bnc",
      trimestre: 2,
      annee: 2025,
      chiffreAffairesMois1: 0,
      chiffreAffairesMois2: 0,
      chiffreAffairesMois3: 0,
    });

    expect(result.caTotal).toBe(0);
    expect(result.totalAPayer).toBe(0);
    expect(result.etapes.join(" ")).toContain("DEVEZ déclarer");
  });

  it("T4 a une date limite en janvier année suivante", () => {
    const result = preparerDeclarationUrssaf({
      typeActivite: "commerce",
      trimestre: 4,
      annee: 2025,
      chiffreAffairesMois1: 5000,
      chiffreAffairesMois2: 6000,
      chiffreAffairesMois3: 7000,
    });

    expect(result.dateLimite).toContain("janvier");
    expect(result.dateLimite).toContain("2026");
  });

  it("ACRE réduit les charges", () => {
    const sans = preparerDeclarationUrssaf({
      typeActivite: "services_bnc",
      trimestre: 1,
      annee: 2025,
      chiffreAffairesMois1: 3000,
      chiffreAffairesMois2: 3000,
      chiffreAffairesMois3: 3000,
    });

    const avec = preparerDeclarationUrssaf({
      typeActivite: "services_bnc",
      trimestre: 1,
      annee: 2025,
      chiffreAffairesMois1: 3000,
      chiffreAffairesMois2: 3000,
      chiffreAffairesMois3: 3000,
      acre: true,
    });

    expect(avec.totalAPayer).toBeLessThan(sans.totalAPayer);
  });
});
