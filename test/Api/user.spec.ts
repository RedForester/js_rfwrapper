import api from '../../src/api';

const app = new api({
  username: '***REMOVED***',
  password: '***REMOVED***',
});

test('Get self', async () => {
  const result = await app.user.get();

  expect(result);
});

test('Get user by uuid', async () => {
  const result = await app.user.get('6dbfa213-defa-43d1-9215-c232e8485978');

  expect(result);
});

test('Get unknown user by random uuid', async () => {
  const result = await app.user.get('randomuuid');

  expect(result).toEqual('Request params type error');
});

test('Update username', async () => {
  await app.user.update({
    name: 'somename'
  });

  const result = await app.user.get();
  expect(result.name).toEqual('somename')
});
