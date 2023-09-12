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
    to: ['+923131180228'],
    body: `Your First Relative ${userName} is in Emergency Siutation ,going from ${pickupAddress} to ${dropoffAddress} in Ambuserve ambulance, Driver contact is ${driverNumber} `,
  });

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `https://us.sms.api.sinch.com/xms/v1/${SMS_PLAN_ID}/batches`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${SMS_PLAN_TOKEN}`,
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
