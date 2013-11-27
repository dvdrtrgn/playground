/*jslint es5:true, white:false */
/*globals $, Global, Main, window */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
(function (W) {
    var C, D, I, OPTS, ƒ;
    C = W.console;
    D = W.document;

    OPTS = {
        tabSize: 4,
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

    W.addEventListener('load', function () {
        $playground = D.querySelector('#playground');
        $css = D.querySelector('#user-css');
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
        var jsMode, cssMode, name, ed, session;

        jsMode = require('ace/mode/javascript').Mode;
        cssMode = require('ace/mode/css').Mode;

        for (name in $editors) {
            if (!$editors.hasOwnProperty(name)) {
                continue;
            }
            ed = $editors[name] = ace.edit(name + '-editor');
            ed.setTheme('ace/theme/' + OPTS.theme);

            session = ed.getSession();
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
        var defaultName, presets;

        defaultName = (OPTS.presetInHash && location.hash)
        ? unescape(location.hash.slice(1)) : OPTS.defaultPreset;

        presets = D.getElementById('presets');
        presets.addEventListener('change', usePreset, false);

        d3.text(OPTS.presetsURI, function (html) {
            var names, i, sel;

            names = html.match(/[^<>]+(?=\.js<\/a>)/g);

            for (i = 0; i < names.length; ++i) {
                sel = (names[i] == defaultName);
                presets.appendChild(new Option(names[i], names[i], sel, sel));
            }
            usePreset(defaultName);
        });
    }

    function usePreset(presetName) {
        var path;

        if (typeof presetName != 'string') {
            presetName = presets.value;
        }
        if (OPTS.presetInHash) {
            location.hash = escape(presetName);
        }
        path = OPTS.presetsURI + presetName;

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
        //C.debug('Reset Playground');
        $playground.innerHTML = '';
    }

    // Command-L on OS X conflicts with focusing address bar
    // Use Ctrl-L instead (and remove 'centerselection')

    function fixKeyboardShortcuts() {
        var name, cmd, gtl;

        for (name in $editors) {
            if (!$editors.hasOwnProperty(name)) {
                continue;
            }
            cmd = $editors[name].commands;
            gtl = cmd.commands.gotoline;
            gtl.bindKey = cmd.commands.centerselection.bindKey;
            cmd.removeCommand('centerselection');
            cmd.addCommand(gtl);
        }
    }

    function bindUI() {
        D.getElementById('runcode').addEventListener('change', toggleLiveUpdates, false);
        D.getElementById('swizzle').addEventListener('click', swizzleData, false);
        W.addEventListener('resize', runLater(resizeWindow, 250), false);
    }

    function toggleLiveUpdates() {
        OPTS.runOnChange = D.getElementById('runcode').checked;

        if (OPTS.runOnChange) {
            updateCode('code');
        }
    }

    function swizzleData() {
        swizzleArray($data);
        updateCode('data');

        function swizzleArray(a) {
            var i, v;

            for (i = a.length; i--;) {
                v = a[i];

                if (typeof v == 'number') {
                    a[i] = swizzleNumber(v);
                }
                else if (v instanceof Array) swizzleArray(v);
                else if (v instanceof Object) swizzleObject(v);
            }
        }

        function swizzleNumber(n) {
            return n += (Math.random() - 0.5) * n / 5;
        }

        function swizzleObject(o) {
            var k, v;

            for (k in o) {
                if (!o.hasOwnProperty(k)) {
                    continue;
                }
                v = o[k];

                if (typeof v == 'number' && k != 'id') {
                    o[k] = swizzleNumber(v);
                }
                else if (v instanceof Array) swizzleArray(v);
                else if (v instanceof Object) swizzleObject(v);
            }
        }
    }

    function resizeWindow() {
        //C.debug('Resize Window');
        updateCode('resize');
    }

    function updateData() {
        //C.debug('Update Data');
        try {
            $data = eval($editors.data.getSession().getValue());
        } catch (err) {
            C.log('Updating data: ' + err.message);
        }
        updateCode('data');
    }

    function updateCSS() {
        //C.debug('Update CSS');
        try {
            $css.innerHTML = $editors.css.getSession().getValue();
        } catch (err) {
            C.log('Updating CSS: ' + err.message);
        }
        updateCode('css');
    }

    // Execute the code (maybe); changeSource is either 'data' or 'css' or 'resize'

    function updateCode(changeSource) {
        //C.debug('Update Code');
        if (!OPTS.runOnChange) {
            return;
        }
        if (typeof changeSource != 'string') {
            changeSource = 'code';
        }
        if (OPTS.runOnChangeOf[changeSource]) {
            if (OPTS.resetPGOnChangeOf[changeSource]) {
                resetPlayground();
            }
            runCode();
        }
    }

    // Manual invocation; intended to be hooked up to a button in the UI

    function runCode() {
        try {
            eval($editors.code.getSession().getValue());
        } catch (err) {
            C.log('Updating code: ' + err.message);
        }
    }

    function unlessErrorsIn(id, callback, delay) {
        var el, timer;

        el = D.getElementById(id);

        return function () {
            W.clearTimeout(timer);

            timer = W.setTimeout(function () {
                if (!el.querySelector('div_gutter-cell_error')) callback();
            }, delay); // DANGER: workers-css.js and workers-javascript.js must have timeouts below this
        }
    }

    // Runs the callback unless interrupted by another call within the delay

    function runLater(callback, delay) {
        var timer;

        return function () {
            W.clearTimeout(timer);
            timer = W.setTimeout(callback, delay);
        }
    }

    /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    // d3.js helpers
    // Create a function that returns a particular property of its parameter.
    // If that property is a function, invoke it (and pass optional params).

    ƒ = function (name) {
        var v, params;

        params = Array.prototype.slice.call(arguments, 1);

        return function (o) {
            return (typeof(v = o[name]) === 'function' ? v.apply(o, params) : v);
        };
    };

    I = function (d) {
        return d; // Return the first argument passed in
    };

    W.createSVG = function () {
        var svg = d3.select('#playground').selectAll('svg').data([0]);
        return svg.enter().append('svg').attr('viewBox', '0 0 100 100');
    };

}(window))
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
