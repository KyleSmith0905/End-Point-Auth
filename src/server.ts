import { createServer, ServerResponse } from 'http';
import { IIncomingMessageWithBody, ReadMessage } from './shared';

export const startServer = () => {
	const server = createServer(async (req: IIncomingMessageWithBody, res) => {

		const requestWithMessage = await ReadMessage(req);
		if (typeof requestWithMessage === 'object') req.body = requestWithMessage;
		
		await Router(req, res);
	
		return;
	}).listen(3000);

	return server;
}

const Router = async (req: IIncomingMessageWithBody, res: ServerResponse): Promise<any> => {
	
	// Ensures url is only the path
	let url = req.url;
	if (req.url?.includes('?')) {
		url = req.url.split('?')[0];
	}
	
	let routerFunction: undefined | ((req: IIncomingMessageWithBody, res: any) => Promise<void>);

	const pagePath = './pages' + url + '.ts';
	try {
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