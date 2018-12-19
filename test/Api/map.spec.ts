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

test('Should throw error with undefinded Map ID', async () => {
  try {
    await api.map.get('someveryrandomuuid');  
  } catch (err) {
    expect(err.code).toEqual('0207')
    expect(err.message).toEqual('Не существует карты someveryrandomuuid')
  }
});

test('Should return Map info', async () => {
  const result = await api.map.get(testmap.id);

  expect(result)
});

afterAll(async () => {
  await api.map.delete(testmap.id);
})