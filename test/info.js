export const createProductError = (product)=>{
    return `Las propiedades no estan completas
    El titulo es obligatorio ${product.title}
    La categoria es obligatoria ${product.category}
    La descripcion es obligatoria ${product.description}
    El precio es obligatorio ${product.price}
    La direccion URL de la imagen es obligatoria ${product.thumbnail}
    El codigo es obligatorio ${product.code}
    El estado es obligatorio ${product.status}
    El stock es obligatorio ${product.stock}`
}