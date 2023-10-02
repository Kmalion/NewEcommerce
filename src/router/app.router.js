import { Router } from "express";
import usersRouter from './sessions/users.router.js'
import profileRouter from './profile/profile.router.js'
import productsRouter from './products/products.router.js'
import cartsRouter from './carts/carts.router.js'
import purchaseRouter from './purchase/purchase.router.js'
import applyPolicy from "../services/policies/auth.middleware.js";
import mailRouter from '../router/mailing/mailing.router.js'

const router = Router()

/// Sesiones ////
router.get('/view/register', usersRouter);
router.get('/', usersRouter);
router.post('/auth/login-auth', usersRouter)
router.post('/auth/register-auth', usersRouter)
router.get('/view/profile', profileRouter);
router.get('/current',applyPolicy(['ADMIN']),usersRouter)


/// Productos ////
router.get('/products', applyPolicy(['ADMIN','USER']), productsRouter);
router.get('/products/create', productsRouter)
router.post('/products/create', applyPolicy(['ADMIN']), productsRouter)
router.get('/product/delete/:pid',applyPolicy(['ADMIN']), productsRouter)

/// Carts /// 

router.get('/api/carts', cartsRouter)
router.post('/api/carts', cartsRouter)
router.get('/cart/add/:productId', cartsRouter)
router.get('/api/carts/:id', cartsRouter)
router.get('/api/carts/:cid/products/:pid', cartsRouter)
router.put('/api/carts/:cid/products/:pid', cartsRouter)

//MAILING///

router.get('/mail', mailRouter)
router.get('/mailrecovery', mailRouter)
router.get('/reset-password',mailRouter)
router.post('/reset-password',mailRouter)
router.post('/mailrecovery', mailRouter)
router.get('/reset-password/:resetToken', mailRouter)
router.post('/reset-password/:resetToken', mailRouter)

// PURCHASE ///
router.get('/api/:cid/purchase', purchaseRouter);
// LOGOUT //
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) res.send('Failed logout');
      res.redirect('/');
    });
  });

export default router
