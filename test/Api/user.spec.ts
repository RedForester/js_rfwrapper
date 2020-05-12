import { Api } from '../../src';

const app = new Api({
  username: 'admin@pachilly.com',
  password: 'f6fdffe48c908deb0f4c3bd36c032e72',
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
    username: 'admin@pachilly.com',
    name: 'default-name'
  });
});

test('Should return user by uuid', async () => {
  const result = await app.user.get('6dbfa213-defa-43d1-9215-c232e8485978');

  expect(result).toMatchObject({
    user_id: '6dbfa213-defa-43d1-9215-c232e8485978',
    username: 'admin@pachilly.com',
    name: 'default-name'
  });
});

test('Should update username', async () => {
  await app.user.update({
    name: 'somename'
  });

  const result = await app.user.get();
  expect(result.name).toEqual('somename');
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
