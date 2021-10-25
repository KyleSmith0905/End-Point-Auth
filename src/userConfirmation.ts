// Express
import { Request, Response } from 'express';
import { UserRecord } from 'firebase-admin/auth';
// Local Code
import { authAdmin } from './firebase';
import { IUserCredentials } from './shared';

export const userConfirmation = async (req: Request, res: Response) => {

	// Let's assume userId was also in the request.
	const userCredentials: IUserCredentials = req.body;
	
	let userAuth: UserRecord;
	try {
		userAuth = await authAdmin.getUser(userCredentials.userId);
		if (userAuth === undefined || userAuth.email === undefined) throw new Error;
	}
	catch (err: any) {
		const statusCode = parseInt(err.code);
		return res.status(isNaN(statusCode) ? 400 : statusCode).send(err.message ?? 'An error ocurred');
	}

	// The user would not need an email if they are already verified.
	if (userAuth.emailVerified === true) {
		res.status(400).send('User already verified');
		return;
	}

	authAdmin.generateEmailVerificationLink(userAuth.email);

	res.status(200).send('Your account is successfully confirmed');
	return;
};