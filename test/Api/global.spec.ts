import {
  Api
} from '../../src';
import {
  IMapInfo
} from '../../lib/Map/interface';

const api = new Api({
  username: '***REMOVED***',
  password: '***REMOVED***',
});

let testmap: IMapInfo;

beforeAll(async () => {
  testmap = await api.map.create('te1stmap');
});

test('Should return current RF KV', async () => {
  const result = await api.global.getKV();
  expect(result);
});

test('Should return list of exceptions', async () => {
  const result = await api.global.exceptions();
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
            node_title: '',
            parent_title: 'Кликните два раза, чтобы изменить',
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

test('Should return last event timestamps', async () => {
  const user = await api.user.get();
  const result = await api.global.mapNotifLast(testmap.id, user.kv_session);

  expect(result);
});

test('Should wait event by version', async () => {
  const user = await api.user.get();
  const result = await api.global.mapNotifLast(testmap.id, user.kv_session, 0);

  expect(result).toMatchObject({
    version: 1
  });

  expect(result);
});

test('Should return key/value db params', async () => {
  const result = await api.global.getKV();

  expect(result).toMatchObject({
    address: '/kv/',
    port: 12000,
    prefix: null,
    protocol: 'http'
  });
});

test('Should return KV db sid', async () => {
  const result = await api.global.getSID();

  expect(result)
});

test('Should create search request and return null hits', async () => {
  const result = await api.global.search('Кликнит', [testmap.id]);

  expect(result.hits).toEqual([])
});

test('Should create search request and return one hits', async () => {
  const tempnode = await api.node.create(testmap.id, testmap.root_node_id, {
    properties: {
      global: {
        title: 'Кликнит',
      },
    },
  })
  const result = await api.global.search('Кликнит', [testmap.id]);

  expect(result.hits).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        id: tempnode.id,
        map_id: testmap.id
      })
    ])
  );
});

test('Should create batch request and return current user and map', async () => {
  const result = await api.global.sendBatch([{
    url: '/api/user',
    method: 'GET'
  }, {
    url: `/api/maps/${testmap.id}`,
    method: 'GET'
  }])

  expect(result[0].status).toBe(200);
  expect(JSON.parse(result[0].body)).toMatchObject({
    user_id: '6dbfa213-defa-43d1-9215-c232e8485978',
    username: '***REMOVED***',
    name: 'somename'
  });
  expect(result[1].status).toBe(200);
  expect(JSON.parse(result[1].body)).toMatchObject({
    id: testmap.id,
    root_node_id: testmap.root_node_id,
    owner: testmap.owner,
    name: testmap.name
  });

});

afterAll(async () => {
  await api.map.delete(testmap.id);
});
