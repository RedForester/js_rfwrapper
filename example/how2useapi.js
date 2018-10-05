const rfwrapper = require('../index');

/*
 * Авторизация пользователя
 * Обяазательные поля: mail, password
 */

const rf = new rfwrapper({
    host: 'http://***REMOVED***/',
    mail: 'admin@zippiex.com',
    password: '***REMOVED***' // example user
})

const node = rf.node('eeed40bf-05e5-44f3-982a-e992c9437b0e')
node.json().then(data => {
    console.log(data)

    /*
     * какие то действия
     * результат действий
     */
    return data.id
}).
then(data => {
    console.log(`Node id: ${data}`)
})

/*
 * Пример получения информации о текущем пользователе
 * Возвращяет промис с data (при успешном выполнении)
 */
rf.api.user.get().then(async (user) => {
    console.log(user)
    const newevent = await rf.api.global.mapNotifLast('1bcf5ff3-c392-43db-8e6f-e8090210b0f7', user.kv_session, 0)
    console.log(newevent)
}).
catch((err) => {
    console.log(err)
})

rf.api.global.exceptions().then((data) => {
    console.log(data)
})

/*
 * rf.api.global.sendBatch([
 *     {
 *         method: "GET",
 *         url: "/api/user"
 *     }
 * ]).
 * then((data) => {
 *     console.log(data)
 * }).
 * catch((err) => {
 *     console.log(err)
 * })
 */