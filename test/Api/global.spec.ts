import { Api } from '../../src';
import { IMapInfo } from '../../lib/Map/interface';

const api = new Api({
  username: '***REMOVED***',
  password: '***REMOVED***',
});

let testmap: IMapInfo;

beforeAll(async () => {
  testmap = await api.map.create('te1stmap');
});

test('Should return current RF KV', async () => {
  const result = await api.global.getKV;
  expect(result);
});

test('Should return list of exceptions', async () => {
  const result = await api.global.getKV;
  expect(result).toBeTruthy()
});

test('Should return list of events betwen timestamps', async () => {
  const node = await api.node.create(testmap.id, testmap.root_node_id, {})
  const user = await api.user.get();

  const result = await api.global.mapNotif(testmap.id, user.kv_session, '0', '2000000');

  expect(result).toEqual(
    expect.arrayContaining([
      expect.objectContaining({      
        value: {
          what: node.id,
          type: 'node_created',
          data: {
            "node_title": "",
            "parent_title": "Кликните два раза, чтобы изменить",
          },
          who: {
            id: user.user_id,
            username: user.username,
            name: user.name
          }
        },
        version: 1
      })
    ])
  );
});

afterAll(async () => {
  await api.map.delete(testmap.id);
});
