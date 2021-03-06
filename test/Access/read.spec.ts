import { Wrapper, IMapInfo, INodeInfo, IUser } from '../../src';

const user1 = {
  username: process.env.DEBUG_RF_USER_1,
  password: process.env.DEBUG_RF_USER_PWD_1,
  host: process.env.DEBUG_RF_URL
};

const user2 = {
  username: process.env.DEBUG_RF_USER_2,
  password: process.env.DEBUG_RF_USER_PWD_2,
  host: process.env.DEBUG_RF_URL
};

let api: { user1: Wrapper, user2: Wrapper };
let map: IMapInfo;
let node: INodeInfo;
let users: { user1: IUser, user2: IUser };

beforeAll(async () => {
  api = {
    user1: new Wrapper(user1),
    user2: new Wrapper(user2)
  };
  map = await api.user1.map.create('testmap');
  map = await api.user1.map.get(map.id);
  node = await api.user1.node.create(map.id, map.root_node_id, {});

  users = {
    user1: await api.user1.user.get(),
    user2: await api.user2.user.get()
  };
});

describe('user1 is admin and user2 without access', async () => {
  test('user2 get map info', async () => {
    const res = await api.user2.map.get(map.id);

    expect(res).toMatchObject({
      id: map.id,
      root_node_id: map.root_node_id,
      owner: map.owner,
      owner_name: map.owner_name,
      owner_avatar: map.owner_avatar,
      layout: map.layout,
      public: map.public,
      user_count: map.user_count,
      name: map.name
    });
  });
  test('user2 cannot get root node', async () => {
    try {
      await api.user2.node.get(map.root_node_id);
    } catch (err) {
      expect(err.code).toEqual('0213');
      expect(err.message).toEqual(`Пользователь ${users.user2.user_id} не обладает доступом в карту ${map.id}`);
    }
  });
  test('user2 cannot create new node', async () => {
    try {
      await api.user2.node.create(map.id, map.root_node_id, {});
    } catch (err) {
      expect(err.code).toEqual('0213');
      expect(err.message).toEqual(`Пользователь ${users.user2.user_id} не обладает доступом в карту ${map.id}`);
    }
  });
  test('user2 cannot update node', async () => {
    try {
      await api.user2.node.update(map.root_node_id, {});
    } catch (err) {
      expect(err.code).toEqual('0213');
      expect(err.message).toEqual(`Пользователь ${users.user2.user_id} не обладает доступом в карту ${map.id}`);
    }
  });
});

describe('user1 is admin and user2 with only read access', () => {
  test('user1 must add user2 as map reader', async () => {
    await api.user1.map.addUser(map.id, {
      access: {},
      username: users.user2.username,
      sendMail: false
    });
    await api.user1.node.addAccess(node.id, {
      [users.user2.user_id]: {
        node: 'user_rc'
      }
    });
  });

  test('user2 can read node', async () => {    
    const result = await api.user2.node.get(node.id);

    expect(result).toMatchObject({
      access: 'user_rc',
      id: node.id,
      map_id: node.map_id
    });
  });
  test('user2 cannot get root node', async () => {
    try {
      await api.user2.node.get(map.root_node_id);
    } catch (err) {
      expect(err.code).toEqual('0306');
      expect(err.message).toEqual(`Доступ к узлу (read) ${map.root_node_id} для пользователя ${users.user2.user_id} запрещен`);
    }
  });
  test('user2 cannot create new node', async () => {
    try {
      await api.user2.node.create(map.id, node.id, {});
    } catch (err) {
      expect(err.code).toEqual('0306');
      expect(err.message).toEqual(`Доступ к узлу (child) ${node.id} для пользователя ${users.user2.user_id} запрещен`);
    }
  });
  test('user2 cannot update node', async () => {
    try {
      await api.user2.node.update(node.id, {});
    } catch (err) {
      expect(err.code).toEqual('0306');
      expect(err.message).toEqual(`Доступ к узлу (write) ${node.id} для пользователя ${users.user2.user_id} запрещен`);
    }
  });

  afterAll(async () => {
    await api.user1.node.addAccess(node.id, {
      [users.user2.user_id]: {
        revoked: 'true'
      }
    });
  });
});

describe('user1 is admin and user2 with only read branch access', () => {
  let subnode: INodeInfo;
  beforeAll(async () => {
    subnode = await api.user1.node.create(map.id, node.id, {});
  });

  test('user1 must add user2 as map reader', async () => {
    await api.user1.node.addAccess(node.id, {
      [users.user2.user_id]: {
        branch_in: 'user_r'
      }
    });
  });

  test('user1 must add user2 as map readed', async () => {    
    const result = await api.user2.node.get(subnode.id);

    expect(result).toMatchObject({
      access: 'user_r',
      id: subnode.id,
      map_id: subnode.map_id
    });
  });
  test('user2 cannot get node', async () => {
    try {
      await api.user2.node.get(node.id);
    } catch (err) {
      expect(err.code).toEqual('0306');
      expect(err.message).toEqual(`Доступ к узлу (read) ${node.id} для пользователя ${users.user2.user_id} запрещен`);
    }
  });
  test('user2 cannot create new node', async () => {
    try {
      await api.user2.node.create(map.id, node.id, {});
    } catch (err) {
      expect(err.code).toEqual('0306');
      expect(err.message).toEqual(`Доступ к узлу (child) ${node.id} для пользователя ${users.user2.user_id} запрещен`);
    }
  });
  test('user2 cannot update node', async () => {
    try {
      await api.user2.node.update(node.id, {});
    } catch (err) {
      expect(err.code).toEqual('0306');
      expect(err.message).toEqual(`Доступ к узлу (write) ${node.id} для пользователя ${users.user2.user_id} запрещен`);
    }
  });
});

afterAll(async () => {
  await api.user1.map.delete(map.id);
});