<script>
import { onMount, createEventDispatcher } from 'svelte';
import L from 'leaflet';
import '@geoman-io/leaflet-geoman-free';

const dispatch = createEventDispatcher();

export let value = {
  latitude: -14.235004,
  longitude: -51.92528,
  zoom: 4,
  geojson: null
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

  if (value.geojson) {
    try {
      const geojsonData = JSON.parse(value.geojson);
      L.geoJSON(geojsonData).addTo(drawnItems);
    } catch (error) {
      console.error('Erro ao analisar GeoJSON:', error);
    }
  }

  map.on('pm:create', updateMapData);
  map.on('pm:remove', updateMapData);
  map.on('moveend', updateMapData);
});

function updateMapData() {
  const center = map.getCenter();
  const newValue = {
    latitude: center.lat,
    longitude: center.lng,
    zoom: map.getZoom(),
    geojson: drawnItems.toGeoJSON()
  };
  
  dispatch('change', newValue);
}
</script>

<div bind:this={mapContainer} style="width: 100%; height: 400px;"></div>

<style>
  @import 'leaflet/dist/leaflet.css';
  @import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';
</style>
