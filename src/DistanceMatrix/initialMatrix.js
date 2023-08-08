import axios from 'axios';
import {GOOGLE_API_KEY} from '../../config';

const GOOGLE_MAPS_APIKEY = GOOGLE_API_KEY;

const getInitialMatrix = async (origin, destination) => {
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin.latitude},${origin.longitude}&destinations=${destination.latitude},${destination.longitude}&key=${GOOGLE_MAPS_APIKEY}`,
    );

    if (response.data && response.data.rows[0]?.elements[0]?.status === 'OK') {
      return {
        distance: response.data.rows[0].elements[0].distance.text,
        duration: response.data.rows[0].elements[0].duration.text,
      };
    } else {
      throw new Error('Failed to fetch distance matrix data');
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export default getInitialMatrix;
