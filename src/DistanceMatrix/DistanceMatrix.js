import axios from 'axios';
import {GOOGLE_API_KEY} from '../../config';

const GOOGLE_MAPS_APIKEY = GOOGLE_API_KEY;

const getDistanceMatrix = async (origin, destination, phase) => {
  console.log('distance matrix component');
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin.latitude},${origin.longitude}&destinations=${destination.latitude},${destination.longitude}&key=${GOOGLE_MAPS_APIKEY}`,
    );
    // console.log('worked distance matrix');
    if (response.data && response.data.rows[0]?.elements[0]?.status === 'OK') {
      if (phase === 'phaseOne') {
        const distanceValue = parseFloat(
          response.data.rows[0].elements[0].distance.text,
        ); // Parse float
        const distanceInKm = distanceValue;
        if (distanceInKm > 1) {
          return {
            distance: response.data.rows[0].elements[0].distance.text,
            duration: response.data.rows[0].elements[0].duration.text,
            title: 'Ambulance is on the way',
            message:
              'Since September 2000, AmbuServe has been providing exceptional ambulance service to Los Angeles County.',
            phaseTwo: false,
            route: 'pickup',
            rideCompleted: false,
          };
        } else if (distanceInKm > 0.5) {
          return {
            distance: response.data.rows[0].elements[0].distance.text,
            duration: response.data.rows[0].elements[0].duration.text,
            title: 'Get Ready',
            message:
              'We provide emergency and non-emergency ambulance service and event medical coverage.',
            phaseTwo: false,
            route: 'pickup',
            rideCompleted: false,
          };
        } else if (distanceInKm > 0.2) {
          return {
            distance: response.data.rows[0].elements[0].distance.text,
            duration: response.data.rows[0].elements[0].duration.text,
            title: 'Around the corner',
            message:
              ' We offer basic life support (EMT) ambulance service, advanced life support (paramedic) ambulance service',
            phaseTwo: false,
            route: 'pickup',
            rideCompleted: false,
          };
        } else {
          return {
            distance: response.data.rows[0].elements[0].distance.text,
            duration: response.data.rows[0].elements[0].duration.text,
            title: 'Ambulance is here',
            message:
              'AmbuServe is the right choice to serve as your ambulance service and event medical services provider.',
            phaseTwo: true,
            route: 'pickup',
            rideCompleted: false,
          };
        }
      } else if (phase === 'phaseTwo') {
        const distanceValue = parseFloat(
          response.data.rows[0].elements[0].distance.text,
        ); // Parse float

        const distanceInKm = distanceValue;
        if (distanceInKm > 1) {
          return {
            distance: response.data.rows[0].elements[0].distance.text,
            duration: response.data.rows[0].elements[0].duration.text,
            title: 'To your destination',
            message:
              'We provide emergency and non-emergency ambulance service and event medical coverage.',
            phaseTwo: false,
            route: 'dropoff',
            rideCompleted: false,
          };
        } else if (distanceInKm > 0.5) {
          return {
            distance: response.data.rows[0].elements[0].distance.text,
            duration: response.data.rows[0].elements[0].duration.text,
            title: 'Near the hospital',
            message:
              ' We offer basic life support (EMT) ambulance service, advanced life support (paramedic) ambulance service',
            phaseTwo: false,
            route: 'dropoff',
            rideCompleted: false,
          };
        } else if (distanceInKm > 0.2) {
          return {
            distance: response.data.rows[0].elements[0].distance.text,
            duration: response.data.rows[0].elements[0].duration.text,
            title: 'Will arrive in a few minutes',
            message:
              ' AmbuServe is the right choice to serve as your ambulance service and event medical services provider.',
            phaseTwo: false,
            route: 'dropoff',
            rideCompleted: false,
          };
        } else if (distanceInKm < 0.02) {
          return {
            distance: response.data.rows[0].elements[0].distance.text,
            duration: response.data.rows[0].elements[0].duration.text,
            title: 'Arrived',
            message:
              'Since September 2000, AmbuServe has been providing exceptional ambulance service to Los Angeles County.',
            phaseTwo: false,
            route: 'dropoff',
            rideCompleted: true,
          };
        } else {
          return {
            // distance: response.data.rows[0].elements[0].distance.text,
            // duration: response.data.rows[0].elements[0].duration.text,
            // title: 'You have arrived',
            // phaseTwo: false,
            // route:'dropoff',
          };
        }
      }
    } else {
      throw new Error('Failed to fetch distance matrix data');
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export default getDistanceMatrix;
