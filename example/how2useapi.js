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
rf.user.get().then((data) => {
    console.log(data)
})