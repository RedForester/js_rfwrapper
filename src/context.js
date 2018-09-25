
/**
 * Создает класс для обработки событий, передается с необходимыми параметрами
 */
export default class {

    /**
     * @param {object} event Новое событие
     */
    constructor(event) {
        this.what = event.what
        this.type = event.type
        this.data = event.data
        this.sessionId = event.sessionId
        this.who = event.who
    }

    // TODO: добавить методы для событий
}