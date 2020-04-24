<template>
    <div class="row">
        <Navigation></Navigation>
        <div class="col-md-12" id="Mapbox__wrapper">
            <div class="mapinfo_graph mt10">
                <div class="row">
                    <div class="col-md-12 mt10" >
                        <div class="card mt10" v-if="!toggleHelper">
                            <div class="card-header">
                                <strong><h4>Coronavirus (COVID-19)</h4></strong>
                                Updated {{ data.mapInfo.summary.lastUpdate | moment("from", "now") }}
                            </div>
                            <div class="card-body ">
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
                                    <div class="col-md-4 col-sm-4 col-4">
                                        <span class="thead-cases">Confirmed</span> <br>
                                        <strong class="l-space" >{{thousand_number(data.mapInfo.summary.confirmed.value)}}</strong>
                                    </div>
                                    <div class="col-md-4 col-sm-4 col-4">
                                        <span class="thead-cases">Recovered</span> <br>
                                        <strong class="l-space" >{{thousand_number(data.mapInfo.summary.recovered.value)}}</strong>
                                    </div>
                                    <div class="col-md-4 col-sm-4 col-4">
                                        <span class="thead-cases">Deaths</span> <br>
                                        <strong class="l-space">{{thousand_number(data.mapInfo.summary.deaths.value)}}</strong>
                                    </div>
                                </div>
                                <div class="row justify-content-center" v-else>
                                    <div class="col-md-4 col-sm-4 col-4">
                                        <span class="thead-cases">Confirmed</span> <br>
                                        <strong class="l-space" :title="'Last updated '+data.mapInfo.singleRow.lastUpdate | moment('from', 'now')">{{thousand_number(data.mapInfo.singleRow.confirmed.value)}}</strong>
                                    </div>
                                    <div class="col-md-4 col-sm-4 col-4">
                                        <span class="thead-cases">Recovered</span> <br>
                                        <strong class="l-space" :title="'Last updated '+data.mapInfo.singleRow.lastUpdate | moment('from', 'now')">{{thousand_number(data.mapInfo.singleRow.deaths.value)}}</strong>
                                    </div>
                                    <div class="col-md-4 col-sm-4 col-4">
                                        <span class="thead-cases">Deaths</span> <br>
                                        <strong class="l-space" :title="'Last updated '+data.mapInfo.singleRow.lastUpdate | moment('from', 'now')">{{thousand_number(data.mapInfo.singleRow.deaths.value)}}</strong>
                                    </div>
                                </div>

                                <div class="row mt10">
                                    <div class="col-md-6 col-6">
                                        <span class="thead-cases">Source: <a :href="data.mapInfo.summary.source" target="_blank"><u>MathroidAPI</u></a></span>
                                    </div>
                                    <div class="col-md-6 col-6" style="text-align: right; cursor: pointer;">
                                        <span class="thead-cases" @click="toggle(true)">Close</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div style="margin-top: 100%;" v-else>
                            <button @click="toggle(false)">Show</button>
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
                    <MglMarker v-for="(marker, index) in data.map.row" :coordinates="[marker.long, marker.lat]" :key="index" style="z-index: 11 important;">
                        <div 
                            slot="marker" 
                            class="marker-pop-up" 
                            :class="{'death__color' : data.selectedByType == 'death' && marker.deaths > 0, 'confirmed__color' : data.selectedByType == 'confirmed' && marker.confirmed > 0}"
                        >
                        </div>
                        <MglPopup v-if="marker.long != null && marker.lat != null" :coordinates="[marker.long, marker.lat]" anchor="top">
                                <div class="row">
                                    <div class="col-md-12" style="text-align:center;">
                                        <strong> {{marker.combinedKey}} </strong>
                                    </div>
                                    <div class="col-md-12 mt10">
                                        Confirmed: <strong class="dodgerblue">{{marker.confirmed}}</strong>
                                    </div>
                                    <div class="col-md-12">
                                        Deaths: <strong class="crimson">{{marker.deaths}}</strong>
                                    </div>
                                    <div class="col-md-12">
                                        Recovered: <strong class="limegreen">{{marker.recovered}}</strong>
                                    </div>
                                    <div class="col-md-12">
                                        Active Cases: {{marker.active}}
                                    </div>
                                    <div class="col-md-12">
                                        Updated {{ marker.lastUpdate | moment("from", "now") }}
                                    </div>
                                </div>
                        </MglPopup>
                    </MglMarker>
                </template>
            </MglMap>
        </div>
        <div class="col-md-12 ">
            <div class="row justify-content-center">
                <a class="btn btn-primary" href="#summary__area" id="moreStat__btn">• More stats and news</a>
            </div>
        </div>
        <div class="col-md-12 " id="summary__area">
            <div class="container mt5">
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
                                                <tr v-for="(country, index) in data.mapInfo.tableRow" :key="index" style="color: #727375; font-size: 90%;">
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
                                <div class="card">
                                    <div class="card-body">
                                        <h5>Overall cases over time</h5>
                                        <div class="chart-container" style="position: relative; width:100%;">
                                            <canvas id="new_cases_chart"></canvas>
                                        </div>
                                        <div class="mt10"></div>
                                        <span  class="thead-cases">New cases are the confirmed cases reported since the previous day</span><br>
                                        <span v-if="data.selectedCountry == 'worldwide'" class="thead-cases">Updated {{ data.mapInfo.summary.lastUpdate | moment("from", "now") }}. Source: <a href="'https://api.covid19api.com/summary" target="_blank">Covid19 API</a></span>
                                        <span v-else class="thead-cases">Updated {{ data.mapInfo.summary.lastUpdate | moment("from", "now") }}. Source: <a :href="'https://api.covid19api.com/country/'+data.selectedCountry.name" target="_blank">Covid19 API</a></span>
                                        
                                    </div>
                                </div>
                            </div>
 
                            <div class="col-md-12 mt10" v-if="data.selectedCountry != 'worldwide'">
                                <div class="card">
                                    <div class="card-body">
                                        <h5>Cases over time</h5>
                                        <h6 v-if="data.selectedCountry == `worldwide`">Worldwide</h6>
                                        <h6 v-else>{{data.selectedCountry.name}} 
                                            (
                                                Out of  <span class="dodgerblue">
                                                            <strong>{{data.mapInfo.singleRow.confirmed.value}}</strong></span> confirmed cases <span class="crimson"><strong>{{((data.mapInfo.singleRow.deaths.value / data.mapInfo.singleRow.confirmed.value) * 100).toFixed(2)}}%</strong></span> of it died. 
                                                However, <span class="limegreen"><strong>{{ ((data.mapInfo.singleRow.recovered.value / data.mapInfo.singleRow.confirmed.value) * 100).toFixed(2)}}%</strong></span> of it has recovered
                                            )
                                        
                                        </h6>
                                        <div class="chart-container" style="position: relative;width:100%;">
                                            <canvas id="cases_chart"></canvas>
                                        </div>
                                        <div class="mt10"></div>
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
                                        <h5>Why don't you buy me a <a href="https://www.buymeacoffee.com/reidsolon" target="_blank">coffee!</a></h5>
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
                            <div class="col-md-12 col-sm-12 col-12">
                                <div class="card">
                                    <div class="card-body no-p-bottom">
                                        <h6>Top News 
                                            <span v-if="data.selectedCountry != 'worldwide'">for {{data.selectedCountry.name}}</span>
                                        </h6>
                                        <hr>
                                    </div>
                                    <template v-if="!data.news.loadingNews">
                                        <div class="card-body no-p-top no-p-bottom" v-for="(news, index) in data.news.newsRow.articles" :key="index" >
                                            <a :href="news.url"><div class="row" >
                                                <div class="col-md-8 col-8 col-sm-8" >
                                                    <div class="row">
                                                        <div class="col-md-12">
                                                            <span class="thead-cases">{{news.source.name}}</span>
                                                        </div>
                                                        <div class="col-md-12 mt5">
                                                            <strong><a style="color: #111;" target="_blank">{{news.title}}</a></strong>
                                                        </div>
                                                    </div>
                                                    
                                                </div>
                                                <div class="col-md-4 col-sm-4 col-4" v-if="news.urlToImage">
                                                    <img :src="news.urlToImage" style="width: 100%; height: 6vh; border-radius: 10px;">
                                                </div>
                                                <div class="card-body thead-cases col-md-12 no-p-bottom">
                                                    {{ news.publishedAt | moment("from", "now") }}
                                                </div>
                                            </div>
                                            </a>
                                            <hr>
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
                                    </template>
                                    
                                </div>
                                
                                <div class="mt10"></div>
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
            toggleHelper: false,
            newsAPI: {
                apiKey: '993811875ccc4e37adefa84c45cfd597',
            },
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
                    loadingNews: false,
                    latestSituations: [],
                    newsRow: []
                },
                selectedByType: 'confirmed',
                selectedCountry: 'worldwide'
            }
        }
    },
    methods: {
        toggle(bool) {
            this.toggleHelper = bool
        },
        defaultCountry() {
            this.data.selectedCountry = 'worldwide'
            this.data.map.center = [0,0]
            this.data.map.zoom = parseInt(1)
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

            var url = 'https://covid19.mathdro.id/api/daily'
            axios.get(url)
            .then( res => {
                var array = res.data
                var confirmed = []
                var deaths    = []
                var recovered = []
                var labels    = []

                array.map( (el) => {
                    labels.push( el.reportDate )
                    confirmed.push( el.totalConfirmed )
                    deaths.push( el.deaths.total)
                    recovered.push( el.recovered.total)
                })

                var datasets = [
                    {
                        label: 'Confirmed',
                        data: confirmed,
                        borderWidth: 1,
                        backgroundColor: [
                            'rgba(0, 0, 255, 0.1)',
                        ],
                        borderColor: [
                            'rgba(0, 0, 255, 1)',
                        ],
                    },
                    {
                        label: 'Recovered',
                        data: recovered,
                        borderWidth: 1,
                        backgroundColor: [
                            'rgba(0, 255, 0, 0.1)',
                        ],
                        borderColor: [
                            'rgba(0, 255, 0, 1)',
                        ],
                    },
                    {
                        label: 'Died',
                        data: deaths,
                        borderWidth: 1,
                        backgroundColor: [
                            'rgba(255, 0, 0, 0.1)',
                        ],
                        borderColor: [
                            'rgba(255, 0, 0, 1)',
                        ],
                    },
                ]

                var processed = {
                    datasets,
                    labels
                }
                setChart('new_cases_chart', 'line', processed)
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

        getLATEST_NEWS(country = this.data.selectedCountry) {
            this.data.news.loadingNews = true
            var url 
            if(country != 'worldwide') {
                url = `https://newsapi.org/v2/everything?q=covid%20news%20in%20${country.name}&from=2020-03-24&sortBy=publishedAt&apiKey=993811875ccc4e37adefa84c45cfd597`
            } else {
                url = `https://newsapi.org/v2/everything?q=covid%20news&from=2020-03-24&sortBy=publishedAt&apiKey=993811875ccc4e37adefa84c45cfd597`
            }
            
            axios.get(url)
            .then(res => {
                this.data.news.newsRow = res.data
                this.data.news.loadingNews = false
            })
            .catch(err => {
                console.log(err)
            })
        },

        getSUMMARY_TABLE(country = this.data.selectedCountry) {
            this.getLATEST_NEWS()
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

        populateChart(country, chartType = 'line') {
            var type = chartType
            var url = `https://api.covid19api.com/country/${country}`
            axios.get(url)
            .then( res => {
                var array = res.data
                var returnArray = []
                var recovered   = []
                var died        = []
                var month
                var Months = [0,1,2,3]
                var labels = ['January', 'Febuary', 'March', 'April']
                Months.map( month_el => {
                    array.map( (el) => {
                        month = new Date(el.Date).getMonth()
                        if(month == month_el ) {
                            returnArray[month_el] = parseInt(el.Confirmed)
                            recovered[month_el]   = parseInt(el.Recovered)
                            died[month_el]        = parseInt(el.Deaths)
                        } 
                    })
                })

                var datasets = [
                    {
                        label: 'Confirmed',
                        data: returnArray,
                        borderWidth: 1,
                        backgroundColor: [
                            'rgba(0, 0, 255, 0.1)',
                        ],
                        borderColor: [
                            'rgba(0, 0, 255, 1)',
                        ],
                    },

                    {
                        label: 'Recovered',
                        data: recovered,
                        borderWidth: 1,
                        backgroundColor: [
                            'rgba(0, 255, 0, 0.1)',
                        ],
                        borderColor: [
                            'rgba(0, 255, 0, 1)',
                        ],
                    },

                    {
                        label: 'Deaths',
                        data: died,
                        borderWidth: 1,
                        backgroundColor: [
                            'rgba(255, 0, 0, 0.1)',
                        ],
                        borderColor: [
                            'rgba(255, 0, 0, 1)',
                        ],
                    },
                ]
                

                var processed = {
                    datasets,
                    labels
                }
                setChart('cases_chart', type, processed)
            })
            .catch( err => {
                console.log(err)
            })
        },

    },
    mounted() {
        this.getAPI()
        this.getCOUNTRIES()
        this.getSUMMARY()
        this.getLATEST_SITUATION()
        this.getLATEST_NEWS()
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
.marker-pop-up {border-radius: 50%; height: 15px; width: 15px;}
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
.no-p-bottom {padding-bottom: unset;}
.no-padding {padding: unset;}
.mt10 {margin-top: 5%;}
.mt5 {margin-top: 2%;}

.dark-mode{background-color: #111;color: #fff;}
.dark-mode-2{background-color: #2e3235; color: #fff;}

.l-space {letter-spacing: 0.05em;}
</style>