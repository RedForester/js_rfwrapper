const rf = require('../');

const api = new rf.Api({
  username: '***REMOVED***',
  password: '***REMOVED***',
  host: 'http://***REMOVED***'
});


// show root node
api.map.get('b64578f3-2db6-40a3-954e-9d97c3d86794')
  .then((map) => {
    return api.node.get(map.root_node_id)
  })
  .then(d => console.log(d))
  .catch(e => console.log(e));

// delete all maps
api.global.getMaps()
  .then(d => {
    console.log(d)
    return d;
  })
  .then(async(result) => {
    for await (let map of result) {
      console.log(map.name, map.id);
      
      try {
        await api.map.delete(map.id);
      } catch (err) {
        console.log(err);
      }
    }
  })
  .catch(e => console.log(e));
