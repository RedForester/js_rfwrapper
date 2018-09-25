
/**
 * Используется для 
 * @param  {...any} middlewares Обработчики (указываются последовательно)
 * @returns {this} ~
 */
export default function (...middlewares) {
    const idx = this.middlewares.length
    middlewares.forEach((fn) => {
        this.middlewares.push({
            fn: ctx => fn(ctx, () => this.next(ctx, idx))
        })
    })

    return this
}