const axios = require('axios');

axios({
  method: 'GET',
  url: 'http://localhost:3000/',
  data: {
    "email": "john@email.com",
    "name": "John Doe",
    "recipientId": "1",
    "clientUserId": "1234"
  }
}).then((res) => {
  console.log(typeof res.data)
  console.log(res.data);
  // this.setState({
  //     url: res.data
  // })
})