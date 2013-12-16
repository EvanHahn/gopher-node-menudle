var menudle = require('../');

var S = require('string');
require('chai').should();

describe('menudle', function() {

	describe('render', function() {

		describe('text', function() {

			it('should properly render simple text', function() {
				var input = 'Hello world!\nThis is a simple Gopher site.';
				var result = menudle.render(input);
				var lines = S(result).lines();
				lines[0].should.eql('iHello world!\tnull\t(FALSE)\t0');
				lines[1].should.eql('iThis is a simple Gopher site.\tnull\t(FALSE)\t0');
			});

			it('should wrap long, solid with a specified wrap', function() {
				var input = 'puddipuddipuddi';
				var result = menudle.render(input, { wrapAt: 5 });
				var lines = S(result).lines();
				lines.should.have.length(3);
				lines[0].should.eql('ipuddi\tnull\t(FALSE)\t0');
				lines[1].should.eql('ipuddi\tnull\t(FALSE)\t0');
				lines[2].should.eql('ipuddi\tnull\t(FALSE)\t0');
			});


			it('should wrap long word-filled lines with a specified wrap', function() {
				var input = "This is Ron Burgundy, proudly reporting once again for Channel 4 News. Today's story is one of the more remarkable things ever to happen to San Diago or even the world.";
				var result = menudle.render(input, { wrapAt: 30 });
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
				var result = menudle.render(input);
				var lines = S(result).lines();
				lines.should.have.length(3);
				lines[0].should.eql('iHello world!\tnull\t(FALSE)\t0');
				lines[1].should.eql('i\tnull\t(FALSE)\t0');
				lines[2].should.eql('iThis is Gopher.\tnull\t(FALSE)\t0');
			});

			it('renders lines that start with :', function() {
				var input = '::Wow';
				var result = menudle.render(input);
				result.should.eql('i:Wow\tnull\t(FALSE)\t0');
			});

			it('turns tabs into 4 spaces by default', function() {
				var input = 'This is\tcool';
				var result = menudle.render(input);
				result.should.eql('iThis is    cool\tnull\t(FALSE)\t0');
			});

			it('turns tabs into a specified number of spaces', function() {
				var input = 'This is\tcool';
				var result = menudle.render(input, { tabSize: 5 });
				result.should.eql('iThis is     cool\tnull\t(FALSE)\t0');
			});

		});

	});

});
