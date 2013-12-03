/*jslint es5:true, white:false */
/*globals Util, $data:true, ace, d3, require, swizzle, window */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
(function (W) {
    var C, D, OPTS, $css, $playground, $editors, presets;
    C = W.console;
    D = W.document;

    OPTS = {
        tabSize: 4,
        theme: 'cobalt',
        useWrapMode: false,
        presetsURI: './presets/',
        // URI to presets; must end in "/"
        defaultPreset: 'drt',
        // Exact
        presetInHash: true,
        // Load preset from hash and set hash in usePreset()
        runOnChange: true,
        // Execute code during typing (all fields)?
        runOnChangeOf: {
            // Execute due to change of...
            code: true,
            data: true,
            css: false,
            resize: true
        },
        resetPGOnChangeOf: {
            // Erase playground before due to change of...
            code: true,
            data: false,
            css: false,
            resize: true
        }
    };

    function unlessErrorsIn(id, callback, delay) {
        var el, timer;

        el = D.getElementById(id);

        return function () {
            W.clearTimeout(timer);

            timer = W.setTimeout(function () {
                if (!el.querySelector('div_gutter-cell_error')) {
                    callback();
                }
            }, delay); // DANGER: workers-css.js and workers-javascript.js must have timeouts below this
        };
    }

    function resetPlayground() {
        //C.debug('Reset Playground');
        $playground.innerHTML = '';
    }

    function usePreset(presetName) {
        var path;

        if (typeof presetName !== 'string') {
            presetName = presets.value;
        }
        if (OPTS.presetInHash) {
            location.hash = Util.esc(presetName);
        }
        path = OPTS.presetsURI + presetName + '/' + presetName;

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

    // Load preset names from OPTS.presetsURI, load the default/hash, and setup load handlers

    function setupPresets() {
        var defaultName;

        defaultName = (OPTS.presetInHash && location.hash) ? //
        Util.unesc(location.hash.slice(1)) : //
        OPTS.defaultPreset;

        presets = D.getElementById('presets');
        presets.addEventListener('change', usePreset, false);

        d3.text(OPTS.presetsURI, function (html) {
            var names, i, sel;

            names = html.match(/[^<>]+(?=\/<\/a>)/g);

            for (i = 0; i < names.length; ++i) {
                sel = (names[i] === defaultName);
                presets.appendChild(new Option(names[i], names[i], sel, sel));
            }
            usePreset(defaultName);
        });
    }

    // Command-L on OS X conflicts with focusing address bar
    // Use Ctrl-L instead (and remove 'centerselection')

    function fixKeyboardShortcuts() {
        var name, cmd, gtl;

        for (name in $editors) {
            if ($editors.hasOwnProperty(name)) {
                cmd = $editors[name].commands;
                gtl = cmd.commands.gotoline;
                gtl.bindKey = cmd.commands.centerselection.bindKey;
                cmd.removeCommand('centerselection');
                cmd.addCommand(gtl);
            }
        }
    }

    // Manual invocation; intended to be hooked up to a button in the UI

    function runCode() {
        try {
            Util.evl($editors.code.getSession().getValue());
        } catch (err) {
            C.log('Updating code: ' + err.message);
        }
    }

    // Execute the code (maybe); changeSource is either 'data' or 'css' or 'resize'

    function updateCode(changeSource) {
        //C.debug('Update Code');
        if (!OPTS.runOnChange) {
            return;
        }
        if (typeof changeSource !== 'string') {
            changeSource = 'code';
        }
        if (OPTS.runOnChangeOf[changeSource]) {
            if (OPTS.resetPGOnChangeOf[changeSource]) {
                resetPlayground();
            }
            runCode();
        }
    }

    function swizzleData() {
        swizzle.array($data);
        updateCode('code');
    }

    function resizeWindow() {
        //C.debug('Resize Window');
        updateCode('resize');
    }

    function toggleLiveUpdates() {
        OPTS.runOnChange = D.getElementById('runcode').checked;

        if (OPTS.runOnChange) {
            updateCode('code');
        }
    }

    function bindUI() {
        D.getElementById('runcode').addEventListener('change', toggleLiveUpdates, false);
        D.getElementById('swizzle').addEventListener('click', swizzleData, false);
        W.addEventListener('resize', Util.runLater(resizeWindow, 250), false);
    }

    function updateData() {
        //C.debug('Update Data');
        try {
            $data = Util.evl($editors.data.getSession().getValue());
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

    // Fills out $editors with ACE editors

    function setupEditors() {
        var jsMode, cssMode, name, ed, session;

        jsMode = require('ace/mode/javascript').Mode;
        cssMode = require('ace/mode/css').Mode;

        for (name in $editors) {
            if ($editors.hasOwnProperty(name)) {
                ed = $editors[name] = ace.edit(name + '-editor');
                ed.setTheme('ace/theme/' + OPTS.theme);

                session = ed.getSession();
                session.setTabSize(OPTS.tabSize);
                session.setUseWrapMode(OPTS.useWrapMode);
                session.setMode(name === 'css' ? new cssMode() : new jsMode());
            }
        }
        $editors.data.getSession().on('change', unlessErrorsIn('data-editor', updateData, 250));
        $editors.code.getSession().on('change', unlessErrorsIn('code-editor', updateCode, 350));
        // CSS editor does not accept SVG CSS as valid, so update on every change
        $editors.css.getSession().on('change', Util.runLater(updateCSS, 350));
    }

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

}(window));

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
