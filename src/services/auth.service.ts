import axios, { AxiosError } from 'axios';

const API_URL = 'http://localhost:3001';

export interface User {
  id: number;
  email: string;
  name: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  name: string;
}

class AuthService {
  async login({ email, password }: LoginCredentials): Promise<User> {
    try {
      console.log('Attempting to login with email:', email);
      const response = await axios.get(`${API_URL}/users?email=${email}`);
      console.log('Login response:', response.data);
      
      const users = response.data;

      if (users.length === 0) {
        throw new Error('User not found');
      }

      const user = users[0];
      if (user.password !== password) {
        throw new Error('Invalid password');
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: pass, ...userWithoutPassword } = user;
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      return userWithoutPassword;
    } catch (error) {
      console.error('Login error:', error);
      if (error instanceof AxiosError) {
        if (error.code === 'ECONNREFUSED') {
          throw new Error('Cannot connect to the server. Please make sure json-server is running on port 3000.');
        }
        throw new Error(`Network error: ${error.message}. Please make sure json-server is running.`);
      }
      throw error;
    }
  }

  async register({ email, password, name }: RegisterCredentials): Promise<User> {
    try {
      console.log('Attempting to register with email:', email);
      
      // Check if user already exists
      const existingUsers = await axios.get(`${API_URL}/users?email=${email}`);
      console.log('Existing users check:', existingUsers.data);
      
      if (existingUsers.data.length > 0) {
        throw new Error('User already exists');
      }

      // Create new user
      const response = await axios.post(`${API_URL}/users`, {
        email,
        password,
        name
      });
      console.log('Registration response:', response.data);

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: pass, ...userWithoutPassword } = response.data;
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      return userWithoutPassword;
    } catch (error) {
      console.error('Registration error:', error);
      if (error instanceof AxiosError) {
        if (error.code === 'ECONNREFUSED') {
          throw new Error('Cannot connect to the server. Please make sure json-server is running on port 3000.');
        }
        throw new Error(`Network error: ${error.message}. Please make sure json-server is running.`);
      }
      throw error;
    }
  }

  logout(): void {
    localStorage.removeItem('user');
  }

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    return JSON.parse(userStr);
  }

  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }
}

export const authService = new AuthService(); 