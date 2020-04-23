<template>
    <div class="row">
        <Navigation></Navigation>
        <div class="col-md-12" id="Mapbox__wrapper">
            <div class="mapinfo_graph mt10">
                <div class="row">
                    <div class="col-md-12">
                        <div class="card">
                            <div class="card-header">
                                <strong><h4>Coronavirus (COVID-19)</h4></strong>
                                Updated {{ data.mapInfo.summary.lastUpdate | moment("from", "now") }}
                            </div>
                            <div class="card-body">
                                <span class="thead-cases">Map data is currently unavailable due to some network data issues.<br> It will be back as soon it is fixed.</span>
                                <div class="form-group">
                                    <select class="form-control" v-model="data.selectedByType">
                                        <option value="confirmed" selected>Confirmed</option>
                                        <option value="death">Death</option>
                                    </select>
                                </div>

                                <div class="form-group">
                                    <select class="form-control" v-model="data.selectedCountry" @change="getSUMMARY_TABLE(data.selectedCountry)">
                                        <option value="worldwide" selected>Worldwide</option>
                                        <option :value="country" v-for="(country, index) in data.countries.row" :key="index">{{country.name}}</option>
                                    </select>
                                </div>

                                <div class="row justify-content-center" v-if="data.selectedCountry == `worldwide`">
                                    <div class="col-md-4">
                                        <span class="thead-cases">Confirmed</span> <br>
                                        <strong class="l-space" >{{thousand_number(data.mapInfo.summary.confirmed.value)}}</strong>
                                    </div>
                                    <div class="col-md-4">
                                        <span class="thead-cases">Recovered</span> <br>
                                        <strong class="l-space" >{{thousand_number(data.mapInfo.summary.recovered.value)}}</strong>
                                    </div>
                                    <div class="col-md-4">
                                        <span class="thead-cases">Deaths</span> <br>
                                        <strong class="l-space">{{thousand_number(data.mapInfo.summary.deaths.value)}}</strong>
                                    </div>
                                </div>
                                <div class="row justify-content-center" v-else>
                                    <div class="col-md-4">
                                        <span class="thead-cases">Confirmed</span> <br>
                                        <strong class="l-space" :title="'Last updated '+data.mapInfo.singleRow.lastUpdate | moment('from', 'now')">{{thousand_number(data.mapInfo.singleRow.confirmed.value)}}</strong>
                                    </div>
                                    <div class="col-md-4">
                                        <span class="thead-cases">Recovered</span> <br>
                                        <strong class="l-space" :title="'Last updated '+data.mapInfo.singleRow.lastUpdate | moment('from', 'now')">{{thousand_number(data.mapInfo.singleRow.deaths.value)}}</strong>
                                    </div>
                                    <div class="col-md-4">
                                        <span class="thead-cases">Deaths</span> <br>
                                        <strong class="l-space" :title="'Last updated '+data.mapInfo.singleRow.lastUpdate | moment('from', 'now')">{{thousand_number(data.mapInfo.singleRow.deaths.value)}}</strong>
                                    </div>
                                </div>

                                <div class="row">
                                    <div class="col-md-12">
                                        <span class="thead-cases">Source: <a :href="data.mapInfo.summary.source" target="_blank"><u>MathroidAPI</u></a></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    
                </div>
            </div>

            <MglMap 
                :center="data.map.center"
                :zoom="data.map.zoom"
                :accessToken="mapboxConfig.accessToken" 
                :mapStyle="mapboxConfig.mapStyle"     
            >
                <MglAttributionControl />
                <MglNavigationControl position="bottom-right" />
                <MglGeolocateControl position="bottom-right" />
                <MglScaleControl />

                <!-- markers -->
                <template v-if="true">
                    <MglMarker v-for="(marker, index) in data.map.row" :coordinates="[marker.long, marker.lat]" :key="index" style="z-index: 11 important;" @click="setMapCenter(marker)">
                        <div 
                            slot="marker" 
                            class="marker-pop-up" 
                            :class="{'death__color' : data.selectedByType == 'death' && marker.deaths > 0, 'confirmed__color' : data.selectedByType == 'confirmed' && marker.confirmed > 0}"
                        >
                        </div>
                        <MglPopup v-if="marker.long != null && marker.lat != null" :coordinates="[marker.long, marker.lat]" anchor="top" @close="defaultCountry">
                                <div class="row">
                                    <div class="col-md-12">
                                        <strong> {{marker.combinedKey}} </strong>
                                    </div>
                                    <div class="col-md-12 mt10">
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
                                    <div class="col-md-12">
                                        Last updated: {{ marker.lastUpdate | moment("from", "now") }}
                                    </div>
                                </div>
                        </MglPopup>
                    </MglMarker>
                </template>
            </MglMap>
        </div>
        <div class="col-md-12">
            <div class="row justify-content-center">
                <a class="btn btn-primary" href="#summary__area" id="moreStat__btn">• More stats and news</a>
            </div>
        </div>
        <div class="col-md-12 mt5" id="summary__area">
            <div class="container">
                <div class="row"> 
                    <div class="col-md-8">
                        <div class="row">
                            <div class="col-md-12">
                                <div class="card" style="height: 55vh;">
                                    <div class="card-body">
                                        <h5>Cases</h5>
                                        <table class="table" >
                                            
                                        </table>
                                        <table class="table" id="summary__table" >
                                            <thead>
                                                <tr>
                                                    <th scope="col" class="no-bt thead-cases no-bb">Location</th>
                                                    <th scope="col" class="no-bt thead-cases no-bb">Confirmed</th>
                                                    <th scope="col" class="no-bt thead-cases no-bb">Recovered</th>
                                                    <th scope="col" class="no-bt thead-cases no-bb">Deaths</th>
                                                </tr>
                                            </thead>
                                            <tbody v-if="data.mapInfo.tableRow != []">
                                                <tr>
                                                    <th scope="col">Worldwide</th>
                                                    <th scope="col">{{thousand_number(data.mapInfo.summary.confirmed.value)}}</th>
                                                    <th scope="col">{{thousand_number(data.mapInfo.summary.recovered.value)}}</th>
                                                    <th scope="col">{{thousand_number(data.mapInfo.summary.deaths.value)}}</th>
                                                <tr>
                                                <tr v-for="(country, index) in data.mapInfo.tableRow" :key="index">
                                                    <td>{{country.Country}}</td>
                                                    <td><span v-if="country.NewConfirmed > 0"> <strong>(+{{thousand_number(country.NewConfirmed)}})</strong></span> {{thousand_number(country.TotalConfirmed) }}</td>
                                                    <td><span v-if="country.NewRecovered > 0"> <strong>(+{{thousand_number(country.NewRecovered)}})</strong></span> {{thousand_number(country.TotalRecovered) }}</td>
                                                    <td><span v-if="country.NewDeaths > 0"> <strong>(+{{thousand_number(country.NewDeaths)}})</strong></span> {{thousand_number(country.TotalDeaths) }}</td>
                                                </tr>
                                            </tbody>
                                            <tbody v-else>
                                                <div class="text-center">
                                                    <div class="spinner-border" role="status">
                                                        <span class="sr-only">Loading...</span>
                                                    </div>
                                                </div>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            <div class="col-md-12 mt10">
                                <div class="card" style="height: 51vh;">
                                    <div class="card-body">
                                        <h5>New cases over time</h5>
                                        <h6 v-if="data.selectedCountry == `worldwide`">Worldwide</h6>
                                        <h6 v-else>{{data.selectedCountry.name}}</h6>
                                        <div class="chart-container" style="position: relative; height:40vh; width:100%;">
                                            <canvas id="new_cases_chart"></canvas>
                                        </div>
                                        <span v-if="data.selectedCountry == 'worldwide'" class="thead-cases">Updated {{ data.mapInfo.summary.lastUpdate | moment("from", "now") }}. Source: <a href="'https://api.covid19api.com/summary" target="_blank">Covid19 API</a></span>
                                        <span v-else class="thead-cases">Updated {{ data.mapInfo.summary.lastUpdate | moment("from", "now") }}. Source: <a :href="'https://api.covid19api.com/country/'+data.selectedCountry.name" target="_blank">Covid19 API</a></span>
                                    </div>
                                </div>
                            </div>

                            <div class="col-md-12 mt10">
                                <div class="card" style="height: 51vh;">
                                    <div class="card-body">
                                        <h5>Cases over time</h5>
                                        <h6 v-if="data.selectedCountry == `worldwide`">Worldwide</h6>
                                        <h6 v-else>{{data.selectedCountry.name}}</h6>
                                        <div class="chart-container" style="position: relative; height:40vh; width:100%;">
                                            <canvas id="cases_chart"></canvas>
                                        </div>
                                        <span v-if="data.selectedCountry == 'worldwide'" class="thead-cases">Updated {{ data.mapInfo.summary.lastUpdate | moment("from", "now") }}. Source: <a href="'https://api.covid19api.com/summary" target="_blank">Covid19 API</a></span>
                                        <span v-else class="thead-cases">Updated {{ data.mapInfo.summary.lastUpdate | moment("from", "now") }}. Source: <a :href="'https://api.covid19api.com/country/'+data.selectedCountry.name" target="_blank">Covid19 API</a></span>
                                    </div>
                                </div>
                            </div>

                            <div class="col-md-12 mt10">
                                <div class="card">
                                    <div class="card-body">
                                        <h5>Enjoy using this project?</h5>
                                        <p>This project is inspired by google covid 19 tracker user interface. You can it see <a href="https://news.google.com/covid19/map?hl=en-PH&gl=PH&ceid=PH:en" target="_blank">here</a></p>
                                        <br>
                                        <h5>Why don't you buy me a coffee!</h5>
                                        <hr>
                                        <span class="thead-cases">Consumed APIs: <a href="https://covid19.mathdro.id/api" target="_blank">MathroidAPI</a>, <a href="https://api.covid19api.com/" target="_blank">ApiCOVID19</a> </span><br>
                                        <span class="thead-cases">JS Framework used: <a href="https://vuejs.org" target="_blank">Vue</a></span><br>
                                        <span class="thead-cases">MapboxGL Framework used: <a href="https://soal.github.io/vue-mapbox/api/marker.html#props" target="_blank">VueMapbox</a></span><br>
                                        <span class="thead-cases">Chart Plugin used: <a href="https://chartjs.org" target="_blank">ChartJS</a></span><br>
                                        <span class="thead-cases">Developed by: <a href="https://github.com/reidsolon" target="_blank">reidsolon</a></span>
                                    </div>
                                </div>
                                <div class="mt10"></div>
                            </div>
                        </div>
                    </div>

                    <div class="col-md-4">
                        <div class="row">
                            <div class="col-md-12">
                                <div class="card" style="height: 55vh;">
                                    <div class="card-body">
                                        <h5>Top News 
                                            <span v-if="data.selectedCountry != 'worldwide'">for {{data.selectedCountry.name}}</span>
                                        </h5>
                                    </div>
                                </div>
                            </div>

                            <div class="col-md-12 mt10">
                                <div class="card">
                                    <div class="card-body">
                                        <h5>Latest Situations</h5>
                                        <hr>
                                    </div>
                                    <template v-if="data.news.latestSituations != []">
                                        <div class="card-body no-p-top" v-for="(situation, index) in data.news.latestSituations.data" :key="index" >
                                            <a target="_blank" :href="situation.link"><h6 class="card-subtitle mb-2 text-muted">{{situation.case}}</h6> </a>
                                            <p class="card-text thead-cases">{{situation.date}}</p>
                                            <hr>
                                        </div>
                                        <div class="card-body thead-cases">
                                            Source: <a :href="data.news.latestSituations.source" target="_blank" >{{data.news.latestSituations.source}} </a>
                                        </div>
                                    </template>
                                    <template v-else>
                                        <div class="text-center">
                                            <div class="spinner-border" role="status">
                                                <span class="sr-only">Loading...</span>
                                            </div>
                                        </div>
                                        <div class="mt10"></div>
                                    </template>
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import Navigation from './Navigation'
import Mapbox from "mapbox-gl";
import {setChart} from "../includes/country_chart"
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
        MglScaleControl,
        Navigation
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
                    row: [],
                    center: [0,0],
                    zoom: parseInt(1)
                },

                mapInfo: {
                    summary: [],
                    tableRow: [],
                    singleRow: {},
                },
                news: {
                    latestSituations: [],
                    newsRow: []
                },
                selectedByType: 'confirmed',
                selectedCountry: 'worldwide'
            }
        }
    },
    methods: {
        defaultCountry() {
            this.data.selectedCountry = 'worldwide'
            this.data.map.center = [0,0]
            this.data.map.zoom = parseInt(1)
        },
        setMapCenter( markerOptions ) {
            this.data.map.center = [markerOptions.long , markerOptions.lat]
            this.data.map.zoom = parseInt(5)
            this.data.selectedCountry = markerOptions.iso3
        },
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
            axios.get('https://covid19.mathdro.id/api/countries')
            .then( res => {
                this.data.countries.row = res.data.countries
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

        getSUMMARY() {
            axios.get(`https://covid19.mathdro.id/api/`)
            .then( res => {
                this.data.mapInfo.summary = res.data
            })
            .catch( err => {
                console.log(err)
            })
        },

        getLATEST_SITUATION() {
            var url = `https://covid19-news.herokuapp.com/api/covid19/latest-situations`
            axios.get(url)
            .then( res => {
                this.data.news.latestSituations = res.data
            })
            .catch( err => {
                console.log(err)
            })
        },

        getSUMMARY_TABLE(country = this.data.selectedCountry) {
            var url = ''
            if(country == 'worldwide') {
                url = 'https://api.covid19api.com/summary'

                axios.get(url)
                .then( res => {
                    this.data.mapInfo.tableRow = res.data.Countries
                })
                .catch( err => {
                    console.log(err)
                })
            } else {
                url = `https://covid19.mathdro.id/api/countries/${country.iso3}`

                axios.get(url)
                .then( res => {
                    this.data.mapInfo.singleRow = res.data
                    this.populateChart(country.name)
                })
                .catch( err => {
                    console.log(err)
                })
            }
            
        },

        populateChart(country) {
            var url = `https://api.covid19api.com/country/${country}`
            axios.get(url)
            .then( res => {
                setChart('cases_chart', 'line', res.data)
                setChart('new_cases_chart', 'line', res.data)
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
        this.getLATEST_SITUATION()
        this.getSUMMARY_TABLE()

        // this.getALL()
    },

    created() {
        this.mapbox = Mapbox;
    }
}
</script>
<style scoped>
.card {border-radius: 10px;}
#moreStat__btn {
    height: 100%; 
    font-family: Arial;
    border-color: #fff;
    padding: 15px; 
    margin-top: -1.5%; 
    z-index: 13; 
    border-radius: 25em;
    background-color: #fff;
    color: #111;
    font-size: 90%;
    box-shadow: 0 3px 8px 0 rgba(0,0,0,.25);
}
#summary__table {overflow-y: scroll; height: 40vh !important; display: block;}
.mapboxgl-map {width: 100% !important;}
#Mapbox__wrapper{z-index: 9; height: 60vh !important; position: relative; padding: 0px; width: 100%;}
.mapinfo_graph {z-index: 10; position: absolute; margin-top: 1%;margin-left: 1%;}
.marker-pop-up {border-radius: 50%; height: 5px; width: 5px;}
.thead-cases{font-weight: unset !important; color: #74797e; font-size: 80%;}
.card-header{background-color: #fff;}

.death__color {background-color: rgba(255,0,0,0.4)}
.confirmed__color {background-color: rgba(62,166,255, 0.4)}

.dodgerblue {color: #1c74e8;}
.crimson {color: #ff2a2a;}
.limegreen {color :#5ee527;}

.no-bb{border-bottom: unset;}
.no-bt{border-top: unset;}
.no-p-top{padding-top: unset;}
.mt10 {margin-top: 5%;}
.mt5 {margin-top: 2%;}

.l-space {letter-spacing: 0.05em;}
</style>