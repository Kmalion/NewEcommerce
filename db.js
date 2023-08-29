import mongoose from 'mongoose'; // Importa la biblioteca de Mongoose


const db = {
    connect: () => {
        return mongoose.connect(process.env.DB_URL, {})
            .then(() => {
                console.log('Conexión a la base de datos Ecommerce exitosa');
            })
            .catch(err => {
                console.error('Error en la conexión a la base de datos:', err);
            });
    }
};

export default db;