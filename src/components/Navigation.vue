<template>
    <nav class="navbar navbar-expand-lg fixed-top navbar-light bg-light">
        <a class="navbar-brand" href="#">Covid19 Track</a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarSupportedContent">
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
</template>

<script>
export default {
    
}
</script>
<style scoped>

</style>