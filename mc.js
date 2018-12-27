/////////////////////////////////////////////////////////////////////////////////////////
// .-------------------.
// | NOTES FOR ANDREW: |
// '-------------------'
//
// This is the code for a "2D Minecraft" game that we were making.
//
// It has 4 parts: Setup, Things to keep track of, Draw the things, Change the things.
// The makes it easier to understand and to change to do what you want. For example,
// You can change how to Draw the things (or what the game looks like) without worrying
// about how the game works. Or you can change how the game works without worrying about
// how it gets drawn. If you add something new to the game, then you might have to change
// all parts, but you can do it one at a time. For example, when we made the person crouch,
// we had change how the person is drawn to draw him shorter if he is crouched. For the
// game to know whether the person is crouched or not, we had to add a new variable (in
// "THINGS TO KEEP TRACK OF") to keep track of whether the person is crouched or not.
// To change when the person is crouched, we added code to change the "person.crouched"
// whenever you press the SHIFT key. (We found the key-number for the SHIFT key by pressing
// that key in the game and looking in the console window to see what it said).
//
// HERE ARE THE 4 SECTIONS:
//
// 1. SETUP:
//    This creates the Renderer (and names it "r"), and puts it on the webpage.
//    You can ignore everything in here for now. But for instructions on how to
//    use the renderer, see: https://github.com/d-cook/Render/blob/master/README.md
//
// 2. THINGS TO KEEP TRACK OF:
//    These are all the things (variables) that the program uses to keep track
//    anything that is happening in the game. For example: Where the person is,
//    what all the blocks are, is the person crouching, etc. If you want a new thing
//    to keep track of in the game, you first create a variable for it in this section,
//    and then you change how things are drawn or how the game works to use that variable.
//    For example, if you want the person to have life-hearts, then you can create a
//    variable that has the number of hearts that person has; then you add code to draw
//    the hearts (see "DRAW THE THINGS" below) which uses that variable to know how many
//    hearts to draw; and then you add code to change how many hearts the person has
//    (for example, by subtracting 1 from it when they get hurt) when something happens.
//
// 3. DRAW THE THINGS:
//    This is all the instructions for how to draw the game.
//    The "drawEverything" function creates a new array (or a list) call "thingsToDraw",
//    and passes that into other functions. For example, drawBlocks draws all the blocks
//    by "pushing" drawing instructions for each block into the list of thingsToDraw.
//    DrawPerson pushes instructions for drawing the shapes that make the person.
//    That way, if you just want to change how something is drawn (like the person),
//    you only need to change the code in that function (like drawPerson). Or if you
//    add a new thing to draw, then you can create a new function (like drawPickaxe)
//    and then change drawEverything to also pass the thingsToDraw to that function.
//    Finally, drawEverything is called every 20 milliseconds (or 0.02 seconds), so that
//    no matter what is happening in the game, it very quickly draws what the game should
//    look like on the screen.
//
// 4. CHANGE THE THINGS:
//    The is the code for making things happen when you push buttons or do other things.
//    For example, when you push left or right, move the person left of right. You move
//    the person by changing the variable that is "keeping track" of where the person is
//    standing (person.x). For example, to move left you subtract 1 from it, or to move
//    right you add 1 to it. You do NOT want the person to move if that will make him
//    walk out of the game, so the code says "if you pressed left AND if you are not too
//    far to the left, then move left", or the same thing for moving right. Since had
//    already written the code for how (and where) to draw the person, we didn't need to
//    worry about that anymore, we just had to change the variable that keeps track of
//    where the person is when you push a button, and it keeps drawing it the right way.
//    When we made the person fall down ("if the bloock beneath you is air, then add 1
//    to person.y"), it still just kept drawing him in the right place.
/////////////////////////////////////////////////////////////////////////////////////////


////////////////////////////
// SETUP
////////////////////////////

// Taken from: https://github.com/d-cook/Render
function Renderer(config, width, height, textConfig) {
    var _ctorArgs = [].slice.call(arguments, 0);
    config = null; width = null; height = null; textConfig = null;

    for(var i = 0; i < _ctorArgs.length; i++) {
        var a = _ctorArgs[i]; var ta = (typeof a);
        if (ta === 'string' && config === null) { config = a; }
        else if (ta === 'number' && width === null) { width = a; }
        else if (ta === 'number' && height === null) { height = a; }
        else if (ta === 'object' && textConfig === null) { textConfig = a; }
    }

    var baseX, baseY, defColor;

    (function() {
        var ids = ('' + (config || '')).toLowerCase().split(' ');
        var T = null, L = null, R = null, B = null, M = 0, C = null;

        for (var i = 0; i < ids.length; i++) {
            var id = ids[i];
            var t = (id === 'top'   ); T = T || (t && !B);
            var l = (id === 'left'  ); L = L || (l && !R);
            var r = (id === 'right' ); R = R || (r && !L);
            var b = (id === 'bottom'); B = B || (b && !T);
            var m = (id === 'middle' || id === 'center');
            C = (t || l || r || b || m) ? C : id;
        }

        baseX = (L) ? 'left' : (R) ? 'right' : 'middle';
        baseY = (T) ? 'top' : (B) ? 'bottom' : 'middle';
        defColor = C || 'black';
    }());

    var buffer   = document.createElement('canvas');
    var canvas   = document.createElement('canvas');
    var ctx      = buffer.getContext('2d');
    var outerCtx = canvas.getContext('2d');
    var dx       = (baseX === 'right' ? -1 : +1);
    var dy       = (baseY === 'top'   ? +1 : -1);
    var originX  = 0;
    var originY  = 0;
    var content  = [];

    var lastClicked = null;
    var isKeyDown = false;
    var events = {};

    buffer.width  = canvas.width  = (typeof width  === 'number') ? width  : 500;
    buffer.height = canvas.height = (typeof height === 'number') ? height : canvas.width;

    textConfig = Object.assign({}, {
        font: 'sans-serif',
        size: '10px',
        align: 'start',
        baseline: 'alphabetic',
        direction: 'inherit'
    }, (textConfig || {}));

    var ops = {
        line:        function line        (/*..points..*/) { linePath(arguments, 0, 0); },
        closedline:  function closedline  (/*..points..*/) { linePath(arguments, 1, 0); },
        filledline:  function filledline  (/*..points..*/) { linePath(arguments, 1, 1); },
        curve:       function curve       (/*..points..*/) { curvePath(arguments, 0, 0); },
        closedcurve: function closedcurve (/*..points..*/) { curvePath(arguments, 1, 0); },
        filledcurve: function filledcurve (/*..points..*/) { curvePath(arguments, 1, 1); },
        path:        function path        (/*..points..*/) { mixedPath(arguments, 0, 0); },
        closedpath:  function closedpath  (/*..points..*/) { mixedPath(arguments, 1, 0); },
        filledpath:  function filledpath  (/*..points..*/) { mixedPath(arguments, 1, 1); },
        circle:      function circle      (x, y, r      ) { _arc(x, y, r,     0 ,     2*Math.PI , 1, 0, 0); },
        filledcircle:function filledcircle(x, y, r      ) { _arc(x, y, r,     0 ,     2*Math.PI , 1, 1, 0); },
        arc:         function arc         (x, y, r, s, e) { _arc(x, y, r, (s||0), (e||2*Math.PI), 0, 0, 0); },
        closedarc:   function closedarc   (x, y, r, s, e) { _arc(x, y, r, (s||0), (e||2*Math.PI), 1, 0, 0); },
        filledarc:   function filledarc   (x, y, r, s, e) { _arc(x, y, r, (s||0), (e||2*Math.PI), 1, 1, 0); },
        rect:        function rect        (x, y, w, h) { ctx.strokeRect(xof(x+0.5, w-1), yof(y+0.5, h-1), w-1, h-1); },
        filledrect:  function filledrect  (x, y, w, h) { ctx.fillRect  (xof(x,     w  ), yof(y,     h  ), w,   h  ); },
        clear:       function clear       (x, y, w, h) { ctx.clearRect (xof(x,     w  ), yof(y,     h  ), w  , h  ); },
        text:        function text        (t, x, y, w, c) {
            c = arguments[arguments.length - 1];
            _text(t, x, y, w, (typeof c === 'object' && c), true);
        }
    };

    function xof(x, w) { return originX + dx * (dx > 0 ? x : x + (w||0)); }
    function yof(y, h) { return originY + dy * (dy > 0 ? y : y + (h||0)); }
    function aof(a) { var va = (dy > 0 ? a : -a); return (dx > 0 ? va : Math.PI - va); }

    function setFont(config) {
        config = Object.assign({}, textConfig, (config || {}));
        var s = config.size; s = /^\d+$/.test(s) ? s+'px' : String(s);
        ctx.font = s + ' ' + config.font;
        ctx.textAlign = config.align;
        ctx.textBaseline = config.baseline;
        ctx.direction = config.direction;
    }

    function linePath(args, close, fill) {
        var d = (fill ? 0 : 0.5);
        ctx.moveTo(xof(args[0]+d), yof(args[1]+d));
        for(var i = 2; i < args.length - 1; i += 2) { ctx.lineTo(xof(args[i]+d), yof(args[i+1]+d)); }
        if (close) { ctx.closePath(); }
        ctx[fill ? 'fill' : 'stroke']();
    }

    function curvePath(args, close, fill) {
        var d = (fill ? 0 : 0.5);
        ctx.moveTo(xof(args[0]+d), yof(args[1]+d));
        if (args.length < 6) {
            ctx.lineTo(xof(args[2]+d), yof(args[3]+d));
        } else if (args.length > 6 && args.length < 10) {
            ctx.bezierCurveTo(xof(args[2]+d), yof(args[3]+d), xof(args[4]+d), yof(args[5]+d), xof(args[6]+d), yof(args[7]+d));
        } else for(var i = 2; i < args.length - 3; i += 4) {
            ctx.quadraticCurveTo(xof(args[i]+d), yof(args[i+1]+d), xof(args[i+2]+d), yof(args[i+3]+d));
        }
        if (close) {
            // If there is one extra control-point, then *curve* back to the starting point. Otherwise just close the path:
            if (i < args.length - 1) { ctx.quadraticCurveTo(xof(args[i]+d), yof(args[i+1]+d), xof(args[0]+d), yof(args[1]+d)); }
            else { ctx.closePath(); }
        }
        ctx[fill ? 'fill' : 'stroke']();
    }

    function _text(t, x, y, w, c, fill) {
        var d = (fill ? 0 : 0.5);
        setFont(c);
        if (typeof w === 'number') { ctx[fill ? 'fillText' : 'strokeText'](t, x, y, w); }
        else /*******************/ { ctx[fill ? 'fillText' : 'strokeText'](t, x, y); }
    }

    function _arc(x, y, r, s, e, close, fill, path) {
        var d = (fill ? 0 : 0.5);
        ctx.arc(xof(x+d), yof(y+d), r, aof(s), aof(e), (dx * dy * (path || 1)) < 0);
        if (close) { ctx.closePath(); }
        if (!path) { ctx[fill ? 'fill' : 'stroke'](); }
    }

    function arcTo(x0, y0, cx, cy, a, fill) {
        var x = x0 - cx;
        var y = y0 - cy;
        var r = Math.sqrt(x*x + y*y);
        var s = Math.atan2(y, x);
        _arc(cx, cy, r, s, s+a, 0, fill, (a > 0 ? 1 : -1));
    }

    function mixedPath(args, close, fill) {
        var d = (fill ? 0 : 0.5);
        var prevX = args[0];
        var prevY = args[1];
        ctx.moveTo(xof(args[0]+d), yof(args[1]+d));
        for(var i = 2; i < args.length; i++) {
            var p = args[i];
            if /**/ (p.length < 3) { ctx.lineTo/*********/(xof(p[0]+d), yof(p[1]+d)); }
            if /**/ (p.length < 4) { arcTo(prevX, prevY, p[0], p[1], p[2], fill); }
            else if (p.length < 6) { ctx.quadraticCurveTo (xof(p[0]+d), yof(p[1]+d), xof(p[2]+d), yof(p[3]+d)); }
            else /***************/ { ctx.bezierCurveTo/**/(xof(p[0]+d), yof(p[1]+d), xof(p[2]+d), yof(p[3]+d), xof(p[4]+d), yof(p[5]+d)); }
            prevX = p[p.length - 2];
            prevY = p[p.length - 1];
        }
        if (close) { ctx.closePath(); }
        ctx[fill ? 'fill' : 'stroke']();
    }

    function setOrigin() {
        originX = (baseX === 'left') ? 0 : (baseX === 'right' ) ? canvas.width  : Math.floor(canvas.width  / 2);
        originY = (baseY === 'top' ) ? 0 : (baseY === 'bottom') ? canvas.height : Math.floor(canvas.height / 2);
    }

    function renderFrame() {
        setOrigin();
        buffer.width = buffer.width;
        canvas.width = canvas.width;
        ctx.clearRect(0, 0, buffer.width, buffer.height);

        for(var ci = 0; ci < content.length; ci++) {
            var data = content[ci] || ['noop'];
            var ids = ('' + (data[0] || '')).toLowerCase().split(' ');
            var filled = false, closed = false, color = null;
            var op = null, fop = null, cop = null;

            for(var i = 0; i < ids.length; i++) {
                var id = ids[i];
                var o  = ops[id];
                var so = ops['filled'+id];
                var co = ops['closed'+id];
                var fd = (id === 'filled');
                var cd = (id === 'closed');
                op     = (op     || o);
                fop    = (fop    || so);
                cop    = (cop    || co);
                filled = (filled || fd);
                closed = (closed || cd);
                color  = (color  || (!o && !so && !co && !fd && !cd && id));
            }

            op = (filled && fop) || (closed && cop) || op;
            if (op) {
                var args = data.slice(1);
                ctx.fillStyle   = (color || defColor);
                ctx.strokeStyle = (color || defColor);
                ctx.beginPath();
                op.apply(null, args);
            }
        }

        requestAnimationFrame(function renderBuffer() {
            outerCtx.clearRect(0, 0, canvas.width, canvas.height);
            outerCtx.drawImage(buffer, 0, 0);
        });
    }

    function on(name, f) {
        window.addEventListener(name, function(e) { f(e || window.event); }, false);
    }

    function addKeyEvent(name) {
        name = 'key' + name;
        on(name, function(e) {
            if (events[name] && lastClicked === canvas && !(isKeyDown && name === 'keydown')) {
                events[name](e.keyCode);
            }
            isKeyDown = (name !== 'keyup') && (isKeyDown || name === 'keydown');
        });
    }

    function addMouseEvent(name) {
        name = 'mouse' + name;
        on(name, function(e) {
            if (name === 'mousedown') { lastClicked = e.target; }
            if (events[name]) {
                var r = canvas.getBoundingClientRect();
                var w = parseInt((canvas.currentStyle || canvas.style).borderLeftWidth) || 0;
                var h = parseInt((canvas.currentStyle || canvas.style).borderTopWidth ) || 0;
                var x = xof(e.clientX - r.left - w);
                var y = yof(e.clientY - r.top  - h);
                if (x >= 0 && x < canvas.width && y >= 0 && y < canvas.height) {
                    events[name](x, y);
                }
            }
        });
    }

    addKeyEvent  ('up'); addKeyEvent  ('down');
    addMouseEvent('up'); addMouseEvent('down'); addMouseEvent('move');

    renderFrame();

    return {
        getCanvas: function getCanvas() {
            return canvas;
        },
        render: function render(c) {
            if (arguments.length > 0) {
                if (!Array.isArray(c)) { var c2 = []; c2.push.apply(c2, arguments); c = c2; }
                content = Array.isArray(c[0]) ? c : [c];
            }
            renderFrame();
        },
        resize: function resize(w, h) {
            buffer.width = canvas.width  = w;
            buffer.height = canvas.height = h;
            renderFrame();
        },
        textWidth: function textWidth(text, config) {
            setFont(config);
            return ctx.measureText(text).width || 0;
        },
        onKeyUp:     function onKeyUp    (f) { events.keyup     = f; },
        onKeyDown:   function onKeyDown  (f) { events.keydown   = f; },
        onMouseUp:   function onMouseUp  (f) { events.mouseup   = f; },
        onMouseDown: function onMouseDown(f) { events.mousedown = f; },
        onMouseMove: function onMouseMove(f) { events.mousemove = f; }
    };
}

var r = Renderer('top left');

function fitToWindow() { r.resize(window.innerWidth-4, window.innerHeight-4); }

var c = r.getCanvas();
c.style.border = '2px solid red';
window.addEventListener('resize', fitToWindow);
document.body.style.margin = '0';
document.body.style.overflow = 'hidden';
document.body.appendChild(c);
fitToWindow();

////////////////////////////
// THINGS TO KEEP TRACK OF
////////////////////////////

var blocks = [
    ["air"    ,"air"    ,"air"    ,"air"    ,"air"    ,"air"    ,"air"    ,"air"    ,"air"    ,"air"    ,"air"    ,"air"    ,"air"    ,"air"    ,"air"    ,"air"    ,"air"    ,"air"    ],
    ["air"    ,"air"    ,"air"    ,"air"    ,"air"    ,"air"    ,"air"    ,"air"    ,"air"    ,"air"    ,"air"    ,"air"    ,"air"    ,"air"    ,"air"    ,"air"    ,"air"    ,"air"    ],
    ["air"    ,"air"    ,"air"    ,"air"    ,"air"    ,"air"    ,"air"    ,"air"    ,"air"    ,"air"    ,"air"    ,"air"    ,"air"    ,"air"    ,"air"    ,"air"    ,"air"    ,"air"    ],
    ["air"    ,"air"    ,"air"    ,"air"    ,"air"    ,"air"    ,"air"    ,"air"    ,"air"    ,"air"    ,"air"    ,"air"    ,"air"    ,"air"    ,"air"    ,"air"    ,"air"    ,"air"    ],
    ["air"    ,"air"    ,"air"    ,"air"    ,"air"    ,"air"    ,"air"    ,"air"    ,"air"    ,"air"    ,"air"    ,"air"    ,"air"    ,"air"    ,"air"    ,"air"    ,"air"    ,"air"    ],
    ["air"    ,"air"    ,"air"    ,"air"    ,"air"    ,"air"    ,"air"    ,"air"    ,"air"    ,"air"    ,"air"    ,"air"    ,"air"    ,"air"    ,"air"    ,"air"    ,"air"    ,"air"    ],
    ["grass"  ,"grass"  ,"grass"  ,"grass"  ,"grass"  ,"grass"  ,"grass"  ,"grass"  ,"air"  ,"grass"  ,"grass"  ,"grass"  ,"grass"  ,"grass"  ,"grass"  ,"grass"  ,"grass"  ,"grass"  ],
    ["dirt"   ,"dirt"   ,"dirt"   ,"dirt"   ,"dirt"   ,"dirt"   ,"dirt"   ,"dirt"   ,"air"   ,"dirt"   ,"dirt"   ,"dirt"   ,"dirt"   ,"dirt"   ,"dirt"   ,"dirt"   ,"dirt"   ,"dirt"   ],
    ["stone"  ,"dirt"   ,"dirt"   ,"stone"  ,"dirt"   ,"stone"  ,"dirt"   ,"dirt"   ,"dirt"   ,"stone"  ,"stone"  ,"dirt"   ,"dirt"   ,"dirt"   ,"dirt"   ,"dirt"   ,"dirt"   ,"dirt"   ],
    ["stone"  ,"stone"  ,"dirt"   ,"dirt"   ,"stone"  ,"stone"  ,"dirt"   ,"dirt"   ,"stone"  ,"stone"  ,"stone"  ,"dirt"   ,"dirt"   ,"dirt"   ,"dirt"   ,"dirt"   ,"dirt"   ,"dirt"   ],
    ["dirt"   ,"stone"  ,"stone"  ,"stone"  ,"stone"  ,"gravel" ,"stone"  ,"stone"  ,"stone"  ,"stone"  ,"stone"  ,"dirt"   ,"stone"  ,"stone"  ,"stone"  ,"stone"  ,"stone"  ,"stone"  ],
    ["stone"  ,"dirt"   ,"stone"  ,"stone"  ,"stone"  ,"stone"  ,"stone"  ,"stone"  ,"dirt"   ,"stone"  ,"stone"  ,"stone"  ,"stone"  ,"stone"  ,"stone"  ,"stone"  ,"stone"  ,"stone"  ],
    ["stone"  ,"stone"  ,"stone"  ,"stone"  ,"stone"  ,"stone"  ,"stone"  ,"stone"  ,"stone"  ,"stone"  ,"stone"  ,"stone"  ,"stone"  ,"stone"  ,"stone"  ,"stone"  ,"stone"  ,"stone"  ],
    ["bedrock","bedrock","bedrock","bedrock","bedrock","bedrock","bedrock","bedrock","bedrock","bedrock","bedrock","bedrock","bedrock","bedrock","bedrock","bedrock","bedrock","bedrock"]
];

var person = {
    x: 0,
    y: 5
};

var blockSize = 60;
var showCoords = true;

////////////////////////////
// DRAW THE THINGS
////////////////////////////

function drawEverything() {
    var thingsToDraw = [];
    drawBlocks(thingsToDraw);
    drawPerson(thingsToDraw);
    drawCoords(thingsToDraw);
    r.render(thingsToDraw);
}

function drawBlocks(thingsToDraw) {[];
    for(var y = 0; y < blocks.length; y++) {
        var layer = blocks[y];
        for(var x = 0; x < layer.length; x++) {
            var block = layer[x];
            var color = 'pink'
            if (block === 'air'    ) { color = 'white'; }
            if (block === 'dirt'   ) { color = '#884444'; }
            if (block === 'stone'  ) { color = '#444444'; }
            if (block === 'grass'  ) { color = '#00FF00'; }
            if (block === 'gravel' ) { color = '#888888'; }
            if (block === 'bedrock') { color = 'black'; }
            thingsToDraw.push(['filled ' + color + ' rect', x * blockSize + 1, y * blockSize + 1, blockSize-1, blockSize-1]);
        }
    }
}

function drawPerson(thingsToDraw) {
    thingsToDraw.push(['filled blue rect', blockSize * (person.x + 0.25), blockSize * (person.y - 1), blockSize / 2, blockSize / 2]); // HEAD
    thingsToDraw.push(['filled blue rect', blockSize * (person.x + 0.1), blockSize * (person.y - 0.5), blockSize * (1 - .2), blockSize * 1.5]); // BODY
}

function drawCoords(thingsToDraw) {
    if (showCoords) {
        thingsToDraw.push(['text', ('X=' + person.x + ', Y=' + person.y), 10, 10, {size:20, baseline:'top'}]);
    }
}

setInterval(drawEverything, 20);

////////////////////////////
// CHANGE THE THINGS
////////////////////////////

r.onKeyDown(function(key) {
    console.log("KEY: " + key);
    if (key === 37 && person.x > 0                   ) { person.x = person.x - 1; } // LEFT
    if (key === 39 && person.x < blocks[0].length - 1) { person.x = person.x + 1; } // RIGHT
    if (key === 16) { showCoords = !showCoords; } // SHIFT
});
