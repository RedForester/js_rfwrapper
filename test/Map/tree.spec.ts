import { Wrapper, Api } from '../../src';
import { IMapInfo, IMapWrapper } from '../../src/Map/interface';
import { IUser } from '../../src/User/interfaces';

const api = new Api({
  username: '***REMOVED***',
  password: '***REMOVED***',
});
const rf = new Wrapper({
  username: '***REMOVED***',
  password: '***REMOVED***',
});

let map: IMapWrapper;
let userInfo: IUser;

beforeAll(async () => {
  const temp: IMapInfo = await api.map.create('te1stmap');
  map = await rf.Map(temp.id);
  userInfo = await api.user.get();
});

// =====================
//        Tests
// =====================

test('Should return empty map tree', async () => {
  const tree = map.childrens;

  expect(tree).toBeTruthy();
  expect(tree).toEqual([]);
});

test('Should return map tree with nodes', async () => {
  // создадим 5 узлов
  Array(Array(5).keys()).forEach(async() => {
    await api.node.create(map.id, map.root_node_id, {});
  });

  // пересоздадим врапер и загрузим обновленую карту
  map = await rf.Map(map.id);
  const tree = map.childrens;
  
  expect(tree).toBeTruthy();
  
  // каждый узел жолжен содержать эти данные, по умолчанию
  tree.forEach(item => {
    expect(item).toMatchObject({
      map_id: map.id,
      parent: map.root_node_id,
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
          leaf: false,
          editable: true,
          commentable: true,
          can_set_access: true } },
      hidden: false,
      readers: [ userInfo.user_id ],
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
});


afterAll(async () => {
  await api.map.delete(map.id);
});