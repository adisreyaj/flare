
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export interface CreateFlareInput {
    blocks: CreateBlockInput[];
}

export interface UpdateFlareInput {
    likes?: Nullable<string[]>;
}

export interface CreateBlockInput {
    type: string;
    content: string;
    images?: Nullable<Nullable<CreateBlockImageInput>[]>;
}

export interface CreateBlockImageInput {
    name?: Nullable<string>;
    url: string;
}

export interface AddCommentInput {
    flareId: string;
    text: string;
}

export interface AddLikeInput {
    flareId: string;
    reaction: string;
}

export interface RemoveCommentInput {
    flareId: string;
    commentId: string;
}

export interface RemoveLikeInput {
    flareId: string;
    likeId: string;
}

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
    flares(): Nullable<Nullable<Flare>[]> | Promise<Nullable<Nullable<Flare>[]>>;
    flare(id: string): Nullable<Flare> | Promise<Nullable<Flare>>;
    users(): Nullable<Nullable<User>[]> | Promise<Nullable<Nullable<User>[]>>;
    user(id: string): Nullable<User> | Promise<Nullable<User>>;
}

export interface IMutation {
    __typename?: 'IMutation';
    createFlare(input: CreateFlareInput): Nullable<Flare> | Promise<Nullable<Flare>>;
    updateFlare(input: UpdateFlareInput): Nullable<Flare> | Promise<Nullable<Flare>>;
    deleteFlare(id: string): Nullable<Flare> | Promise<Nullable<Flare>>;
    addComment(input: AddCommentInput): Nullable<Flare> | Promise<Nullable<Flare>>;
    addLike(input: AddLikeInput): Nullable<Flare> | Promise<Nullable<Flare>>;
    removeComment(input: RemoveCommentInput): Nullable<Flare> | Promise<Nullable<Flare>>;
    removeLike(input: RemoveLikeInput): Nullable<Flare> | Promise<Nullable<Flare>>;
    createUser(input?: Nullable<CreateUserInput>): Nullable<User> | Promise<Nullable<User>>;
    updateUser(input?: Nullable<UpdateUserInput>): Nullable<User> | Promise<Nullable<User>>;
    deleteUser(id: string): Nullable<User> | Promise<Nullable<User>>;
}

export interface Flare {
    __typename?: 'Flare';
    id: string;
    blocks?: Nullable<Nullable<Block>[]>;
    author?: Nullable<User>;
    deleted?: Nullable<boolean>;
    likes?: Nullable<Nullable<Like>[]>;
    comments?: Nullable<Nullable<Comment>[]>;
    createdAt: string;
}

export interface Comment {
    __typename?: 'Comment';
    id: string;
    text?: Nullable<string>;
    createdAt: string;
}

export interface Block {
    __typename?: 'Block';
    id: string;
    type: string;
    content: string;
    images?: Nullable<Nullable<BlockImage>[]>;
}

export interface BlockImage {
    __typename?: 'BlockImage';
    id: string;
    name?: Nullable<string>;
    url: string;
}

export interface Like {
    __typename?: 'Like';
    id: string;
    reaction: string;
    createdAt: string;
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
    followers?: Nullable<Nullable<User>[]>;
    following?: Nullable<Nullable<User>[]>;
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
