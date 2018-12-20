import { Api } from '../../src';
import { IMapInfo } from '../../lib/Map/interface';

const api = new Api({
  username: '***REMOVED***',
  password: '***REMOVED***',
});

let testmap: IMapInfo;

beforeAll(async () => {
  testmap = await api.map.create('te1stmap');
})

test('Should return map info by uuid', async () => {
  const result = await api.map.get(testmap.id);

  expect(result).toMatchObject(testmap);
});

test('Should throw error with undefinded Map ID', async () => {
  try {
    await api.map.get('someveryrandomuuid');  
  } catch (err) {
    expect(err.code).toEqual('0207');
    expect(err.message).toEqual('Не существует карты someveryrandomuuid');
  }
});

test('Should map map info by uuid', async () => {
  await api.map.update(testmap.id, {
    name: 'testing...'
  });

  const result = await api.map.get(testmap.id);

  expect(result).toMatchObject({
    id: testmap.id,
    name: 'testing...'
  });
});

test('Should throw error with undefinded Map ID', async () => {
  try {
    await api.map.update('someveryrandomuuid', {});  
  } catch (err) {
    expect(err.code).toEqual('0207');
    expect(err.message).toEqual('Не существует карты someveryrandomuuid');
  }
});

test('Should return Map types', async () => {
  const result = await api.map.getTypes(testmap.id);

  expect(result).toEqual([]);
});

afterAll(async () => {
  await api.map.delete(testmap.id);
});