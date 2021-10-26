// Http
import { ServerResponse } from 'http';
// Firebase
import { signInWithEmailAndPassword, UserCredential } from 'firebase/auth';
// Local Code
import { auth, authAdmin } from '../firebase';
import { IIncomingMessageWithBody } from '../shared';

export default async (req: IIncomingMessageWithBody, res: ServerResponse) => {
	
	let userAuth: UserCredential;

	try {
		userAuth = await signInWithEmailAndPassword(auth, req.body.email, req.body.password)
		if (userAuth === undefined) throw new Error;
	}
	catch (err: any) {
		const statusCode = parseInt(err.code);
		res.statusCode = isNaN(statusCode) ? 400 : statusCode;
		res.write(JSON.stringify({message: err.message ?? 'An error ocurred'}));
		return res.end();
	};

	const customToken = authAdmin.createCustomToken(userAuth.user.uid)

	const currentDate = new Date();
	currentDate.setHours(currentDate.getHours() + 1)

	// Firebase's tokens expire after an hour
	res.statusCode = 200;
	res.write(JSON.stringify({token: customToken, expires: currentDate.toISOString()}));
	return res.end();
}