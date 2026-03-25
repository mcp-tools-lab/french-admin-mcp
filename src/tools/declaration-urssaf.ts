import { URSSAF_RATES, calculerChargesTrimestrielles } from "../data/urssaf-rates.js";

export interface DeclarationUrssafInput {
  typeActivite: "services_bic" | "services_bnc" | "commerce" | "liberal_cipav";
  trimestre: 1 | 2 | 3 | 4;
  annee: number;
  chiffreAffairesMois1: number;
  chiffreAffairesMois2: number;
  chiffreAffairesMois3: number;
  versementLiberatoire?: boolean;
  acre?: boolean;
}

export interface DeclarationUrssafResult {
  trimestre: string;
  caTotal: number;
  detailMois: { mois: string; ca: number }[];
  cotisationsSociales: number;
  cfp: number;
  versementIR: number;
  totalADeclarer: number;
  totalAPayer: number;
  dateLimite: string;
  etapes: string[];
  avertissement: string;
}

const MOIS_NOMS = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
];

const DATES_LIMITES: Record<number, string> = {
  1: "30 avril",
  2: "31 juillet",
  3: "31 octobre",
  4: "31 janvier (année suivante)",
};

export function preparerDeclarationUrssaf(
  input: DeclarationUrssafInput
): DeclarationUrssafResult {
  const rate = URSSAF_RATES[input.typeActivite];
  if (!rate) throw new Error(`Type d'activité inconnu : ${input.typeActivite}`);

  const moisDebut = (input.trimestre - 1) * 3;
  const detailMois = [
    { mois: MOIS_NOMS[moisDebut], ca: input.chiffreAffairesMois1 },
    { mois: MOIS_NOMS[moisDebut + 1], ca: input.chiffreAffairesMois2 },
    { mois: MOIS_NOMS[moisDebut + 2], ca: input.chiffreAffairesMois3 },
  ];

  const caTotal =
    input.chiffreAffairesMois1 + input.chiffreAffairesMois2 + input.chiffreAffairesMois3;

  const vl = input.versementLiberatoire ?? false;
  let charges = calculerChargesTrimestrielles(caTotal, input.typeActivite, vl);

  // ACRE
  if (input.acre) {
    const reduction = charges.cotisationsSociales * 0.5;
    charges = {
      ...charges,
      cotisationsSociales: Math.round((charges.cotisationsSociales - reduction) * 100) / 100,
      total: Math.round((charges.total - reduction) * 100) / 100,
      caNet: Math.round((charges.caNet + reduction) * 100) / 100,
    };
  }

  const trimestreLabel = `T${input.trimestre} ${input.annee}`;
  const dateLimite = DATES_LIMITES[input.trimestre];

  const etapes = [
    `1. Connectez-vous sur autoentrepreneur.urssaf.fr`,
    `2. Cliquez sur "Déclarer et payer"`,
    `3. Sélectionnez la période : ${trimestreLabel}`,
    `4. Saisissez votre chiffre d'affaires : ${caTotal.toFixed(2)} €`,
    ...(caTotal === 0
      ? [`5. ⚠️ Même si votre CA est de 0 €, vous DEVEZ déclarer (sinon pénalité)`]
      : [`5. Le montant à payer sera calculé automatiquement : ~${charges.total.toFixed(2)} €`]),
    `6. Validez et payez (prélèvement automatique ou carte bancaire)`,
    `7. Conservez l'accusé de réception`,
  ];

  return {
    trimestre: trimestreLabel,
    caTotal,
    detailMois,
    cotisationsSociales: charges.cotisationsSociales,
    cfp: charges.cfp,
    versementIR: charges.versementIR,
    totalADeclarer: caTotal,
    totalAPayer: charges.total,
    dateLimite: `${dateLimite} ${input.trimestre === 4 ? input.annee + 1 : input.annee}`,
    etapes,
    avertissement:
      "⚠️ Déclaration indicative. Les montants exacts seront calculés par l'URSSAF. " +
      "N'oubliez pas de déclarer même si votre CA est nul. " +
      "Passé la date limite, des pénalités de retard s'appliquent. " +
      "Site officiel : autoentrepreneur.urssaf.fr",
  };
}
