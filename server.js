const express = require('express')
const app = express()
const router = express.Router()
require('dotenv').config()
const axios = require('axios');
const nodemailer = require("nodemailer");
var schedule = require('node-schedule');

// Configuration
const PORT = 3000


app.use(express.urlencoded({ extended: false }))

app.use(express.static('public'))

let counter = 0
// router.get('/', function(req, res){
//
// })



let requests = setInterval(function(){

   axios.get(`http://api.openweathermap.org/data/2.5/weather?zip=11596&units=imperial&appid=${process.env.apikey}`)
  .then((response) => {
    let weatherData = response.data
    console.log('this is weather data from axios' , weatherData)
    main(weatherData)
  })



  counter++;
  console.log(`PING!!! ${counter} minutes on the page `)
},86400000)
// 60000 is one minute * 60 mins * 24 hours
console.log(requests)


//nodemailer function ---

async function main(weatherData) {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass, // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Fred Foo 👻" <foo@example.com>', // sender address
    to: "mmerlo0317@gmail.com", // list of receivers
    subject: "Todays Weather Report ✔", // Subject line
    text: "TODAYS WEATHER", // plain text body
    html: `the temperature is currently ${weatherData.main.temp} degrees <br> the current conditions are ${weatherData.weather[0].description}`, // html body
  });
  console.log(weatherData)
  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}
// main().catch(console.error);



app.listen(PORT, () => {
  console.log('ready to send the Weather from port', PORT)
})
