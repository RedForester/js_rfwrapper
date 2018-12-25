import { Wrapper, Api } from '../../src';
import { IMapInfo } from '../../src/Map/interface';

const api = new Api({
  username: '***REMOVED***',
  password: '***REMOVED***',
});

let map: IMapInfo;

beforeAll(async () => {
  map = await api.map.create('te1stmap');
});

const rf = new Wrapper({
  username: '***REMOVED***',
  password: '***REMOVED***',
});

test('Should throw error with undefinded Node uuid', async () => {
  try {
    await rf.Map('2b0fb3c2-20f0-4944-8bf1-9dac372a52e9');
  } catch (e) {
    expect(e.message).toEqual('Не существует карты 2b0fb3c2-20f0-4944-8bf1-9dac372a52e9');
  }
});

test('Should load Map by uuid', async () => {
  const result = await rf.Map(map.id);

  expect(result.id).toEqual(map.id);
  expect(result.name).toEqual(map.name);
  expect(result.layout).toEqual(map.layout || 'R');
  expect(result.owner).toEqual(map.owner);
});

test('Should load Map from information', async () => {
  const result = await rf.Map(undefined, { map });

  expect(result.id).toEqual(map.id);
  expect(result.name).toEqual(map.name);
  expect(result.layout).toEqual(map.layout || '');
  expect(result.owner).toEqual(map.owner);
});
