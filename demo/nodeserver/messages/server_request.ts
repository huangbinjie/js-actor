export class Request {
	public query: { [key: string]: any } = {}
	constructor(public url: string) {
		const index = this.url.indexOf("?")
		const query = this.url.substr(index + 1)
		this.query = queryParse(query)
	}
}

function queryParse(str: string) {
	return str
		.split("&")
		.map(s => s.split("="))
		.map(strArr => ({ [strArr[0]]: strArr[1] }))
		.reduce((acc, x) => ({ ...acc, ...x }), {})
}