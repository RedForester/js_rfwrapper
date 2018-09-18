
export default (trigger, ...middlewares) => {
    middlewares.forEach((fn) => {
        fn(null, trigger)
    })
    return this
}