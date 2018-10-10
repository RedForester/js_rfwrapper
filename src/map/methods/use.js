
/**
 * Используется для 
 * @param  {...any} middlewares Обработчики (указываются последовательно)
 * @returns {this} ~
 */
export default function (...middlewares) {
    const idx = this._middlewares.length
    middlewares.forEach((fn) => {
        this._middlewares.push({
            fn: ctx => fn(ctx, () => this._next(ctx, idx))
        })
    })

    return this
}