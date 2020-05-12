import { Wrapper, Api } from '../../src';
import { IMapInfo } from '../../src/Map/interface';
import { IUser } from '../../src/User/interfaces';
import { CMapWrapper } from '../../src/Map';
import { CNodeWrapper } from '../../src/Node';

const api = new Api({
  username: 'admin@pachilly.com',
  password: 'f6fdffe48c908deb0f4c3bd36c032e72',
});
const rf = new Wrapper({
  username: 'admin@pachilly.com',
  password: 'f6fdffe48c908deb0f4c3bd36c032e72',
});

let map: CMapWrapper;
let userInfo: IUser;

beforeAll(async () => {
  const temp: IMapInfo = await api.map.create('te1stmap');
  map = await rf.Map(temp.id);
  userInfo = await api.user.get();
});

// =====================
//        Tests
// =====================

test('Should throw error when create map wrapper with out id or body', async () => {
  try {
    await rf.Map(undefined, {});
  } catch (e) {
    expect(e.message).toEqual('Map cannot be load');
  }
});

test('Should create new node in this map', async () => {
  const node = await map.create();

  expect(node).toBeTruthy();
  expect(node).toBeInstanceOf(CNodeWrapper);

  expect(node).toMatchObject({
    map_id: map.id,
    parent: map.root_node_id,
    position: [ 'R', 0 ],
    access: 'user_all',
    originalParent: map.root_node_id,
    body: {
      map_id: map.id,
      type_id: null,
      properties: {
        style: {},
        byType: {},
        byUser: [],
        global: {
          title: ''
        }
      },
      parent: map.root_node_id,
      unread_comments_count: 0,
      comments_count: 0,
      children: [],
      access: 'user_all',
      meta: {
        last_modified_user: userInfo.user_id,
        author: userInfo.user_id,
        // leaf: true,
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

afterAll(async () => {
  await api.map.delete(map.id);
});
