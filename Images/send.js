const axios = require('axios')

axios({
  method: 'get',
  url: 'http://localhost:3000/',
  data: {
    "email": "john@email.com",
    "name": "John Doe",
    "recipientId": "1",
    "clientUserId": "1234"
  }
}).then((res) => {
  console.log(res.data);
})