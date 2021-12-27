const { default: knex } = require('knex')

class Contenedor {
    constructor (options) {
        this.options = options
    }

    async getAll() {
        const knex = require('knex')(this.options)
        try {
            const rows = await knex.from(this.options.table).select("*")
            return rows
        } catch(err) { 
            console.log(err)
        } finally {
            knex.destroy()
        }
    }

    async getById(number) {
        const knex = require('knex')(this.options)
        try {
            let data = await knex.from(this.options.table).where('id', number).select('*')
            if(data.length > 0) {
                return data[0]
            } else {
                return null
            }    
        } catch(err) {
            console.log(err)
        } finally {
            knex.destroy()
        }
    }

    async save(newItem) {
        const knex = require('knex')(this.options)
        try {
            const task = await knex.from(this.options.table).insert(newItem)
            return task[0]
        } catch (err) {
            console.log('save', err)
        } finally {
            knex.destroy()
        }
    }

    async deleteById(number) {
        const knex = require('knex')(this.options)

        try {
            await knex.from(this.options.table).where('id', number).del()
        } catch(err) {
            console.log(err)
        } finally {
            knex.destroy()
        }
    }

    async deleteAll() {
        const knex = require('knex')(this.options)
        try {
            await knex.from(this.options.table).del()
            return {'status': 'datos eliminados'}
        } catch(err) {
            console.log(err)
        } finally {
            knex.destroy()
        }
    }

    async update(id, obj) {
        const knex = require('knex')(this.options)
        try {
            const modified = await knex.from(this.options.table).where('id', id).update(obj)
            return modified
        } catch(err) {
            console.log(err)
        } finally {
            knex.destroy()
        }
    }

}

module.exports = Contenedor