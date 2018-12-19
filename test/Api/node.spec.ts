import api from '../../src/api';

const app = new api({
  username: '***REMOVED***',
  password: '***REMOVED***',
});

test('Should throw error with undefinded Node ID', async () => {
  try {
    await app.node.get('somerandomid123123');  
  } catch (err) {
    expect(err.code).toEqual('0304')
    expect(err.message).toEqual('Узла: somerandomid123123 не существует')
  }
});