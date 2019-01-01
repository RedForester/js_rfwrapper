import Context from '../../src/Map/contex';
import { Wrapper, Api } from '../../src';
import { IMapInfo } from '../../lib/Map/interface';

const params = {
  username: '***REMOVED***',
  password: '***REMOVED***',
}

let rf: Wrapper;
let api: Api;
let event: { what: string; type: string; data: any; sessionId: string; who: any; };
let testmap: IMapInfo;

beforeAll(async () => {
  rf = new Wrapper(params);
  api = new Api(params);

  testmap = await api.map.create('testmap');
})

describe('MapEvent#LongPolling', () => {
  test('Should create loongpolling with callback', async () => {
    const map = await rf.Map(testmap.id);
  
    map.on('*', (ctx: Context) => {
      expect(ctx).toBeInstanceOf(Context);
      expect(ctx.data).toBeTruthy();
      expect(ctx.type).toBeTruthy();
      expect(ctx.who).toBeTruthy();
      expect(ctx.sessionId).toBeTruthy();
    });
  
    setTimeout(() => {
      api.node.create(map.id, map.root_node_id, {});
    }, 1);
  });
})

describe('MapEvent#Context', () => {
  event = {
    what: '1689ab55-859e-4b87-8b0a-dc68964feeac',
    type: 'node_created',
    data: {
      node_title: 'Новый узел - 13:12',
      parent_title: 'Кликните два раза, чтобы изменить'
    },
    sessionId: '4809284575',
    who: {
      id: '94d43ed4-d05e-45df-9e5d-c9d1ba1c369b',
      username: 'kudryavtsev@nppsatek.ru',
      avatar: 'https://ru.gravatar.com/userimage/85982417/2947fe117cf09d53ad6e3e2a36719163.png?size=200'
    }
  };

  test('Should contain event body', () => {
    const context = new Context(event);

    expect(context).toBeInstanceOf(Context);
    expect(context.what).toBe(event.what);

    expect([
      'branch_deleted',
      'node_created',
      'node_updated',
      'node_deleted',
      'branch_moved'
    ]).toContain(context.type);
    expect(context.type).toBe(event.type);

    expect(context.data).toBeInstanceOf(Object);
    expect(context.data.node_title).toBe(event.data.node_title);
    expect(context.data.parent_title).toBe(event.data.parent_title);

    expect(context.sessionId).toBe(event.sessionId);

    expect(context.who).toBeInstanceOf(Object);
    expect(context.who.id).toBe(event.who.id);
    expect(context.who.username).toBe(event.who.username);
    expect(context.who.avatar).toBe(event.who.avatar);
  })
})

afterAll(async () => {
  await api.map.delete(testmap.id);
})