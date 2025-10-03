import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

interface User {
  id: { $oid: string };
  name: string;
  lastName: string;
  email: string;
  phone: string | null;
  isActive: boolean;
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
      console.log(`Loaded ${this.users.length} users from DB.json`);
    } catch (error) {
      console.error('Error loading users:', error);
      this.users = [];
    }
  }

  getUsers(params: GetUsersParams) {
    let filteredUsers = [...this.users];

    // Apply search filter
    if (params.search) {
      const searchLower = params.search.toLowerCase();
      filteredUsers = filteredUsers.filter(
        (user) =>
          user.name?.toLowerCase().includes(searchLower) ||
          user.lastName?.toLowerCase().includes(searchLower) ||
          user.email?.toLowerCase().includes(searchLower) ||
          user.phone?.includes(params.search)
      );
    }

    // Apply active filter
    if (params.isActive !== undefined) {
      filteredUsers = filteredUsers.filter(
        (user) => user.isActive === params.isActive
      );
    }

    // Calculate pagination
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

  // Method to get all users without pagination (for testing)
  getAllUsers() {
    return this.users;
  }

  // Get user by ID
  getUserById(id: string) {
    const user = this.users.find(u => u.id && u.id.$oid === id);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  // Create new user
  createUser(userData: Omit<User, 'id'>) {
    const newUser: User = {
      id: { $oid: this.generateId() },
      name: userData.name,
      lastName: userData.lastName,
      email: userData.email,
      phone: userData.phone,
      isActive: userData.isActive ?? true,
    };

    this.users.push(newUser);
    this.saveUsers();
    return newUser;
  }

  // Update user
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

  // Deactivate user (soft delete)
  deactivateUser(id: string) {
    return this.updateUser(id, { isActive: false });
  }

  // Activate user
  activateUser(id: string) {
    return this.updateUser(id, { isActive: true });
  }

  // Helper methods
  private generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  private saveUsers() {
    try {
      const dbPath = path.join(process.cwd(), 'DB.json');
      fs.writeFileSync(dbPath, JSON.stringify(this.users, null, 2));
      console.log('Users saved to DB.json');
    } catch (error) {
      console.error('Error saving users:', error);
    }
  }
}