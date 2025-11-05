// ==================== UI MODULE ====================

// Función para mostrar alertas
function showAlert(message, type) {
    const alertDiv = document.getElementById('alertMessage');
    if (alertDiv) {
        alertDiv.className = `alert alert-${type}`;
        alertDiv.textContent = message;
        alertDiv.style.display = 'block';
    }
}

// Función para limpiar alertas
function clearAlert() {
    const alertDiv = document.getElementById('alertMessage');
    if (alertDiv) {
        alertDiv.style.display = 'none';
    }
}

// Función para cambiar de tab
function showTab(tabName, clickEvent) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });

    // Show selected tab
    const tabContent = document.getElementById(tabName + 'Content');
    if (tabContent) {
        tabContent.classList.add('active');
    }
    
    // Si se llamó desde un click, activar el tab clickeado
    // Si se llamó programáticamente, buscar el tab correspondiente
    if (clickEvent && clickEvent.target) {
        clickEvent.target.classList.add('active');
    } else {
        // Buscar el botón tab correspondiente por el atributo onclick
        const tabs = document.querySelectorAll('.tab');
        tabs.forEach(tab => {
            if (tab.getAttribute('onclick')?.includes(`'${tabName}'`)) {
                tab.classList.add('active');
            }
        });
    }

    // Load data if needed
    if (tabName === 'users') {
        window.loadUsers();
    } else if (tabName === 'books') {
        window.loadBooks();
    }
}

// Exponer funciones globalmente para que puedan ser llamadas desde HTML
window.showAlert = showAlert;
window.clearAlert = clearAlert;
window.showTab = showTab;