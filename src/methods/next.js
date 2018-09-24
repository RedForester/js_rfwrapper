export default function (ctx, idx = -1) {
    if (this.middlewares.length > idx + 1) {
        const { fn, trigger } = this.middlewares[idx + 1]
        
        if (trigger === ctx.type) {
            return fn(ctx)
        } else if (!trigger) {
            return fn(ctx)
        }

        return this.next(ctx, idx + 1)
    }
}