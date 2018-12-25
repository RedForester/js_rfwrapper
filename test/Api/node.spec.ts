import { Api } from '../../src';
import { IMapInfo } from '../../src/Map/interface';

const api = new Api({
  username: '***REMOVED***',
  password: '***REMOVED***',
});

let testmap: IMapInfo;

beforeAll(async () => {
  testmap = await api.map.create('te1stmap');
});

test('Should create new Node', async () => {
  let result = await api.node.create(testmap.id, testmap.root_node_id, {});
  expect(result)

  result = await api.node.get(result.id);

  expect(result)
});

test('Should throw error when get node type with invalid uuid', async () => {
  try {
    await api.node.get('12x31x231x2awexawex12')
  } catch (err) {
    expect(err.code).toEqual('0304')
    expect(err.message).toEqual('Узла: 12x31x231x2awexawex12 не существует')
  }
});

test('Should delete Node', async () => {
  let result = await api.node.create(testmap.id, testmap.root_node_id, {});

  await api.node.delete(result.id);
});

test('Should throw error when delete Node', async () => {
  try {
    await api.node.get('12x31x231x2awexawex12')
  } catch (err) {
    expect(err.code).toEqual('0304')
    expect(err.message).toEqual('Узла: 12x31x231x2awexawex12 не существует')
  }
});

test('Should update Node', async () => {
  const testnode = await api.node.create(testmap.id, testmap.root_node_id, {});

  // await api.node.update(testnode.id, {
  //   properties: {
  //     global: {
  //       title: 'testing...'
  //     }
  //   }
  // });

  const result = await api.node.get(testnode.id);

  expect(result).toMatchObject({
    body: {
      properties: {
        global: {
          title: ''
        }
      }
    }
  })
});

test('Should throw error when update Node', async () => {
  try {
    await api.node.update('12x31x231x2awexawex12', {
      body: {
        properties: {
          global: {
            title: 'test'
          }
        }
      }
    })
  } catch (err) {
    expect(err.code).toEqual('0304')
    expect(err.message).toEqual('Узла: 12x31x231x2awexawex12 не существует')
  }
});

afterAll(async () => {
  await api.map.delete(testmap.id);
});
