import axios from 'axios';
import {SMS_PLAN_ID, SMS_PLAN_TOKEN} from '../../config';

export const sendSMS = (
  userName,
  driverNumber,
  pickupAddress,
  dropoffAddress,
) => {
  console.log(
    'aaaaaaaaaaaaaaaaa============',
    userName,
    driverNumber,
    pickupAddress,
    dropoffAddress,
  );
  let data = JSON.stringify({
    from: '+19876543210',
    to: ['+923042245806'],
    body: `Your First Relative ${userName} is in Emergency Siutation ,going from ${pickupAddress} to ${dropoffAddress} in Ambuserve ambulance, Driver contact is ${driverNumber} `,
  });

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://us.sms.api.sinch.com/xms/v1/3b741582a500489fab0d46f82dab4301/batches',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer e00116645bf944fc994a4b9de9afa696',
    },
    data: data,
  };

  axios
    .request(config)
    .then(response => {
      console.log(JSON.stringify('sms sent', response.data));
    })
    .catch(error => {
      console.log('error while sending sms', error);
    });
};
