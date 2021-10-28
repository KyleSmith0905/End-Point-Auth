import { Response } from 'node-fetch'
import { IncomingMessage } from 'http';
import { auth, firestore } from './firebase';

export interface IUserInfo {
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

export interface IIncomingMessageWithBody extends IncomingMessage {
	body?: any;
}

export const getFirebaseEmail = async (body: any): Promise<any> => {
	// Get all firestore users in a collection
	const userDocument = await firestore.collection('index').doc('users').collection('usernames').doc(body.username).get();
	const userData = userDocument.data();

	if (userData === undefined) throw new Error('User not found');

	const userAuth = await auth.getUser(userData.userId);
	if (userDocument === undefined) return new Error('No email attached to account');
	body.email = userAuth.email;
	body.userId = userData.userId;
	return body;
}

export const ReadMessage = (messageContainer: IIncomingMessageWithBody | Response): Promise<any> | void => {
	return new Promise((resolve) => {
		let body = '';

		if (messageContainer instanceof IncomingMessage) {
			messageContainer.setEncoding('utf8');
			messageContainer.on('data', (chunk: string) => {
				body += chunk;
			});
			messageContainer.on('end', () => {
				resolve(JSON.parse(body));
			});
		}
		else if (messageContainer instanceof Response) {
			messageContainer.json()
			.then((data) => {
				resolve(data);
			})
			.catch(() => {
				messageContainer.text()
				.then((data) => {
					resolve(data);
				})
				.catch(() => {
					resolve({message: 'No data was returned.'});
				})
			})
		}
	})
}