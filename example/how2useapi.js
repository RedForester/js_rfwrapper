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
rf.api.user.get().then((data) => {
    console.log(data)
}).
catch((err) => {
    console.log(err)
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