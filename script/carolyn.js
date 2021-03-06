// take in the user's zip code
// take in an activity
// validate form fields
// if zip code is > 5 numbers, or typeof != number, return error/none
// if activity field is "select activity" return error
// on submit, call zip code radius api to identify all zip codes in a 100 radius
// store zip codes and state codes in an array/object
// parse stored zip codes and state codes into a unique list of state codes
// call nps api using the unique state code list (state code) and provided activity (query)
// return list of activities with images, links, descriptions, etc.

var corsVar = "https://chriscastle.com/proxy/index.php?:proxy:";

var stateInput;
var activityInput;

// var currentTime = new Date().getHours();
// if (7 <= currentTime && currentTime < 20) {
// document.body.className = "hero-image";
// } else {
//   document.body.className = "nightMode";
// }

var npsAPIkey = "3eMx7JuhaDduCgDGcbpUQDSwo9EBymREAUXmdQch";
var npsQueryURL =
  "https://developer.nps.gov/api/v1/parks?q=&api_key=" + npsAPIkey;

var weatherapiKey = "73d3cee72322c512646546f162d5afe5";
var weatherqueryURL =
  "https://api.openweathermap.org/data/2.5/weather?units=imperial&appid=" +
  weatherapiKey;

// var zipcodeAPIKey = "ZjHz81gGy2vO2MQx3iYvDmmBBljAfRQzjbTg85zxDDPqSDZGjFiygyYRPNenp2pR";
// var zipCodequeryURL = corsVar + "https://www.zipcodeapi.com/rest/" + zipcodeAPIKey + "/distance.json/" + zipcode + "/" + desZipcode + "/mile";

$("#submit").on("click", function (e) {
  e.preventDefault();

  stateInput = $("#selectedState").val();
  activityInput = $("#selectedActivity").val();

  console.log("Zipcode input: " + stateInput);
  console.log("Activity input: " + activityInput);
  $("#activities").empty();
  getQuote();
  getParkInfo(stateInput, activityInput);
});

$("#reset").on("click", function (e) {
  $("#activities").empty();
  $("#quote").empty();
  $("#selectedState").empty();
  $("#selectedActivity").empty();
});

function getParkInfo(stateInput, activityInput) {
  npsQueryURL =
    "https://developer.nps.gov/api/v1/parks?stateCode=" +
    stateInput +
    "&q=" +
    activityInput +
    "&api_key=" +
    npsAPIkey;
  $.ajax({
    url: npsQueryURL,
    method: "GET",
    success: function (response) {
      var result = response.data;
      console.log(result);
      if (result.length === 0) {
        $("#activities").append($("<h1> NO RESULTS FOUND</h1>"));
      } else {
        for (var a = 0; a < result.length; a++) {
          let parkDiv = $("<div>").attr("class", "card");
          var parkName = $("<h4>").attr("class", "cardTitle");
          var parkImg = $("<p>").attr("class", "cardImg");
          var img = $("<img>");
          var parkDescription = $("<p>").attr("class", "cardDescription");
          var parkURL = $("<a>").attr("href", result[a].url);
          let parkTemp = $("<p>").attr("class", "temp");
          let parkWeath = $("<p>").attr("class", "parkWeath");
          let today = $("<p>").attr("class", "todayDate");
          let humidity = $("<p>").attr("class", "humidity");
          var parkLat = result[a].latitude;
          var parkLon = result[a].longitude;

          parkDiv.css({ margin: "20px", width: "300px", display: "block" });
          parkName.html(result[a].fullName);
          img.attr({
            src: result[a].images[0].url,
            width: "250px",
            height: "auto",
          });
          parkDescription.html(result[a].description);
          parkURL.html(result[a].url);
          parkImg.append(img);
          parkDiv.append(parkName, img, parkDescription, parkURL);

          $("#activities").append(parkDiv);

          var weatherqueryURL =
            "https://api.openweathermap.org/data/2.5/onecall?lat=" +
            parkLat +
            "&lon=" +
            parkLon +
            "&exclude=minutely,hourly&units=imperial&appid=" +
            weatherapiKey;
          $.ajax({
            url: weatherqueryURL,
            method: "GET",
          }).then(function (weather) {
            // for (var i = 0; i < results.length; i ++) {
            //     var parkWeather = dailyForecast[i];
            //     var $element = parkDiv.eq(i);
            //     $element.find(".todayDate").text(parkWeather.date);
            //     $element.find(".temp").text(parkWeather.temp);
            //     $element.find(".humidity").text(parkWeather.humidity);
            //     $element.find(".parkWeath").text(parkWeather.description);
            //     $element.find(".icon").attr("src", parkWeather.icon);

            parkTemp.html("Temperature: " + weather.current.temp + " &deg F");
            parkWeath.html(
              "Current Condition: " + weather.current.weather[0].main
            );
            humidity.html("Humidity: " + weather.current.humidity + "%");
            today.html(moment(weather.current.dt, "X").format("MM/DD/YY"));

            parkDiv.append(today, parkTemp, parkWeath, humidity);
          });
        }

        // var date = $("<p>").attr("class", "date");
        // var descrip = $("<p>").attr("class", "describe");
        // var temp = $("<p>").attr("class", "temperature");
        // var humidity = $("<p>").attr("class", "humidity");
        // var weathIcon = $("<img>").attr("class", "icon");

        // date.html(moment(weather.current.dt, "X").format("MM/DD/YY"));
        // descrip.html(weather.current.weather[0].main);
        // temp.html("Temperature: " + weather.current.temp + " &deg F");
        // humidity.html("Humidity: " + weather.current.humidity + "%");
        // weathIcon.html('<img src="https://openweathermap.org/img/wn/' + weather.current.weather[0].icon + '.png">');
      }
    },
  });
}
// function getWeather() {

//     weatherqueryURL = "https://api.openweathermap.org/data/2.5/weather?state=" + stateInput + "&units=imperial&appid=" + weatherapiKey;

//     $.ajax({
//         url: weatherqueryURL,
//         method: "GET"
//     }).then(function (weather) {
//         //console.log(weatherqueryURL);
//         console.log(weather.main.temp);
//         console.log(weather.main.temp_min);
//         console.log(weather.main.temp_max);
//         console.log(weather.main.humidity);
//         console.log(weather.name);
//         console.log(moment((weather.dt), "X").format("MM/DD/YY"));
//         compareZip();

//     });
// }

//quote randomizer
var queryURL = "https://type.fit/api/quotes";
var randInt = Math.floor(Math.random() * 1683);
console.log(randInt);

//get quote wrapped in a function.  To be used with the onclick event
function getQuote() {
  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (response) {
    var data = JSON.parse(response);
    var author = data[randInt].author;
    var author2 = "Unknown";
    if (author !== null) {
      author = author;
    } else {
      author = author2;
    }

    $("#quote").text(data[randInt].text + "  ");
    $("#quote").append("~  " + author);
  });
}
$(".themeChange").on("click", function(){
  if ($(this).hasClass("light")) {
    $("#theme").attr("href", "assets/style.css")
  }
  else if ($(this).hasClass("dark")){
    $("#theme").attr("href", "assets/nightStyle.css")
  }
});