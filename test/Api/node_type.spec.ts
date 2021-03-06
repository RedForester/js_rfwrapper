import { Wrapper } from '../../src';
import { IMapInfo } from '../../src/Map/interface';
import CNodeType from '../../src/Utils/api/node_type';

const api = new Wrapper({
  username: process.env.DEBUG_RF_USER_1,
  password: process.env.DEBUG_RF_USER_PWD_1,
  host: process.env.DEBUG_RF_URL
});

let testmap: IMapInfo;

beforeAll(async () => {
  testmap = await api.map.create('te1stmap');
});

test('Should return CNodeType class', () => {
  const cls = api.nodetype;

  expect(cls).toBeTruthy();
  expect(cls).toBeInstanceOf(CNodeType);
});

test('Should create new Node Type', async () => {
  await api.nodetype.create(testmap.id, 'sometype');
  let result: any = await api.map.getTypes(testmap.id);
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
    await api.nodetype.get('2e73d279-6f37-4270-be28-022b622c5187');
  } catch (err) {
    expect(err.code).toEqual('1901'); 
    expect(err.message).toEqual('Типа узла 2e73d279-6f37-4270-be28-022b622c5187 не существует');
  }
});

afterAll(async () => {
  await api.map.delete(testmap.id);
});
