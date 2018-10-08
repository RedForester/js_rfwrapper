import { rfapi } from "../../index"

/**
 * Используется для получения всех узлов
 * @param {string} nodeid uuid узла
 * @async
 * @returns {NodeList} дерево узлов
 */
export default async function (nodeid, level_count) {
    this._nodes = await rfapi.map.getTree(this._id, nodeid, level_count)
    return this._nodes
}