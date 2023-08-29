
function handleRegisterForm() {
    const registerForm = document.getElementById('registerForm');
    const errorMessageElement = document.querySelector('.error');

    registerForm.addEventListener('submit', async (event) => {
        const registerForm = document.getElementById('registerForm');
        const errorMessageElement = document.querySelector('.error');
        const successMessageElement = document.querySelector('.success_msg');

        registerForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const formData = {
                first_name: document.getElementById('first_name').value,
                last_name: document.getElementById('last_name').value,
                email: document.getElementById('email').value,
                age: document.getElementById('age').value,
                password: document.getElementById('password').value,
                role: document.getElementById('role').value
            };

            console.log(formData); // Imprime el objeto con los datos del formulario en la consola

            try {
                const response = await fetch('/auth/register-auth', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData) // Envía los datos como JSON al servidor
                });

                if (response.ok) {
                    // Si el registro es exitoso, redirige al usuario a la página de inicio de sesión

                    window.location.href = '/view/login';
                } else {
                    // Si hay un error, muestra el mensaje de error en el formulario
                    const errorMessage = await response.text();
                    console.log('Mensaje de error plantilla:', errorMessage);
                    errorMessageElement.innerHTML = `<p>${errorMessage}</p>`; // Muestra el mensaje de error en el elemento HTML
                }

            } catch (error) {
                console.error('Error al enviar el formulario:', error);
                alert('Error al enviar el formulario');
            }
        });
    });
}
handleRegisterForm();