import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UsersService {
  private filePath = path.join(__dirname, '../../uploads/users.json');

  constructor() {
    this.ensureFileExists();
  }

  private ensureFileExists() {
    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, JSON.stringify([]), 'utf8');
    }
  }

  private readUsersFromFile(): any[] {
    try {
      const data = fs.readFileSync(this.filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  private writeUsersToFile(users: any[]) {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(users, null, 2), 'utf8');
    } catch (error) {
      throw new HttpException(
        'Error writing to file',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createUser(name: string, password: string) {
    let users = this.readUsersFromFile();

    if (users.find((user) => user.name === name)) {
      throw new HttpException(
        `User with name ${name} already exists`,
        HttpStatus.CONFLICT,
      );
    }

    const newUser = { id: String(users.length + 1), name, password };
    users.push(newUser);
    this.writeUsersToFile(users);

    return newUser;
  }

  async getAllUsers() {
    return this.readUsersFromFile();
  }

  async getSingleUser(id: string) {
    const users = this.readUsersFromFile();
    const user = users.find((user) => user.id === id);

    if (!user) {
      throw new HttpException(`No User Found`, HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async login(name: string, password: string) {
    const users = this.readUsersFromFile();
    const user = users.find((user) => user.name === name);

    if (!user) {
      throw new HttpException(
        `No user found with this name ${name}`,
        HttpStatus.NOT_FOUND,
      );
    }

    if (user.password === password) {
      return user;
    } else {
      throw new HttpException(
        `Invalid credentials (wrong password)`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async updateUser(id: string, name?: string, password?: string) {
    let users = this.readUsersFromFile();
    const userIndex = users.findIndex((user) => user.id === id);

    if (userIndex === -1) {
      throw new HttpException(`No user found`, HttpStatus.NOT_FOUND);
    }

    if (name) users[userIndex].name = name;
    if (password) users[userIndex].password = password;

    this.writeUsersToFile(users);
    return users[userIndex];
  }

  async deleteUserById(id: string) {
    let users = this.readUsersFromFile();
    const userIndex = users.findIndex((user) => user.id === id);

    if (userIndex === -1) {
      throw new HttpException(`User not found`, HttpStatus.NOT_FOUND);
    }

    users.splice(userIndex, 1);
    this.writeUsersToFile(users);

    return { message: 'User successfully deleted' };
  }
}
