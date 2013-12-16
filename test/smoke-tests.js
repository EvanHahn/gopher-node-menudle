var menudle = require('../');
var render = menudle.render;

var S = require('string');
require('chai').should();

describe('menudle', function() {

	describe('render', function() {

		describe('text', function() {

			it('should properly render simple text', function() {
				var input = 'Hello world!\nThis is a simple Gopher site.';
				var result = render(input);
				var lines = S(result).lines();
				lines[0].should.eql('iHello world!\tnull\t(FALSE)\t0');
				lines[1].should.eql('iThis is a simple Gopher site.\tnull\t(FALSE)\t0');
			});

			it('should wrap long, solid with a specified wrap', function() {
				var input = 'puddipuddipuddi';
				var result = render(input, { wrapAt: 5 });
				var lines = S(result).lines();
				lines.should.have.length(3);
				lines[0].should.eql('ipuddi\tnull\t(FALSE)\t0');
				lines[1].should.eql('ipuddi\tnull\t(FALSE)\t0');
				lines[2].should.eql('ipuddi\tnull\t(FALSE)\t0');
			});


			it('should wrap long word-filled lines with a specified wrap', function() {
				var input = "This is Ron Burgundy, proudly reporting once again for Channel 4 News. Today's story is one of the more remarkable things ever to happen to San Diago or even the world.";
				var result = render(input, { wrapAt: 30 });
				var lines = S(result).lines();
				lines.should.have.length(6);
				lines[0].should.eql('iThis is Ron Burgundy, proudly\tnull\t(FALSE)\t0');
				lines[1].should.eql('ireporting once again for\tnull\t(FALSE)\t0');
				lines[2].should.eql("iChannel 4 News. Today's story\tnull\t(FALSE)\t0");
				lines[3].should.eql('iis one of the more remarkable\tnull\t(FALSE)\t0');
				lines[4].should.eql('ithings ever to happen to San\tnull\t(FALSE)\t0');
				lines[5].should.eql('iDiago or even the world.\tnull\t(FALSE)\t0');
			});

			it('renders blank lines properly', function() {
				var input = 'Hello world!\n\nThis is Gopher.';
				var result = render(input);
				var lines = S(result).lines();
				lines.should.have.length(3);
				lines[0].should.eql('iHello world!\tnull\t(FALSE)\t0');
				lines[1].should.eql('i\tnull\t(FALSE)\t0');
				lines[2].should.eql('iThis is Gopher.\tnull\t(FALSE)\t0');
			});

			it('renders lines that start with :', function() {
				var input = '::Wow';
				var result = render(input);
				result.should.eql('i:Wow\tnull\t(FALSE)\t0');
			});

			it('turns tabs into 4 spaces by default', function() {
				var input = 'This is\tcool';
				var result = render(input);
				result.should.eql('iThis is    cool\tnull\t(FALSE)\t0');
			});

			it('turns tabs into a specified number of spaces', function() {
				var input = 'This is\tcool';
				var result = render(input, { tabSize: 5 });
				result.should.eql('iThis is     cool\tnull\t(FALSE)\t0');
			});

		});

		describe('simple text commands', function() {

			it('should underline text', function() {
				var input = ':underline San Diago';
				var result = render(input);
				var lines = S(result).lines();
				lines.should.have.length(2);
				lines[0].should.eql('iSan Diago\tnull\t(FALSE)\t0');
				lines[1].should.eql('i---------\tnull\t(FALSE)\t0');
			});

			it('should double-underline text', function() {
				var input = ':dblunderline San Diago';
				var result = render(input);
				var lines = S(result).lines();
				lines.should.have.length(2);
				lines[0].should.eql('iSan Diago\tnull\t(FALSE)\t0');
				lines[1].should.eql('i=========\tnull\t(FALSE)\t0');
			});

		});

		describe('link command', function() {

			it('should link to external sites given all info', function() {
				var input = ':link 0 gopherpedia.com:70/Bread Read about bread!';
				var result = render(input);
				var split = result.split('\t');
				split[0].should.eql('0Read about bread!');
				split[1].should.eql('/Bread');
				split[2].should.eql('gopherpedia.com');
				split[3].should.eql('70');
			});

			it('should default to port 70', function() {
				var input = ':link 0 gopherpedia.com/Bread Read about bread!';
				var result = render(input);
				var split = result.split('\t');
				split[0].should.eql('0Read about bread!');
				split[1].should.eql('/Bread');
				split[2].should.eql('gopherpedia.com');
				split[3].should.eql('70');
			});

			it("should guess about the link's type", function() {
				render(':link x.com x')[0].should.eql('1');
				render(':link x.com/ x')[0].should.eql('1');
				render(':link x.com/unknown x')[0].should.eql('1');
				render(':link x.com/0 x')[0].should.eql('0');
				render(':link x.com/1 x')[0].should.eql('1');
				render(':link x.com/g x')[0].should.eql('g');
				render(':link x.com/z x')[0].should.eql('1');
				render(':link x.com/0/y x')[0].should.eql('0');
				render(':link x.com/9/y x')[0].should.eql('9');
				render(':link x.com/I/y x')[0].should.eql('I');
				render(':link x.com/h/y x')[0].should.eql('h');
				render(':link x.com/z/y x')[0].should.eql('1');
			});

			it('parses HTTP links properly', function() {
				render(':link h http://x.com x').should.eql('hx\tURL:http://x.com\tx.com\t70');
				render(':link http://x.com x').should.eql('hx\tURL:http://x.com\tx.com\t70');
			});

			it('parses HTTPS links properly', function() {
				render(':link h https://x.com x').should.eql('hx\tURL:https://x.com\tx.com\t70');
				render(':link https://x.com x').should.eql('hx\tURL:https://x.com\tx.com\t70');
			});

		});

	});

});
