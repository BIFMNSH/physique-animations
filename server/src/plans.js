// Pass : prix en F CFA (multiples de 5, exigé par CinetPay). Hypothèses de départ, à valider.
export const PLANS = {
  eleve: { label: 'Élève', prices: { mois: 1000, trim: 2500, an: 6000 } },
  prof: { label: 'Enseignant', prices: { mois: 2500, trim: 6000, an: 15000 } },
};
// « an » = année scolaire (9 mois).
export const MONTHS = { mois: 1, trim: 3, an: 9 };
export const priceOf = (plan, period) => PLANS[plan]?.prices?.[period] ?? null;
