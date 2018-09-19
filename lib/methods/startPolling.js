import Context from '../context'
import axios from 'axios'

export default async function () {
    try {
        if (!this.settings.longpooling) {
            this.settings.longpooling = await this.getPollingParams()
        }    

        const req = await axios('/', this.settings.axios)

        // FIXME: пример реализации
        events.forEach(event => {
            this.next(new Context(event, this))
        })
    } catch (err) {
        console.error(err)
        throw new Error('longpoll error')
        
        // this.startPolling()   
    }
}