// Http
import { ServerResponse } from 'http';
// Local Code
import { auth } from '../firebase';
import { IIncomingMessageWithBody, IUserInfo } from '../shared';
import { UserRecord } from 'firebase-admin/auth';

export default async (req: IIncomingMessageWithBody, res: ServerResponse) => {
	const userInfo: IUserInfo = req.body;

	// Prevent server from making an account with invalid data
	if (userInfo === undefined) {
		res.statusCode = 400;
		res.write(JSON.stringify({message: 'No user info provided'}));
		return res.end();
	}
	if (userInfo.email === undefined || userInfo.password === undefined) {
		res.statusCode = 400;
		res.write(JSON.stringify({message: 'No email or password provided'}));
		return res.end();
	}

	const authInfo = {
		email: userInfo.email,
		emailVerified: false,
		phoneNumber: userInfo.phonenumber,
		password: userInfo.password,
		displayName: userInfo.username,
	}
	
	let userCredential: UserRecord;
	try {
		userCredential = await auth.createUser(authInfo);
		if (userCredential === undefined) throw new Error;
	}
	catch (err: any) {
		const statusCode = parseInt(err.code);
		res.statusCode = isNaN(statusCode) ? 400 : statusCode;
		res.write(JSON.stringify({message: err.message?? 'An error occurred'}));
		return res.end();
	}
	
	// Created document successfully
	userInfo.userId = userCredential.uid;
	res.statusCode = 201;
	res.write(JSON.stringify(userInfo));
	return res.end();
};