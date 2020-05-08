const rf = require('../');

const wrapper = new rf.Wrapper({
  username: '***REMOVED***',
  password: '***REMOVED***',
  // host: 'http://***REMOVED***'
});

// подписка на события карты сразу после того как будут получены данные карты
wrapper
  .Map('c060bcb4-4c21-4a40-86ca-b4319252d073', { enablePolling: false })
  .then(map => {
    console.log(map);
  })
  .catch(err => {
    console.log(err);
  });
