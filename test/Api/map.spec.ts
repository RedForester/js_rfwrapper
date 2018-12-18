import api from '../../src/api';

const app = new api({
  username: '***REMOVED***',
  password: '***REMOVED***',
});

test('Should throw error with undefinded Map ID', async () => {
  try {
    const result = await app.map.get('somerandomid');  
  } catch (err) {
    expect(err.code).toEqual('0207')
    expect(err.message).toEqual('Не существует карты somerandomid')
  }
});