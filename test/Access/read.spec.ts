import Context from '../../src/Map/contex';
import { Wrapper, Api } from '../../src';
import { IMapInfo } from '../../src/Map/interface';
import { IUser } from '../../src/User/interfaces';

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
let users: { user1: IUser, user2: IUser };

beforeAll(async () => {
  api = {
    user1: new Api(user1),
    user2: new Api(user2)
  };
  map = await api.user1.map.create('testmap');

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

describe('user1 is admin and user2 with only read access', async () => {
  test('user1 must add user2 as map readed', async () => {
    const node = await api.user1.node.create(map.id, map.root_node_id, {});
    
    await api.user1.map.addUser(map.id, {
      access: {},
      username: users.user2.username,
      sendMail: false
    });
    await api.user1.node.addAccess(node.id, {
      [users.user2.user_id]: {
        node: 'user_rc',
        branch_in: 'user_r'
      }
    });
    
    await api.user2.node.get(node.id);
  });
});

afterAll(async () => {
  await api.user1.map.delete(map.id);
});