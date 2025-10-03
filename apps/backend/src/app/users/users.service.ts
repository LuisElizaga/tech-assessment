import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

interface User {
  id: { $oid: string };
  name: string;
  lastName: string;
  username: string;
  email: string;
  phone: string | null;
  isActive: boolean;
  photo?: string;
}

interface GetUsersParams {
  page: number;
  limit: number;
  search?: string;
  isActive?: boolean;
}

@Injectable()
export class UsersService {
  private users: User[] = [];

  constructor() {
    this.loadUsers();
  }

  private loadUsers() {
    try {
      const dbPath = path.join(process.cwd(), 'DB.json');
      const fileContent = fs.readFileSync(dbPath, 'utf-8');
      this.users = JSON.parse(fileContent);
      // Usuarios cargados correctamente
    } catch (error) {
      // Error al cargar usuarios
      this.users = [];
    }
  }

  getUsers(params: GetUsersParams) {
    let filteredUsers = [...this.users];

    // Aplicar filtro de búsqueda
    if (params.search) {
      const searchLower = params.search.toLowerCase();
      filteredUsers = filteredUsers.filter(
        (user) =>
          user.name?.toLowerCase().includes(searchLower) ||
          user.lastName?.toLowerCase().includes(searchLower) ||
          user.username?.toLowerCase().includes(searchLower) ||
          user.email?.toLowerCase().includes(searchLower) ||
          user.phone?.includes(params.search)
      );
    }

    // Aplicar filtro de estado activo
    if (params.isActive !== undefined) {
      filteredUsers = filteredUsers.filter(
        (user) => user.isActive === params.isActive
      );
    }

    // Calcular paginación
    const totalItems = filteredUsers.length;
    const totalPages = Math.ceil(totalItems / params.limit);
    const startIndex = (params.page - 1) * params.limit;
    const endIndex = startIndex + params.limit;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

    return {
      data: paginatedUsers,
      metadata: {
        page: params.page,
        limit: params.limit,
        totalItems,
        totalPages,
        hasNextPage: params.page < totalPages,
        hasPrevPage: params.page > 1,
      },
    };
  }

  // Método para obtener todos los usuarios sin paginación
  getAllUsers() {
    return this.users;
  }

  // Obtener usuario por ID
  getUserById(id: string) {
    const user = this.users.find(u => u.id && u.id.$oid === id);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  // Crear nuevo usuario
  createUser(userData: Omit<User, 'id'>) {
    const username = userData.username || this.generateUsername(userData.name, userData.lastName);

    const newUser: User = {
      id: { $oid: this.generateId() },
      name: userData.name,
      lastName: userData.lastName,
      username: username,
      email: userData.email,
      phone: userData.phone,
      isActive: userData.isActive ?? true,
      photo: userData.photo,
    };

    this.users.push(newUser);
    this.saveUsers();
    return newUser;
  }

  // Actualizar usuario
  updateUser(id: string, userData: Partial<Omit<User, 'id'>>) {
    const userIndex = this.users.findIndex(u => u.id && u.id.$oid === id);
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    this.users[userIndex] = {
      ...this.users[userIndex],
      ...userData,
    };

    this.saveUsers();
    return this.users[userIndex];
  }

  // Desactivar usuario (eliminación lógica)
  deactivateUser(id: string) {
    return this.updateUser(id, { isActive: false });
  }

  // Activar usuario
  activateUser(id: string) {
    return this.updateUser(id, { isActive: true });
  }

  // Métodos auxiliares
  private generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  private generateUsername(name: string, lastName: string): string {
    if (!name || !lastName) return '';

    const firstLetter = name.charAt(0).toUpperCase();
    const firstLastName = lastName.split(' ')[0]; // Tomar primera palabra del apellido

    return firstLetter + firstLastName;
  }

  private addUsernamesToExistingUsers() {
    let needsSave = false;
    let count = 0;

    this.users.forEach(user => {
      if (!user.username && user.name && user.lastName) {
        (user as any).username = this.generateUsername(user.name, user.lastName);
        needsSave = true;
        count++;
      }
    });

    // Se encontraron usuarios sin username

    if (needsSave) {
      this.saveUsers();
      // Usernames generados para usuarios existentes
    } else {
      // Todos los usuarios ya tienen username
    }
  }

  private saveUsers() {
    try {
      const dbPath = path.join(process.cwd(), 'DB.json');
      fs.writeFileSync(dbPath, JSON.stringify(this.users, null, 2));
      // Usuarios guardados correctamente
    } catch (error) {
      // Error al guardar usuarios
    }
  }
}