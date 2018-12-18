import { Wrapper, Api } from '../../src';
import Context from '../../src/Map/contex';

const rf = new Wrapper({
  username: '***REMOVED***',
  password: '***REMOVED***',
});

const api = new Api({
  username: '***REMOVED***',
  password: '***REMOVED***',
});

test('Should create loongpolling with callback', async () => {
  const map = await rf.Map('2b0fb3c2-20f0-4944-8bf1-9dac372a52e9');

  map.on('*', (ctx: Context) => {
    expect(ctx).toBeInstanceOf(Context)
    expect(ctx.data).toBeTruthy()
    expect(ctx.type).toBeTruthy()
    expect(ctx.who).toBeTruthy()
    expect(ctx.sessionId).toBeTruthy()
  });

  setTimeout(() => {
    api.node.create(map.id, map.root_node_id, {})
  }, 1)
});

// test('Should create loongpolling with midlewere', async () => {
//   const map = await rf.Map('2b0fb3c2-20f0-4944-8bf1-9dac372a52e9');

//   map.use((ctx: Context, next: Function) => {
//     expect(ctx).toBeInstanceOf(Context);
//     expect(ctx.data).toBeTruthy();
//     expect(ctx.type).toBeTruthy();
//     expect(ctx.who).toBeTruthy();
//     expect(ctx.sessionId).toBeTruthy();
//     next();
//   });

//   setTimeout(() => {
//     api.node.create(map.id, map.root_node_id, {})
//   }, 1)
// });
