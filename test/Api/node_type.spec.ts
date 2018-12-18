import api from '../../src/api';

const app = new api({
  username: '***REMOVED***',
  password: '***REMOVED***',
});

test('Should throw error with undefinded Node Type ID', async () => {
  try {
    const result = await app.nodetype.get('somerandomid');  
  } catch (err) {
    expect(err.code).toEqual('1901')
    expect(err.message).toEqual('Типа узла: somerandomid не существует')
  }
});