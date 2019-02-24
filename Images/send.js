const axios = require('axios')

axios({
  method: 'get',
  url: 'http://localhost:3000/',
  data: {
    "email": "mario@email.com",
    "name": "John Doe",
    "recipientId": "20",
    "clientUserId": "1214"
  }
}).then((res) => {
  console.log(res);
})