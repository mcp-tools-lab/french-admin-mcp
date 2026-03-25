/**
 * Conventions collectives les plus courantes en France.
 * Source : legifrance.gouv.fr, convention.fr
 *
 * Données indicatives — toujours vérifier sur legifrance.
 */

export interface ConventionCollective {
  idcc: string;
  titre: string;
  branche: string;
  dureePrevis: {
    demission: string;
    licenciement: string;
  };
  periodEssai: {
    ouvrier: string;
    employe: string;
    technicien: string;
    cadre: string;
  };
  congesSpeciaux: string[];
  indemniteConventionnelle: string;
  particularites: string[];
}

export const CONVENTIONS: Record<string, ConventionCollective> = {
  "3248": {
    idcc: "3248",
    titre: "Convention collective de la métallurgie",
    branche: "Industrie métallurgique",
    dureePrevis: {
      demission: "1 mois (ouvrier/employé), 2 mois (technicien), 3 mois (cadre)",
      licenciement: "1 mois (<2 ans ancienneté), 2 mois (≥2 ans)",
    },
    periodEssai: {
      ouvrier: "2 mois (renouvelable 2 mois)",
      employe: "2 mois (renouvelable 2 mois)",
      technicien: "3 mois (renouvelable 3 mois)",
      cadre: "4 mois (renouvelable 4 mois)",
    },
    congesSpeciaux: [
      "Mariage : 5 jours",
      "Naissance : 3 jours",
      "Décès conjoint : 5 jours",
      "Décès parent : 3 jours",
      "Déménagement : 1 jour",
    ],
    indemniteConventionnelle: "1/4 de mois par année (< 10 ans) + 1/3 de mois (≥ 10 ans)",
    particularites: [
      "Nouvelle convention unifiée depuis 2024 (fusion des anciennes CC territoriales)",
      "Classification par emplois-repères et cotation de poste",
      "Prime d'ancienneté possible selon entreprise",
    ],
  },
  "1486": {
    idcc: "1486",
    titre: "Convention collective des bureaux d'études techniques (SYNTEC)",
    branche: "Bureaux d'études, conseil, ingénierie, numérique",
    dureePrevis: {
      demission: "1 mois (ETAM), 3 mois (cadre)",
      licenciement: "1 mois (ETAM <2 ans), 2 mois (ETAM ≥2 ans), 3 mois (cadre)",
    },
    periodEssai: {
      ouvrier: "2 mois",
      employe: "2 mois",
      technicien: "3 mois",
      cadre: "4 mois",
    },
    congesSpeciaux: [
      "Mariage salarié : 4 jours",
      "PACS : 4 jours",
      "Naissance/adoption : 3 jours",
      "Décès conjoint : 3 jours",
      "Décès parent : 3 jours",
      "Décès frère/soeur : 3 jours",
      "Enfant malade : 3-5 jours/an (selon âge)",
    ],
    indemniteConventionnelle:
      "1/3 de mois par année d'ancienneté (cadres), 1/4 de mois (ETAM)",
    particularites: [
      "Grille de salaires minimaux par position et coefficient",
      "Très répandue dans l'IT, le conseil, l'ingénierie",
      "Heures supplémentaires : majoration 25% (8 premières) puis 50%",
      "Clause de mobilité fréquente",
    ],
  },
  "2609": {
    idcc: "2609",
    titre: "Convention collective des employés de commerce de détail",
    branche: "Commerce de détail alimentaire et non-alimentaire",
    dureePrevis: {
      demission: "1 mois (employé), 2 mois (agent de maîtrise), 3 mois (cadre)",
      licenciement: "1 mois (<2 ans), 2 mois (≥2 ans)",
    },
    periodEssai: {
      ouvrier: "2 mois",
      employe: "2 mois",
      technicien: "3 mois",
      cadre: "4 mois",
    },
    congesSpeciaux: [
      "Mariage : 4 jours",
      "Naissance : 3 jours",
      "Décès conjoint : 3 jours",
      "Décès parent : 3 jours",
    ],
    indemniteConventionnelle: "1/5 de mois par année + 2/15 au-delà de 10 ans",
    particularites: [
      "Travail le dimanche : majorations selon accords",
      "13ème mois possible selon entreprise",
      "Jours fériés : majorations prévues",
    ],
  },
  "0016": {
    idcc: "0016",
    titre: "Convention collective des transports routiers",
    branche: "Transport routier de marchandises et voyageurs",
    dureePrevis: {
      demission: "1 semaine (<6 mois), 1 mois (6 mois-2 ans), 2 mois (>2 ans)",
      licenciement: "1 mois (<2 ans), 2 mois (≥2 ans cadre : 3 mois)",
    },
    periodEssai: {
      ouvrier: "1 mois (renouvelable 1 mois)",
      employe: "1 mois (renouvelable 1 mois)",
      technicien: "2 mois (renouvelable 2 mois)",
      cadre: "3 mois (renouvelable 3 mois)",
    },
    congesSpeciaux: [
      "Mariage : 4 jours",
      "Naissance : 3 jours",
      "Décès conjoint : 3 jours",
      "Décès parent : 3 jours",
    ],
    indemniteConventionnelle: "2/10 de mois par année (+ 1/15 au-delà de 15 ans)",
    particularites: [
      "Temps de service spécifique (temps d'attente, de chargement)",
      "Indemnités de déplacement et de repas",
      "Réglementation stricte des temps de conduite et de repos",
    ],
  },
  "3239": {
    idcc: "3239",
    titre: "Convention collective du particulier employeur",
    branche: "Emploi à domicile (ménage, garde d'enfants, aide à domicile)",
    dureePrevis: {
      demission: "1 semaine (<6 mois), 2 semaines (6 mois-2 ans), 1 mois (>2 ans)",
      licenciement: "1 semaine (<6 mois), 1 mois (6 mois-2 ans), 2 mois (>2 ans)",
    },
    periodEssai: {
      ouvrier: "1 mois",
      employe: "1 mois",
      technicien: "1 mois",
      cadre: "1 mois",
    },
    congesSpeciaux: [
      "Mariage : 4 jours",
      "Naissance : 3 jours",
      "Décès conjoint/partenaire PACS : 5 jours",
    ],
    indemniteConventionnelle: "1/4 de mois par année d'ancienneté",
    particularites: [
      "Gestion via CESU (Chèque Emploi Service Universel)",
      "Cotisations via Pajemploi ou CESU selon le cas",
      "Possibilité de crédit d'impôt 50% pour l'employeur",
    ],
  },
};

export function rechercherConvention(
  query: string
): ConventionCollective | undefined {
  // Par IDCC
  if (CONVENTIONS[query]) return CONVENTIONS[query];

  // Par mot-clé
  const q = query.toLowerCase();
  for (const conv of Object.values(CONVENTIONS)) {
    if (
      conv.titre.toLowerCase().includes(q) ||
      conv.branche.toLowerCase().includes(q) ||
      conv.idcc === q
    ) {
      return conv;
    }
  }
  return undefined;
}

export function listConventions(): string[] {
  return Object.values(CONVENTIONS).map((c) => `IDCC ${c.idcc}: ${c.titre}`);
}
