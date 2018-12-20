import { Api } from '../../src';
import { IMapInfo } from '../../src/Map/interface';

const api = new Api({
  username: '***REMOVED***',
  password: '***REMOVED***',
});

let testmap: IMapInfo;

beforeAll(async () => {
  testmap = await api.map.create('te1stmap');
});

test('Should create new Node Type', async () => {
  await api.nodetype.create(testmap.id, 'sometype')
  let result = await api.map.getTypes(testmap.id);
  const nodetype = result[0];

  expect(Array.isArray(result)).toBe(true);
  expect(nodetype).toMatchObject({
    map_id: testmap.id,
    name: 'sometype',
    properties: [],
    icon: null
  });

  result = await api.nodetype.get(nodetype.id);
  expect(result).toMatchObject(nodetype);
});

test('Should throw error when get node type with invalid uuid', async () => {
  try {
    await api.nodetype.get('12x31x231x2awexawex12');
  } catch (err) {
    expect(err.code).toEqual('1901')
    expect(err.message).toEqual('Типа узла: 12x31x231x2awexawex12 не существует')
  }
});

afterAll(async () => {
  await api.map.delete(testmap.id);
});
