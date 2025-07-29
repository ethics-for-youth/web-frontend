const axios = require('axios');

const baseURL = 'https://c7822xf8ai.execute-api.ap-south-1.amazonaws.com/prod/events/1984edc0-0694-49e4-bc46-17f39bf58f98'

const instance = axios.create({
    baseURL: `${baseURL}/dev`,
    withCredentials: true, // To send cookies like JWT/session
    headers: {
        'Content-Type': 'multipart/form-data',
    },
});


export default instance;