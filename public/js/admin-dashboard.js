document.addEventListener('DOMContentLoaded', async () => {
    M.AutoInit();

    const modals = document.querySelectorAll('.modal');
    M.Modal.init(modals);

    const token = sessionStorage.getItem('jwtToken');
    let users = [];

    function getUserRoles(token) {
        if (!token) return [];
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.roles || [];
        } catch (e) {
            return [];
        }
    }

    const userRoles = getUserRoles(token);
    if (!userRoles.includes('admin')) {
        window.location.href = '/403'; 
        return;
    }

    try {
        const response = await fetch('/api/users', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        users = await response.json(); 
        const tableBody = document.getElementById('users-table-body');
        tableBody.innerHTML = '';

        if (users.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="5" class="center-align">No hay usuarios registrados.</td></tr>';
            return;
        }

        users.forEach(user => {
            const roles = user.roles.map(role => role.name).join(', ');
            const createdAt = new Date(user.createdAt).toLocaleDateString('es-ES', {
                year: 'numeric', month: 'long', day: 'numeric'
            });

            const row = `
                <tr>
                    <td>${user.name} ${user.lastName}</td>
                    <td>${user.email}</td>
                    <td>${roles}</td>
                    <td>${createdAt}</td>
                    <td>
                        <button class="btn-small waves-effect waves-light teal view-details-btn" data-userid="${user._id}">
                            <i class="material-icons">visibility</i>
                        </button>
                    </td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });

    } catch (error) {
        console.error('Error fetching users:', error);
        M.toast({ html: 'No se pudo cargar la lista de usuarios.', classes: 'rounded red' });
        const tableBody = document.getElementById('users-table-body');
        tableBody.innerHTML = '<tr><td colspan="5" class="center-align">Error al cargar datos.</td></tr>';
    }

    const logoutButton = document.getElementById('logout-button');
    logoutButton.addEventListener('click', () => {
        sessionStorage.removeItem('jwtToken');
        M.toast({ html: 'Has cerrado la sesión.', classes: 'rounded' });
        setTimeout(() => window.location.href = '/signIn', 1000);
    });

    const tableBody = document.getElementById('users-table-body');
    tableBody.addEventListener('click', async (e) => {
        const viewButton = e.target.closest('.view-details-btn');
        if (viewButton) {
            const userId = viewButton.dataset.userid;
            const user = users.find(u => u._id === userId);

            if (user) {
                const modalContent = document.getElementById('user-details-content');
                modalContent.innerHTML = `
                    <p><strong>ID:</strong> ${user._id}</p>
                    <p><strong>Nombre Completo:</strong> ${user.name} ${user.lastName}</p>
                    <p><strong>Email:</strong> ${user.email}</p>
                    <p><strong>Teléfono:</strong> ${user.phoneNumber || 'No especificado'}</p>
                    <p><strong>Fecha de Nacimiento:</strong> ${user.birthdate ? new Date(user.birthdate).toLocaleDateString('es-ES') : 'No especificada'}</p>
                    <p><strong>Dirección:</strong> ${user.address || 'No especificada'}</p>
                    <p><strong>Roles:</strong> ${user.roles.map(r => r.name).join(', ')}</p>
                    <p><strong>Miembro desde:</strong> ${new Date(user.createdAt).toLocaleString('es-ES')}</p>
                `;

                const modalInstance = M.Modal.getInstance(document.getElementById('user-details-modal'));
                modalInstance.open();
            }
        }
    });
});