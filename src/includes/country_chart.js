

var Chart = require('chart.js')
export const setChart = (id, type) => {
    var ctx = document.getElementById(id);
    console.log(ctx)
    var myChart = new Chart(ctx, {
        type: type,
        data: {
            labels: ['January', 'Febuary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October','November','December'],
            datasets: [{
                label: 'Cases',
                data: [12, 19, 3, 5, 2, 3],
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
    console.log(myChart)
}