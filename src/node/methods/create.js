import { rfapi } from "../index";

/**
 * Создает новый узел с задаными параметрами
 * @async
 * @return {Promise<Node>} Информация об узле
 */
export default async function create (params) {
    // создается узел с указанаными параметрами, если не указаны то по стандарту
    const node = await rfapi.node.create(this.map_id, this.id, {
        position: '["R",-1]',
        properties: {},
        name: 'Новый узел',
        ...params
    })
    return node
}