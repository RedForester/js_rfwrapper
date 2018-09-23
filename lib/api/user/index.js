import create from './create'
import get from './get'

export default function(userid = 'self', data = {}) {
    return {
        get: get(this, userid),
        create: create(this, data)
    }
}