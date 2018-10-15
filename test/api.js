/* eslint-disable no-undef */
const chai = require('chai')
const rfwrapper = require('../index')

chai.should()

const rf = new rfwrapper({
    host: 'http://***REMOVED***/',
    mail: 'admin@zippiex.com',
    password: '***REMOVED***' // example user
})

describe('Api methods', () => {
    // todo: добавил тесты на проверку содержимого
    describe('#global', () => {
        const global = rf.api.global

        it('getSID: it should to be a number', async () => {
            const data = await global.getSID()
            data.should.to.be.a('number')
        })

        it('getMaps: it should to be a array of objects', async () => {
            const data = await global.getMaps()
            data.should.to.be.a('array')
            data.forEach(item => item.should.to.be.a('object'))
        })
    })
})