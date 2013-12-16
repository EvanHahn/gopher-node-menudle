Menudle renders [Gopher](https://en.wikipedia.org/wiki/Gopher_%28protocol%29) menus in Node.

Put this in a string:

    :dblunderline Hello, friend of the gophers!

    This is an example Gopher menu. It's pretty cool! Menudle will wrap this long line to 72 characters per line (but that's configurable if you're prefer something else!).

    :underline Some features

    You can do a lot of stuff with Menudle. You may notice that this text doesn't need anything special; it's rendered as text.

    :link 0 localhost:70/guide.txt Check out this cool guide

    The above will be formatted as a link and it'll actually work! You can leave off the port if it's 70, Menudle will fill it in for you:

    :link 0 localhost/something.txt No need for the port!

    It's not recommended, but you can leave off the link type and Gopher will try to figure it out for you:

    :link localhost/guide.txt It's a .txt, so it's a "0"
    :link localhost/pancakes.gif It's a .gif, so it's a "g"
    :link gopherpedia.com/ It's a root, so it's a "1"
    :link http://evanhahn.com/ It's HTTP(S), so it's of type "h"

And then render it:

    var menudle = require('menudle')
    response = menudle(myString)

And you're done! Happy building of Gopher menus.