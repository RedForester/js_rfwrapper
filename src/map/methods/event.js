
/**
 * Используется для 
 * @param {string} trigger Тригер на который сработает
 * @param {...any} middlewares Обработчики (указываются последовательно)
 * @returns {this} ~
 */
export default function (trigger, ...middlewares) {
    const idx = this._middlewares.length
    middlewares.forEach((fn) => {
        this._middlewares.push({
            fn: ctx => fn(ctx, () => this._next(ctx, idx)),
            trigger: trigger
        })
    })

    return this
}