


export const registerController = (req, res) => {
    console.log('Messages en /view/register:', req.flash('error'));
    res.render('register', {
        ErrorMessages: req.flash('error'),
        successMessages: req.flash('success')
    });
};