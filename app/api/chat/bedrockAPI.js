import axios from 'axios';
import AWS from 'aws-sdk';

AWS.config.update({
  region: 'us-east-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

async function callBedrockAPI(payload) {
  const endpoint = 'https://bedrock.us-east-1.amazonaws.com';
  const path = '/model-invoke';

  const request = {
    method: 'POST',
    url: `${endpoint}${path}`,
    headers: {
      'Content-Type': 'application/json',
    },
    data: payload,
  };

  try {
    const response = await axios(request);
    return response.data;
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
    throw error;
  }
}

export default callBedrockAPI;
