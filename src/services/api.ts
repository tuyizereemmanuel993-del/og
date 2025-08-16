const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class ApiService {
  private static getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  private static async handleResponse(response: Response) {
    if (!response.ok) {
      let error;
      try {
        error = await response.json();
      } catch {
        error = { error: `HTTP ${response.status}: ${response.statusText}` };
      }
      throw new Error(error.error || 'Request failed');
    }
    
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    }
    return response.text();
  }

  // Auth endpoints
  static async signIn(email: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/auth/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    const data = await this.handleResponse(response);
    if (data.token) {
      localStorage.setItem('authToken', data.token);
    }
    return data;
  }

  static async signUp(userData: any) {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    
    const data = await this.handleResponse(response);
    if (data.token) {
      localStorage.setItem('authToken', data.token);
    }
    return data;
  }

  // File upload endpoint
  static async uploadFile(file: File) {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      headers: {
        ...this.getAuthHeaders(),
        // Don't set Content-Type for FormData, let browser set it with boundary
      },
      body: formData
    });
    
    return this.handleResponse(response);
  }

  // User endpoints
  static async getUsers() {
    const response = await fetch(`${API_BASE_URL}/users`, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  static async getUserById(id: string) {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  static async updateUser(id: string, updates: any) {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(updates)
    });
    return this.handleResponse(response);
  }

  static async deleteUser(id: string) {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  // Product endpoints
  static async getProducts(farmerId?: string) {
    const url = farmerId 
      ? `${API_BASE_URL}/products?farmerId=${farmerId}`
      : `${API_BASE_URL}/products`;
    
    const response = await fetch(url);
    return this.handleResponse(response);
  }

  static async createProduct(productData: any) {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(productData)
    });
    return this.handleResponse(response);
  }

  static async updateProduct(id: string, updates: any) {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(updates)
    });
    return this.handleResponse(response);
  }

  static async deleteProduct(id: string) {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  // Order endpoints
  static async getOrders(farmerId?: string) {
    const url = farmerId 
      ? `${API_BASE_URL}/orders?farmerId=${farmerId}`
      : `${API_BASE_URL}/orders`;
    
    const response = await fetch(url, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  static async createOrder(orderData: any) {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(orderData)
    });
    return this.handleResponse(response);
  }

  static async updateOrderStatus(id: string, status: string) {
    const response = await fetch(`${API_BASE_URL}/orders/${id}/status`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ status })
    });
    return this.handleResponse(response);
  }
}

export default ApiService;