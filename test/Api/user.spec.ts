import { IUser, Wrapper } from '../../src';

const app = new Wrapper({
  username: process.env.DEBUG_RF_USER_1,
  password: process.env.DEBUG_RF_USER_PWD_1,
  host: process.env.DEBUG_RF_URL
});


let current: IUser;

beforeAll(async() => {
  await app.user.update({
    name: process.env.DEBUG_RF_USER_1
  });

  current = await app.user.get()
});

test('Should return current user', async () => {
  const result = await app.user.get();
  expect(result).toMatchObject({
    username: process.env.DEBUG_RF_USER_1,
    name: process.env.DEBUG_RF_USER_1
  });
});

test('Should return user by uuid', async () => {
  const result = await app.user.get(current.user_id);

  expect(result).toMatchObject({
    username: process.env.DEBUG_RF_USER_1,
    name: process.env.DEBUG_RF_USER_1
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
    expect(e.message).toEqual(`Отсутствуют данные для редактирования пользователя ${current.user_id}`);
  }
});
