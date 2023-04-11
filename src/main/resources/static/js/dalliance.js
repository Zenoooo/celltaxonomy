!function e(t, i, r) {
    function n(o, a) {
        if (!i[o]) {
            if (!t[o]) {
                var l = "function" == typeof require && require;
                if (!a && l) return l(o, !0);
                if (s) return s(o, !0);
                var h = new Error("Cannot find module '" + o + "'");
                throw h.code = "MODULE_NOT_FOUND", h
            }
            var u = i[o] = {exports: {}};
            t[o][0].call(u.exports, function (e) {
                var i = t[o][1][e];
                return n(i ? i : e)
            }, u, u.exports, e, t, i, r)
        }
        return i[o].exports
    }

    for (var s = "function" == typeof require && require, o = 0; o < r.length; o++) n(r[o]);
    return n
}({
    1: [function (e, t, i) {
        "use strict";

        function r() {
        }

        function n(e, t) {
            var i = t, r = u(e, i);
            i += 4;
            for (var n = 0; r > n; ++n) {
                var s = (u(e, i), u(e, i + 4));
                i += 8 + 16 * s
            }
            var o = u(e, i);
            i += 4;
            for (var a = 1e9, l = i, h = 0; o > h; ++h) {
                var c = v(e, l);
                if (l += 8, c) {
                    var d = c.block;
                    c.offset > 0 && (d += 65536), a > d && (a = d);
                    break
                }
            }
            return i += 8 * o, {minBlockIndex: a, nbin: r, length: i - t}
        }

        function s(e, t, i, r, n) {
            e.slice(0, 10).fetch(function (s) {
                return s ? o(e, t, i, r, n) : r(null, "Couldn't access BAM.")
            }, {timeout: 5e3})
        }

        function o(e, t, i, s, a) {
            function l(e) {
                if (!e) return s(null, "Couldn't access BAM");
                var t = g(e, e.byteLength), i = new Uint8Array(t), r = u(i, 0);
                if (r != b) return s(null, "Not a BAM file, magic=0x" + r.toString(16));
                for (var n = u(i, 4), o = "", a = 0; n > a; ++a) o += String.fromCharCode(i[a + 8]);
                var l = u(i, n + 8), h = n + 12;
                c.chrToIndex = {}, c.indexToChr = [];
                for (var a = 0; l > a; ++a) {
                    for (var d = u(i, h), p = "", f = 0; d - 1 > f; ++f) p += String.fromCharCode(i[h + 4 + f]);
                    u(i, h + d + 4);
                    c.chrToIndex[p] = a, 0 == p.indexOf("chr") ? c.chrToIndex[p.substring(3)] = a : c.chrToIndex["chr" + p] = a, c.indexToChr.push(p), h = h + 8 + d
                }
                return c.indices ? s(c) : void 0
            }

            function h(e) {
                if (!e) return "Couldn't access BAI";
                var t = new Uint8Array(e), i = u(t, 0);
                if (i != w) return s(null, "Not a BAI file, magic=0x" + i.toString(16));
                var r = u(t, 4);
                c.indices = [];
                for (var o = 8, a = 0; r > a; ++a) {
                    var l = o, h = n(t, l);
                    o += h.length, d = Math.min(h.minBlockIndex, d);
                    var p = h.nbin;
                    p > 0 && (c.indices[a] = new Uint8Array(e, l, o - l))
                }
                return !0
            }

            var c = new r;
            c.data = e, c.bai = t, c.indexChunks = i;
            var d = c.indexChunks ? c.indexChunks.minBlockIndex : 1e9;
            if (c.indexChunks) {
                var p = c.indexChunks.chunks;
                c.indices = [];
                for (var f = 0; f < p.length; f++) c.indices[f] = null;
                c.data.slice(0, d).fetch(l)
            } else c.bai.fetch(function (t) {
                var r = h(t);
                r !== !0 ? c.bai.url && "undefined" == typeof a ? (c.bai.url = c.data.url.replace(new RegExp(".bam$"), ".bai"), o(e, c.bai, i, s, !0)) : s(null, r) : c.data.slice(0, d).fetch(l)
            })
        }

        function a() {
        }

        if ("undefined" != typeof e) var l = e("./spans"), h = (l.Range, l.union, l.intersection, e("./bin")),
            u = h.readInt, c = h.readShort, d = h.readByte, p = (h.readInt64, h.readFloat), f = e("./lh3utils"),
            v = f.readVob, g = f.unbgzf, y = f.reg2bins, m = f.Chunk;
        var b = 21840194, w = 21578050, x = {
            MULTIPLE_SEGMENTS: 1,
            ALL_SEGMENTS_ALIGN: 2,
            SEGMENT_UNMAPPED: 4,
            NEXT_SEGMENT_UNMAPPED: 8,
            REVERSE_COMPLEMENT: 16,
            NEXT_REVERSE_COMPLEMENT: 32,
            FIRST_SEGMENT: 64,
            LAST_SEGMENT: 128,
            SECONDARY_ALIGNMENT: 256,
            QC_FAIL: 512,
            DUPLICATE: 1024,
            SUPPLEMENTARY: 2048
        };
        r.prototype.blocksForRange = function (e, t, i) {
            var r = this.indices[e];
            if (!r) return [];
            for (var n = y(t, i), s = [], o = 0; o < n.length; ++o) s[n[o]] = !0;
            for (var a = [], l = [], h = u(r, 0), c = 4, d = 0; h > d; ++d) {
                var p = u(r, c), f = u(r, c + 4);
                if (c += 8, s[p]) for (var g = 0; f > g; ++g) {
                    var b = v(r, c), w = v(r, c + 8);
                    (4681 > p ? l : a).push(new m(b, w)), c += 16
                } else c += 16 * f
            }
            for (var x = u(r, c), S = null, _ = Math.min(t >> 14, x - 1), C = Math.min(i >> 14, x - 1), o = _; C >= o; ++o) {
                var T = v(r, c + 4 + 8 * o);
                T && (!S || T.block < S.block || T.offset < S.offset) && (S = T)
            }
            var k = [];
            if (null != S) for (var o = 0; o < l.length; ++o) {
                var L = l[o];
                L.maxv.block >= S.block && L.maxv.offset >= S.offset && k.push(L)
            }
            l = k;
            for (var A = [], o = 0; o < l.length; ++o) A.push(l[o]);
            for (var o = 0; o < a.length; ++o) A.push(a[o]);
            A.sort(function (e, t) {
                var i = e.minv.block - t.minv.block;
                return 0 != i ? i : e.minv.offset - t.minv.offset
            });
            var O = [];
            if (A.length > 0) {
                for (var E = A[0], o = 1; o < A.length; ++o) {
                    var R = A[o];
                    R.minv.block == E.maxv.block ? E = new m(E.minv, R.maxv) : (O.push(E), E = R)
                }
                O.push(E)
            }
            return O
        }, r.prototype.fetch = function (e, t, i, r, n) {
            function s() {
                if (d >= a.length) return r(c);
                if (u) {
                    var e = new Uint8Array(u), h = o.readBamRecords(e, a[d].minv.offset, c, t, i, l, n);
                    return u = null, ++d, h ? r(c) : s()
                }
                var p = a[d], f = p.minv.block, v = p.maxv.block + 65536;
                o.data.slice(f, v - f).fetch(function (e) {
                    return u = g(e, p.maxv.block - p.minv.block + 1), s()
                })
            }

            var o = this;
            n = n || {};
            var a, l = this.chrToIndex[e];
            if (void 0 === l) a = []; else {
                if (null === this.indices[l] && this.indexChunks.chunks[l]) {
                    var h = this.indexChunks.chunks[l];
                    return this.bai.slice(h[0], h[1]).fetch(function (s) {
                        var o = new Uint8Array(s);
                        return this.indices[l] = o, this.fetch(e, t, i, r, n)
                    }.bind(this))
                }
                a = this.blocksForRange(l, t, i), a || r(null, "Error in index fetch")
            }
            var u, c = [], d = 0;
            s()
        };
        var S = ["=", "A", "C", "x", "G", "x", "x", "x", "T", "x", "x", "x", "x", "x", "x", "N"],
            _ = ["M", "I", "D", "N", "S", "H", "P", "=", "X", "?", "?", "?", "?", "?", "?", "?"];
        r.prototype.readBamRecords = function (e, t, i, r, n, s, o) {
            for (; ;) {
                var l = u(e, t), h = t + l + 4;
                if (h >= e.length) return !1;
                var f = new a, v = u(e, t + 4), g = u(e, t + 8), y = u(e, t + 12), m = (65280 & y) >> 8, b = 255 & y,
                    w = u(e, t + 16), x = (4294901760 & w) >> 16, C = 65535 & w, T = u(e, t + 20), k = u(e, t + 24),
                    L = u(e, t + 28);
                u(e, t + 32);
                if (f.segment = this.indexToChr[v], f.flag = x, f.pos = g, f.mq = m, o.light && (f.seqLength = T), !o.light) {
                    k >= 0 && (f.nextSegment = this.indexToChr[k], f.nextPos = L);
                    for (var A = "", O = 0; b - 1 > O; ++O) A += String.fromCharCode(e[t + 36 + O]);
                    f.readName = A;
                    for (var E = t + 36 + b, R = "", B = 0; C > B; ++B) {
                        var M = u(e, E);
                        R = R + (M >> 4) + _[15 & M], E += 4
                    }
                    f.cigar = R;
                    for (var I = "", H = T + 1 >> 1, O = 0; H > O; ++O) {
                        var P = e[E + O];
                        I += S[(240 & P) >> 4], I.length < T && (I += S[15 & P])
                    }
                    E += H, f.seq = I;
                    for (var F = "", O = 0; T > O; ++O) F += String.fromCharCode(e[E + O] + 33);
                    for (E += T, f.quals = F; h > E;) {
                        var N, G = String.fromCharCode(e[E], e[E + 1]), D = String.fromCharCode(e[E + 2]);
                        if ("A" == D) N = String.fromCharCode(e[E + 3]), E += 4; else if ("i" == D || "I" == D) N = u(e, E + 3), E += 7; else if ("c" == D || "C" == D) N = e[E + 3], E += 4; else if ("s" == D || "S" == D) N = c(e, E + 3), E += 5; else if ("f" == D) N = p(e, E + 3), E += 7; else if ("Z" == D || "H" == D) for (E += 3, N = ""; ;) {
                            var q = e[E++];
                            if (0 == q) break;
                            N += String.fromCharCode(q)
                        } else {
                            if ("B" != D) throw"Unknown type " + D;
                            var U, z, W = String.fromCharCode(e[E + 3]), V = u(e, E + 4);
                            if ("i" == W || "I" == W || "f" == W) U = 4, z = "f" == W ? p : u; else if ("s" == W || "S" == W) U = 2, z = c; else {
                                if ("c" != W && "C" != W) throw"Unknown array type " + W;
                                U = 1, z = d
                            }
                            E += 8, N = [];
                            for (var X = 0; V > X; ++X) N.push(z(e, E)), E += U
                        }
                        f[G] = N
                    }
                }
                if ((!r || f.pos <= n && f.pos + T >= r) && (void 0 === s || v == s) && i.push(f), f.pos > n) return !0;
                t = h
            }
        }, "undefined" != typeof t && (t.exports = {makeBam: s, BAM_MAGIC: b, BAI_MAGIC: w, BamFlags: x})
    }, {"./bin": 4, "./lh3utils": 24, "./spans": 36}],
    2: [function (e, t, i) {
        "use strict";

        function r(e) {
            this.type = e
        }

        function n(e, t) {
            this.parser = e, this.sink = t
        }

        function s(e, t) {
            this.parser = e, this.sink = t, this.wigState = null
        }

        if ("undefined" != typeof e) var o = e("./spans"), a = o.Range, l = o.union, h = o.intersection,
            u = e("./sourceadapters"), c = u.registerParserFactory, d = e("./das"), p = d.DASStylesheet, f = d.DASStyle,
            v = (d.DASFeature, d.DASGroup), g = e("./utils"), y = g.shallowCopy;
        r.prototype.createSession = function (e) {
            return "wig" == this.type ? new s(this, e) : new n(this, e)
        };
        var m = /([^=]+)=(.+)/, b = /\s/, w = new RegExp("^[0-9]+,[0-9]+,[0-9]+");
        n.prototype.parse = function (e) {
            var t = e.split(b);
            if (!(t.length < 3)) {
                var i = parseInt(t[1]) + 1, r = parseInt(t[2]), n = {segment: t[0], min: i, max: r};
                if (t.length > 3 && "." !== t[3] && (n.label = t[3]), t.length > 4 && (n.score = parseFloat(t[4])), t.length > 5 && (n.orientation = t[5]), t.length > 8) {
                    var s = t[8];
                    w.test(s) && (n.itemRgb = "rgb(" + s + ")")
                }
                if (t.length >= 12) {
                    var o = parseInt(t[6]), u = parseInt(t[7]), c = parseInt(t[9]),
                        d = t[10].split(",").map(function (e) {
                            return parseInt(e)
                        }), p = t[11].split(",").map(function (e) {
                            return parseInt(e)
                        });
                    n.type = "transcript";
                    var f = new v;
                    if (f.id = t[3], f.type = "transcript", f.notes = [], n.groups = [f], t.length > 12) {
                        var g = t[12], m = g;
                        t.length > 13 && (m = t[13]);
                        var x = new v;
                        x.id = g, x.label = m, x.type = "gene", n.groups.push(x)
                    }
                    for (var S = null, _ = 0; c > _; ++_) {
                        var C = p[_] + i, T = C + d[_], k = new a(C, T);
                        S = S ? l(S, k) : k
                    }
                    for (var L = S.ranges(), A = 0; A < L.length; ++A) {
                        var O = L[A], E = y(n);
                        E.min = O.min(), E.max = O.max(), this.sink(E)
                    }
                    if (u > o) {
                        var R = "+" == n.orientation ? new a(o, u + 3) : new a(o - 3, u), B = h(S, R);
                        if (B) {
                            n.type = "translation";
                            for (var M = B.ranges(), I = 0, A = 0; A < M.length; ++A) {
                                var H = A;
                                "-" == n.orientation && (H = M.length - A - 1);
                                var O = M[H], E = y(n);
                                E.min = O.min(), E.max = O.max(), n.readframe = I;
                                var P = O.max() - O.min();
                                I = (I + P) % 3, this.sink(E)
                            }
                        }
                    }
                } else this.sink(n)
            }
        }, n.prototype.flush = function () {
        }, s.prototype.parse = function (e) {
            var t = e.split(b);
            if ("fixedStep" == t[0]) {
                this.wigState = "fixedStep", this.chr = this.pos = this.step = null, this.span = 1;
                for (var i = 1; i < t.length; ++i) {
                    var r = m.exec(t[i]);
                    r && ("chrom" == r[1] ? this.chr = r[2] : "start" == r[1] ? this.pos = parseInt(r[2]) : "step" == r[1] ? this.step = parseInt(r[2]) : "span" == r[1] && (this.span = parseInt(r[2])))
                }
            } else if ("variableStep" == t[0]) {
                this.wigState = "variableStep", this.chr = null, this.span = 1;
                for (var i = 1; i < t.length; ++i) {
                    var r = m.exec(t[i]);
                    "chrom" == r[1] ? this.chr = r[2] : "span" == r[1] && (this.span = parseInt(r[2]))
                }
            } else if (this.wigState) {
                if ("fixedStep" == this.wigState) {
                    if (1 != t.length) return;
                    var n = parseFloat(t[0]),
                        s = {segment: this.chr, min: this.pos, max: this.pos + this.span - 1, score: n};
                    this.pos += this.step, this.sink(s)
                } else if ("variableStep" == this.wigState) {
                    if (2 != t.length) return;
                    var o = parseInt(t[0]), n = parseFloat(t[1]),
                        s = {segment: this.chr, min: o, max: o + this.span - 1, score: n};
                    this.sink(s)
                }
            } else {
                if (t.length < 4) return;
                var s = {segment: t[0], min: parseInt(t[1]) + 1, max: parseInt(t[2]), score: parseFloat(t[3])};
                this.sink(s)
            }
        }, s.prototype.flush = function () {
        }, r.prototype.getStyleSheet = function (e) {
            var t = new p;
            if ("wig" == this.type) {
                var i = new f;
                i.glyph = "HISTOGRAM", i.BGCOLOR = "blue", i.HEIGHT = 30, t.pushStyle({type: "default"}, null, i)
            } else {
                var i = new f;
                i.glyph = "BOX", i.FGCOLOR = "black", i.BGCOLOR = "blue", i.HEIGHT = 8, i.BUMP = !0, i.LABEL = !0, i.ZINDEX = 20, t.pushStyle({type: "default"}, null, i);
                var i = new f;
                i.glyph = "BOX", i.FGCOLOR = "black", i.BGCOLOR = "red", i.HEIGHT = 10, i.BUMP = !0, i.ZINDEX = 20, t.pushStyle({type: "translation"}, null, i);
                var r = new f;
                r.glyph = "BOX", r.FGCOLOR = "black", r.BGCOLOR = "white", r.HEIGHT = 10, r.ZINDEX = 10, r.BUMP = !0, r.LABEL = !0, t.pushStyle({type: "transcript"}, null, r);
                var n = new f;
                n.glyph = "HISTOGRAM", n.COLOR1 = "white", n.COLOR2 = "black", n.HEIGHT = 30, t.pushStyle({type: "density"}, null, n)
            }
            return e(t)
        }, c("bed", function (e) {
            return new r(e)
        }), c("wig", function (e) {
            return new r(e)
        })
    }, {"./das": 10, "./sourceadapters": 34, "./spans": 36, "./utils": 49}],
    3: [function (e, t, i) {
        "use strict";

        function r(e, t) {
            var i = e[t] + e[t + 1] * O + e[t + 2] * E + e[t + 3] * R + e[t + 4] * B;
            return i
        }

        function n() {
        }

        function s(e, t, i, r) {
            this.bwg = e, this.cirTreeOffset = t, this.cirTreeLength = i, this.isSummary = r
        }

        function o(e, t, i) {
            var s = new n;
            s.data = e, s.name = i, s.data.slice(0, 512).salted().fetch(function (e) {
                if (!e) return t(null, "Couldn't fetch file");
                var i = e, n = new Uint8Array(i), o = new Int16Array(i), a = new Int32Array(i),
                    l = n[0] + O * n[1] + E * n[2] + R * n[3];
                if (l == S) s.type = "bigwig"; else {
                    if (l != C) return l == _ || l == T ? t(null, "Currently don't support big-endian BBI files") : t(null, "Not a supported format, magic=0x" + l.toString(16));
                    s.type = "bigbed"
                }
                s.version = o[2], s.numZoomLevels = o[3], s.chromTreeOffset = r(n, 8), s.unzoomedDataOffset = r(n, 16), s.unzoomedIndexOffset = r(n, 24), s.fieldCount = o[16], s.definedFieldCount = o[17], s.asOffset = r(n, 36), s.totalSummaryOffset = r(n, 44), s.uncompressBufSize = a[13], s.extHeaderOffset = r(n, 56), s.zoomLevels = [];
                for (var h = 0; h < s.numZoomLevels; ++h) {
                    var u = a[6 * h + 16], c = r(n, 24 * h + 72), d = r(n, 24 * h + 80);
                    s.zoomLevels.push({reduction: u, dataOffset: c, indexOffset: d})
                }
                s.readChromTree(function () {
                    s.getAutoSQL(function (e) {
                        return s.schema = e, t(s)
                    })
                })
            }, {timeout: 5e3})
        }

        function a(e, t, i, r, n) {
            this.bbi = e, this.type = t, this.fieldCount = i, this.offset = r, this.field = n
        }

        if ("undefined" != typeof e) var l = e("./spans"), h = l.Range, u = l.union, c = l.intersection, d = e("./das"),
            p = d.DASFeature, f = d.DASGroup, v = e("./utils"), g = v.shallowCopy, y = e("./bin"), m = y.readInt,
            b = e("jszlib"), w = b.inflateBuffer, x = b.arrayCopy;
        var S = 2291137574, _ = 654086024, C = 2273964779, T = 3958540679, k = 1, L = 2, A = 3, O = 256, E = 65536,
            R = 16777216, B = 4294967296, M = new RegExp("^[0-9]+,[0-9]+,[0-9]+");
        n.prototype.readChromTree = function (e) {
            var t = this;
            this.chromsToIDs = {}, this.idsToChroms = {}, this.maxID = 0;
            var i = this.unzoomedDataOffset, n = i - this.chromTreeOffset & 3;
            i = i + 4 - n, this.data.slice(this.chromTreeOffset, i - this.chromTreeOffset).fetch(function (i) {
                var n = new Uint8Array(i), s = new Int16Array(i), o = new Int32Array(i), a = (o[0], o[1], o[2]),
                    l = (o[3], r(n, 16), 32), h = function (e) {
                        var i = n[e], o = s[e / 2 + 1];
                        e += 4;
                        for (var l = 0; o > l; ++l) if (0 == i) {
                            e += a;
                            var u = r(n, e);
                            e += 8, u -= t.chromTreeOffset, h(u)
                        } else {
                            for (var c = "", d = 0; a > d; ++d) {
                                var p = n[e++];
                                0 != p && (c += String.fromCharCode(p))
                            }
                            var f = n[e + 3] << 24 | n[e + 2] << 16 | n[e + 1] << 8 | n[e + 0];
                            n[e + 7] << 24 | n[e + 6] << 16 | n[e + 5] << 8 | n[e + 4];
                            e += 8, t.chromsToIDs[c] = f, 0 == c.indexOf("chr") && (t.chromsToIDs[c.substr(3)] = f), t.idsToChroms[f] = c, t.maxID = Math.max(t.maxID, f)
                        }
                    };
                h(l), e(t)
            })
        }, s.prototype.readWigData = function (e, t, i, r) {
            var n = this.bwg.chromsToIDs[e];
            return void 0 === n ? r([]) : void this.readWigDataById(n, t, i, r)
        }, s.prototype.readWigDataById = function (e, t, i, n) {
            var s = this;
            if (!this.cirHeader) return void this.bwg.data.slice(this.cirTreeOffset, 48).fetch(function (r) {
                s.cirHeader = r;
                var o = new Int32Array(s.cirHeader);
                s.cirBlockSize = o[1], s.readWigDataById(e, t, i, n)
            });
            var o = [], a = 0, l = (Date.now(), function (r, n, s, o) {
                return (0 > e || r == e) && i >= n && s >= t
            }), c = function (e, t) {
                if (s.bwg.instrument && console.log("level=" + t + "; offset=" + e + "; time=" + (0 | Date.now())), a += e.length, 1 == e.length && e[0] - s.cirTreeOffset == 48 && s.cachedCirRoot) return p(s.cachedCirRoot, 0, t), --a, void(0 == a && s.fetchFeatures(l, o, n));
                for (var i, r = 4 + 32 * s.cirBlockSize, c = 0; c < e.length; ++c) {
                    var f = new h(e[c], e[c] + r);
                    i = i ? u(i, f) : f
                }
                for (var v = i.ranges(), g = 0; g < v.length; ++g) {
                    var y = v[g];
                    d(e, y, t)
                }
            }, d = function (e, t, i, r) {
                t.max() - t.min();
                s.bwg.data.slice(t.min(), t.max() - t.min()).fetch(function (r) {
                    for (var h = 0; h < e.length; ++h) t.contains(e[h]) && (p(r, e[h] - t.min(), i), e[h] - s.cirTreeOffset == 48 && e[h] - t.min() == 0 && (s.cachedCirRoot = r), --a, 0 == a && s.fetchFeatures(l, o, n))
                })
            }, p = function (n, s, a) {
                var l = new Uint8Array(n), h = new Int16Array(n), u = new Int32Array(n), d = l[s], p = h[s / 2 + 1];
                if (s += 4, 0 != d) for (var f = 0; p > f; ++f) {
                    var v = s / 4, g = u[v], y = u[v + 1], m = u[v + 2], b = u[v + 3], w = r(l, s + 16),
                        x = r(l, s + 24);
                    (0 > e || e > g || g == e && i >= y) && (0 > e || m > e || m == e && b >= t) && o.push({
                        offset: w,
                        size: x
                    }), s += 32
                } else {
                    for (var S = [], f = 0; p > f; ++f) {
                        var v = s / 4, g = u[v], y = u[v + 1], m = u[v + 2], b = u[v + 3], w = r(l, s + 16);
                        (0 > e || e > g || g == e && i >= y) && (0 > e || m > e || m == e && b >= t) && S.push(w), s += 24
                    }
                    S.length > 0 && c(S, a + 1)
                }
            };
            c([s.cirTreeOffset + 48], 1)
        }, s.prototype.fetchFeatures = function (e, t, i) {
            var r = this;
            if (t.sort(function (e, t) {
                return (0 | e.offset) - (0 | t.offset)
            }), 0 == t.length) i([]); else {
                var n = [], s = function (e, t, i, s) {
                    s || (s = {});
                    var o = new p;
                    o._chromId = e, o.segment = r.bwg.idsToChroms[e], o.min = t, o.max = i, o.type = r.bwg.type;
                    for (var a in s) o[a] = s[a];
                    n.push(o)
                }, o = function () {
                    if (0 == t.length) {
                        Date.now();
                        return void i(n)
                    }
                    var a = t[0];
                    if (a.data) r.parseFeatures(a.data, s, e), t.splice(0, 1), o(); else {
                        for (var l = a.offset, h = a.size, u = 1; u < t.length && t[u].offset == l + h;) h += t[u].size, ++u;
                        r.bwg.data.slice(l, h).fetch(function (e) {
                            for (var i = 0, n = 0; h > i;) {
                                var s, a = t[n];
                                if (r.bwg.uncompressBufSize > 0) s = w(e, i + 2, a.size - 2); else {
                                    var l = new Uint8Array(a.size);
                                    x(new Uint8Array(e, i, a.size), 0, l, 0, a.size), s = l.buffer
                                }
                                a.data = s, i += a.size, ++n
                            }
                            o()
                        })
                    }
                };
                o()
            }
        }, s.prototype.parseFeatures = function (e, t, i) {
            var r = new Uint8Array(e);
            if (this.isSummary) for (var n = new Int16Array(e), s = new Int32Array(e), o = new Float32Array(e), a = e.byteLength / 32, l = 0; a > l; ++l) {
                var d = s[8 * l], p = s[8 * l + 1], v = s[8 * l + 2], y = s[8 * l + 3],
                    m = (o[8 * l + 4], o[8 * l + 5]), b = o[8 * l + 6];
                o[8 * l + 7];
                if (i(d, p + 1, v)) {
                    var w = {type: "bigwig", score: b / y, maxScore: m};
                    "bigbed" == this.bwg.type && (w.type = "density"), t(d, p + 1, v, w)
                }
            } else if ("bigwig" == this.bwg.type) {
                var n = new Int16Array(e), s = new Int32Array(e), o = new Float32Array(e), d = s[0], x = s[1],
                    S = (s[2], s[3]), _ = s[4], C = r[20], a = n[11];
                if (C == A) for (var l = 0; a > l; ++l) {
                    var T = o[l + 6], O = x + l * S + 1, E = x + l * S + _;
                    i(d, O, E) && t(d, O, E, {score: T})
                } else if (C == L) for (var l = 0; a > l; ++l) {
                    var p = s[2 * l + 6] + 1, v = p + _ - 1, T = o[2 * l + 7];
                    i(d, p, v) && t(d, p, v, {score: T})
                } else if (C == k) for (var l = 0; a > l; ++l) {
                    var p = s[3 * l + 6] + 1, v = s[3 * l + 7], T = o[3 * l + 8];
                    p > v && (p = v), i(d, p, v) && t(d, p, v, {score: T})
                } else console.log("Currently not handling bwgType=" + C)
            } else {
                if ("bigbed" != this.bwg.type) throw Error("Don't know what to do with " + this.bwg.type);
                for (var R = 0, B = this.bwg.definedFieldCount, I = this.bwg.schema; R < r.length;) {
                    var d = r[R + 3] << 24 | r[R + 2] << 16 | r[R + 1] << 8 | r[R + 0],
                        p = r[R + 7] << 24 | r[R + 6] << 16 | r[R + 5] << 8 | r[R + 4],
                        v = r[R + 11] << 24 | r[R + 10] << 16 | r[R + 9] << 8 | r[R + 8];
                    R += 12;
                    for (var H = ""; ;) {
                        var P = r[R++];
                        if (0 == P) break;
                        H += String.fromCharCode(P)
                    }
                    var F, N = {};
                    if (F = H.length > 0 ? H.split("	") : [], F.length > 0 && B > 3 && (N.label = F[0]), F.length > 1 && B > 4) {
                        var T = parseInt(F[1]);
                        isNaN(T) || (N.score = T)
                    }
                    if (F.length > 2 && B > 5 && (N.orientation = F[2]), F.length > 5 && B > 8) {
                        var G = F[5];
                        M.test(G) && (N.itemRgb = "rgb(" + G + ")")
                    }
                    if (F.length > B - 3 && I) for (var D = B - 3; D < F.length; ++D) N[I.fields[D + 3].name] = F[D];
                    if (i(d, p + 1, v, F)) if (12 > B) t(d, p + 1, v, N); else {
                        var q = 0 | F[3], U = 0 | F[4], z = 0 | F[6], W = F[7].split(","), V = F[8].split(",");
                        if (N.exonFrames) {
                            var X = N.exonFrames.split(",");
                            N.exonFrames = void 0
                        }
                        N.type = "transcript";
                        var j = new f;
                        for (var K in N) j[K] = N[K];
                        if (j.id = F[0], j.segment = this.bwg.idsToChroms[d], j.min = p + 1, j.max = v, j.notes = [], N.groups = [j], F.length > 9) {
                            var Z = N.geneName || F[9], Q = Z;
                            F.length > 10 && (Q = F[10]), N.geneName2 && (Q = N.geneName2);
                            var Y = g(j);
                            Y.id = Z, Y.label = Q, Y.type = "gene", N.groups.push(Y)
                        }
                        for (var $ = [], J = 0; z > J; ++J) {
                            var ee = (0 | V[J]) + p, te = ee + (0 | W[J]), ie = new h(ee, te);
                            $.push(ie)
                        }
                        for (var re = u($), ne = re.ranges(), se = 0; se < ne.length; ++se) {
                            var oe = ne[se];
                            t(d, oe.min() + 1, oe.max(), N)
                        }
                        if (U > q) {
                            var ae = "+" == N.orientation ? new h(q, U + 3) : new h(q - 3, U), le = c(re, ae);
                            if (le) {
                                N.type = "translation";
                                for (var he = le.ranges(), ue = 0, ce = 0; he[0].min() > ne[ce].max();) ce++;
                                for (var se = 0; se < he.length; ++se) {
                                    var de = se;
                                    "-" == N.orientation && (de = he.length - se - 1);
                                    var oe = he[de];
                                    if (N.readframe = ue, X) {
                                        var pe = parseInt(X[de + ce]);
                                        "number" == typeof pe && pe >= 0 && 2 >= pe && (N.readframe = pe, N.readframeExplicit = !0)
                                    }
                                    var fe = oe.max() - oe.min();
                                    ue = (ue + fe) % 3, t(d, oe.min() + 1, oe.max(), N)
                                }
                            }
                        }
                    }
                }
            }
        }, s.prototype.getFirstAdjacent = function (e, t, i, r) {
            var n = this.bwg.chromsToIDs[e];
            return void 0 === n ? r([]) : void this.getFirstAdjacentById(n, t, i, r)
        }, s.prototype.getFirstAdjacentById = function (e, t, i, n) {
            var s = this;
            if (!this.cirHeader) return void this.bwg.data.slice(this.cirTreeOffset, 48).fetch(function (r) {
                s.cirHeader = r;
                var o = new Int32Array(s.cirHeader);
                s.cirBlockSize = o[1], s.getFirstAdjacentById(e, t, i, n)
            });
            var o = null, a = -1, l = -1, c = 0, d = (Date.now(), function (e, t) {
                c += e.length;
                for (var i, r = 4 + 32 * s.cirBlockSize, n = 0; n < e.length; ++n) {
                    var o = new h(e[n], e[n] + r);
                    i = i ? u(i, o) : o
                }
                for (var a = i.ranges(), l = 0; l < a.length; ++l) {
                    var d = a[l];
                    p(e, d, t)
                }
            }), p = function (r, a, l, h) {
                a.max() - a.min();
                s.bwg.data.slice(a.min(), a.max() - a.min()).fetch(function (h) {
                    for (var u = 0; u < r.length; ++u) if (a.contains(r[u]) && (f(h, r[u] - a.min(), l), --c, 0 == c)) {
                        if (!o) return i > 0 && (0 != e || t > 0) ? s.getFirstAdjacentById(0, 0, i, n) : 0 > i && (e != s.bwg.maxID || 1e9 > t) ? s.getFirstAdjacentById(s.bwg.maxID, 1e9, i, n) : n([]);
                        s.fetchFeatures(function (r, n, s, o) {
                            return 0 > i && (e > r || t > s) || i > 0 && (r > e || n > t)
                        }, [o], function (e) {
                            for (var t = null, r = -1, s = -1, o = 0; o < e.length; ++o) {
                                var a = e[o], l = a._chromId, h = a.min, u = a.max;
                                (null == t || 0 > i && (l > r || u > s) || i > 0 && (r > l || s > h)) && (t = a, s = 0 > i ? u : h, r = l)
                            }
                            return n(null != t ? [t] : [])
                        })
                    }
                })
            }, f = function (n, h, u) {
                var c = new Uint8Array(n), p = new Int16Array(n), f = new Int32Array(n), v = c[h], g = p[h / 2 + 1];
                if (h += 4, 0 != v) for (var y = 0; g > y; ++y) {
                    var m = h / 4, b = f[m], w = f[m + 1], x = f[m + 2], S = f[m + 3], _ = r(c, h + 16),
                        C = r(c, h + 24);
                    (0 > i && (e > b || b == e && t >= w) || i > 0 && (x > e || x == e && S >= t)) && (/_random/.exec(s.bwg.idsToChroms[b]) || (null == o || 0 > i && (x > a || x == a && S > l) || i > 0 && (a > b || b == a && l > w)) && (o = {
                        offset: _,
                        size: C
                    }, l = 0 > i ? S : w, a = 0 > i ? x : b)), h += 32
                } else {
                    for (var T = -1, k = -1, L = -1, y = 0; g > y; ++y) {
                        var m = h / 4, b = f[m], w = f[m + 1], x = f[m + 2], S = f[m + 3],
                            _ = f[m + 4] << 32 | f[m + 5];
                        (0 > i && (e > b || b == e && t >= w) && x >= e || i > 0 && (x > e || x == e && S >= t) && e >= b) && (0 > T || S > k) && (T = _, k = 0 > i ? S : w, L = 0 > i ? x : b), h += 24
                    }
                    T >= 0 && d([T], u + 1)
                }
            };
            d([s.cirTreeOffset + 48], 1)
        }, n.prototype.readWigData = function (e, t, i, r) {
            this.getUnzoomedView().readWigData(e, t, i, r)
        }, n.prototype.getUnzoomedView = function () {
            if (!this.unzoomedView) {
                var e = 4e3, t = this.zoomLevels[0];
                t && (e = this.zoomLevels[0].dataOffset - this.unzoomedIndexOffset), this.unzoomedView = new s(this, this.unzoomedIndexOffset, e, !1)
            }
            return this.unzoomedView
        }, n.prototype.getZoomedView = function (e) {
            var t = this.zoomLevels[e];
            return t.view || (t.view = new s(this, t.indexOffset, 4e3, !0)), t.view
        }, n.prototype._tsFetch = function (e, t, i, r, n) {
            var s = this;
            if (!(e >= this.zoomLevels.length - 1)) {
                var o;
                return o = 0 > e ? this.getUnzoomedView() : this.getZoomedView(e), o.readWigDataById(t, i, r, n)
            }
            if (this.topLevelReductionCache) {
                for (var a = [], l = this.topLevelReductionCache, h = 0; h < l.length; ++h) l[h]._chromId == t && a.push(l[h]);
                return n(a)
            }
            this.getZoomedView(this.zoomLevels.length - 1).readWigDataById(-1, 0, 3e8, function (o) {
                return s.topLevelReductionCache = o, s._tsFetch(e, t, i, r, n)
            })
        }, n.prototype.thresholdSearch = function (e, t, i, r, n) {
            function s() {
                if (0 == l.length) return n(null);
                l.sort(function (e, t) {
                    var r = e.zoom - t.zoom;
                    return 0 != r ? r : (r = e.chrOrd - t.chrOrd, 0 != r ? r : e.min - t.min * i)
                });
                var e = l.splice(0, 1)[0];
                o._tsFetch(e.zoom, e.chr, e.min, e.max, function (o) {
                    var a = i > 0 ? 0 : 3e8;
                    e.fromRef && (a = t);
                    for (var h = 0; h < o.length; ++h) {
                        var u, c = o[h];
                        if (u = void 0 != c.maxScore ? c.maxScore : c.score, i > 0) {
                            if (u > r) if (e.zoom < 0) {
                                if (c.min > a) return n(c)
                            } else c.max > a && l.push({
                                chr: e.chr,
                                chrOrd: e.chrOrd,
                                zoom: e.zoom - 2,
                                min: c.min,
                                max: c.max,
                                fromRef: e.fromRef
                            })
                        } else if (u > r) if (e.zoom < 0) {
                            if (c.max < a) return n(c)
                        } else c.min < a && l.push({
                            chr: e.chr,
                            chrOrd: e.chrOrd,
                            zoom: e.zoom - 2,
                            min: c.min,
                            max: c.max,
                            fromRef: e.fromRef
                        })
                    }
                    s()
                })
            }

            i = 0 > i ? -1 : 1;
            for (var o = this, a = this.chromsToIDs[e], l = [{
                chrOrd: 0,
                chr: a,
                zoom: o.zoomLevels.length - 4,
                min: 0,
                max: 3e8,
                fromRef: !0
            }], h = 1; h <= this.maxID + 1; ++h) {
                var u = (a + i * h) % (this.maxID + 1);
                0 > u && (u += this.maxID + 1), l.push({
                    chrOrd: h,
                    chr: u,
                    zoom: o.zoomLevels.length - 1,
                    min: 0,
                    max: 3e8
                })
            }
            s()
        }, n.prototype.getAutoSQL = function (e) {
            return this.asOffset ? void this.data.slice(this.asOffset, 2048).fetch(function (t) {
                for (var i = new Uint8Array(t), r = "", n = 0; n < i.length && 0 != i[n]; ++n) r += String.fromCharCode(i[n]);
                var s = /(\w+)\s+(\w+)\s+("([^"]+)")?\s+\(\s*/, o = /([\w\[\]]+)\s+(\w+)\s*;\s*("([^"]+)")?\s*/g,
                    a = s.exec(r);
                if (a) {
                    var l = {declType: a[1], name: a[2], comment: a[4], fields: []};
                    r = r.substring(a[0]);
                    for (var h = o.exec(r); null != h; h = o.exec(r)) l.fields.push({
                        type: h[1],
                        name: h[2],
                        comment: h[4]
                    });
                    return e(l)
                }
            }) : e(null)
        }, n.prototype.getExtraIndices = function (e) {
            var t = this;
            return this.version < 4 || 0 == this.extHeaderOffset || "bigbed" != this.type ? e(null) : void this.data.slice(this.extHeaderOffset, 64).fetch(function (i) {
                if (!i) return e(null, "Couldn't fetch extension header");
                var n = new Uint8Array(i), s = new Int16Array(i), o = (new Int32Array(i), s[0], s[1]), l = r(n, 4);
                return 0 == o ? e(null) : void t.data.slice(l, 20 * o).fetch(function (i) {
                    if (!i) return e(null, "Couldn't fetch index info");
                    for (var n = new Uint8Array(i), s = new Int16Array(i), l = (new Int32Array(i), []), h = 0; o > h; ++h) {
                        var u = s[10 * h], c = s[10 * h + 1], d = r(n, 20 * h + 4), p = s[10 * h + 8],
                            f = new a(t, u, c, d, p);
                        l.push(f)
                    }
                    e(l)
                })
            })
        }, a.prototype.lookup = function (e, t) {
            var i = this;
            this.bbi.data.slice(this.offset, 32).fetch(function (n) {
                function s(n) {
                    i.bbi.data.slice(n, 4 + l * (h + u)).fetch(function (n) {
                        var o = new Uint8Array(n), a = new Uint16Array(n), l = (new Uint32Array(n), o[0]), c = a[1],
                            d = 4;
                        if (0 != l) {
                            for (var p = 0; c > p; ++p) {
                                for (var f = "", v = 0; h > v; ++v) {
                                    var g = o[d++];
                                    0 != g && (f += String.fromCharCode(g))
                                }
                                if (f == e) {
                                    var y = r(o, d), b = m(o, d + 8);
                                    return i.bbi.getUnzoomedView().fetchFeatures(function (t, r, n, s) {
                                        return s && s.length > i.field - 3 ? s[i.field - 3] == e : void 0
                                    }, [{offset: y, size: b}], t)
                                }
                                d += u
                            }
                            return t([])
                        }
                        for (var w = null, p = 0; c > p; ++p) {
                            for (var f = "", v = 0; h > v; ++v) {
                                var g = o[d++];
                                0 != g && (f += String.fromCharCode(g))
                            }
                            var x = r(o, d);
                            if (d += 8, e.localeCompare(f) < 0 && w) return void s(w);
                            w = x
                        }
                        s(w)
                    })
                }

                var o = new Uint8Array(n), a = (new Int16Array(n), new Int32Array(n)), l = (a[0], a[1]), h = a[2],
                    u = a[3], c = (r(o, 16), 32);
                s(i.offset + c)
            })
        }, "undefined" != typeof t && (t.exports = {makeBwg: o, BIG_BED_MAGIC: C, BIG_WIG_MAGIC: S})
    }, {"./bin": 4, "./das": 10, "./spans": 36, "./utils": 49, jszlib: 54}],
    4: [function (e, t, i) {
        "use strict";

        function r(e) {
            this.blob = e
        }

        function n(e, t, i, r) {
            r || ("object" == typeof t ? (r = t, t = void 0) : r = {}), this.url = e, this.start = t || 0, i && (this.end = i), this.opts = r
        }

        function s(e) {
            if (!e) return null;
            for (var t = new Uint8Array(e.length), i = 0; i < t.length; ++i) t[i] = e.charCodeAt(i);
            return t.buffer
        }

        function o(e, t) {
            return e[t + 7] << 24 | e[t + 6] << 16 | e[t + 5] << 8 | e[t + 4]
        }

        function a(e, t) {
            return e[t + 3] << 24 | e[t + 2] << 16 | e[t + 1] << 8 | e[t]
        }

        function l(e, t) {
            return e[t + 1] << 8 | e[t]
        }

        function h(e, t) {
            return e[t]
        }

        function u(e, t) {
            return e[t] << 24 | e[t + 1] << 16 | e[t + 2] << 8 | e[t + 3]
        }

        if ("undefined" != typeof e) var c = e("./utils"), d = c.shallowCopy, p = e("./sha1"), f = p.b64_sha1;
        r.prototype.slice = function (e, t) {
            var i;
            return i = this.blob.slice ? t ? this.blob.slice(e, e + t) : this.blob.slice(e) : t ? this.blob.webkitSlice(e, e + t) : this.blob.webkitSlice(e), new r(i)
        }, r.prototype.salted = function () {
            return this
        }, "undefined" != typeof FileReader ? r.prototype.fetch = function (e) {
            var t = new FileReader;
            t.onloadend = function (i) {
                e(s(t.result))
            }, t.readAsBinaryString(this.blob)
        } : r.prototype.fetch = function (e) {
            var t = new FileReaderSync;
            try {
                var i = t.readAsArrayBuffer(this.blob);
                e(i)
            } catch (r) {
                e(null, r)
            }
        }, n.prototype.slice = function (e, t) {
            if (0 > e) throw"Bad slice " + e;
            var i = this.start, r = this.end;
            return i && e ? i += e : i = e || i, r = t && i ? i + t - 1 : r || t - 1, new n(this.url, i, r, this.opts)
        };
        var v = 0, g = navigator.userAgent.indexOf("Safari") >= 0 && navigator.userAgent.indexOf("Chrome") < 0;
        n.prototype.fetchAsText = function (e) {
            try {
                var t, i = new XMLHttpRequest, r = this.url;
                if ((g || this.opts.salt) && r.indexOf("?") < 0 && (r = r + "?salt=" + f("" + Date.now() + "," + ++v)), i.open("GET", r, !0), this.end) {
                    if (this.end - this.start > 1e8) throw"Monster fetch!";
                    i.setRequestHeader("Range", "bytes=" + this.start + "-" + this.end), t = this.end - this.start + 1
                }
                i.onreadystatechange = function () {
                    return 4 == i.readyState ? e(200 == i.status || 206 == i.status ? i.responseText : null) : void 0
                }, this.opts.credentials && (i.withCredentials = !0), i.send("")
            } catch (n) {
                return e(null)
            }
        }, n.prototype.salted = function () {
            var e = d(this.opts);
            return e.salt = !0, new n(this.url, this.start, this.end, e)
        }, n.prototype.fetch = function (e, t) {
            var i = this;
            t = t || {};
            var r = t.attempt || 1, n = t.truncatedLength;
            if (r > 3) return e(null);
            try {
                var o;
                t.timeout && !this.opts.credentials && (o = setTimeout(function () {
                    return console.log("timing out " + h), l.abort(), e(null, "Timeout")
                }, t.timeout));
                var a, l = new XMLHttpRequest, h = this.url;
                if ((g || this.opts.salt) && h.indexOf("?") < 0 && (h = h + "?salt=" + f("" + Date.now() + "," + ++v)), l.open("GET", h, !0), l.overrideMimeType("text/plain; charset=x-user-defined"), this.end) {
                    if (this.end - this.start > 1e8) throw"Monster fetch!";
                    l.setRequestHeader("Range", "bytes=" + this.start + "-" + this.end), a = this.end - this.start + 1
                }
                l.responseType = "arraybuffer", l.onreadystatechange = function () {
                    if (4 == l.readyState) {
                        if (o && clearTimeout(o), 200 == l.status || 206 == l.status) {
                            if (l.response) {
                                var t = l.response.byteLength;
                                return !a || a == t || n && t == n ? e(l.response) : i.fetch(e, {
                                    attempt: r + 1,
                                    truncatedLength: t
                                })
                            }
                            if (l.mozResponseArrayBuffer) return e(l.mozResponseArrayBuffer);
                            var h = l.responseText;
                            return !a || a == h.length || n && h.length == n ? e(s(l.responseText)) : i.fetch(e, {
                                attempt: r + 1,
                                truncatedLength: h.length
                            })
                        }
                        return i.fetch(e, {attempt: r + 1})
                    }
                }, this.opts.credentials && (l.withCredentials = !0), l.send("")
            } catch (u) {
                return e(null)
            }
        }, function (e) {
            var t = new ArrayBuffer(8), i = new Uint8Array(t), r = new Float32Array(t);
            e.readFloat = function (e, t) {
                return i[0] = e[t], i[1] = e[t + 1], i[2] = e[t + 2], i[3] = e[t + 3], r[0]
            }
        }(this), "undefined" != typeof t && (t.exports = {
            BlobFetchable: r,
            URLFetchable: n,
            readInt: a,
            readIntBE: u,
            readInt64: o,
            readShort: l,
            readByte: h,
            readFloat: this.readFloat
        })
    }, {"./sha1": 33, "./utils": 49}],
    5: [function (e, t, i) {
        "use strict";

        function r(e) {
            var t = "bp";
            return e > 1e9 ? (e /= 1e9, t = "Gb") : e > 1e6 ? (e /= 1e6, t = "Mb") : e > 1e3 && (e /= 1e3, t = "kb"), "" + Math.round(e) + t
        }

        if ("undefined" != typeof e) {
            var n = e("./cbrowser"), s = n.Browser, o = e("./utils"), a = o.makeElement,
                l = (o.removeChildren, e("./numformats")), h = l.formatLongInt, u = e("./zoomslider");
            e("./tier-edit"), e("./export-config"), e("./export-ui"), e("./export-image"), e("./svg-export"), e("./session")
        }
        s.prototype.initUI = function (e, t) {
            this.noSourceCSS || ["bootstrap-scoped.css", "dalliance-scoped.css", "font-awesome.min.css"].forEach(function (e) {
                document.head.appendChild(a("link", "", {rel: "stylesheet", href: this.resolveURL("$$css/" + e)}))
            }.bind(this));
            var i = this;
            i.disableDefaultFeaturePopup || this.addFeatureListener(function (e, t, r, n) {
                i.featurePopup(e, t, r, n)
            }), e.classList.add("dalliance");
            var n = i.toolbar = a("div", null, {className: "btn-toolbar toolbar"}),
                s = i.coordSystem.speciesName + " " + i.nameForCoordSystem(i.coordSystem);
            this.setDocumentTitle && (document.title = s + " :: dalliance");
            var o = a("input", "", {className: "loc-field"});
            i.makeTooltip(o, "Enter a genomic location or gene name");
            var l = a("p", "", {className: "loc-status"}),
                c = a("a", [a("i", null, {className: "fa fa-search-plus"})], {className: "btn"}), d = new u;
            i.makeTooltip(d, "Highlighted button shows current zoom level, gray button shows inactive zoom level (click or tap SPACE to toggle).");
            var p = a("a", [a("i", null, {className: "fa fa-search-minus"})], {className: "btn"}),
                f = a("a", [a("i", null, {className: "fa fa-eraser"})], {className: "btn"}),
                v = a("a", [a("i", null, {className: "fa fa-plus"})], {className: "btn"}),
                g = a("a", [a("i", null, {className: "fa fa-bookmark"})], {className: "btn"}),
                y = a("a", [a("i", null, {className: "fa fa-print"})], {className: "btn"}),
                m = (a("a", [a("i", null, {className: "fa fa-refresh"})], {className: "btn"}), a("a", [a("i", null, {className: "fa fa-cogs"})], {className: "btn"})),
                b = a("a", [a("i", null, {className: "fa fa-question"})], {className: "btn"}),
                w = a("a", [a("i", null, {className: "fa fa-road"})], {className: "btn"});
            i.makeTooltip(w, "Configure currently selected track(s) (E)");
            var x = a("a", [a("i", null, {className: "fa fa-angle-left"})], {className: "btn"}, {width: "5px"}),
                S = a("a", [a("i", null, {className: "fa fa-angle-right"})], {className: "btn pull-right"}, {width: "5px"}),
                _ = a("div", null, {className: "btn-group pull-right"});
            this.noTrackAdder || _.appendChild(v), this.noTrackEditor || _.appendChild(w), this.noExport || _.appendChild(y), this.noOptions || _.appendChild(m), this.noHelp || _.appendChild(b), this.setUiMode = function (e) {
                this.uiMode = e;
                var t = {help: b, add: v, opts: m, "export": y, tier: w};
                for (var i in t) i == e ? t[i].classList.add("active") : t[i].classList.remove("active")
            }, this.noLeapButtons || n.appendChild(S), _.firstChild && n.appendChild(_), this.noLeapButtons || n.appendChild(x), this.noTitle || n.appendChild(a("div", a("h4", s, {}, {margin: "0px"}), {className: "btn-group title"})), this.noLocationField || n.appendChild(a("div", [o, l], {className: "btn-group loc-group"})), this.noClearHighlightsButton || n.appendChild(f), this.noZoomSlider || n.appendChild(a("div", [c, a("span", d, {className: "btn"}), p], {className: "btn-group"})), this.toolbarBelow ? (e.appendChild(t), e.appendChild(n)) : (e.appendChild(n), e.appendChild(t));
            var C = Math.log(2) / Math.log(10), T = Math.log(5) / Math.log(10), k = function (e) {
                var t, r = (e / i.zoomExpt + Math.log(i.zoomBase)) / Math.log(10), n = 0 | r, s = r - n;
                return t = .01 > s ? n : C + .01 >= s ? n + C : T + .01 >= s ? n + T : n + 1, (t * Math.log(10) - Math.log(i.zoomBase)) * i.zoomExpt
            }, L = function (e) {
                d.addLabel(e, r(Math.exp(e / i.zoomExpt) * i.zoomBase))
            };
            this.addViewListener(function (e, t, r, n, s) {
                o.value = e + ":" + h(t) + ".." + h(r), d.min = 0 | s.min, d.max = 0 | s.max, s.isSnapZooming ? (d.value = s.alternate, d.value2 = s.current, d.active = 2) : (d.value = s.current, d.value2 = s.alternate, d.active = 1), s.current == s.min ? c.classList.add("disabled") : c.classList.remove("disabled"), s.current == s.max ? p.classList.add("disabled") : p.classList.remove("disabled"), d.removeLabels();
                var a = s.min, l = s.max, u = l - a;
                L(k(a)), L(k(a + 1 * u / 3)), L(k(a + 2 * u / 3)), L(k(l)), i.storeStatus && i.storeViewStatus(), i.highlights.length > 0 ? f.style.display = "inline-block" : f.style.display = "none"
            }), this.addTierListener(function () {
                i.storeStatus && i.storeTierStatus()
            }), o.addEventListener("keydown", function (e) {
                if (40 == e.keyCode && (e.preventDefault(), e.stopPropagation(), i.setSelectedTier(0)), 10 == e.keyCode || 13 == e.keyCode) {
                    e.preventDefault();
                    var t = o.value;
                    i.search(t, function (e) {
                        e ? l.textContent = "" + e : l.textContent = ""
                    })
                }
            }, !1);
            var A;
            v.addEventListener("click", function (e) {
                A && A.displayed ? i.removeAllPopups() : A = i.showTrackAdder(e)
            }, !1), i.makeTooltip(v, "Add a new track from the registry or an indexed file. (A)"), c.addEventListener("click", function (e) {
                e.stopPropagation(), e.preventDefault(), i.zoomStep(-10)
            }, !1), i.makeTooltip(c, "Zoom in (+)"), p.addEventListener("click", function (e) {
                e.stopPropagation(), e.preventDefault(), i.zoomStep(10)
            }, !1), i.makeTooltip(p, "Zoom out (-)"), d.addEventListener("change", function (e) {
                var t = 2 == d.active;
                t != i.isSnapZooming && (i.savedZoom = i.zoomSliderValue - i.zoomMin, i.isSnapZooming = t);
                var r = 1 == d.active ? d.value : d.value2;
                i.zoomSliderValue = 1 * r, i.zoom(Math.exp(1 * r / i.zoomExpt))
            }, !1), g.addEventListener("click", function (e) {
                e.stopPropagation(), e.preventDefault()
            }, !1), i.makeTooltip(g, "Favourite regions"), y.addEventListener("click", function (e) {
                e.stopPropagation(), e.preventDefault(), i.openExportPanel()
            }, !1), i.makeTooltip(y, "Export publication-quality SVG. (X)");
            m.addEventListener("click", function (e) {
                e.stopPropagation(), e.preventDefault(), i.toggleOptsPopup(e)
            }, !1), i.makeTooltip(m, "Configure options."), b.addEventListener("click", function (e) {
                e.stopPropagation(), e.preventDefault(), i.toggleHelpPopup(e);
            }), i.makeTooltip(b, "Help; Keyboard shortcuts. (H)"), w.addEventListener("click", function (e) {
                e.stopPropagation(), e.preventDefault(), 1 == i.selectedTiers.length && i.openTierPanel(i.tiers[i.selectedTiers[0]])
            }, !1), x.addEventListener("click", function (e) {
                i.leap(i.reverseKeyScrolling ? -1 : 1, !1)
            }, !1), i.makeTooltip(x, function (e) {
                var t, r = i.getSelectedTier();
                return r >= 0 && (t = i.tiers[r]), t && t.featureSource && i.sourceAdapterIsCapable(t.featureSource, "quantLeap") && "number" == typeof t.quantLeapThreshold ? 'Jump to the next region with a score above the threshold in the selected track "' + (t.config.name || t.dasSource.name) + '"" (ctrl+LEFT)' : t && t.featureSource && i.sourceAdapterIsCapable(t.featureSource, "leap") ? 'Jump to the next feature in the selected track "' + (t.config.name || t.dasSource.name) + '" (ctrl+LEFT)' : "Jump left (shift+LEFT)"
            }), S.addEventListener("click", function (e) {
                i.leap(i.reverseKeyScrolling ? 1 : -1, !1)
            }, !1), i.makeTooltip(S, function (e) {
                var t, r = i.getSelectedTier();
                return r >= 0 && (t = i.tiers[r]), t && t.featureSource && i.sourceAdapterIsCapable(t.featureSource, "quantLeap") && "number" == typeof t.quantLeapThreshold ? 'Jump to the next region with a score above the threshold in the selected track "' + (t.config.name || t.dasSource.name) + '"" (ctrl+RIGHT)' : t && t.featureSource && i.sourceAdapterIsCapable(t.featureSource, "leap") ? 'Jump to the next feature in the selected track "' + (t.config.name || t.dasSource.name) + '" (ctrl+RIGHT)' : "Jump right (shift+RIGHT)"
            }), i.addTierSelectionListener(function () {
                var e, t = i.getSelectedTier();
                t >= 0 && (e = i.tiers[t]);
                var r = !1;
                e && e.featureSource && (i.sourceAdapterIsCapable(e.featureSource, "quantLeap") && "number" == typeof e.quantLeapThreshold ? r = !0 : i.sourceAdapterIsCapable(e.featureSource, "leap") && (r = !0)), x.firstChild.className = r ? "fa fa-angle-double-left" : "fa fa-angle-left", S.firstChild.className = r ? "fa fa-angle-double-right" : "fa fa-angle-right"
            }), f.addEventListener("click", function (e) {
                i.clearHighlights()
            }, !1), i.makeTooltip(f, "Clear highlights (C)"), i.addTierSelectionWrapListener(function (e) {
                0 > e && (i.setSelectedTier(null), o.focus())
            }), i.addTierSelectionListener(function (e) {
                if ("tier" === i.uiMode) if (0 == e.length) i.hideToolPanel(), i.manipulatingTier = null, i.uiMode = "none"; else {
                    var t = i.tiers[e[0]];
                    t != i.manipulatingTier && i.openTierPanel(t)
                }
            });
            var O = function (e) {
                65 == e.keyCode || 97 == e.keyCode ? (e.preventDefault(), e.stopPropagation(), i.showTrackAdder()) : 72 == e.keyCode || 104 == e.keyCode ? (e.stopPropagation(), e.preventDefault(), i.toggleHelpPopup(e)) : 69 == e.keyCode || 101 == e.keyCode ? (e.stopPropagation(), e.preventDefault(), 1 == i.selectedTiers.length && i.openTierPanel(i.tiers[i.selectedTiers[0]])) : 88 == e.keyCode || 120 == e.keyCode ? (e.stopPropagation(), e.preventDefault(), i.openExportPanel()) : (67 == e.keyCode || 99 == e.keyCode) && (e.stopPropagation(), e.preventDefault(), i.clearHighlights())
            };
            e.addEventListener("focus", function (t) {
                e.addEventListener("keydown", O, !1)
            }, !1), e.addEventListener("blur", function (t) {
                e.removeEventListener("keydown", O, !1)
            }, !1), e.addEventListener("keydown", function (e) {
                27 === e.keyCode && "none" !== i.uiMode && (e.preventDefault(), e.stopPropagation(), i.setUiMode("none"), i.hideToolPanel(), i.selectedTiers && i.selectedTiers.length > 0 && i.browserHolder.focus())
            }, !1)
        }, s.prototype.showToolPanel = function (e, t) {
            var i = this;
            this.activeToolPanel && this.activeToolPanel.parentElement.removeChild(this.activeToolPanel);
            var r;
            r = t ? e : a("div", e, {}, {overflowY: "auto", width: "100%"});
            var n = a("div", a("i", null, {className: "fa fa-caret-right"}), {className: "tool-divider"});
            n.addEventListener("click", function (e) {
                i.hideToolPanel(), i.setUiMode("none")
            }, !1), this.makeTooltip(n, "Close tool panel (ESC)"), this.activeToolPanel = a("div", [n, r], {className: "tool-holder"}), this.svgHolder.appendChild(this.activeToolPanel), this.resizeViewer();
            var i = this
        }, s.prototype.hideToolPanel = function () {
            this.activeToolPanel && this.activeToolPanel.parentElement.removeChild(this.activeToolPanel), this.svgHolder.style.width = "100%", this.activeToolPanel = null, this.resizeViewer()
        }, s.prototype.toggleHelpPopup = function (e) {
            if ("help" === this.uiMode) this.hideToolPanel(), this.setUiMode("none"); else {
                var t = a("iframe", null, {
                    scrolling: "yes",
                    seamless: "seamless",
                    src: this.resolveURL("$$help/index.html"),
                    className: "help-panel"
                });
                this.showToolPanel(t, !1), this.setUiMode("help")
            }
        }, s.prototype.toggleOptsPopup = function (e) {
            var t = this;
            if ("opts" === this.uiMode) this.hideToolPanel(), this.setUiMode("none"); else {
                var i = a("div", null, {className: "form-horizontal"}, {
                    boxSizing: "border-box",
                    MozBoxSizing: "border-box",
                    display: "inline-block",
                    verticalAlign: "top"
                }), r = a("table");
                r.cellPadding = 5;
                var n = a("input", "", {type: "checkbox", checked: t.reverseScrolling});
                n.addEventListener("change", function (e) {
                    t.reverseScrolling = n.checked, t.storeStatus()
                }, !1), r.appendChild(a("tr", [a("td", "Reverse trackpad scrolling", {align: "right"}), a("td", n)]));
                var s = a("input", "", {type: "checkbox", checked: t.reverseKeyScrolling});
                s.addEventListener("change", function (e) {
                    t.reverseKeyScrolling = s.checked, t.storeStatus()
                }, !1), r.appendChild(a("tr", [a("td", "Reverse scrolling buttons and keys", {align: "right"}), a("td", s)]));
                var o = a("select");
                o.appendChild(a("option", "Left", {value: "left"})), o.appendChild(a("option", "Center", {value: "center"})), o.appendChild(a("option", "Right", {value: "right"})), o.appendChild(a("option", "None", {value: "none"})), o.value = t.rulerLocation, o.addEventListener("change", function (e) {
                    t.rulerLocation = o.value, t.positionRuler();
                    for (var i = 0; i < t.tiers.length; ++i) t.tiers[i].paintQuant();
                    t.storeStatus()
                }, !1), r.appendChild(a("tr", [a("td", "Vertical guideline", {align: "right"}), a("td", o)]));
                var l = a("input", "", {type: "checkbox", checked: t.singleBaseHighlight});
                l.addEventListener("change", function (e) {
                    t.singleBaseHighlight = l.checked, t.positionRuler(), t.storeStatus()
                }, !1), l.setAttribute("id", "singleBaseHightlightButton"), r.appendChild(a("tr", [a("td", "Display and highlight current genome location", {align: "right"}), a("td", l)])), i.appendChild(r);
                var h = a("button", "Reset browser", {className: "btn"}, {
                    marginLeft: "auto",
                    marginRight: "auto",
                    display: "block"
                });
                h.addEventListener("click", function (e) {
                    t.reset()
                }, !1), i.appendChild(h), this.showToolPanel(i), this.setUiMode("opts")
            }
        }
    }, {
        "./cbrowser": 6,
        "./export-config": 14,
        "./export-image": 15,
        "./export-ui": 16,
        "./numformats": 26,
        "./session": 32,
        "./svg-export": 38,
        "./tier-edit": 44,
        "./utils": 49,
        "./zoomslider": 52
    }],
    6: [function (e, t, i) {
        "use strict";

        function r(e, t, i) {
            this.min = t, this.max = i, this.chr = e
        }

        function n(e) {
            if (e || (e = {}), this.prefix = "//www.biodalliance.org/release-0.13/", this.sources = [], this.tiers = [], this.tierGroups = {}, this.featureListeners = [], this.featureHoverListeners = [], this.viewListeners = [], this.regionSelectListeners = [], this.tierListeners = [], this.tierSelectionListeners = [], this.tierSelectionWrapListeners = [], this.cookieKey = "browser", this.chains = {}, this.pageName = "svgHolder", this.maxExtra = 2.5, this.minExtra = .5, this.zoomFactor = 1, this.maxPixelsPerBase = 10, this.origin = 0, this.targetQuantRes = 1, this.featurePanelWidth = 750, this.zoomBase = 100, this.zoomExpt = 30, this.zoomSliderValue = 100, this.entryPoints = null, this.currentSeqMax = -1, this.highlights = [], this.selectedTiers = [1], this.maxViewWidth = 5e5, this.defaultSubtierMax = 100, this.reverseScrolling = !1, this.rulerLocation = "center", this.defaultHighlightFill = "red", this.defaultHighlightAlpha = .3, this.exportHighlights = !0, this.exportRuler = !0, this.exportBanner = !0, this.exportRegion = !0, this.singleBaseHighlight = !0, this.tierBackgroundColors = ["rgb(245,245,245)", "white"], this.minTierHeight = 20, this.noDefaultLabels = !1, this.availableSources = new c, this.defaultSources = [], this.mappableSources = {}, this.registry = null, this.noRegistryTabs = !0, this.hubs = [], this.hubObjects = [], this.sourceCache = new h, this.retina = !0, this.useFetchWorkers = !0, this.maxWorkers = 2, this.workerPath = "$$worker-all.js", this.assemblyNamePrimary = !0, this.assemblyNameUcsc = !0, this.defaultSearchRegionPadding = 1e4, this.httpCanaryURL = "http://www.biodalliance.org/http-canary.txt", this.httpWarningURL = "//www.biodalliance.org/https.html", this.initListeners = [], e.baseColors ? this.baseColors = e.baseColors : this.baseColors = {
                A: "green",
                C: "blue",
                G: "orange",
                T: "red",
                "-": "hotpink",
                I: "red"
            }, void 0 !== e.viewStart && "number" != typeof e.viewStart) throw Error("viewStart must be an integer");
            if (void 0 !== e.viewEnd && "number" != typeof e.viewEnd) throw Error("viewEnd must be an integer");
            for (var t in e) this[t] = e[t];
            if ("string" == typeof e.uiPrefix && "string" != typeof e.prefix && (this.prefix = e.uiPrefix), this.prefix.indexOf("//") < 0 && 0 === this.prefix.indexOf("/")) {
                var i = window.location.hostname;
                window.location.port && (i += ":" + window.location.port), this.prefix = "//" + i + this.prefix
            }
            if (0 === this.prefix.indexOf("//")) {
                var r = window.location.protocol;
                "http:" == r || "https:" == r || (console.log(window.location.protocol), console.log("WARNING: prefix is set to a protocol-relative URL (" + this.prefix + " when loading from a non-HTTP source"), this.prefix = "http:" + this.prefix)
            }
            if (!this.coordSystem) throw Error("Coordinate system must be configured");
            if (void 0 === this.chr || void 0 === this.viewStart || void 0 === this.viewEnd) throw Error("Viewed region (chr:start..end) must be defined");
            var n = this;
            if ("complete" === document.readyState) n.realInit(); else {
                var s = function (e) {
                    window.removeEventListener("load", s, !1), n.realInit()
                };
                window.addEventListener("load", s, !1)
            }
        }

        function s(e, t, i) {
            if (i) for (var r = 0; r < t.length; ++r) t[r].mapping = i;
            e.set(t)
        }

        function o(e, t, i, r) {
            r = r || [];
            for (var n = e.length - 1; n >= 0; --n) {
                var s = e[n];
                if (!s.notSelectable && s.min() <= t && s.max() >= t) {
                    if (s.minY && (i < s.minY() || i > s.maxY())) continue;
                    return s.feature ? r.push(s.feature) : s.group && r.push(s.group), s.glyphs ? o(s.glyphs, t, i, r) : s.glyph ? o([s.glyph], t, i, r) : r
                }
            }
            return r
        }

        function a(e, t) {
            var i = this;
            this.tagSeed = 0, this.callbacks = {}, this.browser = e, this.worker = t, this.worker.onmessage = function (e) {
                var t = i.callbacks[e.data.tag];
                t && (t(e.data.result, e.data.error), delete i.callbacks[e.data.tag])
            }
        }

        function l(e) {
            var t = e.resolveURL(e.workerPath);
            if (0 == t.indexOf("//")) {
                var i = window.location.protocol;
                t = "https:" == i ? "https:" + t : "http:" + t
            }
            var r = 'importScripts("' + t + "?version=" + _ + '");',
                n = new Blob([r], {type: "application/javascript"});
            return new A(function (t, i) {
                var r = new Worker(URL.createObjectURL(n));
                r.onmessage = function (i) {
                    "init" === i.data.tag && (console.log("Worker initialized"), t(new a(e, r)))
                }, r.onerror = function (e) {
                    i(e.message)
                }
            })
        }

        function h() {
            this.sourcesByURI = {}
        }

        if ("undefined" != typeof e) {
            var u = e("./utils"), c = u.Observed, d = (u.Awaited, u.makeElement), p = u.removeChildren,
                f = u.miniJSONify, v = u.shallowCopy, g = u.textXHR, y = e("./tier"), m = y.DasTier, b = e("./sha1"),
                w = b.hex_sha1, x = e("./thub"), S = x.connectTrackHub, _ = e("./version"), C = e("./numformats"),
                T = C.formatQuantLabel, k = C.formatLongInt, L = e("./chainset").Chainset, A = e("es6-promise").Promise,
                O = e("./sourcecompare"), E = O.sourcesAreEqual, R = O.sourcesAreEqualModuloStyle, B = O.sourceDataURI;
            O.sourceStyleURI
        }
        if (n.prototype.resolveURL = function (e) {
            return e.replace("$$", this.prefix)
        }, n.prototype.destroy = function () {
            window.removeEventListener("resize", this.resizeListener, !1)
        }, n.prototype.realInit = function () {
            var e = this;
            if (this.wasInitialized) return void console.log("Attemping to call realInit on an already-initialized Dalliance instance");
            this.wasInitialized = !0;
            var t = navigator.userAgent || "dummy";
            t.indexOf("Trident") >= 0 && t.indexOf("rv:11") >= 0 && (this.disablePinning = !0), this.defaultChr = this.chr, this.defaultStart = this.viewStart, this.defaultEnd = this.viewEnd, this.defaultSources = [];
            for (var i = 0; i < this.sources.length; ++i) {
                var r = this.sources[i];
                r && this.defaultSources.push(r)
            }
            this.restoreStatus && (this.statusRestored = this.restoreStatus());
            var n = this;
            this.browserHolderHolder = document.getElementById(this.pageName), this.browserHolderHolder.classList.add("dalliance-injection-point"), this.browserHolder = d("div", null, {
                className: "dalliance dalliance-root",
                tabIndex: -1
            }), this.maxHeight ? this.browserHolder.style.maxHeight = this.maxHeight + "px" : void 0 != this.maxHeight && (this.browserHolder.style.maxHeight = null), p(this.browserHolderHolder), this.browserHolderHolder.appendChild(this.browserHolder), this.svgHolder = d("div", null, {className: "main-holder"}), this.initUI(this.browserHolder, this.svgHolder), this.pinnedTierHolder = d("div", null, {className: "tier-holder tier-holder-pinned"}), this.tierHolder = d("div", this.makeLoader(24), {className: "tier-holder tier-holder-rest"}), this.locSingleBase = d("span", "", {className: "loc-single-base"});
            var s = d("div", this.locSingleBase, {className: "loc-single-base-holder"});
            this.addViewListener(function (t, i, r, n, s, o, a) {
                var l = Math.round((a + o) / 2);
                e.locSingleBase.appendChild(document.createTextNode(t + ":" + k(l))), e.locSingleBase.removeChild(e.locSingleBase.firstChild)
            }), this.disablePinning ? this.tierHolderHolder = this.tierHolder : (this.tierHolderHolder = d("div", [s, this.pinnedTierHolder, this.tierHolder], {className: "tier-holder-holder"}), this.svgHolder.appendChild(this.tierHolderHolder)), this.svgHolder.appendChild(this.tierHolderHolder), this.bhtmlRoot = d("div"), this.disablePoweredBy || this.bhtmlRoot.appendChild(d("span", ["Powered by ", d("a", "Biodalliance", {href: "http://www.biodalliance.org/"}), " " + _], {className: "powered-by"})), this.browserHolder.appendChild(this.bhtmlRoot), this.resizeListener = function (e) {
                n.resizeViewer()
            }, window.addEventListener("resize", this.resizeListener, !1), this.ruler = d("div", null, {className: "guideline"}), this.ruler2 = d("div", null, {className: "single-base-guideline"}), this.tierHolderHolder.appendChild(this.ruler), this.tierHolderHolder.appendChild(this.ruler2), this.chainConfigs = this.chains || {}, this.chains = {};
            for (var o in this.chainConfigs) {
                var a = this.chainConfigs[o];
                a instanceof L && console.log('WARNING: Should no longer use "new Chainset" in Biodalliance configurations.'), this.chains[o] = new L(a)
            }
            var h;
            if (this.maxWorkers > 0) {
                for (var u = [], c = 0; c < this.maxWorkers; ++c) u.push(l(this));
                h = A.all(u)
            } else h = A.resolve([]);
            this.fetchWorkers = null, this.nextWorker = 0, h.then(function (e) {
                console.log("Booted " + e.length + " workers"), n.fetchWorkers = e
            }, function (e) {
                console.log("Failed to boot workers", e)
            }).then(function () {
                if ("none" != window.getComputedStyle(n.browserHolderHolder).display && n.tierHolder.getBoundingClientRect().width > 0) setTimeout(function () {
                    n.realInit2()
                }, 1); else var e = setInterval(function () {
                    "none" != window.getComputedStyle(n.browserHolderHolder).display && n.tierHolder.getBoundingClientRect().width > 0 && (clearInterval(e), n.realInit2())
                }, 300)
            })
        }, n.prototype.realInit2 = function () {
            var e = this;
            p(this.tierHolder), p(this.pinnedTierHolder), this.featurePanelWidth = 0 | this.tierHolder.getBoundingClientRect().width, this.scale = this.featurePanelWidth / (this.viewEnd - this.viewStart), this.zoomMax || (this.zoomMax = this.zoomExpt * Math.log(this.maxViewWidth / this.zoomBase), this.zoomMin = this.zoomExpt * Math.log(this.featurePanelWidth / this.maxPixelsPerBase / this.zoomBase)), this.zoomSliderValue = this.zoomExpt * Math.log((this.viewEnd - this.viewStart + 1) / this.zoomBase), this.tierHolderHolder.addEventListener("mousewheel", function (t) {
                if (t.stopPropagation(), t.preventDefault(), t.wheelDeltaX) {
                    var i = t.wheelDeltaX / 5;
                    e.reverseScrolling || (i = -i), e.move(i)
                }
                if (t.wheelDeltaY) {
                    var i = t.wheelDeltaY;
                    e.reverseScrolling && (i = -i), e.tierHolder.scrollTop += i
                }
            }, !1), this.tierHolderHolder.addEventListener("MozMousePixelScroll", function (t) {
                if (t.stopPropagation(), t.preventDefault(), 1 == t.axis) {
                    if (0 != t.detail) {
                        var i = t.detail / 4;
                        e.reverseScrolling && (i = -i), e.move(i)
                    }
                } else {
                    var i = t.detail;
                    e.reverseScrolling || (i = -i), e.tierHolder.scrollTop += i
                }
            }, !1), this.tierHolderHolder.addEventListener("touchstart", function (t) {
                return e.touchStartHandler(t)
            }, !1), this.tierHolderHolder.addEventListener("touchmove", function (t) {
                return e.touchMoveHandler(t)
            }, !1), this.tierHolderHolder.addEventListener("touchend", function (t) {
                return e.touchEndHandler(t)
            }, !1), this.tierHolderHolder.addEventListener("touchcancel", function (t) {
                return e.touchCancelHandler(t)
            }, !1);
            var t = function (t) {
                if (13 == t.keyCode) {
                    for (var i = !1, r = 0; r < e.tiers.length; ++r) {
                        var n = e.tiers[r];
                        n.wantedLayoutHeight && n.wantedLayoutHeight != n.layoutHeight && (n.layoutHeight = n.wantedLayoutHeight, n.clipTier(), i = !0)
                    }
                    i && e.arrangeTiers()
                } else if (32 == t.keyCode || 32 == t.charCode) {
                    if (e.isSnapZooming) {
                        e.isSnapZooming = !1;
                        var s = (e.savedZoom || 20) + e.zoomMin;
                        e.savedZoom = e.zoomSliderValue - e.zoomMin, e.zoomSliderValue = s, e.zoom(Math.exp(1 * s / e.zoomExpt))
                    } else {
                        e.isSnapZooming = !0;
                        var s = (e.savedZoom || 0) + e.zoomMin;
                        e.savedZoom = e.zoomSliderValue - e.zoomMin, e.zoomSliderValue = s, e.zoom(Math.exp(1 * s / e.zoomExpt))
                    }
                    t.stopPropagation(), t.preventDefault()
                } else if (85 == t.keyCode) {
                    if ("opts" === e.uiMode) {
                        var o = document.getElementById("singleBaseHightlightButton").checked;
                        document.getElementById("singleBaseHightlightButton").checked = !o
                    }
                    e.singleBaseHighlight = !e.singleBaseHighlight, e.positionRuler(), t.stopPropagation(), t.preventDefault()
                } else if (39 == t.keyCode) t.stopPropagation(), t.preventDefault(), e.scrollArrowKey(t, -1); else if (37 == t.keyCode) t.stopPropagation(), t.preventDefault(), e.scrollArrowKey(t, 1); else if (38 == t.keyCode || 87 == t.keyCode) if (t.stopPropagation(), t.preventDefault(), t.shiftKey) {
                    var a = e.getSelectedTier();
                    if (0 > a) return;
                    var l = e.tiers[a], h = l.forceHeight || l.subtiers[0].height;
                    h >= 40 && l.mergeConfig({height: h - 10})
                } else if (t.ctrlKey || t.metaKey) {
                    var a = e.getSelectedTier();
                    if (0 > a) return;
                    var l = e.tiers[a];
                    if (l.quantLeapThreshold) {
                        var u = l.subtiers[0].height, c = l.subtiers[0].quant;
                        if (!c) return;
                        var d = 1 * c.min, p = 1 * c.max, f = (p - d) / u;
                        l.mergeConfig({quantLeapThreshold: d + ((0 | Math.round((l.quantLeapThreshold - d) / f)) + 1) * f}), l.notify("Threshold: " + T(l.quantLeapThreshold))
                    }
                } else if (t.altKey) {
                    var v = e.selectedTiers.length;
                    if (0 == v) return;
                    for (var a = e.selectedTiers[0], g = !0, y = [], m = 0; m < e.selectedTiers.length; ++m) y.push(e.tiers[e.selectedTiers[m]]), m > 0 && e.selectedTiers[m] - e.selectedTiers[m - 1] != 1 && (g = !1);
                    if (g && 0 >= a) return;
                    for (var m = e.selectedTiers.length - 1; m >= 0; --m) e.tiers.splice(e.selectedTiers[m], 1);
                    e.selectedTiers.splice(0, v);
                    for (var b = g ? a - 1 : a, m = 0; m < y.length; ++m) e.tiers.splice(b + m, 0, y[m]), e.selectedTiers.push(b + m);
                    e.withPreservedSelection(e._ensureTiersGrouped), e.markSelectedTiers(), e.notifyTierSelection(), e.reorderTiers(), e.notifyTier()
                } else {
                    var a = e.getSelectedTier();
                    if (a > 0) {
                        e.setSelectedTier(a - 1);
                        var w = e.tiers[e.getSelectedTier()], x = w.row.offsetTop, S = x + w.row.offsetHeight;
                        (x < e.tierHolder.scrollTop || S > e.tierHolder.scrollTop + e.tierHolder.offsetHeight) && (e.tierHolder.scrollTop = x)
                    } else e.notifyTierSelectionWrap(-1)
                } else if (40 == t.keyCode || 83 == t.keyCode) if (t.stopPropagation(), t.preventDefault(), t.shiftKey) {
                    var a = e.getSelectedTier();
                    if (0 > a) return;
                    var l = e.tiers[a], h = l.forceHeight || l.subtiers[0].height;
                    l.mergeConfig({height: h + 10})
                } else if (t.ctrlKey || t.metaKey) {
                    var a = e.getSelectedTier();
                    if (0 > a) return;
                    var l = e.tiers[a];
                    if (l.quantLeapThreshold) {
                        var u = l.subtiers[0].height, c = l.subtiers[0].quant;
                        if (!c) return;
                        var d = 1 * c.min, p = 1 * c.max, f = (p - d) / u,
                            _ = 0 | Math.round((l.quantLeapThreshold - d) / f);
                        _ > 1 && (l.mergeConfig({quantLeapThreshold: d + (_ - 1) * f}), l.notify("Threshold: " + T(l.quantLeapThreshold)))
                    }
                } else if (t.altKey) {
                    var v = e.selectedTiers.length;
                    if (0 == v) return;
                    for (var a = e.selectedTiers[0], C = 0, y = [], m = 0; m < e.selectedTiers.length; ++m) y.push(e.tiers[e.selectedTiers[m]]), m > 0 && (C += e.selectedTiers[m] - e.selectedTiers[m - 1] - 1);
                    var g = 0 == C;
                    if (g && a + v >= e.tiers.length) return;
                    for (var m = e.selectedTiers.length - 1; m >= 0; --m) e.tiers.splice(e.selectedTiers[m], 1);
                    e.selectedTiers.splice(0, v);
                    for (var b = g ? a + 1 : a + C, m = 0; m < y.length; ++m) e.tiers.splice(b + m, 0, y[m]), e.selectedTiers.push(b + m);
                    e.withPreservedSelection(function () {
                        e._ensureTiersGrouped(!0)
                    }), e.markSelectedTiers(), e.notifyTierSelection(), e.reorderTiers(), e.notifyTier()
                } else {
                    var a = e.getSelectedTier();
                    if (a < e.tiers.length - 1) {
                        e.setSelectedTier(a + 1);
                        var w = e.tiers[e.getSelectedTier()], x = w.row.offsetTop, S = x + w.row.offsetHeight;
                        (x < e.tierHolder.scrollTop || S > e.tierHolder.scrollTop + e.tierHolder.offsetHeight) && (e.tierHolder.scrollTop = Math.min(x, S - e.tierHolder.offsetHeight))
                    }
                } else if (187 == t.keyCode || 61 == t.keyCode) t.stopPropagation(), t.preventDefault(), e.zoomStep(-10); else if (189 == t.keyCode || 173 == t.keyCode) t.stopPropagation(), t.preventDefault(), e.zoomStep(10); else if (73 == t.keyCode || 105 == t.keyCode) {
                    t.stopPropagation(), t.preventDefault();
                    var a = e.getSelectedTier();
                    if (0 > a) return;
                    var n = e.tiers[a];
                    n.infoVisible ? (n.infoElement.style.display = "none", n.updateHeight(), n.infoVisible = !1) : (n.infoElement.style.display = "block", n.updateHeight(), n.infoVisible = !0)
                } else if (84 == t.keyCode || 116 == t.keyCode) {
                    var k;
                    if (t.shiftKey) {
                        t.stopPropagation(), t.preventDefault();
                        for (var r = 0; r < e.tiers.length; ++r) {
                            var n = e.tiers[r];
                            n.dasSource.collapseSuperGroups && (void 0 === k && (k = !n.bumped), n.mergeConfig({bumped: k}))
                        }
                    } else if (!t.ctrlKey && !t.metaKey) {
                        t.stopPropagation(), t.preventDefault();
                        var a = e.getSelectedTier();
                        if (0 > a) return;
                        var n = e.tiers[a];
                        n.dasSource.collapseSuperGroups && (void 0 === k && (k = !n.bumped), n.mergeConfig({bumped: k}))
                    }
                } else if (77 == t.keyCode || 109 == t.keyCode) t.stopPropagation(), t.preventDefault(), (t.ctrlKey || t.metaKey) && e.selectedTiers.length > 1 && e.mergeSelectedTiers(); else if (68 == t.keyCode || 100 == t.keyCode) {
                    if (t.stopPropagation(), t.preventDefault(), t.ctrlKey || t.metaKey) {
                        var a = e.getSelectedTier();
                        if (0 > a) return;
                        e.addTier(e.tiers[a].dasSource)
                    }
                } else if ((80 == t.keyCode || 112 == t.keyCode) && (t.ctrlKey || t.metaKey)) {
                    for (var l = [], a = 0; a < e.selectedTiers.length; ++a) l.push(e.tiers[e.selectedTiers[a]]);
                    for (var r = 0; r < l.length; ++r) l[r].mergeConfig({pinned: !l[r].pinned})
                }
            };
            this.browserHolder.addEventListener("focus", function (i) {
                e.browserHolder.addEventListener("keydown", t, !1)
            }, !1), this.browserHolder.addEventListener("blur", function (i) {
                e.browserHolder.removeEventListener("keydown", t, !1)
            }, !1), this.hPopupHolder = d("div"), this.hPopupHolder.style["font-family"] = "helvetica", this.hPopupHolder.style["font-size"] = "12pt", this.hPopupHolder.classList.add("dalliance"), document.body.appendChild(this.hPopupHolder);
            for (var i = 0; i < this.sources.length; ++i) {
                var r = this.sources[i];
                if (r) {
                    var n = {};
                    this.restoredConfigs && (n = this.restoredConfigs[i]), r.disabled || this.makeTier(r, n)
                }
            }
            e._ensureTiersGrouped(), e.arrangeTiers(), e.reorderTiers(), e.refresh(), e.setSelectedTier(1), e.positionRuler();
            var s = this.getSequenceSource();
            s && s.getSeqInfo(this.chr, function (t) {
                t ? e.currentSeqMax = t.length : e.currentSeqMax = -1
            }), this.queryRegistry();
            for (var o in this.chains) this.queryRegistry(o, !0);
            if (this.hubs) for (var a = 0; a < this.hubs.length; ++a) {
                var l = this.hubs[a];
                "string" == typeof l && (l = {url: l}), function (t) {
                    S(t.url, function (i, r) {
                        if (r) console.log(r); else {
                            var n;
                            n = t.genome ? i.genomes[t.genome] : i.genomes[e.coordSystem.ucscName], n && (t.mapping && (n.mapping = t.mapping), t.label && (n.hub.altLabel = t.label), e.hubObjects.push(n))
                        }
                    }, t)
                }(l)
            }
            this.fullScreen && this.setFullScreenHeight(), !this.statusRestored && this.storeStatus && this.storeStatus();
            for (var h = 0; h < this.initListeners.length; ++h) try {
                this.initListeners[h].call(this)
            } catch (u) {
                console.log(u)
            }
        }, n.prototype.touchStartHandler = function (e) {
            if (this.touchOriginX = e.touches[0].pageX, this.touchOriginY = e.touches[0].pageY, 2 == e.touches.length) {
                var t = Math.abs(e.touches[0].pageX - e.touches[1].pageX);
                this.zooming = !0, this.zoomLastSep = this.zoomInitialSep = t, this.zoomInitialScale = this.scale
            }
        }, n.prototype.touchMoveHandler = function (e) {
            if (e.stopPropagation(), e.preventDefault(), 1 == e.touches.length) {
                var t = e.touches[0].pageX, i = e.touches[0].pageY;
                this.touchOriginX && t != this.touchOriginX && this.move(t - this.touchOriginX), this.touchOriginY && i != this.touchOriginY && (this.tierHolder.scrollTop -= i - this.touchOriginY), this.touchOriginX = t, this.touchOriginY = i
            } else if (this.zooming && 2 == e.touches.length) {
                var r = Math.abs(e.touches[0].pageX - e.touches[1].pageX);
                if (r != this.zoomLastSep) {
                    var n = (e.touches[0].pageX + e.touches[1].pageX) / 2, s = this.viewStart + n / this.scale | 0;
                    this.scale = this.zoomInitialScale * (r / this.zoomInitialSep), this.viewStart = s - n / this.scale | 0;
                    for (var o = 0; o < this.tiers.length; ++o) this.tiers[o].draw()
                }
                this.zoomLastSep = r
            }
        }, n.prototype.touchEndHandler = function (e) {
        }, n.prototype.touchCancelHandler = function (e) {
        }, n.prototype.makeTier = function (e, t) {
            try {
                return this.realMakeTier(e, t)
            } catch (i) {
                console.log("Error initializing", e), console.log(i.stack || i)
            }
        }, n.prototype.realMakeTier = function (e, t) {
            var i = this, r = null;
            this.tierBackgroundColors && (r = this.tierBackgroundColors[this.tiers.length % this.tierBackgroundColors.length]);
            var n = new m(this, e, t, r);
            n.oorigin = this.viewStart;
            var s, a, l, h = !1, u = function (e, t) {
                var r = n.subtiers;
                if (r) {
                    var s = 0;
                    for (t -= n.padding; s < r.length && t > r[s].height && s < r.length - 1;) t = t - r[s].height - n.padding, ++s;
                    if (!(s >= r.length)) {
                        var a = r[s].glyphs,
                            l = ((i.viewStart + i.viewEnd) / 2, (n.glyphCacheOrigin - i.viewStart) * i.scale);
                        return e -= l, o(a, e, t)
                    }
                }
            }, c = function (e) {
                e.preventDefault(), e.stopPropagation();
                var t = e.clientX;
                t != a && (i.move(t - a, !0), a = t), i.isDragging = !0
            }, d = function (e) {
                window.removeEventListener("mousemove", c, !0), window.removeEventListener("mouseup", d, !0), i.move(e.clientX - a)
            };
            n.viewport.addEventListener("mousedown", function (e) {
                i.browserHolder.focus(), e.preventDefault();
                var t = (n.row.getBoundingClientRect(), e.clientX);
                e.clientY;
                window.addEventListener("mousemove", c, !0), window.addEventListener("mouseup", d, !0), s = a = t, i.isDragging = !1
            }, !1), n.viewport.addEventListener("mousemove", function (e) {
                var t = n.row.getBoundingClientRect(), r = e.clientX - t.left, s = e.clientY - t.top, o = u(r, s);
                o && o.length > 0 ? n.row.style.cursor = "pointer" : n.row.style.cursor = "default", l && clearTimeout(l), h || (l = setTimeout(function () {
                    var t = u(r, s);
                    t && t.length > 0 && i.notifyFeatureHover(e, t[t.length - 1], t, n)
                }, 1e3))
            });
            var p = null;
            n.viewport.addEventListener("mouseup", function (e) {
                var t = n.row.getBoundingClientRect(), r = e.clientX - t.left, o = e.clientY - t.top, a = u(r, o);
                if (a && a.length > 0 && !i.isDragging && (p ? (clearTimeout(p), p = null, i.featureDoubleClick(a, r, o)) : p = setTimeout(function () {
                    p = null, i.notifyFeature(e, a[a.length - 1], a, n)
                }, 500)), i.isDragging && r != s && n.sequenceSource) {
                    var l, h, c = i.viewStart + r / i.scale, d = i.viewStart + s / i.scale;
                    d > c ? (l = 0 | c, h = 0 | d) : (l = 0 | d, h = 0 | c), i.notifyRegionSelect(i.chr, l, h)
                }
                i.isDragging = !1
            }, !1), n.viewport.addEventListener("mouseout", function (e) {
                h = !1
            }), n.removeButton.addEventListener("click", function (e) {
                e.stopPropagation(), e.preventDefault();
                for (var t = 0; t < i.tiers.length; ++t) if (i.tiers[t] === n) {
                    i.removeTier({index: t});
                    break
                }
            }, !1), n.nameButton.addEventListener("click", function (e) {
                if (e.stopPropagation(), e.preventDefault(), e.shiftKey) {
                    for (var t = -1, r = 0; r < i.tiers.length; ++r) if (i.tiers[r] === n) {
                        t = r;
                        break
                    }
                    if (t >= 0) {
                        var s = i.selectedTiers.indexOf(t);
                        s >= 0 ? i.selectedTiers.splice(s, 1) : (i.selectedTiers.push(t), i.selectedTiers.sort()), i.markSelectedTiers(), i.notifyTierSelection(), i.selectedTiers.length > 0 ? i.browserHolder.focus() : i.notifyTierSelectionWrap(-1)
                    }
                } else {
                    for (var r = 0; r < i.tiers.length; ++r) if (i.tiers[r] === n && (i.browserHolder.focus(), 1 != i.selectedTiers.length || i.selectedTiers[0] != r)) return void i.setSelectedTier(r);
                    n.infoVisible ? (n.infoElement.style.display = "none", n.updateHeight(), n.infoVisible = !1) : (n.infoElement.style.display = "block", n.updateHeight(), n.infoVisible = !0)
                }
            }, !1), n.bumpButton.addEventListener("click", function (e) {
                e.stopPropagation(), e.preventDefault();
                var t, i = n;
                i.dasSource.collapseSuperGroups && (void 0 === t && (t = !i.bumped), i.mergeConfig({bumped: t}))
            }, !1);
            var f, v, g, y, b, w = !1, x = function (e) {
                var t = n.label;
                if (e.stopPropagation(), e.preventDefault(), !f) {
                    v = n.pinned ? i.pinnedTierHolder : i.tierHolder, g = v.scrollHeight - v.offsetHeight, f = t.cloneNode(!0), f.style.cursor = "pointer", v.appendChild(f), t.style.visibility = "hidden";
                    for (var r = 0; r < i.tiers.length; ++r) if (i.tiers[r] === n) {
                        y = r;
                        break
                    }
                    b = e.clientY
                }
                var s = v.getBoundingClientRect();
                f.style.left = t.getBoundingClientRect().left - s.left + "px", f.style.top = e.clientY - s.top + v.scrollTop - 10 + "px";
                for (var o = e.clientY - s.top + v.scrollTop, r = 0; r < i.tiers.length; ++r) {
                    var a = i.tiers[r];
                    if (!(a.pinned ^ n.pinned)) {
                        var l = a.row.getBoundingClientRect();
                        if (o -= l.bottom - l.top, 0 > o) {
                            if (y > r && e.clientY < b || r > y && e.clientY > b) {
                                i.withPreservedSelection(function () {
                                    i.tiers.splice(y, 1), i.tiers.splice(r, 0, n), i._ensureTiersGrouped(r > y)
                                });
                                for (var h = 0; h < i.tiers.length; ++h) i.tiers[h] == n && (y = h);
                                b = e.clientY, i.reorderTiers(), v.appendChild(f), w = !0
                            }
                            break
                        }
                    }
                }
                f.offsetTop < v.scrollTop ? v.scrollTop -= v.scrollTop - f.offsetTop : f.offsetTop + f.offsetHeight > v.scrollTop + v.offsetHeight && (v.scrollTop = Math.min(v.scrollTop + (f.offsetTop + f.offsetHeight) - (v.scrollTop + v.offsetHeight), g))
            }, S = function (e) {
                var t = n.label;
                if (e.stopPropagation(), e.preventDefault(), f && (f.style.cursor = "auto", v.removeChild(f), f = null, t.style.visibility = "visible"), document.removeEventListener("mousemove", x, !1), document.removeEventListener("mouseup", S, !1), w) {
                    for (var r = 0; r < i.tiers.length; ++r) if (i.tiers[r] == n) {
                        i.setSelectedTier(r);
                        break
                    }
                    i.notifyTier()
                }
            };
            return n.label.addEventListener("mousedown", function (e) {
                e.stopPropagation(), e.preventDefault(), w = !1, document.addEventListener("mousemove", x, !1), document.addEventListener("mouseup", S, !1)
            }, !1), this.tiers.push(n), n.init(), n.currentlyHeight = 50, this.updateHeight(), n.updateLabel(), this.withPreservedSelection(i._ensureTiersGrouped), n._updateFromConfig(), this.reorderTiers(), n
        }, n.prototype.reorderTiers = function () {
            p(this.tierHolder), p(this.pinnedTierHolder), this.disablePinning && (this.tierHolder.appendChild(this.ruler), this.tierHolder.appendChild(this.ruler2));
            for (var e = !1, t = [], i = [], r = 0; r < this.tiers.length; ++r) {
                var n = this.tiers[r];
                n.pinned && !this.disablePinning ? (t.push(n), this.pinnedTierHolder.appendChild(this.tiers[r].row), e = !0) : (i.push(n), this.tierHolder.appendChild(this.tiers[r].row))
            }
            this.withPreservedSelection(function () {
                this.tiers.splice(0, this.tiers.length);
                for (var e = 0; e < t.length; ++e) this.tiers.push(t[e]);
                for (var e = 0; e < i.length; ++e) this.tiers.push(i[e])
            }), e ? this.pinnedTierHolder.classList.add("tier-holder-pinned-full") : this.pinnedTierHolder.classList.remove("tier-holder-pinned-full"), this.arrangeTiers()
        }, n.prototype.withPreservedSelection = function (e) {
            for (var t = [], i = 0; i < this.selectedTiers.length; ++i) t.push(this.tiers[this.selectedTiers[i]]);
            e.call(this), this.selectedTiers = [];
            for (var r = 0; r < this.tiers.length; ++r) t.indexOf(this.tiers[r]) >= 0 && this.selectedTiers.push(r)
        }, n.prototype.refreshTier = function (e) {
            this.knownSpace && this.knownSpace.invalidate(e)
        }, n.prototype._ensureTiersGrouped = function (e) {
            for (var t = {}, i = 0; i < this.tiers.length; ++i) {
                var r = this.tiers[i];
                r.dasSource.tierGroup && pusho(t, r.dasSource.tierGroup, r)
            }
            var n = [];
            e && this.tiers.reverse();
            for (var i = 0; i < this.tiers.length; ++i) {
                var r = this.tiers[i];
                if (r.dasSource.tierGroup) {
                    var s = t[r.dasSource.tierGroup];
                    if (s) {
                        e && s.reverse();
                        for (var o = 0; o < s.length; ++o) n.push(s[o]);
                        t[r.dasSource.tierGroup] = null
                    }
                } else n.push(r)
            }
            e && n.reverse(), this.tiers.splice(0, this.tiers.length);
            for (var o = 0; o < n.length; ++o) this.tiers.push(n[o])
        }, n.prototype.arrangeTiers = function () {
            for (var e = [], t = {}, i = 0; i < this.tiers.length; ++i) {
                var r = this.tiers[i];
                r.pinned && (e.push(r), r.dasSource.tierGroup && pusho(t, r.dasSource.tierGroup, r))
            }
            for (var i = 0; i < this.tiers.length; ++i) {
                var r = this.tiers[i];
                r.pinned || (e.push(r), r.dasSource.tierGroup && pusho(t, r.dasSource.tierGroup, r))
            }
            for (var n in t) {
                var s = t[n], o = this.tierGroups[n];
                o || (o = {element: d("div", d("span", n, {className: "tier-group-label"}), {className: "tier-group"})}, this.tierGroups[n] = o), o.element.parentNode && o.element.parentNode.removeChild(o.element);
                for (var a = s[0].pinned ? this.pinnedTierHolder : this.tierHolder, l = 1e7, h = 0, i = 0; i < s.length; ++i) {
                    var u = s[i].row;
                    l = Math.min(l, u.offsetTop), h = Math.max(h, u.offsetTop + u.offsetHeight)
                }
                o.element.style.top = l + "px", o.element.style.left = "0px", o.element.style.height = h - l + "px", a.appendChild(o.element)
            }
            if (this.tierBackgroundColors) for (var i = 0; i < e.length; ++i) {
                var r = e[i];
                r.setBackground(this.tierBackgroundColors[i % this.tierBackgroundColors.length]), r.dasSource.tierGroup ? r.label.style.left = "18px" : r.label.style.left = "2px", r.background = this.tierBackgroundColors[i % this.tierBackgroundColors.length]
            }
        }, n.prototype.refresh = function () {
            this.notifyLocation();
            var e = (this.viewEnd - this.viewStart + 1, 100 / this.scale | 0), t = 1e3 / this.scale | 0,
                i = (this.viewStart + this.viewEnd) / 2, r = i - this.origin;
            this.origin = i, this.scaleAtLastRedraw = this.scale;
            for (var n = 0; n < this.tiers.length; ++n) {
                var s = r;
                this.tiers[n].originHaxx && (s += this.tiers[n].originHaxx), this.tiers[n].originHaxx = s
            }
            var o = this.targetQuantRes / this.scale, a = Math.max(1, (0 | this.viewStart) - e),
                l = Math.min((0 | this.viewEnd) + e, (0 | this.currentSeqMax) > 0 ? 0 | this.currentSeqMax : 1e9),
                h = Math.max(1, (0 | this.viewStart) - t),
                u = Math.min((0 | this.viewEnd) + t, (0 | this.currentSeqMax) > 0 ? 0 | this.currentSeqMax : 1e9);
            if (!this.knownSpace || this.knownSpace.chr !== this.chr) {
                var c = this.getSequenceSource();
                this.knownSpace && this.knownSpace.cancel(), this.knownSpace = new P(this.tiers, this.chr, h, u, o, c);
            }
            var d = this.knownSpace.bestCacheOverlapping(this.chr, a, l);
            d && d.min <= a && d.max >= l ? (this.drawnStart = Math.max(d.min, h), this.drawnEnd = Math.min(d.max, u)) : (this.drawnStart = h, this.drawnEnd = u), this.knownSpace.viewFeatures(this.chr, this.drawnStart, this.drawnEnd, o), this.drawOverlays(), this.positionRuler()
        }, n.prototype.queryRegistry = function (e, t) {
            if (this.registry) {
                var i, r, n = this;
                e ? (i = this.chains[e].coords, n.mappableSources[e] || (n.mappableSources[e] = new c), r = n.mappableSources[e]) : (i = this.coordSystem, r = this.availableSources);
                var o = w(f(i));
                if (t) {
                    var a = localStorage["dalliance.registry." + o + ".last_queried"];
                    if (a) try {
                        s(r, JSON.parse(localStorage["dalliance.registry." + o + ".sources"]), e);
                        var l = (0 | Date.now()) - (0 | a);
                        if (432e5 > l) return
                    } catch (h) {
                        console.log("Bad registry cache: " + h)
                    }
                }
                var u = this.registry;
                if (0 == u.indexOf("//")) {
                    var d = window.location.protocol;
                    "https:" != d && "http:" != d && (u = "http:" + u)
                }
                new F(u).sources(function (t) {
                    for (var n = [], a = 0; a < t.length; ++a) {
                        var l = t[a];
                        if (l.coords && 0 != l.coords.length) {
                            var h = l.coords[0];
                            h.taxon == i.taxon && h.auth == i.auth && h.version == i.version && n.push(l)
                        }
                    }
                    localStorage["dalliance.registry." + o + ".sources"] = JSON.stringify(n), localStorage["dalliance.registry." + o + ".last_queried"] = "" + Date.now(), s(r, n, e)
                }, function (e) {
                }, i)
            }
        }, n.prototype.move = function (e, t) {
            var i = this.viewEnd - this.viewStart, r = this.viewStart - 1 * e / this.scale, n = r + i;
            t || (this.currentSeqMax > 0 && n > this.currentSeqMax && (n = this.currentSeqMax, r = this.viewEnd - i), 1 > r && (r = 1, n = r + i)), this.setLocation(null, r, n, null, t)
        }, n.prototype.zoomStep = function (e) {
            var t = 1 * this.zoomSliderValue, i = t + e;
            i < this.zoomMin && (i = this.zoomMin), i > this.zoomMax && (i = this.zoomMax), i != t && (this.zoomSliderValue = i, this.zoom(Math.exp(1 * i / this.zoomExpt)))
        }, n.prototype.zoom = function (e) {
            this.zoomFactor = e;
            var t = 0 | Math.round((this.viewStart + this.viewEnd) / 2);
            if (this.viewStart = t - this.zoomBase * this.zoomFactor / 2, this.viewEnd = t + this.zoomBase * this.zoomFactor / 2, this.currentSeqMax > 0 && this.viewEnd > this.currentSeqMax + 5) {
                var i = this.viewEnd - this.viewStart + 1;
                this.viewEnd = this.currentSeqMax, this.viewStart = this.viewEnd - i + 1
            }
            if (this.viewStart < 1) {
                var i = this.viewEnd - this.viewStart + 1;
                this.viewStart = 1, this.viewEnd = this.viewStart + i - 1
            }
            this.scale = this.featurePanelWidth / (this.viewEnd - this.viewStart);
            this.viewEnd - this.viewStart + 1, this.scale / this.scaleAtLastRedraw;
            this.notifyLocation(), this.refresh()
        }, n.prototype.spaceCheck = function (e) {
            if (!this.knownSpace || this.knownSpace.chr !== this.chr) return void this.refresh();
            var t = ((this.viewEnd - this.viewStart | 0) + 1, 100 / this.scale | 0);
            1e3 / this.scale | 0;
            ((0 | this.drawnStart) > Math.max(1, (0 | this.viewStart) - t | 0) || (0 | this.drawnEnd) < Math.min((0 | this.viewEnd) + t, (0 | this.currentSeqMax) > 0 ? 0 | this.currentSeqMax : 1e9)) && this.refresh()
        }, n.prototype.resizeViewer = function (e) {
            var t = 0 | this.tierHolder.getBoundingClientRect().width;
            if (0 != t) {
                var i = Math.max(this.featurePanelWidth, 300);
                if (this.featurePanelWidth = 0 | t, i != this.featurePanelWidth) {
                    this.zoomMax = this.zoomExpt * Math.log(this.maxViewWidth / this.zoomBase), this.zoomMin = this.zoomExpt * Math.log(this.featurePanelWidth / this.maxPixelsPerBase / this.zoomBase), this.zoomSliderValue = this.zoomExpt * Math.log((this.viewEnd - this.viewStart + 1) / this.zoomBase);
                    var r = this.viewEnd - this.viewStart, n = this.viewStart + r * this.featurePanelWidth / i;
                    this.viewEnd = n;
                    var s = this.viewEnd - this.viewStart + 1;
                    this.currentSeqMax > 0 && this.viewEnd > this.currentSeqMax && (this.viewEnd = this.currentSeqMax, this.viewStart = this.viewEnd - s + 1), this.viewStart < 1 && (this.viewStart = 1, this.viewEnd = this.viewStart + s - 1), this.positionRuler(), e || this.spaceCheck(), this.notifyLocation()
                }
                this.fullScreen && this.setFullScreenHeight()
            }
        }, n.prototype.setFullScreenHeight = function () {
            var e = document.body.offsetHeight - this.browserHolder.offsetHeight;
            this.browserHolder.style.maxHeight = Math.max(300, window.innerHeight - e - 20) + "px"
        }, n.prototype.addTier = function (e) {
            e = v(e), e.disabled = !1;
            var t = this.makeTier(e);
            return this.markSelectedTiers(), this.positionRuler(), this.notifyTier(), t
        }, n.prototype.removeTier = function (e, t) {
            var i = -1;
            if ("undefined" != typeof e.index && e.index >= 0 && e.index < this.tiers.length) i = e.index; else for (var r = 0; r < this.tiers.length; ++r) {
                var n = this.tiers[r].dasSource;
                if (E(e, n)) {
                    i = r;
                    break
                }
            }
            if (0 > i) throw"Couldn't find requested tier";
            var s = this.tiers[i];
            this.tiers.splice(i, 1);
            for (var o = [], a = 0; a < this.selectedTiers.length; ++a) {
                var l = this.selectedTiers[a];
                i > l ? o.push(l) : l > i && o.push(l - 1)
            }
            this.selectedTiers = o, this.markSelectedTiers(), s.destroy(), this.knownSpace && (this.knownSpace.featureCache[s] = null), this.reorderTiers(), this.notifyTier()
        }, n.prototype.removeAllTiers = function () {
            var e = this;
            this.selectedTiers = [], this.markSelectedTiers(), this.tiers.forEach(function (t) {
                t.destroy(), e.knownSpace && (e.knownSpace.featureCache[t] = null)
            }), this.tiers.length = 0, this.reorderTiers(), this.notifyTier()
        }, n.prototype.getSequenceSource = function () {
            return void 0 === this._sequenceSource && (this._sequenceSource = this._getSequenceSource()), this._sequenceSource
        }, n.prototype._getSequenceSource = function () {
            for (var e = 0; e < this.tiers.length; ++e) if (this.tiers[e].sequenceSource) return this.tiers[e].sequenceSource;
            for (var t = 0; t < this.defaultSources.length; ++t) {
                var i = this.defaultSources[t];
                if (i.provides_entrypoints || "sequence" == i.tier_type || i.twoBitURI || i.twoBitBlob) return i.twoBitURI || i.twoBitBlob ? new I(i) : new H(i)
            }
        }, n.prototype.setLocation = function (e, t, i, r, n) {
            if ("number" != typeof t) throw Error("minimum must be a number (got " + JSON.stringify(t) + ")");
            if ("number" != typeof i) throw Error("maximum must be a number (got " + JSON.stringify(i) + ")");
            if (t > i) {
                var s = t;
                t = i, i = s
            } else t === i && (i += 1);
            r || (r = function (e) {
                if (e) throw e
            });
            var o = this;
            if ((!e || e == this.chr) && this.currentSeqMax > 0) return this._setLocation(null, t, i, null, r, n);
            var a = this.getSequenceSource();
            if (!a) return r("Need a sequence source");
            var l = e || this.chr;
            a.getSeqInfo(l, function (s) {
                if (s) return o._setLocation(e, t, i, s, r, n);
                var h;
                h = 0 == l.indexOf("chr") ? l.substr(3) : "chr" + l, a.getSeqInfo(h, function (s) {
                    return !s && e ? r("Couldn't find sequence '" + e + "'") : s ? o._setLocation(h, t, i, s, r, n) : o._setLocation(null, t, i, null, r, n)
                })
            })
        }, n.prototype._setLocation = function (e, t, i, r, n, s) {
            var o = !1;
            e && (0 == e.indexOf("chr") && (e = e.substring(3)), this.chr != e && (o = !0), this.chr = e, this.currentSeqMax = r.length), t = parseFloat(t), i = parseFloat(i);
            var a = Math.max(10, i - t + 1);
            if (!s) {
                var l = this.currentSeqMax;
                0 >= l && (l = 1e12), 1 > t && (t = 1, i = t + a - 1), i > l && (i = l, t = Math.max(1, i - a + 1))
            }
            this.viewStart = t, this.viewEnd = i;
            var h = Math.max(this.featurePanelWidth, 50) / (this.viewEnd - this.viewStart), u = this.scale,
                c = Math.abs(h - u) > 1e-6;
            this.scale = h;
            var d, p;
            if (p = this.zoomSliderValue, this.zoomSliderValue = d = this.zoomExpt * Math.log((this.viewEnd - this.viewStart + 1) / this.zoomBase), c || o) {
                for (var f = 0; f < this.tiers.length; ++f) this.tiers[f].viewportHolder.style.left = "5000px", this.tiers[f].overlay.style.left = "5000px";
                if (this.refresh(), this.savedZoom) {
                    d -= this.zoomMin, p -= this.zoomMin;
                    var v = d - p, g = d - this.savedZoom;
                    Math.abs(v) > Math.abs(g) && (this.isSnapZooming = !this.isSnapZooming, this.savedZoom = p)
                } else this.isSnapZooming = !1, this.savedZoom = null
            } else for (var f = ((this.viewStart + this.viewEnd) / 2, 0); f < this.tiers.length; ++f) {
                var y = (this.viewStart - this.tiers[f].norigin) * this.scale;
                this.tiers[f].viewportHolder.style.left = "" + ((0 | -y) - 1e3) + "px", this.tiers[f].drawOverlay()
            }
            return this.notifyLocation(), this.spaceCheck(), this.instrumentActivity && (this.activityStartTime = 0 | Date.now()), n()
        }, n.prototype.setCenterLocation = function (e, t) {
            var i = (this.viewEnd - this.viewStart) / 2, r = t - i, n = t + i;
            this.setLocation(e, r, n)
        }, n.prototype.pingActivity = function () {
            if (this.instrumentActivity && this.activityStartTime) {
                for (var e = 0, t = 0; t < this.tiers.length; ++t) "none" !== this.tiers[t].loaderButton.style.display && ++e;
                if (0 == e) {
                    var i = 0 | Date.now();
                    console.log("Loading took " + (i - this.activityStartTime) + "ms"), this.activityStartTime = null
                }
            }
        }, n.prototype.addInitListener = function (e) {
            this.initListeners.push(e)
        }, n.prototype.addFeatureListener = function (e, t) {
            t = t || {}, this.featureListeners.push(e)
        }, n.prototype.removeFeatureListener = function (e, t) {
            var i = arrayIndexOf(this.featureListeners, e);
            i >= 0 && this.featureListeners.splice(i, 1)
        }, n.prototype.notifyFeature = function (e, t, i, r) {
            for (var n = 0; n < this.featureListeners.length; ++n) try {
                if (this.featureListeners[n](e, t, i, r)) return
            } catch (s) {
                console.log(s.stack)
            }
        }, n.prototype.addFeatureHoverListener = function (e, t) {
            t = t || {}, this.featureHoverListeners.push(e)
        }, n.prototype.removeFeatureHoverListener = function (e, t) {
            var i = arrayIndexOf(this.featureHoverListeners, e);
            i >= 0 && this.featureHoverListeners.splice(i, 1)
        }, n.prototype.notifyFeatureHover = function (e, t, i, r) {
            for (var n = 0; n < this.featureHoverListeners.length; ++n) try {
                this.featureHoverListeners[n](e, t, i, r)
            } catch (s) {
                console.log(s.stack)
            }
        }, n.prototype.addViewListener = function (e, t) {
            t = t || {}, this.viewListeners.push(e)
        }, n.prototype.removeViewListener = function (e, t) {
            var i = arrayIndexOf(this.viewListeners, e);
            i >= 0 && this.viewListeners.splice(i, 1)
        }, n.prototype.notifyLocation = function () {
            var e = Math.max(1, 0 | this.viewStart), t = 0 | this.viewEnd;
            this.currentSeqMax > 0 && t > this.currentSeqMax && (t = this.currentSeqMax);
            for (var i = 0; i < this.viewListeners.length; ++i) try {
                this.viewListeners[i](this.chr, e, t, this.zoomSliderValue, {
                    current: this.zoomSliderValue,
                    alternate: this.savedZoom + this.zoomMin || this.zoomMin,
                    isSnapZooming: this.isSnapZooming,
                    min: this.zoomMin,
                    max: this.zoomMax
                }, this.viewStart, this.viewEnd)
            } catch (r) {
                console.log(r.stack)
            }
        }, n.prototype.addTierListener = function (e) {
            this.tierListeners.push(e)
        }, n.prototype.removeTierListener = function (e) {
            var t = arrayIndexOf(this.tierListeners, e);
            t >= 0 && this.tierListeners.splice(t, 1)
        }, n.prototype.notifyTier = function () {
            for (var e = 0; e < this.tierListeners.length; ++e) try {
                this.tierListeners[e]()
            } catch (t) {
                console.log(t.stack)
            }
        }, n.prototype.addRegionSelectListener = function (e) {
            this.regionSelectListeners.push(e)
        }, n.prototype.removeRegionSelectListener = function (e) {
            var t = arrayIndexOf(this.regionSelectListeners, e);
            t >= 0 && this.regionSelectListeners.splice(t, 1)
        }, n.prototype.notifyRegionSelect = function (e, t, i) {
            for (var r = 0; r < this.regionSelectListeners.length; ++r) try {
                this.regionSelectListeners[r](e, t, i)
            } catch (n) {
                console.log(n.stack)
            }
        }, n.prototype.highlightRegion = function (e, t, i) {
            var r = this;
            if (e == this.chr) return this._highlightRegion(e, t, i);
            var n = this.getSequenceSource();
            if (!n) throw"Need a sequence source";
            n.getSeqInfo(e, function (s) {
                if (s) return r._highlightRegion(e, t, i);
                var o;
                o = 0 == e.indexOf("chr") ? e.substr(3) : "chr" + e, n.getSeqInfo(o, function (e) {
                    return e ? r._highlightRegion(o, t, i) : void 0
                })
            })
        }, n.prototype._highlightRegion = function (e, t, i) {
            for (var n = 0; n < this.highlights.length; ++n) {
                var s = this.highlights[n];
                if (s.chr == e && s.min == t && s.max == i) return
            }
            this.highlights.push(new r(e, t, i));
            var o = this.viewStart - 1e3 / this.scale, a = this.viewEnd + 1e3 / this.scale;
            (e == this.chr || e == "chr" + this.chr) && a > t && i > o && this.drawOverlays(), this.notifyLocation()
        }, n.prototype.clearHighlights = function () {
            this.highlights = [], this.drawOverlays(), this.notifyLocation()
        }, n.prototype.drawOverlays = function () {
            for (var e = 0; e < this.tiers.length; ++e) this.tiers[e].drawOverlay()
        }, n.prototype.featuresInRegion = function (e, t, i) {
            var r = [];
            if (e !== this.chr) return [];
            for (var n = 0; n < this.tiers.length; ++n) for (var s = this.tiers[n].currentFeatures || [], o = 0; o < s.length; ++o) {
                var a = s[o];
                a.min <= i && a.max >= t && r.push(a)
            }
            return r
        }, n.prototype.getSelectedTier = function () {
            return this.selectedTiers.length > 0 ? this.selectedTiers[0] : -1
        }, n.prototype.setSelectedTier = function (e) {
            null == e ? this.selectedTiers = [] : this.selectedTiers = [e], this.markSelectedTiers(), this.notifyTierSelection()
        }, n.prototype.markSelectedTiers = function () {
            for (var e = 0; e < this.tiers.length; ++e) {
                var t = this.tiers[e].nameButton;
                this.selectedTiers.indexOf(e) >= 0 ? t.classList.add("active") : t.classList.remove("active")
            }
            if (this.selectedTiers.length > 0) {
                var i = this.browserHolder.offsetTop + this.browserHolder.offsetHeight / 2;
                i > document.body.scrollTop && i + 100 < document.body.scrollTop + window.innerHeight && this.browserHolder.focus()
            }
        }, n.prototype.addTierSelectionListener = function (e) {
            this.tierSelectionListeners.push(e)
        }, n.prototype.removeTierSelectionListener = function (e) {
            var t = arrayIndexOf(this.tierSelectionListeners, e);
            t >= 0 && this.tierSelectionListeners.splice(t, 1)
        }, n.prototype.notifyTierSelection = function () {
            for (var e = 0; e < this.tierSelectionListeners.length; ++e) try {
                this.tierSelectionListeners[e](this.selectedTiers)
            } catch (t) {
                console.log(t.stack)
            }
        }, n.prototype.addTierSelectionWrapListener = function (e) {
            this.tierSelectionWrapListeners.push(e)
        }, n.prototype.removeTierSelectionWrapListener = function (e) {
            var t = arrayIndexOf(this.tierSelectionWrapListeners, e);
            t >= 0 && this.tierSelectionWrapListeners.splice(t, 1)
        }, n.prototype.notifyTierSelectionWrap = function (e) {
            for (var t = 0; t < this.tierSelectionWrapListeners.length; ++t) try {
                this.tierSelectionWrapListeners[t](e)
            } catch (i) {
                console.log(i.stack)
            }
        }, n.prototype.positionRuler = function () {
            var e = "none", t = "", i = "";
            if ("center" == this.rulerLocation ? (e = "block", t = "" + (this.featurePanelWidth / 2 | 0) + "px") : "left" == this.rulerLocation ? (e = "block", t = "0px") : "right" == this.rulerLocation ? (e = "block", i = "0px") : e = "none", this.ruler.style.display = e, this.ruler.style.left = t, this.ruler.style.right = i, this.singleBaseHighlight) {
                this.ruler2.style.display = "block", this.ruler2.style.borderWidth = "1px", this.scale < 1 ? (this.ruler2.style.width = "0px", this.ruler2.style.borderRightWidth = "0px") : (this.ruler2.style.width = this.scale + "px", this.ruler2.style.borderRightWidth = "1px"), this.locSingleBase.style.visibility = "visible";
                var r = this.featurePanelWidth / 2 - this.locSingleBase.offsetWidth / 2 + this.ruler2.offsetWidth / 2;
                this.locSingleBase.style.left = "" + (0 | r) + "px"
            } else this.locSingleBase.style.visibility = "hidden", this.ruler2.style.width = "1px", this.ruler2.style.borderWidth = "0px", this.ruler2.style.display = "center" == this.rulerLocation ? "none" : "block";
            this.ruler2.style.left = "" + (this.featurePanelWidth / 2 | 0) + "px";
            for (var n = 0; n < this.tiers.length; ++n) {
                var s, o = this.tiers[n], a = o.quantOverlay;
                o.subtiers && o.subtiers.length > 0 && (s = o.subtiers[0].quant), a && (a.style.display = s ? e : "none", a.style.left = t, a.style.right = i)
            }
        }, n.prototype.featureDoubleClick = function (e, t, i) {
            if (e && 0 != e.length) {
                var r = e[e.length - 1];
                if (r.min && r.max) {
                    var n = ((0 | r.min) - (0 | this.viewStart)) * this.scale, s = (r.max - r.min + 1) * this.scale,
                        o = ((0 | r.min) + (0 | r.max)) / 2;
                    if (s > 10) {
                        var a = 1 * (t - n) / s;
                        .3 > a ? o = 0 | r.min : a > .7 && (o = (0 | r.max) + 1)
                    }
                    var l = this.viewEnd - this.viewStart;
                    this.setLocation(null, o - l / 2, o + l / 2)
                }
            }
        }, n.prototype.zoomForScale = function (e) {
            var t;
            return t = e > .2 ? "high" : e > .01 ? "medium" : "low"
        }, n.prototype.zoomForCurrentScale = function () {
            return this.zoomForScale(this.scale)
        }, n.prototype.updateHeight = function () {
            for (var e = 0, t = 0; t < this.tiers.length; ++t) e += this.tiers[t].currentHeight || 30;
            this.ruler.style.height = "" + e + "px", this.ruler2.style.height = "" + e + "px", this.browserHolder.style.display = "block", this.browserHolder.style.display = "-webkit-flex", this.browserHolder.style.display = "flex"
        }, n.prototype.scrollArrowKey = function (e, t) {
            if (this.reverseKeyScrolling && (t = -t), e.ctrlKey || e.metaKey) {
                var i = !1;
                e.shiftKey && (i = !0), this.leap(t, i)
            } else if (this.scale > 1) {
                var r = (this.viewStart + this.viewEnd) / 2, n = r - Math.round(r), s = 1;
                e.shiftKey && (s *= 10), t > 0 ? (s = -s, s -= n, n > 0 && (s += 1)) : (s -= n, 0 > n && (s -= 1)), this.setLocation(null, this.viewStart + s, this.viewEnd + s)
            } else this.move(e.shiftKey ? 100 * t : 25 * t)
        }, n.prototype.leap = function (e, t) {
            var i = this, r = (i.viewStart + i.viewEnd + 1) / 2 | 0;
            e > 0 && i.viewStart <= 1 ? r -= 1e8 : 0 > e && i.viewEnd >= i.currentSeqMax && (r += 1e8);
            var n = i.getSelectedTier();
            if (!(0 > n)) {
                var s = i.tiers[n];
                s && (s.featureSource && this.sourceAdapterIsCapable(s.featureSource, "quantLeap") && "number" == typeof s.quantLeapThreshold || s.featureSource && this.sourceAdapterIsCapable(s.featureSource, "leap")) ? s.findNextFeature(i.chr, r, -e, t, function (n) {
                    if (n) {
                        var s = n.min, o = n.max;
                        t && (e > 0 ? s > r + 1 ? o = s : (o++, s = o) : r - 1 > o ? (o++, s = o) : o = s);
                        var a = i.viewEnd - i.viewStart + 1;
                        parseFloat(a / 2) == parseInt(a / 2) && a--;
                        var l = (s + o - a) / 2 + 1, h = l + a - 1;
                        i.setLocation(n.segment, l, h)
                    } else alert("no next feature")
                }) : this.move(100 * e)
            }
        }, n.prototype.nameForCoordSystem = function (e) {
            var t = null, i = null;
            return this.assemblyNamePrimary && (t = "" + e.auth, "undefined" != typeof e.version && (t += e.version)), this.assemblyNameUcsc && (i = e.ucscName), null != t && null != i ? t + "/" + i : t || i || "unknown"
        }, n.prototype.makeLoader = function (e) {
            e = e || 16;
            var t = window.devicePixelRatio > 1;
            return 20 > e ? d("img", null, {
                src: this.resolveURL("$$img/spinner_" + (t ? 16 : 32) + ".gif"),
                width: "16",
                height: "16"
            }) : d("img", null, {
                src: this.resolveURL("$$img/spinner_" + (t ? 24 : 48) + ".gif"),
                width: "24",
                height: "24"
            })
        }, n.prototype.canFetchPlainHTTP = function () {
            var e = this;
            if (!this._plainHTTPPromise) {
                var t = this.getWorker();
                t ? this._plainHTTPPromise = new A(function (i, r) {
                    t.postCommand({command: "textxhr", uri: e.httpCanaryURL}, function (e, t) {
                        i(e ? !0 : !1)
                    })
                }) : this._plainHTTPPromise = new A(function (t, i) {
                    g(e.httpCanaryURL, function (e, i) {
                        t(e ? !0 : !1)
                    }, {timeout: 2e3})
                })
            }
            return this._plainHTTPPromise
        }, n.prototype.getWorker = function () {
            return this.useFetchWorkers && this.fetchWorkers && 0 != this.fetchWorkers.length ? (this.nextWorker >= this.fetchWorkers.length && (this.nextWorker = 0), this.fetchWorkers[this.nextWorker++]) : null
        }, a.prototype.postCommand = function (e, t, i) {
            var r = "x" + ++this.tagSeed;
            e.tag = r, this.callbacks[r] = t, this.worker.postMessage(e, i)
        }, "undefined" != typeof t) {
            t.exports = {Browser: n}, e("./browser-ui"), e("./track-adder"), e("./feature-popup"), e("./tier-actions"), e("./domui"), e("./search");
            var M = e("./sourceadapters"), I = M.TwoBitSequenceSource, H = M.DASSequenceSource,
                P = e("./kspace").KnownSpace, F = e("./das").DASRegistry
        }
        h.prototype.get = function (e) {
            var t = this.sourcesByURI[B(e)];
            if (t) for (var i = 0; i < t.configs.length; ++i) if (R(t.configs[i], e)) return t.sources[i]
        }, h.prototype.put = function (e, t) {
            var i = B(e), r = this.sourcesByURI[i];
            r || (r = {configs: [], sources: []}, this.sourcesByURI[i] = r), r.configs.push(e), r.sources.push(t)
        }
    }, {
        "./browser-ui": 5,
        "./chainset": 7,
        "./das": 10,
        "./domui": 11,
        "./feature-popup": 19,
        "./kspace": 23,
        "./numformats": 26,
        "./search": 30,
        "./sha1": 33,
        "./sourceadapters": 34,
        "./sourcecompare": 35,
        "./thub": 42,
        "./tier": 45,
        "./tier-actions": 43,
        "./track-adder": 46,
        "./utils": 49,
        "./version": 51,
        "es6-promise": 53
    }],
    7: [function (e, t, i) {
        "use strict";

        function r(e, t, i, r) {
            "string" == typeof e ? (this.uri = e, this.srcTag = t, this.destTag = i, this.coords = r) : (this.uri = e.uri, this.srcTag = e.srcTag, this.destTag = e.destTag, this.coords = v(e.coords), this.type = e.type, this.credentials = e.credentials), this.chainsBySrc = {}, this.chainsByDest = {}, this.postFetchQueues = {}, this.fetchedTiles = {}, this.granularity = 1e6, "bigbed" == this.type ? this.chainFetcher = new s(this.uri, this.credentials) : "alias" == this.type ? this.chainFetcher = new h(e) : this.chainFetcher = new n(this.uri, this.srcTag, this.destTag)
        }

        function n(e, t, i) {
            this.source = new c(e), this.srcTag = t, this.destTag = i
        }

        function s(e, t) {
            var i = this;
            this.uri = e, this.credentials = t, this.bwg = new x(function (e, t) {
                w(new m(i.uri, {credentials: i.credentials}), function (i, r) {
                    i ? e(i) : t(r)
                })
            }), this.bwg.then(function (e, t) {
                t && console.log(t)
            })
        }

        function o(e) {
            return parseInt(e)
        }

        function a(e) {
            return 0 == e.indexOf("chr") ? e.substr(3) : e
        }

        function l(e) {
            for (var t = {
                srcChr: a(e.srcChrom),
                srcMin: parseInt(e.srcStart),
                srcMax: parseInt(e.srcEnd),
                srcOri: e.srcOri,
                destChr: a(e.segment),
                destMin: e.min - 1,
                destMax: e.max,
                destOri: e.ori,
                blocks: []
            }, i = e.srcStarts.split(",").map(o), r = e.destStarts.split(",").map(o), n = e.blockLens.split(",").map(o), s = 0; s < i.length; ++s) t.blocks.push([i[s], r[s], n[s]]);
            return t
        }

        function h(e) {
            this.conf = e, this.forwardAliases = {};
            for (var t = e.sequenceAliases || [], i = 0; i < t.length; ++i) {
                var r = t[i];
                if (!(r.length < 2)) {
                    for (var n = [], s = 0; s < r.length - 1; ++s) n.push(r[s]);
                    this.forwardAliases[r[r.length - 1]] = n
                }
            }
        }

        if ("undefined" != typeof e) var u = e("./das"), c = u.DASSource, d = u.DASSegment, p = e("./utils"),
            f = p.pusho, v = p.shallowCopy, g = e("./cigar").parseCigar, y = e("./bin"), m = y.URLFetchable,
            b = e("./bigwig"), w = b.makeBwg, x = e("es6-promise").Promise;
        r.prototype.exportConfig = function () {
            return {
                uri: this.uri,
                srcTag: this.srcTag,
                destTag: this.destTag,
                coords: this.coords,
                type: this.type,
                credentials: this.credentials
            }
        }, r.prototype.mapPoint = function (e, t) {
            for (var i = this.chainsBySrc[e] || [], r = 0; r < i.length; ++r) {
                var n = i[r];
                if (t >= n.srcMin && t <= n.srcMax) {
                    var s;
                    s = "-" == n.srcOri ? n.srcMax - t : t - n.srcMin;
                    for (var o = n.blocks, a = 0; a < o.length; ++a) {
                        var l = o[a], h = l[0], u = l[1], c = l[2];
                        if (s >= h && h + c >= s) {
                            var d, p = s - h;
                            return d = "-" == n.destOri ? n.destMax - u - p : p + u + n.destMin, {
                                seq: n.destChr,
                                pos: d,
                                flipped: n.srcOri != n.destOri
                            }
                        }
                    }
                }
            }
            return null
        }, r.prototype.mapSegment = function (e, t, i) {
            for (var r = this.chainsBySrc[e] || [], n = [], s = 0; s < r.length; ++s) {
                var o = r[s];
                if (i >= o.srcMin && t <= o.srcMax) {
                    var a, l;
                    "-" == o.srcOri ? (a = o.srcMax - i, l = o.srcMax - t) : (a = t - o.srcMin, l = i - o.srcMin);
                    for (var h = o.blocks, u = 0; u < h.length; ++u) {
                        var c = h[u], d = c[0], p = c[1], f = c[2];
                        if (l >= d && d + f >= a) {
                            var v = {segment: o.destChr, flipped: "-" == o.srcOri ^ "-" == o.destOri};
                            "-" == o.destOri ? (a >= d ? v.max = o.destMax - p - a + d : (v.max = o.destMax - p, v.partialMax = d - a), d + f >= l ? v.min = o.destMax - p - l + d : (v.min = o.destMax - p - f, v.partialMin = l - d - f)) : (a >= d ? v.min = o.destMin + p + a - d : (v.min = o.destMin + p, v.partialMin = d - a), d + f >= l ? v.max = o.destMin + p + l - d : (v.max = o.destMin + p + f, v.partialMax = l - d - f)), n.push(v)
                        }
                    }
                }
            }
            return n
        }, r.prototype.unmapPoint = function (e, t) {
            for (var i = this.chainsByDest[e] || [], r = 0; r < i.length; ++r) {
                var n = i[r];
                if (t >= n.destMin && t <= n.destMax) {
                    var s;
                    s = "-" == n.srcOri ? n.destMax - t : t - n.destMin;
                    for (var o = n.blocks, a = 0; a < o.length; ++a) {
                        var l = o[a], h = l[0], u = l[1], c = l[2];
                        if (s >= u && u + c >= s) {
                            var d, p = s - u, d = p + h + n.srcMin;
                            return d = "-" == n.destOri ? n.srcMax - h - p : p + h + n.srcMin, {
                                seq: n.srcChr,
                                pos: d,
                                flipped: n.srcOri != n.destOri
                            }
                        }
                    }
                }
            }
            return null
        }, r.prototype.sourceBlocksForRange = function (e, t, i, r) {
            for (var n = 1, s = 2, o = this, a = t / this.granularity | 0, l = i / this.granularity | 0, h = !1, u = !1, c = a; l >= c; ++c) {
                var p = e + "_" + c;
                this.fetchedTiles[p] != s && (h = !0, this.fetchedTiles[p] != n && (this.fetchedTiles[p] = n, u = !0))
            }
            if (h) this.postFetchQueues[e] || this.chainFetcher.fetchChains(e, a * this.granularity, (l + 1) * this.granularity - 1).then(function (t) {
                o.chainsByDest || (o.chainsByDest[e] = []);
                for (var i = 0; i < t.length; ++i) {
                    var r = t[i], n = o.chainsBySrc[r.srcChr];
                    if (n) {
                        for (var h = !1, u = 0; u < n.length; ++u) {
                            var c = n[u];
                            if (c.srcMin == r.srcMin && c.srcMax == r.srcMax) {
                                h = !0;
                                break
                            }
                        }
                        h || n.push(r)
                    } else o.chainsBySrc[r.srcChr] = [r];
                    var d = o.chainsByDest[r.destChr];
                    if (d) {
                        for (var h = !1, u = 0; u < d.length; ++u) {
                            var c = d[u];
                            if (c.destMin == r.destMin && c.destMax == r.destMax) {
                                h = !0;
                                break
                            }
                        }
                        h || d.push(r)
                    } else o.chainsByDest[r.destChr] = [r]
                }
                for (var p = a; l >= p; ++p) {
                    var f = e + "_" + p;
                    o.fetchedTiles[f] = s
                }
                if (o.postFetchQueues[e]) {
                    for (var v = o.postFetchQueues[e], g = 0; g < v.length; ++g) v[g]();
                    o.postFetchQueues[e] = null
                }
            })["catch"](function (e) {
                console.log(e)
            }), f(this.postFetchQueues, e, function () {
                o.sourceBlocksForRange(e, t, i, r)
            }); else {
                for (var v = [], g = this.chainsByDest[e] || [], y = 0; y < g.length; ++y) {
                    var m = g[y];
                    if (t <= m.destMax && i >= m.destMin) {
                        var b, w;
                        "-" == m.srcOri ? (b = m.destMax - i, w = m.destMax - t) : (b = t - m.destMin, w = i - m.destMin);
                        for (var x = m.blocks, S = 0; S < x.length; ++S) {
                            var _ = x[S], C = _[0], T = _[1], k = _[2];
                            if (w >= T && T + k >= b) {
                                var L = Math.max(b, T) - T, A = Math.min(w, T + k) - T;
                                "-" == m.destOri ? v.push(new d(m.srcChr, m.srcMax - C - A, m.srcMax - C - L)) : v.push(new d(m.srcChr, m.srcMin + L + C, m.srcMin + A + C))
                            }
                        }
                    }
                }
                r(v)
            }
        }, n.prototype.fetchChains = function (e, t, i) {
            var r = this;
            return new x(function (t, i) {
                r.source.alignments(e, {}, function (e) {
                    for (var i = [], n = 0; n < e.length; ++n) for (var s = e[n], o = 0; o < s.blocks.length; ++o) {
                        for (var a, l, h = s.blocks[o], u = 0; u < h.segments.length; ++u) {
                            var c = h.segments[u], d = s.objects[c.object];
                            d.dbSource === r.srcTag ? a = c : d.dbSource === r.destTag && (l = c)
                        }
                        if (a && l) {
                            for (var p = {
                                srcChr: s.objects[a.object].accession,
                                srcMin: 0 | a.min,
                                srcMax: 0 | a.max,
                                srcOri: a.strand,
                                destChr: s.objects[l.object].accession,
                                destMin: 0 | l.min,
                                destMax: 0 | l.max,
                                destOri: l.strand,
                                blocks: []
                            }, f = g(a.cigar), v = g(l.cigar), y = 0, m = 0, b = 0, w = 0; b < f.length && w < v.length;) if ("M" == f[b].op && "M" == v[w].op) {
                                var x = Math.min(f[b].cnt, v[w].cnt);
                                p.blocks.push([y, m, x]), f[b].cnt == x ? ++b : f[b].cnt -= x, v[w].cnt == x ? ++w : v[w] -= x, y += x, m += x
                            } else "I" == f[b].op ? m += f[b++].cnt : "I" == v[w].op && (y += v[w++].cnt);
                            i.push(p)
                        }
                    }
                    t(i)
                })
            })
        }, s.prototype.fetchChains = function (e, t, i) {
            return this.bwg.then(function (r, n) {
                if (!r) throw Error("No BWG");
                return new x(function (n, s) {
                    r.getUnzoomedView().readWigData(e, t, i, function (e) {
                        n(e.map(l))
                    })
                })
            })
        }, h.prototype.fetchChains = function (e, t, i) {
            for (var r = [], n = this.forwardAliases[e] || [], s = 0; s < n.length; ++s) r.push({
                srcChr: n[s],
                srcMin: 1,
                srcMax: 1e9,
                srcOri: "+",
                destChr: e,
                destMin: 1,
                destMax: 1e9,
                destOri: "+",
                blocks: [[1, 1, 1e9]]
            });
            return x.resolve(r)
        }, "undefined" != typeof t && (t.exports = {Chainset: r})
    }, {"./bigwig": 3, "./bin": 4, "./cigar": 8, "./das": 10, "./utils": 49, "es6-promise": 53}],
    8: [function (e, t, i) {
        function r(e) {
            for (var t, i = []; null != (t = n.exec(e));) {
                var r = t[1];
                0 == r.length && (r = 1), i.push({cnt: 0 | r, op: t[2]})
            }
            return i
        }

        var n = new RegExp("([0-9]*)([MIDS])", "g");
        "undefined" != typeof t && (t.exports = {parseCigar: r})
    }, {}],
    9: [function (e, t, i) {
        "use strict";

        function r(e, t, i, r) {
            this.red = 0 | e, this.green = 0 | t, this.blue = 0 | i, r && (this.name = r)
        }

        function n(e) {
            var t = "00" + e.toString(16);
            return t.substring(t.length - 2)
        }

        function s(e) {
            var t = l[e];
            if (!t) {
                var i = h.exec(e);
                i ? (t = new r("0x" + i[1] | 0, "0x" + i[2] | 0, "0x" + i[3] | 0, e), l[e] = t) : (i = u.exec(e), i ? (t = new r(0 | i[1], 0 | i[2], 0 | i[3], e), l[e] = t) : (console.log("couldn't handle color: " + e), t = l.black, l[e] = t))
            }
            return t
        }

        function o(e, t, i) {
            for (var n = [], o = 0; o < i.length; ++o) n.push(s(i[o]));
            var a = [];
            e:for (var l = 0; e > l; ++l) {
                for (var h = 1 * l / (e - 1), u = t[0] + (t[t.length - 1] - t[0]) * h, c = 0; c < t.length - 1; ++c) if (u >= t[c] && u <= t[c + 1]) {
                    var d = (u - t[c]) / (t[c + 1] - t[c]), p = n[c], f = n[c + 1],
                        v = new r(p.red * (1 - d) + f.red * d | 0, p.green * (1 - d) + f.green * d | 0, p.blue * (1 - d) + f.blue * d | 0).toSvgString();
                    a.push(v);
                    continue e
                }
                throw"Bad step"
            }
            return a
        }

        function a(e, t, i, r) {
            return r ? o(e, [0, .5, 1], [t, i, r]) : o(e, [0, 1], [t, i])
        }

        r.prototype.toSvgString = function () {
            return this.name || (this.name = "rgb(" + this.red + "," + this.green + "," + this.blue + ")"), this.name
        }, r.prototype.toHexString = function () {
            return "#" + n(this.red) + n(this.green) + n(this.blue)
        };
        var l = {
                red: new r(255, 0, 0, "red"),
                green: new r(0, 255, 0, "green"),
                blue: new r(0, 0, 255, "blue"),
                yellow: new r(255, 255, 0, "yellow"),
                white: new r(255, 255, 255, "white"),
                black: new r(0, 0, 0, "black"),
                gray: new r(180, 180, 180, "gray"),
                grey: new r(180, 180, 180, "grey"),
                lightskyblue: new r(135, 206, 250, "lightskyblue"),
                lightsalmon: new r(255, 160, 122, "lightsalmon"),
                hotpink: new r(255, 105, 180, "hotpink")
            }, h = new RegExp("^#([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})$"),
            u = /rgb\(([0-9]+),([0-9]+),([0-9]+)\)/;
        "undefined" != typeof t && (t.exports = {makeColourSteps: o, makeGradient: a, dasColourForName: s})
    }, {}],
    10: [function (e, t, i) {
        "use strict";

        function r(e, t, i, r) {
            this.name = e, this.start = t, this.end = i, this.description = r
        }

        function n(e, t) {
            var i;
            "string" == typeof e ? (this.uri = e, i = t || {}) : i = e || {};
            for (var r in i) "function" != typeof i[r] && (this[r] = i[r]);
            this.coords || (this.coords = []), this.props || (this.props = {}), this.dasBaseURI = this.uri, this.dasBaseURI && "/" != this.dasBaseURI.substr(this.uri.length - 1) && (this.dasBaseURI = this.dasBaseURI + "/")
        }

        function s() {
        }

        function o(e, t) {
            return e.taxon == t.taxon && e.auth == t.auth && e.version == t.version
        }

        function a(e, t, i, r, n) {
            this.name = e, this.start = t, this.end = i, this.alphabet = r, this.seq = n
        }

        function l() {
        }

        function h(e) {
            e && (this.id = e)
        }

        function u(e, t) {
            this.desc = e, this.uri = t
        }

        function c(e) {
            this.type = e, this.objects = {}, this.blocks = []
        }

        function d() {
            this.styles = []
        }

        function p() {
        }

        function f(e) {
            var t = e.getAttribute("steps");
            t = t ? 0 | t : 50;
            for (var i = [], r = [], n = e.getElementsByTagName("STOP"), s = 0; s < n.length; ++s) {
                var o = n[s];
                i.push(1 * o.getAttribute("score")), r.push(o.firstChild.nodeValue)
            }
            return A(t, i, r)
        }

        function v(e, t) {
            t = t || {}, this.uri = e, this.opts = t
        }

        function g(e, t) {
            var i = e.getElementsByTagName(t);
            if (i.length > 0 && i[0].firstChild) {
                var r = i[0];
                if (1 == r.childNodes.length) return r.firstChild.nodeValue;
                for (var n = "", s = 0; s < r.childNodes.length; ++s) n += r.childNodes[s].nodeValue;
                return n
            }
            return null
        }

        function y(e) {
            if (e.hasChildNodes()) {
                var t = e.firstChild;
                do {
                    if (t.nodeType == Node.ELEMENT_NODE) return t;
                    t = t.nextSibling
                } while (null != t)
            }
            return null
        }

        function m(e) {
            for (var t = new Array, i = e.getElementsByTagName("LINK"), r = 0; r < i.length; ++r) {
                var n = i[r];
                n.parentNode == e && t.push(new u(n.firstChild ? n.firstChild.nodeValue : "Unknown", n.getAttribute("href")))
            }
            return t
        }

        function b(e) {
            for (var t = [], i = e.getElementsByTagName("NOTE"), r = 0; r < i.length; ++r) i[r].firstChild && t.push(i[r].firstChild.nodeValue);
            return t
        }

        function w(e, t, i, r) {
            if (window.XDomainRequest) {
                var n = new XDomainRequest;
                n.onload = function () {
                    var e = new ActiveXObject("Microsoft.XMLDOM");
                    e.async = !1, e.loadXML(n.responseText), t(e)
                }, n.open("get", e), n.send("")
            } else try {
                var n = new XMLHttpRequest, s = setTimeout(function () {
                    console.log("timing out " + e), n.abort(), t(null, n)
                }, 5e3);
                n.timeout = 5e3, n.ontimeout = function () {
                    console.log("timeout on " + e)
                }, n.onreadystatechange = function () {
                    4 == n.readyState && (clearTimeout(s), (n.status >= 200 || 0 == n.status) && t(n.responseXML, n))
                }, n.open("get", e, !0), i && (n.withCredentials = !0), r && n.setRequestHeader("X-DAS-Authorisation", r), n.overrideMimeType("text/xml"), n.setRequestHeader("Accept", "application/xml,*/*"), n.send("")
            } catch (o) {
                t(null, n, o)
            }
        }

        function x(e) {
            return e = ("" + e).toLowerCase(), "yes" === e || "true" === e
        }

        function S(e) {
            return e ? (e = ("" + e).toLowerCase(), "no" !== e || "false" !== e) : !1
        }

        function _(e) {
            var t = T(e);
            t.styles = [];
            for (var i = 0; i < e.styles.length; ++i) {
                var r = t.styles[i] = T(e.styles[i]);
                r._methodRE = r._labelRE = r._typeRE = void 0, r.style = T(r.style), r.style.id = void 0, r.style._gradient = void 0
            }
            return t
        }

        if ("undefined" != typeof e) var C = e("./utils"), T = C.shallowCopy, k = C.pusho, L = e("./color"),
            A = L.makeColourSteps;
        new Array;
        r.prototype.toString = function () {
            return this.name + ":" + this.start + ".." + this.end
        }, r.prototype.isBounded = function () {
            return this.start && this.end
        }, r.prototype.toDASQuery = function () {
            var e = "segment=" + this.name;
            return this.start && this.end && (e += ":" + this.start + "," + this.end), e
        }, n.prototype.entryPoints = function (e) {
            var t = this.dasBaseURI + "entry_points";
            this.doCrossDomainRequest(t, function (t) {
                if (!t) return e([]);
                for (var i = new Array, n = t.getElementsByTagName("SEGMENT"), s = 0; s < n.length; ++s) {
                    var o, a, l = n[s], h = l.getAttribute("id"), u = l.getAttribute("size");
                    u ? (o = 1, a = 0 | u) : (o = l.getAttribute("start"), o && (o |= 0), a = l.getAttribute("stop"), a && (a |= 0));
                    var c = null;
                    l.firstChild && (c = l.firstChild.nodeValue), i.push(new r(h, o, a, c))
                }
                e(i)
            })
        }, n.prototype.sequence = function (e, t) {
            var i = this.dasBaseURI + "sequence?" + e.toDASQuery();
            this.doCrossDomainRequest(i, function (e) {
                if (!e) return void t([]);
                for (var i = new Array, r = e.getElementsByTagName("SEQUENCE"), n = 0; n < r.length; ++n) {
                    var s = r[n], o = s.getAttribute("id"), l = s.getAttribute("start"), h = s.getAttribute("stop"),
                        u = "DNA", c = null;
                    if (s.firstChild) {
                        var d = s.firstChild.nodeValue;
                        c = "";
                        for (var p = 0; ;) {
                            var f = d.indexOf("\n", p);
                            if (!(f >= 0)) {
                                c += d.substring(p).toUpperCase();
                                break
                            }
                            c += d.substring(p, f).toUpperCase(), p = f + 1
                        }
                    }
                    i.push(new a(o, l, h, u, c))
                }
                t(i)
            })
        }, n.prototype.features = function (e, t, i) {
            t = t || {};
            var r;
            if (this.features_uri) r = this.features_uri; else {
                var n = [];
                if (e) n.push(e.toDASQuery()); else if (t.group) {
                    var s = t.group;
                    if ("string" == typeof s) n.push("group_id=" + s); else for (var o = 0; o < s.length; ++o) n.push("group_id=" + s[o])
                }
                if (t.adjacent) {
                    var a = t.adjacent;
                    "string" == typeof a && (a = [a]);
                    for (var u = 0; u < a.length; ++u) n.push("adjacent=" + a[u])
                }
                if (t.type) if ("string" == typeof t.type) n.push("type=" + t.type); else for (var c = 0; c < t.type.length; ++c) n.push("type=" + t.type[c]);
                t.maxbins && n.push("maxbins=" + t.maxbins), n.length > 0 ? r = this.dasBaseURI + "features?" + n.join(";") : i([], "No filters specified")
            }
            this.doCrossDomainRequest(r, function (e, t) {
                if (!e) {
                    var r;
                    return r = 0 == t.status ? "server may not support CORS" : "status=" + t.status, void i([], "Failed request: " + r)
                }
                for (var n = new Array, s = {}, o = e.getElementsByTagName("SEGMENT"), a = 0; a < o.length; ++a) {
                    var u = o[a], c = u.getAttribute("id");
                    s[c] = {min: u.getAttribute("start"), max: u.getAttribute("stop")};
                    for (var d = u.getElementsByTagName("FEATURE"), p = 0; p < d.length; ++p) {
                        var f = d[p], v = new l;
                        v.segment = c, v.id = f.getAttribute("id"), v.label = f.getAttribute("label");
                        var y = g(f, "START"), w = g(f, "END");
                        (0 | y) > (0 | w) ? (v.min = 0 | w, v.max = 0 | y) : (v.min = 0 | y, v.max = 0 | w);
                        var x = f.getElementsByTagName("TYPE");
                        if (x.length > 0) {
                            var S = x[0];
                            S.firstChild && (v.type = S.firstChild.nodeValue), v.typeId = S.getAttribute("id"), v.typeCv = S.getAttribute("cvId")
                        }
                        v.type = g(f, "TYPE"), !v.type && v.typeId && (v.type = v.typeId), v.method = g(f, "METHOD");
                        var _ = g(f, "ORIENTATION");
                        _ || (_ = "0"), v.orientation = _, v.score = g(f, "SCORE"), v.links = m(f), v.notes = b(f);
                        for (var C = f.getElementsByTagName("GROUP"), T = 0; T < C.length; ++T) {
                            var k = C[T], L = new h;
                            L.type = k.getAttribute("type"), L.id = k.getAttribute("id"), L.links = m(k), L.notes = b(k), v.groups ? v.groups.push(L) : v.groups = new Array(L)
                        }
                        if (v.notes) for (var A = 0; A < v.notes.length; ++A) {
                            var O = v.notes[A];
                            if (0 == O.indexOf("Genename=")) {
                                var E = new h;
                                E.type = "gene", E.id = O.substring(9), v.groups ? v.groups.push(E) : v.groups = new Array(E);
                            }
                        }
                        var R = f.getElementsByTagName("PART");
                        if (R.length > 0) {
                            for (var B = [], M = 0; M < R.length; ++M) B.push(R[M].getAttribute("id"));
                            v.parts = B
                        }
                        var R = f.getElementsByTagName("PARENT");
                        if (R.length > 0) {
                            for (var I = [], M = 0; M < R.length; ++M) I.push(R[M].getAttribute("id"));
                            v.parents = I
                        }
                        n.push(v)
                    }
                }
                i(n, void 0, s)
            }, function (e) {
                i([], e)
            })
        }, n.prototype.alignments = function (e, t, i) {
            var r = this.dasBaseURI + "alignment?query=" + e;
            this.doCrossDomainRequest(r, function (e) {
                if (!e) return void i([], "Failed request " + r);
                for (var t = [], n = e.getElementsByTagName("alignment"), s = 0; s < n.length; ++s) {
                    for (var o = n[s], a = new c(o.getAttribute("alignType")), l = o.getElementsByTagName("alignObject"), h = 0; h < l.length; ++h) {
                        var u = l[h], d = {
                            id: u.getAttribute("intObjectId"),
                            accession: u.getAttribute("dbAccessionId"),
                            version: u.getAttribute("objectVersion"),
                            dbSource: u.getAttribute("dbSource"),
                            dbVersion: u.getAttribute("dbVersion")
                        };
                        a.objects[d.id] = d
                    }
                    for (var p = o.getElementsByTagName("block"), f = 0; f < p.length; ++f) {
                        for (var v = p[f], y = {
                            order: v.getAttribute("blockOrder"),
                            segments: []
                        }, m = v.getElementsByTagName("segment"), b = 0; b < m.length; ++b) {
                            var w = m[b], x = {
                                object: w.getAttribute("intObjectId"),
                                min: w.getAttribute("start"),
                                max: w.getAttribute("end"),
                                strand: w.getAttribute("strand"),
                                cigar: g(w, "cigar")
                            };
                            y.segments.push(x)
                        }
                        a.blocks.push(y)
                    }
                    t.push(a)
                }
                i(t)
            })
        }, d.prototype.pushStyle = function (e, t, i) {
            e || (e = {type: "default"});
            var r = T(e);
            t && (r.zoom = t), r.style = i, this.styles.push(r)
        }, n.prototype.stylesheet = function (e, t) {
            var i, r = this.credentials;
            this.stylesheet_uri ? (i = this.stylesheet_uri, r = !1) : i = this.dasBaseURI + "stylesheet", w(i, function (i) {
                if (!i) return void(t && t());
                for (var r = new d, n = i.getElementsByTagName("TYPE"), s = 0; s < n.length; ++s) {
                    var o = n[s], a = {};
                    a.type = o.getAttribute("id"), a.label = o.getAttribute("label"), a.method = o.getAttribute("method");
                    for (var l = o.getElementsByTagName("GLYPH"), h = 0; h < l.length; ++h) {
                        var u = l[h], c = u.getAttribute("zoom"), v = y(u), g = new p;
                        g.glyph = v.localName;
                        for (var m = v.firstChild; m;) m.nodeType == Node.ELEMENT_NODE && ("BGGRAD" == m.localName ? g[m.localName] = f(m) : g[m.localName] = m.firstChild.nodeValue), m = m.nextSibling;
                        r.pushStyle(a, c, g)
                    }
                }
                e(r)
            }, r)
        }, v.prototype.sources = function (e, t, i) {
            i || (i = {});
            var r = [];
            i.taxon && r.push("organism=" + i.taxon), i.auth && r.push("authority=" + i.auth), i.version && r.push("version=" + i.version);
            var o = this.uri;
            r.length > 0 && (o = o + "?" + r.join("&")), w(o, function (i) {
                if (!i && t) return void t();
                for (var r = [], o = i.getElementsByTagName("SOURCE"), a = 0; a < o.length; ++a) {
                    var l = o[a], h = l.getElementsByTagName("VERSION");
                    if (!(h.length < 1)) {
                        for (var u = h[0], c = u.getElementsByTagName("COORDINATES"), d = [], p = 0; p < c.length; ++p) {
                            var f = c[p], v = new s;
                            v.auth = f.getAttribute("authority"), v.taxon = f.getAttribute("taxid"), v.version = f.getAttribute("version"), d.push(v)
                        }
                        for (var g, y = [], m = u.getElementsByTagName("CAPABILITY"), p = 0; p < m.length; ++p) {
                            var b = m[p];
                            if (y.push(b.getAttribute("type")), "das1:features" == b.getAttribute("type")) {
                                var w = b.getAttribute("query_uri");
                                g = w.substring(0, w.length - "features".length)
                            }
                        }
                        for (var x = {}, S = u.getElementsByTagName("PROP"), _ = 0; _ < S.length; ++_) k(x, S[_].getAttribute("name"), S[_].getAttribute("value"));
                        if (g) {
                            var C = new n(g, {
                                source_uri: l.getAttribute("uri"),
                                name: l.getAttribute("title"),
                                desc: l.getAttribute("description"),
                                coords: d,
                                props: x,
                                capabilities: y
                            });
                            r.push(C)
                        }
                    }
                }
                e(r)
            })
        }, n.prototype.doCrossDomainRequest = function (e, t, i) {
            var r;
            this.xUser && (r = "Basic " + btoa(this.xUser + ":" + this.xPass));
            try {
                return w(e, t, this.credentials, r)
            } catch (n) {
                if (!i) throw n;
                i(n)
            }
        }, "undefined" != typeof t && (t.exports = {
            DASGroup: h,
            DASFeature: l,
            DASStylesheet: d,
            DASStyle: p,
            DASSource: n,
            DASSegment: r,
            DASRegistry: v,
            DASSequence: a,
            DASLink: u,
            isDasBooleanTrue: x,
            isDasBooleanNotFalse: S,
            copyStylesheet: _,
            coordsMatch: o
        })
    }, {"./color": 9, "./utils": 49}],
    11: [function (e, t, i) {
        "use strict";

        function r(e, t, i) {
            function r() {
                i ? (n.className = "fa fa-caret-down", t.style.display = "table") : (n.className = "fa fa-caret-right", t.style.display = "none")
            }

            var n = a("i");
            r(), n.addEventListener("click", function (e) {
                e.preventDefault(), e.stopPropagation(), i = !i, r()
            }, !1);
            var s = a("h6", [n, " ", e], {}, {
                display: "block",
                background: "gray",
                color: "white",
                width: "100%",
                padding: "5px 2px",
                margin: "0px"
            });
            return a("div", [s, t], {})
        }

        if ("undefined" != typeof e) var n = e("./cbrowser"), s = n.Browser, o = e("./utils"), a = o.makeElement,
            l = o.removeChildren;
        s.prototype.removeAllPopups = function () {
            l(this.hPopupHolder), l(this.popupHolder)
        }, s.prototype.makeTooltip = function (e, t) {
            var i, r = !1, n = this, s = null;
            i = function (t) {
                r = !1, s && (clearTimeout(s), s = null), e.removeEventListener("mouseout", i, !1)
            };
            var o = function (i) {
                var l = i.clientX + window.scrollX, h = i.clientY + window.scrollY;
                s || (s = setTimeout(function () {
                    var i;
                    i = "function" == typeof t ? t() : t;
                    var u = a("div", [a("div", null, {className: "tooltip-arrow"}), a("div", i, {className: "tooltip-inner"})], {className: "tooltip bottom in"}, {
                        display: "block",
                        top: "" + (h + 20) + "px",
                        left: "" + Math.max(l - 30, 20) + "px"
                    });
                    n.hPopupHolder.appendChild(u);
                    var c;
                    c = function (t) {
                        try {
                            n.hPopupHolder.removeChild(u)
                        } catch (i) {
                        }
                        window.removeEventListener("mousemove", c, !1), r && (null == e.offsetParent || o(t))
                    }, window.addEventListener("mousemove", c, !1), s = null
                }, 1e3))
            };
            e.addEventListener("mouseover", function (t) {
                r = !0, e.addEventListener("mouseout", i, !1), o(t)
            }, !1), e.addEventListener("DOMNodeRemovedFromDocument", function (e) {
                r = !1, s && (clearTimeout(s), s = null)
            }, !1)
        }, s.prototype.popit = function (e, t, i, r) {
            var n = this;
            r || (r = {}), e || (e = {});
            var s, o, l = r.width || 200;
            if (e.clientX) var s = e.clientX, o = e.clientY; else s = 500, o = 50;
            s += document.documentElement.scrollLeft || document.body.scrollLeft, o += document.documentElement.scrollTop || document.body.scrollTop;
            var h = window.innerWidth, u = o, c = Math.min(s - l / 2 - 4, h - l - 30), d = a("div");
            if (d.className = "popover fade " + (e.clientX ? "bottom " : "") + "in", d.style.display = "block", d.style.position = "absolute", d.style.top = "" + u + "px", d.style.left = "" + c + "px", d.style.width = l + "px", l > 276 && (d.style.maxWidth = l + "px"), d.appendChild(a("div", null, {className: "arrow"})), t) {
                var p = a("button", "", {className: "close"});
                p.innerHTML = "&times;", p.addEventListener("mouseover", function (e) {
                    p.style.color = "red"
                }, !1), p.addEventListener("mouseout", function (e) {
                    p.style.color = "black"
                }, !1), p.addEventListener("click", function (e) {
                    e.preventDefault(), e.stopPropagation(), n.removeAllPopups()
                }, !1);
                var f, v, g, y, m = a("h4", [a("span", t, null, {maxWidth: "200px"}), p], {}, {
                    paddingLeft: "10px",
                    paddingRight: "10px"
                });
                g = function (e) {
                    e.stopPropagation(), e.preventDefault(), c += e.clientX - f, 8 > c && (c = 8), c > h - l - 32 && (c = h - l - 26), u += e.clientY - v, u = Math.max(10, u), d.style.top = "" + u + "px", d.style.left = "" + Math.min(c, h - l - 10) + "px", f = e.clientX, v = e.clientY
                }, y = function (e) {
                    e.stopPropagation(), e.preventDefault(), window.removeEventListener("mousemove", g, !1), window.removeEventListener("mouseup", y, !1)
                }, m.addEventListener("mousedown", function (e) {
                    e.preventDefault(), e.stopPropagation(), f = e.clientX, v = e.clientY, window.addEventListener("mousemove", g, !1), window.addEventListener("mouseup", y, !1)
                }, !1), d.appendChild(m)
            }
            d.appendChild(a("div", i, {className: "popover-content"}, {padding: "0px"})), this.hPopupHolder.appendChild(d);
            var b = {node: d, displayed: !0};
            return d.addEventListener("DOMNodeRemoved", function (e) {
                e.target == d && (b.displayed = !1)
            }, !1), b
        }, "undefined" != typeof t && (t.exports = {makeTreeTableSection: r})
    }, {"./cbrowser": 6, "./utils": 49}],
    12: [function (e, t, i) {
        "use strict";

        function r(e, t) {
            return e.indexOf("?") < 0 && (e += "?soft=true"), new a(function (i, r) {
                var n = new XMLHttpRequest;
                n.onreadystatechange = function () {
                    if (4 == n.readyState) if (n.status >= 300) r("Error code " + n.status); else {
                        var e = JSON.parse(n.response);
                        i(t ? e : e.location)
                    }
                }, n.open("GET", e, !0), n.setRequestHeader("Accept", "application/json"), n.responseType = "text", n.send("")
            })
        }

        function n(e) {
            this.rawurl = e
        }

        function s(e, t, i, r) {
            r || ("object" == typeof t ? (r = t, t = void 0) : r = {}), this.url = "string" == typeof e ? new n(e) : e, this.start = t || 0, i && (this.end = i), this.opts = r
        }

        function o(e) {
            if (!e) return null;
            for (var t = new Uint8Array(e.length), i = 0; i < t.length; ++i) t[i] = e.charCodeAt(i);
            return t.buffer
        }

        if ("undefined" != typeof e) var a = e("es6-promise").Promise;
        n.prototype.getURLPromise = function () {
            return this.urlPromise && this.urlPromiseValidity > Date.now() ? this.urlPromise : (this.urlPromise = r(this.rawurl, !0).then(function (e) {
                return e.location
            }), this.urlPromiseValidity = Date.now() + 432e5, this.urlPromise)
        }, s.prototype.slice = function (e, t) {
            if (0 > e) throw"Bad slice " + e;
            var i = this.start, r = this.end;
            return i && e ? i += e : i = e || i, r = t && i ? i + t - 1 : r || t - 1, new s(this.url, i, r, this.opts)
        }, s.prototype.fetchAsText = function (e) {
            var t, i = this, r = new XMLHttpRequest;
            i.url.getURLPromise().then(function (n) {
                if (r.open("GET", n, !0), i.end) {
                    if (i.end - i.start > 1e8) throw"Monster fetch!";
                    r.setRequestHeader("Range", "bytes=" + i.start + "-" + i.end), t = i.end - i.start + 1
                }
                r.onreadystatechange = function () {
                    return 4 == r.readyState ? e(200 == r.status || 206 == r.status ? r.responseText : null) : void 0
                }, i.opts.credentials && (r.withCredentials = !0), r.send("")
            })["catch"](function (t) {
                return console.log(t), e(null)
            })
        }, s.prototype.salted = function () {
            return this
        }, s.prototype.fetch = function (e, t, i) {
            var r = this;
            return t = t || 1, t > 3 ? e(null) : void r.url.getURLPromise().then(function (n) {
                var s, a = new XMLHttpRequest;
                if (a.open("GET", n, !0), a.overrideMimeType("text/plain; charset=x-user-defined"), r.end) {
                    if (r.end - r.start > 1e8) throw"Monster fetch!";
                    a.setRequestHeader("Range", "bytes=" + r.start + "-" + r.end), s = r.end - r.start + 1
                }
                a.responseType = "arraybuffer", a.onreadystatechange = function () {
                    if (4 == a.readyState) {
                        if (200 == a.status || 206 == a.status) {
                            if (a.response) {
                                var n = a.response.byteLength;
                                return !s || s == n || i && n == i ? e(a.response) : r.fetch(e, t + 1, n)
                            }
                            if (a.mozResponseArrayBuffer) return e(a.mozResponseArrayBuffer);
                            var l = a.responseText;
                            return !s || s == l.length || i && l.length == i ? e(o(a.responseText)) : r.fetch(e, t + 1, l.length)
                        }
                        return r.fetch(e, t + 1)
                    }
                }, r.opts.credentials && (a.withCredentials = !0), a.send("")
            })["catch"](function (e) {
                console.log(e)
            })
        }, "undefined" != typeof t && (t.exports = {lookupEncodeURI: r, EncodeFetchable: s})
    }, {"es6-promise": 53}],
    13: [function (e, t, i) {
        "use strict";

        function r(e) {
            if (o.call(this), this.source = e, this.base = e.uri || "//rest.ensembl.org", 0 === this.base.indexOf("//")) {
                var t = window.location.protocol;
                "http:" == t || "https:" == t || (this.base = "http:" + this.base)
            }
            this.species = e.species || "human", "string" == typeof e.type ? this.type = [e.type] : this.type = e.type || ["regulatory"]
        }

        if ("undefined" != typeof e) var n = e("./sourceadapters"), s = n.registerSourceAdapterFactory,
            o = n.FeatureSourceBase, a = e("./das"), l = a.DASStylesheet, h = a.DASStyle, u = a.DASFeature,
            c = a.DASGroup;
        r.prototype = Object.create(o.prototype), r.prototype.constructor = r, r.prototype.getStyleSheet = function (e) {
            var t = new l, i = new h;
            i.glyph = "__NONE", this.type.indexOf("exon") >= 0 && t.pushStyle({type: "transcript"}, null, i), (this.type.indexOf("exon") >= 0 || this.type.indexOf("transcript") >= 0) && t.pushStyle({type: "gene"}, null, i);
            var r = new h;
            r.glyph = "BOX", r.FGCOLOR = "black", r.BGCOLOR = "red", r.HEIGHT = 8, r.BUMP = !0, r.LABEL = !0, r.ZINDEX = 10, t.pushStyle({type: "cds"}, null, r);
            var n = new h;
            n.glyph = "SQUARE", n.BUMP = "yes", n.LABEL = "no", n.FGCOLOR = "blue", t.pushStyle({
                type: "variation",
                method: ".+_UTR_variant"
            }, null, n);
            var n = new h;
            n.glyph = "TRIANGLE", n.DIRECTION = "S", n.BUMP = "yes", n.LABEL = "no", n.FGCOLOR = "blue", t.pushStyle({
                type: "variation",
                method: "missense_variant"
            }, null, n);
            var n = new h;
            n.glyph = "TRIANGLE", n.DIRECTION = "N", n.BUMP = "yes", n.LABEL = "no", n.FGCOLOR = "blue", t.pushStyle({
                type: "variation",
                method: "splice_.+_variant"
            }, null, n);
            var n = new h;
            n.glyph = "STAR", n.POINTS = 6, n.BUMP = "yes", n.LABEL = "no", n.FGCOLOR = "blue", t.pushStyle({
                type: "variation",
                method: "regulatory_region_variant"
            }, null, n);
            var n = new h;
            n.glyph = "PLIMSOLL", n.BUMP = "yes", n.LABEL = "no", n.FGCOLOR = "rgb(50,80,255)", n.STROKECOLOR = "black", t.pushStyle({type: "variation"}, null, n);
            var n = new h;
            n.glyph = "SQUARE", n.BUMP = "yes", n.LABEL = "no", n.BGCOLOR = "#888888", n.FGCOLOR = "red", t.pushStyle({
                type: "indel",
                method: ".+_UTR_variant"
            }, null, n);
            var n = new h;
            n.glyph = "TRIANGLE", n.DIRECTION = "S", n.BUMP = "yes", n.LABEL = "no", n.BGCOLOR = "#888888", n.FGCOLOR = "red", t.pushStyle({
                type: "indel",
                method: "missense_variant"
            }, null, n);
            var n = new h;
            n.glyph = "TRIANGLE", n.DIRECTION = "N", n.BUMP = "yes", n.LABEL = "no", n.BGCOLOR = "#888888", n.FGCOLOR = "red", t.pushStyle({
                type: "indel",
                method: "splice_.+_variant"
            }, null, n);
            var n = new h;
            n.glyph = "STAR", n.POINTS = 6, n.BUMP = "yes", n.LABEL = "no", n.BGCOLOR = "#888888", n.FGCOLOR = "red", t.pushStyle({
                type: "indel",
                method: "regulatory_region_variant"
            }, null, n);
            var n = new h;
            n.glyph = "PLIMSOLL", n.BUMP = "yes", n.LABEL = "no", n.BGCOLOR = "#888888", n.FGCOLOR = "red", n.STROKECOLOR = "black", t.pushStyle({type: "indel"}, null, n);
            var s = new h;
            return s.glyph = "BOX", s.FGCOLOR = "black", s.BGCOLOR = "orange", s.HEIGHT = 8, s.BUMP = !0, s.LABEL = !0, s.ZINDEX = 20, t.pushStyle({type: "default"}, null, s), e(t)
        }, r.prototype.getScales = function () {
            return []
        }, r.prototype.fetch = function (e, t, i, r, n, s, o) {
            for (var a = this, l = this.base + "/overlap/region/" + this.species + "/" + e + ":" + t + "-" + i, h = [], d = 0; d < this.type.length; ++d) h.push("feature=" + this.type[d]);
            h.push("content-type=application/json"), l = l + "?" + h.join(";");
            var p = new XMLHttpRequest;
            p.onreadystatechange = function () {
                if (4 == p.readyState) if (a.busy--, a.notifyActivity(), p.status >= 300) {
                    var t = "Error code " + p.status;
                    try {
                        var i = JSON.parse(p.response);
                        i.error && (t = i.error)
                    } catch (r) {
                    }
                    o(t, null)
                } else {
                    for (var n = JSON.parse(p.response), s = [], l = 0; l < n.length; ++l) {
                        var h = n[l], d = [], f = new u;
                        if (f.segment = e, f.min = 0 | h.start, f.max = 0 | h.end, f.type = h.feature_type || "unknown", f.id = h.ID, h.Parent) {
                            var v = new c;
                            v.id = h.Parent, f.groups = [v]
                        }
                        h.strand && (h.strand < 0 ? f.orientation = "-" : h.strand > 0 && (f.orientation = "+")), h.consequence_type && (f.method = h.consequence_type), h.alt_alleles && (d.push("Alleles=" + h.alt_alleles.join("/")), h.alt_alleles.length > 1 && (h.alt_alleles[1].length != h.alt_alleles[0].length || "-" == h.alt_alleles[1]) && (f.type = "indel")), d.length > 0 && (f.notes = d), s.push(f)
                    }
                    o(null, s)
                }
            }, a.busy++, a.notifyActivity(), p.open("GET", l, !0), p.responseType = "text", p.send("")
        }, s("ensembl", function (e) {
            return {features: new r(e)}
        })
    }, {"./das": 10, "./sourceadapters": 34}],
    14: [function (e, t, i) {
        if ("undefined" != typeof e) var r = e("./cbrowser"), n = r.Browser, s = e("./utils"), o = s.shallowCopy,
            a = e("./sha1"), l = a.hex_sha1, h = e("./das"), u = h.copyStylesheet;
        n.prototype.exportFullConfig = function (e) {
            e = e || {};
            var t = {
                chr: this.chr,
                viewStart: 0 | this.viewStart,
                viewEnd: 0 | this.viewEnd,
                cookieKey: "dalliance_" + l(Date.now()),
                coordSystem: this.coordSystem,
                sources: this.exportSourceConfig(),
                chains: this.exportChains()
            };
            return this.prefix && (t.prefix = this.prefix), t
        }, n.prototype.exportChains = function () {
            var e = {}, t = this.chains || {};
            for (var i in t) e[i] = t[i].exportConfig();
            return e
        }, n.prototype.exportSourceConfig = function (e) {
            e = e || {};
            for (var t = [], i = 0; i < this.tiers.length; ++i) {
                var r = this.tiers[i], n = o(r.dasSource);
                n.noPersist || (n.coords = void 0, n.props = void 0, n.disabled || (n.disabled = void 0), r.config.stylesheet ? (n.style = u(r.config.stylesheet).styles, n.stylesheet_uri = void 0) : n.style && (n.style = u({styles: n.style}).styles), "string" == typeof r.config.name && (n.name = r.config.name), void 0 !== r.config.height && (n.forceHeight = r.config.height), void 0 !== r.config.forceMin && (n.forceMin = r.config.forceMin), r.config.forceMinDynamic && (n.forceMinDynamic = r.config.forceMinDynamic), void 0 !== r.config.forceMax && (n.forceMax = r.config.forceMax), void 0 !== r.config.bumped && (n.bumped = r.config.bumped), r.config.forceMaxDynamic && (n.forceMaxDynamic = r.config.forceMaxDynamic), t.push(n))
            }
            return t
        }, n.prototype.exportPageTemplate = function (e) {
            e = e || {};
            var t = '<html>\n  <head>\n    <script language="javascript" src="' + this.resolveURL("$$dalliance-compiled.js") + '"></script>\n    <script language="javascript">\n      var dalliance_browser = new Browser(' + JSON.stringify(this.exportFullConfig(e), null, 2) + ');\n    </script>\n  </head>\n  <body>\n    <div id="svgHolder">Dalliance goes here</div>\n  </body>\n<html>\n';
            return t
        }
    }, {"./cbrowser": 6, "./das": 10, "./sha1": 33, "./utils": 49}],
    15: [function (e, t, i) {
        "use strict";

        function r(e, t, i, r) {
            e.fillText(t, i - e.measureText(t).width, r)
        }

        if ("undefined" != typeof e) var n = e("./cbrowser"), s = n.Browser, o = e("./glyphs"),
            a = o.OverlayLabelCanvas, l = e("./numformats"), h = l.formatQuantLabel, u = l.formatLongInt,
            c = e("./version"), d = e("./sequence-draw").drawSeqTierGC, p = e("./feature-draw").drawFeatureTier;
        s.prototype.exportImage = function (e) {
            e = e || {};
            var t = e.width || this.featurePanelWidth, i = 3, n = 0;
            (e.banner || e.region) && (n = 40);
            var s = this.featurePanelWidth, o = this.scale;
            this.featurePanelWidth = t, this.scale = this.featurePanelWidth / (this.viewEnd - this.viewStart);
            for (var l = n, f = 0; f < this.tiers.length; ++f) {
                f > 0 && (l += i);
                var v = this.tiers[f];
                if (v.backupSubtiers = v.subtiers, v.backupOriginHaxx = v.originHaxx, v.backupLayoutHeight = v.layoutHeight, v.subtiers && (p(v, v.sequenceSource ? v.currentSequence : null), v.subtiers)) {
                    for (var g = v.padding, y = 0; y < v.subtiers.length; ++y) g = g + v.subtiers[y].height + v.padding;
                    g += 6, v.layoutHeight = Math.max(g, this.minTierHeight)
                }
                void 0 !== v.layoutHeight && (l += v.layoutHeight)
            }
            var m = e.resolutionMultiplier || 1, b = 200, w = (t + b) * m | 0, x = l * m | 0,
                S = makeElement("canvas", null, {width: w, height: x}), _ = S.getContext("2d");
            _.fillStyle = "white", _.fillRect(0, 0, w, x), _.scale(m, m), e.region && (_.save(), _.fillStyle = "black", _.font = "12pt sans-serif", _.fillText(this.chr + ":" + u(this.viewStart) + ".." + u(this.viewEnd), b + 100, 28), _.restore()), e.banner && (_.save(), _.fillStyle = "black", _.font = "12pt sans-serif", r(_, "Graphics from Biodalliance " + c, b + t - 100, 28), _.restore()), _.font = "10px sans-serif";
            for (var f = 0; f < this.tiers.length; ++f) {
                var v = this.tiers[f], C = (v.glyphCacheOrigin - this.viewStart) * this.scale, T = new a;
                _.save(), _.translate(0, n), _.save(), _.beginPath(), _.moveTo(b, 0), _.lineTo(b + t, 0), _.lineTo(b + t, v.layoutHeight), _.lineTo(b, v.layoutHeight), _.closePath(), _.clip(), _.translate(b, 0), _.save(), _.translate(C, 0), v.subtiers ? v.paintToContext(_, T, C + 1e3) : d(v, v.currentSequence, _), _.restore(), _.save(), _.translate(C, 0), T.draw(_, -C, t - C), _.restore(), _.restore();
                for (var k = !1, L = 0, A = v.subtiers || [], O = 0; O < A.length; ++O) {
                    var E = A[O];
                    if (E.quant) {
                        k = !0;
                        var R = E.quant, B = E.height, M = 2;
                        B > 40 && (M = 1 + (B / 20 | 0));
                        var I = B / (M - 1), H = (R.max - R.min) / (M - 1);
                        _.beginPath(), _.moveTo(b + 5, L), _.lineTo(b, L), _.lineTo(b, L + E.height), _.lineTo(b + 5, L + E.height);
                        for (var P = 1; M - 1 > P; ++P) {
                            var F = P * I;
                            _.moveTo(b, L + F), _.lineTo(b + 3, L + F)
                        }
                        _.strokeStyle = "black", _.strokeWidth = 2, _.stroke(), _.fillStyle = "black", r(_, h(R.max), b - 3, L + 7), r(_, h(R.min), b - 3, L + E.height);
                        for (var P = 1; M - 1 > P; ++P) {
                            var F = P * I;
                            r(_, h(1 * R.max - P * H), b - 3, L + F + 3)
                        }
                    }
                    L += E.height + i
                }
                var N;
                N = "string" == typeof v.config.name ? v.config.name : v.dasSource.name;
                var G = _.measureText(N).width;
                _.fillStyle = "black", _.fillText(N, b - (k ? 28 : 12) - G, (v.layoutHeight + 3) / 2), _.restore(), n += v.layoutHeight + i, v.subtiers = v.backupSubtiers, v.originHaxx = v.backupOriginHaxx, v.layoutHeight = v.backupLayoutHeight
            }
            if (e.highlights) {
                _.save(), _.beginPath(), _.moveTo(b, 0), _.lineTo(b + t, 0), _.lineTo(b + t, n), _.lineTo(b, n), _.closePath(), _.clip(), _.translate(b + C, 0);
                for (var D = this.viewStart, q = this.viewStart, U = this.viewEnd, z = 0; z < this.highlights.length; ++z) {
                    var B = this.highlights[z];
                    (B.chr === this.chr || B.chr === "chr" + this.chr) && B.min < U && B.max > q && (_.globalAlpha = this.defaultHighlightAlpha, _.fillStyle = this.defaultHighlightFill, _.fillRect((B.min - D) * this.scale, 0, (B.max - B.min) * this.scale, n))
                }
                _.restore()
            }
            var W = -1;
            return "center" == e.ruler ? W = b + (this.viewEnd - this.viewStart + 1) * this.scale / 2 : "left" == e.ruler ? W = b : "right" == e.ruler && (W = b + (this.viewEnd - this.viewStart + 1) * this.scale), W >= 0 && (_.strokeStyle = "blue", _.beginPath(), _.moveTo(W, 0), _.lineTo(W, n), _.stroke()), this.featurePanelWidth = s, this.scale = o, S.toDataURL("image/png")
        }
    }, {
        "./cbrowser": 6,
        "./feature-draw": 18,
        "./glyphs": 21,
        "./numformats": 26,
        "./sequence-draw": 31,
        "./version": 51
    }],
    16: [function (e, t, i) {
        if ("undefined" != typeof e) var r = e("./cbrowser"), n = r.Browser, s = e("./utils"), o = s.makeElement,
            a = s.removeChildren;
        n.prototype.openExportPanel = function () {
            var e = this;
            if ("export" === this.uiMode) this.hideToolPanel(), this.setUiMode("none"); else {
                var t = o("div", null, {className: "export-form"}), i = o("select");
                i.appendChild(o("option", "SVG", {value: "svg"})), i.appendChild(o("option", "Image", {value: "png"})), i.appendChild(o("option", "Dalliance config", {value: "config"})), i.appendChild(o("option", "Dalliance sources", {value: "sources"})), i.appendChild(o("option", "Dalliance page", {value: "page"})), i.value = "svg", i.addEventListener("change", function (e) {
                    a(d), w()
                }, !1), t.appendChild(o("p", ["Export as: ", i]));
                var r = o("input", null, {type: "checkbox", checked: this.exportHighlights});
                r.addEventListener("change", function (t) {
                    e.exportHighlights = r.checked, e.storeStatus()
                }, !1);
                var n = o("input", null, {type: "checkbox", checked: this.exportRuler});
                n.addEventListener("change", function (t) {
                    e.exportRuler = n.checked, e.storeStatus()
                }, !1);
                var s = o("input", null, {type: "checkbox", checked: this.exportRegion});
                s.addEventListener("change", function (t) {
                    e.exportRegion = s.checked, e.storeStatus()
                }, !1);
                var l = o("input", null, {type: "checkbox", checked: this.exportBanner});
                l.addEventListener("change", function (t) {
                    e.exportBanner = l.checked, e.storeStatus()
                }, !1);
                var h = o("input", null, {type: "text", value: "1.0"}),
                    u = o("input", null, {type: "text", value: "800"}),
                    c = o("button", "Export", {className: "btn btn-primary"});
                c.addEventListener("click", function (t) {
                    a(d);
                    var s, l, c, p;
                    if ("svg" === i.value) s = URL.createObjectURL(e.makeSVG({
                        highlights: r.checked,
                        banner: e.exportBanner,
                        region: e.exportRegion,
                        ruler: n.checked ? e.rulerLocation : "none",
                        width: parseInt(u.value) || 800
                    })), l = "SVG", c = "image/svg", p = "dalliance-view.svg"; else if ("png" === i.value) {
                        var f = parseFloat(h.value);
                        if (.1 > f || f > 10) return void alert("bad scale " + f);
                        s = e.exportImage({
                            highlights: r.checked,
                            banner: e.exportBanner,
                            region: e.exportRegion,
                            ruler: n.checked ? e.rulerLocation : "none",
                            resolutionMultiplier: f,
                            width: parseInt(u.value) || 800
                        }), l = "Image", c = "image/png", p = "dalliance-view.png"
                    } else if ("config" === i.value) {
                        var v = JSON.stringify(e.exportFullConfig(), null, 2), g = new Blob([v], {type: "text/plain"});
                        s = URL.createObjectURL(g), l = "Configuration", c = "text/plain", p = "dalliance-config.json"
                    } else if ("sources" === i.value) {
                        var v = JSON.stringify(e.exportSourceConfig(), null, 2),
                            g = new Blob([v], {type: "text/plain"});
                        s = URL.createObjectURL(g), l = "Source array", c = "text/plain", p = "dalliance-sources.json"
                    } else if ("page" === i.value) {
                        var y = e.exportPageTemplate(), c = "text/html", g = new Blob([y], {type: c});
                        s = URL.createObjectURL(g), l = "Page template", p = "dalliance-view.html"
                    }
                    if (s) {
                        var m = o("a", "[Download]", {href: s, download: p, type: c}),
                            b = o("a", "[Preview in browser]", {href: s, type: c, target: "_new"});
                        d.appendChild(o("p", ["" + l + " created: ", m, b]))
                    }
                }, !1), e.addViewListener(function () {
                    a(d)
                }), e.addTierListener(function () {
                    a(d)
                });
                var d = o("p", ""),
                    p = o("tr", [o("th", "Include highlights", {}, {width: "400px", textAlign: "right"}), o("td", r)]),
                    f = o("tr", [o("th", "Include vertical guideline", {}, {textAlign: "right"}), o("td", n)]),
                    v = o("tr", [o("th", "Scale multiplier", {}, {textAlign: "right"}), o("td", h)]),
                    g = o("tr", [o("th", "Width (logical px)", {}, {textAlign: "right"}), o("td", u)]),
                    y = o("tr", [o("th", "Label with genomic coordinates", {}, {textAlign: "right"}), o("td", s)]),
                    m = o("tr", [o("th", "Include banner", {}, {textAlign: "right"}), o("td", l)]),
                    b = o("table", [p, f, g, v, y], null, {width: "500px"}), w = function () {
                        var e = i.value;
                        p.style.display = "svg" == e || "png" == e ? "table-row" : "none", f.style.display = "svg" == e || "png" == e ? "table-row" : "none", v.style.display = "png" == e ? "table-row" : "none", g.style.display = "svg" == e || "png" == e ? "table-row" : "none", y.style.display = "svg" == e || "png" == e ? "table-row" : "none", m.style.display = "svg" == e || "png" == e ? "table-row" : "none"
                    };
                w(), t.appendChild(b), t.appendChild(c), t.appendChild(d), "none" !== this.uiMode && this.hideToolPanel(), this.browserHolder.insertBefore(t, this.svgHolder), this.activeToolPanel = t, this.setUiMode("export")
            }
        }
    }, {"./cbrowser": 6, "./utils": 49}],
    17: [function (e, t, i) {
        var r = e("./cbrowser"), n = e("./chainset"), s = e("./sourceadapters"), o = e("./utils"), a = e("./das"),
            l = e("./sourcecompare");
        window.Browser = r.Browser, window.sourcesAreEqual = l.sourcesAreEqual, window.Chainset = n.Chainset, window.makeElement = o.makeElement, window.dalliance_registerSourceAdapterFactory = s.registerSourceAdapterFactory, window.dalliance_registerParserFactory = s.registerParserFactory, window.dalliance_makeParser = s.makeParser, window.DASSequence = a.DASSequence, window.DASFeature = a.DASFeature, window.DASGroup = a.DASGroup, window.DASStylesheet = a.DASStylesheet, window.DASStyle = a.DASStyle, window.DASSource = a.DASSource
    }, {"./cbrowser": 6, "./chainset": 7, "./das": 10, "./sourceadapters": 34, "./sourcecompare": 35, "./utils": 49}],
    18: [function (e, t, i) {
        "use strict";

        function r() {
            this.glyphs = [], this.height = 0, this.quant = null
        }

        function n(e) {
            0 | Date.now();
            $ = e.viewport.getContext("2d"), p(e), "number" == typeof e.dasSource.padding ? e.padding = e.dasSource.padding : e.padding = Y;
            var t = [], i = !1, n = {}, l = {};
            for (var c in e.ungroupedFeatures) for (var d = e.ungroupedFeatures[c], f = 0; f < d.length; ++f) {
                var v = d[f];
                if (!v.parts) {
                    var g = e.styleForFeature(v);
                    if (g) if ("LINEPLOT" == g.glyph) u(n, g.id, v), l[g.id] = g; else {
                        var y = o(v, 0, g, e);
                        y && t.push(y)
                    }
                }
            }
            for (var m in n) {
                var b = n[m], g = l[m];
                "LINEPLOT" == g.glyph && (t.push(a(b, g, e)), i = !0)
            }
            if (e.dasSource.collapseSuperGroups && !e.bumped) for (var w in e.superGroups) {
                var x = e.superGroups[w];
                e.groups[w] = h(e.groups[w]), e.groups[w].isSuperGroup = !0;
                for (var S = {}, C = 1e10, T = -1e10, k = null, y = 0; y < x.length; ++y) {
                    var b = e.groupedFeatures[x[y]];
                    if (b) {
                        for (var L = 0; L < b.length; ++L) {
                            var v = b[L];
                            u(S, v.type, v), C = Math.min(v.min, C), T = Math.max(v.max, T), v.segment && !k && (k = v.segment)
                        }
                        (e.groups[w] && !e.groups[w].links || 0 == e.groups[w].links.length) && (e.groups[w].links = e.groups[x[0]].links), delete e.groupedFeatures[x[y]]
                    }
                }
                e.groups[w].max = T, e.groups[w].min = C, e.groups[w].segment = k;
                for (var A in S) {
                    for (var O = S[A], E = O[0], R = null, L = 0; L < O.length; ++L) {
                        var v = O[L], B = new U(v.min, v.max);
                        R = R ? z(R, B) : B
                    }
                    for (var M = R.ranges(), I = 0; I < M.length; ++I) {
                        for (var P = M[I], F = ((0 | P.max()) - (0 | P.min()) + 1) * x.length, N = 0, L = 0; L < O.length; ++L) {
                            var v = O[L];
                            if ((0 | v.min) <= P.max() && (0 | v.max) >= P.min()) {
                                var G = Math.max(0 | v.min, P.min()), D = Math.min(0 | v.max, P.max());
                                N += D - G + 1
                            }
                        }
                        var q = new V;
                        for (var W in E) q[W] = E[W];
                        q.min = P.min(), q.max = P.max(), q.label && x.length > 1 && (q.label += " (" + x.length + " vars)"), q.visualWeight = 1 * N / F, u(e.groupedFeatures, w, q)
                    }
                }
                delete e.superGroups[w]
            }
            var X = new Array;
            for (var j in e.groupedFeatures) X.push(j);
            X.sort(function (t, i) {
                var r = e.groupedFeatures[t][0].score - e.groupedFeatures[i][0].score;
                return r > 0 ? -1 : 0 == r ? 0 : 1
            });
            for (var K = {}, Z = 0; Z < X.length; ++Z) {
                var j = X[Z],
                    y = s(e.groupedFeatures[j], 0, e.groups[j], e, e.dasSource.collapseSuperGroups && !e.bumped ? "collapsed_gene" : "tent");
                y && (y.group = e.groups[j], K[j] = y)
            }
            for (var w in e.superGroups) {
                for (var x = e.superGroups[w], Q = [], C = 1e10, T = -1e10, J = 0; J < x.length; ++J) {
                    var ee = K[x[J]];
                    K[x[J]] = null, ee && (Q.push(ee), C = Math.min(C, ee.min()), T = Math.max(T, ee.max()))
                }
                for (var J = 0; J < Q.length; ++J) {
                    var ee = Q[J];
                    t.push(new _(ee, C, T))
                }
            }
            for (var y in K) {
                var ee = K[y];
                ee && t.push(ee)
            }
            var te = new r, ie = [], re = !1,
                ne = e.subtierMax || e.dasSource.subtierMax || e.browser.defaultSubtierMax, se = !1;
            e:for (var oe = 0; oe < t.length; ++oe) {
                var y = t[oe];
                if (y.bump && (re = !0), y.bump && (e.bumped || e.dasSource.collapseSuperGroups)) {
                    for (var ae = 0; ae < ie.length; ++ae) {
                        var le = ie[ae];
                        if (le.hasSpaceFor(y)) {
                            le.add(y);
                            continue e
                        }
                    }
                    if (ie.length >= ne) se = !0; else {
                        var le = new r;
                        le.add(y), ie.push(le)
                    }
                } else te.add(y)
            }
            te.glyphs.length > 0 && (ie = [te].concat(ie));
            for (var ae = 0; ae < ie.length; ++ae) {
                var le = ie[ae];
                le.quant && le.glyphs.unshift(new H(le.height))
            }
            for (var ae = 0; ae < ie.length; ++ae) {
                var le = ie[ae];
                le.glyphs.sort(function (e, t) {
                    var i = e.zindex || 0, r = t.zindex || 0;
                    return i - r
                })
            }
            e.subtiers = ie, e.glyphCacheOrigin = e.browser.viewStart, se ? e.updateStatus("Bumping limit exceeded, use the track editor to see more features") : e.updateStatus()
        }

        function s(e, t, i, r, n) {
            for (var s, a = r.styleForFeature(i), l = !1, h = [], u = null, c = 0; c < e.length; ++c) {
                var d = e[c];
                d.orientation && null == u && (u = d.orientation), !s && d.label && (s = d.label);
                var p = r.styleForFeature(d);
                if (p && !d.parts) {
                    X(p.LABEL) && (l = !0);
                    var f = o(d, 0, p, r, null, !0);
                    f && h.push(f)
                }
            }
            if (0 == h.length) return null;
            var v = "flat";
            a && "LINE" === a.glyph || (r.dasSource.collapseSuperGroups && !r.bumped ? "+" === u ? v = "collapsed+" : "-" === u && (v = "collapsed-") : "+" === u ? v = "hat+" : "-" === u && (v = "hat-"));
            var y = null;
            (s && l || a && (X(a.LABEL) || X(a.LABELS))) && (y = i.label || s);
            var b = new g(h, v);
            return y && ("+" === u ? y = ">" + y : "-" === u && (y = "<" + y), b = new m($, b, y, !1)), b.bump = !0, b
        }

        function o(e, t, i, r, n, s) {
            function o(e, t, i) {
                var r = null;
                if (e.currentSequence) {
                    var n = 0 | e.currentSequence.start, s = 0 | e.currentSequence.end;
                    if (i >= n && s >= t) {
                        var o = Math.max(t, n), a = Math.min(i, s);
                        for (r = e.currentSequence.seq.substr(o - n, a - o + 1); o > t;) r = "N" + r, o--;
                        for (; i > a;) r += "N", a++
                    }
                }
                return r
            }

            var a, l, h = r.browser.scale, u = r.browser.viewStart, c = i.glyph || "BOX", d = e.min, p = e.max,
                f = (e.type, e.orientation), y = e.score, H = e.label || e.id, N = (d - u) * h, G = (p - u + 1) * h,
                q = Math.max(G, N + 1), U = r.forceHeight || i.HEIGHT || n || 12, z = U = 1 * U,
                W = i.BUMP && X(i.BUMP);
            if ("CROSS" === c || "EX" === c || "TRIANGLE" === c || "DOT" === c || "SQUARE" === c || "STAR" === c || "PLIMSOLL" === c) {
                var V = i.FGCOLOR || "black", Z = i.BGCOLOR || "none", Q = i.STROKECOLOR;
                if (i.BGITEM && e.itemRgb) V = e.itemRgb; else if (X(i.COLOR_BY_SCORE2)) {
                    var Y = i.BGGRAD || i._gradient;
                    Y || (Y = D(50, i.COLOR1, i.COLOR2, i.COLOR3), i._gradient = Y);
                    var J = e.score2;
                    if (void 0 != J || !V) {
                        J = J || 0;
                        var ee = i.MIN2 ? 1 * i.MIN2 : 0, te = i.MAX2 ? 1 * i.MAX2 : 1, ie = (1 * J - ee) / (te - ee),
                            re = ie * Y.length | 0;
                        0 > re && (re = 0), re >= Y.length && (re = Y.length - 1), V = Y[re]
                    }
                }
                var U = r.forceHeight || i.HEIGHT || n || 12;
                z = U = 1 * U;
                var ne = i.SIZE || U;
                i.RSIZE && (ne = 1 * i.RSIZE * U), i.STROKETHRESHOLD && ne < 1 * i.STROKETHRESHOLD && (Q = null), ne = 1 * ne;
                var se = (N + q) / 2, oe = ne / 2;
                if ("EX" === c) a = new w(se, ne, V); else if ("TRIANGLE" === c) {
                    var ae = i.DIRECTION || "N", le = i.LINEWIDTH || ne;
                    a = new x(se, ne, ae, le, V, Q)
                } else if ("DOT" === c) a = new S(se, ne, V, Q); else if ("PLIMSOLL" === c) a = new F(se, ne, .2 * ne, V, Q); else if ("SQUARE" === c) a = new v(se - oe, 0, ne, ne, V, Q); else if ("STAR" === c) {
                    var he = 5;
                    i.POINTS && (he = 0 | i.POINTS), a = new P(se, oe, he, V, Q)
                } else a = new b(se, ne, V);
                if (Z && "none" != Z && q - N > 5) {
                    var ue = new v(N, 0, q - N, ne, Z);
                    a = new g([ue, a])
                }
                if (X(i.SCATTER)) {
                    var ce = r.quantMin(i), de = r.quantMax(i);
                    de || (de = 0 > ce ? 0 : 10), ce || (ce = 0);
                    var pe = (1 * y - ce) / (de - ce), fe = -1 * ce / (de - ce);
                    if (0 > pe || pe > 1) return null;
                    pe >= fe ? (U = Math.max(1, (pe - fe) * z), t = t + (1 - fe) * z - U) : (console.log("relScore=" + pe + "; origin=" + fe), U = (pe - fe) * z, t = t + (1 - fe) * z - U), l = {
                        min: ce,
                        max: de
                    };
                    var ve, ge = 0;
                    ve = "undefined" != typeof e.forceLabel ? e.forceLabel : i.LABEL, j(ve) && H && !s && (a = new m($, a, H, !0, null, "above" == ve ? "above" : "below"), "above" == ve && (ge = a.textHeight + 2), s = !0), a = new M(a, 0, t - oe - ge, z)
                }
            } else if ("HISTOGRAM" === c || "GRADIENT" === c && "undefined" !== y) {
                var ce = r.quantMin(i), de = r.quantMax(i);
                de || (de = 0 > ce ? 0 : 10), ce || (ce = 0), 1 * ce > 1 * y && (y = ce), 1 * y > 1 * de && (y = de);
                var pe = (1 * y - ce) / (de - ce), fe = -1 * ce / (de - ce);
                "HISTOGRAM" === c && (pe >= fe ? (U = (pe - Math.max(0, fe)) * z, t = t + (1 - Math.max(0, fe)) * z - U) : (U = (Math.max(0, fe) - pe) * z, t += (1 - Math.max(0, fe)) * z), l = {
                    min: ce,
                    max: de
                });
                var V = i.FGCOLOR || null, Z = i.BGCOLOR || i.COLOR1 || "green";
                i.BGITEM && e.itemRgb && (Z = e.itemRgb);
                var ye = i.ALPHA ? 1 * i.ALPHA : null;
                if (i.BGGRAD) {
                    var Y = i.BGGRAD, re = pe * Y.length | 0;
                    0 > re && (re = 0), re >= Y.length && (re = Y.length - 1), Z = Y[re]
                }
                if (i.COLOR2) {
                    var Y = i._gradient;
                    Y || (Y = D(50, i.COLOR1, i.COLOR2, i.COLOR3), i._gradient = Y);
                    var re = pe * Y.length | 0;
                    0 > re && (re = 0), re >= Y.length && (re = Y.length - 1), Z = Y[re]
                }
                a = new v(N, t, q - N, U, Z, V, ye), a = new M(a, 0, 0, z)
            } else if ("HIDDEN" === c) a = new _(null, N, q), s = !0; else if ("ARROW" === c) {
                var me = i.FGCOLOR || "purple", be = X(i.PARALLEL), we = X(i.SOUTHWEST), xe = X(i.NORTHEAST);
                a = new A(N, q, U, me, be, we, xe)
            } else if ("ANCHORED_ARROW" === c) {
                var V = i.FGCOLOR || "none", Z = i.BGCOLOR || "green";
                a = new C(N, q, U, Z, V, f), a.bump = !0
            } else if ("SPAN" === c) {
                var V = i.FGCOLOR || "black";
                a = new T(N, q, U, V)
            } else if ("LINE" === c) {
                var V = i.FGCOLOR || "black", Se = i.STYLE || "solid";
                a = new k(N, q, U, Se, f, V)
            } else if ("PRIMERS" === c) {
                var V = i.FGCOLOR || "black", Z = i.BGCOLOR || "red";
                a = new L(N, q, U, Z, V)
            } else if ("TEXT" === c) {
                var _e = i.STRING || "text", Z = i.FGCOLOR || "black";
                a = new E($, N, q, U, Z, _e)
            } else if ("TOOMANY" === c) {
                var V = i.FGCOLOR || "gray", Z = i.BGCOLOR || "orange";
                a = new O(N, q, U, Z, V)
            } else if ("POINT" === c) {
                var U = r.forceHeight || i.HEIGHT || 30, ce = r.quantMin(i), de = r.quantMax(i), Ce = 1 * U / (de - ce),
                    pe = (1 * y - ce) / (de - ce), Te = (y - 1 * ce) * Ce | 0;
                l = {min: ce, max: de};
                var Z = i.FGCOLOR || i.COLOR1 || "black";
                if (i.COLOR2) {
                    var Y = i._gradient;
                    Y || (Y = D(50, i.COLOR1, i.COLOR2, i.COLOR3), i._gradient = Y);
                    var re = pe * Y.length | 0;
                    0 > re && (re = 0), re >= Y.length && (re = Y.length - 1), Z = Y[re]
                }
                a = new I((N + q) / 2, U - Te, U, Z)
            } else if ("__SEQUENCE" === c) {
                var ke = e.seq, Le = ke, Ae = e.quals, Oe = Ae, Ee = X(i.__INSERTIONS), Re = [];
                if (e.cigar) {
                    var Be = K(e.cigar);
                    Le = "", Oe = "";
                    for (var Me = 0, Ie = 0; Ie < Be.length; ++Ie) {
                        var He = Be[Ie];
                        if ("M" == He.op) Le += ke.substr(Me, He.cnt), Oe += Ae.substr(Me, He.cnt), Me += He.cnt; else if ("D" == He.op) for (var Pe = 0; Pe < He.cnt; ++Pe) Le += "-", Oe += "Z"; else if ("I" == He.op) {
                            var Fe = ke.substr(Me, He.cnt),
                                Ne = new x(N + Le.length * h, 5, "S", 5, r.browser.baseColors.I);
                            Ee && (Ne = new m($, Ne, Fe, !1, "center", "above", "7px sans-serif")), Ne.feature = {
                                label: "Insertion: " + Fe, type: "insertion", method: "insertion"
                            }, Re.push(Ne), Me += He.cnt
                        } else "S" == He.op ? Me += He.cnt : console.log("unknown cigop" + He.op)
                    }
                }
                var Ge = o(r, d, p);
                if (Le && Ge && ("mismatch" === i.__SEQCOLOR || "mismatch-all" === i.__SEQCOLOR)) {
                    for (var De = [], qe = "-" === e.orientation ? "," : ".", Ue = 0; Ue < Le.length; ++Ue) De.push(Le[Ue] == Ge[Ue] ? qe : Le[Ue]);
                    Le = De.join("")
                }
                var ze;
                ze = "-" === e.orientation ? i._minusColor || "lightskyblue" : i._plusColor || "lightsalmon", i.__disableQuals && (Oe = !1), a = new R(r.browser.baseColors, ze, N, q, U, Le, Ge, i.__SEQCOLOR, Oe, !X(i.__CLEARBG)), Ee && (a = new M(a, 0, 7)), Re.length > 0 && (Re.splice(0, 0, a), a = new g(Re))
            } else if ("__INSERTION" === c) {
                var Ne = new x(N, 5, "S", 5, r.browser.baseColors.I);
                if (a = new m($, Ne, e.insertion || e.altAlleles[0], !1, "center", "above", "7px sans-serif"), q - N > 1) {
                    var Z = i.BGCOLOR || i.COLOR1 || "green", We = new v(N, 5, q - N, U, Z, V);
                    a = new g([We, a])
                }
            } else {
                if ("__NONE" === c) return null;
                var V = i.FGCOLOR || null, Z = i.BGCOLOR || i.COLOR1 || "green";
                i.BGITEM && e.itemRgb && (Z = e.itemRgb);
                var h = (q - N) / (p - d);
                if ("translation" == e.type && ("protein_coding" == e.method || e.readframeExplicit) && (!e.tags || e.tags.indexOf("cds_start_NF") < 0 || e.readframeExplicit) && (!r.dasSource.collapseSuperGroups || r.bumped) && h >= .5) {
                    var Ge = o(r, d, p);
                    a = new B(N, q, U, Z, Ge, e.orientation, e.readframe)
                } else a = new v(N, 0, q - N, U, Z, V)
            }
            return (X(i.LABEL) || e.forceLabel) && H && !s && (a = new m($, a, H, !1)), W && (a.bump = !0), a.feature = e, l && (a.quant = l), i.ZINDEX && (a.zindex = 0 | i.ZINDEX), a
        }

        function a(e, t, i) {
            for (var r = i.browser.viewStart, n = i.browser.scale, s = i.forceHeight || t.HEIGHT || 30, o = i.quantMin(t), a = i.quantMax(t), l = 1 * s / (a - o), h = (t.LINEWIDTH || 1, t.FGCOLOR || t.COLOR1 || "black"), u = [], c = 0; c < e.length; ++c) {
                var d = e[c], p = (((0 | d.min) + (0 | d.max)) / 2 - r) * n, f = (d.score - 1 * o) * l | 0, v = s - f;
                u.push(p), u.push(v)
            }
            var g = new y(u, h, s);
            return g.quant = {min: o, max: a}, t.ZINDEX && (g.zindex = 0 | t.ZINDEX), g
        }

        if ("undefined" != typeof e) var l = e("./utils"), h = l.shallowCopy, u = l.pusho, c = e("./tier"),
            d = c.DasTier, p = e("./features").sortFeatures, f = e("./glyphs"), v = f.BoxGlyph, g = f.GroupGlyph,
            y = f.LineGraphGlyph, m = f.LabelledGlyph, b = f.CrossGlyph, w = f.ExGlyph, x = f.TriangleGlyph,
            S = f.DotGlyph, _ = f.PaddedGlyph, C = f.AArrowGlyph, T = f.SpanGlyph, k = f.LineGlyph, L = f.PrimersGlyph,
            A = f.ArrowGlyph, O = f.TooManyGlyph, E = f.TextGlyph, R = f.SequenceGlyph, B = f.AminoAcidGlyph,
            M = f.TranslatedGlyph, I = f.PointGlyph, H = f.GridGlyph, P = f.StarGlyph, F = f.PlimsollGlyph,
            N = f.OverlayLabelCanvas, G = e("./color"), D = G.makeGradient, q = e("./spans"), U = q.Range, z = q.union,
            W = e("./das"), V = W.DASFeature, X = W.isDasBooleanTrue, j = W.isDasBooleanNotFalse,
            K = e("./cigar").parseCigar, Z = e("./numformats"), Q = Z.formatQuantLabel;
        var Y = 3;
        r.prototype.indexFor = function (e) {
            for (var t = e.min(), i = 0, r = this.glyphs.length; r > i;) {
                var n = (i + r) / 2 | 0;
                if (n >= this.glyphs.length) return this.glyphs.length;
                var s = this.glyphs[n];
                t < s.min() ? r = n : i = n + 1
            }
            return r
        }, r.prototype.add = function (e) {
            var t = this.indexFor(e);
            this.glyphs.splice(t, 0, e), this.height = Math.max(this.height, e.height()), e.quant && null == this.quant && (this.quant = e.quant)
        }, r.prototype.hasSpaceFor = function (e) {
            var t = this.indexFor(e);
            return t > 0 && this.glyphs[t - 1].max() >= e.min() ? !1 : t < this.glyphs.length && this.glyphs[t].min() <= e.max() ? !1 : !0
        };
        var $;
        d.prototype.paint = function () {
            var e = this.browser.retina && window.devicePixelRatio > 1, t = this.subtiers;
            if (t) {
                var i = this.browser.featurePanelWidth + 2e3;
                e && (i *= 2);
                var r = 0 | this.viewport.width;
                i - 50 > r && (this.viewport.width = r = i);
                for (var n = this.padding, s = 0; s < t.length; ++s) n = n + t[s].height + this.padding;
                n += 6, n = Math.max(n, this.browser.minTierHeight);
                var o = n;
                e && (o *= 2), o != this.viewport.height && (this.viewport.height = o);
                Math.max(n, this.browser.minTierHeight);
                this.viewportHolder.style.left = "-1000px", this.viewport.style.width = e ? "" + r / 2 + "px" : "" + r + "px", this.viewport.style.height = "" + n + "px", this.layoutHeight = Math.max(n, this.browser.minTierHeight), this.updateHeight(), this.norigin = this.browser.viewStart;
                var a = this.viewport.getContext("2d");
                a.clearRect(0, 0, r, o), a.save(), e && a.scale(2, 2);
                var l = this.browser.viewStart - 1e3 / this.browser.scale,
                    h = this.browser.viewEnd + 1e3 / this.browser.scale, u = [];
                if (this.knownCoverage) for (var c = this.knownCoverage.ranges(), d = 0; d < c.length; ++d) {
                    var p = c[d];
                    0 == d ? p.min() > l && u.push({min: l, max: p.min() - 1}) : u.push({
                        min: c[d - 1].max() + 1,
                        max: p.min() - 1
                    }), d == c.length - 1 && p.max() < h && u.push({min: p.max() + 1, max: h})
                }
                if (u.length > 0) {
                    a.fillStyle = "gray";
                    for (var f = 0; f < u.length; ++f) {
                        var v = u[f], g = (v.min - this.browser.viewStart) * this.browser.scale + 1e3,
                            y = (v.max - this.browser.viewStart) * this.browser.scale + 1e3;
                        a.fillRect(g, 0, y - g, n)
                    }
                }
                var m = new N, b = (this.glyphCacheOrigin - this.browser.viewStart) * this.browser.scale + 1e3;
                a.translate(b, this.padding), m.translate(0, this.padding), this.paintToContext(a, m, b), m.glyphs.length > 0 ? this.overlayLabelCanvas = m : this.overlayLabelCanvas = null, a.restore(), this.drawOverlay(), this.paintQuant()
            }
        }, d.prototype.paintToContext = function (e, t, i) {
            var r = this.subtiers, n = 0 | this.viewport.width;
            e.save();
            for (var s = 0; s < r.length; ++s) {
                for (var o = null, a = r[s].glyphs, l = 0; l < a.length; ++l) {
                    var h = a[l];
                    if (h.min() < n - i && h.max() > -i) {
                        var h = a[l];
                        h.draw(e, t), h.quant && (o = h.quant)
                    }
                }
                if (o && o.min < 0 && o.max > 0 && this.dasSource.zeroLine) {
                    var u = r[0].height * (o.max / (o.max - o.min));
                    e.save(), e.strokeStyle = this.dasSource.zeroLine, e.lineWidth = .5, e.beginPath(), e.moveTo(-1e3, u), e.lineTo(n + 1e3, u), e.stroke(), e.restore()
                }
                e.translate(0, r[s].height + this.padding), t.translate(0, r[s].height + this.padding)
            }
            if (e.restore(), o && this.quantLeapThreshold && this.featureSource && this.browser.sourceAdapterIsCapable(this.featureSource, "quantLeap")) {
                var u = r[0].height * (1 - (this.quantLeapThreshold - o.min) / (o.max - o.min));
                e.save(), e.strokeStyle = "red", e.lineWidth = .3, e.beginPath(), e.moveTo(-1e3, u), e.lineTo(n + 1e3, u), e.stroke(), e.restore()
            }
        }, d.prototype.paintQuant = function () {
            if (this.quantOverlay) {
                var e, t = this.browser.retina && window.devicePixelRatio > 1;
                if (this.subtiers && this.subtiers.length > 0 && (e = this.subtiers[0].quant), e) {
                    var i = this.subtiers[0].height, r = 50;
                    this.quantOverlay.height = this.viewport.height, this.quantOverlay.width = t ? 2 * r : r, this.quantOverlay.style.height = "" + (t ? this.quantOverlay.height / 2 : this.quantOverlay.height) + "px", this.quantOverlay.style.width = "" + r + "px", this.quantOverlay.style.display = "block";
                    var n = this.quantOverlay.getContext("2d");
                    t && n.scale(2, 2);
                    var s = 2;
                    i > 40 && (s = 1 + (i / 20 | 0));
                    var o = (i + 2 * this.padding) / (s - 1), a = (e.max - e.min) / (s - 1);
                    if (n.fillStyle = "white", n.globalAlpha = .6, "right" == this.browser.rulerLocation ? n.fillRect(r - 30, 0, 30, i + 2 * this.padding) : n.fillRect(0, 0, 30, i + 2 * this.padding), n.globalAlpha = 1, n.strokeStyle = "black", n.lineWidth = 1, n.beginPath(), "right" == this.browser.rulerLocation) {
                        n.moveTo(r - 8, this.padding), n.lineTo(r, this.padding), n.lineTo(r, i + this.padding), n.lineTo(r - 8, i + this.padding);
                        for (var l = 1; s - 1 > l; ++l) {
                            var h = l * o;
                            n.moveTo(r, h), n.lineTo(r - 5, h)
                        }
                    } else {
                        n.moveTo(8, this.padding), n.lineTo(0, this.padding), n.lineTo(0, i + this.padding), n.lineTo(8, i + this.padding);
                        for (var l = 1; s - 1 > l; ++l) {
                            var h = l * o;
                            n.moveTo(0, h), n.lineTo(5, h)
                        }
                    }
                    if (n.stroke(), n.fillStyle = "black", "right" == this.browser.rulerLocation) {
                        n.textAlign = "right", n.fillText(Q(e.max), r - 9, 8), n.fillText(Q(e.min), r - 9, i + this.padding);
                        for (var l = 1; s - 1 > l; ++l) {
                            var h = l * o;
                            n.fillText(Q(1 * e.max - l * a), r - 9, h + 3)
                        }
                    } else {
                        n.textAlign = "left", n.fillText(Q(e.max), 9, 8), n.fillText(Q(e.min), 9, i + this.padding);
                        for (var l = 1; s - 1 > l; ++l) {
                            var h = l * o;
                            n.fillText(Q(1 * e.max - l * a), 9, h + 3)
                        }
                    }
                } else this.quantOverlay.style.display = "none"
            }
        }, d.prototype.styleForFeature = function (e) {
            var t = this.browser.zoomForCurrentScale();
            if (!this.stylesheet) return null;
            for (var i = null, r = this.stylesheet.styles, n = 0; n < r.length; ++n) {
                var s = r[n];
                if (!(s.zoom && s.zoom != t || s.orientation && s.orientation != e.orientation)) {
                    var o = s._labelRE;
                    if (o && o.test || (o = new RegExp("^" + s.label + "$"), s._labelRE = o), !s.label || o.test(e.label)) {
                        var a = s._methodRE;
                        if (a && a.test || (a = new RegExp("^" + s.method + "$"), s._methodRE = a), !s.method || a.test(e.method)) {
                            if (s.type) {
                                if ("default" == s.type) {
                                    i || (i = s.style);
                                    continue
                                }
                                var l = s._typeRE;
                                if (l && l.test || (l = new RegExp("^" + s.type + "$"), s._typeRE = l), !l.test(e.type)) continue
                            }
                            return s.style
                        }
                    }
                }
            }
            return i
        }, d.prototype.quantMin = function (e) {
            return this.forceMinDynamic ? this.currentFeaturesMinScore || 0 : "number" == typeof this.forceMin ? this.forceMin : e.MIN || this.currentFeaturesMinScore || 0
        }, d.prototype.quantMax = function (e) {
            return this.forceMaxDynamic ? this.currentFeaturesMaxScore || 0 : "number" == typeof this.forceMax ? this.forceMax : e.MAX || this.currentFeaturesMaxScore || 0
        }, "undefined" != typeof t && (t.exports = {drawFeatureTier: n})
    }, {
        "./cigar": 8,
        "./color": 9,
        "./das": 10,
        "./features": 20,
        "./glyphs": 21,
        "./numformats": 26,
        "./spans": 36,
        "./tier": 45,
        "./utils": 49
    }],
    19: [function (e, t, i) {
        "use strict";

        function r(e, t, i) {
            var r = l(i.type, t.type), n = l(i.label, t.label, i.id, t.id);
            n && 0 != n.indexOf("__dazzle") && (r = r + ": " + n), this.hit = e, this.feature = t, this.group = i, this.title = r, this.sections = []
        }

        function n(e, t) {
            var i = [];
            if (e) for (var r = 0; r < e.length; ++r) h(i, e[r]);
            if (t) for (var r = 0; r < t.length; ++r) h(i, t[r]);
            return i
        }

        if ("undefined" != typeof e) var s = e("./cbrowser"), o = s.Browser, a = e("./utils"), l = a.pick,
            h = a.pushnew, u = a.makeElement;
        var c = new RegExp("^([A-Za-z_-]+)=(.+)");
        o.prototype.addFeatureInfoPlugin = function (e) {
            this.featureInfoPlugins || (this.featureInfoPlugins = []), this.featureInfoPlugins.push(e)
        }, r.prototype.setTitle = function (e) {
            this.title = e
        }, r.prototype.add = function (e, t) {
            "string" == typeof t && (t = u("span", t)), this.sections.push({label: e, info: t})
        }, o.prototype.featurePopup = function (e, t, i, s) {
            var o = i.length, a = --o >= 0 ? i[o] : {}, l = --o >= 0 ? i[o] : {}, h = new r(i, a, l);
            h.tier = s;
            for (var d = this.featureInfoPlugins || [], p = 0; p < d.length; ++p) try {
                d[p](a, h)
            } catch (f) {
                console.log(f.stack || f)
            }
            for (d = s.featureInfoPlugins || [], p = 0; p < d.length; ++p) try {
                d[p](a, h)
            } catch (f) {
                console.log(f.stack || f)
            }
            this.removeAllPopups();
            var v = u("table", null, {className: "table table-striped table-condensed"});
            v.style.width = "100%", v.style.margin = "0px";
            var g = 0;
            if (a.method && !s.dasSource.suppressMethod) {
                var y = u("tr", [u("th", "Method"), u("td", a.method)]);
                v.appendChild(y), ++g
            }
            var m;
            m = l.segment ? l : a;
            var y = u("tr", [u("th", "Location"), u("td", m.segment + ":" + m.min + "-" + m.max, {}, {minWidth: "200px"})]);
            if (v.appendChild(y), ++g, void 0 !== a.score && null !== a.score && "-" != a.score && !a.suppressScore && !s.dasSource.suppressScore) {
                var y = u("tr", [u("th", "SScore"), u("td", "" + a.score)]);
                v.appendChild(y), ++g
            }
            var b = n(l.links, a.links);
            if (b && b.length > 0) {
                var y = u("tr", [u("th", "Links"), u("td", b.map(function (e) {
                    return u("div", u("a", e.desc, {href: e.uri, target: "_new"}))
                }))]);
                v.appendChild(y), ++g
            }
            for (var w = n(l.notes, a.notes), x = 0; x < w.length; ++x) {
                var S = "Note", _ = w[x], C = _.match(c);
                C && (S = C[1], _ = C[2]);
                var y = u("tr", [u("th", S), u("td", _)]);
                v.appendChild(y), ++g
            }
            for (var T = 0; T < h.sections.length; ++T) {
                var k = h.sections[T];
                v.appendChild(u("tr", [u("th", k.label), u("td", k.info)]))
            }
            this.popit(e, h.title || "Feature", v, {width: 450})
        }
    }, {"./cbrowser": 6, "./utils": 49}],
    20: [function (e, t, i) {
        "use strict";

        function r(e) {
            for (var t, i, r, n = e.browser.drawnStart, a = e.browser.drawnEnd, l = {}, h = {}, u = {}, c = {}, d = {}, p = {}, f = {}, v = {}, g = [], y = function () {
                r = {};
                for (var t = 0; t < e.currentFeatures.length; ++t) {
                    var i = e.currentFeatures[t];
                    i.id && (r[i.id] = i)
                }
            }, m = function (e) {
                var t = [];
                if (e.parents) for (var i = 0; i < e.parents.length; ++i) {
                    var n = e.parents[i], s = r[n];
                    s && "SO:0000704" == s.typeCv && pushnew(t, n)
                }
                return t
            }, b = 0; b < e.currentFeatures.length; ++b) {
                var w = e.currentFeatures[b];
                if (!w.parts) {
                    var x = w.min <= a && w.max >= n;
                    if (w.min && w.max) {
                        if (w.score && "." != w.score && "-" != w.score) {
                            var S = 1 * w.score;
                            (!t || t > S) && (t = S), (!i || S > i) && (i = S)
                        }
                        var _ = [], C = null;
                        if (w.groups) for (var T = 0; T < w.groups.length; ++T) {
                            var k = w.groups[T], L = k.id;
                            if ("gene" == k.type) C = L, p[L] = k; else if ("translation" == k.type) ; else {
                                s(h, L, w), p[L] = k, _.push(L);
                                var A = c[L];
                                (!A || w.min < A) && (c[L] = w.min), A = d[L], (!A || w.max > A) && (d[L] = w.max)
                            }
                        }
                        if (w.parents) {
                            r || y();
                            for (var O = 0; O < w.parents.length; ++O) {
                                var E = w.parents[O], R = r[E];
                                if (R) {
                                    R.parts || (R.parts = [w]), o(h, E, R), s(h, E, w), p[E] || (p[E] = {
                                        type: R.type,
                                        id: R.id,
                                        label: R.label || R.id
                                    }), _.push(E);
                                    var A = c[E];
                                    (!A || w.min < A) && (c[E] = w.min), A = d[E], (!A || w.max > A) && (d[E] = w.max);
                                    var B = m(R);
                                    if (B.length > 0) {
                                        C = B[0];
                                        var M = r[B[0]];
                                        p[B[0]] = {
                                            type: M.type,
                                            id: M.id,
                                            label: M.label || M.id
                                        }, e.dasSource.collapseSuperGroups || (e.dasSource.collapseSuperGroups = !0)
                                    }
                                }
                            }
                        }
                        if (0 == _.length) x && s(l, w.type, w); else if (C) for (var k = 0; k < _.length; ++k) {
                            var L = _[k];
                            o(f, C, L), v[L] = C
                        }
                    } else g.push(w)
                }
            }
            for (var L in h) {
                var I = p[L];
                "number" != typeof I.min && (I.min = c[L]), "number" != typeof I.max && (I.max = d[L]), d[L] >= n && c[L] <= a && (u[L] = h[L])
            }
            e.ungroupedFeatures = l, e.groupedFeatures = u, e.groups = p, e.superGroups = f, e.groupsToSupers = v, t && (t > 0 ? t = 0 : 0 > i && (i = 0), e.currentFeaturesMinScore = t, e.currentFeaturesMaxScore = i)
        }

        if ("undefined" != typeof e) var n = e("./utils"), s = n.pusho, o = n.pushnewo;
        "undefined" != typeof t && (t.exports = {sortFeatures: r})
    }, {"./utils": 49}],
    21: [function (e, t, i) {
        "use strict";

        function r(e, t) {
            this._stroke = e, this._fill = t
        }

        function n(e, t, i, r, n, s, o, a) {
            this.x = e, this.y = t, this._width = i, this._height = r, this.fill = n, this.stroke = s, this._alpha = o, this._radius = a || 0
        }

        function s(e, t) {
            this.glyphs = e, this.connector = t, this.h = e[0].height();
            for (var i = [], r = 0; r < e.length; ++r) {
                var n = e[r];
                i.push(new R(n.min(), n.max())), this.h = Math.max(this.h, n.height())
            }
            this.coverage = E(i)
        }

        function o(e, t, i) {
            this.points = e, this.color = t, this._height = i || 50
        }

        function a(e, t, i, r, n, s, o) {
            this.glyph = t, this.text = i, this.anchor = n || "left", this.align = s || "below", o && (this.font = o), this.font && (e.save(), e.font = this.font);
            var a = e.measureText(i);
            this.font && e.restore(), this.textLen = a.width, this.textHeight = 5, this.bump = t.bump, this.measured = !r
        }

        function l(e, t, i) {
            this._x = e, this._height = t, this._stroke = i
        }

        function h(e, t, i) {
            this._x = e, this._height = t, this._stroke = i
        }

        function u(e, t, i, n, s, o) {
            r.call(this, o, s), this._x = e, this._height = t, this._dir = i, this._width = n
        }

        function c(e, t, i, r) {
            this._x = e, this._height = t, this._fill = i, this._stroke = r
        }

        function d(e, t, i) {
            this.glyph = e, this._min = t, this._max = i, e && (this.bump = e.bump)
        }

        function p(e, t, i, n, s, o) {
            r.call(this, s, n), this._min = e, this._max = t, this._height = i, this._ori = o
        }

        function f(e, t, i, n) {
            r.call(this, n, null), this._min = e, this._max = t, this._height = i
        }

        function v(e, t, i, r, n, s) {
            this._min = e, this._max = t, this._height = i, this._style = r, this._strand = n, this._stroke = s
        }

        function g(e, t, i, r, n) {
            this._min = e, this._max = t, this._height = i, this._fill = r, this._stroke = n
        }

        function y(e, t, i, n, s, o, a) {
            r.call(this, null, n), this._min = e, this._max = t, this._height = i, this._color = n, this._parallel = s, this._sw = o, this._ne = a
        }

        function m(e, t, i, r, n) {
            this._min = e, this._max = t, this._height = i, this._fill = r, this._stroke = n
        }

        function b(e, t, i, r, n, s) {
            this._min = t, this._max = i, this._height = r, this._fill = n, this._string = s, this._textLen = e.measureText(s).width
        }

        function w(e, t, i) {
            var r, n = {red: "darkred", purple: "mediumpurple", blue: "darkblue", green: "darkgreen"},
                s = n[i.toLowerCase()];
            return r = s ? [i, s] : ["rgb(73, 68, 149)", "rgb(9, 0, 103)"], "?" == e ? "black" : "M" == e ? "greenyellow" : "*" == e ? "crimson" : r[t % 2]
        }

        function x(e) {
            for (var t = {
                A: "T",
                T: "A",
                G: "C",
                C: "G"
            }, i = e.split("").reverse().join(""), r = [], n = 0; n < i.length; ++n) {
                var s = i.substr(n, 1).toUpperCase();
                r.push(s in t ? t[s] : "N")
            }
            return r.join("")
        }

        function S(e, t, i, r, n, s, o) {
            this._min = e, this._max = t, this._height = i, this._fill = r, this._seq = n, this._orientation = s, this._readframe = o
        }

        function _(e, t, i, r) {
            this.glyph = e, this._height = r, this._x = t, this._y = i
        }

        function C(e, t, i, r) {
            this._x = e, this._y = t, this._height = i, this._fill = r
        }

        function T(e) {
            this._height = e || 50
        }

        function k(e, t, i, n, s) {
            r.call(this, s, n), this._x = e, this._r = t, this._points = i
        }

        function L(e, t, i, r, n) {
            this._x = e, this._height = t, this._overhang = i, this._fill = r, this._stroke = n, this._hh = t / 2
        }

        function A() {
            this.ox = 0, this.oy = 0, this.glyphs = []
        }

        if ("undefined" != typeof e) var O = e("./spans"), E = O.union, R = O.Range, B = e("./utils"),
            M = B.makeElementNS, I = B.AMINO_ACID_TRANSLATION, H = e("./svg-utils"), P = H.NS_SVG,
            F = (H.NS_XLINK, H.SVGPath);
        r.prototype.draw = function (e) {
            e.beginPath(), this.drawPath(e), this._fill && (e.fillStyle = this._fill, e.fill()), this._stroke && (e.strokeStyle = this._stroke, e.stroke())
        }, r.prototype.toSVG = function () {
            var e = new F;
            return this.drawPath(e), M(P, "path", null, {
                d: e.toPathData(),
                fill: this._fill || "none",
                stroke: this._stroke || "none"
            })
        }, r.prototype.drawPath = function (e) {
            throw"drawPath method on PathGlyphBase must be overridden"
        }, n.prototype.draw = function (e) {
            var t = this._radius;
            t > 0 ? (e.beginPath(), e.moveTo(this.x + t, this.y), e.lineTo(this.x + this._width - t, this.y), e.arcTo(this.x + this._width, this.y, this.x + this._width, this.y + t, t), e.lineTo(this.x + this._width, this.y + this._height - t), e.arcTo(this.x + this._width, this.y + this._height, this.x + this._width - t, this.y + this._height, t), e.lineTo(this.x + t, this.y + this._height), e.arcTo(this.x, this.y + this._height, this.x, this.y + this._height - t, t), e.lineTo(this.x, this.y + t), e.arcTo(this.x, this.y, this.x + t, this.y, t), e.closePath(), null != this._alpha && (e.save(), e.globalAlpha = this._alpha), this.fill && (e.fillStyle = this.fill, e.fill()), this.stroke && (e.strokeStyle = this.stroke, e.lineWidth = .5, e.stroke()), null != this._alpha && e.restore()) : (null != this._alpha && (e.save(), e.globalAlpha = this._alpha), this.fill && (e.fillStyle = this.fill, e.fillRect(this.x, this.y, this._width, this._height)), this.stroke && (e.strokeStyle = this.stroke, e.lineWidth = .5, e.strokeRect(this.x, this.y, this._width, this._height)), null != this._alpha && e.restore())
        }, n.prototype.toSVG = function () {
            var e = M(P, "rect", null, {
                x: this.x,
                y: this.y,
                width: this._width,
                height: this._height,
                stroke: this.stroke || "none",
                strokeWidth: .5,
                fill: this.fill || "none"
            });
            return null != this._alpha && e.setAttribute("opacity", this._alpha), e
        }, n.prototype.min = function () {
            return this.x
        }, n.prototype.max = function () {
            return this.x + this._width
        }, n.prototype.height = function () {
            return this.y + this._height
        }, s.prototype.drawConnectors = function (e) {
            for (var t = this.coverage.ranges(), i = 1; i < t.length; ++i) {
                var r = t[i], n = t[i - 1];
                if (n && r.min() > n.max()) {
                    var s = n.max(), o = r.min(), a = (s + o) / 2;
                    "hat+" === this.connector ? (e.moveTo(s, this.h / 2), e.lineTo(a, 0), e.lineTo(o, this.h / 2)) : "hat-" === this.connector ? (e.moveTo(s, this.h / 2), e.lineTo(a, this.h), e.lineTo(o, this.h / 2)) : "collapsed+" === this.connector ? (e.moveTo(s, this.h / 2), e.lineTo(o, this.h / 2), o - s > 4 && (e.moveTo(a - 2, this.h / 2 - 3), e.lineTo(a + 2, this.h / 2), e.lineTo(a - 2, this.h / 2 + 3))) : "collapsed-" === this.connector ? (e.moveTo(s, this.h / 2), e.lineTo(o, this.h / 2), o - s > 4 && (e.moveTo(a + 2, this.h / 2 - 3), e.lineTo(a - 2, this.h / 2), e.lineTo(a + 2, this.h / 2 + 3))) : (e.moveTo(s, this.h / 2), e.lineTo(o, this.h / 2))
                }
                n = r
            }
        }, s.prototype.draw = function (e, t) {
            for (var i = 0; i < this.glyphs.length; ++i) {
                var r = this.glyphs[i];
                r.draw(e, t)
            }
            e.strokeStyle = "black", e.beginPath(), this.drawConnectors(e), e.stroke()
        }, s.prototype.toSVG = function () {
            for (var e = M(P, "g"), t = 0; t < this.glyphs.length; ++t) e.appendChild(this.glyphs[t].toSVG());
            var i = new F;
            this.drawConnectors(i);
            var r = i.toPathData();
            if (r.length > 0) {
                var n = M(P, "path", null, {d: i.toPathData(), fill: "none", stroke: "black", strokeWidth: .5});
                e.appendChild(n)
            }
            return e
        }, s.prototype.min = function () {
            return this.coverage.min()
        }, s.prototype.max = function () {
            return this.coverage.max()
        }, s.prototype.height = function () {
            return this.h
        }, o.prototype.min = function () {
            return this.points[0]
        }, o.prototype.max = function () {
            return this.points[this.points.length - 2]
        }, o.prototype.height = function () {
            return this._height
        }, o.prototype.draw = function (e) {
            e.save(), e.strokeStyle = this.color, e.lineWidth = 2, e.beginPath();
            for (var t = 0; t < this.points.length; t += 2) {
                var i = this.points[t], r = this.points[t + 1];
                0 == t ? e.moveTo(i, r) : e.lineTo(i, r)
            }
            e.stroke(), e.restore()
        }, o.prototype.toSVG = function () {
            for (var e = new F, t = 0; t < this.points.length; t += 2) {
                var i = this.points[t], r = this.points[t + 1];
                0 == t ? e.moveTo(i, r) : e.lineTo(i, r)
            }
            return M(P, "path", null, {d: e.toPathData(), fill: "none", stroke: this.color, strokeWidth: "2px"})
        }, a.prototype.toSVG = function () {
            var e = this.glyph.toSVG(), t = {};
            return "above" == this.align ? (e = M(P, "g", e, {transform: "translate(0, " + (2 | this.textHeight) + ")"}), t.y = this.textHeight) : t.y = this.glyph.height() + 15, this.font && (t.fontSize = 7), "center" == this.anchor ? t.x = (this.glyph.min() + this.glyph.max() - this.textLen) / 2 : t.x = this.glyph.min(), M(P, "g", [e, M(P, "text", this.text, t)])
        }, a.prototype.min = function () {
            return this.glyph.min()
        }, a.prototype.max = function () {
            return this.measured ? Math.max(this.glyph.max(), 1 * this.glyph.min() + this.textLen + 10) : this.glyph.max()
        }, a.prototype.height = function () {
            var e = this.glyph.height();
            return this.measured && (e += "above" == this.align ? this.textHeight + 2 : 20), e
        }, a.prototype.draw = function (e, t) {
            "above" == this.align && (e.save(), e.translate(0, this.textHeight + 2)), this.glyph.draw(e), "above" == this.align && e.restore(), t.registerGlyph(this)
        }, a.prototype.drawOverlay = function (e, t, i) {
            e.fillStyle = "black", this.font && (e.save(), e.font = this.font);
            var r;
            "center" == this.anchor ? r = (this.glyph.min() + this.glyph.max() - this.textLen) / 2 : (r = this.glyph.min(), t > r && (r = Math.min(t, this.glyph.max() - this.textLen))), e.fillText(this.text, r, "above" == this.align ? this.textHeight : this.glyph.height() + 15), this.font && e.restore()
        }, l.prototype.draw = function (e) {
            var t = this._height / 2;
            e.beginPath(), e.moveTo(this._x, 0), e.lineTo(this._x, this._height), e.moveTo(this._x - t, t), e.lineTo(this._x + t, t), e.strokeStyle = this._stroke, e.lineWidth = 1, e.stroke()
        }, l.prototype.toSVG = function () {
            var e = this._height / 2, t = new F;
            return t.moveTo(this._x, 0), t.lineTo(this._x, this._height), t.moveTo(this._x - e, e), t.lineTo(this._x + e, e), M(P, "path", null, {
                d: t.toPathData(),
                fill: "none",
                stroke: this._stroke,
                strokeWidth: "1px"
            })
        }, l.prototype.min = function () {
            return this._x - this._height / 2
        }, l.prototype.max = function () {
            return this._x + this._height / 2
        }, l.prototype.height = function () {
            return this._height
        }, h.prototype.draw = function (e) {
            var t = this._height / 2;
            e.beginPath(), e.moveTo(this._x - t, 0), e.lineTo(this._x + t, this._height), e.moveTo(this._x - t, this._height), e.lineTo(this._x + t, 0), e.strokeStyle = this._stroke, e.lineWidth = 1, e.stroke()
        }, h.prototype.toSVG = function () {
            var e = this._height / 2, t = new F;
            return t.moveTo(this._x - e, 0), t.lineTo(this._x + e, this._height), t.moveTo(this._x - e, this._height), t.lineTo(this._x + e, 0), M(P, "path", null, {
                d: t.toPathData(),
                fill: "none",
                stroke: this._stroke,
                strokeWidth: "1px"
            })
        }, h.prototype.min = function () {
            return this._x - this._height / 2
        }, h.prototype.max = function () {
            return this._x + this._height / 2
        }, h.prototype.height = function () {
            return this._height
        }, u.prototype = Object.create(r.prototype), u.prototype.drawPath = function (e) {
            var t = this._height / 2, i = this._width / 2;
            "S" === this._dir ? (e.moveTo(this._x, this._height), e.lineTo(this._x - i, 0), e.lineTo(this._x + i, 0)) : "W" === this._dir ? (e.moveTo(this._x + i, t), e.lineTo(this._x - i, 0), e.lineTo(this._x - i, this._height)) : "E" === this._dir ? (e.moveTo(this._x - i, t), e.lineTo(this._x + i, 0), e.lineTo(this._x + i, this._height)) : (e.moveTo(this._x, 0), e.lineTo(this._x + i, this._height), e.lineTo(this._x - i, this._height)), e.closePath()
        }, u.prototype.min = function () {
            return this._x - this._height / 2
        }, u.prototype.max = function () {
            return this._x + this._height / 2
        }, u.prototype.height = function () {
            return this._height
        }, c.prototype.draw = function (e) {
            var t = this._height / 2;
            e.fillStyle = this._stroke, e.beginPath(), e.arc(this._x, t, t, 0, 6.29), this._fill && (e.fillStyle = this._fill, e.fill()), this._stroke && (e.strokeStyle = this._stroke, e.stroke())
        }, c.prototype.toSVG = function () {
            var e = this._height / 2;
            return M(P, "circle", null, {
                cx: this._x,
                cy: e,
                r: e,
                fill: this._fill || "none",
                stroke: this._stroke || "none",
                strokeWidth: "1px"
            })
        }, c.prototype.min = function () {
            return this._x - this._height / 2
        }, c.prototype.max = function () {
            return this._x + this._height / 2
        }, c.prototype.height = function () {
            return this._height
        }, d.prototype.draw = function (e, t) {
            this.glyph && this.glyph.draw(e, t)
        }, d.prototype.toSVG = function () {
            return this.glyph ? this.glyph.toSVG() : M(P, "g")
        }, d.prototype.min = function () {
            return this._min
        }, d.prototype.max = function () {
            return this._max
        }, d.prototype.height = function () {
            return this.glyph ? this.glyph.height() : 1
        }, p.prototype = Object.create(r.prototype), p.prototype.min = function () {
            return this._min
        }, p.prototype.max = function () {
            return this._max
        }, p.prototype.height = function () {
            return this._height
        }, p.prototype.drawPath = function (e) {
            var t = this._max, i = this._min, r = this._height, n = 0, s = 0, o = this._height + 2,
                a = .333333 * this._height, l = 0;
            this._ori && ("+" === this._ori ? s = .5 * this._height : "-" === this._ori && (n = .5 * this._height)), o > t - i && (i = (t + i - o) / 2, t = i + o), e.moveTo(i + n, l + a), e.lineTo(t - s, l + a), e.lineTo(t - s, l), e.lineTo(t, l + this._height / 2), e.lineTo(t - s, l + r), e.lineTo(t - s, l + a + a), e.lineTo(i + n, l + a + a), e.lineTo(i + n, l + r), e.lineTo(i, l + r / 2), e.lineTo(i + n, l), e.lineTo(i + n, l + a)
        }, f.prototype = Object.create(r.prototype), f.prototype.min = function () {
            return this._min
        }, f.prototype.max = function () {
            return this._max
        }, f.prototype.height = function () {
            return this._height
        }, f.prototype.drawPath = function (e) {
            var t = this._min, i = this._max, r = this._height, n = r / 2;
            e.moveTo(t, n), e.lineTo(i, n), e.moveTo(t, 0), e.lineTo(t, r), e.moveTo(i, 0), e.lineTo(i, r)
        }, v.prototype.min = function () {
            return this._min
        }, v.prototype.max = function () {
            return this._max
        }, v.prototype.height = function () {
            return this._height
        }, v.prototype.drawPath = function (e) {
            var t = this._min, i = this._max, r = this._height, n = r / 2;
            "hat" === this._style ? (e.moveTo(t, n), e.lineTo((t + i) / 2, "-" === this._strand ? r : 0), e.lineTo(i, n)) : (e.moveTo(t, n), e.lineTo(i, n))
        }, v.prototype.draw = function (e) {
            e.beginPath(), this.drawPath(e), e.strokeStyle = this._stroke, "dashed" === this._style && e.setLineDash ? (e.save(), e.setLineDash([3]), e.stroke(), e.restore()) : e.stroke()
        }, v.prototype.toSVG = function () {
            var e = new F;
            this.drawPath(e);
            var t = {d: e.toPathData(), stroke: this._stroke || "none"};
            return "dashed" === this._style && (t.strokeDasharray = "3"), M(P, "path", null, t)
        }, g.prototype.min = function () {
            return this._min
        }, g.prototype.max = function () {
            return this._max
        }, g.prototype.height = function () {
            return this._height
        }, g.prototype.drawStemPath = function (e) {
            var t = this._min, i = this._max, r = this._height, n = r / 2;
            e.moveTo(t, n), e.lineTo(i, n)
        }, g.prototype.drawTrigsPath = function (e) {
            var t = this._min, i = this._max, r = this._height, n = r / 2;
            e.moveTo(t, 0), e.lineTo(t + r, n), e.lineTo(t, r), e.lineTo(t, 0), e.moveTo(i, 0), e.lineTo(i - r, n), e.lineTo(i, r), e.lineTo(i, 0)
        }, g.prototype.draw = function (e) {
            e.beginPath(), this.drawStemPath(e), e.strokeStyle = this._stroke, e.stroke(), e.beginPath(), this.drawTrigsPath(e), e.fillStyle = this._fill, e.fill()
        }, g.prototype.toSVG = function () {
            var e = new F;
            this.drawStemPath(e);
            var t = new F;
            return this.drawTrigsPath(t), M(P, "g", [M(P, "path", null, {
                d: e.toPathData(),
                stroke: this._stroke || "none"
            }), M(P, "path", null, {d: t.toPathData(), fill: this._fill || "none"})])
        }, y.prototype = Object.create(r.prototype), y.prototype.min = function () {
            return this._min
        }, y.prototype.max = function () {
            return this._max
        }, y.prototype.height = function () {
            return this._height
        }, y.prototype.drawPath = function (e) {
            var t = this._min, i = this._max, r = this._height;
            if (this._parallel) {
                var n = r / 2, s = .4 * r;
                this._sw ? (e.moveTo(t + n, r - s), e.lineTo(t + n, r), e.lineTo(t, n), e.lineTo(t + n, 0), e.lineTo(t + n, s)) : (e.moveTo(t, r - s), e.lineTo(t, s)), this._ne ? (e.lineTo(i - n, s), e.lineTo(i - n, 0), e.lineTo(i, n), e.lineTo(i - n, r), e.lineTo(i - n, r - s)) : (e.lineTo(i, s), e.lineTo(i, r - s)), e.closePath()
            } else {
                var o = (t + i) / 2, s = .4 * (i - t), a = r / 3;
                this._ne ? (e.moveTo(t + s, a), e.lineTo(t, a), e.lineTo(o, 0), e.lineTo(i, a), e.lineTo(i - s, a)) : (e.moveTo(t + s, 0), e.lineTo(i - s, 0)), this._sw ? (e.lineTo(i - s, r - a), e.lineTo(i, r - a), e.lineTo(o, r), e.lineTo(t, r - a), e.lineTo(t + s, r - a)) : (e.lineTo(i - s, r), e.lineTo(t + s, r)), e.closePath()
            }
        }, m.prototype.min = function () {
            return this._min
        }, m.prototype.max = function () {
            return this._max
        }, m.prototype.height = function () {
            return this._height
        }, m.prototype.toSVG = function () {
            return M(P, "rect", null, {
                x: this._min,
                y: 0,
                width: this._max - this._min,
                height: this._height,
                stroke: this._stroke || "none",
                fill: this._fill || "none"
            })
        }, m.prototype.draw = function (e) {
            if (this._fill && (e.fillStyle = this._fill, e.fillRect(this._min, 0, this._max - this._min, this._height)), this._stroke) {
                e.strokeStyle = this._stroke, e.strokeRect(this._min, 0, this._max - this._min, this._height), e.beginPath();
                for (var t = 2; t < this._height; t += 3) e.moveTo(this._min, t), e.lineTo(this._max, t);
                e.stroke()
            }
        }, b.prototype.min = function () {
            return this._min
        }, b.prototype.max = function () {
            return Math.max(this._max, this._min + this._textLen)
        }, b.prototype.height = function () {
            return this._height
        }, b.prototype.draw = function (e) {
            e.fillStyle = this._fill, e.fillText(this._string, this._min, this._height - 4)
        }, b.prototype.toSVG = function () {
            return M(P, "text", this._string, {x: this._min, y: this._height - 4})
        }, S.prototype.min = function () {
            return this._min
        }, S.prototype.max = function () {
            return this._max
        }, S.prototype.height = function () {
            return this._height
        }, S.prototype.draw = function (e) {
            var t = this._seq, i = this._fill;
            if (t) {
                var r = (this._max - this._min + 1) / t.length, n = (3 - this._readframe) % 3, s = (t.length - n) % 3,
                    o = "+" == this._orientation ? n : s;
                o > 0 && (e.fillStyle = i, e.fillRect(this._min, 0, r * o, this._height));
                for (var a = o; a < t.length; a += 3) {
                    var l = t.substr(a, 3).toUpperCase();
                    "-" == this._orientation && (l = x(l));
                    var h = l in I ? I[l] : "?";
                    i = 3 == l.length ? w(h, a, this._fill) : this._fill, e.fillStyle = i, e.fillRect(this._min + a * r, 0, r * l.length, this._height), r >= 8 && 3 == l.length && (e.fillStyle = "white", e.fillText(h, this._min + (a + 1) * r, this._height))
                }
            }
        }, S.prototype.toSVG = function () {
            var e = M(P, "g"), t = this._seq, i = this._fill;
            if (!t) return e;
            var r = (this._max - this._min + 1) / t.length, n = (3 - this._readframe) % 3, s = (t.length - n) % 3,
                o = "+" == this._orientation ? n : s;
            o > 0 && e.appendChild(M(P, "rect", null, {
                x: this._min,
                y: 0,
                width: r * o,
                height: this._height,
                fill: i
            }));
            for (var a = o; a < t.length; a += 3) {
                var l = t.substr(a, 3).toUpperCase();
                "-" == this._orientation && (l = x(l));
                var h = l in I ? I[l] : "?";
                i = 3 == l.length ? w(h, a, this._fill) : this._fill, e.appendChild(M(P, "rect", null, {
                    x: this._min + a * r,
                    y: 0,
                    width: r * l.length,
                    height: this._height,
                    fill: i
                })), r >= 8 && 3 == l.length && e.appendChild(M(P, "text", h, {
                    x: this._min + (a + 1) * r,
                    y: this._height,
                    fill: "white"
                }))
            }
            return e
        }, function (e) {
            function t(e, t, i, r, n, s, o, a, l, h) {
                this.baseColors = e, this._strandColor = t, this._min = i, this._max = r, this._height = n, this._seq = s, this._ref = o, this._scheme = a, this._quals = l, this._fillbg = h
            }

            var i = window.devicePixelRatio > 1, r = {}, n = new RegExp("^[ACGT-]$"), s = function (e) {
                return e >= 8
            };
            t.prototype.min = function () {
                return this._min
            }, t.prototype.max = function () {
                return this._max
            }, t.prototype.height = function () {
                return this._height
            }, t.prototype.alphaForQual = function (e) {
                return .1 + .9 * Math.max(0, Math.min(1 * e / 30, 1))
            }, t.prototype.draw = function (e) {
                var t = this._seq, o = this._ref, a = "mismatch" === this._scheme || "mismatch-all" === this._scheme,
                    l = "mismatch-all" === this._scheme, h = t ? t.length : this._max - this._min + 1,
                    u = (this._max - this._min + 1) / h;
                a && !s(u) && (e.fillStyle = this._strandColor, e.fillRect(this._min, this._height / 4, this._max - this._min, this._height / 2));
                for (var c = 0; h > c; ++c) {
                    var d = t ? t.substr(c, 1).toUpperCase() : "N";
                    if (n.test(d) || s(u)) {
                        var p = this.baseColors[d];
                        if (this._quals) {
                            var f = this._quals.charCodeAt(c) - 33, v = e.globalAlpha;
                            e.globalAlpha = this.alphaForQual(f)
                        }
                        if (!p) {
                            var g = o ? o.substr(c, 1).toUpperCase() : "N";
                            p = "N" == d || "N" == g ? "gray" : this._strandColor, l && (d = g)
                        }
                        e.fillStyle = p;
                        var y = n.test(d);
                        if (!this._fillbg && s(u) && y || e.fillRect(this._min + c * u, 0, u, this._height), s(u) && y) {
                            var m = p + "_" + d, b = r[m];
                            if (!b) {
                                b = document.createElement("canvas"), i ? (b.width = 16, b.height = 20) : (b.width = 8, b.height = 10);
                                var w = b.getContext("2d");
                                i && w.scale(2, 2), w.fillStyle = this._fillbg ? "black" : p;
                                var x = w.measureText(d).width;
                                w.fillText(d, .5 * (8 - x), 8), r[m] = b
                            }
                            i ? e.drawImage(b, this._min + c * u + .5 * (u - 8), 0, 8, 10) : e.drawImage(b, this._min + c * u + .5 * (u - 8), 0)
                        }
                        this._quals && (e.globalAlpha = v)
                    }
                }
            }, t.prototype.toSVG = function () {
                for (var e = this._seq, t = this._ref, i = ("mismatch" === this._scheme || "mismatch-all" === this._scheme, "mismatch-all" === this._scheme), r = (this._max - this._min + 1) / this._seq.length, o = M(P, "g"), a = 0; a < e.length; ++a) {
                    var l = e ? e.substr(a, 1).toUpperCase() : "N", h = this.baseColors[l];
                    if (!h) {
                        var u = t ? t.substr(a, 1).toUpperCase() : "N";
                        h = "N" == l || "N" == u ? "gray" : this._strandColor, i && (l = u)
                    }
                    var c = 1;
                    if (this._quals) {
                        var d = this._quals.charCodeAt(a) - 33;
                        c = this.alphaForQual(d)
                    }
                    var p = n.test(l);
                    !this._fillbg && s(r) && p || o.appendChild(M(P, "rect", null, {
                        x: this._min + a * r,
                        y: 0,
                        width: r,
                        height: this._height,
                        fill: h,
                        fillOpacity: c
                    })), s(r) && p && o.appendChild(M(P, "text", l, {
                        x: this._min + (.5 + a) * r,
                        y: 8,
                        textAnchor: "middle",
                        fill: this._fillbg ? "black" : h,
                        fillOpacity: c
                    }))
                }
                return o
            }, e.SequenceGlyph = t
        }(this), _.prototype.height = function () {
            return this._height ? this._height : this.glyph.height() + this._y
        }, _.prototype.min = function () {
            return this.glyph.min() + this._x
        }, _.prototype.max = function () {
            return this.glyph.max() + this._x
        }, _.prototype.minY = function () {
            return this._y
        }, _.prototype.maxY = function () {
            return this._y + this.glyph.height()
        }, _.prototype.draw = function (e, t) {
            e.save(), e.translate(this._x, this._y), this.glyph.draw(e, t), e.restore()
        }, _.prototype.toSVG = function () {
            var e = this.glyph.toSVG();
            return e.setAttribute("transform", "translate(" + this._x + "," + this._y + ")"), e
        },C.prototype.min = function () {
            return this._x - 2
        },C.prototype.max = function () {
            return this._x + 2
        },C.prototype.height = function () {
            return this._height
        },C.prototype.draw = function (e) {
            e.save(), e.globalAlpha = .3, e.fillStyle = this._fill,
                e.beginPath(), e.arc(this._x, this._y, 1.5, 0, 6.29), e.fill(), e.restore()
        },C.prototype.toSVG = function () {
            return M(P, "circle", null, {cx: this._x, cy: this._y, r: 2, fill: this._fill, stroke: "none"})
        },T.prototype.notSelectable = !0,T.prototype.min = function () {
            return -1e5
        },T.prototype.max = function () {
            return 1e5
        },T.prototype.height = function () {
            return this._height
        },T.prototype.draw = function (e) {
            e.save(), e.strokeStyle = "black", e.lineWidth = .1, e.beginPath();
            for (var t = 0; t <= this._height; t += 10) e.moveTo(-5e3, t), e.lineTo(5e3, t);
            e.stroke(), e.restore()
        },T.prototype.toSVG = function () {
            for (var e = new F, t = 0; t <= this._height; t += 10) e.moveTo(-5e3, t), e.lineTo(5e3, t);
            return M(P, "path", null, {d: e.toPathData(), fill: "none", stroke: "black", strokeWidth: "0.1px"})
        },k.prototype = Object.create(r.prototype),k.prototype.min = function () {
            return this._x - this._r
        },k.prototype.max = function () {
            return this._x + this._r
        },k.prototype.height = function () {
            return 2 * this._r
        },k.prototype.drawPath = function (e) {
            for (var t = this._x, i = this._r, r = this._r, n = 0; n < this._points; ++n) {
                var s = 6.28 * n / this._points, o = t + r * Math.sin(s), a = i - r * Math.cos(s);
                0 == n ? e.moveTo(o, a) : e.lineTo(o, a), s = 6.28 * (n + .5) / this._points, o = t + .4 * r * Math.sin(s), a = i - .4 * r * Math.cos(s), e.lineTo(o, a)
            }
            e.closePath()
        },L.prototype.draw = function (e) {
            var t = this._height / 2;
            e.fillStyle = this._stroke, e.beginPath(), e.arc(this._x, t, t - this._overhang, 0, 6.29), e.moveTo(this._x, 0), e.lineTo(this._x, this._height), this._fill && (e.fillStyle = this._fill, e.fill()), this._stroke && (e.strokeStyle = this._stroke, e.stroke())
        },L.prototype.toSVG = function () {
            var e = this._hh;
            return M(P, "g", [M(P, "circle", null, {
                cx: this._x,
                cy: e,
                r: e - this._overhang
            }), M(P, "line", null, {x1: this._x, y1: 0, x2: this._x, y2: this._height})], {
                fill: this._fill || "none",
                stroke: this._stroke || "none",
                strokeWidth: "1px"
            })
        },L.prototype.min = function () {
            return this._x - this._hh
        },L.prototype.max = function () {
            return this._x + this._hh
        },L.prototype.height = function () {
            return this._height
        },A.prototype.translate = function (e, t) {
            this.ox += e, this.oy += t
        },A.prototype.registerGlyph = function (e) {
            this.glyphs.push({x: this.ox, y: this.oy, glyph: e})
        },A.prototype.draw = function (e, t, i) {
            for (var r = 0; r < this.glyphs.length; ++r) {
                var n = this.glyphs[r];
                e.save(), e.translate(n.x, n.y), n.glyph.drawOverlay(e, t, i), e.restore()
            }
        },"undefined" != typeof t && (t.exports = {
            BoxGlyph: n,
            GroupGlyph: s,
            LineGraphGlyph: o,
            LabelledGlyph: a,
            CrossGlyph: l,
            ExGlyph: h,
            TriangleGlyph: u,
            DotGlyph: c,
            PaddedGlyph: d,
            AArrowGlyph: p,
            SpanGlyph: f,
            LineGlyph: v,
            PrimersGlyph: g,
            ArrowGlyph: y,
            TooManyGlyph: m,
            TextGlyph: b,
            SequenceGlyph: this.SequenceGlyph,
            AminoAcidGlyph: S,
            TranslatedGlyph: _,
            GridGlyph: T,
            StarGlyph: k,
            PointGlyph: C,
            PlimsollGlyph: L,
            OverlayLabelCanvas: A
        })
    }, {"./spans": 36, "./svg-utils": 39, "./utils": 49}],
    22: [function (e, t, i) {
        function r(e, t) {
            this.base = e, this.query = t
        }

        if ("undefined" != typeof e) {
            var n = e("./das"), s = (n.DASStylesheet, n.DASStyle, n.DASFeature);
            n.DASGroup
        }
        r.prototype.features = function (e, t, i) {
            t = t || {}, url = this.base + "/features/" + e.name;
            var r = [];
            this.query && r.push(this.query), e.isBounded && (r.push("start=" + e.start), r.push("end=" + e.end)), r.length > 0 && (url = url + "?" + r.join("&"));
            var n = new XMLHttpRequest;
            n.onreadystatechange = function () {
                if (4 == n.readyState) if (n.status >= 300) i(null, "Error code " + n.status); else {
                    var t = JSON.parse(n.response).features, r = [];
                    for (fi = 0; fi < t.length; ++fi) {
                        var o = t[fi], a = new s;
                        a.segment = e.name, a.min = (0 | o.start) + 1, a.max = 0 | o.end, o.name && (a.label = o.name), a.type = o.type || "unknown", r.push(a)
                    }
                    i(r)
                }
            }, n.open("GET", url, !0), n.responseType = "text", n.send("")
        }, "undefined" != typeof t && (t.exports = {JBrowseStore: r})
    }, {"./das": 10}],
    23: [function (e, t, i) {
        "use strict";

        function r() {
            var e = this;
            this.reqs = [], this.awaitedFeatures = {}, this.requestsIssued = new A(function (t, i) {
                e.notifyRequestsIssued = t
            })
        }

        function n(e, t, i, r, n, s, o) {
            this.chr = e, this.min = t, this.max = i, this.coverage = o, this.scale = r, this.features = n || [], this.status = s
        }

        function s(e, t, i, r, n, s) {
            this.tierMap = e, this.chr = t, this.min = i, this.max = r, this.scale = n, this.seqSource = s || new y, this.viewCount = 0, this.featureCache = {}, this.latestViews = {}
        }

        function o(e, t, i) {
            for (var r = [], n = {}, s = 0; s < e.length; ++s) {
                var o = e[s];
                o.min && o.max ? o.groups && o.groups.length > 0 ? h(n, o.groups[0].id, o) : o.min <= i && o.max >= t && r.push(o) : r.push(o)
            }
            for (var a in n) {
                for (var l = n[a], u = 1e11, c = -1e11, s = 0; s < l.length; ++s) {
                    var o = l[s];
                    u = Math.min(u, o.min), c = Math.max(c, o.max)
                }
                if (i >= u || c >= t) for (var s = 0; s < l.length; ++s) r.push(l[s])
            }
            return r
        }

        if ("undefined" != typeof e) var a = e("./utils"), l = a.Awaited, h = a.pusho, u = e("./sourceadapters"),
            c = u.MappedFeatureSource, d = u.CachingFeatureSource, p = u.BWGFeatureSource, f = u.RemoteBWGFeatureSource,
            v = u.BAMFeatureSource, g = u.RemoteBAMFeatureSource, y = u.DummySequenceSource, m = u.DummyFeatureSource,
            b = e("./overlay").OverlayFeatureSource, w = e("./spans"), x = w.Range, S = (w.union, w.intersection),
            _ = e("./sample"), C = _.downsample, T = _.getBaseCoverage, k = e("./das"), L = k.DASSequence,
            A = e("es6-promise").Promise;
        r.prototype.addRequest = function (e) {
            this.reqs.push(e)
        }, r.prototype.abortAll = function () {
            for (var e = 0; e < this.reqs.length; ++e) this.reqs[e].abort()
        }, n.prototype.toString = function () {
            return this.chr + ":" + this.min + ".." + this.max + ";scale=" + this.scale
        }, s.prototype.cancel = function () {
            this.cancelled = !0
        }, s.prototype.bestCacheOverlapping = function (e, t, i) {
            var r = this.featureCache[this.tierMap[0]];
            return r ? r : null
        }, s.prototype.viewFeatures = function (e, t, i, n) {
            if (n != n) throw"viewFeatures called with silly scale";
            if (e != this.chr) throw"Can't extend Known Space to a new chromosome";
            1 > t && (t = 1), this.min = t, this.max = i, this.scale = n, this.pool && this.pool.abortAll(), this.pool = new r, this.awaitedSeq = new l, this.seqWasFetched = !1, this.viewCount++, this.startFetchesForTiers(this.tierMap), this.pool.notifyRequestsIssued()
        }, s.prototype.invalidate = function (e) {
            this.pool && (this.featureCache[e] = null, this.startFetchesForTiers([e]))
        }, s.prototype.startFetchesForTiers = function (e) {
            for (var t, i = this, r = this.awaitedSeq, n = !1, s = 0; s < e.length; ++s) try {
                this.startFetchesFor(e[s], r) && (n = !0)
            } catch (o) {
                var a = e[s];
                a.currentFeatures = [], a.currentSequence = null, a.draw(), a.updateHeight(), a.updateStatus(o), console.log("Error fetching tier source"), console.log(o), t = o
            }
            if (n && !this.seqWasFetched) {
                this.seqWasFetched = !0;
                var l = this.min, h = this.max;
                if (this.cs && this.cs.start <= l && this.cs.end >= h) {
                    var u;
                    return u = this.cs.start == l && this.cs.end == h ? this.cs : new L(this.cs.name, l, h, this.cs.alphabet, this.cs.seq.substring(l - this.cs.start, h + 1 - this.cs.start)), r.provide(u)
                }
                this.seqSource.fetch(this.chr, l, h, this.pool, function (e, t) {
                    t ? ((!i.cs || l <= i.cs.start && h >= i.cs.end || l >= i.cs.end || h <= i.cs.start || h - l > i.cs.end - i.cs.start) && (i.cs = t), r.provide(t)) : (console.log("Sequence loading failed", e), r.provide(null))
                })
            }
            if (t) throw t
        }, s.prototype.startFetchesFor = function (e, t) {
            var i, r = this, s = this.viewCount, a = e.getSource() || new m, l = e.needsSequence(this.scale),
                h = r.featureCache[e], u = e.getActiveStyleFilters(this.scale);
            u && (i = u.typeList());
            var c = this.chr, d = this.min, p = this.max;
            if (void 0 === i) return !1;
            if (h && h.chr === this.chr && h.min <= d && h.max >= p) {
                var f = h.features;
                (h.min < d || h.max > p) && (f = o(f, d, p)), r.provision(e, h.chr, S(h.coverage, new x(d, p)), h.scale, i, f, h.status, l ? t : null);
                var v = a.getScales();
                if (h.scale <= this.scale || !v) return l
            }
            return a.instrument && console.log("Starting  fetch " + s + " (" + d + ", " + p + ")"), a.fetch(c, d, p, this.scale, i, this.pool, function (o, u, f, v) {
                a.instrument && console.log("Finishing fetch " + s);
                var g = r.latestViews[e] || -1;
                r.cancelled || g > s || (v || (v = new x(d, p)), (!h || d < h.min || p > h.max) && (r.featureCache[e] = new n(c, d, p, f, u, o, v)), r.latestViews[e] = s, r.provision(e, c, v, f, i, u, o, l ? t : null))
            }, u), l
        }, s.prototype.provision = function (e, t, i, r, n, s, o, a) {
            if (o && (e.currentFeatures = [], e.currentSequence = null, e.draw(), e.updateHeight()), e.updateStatus(o), !o) {
                for (var l = !1, h = !1, u = e.getSource(); c.prototype.isPrototypeOf(u) || d.prototype.isPrototypeOf(u) || b.prototype.isPrototypeOf(u);) u = b.prototype.isPrototypeOf(u) ? u.sources[0] : u.source;
                (p.prototype.isPrototypeOf(u) || f.prototype.isPrototypeOf(u) || v.prototype.isPrototypeOf(u) || g.prototype.isPrototypeOf(u)) && (l = !0), u.opts && (u.opts.forceReduction || u.opts.noDownsample) || l && n && 1 == n.length && n.indexOf("density") >= 0 && (s = C(s, this.scale)), n && 1 == n.length && n.indexOf("base-coverage") >= 0 && (h = !0), a ? a.await(function (n) {
                    h && (s = T(s, n, e.browser.baseColors)), e.viewFeatures(t, i, r, s, n)
                }) : e.viewFeatures(t, i, r, s)
            }
        }, "undefined" != typeof t && (t.exports = {KnownSpace: s})
    }, {
        "./das": 10,
        "./overlay": 27,
        "./sample": 29,
        "./sourceadapters": 34,
        "./spans": 36,
        "./utils": 49,
        "es6-promise": 53
    }],
    24: [function (e, t, i) {
        function r(e, t) {
            this.block = e, this.offset = t
        }

        function n(e, t) {
            var i = 4294967296 * (255 & e[t + 6]) + 16777216 * (255 & e[t + 5]) + 65536 * (255 & e[t + 4]) + 256 * (255 & e[t + 3]) + (255 & e[t + 2]),
                n = e[t + 1] << 8 | e[t];
            return 0 == i && 0 == n ? null : new r(i, n)
        }

        function s(e, t) {
            t = Math.min(t || 1, e.byteLength - 50);
            for (var i = [], r = [0], n = 0; r[0] < t;) {
                var s = new Uint8Array(e, r[0], 12), o = s[11] << 8 | s[10],
                    a = u(e, 12 + o + r[0], Math.min(65536, e.byteLength - 12 - o - r[0]), r);
                r[0] += 8, n += a.byteLength, i.push(a)
            }
            if (1 == i.length) return i[0];
            for (var l = new Uint8Array(n), h = 0, d = 0; d < i.length; ++d) {
                var p = new Uint8Array(i[d]);
                c(p, 0, l, h, p.length), h += p.length
            }
            return l.buffer
        }

        function o(e, t) {
            this.minv = e, this.maxv = t
        }

        function a(e, t) {
            return --t, e >> 14 == t >> 14 ? 4681 + (e >> 14) : e >> 17 == t >> 17 ? 585 + (e >> 17) : e >> 20 == t >> 20 ? 73 + (e >> 20) : e >> 23 == t >> 23 ? 9 + (e >> 23) : e >> 26 == t >> 26 ? 1 + (e >> 26) : 0
        }

        function l(e, t) {
            var i, r = [];
            for (--t, r.push(0), i = 1 + (e >> 26); 1 + (t >> 26) >= i; ++i) r.push(i);
            for (i = 9 + (e >> 23); 9 + (t >> 23) >= i; ++i) r.push(i);
            for (i = 73 + (e >> 20); 73 + (t >> 20) >= i; ++i) r.push(i);
            for (i = 585 + (e >> 17); 585 + (t >> 17) >= i; ++i) r.push(i);
            for (i = 4681 + (e >> 14); 4681 + (t >> 14) >= i; ++i) r.push(i);
            return r
        }

        if ("undefined" != typeof e) var h = e("jszlib"), u = h.inflateBuffer, c = h.arrayCopy;
        r.prototype.toString = function () {
            return "" + this.block + ":" + this.offset
        };
        "undefined" != typeof t && (t.exports = {unbgzf: s, readVob: n, reg2bin: a, reg2bins: l, Chunk: o})
    }, {jszlib: 54}],
    25: [function (e, t, i) {
        "use strict";

        function r() {
            this.featuresByChr = {}, this.maxLength = 1, this.chrRing = null
        }

        function n(e) {
            if (this.source = e, l.call(this), this.storeHolder = new c, this.parser = a(e.payload), !this.parser) throw"Unsupported memstore payload: " + e.payload;
            var t = this;
            this._load(function (e, i) {
                if (e) {
                    for (var n = new r, s = [], o = e.split("\n"), a = t.parser.createSession(function (e) {
                        s.push(e)
                    }), l = 0; l < o.length; ++l) {
                        var h = o[l];
                        h.length > 0 && a.parse(h)
                    }
                    a.flush(), n.addFeatures(s), t.storeHolder.provide(n)
                } else t.error = i || "No data", t.storeHolder.provide(null)
            })
        }

        if ("undefined" != typeof e) var s = e("./sourceadapters"), o = s.registerSourceAdapterFactory,
            a = s.makeParser, l = s.FeatureSourceBase, h = e("./das"),
            u = (h.DASStylesheet, h.DASStyle, h.DASFeature, h.DASGroup, e("./utils")), c = u.Awaited, d = u.textXHR;
        r.prototype.addFeatures = function (e) {
            for (var t = {}, i = 0; i < e.length; ++i) {
                var r = e[i], n = r.segment || r.chr, s = this.featuresByChr[n];
                s || (s = [], this.featuresByChr[n] = s), s.push(r), t[n] = !0;
                var o = r.max - r.min + 1;
                o > this.maxLength && (this.maxLength = o)
            }
            for (n in t) {
                var s = this.featuresByChr[n];
                s.sort(function (e, t) {
                    var i = e.min - t.min;
                    return 0 != i ? i : e.max - t.max
                })
            }
            this.chrRing = null
        }, r.prototype._indexFor = function (e, t) {
            for (var i = 0, r = e.length; r > i;) {
                var n = (i + r) / 2 | 0;
                if (n >= e.length) return e.length;
                var s = e[n];
                t < s.min ? r = n : i = n + 1
            }
            return r
        }, r.prototype.fetch = function (e, t, i) {
            var r = this.featuresByChr[e];
            if (r || (r = 0 == e.indexOf("chr") ? this.featuresByChr[e.substring(3)] : this.featuresByChr["chr" + e]), !r) return [];
            for (var n = Math.max(0, this._indexFor(r, t - this.maxLength - 1)), s = Math.min(r.length - 1, this._indexFor(r, i)), o = [], a = n; s >= a; ++a) {
                var l = r[a];
                l.min <= i && l.max >= t && o.push(l)
            }
            return o
        }, r.prototype.findNextFeature = function (e, t, i) {
            if (null == this.chrRing) {
                this.chrRing = [];
                for (var e in this.featuresByChr) this.chrRing.push(e);
                this.chrRing.sort()
            }
            var r = this.featuresByChr[e];
            if (r || (0 == e.indexOf("chr") ? (e = e.substring(3), r = this.featuresByChr[e]) : (e = "chr" + e, r = this.featuresByChr[e])), !r) return null;
            var n = Math.max(0, Math.min(this._indexFor(r, t), r.length - 1));
            if (i > 0) {
                for (; n < r.length;) {
                    var s = r[n++];
                    if (s.min > t) return s
                }
                var o = this.chrRing.indexOf(e) + 1;
                return o >= this.chrRing.length && (o = 0), this.findNextFeature(this.chrRing[o], 0, i)
            }
            for (; n >= 0;) {
                var s = r[n--];
                if (s.max < t) return s
            }
            var o = this.chrRing.indexOf(e) - 1;
            return 0 > o && (o = this.chrRing.length - 1), this.findNextFeature(this.chrRing[o], 1e10, i)
        }, n.prototype = Object.create(l.prototype), n.prototype._load = function (e) {
            if (this.source.blob) {
                var t = new FileReader;
                t.onloadend = function () {
                    return e(t.result, t.error)
                }, t.readAsText(this.source.blob)
            } else {
                if (this.source.credentials) var i = {credentials: this.source.credentials};
                d(this.source.uri, e, i)
            }
        }, n.prototype.fetch = function (e, t, i, r, n, s, o) {
            var a = this;
            this.storeHolder.await(function (r) {
                if (r) {
                    var n = r.fetch(e, t, i);
                    return o(null, n, 1e8)
                }
                return o(a.error)
            })
        }, n.prototype.getStyleSheet = function (e) {
            this.parser && this.parser.getStyleSheet && this.parser.getStyleSheet(e)
        }, n.prototype.getDefaultFIPs = function (e) {
            this.parser && this.parser.getDefaultFIPs && this.parser.getDefaultFIPs(e)
        }, n.prototype.getScales = function () {
            return 1e8
        }, n.prototype.findNextFeature = function (e, t, i, r) {
            var n = this;
            this.storeHolder.await(function (s) {
                return s ? r(s.findNextFeature(e, t, i)) : r(null, n.error)
            })
        }, n.prototype.capabilities = function () {
            var e = {leap: !0};
            return e
        }, o("memstore", function (e) {
            return {features: new n(e)}
        })
    }, {"./das": 10, "./sourceadapters": 34, "./utils": 49}],
    26: [function (e, t, i) {
        function r(e) {
            return (0 | e).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        }

        function n(e) {
            var t = "" + e, i = t.indexOf(".");
            if (0 > i) return t;
            var r = 2;
            return "-" == t.substring(0, 1) && ++r, i >= r ? t.substring(0, i) : t.substring(0, i + 2)
        }

        "undefined" != typeof t && (t.exports = {formatLongInt: r, formatQuantLabel: n})
    }, {}],
    27: [function (e, t, i) {
        "use strict";

        function r(e, t) {
            this.sources = e, this.opts = t || {}, this.activityListeners = [], this.readinessListeners = [], this.changeListeners = [], this.business = [], this.readiness = [];
            for (var i = 0; i < this.sources.length; ++i) this.initN(i);
            "function" == typeof t.merge ? this.merge = t.merge : "concat" == t.merge ? this.merge = o : "alternates" == t.merge ? (this.merge = o, this.filterDispatchOnMethod = !0) : this.merge = s
        }

        function n(e, t, i) {
            this.source = e, this.callback = t, this.sources = i, this.count = i.length, this.returnCount = 0, this.statusCount = 0, this.returns = [], this.features = [], this.statuses = [], this.scale = null
        }

        function s(e) {
            for (var t = [], i = 1; i < e.length; ++i) {
                for (var r = {}, n = e[i], s = 0; s < n.length; ++s) r[this.keyForFeature(n[s])] = n[s];
                t.push(r)
            }
            for (var o = [], a = e[0], s = 0; s < a.length; ++s) {
                for (var l = a[s], h = 0; h < t.length; ++h) {
                    var r = t[h];
                    if (n = r[this.keyForFeature(l)]) for (var u in n) "score" === u ? l.score2 = n.score : "min" === u || "max" === u || "segment" === u || "_cachedStyle" === u || (l[u] = n[u])
                }
                o.push(l)
            }
            return o
        }

        function o(e, t) {
            for (var i = [], r = 0; r < e.length; ++r) for (var n = e[r], s = t[r].name, o = 0; o < n.length; ++o) {
                var a = n[o];
                a.method = s, i.push(a)
            }
            return i
        }

        function a(e, t) {
            return e.capabilities ? e.capabilities()[t] : !1
        }

        if ("undefined" != typeof e) var l = e("./utils"), h = l.shallowCopy, u = l.arrayIndexOf;
        r.prototype.initN = function (e) {
            var t = this.sources[e], i = this;
            this.business[e] = 0, t.addActivityListener && t.addActivityListener(function (t) {
                i.business[e] = t, i.notifyActivity()
            }), t.addChangeListener && t.addChangeListener(function () {
                i.notifyChange()
            }), t.addReadinessListener && t.addReadinessListener(function (t) {
                i.readiness[e] = t, i.notifyReadiness()
            })
        }, r.prototype.addReadinessListener = function (e) {
            this.readinessListeners.push(e), this.notifyReadinessListener(e)
        }, r.prototype.removeReadinessListener = function (e) {
            var t = u(this.readinessListeners, e);
            t >= 0 && this.readinessListeners.splice(t, 1)
        }, r.prototype.notifyReadiness = function () {
            for (var e = 0; e < this.readinessListeners.length; ++e) this.notifyReadinessListener(this.readinessListeners[e])
        }, r.prototype.notifyReadinessListener = function (e) {
            for (var t = null, i = 0; i < this.readiness.length; ++i) if (null != this.readiness[i]) {
                t = this.readiness[i];
                break
            }
            try {
                e(t)
            } catch (r) {
                console.log(r)
            }
        }, r.prototype.addActivityListener = function (e) {
            this.activityListeners.push(e)
        }, r.prototype.removeActivityListener = function (e) {
            var t = u(this.activityListeners, e);
            t >= 0 && this.activityListeners.splice(t, 1)
        }, r.prototype.notifyActivity = function () {
            for (var e = 0, t = 0; t < this.business.length; ++t) e += this.business[t];
            for (var i = 0; i < this.activityListeners.length; ++i) try {
                this.activityListeners[i](e)
            } catch (r) {
                console.log(r)
            }
        }, r.prototype.addChangeListener = function (e) {
            this.changeListeners.push(e)
        }, r.prototype.removeChangeListener = function (e) {
            var t = u(this.changeListeners, e);
            t >= 0 && this.changeListeners.splice(t, 1)
        }, r.prototype.notifyChange = function () {
            for (var e = 0; e < this.changeListeners.length; ++e) try {
                this.changeListeners[e](this.busy)
            } catch (t) {
                console.log(t)
            }
        }, r.prototype.getScales = function () {
            return this.sources[0].getScales()
        }, r.prototype.getStyleSheet = function (e) {
            return this.sources[0].getStyleSheet(e)
        }, r.prototype.capabilities = function () {
            var e = {}, t = this.sources[0];
            t.capabilities && (e = h(t.capabilities()));
            for (var i = 1; i < this.sources.length; ++i) {
                var r = this.sources[i];
                if (r.capabilities) {
                    var n = r.capabilities();
                    n.search && (e.search = n.search)
                }
            }
            return e
        }, r.prototype.search = function (e, t) {
            for (var i = 0; i < this.sources.length; ++i) if (a(this.sources[i], "search")) return this.sources[i].search(e, t)
        }, r.prototype.fetch = function (e, t, i, r, s, o, a, l) {
            var h;
            if (this.filterDispatchOnMethod) {
                h = [];
                for (var u = l.list(), c = 0; c < this.sources.length; ++c) for (var d = this.sources[c], p = 0; p < u.length; ++p) {
                    var f = u[p];
                    if (!f.method || f.method == d.name) {
                        h.push(d);
                        break
                    }
                }
            } else h = this.sources;
            for (var v = new n(this, a, h), c = 0; c < h.length; ++c) this.fetchN(v, c, h[c], e, t, i, r, s, o, l)
        }, r.prototype.fetchN = function (e, t, i, r, n, s, o, a, l, h) {
            i.fetch(r, n, s, o, a, l, function (i, r, n) {
                return e.completed(t, i, r, n)
            }, h)
        }, r.prototype.quantFindNextFeature = function (e, t, i, r, n) {
            return this.sources[0].quantFindNextFeature(e, t, i, r, n)
        }, r.prototype.findNextFeature = function (e, t, i, r) {
            return this.sources[0].findNextFeature(e, t, i, r)
        }, n.prototype.completed = function (e, t, i, r) {
            if ((null == this.scale || 0 == e) && (this.scale = r), this.returns[e]) throw"Multiple returns for source " + e;
            if (this.returns[e] = !0, this.returnCount++, this.features[e] = i, t && (this.statuses[e] = t, this.statusCount++), this.returnCount == this.count) {
                if (this.statusCount > 0) {
                    for (var n = "", s = 0; s < this.count; ++s) {
                        var o = this.statuses[s];
                        o && (n.length > 0 && (n += ", "), n += o)
                    }
                    return this.callback(n, null, this.scale)
                }
                this.callback(null, this.source.merge(this.features, this.sources), this.scale)
            }
        }, r.prototype.getDefaultFIPs = function (e) {
            for (var t = 0; t < this.sources.length; ++t) {
                var i = this.sources[t];
                i.getDefaultFIPs && i.getDefaultFIPs(e)
            }
        }, r.prototype.keyForFeature = function (e) {
            return "" + e.min + ".." + e.max
        }, "undefined" != typeof t && (t.exports = {OverlayFeatureSource: r})
    }, {"./utils": 49}],
    28: [function (e, t, i) {
        "use strict";

        function r(e, t, i) {
            var s, h = new RegExp("^\\w+\\s[0-9]+\\s[0-9]+.*$"), d = /([^=]+)=\"?([^\"]+)\"?/,
                f = /^##\s*fileformat=VCFv4\..+/;
            s = e.blob ? new a(e.blob) : "encode" == e.transport ? new b(e.uri) : new o(e.uri, {credentials: e.credentials}), s.slice(0, 65536).salted().fetch(function (s, o) {
                if (!s) return i || (e.credentials = !0, r(e, t, !0)), t(e, "Couldn't fetch data");
                var a = new Uint8Array(s), y = new Uint32Array(s, 0, 1), b = y[0];
                if (b == u || b == c) {
                    e.tier_type = "bwg";
                    var w = new RegExp("/?([^/]+?)(.bw|.bb|.bigWig|.bigBed)?$"), x = w.exec(e.uri || e.blob.name);
                    return x && (e.name = x[1]), t(e, null)
                }
                if (b == g) return e.tier_type = "bai", t(e, null);
                if (31 == a[0] || 139 == a[1]) {
                    var S = p(s), _ = new Uint8Array(S);
                    if (b = l(_, 0), b == v) {
                        e.tier_type = "bam";
                        var w = new RegExp("/?([^/]+?)(.bam)?$"), x = w.exec(e.uri || e.blob.name);
                        return x && (e.name = x[1]), t(e, null)
                    }
                    if (b == m) return e.tier_type = "tabix-index", t(e, null);
                    if (1768301347 == b) {
                        e.tier_type = "tabix", e.payload = "vcf";
                        var w = new RegExp("/?([^/]+?)(.vcf)?(.gz)?$"), x = w.exec(e.uri || e.blob.name);
                        return x && (e.name = x[1]), t(e, null)
                    }
                    return console.log("magic = " + b.toString(16)), t(e, "Unsupported format")
                }
                var C = String.fromCharCode.apply(null, a), T = C.split("\n");
                if (T.length > 0 && f.test(T[0])) {
                    e.tier_type = "memstore", e.payload = "vcf";
                    var w = new RegExp("/?([^/]+?)(.vcf)?$"), x = w.exec(e.uri || e.blob.name);
                    return x && !e.name && (e.name = x[1]), t(e, null)
                }
                for (var k = 0; k < T.length; ++k) {
                    var L = T[k].replace("\r", "");
                    if (0 != L.length && 0 != L.indexOf("browser")) {
                        if (0 == L.indexOf("track")) {
                            for (var A = "bed", O = L.split(/\s/), E = 1; E < O.length; ++E) {
                                var R = d.exec(O[E]);
                                R && ("type" == R[1] && "wiggle_0" == R[2] ? A = "wig" : "name" == R[0] && (e.name = R[2]))
                            }
                            return n(e, A), t(e, null)
                        }
                        if (0 == L.indexOf("fixedStep")) return n(e, "wig"), t(e, null);
                        if (0 == L.indexOf("variableStep")) return n(e, "wig"), t(e, null);
                        if (h.test(L)) return n(e, null), t(e, null);
                        break
                    }
                }
                return t(e, "Unsupported format")
            }, {timeout: 1500})
        }

        function n(e, t) {
            e.tier_type = "memstore";
            var i = new RegExp("/?([^/]+?)(.(bed|wig))?$"), r = i.exec(e.uri || e.blob.name);
            r && (e.name || (e.name = r[1]), !t && r[3] && (t = r[3])), e.payload = t || "bed"
        }

        if ("undefined" != typeof e) var s = e("./bin"), o = s.URLFetchable, a = s.BlobFetchable, l = s.readInt,
            h = e("./bigwig"), u = h.BIG_WIG_MAGIC, c = h.BIG_BED_MAGIC, d = e("./lh3utils"), p = d.unbgzf,
            f = e("./bam"), v = f.BAM_MAGIC, g = f.BAI_MAGIC, y = e("./tabix"), m = y.TABIX_MAGIC,
            b = e("./encode").EncodeFetchable;
        "undefined" != typeof t && (t.exports = {probeResource: r})
    }, {"./bam": 1, "./bigwig": 3, "./bin": 4, "./encode": 12, "./lh3utils": 24, "./tabix": 41}],
    29: [function (e, t, i) {
        "use strict";

        function r(e) {
            return v[e % v.length] * Math.pow(10, e / v.length | 0)
        }

        function n(e, t, i) {
            this.scale = e, this.tot = 0, this.cnt = 0, this.hasScore = !1, this.min = t, this.max = i, this.features = []
        }

        function s(e, t) {
            return e.min < t.min ? -1 : e.min > t.min ? 1 : e.max < t.max ? -1 : t.max > e.max ? 1 : 0
        }

        function o(e, t) {
            for (var i = 0; r(i + 1) < t;) ++i;
            for (var s = r(i), o = [], a = -1e10, l = 1e10, h = 0; h < e.length; ++h) {
                var u = e[h];
                if (u.groups && u.groups.length > 0) return e;
                var c = u.min / s | 0, p = u.max / s | 0;
                a = Math.max(a, p), l = Math.min(l, c);
                for (var f = c; p >= f; ++f) {
                    var v = o[f];
                    v || (v = new n(s, f * s, (f + 1) * s - 1), o[f] = v), v.feature(u)
                }
            }
            for (var g = [], f = l; a >= f; ++f) {
                var v = o[f];
                if (v) {
                    var u = new d;
                    u.segment = e[0].segment, u.min = f * s + 1, u.max = (f + 1) * s, u.score = v.score(), u.type = "density", g.push(u)
                }
            }
            Date.now();
            return g
        }

        function a(e) {
            this._pos = e, this._bases = {}, this._totalCount = 0
        }

        function l(e, t, i) {
            for (var r = p(i), n = [], s = [], o = 0, a = 0; a < r.length; ++a) {
                var l = r[a];
                if ("M" == l.op) n.push(e.substr(o, l.cnt)), s.push(t.substr(o, l.cnt)), o += l.cnt; else if ("D" == l.op) for (var h = 0; h < l.cnt; ++h) n.push("-"), s.push("Z"); else "I" == l.op ? o += l.cnt : "S" == l.op ? o += l.cnt : console.log("unknown cigop" + l.op)
            }
            var u = {seq: n.join(""), quals: s.join("")};
            return u
        }

        function h(e, t, i) {
            var r = [];
            if (e) {
                var n = 0 | e.start, s = 0 | e.end;
                if (i >= n && s >= t) {
                    for (var o = Math.max(t, n), a = Math.min(i, s), l = 0; o - t > l; l++) r.push("N");
                    r.push(e.seq.substr(o - n, a - o + 1));
                    for (var l = 0; i - a > l; l++) r.push("N")
                }
            }
            return r.join("")
        }

        function u(e, t, i) {
            for (var r = null, n = null, s = [], o = 0; o < e.length; ++o) {
                var u = e[o];
                if (u.groups && u.groups.length > 0) return e;
                for (var c = l(u.seq, u.quals, u.cigar), p = c.seq, v = c.quals, g = u.orientation, y = u.min || 0, m = u.max || 0, b = 0, w = y; m >= w; ++w) {
                    var x = s[w];
                    x || (x = new a(w), s[w] = x);
                    var S = p.charAt(b), _ = v.charCodeAt(b) - 33;
                    x.recordBase(S, _, g), b++
                }
                r = r ? Math.min(r, y) : y, n = n ? Math.max(n, m) : m
            }
            for (var C = h(t, r, n), T = [], b = 0, w = r; n >= w; ++w) {
                var x = s[w];
                if (x) {
                    var u = new d;
                    if (u.segment = e[0].segment, u.min = x.pos(), u.max = u.min, u.notes = [], u.notes = u.notes.concat(x.infoList()), u.type = "base-coverage", u.suppressScore = !0, C) {
                        var k = C.charAt(b), L = "Ref=" + k;
                        u.notes.unshift(L);
                        for (var A = x.baseScoreList(k, .2), O = 0; O < A.length; O++) {
                            var S = A[O].base, E = A[O].score, R = f(u);
                            R.score = E, (A.length > 1 || S != k) && (R.itemRgb = i[S]), T.push(R)
                        }
                    } else T.push(u)
                }
                b++
            }
            return T
        }

        if ("undefined" != typeof e) var c = e("./das"), d = c.DASFeature, p = e("./cigar").parseCigar,
            f = e("./utils").shallowCopy;
        var v = [1, 2, 5];
        n.prototype.score = function () {
            if (0 == this.cnt) return 0;
            if (this.hasScore) return this.tot / this.cnt;
            var e = this.features;
            e.sort(s);
            for (var t = -1e10, i = 0, r = 0, n = 1; n < e.length; ++n) {
                var o = e[n], a = Math.max(o.min, this.min), l = Math.min(o.max, this.max);
                r += l - a + 1, a > t ? (i += l - a + 1, t = l) : l > t && (i += l - t, t = l)
            }
            return i > 0 ? 1 * r / i : 0
        }, n.prototype.feature = function (e) {
            void 0 !== e.score && (this.tot += e.score, this.hasScore = !0), ++this.cnt, this.features.push(e)
        }, a.prototype.recordBase = function (e, t, i) {
            if (this._bases[e]) {
                var r = this._bases[e];
                r.cnt++, r.totalQual += t, r.strandCnt[i]++
            } else {
                var n = {"+": 0, "-": 0};
                n[i]++, this._bases[e] = {cnt: 1, totalQual: t, strandCnt: n}
            }
            this._totalCount++
        }, a.prototype.totalCount = function () {
            return this._totalCount
        }, a.prototype.pos = function () {
            return this._pos
        }, a.prototype.infoList = function () {
            var e = [], t = this._totalCount, i = "Depth=" + t.toString();
            e.push(i);
            for (var r in this._bases) {
                var n = this._bases[r], s = n.cnt, o = 100 * s / t, a = n.strandCnt["+"], l = n.strandCnt["-"],
                    h = n.totalQual / s,
                    u = [r, "=", s, " (", o.toFixed(0), "%, ", a, " +, ", l, " -, Qual: ", h.toFixed(0), ")"];
                e.push(u.join(""))
            }
            return e
        }, a.prototype.baseScoreList = function (e, t) {
            var i = [], r = this._totalCount, n = t * r;
            for (var s in this._bases) {
                var o = this._bases[s].cnt;
                if (!(n > o || s == e)) {
                    var a = {base: s, score: r};
                    i.push(a), r -= o
                }
            }
            return i.push({base: e, score: r}), i
        }, "undefined" != typeof t && (t.exports = {downsample: o, getBaseCoverage: u})
    }, {"./cigar": 8, "./das": 10, "./utils": 49}],
    30: [function (e, t, i) {
        "use strict";

        function r(e, t) {
            var i = parseFloat(e.replace(/,/g, ""));
            return "k" === t || "K" === t ? 1e3 * i | 0 : "m" == t || "M" === t ? 1e6 * i | 0 : 0 | i
        }

        if ("undefined" != typeof e) var n = e("./cbrowser"), s = n.Browser, o = e("./bin"), a = o.URLFetchable,
            l = e("./trix").connectTrix;
        var h = /^([\d+,\w,\.,\_,\-]+):([0-9,\.]+?)([KkMmGg])?((-|\.\.)+([0-9,\.]+)([KkMmGg])?)?$/;
        s.prototype.search = function (e, t, i) {
            var n = this;
            i = i || {};
            var s = i.padding || this.defaultSearchRegionPadding, o = h.exec(e);
            if (o) {
                var u, c, d = o[1];
                if (o[6]) u = r(o[2], o[3]), c = r(o[6], o[7]); else {
                    var p = this.viewEnd - this.viewStart + 1;
                    u = r(o[2], o[3]) - p / 2 | 0, c = u + p - 1
                }
                this.setLocation(d, u, c, t)
            } else {
                if (!e || 0 == e.length) return !1;
                var f = 0, v = !1, g = function (i, r) {
                    if (--f, r) return t(r);
                    i || (i = []);
                    for (var o = 5e8, a = -1e8, l = null, h = 0; h < i.length; ++h) {
                        var u = i[h];
                        null == l && (l = u.segment), o = Math.min(o, u.min), a = Math.max(a, u.max)
                    }
                    if (l) {
                        v = !0, n.highlightRegion(l, o, a);
                        var c = Math.max(s, .3 * (a - o + 1) | 0);
                        n.setLocation(l, o - c, a + c, t)
                    } else if (0 == f && !v) return t("no match for '" + e + "'")
                }, y = function (t, i) {
                    i.lookup(e, function (i, r) {
                        if (null == i || i.length < 2) return t.featureSource.search(e, g);
                        var n = i[1].split(",")[0];
                        return t.featureSource.search(n, g)
                    })
                };
                if (this.searchEndpoint) return f = 1, this.doDasSearch(n.searchEndpoint, e, g);
                for (var m = 0; m < this.tiers.length; ++m) !function (t) {
                    n.sourceAdapterIsCapable(t.featureSource, "search") ? t.dasSource.trixURI ? (++f, t.trix ? y(t, t.trix) : l(new a(t.dasSource.trixURI), new a(t.dasSource.trixURI + "x"), function (e) {
                        t.trix = e, y(t, e)
                    })) : (++f, t.featureSource.search(e, g)) : t.dasSource.provides_search && (++f, n.doDasSearch(t.dasSource, e, g))
                }(this.tiers[m])
            }
        }, s.prototype.doDasSearch = function (e, t, i) {
            e.features(null, {group: t, type: "transcript"}, function (e) {
                e || (e = []);
                for (var r = [], n = 0; n < e.length; ++n) {
                    var s = e[n];
                    s.label.toLowerCase() == t.toLowerCase() && r.push(s)
                }
                return i(r)
            }, !1)
        }
    }, {"./bin": 4, "./cbrowser": 6, "./trix": 47}],
    31: [function (e, t, i) {
        "use strict";

        function r(e, t) {
            function i(e) {
                return f[e % f.length] * Math.pow(10, e / f.length | 0)
            }

            t || (t = p);
            for (var r = f.length; e * i(r) < t;) ++r;
            return i(r)
        }

        function n(e, t) {
            var i = e.viewport.getContext("2d"), r = e.browser.retina && window.devicePixelRatio > 1,
                n = e.browser.featurePanelWidth + 2e3;
            r && (n *= 2);
            var o = 0 | e.viewport.width;
            n - 50 > o && (e.viewport.width = o = n);
            var a = 50;
            t && t.seq && (a += 25);
            var l = a;
            r && (l *= 2), e.viewport.height = l, e.viewport.style.height = "" + a + "px", e.viewport.style.width = r ? "" + o / 2 + "px" : "" + o + "px", e.layoutHeight = a, e.updateHeight(), e.background && (i.fillStyle = e.background, i.fillRect(0, 0, o, e.viewport.height)), r && i.scale(2, 2), i.translate(1e3, 0), s(e, t, i), e.norigin = e.browser.viewStart, e.viewportHolder.style.left = "-1000px"
        }

        function s(e, t, i) {
            var n = e.browser.scale, s = e.browser.viewStart - 1e3 / n | 0, o = e.browser.viewEnd + 2e3 / n,
                a = e.browser.currentSeqMax, h = o;
            a > 0 && o > a && (h = a);
            for (var u = r(n), c = Math.max(0, (s / u | 0) * u), d = e.browser.viewStart; h >= c;) i.fillStyle = c / u % 2 == 0 ? "white" : "black", i.strokeStyle = "black", i.fillRect((c - d) * n, 8, u * n, 3), i.strokeRect((c - d) * n, 8, u * n, 3), i.fillStyle = "black", i.fillText(l(c), (c - d) * n, 22), c += u;
            if (t && t.seq) for (var p = s; o >= p; ++p) if (p >= t.start && p <= t.end) {
                var f = t.seq.substr(p - t.start, 1).toUpperCase(), v = e.browser.baseColors[f];
                if (v || (v = "gray"), i.fillStyle = v, n >= 8) {
                    var g = i.measureText(f).width;
                    i.fillText(f, (p - d) * n + .5 * (n - g), 52)
                } else i.fillRect((p - d) * n, 42, n, 12)
            }
        }

        function o(e, t) {
            var i = e.browser.scale, n = e.browser.viewStart - 1e3 / i | 0, s = e.browser.viewEnd + 2e3 / i,
                o = e.browser.currentSeqMax, a = (0 | e.viewport.width, s);
            o > 0 && s > o && (a = o);
            for (var u = r(i), d = Math.max(0, (n / u | 0) * u), p = e.browser.viewStart, f = h(c, "g", [], {fontSize: "8pt"}); a >= d;) f.appendChild(h(c, "rect", null, {
                x: (d - p) * i,
                y: 8,
                width: u * i,
                height: 3,
                fill: d / u % 2 == 0 ? "white" : "black",
                stroke: "black"
            })), f.appendChild(h(c, "text", l(d), {x: (d - p) * i, y: 28, fill: "black", stroke: "none"})), d += u;
            if (t && t.seq) for (var v = n; s >= v; ++v) if (v >= t.start && v <= t.end) {
                var g = t.seq.substr(v - t.start, 1).toUpperCase(), y = e.browser.baseColors[g];
                y || (y = "gray"), i >= 8 ? f.appendChild(h(c, "text", g, {
                    x: (.5 + v - p) * i,
                    y: 52,
                    textAnchor: "middle",
                    fill: y
                })) : f.appendChild(h(c, "rect", null, {x: (v - p) * i, y: 42, width: i, height: 12, fill: y}))
            }
            return f
        }

        if ("undefined" != typeof e) var a = e("./utils"), l = a.formatLongInt, h = a.makeElementNS,
            u = e("./svg-utils"), c = u.NS_SVG, d = (u.NS_XLINK, u.SVGPath, e("./numformats")), l = d.formatLongInt;
        var p = 100, f = [1, 2, 5], c = "http://www.w3.org/2000/svg";
        "undefined" != typeof t && (t.exports = {drawSeqTier: n, drawSeqTierGC: s, svgSeqTier: o})
    }, {"./numformats": 26, "./svg-utils": 39, "./utils": 49}],
    32: [function (e, t, i) {
        "use strict";
        if ("undefined" != typeof e) var r = e("./cbrowser"), n = r.Browser, s = e("./sourcecompare"),
            o = s.sourceDataURI, a = s.sourcesAreEqual, l = e("./version"), h = e("./utils"), u = h.miniJSONify,
            c = e("./sha1"), d = c.hex_sha1;
        n.prototype.nukeStatus = function () {
            delete localStorage["dalliance." + this.cookieKey + ".view-chr"], delete localStorage["dalliance." + this.cookieKey + ".view-start"], delete localStorage["dalliance." + this.cookieKey + ".view-end"], delete localStorage["dalliance." + this.cookieKey + ".current-seq-length"], delete localStorage["dalliance." + this.cookieKey + ".showing-alt-zoom"], delete localStorage["dalliance." + this.cookieKey + ".saved-zoom"], delete localStorage["dalliance." + this.cookieKey + ".sources"], delete localStorage["dalliance." + this.cookieKey + ".hubs"], delete localStorage["dalliance." + this.cookieKey + ".version"], delete localStorage["dalliance." + this.cookieKey + ".reverse-scrolling"], delete localStorage["dalliance." + this.cookieKey + ".reverse-key-scrolling"], delete localStorage["dalliance." + this.cookieKey + ".ruler-location"]
        }, n.prototype.storeStatus = function () {
            this.storeViewStatus(), this.storeTierStatus()
        }, n.prototype.storeViewStatus = function () {
            !this.cookieKey || this.noPersist || this.noPersistView || (localStorage["dalliance." + this.cookieKey + ".view-chr"] = this.chr, localStorage["dalliance." + this.cookieKey + ".view-start"] = 0 | this.viewStart, localStorage["dalliance." + this.cookieKey + ".view-end"] = 0 | this.viewEnd, localStorage["dalliance." + this.cookieKey + ".showing-alt-zoom"] = "" + this.isSnapZooming, localStorage["dalliance." + this.cookieKey + ".saved-zoom"] = this.savedZoom, this.currentSeqMax && (localStorage["dalliance." + this.cookieKey + ".current-seq-length"] = this.currentSeqMax))
        }, n.prototype.storeTierStatus = function () {
            if (this.cookieKey && !this.noPersist) {
                for (var e = [], t = 0; t < this.tiers.length; ++t) {
                    var i = this.tiers[t], r = i.dasSource;
                    r.noPersist || e.push({source: i.dasSource, config: i.config || {}})
                }
                localStorage["dalliance." + this.cookieKey + ".sources"] = JSON.stringify(e);
                for (var n = {}, s = [], o = 0; o < this.hubObjects.length; ++o) {
                    var a = this.hubObjects[o], h = {url: a.hub.url, genome: a.genome};
                    a.credentials && (h.credentials = a.credentials), a.mapping && (h.mapping = a.mapping), n[h.url] = !0, s.push(h)
                }
                for (var o = 0; o < this.hubs.length; ++o) {
                    var h = this.hubs[o];
                    "string" == typeof h && (h = {url: h}), n[h.url] || s.push(h)
                }
                localStorage["dalliance." + this.cookieKey + ".hubs"] = JSON.stringify(s), localStorage["dalliance." + this.cookieKey + ".reverse-scrolling"] = this.reverseScrolling, localStorage["dalliance." + this.cookieKey + ".reverse-key-scrolling"] = this.reverseKeyScrolling, localStorage["dalliance." + this.cookieKey + ".single-base-highlight"] = this.singleBaseHighlight, localStorage["dalliance." + this.cookieKey + ".ruler-location"] = this.rulerLocation, localStorage["dalliance." + this.cookieKey + ".export-ruler"] = this.exportRuler, localStorage["dalliance." + this.cookieKey + ".export-highlights"] = this.exportHighlights, localStorage["dalliance." + this.cookieKey + ".version"] = l.CONFIG
            }
        }, n.prototype.restoreStatus = function () {
            if (!this.noPersist) {
                var e = localStorage["dalliance." + this.cookieKey + ".version"];
                if (e = e ? 0 | e : -100, l.CONFIG == e) {
                    var t = localStorage["dalliance." + this.cookieKey + ".configHash"] || "",
                        i = d(u({sources: this.sources, hubs: this.hubs}));
                    if (i != t) return void(localStorage["dalliance." + this.cookieKey + ".configHash"] = i);
                    for (var r = {}, n = 0; n < this.sources.length; ++n) {
                        var s = this.sources[n];
                        if (s) {
                            var h = o(s), c = r[h];
                            c || (r[h] = c = []), c.push(s)
                        }
                    }
                    if (!this.noPersistView) {
                        var p = localStorage["dalliance." + this.cookieKey + ".view-chr"],
                            f = 0 | localStorage["dalliance." + this.cookieKey + ".view-start"],
                            v = 0 | localStorage["dalliance." + this.cookieKey + ".view-end"];
                        if (p && f && v) {
                            this.chr = p, this.viewStart = f, this.viewEnd = v;
                            var g = localStorage["dalliance." + this.cookieKey + ".current-seq-length"];
                            g && (this.currentSeqMax = 0 | g), this.isSnapZooming = "true" == localStorage["dalliance." + this.cookieKey + ".showing-alt-zoom"];
                            var y = parseFloat(localStorage["dalliance." + this.cookieKey + ".saved-zoom"]);
                            "number" != typeof y || isNaN(y) || (this.savedZoom = y)
                        }
                    }
                    var m = localStorage["dalliance." + this.cookieKey + ".reverse-scrolling"];
                    this.reverseScrolling = m && "true" == m;
                    var b = localStorage["dalliance." + this.cookieKey + ".reverse-key-scrolling"];
                    this.reverseKeyScrolling = b && "true" == b;
                    var w = localStorage["dalliance." + this.cookieKey + ".single-base-highlight"];
                    this.singleBaseHighlight = w && "true" == w;
                    var x = localStorage["dalliance." + this.cookieKey + ".ruler-location"];
                    x && (this.rulerLocation = x);
                    var S = localStorage["dalliance." + this.cookieKey + ".export-ruler"];
                    S && (this.exportRuler = "true" === S);
                    var S = localStorage["dalliance." + this.cookieKey + ".export-highlights"];
                    S && (this.exportHighlights = "true" === S);
                    var _ = localStorage["dalliance." + this.cookieKey + ".sources"];
                    if (_) {
                        var C = JSON.parse(_);
                        this.sources = [], this.restoredConfigs = [];
                        for (var n = 0; n < C.length; ++n) {
                            var s = this.sources[n] = C[n].source;
                            this.restoredConfigs[n] = C[n].config;
                            for (var h = o(s), c = r[h] || [], T = 0; T < c.length; ++T) {
                                var k = c[T];
                                if (a(s, k)) for (var L in k) k.hasOwnProperty(L) && ("function" == typeof k[L] || k[L] instanceof Blob) && (s[L] = k[L])
                            }
                        }
                    }
                    var A = localStorage["dalliance." + this.cookieKey + ".hubs"];
                    return A && (this.hubs = JSON.parse(A)), !0
                }
            }
        }, n.prototype.reset = function () {
            for (var e = this.tiers.length - 1; e >= 0; --e) this.removeTier({index: e}, !0);
            for (var e = 0; e < this.defaultSources.length; ++e) {
                var t = this.defaultSources[e];
                t.disabled || this.addTier(this.defaultSources[e])
            }
            this.highlights.splice(0, this.highlights.length), this.setLocation(this.defaultChr, this.defaultStart, this.defaultEnd)
        }
    }, {"./cbrowser": 6, "./sha1": 33, "./sourcecompare": 35, "./utils": 49, "./version": 51}],
    33: [function (e, t, i) {
        "use strict";

        function r(e) {
            return o(s(l(e)))
        }

        function n(e) {
            return a(s(l(e)))
        }

        function s(e) {
            return u(c(h(e), 8 * e.length))
        }

        function o(e) {
            for (var t, i = g ? "0123456789ABCDEF" : "0123456789abcdef", r = "", n = 0; n < e.length; n++) t = e.charCodeAt(n), r += i.charAt(t >>> 4 & 15) + i.charAt(15 & t);
            return r
        }

        function a(e) {
            for (var t = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", i = "", r = e.length, n = 0; r > n; n += 3) for (var s = e.charCodeAt(n) << 16 | (r > n + 1 ? e.charCodeAt(n + 1) << 8 : 0) | (r > n + 2 ? e.charCodeAt(n + 2) : 0), o = 0; 4 > o; o++) i += 8 * n + 6 * o > 8 * e.length ? y : t.charAt(s >>> 6 * (3 - o) & 63);
            return i
        }

        function l(e) {
            for (var t, i, r = "", n = -1; ++n < e.length;) t = e.charCodeAt(n), i = n + 1 < e.length ? e.charCodeAt(n + 1) : 0, t >= 55296 && 56319 >= t && i >= 56320 && 57343 >= i && (t = 65536 + ((1023 & t) << 10) + (1023 & i), n++), 127 >= t ? r += String.fromCharCode(t) : 2047 >= t ? r += String.fromCharCode(192 | t >>> 6 & 31, 128 | 63 & t) : 65535 >= t ? r += String.fromCharCode(224 | t >>> 12 & 15, 128 | t >>> 6 & 63, 128 | 63 & t) : 2097151 >= t && (r += String.fromCharCode(240 | t >>> 18 & 7, 128 | t >>> 12 & 63, 128 | t >>> 6 & 63, 128 | 63 & t));
            return r
        }

        function h(e) {
            for (var t = Array(e.length >> 2), i = 0; i < t.length; i++) t[i] = 0;
            for (var i = 0; i < 8 * e.length; i += 8) t[i >> 5] |= (255 & e.charCodeAt(i / 8)) << 24 - i % 32;
            return t
        }

        function u(e) {
            for (var t = "", i = 0; i < 32 * e.length; i += 8) t += String.fromCharCode(e[i >> 5] >>> 24 - i % 32 & 255);
            return t
        }

        function c(e, t) {
            e[t >> 5] |= 128 << 24 - t % 32, e[(t + 64 >> 9 << 4) + 15] = t;
            for (var i = Array(80), r = 1732584193, n = -271733879, s = -1732584194, o = 271733878, a = -1009589776, l = 0; l < e.length; l += 16) {
                for (var h = r, u = n, c = s, g = o, y = a, m = 0; 80 > m; m++) {
                    16 > m ? i[m] = e[l + m] : i[m] = v(i[m - 3] ^ i[m - 8] ^ i[m - 14] ^ i[m - 16], 1);
                    var b = f(f(v(r, 5), d(m, n, s, o)), f(f(a, i[m]), p(m)));
                    a = o, o = s, s = v(n, 30), n = r, r = b
                }
                r = f(r, h), n = f(n, u), s = f(s, c), o = f(o, g), a = f(a, y)
            }
            return Array(r, n, s, o, a)
        }

        function d(e, t, i, r) {
            return 20 > e ? t & i | ~t & r : 40 > e ? t ^ i ^ r : 60 > e ? t & i | t & r | i & r : t ^ i ^ r
        }

        function p(e) {
            return 20 > e ? 1518500249 : 40 > e ? 1859775393 : 60 > e ? -1894007588 : -899497514
        }

        function f(e, t) {
            var i = (65535 & e) + (65535 & t), r = (e >> 16) + (t >> 16) + (i >> 16);
            return r << 16 | 65535 & i
        }

        function v(e, t) {
            return e << t | e >>> 32 - t
        }

        var g = 0, y = "";
        "undefined" != typeof t && (t.exports = {b64_sha1: n, hex_sha1: r})
    }, {}],
    34: [function (e, t, i) {
        "use strict";

        function r(e, t) {
            ie[e] = t
        }

        function n(e, t) {
            re[e] = t
        }

        function s(e) {
            return re[e] ? re[e](e) : void 0
        }

        function o(e) {
            var t = this;
            this.source = e, this.cfsid = "cfs" + ++ne, e.name && (this.name = e.name), e.addChangeListener && e.addChangeListener(function () {
                t.cfsid = "cfs" + ++ne
            })
        }

        function a() {
            this.busy = 0, this.activityListeners = [], this.readinessListeners = [], this.readiness = null
        }

        function l(e) {
            this.dasSource = new B(e), this.busy = 0, this.activityListeners = []
        }

        function h(e) {
            this.dasSource = new B(e), this.awaitedEntryPoints = new T;
            var t = this;
            this.dasSource.entryPoints(function (e) {
                t.awaitedEntryPoints.provide(e)
            })
        }

        function u(e) {
            var t = this;
            this.source = e, this.twoBit = new T;
            var i;
            if (e.twoBitURI) i = new N(e.twoBitURI); else {
                if (!e.twoBitBlob) throw Error("No twoBitURI or twoBitBlob parameter");
                i = new G(e.twoBitBlob)
            }
            q(i, function (e, i) {
                i ? console.log(i) : t.twoBit.provide(e)
            })
        }

        function c(e) {
            a.call(this);
            var t = this;
            if (this.readiness = "Connecting", this.bwgSource = this.opts = e, t.bwgHolder = new T, this.opts.preflight) {
                var i = se[this.opts.preflight];
                if (!i) {
                    i = new T, se[this.opts.preflight] = i;
                    var r = new XMLHttpRequest;
                    r.onreadystatechange = function () {
                        4 == r.readyState && (200 == r.status ? i.provide("success") : i.provide("failure"))
                    }, r.open("get", this.opts.preflight + "?" + hex_sha1("salt" + Date.now()), !0), this.opts.credentials && (r.withCredentials = !0), r.send("")
                }
                i.await(function (e) {
                    "success" === e && t.init()
                })
            } else t.init()
        }

        function d(e, t) {
            a.call(this);
            this.worker = t, this.readiness = "Connecting", this.bwgSource = this.opts = e, this.keyHolder = new T, this.init()
        }

        function p(e, t) {
            if (!(e.flag & X.SEGMENT_UNMAPPED)) {
                var i;
                if (i = e.seq ? e.seq.length : e.seqLength, e.cigar) {
                    i = 0;
                    for (var r = Q(e.cigar), n = 0; n < r.length; ++n) {
                        var s = r[n];
                        ("M" == s.op || "D" == s.op) && (i += s.cnt)
                    }
                }
                var o = new I;
                return o.min = e.pos + 1, o.max = e.pos + i, o.segment = e.segment, o.type = "bam", o.id = e.readName, o.notes = ["MQ=" + e.mq], o.cigar = e.cigar, o.seq = e.seq, o.quals = e.quals, o.orientation = e.flag & X.REVERSE_COMPLEMENT ? "-" : "+", o.bamRecord = e, t && e.flag & X.MULTIPLE_SEGMENTS && (o.groups = [{
                    id: e.readName,
                    type: "readpair"
                }]), o
            }
        }

        function f(e) {
            a.call(this);
            var t = this;
            if (this.bamSource = e, this.opts = {
                credentials: e.credentials,
                preflight: e.preflight,
                bamGroup: e.bamGroup
            }, this.bamHolder = new T, this.opts.preflight) {
                var i = se[this.opts.preflight];
                if (!i) {
                    i = new T, se[this.opts.preflight] = i;
                    var r = new XMLHttpRequest;
                    r.onreadystatechange = function () {
                        4 == r.readyState && (200 == r.status ? i.provide("success") : i.provide("failure"))
                    }, r.open("get", this.opts.preflight + "?" + hex_sha1("salt" + Date.now()), !0), this.opts.credentials && (r.withCredentials = "true"), r.send("")
                }
                i.await(function (e) {
                    "success" === e && t.init()
                })
            } else t.init()
        }

        function v(e, t) {
            a.call(this);
            this.bamSource = e, this.worker = t, this.opts = {
                credentials: e.credentials,
                preflight: e.preflight,
                bamGroup: e.bamGroup
            }, this.keyHolder = new T, this.init()
        }

        function g(e, t) {
            this.source = e, this.mapping = t, this.activityListeners = [], this.busy = 0
        }

        function y() {
        }

        function m() {
        }

        function b(e) {
            this.store = new $(e.jbURI, e.jbQuery)
        }

        if ("undefined" != typeof e) var w = e("./cbrowser"), x = w.Browser, S = e("./tier"), _ = S.DasTier,
            C = e("./utils"), T = C.Awaited, k = C.arrayIndexOf, L = C.shallowCopy, A = C.resolveUrlToPage,
            O = e("./das"), E = O.DASStylesheet, R = O.DASStyle, B = O.DASSource, M = O.DASSegment, I = O.DASFeature,
            H = O.DASSequence, P = O.DASLink, F = e("./bin"), N = F.URLFetchable, G = F.BlobFetchable,
            D = e("./twoBit"), q = D.makeTwoBit, U = e("./bigwig"), z = U.makeBwg, W = e("./bam"), V = W.makeBam,
            X = W.BamFlags, j = e("./spans"), K = j.Range, Z = j.union, Q = e("./cigar").parseCigar,
            Y = e("./overlay").OverlayFeatureSource, $ = e("./jbjson").JBrowseStore, J = e("./chainset").Chainset,
            ee = e("./style"), te = (ee.StyleFilterSet, e("./encode").EncodeFetchable);
        var ie = {}, re = {};
        _.prototype.initSources = function () {
            var e = this, t = this.browser.createSources(this.dasSource);
            this.featureSource = t.features || new y, this.sequenceSource = t.sequence, this.featureSource && this.featureSource.addChangeListener && this.featureSource.addChangeListener(function () {
                e.browser.refreshTier(e)
            })
        }, x.prototype.createSources = function (e) {
            var t = this.sourceCache.get(e);
            if (t) return t;
            var i, r;
            if ("sequence" == e.tier_type || e.twoBitURI || e.twoBitBlob) r = e.twoBitURI || e.twoBitBlob ? new u(e) : new h(e); else if (e.tier_type && ie[e.tier_type]) {
                var n = ie[e.tier_type], s = n(e);
                i = s.features, r = s.sequence
            } else if (e.bwgURI || e.bwgBlob) {
                var a = this.getWorker();
                i = a ? new d(e, a) : new c(e)
            } else if (e.bamURI || e.bamBlob) {
                var a = this.getWorker();
                i = a ? new v(e, a) : new f(e)
            } else e.jbURI ? i = new b(e) : (e.uri || e.features_uri) && (i = new l(e));
            if (e.overlay) {
                var t = [];
                i && t.push(new o(i));
                for (var p = 0; p < e.overlay.length; ++p) {
                    var y = this.createSources(e.overlay[p]);
                    y && y.features && t.push(y.features)
                }
                i = new Y(t, e)
            }
            return e.sequenceAliases && (i = new g(i, new J({
                type: "alias",
                sequenceAliases: e.sequenceAliases
            }))), e.mapping && (i = new g(i, this.chains[e.mapping])), e.name && i && !i.name && (i.name = e.name), null != i && (i = new o(i)), (null != i || null != r) && (t = {
                features: i,
                sequence: r
            }, this.sourceCache.put(e, t)), t
        }, _.prototype.fetchStylesheet = function (e) {
            var t;
            t = !this.dasSource.stylesheet_uri && (this.dasSource.tier_type || this.dasSource.bwgURI || this.dasSource.bwgBlob || this.dasSource.bamURI || this.dasSource.bamBlob || this.dasSource.twoBitURI || this.dasSource.twoBitBlob || this.dasSource.jbURI || this.dasSource.overlay) ? this.getSource() : new l(this.dasSource), t.getStyleSheet(e)
        };
        var ne = 0;
        o.prototype.addReadinessListener = function (e) {
            return this.source.addReadinessListener ? this.source.addReadinessListener(e) : void e(null)
        }, o.prototype.removeReadinessListener = function (e) {
            return this.source.removeReadinessListener ? this.source.removeReadinessListener(e) : void 0
        }, o.prototype.search = function (e, t) {
            return this.source.search ? this.source.search(e, t) : void 0
        }, o.prototype.getDefaultFIPs = function (e) {
            return this.source.getDefaultFIPs ? this.source.getDefaultFIPs(e) : void 0
        }, o.prototype.getStyleSheet = function (e) {
            this.source.getStyleSheet(e)
        }, o.prototype.getScales = function () {
            return this.source.getScales()
        }, o.prototype.addActivityListener = function (e) {
            this.source.addActivityListener && this.source.addActivityListener(e)
        }, o.prototype.removeActivityListener = function (e) {
            this.source.removeActivityListener && this.source.removeActivityListener(e)
        }, o.prototype.addChangeListener = function (e) {
            this.source.addChangeListener && this.source.addChangeListener(e)
        }, o.prototype.removeChangeListener = function (e) {
            this.source.removeChangeListener && this.source.removeChangeListener(e)
        }, o.prototype.findNextFeature = function (e, t, i, r) {
            this.source.findNextFeature(e, t, i, r)
        }, o.prototype.quantFindNextFeature = function (e, t, i, r, n) {
            this.source.quantFindNextFeature(e, t, i, r, n)
        }, o.prototype.capabilities = function () {
            return this.source.capabilities ? this.source.capabilities() : {}
        }, o.prototype.fetch = function (e, t, i, r, n, s, o, a) {
            if (!s) throw Error("Fetch pool is null");
            var l = this, h = this.cfsid, u = s.awaitedFeatures[h];
            if (u && u.started) {
                if (u.styleFilters.doesNotContain(a)) return void l.source.fetch(e, t, i, r, n, s, o, a)
            } else u ? u.styleFilters.addAll(a) : (u = new T, u.styleFilters = a, s.awaitedFeatures[h] = u, s.requestsIssued.then(function () {
                u.started = !0, l.source.fetch(e, t, i, r, u.styleFilters.typeList(), s, function (e, t, i, r) {
                    u.res || u.provide({status: e, features: t, scale: i, coverage: r})
                }, u.styleFilters)
            })["catch"](function (e) {
                console.log(e)
            }));
            u.await(function (e) {
                o(e.status, e.features, e.scale, e.coverage)
            })
        }, a.prototype.addReadinessListener = function (e) {
            this.readinessListeners.push(e), e(this.readiness)
        }, a.prototype.removeReadinessListener = function (e) {
            var t = k(this.readinessListeners, e);
            t >= 0 && this.readinessListeners.splice(t, 1)
        }, a.prototype.notifyReadiness = function () {
            for (var e = 0; e < this.readinessListeners.length; ++e) try {
                this.readinessListeners[e](this.readiness)
            } catch (t) {
                console.log(t)
            }
        }, a.prototype.addActivityListener = function (e) {
            this.activityListeners.push(e)
        }, a.prototype.removeActivityListener = function (e) {
            var t = k(this.activityListeners, e);
            t >= 0 && this.activityListeners.splice(t, 1)
        }, a.prototype.notifyActivity = function () {
            for (var e = 0; e < this.activityListeners.length; ++e) try {
                this.activityListeners[e](this.busy)
            } catch (t) {
                console.log(t)
            }
        }, a.prototype.getScales = function () {
            return null
        }, a.prototype.fetch = function (e, t, i, r, n, s, o) {
            return o(null, [], 1e9)
        }, a.prototype.getStyleSheet = function (e) {
            var t = new E, i = new R;
            return i.glyph = "BOX", i.BGCOLOR = "blue", i.FGCOLOR = "black", t.pushStyle({type: "default"}, null, i), e(t)
        }, l.prototype.addActivityListener = function (e) {
            this.activityListeners.push(e)
        }, l.prototype.removeActivityListener = function (e) {
            var t = k(this.activityListeners, e);
            t >= 0 && this.activityListeners.splice(t, 1)
        }, l.prototype.notifyActivity = function () {
            for (var e = 0; e < this.activityListeners.length; ++e) try {
                this.activityListeners[e](this.busy)
            } catch (t) {
                console.log(t)
            }
        }, l.prototype.getStyleSheet = function (e) {
            this.dasSource.stylesheet(function (t) {
                e(t)
            }, function () {
                e(null, "Couldn't fetch DAS stylesheet")
            })
        }, l.prototype.fetch = function (e, t, i, r, n, s, o) {
            if (n && 0 == n.length) return void o(null, [], r);
            if (this.dasSource.uri || this.dasSource.features_uri) {
                if (this.dasSource.dasStaticFeatures && this.cachedStaticFeatures) return o(null, this.cachedStaticFeatures, this.cachedStaticScale);
                var a = this.dasSource.maxbins !== !1, l = {type: n};
                a && (l.maxbins = 1 + ((i - t) / r | 0));
                var h = this;
                h.busy++, h.notifyActivity(), this.dasSource.features(new M(e, t, i), l, function (e, t) {
                    h.busy--, h.notifyActivity();
                    var i = r;
                    a || (i = .1), !t && h.dasSource.dasStaticFeatures && (h.cachedStaticFeatures = e, h.cachedStaticScale = i), o(t, e, i)
                })
            }
        }, l.prototype.findNextFeature = this.sourceFindNextFeature = function (e, t, i, r) {
            if (this.dasSource.capabilities && k(this.dasSource.capabilities, "das1:adjacent-feature") >= 0) {
                var n = this;
                if (this.dasAdjLock) return console.log("Already looking for a next feature, be patient!");
                this.dasAdjLock = !0;
                var s = {adjacent: e + ":" + (0 | t) + ":" + (i > 0 ? "F" : "B")},
                    o = thisTier.getDesiredTypes(thisTier.browser.scale);
                o && (s.types = o), thisTier.dasSource.features(null, s, function (e) {
                    n.dasAdjLock = !1, e.length > 0 && null != e[0] && r(e[0])
                })
            }
        }, h.prototype.fetch = function (e, t, i, r, n) {
            this.dasSource.sequence(new M(e, t, i), function (e) {
                return 1 == e.length ? n(null, e[0]) : n("Didn't get sequence")
            })
        }, h.prototype.getSeqInfo = function (e, t) {
            this.awaitedEntryPoints.await(function (i) {
                for (var r = 0; r < i.length; ++r) if (i[r].name == e) return t({length: i[r].end});
                return t()
            })
        }, u.prototype.fetch = function (e, t, i, r, n) {
            this.twoBit.await(function (r) {
                r.fetch(e, t, i, function (r, s) {
                    if (s) return n(s, null);
                    var o = new H(e, t, i, "DNA", r);
                    return n(null, o)
                })
            })
        }, u.prototype.getSeqInfo = function (e, t) {
            this.twoBit.await(function (i) {
                var r = i.getSeq(e);
                r ? i.getSeq(e).length(function (e) {
                    t({length: e})
                }) : t()
            })
        }, l.prototype.getScales = function () {
            return []
        };
        var se = {};
        c.prototype = Object.create(a.prototype), c.prototype.init = function () {
            var e, t = this, i = this.bwgSource.uri || this.bwgSource.bwgURI;
            e = i ? "encode" === this.bwgSource.transport ? new te(i, {credentials: this.opts.credentials}) : new N(i, {credentials: this.opts.credentials}) : new G(this.bwgSource.bwgBlob), z(e, function (e, i) {
                i ? (t.error = i, t.readiness = null, t.notifyReadiness(), t.bwgHolder.provide(null)) : (t.bwgHolder.provide(e), t.readiness = null, t.notifyReadiness(), "bigbed" == e.type && e.getExtraIndices(function (e) {
                    t.extraIndices = e
                }))
            })
        }, c.prototype.capabilities = function () {
            var e = {leap: !0};
            if (this.bwgHolder.res && "bigwig" == this.bwgHolder.res.type && (e.quantLeap = !0), this.extraIndices && this.extraIndices.length > 0) {
                e.search = [];
                for (var t = 0; t < this.extraIndices.length; ++t) e.search.push(this.extraIndices[t].field)
            }
            return e
        }, c.prototype.fetch = function (e, t, i, r, n, s, o) {
            var a = this;
            this.bwgHolder.await(function (s) {
                if (null == s) return o(a.error || "Can't access binary file", null, null);
                var l, h = !n || 0 == n.length || k(n, "density") >= 0;
                a.opts.clientBin && (h = !1);
                var u = a.opts.scaleFactor || 1;
                if ("bigwig" == s.type || h || "undefined" != typeof a.opts.forceReduction) {
                    for (var c = -1, d = 0; d < s.zoomLevels.length && s.zoomLevels[d].reduction <= r * u; ++d) c = d;
                    "undefined" != typeof a.opts.forceReduction && (c = a.opts.forceReduction), l = 0 > c ? s.getUnzoomedView() : s.getZoomedView(c)
                } else l = s.getUnzoomedView();
                a.busy++, a.notifyActivity(), l.readWigData(e, t, i, function (e) {
                    a.busy--, a.notifyActivity();
                    var r = 1e9;
                    if ("bigwig" === s.type) {
                        var n = (i - t) / e.length / 2;
                        r > n && (r = n)
                    }
                    if (a.opts.link) for (var l = 0; l < e.length; ++l) {
                        var h = e[l];
                        h.label && (h.links = [new P("Link", a.opts.link.replace(/\$\$/, h.label))])
                    }
                    o(null, e, r)
                })
            })
        }, c.prototype.quantFindNextFeature = function (e, t, i, r, n) {
            var s = this;
            s.busy++, s.notifyActivity(), this.bwgHolder.res.thresholdSearch(e, t, i, r, function (e, t) {
                return s.busy--, s.notifyActivity(), n(e, t)
            })
        }, c.prototype.findNextFeature = function (e, t, i, r) {
            var n = this;
            n.busy++, n.notifyActivity(), this.bwgHolder.res.getUnzoomedView().getFirstAdjacent(e, t, i, function (e) {
                n.busy--, n.notifyActivity(), e.length > 0 && null != e[0] && r(e[0])
            })
        }, c.prototype.getScales = function () {
            var e = this.bwgHolder.res;
            if (e) {
                for (var t = [1], i = 0; i < e.zoomLevels.length; ++i) t.push(e.zoomLevels[i].reduction);
                return t
            }
            return null
        }, c.prototype.search = function (e, t) {
            if (!this.extraIndices || 0 == this.extraIndices.length) return t(null, "No indices available");
            var i = this.extraIndices[0];
            return i.lookup(e, t)
        }, c.prototype.getDefaultFIPs = function (e) {
            return this.opts.noExtraFeatureInfo ? !0 : void this.bwgHolder.await(function (t) {
                if (t && t.schema && t.definedFieldCount < t.schema.fields.length) {
                    var i = function (e, i) {
                        for (var r = 0; r < i.hit.length; ++r) if (i.hit[r].isSuperGroup) return;
                        for (var n = t.definedFieldCount; n < t.schema.fields.length; ++n) {
                            var s = t.schema.fields[n];
                            i.add(s.comment, e[s.name])
                        }
                    };
                    e(i)
                }
            })
        }, c.prototype.getStyleSheet = function (e) {
            this.bwgHolder.await(function (t) {
                if (!t) return e(null, "bbi error");
                var i = new E;
                if ("bigbed" == t.type) {
                    var r = new R;
                    r.glyph = "BOX", r.FGCOLOR = "black", r.BGCOLOR = "blue", r.HEIGHT = 8, r.BUMP = !0, r.LABEL = !0, r.ZINDEX = 20, i.pushStyle({type: "bigbed"}, null, r), r.glyph = "BOX", r.FGCOLOR = "black", r.BGCOLOR = "red", r.HEIGHT = 10, r.BUMP = !0, r.ZINDEX = 20, i.pushStyle({type: "translation"}, null, r);
                    var n = new R;
                    n.glyph = "BOX", n.FGCOLOR = "black", n.BGCOLOR = "white", n.HEIGHT = 10, n.ZINDEX = 10, n.BUMP = !0, n.LABEL = !0, i.pushStyle({type: "transcript"}, null, n);
                    var s = new R;
                    s.glyph = "HISTOGRAM", s.COLOR1 = "white", s.COLOR2 = "black", s.HEIGHT = 30, i.pushStyle({type: "density"}, null, s)
                } else {
                    var r = new R;
                    r.glyph = "HISTOGRAM", r.COLOR1 = "white", r.COLOR2 = "black", r.HEIGHT = 30, i.pushStyle({type: "default"}, null, r)
                }
                return 12 == t.definedFieldCount && t.fieldCount >= 14 && (i.geneHint = !0), e(i)
            })
        }, d.prototype = Object.create(a.prototype), d.prototype.init = function () {
            var e = this, t = this.uri || this.bwgSource.uri || this.bwgSource.bwgURI,
                i = this.bwgSource.blob || this.bwgSource.bwgBlob, r = function (t, i) {
                    e.readiness = null, e.notifyReadiness(), t ? e.worker.postCommand({
                        command: "meta",
                        connection: t
                    }, function (i, r) {
                        r ? (e.error = r, e.keyHolder.provide(null)) : (e.meta = i, e.keyHolder.provide(t))
                    }) : (e.error = i, e.keyHolder.provide(null))
                };
            i ? this.worker.postCommand({
                command: "connectBBI",
                blob: i
            }, r) : this.worker.postCommand({
                command: "connectBBI",
                uri: A(t),
                transport: this.bwgSource.transport,
                credentials: this.bwgSource.credentials
            }, r)
        }, d.prototype.capabilities = function () {
            var e = {leap: !0};
            if (this.meta && "bigwig" == this.meta.type && (e.quantLeap = !0), this.meta && this.meta.extraIndices && this.meta.extraIndices.length > 0) {
                e.search = [];
                for (var t = 0; t < this.meta.extraIndices.length; ++t) e.search.push(this.meta.extraIndices[t].field)
            }
            return e
        }, d.prototype.fetch = function (e, t, i, r, n, s, o) {
            var a = this;
            a.busy++, a.notifyActivity(), this.keyHolder.await(function (s) {
                if (!s) return a.busy--, a.notifyActivity(), o(a.error || "Can't access binary file", null, null);
                var l = -1, h = !n || 0 == n.length || k(n, "density") >= 0;
                if (a.opts.clientBin && (h = !1), "bigwig" == a.meta.type || h || "undefined" != typeof a.opts.forceReduction) {
                    for (var u = 1; u < a.meta.zoomLevels.length && a.meta.zoomLevels[u] <= r; ++u) l = u - 1;
                    "undefined" != typeof a.opts.forceReduction && (l = a.opts.forceReduction)
                }
                a.worker.postCommand({
                    command: "fetch",
                    connection: s,
                    chr: e,
                    min: t,
                    max: i,
                    zoom: l
                }, function (e, r) {
                    a.busy--, a.notifyActivity();
                    var n = 1e9;
                    if ("bigwig" === a.meta.type) {
                        var s = (i - t) / e.length / 2;
                        n > s && (n = s)
                    }
                    if (a.opts.link) for (var l = 0; l < e.length; ++l) {
                        var h = e[l];
                        h.label && (h.links = [new P("Link", a.opts.link.replace(/\$\$/, h.label))])
                    }
                    o(r, e, n)
                })
            })
        }, d.prototype.quantFindNextFeature = function (e, t, i, r, n) {
            var s = this;
            this.busy++, this.notifyActivity(), this.worker.postCommand({
                command: "quantLeap",
                connection: this.keyHolder.res,
                chr: e,
                pos: t,
                dir: i,
                threshold: r,
                under: !1
            }, function (e, t) {
                return console.log(e, t), s.busy--, s.notifyActivity(), n(e, t)
            })
        }, d.prototype.findNextFeature = function (e, t, i, r) {
            var n = this;
            this.busy++, this.notifyActivity(), this.worker.postCommand({
                command: "leap",
                connection: this.keyHolder.res,
                chr: e,
                pos: t,
                dir: i
            }, function (e, t) {
                n.busy--, n.notifyActivity(), e.length > 0 && null != e[0] && r(e[0])
            })
        }, d.prototype.getScales = function () {
            var e = this.meta;
            return e ? e.zoomLevels : null
        }, d.prototype.search = function (e, t) {
            if (!this.meta.extraIndices || 0 == this.meta.extraIndices.length) return t(null, "No indices available");
            var i = this;
            this.busy++, this.notifyActivity();
            var r = this.meta.extraIndices[0];
            this.worker.postCommand({
                command: "search",
                connection: this.keyHolder.res,
                query: e,
                index: r
            }, function (e, r) {
                i.busy--, i.notifyActivity(), t(e, r)
            })
        }, d.prototype.getDefaultFIPs = function (e) {
            if (this.opts.noExtraFeatureInfo) return !0;
            var t = this;
            this.keyHolder.await(function (i) {
                var r = t.meta;
                if (r && r.schema && r.definedFieldCount < r.schema.fields.length) {
                    var n = function (e, t) {
                        for (var i = 0; i < t.hit.length; ++i) if (t.hit[i].isSuperGroup) return;
                        for (var n = r.definedFieldCount; n < r.schema.fields.length; ++n) {
                            var s = r.schema.fields[n];
                            t.add(s.comment, e[s.name])
                        }
                    };
                    e(n)
                }
            })
        }, d.prototype.getStyleSheet = function (e) {
            var t = this;
            this.keyHolder.await(function (i) {
                var r = t.meta;
                if (!r) return e(null, "bbi error");
                var n = new E;
                if ("bigbed" == r.type) {
                    var s = new R;
                    s.glyph = "BOX", s.FGCOLOR = "black", s.BGCOLOR = "blue", s.HEIGHT = 8, s.BUMP = !0, s.LABEL = !0, s.ZINDEX = 20, n.pushStyle({type: "bigbed"}, null, s), s.glyph = "BOX", s.FGCOLOR = "black", s.BGCOLOR = "red", s.HEIGHT = 10, s.BUMP = !0, s.ZINDEX = 20, n.pushStyle({type: "translation"}, null, s);
                    var o = new R;
                    o.glyph = "BOX", o.FGCOLOR = "black", o.BGCOLOR = "white", o.HEIGHT = 10, o.ZINDEX = 10, o.BUMP = !0, o.LABEL = !0, n.pushStyle({type: "transcript"}, null, o);
                    var a = new R;
                    a.glyph = "HISTOGRAM", a.COLOR1 = "white", a.COLOR2 = "black", a.HEIGHT = 30, n.pushStyle({type: "density"}, null, a)
                } else {
                    var s = new R;
                    s.glyph = "HISTOGRAM", s.COLOR1 = "white", s.COLOR2 = "black", s.HEIGHT = 30, n.pushStyle({type: "default"}, null, s)
                }
                return 12 == r.definedFieldCount && r.fieldCount >= 14 && (n.geneHint = !0), e(n)
            })
        }, f.prototype = Object.create(a.prototype), f.prototype.init = function () {
            var e, t, i = this;
            this.bamSource.bamBlob ? (e = new G(this.bamSource.bamBlob), t = new G(this.bamSource.baiBlob)) : (e = new N(this.bamSource.bamURI, {credentials: this.opts.credentials}), t = new N(this.bamSource.baiURI || this.bamSource.bamURI + ".bai", {credentials: this.opts.credentials})), V(e, t, null, function (e, t) {
                i.readiness = null, i.notifyReadiness(), e ? i.bamHolder.provide(e) : (i.error = t, i.bamHolder.provide(null))
            })
        }, f.prototype.fetch = function (e, t, i, r, n, s, o) {
            var a = n && 1 == n.length && "density" == n[0], l = this;
            l.busy++, l.notifyActivity(), this.bamHolder.await(function (r) {
                return r ? void r.fetch(e, t, i, function (e, t) {
                    if (l.busy--, l.notifyActivity(), t) o(t, null, null); else {
                        for (var i = [], r = 0; r < e.length; ++r) {
                            var n = e[r], s = p(n, l.opts.bamGroup);
                            s && i.push(s)
                        }
                        o(null, i, 1e9)
                    }
                }, {light: a}) : (l.busy--, l.notifyActivity(), o(l.error || "Couldn't fetch BAM"))
            })
        }, f.prototype.getScales = function () {
            return 1e9
        }, f.prototype.getStyleSheet = function (e) {
            this.bamHolder.await(function (t) {
                var i = new E, r = new R;
                r.glyph = "HISTOGRAM", r.COLOR1 = "black", r.COLOR2 = "red", r.HEIGHT = 30, i.pushStyle({type: "density"}, "low", r), i.pushStyle({type: "density"}, "medium", r);
                var n = new R;
                return n.glyph = "__SEQUENCE", n.FGCOLOR = "black", n.BGCOLOR = "blue", n.HEIGHT = 8, n.BUMP = !0, n.LABEL = !1, n.ZINDEX = 20, i.pushStyle({type: "bam"}, "high", n), e(i)
            })
        }, v.prototype = Object.create(a.prototype), v.prototype.init = function () {
            var e = this, t = this.bamSource.uri || this.bamSource.bamURI,
                i = this.bamSource.indexUri || this.bamSource.baiURI || t + ".bai",
                r = this.bamSource.bamBlob || this.bamSource.blob,
                n = this.bamSource.baiBlob || this.bamSource.indexBlob, s = function (t, i) {
                    e.readiness = null, e.notifyReadiness(), t ? e.keyHolder.provide(t) : (e.error = i, e.keyHolder.provide(null))
                };
            r ? this.worker.postCommand({
                command: "connectBAM",
                blob: r,
                indexBlob: n
            }, s) : this.worker.postCommand({
                command: "connectBAM",
                uri: A(t),
                indexUri: A(i),
                credentials: this.bamSource.credentials,
                indexChunks: this.bamSource.indexChunks
            }, s)
        }, v.prototype.fetch = function (e, t, i, r, n, s, o) {
            var a = n && 1 == n.length && "density" == n[0], l = this;
            l.busy++, l.notifyActivity(), this.keyHolder.await(function (r) {
                return r ? void l.worker.postCommand({
                    command: "fetch",
                    connection: r,
                    chr: e,
                    min: t,
                    max: i,
                    opts: {light: a}
                }, function (e, t) {
                    if (l.busy--, l.notifyActivity(), t) o(t, null, null); else {
                        for (var i = [], r = 0; r < e.length; ++r) {
                            var n = e[r], s = p(n, l.opts.bamGroup);
                            s && i.push(s)
                        }
                        o(null, i, 1e9)
                    }
                }) : (l.busy--, l.notifyActivity(), o(l.error || "Couldn't fetch BAM"))
            })
        }, v.prototype.getScales = function () {
            return 1e9
        }, v.prototype.getStyleSheet = function (e) {
            this.keyHolder.await(function (t) {
                var i = new E, r = new R;
                r.glyph = "HISTOGRAM", r.COLOR1 = "black", r.COLOR2 = "red", r.HEIGHT = 30, i.pushStyle({type: "density"}, "low", r), i.pushStyle({type: "density"}, "medium", r);
                var n = new R;
                return n.glyph = "__SEQUENCE", n.FGCOLOR = "black", n.BGCOLOR = "blue", n.HEIGHT = 8, n.BUMP = !0, n.LABEL = !1, n.ZINDEX = 20, i.pushStyle({type: "bam"}, "high", n), e(i)
            })
        }, g.prototype.addActivityListener = function (e) {
            this.activityListeners.push(e)
        }, g.prototype.removeActivityListener = function (e) {
            var t = k(this.activityListeners, e);
            t >= 0 && this.activityListeners.splice(t, 0)
        }, g.prototype.notifyActivity = function () {
            for (var e = 0; e < this.activityListeners.length; ++e) try {
                this.activityListeners[e](this.busy)
            } catch (t) {
                console.log(t)
            }
        }, g.prototype.getStyleSheet = function (e) {
            return this.source.getStyleSheet(e)
        }, g.prototype.getScales = function () {
            return this.source.getScales()
        }, g.prototype.getDefaultFIPs = function (e) {
            return this.source.getDefaultFIPs ? this.source.getDefaultFIPs(e) : void 0
        }, g.prototype.simplifySegments = function (e, t) {
            if (0 == e.length) return e;
            e.sort(function (e, t) {
                var i = e.name - t.name;
                return i ? i : (i = e.start - t.start, i ? i : e.end - t.end)
            });
            for (var i = [], r = e[0], n = 0; n < e.length; ++n) {
                var s = e[n];
                s.name != r.name || s.start > r.end + t ? (i.push(r), r = s) : r = new M(r.name, Math.min(r.start, s.start), Math.max(r.end, s.end))
            }
            return i.push(r), i
        }, g.prototype.fetch = function (e, t, i, r, n, s, o, a) {
            var l = this, h = i - t + 1;
            l.busy++, l.notifyActivity(), this.mapping.sourceBlocksForRange(e, t, i, function (e) {
                if (0 == e.length) l.busy--, l.notifyActivity(), o("No mapping available for this regions", [], r); else {
                    e = l.simplifySegments(e, Math.max(100, .05 * h));
                    var t, i = [], u = null, c = e.length;
                    e.map(function (e) {
                        l.source.fetch(e.name, e.start, e.end, r, n, s, function (r, n, s) {
                            if (r && !t && (t = r), n) for (var a = 0; a < n.length; ++a) {
                                var h = n[a], d = h.segment;
                                0 == d.indexOf("chr") && (d = d.substr(3));
                                var p = l.mapping.mapSegment(d, h.min, h.max);
                                if (0 == p.length) h.parts && h.parts.length > 0 && i.push(h); else for (var f = 0; f < p.length; ++f) {
                                    var v = p[f], g = L(h);
                                    g.segment = v.segment, g.min = v.min, g.max = v.max, v.partialMin && (g.partialMin = v.partialMin), v.partialMax && (g.partialMax = v.partialMax), v.flipped && ("-" == h.orientation ? g.orientation = "+" : "+" == h.orientation && (g.orientation = "-")), i.push(g)
                                }
                            }
                            var y = l.mapping.mapPoint(e.name, e.start), m = l.mapping.mapPoint(e.name, e.end);
                            if (y && m) {
                                var b = new K(y.pos, m.pos);
                                u = u ? Z(u, b) : b
                            }
                            --c, 0 == c && (l.busy--, l.notifyActivity(), o(t, i, s, u))
                        }, a)
                    })
                }
            })
        }, y.prototype.getScales = function () {
            return null
        }, y.prototype.fetch = function (e, t, i, r, n, s, o) {
            return o(null, [], 1e9)
        }, y.prototype.getStyleSheet = function (e) {
            var t = new E, i = new R;
            return i.glyph = "BOX", i.BGCOLOR = "blue", i.FGCOLOR = "black", t.pushStyle({type: "default"}, null, i), e(t)
        }, m.prototype.fetch = function (e, t, i, r, n) {
            return n(null, null)
        }, b.prototype.getScales = function () {
            return null
        }, b.prototype.getStyleSheet = function (e) {
            var t = new E, i = new R;
            return i.glyph = "BOX", i.FGCOLOR = "black", i.BGCOLOR = "green", i.HEIGHT = 8, i.BUMP = !0, i.LABEL = !0, i.ZINDEX = 20, t.pushStyle({type: "default"}, null, i), e(t)
        }, b.prototype.fetch = function (e, t, i, r, n, s, o) {
            if (n && 0 == n.length) return void o(null, [], r);
            var a = {};
            this.store.features(new M(e, t, i), a, function (e, t) {
                o(t, e, 1e5)
            })
        }, x.prototype.sourceAdapterIsCapable = function (e, t) {
            return e.capabilities ? e.capabilities()[t] : !1
        }, "undefined" != typeof t && (t.exports = {
            FeatureSourceBase: a,
            TwoBitSequenceSource: u,
            DASSequenceSource: h,
            MappedFeatureSource: g,
            CachingFeatureSource: o,
            BWGFeatureSource: c,
            RemoteBWGFeatureSource: d,
            BAMFeatureSource: f,
            RemoteBAMFeatureSource: v,
            DummyFeatureSource: y,
            DummySequenceSource: m,
            registerSourceAdapterFactory: r,
            registerParserFactory: n,
            makeParser: s
        }, e("./ensembljson"), e("./tabix-source"), e("./memstore"), e("./bedwig"), e("./vcf"))
    }, {
        "./bam": 1,
        "./bedwig": 2,
        "./bigwig": 3,
        "./bin": 4,
        "./cbrowser": 6,
        "./chainset": 7,
        "./cigar": 8,
        "./das": 10,
        "./encode": 12,
        "./ensembljson": 13,
        "./jbjson": 22,
        "./memstore": 25,
        "./overlay": 27,
        "./spans": 36,
        "./style": 37,
        "./tabix-source": 40,
        "./tier": 45,
        "./twoBit": 48,
        "./utils": 49,
        "./vcf": 50
    }],
    35: [function (e, t, i) {
        function r(e) {
            return e.uri ? e.uri : e.blob ? "file:" + e.blob.name : e.bwgBlob ? "file:" + e.bwgBlob.name : e.bamBlob ? "file:" + e.bamBlob.name : e.twoBitBlob ? "file:" + e.twoBitBlob.name : e.bwgURI || e.bamURI || e.jbURI || e.twoBitURI || "https://www.biodalliance.org/magic/no_uri"
        }

        function n(e) {
            return e.stylesheet_uri ? e.stylesheet_uri : "sequence" == e.tier_type || e.twoBitURI || e.twoBitBlob ? "https://www.biodalliance.org/magic/sequence" : r(e)
        }

        function s(e, t) {
            if (r(e) != r(t)) return !1;
            if (e.mapping != t.mapping) return !1;
            if (e.tier_type != t.tier_type) return !1;
            if (e.overlay) {
                if (!t.overlay || t.overlay.length != e.overlay.length) return !1;
                for (var i = 0; i < e.overlay.length; ++i) if (!s(e.overlay[i], t.overlay[i])) return !1
            } else if (t.overlay) return !1;
            return !0
        }

        function o(e, t) {
            if (r(e) != r(t) || n(e) != n(t)) return !1;
            if (e.mapping != t.mapping) return !1;
            if (e.tier_type != t.tier_type) return !1;
            if (e.overlay) {
                if (!t.overlay || t.overlay.length != e.overlay.length) return !1;
                for (var i = 0; i < e.overlay.length; ++i) if (!o(e.overlay[i], t.overlay[i])) return !1
            } else if (t.overlay) return !1;
            return !0
        }

        "undefined" != typeof t && (t.exports = {
            sourcesAreEqual: o,
            sourcesAreEqualModuloStyle: s,
            sourceDataURI: r,
            sourceStyleURI: n
        })
    }, {}],
    36: [function (e, t, i) {
        "use strict";

        function r(e, t) {
            if ("number" != typeof e || "number" != typeof t) throw"Bad range " + e + "," + t;
            this._min = e, this._max = t
        }

        function n(e) {
            var t = e.sort(h), i = [], r = t.shift();
            t.forEach(function (e) {
                e._min <= r._max ? e._max > r._max && (r._max = e._max) : (i.push(r), r = e)
            }), i.push(r), this._ranges = i
        }

        function s(e, t) {
            return e instanceof n || (e instanceof Array || (e = [e]), e = new n(e)), t && e.insertRange(t), e
        }

        function o(e, t) {
            for (var i = e.ranges(), s = t.ranges(), o = i.length, a = s.length, l = 0, h = 0, u = []; o > l && a > h;) {
                var e = i[l], t = s[h], c = Math.max(e.min(), t.min()), d = Math.min(e.max(), t.max());
                d >= c && u.push(new r(c, d)), e.max() > t.max() ? ++h : ++l
            }
            return 0 == u.length ? null : 1 == u.length ? u[0] : new n(u)
        }

        function a(e) {
            for (var t = 0, i = e.ranges(), r = 0; r < i.length; ++r) {
                var n = i[r];
                t += n.max() - n.min() + 1
            }
            return t
        }

        function l(e, t) {
            return e.min() < t.min() ? -1 : e.min() > t.min() ? 1 : e.max() < t.max() ? -1 : t.max() > e.max() ? 1 : 0
        }

        function h(e, t) {
            return e._min < t._min ? -1 : e._min > t._min ? 1 : e._max < t._max ? -1 : t._max > e._max ? 1 : 0
        }

        r.prototype.min = function () {
            return this._min
        }, r.prototype.max = function () {
            return this._max
        }, r.prototype.contains = function (e) {
            return e >= this._min && e <= this._max
        }, r.prototype.isContiguous = function () {
            return !0
        }, r.prototype.ranges = function () {
            return [this]
        }, r.prototype._pushRanges = function (e) {
            e.push(this)
        }, r.prototype.toString = function () {
            return "[" + this._min + "-" + this._max + "]"
        }, n.prototype.min = function () {
            return this._ranges[0].min()
        }, n.prototype.max = function () {
            return this._ranges[this._ranges.length - 1].max()
        }, n.prototype.lower_bound = function (e) {
            var t = this.ranges();
            if (e > this.max()) return t.length;
            if (e < this.min()) return 0;
            for (var i = 0, r = t.length - 1; r >= i;) {
                var n = Math.floor((i + r) / 2);
                if (e > t[n]._max) i = n + 1; else {
                    if (!(e < t[n]._min)) return n;
                    r = n - 1
                }
            }
            return i
        }, n.prototype.contains = function (e) {
            var t = this.lower_bound(e);
            return t < this._ranges.length && this._ranges[t].contains(e) ? !0 : !1
        }, n.prototype.insertRange = function (e) {
            var t = this.lower_bound(e._min);
            if (t === this._ranges.length) return void this._ranges.push(e);
            var i = this.ranges();
            if (e._max < i[t]._min) return void this._ranges.splice(t, 0, e);
            i[t]._min < e._min && (e._min = i[t]._min);
            for (var r = t + 1; r < i.length && i[r]._min <= e._max;) r++;
            r--, i[r]._max > e._max && (e._max = i[r]._max), this._ranges.splice(t, r - t + 1, e)
        }, n.prototype.isContiguous = function () {
            return this._ranges.length > 1
        }, n.prototype.ranges = function () {
            return this._ranges
        }, n.prototype._pushRanges = function (e) {
            for (var t = 0; t < this._ranges.length; ++t) e.push(this._ranges[t])
        }, n.prototype.toString = function () {
            for (var e = "", t = 0; t < this._ranges.length; ++t) t > 0 && (e += ","), e += this._ranges[t].toString();
            return e
        }, "undefined" != typeof t && (t.exports = {
            Range: r,
            union: s, intersection: o, coverage: a, rangeOver: l, _rangeOrder: h
        })
    }, {}],
    37: [function (e, t, i) {
        "use strict";

        function r(e, t, i) {
            this.type = e, this.method = t, this.label = i
        }

        function n(e) {
            if (this._filters = {}, e) for (var t = 0; t < e.length; ++t) this.add(e[t])
        }

        r.prototype.equals = function (e) {
            return this.type == e.type && this.method == e.method && this.label == e.label
        }, r.prototype.toString = function () {
            var e = [];
            return this.type && e.push("type=" + this.type), this.method && e.push("method=" + this.method), this.label && e.push("label=" + this.label), "StyleFilter<" + e.join(";") + ">"
        }, n.prototype.add = function (e) {
            var t = e.toString();
            this._filters[t] || (this._filters[t] = e, this._list = null)
        }, n.prototype.addAll = function (e) {
            for (var t = e.list(), i = 0; i < t.length; ++i) this.add(t[i])
        }, n.prototype.doesNotContain = function (e) {
            for (var t = e.list(), i = 0; i < t.length; ++i) if (!this._filters[i.toString()]) return !0;
            return !1
        }, n.prototype.list = function () {
            if (!this._list) {
                this._list = [];
                for (var e in this._filters) this._filters.hasOwnProperty(e) && this._list.push(this._filters[e])
            }
            return this._list
        }, n.prototype.typeList = function () {
            for (var e = [], t = this.list(), i = 0; i < t.length; ++i) {
                var r = t[i], n = r.type;
                if (!n || "default" == n) return null;
                e.indexOf(n) < 0 && e.push(n)
            }
            return e
        }, "undefined" != typeof t && (t.exports = {StyleFilter: r, StyleFilterSet: n})
    }, {}],
    38: [function (e, t, i) {
        if ("undefined" != typeof e) var r = e("./cbrowser"), n = r.Browser, s = e("./utils"),
            o = (s.makeElement, s.makeElementNS), a = e("./version"), l = e("./sequence-draw").svgSeqTier,
            h = e("./svg-utils"), u = h.NS_SVG, c = h.NS_XLINK, d = h.SVGPath, p = e("./numformats"),
            f = p.formatQuantLabel, v = p.formatLongInt, g = e("./feature-draw").drawFeatureTier;
        n.prototype.makeSVG = function (e) {
            e = e || {};
            var t = e.minTierHeight || 20, i = 3, r = e.width || this.featurePanelWidth, n = this.featurePanelWidth,
                s = this.scale;
            this.featurePanelWidth = r, this.scale = this.featurePanelWidth / (this.viewEnd - this.viewStart);
            var h = this, p = document.implementation.createDocument(u, "svg", null),
                y = o(u, "g", null, {fontFamily: "helvetica", fontSize: "8pt"});
            p.documentElement.appendChild(y);
            var m = 200;
            if (e.banner) {
                var b = o(u, "a", o(u, "text", "Graphics from Biodalliance " + a, {
                    x: h.featurePanelWidth + m - 100,
                    y: 35,
                    strokeWidth: 0,
                    fontSize: "12pt",
                    textAnchor: "end",
                    fill: "blue"
                }));
                b.setAttribute("xmlns:xlink", c), b.setAttribute("xlink:href", "http://www.biodalliance.org/"), y.appendChild(b)
            }
            e.region && y.appendChild(o(u, "text", this.chr + ":" + v(this.viewStart) + ".." + v(this.viewEnd), {
                x: m + 100,
                y: 35,
                strokeWidth: 0,
                fontSize: "12pt",
                textAnchor: "start"
            }));
            var w = o(u, "rect", null, {x: m, y: 50, width: h.featurePanelWidth, height: 1e5}),
                x = o(u, "clipPath", w, {id: "featureClip"});
            y.appendChild(x);
            for (var S = 70, _ = o(u, "g", null, {}), C = 0; C < h.tiers.length; ++C) {
                var T = h.tiers[C];
                T.backupSubtiers = T.subtiers, T.backupOriginHaxx = T.originHaxx, T.backupLayoutHeight = T.layoutHeight, g(T, T.sequenceSource ? T.currentSequence : null);
                var k = o(u, "g", null, {clipPath: "url(#featureClip)", clipRule: "nonzero"}), L = o(u, "g"), A = S,
                    O = o(u, "rect", null, {x: 0, y: A, width: "10000", height: 50, fill: T.background});
                if (k.appendChild(O), T.sequenceSource) {
                    var E = l(T, T.currentSequence);
                    k.appendChild(o(u, "g", E, {transform: "translate(" + m + ", " + S + ")"})), S += 80
                } else {
                    if (!T.subtiers) continue;
                    for (var R = (T.glyphCacheOrigin - h.viewStart) * h.scale, B = !1, M = 0; M < T.subtiers.length; ++M) {
                        S += i;
                        for (var I = T.subtiers[M], H = [], P = 0; P < I.glyphs.length; ++P) {
                            var F = I.glyphs[P];
                            H.push(F.toSVG())
                        }
                        if (k.appendChild(o(u, "g", H, {transform: "translate(" + (m + R) + ", " + S + ")"})), I.quant) {
                            B = !0;
                            var N = I.quant, G = I.height, D = 2;
                            G > 40 && (D = 1 + (G / 20 | 0));
                            var q = G / (D - 1), U = (N.max - N.min) / (D - 1), z = new d;
                            z.moveTo(m + 5, S), z.lineTo(m, S), z.lineTo(m, S + I.height), z.lineTo(m + 5, S + I.height);
                            for (var W = 1; D - 1 > W; ++W) {
                                var V = W * q;
                                z.moveTo(m, S + V), z.lineTo(m + 3, S + V)
                            }
                            L.appendChild(o(u, "path", null, {
                                d: z.toPathData(),
                                fill: "none",
                                stroke: "black",
                                strokeWidth: "2px"
                            })), L.appendChild(o(u, "text", f(N.max), {
                                x: m - 3,
                                y: S + 7,
                                textAnchor: "end"
                            })), L.appendChild(o(u, "text", f(N.min), {x: m - 3, y: S + I.height, textAnchor: "end"}));
                            for (var W = 1; D - 1 > W; ++W) {
                                var V = W * q;
                                L.appendChild(o(u, "text", f(1 * N.max - W * U), {
                                    x: m - 3,
                                    y: S + V + 3,
                                    textAnchor: "end"
                                }))
                            }
                        }
                        S += I.height + i
                    }
                    t > S - A && (S = A + t)
                }
                var X;
                X = "string" == typeof T.config.name ? T.config.name : T.dasSource.name, L.appendChild(o(u, "text", X, {
                    x: m - (B ? 20 : 12),
                    y: (S + A + 8) / 2,
                    fontSize: "10pt",
                    textAnchor: "end"
                })), O.setAttribute("height", S - A), _.appendChild(o(u, "g", [k, L])), T.subtiers = T.backupSubtiers, T.originHaxx = T.backupOriginHaxx, T.layoutHeight = T.backupLayoutHeight
            }
            if (e.highlights) for (var j = this.highlights || [], K = 0; K < j.length; ++K) {
                var G = j[K];
                if ((G.chr == this.chr || G.chr == "chr" + this.chr) && G.min < this.viewEnd && G.max > this.viewStart) {
                    var Z = (Math.max(G.min, this.viewStart) - this.viewStart) * this.scale,
                        Q = (Math.min(G.max, this.viewEnd) - this.viewStart) * this.scale;
                    _.appendChild(o(u, "rect", null, {
                        x: m + Z,
                        y: 70,
                        width: Q - Z,
                        height: S - 70,
                        stroke: "none",
                        fill: this.defaultHighlightFill,
                        fillOpacity: this.defaultHighlightAlpha
                    }))
                }
            }
            var Y = -1;
            "center" == e.ruler ? Y = m + (this.viewEnd - this.viewStart) * this.scale / 2 : "left" == e.ruler ? Y = m : "right" == e.ruler && (Y = m + (this.viewEnd - this.viewStart) * this.scale), Y >= 0 && _.appendChild(o(u, "line", null, {
                x1: Y,
                y1: 70,
                x2: Y,
                y2: S,
                stroke: "blue"
            })), y.appendChild(_), p.documentElement.setAttribute("width", h.featurePanelWidth + 20 + m), p.documentElement.setAttribute("height", S + 50), this.featurePanelWidth = n, this.scale = s;
            var $ = new Blob([(new XMLSerializer).serializeToString(p)], {type: "image/svg+xml"});
            return $
        }
    }, {
        "./cbrowser": 6,
        "./feature-draw": 18,
        "./numformats": 26,
        "./sequence-draw": 31,
        "./svg-utils": 39,
        "./utils": 49,
        "./version": 51
    }],
    39: [function (e, t, i) {
        function r() {
            this.ops = []
        }

        var n = "http://www.w3.org/2000/svg", s = "http://www.w3.org/1999/xlink";
        r.prototype.moveTo = function (e, t) {
            this.ops.push("M " + e + " " + t)
        }, r.prototype.lineTo = function (e, t) {
            this.ops.push("L " + e + " " + t)
        }, r.prototype.closePath = function () {
            this.ops.push("Z")
        }, r.prototype.toPathData = function () {
            return this.ops.join(" ")
        }, "undefined" != typeof t && (t.exports = {NS_SVG: n, NS_XLINK: s, SVGPath: r})
    }, {}],
    40: [function (e, t, i) {
        "use strict";

        function r(e) {
            a.call(this), this.readiness = "Connecting", this.source = e, this.tabixHolder = new d;
            var t = this, i = o(e.payload);
            if (!i) throw"Unsuported tabix payload " + e.payload;
            this.parser = i;
            var r, n;
            this.source.blob ? (r = new u(this.source.blob), n = new u(this.source.indexBlob)) : (r = new h(this.source.uri, {credentials: this.source.credentials}), n = new h(this.source.indexURI || this.source.uri + ".tbi", {credentials: this.source.credentials})), p(r, n, function (e, r) {
                t.tabixHolder.provide(e), e.fetchHeader(function (e, t) {
                    if (e) {
                        for (var r = i.createSession(function () {
                        }), n = 0; n < e.length; ++n) r.parse(e[n]);
                        r.flush()
                    }
                }), t.readiness = null, t.notifyReadiness()
            })
        }

        if ("undefined" != typeof e) var n = e("./sourceadapters"), s = n.registerSourceAdapterFactory,
            o = n.makeParser, a = n.FeatureSourceBase, l = e("./bin"), h = l.URLFetchable, u = l.BlobFetchable,
            c = e("./utils"), d = c.Awaited, p = e("./tabix").connectTabix;
        r.prototype = Object.create(a.prototype), r.prototype.fetch = function (e, t, i, r, n, s, o) {
            var a = this;
            a.busy++, a.notifyActivity(), this.tabixHolder.await(function (r) {
                r.fetch(e, t, i, function (e, t) {
                    a.busy--, a.notifyActivity();
                    for (var i = [], r = a.parser.createSession(function (e) {
                        i.push(e)
                    }), n = 0; n < e.length; ++n) {
                        r.parse(e[n])
                    }
                    r.flush(), o(null, i, 1e9)
                })
            })
        }, r.prototype.getStyleSheet = function (e) {
            this.parser && this.parser.getStyleSheet && this.parser.getStyleSheet(e)
        }, r.prototype.getDefaultFIPs = function (e) {
            this.parser && this.parser.getDefaultFIPs && this.parser.getDefaultFIPs(e)
        }, s("tabix", function (e) {
            return {features: new r(e)}
        })
    }, {"./bin": 4, "./sourceadapters": 34, "./tabix": 41, "./utils": 49}],
    41: [function (e, t, i) {
        "use strict";

        function r() {
        }

        function n(e, t, i) {
            var n = new r;
            n.data = e, n.tbi = t, n.tbi.fetch(function (e) {
                if (!e) return i(null, "Couldn't access Tabix");
                var t = c(e, e.byteLength), r = new Uint8Array(t), o = l(r, 0);
                if (o != s) return i(null, "Not a tabix index");
                var a = l(r, 4);
                n.format = l(r, 8), n.colSeq = l(r, 12), n.colStart = l(r, 16), n.colEnd = l(r, 20), n.meta = l(r, 24), n.skip = l(r, 28);
                l(r, 32);
                n.indices = [];
                var h = 36;
                n.chrToIndex = {}, n.indexToChr = [];
                for (var d = 0; a > d; ++d) {
                    for (var p = ""; ;) {
                        var f = r[h++];
                        if (0 == f) break;
                        p += String.fromCharCode(f)
                    }
                    n.chrToIndex[p] = d, 0 == p.indexOf("chr") ? n.chrToIndex[p.substring(3)] = d : n.chrToIndex["chr" + p] = d, n.indexToChr.push(p)
                }
                for (var v = 1e9, g = 0; a > g; ++g) {
                    var y = h, m = l(r, h);
                    h += 4;
                    for (var b = 0; m > b; ++b) {
                        var w = (l(r, h), l(r, h + 4));
                        h += 8 + 16 * w
                    }
                    var x = l(r, h);
                    h += 4;
                    for (var S = h, d = 0; x > d; ++d) {
                        var _ = u(r, S);
                        if (S += 8, _) {
                            var C = _.block;
                            _.offset > 0 && (C += 65536), v > C && (v = C);
                            break
                        }
                    }
                    h += 8 * x;
                    m > 0 && (n.indices[g] = new Uint8Array(t, y, h - y))
                }
                n.headerMax = v, i(n)
            }, {timeout: 5e4})
        }

        var s = 21578324;
        if ("undefined" != typeof e) var o = e("./spans"), a = (o.Range, o.union, o.intersection, e("./bin")),
            l = a.readInt, h = (a.readShort, a.readByte, a.readInt64, a.readFloat, e("./lh3utils")), u = h.readVob,
            c = h.unbgzf, d = h.reg2bins, p = h.Chunk;
        r.prototype.blocksForRange = function (e, t, i) {
            var r = this.indices[e];
            if (!r) return [];
            for (var n = d(t, i), s = [], o = 0; o < n.length; ++o) s[n[o]] = !0;
            for (var a = [], h = [], c = l(r, 0), f = 4, v = 0; c > v; ++v) {
                var g = l(r, f), y = l(r, f + 4);
                if (f += 8, s[g]) for (var m = 0; y > m; ++m) {
                    var b = u(r, f), w = u(r, f + 8);
                    (4681 > g ? h : a).push(new p(b, w)), f += 16
                } else f += 16 * y
            }
            for (var x = l(r, f), S = null, _ = Math.min(t >> 14, x - 1), C = Math.min(i >> 14, x - 1), o = _; C >= o; ++o) {
                var T = u(r, f + 4 + 8 * o);
                T && (!S || T.block < S.block || T.offset < S.offset) && (S = T)
            }
            var k = [];
            if (null != S) for (var o = 0; o < h.length; ++o) {
                var L = h[o];
                L.maxv.block >= S.block && L.maxv.offset >= S.offset && k.push(L)
            }
            h = k;
            for (var A = [], o = 0; o < h.length; ++o) A.push(h[o]);
            for (var o = 0; o < a.length; ++o) A.push(a[o]);
            A.sort(function (e, t) {
                var i = e.minv.block - t.minv.block;
                return 0 != i ? i : e.minv.offset - t.minv.offset
            });
            var O = [];
            if (A.length > 0) {
                for (var E = A[0], o = 1; o < A.length; ++o) {
                    var R = A[o];
                    R.minv.block == E.maxv.block ? E = new p(E.minv, R.maxv) : (O.push(E), E = R)
                }
                O.push(E)
            }
            return O
        }, r.prototype.fetch = function (e, t, i, r) {
            function n() {
                if (d >= a.length) return r(u);
                if (h) {
                    var e = new Uint8Array(h);
                    return s.readRecords(e, a[d].minv.offset, u, t, i, l), h = null, ++d, n()
                }
                var o = a[d], p = o.minv.block, f = o.maxv.block + 65536;
                s.data.slice(p, f - p).fetch(function (e) {
                    return h = c(e, o.maxv.block - o.minv.block + 1), n()
                })
            }

            var s = this, o = this.chrToIndex[e];
            if (void 0 == o) return r([]);
            var a, l = this.indexToChr[o];
            void 0 === o ? a = [] : (a = this.blocksForRange(o, t, i), a || r(null, "Error in index fetch"));
            var h, u = [], d = 0;
            n()
        }, r.prototype.readRecords = function (e, t, i, r, n, s) {
            e:for (; ;) {
                for (var o = ""; t < e.length;) {
                    var a = e[t++];
                    if (10 == a) {
                        var l = o.split("	");
                        if (l[this.colSeq - 1] == s) {
                            var h = parseInt(l[this.colStart - 1]), u = h;
                            this.colEnd > 0 && (u = parseInt(l[this.colEnd - 1])), 65536 & this.format && ++h, n >= h && u >= r && i.push(o)
                        }
                        continue e
                    }
                    o += String.fromCharCode(a)
                }
                return
            }
        }, r.prototype.fetchHeader = function (e) {
            var t = this;
            t.data.slice(0, t.headerMax).fetch(function (i) {
                if (!i) return e(null, "Fetch failed");
                for (var r = new Uint8Array(c(i, i.byteLength)), n = 0, s = "", o = []; n < r.length;) {
                    var a = r[n++];
                    if (10 == a) {
                        if (s.charCodeAt(0) != t.meta) return e(o);
                        o.push(s), s = ""
                    } else s += String.fromCharCode(a)
                }
                e(o)
            })
        }, "undefined" != typeof t && (t.exports = {connectTabix: n, TABIX_MAGIC: s})
    }, {"./bin": 4, "./lh3utils": 24, "./spans": 36}],
    42: [function (e, t, i) {
        "use strict";

        function r(e) {
            this.genomes = {}, this.url = e
        }

        function n() {
        }

        function s(e) {
            this.hub = e
        }

        function o(e, t, i) {
            i = i || {}, i.salt = !0, h(e, function (n, o) {
                if (o) return t(null, o);
                var a = n.split(g), l = new r(e);
                i.credentials && (l.credentials = i.credentials);
                for (var c = 0; c < a.length - 2; c += 3) l[a[c + 1]] = a[c + 2];
                if (l.genomesFile) {
                    var d = u(e, l.genomesFile);
                    h(d, function (e, r) {
                        if (r) return t(null, r);
                        for (var n = e.split(v), o = 0; o < n.length; ++o) {
                            var a = n[o].split(g), h = new s(l);
                            i.credentials && (h.credentials = i.credentials);
                            for (var c = 0; c < a.length - 2; c += 3) h[a[c + 1]] = a[c + 2];
                            h.twoBitPath && (h.twoBitPath = u(d, h.twoBitPath)), h.genome && h.trackDb && (h.absURL = u(d, h.trackDb), l.genomes[h.genome] = h)
                        }
                        t(l)
                    }, i)
                } else t(null, "No genomesFile")
            }, i)
        }

        function a(e, t) {
            return e.priority && t.priority ? 1 * e.priority - 1 * t.priority : e.priority ? 1 : t.priority ? -1 : e.shortLabel.localeCompare(t.shortLabel)
        }

        if ("undefined" != typeof e) var l = e("./utils"), h = l.textXHR, u = l.relativeURL, c = l.shallowCopy,
            d = e("./das"), p = d.DASStylesheet, f = d.DASStyle;
        var v = /\n\s*\n/, g = /(\w+) +(.+)\n?/, y = /subGroup[1-9]/, m = "http://genome.ucsc.edu/images/";
        n.prototype.get = function (e) {
            return this[e] ? this[e] : this._parent ? this._parent.get(e) : void 0
        }, s.prototype.getTracks = function (e) {
            var t = this;
            return this._tracks ? e(this._tracks) : void h(this.absURL, function (i, r) {
                if (r) return e(null, r);
                i = i.replace("\\\n", " ");
                for (var s = [], o = {}, a = i.split(v), l = 0; l < a.length; ++l) {
                    var h = a[l].replace(/\#.*/g, "").split(g), u = new n;
                    u._db = t;
                    for (var c = 0; c < h.length - 2; c += 3) {
                        var d = h[c + 1], p = h[c + 2];
                        if (d.match(y)) {
                            u.subgroups || (u.subgroups = {});
                            for (var f = p.split(/\s/), m = f[0], b = {
                                name: f[1],
                                tags: [],
                                titles: []
                            }, w = 2; w < f.length; ++w) {
                                var x = f[w].split(/=/);
                                b.tags.push(x[0]), b.titles.push(x[1])
                            }
                            u.subgroups[m] = b
                        } else if ("subGroups" === d) {
                            var f = p.split(/(\w+)=(\w+)/);
                            u.sgm = {};
                            for (var w = 0; w < f.length - 2; w += 3) u.sgm[f[w + 1]] = f[w + 2]
                        } else u[h[c + 1]] = h[c + 2]
                    }
                    u.track && (u.type || u.container || u.view || u.bigDataUrl) && (s.push(u), o[u.track] = u)
                }
                for (var S = [], _ = [], C = 0; C < s.length; ++C) {
                    var u = s[C], T = !0;
                    if (u.parent) {
                        var k = u.parent.split(/\s+/), L = o[k[0]];
                        L ? (u._parent = L, L.children || (L.children = []), L.children.push(u), L && (T = !1)) : console.log("Couldn't find parent " + k[0] + "(" + u.parent + ")")
                    }
                    u.compositeTrack ? _.push(u) : T && S.push(u)
                }
                for (var A = 0; A < _.length; ++A) {
                    var O = _[A];
                    if (O.children) {
                        for (var E = !1, R = 0; R < O.children.length; ++R) {
                            var d = O.children[R];
                            d.view && (d.shortLabel = O.shortLabel + ": " + d.shortLabel, S.push(d), E = !0)
                        }
                        E || S.push(O)
                    }
                }
                return t._tracks = S, e(t._tracks, null)
            }, {credentials: this.credentials, salt: !0})
        }, n.prototype.toDallianceSource = function () {
            var e = {name: this.shortLabel, desc: this.longLabel};
            this._db.mapping && (e.mapping = this._db.mapping);
            var t = this.get("pennantIcon");
            if (t) {
                var i = t.split(/\s+/);
                e.pennant = m + i[0]
            }
            var r = this.get("searchTrix");
            if (r && (e.trixURI = u(this._db.absURL, r)), "multiWig" == this.container) {
                e.merge = "concat", e.overlay = [];
                var n = this.children || [];
                e.style = [], e.noDownsample = !0;
                for (var s = 0; s < n.length; ++s) {
                    var o = n[s], a = o.toDallianceSource();
                    if (e.overlay.push(a), a.style) for (var l = 0; l < a.style.length; ++l) {
                        var h = a.style[l];
                        h.method = o.shortLabel, "transparentOverlay" == this.aggregate && (h.style.ALPHA = .5), e.style.push(h)
                    }
                }
                return e
            }
            var c = this.type;
            if (!c) {
                for (var d = this; d._parent && !d.type;) d = d._parent;
                c = d.type
            }
            if (c) {
                var p = c.split(/\s+/);
                if ("bigBed" == p[0] && this.bigDataUrl) {
                    var f = 0 | p[1], v = "+" == p[2];
                    return e.bwgURI = u(this._db.absURL, this.bigDataUrl), e.style = this.bigbedStyles(), this._db.credentials && (e.credentials = !0), f >= 12 && v && (e.collapseSuperGroups = !0), e
                }
                return "bigWig" == p[0] && this.bigDataUrl ? (e.bwgURI = u(this._db.absURL, this.bigDataUrl), e.style = this.bigwigStyles(), e.noDownsample = !0, this.yLineOnOff && "on" == this.yLineOnOff && (e.quantLeapThreshold = void 0 !== this.yLineMark ? 1 * this.yLineMark : 0), this._db.credentials && (e.credentials = !0), e) : "bam" == p[0] && this.bigDataUrl ? (e.bamURI = u(this._db.absURL, this.bigDataUrl), this._db.credentials && (e.credentials = !0), e) : "vcfTabix" == p[0] && this.bigDataUrl ? (e.uri = u(this._db.absURL, this.bigDataUrl), e.tier_type = "tabix", e.payload = "vcf", this._db.credentials && (e.credentials = !0), e) : void console.log("Unsupported " + this.type)
            }
        }, n.prototype.bigwigStyles = function () {
            var e = this.type;
            if (!e) {
                for (var t = this; t._parent && !t.type;) t = t._parent;
                e = t.type
            }
            if (e) {
                var i, r, n = e.split(/\s+/);
                n.length >= 3 && (i = 1 * n[1], r = 1 * n[2]);
                var s;
                if (this.maxHeightPixels) {
                    var o = this.maxHeightPixels.split(/:/);
                    3 == o.length ? s = 0 | o[1] : console.log("maxHeightPixels should be of the form max:default:min")
                }
                var a = "bars";
                this.graphTypeDefault && (a = this.graphTypeDefault);
                var l = "black", h = null;
                this.color && (l = "rgb(" + this.color + ")"), this.altColor && (h = "rgb(" + this.altColor + ")");
                var u = new p, c = new f;
                return "points" == a ? c.glyph = "POINT" : c.glyph = "HISTOGRAM", h ? (c.COLOR1 = l, c.COLOR2 = h) : c.BGCOLOR = l, c.HEIGHT = s || 30, (i || r) && (c.MIN = i, c.MAX = r), u.pushStyle({type: "default"}, null, c), u.styles
            }
        }, n.prototype.bigbedStyles = function () {
            var e = "on" == ("" + this.get("itemRgb")).toLowerCase(), t = this.get("visibility") || "full",
                i = this.get("color");
            i = i ? "rgb(" + i + ")" : "blue";
            var r = new p, n = new f;
            n.glyph = "BOX", n.FGCOLOR = "black", n.BGCOLOR = i, n.HEIGHT = "full" == t || "pack" == t ? 12 : 8, n.BUMP = "full" == t || "pack" == t, n.LABEL = "full" == t || "pack" == t, n.ZINDEX = 20, e && (n.BGITEM = !0);
            var s = this.get("colorByStrand");
            if (s) {
                var o = s.split(/\s+/), a = c(n);
                a.BGCOLOR = "rgb(" + o[0] + ")", r.pushStyle({type: "bigbed", orientation: "+"}, null, a);
                var l = c(n);
                l.BGCOLOR = "rgb(" + o[1] + ")", r.pushStyle({type: "bigbed", orientation: "-"}, null, l)
            } else r.pushStyle({type: "bigbed"}, null, n);
            var h = new f;
            h.glyph = "BOX", h.FGCOLOR = "black", e && (h.BGITEM = !0), h.BGCOLOR = "red", h.HEIGHT = 10, h.BUMP = !0, h.ZINDEX = 20, r.pushStyle({type: "translation"}, null, h);
            var u = new f;
            return u.glyph = "BOX", u.FGCOLOR = "black", u.BGCOLOR = "white", u.HEIGHT = 10, u.ZINDEX = 10, u.BUMP = !0, u.LABEL = !0, r.pushStyle({type: "transcript"}, null, u), r.styles
        }, "undefined" != typeof t && (t.exports = {connectTrackHub: o, THUB_COMPARE: a})
    }, {"./das": 10, "./utils": 49}],
    43: [function (e, t, i) {
        "use strict";
        if ("undefined" != typeof e) var r = e("./cbrowser"), n = r.Browser, s = e("./utils"), o = s.shallowCopy;
        n.prototype.mergeSelectedTiers = function () {
            for (var e = [], t = [], i = 0; i < this.selectedTiers.length; ++i) {
                var r = this.tiers[this.selectedTiers[i]];
                e.push(o(r.dasSource));
                for (var n = r.stylesheet.styles, s = 0; s < n.length; ++s) {
                    var a = n[s], l = o(a);
                    l.method = r.dasSource.name.replace(/[()+*?]/g, "\\$&"), l._methodRE = null, l.style = o(a.style), void 0 === l.style.ZINDEX && (l.style.ZINDEX = i), r.forceMin && (l.style.MIN = r.forceMin), r.forceMax && (l.style.MAX = r.forceMax), t.push(l)
                }
            }
            this.addTier({
                name: "Merged",
                merge: "concat",
                overlay: e,
                noDownsample: !0,
                style: t
            }), this.setSelectedTier(this.tiers.length - 1)
        }
    }, {"./cbrowser": 6, "./utils": 49}],
    44: [function (e, t, i) {
        "use strict";

        function r(e) {
            for (var t = 0; t < e.styles.length; ++t) {
                var i = e.styles[t].style;
                if ("__SEQUENCE" === i.glyph) return i
            }
        }

        if ("undefined" != typeof e) var n = e("./cbrowser"), s = n.Browser, o = e("./utils"), a = o.makeElement,
            l = e("./das"), h = l.isDasBooleanTrue, u = (l.isDasBooleanNotFalse, l.copyStylesheet), c = e("./color"),
            d = c.dasColourForName, p = e("./sourcecompare").sourceDataURI;
        var f = {DOT: !0, EX: !0, STAR: !0, SQUARE: !0, CROSS: !0, TRIANGLE: !0, PLIMSOLL: !0};
        s.prototype.openTierPanel = function (e) {
            if ("tier" === this.uiMode && this.manipulatingTier === e) this.hideToolPanel(), this.setUiMode("none"); else {
                if (!e) return;
                var t = function (e) {
                    e.BGGRAD || (1 == R ? ("LINEPLOT" == e.glyph || f[e.glyph] ? e.FGCOLOR = S.value : e.BGCOLOR = S.value, e.COLOR1 = e.COLOR2 = e.COLOR3 = null) : (e.COLOR1 = S.value, e.COLOR2 = _.value, R > 2 ? e.COLOR3 = C.value : e.COLOR3 = null), e._gradient = null, e._plusColor = T.value, e._minusColor = k.value)
                }, i = function (t) {
                    for (var i = u(e.stylesheet), r = e.browser.zoomForCurrentScale(), n = 0; n < i.styles.length; ++n) {
                        var s = i.styles[n];
                        s.zoom && s.zoom != r || t(s.style)
                    }
                    return i
                }, n = function (r) {
                    e.mergeStylesheet(i(t))
                };
                this.manipulatingTier = e;
                var s = a("div", null, {className: "tier-edit"}),
                    o = a("div", "About '" + (e.config.Name || e.dasSource.name) + "'", null, {
                        background: "gray",
                        paddingBottom: "5px",
                        marginBottom: "5px",
                        textAlign: "center"
                    });
                s.appendChild(o);
                var l = a("div", [a("p", e.dasSource.desc)]), c = [], v = p(e.dasSource);
                if (!v || 0 != v.indexOf("http://") && 0 != v.indexOf("https://") && 0 != v.indexOf("//") || "https://www.biodalliance.org/magic/no_uri" === v || c.push(a("li", a("a", "(Download data)", {href: v}))), e.dasSource.mapping) {
                    var g = this.chains[e.dasSource.mapping].coords;
                    c.push(a("li", "Mapped from " + g.auth + g.version))
                }
                c.length > 0 && l.appendChild(a("ul", c)), s.appendChild(l);
                var y = a("span", " (styles for current zoom level)", null, {display: "none"}),
                    m = a("div", ["Edit", y], null, {
                        background: "gray",
                        paddingBottom: "5px",
                        marginBottom: "5px",
                        textAlign: "center"
                    });
                s.appendChild(m);
                var b = a("input", null, {type: "text"}),
                    w = a("input", null, {type: "checkbox", disabled: this.disablePinning}), x = a("select");
                x.appendChild(a("option", "Histogram", {value: "HISTOGRAM"})), x.appendChild(a("option", "Line Plot", {value: "LINEPLOT"})), x.appendChild(a("option", "Ribbon", {value: "GRADIENT"})), x.appendChild(a("option", "Scatter", {value: "SCATTER"}));
                var S = a("input", null, {type: "text", value: "#dd00dd"}),
                    _ = a("input", null, {type: "text", value: "#dd00dd"}),
                    C = a("input", null, {type: "text", value: "#dd00dd"}),
                    T = a("input", null, {type: "text", value: "#ffa07a"}),
                    k = a("input", null, {type: "text", value: "#87cefa"});
                try {
                    S.type = _.type = C.type = "color", T.type = k.type = "color"
                } catch (L) {
                }
                var A = [S, _, C], O = a("i", null, {className: "fa fa-plus-circle"}),
                    E = a("i", null, {className: "fa fa-minus-circle"}), R = 1, B = a("td", A), M = function (e) {
                        R = e;
                        for (var t = 0; e > t; ++t) A[t].style.display = "block";
                        for (var t = e; t < A.length; ++t) A[t].style.display = "none"
                    };
                O.addEventListener("click", function (e) {
                    3 > R && (M(R + 1), n(null))
                }, !1), E.addEventListener("click", function (e) {
                    R > 1 && (M(R - 1), n(null))
                }, !1);
                var I = a("input", null, {type: "text", value: "0.0"}),
                    H = a("input", null, {type: "text", value: "10.0"}), P = a("input", null, {type: "checkbox"}),
                    F = a("input", null, {type: "checkbox"}),
                    N = a("input", null, {type: "checkbox", checked: void 0 !== e.quantLeapThreshold}),
                    G = a("input", null, {type: "text", value: e.quantLeapThreshold, disabled: !N.checked}),
                    D = a("input", null, {type: "text", value: "50"}), q = a("input", null, {type: "checkbox"}),
                    U = a("input", null, {type: "text"}), z = a("input", null, {type: "checkbox"}), W = null;
                if (e.stylesheet.styles.length > 0) {
                    W = e.stylesheet.styles[0].style
                }
                var V = function () {
                        if ("string" == typeof e.config.name ? b.value = e.config.name : b.value = e.dasSource.name, w.checked = e.pinned, e.forceHeight ? D.value = "" + e.forceHeight : W && W.HEIGHT && (D.value = "" + W.HEIGHT), "number" == typeof e.quantLeapThreshold ? (N.checked = !0, G.disabled = !1, parseFloat(G.value) != e.quantLeapThreshold && (G.value = e.quantLeapThreshold)) : (N.checked = !1, G.disabled = !0), "number" == typeof e.subtierMax ? U.value = "" + e.subtierMax : U.value = "" + (e.dasSource.subtierMax || e.browser.defaultSubtierMax), e.stylesheet.styles.length > 0) {
                            for (var t = null, i = !1, n = !1, s = e.browser.zoomForCurrentScale(), o = 0, a = 0; a < e.stylesheet.styles.length; ++a) {
                                var l = e.stylesheet.styles[a];
                                if (!l.zoom || l.zoom == s) {
                                    ++o;
                                    var u = e.stylesheet.styles[a].style;
                                    t || (t = W = u), ("LINEPLOT" == u.glyph || "HISTOGRAM" == u.glyph || "GRADIENT" == u.glyph || h(u.SCATTER)) && (i || (t = W = u), i = !0)
                                }
                            }
                            if (!t) return;
                            y.style.display = o == e.stylesheet.styles.length ? "none" : "inline", n = i && 1 == o;
                            t.COLOR2 || t.BGGRAD;
                            i ? (ie.style.display = "table-row", re.style.display = "table-row", se.style.display = "none", oe.style.display = "none") : (ie.style.display = "none", re.style.display = "none", se.style.display = "table-row", q.checked = h(W.BUMP), U.disabled = !h(W.BUMP), oe.style.display = "table-row", z.checked = h(W.LABEL)), n ? ($.style.display = "table-row", J.style.display = "table-row") : ($.style.display = "none", J.style.display = "none");
                            var c = 1;
                            t.COLOR1 ? (S.value = d(t.COLOR1).toHexString(), t.COLOR2 && (_.value = d(t.COLOR2).toHexString(), t.COLOR3 ? (C.value = d(t.COLOR3).toHexString(), c = 3) : c = 2)) : "LINEPLOT" == t.glyph || "DOT" == t.glyph && t.FGCOLOR ? S.value = d(t.FGCOLOR).toHexString() : t.BGCOLOR && (S.value = d(t.BGCOLOR).toHexString()), M(c), t._plusColor && (T.value = d(t._plusColor).toHexString() || t._plusColor), t._minusColor && (k.value = d(t._minusColor).toHexString() || t._minusColor), h(t.SCATTER) ? x.value = "SCATTER" : x.value = t.glyph;
                            var p, f;
                            if (void 0 !== t.MIN) {
                                var v = parseFloat(t.MIN);
                                isNaN(v) || (p = v)
                            }
                            if (e.forceMinDynamic || void 0 === t.MIN && void 0 === e.forceMin ? (P.checked = !1, I.disabled = !0) : (P.checked = !0, I.disabled = !1), void 0 !== t.MAX) {
                                var v = parseFloat(t.MAX);
                                isNaN(v) || (f = v)
                            }
                            e.forceMaxDynamic || void 0 === t.MAX && void 0 === e.forceMax ? (F.checked = !1, H.disabled = !0) : (F.checked = !0, H.disabled = !1), void 0 != e.forceMin && (p = e.forceMin), void 0 != e.forceMax && (f = e.forceMax), "number" == typeof p && p != parseFloat(I.value) && (I.value = p), "number" == typeof f && f != parseFloat(H.value) && (H.value = f);
                            var g = r(e.stylesheet);
                            g ? (j.style.display = "table-row", X.checked = "mismatch" === g.__SEQCOLOR, Z.style.display = "table-row", K.checked = h(g.__INSERTIONS), Y.style.display = "table-row", Q.checked = void 0 === g.__disableQuals || g.__disableQuals === !1, console.log(g.__disableQuals)) : (j.style.display = "none", Z.style.display = "none", Y.style.display = "none"), g && X.checked && !n ? (ee.style.display = "table-row", te.style.display = "table-row") : (ee.style.display = "none", te.style.display = "none")
                        }
                        i && e.browser.sourceAdapterIsCapable(e.featureSource, "quantLeap") ? ne.style.display = "table-row" : ne.style.display = "none"
                    }, X = a("input", null, {type: "checkbox"}),
                    j = a("tr", [a("th", "Highlight mismatches & strands"), a("td", X)]);
                X.addEventListener("change", function (t) {
                    var i = u(e.stylesheet), n = r(i);
                    n.__SEQCOLOR = X.checked ? "mismatch" : "base", e.mergeStylesheet(i)
                });
                var K = a("input", null, {type: "checkbox"}), Z = a("tr", [a("th", "Show insertions"), a("td", K)]);
                K.addEventListener("change", function (t) {
                    var i = u(e.stylesheet), n = r(i);
                    n.__INSERTIONS = K.checked ? "yes" : "no", e.mergeStylesheet(i)
                });
                var Q = a("input", null, {type: "checkbox"}),
                    Y = a("tr", [a("th", "Reflect base quality as base color transparency"), a("td", Q)]);
                Q.addEventListener("change", function (t) {
                    var i = u(e.stylesheet), n = r(i);
                    n.__disableQuals = !Q.checked, console.log(n.__disableQuals), e.mergeStylesheet(i)
                });
                var $ = a("tr", [a("th", "Style"), a("td", x)]), J = a("tr", [a("th", ["Colour(s)", O, E]), B]),
                    ee = a("tr", [a("th", "Plus Strand Color"), a("td", T)]),
                    te = a("tr", [a("th", "Minus Strand Color"), a("td", k)]),
                    ie = a("tr", [a("th", "Min value"), a("td", [P, " ", I])]),
                    re = a("tr", [a("th", "Max value"), a("td", [F, " ", H])]),
                    ne = a("tr", [a("th", "Threshold leap:"), a("td", [N, " ", G])]),
                    se = a("tr", [a("th", "Bump overlaps"), a("td", [q, " limit: ", U])]),
                    oe = a("tr", [a("th", "Label features"), a("td", z)]),
                    ae = a("table", [a("tr", [a("th", "Name", {}, {
                        width: "150px",
                        textAlign: "right"
                    }), b]), a("tr", [a("th", "Pin to top"), w]), a("tr", [a("th", "Height"), a("td", D)]), $, J, ee, te, ie, re, ne, se, oe, j, Z, Y]);
                V(), s.appendChild(ae);
                var le = a("button", "Reset track", {className: "btn"}, {
                    marginLeft: "auto",
                    marginRight: "auto",
                    display: "block"
                });
                le.addEventListener("click", function (t) {
                    e.setConfig({})
                }, !1), s.appendChild(le), b.addEventListener("input", function (t) {
                    e.mergeConfig({name: b.value})
                }, !1), w.addEventListener("change", function (t) {
                    e.mergeConfig({pinned: w.checked})
                }, !1);
                for (var he = 0; he < A.length; ++he) A[he].addEventListener("change", n, !1);
                T.addEventListener("change", n, !1), k.addEventListener("change", n, !1), x.addEventListener("change", function (r) {
                    var n = i(function (e) {
                        "SCATTER" === x.value ? (e.SCATTER = !0, e.glyph = "DOT", e.SIZE = "3") : (e.glyph = x.value, e.SCATTER = void 0), t(e)
                    });
                    e.mergeStylesheet(n)
                }, !1), P.addEventListener("change", function (t) {
                    var i = {forceMinDynamic: !P.checked};
                    I.disabled = !P.checked;
                    var r = parseFloat(I.value);
                    P.checked && "number" == typeof r && !isNaN(r) && (i.forceMin = parseFloat(r)), e.mergeConfig(i)
                }), I.addEventListener("input", function (t) {
                    var i = parseFloat(I.value);
                    "number" != typeof i || isNaN(i) || e.mergeConfig({forceMin: i})
                }, !1), F.addEventListener("change", function (t) {
                    var i = {forceMaxDynamic: !F.checked};
                    H.disabled = !F.checked;
                    var r = parseFloat(H.value);
                    F.checked && "number" == typeof r && !isNaN(r) && (i.forceMax = parseFloat(r)), e.mergeConfig(i)
                }), H.addEventListener("input", function (t) {
                    var i = parseFloat(H.value);
                    "number" != typeof i || isNaN(i) || e.mergeConfig({forceMax: i})
                }, !1), D.addEventListener("input", function (t) {
                    var i = parseFloat(D.value);
                    "number" != typeof i || isNaN(i) || e.mergeConfig({height: Math.min(500, 0 | i)})
                }, !1);
                var ue = function () {
                    if (G.disabled = !N.checked, N.checked) {
                        var t = parseFloat(G.value);
                        "number" != typeof t || isNaN(t) || e.mergeConfig({quantLeapThreshold: parseFloat(G.value)})
                    } else e.mergeConfig({quantLeapThreshold: null})
                };
                N.addEventListener("change", function (e) {
                    ue()
                }, !1), G.addEventListener("input", function (e) {
                    ue()
                }, !1), z.addEventListener("change", function (t) {
                    var r = i(function (e) {
                        e.LABEL = z.checked ? "yes" : "no"
                    });
                    e.mergeStylesheet(r)
                }, !1), q.addEventListener("change", function (t) {
                    var r = i(function (e) {
                        e.BUMP = q.checked ? "yes" : "no"
                    });
                    e.mergeStylesheet(r)
                }, !1), U.addEventListener("input", function (t) {
                    var i = parseInt(U.value);
                    "number" == typeof i && i > 0 && e.mergeConfig({subtierMax: i})
                }, !1), this.showToolPanel(s), this.setUiMode("tier"), e.addTierListener(V);
                var ce = e.browser.scale;
                e.browser.addViewListener(function () {
                    e.browser.scale != ce && (ce = e.browser.scale, V())
                })
            }
        }
    }, {"./cbrowser": 6, "./color": 9, "./das": 10, "./sourcecompare": 35, "./utils": 49}],
    45: [function (e, t, i) {
        "use strict";

        function r(e, t, i, r) {
            if (this.config = i || {}, this.id = "tier" + ++w, this.browser = e, this.dasSource = a(t), this.background = r, this.viewport = s("canvas", null, {
                width: "" + ((0 | this.browser.featurePanelWidth) + 2e3),
                height: "30",
                className: "viewport_12_5"
            }, {
                position: "inline-block",
                margin: "0px",
                border: "0px"
            }), this.viewportHolder = s("div", this.viewport, {className: "viewport-holder_12_5"}, {
                background: r,
                position: "absolute",
                padding: "0px",
                margin: "0px",
                border: "0px",
                left: "-1000px",
                minHeight: "200px"
            }), this.overlay = s("canvas", null, {
                width: +(0 | this.browser.featurePanelWidth),
                height: "30",
                className: "viewport-overlay"
            }), this.notifier = s("div", "", {className: "notifier"}), this.notifierHolder = s("div", this.notifier, {className: "notifier-holder"}), this.quantOverlay = s("canvas", null, {
                width: "50",
                height: "56",
                className: "quant-overlay"
            }), this.removeButton = s("i", null, {className: "fa fa-times"}), this.bumpButton = s("i", null, {className: "fa fa-plus-circle"}), this.loaderButton = e.makeLoader(16), this.loaderButton.style.display = "none", this.infoElement = s("div", this.dasSource.desc, {className: "track-label-info"}), this.nameButton = s("div", [], {className: "tier-tab"}), this.nameButton.appendChild(this.removeButton), t.pennant) this.nameButton.appendChild(s("img", null, {
                src: t.pennant,
                width: "16",
                height: "16"
            })); else if (t.mapping) {
                var n = null;
                this.browser.chains[t.mapping] && (n = this.browser.chains[t.mapping].coords.version), n && this.nameButton.appendChild(s("span", "" + n, null, {
                    fontSize: "8pt",
                    background: "black",
                    color: "white",
                    paddingLeft: "3px",
                    paddingRight: "3px",
                    paddingTop: "1px",
                    paddingBottom: "1px",
                    marginLeft: "2px",
                    borderRadius: "10px"
                }))
            }
            this.nameElement = s("span", t.name), this.nameButton.appendChild(s("span", [this.nameElement, this.infoElement], {className: "track-name-holder"})), this.nameButton.appendChild(this.bumpButton), this.nameButton.appendChild(this.loaderButton), this.label = s("span", [this.nameButton], {className: "btn-group track-label"});
            var o = "tier" + (t.className ? " " + t.className : "");
            this.row = s("div", [this.viewportHolder, this.overlay, this.quantOverlay], {className: o}), r || (this.row.style.background = "none"), e.noDefaultLabels || this.row.appendChild(this.label), this.row.appendChild(this.notifierHolder), this.layoutHeight = 25, this.bumped = !0, this.styleIdSeed = 0, t.quantLeapThreshold && (this.quantLeapThreshold = t.quantLeapThreshold), this.dasSource.collapseSuperGroups && (this.bumped = !1), this.layoutWasDone = !1, t.featureInfoPlugin && this.addFeatureInfoPlugin(t.featureInfoPlugin), this.initSources();
            var l = this;
            this.featureSource && this.featureSource.getDefaultFIPs && !t.noSourceFeatureInfo && this.featureSource.getDefaultFIPs(function (e) {
                e && l.addFeatureInfoPlugin(e)
            }), this.featureSource && this.featureSource.addReadinessListener && (this.readinessListener = function (e) {
                l.notify(e, -1)
            }, this.featureSource.addReadinessListener(this.readinessListener)), this.featureSource && this.featureSource.addActivityListener && (this.activityListener = function (e) {
                e > 0 ? l.loaderButton.style.display = "inline-block" : l.loaderButton.style.display = "none", l.browser.pingActivity()
            }, this.featureSource.addActivityListener(this.activityListener)), this.listeners = [], this.featuresLoadedListeners = []
        }

        if ("undefined" != typeof e) var n = e("./utils"), s = n.makeElement, o = n.removeChildren, a = n.shallowCopy,
            l = (n.pushnew, n.miniJSONify), h = n.arrayIndexOf, u = e("./das"), c = u.DASStylesheet, d = u.DASStyle,
            p = e("./sha1"), f = p.b64_sha1, v = e("./style"), g = v.StyleFilter, y = v.StyleFilterSet,
            m = e("./sourcecompare"), b = m.sourceDataURI;
        var w = 0;
        if (r.prototype.destroy = function () {
            this.featureSource.removeReadinessListener && this.featureSource.removeReadinessListener(this.readinessListener), this.featureSource.removeActivityListener && this.featureSource.removeActivityListener(this.activityListener)
        }, r.prototype.setBackground = function (e) {
            this.background = e, this.viewportHolder.style.background = e
        }, r.prototype.toString = function () {
            return this.id
        }, r.prototype.addFeatureInfoPlugin = function (e) {
            this.featureInfoPlugins || (this.featureInfoPlugins = []), this.featureInfoPlugins.push(e)
        }, r.prototype.init = function () {
            var e = this;
            e.dasSource.style ? (this.setStylesheet({styles: e.dasSource.style}), this.browser.refreshTier(this)) : (e.status = "Fetching stylesheet", e.fetchStylesheet(function (t, i) {
                if (i || !t) {
                    e.error = "No stylesheet";
                    var t = new c, r = new d;
                    r.glyph = "BOX", r.BGCOLOR = "blue", r.FGCOLOR = "black", t.pushStyle({type: "default"}, null, r), e.setStylesheet(t), e.browser.refreshTier(e)
                } else e.setStylesheet(t), t.geneHint && (e.dasSource.collapseSuperGroups = !0, e.bumped = !1, e.updateLabel()), e._updateFromConfig(), e.browser.refreshTier(e)
            }))
        }, r.prototype.setStylesheet = function (e) {
            this.baseStylesheet = a(e);
            for (var t = 0; t < this.baseStylesheet.styles.length; ++t) {
                var i = this.baseStylesheet.styles[t] = a(this.baseStylesheet.styles[t]);
                i._methodRE = i._labelRE = i._typeRE = null, i.style = a(i.style),
                    i.style.id = "style" + ++this.styleIdSeed
            }
            this.baseStylesheetValidity = f(l(this.baseStylesheet)), this._updateFromConfig()
        }, r.prototype.getSource = function () {
            return this.featureSource
        }, r.prototype.getDesiredTypes = function (e) {
            var t = this.getActiveStyleFilters(e);
            return t ? t.typeList() : void 0
        }, r.prototype.getActiveStyleFilters = function (e) {
            var t = this.browser.zoomForCurrentScale();
            if (this.stylesheet) {
                for (var i = new y, r = this.stylesheet.styles, n = 0; n < r.length; ++n) {
                    var s = r[n];
                    s.zoom && s.zoom != t || i.add(new g(s.type, s.method, s.label))
                }
                return i
            }
        }, r.prototype.needsSequence = function (e) {
            return this.sequenceSource && 5 > e ? !0 : (this.dasSource.bamURI || this.dasSource.bamBlob || this.dasSource.bwgURI || this.dasSource.bwgBlob) && 20 > e ? !0 : !1
        }, r.prototype.viewFeatures = function (e, t, i, r, n) {
            this.currentFeatures = r, this.currentSequence = n, this.notifyFeaturesLoaded(), this.knownChr = e, this.knownCoverage = t, this.status && (this.status = null, this._notifierToStatus()), this.draw()
        }, r.prototype.draw = function () {
            var e = (this.currentFeatures, this.currentSequence);
            this.sequenceSource ? C(this, e) : S(this), this.paint(), this.originHaxx = 0, this.browser.arrangeTiers()
        }, r.prototype.findNextFeature = function (e, t, i, r, n) {
            if (this.quantLeapThreshold) {
                var s = this.browser.viewEnd - this.browser.viewStart + 1;
                t = t + s * i / 2 | 0, this.featureSource.quantFindNextFeature(e, t, i, this.quantLeapThreshold, n)
            } else {
                if (this.knownCoverage && t >= this.knownCoverage.min() && t <= this.knownCoverage.max() && this.currentFeatures) {
                    for (var o = null, a = 0; a < this.currentFeatures.length; ++a) {
                        var l = this.currentFeatures[a];
                        l.min && l.max && (l.parents && l.parents.length > 0 || (0 > i ? 1 == r && l.max >= t && l.min < t ? (!o || l.min > o.min || l.min == o.min && l.max < o.max) && (o = l) : l.max < t && (!o || l.max > o.max || l.max == o.max && l.min < o.min || l.min == o.mmin && o.max >= t) && (o = l) : 1 == r && l.min <= t && l.max > t ? (!o || l.max < o.max || l.max == o.max && l.min > o.min) && (o = l) : l.min > t && (!o || l.min < o.min || l.min == o.min && l.max > o.max || l.max == o.max && o.min <= t) && (o = l)))
                    }
                    if (o) return n(o);
                    t = 0 > i ? this.browser.knownSpace.min : this.browser.knownSpace.max
                }
                this.trySourceFNF(e, t, i, n)
            }
        }, r.prototype.trySourceFNF = function (e, t, i, r) {
            var n = this;
            this.featureSource.findNextFeature(e, t, i, function (e) {
                e || r(e);
                var t = n.browser.getSequenceSource();
                t || r(e), t.getSeqInfo(e.segment, function (t) {
                    t ? r(e) : n.trySourceFNF(e.segment, i > 0 ? 1e10 : 0, i, r)
                })
            })
        }, r.prototype.updateLabel = function () {
            this.bumpButton.className = this.bumped ? "fa fa-minus-circle" : "fa fa-plus-circle", this.dasSource.collapseSuperGroups ? this.bumpButton.style.display = "inline-block" : this.bumpButton.style.display = "none"
        }, r.prototype.updateHeight = function () {
            this.currentHeight = Math.max(Math.max(this.layoutHeight, this.label.clientHeight + 2), this.browser.minTierHeight), this.row.style.height = "" + this.currentHeight + "px", this.browser.updateHeight()
        }, r.prototype.drawOverlay = function () {
            var e = this, t = this.browser, i = t.retina && window.devicePixelRatio > 1;
            e.overlay.height = e.viewport.height, e.overlay.width = i ? 2 * t.featurePanelWidth : t.featurePanelWidth;
            var r = e.overlay.getContext("2d");
            i && r.scale(2, 2);
            var n = t.viewStart, s = t.viewStart, o = t.viewEnd;
            if (this.overlayLabelCanvas) {
                var a = (this.glyphCacheOrigin - this.browser.viewStart) * this.browser.scale;
                r.save(), r.translate(a, 0);
                var l = -a + 2;
                this.dasSource.tierGroup && (l += 15), this.overlayLabelCanvas.draw(r, l, t.featurePanelWidth - a), r.restore()
            }
            for (var h = 0; h < t.highlights.length; ++h) {
                var u = t.highlights[h];
                (u.chr === t.chr || u.chr === "chr" + t.chr) && u.min < o && u.max > s && (r.globalAlpha = t.defaultHighlightAlpha, r.fillStyle = t.defaultHighlightFill, r.fillRect((u.min - n) * t.scale, 0, (u.max - u.min) * t.scale, e.overlay.height))
            }
            e.overlay.style.width = t.featurePanelWidth, e.overlay.style.height = e.viewport.style.height, e.overlay.style.left = "0px"
        }, r.prototype.updateStatus = function (e) {
            var t = this;
            if (e) {
                this.status = e, this._notifierToStatus();
                b(this.dasSource);
                "https:" !== window.location.protocol || 0 != b(this.dasSource).indexOf("http:") || this.checkedHTTP || (this.checkedHTTP = !0, this.browser.canFetchPlainHTTP().then(function (e) {
                    e || (t.warnHTTP = !0, t._notifierToStatus())
                }))
            } else this.status && (this.status = null, this._notifierToStatus())
        }, r.prototype.notify = function (e, t) {
            if ("number" != typeof t && (t = 2e3), this.notifierFadeTimeout && (clearTimeout(this.notifierFadeTimeout), this.notifierFadeTimeout = null), e) {
                if (this._notifierOn(e), t > 0) {
                    var i = this;
                    this.notifierFadeTimeout = setTimeout(function () {
                        i._notifierToStatus()
                    }, t)
                }
            } else this._notifierToStatus()
        }, r.prototype._notifierOn = function (e, t) {
            o(this.notifier), t ? this.notifier.appendChild(s("span", [s("a", "[HTTP Warning] ", {
                href: this.browser.httpWarningURL,
                target: "_blank"
            }), e])) : this.notifier.textContent = e, this.notifier.style.opacity = .8
        }, r.prototype._notifierOff = function () {
            this.notifier.style.opacity = 0
        }, r.prototype._notifierToStatus = function () {
            this.status ? this._notifierOn(this.status, this.warnHTTP) : this._notifierOff()
        }, r.prototype.setConfig = function (e) {
            this.config = e || {}, this._updateFromConfig(), this.notifyTierListeners()
        }, r.prototype.mergeStylesheet = function (e) {
            this.mergeConfig({stylesheet: e, stylesheetValidity: this.baseStylesheetValidity})
        }, r.prototype.mergeConfig = function (e) {
            for (var t in e) this.config[t] = e[t];
            this._updateFromConfig(), this.notifyTierListeners()
        }, r.prototype._updateFromConfig = function () {
            var e = !1, t = !1;
            "string" == typeof this.config.name ? this.nameElement.textContent = this.config.name : this.nameElement.textContent = this.dasSource.name;
            var i = this.config.height || this.dasSource.forceHeight;
            i != this.forceHeight && (this.forceHeight = i, e = !0), this.forceMinDynamic != this.config.forceMinDynamic && (this.forceMinDynamic = this.config.forceMinDynamic, e = !0);
            var r = void 0 != this.config.forceMin ? this.config.forceMin : this.dasSource.forceMin;
            this.forceMin != r && (this.forceMin = r, e = !0), this.forceMaxDynamic != this.config.forceMaxDynamic && (this.forceMaxDynamic = this.config.forceMaxDynamic, e = !0);
            var n = void 0 != this.config.forceMax ? this.config.forceMax : this.dasSource.forceMax;
            this.forceMax != n && (this.forceMax = n, e = !0);
            var s = null;
            void 0 !== this.config.quantLeapThreshold ? s = this.config.quantLeapThreshold : void 0 !== this.dasSource.quantLeapThreshold && (s = this.dasSource.quantLeapThreshold), s != this.quantLeapThreshold && (this.quantLeapThreshold = s, e = !0);
            var o = null;
            this.config.stylesheetValidity == this.baseStylesheetValidity && (o = this.config.stylesheet), o = o || this.baseStylesheet, this.stylesheet !== o && (this.stylesheet = o, e = !0);
            var a = void 0 !== this.config.pinned ? this.config.pinned : this.dasSource.pinned;
            a !== this.pinned && (this.pinned = a, t = !0);
            var l = this.config.subtierMax;
            l != this.subtierMax && (this.subtierMax = l, e = !0);
            var h;
            h = void 0 !== this.config.bumped ? this.config.bumped : void 0 !== this.dasSource.bumped ? this.dasSource.bumped : this.dasSource.collapseSuperGroups ? !1 : !0, h !== this.bumped && (this.bumped = h, e = !0, this.updateLabel()), e && this.scheduleRedraw(), t && this.browser.reorderTiers()
        }, r.prototype.scheduleRedraw = function () {
            if (this.currentFeatures) {
                var e = this;
                this.redrawTimeout || (this.redrawTimeout = setTimeout(function () {
                    e.draw(), e.redrawTimeout = null
                }, 10))
            }
        }, r.prototype.clearTierListeners = function () {
            this.listeners = []
        }, r.prototype.addTierListener = function (e) {
            this.listeners.push(e)
        }, r.prototype.removeTierListener = function (e) {
            var t = h(this.listeners, e);
            t >= 0 && this.listeners.splice(t, 1)
        }, r.prototype.notifyTierListeners = function (e) {
            for (var t = 0; t < this.listeners.length; ++t) try {
                this.listeners[t](e)
            } catch (i) {
                console.log(i)
            }
            this.browser.notifyTier()
        }, r.prototype.clearFeaturesLoadedListeners = function () {
            this.featuresLoadedListeners = []
        }, r.prototype.addFeaturesLoadedListener = function (e) {
            this.featuresLoadedListeners.push(e)
        }, r.prototype.removeFeaturesLoadedListener = function (e) {
            var t = h(this.featuresLoadedListeners, e);
            t >= 0 && this.featuresLoadedListeners.splice(t, 1)
        }, r.prototype.notifyFeaturesLoaded = function () {
            for (var e = 0; e < this.featuresLoadedListeners.length; ++e) try {
                this.featuresLoadedListeners[e].call(this)
            } catch (t) {
                console.log(t)
            }
        }, "undefined" != typeof t) {
            t.exports = {DasTier: r};
            var x = e("./feature-draw"), S = x.drawFeatureTier, _ = e("./sequence-draw"), C = _.drawSeqTier
        }
    }, {
        "./das": 10,
        "./feature-draw": 18,
        "./sequence-draw": 31,
        "./sha1": 33,
        "./sourcecompare": 35,
        "./style": 37,
        "./utils": 49
    }],
    46: [function (e, t, i) {
        "use strict";

        function r(e, t) {
            for (var i = 0; i < e.length; ++i) {
                var r = e[i];
                r === t ? r.classList.add("active") : r.classList.remove("active")
            }
        }

        if ("undefined" != typeof e) var n = e("./cbrowser"), s = n.Browser, o = e("./sourcecompare"),
            a = o.sourcesAreEqual, l = e("./utils"), h = l.makeElement, u = l.removeChildren, c = l.Observed,
            d = e("./thub"), p = d.THUB_COMPARE, f = d.connectTrackHub, v = e("./domui"), g = v.makeTreeTableSection,
            y = e("./probe").probeResource, m = e("./bin"), b = m.URLFetchable, w = m.BlobFetchable, x = m.readInt,
            S = e("./lh3utils"), _ = S.unbgzf, C = e("./bam"), T = (C.BAM_MAGIC, C.BAI_MAGIC), k = e("./tabix"),
            L = k.TABIX_MAGIC, A = e("./das"), O = A.DASSource, E = A.DASSegment, R = A.DASRegistry, B = A.coordsMatch,
            M = e("./encode").EncodeFetchable;
        s.prototype.currentlyActive = function (e) {
            for (var t = 0; t < this.tiers.length; ++t) if (a(this.tiers[t].dasSource, e)) return this.tiers[t];
            return !1
        }, s.prototype.makeButton = function (e, t) {
            var i = h("a", e, {href: "#"});
            return t && this.makeTooltip(i, t), h("li", i)
        }, s.prototype.showTrackAdder = function (e) {
            function t(e) {
                Se.style.display = "none", de.style.display = "none", xe.style.display = "none", oe = !1, u(he);
                for (var t = h("div", null, {}, {width: "100%"}), i = [], r = 0; r < e.length; ++r) i.push(e[r]);
                i.sort(function (e, t) {
                    return e.shortLabel.toLowerCase().trim().localeCompare(t.shortLabel.toLowerCase().trim())
                });
                for (var n = [], s = [], o = 0; o < i.length; ++o) {
                    var a = i[o];
                    a.children && a.children.length > 0 && "multiWig" != a.container ? n.push(a) : s.push(a)
                }
                s.length > 0 && n.push({shortLabel: "Others", priority: -1e8, children: s}), n.sort(p);
                for (var l = [], c = 0; c < n.length; ++c) {
                    var d = n[c], f = d;
                    !f.dimensions && f._parent && f._parent.dimensions && (f = f._parent);
                    var v = {};
                    if (f.dimensions) for (var y = f.dimensions.split(/(\w+)=(\w+)/), m = 0; m < y.length - 2; m += 3) v[y[m + 1]] = y[m + 2];
                    if (v.dimX && v.dimY) {
                        for (var b = v.dimX, w = v.dimY, x = f.subgroups[b], S = f.subgroups[w], _ = {}, C = 0; C < d.children.length; ++C) {
                            var T = d.children[C], k = T.sgm[b], L = T.sgm[w];
                            _[k] || (_[k] = {}), _[k][L] = T
                        }
                        var A = h("table", null, {className: "table table-striped table-condensed"}, {tableLayout: "fixed"}),
                            O = h("tr");
                        O.appendChild(h("th", null, {}, {width: "150px", height: "100px"}));
                        for (var E = 0; E < x.titles.length; ++E) {
                            var R = h("th", h("div", x.titles[E], {}, {
                                transform: "rotate(-60deg)",
                                transformOrigin: "0% 100%",
                                webkitTransform: "rotate(-60deg) translate(20px,10px)",
                                webkitTransformOrigin: "0% 100%",
                                textAlign: "left"
                            }), {}, {width: "35px", height: "100px", verticalAlign: "bottom"});
                            O.appendChild(R)
                        }
                        A.appendChild(O);
                        for (var B = h("tbody", null, {className: "table table-striped table-condensed"}), M = 0; M < S.titles.length; ++M) {
                            var L = S.tags[M], H = h("tr");
                            H.appendChild(h("th", S.titles[M]), {});
                            for (var P = 0; P < x.titles.length; ++P) {
                                var k = x.tags[P], F = h("td");
                                if (_[k] && _[k][L]) {
                                    var a = _[k][L], N = a.toDallianceSource();
                                    if (!N) continue;
                                    var G = h("tr"), D = h("td");
                                    D.style.textAlign = "center";
                                    var q = h("input");
                                    q.type = "checkbox", q.dalliance_source = N, ue && (q.dalliance_mapping = ue), l.push(q), F.appendChild(q), q.addEventListener("change", function (e) {
                                        e.target.checked ? I.addTier(e.target.dalliance_source) : I.removeTier(e.target.dalliance_source)
                                    })
                                }
                                H.appendChild(F)
                            }
                            B.appendChild(H)
                        }
                        A.appendChild(B), t.appendChild(g(d.shortLabel, A, 0 == c))
                    } else {
                        var U = h("tbody", null, {className: "table table-striped table-condensed"}),
                            z = h("table", U, {className: "table table-striped table-condensed"}, {
                                width: "100%",
                                tableLayout: "fixed"
                            }), W = 0;
                        d.children.sort(p);
                        for (var r = 0; r < d.children.length; ++r) {
                            var a = d.children[r], N = a.toDallianceSource();
                            if (N) {
                                var G = h("tr"), D = h("td", null, {}, {width: "30px"});
                                D.style.textAlign = "center";
                                var q = h("input");
                                q.type = "checkbox", q.dalliance_source = N, ue && (q.dalliance_mapping = ue), l.push(q), D.appendChild(q), q.addEventListener("change", function (e) {
                                    e.target.checked ? I.addTier(e.target.dalliance_source) : I.removeTier(e.target.dalliance_source)
                                }), G.appendChild(D);
                                var V = h("td");
                                V.appendChild(document.createTextNode(a.shortLabel)), a.longLabel && a.longLabel.length > 0 && I.makeTooltip(V, a.longLabel), G.appendChild(V), U.appendChild(G), ++W
                            }
                        }
                        n.length > 1 || "Others" !== d.shortLabel ? t.appendChild(g(d.shortLabel, z, 0 == c)) : t.appendChild(z)
                    }
                }
                var X = function () {
                    for (var e = 0; e < l.length; ++e) {
                        var t = l[e], i = I.currentlyActive(t.dalliance_source);
                        i ? (t.checked = !0, t.disabled = null != i.sequenceSource) : t.checked = !1
                    }
                };
                X(), I.addTierListener(function (e) {
                    X()
                }), he.appendChild(t)
            }

            function i() {
                r(P, K), oe = "bin", Se.style.display = "none", de.style.display = "inline", xe.style.display = "none", u(he);
                var e = h("div", null, {}, {paddingLeft: "10px", paddingRight: "10px"});
                e.appendChild(h("h3", "Add custom URL-based data")), e.appendChild(h("p", ["You can add indexed binary data hosted on an web server that supports CORS (", h("a", "full details", {href: "http://www.biodalliance.org/bin.html"}), ").  Currently supported formats are bigwig, bigbed, and indexed BAM."])), e.appendChild(h("br")), e.appendChild(document.createTextNode("URL: ")), J = h("input", "", {
                    size: 80,
                    value: "http://www.biodalliance.org/datasets/ensGene.bb"
                }, {width: "100%"}), e.appendChild(J), e.appendChild(h("br")), e.appendChild(h("b", "- or -")), e.appendChild(h("br")), e.appendChild(document.createTextNode("File: ")), re = h("input", null, {
                    type: "file",
                    multiple: "multiple"
                }), e.appendChild(re), e.appendChild(h("p", 'Clicking the "Add" button below will initiate a series of test queries.')), he.appendChild(e), J.focus()
            }

            function n() {
                r(P, Y), Se.style.display = "none", de.style.display = "inline", xe.style.display = "none", oe = "hub-connect", Se.style.visibility = "hidden", u(he);
                var e = h("div", null, {}, {paddingLeft: "10px", paddingRight: "10px"});
                e.appendChild(h("h3", "Connect to a track hub.")), e.appendChild(h("p", ['Enter the top-level URL (usually points to a file called "hub.txt") of a UCSC-style track hub'])), J = h("input", "", {
                    size: 120,
                    value: "http://www.biodalliance.org/datasets/testhub/hub.txt"
                }, {width: "100%"}), e.appendChild(J), he.appendChild(e), J.focus()
            }

            function s() {
                r(P, j), Se.style.display = "none", de.style.display = "inline", xe.style.display = "none", oe = "das", u(he);
                var e = h("div", null, {}, {paddingLeft: "10px", paddingRight: "10px"});
                e.appendChild(h("h3", "Add custom DAS data")), e.appendChild(h("p", "This interface is intended for adding custom or lab-specific data.  Public data can be added more easily via the registry interface.")), e.appendChild(document.createTextNode("URL: ")), e.appendChild(h("br")), J = h("input", "", {
                    size: 80,
                    value: "http://www.derkholm.net:8080/das/medipseq_reads/"
                }, {width: "100%"}), e.appendChild(J), e.appendChild(h("p", 'Clicking the "Add" button below will initiate a series of test queries.  If the source is password-protected, you may be prompted to enter credentials.')), he.appendChild(e), J.focus()
            }

            function o() {
                if (oe) {
                    if ("das" === oe) {
                        var e = J.value.trim();
                        /^.+:\/\//.exec(e) || (e = "http://" + e);
                        var t = new O({name: "temporary", uri: e});
                        pe(t)
                    } else if ("bin" === oe) {
                        var r = re.files;
                        if (r && r.length > 0) me(r); else {
                            var e = J.value.trim();
                            /^.+:\/\//.exec(e) || (e = "http://" + e);
                            var o = {uri: e}, l = e.toLowerCase();
                            0 == l.indexOf("https://www.encodeproject.org/") && l.indexOf("@@download") >= 0 && (o.transport = "encode"), ve(o)
                        }
                    } else if ("reset" === oe) s(); else if ("reset-bin" === oe) i(); else if ("reset-hub" === oe) n(); else if ("prompt-bai" === oe) {
                        var r = re.files;
                        r && r.length > 0 && r[0] ? (ae.baiBlob = r[0], m(ae)) : d(ae)
                    } else if ("prompt-tbi" === oe) {
                        var r = re.files;
                        r && r.length > 0 && r[0] ? (ae.indexBlob = r[0], S(ae)) : v(ae)
                    } else if ("finalize" === oe || "finalize-bin" === oe) {
                        ae.name = ee.value;
                        var h = te.value;
                        "__default__" != h ? ae.mapping = h : ae.mapping = void 0, ie && (ae.maxbins = ie.checked), ne.value.length > 1 && se.value.length > 1 && (ae.xUser = ne.value, ae.xPass = se.value), I.addTier(ae), "finalize-bin" == oe ? i() : s()
                    } else if ("hub-connect" === oe) {
                        var e = J.value.trim();
                        /^.+:\/\//.exec(e) || (e = "http://" + e), a(e)
                    } else if ("multiple" === oe) {
                        for (var u = 0; u < ye.length; ++u) {
                            var c = ye[u];
                            if (!c.hidden && ("bam" != c.tier_type || c.indexBlob || c.indexUri) && ("tabix" != c.tier_type || c.indexBlob || c.indexUri)) {
                                var t = fe(c);
                                t && (t.noPersist = !0, I.addTier(t))
                            }
                        }
                        i()
                    }
                } else I.removeAllPopups()
            }

            function a(e, i, n) {
                i = i || {};
                for (var s = 0; s < I.hubObjects.length; ++s) {
                    var o = I.hubObjects[s];
                    if (o.hub.url == e) {
                        for (var l = 0; l < P.length; ++l) P[l].hub == o && r(P, P[l]);
                        return void o.getTracks(function (e, i) {
                            i && console.log(i), t(e)
                        })
                    }
                }
                f(e, function (s, o) {
                    if (o) return n ? (u(he), he.appendChild(h("h2", "Error connecting to track hub")), he.appendChild(h("p", o)), void(oe = "reset-hub")) : a(e, {credentials: !0}, !0);
                    var l = null, c = null;
                    for (var d in s.genomes) {
                        var p = null, f = !1;
                        if (d == I.coordSystem.ucscName) f = !0; else for (var v in I.chains) {
                            var g = I.chains[v];
                            d == g.coords.ucscName && (p = v, f = !0)
                        }
                        if (f) {
                            var y = {url: e, genome: d};
                            i.credentials && (y.credentials = !0), p && (y.mapping = p, s.genomes[d].mapping = p), I.hubs.push(y), I.hubObjects.push(s.genomes[d]);
                            var m = W(s.genomes[d]);
                            $.appendChild(m), p && l || (l = s.genomes[d], c = m)
                        }
                    }
                    return l ? (I.notifyTier(), r(P, c), l.getTracks(function (e, i) {
                        t(e)
                    }), void 0) : (u(he), he.appendChild(h("h2", "No data for this genome")), he.appendChild(h("p", "This URL appears to be a valid track-hub, but it doesn't contain any data for the coordinate system of this browser")), he.appendChild(h("p", "coordSystem.ucscName = " + I.coordSystem.ucscName)), void(oe = "reset-hub"))
                }, i)
            }

            function l(e, t) {
                function i() {
                    return t ? ge(e) : l(e, !0)
                }

                var r = e.uri;
                if (t) {
                    var n = /(.+)\/[^\/]+\/?/.exec(r);
                    n && (r = n[1] + "/sources")
                }
                new R(r, {credentials: e.credentials}).sources(function (t) {
                    if (!t || 0 == t.length) return i();
                    var r = null;
                    if (1 == t.length) r = t[0]; else for (var n = 0; n < t.length; ++n) if (t[n].uri === e.uri) {
                        r = t[n];
                        break
                    }
                    var s = !1, o = !1;
                    if (r && (e.name = r.name, e.desc = r.desc, r.maxbins ? e.maxbins = !0 : e.maxbins = !1, r.capabilities && (e.capabilities = r.capabilities), o = !0, r.coords && 1 == r.coords.length)) {
                        var a = r.coords[0];
                        if (B(a, I.coordSystem)) s = !0; else if (I.chains) for (var l in I.chains) B(a, I.chains[l].coords) && (e.mapping = l, s = !0)
                    }
                    return ge(e, s, o)
                }, function () {
                    return i()
                })
            }

            function d(e) {
                Se.style.display = "none", de.style.display = "inline", xe.style.display = "inline", u(he), oe = "prompt-bai", he.appendChild(h("h2", "Select an index file")), he.appendChild(h("p", "Dalliance requires a BAM index (.bai) file when displaying BAM data.  These normally accompany BAM files.  For security reasons, web applications like Dalliance can only access local files which you have explicity selected.  Please use the file chooser below to select the appropriate BAI file")), he.appendChild(document.createTextNode("Index file: ")), re = h("input", null, {type: "file"}), he.appendChild(re), ae = e
            }

            function v(e) {
                Se.style.display = "none", de.style.display = "inline", xe.style.display = "inline", u(he), oe = "prompt-tbi", he.appendChild(h("h2", "Select an index file")), he.appendChild(h("p", "Dalliance requires a Tabix index (.tbi) file when displaying VCF data.  For security reasons, web applications like Dalliance can only access local files which you have explicity selected.  Please use the file chooser below to select the appropriate BAI file")), he.appendChild(document.createTextNode("Index file: ")), re = h("input", null, {type: "file"}), he.appendChild(re), ae = e
            }

            function m(e) {
                var t;
                t = e.baiBlob ? new w(e.baiBlob) : "encode" == e.transport ? new M(e.bamURI + ".bai") : new b(e.bamURI + ".bai", {credentials: e.credentials}), t.slice(0, 256).fetch(function (t) {
                    var i = !1;
                    if (t) {
                        var r = new Uint8Array(t), n = x(r, 0);
                        i = n == T
                    }
                    return i ? ge(e, !1, !1, !0) : C("You have selected a valid BAM file, but a corresponding index (.bai) file was not found.  Please index your BAM (samtools index) and place the BAI file in the same directory")
                })
            }

            function S(e) {
                var t;
                t = e.indexBlob ? new w(e.indexBlob) : new b(e.uri + ".tbi"), t.slice(0, 65536).fetch(function (t) {
                    var i = !1;
                    if (t) {
                        var r = new Uint8Array(t);
                        if (31 == r[0] || 139 == r[1]) {
                            var n = _(t);
                            r = new Uint8Array(n);
                            var s = x(r, 0);
                            i = s == L
                        }
                    }
                    return i ? ge(e, !1, !1, !0) : C('You have selected a valid VCF file, but a corresponding index (.tbi) file was not found.  Please index your VCF ("tabix -p vcf -f myfile.vcf.gz") and place the .tbi file in the same directory')
                })
            }

            function C(e) {
                Se.style.display = "none", de.style.display = "inline", xe.style.display = "inline", u(he), e = e || "Custom data format not recognized", he.appendChild(h("h2", "Error adding custom data")), he.appendChild(h("p", e)), he.appendChild(h("p", "Currently supported formats are bigBed, bigWig, and BAM.")), oe = "reset-bin"
            }

            if ("add" === this.uiMode) return this.hideToolPanel(), void this.setUiMode("none");
            var k, A, I = this, H = h("div", null, {className: "dalliance"}, {
                width: "100%",
                display: "inline-block",
                boxSizing: "border-box",
                MozBoxSizing: "border-box",
                verticalAlign: "top",
                paddingRight: "15px"
            }), P = [];
            if (!this.noRegistryTabs) {
                var F = this.makeButton("Registry", "Browse compatible datasources from the DAS registry");
                P.push(F);
                for (var N in this.mappableSources) {
                    var G = function (e) {
                        var t = I.makeButton(I.chains[e].srcTag, "Browse datasources mapped from " + I.chains[e].srcTag);
                        P.push(t), t.addEventListener("click", function (i) {
                            i.preventDefault(), i.stopPropagation(), r(P, t), k(I.mappableSources[e], e)
                        }, !1)
                    };
                    G(N)
                }
            }
            for (var D = {}, q = 0; q < this.defaultSources.length; ++q) {
                var U = this.defaultSources[q], z = U.group || "Defaults";
                D[z] ? D[z].push(U) : D[z] = [U]
            }
            var W = function (e) {
                var i = e.hub, s = h("i", null, {className: "fa fa-list-alt"}, {cursor: "context-menu"}),
                    o = i.altLabel || i.shortLabel || "Unknown";
                e.mapping && (o = o + " (" + e.genome + ")");
                var a = h("span", [o, " ", s]), l = I.makeButton(a, i.longLabel);
                return l.hub = e, P.push(l), l.addEventListener("click", function (i) {
                    i.preventDefault(), i.stopPropagation(), r(P, l), u(he);
                    var n = I.makeLoader(24);
                    n.style.marginLeft = "auto", n.style.marginRight = "auto", n.style.marginTop = "100px", he.appendChild(h("div", n, null, {textAlign: "center"})), Se.style.display = "none", de.style.display = "none", xe.style.display = "none", e.getTracks(function (e, i) {
                        i && console.log(i), t(e)
                    })
                }, !1), s.addEventListener("click", function (t) {
                    t.preventDefault(), t.stopPropagation();
                    var i = h("li", h("a", "Remove hub")), s = h("li", h("a", "Enable all")),
                        o = h("li", h("a", "Disable all")),
                        a = h("ul", [i, s, o], {className: "dropdown-menu"}, {display: "block"}), u = t.clientX,
                        c = t.clientY;
                    u += document.documentElement.scrollLeft || document.body.scrollLeft, c += document.documentElement.scrollTop || document.body.scrollTop, a.style.position = "absolute", a.style.top = "" + (c + 10) + "px", a.style.left = "" + (u - 30) + "px", I.hPopupHolder.appendChild(a);
                    var d = function (e) {
                        console.log("cc"), document.body.removeEventListener("click", d, !0), I.hPopupHolder.removeChild(a)
                    };
                    document.body.addEventListener("click", d, !0), i.addEventListener("click", function (t) {
                        for (var i = 0; i < I.hubObjects.length; ++i) if (I.hubObjects[i].absURL == e.absURL) {
                            I.hubObjects.splice(i, 1);
                            break
                        }
                        for (var i = 0; i < I.hubs.length; ++i) {
                            var s = I.hubs[i];
                            if ("string" == typeof s && (s = {url: s}), s.url == e.hub.url && !s.genome || s.genome == e.genome) {
                                I.hubs.splice(i, 1);
                                break
                            }
                        }
                        I.notifyTier(), $.removeChild(l), r(P, Y), n()
                    }, !1), s.addEventListener("click", function (t) {
                        e.getTracks(function (e, t) {
                            t && console.log(t);
                            for (var i = 0; i < e.length; ++i) {
                                var r = e[i].toDallianceSource();
                                I.currentlyActive(r) || I.addTier(r)
                            }
                        })
                    }, !1), o.addEventListener("click", function (t) {
                        e.getTracks(function (e, t) {
                            t && console.log(t);
                            for (var i = 0; i < e.length; ++i) {
                                var r = e[i].toDallianceSource();
                                I.currentlyActive(r) && I.removeTier(r)
                            }
                        })
                    }, !1)
                }, !1), l
            }, V = null, X = null;
            for (var z in D) !function (e, t) {
                var i = I.makeButton(e, "Browse the default set of data for this browser");
                i.addEventListener("click", function (e) {
                    e.preventDefault(), e.stopPropagation(), r(P, i), k(new c(t))
                }, !1), P.push(i), V || (V = i, X = t)
            }(z, D[z]);
            var j = this.makeButton("DAS", "Add arbitrary DAS data");
            P.push(j);
            var K = this.makeButton("Binary", "Add data in bigwig or bigbed format");
            P.push(K);
            for (var Z = 0; Z < this.hubObjects.length; ++Z) {
                var Q = this.hubObjects[Z];
                W(Q)
            }
            var Y = this.makeButton("+", "Connect to a new track-hub");
            P.push(Y);
            var $ = h("ul", P, {className: "nav nav-tabs"}, {marginBottom: "0px"});
            H.appendChild($);
            var J, ee, te, ie, re, ne, se, oe = !1, ae = null,
                le = h("form", null, {}, {display: "inline-block", width: "100%"});
            le.addEventListener("submit", function (e) {
                return e.stopPropagation(), e.preventDefault(), o(), !1
            }, !0);
            var he = h("div");
            he.style.position = "relative", he.style.overflow = "scroll", le.appendChild(he);
            var ue, ce;
            k = function (e, t) {
                Se.style.display = "none", de.style.display = "none", xe.style.display = "none", ce && ce.removeListener(A), ue = t, ce = e, ce.addListenerAndFire(A)
            }, A = function (e) {
                oe = !1;
                var t = [];
                if (u(he), !e) return void he.appendChild(h("p", "Dalliance was unable to retrieve data source information from the DAS registry, please try again later"));
                for (var i = h("tbody", null, {className: "table table-striped table-condensed"}, {width: "100%"}), r = h("table", i, {className: "table table-striped table-condensed"}, {
                    width: "100%",
                    tableLayout: "fixed"
                }), n = 0, s = [], o = 0; o < e.length; ++o) s.push(e[o]);
                s.sort(function (e, t) {
                    return e.name.toLowerCase().trim().localeCompare(t.name.toLowerCase().trim())
                });
                for (var o = 0; o < s.length; ++o) {
                    var a = s[o], l = h("tr"), c = h("td", null, {}, {width: "30px"});
                    if (c.style.textAlign = "center", !a.props || a.props.cors) {
                        var d = h("input");
                        d.type = "checkbox", d.dalliance_source = a, ue && (d.dalliance_mapping = ue), c.appendChild(d), t.push(d), d.addEventListener("change", function (e) {
                            e.target.checked ? I.addTier(e.target.dalliance_source) : I.removeTier(e.target.dalliance_source)
                        })
                    } else c.appendChild(document.createTextNode("!")), I.makeTooltip(c, h("span", ["This data source isn't accessible because it doesn't support ", h("a", "CORS", {href: "http://www.w3.org/TR/cors/"}), "."]));
                    l.appendChild(c);
                    var p = h("td");
                    p.appendChild(document.createTextNode(a.name)), a.desc && a.desc.length > 0 && I.makeTooltip(p, a.desc), l.appendChild(p), i.appendChild(l), ++n
                }
                var f = function () {
                    for (var e = 0; e < t.length; ++e) {
                        var i = t[e], r = I.currentlyActive(i.dalliance_source);
                        r ? i.checked = !0 : i.checked = !1
                    }
                };
                f(), I.addTierListener(function (e) {
                    f()
                }), he.appendChild(r)
            }, F && F.addEventListener("click", function (e) {
                e.preventDefault(), e.stopPropagation(), r(P, F), k(I.availableSources)
            }, !1), K.addEventListener("click", function (e) {
                e.preventDefault(), e.stopPropagation(), i()
            }, !1), Y.addEventListener("click", function (e) {
                e.preventDefault(), e.stopPropagation(), n()
            }, !1), j.addEventListener("click", function (e) {
                e.preventDefault(), e.stopPropagation(), s()
            }, !1);
            var de = h("button", "Add", {className: "btn btn-primary"});
            de.addEventListener("click", function (e) {
                e.stopPropagation(), e.preventDefault(), o()
            }, !1);
            var pe = function (e, t) {
                var i = I.knownSpace;
                if (!i) return void alert("Can't confirm track-addition to an uninit browser.");
                var r = 0 | Math.max(i.min, (i.min + i.max - 100) / 2), n = new E(i.chr, r, Math.min(r + 99, i.max));
                e.features(n, {}, function (i, r) {
                    if (!r) {
                        var n = new RegExp("/([^/]+)/?$"), s = n.exec(e.uri);
                        return s && (e.name = s[1]), void l(e)
                    }
                    return t ? (u(he), he.appendChild(h("h2", "Custom data not found")), he.appendChild(h("p", "DAS uri: " + e.uri + " is not answering features requests")), void(oe = "reset")) : (e.credentials = !0, void pe(e, !0))
                })
            }, fe = function (e) {
                var t = {name: e.name};
                return e.credentials && (t.credentials = e.credentials), e.mapping && "__default__" != e.mapping && (t.mapping = e.mapping), e.transport && (t.transport = e.transport), "bwg" == e.tier_type ? (e.blob ? t.bwgBlob = e.blob : e.uri && (t.bwgURI = e.uri), t) : "bam" == e.tier_type ? (e.blob ? (t.bamBlob = e.blob, t.baiBlob = e.indexBlob) : (t.bamURI = e.uri, t.baiURI = e.indexUri), t) : "tabix" == e.tier_type ? (t.tier_type = "tabix", t.payload = e.payload, e.blob ? (t.blob = e.blob, t.indexBlob = e.indexBlob) : (t.uri = e.uri, t.indexUri = e.indexUri), t) : "memstore" == e.tier_type ? (t.tier_type = "memstore", t.payload = e.payload, e.blob ? t.blob = e.blob : t.uri = e.uri, t) : void 0
            }, ve = function (e) {
                y(e, function (e, t) {
                    if (!t) {
                        var i = fe(e);
                        return "bam" == e.tier_type ? m(i) : "tabix" == e.tier_type ? S(i) : ge(i, !1, !1, !0)
                    }
                    u(he);
                    var r = h("div");
                    r.appendChild(h("h2", "Couldn't access custom data")), r.appendChild(h("p", "" + t)), he.appendChild(r), console.log(e), "https:" === window.location.protocol && 0 == e.uri.indexOf("http:") && I.canFetchPlainHTTP().then(function (e) {
                        e || r.appendChild(h("p", [h("strong", "HTTP warning: "), "you may not be able to access HTTP resources from an instance of Biodalliance which you are accessing via HTTPS.", h("a", "[More info]", {
                            href: I.httpWarningURL,
                            target: "_blank"
                        })]))
                    }), oe = "reset-bin"
                })
            }, ge = function (e, t, i, r) {
                if (Se.style.display = "none", de.style.display = "inline", xe.style.display = "inline", u(he), he.appendChild(h("h2", "Add custom data: step 2")), he.appendChild(document.createTextNode("Label: ")), ee = h("input", "", {value: e.name}), he.appendChild(ee), ne = h("input", ""), se = h("input", ""), he.appendChild(h("br")), he.appendChild(h("br")), he.appendChild(h("h4", "Coordinate system: ")), te = h("select", null), te.appendChild(h("option", I.nameForCoordSystem(I.coordSystem), {value: "__default__"})), I.chains) for (var n in I.chains) {
                    var s = I.chains[n].coords;
                    te.appendChild(h("option", I.nameForCoordSystem(s), {value: n}))
                }
                te.value = e.mapping || "__default__", he.appendChild(te), t ? he.appendChild(h("p", "(Based on server response, probably doesn't need changing.)")) : (he.appendChild(h("p", [h("b", "Warning: "), "unable to determine the correct value from server responses.  Please check carefully."])), he.appendChild(h("p", "If you don't see the mapping you're looking for, please contact thomas@biodalliance.org"))), r || (he.appendChild(document.createTextNode("Quantitative: ")), ie = h("input", null, {
                    type: "checkbox",
                    checked: !0
                }), "undefined" != typeof e.maxbins && (ie.checked = e.maxbins), he.appendChild(ie), i ? he.appendChild(h("p", "(Based on server response, probably doesn't need changing.)")) : he.appendChild(h("p", [h("b", "Warning: "), "unable to determine correct value.  If in doubt, leave checked."]))), e.bwgBlob && he.appendChild(h("p", [h("b", "Warning: "), "data added from local file.  Due to the browser security model, the track will disappear if you reload Dalliance."])), ee.focus(), oe = "bin" === oe || "prompt-bai" === oe || "prompt-tbi" === oe ? "finalize-bin" : "finalize", ae = e
            }, ye = null, me = function (e) {
                var t = ye = [];
                oe = "multiple";
                for (var i = 0; i < e.length; ++i) {
                    var r = e[i];
                    r && t.push({blob: r})
                }
                for (var i = 0; i < t.length; ++i) be(t[i]);
                we()
            }, be = function (e) {
                y(e, function (e, t) {
                    t && (e.error = t);
                    for (var i = [], r = {}, n = {}, s = 0; s < ye.length; ++s) {
                        var o = ye[s];
                        "bam" != o.tier_type || o.indexBlob || (r[o.blob.name] = o), "tabix" != o.tier_type || o.indexBlob || (n[o.blob.name] = o)
                    }
                    for (var s = 0; s < ye.length; ++s) {
                        var o = ye[s];
                        if ("bai" === o.tier_type) {
                            var a = new RegExp("(.+)\\.bai$"), l = a.exec(o.blob.name);
                            l && r[l[1]] && (r[l[1]].indexBlob = o.blob, i.push(s))
                        } else if ("tabix-index" === o.tier_type) {
                            var h = new RegExp("(.+)\\.tbi$"), l = h.exec(o.blob.name);
                            l && n[l[1]] && (n[l[1]].indexBlob = o.blob, i.push(s))
                        }
                    }
                    for (var u = i.length - 1; u >= 0; --u) ye.splice(i[u], 1);
                    we()
                })
            }, we = function () {
                u(he);
                var e = !1, t = h("table", ye.filter(function (e) {
                    return !e.hidden
                }).map(function (t) {
                    var i = h("tr");
                    i.appendChild(h("td", t.name || t.blob.name));
                    var r;
                    r = t.error ? h("span", "Error", null, {color: "red"}) : t.tier_type ? t.payload || t.tier_type : I.makeLoader(16);
                    var n, s = "unknown";
                    if ("bwg" == t.tier_type || "memstore" == t.tier_type ? s = "okay" : "bam" == t.tier_type ? s = t.indexBlob ? "okay" : "needs-index" : "tabix" == t.tier_type && (s = t.indexBlob ? "okay" : "needs-index"), "okay" == s) {
                        if (n = h("select", null, null, {width: "150px"}), n.appendChild(h("option", I.nameForCoordSystem(I.coordSystem), {value: "__default__"})), I.chains) for (var o in I.chains) {
                            var a = I.chains[o].coords;
                            n.appendChild(h("option", I.nameForCoordSystem(a), {value: o}))
                        }
                        n.value = t.mapping || "__default__", n.addEventListener("change", function (e) {
                            t.mapping = n.value, console.log(t)
                        }, !1)
                    } else "needs-index" == s && (n = h("span", "Needs index", {}, {color: "red"}), e = !0);
                    return h("tr", [h("td", t.name || t.blob.name), h("td", r), h("td", n)])
                }), {className: "table table-striped table-condensed"});
                if (he.appendChild(t), e) {
                    he.appendChild(h("p", "Some of these files are missing required index (.bai or .tbi) files.  For security reasons, web applications like Dalliance can only access local files which you have explicity selected.  Please use the file chooser below to select the appropriate index file")), he.appendChild(document.createTextNode("Index file(s): "));
                    var i = h("input", null, {type: "file", multiple: "multiple"});
                    he.appendChild(i), i.addEventListener("change", function (e) {
                        console.log("fileset changed");
                        for (var t = i.files || [], r = 0; r < t.length; ++r) {
                            var n = t[r];
                            if (n) {
                                var s = {blob: n, hidden: !0};
                                ye.push(s), be(s)
                            }
                        }
                    }, !1)
                }
            }, xe = h("button", "Cancel", {className: "btn"});
            xe.addEventListener("click", function (e) {
                e.stopPropagation(), e.preventDefault(), "finalize-bin" === oe ? i() : s()
            }, !1);
            var Se = h("button", "Refresh", {className: "btn"});
            Se.addEventListener("click", function (e) {
                e.stopPropagation(), e.preventDefault(), I.queryRegistry(ue)
            }, !1), this.makeTooltip(Se, "Click to re-fetch data from the DAS registry");
            var _e = h("div", [de, " ", xe, " ", Se]);
            _e.style.margin = "10px", le.appendChild(_e), H.appendChild(le), k(I.availableSources), this.showToolPanel(H), this.setUiMode("add"), V && (r(P, V), k(new c(X)))
        }
    }, {
        "./bam": 1, "./bin": 4, "./cbrowser": 6, "./das": 10, "./domui": 11, "./encode": 12,
        "./lh3utils": 24, "./probe": 28, "./sourcecompare": 35, "./tabix": 41, "./thub": 42, "./utils": 49
    }],
    47: [function (e, t, i) {
        "use strict";

        function r(e, t, i) {
            t.fetchAsText(function (t) {
                if (!t) return i(null, "Couldn't fetch index-index");
                for (var r = t.split(/(.+)([0-9A-F]{10})\n/), s = [], o = [], a = 1; a < r.length; a += 3) s.push(r[a]), o.push(parseInt(r[a + 1], 16));
                return i(new n(s, o, e))
            })
        }

        function n(e, t, i) {
            this.keys = e, this.offsets = t, this.ix = i
        }

        n.prototype.lookup = function (e, t) {
            for (var i, r = (e + "     ").substring(0, 5).toLowerCase(), n = 0; n < this.keys.length; ++n) if (r.localeCompare(this.keys[n]) < 0) {
                i = this.ix.slice(this.offsets[n - 1], this.offsets[n] - this.offsets[n - 1]);
                break
            }
            i || (i = this.ix.slice(this.offsets[this.offsets.length - 1])), i.fetchAsText(function (i) {
                for (var r = i.split("\n"), n = 0; n < r.length; ++n) if (0 == r[n].indexOf(e.toLowerCase() + " ")) return t(r[n].split(" "));
                return t(null)
            })
        }, "undefined" != typeof t && (t.exports = {connectTrix: r})
    }, {}],
    48: [function (e, t, i) {
        "use strict";

        function r() {
        }

        function n(e, t) {
            var i = new r;
            i.data = e;
            var n = 12500;
            i.data.slice(0, n).fetch(function (e) {
                if (!e) return t(null, "Couldn't access data");
                var r = new Uint8Array(e), o = a(r, 0);
                if (o == p) i.readInt = a; else {
                    if (o != f) return t(null, "Not a .2bit file, magic=0x" + o.toString(16));
                    i.readInt = l
                }
                var h = i.readInt(r, 4);
                if (0 != h) return t(null, "Unsupported version " + h);
                i.seqCount = i.readInt(r, 8), i.seqDict = {};
                var u = 16, c = 0, d = 0, v = function () {
                    for (; c < i.seqCount;) {
                        var e = r[u];
                        if (u + e + 6 >= r.length) return i.data.slice(d + u, n).fetch(function (e) {
                            d += u, u = 0, r = new Uint8Array(e), v()
                        });
                        ++u;
                        for (var o = "", a = 1; e >= a; ++a) o += String.fromCharCode(r[u++]);
                        var l = i.readInt(r, u);
                        u += 4, i.seqDict[o] = new s(i, l), ++c
                    }
                    return t(i)
                };
                v()
            })
        }

        function s(e, t) {
            this.tbf = e, this.offset = t
        }

        if ("undefined" != typeof e) var o = e("./bin"), a = o.readInt, l = o.readIntBE, h = e("./spans"), u = h.Range,
            c = h.union, d = h.intersection;
        var p = 440477507, f = 1126646042;
        r.prototype.getSeq = function (e) {
            var t = this.seqDict[e];
            return t || (t = this.seqDict["chr" + e]), t
        }, r.prototype.fetch = function (e, t, i, r) {
            var n = this.getSeq(e);
            return n ? t >= i ? r("") : void n.fetch(t, i, r) : r(null, "Couldn't find " + e)
        }, s.prototype.init = function (e) {
            if (this.seqOffset) return e();
            var t = this;
            t.tbf.data.slice(t.offset, 8).fetch(function (i) {
                if (!i) return e("Fetch failed");
                var r = new Uint8Array(i);
                t._length = t.tbf.readInt(r, 0), t.nBlockCnt = t.tbf.readInt(r, 4), t.tbf.data.slice(t.offset + 8, 8 * t.nBlockCnt + 4).fetch(function (i) {
                    if (!i) return e("Fetch failed");
                    for (var r = new Uint8Array(i), n = null, s = 0; s < t.nBlockCnt; ++s) {
                        var o = t.tbf.readInt(r, 4 * s), a = t.tbf.readInt(r, 4 * (s + t.nBlockCnt)),
                            l = new u(o, o + a - 1);
                        n = n ? c(n, l) : l
                    }
                    return t.nBlocks = n, t.mBlockCnt = t.tbf.readInt(r, 8 * t.nBlockCnt), t.seqLength = (t._length + 3) / 4 | 0, t.seqOffset = t.offset + 16 + 8 * (t.nBlockCnt + t.mBlockCnt), e()
                })
            })
        };
        var v = ["T", "C", "A", "G"];
        s.prototype.fetch = function (e, t, i) {
            --e, --t;
            var r = this;
            this.init(function (n) {
                if (n) return i(null, n);
                var s = e >> 2, o = t + 3 >> 2;
                return 0 > s || o > r.seqLength ? i("Coordinates out of bounds: " + e + ":" + t) : void r.tbf.data.slice(r.seqOffset + s, o - s).salted().fetch(function (n) {
                    function o(e) {
                        for (; e >= p;) {
                            var t, i = (p >> 2) - s, r = 3 & p, n = a[i];
                            t = 0 == r ? n >> 6 & 3 : 1 == r ? n >> 4 & 3 : 2 == r ? n >> 2 & 3 : 3 & n, c += v[t], ++p
                        }
                    }

                    if (null == n) return i("SeqFetch failed");
                    var a = new Uint8Array(n), l = [];
                    if (r.nBlocks) {
                        var h = d(new u(e, t), r.nBlocks);
                        h && (l = h.ranges())
                    }
                    for (var c = "", p = e, f = 0; f < l.length; ++f) {
                        var g = l[f];
                        if (p > g.min()) throw"N mismatch...";
                        for (p < g.min() && o(g.min() - 1); p <= g.max();) c += "N", ++p
                    }
                    return t >= p && o(t), i(c)
                })
            })
        }, s.prototype.length = function (e) {
            var t = this;
            this.init(function (i) {
                return i ? e(null, i) : e(t._length)
            })
        }, "undefined" != typeof t && (t.exports = {makeTwoBit: n})
    }, {"./bin": 4, "./spans": 36}],
    49: [function (e, t, i) {
        "use strict";

        function r(e, t) {
            for (var i = 0; i < e.length; ++i) if (e[i] == t) return;
            e.push(t)
        }

        function n(e, t, i) {
            e[t] ? e[t].push(i) : e[t] = [i]
        }

        function s(e, t, i) {
            var r = e[t];
            if (r) {
                for (var n = 0; n < r.length; ++n) if (r[n] == i) return;
                r.push(i)
            } else e[t] = [i]
        }

        function o(e, t, i, r) {
            return e ? e : t ? t : i ? i : r ? r : void 0
        }

        function r(e, t) {
            for (var i = 0; i < e.length; ++i) if (e[i] == t) return;
            e.push(t)
        }

        function a(e, t) {
            if (!e) return -1;
            for (var i = 0; i < e.length; ++i) if (e[i] === t) return i;
            return -1
        }

        function l(e, t) {
            var i = a(e, t);
            return i >= 0 ? (e.splice(i, 1), !0) : !1
        }

        function h(e, t, i, r) {
            var n = document.createElement(e);
            if (t) {
                t instanceof Array || (t = [t]);
                for (var s = 0; s < t.length; ++s) {
                    var o = t[s];
                    o && ("string" == typeof o ? o = document.createTextNode(o) : "number" == typeof o && (o = document.createTextNode("" + o)), n.appendChild(o))
                }
            }
            if (i) for (var a in i) try {
                n[a] = i[a]
            } catch (l) {
                throw console.log("error setting " + a), l
            }
            if (r) for (var a in r) n.style[a] = r[a];
            return n
        }

        function u(e, t, i, r) {
            var n = document.createElementNS(e, t);
            if (i) {
                i instanceof Array || (i = [i]);
                for (var s = 0; s < i.length; ++s) {
                    var o = i[s];
                    "string" == typeof o && (o = document.createTextNode(o)), n.appendChild(o)
                }
            }
            return d(n, r), n
        }

        function c(e, t, i) {
            var r = C[t];
            if (!r) {
                for (var n = "", s = 0; s < t.length; ++s) {
                    var o = t.substring(s, s + 1), a = o.toLowerCase();
                    a != o ? n = n + "-" + a : n += o
                }
                C[t] = n, r = n
            }
            e.setAttribute(r, i)
        }

        function d(e, t) {
            if (t) for (var i in t) c(e, i, t[i])
        }

        function p(e) {
            if (e && e.childNodes) for (; e.childNodes.length > 0;) e.removeChild(e.firstChild)
        }

        function f(e, t) {
            if ("undefined" == typeof e) return "undefined";
            if (null == e) return "null";
            if ("string" == typeof e) return "'" + e + "'";
            if ("number" == typeof e) return "" + e;
            if ("boolean" == typeof e) return "" + e;
            if ("object" == typeof e) {
                if (e instanceof Array) {
                    for (var i = null, r = 0; r < e.length; ++r) i = (null == i ? "" : i + ", ") + f(e[r], t);
                    return "[" + (i ? i : "") + "]"
                }
                t = t || {};
                var i = null;
                for (var n in e) t[n] || void 0 != n && "function" != typeof e[n] && (i = (null == i ? "" : i + ", ") + n + ": " + f(e[n], t));
                return "{" + (i ? i : "") + "}"
            }
            return typeof e
        }

        function v(e) {
            var t = {};
            for (var i in e) t[i] = e[i];
            return t
        }

        function g(e) {
            this.value = e, this.listeners = []
        }

        function y() {
            this.queue = []
        }

        function m(e) {
            return e + "?salt=" + _("" + Date.now() + "," + ++T)
        }

        function b(e, t, i) {
            i && i.salt && (e = m(e));
            try {
                var r;
                i && i.timeout && (r = setTimeout(function () {
                    return console.log("timing out " + e), n.abort(), t(null, "Timeout")
                }, i.timeout));
                var n = new XMLHttpRequest;
                n.onreadystatechange = function () {
                    4 == n.readyState && (r && clearTimeout(r), n.status < 200 || n.status >= 300 ? t(null, "Error code " + n.status) : t(n.responseText))
                }, n.open("GET", e, !0), n.responseType = "text", i && i.credentials && (n.withCredentials = !0), n.send("")
            } catch (s) {
                t(null, "Exception " + s)
            }
        }

        function w(e, t) {
            if (0 == t.indexOf("http:") || 0 == t.indexOf("https:")) return t;
            var i = e.lastIndexOf("/");
            return i >= 0 ? e.substr(0, i + 1) + t : t
        }

        function x(e) {
            return h("a", null, {href: e}).href
        }

        if ("undefined" != typeof e) var S = e("./sha1"), _ = S.b64_sha1;
        var C = (new RegExp("[0-9]+"), new RegExp("^[0-9]+$"), {});
        g.prototype.addListener = function (e) {
            this.listeners.push(e)
        }, g.prototype.addListenerAndFire = function (e) {
            this.listeners.push(e), e(this.value)
        }, g.prototype.removeListener = function (e) {
            l(this.listeners, e)
        }, g.prototype.get = function () {
            return this.value
        }, g.prototype.set = function (e) {
            this.value = e;
            for (var t = 0; t < this.listeners.length; ++t) this.listeners[t](e)
        }, y.prototype.provide = function (e) {
            if (void 0 !== this.res) throw"Resource has already been provided.";
            this.res = e;
            for (var t = 0; t < this.queue.length; ++t) this.queue[t](e);
            this.queue = null
        }, y.prototype.await = function (e) {
            return void 0 !== this.res ? (e(this.res), this.res) : void this.queue.push(e)
        };
        var T = 0, k = {
            TTT: "F",
            TTC: "F",
            TTA: "L",
            TTG: "L",
            CTT: "L",
            CTC: "L",
            CTA: "L",
            CTG: "L",
            ATT: "I",
            ATC: "I",
            ATA: "I",
            ATG: "M",
            GTT: "V",
            GTC: "V",
            GTA: "V",
            GTG: "V",
            TCT: "S",
            TCC: "S",
            TCA: "S",
            TCG: "S",
            CCT: "P",
            CCC: "P",
            CCA: "P",
            CCG: "P",
            ACT: "T",
            ACC: "T",
            ACA: "T",
            ACG: "T",
            GCT: "A",
            GCC: "A",
            GCA: "A",
            GCG: "A",
            TAT: "Y",
            TAC: "Y",
            TAA: "*",
            TAG: "*",
            CAT: "H",
            CAC: "H",
            CAA: "Q",
            CAG: "Q",
            AAT: "N",
            AAC: "N",
            AAA: "K",
            AAG: "K",
            GAT: "D",
            GAC: "D",
            GAA: "E",
            GAG: "E",
            TGT: "C",
            TGC: "C",
            TGA: "*",
            TGG: "W",
            CGT: "R",
            CGC: "R",
            CGA: "R",
            CGG: "R",
            AGT: "S",
            AGC: "S",
            AGA: "R",
            AGG: "R",
            GGT: "G",
            GGC: "G",
            GGA: "G",
            GGG: "G"
        };
        "trim" in String.prototype || (String.prototype.trim = function () {
            return this.replace(/^\s+/, "").replace(/\s+$/, "")
        }), "undefined" != typeof t && (t.exports = {
            textXHR: b,
            relativeURL: w,
            resolveUrlToPage: x,
            shallowCopy: v,
            pusho: n,
            pushnew: r,
            pushnewo: s,
            arrayIndexOf: a,
            pick: o,
            makeElement: h,
            makeElementNS: u,
            removeChildren: p,
            miniJSONify: f,
            Observed: g,
            Awaited: y,
            AMINO_ACID_TRANSLATION: k
        })
    }, {"./sha1": 33}],
    50: [function (e, t, i) {
        "use strict";

        function r() {
            this.info = []
        }

        function n(e, t) {
            this.parser = e, this.sink = t
        }

        if ("undefined" != typeof e) {
            var s = e("./sourceadapters"), o = s.registerParserFactory, a = e("./das"), l = a.DASStylesheet,
                h = a.DASStyle, u = a.DASFeature;
            a.DASGroup
        }
        var c = /([^;=]+)(=([^;]+))?;?/, d = /##INFO=<([^>]+)>/, p = /([^,=]+)=([^,]+|"[^"]+"),?/;
        r.prototype.createSession = function (e) {
            return new n(this, e)
        }, n.prototype.parse = function (e) {
            if (0 != e.length) if ("#" != e[0]) {
                var t = e.split("	"), i = new u;
                i.segment = t[0], i.id = t[2], i.refAllele = t[3], i.altAlleles = t[4].split(","), i.min = parseInt(t[1]), i.max = i.min + i.refAllele.length - 1;
                var r = t[7].split(c);
                i.info = {};
                for (var n = 0; n < r.length; n += 4) i.info[r[n + 1]] = r[n + 3];
                var s = i.altAlleles[0], o = i.refAllele;
                s.length > o.length ? (i.type = "insertion", 0 == s.indexOf(o) ? (i.insertion = s.substr(o.length), i.min += o.length, i.max = i.min - 1) : i.insertion = s) : s.length < o.length ? i.type = "deletion" : i.type = "substitution", this.sink(i)
            } else if (e.length > 1 && "#" == e[1]) {
                var a = d.exec(e);
                if (a) {
                    for (var t = a[1].split(p), l = null, h = null, n = 0; n < t.length - 1; n += 3) {
                        var f = t[n + 1], v = t[n + 2].replace(/"/g, "");
                        "ID" == f ? l = v : "Description" == f && (h = v)
                    }
                    l && h && this.parser.info.push({id: l, desc: h})
                }
                return
            }
        }, n.prototype.flush = function () {
        }, r.prototype.getStyleSheet = function (e) {
            var t = new l, i = new h;
            i.glyph = "__INSERTION", i.BUMP = "yes", i.LABEL = "no", i.FGCOLOR = "rgb(50,80,255)", i.BGCOLOR = "#888888", i.STROKECOLOR = "black", t.pushStyle({type: "insertion"}, null, i);
            var i = new h;
            i.glyph = "PLIMSOLL", i.BUMP = "yes", i.LABEL = "no", i.FGCOLOR = "rgb(255, 60, 60)", i.BGCOLOR = "#888888", i.STROKECOLOR = "black", t.pushStyle({type: "deletion"}, null, i);
            var i = new h;
            return i.glyph = "PLIMSOLL", i.BUMP = "yes", i.LABEL = "no", i.FGCOLOR = "rgb(50,80,255)", i.BGCOLOR = "#888888", i.STROKECOLOR = "black", t.pushStyle({type: "default"}, null, i), e(t)
        }, r.prototype.getDefaultFIPs = function (e) {
            var t = this, i = function (e, i) {
                if (i.add("Ref. allele", e.refAllele), i.add("Alt. alleles", e.altAlleles.join(",")), e.info) for (var r = 0; r < t.info.length; ++r) {
                    var n = t.info[r], s = e.info[n.id];
                    void 0 !== s && i.add(n.desc, s)
                }
            };
            e(i)
        }, o("vcf", function () {
            return new r
        })
    }, {"./das": 10, "./sourceadapters": 34}],
    51: [function (e, t, i) {
        "use strict";
        var r = {CONFIG: 5, MAJOR: 0, MINOR: 13, MICRO: 8, BRANCH: ""};
        r.toString = function () {
            var e = "" + this.MAJOR + "." + this.MINOR + "." + this.MICRO;
            return this.PATCH && (e += this.PATCH), this.BRANCH && "" != this.BRANCH && (e = e + "-" + this.BRANCH), e
        }, "undefined" != typeof t && (t.exports = r)
    }, {}],
    52: [function (e, t, i) {
        "use strict";

        function r() {
            function e(e) {
                e = Math.min(e, l), e = Math.max(e, a), c = e, r.style.left = "" + c + "px"
            }

            function t(e) {
                e = Math.min(e, l), e = Math.max(e, a), d = e, n.style.left = "" + d + "px"
            }

            var i = s("hr", null, {className: "slider-track"}), r = s("hr", null, {className: "slider-thumb active"}),
                n = s("hr", null, {className: "slider-thumb"}), o = s("div", [i, r, n], {className: "slider"}), a = 0,
                l = 200, h = 0, u = 200, c = 50, d = 100, p = [];
            o.removeLabels = function () {
                for (var e = 0; e < p.length; ++e) o.removeChild(p[e]);
                p = []
            }, o.addLabel = function (e, t) {
                var i = s("div", t, {className: "slider-label"}, {left: "" + (a + (e - h) * (l - a) / (u - h) | 0) + "px"});
                o.appendChild(i), p.push(i)
            };
            var f = document.createEvent("HTMLEvents");
            f.initEvent("change", !0, !1), Object.defineProperty(o, "value", {
                get: function () {
                    return h + (c - a) * (u - h) / (l - a)
                }, set: function (t) {
                    var i = a + (t - h) * (l - a) / (u - h);
                    e(i)
                }
            }), Object.defineProperty(o, "value2", {
                get: function () {
                    return h + (d - a) * (u - h) / (l - a)
                }, set: function (e) {
                    var i = a + (e - h) * (l - a) / (u - h);
                    t(i)
                }
            }), Object.defineProperty(o, "active", {
                get: function () {
                    return r.classList.contains("active") ? 1 : 2
                }, set: function (e) {
                    1 == e ? (r.classList.add("active"), n.classList.remove("active")) : (n.classList.add("active"), r.classList.remove("active"))
                }
            }), Object.defineProperty(o, "min", {
                get: function () {
                    return h
                }, set: function (e) {
                    h = e
                }
            }), Object.defineProperty(o, "max", {
                get: function () {
                    return u
                }, set: function (e) {
                    u = e
                }
            });
            var v, g, y = function (e) {
                g = this == r ? 1 : 2, g != o.active && (o.active = g, o.dispatchEvent(f)), e.stopPropagation(), e.preventDefault(), window.addEventListener("mousemove", m, !1), window.addEventListener("mouseup", b, !1), v = e.clientX - (1 == g ? c : d)
            };
            r.addEventListener("mousedown", y, !1), n.addEventListener("mousedown", y, !1);
            var m = function (i) {
                1 == g ? e(i.clientX - v) : t(i.clientX - v), o.dispatchEvent(f)
            }, b = function (e) {
                window.removeEventListener("mousemove", m, !1), window.removeEventListener("mouseup", b, !1)
            };
            return o
        }

        if ("undefined" != typeof e) var n = e("./utils"), s = n.makeElement;
        "undefined" != typeof t && (t.exports = r)
    }, {"./utils": 49}],
    53: [function (e, t, i) {
        (function (i, r) {
            (function () {
                "use strict";

                function n(e) {
                    return "function" == typeof e || "object" == typeof e && null !== e
                }

                function s(e) {
                    return "function" == typeof e
                }

                function o(e) {
                    return "object" == typeof e && null !== e
                }

                function a(e) {
                    V = e
                }

                function l(e) {
                    Z = e
                }

                function h() {
                    return function () {
                        i.nextTick(f)
                    }
                }

                function u() {
                    return function () {
                        W(f)
                    }
                }

                function c() {
                    var e = 0, t = new $(f), i = document.createTextNode("");
                    return t.observe(i, {characterData: !0}), function () {
                        i.data = e = ++e % 2
                    }
                }

                function d() {
                    var e = new MessageChannel;
                    return e.port1.onmessage = f, function () {
                        e.port2.postMessage(0)
                    }
                }

                function p() {
                    return function () {
                        setTimeout(f, 1)
                    }
                }

                function f() {
                    for (var e = 0; K > e; e += 2) {
                        var t = te[e], i = te[e + 1];
                        t(i), te[e] = void 0, te[e + 1] = void 0
                    }
                    K = 0
                }

                function v() {
                    try {
                        var t = e, i = t("vertx");
                        return W = i.runOnLoop || i.runOnContext, u()
                    } catch (r) {
                        return p()
                    }
                }

                function g() {
                }

                function y() {
                    return new TypeError("You cannot resolve a promise with itself")
                }

                function m() {
                    return new TypeError("A promises callback cannot return that same promise.")
                }

                function b(e) {
                    try {
                        return e.then
                    } catch (t) {
                        return se.error = t, se
                    }
                }

                function w(e, t, i, r) {
                    try {
                        e.call(t, i, r)
                    } catch (n) {
                        return n
                    }
                }

                function x(e, t, i) {
                    Z(function (e) {
                        var r = !1, n = w(i, t, function (i) {
                            r || (r = !0, t !== i ? C(e, i) : k(e, i))
                        }, function (t) {
                            r || (r = !0, L(e, t))
                        }, "Settle: " + (e._label || " unknown promise"));
                        !r && n && (r = !0, L(e, n))
                    }, e)
                }

                function S(e, t) {
                    t._state === re ? k(e, t._result) : t._state === ne ? L(e, t._result) : A(t, void 0, function (t) {
                        C(e, t)
                    }, function (t) {
                        L(e, t)
                    })
                }

                function _(e, t) {
                    if (t.constructor === e.constructor) S(e, t); else {
                        var i = b(t);
                        i === se ? L(e, se.error) : void 0 === i ? k(e, t) : s(i) ? x(e, t, i) : k(e, t)
                    }
                }

                function C(e, t) {
                    e === t ? L(e, y()) : n(t) ? _(e, t) : k(e, t)
                }

                function T(e) {
                    e._onerror && e._onerror(e._result), O(e)
                }

                function k(e, t) {
                    e._state === ie && (e._result = t, e._state = re, 0 !== e._subscribers.length && Z(O, e))
                }

                function L(e, t) {
                    e._state === ie && (e._state = ne, e._result = t, Z(T, e))
                }

                function A(e, t, i, r) {
                    var n = e._subscribers, s = n.length;
                    e._onerror = null, n[s] = t, n[s + re] = i, n[s + ne] = r, 0 === s && e._state && Z(O, e)
                }

                function O(e) {
                    var t = e._subscribers, i = e._state;
                    if (0 !== t.length) {
                        for (var r, n, s = e._result, o = 0; o < t.length; o += 3) r = t[o], n = t[o + i], r ? B(i, r, n, s) : n(s);
                        e._subscribers.length = 0
                    }
                }

                function E() {
                    this.error = null
                }

                function R(e, t) {
                    try {
                        return e(t)
                    } catch (i) {
                        return oe.error = i, oe
                    }
                }

                function B(e, t, i, r) {
                    var n, o, a, l, h = s(i);
                    if (h) {
                        if (n = R(i, r), n === oe ? (l = !0, o = n.error, n = null) : a = !0, t === n) return void L(t, m())
                    } else n = r, a = !0;
                    t._state !== ie || (h && a ? C(t, n) : l ? L(t, o) : e === re ? k(t, n) : e === ne && L(t, n))
                }

                function M(e, t) {
                    try {
                        t(function (t) {
                            C(e, t)
                        }, function (t) {
                            L(e, t)
                        })
                    } catch (i) {
                        L(e, i)
                    }
                }

                function I(e, t) {
                    var i = this;
                    i._instanceConstructor = e, i.promise = new e(g), i._validateInput(t) ? (i._input = t, i.length = t.length, i._remaining = t.length, i._init(), 0 === i.length ? k(i.promise, i._result) : (i.length = i.length || 0, i._enumerate(), 0 === i._remaining && k(i.promise, i._result))) : L(i.promise, i._validationError())
                }

                function H(e) {
                    return new ae(this, e).promise
                }

                function P(e) {
                    function t(e) {
                        C(n, e)
                    }

                    function i(e) {
                        L(n, e)
                    }

                    var r = this, n = new r(g);
                    if (!j(e)) return L(n, new TypeError("You must pass an array to race.")), n;
                    for (var s = e.length, o = 0; n._state === ie && s > o; o++) A(r.resolve(e[o]), void 0, t, i);
                    return n
                }

                function F(e) {
                    var t = this;
                    if (e && "object" == typeof e && e.constructor === t) return e;
                    var i = new t(g);
                    return C(i, e), i
                }

                function N(e) {
                    var t = this, i = new t(g);
                    return L(i, e), i
                }

                function G() {
                    throw new TypeError("You must pass a resolver function as the first argument to the promise constructor")
                }

                function D() {
                    throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.")
                }

                function q(e) {
                    this._id = de++, this._state = void 0, this._result = void 0, this._subscribers = [], g !== e && (s(e) || G(), this instanceof q || D(), M(this, e))
                }

                function U() {
                    var e;
                    if ("undefined" != typeof r) e = r; else if ("undefined" != typeof self) e = self; else try {
                        e = Function("return this")()
                    } catch (t) {
                        throw new Error("polyfill failed because global object is unavailable in this environment")
                    }
                    var i = e.Promise;
                    (!i || "[object Promise]" !== Object.prototype.toString.call(i.resolve()) || i.cast) && (e.Promise = pe)
                }

                var z;
                z = Array.isArray ? Array.isArray : function (e) {
                    return "[object Array]" === Object.prototype.toString.call(e)
                };
                var W, V, X, j = z, K = 0, Z = ({}.toString, function (e, t) {
                        te[K] = e, te[K + 1] = t, K += 2, 2 === K && (V ? V(f) : X())
                    }), Q = "undefined" != typeof window ? window : void 0, Y = Q || {},
                    $ = Y.MutationObserver || Y.WebKitMutationObserver,
                    J = "undefined" != typeof i && "[object process]" === {}.toString.call(i),
                    ee = "undefined" != typeof Uint8ClampedArray && "undefined" != typeof importScripts && "undefined" != typeof MessageChannel,
                    te = new Array(1e3);
                X = J ? h() : $ ? c() : ee ? d() : void 0 === Q && "function" == typeof e ? v() : p();
                var ie = void 0, re = 1, ne = 2, se = new E, oe = new E;
                I.prototype._validateInput = function (e) {
                    return j(e)
                }, I.prototype._validationError = function () {
                    return new Error("Array Methods must be provided an Array")
                }, I.prototype._init = function () {
                    this._result = new Array(this.length)
                };
                var ae = I;
                I.prototype._enumerate = function () {
                    for (var e = this, t = e.length, i = e.promise, r = e._input, n = 0; i._state === ie && t > n; n++) e._eachEntry(r[n], n)
                }, I.prototype._eachEntry = function (e, t) {
                    var i = this, r = i._instanceConstructor;
                    o(e) ? e.constructor === r && e._state !== ie ? (e._onerror = null, i._settledAt(e._state, t, e._result)) : i._willSettleAt(r.resolve(e), t) : (i._remaining--, i._result[t] = e)
                }, I.prototype._settledAt = function (e, t, i) {
                    var r = this, n = r.promise;
                    n._state === ie && (r._remaining--, e === ne ? L(n, i) : r._result[t] = i), 0 === r._remaining && k(n, r._result)
                }, I.prototype._willSettleAt = function (e, t) {
                    var i = this;
                    A(e, void 0, function (e) {
                        i._settledAt(re, t, e)
                    }, function (e) {
                        i._settledAt(ne, t, e)
                    })
                };
                var le = H, he = P, ue = F, ce = N, de = 0, pe = q;
                q.all = le, q.race = he, q.resolve = ue, q.reject = ce, q._setScheduler = a, q._setAsap = l, q._asap = Z, q.prototype = {
                    constructor: q,
                    then: function (e, t) {
                        var i = this, r = i._state;
                        if (r === re && !e || r === ne && !t) return this;
                        var n = new this.constructor(g), s = i._result;
                        if (r) {
                            var o = arguments[r - 1];
                            Z(function () {
                                B(r, n, o, s)
                            })
                        } else A(i, n, e, t);
                        return n
                    },
                    "catch": function (e) {
                        return this.then(null, e)
                    }
                };
                var fe = U, ve = {Promise: pe, polyfill: fe};
                "function" == typeof define && define.amd ? define(function () {
                    return ve
                }) : "undefined" != typeof t && t.exports ? t.exports = ve : "undefined" != typeof this && (this.ES6Promise = ve), fe()
            }).call(this)
        }).call(this, e("_process"), "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
    }, {_process: 55}],
    54: [function (e, t, i) {
        function r() {
        }

        function n() {
            this.was = [0]
        }

        function s(e, t, i) {
            this.hufts = new Int32Array(3 * v), this.window = new Uint8Array(i), this.end = i, this.checkfn = t, this.mode = z, this.reset(e, null), this.left = 0, this.table = 0, this.index = 0, this.blens = null, this.bb = new Int32Array(1), this.tb = new Int32Array(1), this.codes = new o, this.last = 0, this.bitk = 0, this.bitb = 0, this.read = 0, this.write = 0, this.check = 0, this.inftree = new a
        }

        function o() {
        }

        function a() {
        }

        function l(e, t, i, r, n) {
            return e[0] = J, t[0] = ee, i[0] = te, r[0] = ie, x
        }

        function h(e, t, i, r, n) {
            if (0 != n) {
                if (!e) throw"Undef src";
                if (!i) throw"Undef dest";
                0 == t && n == e.length ? c(e, i, r) : we ? c(e.subarray(t, t + n), i, r) : 1 == e.BYTES_PER_ELEMENT && n > 100 ? c(new Uint8Array(e.buffer, e.byteOffset + t, n), i, r) : u(e, t, i, r, n)
            }
        }

        function u(e, t, i, r, n) {
            for (var s = 0; n > s; ++s) i[r + s] = e[t + s]
        }

        function c(e, t, i) {
            t.set(e, i)
        }

        function d(e, t, i, n) {
            e = t ? i ? new Uint8Array(e, t, i) : new Uint8Array(e, t, e.byteLength - t) : new Uint8Array(e);
            var s = new r;
            s.inflateInit(f, !0), s.next_in = e, s.next_in_index = 0, s.avail_in = e.length;
            for (var o = [], a = 0; ;) {
                var l = new Uint8Array(32e3);
                s.next_out = l, s.next_out_index = 0, s.avail_out = l.length;
                var u = s.inflate(m);
                if (u != x && u != S && u != L) throw s.msg;
                if (0 != s.avail_out) {
                    var c = new Uint8Array(l.length - s.avail_out);
                    h(l, 0, c, 0, l.length - s.avail_out), l = c
                }
                if (o.push(l), a += l.length, u == S || u == L) break
            }
            if (n && (n[0] = (t || 0) + s.next_in_index), 1 == o.length) return o[0].buffer;
            for (var d = new Uint8Array(a), p = 0, v = 0; v < o.length; ++v) {
                var g = o[v];
                h(g, 0, d, p, g.length), p += g.length
            }
            return d.buffer
        }

        var p = 15, f = p, v = 1440, g = 15, y = 32, m = 0, b = 4, w = 8, x = 0, S = 1, _ = 2, C = -2, T = -3, k = -4,
            L = -5, A = 0, O = 1, E = 2, R = 3, B = 4, M = 5, I = 6, H = 7, P = 8, F = 9, N = 10, G = 11, D = 12,
            q = 13, U = [0, 1, 3, 7, 15, 31, 63, 127, 255, 511, 1023, 2047, 4095, 8191, 16383, 32767, 65535], z = 0,
            W = 1, V = 2, X = 3, j = 4, K = 5, Z = 6, Q = 7, Y = 8, $ = 9, J = 9, ee = 5,
            te = [96, 7, 256, 0, 8, 80, 0, 8, 16, 84, 8, 115, 82, 7, 31, 0, 8, 112, 0, 8, 48, 0, 9, 192, 80, 7, 10, 0, 8, 96, 0, 8, 32, 0, 9, 160, 0, 8, 0, 0, 8, 128, 0, 8, 64, 0, 9, 224, 80, 7, 6, 0, 8, 88, 0, 8, 24, 0, 9, 144, 83, 7, 59, 0, 8, 120, 0, 8, 56, 0, 9, 208, 81, 7, 17, 0, 8, 104, 0, 8, 40, 0, 9, 176, 0, 8, 8, 0, 8, 136, 0, 8, 72, 0, 9, 240, 80, 7, 4, 0, 8, 84, 0, 8, 20, 85, 8, 227, 83, 7, 43, 0, 8, 116, 0, 8, 52, 0, 9, 200, 81, 7, 13, 0, 8, 100, 0, 8, 36, 0, 9, 168, 0, 8, 4, 0, 8, 132, 0, 8, 68, 0, 9, 232, 80, 7, 8, 0, 8, 92, 0, 8, 28, 0, 9, 152, 84, 7, 83, 0, 8, 124, 0, 8, 60, 0, 9, 216, 82, 7, 23, 0, 8, 108, 0, 8, 44, 0, 9, 184, 0, 8, 12, 0, 8, 140, 0, 8, 76, 0, 9, 248, 80, 7, 3, 0, 8, 82, 0, 8, 18, 85, 8, 163, 83, 7, 35, 0, 8, 114, 0, 8, 50, 0, 9, 196, 81, 7, 11, 0, 8, 98, 0, 8, 34, 0, 9, 164, 0, 8, 2, 0, 8, 130, 0, 8, 66, 0, 9, 228, 80, 7, 7, 0, 8, 90, 0, 8, 26, 0, 9, 148, 84, 7, 67, 0, 8, 122, 0, 8, 58, 0, 9, 212, 82, 7, 19, 0, 8, 106, 0, 8, 42, 0, 9, 180, 0, 8, 10, 0, 8, 138, 0, 8, 74, 0, 9, 244, 80, 7, 5, 0, 8, 86, 0, 8, 22, 192, 8, 0, 83, 7, 51, 0, 8, 118, 0, 8, 54, 0, 9, 204, 81, 7, 15, 0, 8, 102, 0, 8, 38, 0, 9, 172, 0, 8, 6, 0, 8, 134, 0, 8, 70, 0, 9, 236, 80, 7, 9, 0, 8, 94, 0, 8, 30, 0, 9, 156, 84, 7, 99, 0, 8, 126, 0, 8, 62, 0, 9, 220, 82, 7, 27, 0, 8, 110, 0, 8, 46, 0, 9, 188, 0, 8, 14, 0, 8, 142, 0, 8, 78, 0, 9, 252, 96, 7, 256, 0, 8, 81, 0, 8, 17, 85, 8, 131, 82, 7, 31, 0, 8, 113, 0, 8, 49, 0, 9, 194, 80, 7, 10, 0, 8, 97, 0, 8, 33, 0, 9, 162, 0, 8, 1, 0, 8, 129, 0, 8, 65, 0, 9, 226, 80, 7, 6, 0, 8, 89, 0, 8, 25, 0, 9, 146, 83, 7, 59, 0, 8, 121, 0, 8, 57, 0, 9, 210, 81, 7, 17, 0, 8, 105, 0, 8, 41, 0, 9, 178, 0, 8, 9, 0, 8, 137, 0, 8, 73, 0, 9, 242, 80, 7, 4, 0, 8, 85, 0, 8, 21, 80, 8, 258, 83, 7, 43, 0, 8, 117, 0, 8, 53, 0, 9, 202, 81, 7, 13, 0, 8, 101, 0, 8, 37, 0, 9, 170, 0, 8, 5, 0, 8, 133, 0, 8, 69, 0, 9, 234, 80, 7, 8, 0, 8, 93, 0, 8, 29, 0, 9, 154, 84, 7, 83, 0, 8, 125, 0, 8, 61, 0, 9, 218, 82, 7, 23, 0, 8, 109, 0, 8, 45, 0, 9, 186, 0, 8, 13, 0, 8, 141, 0, 8, 77, 0, 9, 250, 80, 7, 3, 0, 8, 83, 0, 8, 19, 85, 8, 195, 83, 7, 35, 0, 8, 115, 0, 8, 51, 0, 9, 198, 81, 7, 11, 0, 8, 99, 0, 8, 35, 0, 9, 166, 0, 8, 3, 0, 8, 131, 0, 8, 67, 0, 9, 230, 80, 7, 7, 0, 8, 91, 0, 8, 27, 0, 9, 150, 84, 7, 67, 0, 8, 123, 0, 8, 59, 0, 9, 214, 82, 7, 19, 0, 8, 107, 0, 8, 43, 0, 9, 182, 0, 8, 11, 0, 8, 139, 0, 8, 75, 0, 9, 246, 80, 7, 5, 0, 8, 87, 0, 8, 23, 192, 8, 0, 83, 7, 51, 0, 8, 119, 0, 8, 55, 0, 9, 206, 81, 7, 15, 0, 8, 103, 0, 8, 39, 0, 9, 174, 0, 8, 7, 0, 8, 135, 0, 8, 71, 0, 9, 238, 80, 7, 9, 0, 8, 95, 0, 8, 31, 0, 9, 158, 84, 7, 99, 0, 8, 127, 0, 8, 63, 0, 9, 222, 82, 7, 27, 0, 8, 111, 0, 8, 47, 0, 9, 190, 0, 8, 15, 0, 8, 143, 0, 8, 79, 0, 9, 254, 96, 7, 256, 0, 8, 80, 0, 8, 16, 84, 8, 115, 82, 7, 31, 0, 8, 112, 0, 8, 48, 0, 9, 193, 80, 7, 10, 0, 8, 96, 0, 8, 32, 0, 9, 161, 0, 8, 0, 0, 8, 128, 0, 8, 64, 0, 9, 225, 80, 7, 6, 0, 8, 88, 0, 8, 24, 0, 9, 145, 83, 7, 59, 0, 8, 120, 0, 8, 56, 0, 9, 209, 81, 7, 17, 0, 8, 104, 0, 8, 40, 0, 9, 177, 0, 8, 8, 0, 8, 136, 0, 8, 72, 0, 9, 241, 80, 7, 4, 0, 8, 84, 0, 8, 20, 85, 8, 227, 83, 7, 43, 0, 8, 116, 0, 8, 52, 0, 9, 201, 81, 7, 13, 0, 8, 100, 0, 8, 36, 0, 9, 169, 0, 8, 4, 0, 8, 132, 0, 8, 68, 0, 9, 233, 80, 7, 8, 0, 8, 92, 0, 8, 28, 0, 9, 153, 84, 7, 83, 0, 8, 124, 0, 8, 60, 0, 9, 217, 82, 7, 23, 0, 8, 108, 0, 8, 44, 0, 9, 185, 0, 8, 12, 0, 8, 140, 0, 8, 76, 0, 9, 249, 80, 7, 3, 0, 8, 82, 0, 8, 18, 85, 8, 163, 83, 7, 35, 0, 8, 114, 0, 8, 50, 0, 9, 197, 81, 7, 11, 0, 8, 98, 0, 8, 34, 0, 9, 165, 0, 8, 2, 0, 8, 130, 0, 8, 66, 0, 9, 229, 80, 7, 7, 0, 8, 90, 0, 8, 26, 0, 9, 149, 84, 7, 67, 0, 8, 122, 0, 8, 58, 0, 9, 213, 82, 7, 19, 0, 8, 106, 0, 8, 42, 0, 9, 181, 0, 8, 10, 0, 8, 138, 0, 8, 74, 0, 9, 245, 80, 7, 5, 0, 8, 86, 0, 8, 22, 192, 8, 0, 83, 7, 51, 0, 8, 118, 0, 8, 54, 0, 9, 205, 81, 7, 15, 0, 8, 102, 0, 8, 38, 0, 9, 173, 0, 8, 6, 0, 8, 134, 0, 8, 70, 0, 9, 237, 80, 7, 9, 0, 8, 94, 0, 8, 30, 0, 9, 157, 84, 7, 99, 0, 8, 126, 0, 8, 62, 0, 9, 221, 82, 7, 27, 0, 8, 110, 0, 8, 46, 0, 9, 189, 0, 8, 14, 0, 8, 142, 0, 8, 78, 0, 9, 253, 96, 7, 256, 0, 8, 81, 0, 8, 17, 85, 8, 131, 82, 7, 31, 0, 8, 113, 0, 8, 49, 0, 9, 195, 80, 7, 10, 0, 8, 97, 0, 8, 33, 0, 9, 163, 0, 8, 1, 0, 8, 129, 0, 8, 65, 0, 9, 227, 80, 7, 6, 0, 8, 89, 0, 8, 25, 0, 9, 147, 83, 7, 59, 0, 8, 121, 0, 8, 57, 0, 9, 211, 81, 7, 17, 0, 8, 105, 0, 8, 41, 0, 9, 179, 0, 8, 9, 0, 8, 137, 0, 8, 73, 0, 9, 243, 80, 7, 4, 0, 8, 85, 0, 8, 21, 80, 8, 258, 83, 7, 43, 0, 8, 117, 0, 8, 53, 0, 9, 203, 81, 7, 13, 0, 8, 101, 0, 8, 37, 0, 9, 171, 0, 8, 5, 0, 8, 133, 0, 8, 69, 0, 9, 235, 80, 7, 8, 0, 8, 93, 0, 8, 29, 0, 9, 155, 84, 7, 83, 0, 8, 125, 0, 8, 61, 0, 9, 219, 82, 7, 23, 0, 8, 109, 0, 8, 45, 0, 9, 187, 0, 8, 13, 0, 8, 141, 0, 8, 77, 0, 9, 251, 80, 7, 3, 0, 8, 83, 0, 8, 19, 85, 8, 195, 83, 7, 35, 0, 8, 115, 0, 8, 51, 0, 9, 199, 81, 7, 11, 0, 8, 99, 0, 8, 35, 0, 9, 167, 0, 8, 3, 0, 8, 131, 0, 8, 67, 0, 9, 231, 80, 7, 7, 0, 8, 91, 0, 8, 27, 0, 9, 151, 84, 7, 67, 0, 8, 123, 0, 8, 59, 0, 9, 215, 82, 7, 19, 0, 8, 107, 0, 8, 43, 0, 9, 183, 0, 8, 11, 0, 8, 139, 0, 8, 75, 0, 9, 247, 80, 7, 5, 0, 8, 87, 0, 8, 23, 192, 8, 0, 83, 7, 51, 0, 8, 119, 0, 8, 55, 0, 9, 207, 81, 7, 15, 0, 8, 103, 0, 8, 39, 0, 9, 175, 0, 8, 7, 0, 8, 135, 0, 8, 71, 0, 9, 239, 80, 7, 9, 0, 8, 95, 0, 8, 31, 0, 9, 159, 84, 7, 99, 0, 8, 127, 0, 8, 63, 0, 9, 223, 82, 7, 27, 0, 8, 111, 0, 8, 47, 0, 9, 191, 0, 8, 15, 0, 8, 143, 0, 8, 79, 0, 9, 255],
            ie = [80, 5, 1, 87, 5, 257, 83, 5, 17, 91, 5, 4097, 81, 5, 5, 89, 5, 1025, 85, 5, 65, 93, 5, 16385, 80, 5, 3, 88, 5, 513, 84, 5, 33, 92, 5, 8193, 82, 5, 9, 90, 5, 2049, 86, 5, 129, 192, 5, 24577, 80, 5, 2, 87, 5, 385, 83, 5, 25, 91, 5, 6145, 81, 5, 7, 89, 5, 1537, 85, 5, 97, 93, 5, 24577, 80, 5, 4, 88, 5, 769, 84, 5, 49, 92, 5, 12289, 82, 5, 13, 90, 5, 3073, 86, 5, 193, 192, 5, 24577],
            re = [3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0],
            ne = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0, 112, 112],
            se = [1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577],
            oe = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13];
        r.prototype.inflateInit = function (e, t) {
            return e || (e = f), t && (t = !1), this.istate = new n, this.istate.inflateInit(this, t ? -e : e)
        }, r.prototype.inflate = function (e) {
            return null == this.istate ? C : this.istate.inflate(this, e)
        }, r.prototype.inflateEnd = function () {
            if (null == this.istate) return C;
            var e = istate.inflateEnd(this);
            return this.istate = null, e
        }, r.prototype.inflateSync = function () {
            return istate.inflateSync(this)
        }, r.prototype.inflateSetDictionary = function (e, t) {
            return istate.inflateSetDictionary(this, e, t)
        }, n.prototype.inflateReset = function (e) {
            return null == e || null == e.istate ? C : (e.total_in = e.total_out = 0, e.msg = null, e.istate.mode = 0 != e.istate.nowrap ? H : A, e.istate.blocks.reset(e, null), x)
        }, n.prototype.inflateEnd = function (e) {
            return null != this.blocks && this.blocks.free(e), this.blocks = null, x
        }, n.prototype.inflateInit = function (e, t) {
            return e.msg = null, this.blocks = null, nowrap = 0, 0 > t && (t = -t, nowrap = 1), 8 > t || t > 15 ? (this.inflateEnd(e), C) : (this.wbits = t, e.istate.blocks = new s(e, 0 != e.istate.nowrap ? null : this, 1 << t), this.inflateReset(e), x)
        }, n.prototype.inflate = function (e, t) {
            var i, r;
            if (null == e || null == e.istate || null == e.next_in) return C;
            for (t = t == b ? L : x, i = L; ;) switch (e.istate.mode) {
                case A:
                    if (0 == e.avail_in) return i;
                    if (i = t, e.avail_in--, e.total_in++, (15 & (e.istate.method = e.next_in[e.next_in_index++])) != w) {
                        e.istate.mode = q, e.msg = "unknown compression method", e.istate.marker = 5;
                        break
                    }
                    if ((e.istate.method >> 4) + 8 > e.istate.wbits) {
                        e.istate.mode = q, e.msg = "invalid window size", e.istate.marker = 5;
                        break
                    }
                    e.istate.mode = O;
                case O:
                    if (0 == e.avail_in) return i;
                    if (i = t, e.avail_in--, e.total_in++, r = 255 & e.next_in[e.next_in_index++], ((e.istate.method << 8) + r) % 31 != 0) {
                        e.istate.mode = q, e.msg = "incorrect header check", e.istate.marker = 5;
                        break
                    }
                    if (0 == (r & y)) {
                        e.istate.mode = H;
                        break
                    }
                    e.istate.mode = E;
                case E:
                    if (0 == e.avail_in) return i;
                    i = t, e.avail_in--, e.total_in++, e.istate.need = (255 & e.next_in[e.next_in_index++]) << 24 & 4278190080, e.istate.mode = R;
                case R:
                    if (0 == e.avail_in) return i;
                    i = t, e.avail_in--, e.total_in++, e.istate.need += (255 & e.next_in[e.next_in_index++]) << 16 & 16711680, e.istate.mode = B;
                case B:
                    if (0 == e.avail_in) return i;
                    i = t, e.avail_in--, e.total_in++, e.istate.need += (255 & e.next_in[e.next_in_index++]) << 8 & 65280, e.istate.mode = M;
                case M:
                    return 0 == e.avail_in ? i : (i = t, e.avail_in--, e.total_in++, e.istate.need += 255 & e.next_in[e.next_in_index++], e.adler = e.istate.need, e.istate.mode = I, _);
                case I:
                    return e.istate.mode = q, e.msg = "need dictionary", e.istate.marker = 0, C;
                case H:
                    if (i = e.istate.blocks.proc(e, i), i == T) {
                        e.istate.mode = q, e.istate.marker = 0;
                        break
                    }
                    if (i == x && (i = t), i != S) return i;
                    if (i = t, e.istate.blocks.reset(e, e.istate.was), 0 != e.istate.nowrap) {
                        e.istate.mode = D;
                        break
                    }
                    e.istate.mode = P;
                case P:
                    if (0 == e.avail_in) return i;
                    i = t, e.avail_in--, e.total_in++, e.istate.need = (255 & e.next_in[e.next_in_index++]) << 24 & 4278190080, e.istate.mode = F;
                case F:
                    if (0 == e.avail_in) return i;
                    i = t, e.avail_in--, e.total_in++, e.istate.need += (255 & e.next_in[e.next_in_index++]) << 16 & 16711680, e.istate.mode = N;
                case N:
                    if (0 == e.avail_in) return i;
                    i = t, e.avail_in--, e.total_in++, e.istate.need += (255 & e.next_in[e.next_in_index++]) << 8 & 65280, e.istate.mode = G;
                case G:
                    if (0 == e.avail_in) return i;
                    if (i = t, e.avail_in--, e.total_in++, e.istate.need += 255 & e.next_in[e.next_in_index++], e.istate.was[0] != e.istate.need) {
                        e.istate.mode = q, e.msg = "incorrect data check", e.istate.marker = 5;
                        break
                    }
                    e.istate.mode = D;
                case D:
                    return S;
                case q:
                    return T;
                default:
                    return C
            }
        }, n.prototype.inflateSetDictionary = function (e, t, i) {
            var r = 0, n = i;
            return null == e || null == e.istate || e.istate.mode != I ? C : e._adler.adler32(1, t, 0, i) != e.adler ? T : (e.adler = e._adler.adler32(0, null, 0, 0), n >= 1 << e.istate.wbits && (n = (1 << e.istate.wbits) - 1, r = i - n), e.istate.blocks.set_dictionary(t, r, n), e.istate.mode = H, x)
        };
        var ae = [0, 0, 255, 255];
        n.prototype.inflateSync = function (e) {
            var t, i, r, n, s;
            if (null == e || null == e.istate) return C;
            if (e.istate.mode != q && (e.istate.mode = q, e.istate.marker = 0), 0 == (t = e.avail_in)) return L;
            for (i = e.next_in_index, r = e.istate.marker; 0 != t && 4 > r;) e.next_in[i] == ae[r] ? r++ : r = 0 != e.next_in[i] ? 0 : 4 - r, i++, t--;
            return e.total_in += i - e.next_in_index, e.next_in_index = i, e.avail_in = t, e.istate.marker = r, 4 != r ? T : (n = e.total_in, s = e.total_out, this.inflateReset(e), e.total_in = n, e.total_out = s, e.istate.mode = H, x)
        }, n.prototype.inflateSyncPoint = function (e) {
            return null == e || null == e.istate || null == e.istate.blocks ? C : e.istate.blocks.sync_point()
        };
        var le = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
        s.prototype.reset = function (e, t) {
            t && (t[0] = this.check), this.mode == Z && this.codes.free(e), this.mode = z, this.bitk = 0, this.bitb = 0, this.read = this.write = 0, this.checkfn && (e.adler = this.check = e._adler.adler32(0, null, 0, 0))
        }, s.prototype.proc = function (e, t) {
            var i, r, n, s, o, a, u;
            for (s = e.next_in_index, o = e.avail_in, r = this.bitb, n = this.bitk, a = this.write, u = a < this.read ? this.read - a - 1 : this.end - a; ;) switch (this.mode) {
                case z:
                    for (; 3 > n;) {
                        if (0 == o) return this.bitb = r, this.bitk = n, e.avail_in = o, e.total_in += s - e.next_in_index, e.next_in_index = s, this.write = a, this.inflate_flush(e, t);
                        t = x, o--, r |= (255 & e.next_in[s++]) << n, n += 8
                    }
                    switch (i = 7 & r, this.last = 1 & i, i >>> 1) {
                        case 0:
                            r >>>= 3, n -= 3, i = 7 & n, r >>>= i, n -= i, this.mode = W;
                            break;
                        case 1:
                            var c = new Int32Array(1), d = new Int32Array(1), p = [], f = [];
                            l(c, d, p, f, e), this.codes.init(c[0], d[0], p[0], 0, f[0], 0, e), r >>>= 3, n -= 3, this.mode = Z;
                            break;
                        case 2:
                            r >>>= 3, n -= 3, this.mode = X;
                            break;
                        case 3:
                            return r >>>= 3, n -= 3, this.mode = q, e.msg = "invalid block type", t = T, this.bitb = r, this.bitk = n, e.avail_in = o, e.total_in += s - e.next_in_index, e.next_in_index = s, this.write = a, this.inflate_flush(e, t)
                    }
                    break;
                case W:
                    for (; 32 > n;) {
                        if (0 == o) return this.bitb = r, this.bitk = n, e.avail_in = o, e.total_in += s - e.next_in_index, e.next_in_index = s, this.write = a, this.inflate_flush(e, t);
                        t = x, o--, r |= (255 & e.next_in[s++]) << n, n += 8
                    }
                    if ((~r >>> 16 & 65535) != (65535 & r)) return this.mode = q, e.msg = "invalid stored block lengths", t = T, this.bitb = r, this.bitk = n, e.avail_in = o, e.total_in += s - e.next_in_index, e.next_in_index = s, this.write = a, this.inflate_flush(e, t);
                    this.left = 65535 & r, r = n = 0, this.mode = 0 != this.left ? V : 0 != this.last ? Q : z;
                    break;
                case V:
                    if (0 == o) return this.bitb = r, this.bitk = n, e.avail_in = o, e.total_in += s - e.next_in_index, e.next_in_index = s, write = a, this.inflate_flush(e, t);
                    if (0 == u && (a == end && 0 != read && (a = 0, u = a < this.read ? this.read - a - 1 : this.end - a), 0 == u && (this.write = a, t = this.inflate_flush(e, t), a = this.write, u = a < this.read ? this.read - a - 1 : this.end - a, a == this.end && 0 != this.read && (a = 0, u = a < this.read ? this.read - a - 1 : this.end - a), 0 == u))) return this.bitb = r, this.bitk = n, e.avail_in = o, e.total_in += s - e.next_in_index, e.next_in_index = s, this.write = a, this.inflate_flush(e, t);
                    if (t = x, i = this.left, i > o && (i = o), i > u && (i = u), h(e.next_in, s, this.window, a, i), s += i, o -= i, a += i, u -= i, 0 != (this.left -= i)) break;
                    this.mode = 0 != this.last ? Q : z;
                    break;
                case X:
                    for (; 14 > n;) {
                        if (0 == o) return this.bitb = r, this.bitk = n, e.avail_in = o, e.total_in += s - e.next_in_index, e.next_in_index = s, this.write = a, this.inflate_flush(e, t);
                        t = x, o--, r |= (255 & e.next_in[s++]) << n, n += 8
                    }
                    if (this.table = i = 16383 & r, (31 & i) > 29 || (i >> 5 & 31) > 29) return this.mode = $, e.msg = "too many length or distance symbols", t = T, this.bitb = r, this.bitk = n, e.avail_in = o, e.total_in += s - e.next_in_index, e.next_in_index = s, this.write = a, this.inflate_flush(e, t);
                    if (i = 258 + (31 & i) + (i >> 5 & 31), null == this.blens || this.blens.length < i) this.blens = new Int32Array(i); else for (var v = 0; i > v; v++) this.blens[v] = 0;
                    r >>>= 14, n -= 14, this.index = 0, mode = j;
                case j:
                    for (; this.index < 4 + (this.table >>> 10);) {
                        for (; 3 > n;) {
                            if (0 == o) return this.bitb = r, this.bitk = n, e.avail_in = o, e.total_in += s - e.next_in_index, e.next_in_index = s, this.write = a, this.inflate_flush(e, t);
                            t = x, o--, r |= (255 & e.next_in[s++]) << n, n += 8
                        }
                        this.blens[le[this.index++]] = 7 & r, r >>>= 3, n -= 3
                    }
                    for (; this.index < 19;) this.blens[le[this.index++]] = 0;
                    if (this.bb[0] = 7,
                        i = this.inftree.inflate_trees_bits(this.blens, this.bb, this.tb, this.hufts, e), i != x) return t = i, t == T && (this.blens = null, this.mode = $), this.bitb = r, this.bitk = n, e.avail_in = o, e.total_in += s - e.next_in_index, e.next_in_index = s, write = a, this.inflate_flush(e, t);
                    this.index = 0, this.mode = K;
                case K:
                    for (; ;) {
                        if (i = this.table, !(this.index < 258 + (31 & i) + (i >> 5 & 31))) break;
                        var v, g, y;
                        for (i = this.bb[0]; i > n;) {
                            if (0 == o) return this.bitb = r, this.bitk = n, e.avail_in = o, e.total_in += s - e.next_in_index, e.next_in_index = s, this.write = a, this.inflate_flush(e, t);
                            t = x, o--, r |= (255 & e.next_in[s++]) << n, n += 8
                        }
                        if (i = this.hufts[3 * (this.tb[0] + (r & U[i])) + 1], y = this.hufts[3 * (this.tb[0] + (r & U[i])) + 2], 16 > y) r >>>= i, n -= i, this.blens[this.index++] = y; else {
                            for (v = 18 == y ? 7 : y - 14, g = 18 == y ? 11 : 3; i + v > n;) {
                                if (0 == o) return this.bitb = r, this.bitk = n, e.avail_in = o, e.total_in += s - e.next_in_index, e.next_in_index = s, this.write = a, this.inflate_flush(e, t);
                                t = x, o--, r |= (255 & e.next_in[s++]) << n, n += 8
                            }
                            if (r >>>= i, n -= i, g += r & U[v], r >>>= v, n -= v, v = this.index, i = this.table, v + g > 258 + (31 & i) + (i >> 5 & 31) || 16 == y && 1 > v) return this.blens = null, this.mode = $, e.msg = "invalid bit length repeat", t = T, this.bitb = r, this.bitk = n, e.avail_in = o, e.total_in += s - e.next_in_index, e.next_in_index = s, this.write = a, this.inflate_flush(e, t);
                            y = 16 == y ? this.blens[v - 1] : 0;
                            do this.blens[v++] = y; while (0 != --g);
                            this.index = v
                        }
                    }
                    this.tb[0] = -1;
                    var c = new Int32Array(1), d = new Int32Array(1), p = new Int32Array(1), f = new Int32Array(1);
                    if (c[0] = 9, d[0] = 6, i = this.table, i = this.inftree.inflate_trees_dynamic(257 + (31 & i), 1 + (i >> 5 & 31), this.blens, c, d, p, f, this.hufts, e), i != x) return i == T && (this.blens = null, this.mode = q), t = i, this.bitb = r, this.bitk = n, e.avail_in = o, e.total_in += s - e.next_in_index, e.next_in_index = s, this.write = a, this.inflate_flush(e, t);
                    this.codes.init(c[0], d[0], this.hufts, p[0], this.hufts, f[0], e), this.mode = Z;
                case Z:
                    if (this.bitb = r, this.bitk = n, e.avail_in = o, e.total_in += s - e.next_in_index, e.next_in_index = s, this.write = a, (t = this.codes.proc(this, e, t)) != S) return this.inflate_flush(e, t);
                    if (t = x, this.codes.free(e), s = e.next_in_index, o = e.avail_in, r = this.bitb, n = this.bitk, a = this.write, u = a < this.read ? this.read - a - 1 : this.end - a, 0 == this.last) {
                        this.mode = z;
                        break
                    }
                    this.mode = Q;
                case Q:
                    if (this.write = a, t = this.inflate_flush(e, t), a = this.write, u = a < this.read ? this.read - a - 1 : this.end - a, this.read != this.write) return this.bitb = r, this.bitk = n, e.avail_in = o, e.total_in += s - e.next_in_index, e.next_in_index = s, this.write = a, this.inflate_flush(e, t);
                    mode = D;
                case Y:
                    return t = S, this.bitb = r, this.bitk = n, e.avail_in = o, e.total_in += s - e.next_in_index, e.next_in_index = s, this.write = a, this.inflate_flush(e, t);
                case $:
                    return t = T, this.bitb = r, this.bitk = n, e.avail_in = o, e.total_in += s - e.next_in_index, e.next_in_index = s, this.write = a, this.inflate_flush(e, t);
                default:
                    return t = C, this.bitb = r, this.bitk = n, e.avail_in = o, e.total_in += s - e.next_in_index, e.next_in_index = s, this.write = a, this.inflate_flush(e, t)
            }
        }, s.prototype.free = function (e) {
            this.reset(e, null), this.window = null, this.hufts = null
        }, s.prototype.set_dictionary = function (e, t, i) {
            h(e, t, window, 0, i), this.read = this.write = i
        }, s.prototype.sync_point = function () {
            return this.mode == W
        }, s.prototype.inflate_flush = function (e, t) {
            var i, r, n;
            return r = e.next_out_index, n = this.read, i = (n <= this.write ? this.write : this.end) - n, i > e.avail_out && (i = e.avail_out), 0 != i && t == L && (t = x), e.avail_out -= i, e.total_out += i, null != this.checkfn && (e.adler = this.check = e._adler.adler32(this.check, this.window, n, i)), h(this.window, n, e.next_out, r, i), r += i, n += i, n == this.end && (n = 0, this.write == this.end && (this.write = 0), i = this.write - n, i > e.avail_out && (i = e.avail_out), 0 != i && t == L && (t = x), e.avail_out -= i, e.total_out += i, null != this.checkfn && (e.adler = this.check = e._adler.adler32(this.check, this.window, n, i)), h(this.window, n, e.next_out, r, i), r += i, n += i), e.next_out_index = r, this.read = n, t
        };
        var he = 0, ue = 1, ce = 2, de = 3, pe = 4, fe = 5, ve = 6, ge = 7, ye = 8, me = 9;
        o.prototype.init = function (e, t, i, r, n, s, o) {
            this.mode = he, this.lbits = e, this.dbits = t, this.ltree = i, this.ltree_index = r, this.dtree = n, this.dtree_index = s, this.tree = null
        }, o.prototype.proc = function (e, t, i) {
            var r, n, s, o, a, l, h, u = 0, c = 0, d = 0;
            for (d = t.next_in_index, o = t.avail_in, u = e.bitb, c = e.bitk, a = e.write, l = a < e.read ? e.read - a - 1 : e.end - a; ;) switch (this.mode) {
                case he:
                    if (l >= 258 && o >= 10 && (e.bitb = u, e.bitk = c, t.avail_in = o, t.total_in += d - t.next_in_index, t.next_in_index = d, e.write = a, i = this.inflate_fast(this.lbits, this.dbits, this.ltree, this.ltree_index, this.dtree, this.dtree_index, e, t), d = t.next_in_index, o = t.avail_in, u = e.bitb, c = e.bitk, a = e.write, l = a < e.read ? e.read - a - 1 : e.end - a, i != x)) {
                        this.mode = i == S ? ge : me;
                        break
                    }
                    this.need = this.lbits, this.tree = this.ltree, this.tree_index = this.ltree_index, this.mode = ue;
                case ue:
                    for (r = this.need; r > c;) {
                        if (0 == o) return e.bitb = u, e.bitk = c, t.avail_in = o, t.total_in += d - t.next_in_index, t.next_in_index = d, e.write = a, e.inflate_flush(t, i);
                        i = x, o--, u |= (255 & t.next_in[d++]) << c, c += 8
                    }
                    if (n = 3 * (this.tree_index + (u & U[r])), u >>>= this.tree[n + 1], c -= this.tree[n + 1], s = this.tree[n], 0 == s) {
                        this.lit = this.tree[n + 2], this.mode = ve;
                        break
                    }
                    if (0 != (16 & s)) {
                        this.get = 15 & s, this.len = this.tree[n + 2], this.mode = ce;
                        break
                    }
                    if (0 == (64 & s)) {
                        this.need = s, this.tree_index = n / 3 + this.tree[n + 2];
                        break
                    }
                    if (0 != (32 & s)) {
                        this.mode = ge;
                        break
                    }
                    return this.mode = me, t.msg = "invalid literal/length code", i = T, e.bitb = u, e.bitk = c, t.avail_in = o, t.total_in += d - t.next_in_index, t.next_in_index = d, e.write = a, e.inflate_flush(t, i);
                case ce:
                    for (r = this.get; r > c;) {
                        if (0 == o) return e.bitb = u, e.bitk = c, t.avail_in = o, t.total_in += d - t.next_in_index, t.next_in_index = d, e.write = a, e.inflate_flush(t, i);
                        i = x, o--, u |= (255 & t.next_in[d++]) << c, c += 8
                    }
                    this.len += u & U[r], u >>= r, c -= r, this.need = this.dbits, this.tree = this.dtree, this.tree_index = this.dtree_index, this.mode = de;
                case de:
                    for (r = this.need; r > c;) {
                        if (0 == o) return e.bitb = u, e.bitk = c, t.avail_in = o, t.total_in += d - t.next_in_index, t.next_in_index = d, e.write = a, e.inflate_flush(t, i);
                        i = x, o--, u |= (255 & t.next_in[d++]) << c, c += 8
                    }
                    if (n = 3 * (this.tree_index + (u & U[r])), u >>= this.tree[n + 1], c -= this.tree[n + 1], s = this.tree[n], 0 != (16 & s)) {
                        this.get = 15 & s, this.dist = this.tree[n + 2], this.mode = pe;
                        break
                    }
                    if (0 == (64 & s)) {
                        this.need = s, this.tree_index = n / 3 + this.tree[n + 2];
                        break
                    }
                    return this.mode = me, t.msg = "invalid distance code", i = T, e.bitb = u, e.bitk = c, t.avail_in = o, t.total_in += d - t.next_in_index, t.next_in_index = d, e.write = a, e.inflate_flush(t, i);
                case pe:
                    for (r = this.get; r > c;) {
                        if (0 == o) return e.bitb = u, e.bitk = c, t.avail_in = o, t.total_in += d - t.next_in_index, t.next_in_index = d, e.write = a, e.inflate_flush(t, i);
                        i = x, o--, u |= (255 & t.next_in[d++]) << c, c += 8
                    }
                    this.dist += u & U[r], u >>= r, c -= r, this.mode = fe;
                case fe:
                    for (h = a - this.dist; 0 > h;) h += e.end;
                    for (; 0 != this.len;) {
                        if (0 == l && (a == e.end && 0 != e.read && (a = 0, l = a < e.read ? e.read - a - 1 : e.end - a), 0 == l && (e.write = a, i = e.inflate_flush(t, i), a = e.write, l = a < e.read ? e.read - a - 1 : e.end - a, a == e.end && 0 != e.read && (a = 0, l = a < e.read ? e.read - a - 1 : e.end - a), 0 == l))) return e.bitb = u, e.bitk = c, t.avail_in = o, t.total_in += d - t.next_in_index, t.next_in_index = d, e.write = a, e.inflate_flush(t, i);
                        e.window[a++] = e.window[h++], l--, h == e.end && (h = 0), this.len--
                    }
                    this.mode = he;
                    break;
                case ve:
                    if (0 == l && (a == e.end && 0 != e.read && (a = 0, l = a < e.read ? e.read - a - 1 : e.end - a), 0 == l && (e.write = a, i = e.inflate_flush(t, i), a = e.write, l = a < e.read ? e.read - a - 1 : e.end - a, a == e.end && 0 != e.read && (a = 0, l = a < e.read ? e.read - a - 1 : e.end - a), 0 == l))) return e.bitb = u, e.bitk = c, t.avail_in = o, t.total_in += d - t.next_in_index, t.next_in_index = d, e.write = a, e.inflate_flush(t, i);
                    i = x, e.window[a++] = this.lit, l--, this.mode = he;
                    break;
                case ge:
                    if (c > 7 && (c -= 8, o++, d--), e.write = a, i = e.inflate_flush(t, i), a = e.write, l = a < e.read ? e.read - a - 1 : e.end - a, e.read != e.write) return e.bitb = u, e.bitk = c, t.avail_in = o, t.total_in += d - t.next_in_index, t.next_in_index = d, e.write = a, e.inflate_flush(t, i);
                    this.mode = ye;
                case ye:
                    return i = S, e.bitb = u, e.bitk = c, t.avail_in = o, t.total_in += d - t.next_in_index, t.next_in_index = d, e.write = a, e.inflate_flush(t, i);
                case me:
                    return i = T, e.bitb = u, e.bitk = c, t.avail_in = o, t.total_in += d - t.next_in_index, t.next_in_index = d, e.write = a, e.inflate_flush(t, i);
                default:
                    return i = C, e.bitb = u, e.bitk = c, t.avail_in = o, t.total_in += d - t.next_in_index, t.next_in_index = d, e.write = a, e.inflate_flush(t, i)
            }
        }, o.prototype.free = function (e) {
        }, o.prototype.inflate_fast = function (e, t, i, r, n, s, o, a) {
            var l, u, c, d, p, f, v, g, y, m, b, w, _, C, k, L;
            v = a.next_in_index, g = a.avail_in, p = o.bitb, f = o.bitk, y = o.write, m = y < o.read ? o.read - y - 1 : o.end - y, b = U[e], w = U[t];
            do {
                for (; 20 > f;) g--, p |= (255 & a.next_in[v++]) << f, f += 8;
                if (l = p & b, u = i, c = r, L = 3 * (c + l), 0 != (d = u[L])) for (; ;) {
                    if (p >>= u[L + 1], f -= u[L + 1], 0 != (16 & d)) {
                        for (d &= 15, _ = u[L + 2] + (p & U[d]), p >>= d, f -= d; 15 > f;) g--, p |= (255 & a.next_in[v++]) << f, f += 8;
                        for (l = p & w, u = n, c = s, L = 3 * (c + l), d = u[L]; ;) {
                            if (p >>= u[L + 1], f -= u[L + 1], 0 != (16 & d)) {
                                for (d &= 15; d > f;) g--, p |= (255 & a.next_in[v++]) << f, f += 8;
                                if (C = u[L + 2] + (p & U[d]), p >>= d, f -= d, m -= _, y >= C) k = y - C, y - k > 0 && 2 > y - k ? (o.window[y++] = o.window[k++], o.window[y++] = o.window[k++], _ -= 2) : (o.window[y++] = o.window[k++], o.window[y++] = o.window[k++], _ -= 2); else {
                                    k = y - C;
                                    do k += o.end; while (0 > k);
                                    if (d = o.end - k, _ > d) {
                                        if (_ -= d, y - k > 0 && d > y - k) {
                                            do o.window[y++] = o.window[k++]; while (0 != --d)
                                        } else h(o.window, k, o.window, y, d), y += d, k += d, d = 0;
                                        k = 0
                                    }
                                }
                                do o.window[y++] = o.window[k++]; while (0 != --_);
                                break
                            }
                            if (0 != (64 & d)) return a.msg = "invalid distance code", _ = a.avail_in - g, _ = _ > f >> 3 ? f >> 3 : _, g += _, v -= _, f -= _ << 3, o.bitb = p, o.bitk = f, a.avail_in = g, a.total_in += v - a.next_in_index, a.next_in_index = v, o.write = y, T;
                            l += u[L + 2], l += p & U[d], L = 3 * (c + l), d = u[L]
                        }
                        break
                    }
                    if (0 != (64 & d)) return 0 != (32 & d) ? (_ = a.avail_in - g, _ = _ > f >> 3 ? f >> 3 : _, g += _, v -= _, f -= _ << 3, o.bitb = p, o.bitk = f, a.avail_in = g, a.total_in += v - a.next_in_index, a.next_in_index = v, o.write = y, S) : (a.msg = "invalid literal/length code", _ = a.avail_in - g, _ = _ > f >> 3 ? f >> 3 : _, g += _, v -= _, f -= _ << 3, o.bitb = p, o.bitk = f, a.avail_in = g, a.total_in += v - a.next_in_index, a.next_in_index = v, o.write = y, T);
                    if (l += u[L + 2], l += p & U[d], L = 3 * (c + l), 0 == (d = u[L])) {
                        p >>= u[L + 1], f -= u[L + 1], o.window[y++] = u[L + 2], m--;
                        break
                    }
                } else p >>= u[L + 1], f -= u[L + 1], o.window[y++] = u[L + 2], m--
            } while (m >= 258 && g >= 10);
            return _ = a.avail_in - g, _ = _ > f >> 3 ? f >> 3 : _, g += _, v -= _, f -= _ << 3, o.bitb = p, o.bitk = f, a.avail_in = g, a.total_in += v - a.next_in_index, a.next_in_index = v, o.write = y, x
        }, a.prototype.huft_build = function (e, t, i, r, n, s, o, a, l, u, c) {
            var d, p, f, y, m, b, w, S, _, C, k, A, O, E, R;
            C = 0, m = i;
            do this.c[e[t + C]]++, C++, m--; while (0 != m);
            if (this.c[0] == i) return o[0] = -1, a[0] = 0, x;
            for (S = a[0], b = 1; g >= b && 0 == this.c[b]; b++) ;
            for (w = b, b > S && (S = b), m = g; 0 != m && 0 == this.c[m]; m--) ;
            for (f = m, S > m && (S = m), a[0] = S, E = 1 << b; m > b; b++, E <<= 1) if ((E -= this.c[b]) < 0) return T;
            if ((E -= this.c[m]) < 0) return T;
            for (this.c[m] += E, this.x[1] = b = 0, C = 1, O = 2; 0 != --m;) this.x[O] = b += this.c[C], O++, C++;
            m = 0, C = 0;
            do 0 != (b = e[t + C]) && (this.v[this.x[b]++] = m), C++; while (++m < i);
            for (i = this.x[f], this.x[0] = m = 0, C = 0, y = -1, A = -S, this.u[0] = 0, k = 0, R = 0; f >= w; w++) for (d = this.c[w]; 0 != d--;) {
                for (; w > A + S;) {
                    if (y++, A += S, R = f - A, R = R > S ? S : R, (p = 1 << (b = w - A)) > d + 1 && (p -= d + 1, O = w, R > b)) for (; ++b < R && !((p <<= 1) <= this.c[++O]);) p -= this.c[O];
                    if (R = 1 << b, this.hn[0] + R > v) return T;
                    this.u[y] = k = this.hn[0], this.hn[0] += R, 0 != y ? (this.x[y] = m, this.r[0] = b, this.r[1] = S, b = m >>> A - S, this.r[2] = k - this.u[y - 1] - b, h(this.r, 0, l, 3 * (this.u[y - 1] + b), 3)) : o[0] = k
                }
                for (this.r[1] = w - A, C >= i ? this.r[0] = 192 : c[C] < r ? (this.r[0] = this.v[C] < 256 ? 0 : 96, this.r[2] = this.v[C++]) : (this.r[0] = s[this.v[C] - r] + 16 + 64, this.r[2] = n[this.v[C++] - r]), p = 1 << w - A, b = m >>> A; R > b; b += p) h(this.r, 0, l, 3 * (k + b), 3);
                for (b = 1 << w - 1; 0 != (m & b); b >>>= 1) m ^= b;
                for (m ^= b, _ = (1 << A) - 1; (m & _) != this.x[y];) y--, A -= S, _ = (1 << A) - 1
            }
            return 0 != E && 1 != f ? L : x
        }, a.prototype.inflate_trees_bits = function (e, t, i, r, n) {
            var s;
            return this.initWorkArea(19), this.hn[0] = 0, s = this.huft_build(e, 0, 19, 19, null, null, i, t, r, this.hn, this.v), s == T ? n.msg = "oversubscribed dynamic bit lengths tree" : (s == L || 0 == t[0]) && (n.msg = "incomplete dynamic bit lengths tree", s = T), s
        }, a.prototype.inflate_trees_dynamic = function (e, t, i, r, n, s, o, a, l) {
            var h;
            return this.initWorkArea(288), this.hn[0] = 0, h = this.huft_build(i, 0, e, 257, re, ne, s, r, a, this.hn, this.v), h != x || 0 == r[0] ? (h == T ? l.msg = "oversubscribed literal/length tree" : h != k && (l.msg = "incomplete literal/length tree", h = T), h) : (this.initWorkArea(288), h = this.huft_build(i, e, t, 0, se, oe, o, n, a, this.hn, this.v), h != x || 0 == n[0] && e > 257 ? (h == T ? l.msg = "oversubscribed distance tree" : h == L ? (l.msg = "incomplete distance tree", h = T) : h != k && (l.msg = "empty distance tree with lengths", h = T), h) : x)
        }, a.prototype.initWorkArea = function (e) {
            null == this.hn && (this.hn = new Int32Array(1), this.v = new Int32Array(e), this.c = new Int32Array(g + 1), this.r = new Int32Array(3), this.u = new Int32Array(g), this.x = new Int32Array(g + 1)), this.v.length < e && (this.v = new Int32Array(e));
            for (var t = 0; e > t; t++) this.v[t] = 0;
            for (var t = 0; g + 1 > t; t++) this.c[t] = 0;
            for (var t = 0; 3 > t; t++) this.r[t] = 0;
            h(this.c, 0, this.u, 0, g), h(this.c, 0, this.x, 0, g + 1)
        };
        var be = new Uint8Array(1), we = "function" == typeof be.subarray;
        "undefined" != typeof t && (t.exports = {inflateBuffer: d, arrayCopy: h})
    }, {}],
    55: [function (e, t, i) {
        function r() {
            throw new Error("setTimeout has not been defined")
        }

        function n() {
            throw new Error("clearTimeout has not been defined")
        }

        function s(e) {
            if (c === setTimeout) return setTimeout(e, 0);
            if ((c === r || !c) && setTimeout) return c = setTimeout, setTimeout(e, 0);
            try {
                return c(e, 0)
            } catch (t) {
                try {
                    return c.call(null, e, 0)
                } catch (t) {
                    return c.call(this, e, 0)
                }
            }
        }

        function o(e) {
            if (d === clearTimeout) return clearTimeout(e);
            if ((d === n || !d) && clearTimeout) return d = clearTimeout, clearTimeout(e);
            try {
                return d(e)
            } catch (t) {
                try {
                    return d.call(null, e)
                } catch (t) {
                    return d.call(this, e)
                }
            }
        }

        function a() {
            g && f && (g = !1, f.length ? v = f.concat(v) : y = -1, v.length && l())
        }

        function l() {
            if (!g) {
                var e = s(a);
                g = !0;
                for (var t = v.length; t;) {
                    for (f = v, v = []; ++y < t;) f && f[y].run();
                    y = -1, t = v.length
                }
                f = null, g = !1, o(e)
            }
        }

        function h(e, t) {
            this.fun = e, this.array = t
        }

        function u() {
        }

        var c, d, p = t.exports = {};
        !function () {
            try {
                c = "function" == typeof setTimeout ? setTimeout : r
            } catch (e) {
                c = r
            }
            try {
                d = "function" == typeof clearTimeout ? clearTimeout : n
            } catch (e) {
                d = n
            }
        }();
        var f, v = [], g = !1, y = -1;
        p.nextTick = function (e) {
            var t = new Array(arguments.length - 1);
            if (arguments.length > 1) for (var i = 1; i < arguments.length; i++) t[i - 1] = arguments[i];
            v.push(new h(e, t)), 1 !== v.length || g || s(l)
        }, h.prototype.run = function () {
            this.fun.apply(null, this.array)
        }, p.title = "browser", p.browser = !0, p.env = {}, p.argv = [], p.version = "", p.versions = {}, p.on = u, p.addListener = u, p.once = u, p.off = u, p.removeListener = u, p.removeAllListeners = u, p.emit = u, p.binding = function (e) {
            throw new Error("process.binding is not supported")
        }, p.cwd = function () {
            return "/"
        }, p.chdir = function (e) {
            throw new Error("process.chdir is not supported")
        }, p.umask = function () {
            return 0
        }
    }, {}]
}, {}, [17]);
//# sourceMappingURL=dalliance-all.js.map