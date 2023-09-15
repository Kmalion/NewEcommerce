
import PurchaseManagerService from '../services/purchase/purchase.service.js'
import CartsServiceManager from "../services/carts/carts.manager.service.js";

export const purchaseController = async (req, res, next) => {
  try {
    const cartId = req.params.cid;
    const userEmail = req.user.email;
    const cartService = new CartsServiceManager();
    const products = await cartService.getProductsByCartId(cartId);

    if (!products || !products.length) {
      return res.status(404).json({ error: 'No se encontraron productos en el carrito' });
    }

    const purchaseService = new PurchaseManagerService();

    // Crear una lista de productos con sus cantidades
    const productList = products.map(product => ({
      productId: product.product,
      quantity: product.quantity
    }));

    // Realizar la compra
    const ticket = await purchaseService.purchaseProducts(productList, userEmail);
    console.log("Ticket a renderizar", ticket)
    res.render('ticket', {
      code: ticket[0].code,
      purchaser: ticket[0].purchaser,
      amount: ticket[0].amount,
      purchase_datetime: ticket[0].purchase_datetime
  });

    
  } catch (error) {
    console.error('Error al realizar la compra:', error);
    next(error);
  }
};

