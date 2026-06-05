/**
 * Outils basés sur les API publiques du gouvernement français (api.gouv.fr).
 *
 * APIs utilisées (toutes gratuites, sans authentification) :
 * - Recherche d'entreprises (SIRENE) : recherche-entreprises.api.gouv.fr
 * - Base Adresse Nationale (BAN) : api-adresse.data.gouv.fr
 * - Geo API (communes) : geo.api.gouv.fr
 */

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const TIMEOUT_MS = 10_000;

async function fetchJSON<T>(url: string): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(`API a répondu ${res.status} ${res.statusText}${body ? ` — ${body.slice(0, 200)}` : ""}`);
    }
    return (await res.json()) as T;
  } catch (e: any) {
    if (e.name === "AbortError") {
      throw new Error("Délai d'attente dépassé (10 s). L'API est peut-être indisponible.");
    }
    throw e;
  } finally {
    clearTimeout(timer);
  }
}

// ---------------------------------------------------------------------------
// Types — Recherche d'entreprises (SIRENE)
// ---------------------------------------------------------------------------

interface SireneEtablissement {
  siret: string;
  adresse: string;
  code_postal: string;
  commune: string;
  est_siege: boolean;
  tranche_effectif_salarie: string;
  date_creation: string;
  etat_administratif: string;
}

interface SireneResult {
  siren: string;
  nom_complet: string;
  nom_raison_sociale: string;
  nature_juridique: string;
  activite_principale: string;
  section_activite_principale: string;
  categorie_entreprise: string;
  tranche_effectif_salarie: string;
  date_creation: string;
  etat_administratif: string;
  siege: SireneEtablissement;
  nombre_etablissements: number;
  nombre_etablissements_ouverts: number;
  matching_etablissements?: SireneEtablissement[];
}

interface SireneResponse {
  results: SireneResult[];
  total_results: number;
  page: number;
  per_page: number;
}

// ---------------------------------------------------------------------------
// Types — Base Adresse Nationale (BAN)
// ---------------------------------------------------------------------------

interface BANFeature {
  type: "Feature";
  geometry: { type: "Point"; coordinates: [number, number] };
  properties: {
    label: string;
    score: number;
    housenumber?: string;
    id: string;
    name: string;
    postcode: string;
    citycode: string;
    city: string;
    context: string;
    type: string;
    importance: number;
    street?: string;
    district?: string;
  };
}

interface BANResponse {
  type: "FeatureCollection";
  version: string;
  features: BANFeature[];
  attribution: string;
  licence: string;
  query?: string;
  limit?: number;
}

// ---------------------------------------------------------------------------
// Types — Geo API (Communes)
// ---------------------------------------------------------------------------

interface GeoCommune {
  nom: string;
  code: string;
  codesPostaux: string[];
  population?: number;
  surface?: number;
  departement?: { code: string; nom: string };
  region?: { code: string; nom: string };
}

// ---------------------------------------------------------------------------
// search_company — Recherche d'entreprises françaises
// ---------------------------------------------------------------------------

export async function rechercherEntreprise(args: {
  recherche: string;
  codePostal?: string;
  activitePrincipale?: string;
  page?: number;
  parPage?: number;
}) {
  const params = new URLSearchParams();
  params.set("q", args.recherche);
  params.set("page", String(args.page ?? 1));
  params.set("per_page", String(args.parPage ?? 5));
  if (args.codePostal) params.set("code_postal", args.codePostal);
  if (args.activitePrincipale) params.set("activite_principale", args.activitePrincipale);

  const url = `https://recherche-entreprises.api.gouv.fr/search?${params}`;
  const data = await fetchJSON<SireneResponse>(url);

  if (data.total_results === 0) {
    return {
      resultats: [],
      totalResultats: 0,
      message: `Aucune entreprise trouvée pour « ${args.recherche} ».`,
    };
  }

  const resultats = data.results.map((r) => ({
    siren: r.siren,
    nomComplet: r.nom_complet,
    raisonSociale: r.nom_raison_sociale,
    natureJuridique: r.nature_juridique,
    activitePrincipale: r.activite_principale,
    sectionActivite: r.section_activite_principale,
    categorieEntreprise: r.categorie_entreprise,
    trancheEffectif: r.tranche_effectif_salarie,
    dateCreation: r.date_creation,
    etatAdministratif: r.etat_administratif,
    siege: r.siege
      ? {
          siret: r.siege.siret,
          adresse: r.siege.adresse,
          codePostal: r.siege.code_postal,
          commune: r.siege.commune,
          trancheEffectif: r.siege.tranche_effectif_salarie,
          dateCreation: r.siege.date_creation,
          etatAdministratif: r.siege.etat_administratif,
        }
      : null,
    nombreEtablissements: r.nombre_etablissements,
    nombreEtablissementsOuverts: r.nombre_etablissements_ouverts,
  }));

  return {
    resultats,
    totalResultats: data.total_results,
    page: data.page,
    parPage: data.per_page,
    source: "API Recherche d'entreprises — recherche-entreprises.api.gouv.fr (données SIRENE, INSEE)",
  };
}

// ---------------------------------------------------------------------------
// get_company_details — Détails d'une entreprise par SIREN/SIRET
// ---------------------------------------------------------------------------

export async function detailsEntreprise(args: { sirenOuSiret: string }) {
  const cleaned = args.sirenOuSiret.replace(/\s/g, "");
  if (!/^\d{9}(\d{5})?$/.test(cleaned)) {
    throw new Error(
      `« ${args.sirenOuSiret} » n'est pas un numéro SIREN (9 chiffres) ou SIRET (14 chiffres) valide.`
    );
  }

  const url = `https://recherche-entreprises.api.gouv.fr/search?q=${cleaned}&page=1&per_page=1`;
  const data = await fetchJSON<SireneResponse>(url);

  if (data.total_results === 0) {
    return {
      trouve: false,
      message: `Aucune entreprise trouvée pour le numéro ${cleaned}. Vérifiez le SIREN/SIRET.`,
    };
  }

  const r = data.results[0];
  return {
    trouve: true,
    siren: r.siren,
    nomComplet: r.nom_complet,
    raisonSociale: r.nom_raison_sociale,
    natureJuridique: r.nature_juridique,
    activitePrincipale: r.activite_principale,
    sectionActivite: r.section_activite_principale,
    categorieEntreprise: r.categorie_entreprise,
    trancheEffectif: r.tranche_effectif_salarie,
    dateCreation: r.date_creation,
    etatAdministratif: r.etat_administratif,
    siege: r.siege
      ? {
          siret: r.siege.siret,
          adresse: r.siege.adresse,
          codePostal: r.siege.code_postal,
          commune: r.siege.commune,
          trancheEffectif: r.siege.tranche_effectif_salarie,
          dateCreation: r.siege.date_creation,
          etatAdministratif: r.siege.etat_administratif,
        }
      : null,
    nombreEtablissements: r.nombre_etablissements,
    nombreEtablissementsOuverts: r.nombre_etablissements_ouverts,
    source: "API Recherche d'entreprises — recherche-entreprises.api.gouv.fr (données SIRENE, INSEE)",
  };
}

// ---------------------------------------------------------------------------
// validate_address — Validation et géocodage d'adresse française
// ---------------------------------------------------------------------------

export async function validerAdresse(args: {
  adresse: string;
  codePostal?: string;
  type?: string;
  limite?: number;
}) {
  const params = new URLSearchParams();
  params.set("q", args.adresse);
  params.set("limit", String(args.limite ?? 5));
  if (args.codePostal) params.set("postcode", args.codePostal);
  if (args.type) params.set("type", args.type);

  const url = `https://api-adresse.data.gouv.fr/search/?${params}`;
  const data = await fetchJSON<BANResponse>(url);

  if (data.features.length === 0) {
    return {
      resultats: [],
      message: `Aucune adresse trouvée pour « ${args.adresse} ».`,
    };
  }

  const resultats = data.features.map((f) => ({
    adresseComplete: f.properties.label,
    score: Math.round(f.properties.score * 100) / 100,
    numero: f.properties.housenumber ?? null,
    rue: f.properties.street ?? f.properties.name,
    codePostal: f.properties.postcode,
    codeCommune: f.properties.citycode,
    commune: f.properties.city,
    contexte: f.properties.context,
    type: f.properties.type,
    coordonnees: {
      longitude: f.geometry.coordinates[0],
      latitude: f.geometry.coordinates[1],
    },
  }));

  return {
    resultats,
    source: "Base Adresse Nationale (BAN) — api-adresse.data.gouv.fr",
  };
}

// ---------------------------------------------------------------------------
// reverse_geocode — Géocodage inverse (coordonnées → adresse)
// ---------------------------------------------------------------------------

export async function geocodageInverse(args: { longitude: number; latitude: number }) {
  if (args.latitude < 41 || args.latitude > 52 || args.longitude < -5.5 || args.longitude > 10) {
    throw new Error(
      "Les coordonnées semblent hors de France métropolitaine (lat 41-52, lon -5.5 à 10)."
    );
  }

  const url = `https://api-adresse.data.gouv.fr/reverse/?lon=${args.longitude}&lat=${args.latitude}`;
  const data = await fetchJSON<BANResponse>(url);

  if (data.features.length === 0) {
    return {
      resultats: [],
      message: `Aucune adresse trouvée aux coordonnées (${args.latitude}, ${args.longitude}).`,
    };
  }

  const resultats = data.features.map((f) => ({
    adresseComplete: f.properties.label,
    distance: f.properties.score,
    numero: f.properties.housenumber ?? null,
    rue: f.properties.street ?? f.properties.name,
    codePostal: f.properties.postcode,
    codeCommune: f.properties.citycode,
    commune: f.properties.city,
    contexte: f.properties.context,
    type: f.properties.type,
    coordonnees: {
      longitude: f.geometry.coordinates[0],
      latitude: f.geometry.coordinates[1],
    },
  }));

  return {
    resultats,
    source: "Base Adresse Nationale (BAN) — api-adresse.data.gouv.fr",
  };
}

// ---------------------------------------------------------------------------
// get_commune_info — Informations sur une commune française
// ---------------------------------------------------------------------------

export async function infoCommune(args: {
  nom?: string;
  codePostal?: string;
  codeInsee?: string;
  limite?: number;
}) {
  if (!args.nom && !args.codePostal && !args.codeInsee) {
    throw new Error("Fournissez au moins un critère : nom, codePostal ou codeInsee.");
  }

  const fields = "nom,code,codesPostaux,population,surface,departement,region";
  let url: string;

  if (args.codeInsee) {
    url = `https://geo.api.gouv.fr/communes/${args.codeInsee}?fields=${fields}`;
    const data = await fetchJSON<GeoCommune>(url);
    return {
      resultats: [formatCommune(data)],
      source: "Geo API — geo.api.gouv.fr",
    };
  }

  const params = new URLSearchParams();
  params.set("fields", fields);
  params.set("limit", String(args.limite ?? 5));
  if (args.nom) params.set("nom", args.nom);
  if (args.codePostal) params.set("codePostal", args.codePostal);

  url = `https://geo.api.gouv.fr/communes?${params}`;
  const data = await fetchJSON<GeoCommune[]>(url);

  if (data.length === 0) {
    const critere = args.nom ? `nom « ${args.nom} »` : `code postal ${args.codePostal}`;
    return {
      resultats: [],
      message: `Aucune commune trouvée pour ${critere}.`,
    };
  }

  return {
    resultats: data.map(formatCommune),
    source: "Geo API — geo.api.gouv.fr",
  };
}

function formatCommune(c: GeoCommune) {
  return {
    nom: c.nom,
    codeInsee: c.code,
    codesPostaux: c.codesPostaux,
    population: c.population ?? null,
    surfaceHectares: c.surface ?? null,
    departement: c.departement ? { code: c.departement.code, nom: c.departement.nom } : null,
    region: c.region ? { code: c.region.code, nom: c.region.nom } : null,
  };
}
