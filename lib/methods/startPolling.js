import axios from 'axios'

export default async () => {
    if (!this.settings.longpooling) {
        this.settings.longpooling = await this.getPollingParams()
    }
    // TODO:
}