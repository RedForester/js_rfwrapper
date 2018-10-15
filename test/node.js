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

const node = rf.node('eeed40bf-05e5-44f3-982a-e992c9437b0e')

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
        it('should be valide json', () => {
            node.should.to.be.a('object')
        })
    })

    describe('#create', () => {
        it('should create new node as children in root node', async () => {
            newnode = await node.create()
            newnode.should.to.be.a('object')
        })

        it('should create new node as children in root node with title', async () => {
            newnode = await node.create({
                name: 'new node!'
            })
            newnode.should.to.be.a('object')
        })
    })
})