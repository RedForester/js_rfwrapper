import { Wrapper } from '../../src';

describe('#api create', () => {
  test('Should create rf client', () => {
    const app = new Wrapper({
      username: process.env.DEBUG_RF_USER_1,
      password: process.env.DEBUG_RF_USER_PWD_1,
      host: process.env.DEBUG_RF_URL
    });

    expect(app).toBeInstanceOf(Wrapper);
  });

  test('Should create rf clien with unvalid user/pass', () => {
    const app = new Wrapper({
      username: '123',
      password: '1',
    });

    expect(app).toBeInstanceOf(Wrapper);
  });

  test('Should throw error with undefinded user or pass', () => {
    try {
      const temp = new Wrapper({
        username: 'app@google.com',
        password: undefined,
      });
    } catch (e) {
      expect(e.message).toEqual('You must set user email and password hash!');
    }
  });

  test('Should throw error with undefinded user or pass', () => {
    try {
      const temp = new Wrapper({
        username: undefined,
        password: 'asdasd',
      });
    } catch (e) {
      expect(e.message).toEqual('You must set user email and password hash!');
    }
  });
});
