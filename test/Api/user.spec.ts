import api from '../../src/api';

const app = new api({
  username: '***REMOVED***',
  password: '***REMOVED***',
});

test('Should return current user', async () => {
  const result = await app.user.get();

  expect(result);
});

test('Should return user by uuid', async () => {
  const result = await app.user.get('6dbfa213-defa-43d1-9215-c232e8485978');

  expect(result);
});

test('Should return unknown user by random uuid', async () => {
  const result = await app.user.get('randomuuid');

  expect(result).toEqual('Request params type error');
});

test('Should update username', async () => {
  await app.user.update({
    name: 'somename'
  });

  const result = await app.user.get();
  expect(result.name).toEqual('somename')
});
