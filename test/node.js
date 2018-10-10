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

    describe('#json', () => {
        it('should be valide json', async () => {
            const node = await rf.node('adasd').json()
            node.should.to.be.a('object')
        })
    })

    describe('#create', () => {
        it('should be valide params', () => {
            try {
                rf.node.create()
            } catch (err) {
                it.should.throw(Error)
            }
        })

        it('should create new node as children in root node', async () => {
            await rf.node.create('some title')
        })

        it('should create new node as children in node', async () => {
            await rf.node.create('some title', {
                parrent: '1efdsayf8asdfsewsdr92cm3'
            })
        })
    })
})