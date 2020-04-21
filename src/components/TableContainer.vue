<template>
    <div class="row">
        <div class="col-md-12" id="Mapbox__wrapper">
            <div class="mapinfo_graph bottom">
                <div class="row">
                    <div class="col-md-12">
                        <div class="card">
                            <div class="card-header">
                                <strong><h4>Coronavirus (COVID-19)</h4></strong>
                                Updated {{ data.mapInfo.summary.lastUpdate | duration('humanize') }}
                            </div>
                            <div class="card-body">
                                <div class="form-group">
                                    <select class="form-control" v-model="data.selectedByType">
                                        <option value="confirmed" selected>Confirmed</option>
                                        <option value="death">Death</option>
                                    </select>
                                </div>

                                <div class="form-group">
                                    <select class="form-control" v-model="data.selectedCountry">
                                        <option value="worldwide" selected>Worldwide</option>
                                        <option :value="country.Country" v-for="(country, index) in data.countries.row" :key="index">{{country.Country}}</option>
                                    </select>
                                </div>

                                <div class="row justify-content-center">
                                    <div class="col-md-4">
                                        Confirmed <br>
                                        <strong>{{thousand_number(data.mapInfo.summary.confirmed.value)}}</strong>
                                    </div>
                                    <div class="col-md-4">
                                        Recovered <br>
                                        <strong>{{thousand_number(data.mapInfo.summary.recovered.value)}}</strong>
                                    </div>
                                    <div class="col-md-4">
                                        Deaths <br>
                                        <strong>{{thousand_number(data.mapInfo.summary.deaths.value)}}</strong>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <MglMap 
                :zoom="parseInt(1)"
                :accessToken="mapboxConfig.accessToken" 
                :mapStyle="mapboxConfig.mapStyle"     
            >
                <MglAttributionControl />
                <MglNavigationControl position="top-right" />
                <MglGeolocateControl position="top-right" />
                <MglScaleControl />

                <!-- markers -->
                <MglMarker v-for="(marker, index) in data.map.row" :coordinates="[marker.long, marker.lat]" :key="index" style="z-index: 11 important;">
                    <div 
                        slot="marker" 
                        class="marker-pop-up death__color" 
                        :class="{'death__color' : data.selectedByType == 'death' && marker.deaths > 0, 'confirmed__color' : data.selectedByType == 'confirmed__color' && marker.confirmed > 0}"
                    >
                    </div>
                    <MglPopup v-if="marker.long != null && marker.lat != null" :coordinates="[marker.long, marker.lat]" anchor="top">
                            <div class="row">
                                <div class="col-md-12">
                                    <strong> {{marker.combinedKey}} </strong>
                                </div>
                                <div class="col-md-12">
                                    Total Confirmed: <strong>{{marker.confirmed}}</strong>
                                </div>
                                <div class="col-md-12">
                                    Total Deaths: <strong>{{marker.deaths}}</strong>
                                </div>
                                <div class="col-md-12">
                                    Total Recovered: {{marker.recovered}}
                                </div>
                                <div class="col-md-12">
                                    Active Cases: {{marker.active}}
                                </div>
                            </div>
                    </MglPopup>
                </MglMarker>
            </MglMap>
        </div>
        <div class="col-md-12 mt10">
            <div class="container">
                <div class="row">
                    <div class="col-md-8">
                        <div class="card" style="height: 600px;">
                            <div class="card-body">
                                <h5>Cases</h5>
                                
                                <table class="table" style="overflow-y: scroll; height: 500px !important; display: block;" >
                                    <thead>
                                        <tr>
                                            <th scope="col" class="no-bt thead-cases">Location</th>
                                            <th scope="col" class="no-bt thead-cases">Confirmed</th>
                                            <th scope="col" class="no-bt thead-cases">Recovered</th>
                                            <th scope="col" class="no-bt thead-cases">Deaths</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <th scope="col">Worldwide</th>
                                            <th scope="col">{{thousand_number(data.mapInfo.summary.confirmed.value)}}</th>
                                            <th scope="col">{{thousand_number(data.mapInfo.summary.recovered.value)}}</th>
                                            <th scope="col">{{thousand_number(data.mapInfo.summary.deaths.value)}}</th>
                                        <tr>
                                        <tr v-for="(country, index) in data.mapInfo.tableRow" :key="index">
                                            <td>{{country.Country}}</td>
                                            <td><span v-if="country.NewConfirmed > 0"> <strong>({{thousand_number(country.NewConfirmed)}})</strong></span> {{thousand_number(country.TotalConfirmed) }}</td>
                                            <td><span v-if="country.NewRecovered > 0"> <strong>({{thousand_number(country.NewRecovered)}})</strong></span> {{thousand_number(country.TotalRecovered) }}</td>
                                            <td><span v-if="country.NewDeaths > 0"> <strong>({{thousand_number(country.NewDeaths)}})</strong></span> {{thousand_number(country.TotalDeaths) }}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import Mapbox from "mapbox-gl";
import { 
    MglMap,
    MglPopup, 
    MglMarker, 
    MglAttributionControl,
    MglNavigationControl,
    MglGeolocateControl,
    // MglFullscreenControl,
    MglScaleControl
    } from "vue-mapbox";
const axios = require('axios')
export default {
    components: {
        MglMap,
        MglMarker,
        MglPopup,
        MglAttributionControl,
        MglNavigationControl,
        MglGeolocateControl,
        // MglFullscreenControl,
        MglScaleControl
    },
    data(){
        return {
            mapboxConfig: {
                accessToken: 'pk.eyJ1IjoicmVpZHNvbG9uIiwiYSI6ImNqcnZpZThzMTAyN2Ezemx4eHMzM2RoZGwifQ.j65VGpYO6g84DnR1koippQ',
                mapStyle: `mapbox://styles/mapbox/dark-v10?optimize=true?access_token=pk.eyJ1IjoicmVpZHNvbG9uIiwiYSI6ImNqcnZpZThzMTAyN2Ezemx4eHMzM2RoZGwifQ.j65VGpYO6g84DnR1koippQ`,
            },
            markers:[],
            data: {
                countries: {
                    row: [],
                },
                map: {
                    row: [30],
                },

                mapInfo: {
                    summary: [],
                    tableRow: [],
                },
                selectedByType: 'confirmed',
                selectedCountry: 'worldwide'
            }
        }
    },
    methods: {
        thousand_number(num) {
            var num_parts = num.toString().split(".");
            num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            return num_parts.join(".");
        },
        getAPI() {
            axios.get('https://api.covid19api.com/')
            .then( res => {
                this.data.api = JSON.parse(JSON.stringify(res.data))
            })
            .catch( res => {
                console.log(res)
            })
        },

        getLiveCount(country = 'Philippines') {
            axios.get(`https://api.covid19api.com/live/country/${country}`)
            .then( res => {
                this.markers = res.data
            })
            .catch( res => {
                console.log(res)
            })
        },

        getCOUNTRY_DETAILS(country = 'Philippines') {
            this.data.countries.details = []
            axios.get(`https://api.covid19api.com/country/${country}`)
            .then( res => {
                this.data.map.row = res.data
            })
            .catch( err => {
                console.log(err)
            })
        },

        getCOUNTRIES() {
            axios.get('https://api.covid19api.com/countries')
            .then( res => {
                this.data.countries.row = res.data
            })
            .catch( err => {
                console.log(err)
            })
        },

        getALL() {
            axios.get(`https://covid19.mathdro.id/api/confirmed`)
            .then( res => {
                this.data.map.row = res.data
            })
            .catch( err => {
                console.log(err)
            })
        },

        getSUMMARY_TABLE(country = this.data.selectedCountry) {
            var url = ''
            if(country == 'worldwide') {
                url = 'https://api.covid19api.com/summary'
            } else {
                url = `https://api.covid19api.com/country/${country}`
            }
            axios.get(url)
            .then( res => {
                this.data.mapInfo.tableRow = res.data.Countries
            })
            .catch( err => {
                console.log(err)
            })
        },

        getSUMMARY() {
            axios.get(`https://covid19.mathdro.id/api/`)
            .then( res => {
                this.data.mapInfo.summary = res.data
            })
            .catch( err => {
                console.log(err)
            })
        }
    },
    mounted() {
        this.getAPI()
        this.getCOUNTRIES()
        this.getSUMMARY()
        this.getSUMMARY_TABLE()
        this.getALL()
    },

    created() {
        this.mapbox = Mapbox;
    }
}
</script>
<style scoped>
.mapboxgl-map {width: 100% !important;}
#Mapbox__wrapper{z-index: 9; height: 60vh !important; position: relative; padding: 0px; width: 100%;}
.mapinfo_graph {z-index: 10; position: absolute; margin-top: 1%;margin-left: 1%;}
.marker-pop-up {border-radius: 50%; height: 5px; width: 5px;}
.thead-cases{font-weight: unset !important; color: #74797e; font-size: 80%;}

.death__color {background-color: rgba(255,0,0,0.4)}
.confirmed__color {background-color: rgba(62,166,255, 0.4)}

.dodgerblue {color: #1c74e8;}
.crimson {color: #ff2a2a;}
.limegreen {color :#5ee527;}

.no-bt{border-top: unset;}
.mt10 {margin-top: 5%;}
</style>