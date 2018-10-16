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
    describe('#user', () => {
        const user = rf.api.user

        it('@get: it should return current user', async () => {
            const data = await user.get()
            data.should.to.be.a('object')
        })

        it('@get: it should return error by unknown user', async () => {
            try {
                await user.get('1')
            } catch (err) {
                it.should.throw(Error)
            }
        })
    })

    describe('#global', () => {
        const global = rf.api.global

        it('@getSID: it should to be a number', async () => {
            const data = await global.getSID()
            data.should.to.be.a('number')
        })

        it('@getKV: it should to be a object', async () => {
            const data = await global.getKV()
            data.should.to.be.a('object')
        })

        it('@exceptions: it should to be a array', async () => {
            const data = await global.exceptions()
            data.should.to.be.a('object')
        })

        it('@getMaps: it should to be a array of objects', async () => {
            const data = await global.getMaps()
            data.should.to.be.a('array')
            data.forEach(item => item.should.to.be.a('object'))
        })

        describe('@sendBatch', () => {
            it('it should send Get request', async () => {
                const data = await global.sendBatch([
                    {
                        url: '/api/maps',
                        method: 'GET'
                    }
                ])
                data.should.to.be.a('array')
                data.forEach(item => {
                    item.should.to.be.a('object')
                })
            })

            it('it should send Post and Delete request', async () => {
                // тестируем оба метода сразу что бы не мусорить после себя
                let data = await global.sendBatch([
                    {
                        url: '/api/maps',
                        method: 'POST',
                        body: JSON.stringify({
                            name: '123'
                        })
                    }
                ])
                data.should.to.be.a('array')
                data.forEach(item => {
                    item.should.to.be.a('object')
                })

                const node = JSON.parse(data[0].body)

                await global.sendBatch([
                    {
                        url: '/api/maps/' + node.id,
                        method: 'DELETE'
                    }
                ])
            })
        })
    })
})