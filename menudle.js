var _ = require('lodash');
var S = require('string');
var url = require('url');

var ENDLINE = '\r\n';
var FILETYPES = {
	'.txt': '0',
	'.gif': 'g',
	'.html': 'h',
	'.htm': 'h',
	'.php': 'h',
	'.cgi': 'h',
	'.wav': 's',
	'.mp3': 's',
	'.aac': 's',
	'.ogg': 's',
	'.ogg': 's',
	'.jpg': 'I',
	'.jpeg': 'I',
	'.png': 'I',
	'.bmp': 'I',
	'.svg': 'I',
};

var defaultOptions = {
	tabSize: 4,
	wrapAt: 72
};

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

function textWrap(str, width) {
	if (str.length > width) {
		var p = str.lastIndexOf(' ', width);
		if (p > 0) {
		  var left = str.substring(0, p);
		  var right = str.substring(p + 1);
		  return left + '\n' + textWrap(right, width);
		} else if (p == -1) {
			var left = str.substring(0, width);
			var right = str.substring(width);
			return left + '\n' + textWrap(right, width);
		}
	}
	return str;
}

function render(input, options) {

	options = _.assign({}, defaultOptions, options);

	var result = [];

	var lines = S(input).lines();
	lines.forEach(function(line) {

		var isComment = (line[0] == '#');
		if (isComment)
			return;

		var isCommand = (line[0] == ':') && (line[1] != ':');
		if (!isCommand) {

			if (line[1] == ':')
				result.push(render.text(line.substr(1), options));
			else
				result.push(render.text(line, options));

		} else {

			var command = line.substr(1).split(/\s+/, 1)[0].toLowerCase();
			input = input.substr(command.length + 2);
			if (!render[command])
				result.push(render.text('Unknown command ' + command, options));
			else
				result.push(render[command](input, options));

		}

	});

	return result.join(ENDLINE);

}

render.text = function(input, options) {
	var tabReplacement = S(' ').repeat(options.tabSize).s;
	input = input.replace(/\t/g, tabReplacement);
	return textWrap(input, options.wrapAt).split('\n').map(function(line) {
		return 'i' + line + '\tnull\t(FALSE)\t0';
	}).join(ENDLINE);
}

render.underline = function(input, options) {
	return render.text(input, options) +
		ENDLINE +
		render.text(S('-').repeat(input.length).s, options);
}

render.dblunderline = function(input, options) {
	return render.text(input, options) +
		ENDLINE +
		render.text(S('=').repeat(input.length).s, options);
}

render.link = function(input, options) {

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
	var port = urlObject.port || 70;

	return [
		type + text,
		path,
		hostname,
		port
	].join('\t');

}

module.exports = {
	render: render
};
