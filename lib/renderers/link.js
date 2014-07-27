var FILETYPES = require('../filetypes');

var url = require('url');

function getExtension(path) {
	return path.match(/\.\w+$/i);
}

function inferType(urlString) {

	if (urlString.search(/^\w+:\/\//i) !== 0)
		urlString = 'gopher://' + urlString;

	var urlObject = url.parse(urlString);

	if ((urlObject.protocol == 'http:') || (urlObject.protocol == 'https:'))
		return 'h';

	var typematch = urlObject.pathname.match(/^\/[0-9ghIsT]\/?/);
	if (typematch)
		return typematch[0][1];

	var extension = getExtension(urlObject.pathname);
	if (FILETYPES[extension])
		return FILETYPES[extension];

	return '1';

}

function renderLink(input, options) {

	var split = input.split(/\s+/g, 2);

	var type = split[0];
	var urlString;
	var text;
	if (type.length == 1) {
		urlString = split[1];
		text = input.substr(split[0].length + split[1].length + 2);
	} else {
		urlString = type;
		type = inferType(urlString);
		text = input.substr(split[0].length + 1);
	}
	if (urlString.search(/^\w+:\/\//i) !== 0)
		urlString = 'gopher://' + urlString;

	var urlObject = url.parse(urlString);

	var path = decodeURIComponent(urlObject.path);
	if (urlObject.protocol !== 'gopher:') {
		type = 'h';
		path = 'URL:' + decodeURIComponent(urlString);
	}
	var hostname = urlObject.hostname;

	var port;
	if (urlObject.port) {
		port = urlObject.port;
	} else if (/https/.test(urlObject.protocol)) {
		port = 443;
	} else if (/http/.test(urlObject.protocol)) {
		port = 80;
	} else {
		port = 70;
	}
	return [
		type + text,
		path,
		hostname,
		port
	].join('\t');

}

module.exports = renderLink;