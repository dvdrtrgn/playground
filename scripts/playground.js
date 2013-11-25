var OPTS = {
    tabSize: 2,
    theme: 'cobalt',
    useWrapMode: false,
    presetsURI: './presets/',
    // URI to presets; must end in "/"
    defaultPreset: 'BlankDefault',
    // Exact
    presetInHash: true,
    // Load preset from hash and set hash in usePreset()
    runOnChange: true,
    // Execute code during typing (all fields)?
    runOnChangeOf: {
        code: true,
        // Execute code when it changes?
        data: true,
        // Execute code when data changes?
        css: false,
        // Execute code when CSS changes?
        resize: true // Execute code when window resizes?
    },
    resetPGOnChangeOf: {
        code: true,
        // Erase playground before running code due to change of code?
        data: false,
        // Erase playground before running code due to change of data?
        css: false,
        // Erase playground before running code due to change of CSS?
        resize: true // Erase playground before running code due to window resize?
    }
};

window.addEventListener('load', function () {
    $playground = document.querySelector('#playground');
    $css = document.querySelector('#user-css');
    $editors = {
        data: null,
        code: null,
        css: null
    };
    setupEditors();
    setupPresets();
    fixKeyboardShortcuts();
    bindUI();
}, false);

// Fills out $editors with ACE editors

function setupEditors() {
    var jsMode = require("ace/mode/javascript").Mode,
        cssMode = require("ace/mode/css").Mode;
    for (var name in $editors) {
        if (!$editors.hasOwnProperty(name)) continue;
        var ed = $editors[name] = ace.edit(name + '-editor');
        ed.setTheme("ace/theme/" + OPTS.theme);
        var session = ed.getSession();
        session.setTabSize(OPTS.tabSize);
        session.setUseWrapMode(OPTS.useWrapMode);
        session.setMode(name == 'css' ? new cssMode : new jsMode);
    }
    $editors.data.getSession().on('change', unlessErrorsIn('data-editor', updateData, 250));
    $editors.code.getSession().on('change', unlessErrorsIn('code-editor', updateCode, 350));
    // CSS editor does not accept SVG CSS as valid, so update on every change
    $editors.css.getSession().on('change', runLater(updateCSS, 350));
}

// Load preset names from OPTS.presetsURI, load the default/hash, and setup load handlers

function setupPresets() {
    var defaultName = (OPTS.presetInHash && location.hash) ? unescape(location.hash.slice(1)) : OPTS.defaultPreset;
    var presets = document.getElementById('presets');
    presets.addEventListener('change', usePreset, false);
    d3.text(OPTS.presetsURI, function (html) {
        var names = html.match(/[^<>]+(?=\.js<\/a>)/g);
        for (var i = 0; i < names.length; ++i) {
            var sel = (names[i] == defaultName);
            presets.appendChild(new Option(names[i], names[i], sel, sel));
        }
        usePreset(defaultName);
    });
}

function usePreset(presetName) {
    if (typeof presetName != 'string') presetName = presets.value;
    if (OPTS.presetInHash) location.hash = escape(presetName);
    var path = OPTS.presetsURI + presetName;

    resetPlayground();
    d3.text(path + '.css', function (css) {
        $editors.css.getSession().setValue(css);
    });
    d3.text(path + '.data', function (data) {
        $editors.data.getSession().setValue(data);
        d3.text(path + '.js', function (code) {
            $editors.code.getSession().setValue(code);
        });
    });
}

function resetPlayground() {
    //console.debug('Reset Playground');
    $playground.innerHTML = "";
}

// Command-L on OS X conflicts with focusing address bar
// Use Ctrl-L instead (and remove 'centerselection')

function fixKeyboardShortcuts() {
    for (var name in $editors) {
        if (!$editors.hasOwnProperty(name)) continue;
        var cmd = $editors[name].commands;
        var gtl = cmd.commands.gotoline;
        gtl.bindKey = cmd.commands.centerselection.bindKey;
        cmd.removeCommand('centerselection');
        cmd.addCommand(gtl);
    }
}

function bindUI() {
    document.getElementById('runcode').addEventListener('change', toggleLiveUpdates, false);
    document.getElementById('swizzle').addEventListener('click', swizzleData, false);
    window.addEventListener('resize', runLater(resizeWindow, 250), false);
}

function toggleLiveUpdates() {
    OPTS.runOnChange = document.getElementById('runcode').checked;
    if (OPTS.runOnChange) updateCode('code');
}

function swizzleData() {
    swizzleArray($data);
    updateCode('data');

    function swizzleArray(a) {
        for (var i = a.length; i--;) {
            var v = a[i];
            if (typeof v == 'number') a[i] = swizzleNumber(v);
            else if (v instanceof Array) swizzleArray(v);
            else if (v instanceof Object) swizzleObject(v);
        }
    }

    function swizzleNumber(n) {
        return n += (Math.random() - 0.5) * n / 5;
    }

    function swizzleObject(o) {
        for (var k in o) {
            if (!o.hasOwnProperty(k)) continue;
            var v = o[k];
            if (typeof v == 'number' && k != 'id') o[k] = swizzleNumber(v);
            else if (v instanceof Array) swizzleArray(v);
            else if (v instanceof Object) swizzleObject(v);
        }
    }
}

function resizeWindow() {
    //console.debug('Resize Window');
    updateCode('resize');
}

function updateData() {
    //console.debug('Update Data');
    try {
        $data = eval($editors.data.getSession().getValue());
    } catch (e) {
        console.log("Updating data: " + e.message);
    }
    updateCode('data');
}

function updateCSS() {
    //console.debug('Update CSS');
    try {
        $css.innerHTML = $editors.css.getSession().getValue();
    } catch (e) {
        console.log("Updating CSS: " + e.message);
    }
    updateCode('css');
}

// Execute the code (maybe); changeSource is either 'data' or 'css' or 'resize'

function updateCode(changeSource) {
    //console.debug('Update Code');
    if (!OPTS.runOnChange) return;
    if (typeof changeSource != 'string') changeSource = 'code';
    if (OPTS.runOnChangeOf[changeSource]) {
        if (OPTS.resetPGOnChangeOf[changeSource]) resetPlayground();
        runCode();
    }
}

// Manual invocation; intended to be hooked up to a button in the UI

function runCode() {
    try {
        eval($editors.code.getSession().getValue());
    } catch (e) {
        console.log("Updating code: " + e.message);
    }
}

function unlessErrorsIn(id, callback, delay) {
    var el = document.getElementById(id),
        timer;
    return function () {
        clearTimeout(timer);
        timer = setTimeout(function () {
            if (!el.querySelector('div_gutter-cell_error')) callback();
        }, delay); // DANGER: workers-css.js and workers-javascript.js must have timeouts below this
    }
}

// Runs the callback unless interrupted by another call within the delay

function runLater(callback, delay) {
    var timer;
    return function () {
        clearTimeout(timer);
        timer = setTimeout(callback, delay);
    }
}

// Create a function that returns a particular property of its parameter.
// If that property is a function, invoke it (and pass optional params).

function
/**/
ƒ (name) {
    var v, params = Array.prototype.slice.call(arguments, 1);
    return function (o) {
        return (typeof(v = o[name]) === 'function' ? v.apply(o, params) : v);
    };
}

// Return the first argument passed in

function I(d) {
    return d;
}
