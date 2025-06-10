// Base API Service للتعامل مع HTTP requests
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

class ApiService {
    constructor() {
        this.baseURL = API_BASE_URL;
    }

    // الحصول على الـ token من localStorage
    getAuthToken() {
        try {
            const authData = localStorage.getItem('authData');
            if (authData) {
                const parsed = JSON.parse(authData);
                const now = new Date().getTime();

                if (parsed.token && parsed.expiry > now) {
                    return parsed.token;
                }
            }
        } catch (error) {
            console.error('Error getting auth token:', error);
        }
        return null;
    }

    // إعداد الـ headers الأساسية
    getHeaders(includeAuth = true) {
        const headers = {
            'Content-Type': 'application/json',
        };

        if (includeAuth) {
            const token = this.getAuthToken();
            if (token) {
                headers.Authorization = `Bearer ${token}`;
            }
        }

        return headers;
    }

    // معالجة الاستجابة
    async handleResponse(response) {
        if (!response.ok) {
            const error = await response.text();
            let errorMessage;

            try {
                const errorObj = JSON.parse(error);
                errorMessage = errorObj.message || 'حدث خطأ غير متوقع';
            } catch {
                errorMessage = error || 'حدث خطأ في الاتصال';
            }

            // إذا كان الخطأ 401 (Unauthorized)، قم بتسجيل الخروج
            if (response.status === 401) {
                localStorage.removeItem('authData');
                window.location.href = '/login';
            }

            throw new Error(errorMessage);
        }

        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            return await response.json();
        }

        return await response.text();
    }

    // GET request
    async get(endpoint, includeAuth = true) {
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                method: 'GET',
                headers: this.getHeaders(includeAuth),
            });

            return await this.handleResponse(response);
        } catch (error) {
            console.error('GET request failed:', error);
            throw error;
        }
    }

    // POST request
    async post(endpoint, data = null, includeAuth = true) {
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                method: 'POST',
                headers: this.getHeaders(includeAuth),
                body: data ? JSON.stringify(data) : null,
            });

            return await this.handleResponse(response);
        } catch (error) {
            console.error('POST request failed:', error);
            throw error;
        }
    }

    // PUT request
    async put(endpoint, data = null, includeAuth = true) {
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                method: 'PUT',
                headers: this.getHeaders(includeAuth),
                body: data ? JSON.stringify(data) : null,
            });

            return await this.handleResponse(response);
        } catch (error) {
            console.error('PUT request failed:', error);
            throw error;
        }
    }

    // DELETE request
    async delete(endpoint, includeAuth = true) {
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                method: 'DELETE',
                headers: this.getHeaders(includeAuth),
            });

            return await this.handleResponse(response);
        } catch (error) {
            console.error('DELETE request failed:', error);
            throw error;
        }
    }

    // POST request with FormData (for file uploads)
    async postFormData(endpoint, formData, includeAuth = true) {
        try {
            // للملفات، نحتاج headers مختلفة - لا نضع Content-Type
            const headers = {};

            if (includeAuth) {
                const token = this.getAuthToken();
                if (token) {
                    headers.Authorization = `Bearer ${token}`;
                }
            }

            const response = await fetch(`${this.baseURL}${endpoint}`, {
                method: 'POST',
                headers: headers, // بدون Content-Type للـ FormData
                body: formData,
            });

            return await this.handleResponse(response);
        } catch (error) {
            console.error('POST FormData request failed:', error);
            throw error;
        }
    }
}

// إنشاء instance واحد لاستخدامه في كل التطبيق
const apiService = new ApiService();

export default apiService; 