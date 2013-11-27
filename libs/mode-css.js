define("ace/mode/css", ["require", "exports", "module", "ace/lib/oop", "ace/mode/text", "ace/tokenizer", "ace/mode/css_highlight_rules", "ace/mode/matching_brace_outdent", "ace/worker/worker_client", "ace/mode/folding/cstyle"], function (a, b, c) {
    "use strict";
    var d = a("../lib/oop"),
        e = a("./text").Mode,
        f = a("../tokenizer").Tokenizer,
        g = a("./css_highlight_rules").CssHighlightRules,
        h = a("./matching_brace_outdent").MatchingBraceOutdent,
        i = a("../worker/worker_client").WorkerClient,
        j = a("./folding/cstyle").FoldMode,
        k = function () {
        this.$tokenizer = new f((new g).getRules(), "i"),
        this.$outdent = new h,
        this.foldingRules = new j
    };
    d.inherits(k, e),


    function () {
        this.foldingRules = "cStyle",
        this.getNextLineIndent = function (a, b, c) {
            var d = this.$getIndent(b),
                e = this.$tokenizer.getLineTokens(b, a).tokens;
            if (e.length && e[e.length - 1].type == "comment") return d;
            var f = b.match(/^.*\{\s*$/);
            return f && (d += c),
            d
        },
        this.checkOutdent = function (a, b, c) {
            return this.$outdent.checkOutdent(b, c)
        },
        this.autoOutdent = function (a, b, c) {
            this.$outdent.autoOutdent(b, c)
        },
        this.createWorker = function (a) {
            var b = new i(["ace"], "worker-css.js", "ace/mode/css_worker", "Worker");
            return b.attachToDocument(a.getDocument()),
            b.on("csslint", function (b) {
                var c = [];
                b.data.forEach(function (a) {
                    c.push({
                        row: a.line - 1,
                        column: a.col - 1,
                        text: a.message,
                        type: a.type,
                        lint: a
                    })
                }),
                a.setAnnotations(c)
            }),
            b
        }
    }.call(k.prototype),
    b.Mode = k
}),
define("ace/mode/css_highlight_rules", ["require", "exports", "module", "ace/lib/oop", "ace/lib/lang", "ace/mode/text_highlight_rules"], function (a, b, c) {
    "use strict";
    var d = a("../lib/oop"),
        e = a("../lib/lang"),
        f = a("./text_highlight_rules").TextHighlightRules,
        g = function () {
        var a = e.arrayToMap("-moz-appearance|-moz-box-sizing|-webkit-box-sizing|-moz-outline-radius|-moz-transform|-webkit-transform|appearance|azimuth|background-attachment|background-color|background-image|background-origin|background-position|background-repeat|background|border-bottom-color|border-bottom-style|border-bottom-width|border-bottom|border-collapse|border-color|border-left-color|border-left-style|border-left-width|border-left|border-right-color|border-right-style|border-right-width|border-right|border-spacing|border-style|border-top-color|border-top-style|border-top-width|border-top|border-width|border|bottom|box-sizing|caption-side|clear|clip|color|content|counter-increment|counter-reset|cue-after|cue-before|cue|cursor|direction|display|elevation|empty-cells|float|font-family|font-size-adjust|font-size|font-stretch|font-style|font-variant|font-weight|font|height|left|letter-spacing|line-height|list-style-image|list-style-position|list-style-type|list-style|margin-bottom|margin-left|margin-right|margin-top|marker-offset|margin|marks|max-height|max-width|min-height|min-width|-moz-border-radius|opacity|orphans|outline-color|outline-offset|outline-radius|outline-style|outline-width|outline|overflow|overflow-x|overflow-y|padding-bottom|padding-left|padding-right|padding-top|padding|page-break-after|page-break-before|page-break-inside|page|pause-after|pause-before|pause|pitch-range|pitch|play-during|pointer-events|position|quotes|resize|richness|right|size|speak-header|speak-numeral|speak-punctuation|speech-rate|speak|stress|table-layout|text-align|text-decoration|text-indent|text-shadow|text-transform|top|transform|unicode-bidi|vertical-align|visibility|voice-family|volume|white-space|widows|width|word-spacing|z-index".split("|")),
            b = e.arrayToMap("rgb|rgba|url|attr|counter|counters".split("|")),
            c = e.arrayToMap("absolute|all-scroll|always|armenian|auto|baseline|below|bidi-override|block|bold|bolder|border-box|both|bottom|break-all|break-word|capitalize|center|char|circle|cjk-ideographic|col-resize|collapse|content-box|crosshair|dashed|decimal-leading-zero|decimal|default|disabled|disc|distribute-all-lines|distribute-letter|distribute-space|distribute|dotted|double|e-resize|ellipsis|fixed|georgian|groove|hand|hebrew|help|hidden|hiragana-iroha|hiragana|horizontal|ideograph-alpha|ideograph-numeric|ideograph-parenthesis|ideograph-space|inactive|inherit|inline-block|inline|inset|inside|inter-ideograph|inter-word|italic|justify|katakana-iroha|katakana|keep-all|left|lighter|line-edge|line-through|line|list-item|loose|lower-alpha|lower-greek|lower-latin|lower-roman|lowercase|lr-tb|ltr|medium|middle|move|n-resize|ne-resize|newspaper|no-drop|no-repeat|nw-resize|none|normal|not-allowed|nowrap|oblique|outset|outside|overline|pointer|progress|relative|repeat-x|repeat-y|repeat|right|ridge|row-resize|rtl|s-resize|scroll|se-resize|separate|small-caps|solid|square|static|strict|super|sw-resize|table-footer-group|table-header-group|tb-rl|text-bottom|text-top|text|thick|thin|top|transparent|underline|upper-alpha|upper-latin|upper-roman|uppercase|vertical-ideographic|vertical-text|visible|w-resize|wait|whitespace|zero".split("|")),
            d = e.arrayToMap("aqua|black|blue|fuchsia|gray|green|lime|maroon|navy|olive|orange|purple|red|silver|teal|white|yellow".split("|")),
            f = "\\-?(?:(?:[0-9]+)|(?:[0-9]*\\.[0-9]+))",
            g = [{
            token: "comment",
            merge: !0,
            regex: "\\/\\*",
            next: "ruleset_comment"},{
            token: "string",
            regex: '["](?:(?:\\\\.)|(?:[^"\\\\]))*?["]'},{
            token: "string",
            regex: "['](?:(?:\\\\.)|(?:[^'\\\\]))*?[']"},{
            token: "constant.numeric",
            regex: f + "(?:em|ex|px|cm|mm|in|pt|pc|deg|rad|grad|ms|s|hz|khz|%)"},{
            token: "constant.numeric",
            regex: "#[a-f0-9]{6}"},{
            token: "constant.numeric",
            regex: "#[a-f0-9]{3}"},{
            token: function (e) {
                return a.hasOwnProperty(e.toLowerCase()) ? "support.type" : b.hasOwnProperty(e.toLowerCase()) ? "support.function" : c.hasOwnProperty(e.toLowerCase()) ? "support.constant" : d.hasOwnProperty(e.toLowerCase()) ? "support.constant.color" : "text"
            },
            regex: "\\-?[a-zA-Z_][a-zA-Z0-9_\\-]*"}],
            h = e.copyArray(g);
        h.unshift({
            token: "paren.rparen",
            regex: "\\}",
            next: "start"
        });
        var i = e.copyArray(g);
        i.unshift({
            token: "paren.rparen",
            regex: "\\}",
            next: "media"
        });
        var j = [{
            token: "comment",
            merge: !0,
            regex: ".+"}],
            k = e.copyArray(j);
        k.unshift({
            token: "comment",
            regex: ".*?\\*\\/",
            next: "start"
        });
        var l = e.copyArray(j);
        l.unshift({
            token: "comment",
            regex: ".*?\\*\\/",
            next: "media"
        });
        var m = e.copyArray(j);
        m.unshift({
            token: "comment",
            regex: ".*?\\*\\/",
            next: "ruleset"
        }),
        this.$rules = {
            start: [{
                token: "comment",
                merge: !0,
                regex: "\\/\\*",
                next: "comment"},{
                token: "paren.lparen",
                regex: "\\{",
                next: "ruleset"},{
                token: "string",
                regex: "@.*?{",
                next: "media"},{
                token: "keyword",
                regex: "#[a-z0-9-_]+"},{
                token: "variable",
                regex: "\\.[a-z0-9-_]+"},{
                token: "string",
                regex: ":[a-z0-9-_]+"},{
                token: "constant",
                regex: "[a-z0-9-_]+"}],
            media: [{
                token: "comment",
                merge: !0,
                regex: "\\/\\*",
                next: "media_comment"},{
                token: "paren.lparen",
                regex: "\\{",
                next: "media_ruleset"},{
                token: "string",
                regex: "\\}",
                next: "start"},{
                token: "keyword",
                regex: "#[a-z0-9-_]+"},{
                token: "variable",
                regex: "\\.[a-z0-9-_]+"},{
                token: "string",
                regex: ":[a-z0-9-_]+"},{
                token: "constant",
                regex: "[a-z0-9-_]+"}],
            comment: k,
            ruleset: h,
            ruleset_comment: m,
            media_ruleset: i,
            media_comment: l
        }
    };
    d.inherits(g, f),
    b.CssHighlightRules = g
}),
define("ace/mode/matching_brace_outdent", ["require", "exports", "module", "ace/range"], function (a, b, c) {
    "use strict";
    var d = a("../range").Range,
        e = function () {};
    ((function () {
        this.checkOutdent = function (a, b) {
            return /^\s+$/.test(a) ? /^\s*\}/.test(b) : !1
        },
        this.autoOutdent = function (a, b) {
            var c = a.getLine(b),
                e = c.match(/^(\s*\})/);
            if (!e) return 0;
            var f = e[1].length,
                g = a.findMatchingBracket({
                row: b,
                column: f
            });
            if (!g || g.row == b) return 0;
            var h = this.$getIndent(a.getLine(g.row));
            a.replace(new d(b, 0, b, f - 1), h)
        },
        this.$getIndent = function (a) {
            var b = a.match(/^(\s+)/);
            return b ? b[1] : ""
        }
    })).call(e.prototype),
    b.MatchingBraceOutdent = e
}),
define("ace/mode/folding/cstyle", ["require", "exports", "module", "ace/lib/oop", "ace/range", "ace/mode/folding/fold_mode"], function (a, b, c) {
    "use strict";
    var d = a("../../lib/oop"),
        e = a("../../range").Range,
        f = a("./fold_mode").FoldMode,
        g = b.FoldMode = function () {};
    d.inherits(g, f),


    function () {
        this.foldingStartMarker = /(\{|\[)[^\}\]]*$|^\s*(\/\*)/,
        this.foldingStopMarker = /^[^\[\{]*(\}|\])|^[\s\*]*(\*\/)/,
        this.getFoldWidgetRange = function (a, b, c) {
            var d = a.getLine(c),
                f = d.match(this.foldingStartMarker);
            if (f) {
                var g = f.index;
                if (f[1]) return this.openingBracketBlock(a, f[1], c, g);
                var h = a.getCommentFoldRange(c, g + f[0].length);
                return h.end.column -= 2,
                h
            }
            if (b !== "markbeginend") return;
            var f = d.match(this.foldingStopMarker);
            if (f) {
                var g = f.index + f[0].length;
                if (f[2]) {
                    var h = a.getCommentFoldRange(c, g);
                    return h.end.column -= 2,
                    h
                }
                var i = {
                    row: c,
                    column: g
                },
                    j = a.$findOpeningBracket(f[1], i);
                if (!j) return;
                return j.column++,
                i.column--,
                e.fromPoints(j, i)
            }
        }
    }.call(g.prototype)
}),
define("ace/mode/folding/fold_mode", ["require", "exports", "module", "ace/range"], function (a, b, c) {
    "use strict";
    var d = a("../../range").Range,
        e = b.FoldMode = function () {};
    ((function () {
        this.foldingStartMarker = null,
        this.foldingStopMarker = null,
        this.getFoldWidget = function (a, b, c) {
            var d = a.getLine(c);
            return this.foldingStartMarker.test(d) ? "start" : b == "markbeginend" && this.foldingStopMarker && this.foldingStopMarker.test(d) ? "end" : ""
        },
        this.getFoldWidgetRange = function (a, b, c) {
            return null
        },
        this.indentationBlock = function (a, b, c) {
            var e = /^\s*/,
                f = b,
                g = b,
                h = a.getLine(b),
                i = c || h.length,
                j = h.match(e)[0].length,
                k = a.getLength();
            while (++b < k) {
                h = a.getLine(b);
                var l = h.match(e)[0].length;
                if (l == h.length) continue;
                if (l <= j) break;
                g = b
            }
            if (g > f) {
                var m = a.getLine(g).length;
                return new d(f, i, g, m)
            }
        },
        this.openingBracketBlock = function (a, b, c, e) {
            var f = {
                row: c,
                column: e + 1
            },
                g = a.$findClosingBracket(b, f);
            if (!g) return;
            var h = a.foldWidgets[g.row];
            return h == null && (h = this.getFoldWidget(a, g.row)),
            h == "start" && (g.row--, g.column = a.getLine(g.row).length),
            d.fromPoints(f, g)
        }
    })).call(e.prototype)
})
