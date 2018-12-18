import { Wrapper } from '../../src';

const rf = new Wrapper({
  username: '***REMOVED***',
  password: '***REMOVED***',
});

test('Should return Map tree', async () => {
  const map = await rf.Map('2b0fb3c2-20f0-4944-8bf1-9dac372a52e9', null, null, true);
  
  expect(map.getNodes()).toBeTruthy();
});
