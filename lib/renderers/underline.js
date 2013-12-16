var S = require('string');
var renderText = require('./text');

function renderUnderline(input, options) {
	return renderText(input, options) +
		'\r\n' +
		renderText(S('-').repeat(input.length).s, options);
}

module.exports = renderUnderline;