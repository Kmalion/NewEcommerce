const applyPolicy = (roles) => {
    return (req, res, next) => {
        if (roles[0].toUpperCase() === 'PUBLIC') return next();
        if (!req.user) return res.status(401).send({ status: 'error', error: "No autenticado" });

        const { role, email } = req.user;

        if (role === 'admin') {
            return next(); // El admin tiene permisos
        } else if (role === 'premium') {
            if (roles.includes('premium')) {
                // Si se requiere el rol "premium" en la política
                const ownerId = req.params.ownerId; // Suponiendo que el ownerId está en los parámetros
                if (ownerId === email) {
                    return next(); // El usuario premium es el propietario del recurso
                } else {
                    return res.status(403).send({ status: 'error', error: "No tienes permisos para acceder a este recurso" });
                }
            } else {
                return next(); // El usuario premium no necesita el rol específico
            }
        } else {
            return res.status(403).send({ status: 'error', error: "No tienes permisos para acceder a este recurso" });
        }
    };
};

export default applyPolicy;
