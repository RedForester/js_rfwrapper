import axios from 'axios'

export default async function() {
    try {
        if (!this.settings.longpooling) {
            this.settings.longpooling = await this.getPollingParams()
        }    

        const req = await axios('/', this.settings.axios)
        console.log(req)

        // FIXME: пример реализации
    } catch (err) {
        console.error(err)
        this.settings.longpooling = null
        // this.startPolling()   
    }
    
}