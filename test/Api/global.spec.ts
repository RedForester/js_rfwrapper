import { Api } from '../../src';

const app = new Api({
  username: '***REMOVED***',
  password: '***REMOVED***',
});

test('Should return current RF KV', async () => {
  const result = await app.global.getKV;
  expect(result);
});