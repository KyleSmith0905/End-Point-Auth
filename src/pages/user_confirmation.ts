// Http
import { ServerResponse } from 'http';
// Firebase
import { UserRecord } from 'firebase-admin/auth';
// Local Code
import { authAdmin } from '../firebase';
import { IIncomingMessageWithBody, IUserCredentials } from '../shared';

export default async (req: IIncomingMessageWithBody, res: ServerResponse) => {

	// Let's assume userId was also in the request.
	const userCredentials: IUserCredentials = req.body;
	
	let userAuth: UserRecord;
	try {
		userAuth = await authAdmin.getUser(userCredentials.userId);
		if (userAuth === undefined || userAuth.email === undefined) throw new Error;
	}
	catch (err: any) {
		const statusCode = parseInt(err.code);
		res.statusCode = isNaN(statusCode) ? 400 : statusCode;
		res.write(JSON.stringify(err.message ?? 'An error occurred'));
		return res.end();
	}

	// The user would not need an email if they are already verified.
	if (userAuth.emailVerified === true) {
		res.statusCode = 400;
		res.write(JSON.stringify('User is already verified'));
		return res.end();
	}

	authAdmin.generateEmailVerificationLink(userAuth.email);

	res.statusCode = 200;
	res.write(JSON.stringify({message: 'Your account is successfully confirmed'}))
	return res.end();
};