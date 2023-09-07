import { Router } from "express";
import usersRouter from './sessions/users.router.js'
import profileRouter from './profile/profile.router.js'
import productsRouter from './products/products.router.js'
import cartsRouter from './carts/carts.router.js'



const router = Router()

/// Sesiones ////
router.get('/view/register', usersRouter);
router.get('/', usersRouter);
router.post('/auth/login-auth', usersRouter)
router.post('/auth/register-auth', usersRouter)
router.get('/view/profile', profileRouter);


/// Productos ////
router.get('/products',  productsRouter);

/// Carts /// 

router.get('/api/carts', cartsRouter)
router.post('/api/carts', cartsRouter)
router.get('/cart/add/:productId', cartsRouter)
router.get('/api/carts/:id', cartsRouter)
router.delete('/api/carts/:cid/products/:pid', cartsRouter)
router.put('/api/carts/:cid/products/:pid', cartsRouter)

// LOGOUT //
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) res.send('Failed logout');
      res.redirect('/');
    });
  });

export default router
