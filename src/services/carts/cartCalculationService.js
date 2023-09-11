



export function incrementarCantidad(quantityElement) {
    
    const newQuantity = currentQuantity + 1;

    quantityElement.textContent = newQuantity;

    // Recalcular el total de la cantidad
    calcularTotalCantidad();
}

export function decrementarCantidad(cartId, productId) {
    const quantityElement = document.getElementById(`quantity-${cartId}-${productId}`);
    const currentQuantity = parseInt(quantityElement.textContent);
    const newQuantity = currentQuantity - 1;

    if (newQuantity >= 1) {
        quantityElement.textContent = newQuantity;

        // Recalcular el total de la cantidad
        calcularTotalCantidad();
    }
}

export function actualizarCantidad(cartId, productId) {
    const quantityElement = document.getElementById(`quantity-${cartId}-${productId}`);
    const newQuantity = parseInt(quantityElement.textContent);

    const url = `/api/carts/${cartId}/products/${productId}`;
    const requestData = {
        quantity: newQuantity
    };

    fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
    })
        .then(response => response.json())
        .then(data => {
            console.log('Respuesta del servidor:', data);
            // Actualizar el valor de la cantidad en el elemento HTML
            quantityElement.textContent = newQuantity;

            // Recalcular el total de la cantidad
            calcularTotalCantidad();
        })
        .catch(error => {
            console.error('Error al actualizar la cantidad del producto en el carrito:', error);
        });
}

// Calcular el total de los precios de los productos
export function calcularTotalPrecios() {
    const totalPriceElement = document.getElementById("total-price");
    const productPrices = Array.from(document.querySelectorAll(".card-body > ul > li > .price")).map(priceElement => parseFloat(priceElement.textContent.replace("Precio: $", "")));
    const total = productPrices.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    totalPriceElement.textContent = `$${total.toFixed(2)}`;
}

// Calcular el total de la cantidad de productos
export function calcularTotalCantidad() {
    const totalQuantityElement = document.getElementById("total-quantity");
    const productQuantities = Array.from(document.querySelectorAll(".card-body > ul > li > .quantity-section > .btn-group > span[id^='quantity-']")).map(quantityElement => parseInt(quantityElement.textContent));
    const total = productQuantities.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    totalQuantityElement.textContent = total.toString();
}


