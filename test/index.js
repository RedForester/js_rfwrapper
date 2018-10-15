/* eslint-disable no-undef */
const chai = require('chai')
const rfwrapper = require('../index')
const pkg = require('../package')

chai.should()

const rf = new rfwrapper({
    host: 'http://***REMOVED***/',
    mail: 'admin@zippiex.com',
    password: '***REMOVED***' // example user
})

describe('Main class', () => {
    describe('#constructor', () => {
        it('should be user mail', () => {
            try {
                new rfwrapper({
                    password: '123'
                })
            } catch (err) {
                it.should.throw(Error)
            }
        })
        it('should be user password', () => {
            try {
                new rfwrapper({
                    mail: '123'
                })
            } catch (err) {
                it.should.throw(Error)
            }
        })
    })

    describe('#version', () => {
        it('should be equal version from package file', () => {
            rf.version.should.equal(pkg.version)
        })

        it('should be only readable version', () => {
            try {
                rf.version = 0
            } catch (err) {
                it.should.throw(Error)
            }
        })
    })
})

describe('Node class', () => {
    describe('#constructor', () => {
        it('should be user mail', () => {
            try {
                new rfwrapper({
                    password: '123'
                })
            } catch (err) {
                it.should.throw(Error)
            }
        })
        it('should be user password', () => {
            try {
                new rfwrapper({
                    mail: '123'
                })
            } catch (err) {
                it.should.throw(Error)
            }
        })
    })
})