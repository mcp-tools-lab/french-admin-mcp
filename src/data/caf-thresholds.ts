/**
 * Seuils et barèmes CAF 2025.
 * Sources : caf.fr, service-public.fr
 *
 * ATTENTION : ces valeurs sont indicatives. Les montants exacts dépendent
 * de nombreux paramètres (zone géographique, loyer, etc.).
 */

/** Prime d'activité — paramètres 2025 */
export const PRIME_ACTIVITE = {
  montantForfaitaire: 622.63, // personne seule
  bonification_seuil: 687.35, // 0.6164 SMIC net
  bonification_max: 181.19,
  majoration_couple: 0.5, // +50% du forfaitaire
  majoration_par_enfant_1_2: 0.3, // +30% pour les 2 premiers
  majoration_par_enfant_3_plus: 0.4, // +40% à partir du 3ème
  majoration_parent_isole: 0.2857, // ~128.412 / 449.44 historique
};

/** Allocations familiales — montants mensuels 2025 */
export const ALLOCATIONS_FAMILIALES = {
  // Montants de base (plafond 1)
  base_2_enfants: 141.99,
  base_3_enfants: 323.91,
  base_par_enfant_sup: 181.92,
  // Majoration enfant > 14 ans
  majoration_14_ans_2_enfants: 71.00,
  majoration_14_ans_3_plus: 71.00,
  // Plafonds de ressources (couple, 2 enfants)
  plafond_1: 74_966,
  plafond_2: 98_543,
  // Au-delà de plafond_2 : montant divisé par 4
};

/** APL — zones et paramètres simplifiés */
export const APL_ZONES = {
  zone_1: { label: "Paris et petite couronne", coefficient: 1.0 },
  zone_2: { label: "Grandes agglomérations (>100k hab.)", coefficient: 0.9 },
  zone_3: { label: "Reste de la France", coefficient: 0.8 },
};

export const APL_LOYER_PLAFOND = {
  zone_1: { seul: 319.87, couple: 385.81, par_personne_sup: 55.72 },
  zone_2: { seul: 278.28, couple: 339.85, par_personne_sup: 50.43 },
  zone_3: { seul: 260.82, couple: 316.64, par_personne_sup: 46.22 },
};

/** Allocation de Soutien Familial (parent isolé) */
export const ASF_MONTANT = {
  par_enfant_prive_2_parents: 195.85,
  par_enfant_prive_1_parent: 146.09,
};

/**
 * Estimation simplifiée de la prime d'activité.
 * Formule : Montant forfaitaire + bonifications - ressources du foyer * 0.38
 */
export function estimerPrimeActivite(
  revenusMensuelsActivite: number,
  situationFamiliale: "seul" | "couple",
  enfants: number,
  autresRevenus: number = 0
): {
  eligible: boolean;
  montantEstime: number;
  details: string;
} {
  const pa = PRIME_ACTIVITE;

  // Montant forfaitaire selon composition
  let forfaitaire = pa.montantForfaitaire;
  if (situationFamiliale === "couple") {
    forfaitaire *= 1 + pa.majoration_couple;
  }
  for (let i = 0; i < enfants; i++) {
    if (i < 2) {
      forfaitaire += pa.montantForfaitaire * pa.majoration_par_enfant_1_2;
    } else {
      forfaitaire += pa.montantForfaitaire * pa.majoration_par_enfant_3_plus;
    }
  }

  // Bonification individuelle
  let bonification = 0;
  if (revenusMensuelsActivite > pa.bonification_seuil) {
    bonification = Math.min(
      pa.bonification_max,
      (revenusMensuelsActivite - pa.bonification_seuil) * 0.0607
    );
  }

  // Ressources prises en compte
  const ressources = revenusMensuelsActivite + autresRevenus;

  // Prime = forfaitaire + 61% revenus activité + bonification - ressources
  const primeTheorique =
    forfaitaire + revenusMensuelsActivite * 0.61 + bonification - ressources;

  const montantEstime = Math.max(0, Math.round(primeTheorique * 100) / 100);
  const eligible = montantEstime > 0;

  return {
    eligible,
    montantEstime,
    details: eligible
      ? `Montant estimé : ${montantEstime.toFixed(2)} €/mois. Forfaitaire=${forfaitaire.toFixed(2)}€, bonification=${bonification.toFixed(2)}€.`
      : "Non éligible avec ces revenus (la prime calculée est nulle ou négative).",
  };
}

/**
 * Estimation des allocations familiales.
 */
export function estimerAllocationsFamiliales(
  revenus: number,
  enfants: number,
  enfantsDePlus14Ans: number = 0
): { montantMensuel: number; details: string } {
  if (enfants < 2) {
    return {
      montantMensuel: 0,
      details: "Les allocations familiales sont versées à partir de 2 enfants à charge.",
    };
  }

  const af = ALLOCATIONS_FAMILIALES;
  let base = af.base_2_enfants;
  if (enfants >= 3) {
    base = af.base_3_enfants + (enfants - 3) * af.base_par_enfant_sup;
  }

  // Majoration 14 ans (pas pour l'aîné si 2 enfants)
  let majoration = 0;
  if (enfants === 2) {
    majoration = Math.max(0, enfantsDePlus14Ans - 1) * af.majoration_14_ans_2_enfants;
  } else {
    majoration = enfantsDePlus14Ans * af.majoration_14_ans_3_plus;
  }

  let montant = base + majoration;

  // Application des plafonds
  if (revenus > af.plafond_2) {
    montant /= 4;
  } else if (revenus > af.plafond_1) {
    montant /= 2;
  }

  montant = Math.round(montant * 100) / 100;

  return {
    montantMensuel: montant,
    details: `Allocations familiales estimées : ${montant.toFixed(2)} €/mois pour ${enfants} enfants (dont ${enfantsDePlus14Ans} de +14 ans).`,
  };
}
