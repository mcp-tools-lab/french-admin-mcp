/**
 * Génération de facture conforme au droit français.
 * Art. L441-9 et R441-3 du Code de commerce.
 */

export interface LigneFacture {
  description: string;
  quantite: number;
  prixUnitaireHT: number;
  tauxTVA?: number; // 0 si franchise en base
}

export interface FactureInput {
  // Émetteur
  nomEmetteur: string;
  siret: string;
  adresseEmetteur: string;
  emailEmetteur?: string;
  telephoneEmetteur?: string;
  // Client
  nomClient: string;
  adresseClient: string;
  siretClient?: string;
  // Facture
  numeroFacture: string;
  dateFacture?: string; // ISO format, défaut = aujourd'hui
  dateEcheance?: string;
  lignes: LigneFacture[];
  // Options
  franchiseEnBaseTVA?: boolean;
  mentionsParticulieres?: string[];
  conditionsPaiement?: string;
  rib?: {
    iban: string;
    bic: string;
    banque: string;
  };
}

export interface FactureResult {
  texteFacture: string;
  totalHT: number;
  totalTVA: number;
  totalTTC: number;
  mentionsLegales: string[];
  avertissement: string;
}

export function genererFacture(input: FactureInput): FactureResult {
  const dateFacture = input.dateFacture ?? new Date().toISOString().split("T")[0];
  const dateEcheance =
    input.dateEcheance ??
    new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString().split("T")[0];

  // Calcul des lignes
  let totalHT = 0;
  let totalTVA = 0;
  const lignesDetail: string[] = [];

  for (const ligne of input.lignes) {
    const montantHT = Math.round(ligne.quantite * ligne.prixUnitaireHT * 100) / 100;
    const tva = input.franchiseEnBaseTVA ? 0 : ligne.tauxTVA ?? 0;
    const montantTVA = Math.round(montantHT * tva * 100) / 100;
    totalHT += montantHT;
    totalTVA += montantTVA;

    lignesDetail.push(
      `  ${ligne.description}\n` +
        `    Quantité : ${ligne.quantite} | Prix unitaire HT : ${ligne.prixUnitaireHT.toFixed(2)} € | ` +
        `Montant HT : ${montantHT.toFixed(2)} €` +
        (tva > 0 ? ` | TVA ${(tva * 100).toFixed(1)}% : ${montantTVA.toFixed(2)} €` : "")
    );
  }

  totalHT = Math.round(totalHT * 100) / 100;
  totalTVA = Math.round(totalTVA * 100) / 100;
  const totalTTC = Math.round((totalHT + totalTVA) * 100) / 100;

  // Mentions légales obligatoires
  const mentionsLegales: string[] = [
    `SIRET : ${input.siret}`,
    `Date de la facture : ${dateFacture}`,
    `Date d'échéance : ${dateEcheance}`,
  ];

  if (input.franchiseEnBaseTVA) {
    mentionsLegales.push(
      "TVA non applicable, art. 293 B du CGI"
    );
  }

  mentionsLegales.push(
    "En cas de retard de paiement, une pénalité de 3 fois le taux d'intérêt légal sera appliquée, " +
      "ainsi qu'une indemnité forfaitaire de recouvrement de 40 €."
  );

  if (input.conditionsPaiement) {
    mentionsLegales.push(`Conditions de paiement : ${input.conditionsPaiement}`);
  } else {
    mentionsLegales.push("Conditions de paiement : à 30 jours, par virement bancaire");
  }

  // Construction du texte
  let texte = "";
  texte += "═══════════════════════════════════════════════════\n";
  texte += "                      FACTURE\n";
  texte += "═══════════════════════════════════════════════════\n\n";

  texte += `Facture N° : ${input.numeroFacture}\n`;
  texte += `Date : ${dateFacture}\n`;
  texte += `Échéance : ${dateEcheance}\n\n`;

  texte += "── ÉMETTEUR ──────────────────────────────────────\n";
  texte += `${input.nomEmetteur}\n`;
  texte += `SIRET : ${input.siret}\n`;
  texte += `${input.adresseEmetteur}\n`;
  if (input.emailEmetteur) texte += `Email : ${input.emailEmetteur}\n`;
  if (input.telephoneEmetteur) texte += `Tél : ${input.telephoneEmetteur}\n`;
  texte += "\n";

  texte += "── CLIENT ────────────────────────────────────────\n";
  texte += `${input.nomClient}\n`;
  texte += `${input.adresseClient}\n`;
  if (input.siretClient) texte += `SIRET : ${input.siretClient}\n`;
  texte += "\n";

  texte += "── PRESTATIONS ───────────────────────────────────\n\n";
  texte += lignesDetail.join("\n\n");
  texte += "\n\n";

  texte += "── TOTAUX ────────────────────────────────────────\n";
  texte += `  Total HT  : ${totalHT.toFixed(2)} €\n`;
  if (!input.franchiseEnBaseTVA && totalTVA > 0) {
    texte += `  Total TVA : ${totalTVA.toFixed(2)} €\n`;
  }
  texte += `  Total TTC : ${totalTTC.toFixed(2)} €\n\n`;

  if (input.rib) {
    texte += "── COORDONNÉES BANCAIRES ─────────────────────────\n";
    texte += `  Banque : ${input.rib.banque}\n`;
    texte += `  IBAN : ${input.rib.iban}\n`;
    texte += `  BIC : ${input.rib.bic}\n\n`;
  }

  texte += "── MENTIONS LÉGALES ──────────────────────────────\n";
  for (const mention of mentionsLegales) {
    texte += `  ${mention}\n`;
  }

  if (input.mentionsParticulieres?.length) {
    texte += "\n── MENTIONS PARTICULIÈRES ─────────────────────────\n";
    for (const m of input.mentionsParticulieres) {
      texte += `  ${m}\n`;
    }
  }

  texte += "\n═══════════════════════════════════════════════════\n";

  return {
    texteFacture: texte,
    totalHT,
    totalTVA,
    totalTTC,
    mentionsLegales,
    avertissement:
      "⚠️ Cette facture est générée à titre indicatif. " +
      "Vérifiez la conformité avec votre logiciel de facturation certifié (obligatoire depuis 2026). " +
      "Ce document ne se substitue pas à une facture émise par un logiciel conforme à l'article 286-I-3° du CGI.",
  };
}
