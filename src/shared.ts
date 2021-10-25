export interface IUserInfoWithoutId {
	userId?: string;
	username: string,
	password: string,
	email: string,
	phonenumber: string,
}

export interface IUserCredentials {
	userId: string;
	username: string;
	password: string;
}

