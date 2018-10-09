import { rfapi } from "../../index"

/**
 * Используется для получения всех узлов
 * @param {string} nodeid uuid узла
 * @async
 * @returns {NodeList} дерево узлов
 */
export default async function () {
    this._nodes = await rfapi.node.get(this.id)
    return this._nodes
}