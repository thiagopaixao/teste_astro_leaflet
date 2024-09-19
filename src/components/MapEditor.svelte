<script>
import { onMount, createEventDispatcher } from 'svelte';
import L from 'leaflet';
import '@geoman-io/leaflet-geoman-free';

const dispatch = createEventDispatcher();

export let value = {
  latitude: -14.235004,
  longitude: -51.92528,
  zoom: 4,
  geojson: JSON.stringify({
    "type": "FeatureCollection",
    "features": []
  })
};

let map;
let mapContainer;
let drawnItems;

onMount(() => {
  map = L.map(mapContainer).setView([value.latitude, value.longitude], value.zoom);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  drawnItems = new L.FeatureGroup();
  map.addLayer(drawnItems);

  map.pm.addControls({
    position: 'topleft',
    drawCircle: false,
  });

  const geojsonData = value.geojson ? JSON.parse(value.geojson) : {
    "type": "FeatureCollection",
    "features": []
  };
  L.geoJSON(geojsonData).addTo(drawnItems);

  map.on('pm:create', updateMapData);
  map.on('pm:remove', updateMapData);
  map.on('pm:edit', updateMapData);
  map.on('moveend', updateMapData);

  const handleMessage = (event) => {
    if (event.data && (event.data.geojson || event.data.latitude || event.data.longitude || event.data.zoom)) {
      value = {
        ...value,
        ...event.data
      };
      updateMap();
      dispatch('change', value);
    }
  };

  window.addEventListener('message', handleMessage);

  onDestroy(() => {
    window.removeEventListener('message', handleMessage);
  });
});

function updateMapData() {
  const center = map.getCenter();
  const layers = findLayers(map);
  const geojsonData = {
    type: 'FeatureCollection',
    features: layers.map(layer => layer.toGeoJSON())
  };
  const newValue = {
    latitude: center.lat,
    longitude: center.lng,
    zoom: map.getZoom(),
    geojson: JSON.stringify(geojsonData, null, 2)
  };
  
  value = newValue;
  dispatch('change', newValue);
}

function exportGeoJSON() {
  const layers = findLayers(map);
  const geojsonData = {
    type: 'FeatureCollection',
    features: layers.map(layer => layer.toGeoJSON())
  };
  const formattedGeoJSON = JSON.stringify(geojsonData, null, 2);
  
  // Atualiza o valor da caixa de texto
  value = { ...value, geojson: formattedGeoJSON };
  dispatch('change', value);

  // Cria o arquivo para download
  const blob = new Blob([formattedGeoJSON], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute("href", url);
  downloadAnchorNode.setAttribute("download", "map_data.geojson");
  document.body.appendChild(downloadAnchorNode);
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
  URL.revokeObjectURL(url);
}

function findLayers(map) {
  let layers = [];
  map.eachLayer(layer => {
    if (
      layer instanceof L.Polyline ||
      layer instanceof L.Marker ||
      layer instanceof L.Circle ||
      layer instanceof L.CircleMarker
    ) {
      layers.push(layer);
    }
  });

  layers = layers.filter(layer => !!layer.pm);
  layers = layers.filter(layer => !layer._pmTempLayer);

  return layers;
}

function openGeoman() {
  const baseUrl = value.geomanEditorLink || '/geoman-editor';
  const url = `${baseUrl}?lat=${value.latitude}&lng=${value.longitude}&zoom=${value.zoom}&geojson=${encodeURIComponent(value.geojson || '')}`;
  const geomanWindow = window.open(url, '_blank', 'width=800,height=600');

  if (geomanWindow) {
    const handleMessage = (event) => {
      if (event.source === geomanWindow) {
        value = { ...value, ...event.data };
        updateMap();
        dispatch('change', value);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  } else {
    console.error('Não foi possível abrir a janela do Geoman Editor');
  }
}

function updateMap() {
  if (map) {
    map.setView([value.latitude, value.longitude], value.zoom);
    drawnItems.clearLayers();
    if (value.geojson) {
      try {
        const geojsonData = JSON.parse(value.geojson);
        L.geoJSON(geojsonData).addTo(drawnItems);
      } catch (error) {
        console.error('Erro ao analisar GeoJSON:', error);
      }
    }
  }
}
</script>

<div bind:this={mapContainer} style="width: 100%; height: 400px;"></div>
<div class="relative">
  <textarea bind:value={value.geojson} placeholder="GeoJSON (opcional)" rows="4" class="w-full mt-2 p-2 border rounded pr-24"></textarea>
  <button on:click={exportGeoJSON} class="absolute right-2 bottom-2 px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors text-sm">
    Exportar
  </button>
</div>
<button on:click={openGeoman} class="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
  Abrir Editor Geoman
</button>

<style>
  @import 'leaflet/dist/leaflet.css';
  @import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';
</style>
