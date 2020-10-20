import { Users } from "./users.entity";

export class UserBuilder {

    private readonly _user: Users;

    constructor() {
        this._user = new Users();
    }

    withId (id: number): UserBuilder {
        this._user.id = id;
        return this;
    }

    withUsername (username: string): UserBuilder {
        this._user.username = username;
        return this;
    }

    withPassword (password: string): UserBuilder {
        this._user.password = password;
        return this;
    }

    build (): Users {
        return this._user;
    }

}