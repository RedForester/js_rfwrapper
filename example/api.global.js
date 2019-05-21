const rf = require('../');

const api = new rf.Api({
  username: '***REMOVED***',
  password: '***REMOVED***',
  // host: 'http://***REMOVED***'
});

api.global.exceptions().then(ex => console.log(ex));

// api.node.create('c060bcb4-4c21-4a40-86ca-b4319252d073', { title: '123' });

// show root node
api.map.get('c060bcb4-4c21-4a40-86ca-b4319252d073')
  .then((map) => {
    return api.node.get(map.root_node_id)
  })
  .then(d => console.log(d))
  .catch(e => console.log(e));

// delete all maps
/*
api.global.getMaps()
  .then(d => {
    console.log(d)
    return d;
  })
  .then(async(result) => {
    for await (let map of result) {
      console.log(map.name, map.id);

      try {
        // await api.map.delete(map.id);
      } catch (err) {
        console.log(err);
      }
    }
  })
  .catch(e => console.log(e));

*/
