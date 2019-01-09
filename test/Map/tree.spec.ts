import { Wrapper, Api } from '../../src';
import { IMapInfo, IMapWrapper } from '../../src/Map/interface';

const api = new Api({
  username: '***REMOVED***',
  password: '***REMOVED***',
});
const rf = new Wrapper({
  username: '***REMOVED***',
  password: '***REMOVED***',
});

let map: IMapWrapper;

beforeAll(async () => {
  const temp: IMapInfo = await api.map.create('te1stmap');
  map = await rf.Map(temp.id);
});

// =====================
//        Tests
// =====================

test('Should return empty map tree', async () => {
  const tree = map.tree;

  expect(tree).toBeTruthy();
  expect(tree).toEqual([]);
});

test('Should return map tree with nodes', async () => {
  await api.node.create(map.id, map.root_node_id, {});
  // пересоздадим врапер и загрузим обновленую карту
  map = await rf.Map(map.id);
  const tree = map.tree;
  
  expect(tree).toBeTruthy();
  expect(tree).toEqual(
    expect.arrayContaining([
      expect.objectContaining({

      })
    ])
  );
});


afterAll(async () => {
  await api.map.delete(map.id);
});