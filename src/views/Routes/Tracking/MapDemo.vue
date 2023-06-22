<template>
    <div class="h-[500px] w-full">
      <l-map
        class="cursor-default"
        :center="center"
        v-model="zoom"
        v-model:zoom="zoom"
        :zoom="zoom"
        :minZoom="3"
        :maxZoom="18"
        :zoomAnimation="true"
        @ready="mapReady"
      >
      <l-tile-layer :url="url" />
      <l-marker v-for="maker, index in markers" :lat-lng="maker" ></l-marker>
      <l-polygon :lat-lngs="polygon" :color="color" />
      </l-map>
    </div>
</template>
    
<script>
// DON'T load Leaflet components here!
// Its CSS is needed though, if not imported elsewhere in your application.
import "leaflet/dist/leaflet.css";
import { LMap, LTileLayer, LPolygon, LMarker, LPolyline } from "@vue-leaflet/vue-leaflet";

export default {
    components: {
      LMap,
      LTileLayer,
      LPolygon,
      LMarker,
      LPolyline
    },
    data() {
      return {
        zoom: 14,
        url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        geojson: null,
        center: [8.972347506512437, -79.53419720989709],
        markers: [],
        color: 'green',
        formatMaker: [],
        polygon: []
      };
    },
    watch: {
      markers() {}
    },
    methods: {
      addMarker(e) {
        this.formatMaker.push(e.latlng.lat)
        this.formatMaker.push(e.latlng.lng)
        this.markers.push(this.formatMaker)
        this.polygon.push(this.formatMaker)
        this.formatMaker = []
        this.createPolygon()
      },
      mapReady(map) {
        map.on('click', this.addMarker)
      },
      createPolygon() {
        let firstLatLong = null
        this.polygon = []
        if (this.markers.length > 2) {
          for (let i = 0; i < this.markers.length; i++) {
            this.polygon.push(this.markers[i])
          }
          firstLatLong = this.markers[0]
          this.polygon.push(firstLatLong)
        } else {
          this.polygon = []
        }
      }
  }
  };
</script>
<style lang="scss">
.leaflet-control {
  z-index: 0 !important;
}
.leaflet-control-container {
  z-index: 555 !important;
  position: relative;
}
</style>
  