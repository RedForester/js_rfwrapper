import { Api } from '../../src';

const app = new Api({
  username: '***REMOVED***',
  password: '***REMOVED***',
  host: process.env.DEBUG_RF_URL
});

beforeAll(async() => {
  await await app.user.update({
    name: 'default-name'
  });
});

test('Should return current user', async () => {
  const result = await app.user.get();
  expect(result).toMatchObject({
    user_id: '6dbfa213-defa-43d1-9215-c232e8485978',
    username: '***REMOVED***',
    name: 'default-name'
  });
});

test('Should return user by uuid', async () => {
  const result = await app.user.get('6dbfa213-defa-43d1-9215-c232e8485978');

  expect(result).toMatchObject({
    user_id: '6dbfa213-defa-43d1-9215-c232e8485978',
    username: '***REMOVED***',
    name: 'default-name'
  });
});

test('Should update username', async () => {
  await app.user.update({
    name: 'somename'
  });

  const result = await app.user.get();
  expect(result.name).toEqual('somename')
});

test('Should throw error when update undefinded key', async () => {
  try {
    await app.user.update({
      somekey: 'somename'
    });
  } catch (e) {
    expect(e.message).toEqual('Отсутствуют данные для редактирования пользователя 6dbfa213-defa-43d1-9215-c232e8485978');
  }
});
