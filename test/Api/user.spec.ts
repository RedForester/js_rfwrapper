import { Api } from '../../src';

const app = new Api({
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
