import PurchaseManagerService from '../services/purchase/purchase.service.js';
import CartsServiceManager from "../services/carts/carts.manager.service.js";
import MailService from '../services/mailing/mailing.service.js'; // Asegúrate de importar el servicio de correo

export const purchaseController = async (req, res, next) => {
  try {
    const cartId = req.params.cid;
    const userEmail = req.user.email;
    const userId = req.user.id;
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

    // Envía el correo electrónico de confirmación
    const mailService = new MailService();
    const purchaseDetails = {
      products: ticket, // Utiliza el ticket o ajusta según sea necesario
      total: ticket.reduce((total, product) => total + product.amount, 0), // Calcula el total basado en el ticket
    };
    console.log("Datos de la compra", purchaseDetails)
    await mailService.sendPurchaseConfirmationMail(userEmail, purchaseDetails,  productList);

    // Eliminar el carrito después de completar la compra
    const result = await cartService.deleteCart(userId);


    // Renderiza la vista del ticket (puedes ajustar esto según tu aplicación)
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
