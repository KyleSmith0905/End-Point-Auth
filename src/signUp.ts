// Express
import { Request, Response } from 'express';
// Firebase
import { FirebaseError } from '@firebase/util';
// Local Code
import { authAdmin } from './firebase';
import { IUserInfoWithoutId } from './shared';
import { UserRecord } from 'firebase-admin/auth';

export const signUp = async (req: Request, res: Response) => {

	const userInfo: IUserInfoWithoutId = req.body;

	// Prevent server from making an account with invalid data
	if (userInfo === undefined)  return res.status(400).send('No user info provided');
	if (userInfo.email === undefined || userInfo.password === undefined) return res.status(400).send('No email or password provided');

	const authInfo = {
		email: userInfo.email,
		emailVerified: false,
		phoneNumber: userInfo.phonenumber,
		password: userInfo.password,
		displayName: userInfo.username,
	}
	
	let userCredential: UserRecord;
	try {
		userCredential = await authAdmin.createUser(authInfo);
		if (userCredential === undefined) throw new Error;
	}
	catch (err: any) {
		const statusCode = parseInt(err.code);
		return res.status(isNaN(statusCode) ? 400 : statusCode).send(err.message ?? 'An error ocurred');
	}
	
	// Created document successfully
	userInfo.userId = userCredential.uid;
	return res.status(201).send(userInfo)
};