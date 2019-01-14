import Context from '../../src/Map/contex';
import { Wrapper, Api } from '../../src';
import { IMapInfo, INodeInfo } from '../../src/Map/interface';
import { IUser } from '../../src/User/interfaces';
import { IExceptions } from '../../src/Utils/api/interfaces';

const user1 = {
  username: '***REMOVED***',
  password: '***REMOVED***',
  host: process.env.DEBUG_RF_URL
};

const user2 = {
  username: '***REMOVED***',
  password: '56016646f841e379a0782f5915475482',
  host: process.env.DEBUG_RF_URL
};

let api: { user1: Api, user2: Api };
let map: IMapInfo;
let node: INodeInfo;
let users: { user1: IUser, user2: IUser };

beforeAll(async () => {
  api = {
    user1: new Api(user1),
    user2: new Api(user2)
  };
  map = await api.user1.map.create('testmap');
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
      name: map.name,
      owner: map.owner
    });
    expect(res.role).toEqual(null);
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


describe('user1 is admin and user2 with all access', () => {
  test('user1 must add user2 as map reader', async () => {
    await api.user1.map.addUser(map.id, {
      access: {},
      username: users.user2.username,
      sendMail: false
    });
    await api.user1.node.addAccess(node.id, {
      [users.user2.user_id]: {
        node: 'user_all',
        branch_in: 'user_all'
      }
    });
  });

  test('user2 can create new node', async () => {
    const subnode = await api.user2.node.create(map.id, node.id, {});
    expect(subnode).toBeTruthy();
  });

  test('user2 can read node', async () => {    
    const result = await api.user2.node.get(node.id);
    expect(result).toMatchObject({
      id: node.id,
      access: 'user_all',
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
  test('user2 can update node', async () => {
    const result = await api.user2.node.update(node.id, {});
    expect(result).toBeTruthy();
  });

  afterAll(async () => {
    await api.user1.node.addAccess(node.id, {
      [users.user2.user_id]: {
        revoked: 'true'
      }
    });
  });
});