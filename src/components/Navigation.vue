<template>
    <div class="fixed-top row"  >
        <nav id="nav1" class="col-md-12 navbar navbar-expand-lg  navbar-light bg-light">
            <a class="navbar-brand" href="#">Covid19 Track</a>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" id="nav1content">
                <ul class="navbar-nav mr-auto">
                    <li class="nav-item active">
                        <router-link class="nav-link" to="/">Map and Statistics</router-link>
                    </li>
                    <li class="nav-item active">
                        <router-link class="nav-link" to="/news">News</router-link>
                    </li>
                </ul>
            </div>
        </nav>
        <nav id="nav2" class="col-md-12 navbar navbar-expand-lg  navbar-light bg-light" :class="{'scrolled' : scrollState.scrolled == true, 'idle' : scrollState.scrolled == false}" >
            <div id="nav2content">
                <div class="form-group col-md-3">
                    <select class="form-control" v-model="data.selectedCountry" @change="getSUMMARY_TABLE(data.selectedCountry)">
                        <option value="worldwide" selected>Worldwide</option>
                        <option :value="country" v-for="(country, index) in data.countries.row" :key="index">{{country.name}}</option>
                    </select>
                </div>
            </div>
        </nav>
    </div>
    
</template>

<script>
const axios = require('axios')
import {setChart} from '../includes/country_chart'
export default {
    data() {
        return {
            scrollState: {
                scrolled: false,
            },
            data: this.$store.state.tableContainer
        }
    },
    methods: {
        handleScroll() {
            if(document.documentElement.scrollTop > 10 && this.scrollState.scrolled == false) {
                this.scrollState.scrolled = true
            } else if(document.documentElement.scrollTop == 0) {
                this.scrollState.scrolled = false
            }
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
    created () {
        window.addEventListener('scroll', this.handleScroll);
    },
    destroyed () {
        window.removeEventListener('scroll', this.handleScroll);
    }
}
</script>
<style scoped>
#nav1{z-index: 16;}
#nav2 {z-index: 15;box-shadow: 0 3px 8px 0 rgba(0,0,0,.25); border-top: 1px solid #ccc; padding-bottom: unset;}
#nav2content{
    padding: 5px;
}
.scrolled {display: block; background-color: red; transition: 0.5s; animation: showNav 0.5s;}
.idle{display:none; background-color: red 0px; transition: 0.5s; animation: hideNav 0.5s;}

@keyframes showNav {
    0%   {transform: translateY(-300px); }
    50% {transform: translateY();}
  100% {transform:translateY(0px);}
}

@keyframes hideNav {
    0%   {transform: translateY(0px); }
    50% {transform: translateY();}
  100% {transform:translateY(-300px);}
}
</style>