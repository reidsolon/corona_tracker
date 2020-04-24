<template>
    <div class="row" style="padding: 0px;">
        <Navigation></Navigation>
            <div class="col-md-12" style="padding: 0px; width: 100%;">
                <div id="carouselExampleIndicators" class="carousel slide" data-ride="carousel">
                    <div class="opacity__wrapper"></div>
                    <!-- <ol class="carousel-indicators">
                        <li data-target="#carouselExampleIndicators" data-slide-to="0" class="active" v-for="(news, index) in newsRow.articles" :key="index"></li>
                    </ol> -->
                    <div class="carousel-inner">
                        <div class="carousel-item" v-for="(news, index) in newsRow.articles" :key="index" :class="{'active': index == 0 }">
                            <img class="d-block" :src="news.urlToImage" alt="First slide" style="height: 80vh; width: 100%;">
                            <div class="carousel-caption d-none d-md-block" :class="{'animate' : index == index}">
                                <h1 class="post__desc">{{news.title}}</h1>
                                <h1 class="post__title">{{news.description}}</h1>
                                <a class="btn btn-primary readmore__btn" href="#">Read More</a>
                            </div>
                        </div>
                    </div>
                    <a class="carousel-control-prev show-up" href="#carouselExampleIndicators" role="button" data-slide="prev">
                        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span class="sr-only">Previous</span>
                    </a>
                    <a class="carousel-control-next show-up" href="#carouselExampleIndicators" role="button" data-slide="next">
                        <span class="carousel-control-next-icon" aria-hidden="true"></span>
                        <span class="sr-only">Next</span>
                    </a>
                </div>
            </div>
    </div>
</template>
<script>
const axios = require('axios')
import Navigation from './Navigation'
export default {
    components: {
        Navigation,
    },
    data() {
        return {
            newsRow: []
        }
    },
    methods: {
        getLATEST_NEWS() {
            var url = `http://newsapi.org/v2/everything?q=covid%20news&from=2020-03-24&sortBy=publishedAt&apiKey=993811875ccc4e37adefa84c45cfd597`
        
            axios.get(url)
            .then(res => {
                this.newsRow = res.data
            })
            .catch(err => {
                console.log(err)
            })
        },
    },
    mounted() {
        this.getLATEST_NEWS()
    }
}
</script>
<style scoped>

.show-up {z-index: 12;}
/* span.next-prev-container {padding: 10px; background-color:rgba(0,0,0,0.5);} */
.animate{animation: carousel_caption 0.5s ease-out;}
.carousel-indicators{justify-content: left !important;}
.carousel-control-next {background-color: transparent;}
.carousel-caption{bottom: 20% !important;width: auto; text-align: left;}
.carousel-item{transition: transform 0.2s ease, opacity .5s ease-out !important;}
.post__desc {text-transform: uppercase;white-space: pre-line; line-height: 1.3; text-overflow:ellipsis;}
.post__title {text-transform: uppercase;}
.opacity__wrapper{background-color: rgba(0,0,0,0.3); position: absolute; z-index: 10;height: 100%; width: 100%;}
.carousel {border-radius: 0px;}
.readmore__btn {text-transform: uppercase;border-radius: 0px; padding: 15px;padding-right: 45px; padding-left: 45px;}

@keyframes carousel_caption {
    0%   {transform: translateY(300px); opacity: 0.1;}
    50% {transform: translateY(); opacity: 0;}
  100% {transform:translateY(0px); opacity: 1;}
}


@media only screen and (max-width: 870px) {
    .readmore__btn {display: none;}
}

@media only screen and (max-width: 767px) {
    .services-container {margin-left: 2%; margin-right: 2%;}
    .carousel-caption {display: block !important;font-size: 40%;}
}
</style>