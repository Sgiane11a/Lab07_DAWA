document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('signInForm');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        const toastInstance = M.toast({ html: 'Iniciando sesión...', displayLength: Infinity });

        try {
            const response = await fetch('/api/auth/signIn', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            toastInstance.dismiss();

            if (response.ok) {
                M.toast({ html: '¡Inicio de sesión exitoso!', classes: 'rounded green' });

                sessionStorage.setItem('jwtToken', result.token);

                setTimeout(() => {
                    window.location.href = '/dashboard';
                }, 1000);

            } else {
                const errorMessage = result.message || 'Ocurrió un error inesperado.';
                M.toast({ html: `Error: ${errorMessage}`, classes: 'rounded red' });
            }

        } catch (error) {
            toastInstance.dismiss();
            console.error('Error en el fetch:', error);
            M.toast({ html: 'Ocurrió un error de conexión.', classes: 'rounded red' });
        }
    });
});