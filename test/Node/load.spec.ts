import { Wrapper } from '../../src';

const rf = new Wrapper({
  username: '***REMOVED***',
  password: '***REMOVED***',
});

// exapme node data
const node = {
  id: '0c218265-fcc7-4257-a6b8-5674de7c9622',
  map_id: '2b0fb3c2-20f0-4944-8bf1-9dac372a52e9',
  parent: '1cc444ba-8dfc-44a2-9118-d2a2983735b8',
  position: ['L', '0'],
  access: 'user_all',
  originalParent: '1cc444ba-8dfc-44a2-9118-d2a2983735b8',
  hidden: false,
  readers: [
    '6dbfa213-defa-43d1-9215-c232e8485978',
    '94d43ed4-d05e-45df-9e5d-c9d1ba1c369b'
  ],
  nodelevel: 1,
  meta: {
    creation_timestamp: '2018-11-08T16:51:52.320029+03:00',
    last_modified_timestamp: '2018-11-08T13:51:52.319082+03:00',
    last_modified_user: '94d43ed4-d05e-45df-9e5d-c9d1ba1c369b',
    author: '94d43ed4-d05e-45df-9e5d-c9d1ba1c369b',
    leaf: false,
    editable: true,
    commentable: true,
    can_set_access: true
  },
  body: {
    id: '0c218265-fcc7-4257-a6b8-5674de7c9622',
    map_id: '2b0fb3c2-20f0-4944-8bf1-9dac372a52e9',
    type_id: null,
    properties: {
      style: {},
      byType: {},
      byUser: [],
      global: [Object]
    },
    parent: '1cc444ba-8dfc-44a2-9118-d2a2983735b8',
    unread_comments_count: 0,
    comments_count: 0,
    children: [],
    access: 'user_all',
    meta: {
      creation_timestamp: '2018-11-08T16:51:52.320029+03:00',
      last_modified_timestamp: '2018-11-08T13:51:52.319082+03:00',
      last_modified_user: '94d43ed4-d05e-45df-9e5d-c9d1ba1c369b',
      author: '94d43ed4-d05e-45df-9e5d-c9d1ba1c369b',
      leaf: false,
      editable: true,
      commentable: true,
      can_set_access: true
    }
  }
};

// ===================
// =======TESTS=======
// ===================

test('Should throw error with doest exist uuid', async () => {
  try {
    await rf.Node('0c218265-fcc7-4257-a6b8-5674de7c9622');
  } catch (e) {
    expect(e.code).toEqual('0304');
    expect(e.message).toEqual('Узла: 0c218265-fcc7-4257-a6b8-5674de7c9622 не существует');
  }
});

test('Should throw error with undefinded Node uuid', async () => {
  try {
    await rf.Node();
  } catch (e) {
    expect(e.message).toEqual('Cannot load Node');
  }
});

test('Should load Node by valid uuid', async () => {
  const result = await rf.Node(node.id);

  expect(result.id).toEqual(node.id);
  expect(result.map_id).toEqual(node.map_id);
  expect(result.parent).toEqual(node.parent);
  expect(result.meta).toEqual(node.meta);
});

test('Should load Node by information', async () => {
  const result = await rf.Node(undefined, node);

  expect(result.id).toEqual(node.id);
  expect(result.map_id).toEqual(node.map_id);
  expect(result.parent).toEqual(node.parent);
  expect(result.meta).toEqual(node.meta);
})
