/**
 * Rédaction de courriers administratifs formels en français.
 */

export interface CourrierInput {
  type:
    | "contestation"
    | "resiliation"
    | "reclamation"
    | "demande"
    | "mise_en_demeure"
    | "signalement"
    | "autre";
  expediteur: {
    nom: string;
    adresse: string;
    telephone?: string;
    email?: string;
  };
  destinataire: {
    nom: string;
    adresse: string;
    service?: string;
  };
  objet: string;
  contexte: string;
  demandeSpecifique: string;
  pieces_jointes?: string[];
  recommande?: boolean;
}

export interface CourrierResult {
  courrier: string;
  conseilsEnvoi: string[];
  avertissement: string;
}

export function redigerCourrier(input: CourrierInput): CourrierResult {
  const date = new Date().toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const ville = extraireVille(input.expediteur.adresse);

  let formuleIntro: string;
  let formuleConclusion: string;
  let corps: string;

  switch (input.type) {
    case "contestation":
      formuleIntro =
        "Par la présente, je me permets de contester la décision mentionnée en objet.";
      corps = `${input.contexte}\n\nEn conséquence, ${input.demandeSpecifique}`;
      formuleConclusion =
        "Je vous prie de bien vouloir réexaminer ma situation et de me faire part de votre décision dans les meilleurs délais.";
      break;

    case "resiliation":
      formuleIntro =
        "Par la présente, je vous informe de ma volonté de résilier le contrat mentionné en objet.";
      corps = `${input.contexte}\n\nJe vous demande de bien vouloir ${input.demandeSpecifique}`;
      formuleConclusion =
        "Je vous prie de bien vouloir prendre acte de cette résiliation et de me confirmer sa bonne prise en compte par retour de courrier.";
      break;

    case "reclamation":
      formuleIntro =
        "Par la présente, je souhaite porter à votre connaissance la réclamation suivante.";
      corps = `${input.contexte}\n\n${input.demandeSpecifique}`;
      formuleConclusion =
        "Sans réponse satisfaisante de votre part sous 30 jours, je me réserve le droit de saisir les instances compétentes (Médiateur, Tribunal).";
      break;

    case "mise_en_demeure":
      formuleIntro =
        "Par la présente, je vous mets en demeure de satisfaire à l'obligation suivante.";
      corps = `${input.contexte}\n\nJe vous demande expressément de ${input.demandeSpecifique}`;
      formuleConclusion =
        "À défaut d'exécution dans un délai de 15 jours à compter de la réception de ce courrier, " +
        "je me réserve le droit d'engager toute procédure judiciaire utile à la défense de mes intérêts, " +
        "sans autre avis ni mise en demeure.";
      break;

    case "signalement":
      formuleIntro =
        "Par la présente, je souhaite porter à votre connaissance les faits suivants.";
      corps = `${input.contexte}\n\n${input.demandeSpecifique}`;
      formuleConclusion =
        "Je vous remercie de l'attention que vous porterez à ce signalement et reste à votre disposition pour tout complément d'information.";
      break;

    default:
      formuleIntro =
        "Par la présente, je me permets de vous adresser la demande suivante.";
      corps = `${input.contexte}\n\n${input.demandeSpecifique}`;
      formuleConclusion =
        "Je vous remercie par avance de l'attention que vous porterez à ma demande et reste à votre disposition.";
  }

  // Construction du courrier
  let courrier = "";

  // En-tête expéditeur
  courrier += `${input.expediteur.nom}\n`;
  courrier += `${input.expediteur.adresse}\n`;
  if (input.expediteur.telephone) courrier += `Tél : ${input.expediteur.telephone}\n`;
  if (input.expediteur.email) courrier += `Email : ${input.expediteur.email}\n`;
  courrier += "\n";

  // Destinataire
  courrier += `${input.destinataire.nom}\n`;
  if (input.destinataire.service) courrier += `${input.destinataire.service}\n`;
  courrier += `${input.destinataire.adresse}\n`;
  courrier += "\n";

  // Lieu et date
  courrier += `${ville}, le ${date}\n\n`;

  // Objet
  courrier += `Objet : ${input.objet}\n`;
  if (input.recommande) {
    courrier += `Envoi : Lettre recommandée avec accusé de réception\n`;
  }
  courrier += "\n";

  // Corps
  courrier += `Madame, Monsieur,\n\n`;
  courrier += `${formuleIntro}\n\n`;
  courrier += `${corps}\n\n`;
  courrier += `${formuleConclusion}\n\n`;

  // Formule de politesse
  courrier += `Je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées.\n\n`;
  courrier += `${input.expediteur.nom}\n`;
  courrier += `[Signature]\n`;

  // Pièces jointes
  if (input.pieces_jointes?.length) {
    courrier += `\nPièces jointes :\n`;
    for (const pj of input.pieces_jointes) {
      courrier += `- ${pj}\n`;
    }
  }

  // Conseils
  const conseils: string[] = [];
  if (input.recommande || input.type === "mise_en_demeure" || input.type === "contestation") {
    conseils.push(
      "Envoyez ce courrier en RECOMMANDÉ AVEC ACCUSÉ DE RÉCEPTION (LRAR) pour preuve de réception"
    );
  }
  conseils.push("Conservez une copie du courrier et de l'accusé de réception");
  conseils.push("Notez la date d'envoi et le numéro de suivi");

  if (input.type === "contestation") {
    conseils.push(
      "Vérifiez le délai de contestation applicable (souvent 2 mois après notification)"
    );
  }
  if (input.type === "mise_en_demeure") {
    conseils.push(
      "La mise en demeure est un préalable souvent obligatoire avant toute action en justice"
    );
    conseils.push("Consultez un avocat si le montant en jeu est important");
  }

  return {
    courrier,
    conseilsEnvoi: conseils,
    avertissement:
      "⚠️ Ce courrier est un modèle indicatif. Adaptez-le à votre situation précise. " +
      "Pour les cas complexes (contentieux important, mise en demeure), " +
      "consultez un avocat ou une association de consommateurs. " +
      "Ce document ne constitue pas un conseil juridique.",
  };
}

function extraireVille(adresse: string): string {
  // Essayer d'extraire la ville depuis l'adresse
  const parts = adresse.split(",").map((s) => s.trim());
  if (parts.length >= 2) {
    const dernierePart = parts[parts.length - 1];
    // Retirer le code postal
    const villeSansCP = dernierePart.replace(/^\d{5}\s*/, "").trim();
    if (villeSansCP) return villeSansCP;
    return dernierePart;
  }
  return adresse;
}
