import api from '../../src/api';

const app = new api({
  username: '***REMOVED***',
  password: '***REMOVED***',
});

test('Should throw error with undefinded Node ID', async () => {
  try {
    const result = await app.node.get('somerandomid');  
  } catch (err) {
    expect(err.code).toEqual('0304')
    expect(err.message).toEqual('Узла: somerandomid не существует')
  }
});