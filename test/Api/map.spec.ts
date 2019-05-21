import { Api } from '../../src';
import { IMapInfo, IUser } from '../../lib';

const api = new Api({
  username: '***REMOVED***',
  password: '***REMOVED***',
  host: process.env.DEBUG_RF_URL
});

let testmap: IMapInfo;
let testuser: IUser;

beforeAll(async () => {
  testmap = await api.map.create('te1stmap');
  testuser = await api.user.get();
});

test('Should return map info by uuid', async () => {
  const result = await api.map.get(testmap.id);

  expect(result).toMatchObject(testmap);
});

test('Should throw error with undefinded Map ID', async () => {
  try {
    await api.map.get('someveryrandomuuid');
  } catch (err) {
    expect(err.code).toEqual('0207');
    expect(err.message).toEqual('Не существует карты someveryrandomuuid');
  }
});

test('Should map map info by uuid', async () => {
  await api.map.update(testmap.id, {
    name: 'testing...'
  });

  const result = await api.map.get(testmap.id);

  expect(result).toMatchObject({
    id: testmap.id,
    name: 'testing...'
  });
});

test('Should throw error with undefinded Map ID', async () => {
  try {
    await api.map.update('someveryrandomuuid', {});
  } catch (err) {
    expect(err.code).toEqual('0207');
    expect(err.message).toEqual('Не существует карты someveryrandomuuid');
  }
});

test('Should return Map types', async () => {
  const result = await api.map.getTypes(testmap.id);

  expect(result).toEqual([]);
});

test('Should throw error when take node type from undefinded map', async () => {
  try {
    await api.map.getTypes('someveryrandomuuid');
  } catch (err) {
    expect(err.code).toEqual('0207');
    expect(err.message).toEqual('Не существует карты someveryrandomuuid');
  }
});

test('Should return all user on map', async () => {
  const result = await api.map.users(testmap.id);

  expect(result[0]).toMatchObject({
    "avatar": null,
    "can_be_changed_by_role": false,
    "can_be_changed_export": false,
    "can_be_removed": false,
    "is_admin": true,
    "map_id": testmap.id,
    "new_owner": false,
    "surname": null,
    "user_id": testuser.user_id,
    "username": testuser.username
  });
});

test('Should add user to map', async () => {
  await api.map.addUser(testmap.id, {
    access: {
      map: 'user_r'
    },
    nodeId: testmap.id,
    sendMail: false,
    username: 'test@mail.ru'
  });
  const result = await api.map.users(testmap.id);

  expect(result).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        "avatar": null,
        "can_be_changed_by_role": false,
        "can_be_changed_export": false,
        "can_be_removed": false,
        "is_admin": true,
        "map_id": testmap.id,
        "new_owner": false,
        "surname": null,
        "user_id": testuser.user_id,
        "username": testuser.username,
        "name": testuser.name,
      })
    ])
  );
});

test('Should throw error when get users from undefinded map', async () => {
  try {
    await api.map.users('someveryrandomuuid');
  } catch (err) {
    expect(err.code).toEqual('0207');
    expect(err.message).toEqual('Не существует карты someveryrandomuuid');
  }
});

test('Should throw error when delete undefinded map', async () => {
  try {
    await api.map.delete('someveryrandomuuid');
  } catch (err) {
    expect(err.code).toEqual('0207');
    expect(err.message).toEqual('Не существует карты someveryrandomuuid');
  }
});

test('Should throw error when request access to map', async () => {
  try {
    await api.map.requestAccess('someveryrandomuuid');
  } catch (err) {
    expect(err.code).toEqual('0207');
    expect(err.message).toEqual('Не существует карты someveryrandomuuid');
  }
});

test('Should request access to map', async () => {
  // const result = await api.map.requestAccess(testmap.id);

  // expect(result);
});

test('Should return empty nodes', async () => {
  const result = await api.map.getTree(testmap.id, testmap.root_node_id);

  expect(result.body.children).toEqual([]);
});

test('Should throw error when request tree', async () => {
  try {
    const result = await api.map.getTree('somerandommapuuid', testmap.root_node_id);
  } catch (err) {
    expect(err.code).toEqual('0207');
    expect(err.message).toEqual('Не существует карты somerandommapuuid');
  }

  try {
    const result = await api.map.getTree(testmap.id, 'somerandomnodeuuid');
  } catch (err) {
    expect(err.code).toEqual('0304');
    expect(err.message).toEqual('Узла: somerandomnodeuuid не существует');
  }
});

test('Should return map tree', async () => {
  const result1 = await api.map.getRadius(testmap.id, testmap.root_node_id, 3);
  const result2 = await api.map.getTree(testmap.id, testmap.root_node_id);

  expect(result1).toEqual(result2);
});

test('Should return empty nodes', async () => {
  const result = await api.map.getRadius(testmap.id, testmap.root_node_id, 3);

  expect(result.body.children).toEqual([]);
});

test('Should throw error when request tree', async () => {
  try {
    const result = await api.map.getRadius('somerandommapuuid', testmap.root_node_id, 3);
  } catch (err) {
    expect(err.code).toEqual('0207');
    expect(err.message).toEqual('Не существует карты somerandommapuuid');
  }

  try {
    const result = await api.map.getRadius(testmap.id, 'somerandomnodeuuid', 3);
  } catch (err) {
    expect(err.code).toEqual('0304');
    expect(err.message).toEqual('Узла: somerandomnodeuuid не существует');
  }
});

afterAll(async () => {
  await api.map.delete(testmap.id);
});
