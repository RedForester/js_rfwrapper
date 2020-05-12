const rf = require('../');

const wrapper = new rf.Wrapper({
  username: '***REMOVED***',
  password: '***REMOVED***',
});

// подписка на события карты сразу после того как будут получены данные карты
wrapper
  .Map('c060bcb4-4c21-4a40-86ca-b4319252d073', { enablePolling: true })
  .then(map => {
    // пример события
    map.on('*', ctx => {
      console.log(ctx);
    });
  })
  .catch(err => {
    console.log(err);
  });
