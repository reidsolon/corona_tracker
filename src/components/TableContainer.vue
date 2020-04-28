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
                                <!-- <span class="thead-cases">Map data is currently unavailable due to some network data issues.<br> It will be back as soon it is fixed.</span> -->

                                <div class="form-group">
                                    <select class="form-control" v-model="data.selectedCountry" @change="getSUMMARY_TABLE(data.selectedCountry)">
                                        <option value="worldwide" selected>Worldwide</option>
                                        <option :value="country" v-for="(country, index) in data.countries.row" :key="index">{{country.name}}</option>
                                    </select>
                                </div>

                                <div class="row justify-content-center" v-if="data.selectedCountry == `worldwide`">
                                    <template v-if="data.mapInfo.summary != null">
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
                                    </template>
                                    
                                </div>
                                <div class="row justify-content-center" v-else>
                                    <template v-if="data.mapInfo.singleRow != null">
                                        <div class="col-md-4 col-sm-4 col-4">
                                            <span class="thead-cases">Confirmed</span> <br>
                                            <strong class="l-space" :title="'Last updated '+data.mapInfo.singleRow.lastUpdate | moment('from', 'now')">{{thousand_number(data.mapInfo.singleRow.confirmed.value)}}</strong>
                                        </div>
                                        <div class="col-md-4 col-sm-4 col-4">
                                            <span class="thead-cases">Recovered</span> <br>
                                            <strong class="l-space" :title="'Last updated '+data.mapInfo.singleRow.lastUpdate | moment('from', 'now')">{{thousand_number(data.mapInfo.singleRow.recovered.value)}}</strong>
                                        </div>
                                        <div class="col-md-4 col-sm-4 col-4">
                                            <span class="thead-cases">Deaths</span> <br>
                                            <strong class="l-space" :title="'Last updated '+data.mapInfo.singleRow.lastUpdate | moment('from', 'now')">{{thousand_number(data.mapInfo.singleRow.deaths.value)}}</strong>
                                        </div>
                                    </template>
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
                            <!-- ph -->
                            <div class="col-md-12">
                                <div class="card">
                                    <div class="card-body">
                                        <h5 v-if="data.selectedCountry != 'worldwide'">{{data.selectedCountry.name}} Today</h5>
                                        <h5 v-else>Worldwide today</h5>
                                        <span class="thead-cases">{{dateToday}}</span>
                                        <hr>
                                        <div class="row" v-if="data.selectedCountry != 'worldwide'">
                                            <div class="col-md-4 col-4">
                                                <div class="card">
                                                    <div class="card-body no-p-top no-p-bottom">
                                                        <template v-if="data.mapInfo.loadingSpecific">
                                                            <span class="thead-cases">Confirmed</span>
                                                            <h3>{{thousand_number(data.mapInfo.specificSummary.totalConfirmed)}}</h3>
                                                            <h6 class="crimson" v-if="data.mapInfo.specificSummary.dailyConfirmed > 0">+{{thousand_number(data.mapInfo.specificSummary.dailyConfirmed)}} new cases</h6>
                                                            <h6 class="crimson" v-else>--</h6>
                                                        </template>
                                                        <template v-else>
                                                            <loading-line></loading-line>
                                                        </template>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-md-4 col-4">
                                                <div class="card"> 
                                                    <div class="card-body no-p-top no-p-bottom">
                                                        <template v-if="data.mapInfo.loadingSpecific">
                                                            <span class="thead-cases">Recovered</span>
                                                            <h3>{{thousand_number(data.mapInfo.specificSummary.totalRecovered)}}</h3>
                                                            <h6 class="crimson">--</h6>
                                                        </template>
                                                        <template v-else>
                                                            <loading-line></loading-line>
                                                        </template>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-md-4 col-4">
                                                <div class="card">
                                                    <div class="card-body no-p-top no-p-bottom">
                                                        <template v-if="data.mapInfo.loadingSpecific">
                                                            <span class="thead-cases">Deaths</span>
                                                            <h3>{{thousand_number(data.mapInfo.specificSummary.totalDeaths)}}</h3>
                                                            <h6 class="crimson" v-if="data.mapInfo.specificSummary.dailyConfirmed > 0">+{{thousand_number(data.mapInfo.specificSummary.dailyDeaths)}} new death</h6>
                                                            <h6 class="crimson" v-else>--</h6>
                                                        </template>
                                                        <template v-else>
                                                            <loading-line></loading-line>
                                                        </template>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row" v-else>
                                            <template v-if="data.mapInfo.tableRow != {} && data.selectedCountry != 'worldwide'">
                                                <div class="col-md-4 col-4">
                                                    <div class="card">
                                                        <div class="card-body no-p-top no-p-bottom">
                                                            <template>
                                                                <span class="thead-cases">Confirmed</span>
                                                                <h3>{{thousand_number(data.mapInfo.summary.confirmed.value)}}</h3>
                                                                <h6 class="crimson" v-if="data.mapInfo.tableRow.Global.NewConfirmed > 0">+{{thousand_number(data.mapInfo.tableRow.Global.NewConfirmed)}} new cases</h6>
                                                                <h6 class="crimson" v-else>--</h6>
                                                            </template>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-md-4 col-4">
                                                    <div class="card"> 
                                                        <div class="card-body no-p-top no-p-bottom">
                                                            <template>
                                                                <span class="thead-cases">Recovered</span>
                                                                <h3>{{thousand_number(data.mapInfo.summary.recovered.value)}}</h3>
                                                                <h6 class="crimson" v-if="data.mapInfo.tableRow.Global.NewRecovered > 0">+{{thousand_number(data.mapInfo.tableRow.Global.NewRecovered)}} new recovered</h6>
                                                                <h6 class="crimson" v-else>--</h6>
                                                            </template>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-md-4 col-4">
                                                    <div class="card">
                                                        <div class="card-body no-p-top no-p-bottom">
                                                            <template>
                                                                <span class="thead-cases">Deaths</span>
                                                                <h3>{{thousand_number(data.mapInfo.summary.deaths.value)}}</h3>
                                                                <h6 class="crimson" v-if="data.mapInfo.tableRow.Global.NewDeaths > 0">+{{thousand_number(data.mapInfo.tableRow.Global.NewDeaths)}} new death</h6>
                                                                <h6 class="crimson" v-else>--</h6>
                                                            </template>
                                                        </div>
                                                    </div>
                                                </div>
                                            </template>
                                        </div>
                                    </div>
                                    <div class="card-body">
                                        Cases over time
                                        <hr>
                                    </div>
                                    <div class="card-body" v-if="data.selectedCountry != 'worldwide'">
                                        <div class="chart-container" style="position: relative; width:100%;" >
                                            <canvas id="country_new_cases"></canvas>
                                        </div>
                                    </div>
                                    <div class="card-body" v-else>
                                        <div class="chart-container" style="position: relative; width:100%;">
                                            <canvas id="new_cases_chart"></canvas>
                                        </div>
                                    </div>
                                    

                                    <div class="card-body" v-if="data.selectedCountry != 'worldwide'">
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
                                            <tbody v-if="data.mapInfo.tableRow.Countries">
                                                <tr>
                                                    <th scope="col">Worldwide</th>
                                                    <th scope="col">{{thousand_number(data.mapInfo.summary.confirmed.value)}}</th>
                                                    <th scope="col">{{thousand_number(data.mapInfo.summary.recovered.value)}}</th>
                                                    <th scope="col">{{thousand_number(data.mapInfo.summary.deaths.value)}}</th>
                                                <tr>
                                                <tr v-for="(country, index) in data.mapInfo.tableRow.Countries" :key="index" style="color: #727375; font-size: 90%;">
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
                                        <h5>Enjoy using this project?</h5>
                                        <p>This project is inspired by google covid 19 tracker user interface. You can it see <a href="https://news.google.com/covid19/map?hl=en-PH&gl=PH&ceid=PH:en" target="_blank">here</a></p>
                                        <br>
                                        <h5>Why don't you buy me a coffee!</h5>
                                        <link href="https://fonts.googleapis.com/css?family=Cookie" rel="stylesheet"><a class="bmc-button" target="_blank" href="https://www.buymeacoffee.com/reidsolon"><img src="https://cdn.buymeacoffee.com/buttons/bmc-new-btn-logo.svg" alt="Buy me a coffee"><span style="margin-left:15px;font-size:28px !important;">Buy me a coffee</span></a>
                                        <hr>
                                        <span class="thead-cases">Consumed APIs: <a href="https://covid19.mathdro.id/api" target="_blank">MathroidAPI</a>, <a href="https://api.covid19api.com/" target="_blank">ApiCOVID19</a>, <a href="https://newsapi.org/" target="_blank">NewsAPI</a> </span><br>
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
                                                    <img :src="news.urlToImage" style="width: 100%; height: 8vh; border-radius: 10px;">
                                                </div>
                                                <div class="card-body thead-cases col-md-12 no-p-bottom">
                                                    {{ news.publishedAt | moment("from", "now") }}
                                                </div>
                                            </div>
                                            </a>
                                            <hr>
                                        </div>
                                        <div class="card-body thead-cases">
                                            Source: <a href="https://newsapi.org" target="_blank" >NewsAPI </a>
                                        </div>
                                    </template>
                                    <template v-else>
                                        <div class="card-body">
                                            <loading-line></loading-line><br>
                                            <loading-line></loading-line>
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
                                        <div class="card-body">
                                            <loading-line></loading-line><br>
                                            <loading-line></loading-line>
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
<script >
import Navigation from './Navigation'
import {setChart} from "../includes/country_chart"
import {initializeMap, setFeatures} from '../includes/mapbox'
const axios = require('axios')
export default {
    components: {
        Navigation
    },
    data(){
        return {
            dateToday: new Date(),
            toggleHelper: false,
            newsAPI: {
                apiKey: '993811875ccc4e37adefa84c45cfd597',
            },
            mapboxConfig: {
                accessToken: 'pk.eyJ1IjoicmVpZHNvbG9uIiwiYSI6ImNqcnZpZThzMTAyN2Ezemx4eHMzM2RoZGwifQ.j65VGpYO6g84DnR1koippQ',
                mapStyle: `mapbox://styles/mapbox/dark-v10?optimize=true?access_token=pk.eyJ1IjoicmVpZHNvbG9uIiwiYSI6ImNqcnZpZThzMTAyN2Ezemx4eHMzM2RoZGwifQ.j65VGpYO6g84DnR1koippQ`,
            },
            data: this.$store.state.tableContainer
        }
    },
    methods: {
        _initMap() {
            var config = {
                accessToken: this.mapboxConfig.accessToken,
                mapStyle: this.mapboxConfig.mapStyle,
                root: 'Mapbox__wrapper',
                center: this.data.map.center,
                zoom: this.data.map.zoom
            }

            this.map = initializeMap(config)
        },
        toggle(bool) {
            this.toggleHelper = bool
        },
        defaultCountry() {
            this.$store.state.tableContainer.selectedCountry = 'worldwide'
            this.$store.state.tableContainer.map.center = [0,0]
            this.$store.state.tableContainer.map.zoom = parseInt(1)
        },
        thousand_number(num) {
            var num_parts = num.toString().split(".");
            num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            return num_parts.join(".");
        },

        getCOUNTRY_DETAILS(country = 'Philippines') {
            this.$store.state.tableContainer.countries.details = []
            axios.get(`https://api.covid19api.com/country/${country}`)
            .then( res => {
                this.$store.state.tableContainer.map.row = res.data
            })
            .catch( err => {
                console.log(err)
            })
        },

        getCOUNTRIES() {
            axios.get('https://covid19.mathdro.id/api/countries')
            .then( res => {
                this.$store.state.tableContainer.countries.row = res.data.countries
            })
            .catch( err => {
                console.log(err)
            })
        },

        getALL() {
            axios.get(`https://covid19.mathdro.id/api/confirmed`)
            .then( res => {
                var data = JSON.parse(JSON.stringify(res.data))
                if(this.map != null) {
                    setFeatures(data)
                } else {
                    this._initMap()
                    setFeatures(data)
                }
            })
            .catch( err => {
                console.log(err)
            })
        },

        getSUMMARY() {
            axios.get(`https://covid19.mathdro.id/api/`)
            .then( res => {
                this.$store.state.tableContainer.mapInfo.summary = res.data
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
                this.$store.state.tableContainer.news.latestSituations = res.data
            })
            .catch( err => {
                console.log(err)
            })
        },

        getLATEST_NEWS(country = this.data.selectedCountry) {
            this.$store.state.tableContainer.news.loadingNews = true
            var url 
            if(country != 'worldwide') {
                var date = new Date()
                var endDate = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()
                url = `https://newsapi.org/v2/everything?q=covid%20news%20in%20${country.name}&from=${endDate}&sortBy=publishedAt&apiKey=993811875ccc4e37adefa84c45cfd597`
            } else {
                var date1 = new Date()
                var endDate1 = date1.getFullYear()+'-'+(date1.getMonth()+1)+'-'+date1.getDate()
                url = `https://newsapi.org/v2/everything?q=covid%20news&from=${endDate1}&sortBy=publishedAt&apiKey=993811875ccc4e37adefa84c45cfd597`
            }
            
            axios.get(url)
            .then(res => {
                this.$store.state.tableContainer.news.newsRow = res.data
                this.$store.state.tableContainer.news.loadingNews = false
            })
            .catch(err => {
                console.log(err)
            })
        },

        getSUMMARY_TABLE(country = this.$store.state.tableContainer.selectedCountry) {
            if(country == 'worldwide') {
                this.getSUMMARY()
            }
            this.$store.state.tableContainer.mapInfo.loadingSpecific = false

            this.getLATEST_NEWS()
            var url = ''
            if(country == 'worldwide') {
                url = 'https://api.covid19api.com/summary'

                axios.get(url)
                .then( res => {
                    this.data.mapInfo.tableRow = res.data
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

            if(this.data.selectedCountry != 'worldwide') {
                var url2 = `https://api.coronatracker.com/v3/stats/worldometer/country?countryCode=${country.iso2}`
                axios.get(url2)
                .then( res => {
                    this.data.mapInfo.specificSummary = res.data[0]
                    this.$store.state.tableContainer.mapInfo.loadingSpecific = true
                })
                .catch( err => {
                    console.log(err)
                })
            }
            

            var date = new Date()
            var month
            var currentMonth = parseInt(date.getMonth() + 1)
            if(currentMonth < 10) {
                month = `0${currentMonth}`
            } else {
                month = currentMonth
            }
            var endDate = date.getFullYear()+'-'+month+'-'+date.getDate()

            var url3 = `https://api.coronatracker.com/v3/analytics/trend/country?countryCode=${country.iso2}&startDate=2020-04-11&endDate=${endDate}`
            axios.get(url3)
            .then( res => {
                var array = res.data
                var confirmed = []
                var deaths    = []
                var recovered = []
                var labels    = []

                array.map( (el) => {
                    var label = new Date(el.last_updated)
                    labels.push( (label.getMonth() + 1) + '-'+label.getDate() )
                    confirmed.push( el.total_confirmed )
                    deaths.push( el.total_deaths)
                    recovered.push( el.total_recovered)
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
                setChart('country_new_cases', 'line', processed)
            })
            .catch( err => {
                console.log(err)
            })
            
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
        this._initMap()
        this.getCOUNTRIES()
        this.getSUMMARY()
        this.getLATEST_SITUATION()
        this.getLATEST_NEWS()
        this.getSUMMARY_TABLE()

        this.getALL()
    },
    created() {
        
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
.mapboxgl-popup-content{padding: 0px !important;}
.mapboxgl-map {width: 100% !important;}
#Mapbox__wrapper{z-index: 9; height: 60vh !important; position: relative; padding: 0px; width: 100%;font-family: 'Product Sans Regular';}
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

/* buy me a coffee*/
.bmc-button img{height: 34px !important;width: 35px !important;margin-bottom: 1px !important;box-shadow: none !important;border: none !important;vertical-align: middle !important;}.bmc-button{padding: 7px 10px 7px 10px !important;line-height: 35px !important;height:51px !important;min-width:217px !important;text-decoration: none !important;display:inline-flex !important;color:#ffffff !important;background-color:red !important;border-radius: 5px !important;border: 1px solid transparent !important;padding: 7px 10px 7px 10px !important;font-size: 28px !important;letter-spacing:0.6px !important;box-shadow: 0px 1px 2px rgba(190, 190, 190, 0.5) !important;-webkit-box-shadow: 0px 1px 2px 2px rgba(190, 190, 190, 0.5) !important;margin: 0 auto !important;font-family:'Cookie', cursive !important;-webkit-box-sizing: border-box !important;box-sizing: border-box !important;-o-transition: 0.3s all linear !important;-webkit-transition: 0.3s all linear !important;-moz-transition: 0.3s all linear !important;-ms-transition: 0.3s all linear !important;transition: 0.3s all linear !important;}.bmc-button:hover, .bmc-button:active, .bmc-button:focus {-webkit-box-shadow: 0px 1px 2px 2px rgba(190, 190, 190, 0.5) !important;text-decoration: none !important;box-shadow: 0px 1px 2px 2px rgba(190, 190, 190, 0.5) !important;opacity: 0.85 !important;color:#ffffff !important;}
</style>