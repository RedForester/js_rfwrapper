import { Wrapper, EventContext } from '../../src';
import { IMapInfo } from '../../src/Map/interface';

const params = {
  username: 'admin@pachilly.com',
  password: 'f6fdffe48c908deb0f4c3bd36c032e72',
  host: process.env.DEBUG_RF_URL
};

let rf: Wrapper;
let api: Wrapper;
let event: { what: string; type: string; data: any; sessionId: string; who: any; };
let testmap: IMapInfo;

beforeAll(async () => {
  rf = new Wrapper(params);
  api = new Wrapper(params);

  testmap = await api.map.create('testmap');
});

test('Shoud create map wrapper without longpolling', async (done) => {
  const map = await rf.Map(testmap.id, { enablePolling: false });

  map.on('*', (ctx: EventContext) => {
    throw new Error('Must not be longpolling');
  });

  await api.node.create(map.id, map.root_node_id, {});
  setTimeout(() => {
    done();
  }, 100);
});

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
      is_extension_user: true
    }
  };

  test('Should create loongpolling with callback and trigger to any events', async (done) => {
    const map = await rf.Map(testmap.id, { enablePolling: true });

    const handler = (ctx: EventContext) => {
      expect(ctx).toBeInstanceOf(EventContext);
      expect(ctx.data).toBeTruthy();
      expect(ctx.type).toBeTruthy();
      expect(ctx.who).toBeTruthy();
      done();
    };
    map.on('*', handler);

    // tslint:disable-next-line
    map.next(new EventContext(map.id, {...event, type: 'some_custom_event'}), map);
  });

  test('Should create loongpolling with callback and trigger to event type', async (done) => {
    const map = await rf.Map(testmap.id);

    map.on('node_created', (ctx: EventContext) => {
      expect(ctx).toBeInstanceOf(EventContext);
      expect(ctx.data).toBeTruthy();
      expect(ctx.type).toBeTruthy();
      expect(ctx.who).toBeTruthy();
      expect(ctx.sessionId).toBeTruthy();
      done();
    });

    // tslint:disable-next-line
    map.next(new EventContext(map.id, event), map);
  });

  test('Should create loongpolling without valid trigger', async (done) => {
    const map = await rf.Map(testmap.id);

    map.on('node_empty', (ctx) => ctx);
    map.on('node_created', (ctx: EventContext) => {
      expect(ctx).toBeInstanceOf(EventContext);
      expect(ctx.data).toBeTruthy();
      expect(ctx.type).toBeTruthy();
      expect(ctx.who).toBeTruthy();
      expect(ctx.sessionId).toBeTruthy();
      done();
    });

    // tslint:disable-next-line
    map.next(new EventContext(map.id, event), map);
    return;
  });


  test('Should create loongpolling with callback to trigger any events', async (done) => {
    const map = await rf.Map(testmap.id);

    map.on(null, (ctx: EventContext) => {
      expect(ctx).toBeInstanceOf(EventContext);
      expect(ctx.data).toBeTruthy();
      expect(ctx.type).toBeTruthy();
      expect(ctx.who).toBeTruthy();
      expect(ctx.sessionId).toBeTruthy();
      done();
    });

    // tslint:disable-next-line
    map.next(new EventContext(map.id, event), map);
  });

  test('Should contain event body', () => {
    const context = new EventContext('someuuid', event);

    expect(context).toBeInstanceOf(EventContext);
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
    expect(context.who.is_extension_user).toBe(event.who.is_extension_user);
  });
});

test('', async () => {
  //
});

afterAll(async () => {
  await api.map.delete(testmap.id);
});
