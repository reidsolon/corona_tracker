

var Chart = require('chart.js')

const process = array => {
    var returnArray = []
    var month
    var Months = [0,1,2,3]

    Months.map( month_el => {
        array.map( (el) => {
            month = new Date(el.Date).getMonth()
            if(month == month_el ) {
                returnArray[month_el] = parseInt(el.Confirmed)
            } 
         })
    })
    

     return returnArray
}
export const setChart = (id, type, array) => {
    var datasets = []
    datasets = process(array)
    var ctx = document.getElementById(id);
    var myChart = new Chart(ctx, {
        type: type,
        data: {
            labels: ['January', 'Febuary', 'March', 'April'],
            datasets: [{
                label: 'Cases',
                data: datasets,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
    myChart
}