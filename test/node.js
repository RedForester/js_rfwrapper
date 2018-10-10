/* eslint-disable no-undef */
const chai = require('chai')
const rfwrapper = require('../lib/index')
const pkg = require('../package')

chai.should()

const rf = new rfwrapper({
    host: 'http://***REMOVED***/',
    mail: 'admin@zippiex.com',
    password: '***REMOVED***' // example user
})

describe('Node class', () => {
    describe('#init', () => {
        it('should be nodeid', () => {
            try {
                rf.node()
            } catch (err) {
                it.should.throw(Error)
            }
        })

        it('should be valide nodeid', () => {
            try {
                rf.node('123123')
            } catch (err) {
                it.should.throw(Error)
            }
        })
    })
})