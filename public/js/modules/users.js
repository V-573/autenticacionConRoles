// ==================== USERS MODULE ====================

// Función para cargar todos los usuarios
async function loadUsers() {
    try {
        const users = await apiClient.get(CONFIG.ENDPOINTS.USERS.LIST);
        
        // Verificar que users sea un array
        if (Array.isArray(users)) {
            displayUsers(users);
        } else {
            console.error('La respuesta no es un array:', users);
            displayUsers([]); // Mostrar lista vacía
        }
    } catch (error) {
        console.error('Error al cargar usuarios:', error);
        displayUsers([]); // Mostrar lista vacía en caso de error
    }
}

// Función para mostrar usuarios en el DOM
function displayUsers(users) {
    const tbody = document.getElementById('usersTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';

    users.forEach(user => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${user.username}</td>
            <td>${user.email}</td>
            <td><span class="badge badge-${user.role}">${user.role}</span></td>
            <td>${new Date(user.createdAt).toLocaleDateString()}</td>
            <td>
                <select onchange="changeUserRole('${user._id}', this.value)" style="padding: 5px; border-radius: 5px;">
                    <option value="">Cambiar rol...</option>
                    <option value="free">Free</option>
                    <option value="vip">VIP</option>
                    <option value="admin">Admin</option>
                </select>
                <button onclick="deleteUser('${user._id}')" class="btn btn-danger" style="width: auto; padding: 5px 10px; margin-left: 10px;">Eliminar</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Función para cambiar rol de usuario
async function changeUserRole(userId, newRole) {
    if (!newRole) return;
    
    try {
        const endpoint = CONFIG.ENDPOINTS.USERS.UPDATE_ROLE.replace(':id', userId);
        await apiClient.put(endpoint, { role: newRole });
        
        alert('Rol actualizado exitosamente');
        loadUsers();
    } catch (error) {
        alert('Error al cambiar rol: ' + error.message);
    }
}

// Función para eliminar usuario
async function deleteUser(userId) {
    if (!confirm('¿Estás seguro de eliminar este usuario?')) return;

    try {
        const endpoint = CONFIG.ENDPOINTS.USERS.DELETE.replace(':id', userId);
        await apiClient.delete(endpoint);
        
        alert('Usuario eliminado exitosamente');
        loadUsers();
    } catch (error) {
        alert('Error al eliminar: ' + error.message);
    }
}

// Función para mostrar modal de crear usuario
function showCreateUserModal() {
    const modal = document.getElementById('createUserModal');
    if (modal) {
        modal.classList.add('active');
    }
}

// Función para cerrar modal de crear usuario
function closeCreateUserModal() {
    const modal = document.getElementById('createUserModal');
    if (modal) {
        modal.classList.remove('active');
    }
    const form = document.getElementById('createUserForm');
    if (form) {
        form.reset();
    }
}

// Función para crear usuario
async function createUser() {
    const userData = {
        username: document.getElementById('newUsername').value,
        email: document.getElementById('newEmail').value,
        password: document.getElementById('newPassword').value,
        role: document.getElementById('newRole').value
    };

    try {
        const data = await apiClient.post(CONFIG.ENDPOINTS.USERS.CREATE, userData);
        
        alert('¡Usuario creado exitosamente!');
        closeCreateUserModal();
        loadUsers();
    } catch (error) {
        alert('Error de conexión: ' + error.message);
    }
}

// Exponer funciones globalmente para que puedan ser llamadas desde HTML
window.loadUsers = loadUsers;
window.displayUsers = displayUsers;
window.changeUserRole = changeUserRole;
window.deleteUser = deleteUser;
window.showCreateUserModal = showCreateUserModal;
window.closeCreateUserModal = closeCreateUserModal;
window.createUser = createUser;