import { Api } from '../../src';

const app = new Api({
  username: '***REMOVED***',
  password: '***REMOVED***',
});

test('Should throw error with undefinded Node Type ID', async () => {
  try {
    const result = await app.nodetype.get('0c218265-fcc7-4257-a6b8-5674de7c9622');  
  } catch (err) {
    expect(err.code).toEqual('1901')
    expect(err.message).toEqual('Типа узла: 0c218265-fcc7-4257-a6b8-5674de7c9622 не существует')
  }
});