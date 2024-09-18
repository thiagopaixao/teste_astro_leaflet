<script>
import { onMount } from 'svelte';
import L from 'leaflet';
import '@geoman-io/leaflet-geoman-free';

let map;
let mapContainer;
let drawnItems;

export let latitude = -14.235004;
export let longitude = -51.92528;
export let zoom = 4;

onMount(() => {
  map = L.map(mapContainer).setView([latitude, longitude], zoom);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  drawnItems = new L.FeatureGroup();
  map.addLayer(drawnItems);

  map.pm.addControls({
    position: 'topleft',
    drawCircle: false,
  });

  map.on('pm:create', (e) => {
    drawnItems.addLayer(e.layer);
    updateMapData();
  });

  map.on('pm:remove', () => {
    updateMapData();
  });
});

function updateMapData() {
  const center = map.getCenter();
  latitude = center.lat;
  longitude = center.lng;
  zoom = map.getZoom();

  const geojson = drawnItems.toGeoJSON();
  const event = new CustomEvent('mapupdate', {
    detail: { latitude, longitude, zoom, geojson }
  });
  mapContainer.dispatchEvent(event);
}
</script>

<div bind:this={mapContainer} style="width: 100%; height: 400px;"></div>

<style>
  @import 'leaflet/dist/leaflet.css';
  @import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';
</style>
