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

test('Should return empty result when search one', async () => {
  const testnode = await api.node.create(map.id, node.id, {});

  const tree = await rf.Node(node.id);

  const res = await tree.findOne({
    regex: /SomeRegex/,
  });

  expect(res).toEqual(false);
  await api.node.delete(testnode.id);
});

test('Should return empty result when search all', async () => {
  const testnode = await api.node.create(map.id, node.id, {});
  const tree = await rf.Node(node.id);

  const res = await tree.findAll({
    regex: /SomeRegex/,
  });

  expect(res).toEqual([]);
  await api.node.delete(testnode.id);
});

test('Should return result when search one by regex', async () => {
  const testnode = await api.node.create(map.id, node.id, {
    properties: {
      global: {
        title: 'SomeRegex'
      }
    }
  });

  const tree = await rf.Node(node.id);

  const res = await tree.findOne({
    regex: /SomeRegex/,
  });

  expect(res).toMatchObject({
    body: {
      parent: node.id,
      properties:{  
        global:{  
          title: 'SomeRegex'
        }
      },
    },
    id: testnode.id,
    map_id: map.id,
  });

  await api.node.delete(testnode.id);
});

test('Should return result when search one by type_id', async () => {
  const testnode = await api.node.create(map.id, node.id, {
    properties: {
      global: {
        title: 'SomeRegex'
      }
    }
  });
  await api.node.update(testnode.id, {
    type_id: type.id
  });

  const tree = await rf.Node(node.id);

  const res = await tree.findOne({
    typeid: type.id
  });

  expect(res).toMatchObject({
    body: {
      parent: node.id,
      properties:{  
        global:{  
          title: 'SomeRegex'
        }
      },
      type_id: type.id
    },
    id: testnode.id,
    map_id: map.id,
  });

  await api.node.delete(testnode.id);
});

test('Should return empty result when search all by regex', async () => {
  const testnode1 = await api.node.create(map.id, node.id, {
    properties: {
      global: {
        title: 'aaaa'
      }
    }
  });
  const testnode2 = await api.node.create(map.id, node.id, {
    properties: {
      global: {
        title: 'aaaaaaaa'
      }
    }
  });
  const tree = await rf.Node(node.id);

  const res = await tree.findAll({
    regex: /a{3}.+/,
  });

  expect(res.length).toEqual(2);

  await api.node.delete(testnode1.id);
  await api.node.delete(testnode2.id);
});

test('Should return empty result when search all by type_id', async () => {
  const testnode1 = await api.node.create(map.id, node.id, {
    properties: {
      update: [{
        group: 'global',
        key: 'title',
        value: 'somename2'
      }]
    },
    type_id: type.id
  });
  await api.node.update(testnode1.id, {
    type_id: type.id
  });
  const testnode2 = await api.node.create(map.id, node.id, {
    properties: {
      update: [{
        group: 'global',
        key: 'title',
        value: 'somename2'
      }]
    },
    type_id: type.id
  });
  await api.node.update(testnode2.id, {
    type_id: type.id
  });

  const tree = await rf.Node(node.id);

  const res = await tree.findAll({
    typeid: type.id,
  });

  expect(res.length).toEqual(2);

  await api.node.delete(testnode1.id);
  await api.node.delete(testnode2.id);
});

afterAll(async () => {
  await api.map.delete(map.id);
});