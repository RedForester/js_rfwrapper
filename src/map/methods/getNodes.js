import { rfapi } from "../../index"

/**
 * Используется для получения всех узлов
 * @param {string} nodeid uuid узла
 * @async
 * @returns {NodeList} дерево узлов
 */
export default async function (nodeid) {
    this._nodes = await rfapi.map.getTree(this._id, nodeid)
    return this._nodes
}