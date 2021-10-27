import { Response } from 'node-fetch'
import { IncomingMessage } from 'http';

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

export const ReadMessage = (messageContainer: IIncomingMessageWithBody | Response): Promise<any> | void => {
	return new Promise((resolve) => {
		let body = '';

		if (messageContainer instanceof IncomingMessage) {
			messageContainer.readableLength 
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