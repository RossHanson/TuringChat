export type UserId = string;

export type RegisteredUser = {
    id : UserId;
    username : string;
} 

export type Guest = {
    id : UserId;
}

export type User = RegisteredUser | Guest;