console.log('Hola soy el cliente...');

const socket = io();

socket.on('new-message', (data)=>{
    //console.log(data)
})

// Función para agregar un nuevo mensaje al chat
function addMessage(event) {
    event.preventDefault();
    
    const mensaje = {
        user: document.getElementById('username').value,
        message: document.getElementById('text').value
    }
    // Envía el mensaje al servidor
    socket.emit('new-message', mensaje);

    // Resetea el campo de texto
    document.getElementById('text').value = '';
    
    //return mensaje;
}

// Función para mostrar un mensaje en el chat
function showMessage(message) {
    const chatBox = document.getElementById('chatBox');
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    messageElement.innerHTML = `
        <span class="message-author">${message.user}:</span>
        <span class="message-content">${message.message}</span>
    `;
    chatBox.appendChild(messageElement);
}

// Escucha los mensajes del servidor
socket.on('message-all', (message) => {
    showMessage(message);
});


// Código para agregar al carrito

// Función para actualizar la cantidad del producto en el carrito
async function actualizarCantidad(event, cartId, productId) {
  event.preventDefault();
  const form = event.target;
  const quantity = form.quantity.value;

  try {
    const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ quantity })
    });

    if (response.ok) {
      alert('La cantidad del producto se ha actualizado correctamente.');
      // Recargar la página para reflejar los cambios en el carrito
      location.reload();
    } else {
      alert('Error al actualizar la cantidad del producto en el carrito.');
    }
  } catch (error) {
    console.error('Error al actualizar la cantidad del producto en el carrito:', error);
  }
}

document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', async () => {
        const productId = btn.dataset.productId;

        try {
            const response = await fetch('/api/carts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ productId })
            });

            if (response.ok) {
                alert('El producto se ha agregado al carrito.');
            } else {
                alert('Error al agregar el producto al carrito.');
            }
        } catch (error) {
            console.error('Error al agregar el producto al carrito:', error);
        }
    });
});

// Actualizar cantidad del producto en el carrito
document.querySelectorAll('.update-quantity').forEach(form => {
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const cartId = form.dataset.cartId;
        const productId = form.dataset.productId;
        const quantityInput = form.querySelector('.quantity-input');
        const quantity = quantityInput.value;

        try {
            const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ quantity })
            });

            if (response.ok) {
                alert('La cantidad del producto se ha actualizado correctamente.');
                // Recargar la página para reflejar los cambios en el carrito
                location.reload();
            } else {
                alert('Error al actualizar la cantidad del producto en el carrito.');
            }
        } catch (error) {
            console.error('Error al actualizar la cantidad del producto en el carrito:', error);
        }
    });
});




