import { Api, Wrapper } from '../../src';

describe('#api create', () => {
  test('Should create rfapi client', () => {
    const app = new Api({
      username: '***REMOVED***',
      password: '***REMOVED***',
      host: process.env.DEBUG_RF_URL
    });

    expect(app).toBeInstanceOf(Api);
  });

  test('Should create rfapi clien with unvalid user/pass', () => {
    const app = new Api({
      username: '123',
      password: '1',
    });

    expect(app).toBeInstanceOf(Api);
  });

  test('Should throw error with undefinded user or pass', () => {
    try {
      const temp = new Api({
        username: 'app@google.com',
        password: undefined,
      });
    } catch (e) {
      expect(e.message).toEqual('You must set user email and password hash!');
    }
  });

  test('Should throw error with undefinded user or pass', () => {
    try {
      const temp = new Api({
        username: undefined,
        password: 'asdasd',
      });
    } catch (e) {
      expect(e.message).toEqual('You must set user email and password hash!');
    }
  });
});

test('Should create rf wrapper', () => {
  const app = new Wrapper({
    username: '***REMOVED***',
    password: '***REMOVED***',
  });

  expect(app).toBeInstanceOf(Wrapper)
});

test('Should create rf wrapper with unvalid user/pass', () => {
  const app = new Api({
    username: '123',
    password: '1',
  });

  expect(app).toBeInstanceOf(Api);
});

test('Should throw error with undefinded user or pass', () => {
  try {
    const app = new Wrapper({
      username: 'app@google.com',
      password: undefined,
    });
  } catch (e) {
    expect(e.message).toEqual('You must set user email and password hash!');
  }
});

test('Should throw error with undefinded user or pass', () => {
  try {
    const app = new Wrapper({
      username: undefined,
      password: 'asdasd',
    });
  } catch (e) {
    expect(e.message).toEqual('You must set user email and password hash!');
  }
});
