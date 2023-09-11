
import PurchaseManagerService from '../services/purchase/purchase.service.js'
import CartsServiceManager from "../services/carts/carts.manager.service.js";

export const purchaseController = async (req, res, next) => {
    try {
        const cartId = req.params.cartId
      const cartService = new CartsServiceManager()
      const { productId, quantity } = await cartService.getProductsByCartId(cartId)
      const purchaseService = new PurchaseManagerService();
      const result = await purchaseService.purchaseProducts(productId, quantity);
  
      // Si deseas renderizar una vista, puedes hacerlo aquí
      // res.render('ticket', { ... });
  
      res.json({ message: result }); // Si prefieres enviar una respuesta JSON
    } catch (error) {
      console.error('Error al realizar la compra:', error);
      next(error); // Pasa el error al siguiente middleware de manejo de errores
    }
  };