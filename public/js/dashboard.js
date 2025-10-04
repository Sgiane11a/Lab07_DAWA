document.addEventListener('DOMContentLoaded', async () => {
    M.AutoInit();

    const token = sessionStorage.getItem('jwtToken');

    try {
        const response = await fetch('/api/users/me', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.status === 401 || response.status === 403) {
            sessionStorage.removeItem('jwtToken');
            window.location.href = '/signIn';
            return;
        }

        const user = await response.json();
        
        document.getElementById('userName').textContent = user.name;

        if (user.roles.includes('admin')) {
            const adminLink = document.getElementById('admin-dashboard-link');
            adminLink.style.display = 'block';
        }

    } catch (error) {
        console.error('Error fetching user data:', error);
        M.toast({ html: 'Error al cargar los datos del usuario.', classes: 'rounded red' });
    }

    const logoutButton = document.getElementById('logout-button');
    logoutButton.addEventListener('click', () => {
        sessionStorage.removeItem('jwtToken');
        M.toast({ html: 'Has cerrado la sesión.', classes: 'rounded' });
        setTimeout(() => {
            window.location.href = '/signIn';
        }, 1000);
    });
});