import { Api } from '../../src';
import { IMapInfo } from '../../src/Map/interface';
import { IUser } from '../../src/User/interfaces';

const api = new Api({
  username: 'admin@pachilly.com',
  password: 'f6fdffe48c908deb0f4c3bd36c032e72',
  host: process.env.DEBUG_RF_URL
});

let testmap: IMapInfo;
let userInfo: IUser;

beforeAll(async () => {
  testmap = await api.map.create('te1stmap');
  userInfo = await api.user.get();
});

test('Should create new Node', async () => {
  let result = await api.node.create(testmap.id, testmap.root_node_id, {});
  expect(result);

  result = await api.node.get(result.id);

  expect(result).toBeTruthy();
  expect(result).toMatchObject({
    map_id: testmap.id,
    parent: testmap.root_node_id,
    position: [ 'R', 0 ],
    access: 'user_all',
    originalParent: testmap.root_node_id,
    body: {
      map_id: testmap.id,
      type_id: null,
      properties: {
        style: {},
        byType: {},
        byUser: [],
        global: {
          title: ''
        }
      },
      parent: testmap.root_node_id,
      unread_comments_count: 0,
      comments_count: 0,
      children: [],
      access: 'user_all',
      meta: {
        last_modified_user: userInfo.user_id,
        author: userInfo.user_id,
        // leaf: false,
        editable: true,
        commentable: true,
        can_set_access: true } },
    hidden: false,
    readers: [ userInfo.user_id ],
    nodelevel: 1,
    meta: {
      last_modified_user: userInfo.user_id,
      author: userInfo.user_id,
      leaf: true,
      editable: true,
      commentable: true,
      can_set_access: true
    }
  });
});

test('Should throw error when get node type with invalid uuid', async () => {
  try {
    await api.node.get('12x31x231x2awexawex12');
  } catch (err) {
    expect(err.code).toEqual('0304');
    expect(err.message).toEqual('Узла 12x31x231x2awexawex12 не существует');
  }
});

test('Should delete Node', async () => {
  const result = await api.node.create(testmap.id, testmap.root_node_id, {});

  await api.node.delete(result.id);
});

test('Should throw error when delete Node', async () => {
  try {
    await api.node.get('12x31x231x2awexawex12');
  } catch (err) {
    expect(err.code).toEqual('0304');
    expect(err.message).toEqual('Узла 12x31x231x2awexawex12 не существует');
  }
});

test('Should update Node', async () => {
  const testnode = await api.node.create(testmap.id, testmap.root_node_id, {});

  await api.node.update(testnode.id, {
    properties: {
      update: [{
        group: 'global',
        key: 'title',
        value: 'testing...'
      }]
    }
  });

  const result = await api.node.get(testnode.id);

  expect(result).toBeTruthy();
  expect(result).toMatchObject({
    map_id: testmap.id,
    parent: testmap.root_node_id,
    access: 'user_all',
    originalParent: testmap.root_node_id,
    body: {
      map_id: testmap.id,
      type_id: null,
      properties: {
        style: {},
        byType: {},
        byUser: [],
        global: {
          title: 'testing...'
        }
      },
      parent: testmap.root_node_id,
      unread_comments_count: 0,
      comments_count: 0,
      children: [],
      access: 'user_all',
      meta: {
        last_modified_user: userInfo.user_id,
        author: userInfo.user_id,
        // leaf: false,
        editable: true,
        commentable: true,
        can_set_access: true } },
    hidden: false,
    readers: [ userInfo.user_id ],
    nodelevel: 1,
    meta: {
      last_modified_user: userInfo.user_id,
      author: userInfo.user_id,
      leaf: true,
      editable: true,
      commentable: true,
      can_set_access: true
    }
  });
});

test('Should throw error when update Node', async () => {
  try {
    await api.node.update('12x31x231x2awexawex12', {
      body: {
        properties: {
          update: [{
            group: 'global',
            key: 'title',
            value: 'test'
          }]
        }
      }
    });
  } catch (err) {
    expect(err.code).toEqual('0304');
    expect(err.message).toEqual('Узла 12x31x231x2awexawex12 не существует');
  }
});

test('Should change node access', async () => {
  let testnode = await api.node.create(testmap.id, testmap.root_node_id, {});
  await api.node.addAccess(testnode.id, {
    [userInfo.user_id]: {
      node: 'user_all'
    }
  });

  testnode = await api.node.get(testnode.id);
  expect(testnode.access).toEqual('user_all');
});

test('Should throw error when change node access with unvalid data', async () => {
  const testnode = await api.node.create(testmap.id, testmap.root_node_id, {});

  try {
    const result = await api.node.addAccess(testnode.id, {
      ['asdasdasdasd']: {
        node: 'user_r'
      }
    });
  } catch (e) {
    expect(e.code).toEqual('0105');
    expect(e.message).toEqual('Правила доступа для неизвестной роли user_r в зоне node');
  }
});

test('Should return node access', async () => {
  const testnode = await api.node.create(testmap.id, testmap.root_node_id, {});
  await api.node.addAccess(testnode.id, {
    [userInfo.user_id]: {
      node: 'user_all'
    }
  });

  await api.node.access(testnode.id);
});

test('Should throw error when request access data', async () => {
  const testnode = await api.node.create(testmap.id, testmap.root_node_id, {});
  await api.node.addAccess(testnode.id, {
    [userInfo.user_id]: {
      node: 'user_r'
    }
  });

  try {
    await api.node.access(testnode.id);
  } catch (e) {
    expect(e.code).toEqual('0306');
    expect(e.message).toEqual(`Доступ к узлу (access) ${testnode.id} для пользователя ${userInfo.user_id} запрещен`);
  }
});

test('Should throw error when delete node', async () => {
  try {
    await api.node.delete('asdasdasdasda');
  } catch (e) {
    expect(e.code).toEqual('0304');
    expect(e.message).toEqual('Узла asdasdasdasda не существует');
  }
});

afterAll(async () => {
  await api.map.delete(testmap.id);
});
