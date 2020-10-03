// dotenv is used to hide my api
require('dotenv').config();
const express = require('express');
const https = require('https');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({
   extended: true
}));
// for using css in nodejs we need this line of code
app.use(express.static('public'));

app.set('view engine', 'ejs');

app.get('/', (req, res) => {

   res.sendFile(__dirname + "/index.html");
});

app.post('/', (req, res) => {

   const apikey = process.env.API;
   const city = req.body.city;
   const unit = "metric";
   const url = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apikey + "&units=" + unit;

   if (city.trim().length < 1) {
      res.redirect('/');
   } else {

      https.get(url, (resp) => {

         resp.on("data", data => {
            const weatherData = JSON.parse(data)
            const temp = weatherData.main.temp
            const weatherDescription = weatherData.weather[0].description
            const icon = weatherData.weather[0].icon
            const picUrl = "https://openweathermap.org/img/wn/" + icon + "@2x.png"

            res.render('list', {
               weatherDescriptionH: weatherDescription,
               tempH: temp,
               picUrlH: picUrl,
               cityH: req.body.city
            });
         });

      });
   }

});

app.listen(3000 || process.env.PORT, () => {
   console.log("running on port 3000");
});
