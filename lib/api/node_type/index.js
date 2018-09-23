import get from './get'
import deletetype from './delete'
import create from './create'

export default function(nodetypeid, data = {}) {
    return {
        get: get(this, nodetypeid),
        delete: deletetype(this, nodetypeid),
        create: create(this, data)
    }
}