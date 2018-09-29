import { rfapi } from '../index'

export async function load() {
    this.data = await rfapi.node.get(this.nodeid)
    return this.data
}