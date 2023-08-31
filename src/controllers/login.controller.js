
export const loginController = (req, res) => {
    res.render('login', {
        ErrorMessages: req.flash('error'),
        successMessages: req.flash('success')
    });
};