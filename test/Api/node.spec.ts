import { Api } from '../../src';

const app = new Api({
  username: '***REMOVED***',
  password: '***REMOVED***',
});

test('Should throw error with undefinded Node ID', async () => {
  try {
    await app.node.get('0c218265-fcc7-4257-a6b8-5674de7c9622');  
  } catch (err) {
    expect(err.code).toEqual('0304')
    expect(err.message).toEqual('Узла: 0c218265-fcc7-4257-a6b8-5674de7c9622 не существует')
  }
});