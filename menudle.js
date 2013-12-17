var _ = require('lodash');
var S = require('string');

var defaultOptions = {
	tabSize: 4,
	wrapAt: 72
};

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

	return result.join('\r\n') + '\r\n';

}

render.text = require('./lib/renderers/text');
render.underline = require('./lib/renderers/underline');
render.dblunderline = require('./lib/renderers/dblunderline');
render.link = require('./lib/renderers/link');

module.exports = render;
