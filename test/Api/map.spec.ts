import { Api } from '../../src';

const app = new Api({
  username: '***REMOVED***',
  password: '***REMOVED***',
});

test('Should throw error with undefinded Map ID', async () => {
  try {
    await app.map.get('0c218265-fcc7-4257-a6b8-5674de7c9622');  
  } catch (err) {
    expect(err.code).toEqual('0207')
    expect(err.message).toEqual('Не существует карты 0c218265-fcc7-4257-a6b8-5674de7c9622')
  }
});