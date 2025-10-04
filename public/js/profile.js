document.addEventListener('DOMContentLoaded', async () => {
    M.AutoInit();

    const token = sessionStorage.getItem('jwtToken');
    const viewSection = document.getElementById('view-profile-section');
    const editSection = document.getElementById('edit-profile-section');
    const editForm = document.getElementById('edit-profile-form');

    let currentUserData = {}; // Variable para guardar los datos actuales

    // --- FUNCIONES AUXILIARES ---
    function renderViewProfile(user) {
        viewSection.innerHTML = `
            <p><strong>Nombre:</strong> ${user.name || 'No especificado'}</p>
            <p><strong>Apellido:</strong> ${user.lastName || 'No especificado'}</p>
            <p><strong>Email:</strong> ${user.email || 'No especificado'}</p>
            <p><strong>Teléfono:</strong> ${user.phoneNumber || 'No especificado'}</p>
            <p><strong>Fecha de Nacimiento:</strong> ${user.birthdate ? new Date(user.birthdate).toLocaleDateString('es-ES') : 'No especificada'}</p>
            <p><strong>Roles:</strong> ${user.roles ? user.roles.join(', ') : 'No especificado'}</p>
            <p><strong>Dirección:</strong> ${user.address || 'No especificada'}</p>
        `;
    }

    function populateEditForm(user) {
        document.getElementById('name').value = user.name || '';
        document.getElementById('lastName').value = user.lastName || '';
        document.getElementById('phoneNumber').value = user.phoneNumber || '';
        document.getElementById('address').value = user.address || '';
        M.updateTextFields(); // Importante para que los labels de Materialize se muevan
    }

    // --- CARGA INICIAL DE DATOS ---
    try {
        const response = await fetch('/api/users/me', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Error al obtener datos.');

        currentUserData = await response.json();
        renderViewProfile(currentUserData);
        populateEditForm(currentUserData);

        if (currentUserData.roles && currentUserData.roles.includes('admin')) {
            document.getElementById('admin-dashboard-link').style.display = 'block';
        }
    } catch (error) {
        viewSection.innerHTML = `<p class="red-text">No se pudo cargar la información del perfil.</p>`;
    }

    document.getElementById('edit-profile-button').addEventListener('click', () => {
        viewSection.style.display = 'none';
        editSection.style.display = 'block';
    });

    document.getElementById('cancel-edit-button').addEventListener('click', () => {
        viewSection.style.display = 'block';
        editSection.style.display = 'none';
    });

    editForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(editForm);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch('/api/users/me', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) throw new Error('Error al actualizar.');

            const updatedUser = await response.json();
            currentUserData = updatedUser;
            
            renderViewProfile(currentUserData);
            populateEditForm(currentUserData);

            M.toast({ html: '¡Perfil actualizado con éxito!', classes: 'green' });
            viewSection.style.display = 'block';
            editSection.style.display = 'none';

        } catch (error) {
            M.toast({ html: 'No se pudo actualizar el perfil.', classes: 'red' });
        }
    });

    document.getElementById('logout-button').addEventListener('click', () => {
        sessionStorage.removeItem('jwtToken');
        window.location.href = '/signIn';
    });
});