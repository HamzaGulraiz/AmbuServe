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
            message: 'Ambulance is on the way',
            phaseTwo: false,
          };
        } else if (distanceInKm > 0.5) {
          return {
            distance: response.data.rows[0].elements[0].distance.text,
            duration: response.data.rows[0].elements[0].duration.text,
            message: 'Get Ready',
            phaseTwo: false,
          };
        } else if (distanceInKm > 0.2) {
          return {
            distance: response.data.rows[0].elements[0].distance.text,
            duration: response.data.rows[0].elements[0].duration.text,
            message: 'Around the corner',
            phaseTwo: false,
          };
        } else {
          return {
            distance: response.data.rows[0].elements[0].distance.text,
            duration: response.data.rows[0].elements[0].duration.text,
            message: 'Ambulance is here',
            phaseTwo: true,
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
            message: 'To your destination',
            phaseTwo: false,
          };
        } else if (distanceInKm > 0.5) {
          return {
            distance: response.data.rows[0].elements[0].distance.text,
            duration: response.data.rows[0].elements[0].duration.text,
            message: 'Near the hospital',
            phaseTwo: false,
          };
        } else if (distanceInKm > 0.2) {
          return {
            distance: response.data.rows[0].elements[0].distance.text,
            duration: response.data.rows[0].elements[0].duration.text,
            message: 'Will arrive in a few minutes',
            phaseTwo: false,
          };
        } else {
          return {
            distance: response.data.rows[0].elements[0].distance.text,
            duration: response.data.rows[0].elements[0].duration.text,
            message: 'You have arrived',
            phaseTwo: false,
          };
        }
      }

      // if (phase === 'phaseOne') {
      //   const distanceValue = parseFloat(
      //     response.data.rows[0].elements[0].distance.text,
      //   ); // Parse float
      //   console.log('value', distanceValue);
      //   const distanceInKm = distanceValue;
      //   switch (distanceInKm) {
      //     case distanceInKm > 1:
      //       return {
      //         distance: response.data.rows[0].elements[0].distance.text,
      //         duration: response.data.rows[0].elements[0].duration.text,
      //         message: 'Ambulance is on the way',
      //         phaseTwo: false,
      //       };
      //     case distanceInKm > 0.5:
      //       return {
      //         distance: response.data.rows[0].elements[0].distance.text,
      //         duration: response.data.rows[0].elements[0].duration.text,
      //         message: 'Get Ready',
      //         phaseTwo: false,
      //       };

      //     case distanceInKm > 0.2:
      //       return {
      //         distance: response.data.rows[0].elements[0].distance.text,
      //         duration: response.data.rows[0].elements[0].duration.text,
      //         message: 'Arround the corner',
      //         phaseTwo: false,
      //       };

      //     case distanceInKm < 0.2:
      //       return {
      //         distance: response.data.rows[0].elements[0].distance.text,
      //         duration: response.data.rows[0].elements[0].duration.text,
      //         message: 'Ambulance is here',
      //         phaseTwo: true,
      //       };
      //     default:
      //       return {
      //         distance: response.data.rows[0].elements[0].distance.text,
      //         duration: response.data.rows[0].elements[0].duration.text,
      //         message: '.....',
      //         phaseTwo: false,
      //       };
      //   }
      // } else if (phase === 'phaseTwo') {
      //   const distanceValue = parseFloat(
      //     response.data.rows[0].elements[0].distance.text,
      //   ); // Parse float
      //   const distanceInKm = distanceValue;
      //   switch (distanceInKm) {
      //     case distanceInKm > 1:
      //       return {
      //         distance: response.data.rows[0].elements[0].distance.text,
      //         duration: response.data.rows[0].elements[0].duration.text,
      //         message: 'To your destination',
      //         phaseTwo: false,
      //       };
      //     case distanceInKm > 0.5:
      //       return {
      //         distance: response.data.rows[0].elements[0].distance.text,
      //         duration: response.data.rows[0].elements[0].duration.text,
      //         message: 'Near the hospital',
      //         phaseTwo: false,
      //       };

      //     case distanceInKm > 0.2:
      //       return {
      //         distance: response.data.rows[0].elements[0].distance.text,
      //         duration: response.data.rows[0].elements[0].duration.text,
      //         message: 'Will arrive in few minutes',
      //         phaseTwo: false,
      //       };

      //     case distanceInKm < 0.2:
      //       return {
      //         distance: response.data.rows[0].elements[0].distance.text,
      //         duration: response.data.rows[0].elements[0].duration.text,
      //         message: 'You have arrived',
      //         phaseTwo: false,
      //       };
      //     default:
      //       return {
      //         distance: response.data.rows[0].elements[0].distance.text,
      //         duration: response.data.rows[0].elements[0].duration.text,
      //         message: '.....',
      //         phaseTwo: true,
      //       };
      //   }
      // }
    } else {
      throw new Error('Failed to fetch distance matrix data');
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export default getDistanceMatrix;
