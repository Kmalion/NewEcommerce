

export const profileController = ('/view/profile', (req, res) => {
    res.render('profile', {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        email: req.user.email,
        age: req.user.age,
        role: req.user.role
    });
});

export const profileSummaryController = async (req, res) => {
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
        } else {
            userLoggedIn = {
                username: req.user.username,
                githubId: req.user.githubId,
            };
        }

        // Aquí puedes hacer lo que necesites con userLoggedIn

        // Por ejemplo, enviarlo como respuesta JSON
        res.status(200).json(userLoggedIn);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ha ocurrido un error en el servidor' });
    }
};
