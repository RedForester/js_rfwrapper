import rfapi from '../src';

test('Should be a Global', () => {
  const rf = new rfapi({
      username: 'test',
      password: '123'
  });
});
