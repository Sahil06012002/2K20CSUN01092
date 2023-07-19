
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Grid, Paper, Typography } from '@mui/material';

function App() {
  const [trains, setTrains] = useState([]);

  useEffect(() => {

    axios
      .get('http://localhost:3000/trains')
      .then((response) => {
        setTrains(response.data);
      })
      .catch((error) => {
        console.error('Error fetching train details:', error.message);
      });
  }, []);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Scheduled Trains
      </Typography>
      <Grid container spacing={3}>
        {trains.map((train, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Paper style={{ padding: '1rem', textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                {train.trainName} (Train No: {train.trainNumber})
              </Typography>
              <Typography variant="body1">
                Departure Time: {train.departureTime.Hours}:{train.departureTime.Minutes}
              </Typography>
              <Typography variant="body1">Seats Available:</Typography>
              <Typography variant="body2">
                Sleeper: {train.seatsAvailable.sleeper}, AC: {train.seatsAvailable.AC}
              </Typography>
              <Typography variant="body1">Price:</Typography>
              <Typography variant="body2">
                Sleeper: {train.price.sleeper}, AC: {train.price.AC}
              </Typography>
              <Typography variant="body1">Delayed By: {train.delayedBy} minutes</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default App;
