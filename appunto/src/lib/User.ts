import { ObjectId } from 'mongodb';
import bcrypt from 'bcrypt';

export const INVALID_EMAIL = "INVALID_EMAIL"    // placeholder for invalid or missing emails

export enum Roles {
    User = 0,
    Super = 1,
    Admin = 2
}

export function hashPassword(password: string): string {
    const saltRounds = 10;
    return bcrypt.hashSync(password, saltRounds);
}

function checkEmail(email: string): string {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(email)) {
        return INVALID_EMAIL
    }

    return email;
}

export class User {
    username: string;
    private password: string;
    email: string;
    isActive: boolean = false;
    role: Roles = Roles.User;
    publications: ObjectId[] = [];
    correspondents: ObjectId[] = [];
    circles: ObjectId[] = [];

    public constructor(_username: string, _password: string, _email:string){
        this.username = _username.toUpperCase();
        this.password = hashPassword(_password);
        this.email = checkEmail(_email);
        this.isActive = true;
    }

    public activateUser() {
        this.isActive = true;
    }

    public deactivateUser() {
        this.isActive = false;
    }

    public login(_password: string): boolean {
        if(hashPassword(_password) === this.password) {
            return true;
        }

        return false;
    }

    public changePassword(_oldPassword: string, _newPassword: string): boolean {
        if(hashPassword(_oldPassword) === this.password){
            this.password = hashPassword(_newPassword);
            return true;
        }

        return false;
    }
}