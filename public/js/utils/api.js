// js/utils/api.js - Cliente para peticiones HTTP

const apiClient = {
    
    // Método para obtener headers con token si existe
    getHeaders() {
        const headers = {
            'Content-Type': 'application/json'
        };
        
        // Si hay token, agregarlo al header
        if (window.authToken) {
            headers.Authorization = `Bearer ${window.authToken}`;
        }
        
        return headers;
    },

    // GET request
    async get(endpoint) {
        try {
            const response = await fetch(`${CONFIG.API_URL}${endpoint}`, {
                method: 'GET',
                headers: this.getHeaders()
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || `HTTP ${response.status}`);
            }

            return data;
        } catch (error) {
            console.error('GET Error:', error);
            throw error;
        }
    },

    // POST request
    async post(endpoint, body) {
        try {
            const response = await fetch(`${CONFIG.API_URL}${endpoint}`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify(body)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || `HTTP ${response.status}`);
            }

            return data;
        } catch (error) {
            console.error('POST Error:', error);
            throw error;
        }
    },

    // PUT request  
    async put(endpoint, body) {
        try {
            const response = await fetch(`${CONFIG.API_URL}${endpoint}`, {
                method: 'PUT',
                headers: this.getHeaders(),
                body: JSON.stringify(body)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || `HTTP ${response.status}`);
            }

            return data;
        } catch (error) {
            console.error('PUT Error:', error);
            throw error;
        }
    },

    // DELETE request
    async delete(endpoint) {
        try {
            const response = await fetch(`${CONFIG.API_URL}${endpoint}`, {
                method: 'DELETE',
                headers: this.getHeaders()
            });

            // DELETE puede no devolver JSON
            if (response.ok) {
                // Intentar obtener JSON, si no hay contenido, devolver success
                try {
                    return await response.json();
                } catch {
                    return { success: true };
                }
            } else {
                const data = await response.json();
                throw new Error(data.error || `HTTP ${response.status}`);
            }
        } catch (error) {
            console.error('DELETE Error:', error);
            throw error;
        }
    }
};

// Hacer disponible globalmente
window.apiClient = apiClient;