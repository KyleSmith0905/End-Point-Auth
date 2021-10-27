import { ServerResponse } from 'http';
import fetch from 'node-fetch';
// Local Code
import { auth, firebaseApiKey } from '../firebase';
import { IIncomingMessageWithBody, ReadMessage } from '../shared';

export default async (req: IIncomingMessageWithBody, res: ServerResponse) => {
	
	let userAuth: any;

	try {
		// Make an API call directly instead of importing the whole Firebase SDK.
		userAuth = await signInUser(req.body);
		if (typeof userAuth !== 'object') throw new Error();
	}
	catch (err: any) {
		const statusCode = parseInt(err.code);
		res.statusCode = isNaN(statusCode) ? 400 : statusCode;
		res.write(JSON.stringify({message: err.message ?? 'An error ocurred'}));
		return res.end();
	};

	const currentDate = new Date();
	currentDate.setHours(currentDate.getHours() + 1)

	// Firebase's tokens expire after an hour
	res.statusCode = 200;
	res.write(JSON.stringify({token: userAuth.refreshToken, expires: userAuth.expiresIn}));
	return res.end();
}


const signInUser = async (body: any): Promise<any> => {

	// We need email for sign in. We could also send email in the request to remove this call.
	if (body.email === undefined) {
		const userInfo = await auth.getUser(body.userId);
		if (userInfo === undefined || userInfo.email === undefined) return new Error('No email attached to account');
		body.email = userInfo.email;
	};

	const url = process.env.NODE_ENV === 'test' ? 'http://localhost:9099/' : 'https://'
	// Make a REST API call directly instead of importing the whole Firebase SDK.
	const response = await fetch(url + 'identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + firebaseApiKey, {
		method: 'POST',
		body: JSON.stringify({email: body.email, password: body.password, returnSecureToken: true}),
		headers: {
			'Content-Type': 'application/json'
		}
	})
	.catch ((err) => {
		return err;
	})
	
	return ReadMessage(response);
}
