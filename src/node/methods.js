import rfapi from './index'

export async function load() {
    const node = await rfapi.node.get(this.nodeid)
    this.data = node
}