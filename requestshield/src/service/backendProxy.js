import axios from 'axios';

const backendClient = axios.create({
  timeout: 2000 // 2 seconds
});

export const forwardRequest = async (req,res) => {
  const response = await backendClient.post(
    'http://submission-service:3001/submit',req.body
  );
  return response.data;
};
