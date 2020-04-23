

var Chart = require('chart.js')
var myChart 
var ctx
export const setChart = (id, type, data) => {
    ctx = document.getElementById(id);
    
    myChart = new Chart(ctx, {
        type: type,
        data: {
            labels: data.labels,
            datasets: data.datasets
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
    })
    myChart
}