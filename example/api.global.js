const rf = require('../');

const api = new rf.Api({
  username: '***REMOVED***',
  password: '***REMOVED***'
});

// delete all maps
api.global.getMaps().then(async(result) => {
  for await (let map of result) {
    console.log(map.name, map.id);
    
    try {
      await api.map.delete(map.id);
    } catch (err) {
      console.log(err);
    }
  }
});
