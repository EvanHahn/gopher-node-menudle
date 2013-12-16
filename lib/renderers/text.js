var S = require('string');

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

function renderText(input, options) {
	var tabReplacement = S(' ').repeat(options.tabSize).s;
	input = input.replace(/\t/g, tabReplacement);
	return textWrap(input, options.wrapAt).split('\n').map(function(line) {
		return 'i' + line + '\tnull\t(FALSE)\t0';
	}).join('\r\n');
}

module.exports = renderText;