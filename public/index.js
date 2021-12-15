const socket = io()
const now = moment().format('DD/MM/YYYY HH:MM:SS');

socket.on('back', data => {
    //CHAT
    let output = document.getElementById('output')
    if(output !== null) output.innerHTML = ''
    
    let messages = []
    data.map(item => {
        messages.push(item)
    })

    let length = messages.length
    for (let i = length - 1; i >= 0; i--) {
        let p = document.createElement('p')
        p.innerHTML = `
                            <span class="chat_email">${messages[i].email} </span>
                            <span class="chat_hora">[${messages[i].hora}]: </span>
                            <span class="chat_text">${messages[i].text}</span>
                        `   
        if(output !== null) output.appendChild(p)
    }
})

socket.on('new-product-emition', data => {
    const tbody = document.getElementById('tbody')

    const tr = document.createElement('tr')
    tr.innerHTML =  `       
                        <td scope="row">${data.title}</td>
                        <td scope="row">${data.price}</td>
                        <td scope="row">
                            <img src=${data.thumbnail} alt="Imagen producto" />
                        </td>
                    `
    tbody.appendChild(tr);
}) 

//PRODUCTS
function setData (event) {
    event.preventDefault()

    if(document.getElementById('email').value === '') {
        alert('Ingrese su dirección de email')
    } else {
        const email = document.getElementById('email').value
        let text = document.querySelector('#message').value
        const message = {
            email: email,
            hora: now,
            text: text
        }
        socket.emit('notification', message)
    
        const emailProperty = document.getElementById('email')
        emailProperty.disabled = true
        document.querySelector('#message').value = ''
    }
}

function setNewProduct (event) {
    event.preventDefault()
    const URL = '/api/productos'
    const datos = { 
        title: document.getElementById('title').value,
        price: document.getElementById('price').value,
        thumbnail: document.getElementById('thumbnail').value
    }

    const options = {
        method: 'POST',
        body: JSON.stringify(datos),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    }

    fetch(URL, options)
        .then(res => res.json())
        .then(dat => console.log(dat))
        .then(() => {
            socket.emit('newProduct', 'Nuevo producto ingresado')
        })
        .catch(err => console.log(err))

    document.getElementById('title').value = '',
    document.getElementById('price').value = '',
    document.getElementById('thumbnail').value = ''
}