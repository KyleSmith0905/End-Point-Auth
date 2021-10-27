require("@babel/register")
import fetch from 'node-fetch';
import { Server } from 'http';
// Local Code
import { auth } from '../src/firebase';
import { startServer } from '../src/server';
import { ReadMessage } from '../src/shared';


jest.setTimeout(5000);

// Randomize user info every time. however, the default data works perfect everytime.
const generateUserData = () => {
	return {
		username: "test" + Math.floor(Math.random() * 1000).toString(),
		password: "test" + Math.floor(Math.random() * 100).toString() + "@test.com",
		email: "test" + Math.floor(Math.random() * 100).toString() + "@test.com",
		phonenumber: "+" + Math.floor(Math.random() * 10000000000).toString().padStart(11, '1')
	}
}

let server: Server;
beforeAll(() => {
	server = startServer();
})

afterAll(() => {
	server.close();
})

describe('Sign Up', () => {

	it('Can sign up user', async () => {

		const signUpUser = generateUserData();
		
		const res = await fetch('http://localhost:3000/sign_up', {
			method: 'POST',
			body: JSON.stringify(signUpUser),
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			}
		})		
		
		const body = await ReadMessage(res);
		
		expect(res.status).toBe(201);
		expect(body.userId).toBeDefined();
		expect(body.username).toBe(signUpUser.username);
		expect(body.email).toBe(signUpUser.email);
		expect(body.phonenumber).toBe(signUpUser.phonenumber);
		expect(body.password).toBe(signUpUser.password);
	})
	
	it('Cannot sign up user with insufficient data', async () => {
		const signUpUser = {}
		
		const res = await fetch('http://localhost:3000/sign_up', {
			method: 'POST',
			body: JSON.stringify(signUpUser),
			headers: {
				'Content-Type': 'application/json'
			}
		})
		
		expect(res.status === 201).toBeFalsy();
	})
})

describe('User Confirmation', () => {
	it('Can confirm user', async () => {
		const userData = generateUserData();
		
		const user = await auth.createUser({
			email: userData.email,
			emailVerified: false,
			phoneNumber: userData.phonenumber,
			password: userData.password,
			displayName: userData.username,
		});
		
		const res = await fetch('http://localhost:3000/user_confirmation', {
			method: 'POST',
			body: JSON.stringify({username: user.displayName, password: userData.password, userId: user.uid}),
			headers: {
				'Content-Type': 'application/json'
			}
		})

		const body = await ReadMessage(res);
		
		expect(res.status).toBe(200);
		expect(body.message).toBe('Your account is successfully confirmed');
	})

	it('Cannot confirm user that are already verified', async () => {
		const userData = generateUserData();
		
		const user = await auth.createUser({
			email: userData.email,
			emailVerified: true,
			phoneNumber: userData.phonenumber,
			password: userData.password,
			displayName: userData.username,
		});
		
		const res = await fetch('http://localhost:3000/user_confirmation', {
			method: 'POST',
			body: JSON.stringify({username: user.displayName, password: userData.password, userId: user.uid}),
			headers: {
				'Content-Type': 'application/json'
			}
		})

		const body = await ReadMessage(res);
		
		expect(res.status).toBe(400);
		expect(body.message).toBe('User is already verified');
	})
})

describe('Sign In', () => {
	it('Can sign in user', async () => {
		const userData = generateUserData();
		
		const user = await auth.createUser({
			email: userData.email,
			emailVerified: false,
			phoneNumber: userData.phonenumber,
			password: userData.password,
			displayName: userData.username,
		});
		
		const res = await fetch('http://localhost:3000/sign_in', {
			method: 'POST',
			body: JSON.stringify({username: user.displayName, password: userData.password, userId: user.uid}),
			headers: {
				'Content-Type': 'application/json'
			}
		})

		const body = await ReadMessage(res);
		
		expect(res.status).toBe(200);
		expect(body.token).toBeDefined();
		expect(body.expires).toBeDefined();
	})
})