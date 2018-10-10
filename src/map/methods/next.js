
/**
 * Последовательно переключает обработчики
 * @param {Context} ctx Содержит new Context
 * @param {integer} idx Порядковый номер обработчика
 * @returns {this.next} Переключение на новый обработчик
 */
export default function (ctx, idx = -1) {
    if (this._middlewares.length > idx + 1) {
        const { fn, trigger } = this._middlewares[idx + 1]
        
        if (trigger === ctx.type || trigger === '*') {
            return fn(ctx)
        } else if (!trigger) {
            return fn(ctx)
        }

        return this._next(ctx, idx + 1)
    }
}