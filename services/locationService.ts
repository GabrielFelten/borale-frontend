// src/services/locationService.ts

export interface UserLocation {
  latitude: number;
  longitude: number;
  city?: string;
  state?: string;
}

export function getBrowserLocation(): Promise<UserLocation> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocalização não é suportada pelo navegador."));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
      },
      (err) => reject(err)
    );
  });
}

const stateAbbreviations: Record<string, string> = {
  "Acre": "AC",
  "Alagoas": "AL",
  "Amapá": "AP",
  "Amazonas": "AM",
  "Bahia": "BA",
  "Ceará": "CE",
  "Distrito Federal": "DF",
  "Espírito Santo": "ES",
  "Goiás": "GO",
  "Maranhão": "MA",
  "Mato Grosso": "MT",
  "Mato Grosso do Sul": "MS",
  "Minas Gerais": "MG",
  "Pará": "PA",
  "Paraíba": "PB",
  "Paraná": "PR",
  "Pernambuco": "PE",
  "Piauí": "PI",
  "Rio de Janeiro": "RJ",
  "Rio Grande do Norte": "RN",
  "Rio Grande do Sul": "RS",
  "Rondônia": "RO",
  "Roraima": "RR",
  "Santa Catarina": "SC",
  "São Paulo": "SP",
  "Sergipe": "SE",
  "Tocantins": "TO",
};

function getStateAbbreviation(stateName?: string): string | undefined {
  if (!stateName) return undefined;
  return stateAbbreviations[stateName];
}

export async function getCityAndState(latitude: number, longitude: number) {
  const res = await fetch(
    `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=pt`
  );
  if (!res.ok) throw new Error("Erro ao obter cidade/estado");

  const data = await res.json();

  const fullState = data.principalSubdivision;
  const stateAlias = getStateAbbreviation(fullState);

  return {
    city: data.city || data.locality,
    state: stateAlias || fullState, // se não achar, retorna o nome completo como fallback
  };
}

export async function getLocationWithCity(): Promise<UserLocation> {
  const location = await getBrowserLocation();
  const region = await getCityAndState(location.latitude, location.longitude);
  return { ...location, ...region };
}