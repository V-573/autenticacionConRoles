    let currentUser = null;
        let authToken = null;
        let isLoginMode = true;



        // funcion toggleAuthMode

        
        function toggleAuthMode() {
            isLoginMode = !isLoginMode;
            const usernameGroup = document.getElementById('usernameGroup');
            const authTitle = document.getElementById('authTitle');
            const authButton = document.getElementById('authButton');
            const switchText = document.getElementById('switchText');
            const switchLink = document.getElementById('switchLink');

            if (isLoginMode) {
                usernameGroup.classList.add('hidden');
                authTitle.textContent = 'Iniciar Sesión';
                authButton.textContent = 'Iniciar Sesión';
                switchText.innerHTML = '¿No tienes cuenta? <a href="#" id="switchLink">Regístrate</a>';
            } else {
                usernameGroup.classList.remove('hidden');
                authTitle.textContent = 'Registrarse';
                authButton.textContent = 'Registrarse';
                switchText.innerHTML = '¿Ya tienes cuenta? <a href="#" id="switchLink">Inicia Sesión</a>';
            }
            
            document.getElementById('switchLink').addEventListener('click', (e) => {
                e.preventDefault();
                toggleAuthMode();
            });
            
            clearAlert();
        }

        // Función login adaptada
async function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const data = await apiClient.post(CONFIG.ENDPOINTS.AUTH.LOGIN, {
            email, 
            password
        });
        
        // Guardar token y usuario
        authToken = data.token;
        currentUser = data.user;
        
        // ¡IMPORTANTE! Actualizar también las variables globales
        window.authToken = data.token;
        window.currentUser = data.user;
        
        showAlert('¡Login exitoso!', 'success');
        setTimeout(() => {
            showApp();
        }, 1000);
    } catch (error) {
        showAlert('Error: ' + error.message, 'error');
    }
}



// funcion register adaptada

  async function register() {
            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const data = await apiClient.post(CONFIG.ENDPOINTS.AUTH.REGISTER, {
                    username, 
                    email, 
                    password  
                });

                // const data = await response.json();

                if (!data.ok) {
                    showAlert(data.error, 'error');
                    return;
                }

                showAlert('¡Registro exitoso! Ahora puedes iniciar sesión', 'success');
                setTimeout(() => {
                    toggleAuthMode();
                    document.getElementById('email').value = email;
                }, 1500);
            } catch (error) {
                showAlert('Error de conexión: ' + error.message, 'error');
            }
        }



        // funcion logout adaptada
function logout() {
            authToken = null;
            currentUser = null;
            // Limpiar TODAS las variables globales
            window.authToken = null; 
            window.currentUser = null;
            document.getElementById('authScreen').classList.remove('hidden');
            document.getElementById('appScreen').classList.add('hidden');
            document.getElementById('authForm').reset();
        }



        // funcion showApp

            function showApp() {
            document.getElementById('authScreen').classList.add('hidden');
            document.getElementById('appScreen').classList.remove('hidden');
            
            document.getElementById('welcomeText').textContent = `Hola, ${currentUser.username}`;
            
            const roleBadge = document.getElementById('roleBadge');
            roleBadge.textContent = currentUser.role;
            roleBadge.className = `badge badge-${currentUser.role}`;
            
            // Show admin tabs
            if (currentUser.role === 'admin') {
                document.getElementById('usersTab').style.display = 'block';
                document.getElementById('addBookTab').style.display = 'block';
            }
            
            loadBooks();
        }

        // Exponer funciones globalmente para que puedan ser llamadas desde HTML
        window.toggleAuthMode = toggleAuthMode;
        window.login = login;
        window.register = register;
        window.logout = logout;
        window.showApp = showApp;
        
        // Exponer variables globales (inicializar correctamente)
        window.currentUser = currentUser;
        window.authToken = authToken;
        window.isLoginMode = isLoginMode;
        
        // Debug: verificar que se expusieron correctamente
        console.log('Variables globales inicializadas:', {
            currentUser: window.currentUser,
            authToken: window.authToken,
            isLoginMode: window.isLoginMode
        });
