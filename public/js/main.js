window.onload = function () {
  var socket = io();

  var temperature = document.getElementById("temperature");
  var humidity = document.getElementById("humidity");
  var date = document.getElementById("date");
  var timeChart = document.getElementById("timeChart").getContext("2d");

  function time(newDate) {
    var formatDate = new Date(newDate);
    var hours = formatDate.getHours();
    var minutes = "0" + formatDate.getMinutes();
    return hours + ':' + minutes.substr(-2)
  }

  function refreshTrue(newDate) {
    var formatDate = new Date(newDate);
    console.log(formatDate);

    if (formatDate === lastDate) {
      date.style.color = "#ff1654";
      console.log("not change");

    } else {
      date.style.color = "black";
      console.log("change");

    }
    formatDate = lastDate;
  }

  socket.on("data", function (dataSok) {
    temperature.innerHTML = "Temperature: " + dataSok[0].temperature + " °C";
    humidity.innerHTML = "Humidity: " + dataSok[0].humidity + " °%";
    date.innerHTML = "Current time: " + time(dataSok[0].date);

    new Chart(timeChart, {
      // The type of chart we want to create
      type: "line",

      // The data for our dataset
      data: {
        labels: [
          time(dataSok[9].date),
          time(dataSok[8].date),
          time(dataSok[7].date),
          time(dataSok[6].date),
          time(dataSok[5].date),
          time(dataSok[4].date),
          time(dataSok[3].date),
          time(dataSok[2].date),
          time(dataSok[1].date),
          time(dataSok[0].date),
        ],
        datasets: [
          {
            label: "Temperature",
            backgroundColor: "rgb(255, 99, 132, 0.5)",
            borderColor: "rgb(255, 99, 132, 0.5)",
            data: [
              dataSok[9].temperature,
              dataSok[8].temperature,
              dataSok[7].temperature,
              dataSok[6].temperature,
              dataSok[5].temperature,
              dataSok[4].temperature,
              dataSok[3].temperature,
              dataSok[2].temperature,
              dataSok[1].temperature,
              dataSok[0].temperature
            ]
          },
          {
            label: "Humidity",
            backgroundColor: "rgb(99, 255, 132, 0.5)",
            borderColor: "rgb(99, 255, 132, 0.5)",
            data: [
              dataSok[9].humidity,
              dataSok[8].humidity,
              dataSok[7].humidity,
              dataSok[6].humidity,
              dataSok[5].humidity,
              dataSok[4].humidity,
              dataSok[3].humidity,
              dataSok[2].humidity,
              dataSok[1].humidity,
              dataSok[0].humidity
            ]
          }
        ]
      },

      // Configuration options go here
      options: {
        animation: false,
        //   responsive: true,
        //   maintainAspectRatio: false,
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
                suggestedMax: 50
              }
            }
          ]
        }
      }
    });
  });
};