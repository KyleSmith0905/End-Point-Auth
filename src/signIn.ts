// Express
import { Request, Response } from 'express';
// Firebase
import { signInWithEmailAndPassword, UserCredential } from 'firebase/auth';
// Local Code
import { auth, authAdmin } from './firebase';

export const signIn = async (req: Request, res: Response) => {

	const userCredential = req.body;
	
	let userAuth: UserCredential;
	try {
		userAuth = await signInWithEmailAndPassword(auth, userCredential.email, userCredential.password)
		if (userAuth === undefined) throw new Error;

	}
	catch (err: any) {
		const statusCode = parseInt(err.code);
		return res.status(isNaN(statusCode) ? 400 : statusCode).send(err.message ?? 'An error ocurred');
	};

	const customToken = authAdmin.createCustomToken(userAuth.user.uid)

	const currentDate = new Date();
	currentDate.setHours(currentDate.getHours() + 1)

	// Firebase's tokens expire after an hour
	res.status(200).send({
		token: customToken,
		expires: currentDate,
	})
}
