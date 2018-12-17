import api from '../../src/api';

const app = new api({
  username: '***REMOVED***',
  password: '***REMOVED***',
});

test('Should throw error with undefinded Node Type ID', async () => {
  try {
    const result = await app.nodetype.get(undefined);  
  } catch (err) {
    expect(err.code).toEqual('1901')
    expect(err.message).toEqual('Типа узла: undefined не существует')
  }
});