<template>
  <div id="app">
    <div class="container-fluid">
        <TableContainer></TableContainer>
    </div>
  </div>
</template>

<script>
import TableContainer from './components/TableContainer'
export default {
  name: 'App',
  components: {
    TableContainer
  }
}
</script>

<style>
#app {
  font-family: 'Product Sans Regular';
}
</style>
