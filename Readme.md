## Backend Let Me Safe


## Fluxo de adição de endereço
- se existir endereço local 
  - pega id do endereço e coloca no usuario
  
- senão existir endereço
  - via cep, pega os dados
  - cadastra na tabela de endereço
  - setar id do usuario
  

	const mapbox = require('mapbox-gl');
const MapboxDirections = require('@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions');
const fetch = require('node-fetch');

// Configurar a chave de acesso do Mapbox
mapbox.accessToken = 'SUA_CHAVE_DE_ACESSO';

async function obterRotaSegura(origem, destino, ocorrencia, pontosDesvios) {
  // Obter as coordenadas da origem, destino, ocorrência e pontos de desvio
  const origemCoords = origem.coordinates;
  const destinoCoords = destino.coordinates;
  const ocorrenciaCoords = ocorrencia.coordinates;
  const desviosCoords = pontosDesvios.map(ponto => ponto.coordinates);

  // Calcular a rota mais curta entre a origem, destino e os pontos de desvio
  const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${origemCoords};${desviosCoords.join(';')};${destinoCoords}?geometries=geojson&access_token=${mapbox.accessToken}`;
  const response = await fetch(url);
  const data = await response.json();

  // Extrair a rota mais curta da resposta
  const rotaInsegura = data.routes[0];

  // Calcular a rota segura usando o Mapbox Directions API
  const directions = new MapboxDirections({
    accessToken: mapbox.accessToken,
    unit: 'metric',
    profile: 'mapbox/driving',
    alternatives: false,
    geometries: 'geojson'
  });
  const route = await directions.setOrigin(origemCoords).setDestination(destinoCoords).setWaypoints([ocorrenciaCoords, ...pontosDesvios]).getRoute();

  // Retornar apenas a rota segura em formato JSON
  return route[0].geometry;
}

module.exports = { obterRotaSegura };

