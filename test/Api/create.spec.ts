import api from '../../src/api';
import wrapper from '../../src/wrapper';

test('Should create rfapi client', () => {
  const app = new api({
    username: '***REMOVED***',
    password: '***REMOVED***',
  })

  expect(app).toBeInstanceOf(api)
});

test('Should create rfapi clien with unvalid user/pass', () => {
  const app = new api({
    username: '123',
    password: '1',
  })

  expect(app).toBeInstanceOf(api)
});

test('Should throw error with undefinded user or pass', () => {
  try {
    const app = new api({
      username: 'app@google.com',
      password: undefined,
    })
  } catch (e) {
    expect(e.message).toEqual('You must set user email and password hash!');
  }
});

test('Should throw error with undefinded user or pass', () => {
  try {
    const app = new api({
      username: undefined,
      password: 'asdasd',
    })
  } catch (e) {
    expect(e.message).toEqual('You must set user email and password hash!');
  }
});


test('Should create rf wrapper', () => {
  const app = new wrapper({
    username: '***REMOVED***',
    password: '***REMOVED***',
  })

  expect(app).toBeInstanceOf(wrapper)
});

test('Should create rf wrapper with unvalid user/pass', () => {
  const app = new api({
    username: '123',
    password: '1',
  })

  expect(app).toBeInstanceOf(api)
});

test('Should throw error with undefinded user or pass', () => {
  try {
    const app = new wrapper({
      username: 'app@google.com',
      password: undefined,
    })
  } catch (e) {
    expect(e.message).toEqual('You must set user email and password hash!');
  }
});

test('Should throw error with undefinded user or pass', () => {
  try {
    const app = new wrapper({
      username: undefined,
      password: 'asdasd',
    })
  } catch (e) {
    expect(e.message).toEqual('You must set user email and password hash!');
  }
});