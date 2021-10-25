// Express
import { json } from "express";
// Local Code
import { app } from "./src/express";
import { signIn } from "./src/signIn";
import { signUp } from "./src/signUp";
import { userConfirmation } from "./src/userConfirmation";

app.put('/sign_up', json(), signUp);
app.post('/sign_in', json(), signIn);
app.post('/user_confirmation', json(), userConfirmation);