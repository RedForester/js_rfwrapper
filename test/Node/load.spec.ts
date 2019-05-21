import { Wrapper, Api } from '../../src';
import { IMapInfo, INodeInfo } from '../../src/Map/interface';
import { INodeType } from '../../src/Node/interfaces';

const api = new Api({
  username: '***REMOVED***',
  password: '***REMOVED***',
  host: process.env.DEBUG_RF_URL
});

let map: IMapInfo;
let node: INodeInfo;
let type: INodeType;

beforeAll(async () => {
  map = await api.map.create('te1stmap');
  node = await api.node.get(map.root_node_id);
  type = await api.nodetype.create(map.id, 'testtype');
});
const rf = new Wrapper({
  username: '***REMOVED***',
  password: '***REMOVED***',
  host: process.env.DEBUG_RF_URL
});

// ===================
// =======TESTS=======
// ===================

test('Should throw error with doest exist uuid', async () => {
  try {
    await rf.Node('0c218265-fcc7-4257-a6b8-5674de7c9622');
  } catch (e) {
    expect(e.code).toEqual('0304');
    expect(e.message).toEqual('Узла: 0c218265-fcc7-4257-a6b8-5674de7c9622 не существует');
  }
});

test('Should throw error with undefinded Node uuid', async () => {
  try {
    await rf.Node();
  } catch (e) {
    expect(e.message).toEqual('Map undefined cannot be load');
  }
});

test('Should load Node by valid uuid', async () => {
  const result = await rf.Node(node.id);

  expect(result.id).toEqual(node.id);
  expect(result.map_id).toEqual(node.map_id);
  expect(result.parent).toEqual(node.parent);
  expect(result.meta).toEqual(node.meta);
});

test('Should load Node by information', async () => {
  const result = await rf.Node(undefined, node);

  expect(result.id).toEqual(node.id);
  expect(result.map_id).toEqual(node.map_id);
  expect(result.parent).toEqual(node.parent);
  expect(result.meta).toEqual(node.meta);
});

test('Should load node with Node Type info', async () => {
  const testnode = await api.node.create(map.id, map.root_node_id, {});
  await api.node.update(testnode.id, {
    type_id: type.id
  });

  const result = await rf.Node(testnode.id);

  expect(result.id).toEqual(testnode.id);
  expect(result.map_id).toEqual(testnode.map_id);
  expect(result.parent).toEqual(testnode.parent);

  expect(result.body.type).toMatchObject(type);
});

afterAll(async () => {
  await api.map.delete(map.id);
});