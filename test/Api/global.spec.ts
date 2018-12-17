import api from '../../src/api';

const app = new api({
  username: '***REMOVED***',
  password: '***REMOVED***',
});

test('Should return current RF KV', async () => {
  const result = await app.global.getKV;
  expect(result);
});