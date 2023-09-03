export const profileController = ('/view/profile', (req, res, next) => {
    try {
        res.render('profile', {
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            email: req.user.email,
            age: req.user.age,
            role: req.user.role
        });
    } catch (error) {
        console.error(error);
        next(error); // Pasa el error al siguiente middleware de manejo de errores
    }
});

export const profileSummaryController = async (req, res, next) => {
    try {
        let userLoggedIn = {};

        if (req.user.email) {
            userLoggedIn = {
                first_name: req.user.first_name,
                last_name: req.user.last_name,
                email: req.user.email,
                age: req.user.age,
                role: req.user.role
            };
            res.render('home', {
                first_name: req.user.first_name,
                last_name: req.user.last_name,
                email: req.user.email,
                age: req.user.age,
                role: req.user.role
            });
        } else {
            userLoggedIn = {
                username: req.user.username,
                githubId: req.user.githubId,
            };
            res.render('home', {
                username: req.user.username,
                githubId: req.user.githubId,
            });
        }

        res.status(200).json(userLoggedIn);
    } catch (error) {
        console.error(error);
        next(error); // Pasa el error al siguiente middleware de manejo de errores
    }
};
