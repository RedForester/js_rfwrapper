import { Api } from '../../src';
import { IMapInfo } from '../../src/Map/interface';

const api = new Api({
  username: '***REMOVED***',
  password: '***REMOVED***',
  host: 'http://localhost:5000/'
});

let testmap: IMapInfo;

beforeAll(async () => {
  testmap = await api.map.create('te1stmap');
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
    role: 'admin',
    username: '***REMOVED***',
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
        role: 'user_r',
        username: 'test@mail.ru',
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
  const result = await api.map.requestAccess(testmap.id);

  expect(result);
});

afterAll(async () => {
  await api.map.delete(testmap.id);
});
