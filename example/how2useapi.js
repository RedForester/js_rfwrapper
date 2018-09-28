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

rf.api.global.sendBatch([
    {
        method: "GET",
        url: "/api/user"
    }
]).
then((data) => {
    console.log(data)
}).
catch((err) => {
    console.log(err)
})