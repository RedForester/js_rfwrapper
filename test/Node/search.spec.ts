import { Wrapper } from '../../src';
import { IMapInfo, INodeInfo } from '../../src/Map/interface';
import { INodeType } from '../../src/Node/interfaces';

const rf = new Wrapper({
  username: 'admin@pachilly.com',
  password: 'f6fdffe48c908deb0f4c3bd36c032e72',
  host: process.env.DEBUG_RF_URL
});

let map: IMapInfo;
let node: INodeInfo;
let type: INodeType;

beforeAll(async () => {
  map = await rf.map.create('te1stmap');
  node = await rf.node.get(map.root_node_id);
  type = await rf.nodetype.create(map.id, 'testtype');
});

// ===================
// =======TESTS=======
// ===================

test('Should return empty result when search one', async () => {
  const testnode = await rf.node.create(map.id, node.id, {});

  const tree = await rf.Node(node.id);

  const res = await tree.findOne({
    regex: /SomeRegex/,
  });

  expect(res).toEqual(false);
  await rf.node.delete(testnode.id);
});

test('Should return empty result when search all', async () => {
  const testnode = await rf.node.create(map.id, node.id, {});
  const tree = await rf.Node(node.id);

  const res = await tree.findAll({
    regex: /SomeRegex/,
  });

  expect(res).toEqual([]);
  await rf.node.delete(testnode.id);
});

test('Should return result when search one by regex', async () => {
  const testnode = await rf.node.create(map.id, node.id, {
    properties: {
      global: {
        title: 'SomeRegex'
      }
    }
  });

  const tree = await rf.Node(node.id);
  await tree.getChildren();

  const res = tree.findOne({
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

  await rf.node.delete(testnode.id);
});

test('Should return result when search one by type_id', async () => {
  const testnode = await rf.node.create(map.id, node.id, {
    properties: {
      global: {
        title: 'SomeRegex'
      }
    }
  });
  await rf.node.update(testnode.id, {
    type_id: type.id
  });

  const tree = await rf.Node(node.id);
  await tree.getChildren();

  const res = tree.findOne({
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

  await rf.node.delete(testnode.id);
});

test('Should return empty result when search all by regex', async () => {
  const testnode1 = await rf.node.create(map.id, node.id, {
    properties: {
      global: {
        title: 'aaaa'
      }
    }
  });
  const testnode2 = await rf.node.create(map.id, node.id, {
    properties: {
      global: {
        title: 'aaaaaaaa'
      }
    }
  });
  const tree = await rf.Node(node.id);
  await tree.getChildren();

  const res = tree.findAll({
    regex: /a{3}.+/,
  });

  expect(res.length).toEqual(2);

  await rf.node.delete(testnode1.id);
  await rf.node.delete(testnode2.id);
});

test('Should return empty result when search all by type_id', async () => {
  const testnode1 = await rf.node.create(map.id, node.id, {
    properties: {
      update: [{
        group: 'global',
        key: 'title',
        value: 'somename2'
      }]
    },
    type_id: type.id
  });
  await rf.node.update(testnode1.id, {
    type_id: type.id
  });
  const testnode2 = await rf.node.create(map.id, node.id, {
    properties: {
      update: [{
        group: 'global',
        key: 'title',
        value: 'somename2'
      }]
    },
    type_id: type.id
  });
  await rf.node.update(testnode2.id, {
    type_id: type.id
  });

  const tree = await rf.Node(node.id);
  await tree.getChildren();

  const res = tree.findAll({
    typeid: type.id,
  });

  expect(res.length).toEqual(2);

  await rf.node.delete(testnode1.id);
  await rf.node.delete(testnode2.id);
});

afterAll(async () => {
  await rf.map.delete(map.id);
});