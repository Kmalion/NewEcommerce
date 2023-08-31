

export const registerController = (req, res) => {
    res.render('register', {
        ErrorMessages: req.flash('error'),
        successMessages: req.flash('success')
    });
};