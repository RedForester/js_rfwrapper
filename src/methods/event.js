export default function (trigger, ...middlewares) {
    const idx = this.middlewares.length
    middlewares.forEach((fn) => {
        this.middlewares.push({
            fn: ctx => fn(ctx, () => this.next(ctx, idx)),
            trigger: trigger
        })
    })

    return this
}