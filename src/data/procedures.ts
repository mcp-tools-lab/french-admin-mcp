/**
 * Guide des démarches administratives courantes.
 */

export interface Procedure {
  titre: string;
  description: string;
  etapes: string[];
  documentsNecessaires: string[];
  ou: string;
  delai: string;
  cout: string;
  liens: string[];
  conseils: string[];
}

export const PROCEDURES: Record<string, Procedure> = {
  carte_identite: {
    titre: "Carte nationale d'identité (CNI)",
    description: "Demande ou renouvellement de carte d'identité.",
    etapes: [
      "Faire une pré-demande en ligne sur ants.gouv.fr",
      "Prendre rendez-vous en mairie (ou auprès d'un guichet équipé)",
      "Se présenter avec le dossier complet et le numéro de pré-demande",
      "Recueil des empreintes digitales",
      "Retirer la carte en mairie (même lieu que le dépôt)",
    ],
    documentsNecessaires: [
      "Photo d'identité conforme (moins de 6 mois)",
      "Justificatif de domicile (moins de 1 an)",
      "Numéro de pré-demande ANTS",
      "Ancienne carte d'identité (si renouvellement)",
      "Acte de naissance (si première demande ou carte perdue)",
    ],
    ou: "Mairie équipée d'un dispositif de recueil",
    delai: "2 à 4 semaines (jusqu'à 6 en période estivale)",
    cout: "Gratuit (renouvellement) — 25 € en cas de perte ou vol",
    liens: ["https://ants.gouv.fr", "https://www.service-public.fr/particuliers/vosdroits/N358"],
    conseils: [
      "Penser à prendre RDV tôt — les créneaux sont souvent complets 2-3 semaines à l'avance",
      "La photo doit être récente, sur fond clair, sans sourire, sans lunettes",
      "Vérifier que la mairie choisie est bien équipée (toutes ne le sont pas)",
    ],
  },
  passeport: {
    titre: "Passeport biométrique",
    description: "Demande ou renouvellement de passeport.",
    etapes: [
      "Faire une pré-demande en ligne sur ants.gouv.fr",
      "Acheter un timbre fiscal (86 € adulte, 42 € 15-17 ans, 17 € moins de 15 ans)",
      "Prendre rendez-vous en mairie",
      "Se présenter avec le dossier complet",
      "Retirer le passeport en mairie",
    ],
    documentsNecessaires: [
      "Photo d'identité conforme",
      "Justificatif de domicile",
      "Timbre fiscal",
      "Numéro de pré-demande ANTS",
      "CNI ou ancien passeport",
      "Acte de naissance (si première demande)",
    ],
    ou: "Mairie équipée d'un dispositif de recueil",
    delai: "2 à 4 semaines (jusqu'à 8 en été)",
    cout: "86 € (adulte), 42 € (15-17 ans), 17 € (moins de 15 ans)",
    liens: ["https://ants.gouv.fr", "https://www.service-public.fr/particuliers/vosdroits/N360"],
    conseils: [
      "Anticiper : en période de vacances, les délais explosent",
      "Le timbre fiscal peut s'acheter en ligne sur timbres.impots.gouv.fr",
      "Si voyage urgent, demander la procédure d'urgence en préfecture",
    ],
  },
  permis_conduire: {
    titre: "Permis de conduire",
    description: "Demande, renouvellement ou échange de permis de conduire.",
    etapes: [
      "Créer un compte sur ants.gouv.fr",
      "Remplir le formulaire de demande en ligne",
      "Joindre les pièces justificatives numérisées",
      "Suivre l'avancement sur ants.gouv.fr",
      "Recevoir le permis par courrier recommandé",
    ],
    documentsNecessaires: [
      "Photo d'identité numérique (e-photo ou photomaton agréé)",
      "Justificatif de domicile",
      "Pièce d'identité",
      "Ancien permis (si renouvellement/échange)",
    ],
    ou: "En ligne sur ants.gouv.fr uniquement (plus en préfecture)",
    delai: "2 à 6 semaines",
    cout: "Gratuit (première demande et renouvellement) — 25 € en cas de perte/vol",
    liens: ["https://ants.gouv.fr", "https://www.service-public.fr/particuliers/vosdroits/N530"],
    conseils: [
      "La photo doit être une e-photo (code ephoto) ou via un photomaton agréé ANTS",
      "Pour un échange de permis étranger, les délais peuvent être très longs (6-12 mois)",
    ],
  },
  declaration_impots: {
    titre: "Déclaration de revenus",
    description: "Déclaration annuelle de revenus aux impôts.",
    etapes: [
      "Se connecter sur impots.gouv.fr (FranceConnect ou identifiants fiscaux)",
      "Vérifier la déclaration pré-remplie",
      "Corriger/compléter les revenus, charges déductibles, crédits d'impôt",
      "Signer et valider la déclaration en ligne",
      "Conserver l'accusé de réception",
    ],
    documentsNecessaires: [
      "Numéro fiscal (13 chiffres) et mot de passe ou FranceConnect",
      "Bulletins de salaire de l'année",
      "Relevés bancaires (intérêts, dividendes)",
      "Justificatifs de charges déductibles (dons, frais de garde, etc.)",
      "Attestation employeur (si applicable)",
    ],
    ou: "En ligne sur impots.gouv.fr (obligatoire sauf exception)",
    delai: "Avril à juin (dates limites selon le département)",
    cout: "Gratuit",
    liens: ["https://www.impots.gouv.fr", "https://www.service-public.fr/particuliers/vosdroits/N247"],
    conseils: [
      "Ne pas oublier les revenus Airbnb, ventes en ligne (Vinted, Leboncoin) au-delà de 2000€ ou 30 transactions",
      "Le prélèvement à la source ne dispense PAS de déclarer",
      "Vérifier les cases pré-remplies — des erreurs existent",
    ],
  },
  creation_auto_entrepreneur: {
    titre: "Création de micro-entreprise (auto-entrepreneur)",
    description: "Déclaration de début d'activité en tant que micro-entrepreneur.",
    etapes: [
      "Vérifier l'éligibilité au régime micro-entrepreneur",
      "Faire la déclaration sur formalites.entreprises.gouv.fr (guichet unique)",
      "Choisir le régime fiscal (versement libératoire ou non)",
      "Choisir la périodicité de déclaration URSSAF (mensuelle ou trimestrielle)",
      "Recevoir le numéro SIRET sous 1 à 4 semaines",
      "S'inscrire sur autoentrepreneur.urssaf.fr pour déclarer et payer",
    ],
    documentsNecessaires: [
      "Pièce d'identité",
      "Justificatif de domicile",
      "Attestation de non-condamnation (sur l'honneur)",
      "Diplôme ou justificatif de qualification (si activité réglementée)",
    ],
    ou: "En ligne sur formalites.entreprises.gouv.fr",
    delai: "SIRET reçu sous 1 à 4 semaines",
    cout: "Gratuit",
    liens: [
      "https://formalites.entreprises.gouv.fr",
      "https://www.autoentrepreneur.urssaf.fr",
      "https://www.service-public.fr/professionnels-entreprises/vosdroits/F23264",
    ],
    conseils: [
      "ACRE (exonération partielle 1ère année) : en faire la demande lors de l'inscription",
      "Si activité artisanale, une inscription au Répertoire des Métiers peut être nécessaire",
      "Le versement libératoire n'est intéressant que si le RFR/part < 28 797 €",
    ],
  },
  carte_grise: {
    titre: "Certificat d'immatriculation (carte grise)",
    description: "Demande de carte grise pour un véhicule neuf ou d'occasion.",
    etapes: [
      "Se connecter sur ants.gouv.fr ou utiliser un professionnel habilité",
      "Remplir le formulaire en ligne",
      "Payer la taxe régionale et les frais",
      "Recevoir un certificat provisoire (CPI) immédiatement",
      "Recevoir la carte grise définitive par courrier (sous 1 semaine)",
    ],
    documentsNecessaires: [
      "Ancienne carte grise barrée et signée (occasion)",
      "Certificat de cession (cerfa 15776)",
      "Contrôle technique valide (véhicule > 4 ans)",
      "Pièce d'identité et justificatif de domicile",
      "Permis de conduire",
    ],
    ou: "En ligne sur ants.gouv.fr (plus en préfecture)",
    delai: "CPI immédiat, carte grise sous 1 semaine",
    cout: "Variable selon la région et la puissance fiscale (calculateur sur ants.gouv.fr)",
    liens: ["https://ants.gouv.fr", "https://www.service-public.fr/particuliers/vosdroits/N367"],
    conseils: [
      "Vous avez 1 mois après l'achat pour faire la carte grise",
      "Vérifier le contrôle technique AVANT l'achat d'un véhicule d'occasion",
      "Des sites frauduleux imitent le site officiel — utiliser uniquement ants.gouv.fr",
    ],
  },
};

export function getProcedure(nom: string): Procedure | undefined {
  // Recherche exacte puis recherche partielle
  if (PROCEDURES[nom]) return PROCEDURES[nom];

  const normalise = nom.toLowerCase().replace(/[^a-z]/g, "");
  for (const [key, proc] of Object.entries(PROCEDURES)) {
    if (
      key.includes(normalise) ||
      proc.titre.toLowerCase().replace(/[^a-z]/g, "").includes(normalise)
    ) {
      return proc;
    }
  }
  return undefined;
}

export function listProcedures(): string[] {
  return Object.entries(PROCEDURES).map(([key, proc]) => `${key}: ${proc.titre}`);
}
