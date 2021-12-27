const express = require('express')
const { Router } = express
const Contenedor = require('./Contenedor.js')
const { options } = require('./DB/MariaDB')

const { Server: HttpServer } = require('http')
const { Server: IOServer } = require('socket.io')

const app = express()
const router = Router()



let seeProducts = new Contenedor(options)

//WEBSOCKET
const httpserver = new HttpServer(app)
const io = new IOServer(httpserver)

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use('/', express.static(__dirname + '/views'))
app.use('/public', express.static(__dirname + '/public'))

app.set('view engine', 'ejs')
app.set('views', './views')

let clientMessages = []
io.on('connection', socket => {
    socket.emit('back', clientMessages)

    socket.on('newProduct', () => {
        let data
        (async function getData () {
            data = await seeProducts.getAll()
            const lastItem = data.length - 1
            io.sockets.emit('new-product-emition', data[lastItem])
        })()
    })
    
    socket.on('notification', data => {
        clientMessages.push(data)
        io.sockets.emit('back', clientMessages)
    })  
})

//RUTAS
router.get('/', (req, res) => {
    let data
    (async function getData () {
        data = await seeProducts.getAll()
        res.send(data)
        // res.render('index', {title: 'Coderhouse', data: data})
    })()
})

// router.get('/new-product', (req, res) => {
//     res.render('newProduct', {title: "Ingresar nuevo producto"})
// })

router.get('/:id', async (req, res) => {
    let result = await seeProducts.getById(req.params.id)
    if(result === null) {
        result = { error : 'producto no encontrado' }
        console.log('producto no encontrado')
    }
    res.send(JSON.stringify(result))
})

router.post('/', async (req, res) => {
    const id = await seeProducts.save(req.body)
    res.json(id)
})

router.delete('/:id', async (req, res) => {
    let result = await seeProducts.getById(req.params.id)
    if(result === null) {
        res.send(result = { error : 'producto no encontrado' })
    } else {
        await seeProducts.deleteById(req.params.id)
        res.send("Eliminación correcta")    
    }
})

router.delete('/', async (req, res) => {
    const result = await seeProducts.deleteAll()
    res.send(result)
})


router.put('/:id', async (req, res) => {
    const id = req.params.id
    const result = await seeProducts.update(id, req.body)
    
    result == 1 ? res.send("Producto actualizado") : res.send({ error : 'producto no encontrado' })
})

app.use('/api/productos', router)
httpserver.listen(process.env.PORT || 8080)