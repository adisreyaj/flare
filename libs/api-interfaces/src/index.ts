
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export interface UserBioInput {
    id?: Nullable<string>;
    description?: Nullable<string>;
    github?: Nullable<string>;
    twitter?: Nullable<string>;
    linkedin?: Nullable<string>;
    facebook?: Nullable<string>;
    hashnode?: Nullable<string>;
    devto?: Nullable<string>;
}

export interface CreateUserInput {
    firstName: string;
    image?: Nullable<string>;
    lastName: string;
    email: string;
    password: string;
    bio?: Nullable<UserBioInput>;
}

export interface UpdateUserInput {
    id: string;
    image?: Nullable<string>;
    firstName?: Nullable<string>;
    lastName?: Nullable<string>;
    password?: Nullable<string>;
    bio?: Nullable<UserBioInput>;
}

export interface IQuery {
    __typename?: 'IQuery';
    users(): Nullable<Nullable<User>[]> | Promise<Nullable<Nullable<User>[]>>;
    user(id: string): Nullable<User> | Promise<Nullable<User>>;
}

export interface IMutation {
    __typename?: 'IMutation';
    createUser(input?: Nullable<CreateUserInput>): Nullable<User> | Promise<Nullable<User>>;
    updateUser(input?: Nullable<UpdateUserInput>): Nullable<User> | Promise<Nullable<User>>;
    deleteUser(id: string): Nullable<User> | Promise<Nullable<User>>;
}

export interface User {
    __typename?: 'User';
    id: string;
    image?: Nullable<string>;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    bio?: Nullable<UserBio>;
}

export interface UserBio {
    __typename?: 'UserBio';
    id: string;
    description?: Nullable<string>;
    github?: Nullable<string>;
    twitter?: Nullable<string>;
    linkedin?: Nullable<string>;
    facebook?: Nullable<string>;
    hashnode?: Nullable<string>;
    devto?: Nullable<string>;
}

type Nullable<T> = T | null;
