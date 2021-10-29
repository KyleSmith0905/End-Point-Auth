import { createServer, ServerResponse } from 'http';
import { IIncomingMessageWithBody, ReadMessage } from './shared';

export const startServer = () => {
	const server = createServer(async (req: IIncomingMessageWithBody, res) => {
		
		res.setHeader('Access-Control-Allow-Origin', '*');
		res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
		res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS')
		res.setHeader('Accept', 'application/json; charset=utf-8')
		res.setHeader('Content-Type', 'application/json; charset=utf-8')
		if (req.method == "OPTIONS") {
			res.statusCode = 200;
			res.write(JSON.stringify({message: 'Preflight request approved.'}))
			return res.end();
		}
		
		let streamEnded = false;
		const requestWithMessage = await ReadMessage(req).catch(() => {
			res.statusCode = 400;
			res.write(JSON.stringify({message: 'Body must be in JSON format'}))
			streamEnded = true;
			return res.end();
		});
		// @ts-ignore
		if (streamEnded === true) return;
		if (typeof requestWithMessage === 'object') req.body = requestWithMessage;
		
		await Router(req, res);
		
		return;
	}).listen(8080);

	console.log('Server Created... URL: http://localhost:8080');
	
	return server;
}

const Router = async (req: IIncomingMessageWithBody, res: ServerResponse): Promise<any> => {
	
	// Ensures url doesn't include query string.
	let url = req.url;
	if (req.url?.includes('?')) {
		url = req.url.split('?')[0];
	}
	
	let routerFunction: undefined | ((req: IIncomingMessageWithBody, res: any) => Promise<void>);

	try {
		const pagePath = './pages' + url + '.ts';
		const pageModule = await import(pagePath);
		routerFunction = pageModule.default;
	}
	catch (err) {
		res.statusCode = 404;
		return res.end();
	}
	
	// Ensure the function truly catches any bad requests.
	if (typeof routerFunction !== 'function') {
		res.statusCode = 404;
		return res.end();
	}

	try {
		await routerFunction(req, res);
	}
	catch {
		// If the function ends disruptly, it must be an error in our code.
		res.statusCode = 500;
		return res.end();
	}
}