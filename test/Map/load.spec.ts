import { Wrapper } from '../../src';
import { IMapInfo, INodeInfo } from '../../src/Map/interface';

const rf = new Wrapper({
  username: 'admin@pachilly.com',
  password: 'f6fdffe48c908deb0f4c3bd36c032e72',
});

let map: IMapInfo;
let node: INodeInfo;

beforeAll(async () => {
  map = await rf.map.create('te1stmap');
  node = await rf.node.create(map.id, map.root_node_id, {});
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
  expect(result.owner).toEqual(map.owner);
  expect(result.root_node_id).toEqual(map.root_node_id);
});

test('Should load Map from information', async () => {
  const result = await rf.Map(map);

  expect(result.id).toEqual(map.id);
  expect(result.name).toEqual(map.name);
  expect(result.owner).toEqual(map.owner);
  expect(result.root_node_id).toEqual(map.root_node_id);
});

test('Should load Map with custom viewport', async () => {
  const result = await rf.Map(map.id, { viewport: node.id });
  
  expect(result.id).toEqual(map.id);
  expect(result.name).toEqual(map.name);
  expect(result.owner).toEqual(map.owner);
  expect(result.root_node_id).toEqual(map.root_node_id);
});

afterAll(async () => {
  await rf.map.delete(map.id);
});