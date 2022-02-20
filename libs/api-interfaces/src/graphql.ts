
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export enum PromoState {
    PENDING = "PENDING",
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    REJECTED = "REJECTED"
}

export enum NotificationType {
    FOLLOW = "FOLLOW",
    REACTION = "REACTION",
    COMMENT = "COMMENT",
    FLARE = "FLARE"
}

export enum SponsoringType {
    ONE_TIME = "ONE_TIME",
    MONTHLY = "MONTHLY",
    ANNUALLY = "ANNUALLY"
}

export enum HeaderType {
    DEFAULT = "DEFAULT",
    PROMO = "PROMO"
}

export interface CurrencyInput {
    symbol: string;
    code: string;
}

export interface CreateFlareInput {
    blocks: CreateBlockInput[];
    jobId?: Nullable<string>;
}

export interface CreateBlockInput {
    type: string;
    content: JSON;
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

export interface HeaderPromoInput {
    title: string;
    userId: string;
    description?: Nullable<string>;
    price: JSON;
}

export interface HeaderPromoUpdateInput {
    title?: Nullable<string>;
    description?: Nullable<string>;
    price?: Nullable<JSON>;
}

export interface NotificationInput {
    to: string;
    type: NotificationType;
    followee?: Nullable<string>;
    comment?: Nullable<string>;
    flare?: Nullable<string>;
    read?: Nullable<boolean>;
    content?: Nullable<JSON>;
}

export interface SponsorInput {
    type: SponsoringType;
    amount: number;
    currency: CurrencyInput;
    user: string;
    paymentDetails: PaymentDetailsInput;
}

export interface PaymentDetailsInput {
    type: string;
}

export interface TipInput {
    amount: number;
    note?: Nullable<string>;
    currency: CurrencyInput;
    user: string;
    flare: string;
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
    image?: Nullable<string>;
    firstName?: Nullable<string>;
    username?: Nullable<string>;
    lastName?: Nullable<string>;
    password?: Nullable<string>;
    bio?: Nullable<UserBioInput>;
    preferences?: Nullable<UserPreferencesInput>;
}

export interface UserBioInput {
    id?: Nullable<string>;
    description?: Nullable<string>;
    github?: Nullable<string>;
    twitter?: Nullable<string>;
    linkedin?: Nullable<string>;
    facebook?: Nullable<string>;
    hashnode?: Nullable<string>;
    instagram?: Nullable<string>;
    devto?: Nullable<string>;
}

export interface UserPreferencesInput {
    kudos?: Nullable<JSON>;
    blogs?: Nullable<JSON>;
    header?: Nullable<JSON>;
}

export interface PreferenceKudosInput {
    enabled: boolean;
}

export interface PreferenceBlogsInput {
    enabled: boolean;
}

export interface PreferenceHeaderInput {
    enabled: boolean;
    type: HeaderType;
    image?: Nullable<JSON>;
}

export interface GiveKudosInput {
    userId: string;
    content: JSON;
}

export interface Currency {
    __typename?: 'Currency';
    symbol: string;
    code: string;
}

export interface Success {
    __typename?: 'Success';
    success: boolean;
}

export interface IQuery {
    __typename?: 'IQuery';
    flares(): Nullable<Nullable<Flare>[]> | Promise<Nullable<Nullable<Flare>[]>>;
    popularFlares(): Nullable<Nullable<Flare>[]> | Promise<Nullable<Nullable<Flare>[]>>;
    flare(id: string): Nullable<Flare> | Promise<Nullable<Flare>>;
    bookmarkedFlares(): Nullable<Nullable<Flare>[]> | Promise<Nullable<Nullable<Flare>[]>>;
    allHeaderPromos(): Nullable<Nullable<HeaderPromo>[]> | Promise<Nullable<Nullable<HeaderPromo>[]>>;
    headerPromoById(id: string): Nullable<HeaderPromo> | Promise<Nullable<HeaderPromo>>;
    notifications(): Notification[] | Promise<Notification[]>;
    sponsors(): Nullable<Nullable<Sponsor>[]> | Promise<Nullable<Nullable<Sponsor>[]>>;
    sponsor(id: string): Nullable<Sponsor> | Promise<Nullable<Sponsor>>;
    mySponsors(): Nullable<Nullable<Sponsor>[]> | Promise<Nullable<Nullable<Sponsor>[]>>;
    tips(): Nullable<Nullable<Tip>[]> | Promise<Nullable<Nullable<Tip>[]>>;
    tip(id: string): Nullable<Tip> | Promise<Nullable<Tip>>;
    users(): Nullable<Nullable<User>[]> | Promise<Nullable<Nullable<User>[]>>;
    user(id: string): Nullable<User> | Promise<Nullable<User>>;
    userByUsername(username: string): Nullable<User> | Promise<Nullable<User>>;
    me(): Nullable<User> | Promise<Nullable<User>>;
    getTopUsers(): Nullable<Nullable<User>[]> | Promise<Nullable<Nullable<User>[]>>;
    isUsernameAvailable(username: string): Nullable<UserNameAvailability> | Promise<Nullable<UserNameAvailability>>;
}

export interface IMutation {
    __typename?: 'IMutation';
    createFlare(input: CreateFlareInput): Nullable<Flare> | Promise<Nullable<Flare>>;
    deleteFlare(id: string): Nullable<Flare> | Promise<Nullable<Flare>>;
    addComment(input: AddCommentInput): Nullable<Flare> | Promise<Nullable<Flare>>;
    addLike(input: AddLikeInput): Nullable<Flare> | Promise<Nullable<Flare>>;
    removeComment(input: RemoveCommentInput): Nullable<Flare> | Promise<Nullable<Flare>>;
    removeLike(input: RemoveLikeInput): Nullable<Flare> | Promise<Nullable<Flare>>;
    bookmark(flareId: string): Nullable<Bookmark> | Promise<Nullable<Bookmark>>;
    removeBookmark(id: string): Nullable<Success> | Promise<Nullable<Success>>;
    createHeaderPromo(input: HeaderPromoInput, jobId: string): Nullable<HeaderPromo> | Promise<Nullable<HeaderPromo>>;
    updateHeaderPromo(id: string, input: HeaderPromoUpdateInput, jobId?: Nullable<string>): Nullable<HeaderPromo> | Promise<Nullable<HeaderPromo>>;
    deleteHeaderPromo(id: string): Nullable<HeaderPromo> | Promise<Nullable<HeaderPromo>>;
    applyHeaderPromo(id: string): Nullable<Success> | Promise<Nullable<Success>>;
    sponsor(input?: Nullable<SponsorInput>): Nullable<Sponsor> | Promise<Nullable<Sponsor>>;
    cancelSponsorship(id: string): Nullable<Sponsor> | Promise<Nullable<Sponsor>>;
    tip(input?: Nullable<TipInput>): Nullable<Tip> | Promise<Nullable<Tip>>;
    createUser(input?: Nullable<CreateUserInput>): Nullable<User> | Promise<Nullable<User>>;
    updateUser(input?: Nullable<UpdateUserInput>): Nullable<User> | Promise<Nullable<User>>;
    completeProfile(input?: Nullable<UpdateUserInput>): Nullable<User> | Promise<Nullable<User>>;
    completeOnboarding(): Nullable<Success> | Promise<Nullable<Success>>;
    deleteUser(id: string): Nullable<User> | Promise<Nullable<User>>;
    follow(userId: string): Nullable<User> | Promise<Nullable<User>>;
    unfollow(userId: string): Nullable<User> | Promise<Nullable<User>>;
    giveKudos(input?: Nullable<GiveKudosInput>): Nullable<User> | Promise<Nullable<User>>;
    removeKudos(id: string): Nullable<User> | Promise<Nullable<User>>;
}

export interface Flare {
    __typename?: 'Flare';
    id: string;
    blocks: Block[];
    author: User;
    deleted?: Nullable<boolean>;
    tags: string;
    likes: Like[];
    bookmarks: Bookmark[];
    _count?: Nullable<JSON>;
    comments: Nullable<Comment>[];
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
    content: JSON;
}

export interface Like {
    __typename?: 'Like';
    id: string;
    reaction: string;
    createdAt: string;
    author: User;
}

export interface Bookmark {
    __typename?: 'Bookmark';
    id: string;
    flare: Flare;
    author: User;
    createdAt: string;
}

export interface HeaderPromo {
    __typename?: 'HeaderPromo';
    id: string;
    title: string;
    description: string;
    image: JSON;
    createdAt: string;
    user: User;
    sponsor: User;
    price: JSON;
    state?: Nullable<PromoState>;
}

export interface Notification {
    __typename?: 'Notification';
    id: string;
    to: User;
    type: NotificationType;
    followee?: Nullable<User>;
    comment?: Nullable<Comment>;
    flare?: Nullable<Flare>;
    content?: Nullable<JSON>;
    createdAt: string;
    read: boolean;
}

export interface Sponsor {
    __typename?: 'Sponsor';
    id: string;
    type: SponsoringType;
    amount: number;
    currency: Currency;
    user: User;
    sponsoredBy: User;
    createdAt: string;
}

export interface Tip {
    __typename?: 'Tip';
    id: string;
    amount: number;
    note?: Nullable<string>;
    currency: Currency;
    tippedBy: User;
    user: User;
    createdAt: string;
    flare: Flare;
}

export interface User {
    __typename?: 'User';
    id: string;
    image?: Nullable<string>;
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    password?: Nullable<string>;
    bio?: Nullable<UserBio>;
    _count?: Nullable<JSON>;
    followers?: Nullable<Nullable<User>[]>;
    following?: Nullable<Nullable<User>[]>;
    kudos?: Nullable<Nullable<Kudos>[]>;
    kudosGiven?: Nullable<Nullable<Kudos>[]>;
    isFollowing: boolean;
    preferences: UserPreferences;
    isOnboarded: boolean;
    onboardingState?: Nullable<JSON>;
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
    instagram?: Nullable<string>;
    devto?: Nullable<string>;
}

export interface UserPreferences {
    __typename?: 'UserPreferences';
    id: string;
    user: User;
    kudos: PreferenceKudos;
    blogs: PreferenceBlogs;
    header: PreferenceHeader;
}

export interface PreferenceKudos {
    __typename?: 'PreferenceKudos';
    enabled: boolean;
}

export interface PreferenceBlogs {
    __typename?: 'PreferenceBlogs';
    enabled: boolean;
}

export interface PreferenceHeader {
    __typename?: 'PreferenceHeader';
    enabled: boolean;
    type: HeaderType;
    image?: Nullable<JSON>;
}

export interface Kudos {
    __typename?: 'Kudos';
    id: string;
    user: User;
    kudosBy: User;
    content: JSON;
    createdAt: string;
}

export interface UserNameAvailability {
    __typename?: 'UserNameAvailability';
    available: boolean;
}

export type JSON = any;
type Nullable<T> = T | null;
