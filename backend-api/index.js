const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 3001;


app.use(express.json());


app.get('/trains', async (req, res) => {
 
    const authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2ODk3NzgzMzIsImNvbXBhbnlOYW1lIjoidHJhdmVsTGlnaHQiLCJjbGllbnRJRCI6IjE2ZDQxOGY0LWM3Y2QtNGVmZS1iMGExLTZlYzRkZGJmYzM4OSIsIm93bmVyTmFtZSI6IiIsIm93bmVyRW1haWwiOiIiLCJyb2xsTm8iOiIySzIwQ1NVTjAxMDkyIn0.NiXhdcuquUropoXSULC8IoRXKq20IYLkAF1XIzRQWHM'; 
    

    
    const config = {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    };
    const response = await axios.get('http://20.244.56.144/train/trains', config);

    const trainDetails  = response.data;
   

    const currentTime = new Date();

    // Function to check if a train departs within the next 12 hours
    const departsWithin12Hours = (train) => {
    const departureTime = new Date();
    departureTime.setHours(train.departureTime.Hours);
    departureTime.setMinutes(train.departureTime.Minutes);
    departureTime.setSeconds(train.departureTime.Seconds);
    return departureTime >= currentTime && departureTime <= new Date(currentTime.getTime() + 12 * 60 * 60 * 1000);
    };

    // Filtering the  trains departing within the next 12 hours
    const trainsWithin12Hours = trainDetails.filter(departsWithin12Hours);

    // Function to calculate the actual departure time
    const getActualDepartureTime = (train) => {
    const delayedDepartureTime = new Date(currentTime.getTime() + train.delayedBy * 60 * 1000);
    return delayedDepartureTime;
    };

    // Sorting the filtered trains
    const sortedTrains = trainsWithin12Hours.sort((a, b) => {
    const priceA = a.price.sleeper + a.price.AC;
    const priceB = b.price.sleeper + b.price.AC;

    if (priceA !== priceB) {
        return priceA - priceB;
    }

    const seatsAvailableA = a.seatsAvailable.sleeper + a.seatsAvailable.AC;
    const seatsAvailableB = b.seatsAvailable.sleeper + b.seatsAvailable.AC;

    if (seatsAvailableA !== seatsAvailableB) {
        return seatsAvailableB - seatsAvailableA;
    }

    const actualDepartureTimeA = getActualDepartureTime(a);
    const actualDepartureTimeB = getActualDepartureTime(b);

    return actualDepartureTimeA - actualDepartureTimeB;
    });


    console.log(sortedTrains);

    res.json(sortedTrains);

});


app.get("/trains/:num",async (req, res) => {

    const trainNum = parseInt(req.params.num);
    const authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2ODk3NzgzMzIsImNvbXBhbnlOYW1lIjoidHJhdmVsTGlnaHQiLCJjbGllbnRJRCI6IjE2ZDQxOGY0LWM3Y2QtNGVmZS1iMGExLTZlYzRkZGJmYzM4OSIsIm93bmVyTmFtZSI6IiIsIm93bmVyRW1haWwiOiIiLCJyb2xsTm8iOiIySzIwQ1NVTjAxMDkyIn0.NiXhdcuquUropoXSULC8IoRXKq20IYLkAF1XIzRQWHM'; 
       
    const config = {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    };
    const link = 'http://20.244.56.144/train/trains/'+trainNum;
    const response = await axios.get(link, config);

    const specTrainDetails  = response.data;
    console.log(specTrainDetails);
    res.json(specTrainDetails);
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
