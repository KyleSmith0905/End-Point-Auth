# Technical Assessment

- Using NodeJS, create a Signup/SignIn service to authenticate a new user to the system. You can use oath, okta, cognito or any other third-party service.
- Use any backend database you are familiar with.
- No third-party libraries.

## Sign Up

New User can sign up using valid email, username, phone and a password.

Request Body:

```json
{
 "username": "test",
 "password": "test@test.com",
 "email":"test@test.com",
 "phonenumber":"+10000000000"
}
```

Response Code: 201 Created
Response Body on success

```json
{
 "userId": /combination of 10 digit number/,
 "username": "test",
 "password": "test@test.com",
 "email":"test@test.com",
 "phonenumber":"+10000000000"
}
```


## User Confirmation


On successful signup user will receive a OTP on his mobile or his email to validate mobile number which was provided during sign up flow.

Request Body

```json
{
 "username": "test",
 "password": "12345"
}
```

Response Message: "Your account is successfully confirmed" Response Code: 200 ok

## Sign In

User sign in using his username/password.

Request Body

```json
{
 "username": "test",
 "password": "test@test.com"
}
```

Response Code: 200 ok
Response Body:
```json
{
 "token": "------------",
 "expires": ""
}
```