// Testing
import supertest from 'supertest';
// Express
import { json } from 'express';
// Local Code
import { signIn } from "../src/signIn";
import { signUp } from "../src/signUp";
import { userConfirmation } from "../src/userConfirmation";
import { app } from '../src/express';
import { authAdmin } from '../src/firebase';

app.put('/sign_up', json(), signUp);
app.post('/sign_in', json(), signIn);
app.post('/user_confirmation', json(), userConfirmation);

jest.setTimeout(5000);

// Realistically I should use the firebase emulator, but it's alright.
// Otherwise, this is potentially harmful.
beforeAll(() => {
	authAdmin.listUsers().then(users => {
		for (let i = 0; i < users.users.length; i++) {
			authAdmin.deleteUser(users.users[i].uid);
		}
	});
})

// This is a proof of concept on unit tests.
// In reality, tests on user confirmation and sign in should be implemented.
describe('Sign Up', () => {
	it('Can sign up user', async () => {

		// Randomize user info every time. however, the default data works perfect everytime.
		const signUpUser = {
			username: "test",
			password: "test@test.com",
			email: "test" + Math.floor(Math.random() * 100).toString() + "@test.com",
			phonenumber: "+" + Math.floor(Math.random() * 10000000000).toString().padStart(11, '1')
		}

		const response = await supertest(app)
		.put('/sign_up')
		.send(signUpUser)

		expect(response.status).toBe(201);
		expect(response.body.userId).toBeDefined();
		expect(response.body.username).toBe(signUpUser.username);
		expect(response.body.email).toBe(signUpUser.email);
		expect(response.body.phonenumber).toBe(signUpUser.phonenumber);
		expect(response.body.password).toBe(signUpUser.password);
	})

	it('Cannot sign up user with insufficient data', async () => {
		const signUpUser = {}
		const response = await supertest(app)
		.put('/sign_up')
		.send(signUpUser)

		expect(response.statusCode === 201).toBeFalsy();
	})
})