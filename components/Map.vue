<template>
    <GMap
        class="h-100"
        ref="gMap"
        language="en"
        :options="options"
        :zoom="14">
        <GMapMarker
            v-for="(location, index) in coordArray"
            :key="`location_${index}`"
            :position="{lat: location.latitude, lng: location.longitude}"
            :options="getMarker(index)"
            @click="centerMap(location)">
            <GMapInfoWindow 
                :options="{
                    maxWidth: 200,
                    content: getInfo(location),
                }">
            </GMapInfoWindow>
        </GMapMarker>
    </GMap>

</template>

<script>
    export default {
        props: {
            places: Array,
        },
        data() {
            return {
                currentLocation: { lat: 44.9380, lng: -123.0280 },
                pins: {},
                hidden: true,
            }
        },
        // TODO: How can I get sass variables into the script?
        methods: {
            getInfo (loc) {
                let str = `<div style="font-family: IM Fell English SC">${loc.name}</div>`;
                str += `<div style="font-family: IM Fell English">${loc.place_name}</div>`;
                str += `<div style="font-family: IM Fell English SC"><a rel="noopener noreferrer" target="_blank" href="${loc.directionLink}">Get Directions</a></div>`
                return str
            },
            centerMap (loc) {
                this.currentLocation={ lat: 144.9380, lng: -123.0280 }
            },
            getMarker (index) {
                // TODO: Add fill color and stroke color variables
                let label = index+1

                return {
                    icon: {
                        path: 'M 0,0 C -12,-20 -10,-22 -10,-25 A 10,10 0 1,1 10,-25 C 10,-25 12,-20 0,0 z',
                        fillColor: '#1c1900',
                        fillOpacity: 1,
                        strokeColor: '#f2f1e9',
                        strokeWeight: 1,
                        scale: 1.25,
                        labelOrigin: {
                            x: 0,
                            y: -20,
                        }
                    },
                    label: {
                        text: label.toString(),
                        color: "#f2f1e9",
                        fontSize: "1rem",
                        fontFamily: 'IM Fell English',
                    },
                }
            },
        },

        computed: {
            coordArray () {
                const mapPlaces = []
                for (let i=0; i<this.places.length; i++) {
                    if (this.places[i].latitude && this.places[i].longitude) mapPlaces.push(this.places[i])
                    else this.places[i-1].name = `${this.places[i-1].name} & ${this.places[i].name}`
                }
                return this.places.filter(place=>place.latitude && place.latitude) || []
            },
            mapStyle () {
                return [
                    {
                        featureType: "road",
                        elementType: "geometry",
                        // TODO: Set color variables for use here
                        stylers: [{ color: '#f9f9ee' }]
                    }, 
                    {
                        featureType: 'all',
                        elementType: 'labels.text.stroke',
                        // TODO: Set color variables for use here
                        stylers: [{ color: '#f9f9ee'}]
                    }
                ]
            },
            options () {
                return {
                    fullscreenControl: true,
                    center: this.currentLocation,
                    zoom: 14,
                    styles: this.mapStyle,
                    streetViewControl: true,
                    mapTypeControlOptions: {
                        mapTypeIds: [],
                    },
                    controlSize: 25,
                }
            }
        }

    }
</script>