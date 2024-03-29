// dropbox-datastores-1.2.0.js
(function() {
    var t, e, r, n, i, o, s, a, u, l, h, c, d, _, p, f, g, y, m, v, w, b, D, S, E, I, A, O, R, T, x, C, U, k, L, P, N, F, B, z, j, X, M, V, H, q, W, G, J, K, Z, $, Q, Y, te, ee, re = {}.hasOwnProperty, ne = [].indexOf || function(t) {
            for (var e = 0, r = this.length; r > e; e++)
                if (e in this && this[e] === t)
                    return e;
            return -1
        }, ie = function(t, e) {
        function r() {
            this.constructor = t
        }
        for (var n in e)
            re.call(e, n) && (t[n] = e[n]);
        return r.prototype = e.prototype, t.prototype = new r, t.__super__ = e.prototype, t
    }, oe = [].slice;
    if (S = function() {
            function t() {
                throw new Error("Not implemented. Did you mean to use Dropbox.Client?")
            }
            return t
        }(), S.Util = function() {
            function t() {
            }
            return t
        }(), S.Http = function() {
            function t() {
            }
            return t
        }(), S.File = function() {
            function t() {
            }
            return t
        }(), u = "1.2.0", "undefined" != typeof global && "undefined" != typeof module && "exports" in module)
        c = global, d = module.require.bind(module), module.exports = S;
    else if ("undefined" != typeof window && "undefined" != typeof navigator)
        c = window, d = null, window.Dropbox && !function() {
            var t, e, r, n;
            r = window.Dropbox, n = [];
            for (t in r)
                re.call(r, t) && (e = r[t], n.push(S[t] = e));
            return n
        }(), window.Dropbox = S;
    else {
        if ("undefined" == typeof self || "undefined" == typeof navigator)
            throw new Error("dropbox.js loaded in an unsupported JavaScript environment.");
        c = self, d = self.importScripts.bind(self), self.Dropbox = S
    }
    if (S.Env = function() {
            function t() {
            }
            return t.global = c, t.require = d, t
        }(), S.Util.EventSource = function() {
            function t(t) {
                this._cancelable = t && t.cancelable, this._listeners = []
            }
            return t.prototype.addListener = function(t) {
                if ("function" != typeof t)
                    throw new TypeError("Invalid listener type; expected function");
                return ne.call(this._listeners, t) < 0 && this._listeners.push(t), this
            }, t.prototype.removeListener = function(t) {
                var e, r, n, i, o, s;
                if (this._listeners.indexOf)
                    r = this._listeners.indexOf(t), -1 !== r && this._listeners.splice(r, 1);
                else
                    for (s = this._listeners, e = i = 0, o = s.length; o > i; e = ++i)
                        if (n = s[e], n === t) {
                            this._listeners.splice(e, 1);
                            break
                        }
                return this
            }, t.prototype.dispatch = function(t) {
                var e, r, n, i, o;
                for (o = this._listeners, n = 0, i = o.length; i > n; n++)
                    if (e = o[n], r = e(t), this._cancelable && r === !1)
                        return !1;
                return !0
            }, t
        }(), S.AccountInfo = function() {
            function t(t) {
                var e;
                this._json = t, this.name = t.display_name, this.email = t.email, this.countryCode = t.country || null, this.uid = t.uid.toString(), t.public_app_url ? (this.publicAppUrl = t.public_app_url, e = this.publicAppUrl.length - 1, e >= 0 && "/" === this.publicAppUrl.substring(e) && (this.publicAppUrl = this.publicAppUrl.substring(0, e))) : this.publicAppUrl = null, this.referralUrl = t.referral_link, this.quota = t.quota_info.quota, this.privateBytes = t.quota_info.normal || 0, this.sharedBytes = t.quota_info.shared || 0, this.usedQuota = this.privateBytes + this.sharedBytes
            }
            return t.parse = function(t) {
                return t && "object" == typeof t ? new S.AccountInfo(t) : t
            }, t.prototype.name = null, t.prototype.email = null, t.prototype.countryCode = null, t.prototype.uid = null, t.prototype.referralUrl = null, t.prototype.publicAppUrl = null, t.prototype.quota = null, t.prototype.usedQuota = null, t.prototype.privateBytes = null, t.prototype.sharedBytes = null, t.prototype.json = function() {
                return this._json
            }, t
        }(), S.ApiError = function() {
            function t(t, e, r) {
                var n, i;
                if (this.method = e, this.url = r, this.status = t.status, t.responseType)
                    try {
                        n = t.response || t.responseText
                    } catch (o) {
                        i = o;
                        try {
                            n = t.responseText
                        } catch (o) {
                            i = o, n = null
                        }
                    }
                else
                    try {
                        n = t.responseText
                    } catch (o) {
                        i = o, n = null
                    }
                if (n)
                    try {
                        this.responseText = n.toString(), this.response = JSON.parse(n)
                    } catch (o) {
                        i = o, this.response = null
                    }
                else
                    this.responseText = "(no response)", this.response = null
            }
            return t.prototype.status = null, t.prototype.method = null, t.prototype.url = null, t.prototype.responseText = null, t.prototype.response = null, t.NETWORK_ERROR = 0, t.NO_CONTENT = 304, t.INVALID_PARAM = 400, t.INVALID_TOKEN = 401, t.OAUTH_ERROR = 403, t.NOT_FOUND = 404, t.INVALID_METHOD = 405, t.NOT_ACCEPTABLE = 406, t.CONFLICT = 409, t.RATE_LIMITED = 429, t.SERVER_ERROR = 503, t.OVER_QUOTA = 507, t.prototype.toString = function() {
                return "Dropbox API error " + this.status + " from " + this.method + " " + this.url + " :: " + this.responseText
            }, t.prototype.inspect = function() {
                return this.toString()
            }, t
        }(), S.AuthDriver = function() {
            function t() {
            }
            return t.prototype.authType = function() {
                return "code"
            }, t.prototype.url = function() {
                return "https://some.url"
            }, t.prototype.doAuthorize = function(t, e, r, n) {
                return n({code: "access-code"})
            }, t.prototype.getStateParam = function(t, e) {
                return e(S.Util.Oauth.randomAuthStateParam())
            }, t.prototype.resumeAuthorize = function(t, e, r) {
                return r({code: "access-code"})
            }, t.prototype.onAuthStateChange = function(t, e) {
                return e()
            }, t.oauthQueryParams = ["access_token", "expires_in", "scope", "token_type", "code", "error", "error_description", "error_uri", "mac_key", "mac_algorithm"].sort(), t
        }(), S.AuthDriver.autoConfigure = function(t) {
            if ("undefined" != typeof chrome && chrome.runtime && chrome.runtime.id)
                return chrome.tabs && chrome.tabs.create ? t.authDriver(new S.AuthDriver.ChromeExtension) : t.authDriver(new S.AuthDriver.ChromeApp), void 0;
            if ("undefined" != typeof window) {
                if (window.cordova)
                    return t.authDriver(new S.AuthDriver.Cordova), void 0;
                window && window.navigator && t.authDriver(new S.AuthDriver.Redirect)
            }
        }, S.AuthDriver.BrowserBase = function() {
            function t(t) {
                t ? (this.rememberUser = "rememberUser" in t ? t.rememberUser : !0, this.scope = t.scope || "default") : (this.rememberUser = !0, this.scope = "default"), this.storageKey = null, this.storage = S.AuthDriver.BrowserBase.localStorage(), this.stateRe = /^[^#]+\#(.*&)?state=([^&]+)(&|$)/
            }
            return t.prototype.authType = function() {
                return "token"
            }, t.prototype.onAuthStepChange = function(t, e) {
                var r = this;
                switch (this.setStorageKey(t), t.authStep) {
                    case S.Client.RESET:
                        return this.loadCredentials(function(n) {
                            return n ? (t.setCredentials(n), t.authStep !== S.Client.DONE ? e() : r.rememberUser ? (t.setCredentials(n), e()) : r.forgetCredentials(e)) : e()
                        });
                    case S.Client.DONE:
                        return this.rememberUser ? this.storeCredentials(t.credentials(), e) : this.forgetCredentials(e);
                    case S.Client.SIGNED_OUT:
                        return this.forgetCredentials(e);
                    case S.Client.ERROR:
                        return this.forgetCredentials(e);
                    default:
                        return e(), this
                }
            }, t.prototype.setStorageKey = function(t) {
                return this.storageKey = "dropbox-auth:" + this.scope + ":" + t.appHash(), this
            }, t.prototype.storeCredentials = function(t, e) {
                var r, n, i, o;
                r = JSON.stringify(t);
                try {
                    this.storage.setItem(this.storageKey, r)
                } catch (s) {
                    i = s, n = encodeURIComponent(this.storageKey), o = encodeURIComponent(r), document.cookie = "" + n + "=" + o + "; path=/"
                }
                return e(), this
            }, t.prototype.loadCredentials = function(t) {
                var e, r, n, i, o, s, a;
                try {
                    n = this.storage.getItem(this.storageKey)
                } catch (u) {
                    a = u, n = null
                }
                if (null === n && (o = encodeURIComponent(this.storageKey), s = o.replace(/[.*+()]/g, "\\$&"), e = new RegExp("(^|(;\\s*))" + o + "=([^;]*)(;|$)"), (i = e.exec(document.cookie)) && (n = decodeURIComponent(i[3]))), !n)
                    return t(null), this;
                try {
                    t(JSON.parse(n))
                } catch (u) {
                    r = u, t(null)
                }
                return this
            }, t.prototype.forgetCredentials = function(t) {
                var e, r, n;
                try {
                    this.storage.removeItem(this.storageKey)
                } catch (i) {
                    n = i, r = encodeURIComponent(this.storageKey), e = new Date(0).toGMTString(), document.cookie = "" + r + "={}; expires=" + e + "; path=/"
                }
                return t(), this
            }, t.prototype.locationStateParam = function(t) {
                var e, r;
                return e = t || S.AuthDriver.BrowserBase.currentLocation(), r = this.stateRe.exec(e), r ? decodeURIComponent(r[2]) : null
            }, t.prototype.replaceUrlBasename = function(t, e) {
                var r, n, i;
                return n = t.indexOf("#"), -1 !== n && (t = t.substring(0, n)), i = t.indexOf("?"), -1 !== i && (t = t.substring(0, i)), r = t.split("/"), r[r.length - 1] = e, r.join("/")
            }, t.localStorage = function() {
                return "undefined" != typeof window ? window.localStorage : null
            }, t.currentLocation = function() {
                return window.location.href
            }, t.cleanupLocation = function() {
                var t, e;
                window.history && window.history.replaceState ? (e = this.currentLocation(), t = e.indexOf("#"), window.history.replaceState({}, document.title, e.substring(0, t))) : window.location.hash = ""
            }, t
        }(), S.AuthDriver.Redirect = function(t) {
            function e(t) {
                e.__super__.constructor.call(this, t), this.receiverUrl = this.baseUrl(t)
            }
            return ie(e, t), e.prototype.baseUrl = function(t) {
                var e, r;
                if (r = S.AuthDriver.BrowserBase.currentLocation(), t) {
                    if (t.redirectUrl)
                        return t.redirectUrl;
                    if (t.redirectFile)
                        return this.replaceUrlBasename(r, t.redirectFile)
                }
                return e = r.indexOf("#"), -1 !== e && (r = r.substring(0, e)), r
            }, e.prototype.url = function() {
                return this.receiverUrl
            }, e.prototype.doAuthorize = function(t, e, r) {
                return this.storeCredentials(r.credentials(), function() {
                    return window.location.assign(t)
                })
            }, e.prototype.resumeAuthorize = function(t, e, r) {
                var n;
                return this.locationStateParam() === t ? (n = S.AuthDriver.BrowserBase.currentLocation(), S.AuthDriver.BrowserBase.cleanupLocation(), r(S.Util.Oauth.queryParamsFromUrl(n))) : this.forgetCredentials(function() {
                    return r({error: "Authorization error"})
                })
            }, e
        }(S.AuthDriver.BrowserBase), S.AuthDriver.Popup = function(t) {
            function e(t) {
                e.__super__.constructor.call(this, t), this.receiverUrl = this.baseUrl(t)
            }
            return ie(e, t), e.prototype.url = function() {
                return this.receiverUrl
            }, e.prototype.doAuthorize = function(t, e, r, n) {
                return this.listenForMessage(e, n), this.openWindow(t)
            }, e.prototype.baseUrl = function(t) {
                var e;
                if (e = S.AuthDriver.BrowserBase.currentLocation(), t) {
                    if (t.receiverUrl)
                        return t.receiverUrl;
                    if (t.receiverFile)
                        return this.replaceUrlBasename(e, t.receiverFile)
                }
                return e
            }, e.prototype.openWindow = function(t) {
                return window.open(t, "_dropboxOauthSigninWindow", this.popupWindowSpec(980, 700))
            }, e.prototype.popupWindowSpec = function(t, e) {
                var r, n, i, o, s, a, u, l, h, c;
                return s = null != (u = window.screenX) ? u : window.screenLeft, a = null != (l = window.screenY) ? l : window.screenTop, o = null != (h = window.outerWidth) ? h : document.documentElement.clientWidth, r = null != (c = window.outerHeight) ? c : document.documentElement.clientHeight, n = Math.round(s + (o - t) / 2), i = Math.round(a + (r - e) / 2.5), s > n && (n = s), a > i && (i = a), "width=" + t + ",height=" + e + "," + ("left=" + n + ",top=" + i) + "dialog=yes,dependent=yes,scrollbars=yes,location=yes"
            }, e.prototype.listenForMessage = function(t, e) {
                var r, n = this;
                return r = function(i) {
                    var o, s, a;
                    o = i.data ? i.data : i;
                    try {
                        a = JSON.parse(o)._dropboxjs_oauth_info
                    } catch (u) {
                        return s = u, void 0
                    }
                    if (a)
                        return n.locationStateParam(a) === t ? (t = !1, window.removeEventListener("message", r), S.AuthDriver.Popup.onMessage.removeListener(r), e(S.Util.Oauth.queryParamsFromUrl(o))) : void 0
                }, window.addEventListener("message", r, !1), S.AuthDriver.Popup.onMessage.addListener(r)
            }, e.locationOrigin = function(t) {
                var e;
                return (e = /^(file:\/\/[^\?\#]*)(\?|\#|$)/.exec(t)) ? e[1] : (e = /^([^\:]+\:\/\/[^\/\?\#]*)(\/|\?|\#|$)/.exec(t), e ? e[1] : t)
            }, e.oauthReceiver = function() {
                window.addEventListener("load", function() {
                    var t, e, r, n, i, o;
                    if (o = window.location.href, r = JSON.stringify({_dropboxjs_oauth_info: o}), S.AuthDriver.BrowserBase.cleanupLocation(), n = window.opener, window.parent !== window.top && (n || (n = window.parent)), n) {
                        try {
                            i = window.location.origin || locationOrigin(o), n.postMessage(r, i), window.close()
                        } catch (s) {
                            e = s
                        }
                        try {
                            return n.Dropbox.AuthDriver.Popup.onMessage.dispatch(r), window.close()
                        } catch (s) {
                            t = s
                        }
                    }
                })
            }, e.onMessage = new S.Util.EventSource, e
        }(S.AuthDriver.BrowserBase), S.AuthDriver.ChromeBase = function(t) {
            function e(t) {
                e.__super__.constructor.call(this, t), this.storageKey = "dropbox_js_" + this.scope + "_credentials"
            }
            return ie(e, t), e.prototype.onAuthStepChange = function(t, e) {
                switch (t.authStep) {
                    case S.Client.RESET:
                        return this.loadCredentials(function(r) {
                            return r && t.setCredentials(r), e()
                        });
                    case S.Client.DONE:
                        return this.storeCredentials(t.credentials(), e);
                    case S.Client.SIGNED_OUT:
                        return this.forgetCredentials(e);
                    case S.Client.ERROR:
                        return this.forgetCredentials(e);
                    default:
                        return e()
                }
            }, e.prototype.url = function() {
                return this.receiverUrl
            }, e.prototype.storeCredentials = function(t, e) {
                var r;
                return r = {}, r[this.storageKey] = t, chrome.storage.local.set(r, e), this
            }, e.prototype.loadCredentials = function(t) {
                var e = this;
                return chrome.storage.local.get(this.storageKey, function(r) {
                    return t(r[e.storageKey] || null)
                }), this
            }, e.prototype.forgetCredentials = function(t) {
                return chrome.storage.local.remove(this.storageKey, t), this
            }, e
        }(S.AuthDriver.BrowserBase), S.AuthDriver.ChromeApp = function(t) {
            function e(t) {
                e.__super__.constructor.call(this, t), this.receiverUrl = "https://" + chrome.runtime.id + ".chromiumapp.org/"
            }
            return ie(e, t), e.prototype.doAuthorize = function(t, e, r, n) {
                var i = this;
                return chrome.identity.launchWebAuthFlow({url: t,interactive: !0}, function(t) {
                    return i.locationStateParam(t) === e ? (e = !1, n(S.Util.Oauth.queryParamsFromUrl(t))) : void 0
                })
            }, e
        }(S.AuthDriver.ChromeBase), S.AuthDriver.ChromeExtension = function(t) {
            function e(t) {
                var r;
                e.__super__.constructor.call(this, t), r = t && t.receiverPath || "chrome_oauth_receiver.html", this.receiverUrl = chrome.runtime.getURL(r)
            }
            return ie(e, t), e.prototype.doAuthorize = function(t, e, r, n) {
                var i, o, s = this;
                return o = null, i = function(t, r) {
                    var a;
                    if ((!r || !r.tab || r.tab.url.substring(0, s.receiverUrl.length) === s.receiverUrl) && t.dropbox_oauth_receiver_href)
                        return a = t.dropbox_oauth_receiver_href, s.locationStateParam(a) === e ? (e = !1, o && chrome.tabs.remove(o.id), chrome.runtime.onMessage.removeListener(i), n(S.Util.Oauth.queryParamsFromUrl(a))) : void 0
                }, chrome.runtime.onMessage.addListener(i), chrome.tabs.create({url: t,active: !0,pinned: !1}, function(t) {
                    return o = t
                })
            }, e.oauthReceiver = function() {
                return window.addEventListener("load", function() {
                    var t;
                    return t = window.location.href, window.location.hash = "", chrome.runtime.sendMessage({dropbox_oauth_receiver_href: t}), window.close ? window.close() : void 0
                })
            }, e
        }(S.AuthDriver.ChromeBase), S.AuthDriver.Cordova = function(t) {
            function e(t) {
                e.__super__.constructor.call(this, t)
            }
            return ie(e, t), e.prototype.url = function() {
                return "https://www.dropbox.com/1/oauth2/redirect_receiver"
            }, e.prototype.doAuthorize = function(t, e, r, n) {
                var i, o, s, a, u, l = this;
                return o = window.open(t, "_blank", "location=yes,closebuttoncaption=Cancel"), a = !1, i = /^[^/]*\/\/[^/]*\//.exec(t)[0], u = !1, s = function(t) {
                    if (t.url && l.locationStateParam(t.url) === e) {
                        if (u)
                            return;
                        return o.removeEventListener("loadstart", s), o.removeEventListener("loaderror", s), o.removeEventListener("loadstop", s), o.removeEventListener("exit", s), u = !0, window.setTimeout(function() {
                            return o.close()
                        }, 10), n(S.Util.Oauth.queryParamsFromUrl(t.url)), void 0
                    }
                    if ("exit" === t.type) {
                        if (u)
                            return;
                        o.removeEventListener("loadstart", s), o.removeEventListener("loaderror", s), o.removeEventListener("loadstop", s), o.removeEventListener("exit", s), u = !0, n(new AuthError("error=access_denied&error_description=User+closed+browser+window"))
                    }
                }, o.addEventListener("loadstart", s), o.addEventListener("loaderror", s), o.addEventListener("loadstop", s), o.addEventListener("exit", s)
            }, e
        }(S.AuthDriver.BrowserBase), S.AuthDriver.NodeServer = function() {
            function t(t) {
                this._port = (null != t ? t.port : void 0) || 8912, (null != t ? t.tls : void 0) ? (this._tlsOptions = t.tls, ("string" == typeof this._tlsOptions || this._tlsOptions instanceof Buffer) && (this._tlsOptions = {key: this._tlsOptions,cert: this._tlsOptions})) : this._tlsOptions = null, this._fs = S.Env.require("fs"), this._http = S.Env.require("http"), this._https = S.Env.require("https"), this._open = S.Env.require("open"), this._callbacks = {}, this._nodeUrl = S.Env.require("url"), this.createApp()
            }
            return t.prototype.authType = function() {
                return "code"
            }, t.prototype.url = function() {
                var t;
                return t = null === this._tlsOptions ? "http" : "https", "" + t + "://localhost:" + this._port + "/oauth_callback"
            }, t.prototype.doAuthorize = function(t, e, r, n) {
                return this._callbacks[e] = n, this.openBrowser(t)
            }, t.prototype.openBrowser = function(t) {
                if (!t.match(/^https?:\/\//))
                    throw new Error("Not a http/https URL: " + t);
                return "BROWSER" in process.env ? this._open(t, process.env.BROWSER) : this._open(t)
            }, t.prototype.createApp = function() {
                var t = this;
                return this._app = this._tlsOptions ? this._https.createServer(this._tlsOptions, function(e, r) {
                    return t.doRequest(e, r)
                }) : this._http.createServer(function(e, r) {
                    return t.doRequest(e, r)
                }), this._app.listen(this._port)
            }, t.prototype.closeServer = function() {
                return this._app.close()
            }, t.prototype.doRequest = function(t, e) {
                var r, n, i, o = this;
                return i = this._nodeUrl.parse(t.url, !0), "/oauth_callback" === i.pathname && (n = i.query.state, this._callbacks[n] && (this._callbacks[n](i.query), delete this._callbacks[n])), r = "", t.on("data", function(t) {
                    return r += t
                }), t.on("end", function() {
                    return o.closeBrowser(e)
                })
            }, t.prototype.closeBrowser = function(t) {
                var e;
                return e = '<!doctype html>\n<script type="text/javascript">window.close();</script>\n<p>Please close this window.</p>', t.writeHead(200, {"Content-Length": e.length,"Content-Type": "text/html"}), t.write(e), t.end()
            }, t
        }(), S.AuthError = function() {
            function t(t) {
                var e;
                if (!t.error)
                    throw new Error("Not an OAuth 2.0 error: " + JSON.stringify(t));
                e = "object" == typeof t.error && t.error.error ? t.error : t, this.code = e.error, this.description = e.error_description || null, this.uri = e.error_uri || null
            }
            return t.prototype.code = null, t.prototype.description = null, t.prototype.uri = null, t.ACCESS_DENIED = "access_denied", t.INVALID_REQUEST = "invalid_request", t.UNAUTHORIZED_CLIENT = "unauthorized_client", t.INVALID_GRANT = "invalid_grant", t.INVALID_SCOPE = "invalid_scope", t.UNSUPPORTED_GRANT_TYPE = "unsupported_grant_type", t.UNSUPPORTED_RESPONSE_TYPE = "unsupported_response_type", t.SERVER_ERROR = "server_error", t.TEMPORARILY_UNAVAILABLE = "temporarily_unavailable", t.prototype.toString = function() {
                return "Dropbox OAuth error " + this.code + " :: " + this.description
            }, t.prototype.inspect = function() {
                return this.toString()
            }, t
        }(), S.Client = function() {
            function t(t) {
                var e = this;
                this._serverRoot = t.server || this._defaultServerRoot(), this._maxApiServer = "maxApiServer" in t ? t.maxApiServer : this._defaultMaxApiServer(), this._authServer = t.authServer || this._defaultAuthServer(), this._fileServer = t.fileServer || this._defaultFileServer(), this._downloadServer = t.downloadServer || this._defaultDownloadServer(), this._notifyServer = t.notifyServer || this._defaultNotifyServer(), this.onXhr = new S.Util.EventSource({cancelable: !0}), this.onError = new S.Util.EventSource, this.onAuthStepChange = new S.Util.EventSource, this._xhrOnErrorHandler = function(t, r) {
                    return e._handleXhrError(t, r)
                }, this._oauth = new S.Util.Oauth(t), this._uid = t.uid || null, this.authStep = this._oauth.step(), this._driver = null, this.authError = null, this._credentials = null, this._datastoreManager = null, this.setupUrls()
            }
            return t.prototype.onXhr = null, t.prototype.onError = null, t.prototype.onAuthStepChange = null, t.prototype.authDriver = function(t) {
                return this._driver = t, this
            }, t.prototype.dropboxUid = function() {
                return this._uid
            }, t.prototype.credentials = function() {
                return this._credentials || this._computeCredentials(), this._credentials
            }, t.prototype.authenticate = function(t, e) {
                var r, n, i, o, s, a = this;
                if (e || "function" != typeof t || (e = t, t = null), r = t && "interactive" in t ? t.interactive : !0, !this._driver && this.authStep !== h.DONE && (S.AuthDriver.autoConfigure(this), !this._driver))
                    throw new Error("OAuth driver auto-configuration failed. Call authDriver.");
                if (this.authStep === h.ERROR)
                    throw new Error("Client got in an error state. Call reset() to reuse it!");
                return o = function() {
                    return a.authStep = a._oauth.step(), a.authStep === h.ERROR && (a.authError = a._oauth.error()), a._credentials = null, a.onAuthStepChange.dispatch(a), s()
                }, i = function() {
                    return a.authStep = h.ERROR, a._credentials = null, a.onAuthStepChange.dispatch(a), s()
                }, n = null, s = function() {
                    var t;
                    if (n !== a.authStep && (n = a.authStep, a._driver && a._driver.onAuthStepChange))
                        return a._driver.onAuthStepChange(a, s), void 0;
                    switch (a.authStep) {
                        case h.RESET:
                            return r ? (a._driver.getStateParam && a._driver.getStateParam(function(t) {
                                return a.client.authStep === h.RESET && a._oauth.setAuthStateParam(t), o()
                            }), a._oauth.setAuthStateParam(S.Util.Oauth.randomAuthStateParam()), o()) : (e && e(null, a), void 0);
                        case h.PARAM_SET:
                            return r ? (t = a.authorizeUrl(), a._driver.doAuthorize(t, a._oauth.authStateParam(), a, function(t) {
                                return a._oauth.processRedirectParams(t), t.uid && (a._uid = t.uid), o()
                            })) : (e && e(null, a), void 0);
                        case h.PARAM_LOADED:
                            return a._driver.resumeAuthorize ? a._driver.resumeAuthorize(a._oauth.authStateParam(), a, function(t) {
                                return a._oauth.processRedirectParams(t), t.uid && (a._uid = t.uid), o()
                            }) : (a._oauth.setAuthStateParam(a._oauth.authStateParam()), o(), void 0);
                        case h.AUTHORIZED:
                            return a.getAccessToken(function(t, e) {
                                return t ? (a.authError = t, i()) : (a._oauth.processRedirectParams(e), a._uid = e.uid, o())
                            });
                        case h.DONE:
                            e && e(null, a);
                            break;
                        case h.SIGNED_OUT:
                            return a.authStep = h.RESET, a.reset(), s();
                        case h.ERROR:
                            e && e(a.authError, a)
                    }
                }, s(), this
            }, t.prototype.isAuthenticated = function() {
                return this.authStep === h.DONE
            }, t.prototype.signOut = function(t, e) {
                var r, n, i = this;
                if (e || "function" != typeof t || (e = t, t = null), r = t && t.mustInvalidate, this.authStep !== h.DONE)
                    throw new Error("This client doesn't have a user's token");
                return n = new S.Util.Xhr("POST", this._urls.signOut), n.signWithOauth(this._oauth), this._dispatchXhr(n, function(t) {
                    if (t)
                        if (t.status === S.ApiError.INVALID_TOKEN)
                            t = null;
                        else if (r)
                            return e && e(t), void 0;
                    return i.authStep = h.RESET, i.reset(), i.authStep = h.SIGNED_OUT, i.onAuthStepChange.dispatch(i), i._driver && i._driver.onAuthStepChange ? i._driver.onAuthStepChange(i, function() {
                        return e ? e(null) : void 0
                    }) : e ? e(null) : void 0
                })
            }, t.prototype.signOff = function(t, e) {
                return this.signOut(t, e)
            }, t.prototype.getAccountInfo = function(t, e) {
                var r, n;
                return e || "function" != typeof t || (e = t, t = null), r = !1, t && t.httpCache && (r = !0), n = new S.Util.Xhr("GET", this._urls.accountInfo), n.signWithOauth(this._oauth, r), this._dispatchXhr(n, function(t, r) {
                    return e(t, S.AccountInfo.parse(r), r)
                })
            }, t.prototype.getUserInfo = function(t, e) {
                return this.getAccountInfo(t, e)
            }, t.prototype.readFile = function(t, e, r) {
                var n, i, o, s, a, u, l;
                return r || "function" != typeof e || (r = e, e = null), i = {}, u = "text", s = null, n = !1, e && (e.versionTag ? i.rev = e.versionTag : e.rev && (i.rev = e.rev), e.arrayBuffer ? u = "arraybuffer" : e.blob ? u = "blob" : e.buffer ? u = "buffer" : e.binary && (u = "b"), e.length ? (null != e.start ? (a = e.start, o = e.start + e.length - 1) : (a = "", o = e.length), s = "bytes=" + a + "-" + o) : null != e.start && (s = "bytes=" + e.start + "-"), e.httpCache && (n = !0)), l = new S.Util.Xhr("GET", "" + this._urls.getFile + "/" + this._urlEncodePath(t)), l.setParams(i).signWithOauth(this._oauth, n), l.setResponseType(u), s && (s && l.setHeader("Range", s), l.reportResponseHeaders()), this._dispatchXhr(l, function(t, e, n, i) {
                    var o;
                    return o = i ? S.Http.RangeInfo.parse(i["content-range"]) : null, r(t, e, S.File.Stat.parse(n), o)
                })
            }, t.prototype.writeFile = function(t, e, r, n) {
                var i;
                return n || "function" != typeof r || (n = r, r = null), i = S.Util.Xhr.canSendForms && "object" == typeof e, i ? this._writeFileUsingForm(t, e, r, n) : this._writeFileUsingPut(t, e, r, n)
            }, t.prototype._writeFileUsingForm = function(t, e, r, n) {
                var i, o, s, a;
                return s = t.lastIndexOf("/"), -1 === s ? (i = t, t = "") : (i = t.substring(s), t = t.substring(0, s)), o = {file: i}, r && (r.noOverwrite && (o.overwrite = "false"), r.lastVersionTag ? o.parent_rev = r.lastVersionTag : (r.parentRev || r.parent_rev) && (o.parent_rev = r.parentRev || r.parent_rev)), a = new S.Util.Xhr("POST", "" + this._urls.postFile + "/" + this._urlEncodePath(t)), a.setParams(o).signWithOauth(this._oauth).setFileField("file", i, e, "application/octet-stream"), delete o.file, this._dispatchXhr(a, function(t, e) {
                    return n ? n(t, S.File.Stat.parse(e)) : void 0
                })
            }, t.prototype._writeFileUsingPut = function(t, e, r, n) {
                var i, o;
                return i = {}, r && (r.noOverwrite && (i.overwrite = "false"), r.lastVersionTag ? i.parent_rev = r.lastVersionTag : (r.parentRev || r.parent_rev) && (i.parent_rev = r.parentRev || r.parent_rev)), o = new S.Util.Xhr("POST", "" + this._urls.putFile + "/" + this._urlEncodePath(t)), o.setBody(e).setParams(i).signWithOauth(this._oauth), this._dispatchXhr(o, function(t, e) {
                    return n ? n(t, S.File.Stat.parse(e)) : void 0
                })
            }, t.prototype.resumableUploadStep = function(t, e, r) {
                var n, i;
                return e ? (n = {offset: e.offset}, e.tag && (n.upload_id = e.tag)) : n = {offset: 0}, i = new S.Util.Xhr("POST", this._urls.chunkedUpload), i.setBody(t).setParams(n).signWithOauth(this._oauth), this._dispatchXhr(i, function(t, e) {
                    return t && t.status === S.ApiError.INVALID_PARAM && t.response && t.response.upload_id && t.response.offset ? r(null, S.Http.UploadCursor.parse(t.response)) : r(t, S.Http.UploadCursor.parse(e))
                })
            }, t.prototype.resumableUploadFinish = function(t, e, r, n) {
                var i, o;
                return n || "function" != typeof r || (n = r, r = null), i = {upload_id: e.tag}, r && (r.lastVersionTag ? i.parent_rev = r.lastVersionTag : (r.parentRev || r.parent_rev) && (i.parent_rev = r.parentRev || r.parent_rev), r.noOverwrite && (i.overwrite = "false")), o = new S.Util.Xhr("POST", "" + this._urls.commitChunkedUpload + "/" + this._urlEncodePath(t)), o.setParams(i).signWithOauth(this._oauth), this._dispatchXhr(o, function(t, e) {
                    return n ? n(t, S.File.Stat.parse(e)) : void 0
                })
            }, t.prototype.stat = function(t, e, r) {
                var n, i, o;
                return r || "function" != typeof e || (r = e, e = null), i = {}, n = !1, e && (e.versionTag ? i.rev = e.versionTag : e.rev && (i.rev = e.rev), e.contentHash ? i.hash = e.contentHash : e.hash && (i.hash = e.hash), (e.removed || e.deleted) && (i.include_deleted = "true"), e.readDir && (i.list = "true", e.readDir !== !0 && (i.file_limit = e.readDir.toString())), e.cacheHash && (i.hash = e.cacheHash), e.httpCache && (n = !0)), i.include_deleted || (i.include_deleted = "false"), i.list || (i.list = "false"), o = new S.Util.Xhr("GET", "" + this._urls.metadata + "/" + this._urlEncodePath(t)), o.setParams(i).signWithOauth(this._oauth, n), this._dispatchXhr(o, function(t, e) {
                    var n, i, o;
                    return o = S.File.Stat.parse(e), n = (null != e ? e.contents : void 0) ? function() {
                        var t, r, n, o;
                        for (n = e.contents, o = [], t = 0, r = n.length; r > t; t++)
                            i = n[t], o.push(S.File.Stat.parse(i));
                        return o
                    }() : void 0, r(t, o, n)
                })
            }, t.prototype.readdir = function(t, e, r) {
                var n;
                return r || "function" != typeof e || (r = e, e = null), n = {readDir: !0}, e && (null != e.limit && (n.readDir = e.limit), e.versionTag ? n.versionTag = e.versionTag : e.rev && (n.versionTag = e.rev), e.contentHash ? n.contentHash = e.contentHash : e.hash && (n.contentHash = e.hash), (e.removed || e.deleted) && (n.removed = e.removed || e.deleted), e.httpCache && (n.httpCache = e.httpCache)), this.stat(t, n, function(t, e, n) {
                    var i, o;
                    return i = n ? function() {
                        var t, e, r;
                        for (r = [], t = 0, e = n.length; e > t; t++)
                            o = n[t], r.push(o.name);
                        return r
                    }() : null, r(t, i, e, n)
                })
            }, t.prototype.metadata = function(t, e, r) {
                return this.stat(t, e, r)
            }, t.prototype.makeUrl = function(t, e, r) {
                var n, i, o, s, a, u = this;
                return r || "function" != typeof e || (r = e, e = null), i = e && (e["long"] || e.longUrl || e.downloadHack) ? {short_url: "false"} : {}, t = this._urlEncodePath(t), o = "" + this._urls.shares + "/" + t, n = !1, s = !1, e && (e.downloadHack ? (n = !0, s = !0) : e.download && (n = !0, o = "" + this._urls.media + "/" + t)), a = new S.Util.Xhr("POST", o).setParams(i).signWithOauth(this._oauth), this._dispatchXhr(a, function(t, e) {
                    return s && (null != e ? e.url : void 0) && (e.url = e.url.replace(u._authServer, u._downloadServer)), r(t, S.File.ShareUrl.parse(e, n))
                })
            }, t.prototype.history = function(t, e, r) {
                var n, i, o;
                return r || "function" != typeof e || (r = e, e = null), i = {}, n = !1, e && (null != e.limit && (i.rev_limit = e.limit), e.httpCache && (n = !0)), o = new S.Util.Xhr("GET", "" + this._urls.revisions + "/" + this._urlEncodePath(t)), o.setParams(i).signWithOauth(this._oauth, n), this._dispatchXhr(o, function(t, e) {
                    var n, i;
                    return i = e ? function() {
                        var t, r, i;
                        for (i = [], t = 0, r = e.length; r > t; t++)
                            n = e[t], i.push(S.File.Stat.parse(n));
                        return i
                    }() : void 0, r(t, i)
                })
            }, t.prototype.revisions = function(t, e, r) {
                return this.history(t, e, r)
            }, t.prototype.thumbnailUrl = function(t, e) {
                var r;
                return r = this.thumbnailXhr(t, e), r.paramsToUrl().url
            }, t.prototype.readThumbnail = function(t, e, r) {
                var n, i;
                return r || "function" != typeof e || (r = e, e = null), n = "b", e && (e.blob && (n = "blob"), e.arrayBuffer && (n = "arraybuffer"), e.buffer && (n = "buffer")), i = this.thumbnailXhr(t, e), i.setResponseType(n), this._dispatchXhr(i, function(t, e, n) {
                    return r(t, e, S.File.Stat.parse(n))
                })
            }, t.prototype.thumbnailXhr = function(t, e) {
                var r, n;
                return r = {}, e && (e.format ? r.format = e.format : e.png && (r.format = "png"), e.size && (r.size = e.size)), n = new S.Util.Xhr("GET", "" + this._urls.thumbnails + "/" + this._urlEncodePath(t)), n.setParams(r).signWithOauth(this._oauth)
            }, t.prototype.revertFile = function(t, e, r) {
                var n;
                return n = new S.Util.Xhr("POST", "" + this._urls.restore + "/" + this._urlEncodePath(t)), n.setParams({rev: e}).signWithOauth(this._oauth), this._dispatchXhr(n, function(t, e) {
                    return r ? r(t, S.File.Stat.parse(e)) : void 0
                })
            }, t.prototype.restore = function(t, e, r) {
                return this.revertFile(t, e, r)
            }, t.prototype.findByName = function(t, e, r, n) {
                var i, o, s;
                return n || "function" != typeof r || (n = r, r = null), o = {query: e}, i = !1, r && (null != r.limit && (o.file_limit = r.limit), (r.removed || r.deleted) && (o.include_deleted = !0), r.httpCache && (i = !0)), s = new S.Util.Xhr("GET", "" + this._urls.search + "/" + this._urlEncodePath(t)), s.setParams(o).signWithOauth(this._oauth, i), this._dispatchXhr(s, function(t, e) {
                    var r, i;
                    return i = e ? function() {
                        var t, n, i;
                        for (i = [], t = 0, n = e.length; n > t; t++)
                            r = e[t], i.push(S.File.Stat.parse(r));
                        return i
                    }() : void 0, n(t, i)
                })
            }, t.prototype.search = function(t, e, r, n) {
                return this.findByName(t, e, r, n)
            }, t.prototype.makeCopyReference = function(t, e) {
                var r;
                return r = new S.Util.Xhr("GET", "" + this._urls.copyRef + "/" + this._urlEncodePath(t)), r.signWithOauth(this._oauth), this._dispatchXhr(r, function(t, r) {
                    return e(t, S.File.CopyReference.parse(r))
                })
            }, t.prototype.copyRef = function(t, e) {
                return this.makeCopyReference(t, e)
            }, t.prototype.pullChanges = function(t, e) {
                var r, n;
                return e || "function" != typeof t || (e = t, t = null), r = t ? t.cursorTag ? {cursor: t.cursorTag} : {cursor: t} : {}, n = new S.Util.Xhr("POST", this._urls.delta), n.setParams(r).signWithOauth(this._oauth), this._dispatchXhr(n, function(t, r) {
                    return e(t, S.Http.PulledChanges.parse(r))
                })
            }, t.prototype.delta = function(t, e) {
                return this.pullChanges(t, e)
            }, t.prototype.pollForChanges = function(t, e, r) {
                var n, i;
                return r || "function" != typeof e || (r = e, e = null), n = t.cursorTag ? {cursor: t.cursorTag} : {cursor: t}, e && "timeout" in e && (n.timeout = e.timeout), i = new S.Util.Xhr("GET", this._urls.longpollDelta), i.setParams(n), this._dispatchXhr(i, function(t, e) {
                    var n;
                    if ("string" == typeof e)
                        try {
                            e = JSON.parse(e)
                        } catch (i) {
                            n = i, e = null
                        }
                    return r(t, S.Http.PollResult.parse(e))
                })
            }, t.prototype.mkdir = function(t, e) {
                var r;
                return r = new S.Util.Xhr("POST", this._urls.fileopsCreateFolder), r.setParams({root: "auto",path: this._normalizePath(t)}).signWithOauth(this._oauth), this._dispatchXhr(r, function(t, r) {
                    return e ? e(t, S.File.Stat.parse(r)) : void 0
                })
            }, t.prototype.remove = function(t, e) {
                var r;
                return r = new S.Util.Xhr("POST", this._urls.fileopsDelete), r.setParams({root: "auto",path: this._normalizePath(t)}).signWithOauth(this._oauth), this._dispatchXhr(r, function(t, r) {
                    return e ? e(t, S.File.Stat.parse(r)) : void 0
                })
            }, t.prototype.unlink = function(t, e) {
                return this.remove(t, e)
            }, t.prototype["delete"] = function(t, e) {
                return this.remove(t, e)
            }, t.prototype.copy = function(t, e, r) {
                var n, i;
                return n = {root: "auto",to_path: this._normalizePath(e)}, t instanceof S.File.CopyReference ? n.from_copy_ref = t.tag : n.from_path = this._normalizePath(t), i = new S.Util.Xhr("POST", this._urls.fileopsCopy), i.setParams(n).signWithOauth(this._oauth), this._dispatchXhr(i, function(t, e) {
                    return r ? r(t, S.File.Stat.parse(e)) : void 0
                })
            }, t.prototype.move = function(t, e, r) {
                var n;
                return n = new S.Util.Xhr("POST", this._urls.fileopsMove), n.setParams({root: "auto",from_path: this._normalizePath(t),to_path: this._normalizePath(e)}).signWithOauth(this._oauth), this._dispatchXhr(n, function(t, e) {
                    return r ? r(t, S.File.Stat.parse(e)) : void 0
                })
            }, t.prototype.appInfo = function(t, e) {
                var r;
                return e || "function" != typeof t || (e = t, t = this._oauth.credentials().key), r = new S.Util.Xhr("GET", this._urls.appsInfo), r.setParams({app_key: t}), this._dispatchXhr(r, function(r, n) {
                    return e(r, S.Http.AppInfo.parse(n, t))
                })
            }, t.prototype.isAppDeveloper = function(t, e, r) {
                var n;
                return "object" == typeof t && "uid" in t && (t = t.uid), r || "function" != typeof e ? "object" == typeof e && "key" in e && (e = e.key) : (r = e, e = this._oauth.credentials().key), n = new S.Util.Xhr("GET", this._urls.appsCheckDeveloper), n.setParams({app_key: e,uid: t}), this._dispatchXhr(n, function(t, e) {
                    return e ? r(t, e.is_developer) : r(t)
                })
            }, t.prototype.hasOauthRedirectUri = function(t, e, r) {
                var n;
                return r || "function" != typeof e ? "object" == typeof e && "key" in e && (e = e.key) : (r = e, e = this._oauth.credentials().key), n = new S.Util.Xhr("GET", this._urls.appsCheckRedirectUri), n.setParams({app_key: e,redirect_uri: t}), this._dispatchXhr(n, function(t, e) {
                    return e ? r(t, e.has_redirect_uri) : r(t)
                })
            }, t.prototype.reset = function() {
                var t;
                return this._uid = null, this._oauth.reset(), t = this.authStep, this.authStep = this._oauth.step(), t !== this.authStep && this.onAuthStepChange.dispatch(this), this.authError = null, this._credentials = null, this
            }, t.prototype.setCredentials = function(t) {
                var e;
                return e = this.authStep, this._oauth.setCredentials(t), this.authStep = this._oauth.step(), this._uid = t.uid || null, this.authError = null, this._credentials = null, e !== this.authStep && this.onAuthStepChange.dispatch(this), this
            }, t.prototype.appHash = function() {
                return this._oauth.appHash()
            }, t.prototype.setupUrls = function() {
                return this._apiServer = this._chooseApiServer(), this._urls = {authorize: "" + this._authServer + "/1/oauth2/authorize",token: "" + this._apiServer + "/1/oauth2/token",signOut: "" + this._apiServer + "/1/unlink_access_token",accountInfo: "" + this._apiServer + "/1/account/info",getFile: "" + this._fileServer + "/1/files/auto",postFile: "" + this._fileServer + "/1/files/auto",putFile: "" + this._fileServer + "/1/files_put/auto",metadata: "" + this._apiServer + "/1/metadata/auto",delta: "" + this._apiServer + "/1/delta",longpollDelta: "" + this._notifyServer + "/1/longpoll_delta",revisions: "" + this._apiServer + "/1/revisions/auto",restore: "" + this._apiServer + "/1/restore/auto",search: "" + this._apiServer + "/1/search/auto",shares: "" + this._apiServer + "/1/shares/auto",media: "" + this._apiServer + "/1/media/auto",copyRef: "" + this._apiServer + "/1/copy_ref/auto",thumbnails: "" + this._fileServer + "/1/thumbnails/auto",chunkedUpload: "" + this._fileServer + "/1/chunked_upload",commitChunkedUpload: "" + this._fileServer + "/1/commit_chunked_upload/auto",fileopsCopy: "" + this._apiServer + "/1/fileops/copy",fileopsCreateFolder: "" + this._apiServer + "/1/fileops/create_folder",fileopsDelete: "" + this._apiServer + "/1/fileops/delete",fileopsMove: "" + this._apiServer + "/1/fileops/move",appsInfo: "" + this._apiServer + "/1/apps/info",appsCheckDeveloper: "" + this._apiServer + "/1/apps/check_developer",appsCheckRedirectUri: "" + this._apiServer + "/1/apps/check_redirect_uri",getDb: "" + this._apiServer + "/1/datastores/get_datastore",getOrCreateDb: "" + this._apiServer + "/1/datastores/get_or_create_datastore",createDb: "" + this._apiServer + "/1/datastores/create_datastore",listDbs: "" + this._apiServer + "/1/datastores/list_datastores",deleteDb: "" + this._apiServer + "/1/datastores/delete_datastore",getSnapshot: "" + this._apiServer + "/1/datastores/get_snapshot",getDeltas: "" + this._apiServer + "/1/datastores/get_deltas",putDelta: "" + this._apiServer + "/1/datastores/put_delta",datastoreAwait: "" + this._apiServer + "/1/datastores/await"}, this
            }, t.prototype._chooseApiServer = function() {
                var t, e;
                return e = Math.floor(Math.random() * (this._maxApiServer + 1)), t = 0 === e ? "" : e.toString(), this._serverRoot.replace("$", t)
            }, t.prototype.authStep = null, t.ERROR = 0, t.RESET = 1, t.PARAM_SET = 2, t.PARAM_LOADED = 3, t.AUTHORIZED = 4, t.DONE = 5, t.SIGNED_OUT = 6, t.prototype._urlEncodePath = function(t) {
                return S.Util.Xhr.urlEncodeValue(this._normalizePath(t)).replace(/%2F/gi, "/")
            }, t.prototype._normalizePath = function(t) {
                var e;
                if ("/" === t.substring(0, 1)) {
                    for (e = 1; "/" === t.substring(e, e + 1); )
                        e += 1;
                    return t.substring(e)
                }
                return t
            }, t.prototype.authorizeUrl = function() {
                var t;
                return t = this._oauth.authorizeUrlParams(this._driver.authType(), this._driver.url()), this._urls.authorize + "?" + S.Util.Xhr.urlEncode(t)
            }, t.prototype.getAccessToken = function(t) {
                var e, r;
                return e = this._oauth.accessTokenParams(this._driver.url()), r = new S.Util.Xhr("POST", this._urls.token).setParams(e).addOauthParams(this._oauth), this._dispatchXhr(r, function(e, r) {
                    return e && e.status === S.ApiError.INVALID_PARAM && e.response && e.response.error && (e = new S.AuthError(e.response)), t(e, r)
                })
            }, t.prototype._dispatchLongPollXhr = function(t, e, r) {
                return null == r && (r = 6e4), this._dispatchXhr(t, e, r)
            }, t.prototype._dispatchXhr = function(t, e, r) {
                var n, i, o = this;
                return null == r && (r = 1e4), n = setTimeout(function() {
                    return o._handleLongRequest(t)
                }, 2 * r), t.setCallback(function(t, r, i, o) {
                    return clearTimeout(n), e(t, r, i, o)
                }), t.onError = this._xhrOnErrorHandler, t.prepare(), i = t.xhr, this.onXhr.dispatch(t) && t.send(), i
            }, t.prototype._handleXhrError = function(t, e) {
                var r = this;
                return t.status === S.ApiError.INVALID_TOKEN && this.authStep === h.DONE && (this.authError = t, this.authStep = h.ERROR, this.onAuthStepChange.dispatch(this), this._driver && this._driver.onAuthStepChange) ? (this._driver.onAuthStepChange(this, function() {
                    return r.onError.dispatch(t), e(t)
                }), null) : (this.onError.dispatch(t), e(t), void 0)
            }, t.prototype._handleLongRequest = function() {
                return this.setupUrls()
            }, t.prototype._defaultServerRoot = function() {
                return "https://api$.dropbox.com"
            }, t.prototype._defaultAuthServer = function() {
                return this._serverRoot.replace("api$", "www")
            }, t.prototype._defaultFileServer = function() {
                return this._serverRoot.replace("api$", "api-content")
            }, t.prototype._defaultDownloadServer = function() {
                return "https://dl.dropboxusercontent.com"
            }, t.prototype._defaultNotifyServer = function() {
                return this._serverRoot.replace("api$", "api-notify")
            }, t.prototype._defaultMaxApiServer = function() {
                return 30
            }, t.prototype._computeCredentials = function() {
                var t;
                t = this._oauth.credentials(), this._uid && (t.uid = this._uid), this._serverRoot !== this._defaultServerRoot() && (t.server = this._serverRoot), this._maxApiServer !== this._defaultMaxApiServer() && (t.maxApiServer = this._maxApiServer), this._authServer !== this._defaultAuthServer() && (t.authServer = this._authServer), this._fileServer !== this._defaultFileServer() && (t.fileServer = this._fileServer), this._downloadServer !== this._defaultDownloadServer() && (t.downloadServer = this._downloadServer), this._notifyServer !== this._defaultNotifyServer() && (t.notifyServer = this._notifyServer), this._credentials = t
            }, t
        }(), h = S.Client, S.Datastore = function() {
            function t(t, e) {
                var r = this;
                this._datastore_manager = t, this._managed_datastore = e, this._dsid = this._managed_datastore.get_dsid(), this._handle = this._managed_datastore.get_handle(), this._record_cache = new V(this), this._last_used_timestamp = 0, this.recordsChanged = new S.Util.EventSource, this.syncStatusChanged = new S.Util.EventSource, this._timeoutWrapper = function(t) {
                    return t
                }, this._evt_mgr = new E, this._evt_mgr.register(this._managed_datastore.syncStateChanged, function() {
                    return r._syncSoon(), r.syncStatusChanged.dispatch(null)
                }), this._syncPending = !1, this._closed = !1, this._metadata_table = new S.Datastore.Table(this, ":info"), this._metadata_table.setResolutionRule("mtime", "max")
            }
            return t.DATASTORE_SIZE_LIMIT = 10485760, t.RECORD_COUNT_LIMIT = 1e5, t.BASE_DATASTORE_SIZE = 1e3, t.TEAM = "team", t.PUBLIC = "public", t.OWNER = "owner", t.EDITOR = "editor", t.VIEWER = "viewer", t.NONE = "none", t.prototype.recordsChanged = null, t.prototype.syncStatusChanged = null, t.int64 = function(t) {
                var e, r;
                if (Z.is_number(t) && null != t[te.INT64_TAG])
                    return te.validateInt64(t);
                if (Z.is_string(t)) {
                    if (!te.is_valid_int64_string(t))
                        throw new Error("Not a valid int64 in string form: " + t);
                    return r = new Number(parseInt(t, 10)), r[te.INT64_TAG] = t, te.validateInt64(r)
                }
                if (!Z.is_number(t) || !isFinite(t))
                    throw new Error("Not a finite number: " + t);
                if (Number(t) !== Math.round(t))
                    throw new Error("Number is not an integer: " + t);
                if (e = t.toFixed(), !te.is_valid_int64_string(e))
                    throw new Error("Number not in int64 range: " + t);
                return r = new Number(t), r[te.INT64_TAG] = e, te.validateInt64(r)
            }, t.isInt64 = function(t) {
                return te.isInt64(t)
            }, t.prototype.getModifiedTime = function() {
                var t;
                return t = this._metadata_table.get("info"), null == t ? null : t.get("mtime")
            }, t.prototype.getTitle = function() {
                var t;
                return t = this._metadata_table.get("info"), null == t ? null : t.get("title")
            }, t.prototype.setTitle = function(t) {
                var e;
                if (null != t && !Z.string(t))
                    throw new Error("Title must be a string or null!");
                return e = this._metadata_table.getOrInsert("info", {}), e.set("title", t)
            }, t.prototype.isShareable = function() {
                return "." === this._dsid[0]
            }, t.prototype._checkShareable = function() {
                if (!this.isShareable())
                    throw new Error("Datastore is not shareable")
            }, t.prototype.getEffectiveRole = function() {
                var t;
                return this.isShareable() ? (t = this._managed_datastore.get_effective_role(), S.Datastore._roleFromInt(t)) : S.Datastore.OWNER
            }, t.prototype.isWritable = function() {
                var t;
                return t = this.getEffectiveRole(), t === S.Datastore.OWNER || t === S.Datastore.EDITOR
            }, t.prototype._checkWritable = function() {
                if (!this.isWritable())
                    throw new Error("Datastore is not writable")
            }, t.prototype._checkRole = function(t) {
                if (t !== S.Datastore.EDITOR && t !== S.Datastore.VIEWER)
                    throw new Error("Invalid role: " + t)
            }, t.prototype._checkPrincipal = function(t) {
                if (t !== S.Datastore.TEAM && t !== S.Datastore.PUBLIC && !t.match(/^u[1-9][0-9]*$/))
                    throw new Error("Invalid principal: " + t)
            }, t.prototype._getRole = function(t) {
                var e, r, n;
                return e = null != (r = this.getTable(te.ACL_TID)) ? null != (n = r.get(t)) ? n.get("role") : void 0 : void 0, null == e ? S.Datastore.NONE : S.Datastore._roleFromInt(e)
            }, t.prototype.getRole = function(t) {
                return this._checkShareable(), this._checkPrincipal(t), this._getRole(t)
            }, t.prototype.setRole = function(t, e) {
                var r;
                return e === S.Datastore.NONE ? (this.deleteRole(t), void 0) : (this._checkShareable(), this._checkPrincipal(t), this._checkRole(e), this._checkWritable(), r = S.Datastore.int64(S.Datastore._intFromRole(e)), this.getTable(te.ACL_TID).getOrInsert(t).update({role: r}))
            }, t.prototype.deleteRole = function(t) {
                var e;
                return this._checkShareable(), this._checkPrincipal(t), this._checkWritable(), null != (e = this.getTable(te.ACL_TID).get(t)) ? e.deleteRecord() : void 0
            }, t.prototype.listRoles = function() {
                var t, e, r, n, i, o;
                for (this._checkShareable(), r = {}, o = this.getTable(te.ACL_TID).query(), n = 0, i = o.length; i > n; n++)
                    e = o[n], t = e.getId(), r[t] = this._getRole(t);
                return r
            }, t._roleFromInt = function(t) {
                switch (!1) {
                    case !(t >= te.ROLE_OWNER):
                        return S.Datastore.OWNER;
                    case !(t >= te.ROLE_EDITOR):
                        return S.Datastore.EDITOR;
                    case !(t >= te.ROLE_VIEWER):
                        return S.Datastore.VIEWER;
                    default:
                        return S.Datastore.NONE
                }
            }, t._intFromRole = function(t) {
                switch (t) {
                    case S.Datastore.OWNER:
                        return te.ROLE_OWNER;
                    case S.Datastore.EDITOR:
                        return te.ROLE_EDITOR;
                    case S.Datastore.VIEWER:
                        return te.ROLE_VIEWER;
                    default:
                        return 0
                }
            }, t.prototype.getTable = function(t) {
                if (this._checkNotClosed(), !S.Datastore.Table.isValidId(t))
                    throw new Error("Invalid table ID: " + t);
                return new S.Datastore.Table(this, t)
            }, t.prototype.listTableIds = function() {
                return this._checkNotClosed(), this._managed_datastore.list_tables()
            }, t.prototype.getRecordCount = function() {
                return this._managed_datastore.get_record_count()
            }, t.prototype.getSize = function() {
                return this._managed_datastore.get_size()
            }, t.prototype.toString = function() {
                var t;
                return t = this._closed ? "[closed] " : "", "Datastore(" + t + this._dsid + " [" + this._handle + "])"
            }, t.prototype.close = function() {
                return this._closed = !0, this._evt_mgr.unregister_all(), this._listeners = [], this._datastore_manager._obj_manager.close(this._dsid), void 0
            }, t.prototype.getId = function() {
                return this._dsid
            }, t.prototype.getSyncStatus = function() {
                return {uploading: this._managed_datastore.get_outgoing_delta_count() > 0}
            }, t.isValidId = function(t) {
                var e;
                return e = new RegExp(Z.DS_ID_REGEX), Z.is_string(t) && e.test(t)
            }, t.isValidShareableId = function(t) {
                return this.isValidId(t) && "." === t[0]
            }, t.prototype._generateRid = function() {
                var t, e, r, n;
                for (n = "_", e = "_js_", r = Math.round(1e3 * Date.now()), r <= this._last_used_timestamp && (r = this._last_used_timestamp + 1), this._last_used_timestamp = r, t = r.toString(32); t.length < 11; )
                    t = "0" + t;
                return n + t + e + te.randomWeb64String(5)
            }, t.prototype._syncSoon = function() {
                var t = this;
                if (this._managed_datastore.is_deleted())
                    throw new Error("Cannot sync deleted datastore " + this._dsid);
                return this._checkNotClosed(), this._syncPending || (this._syncPending = !0, setTimeout(this._timeoutWrapper(function() {
                    return t._syncPending = !1, t._sync()
                }), 0)), void 0
            }, t.prototype._sync = function() {
                var t, e, r, n, i, o, s, a, u;
                this._checkNotClosed(), i = this._managed_datastore.sync(), n = this._resolveAffectedRecordMap(i), t = !1;
                for (s in n)
                    for (r = n[s], a = 0, u = r.length; u > a; a++)
                        e = r[a], Y(s === e._tid, "tid mismatch"), t = !0, o = e._rid, this._managed_datastore.query(s, o) || (e._deleted = !0, this._record_cache.remove(s, o));
                return t && this.recordsChanged.dispatch(new q(n, !1)), void 0
            }, t.prototype._resolveAffectedRecordMap = function(t) {
                var e, r, n, i, o;
                r = {};
                for (o in t) {
                    i = t[o];
                    for (n in i)
                        e = this._record_cache.getOrCreate(o, n), null == r[o] && (r[o] = []), r[o].push(e)
                }
                return r
            }, t.prototype._recordsChangedLocally = function(t) {
                return t.length > 0 && (this.recordsChanged.dispatch(q._fromRecordList(t, !0)), this._syncSoon()), void 0
            }, t.prototype._checkNotClosed = function() {
                if (this._closed || !this._managed_datastore._open)
                    throw new Error("Datastore is already closed: " + this);
                return void 0
            }, t
        }(), te = S.Datastore.impl = {}, Z = S.Datastore.impl.T = {}, Z.identity = function(t) {
            return t
        }, Z.get_coerce_fn = function(t) {
            return null != t.coerce ? t.coerce : null != t.load_json ? function(e) {
                return e instanceof t ? e : t.load_json(e)
            } : Z.identity
        }, Z.get_T_fn = function(t) {
            return null != t.Type ? t.Type : t
        }, Z.str = function(t) {
            return Z.is_string(t) ? t : Z.is_function(t) ? t() : JSON.stringify(t)
        }, Z.assert = function(t, e) {
            if (!t)
                throw new Error(Z.str(e))
        }, Y = Z.assert, Z.check = function(t, e, r, n, i, o) {
            if (t)
                return r;
            throw Z.fail(e, r, n, i, o), new Error("unreachable")
        }, Z.safe_to_string = function(t) {
            var e, r;
            try {
                if (r = t.toString(), "[object Object]" !== r)
                    return r
            } catch (n) {
                e = n
            }
            try {
                return JSON.stringify(t)
            } catch (n) {
                e = n
            }
            try {
                if (r = t.constructor.name, null != r ? r.match(/^[A-Za-z0-9_]+$/) : void 0)
                    return r
            } catch (n) {
                e = n
            }
            return "[T.safe_to_string failed]"
        }, Z.fail = function(t, e, r, n, i) {
            var o, s;
            throw s = null != r ? null != n ? null != i ? "Wanted " + Z.str(n) + ", but " + Z.str(r) + " in " + Z.str(i) + " " + Z.str(t) : "Wanted " + Z.str(n) + ", but " + Z.str(r) + " " + Z.str(t) : "" + Z.str(r) + " " + Z.str(t) : null != n ? null != i ? "Wanted " + Z.str(n) + ", but in " + Z.str(i) + " " + Z.str(t) : "Wanted " + Z.str(n) + ", but " + Z.str(t) : "" + Z.str(t), o = new Error("" + s + ": " + Z.safe_to_string(e)), console.error(o), o
        }, Z.any = function(t) {
            return t
        }, Z.defined = function(t, e, r, n) {
            return null == r && (r = "defined"), Z.check("undefined" != typeof t, "is undefined", t, e, r, n), t
        }, Z.nonnull = function(t, e, r, n) {
            return null == r && (r = "nonnull"), Z.defined(t, e, r, n), Z.check(null != t, "is null", t, e, r, n), t
        }, Z.member = function(t) {
            var e, r;
            return r = "value in " + JSON.stringify(t), e = "not in " + JSON.stringify(t), function(n, i, o, s) {
                return null == o && (o = r), Z.check(ne.call(t, n) >= 0, e, n, i, o, s)
            }
        }, Z.object = function(t, e, r, n) {
            return null == r && (r = "object"), Z.nonnull(t, e, r, n), Z.check("object" == typeof t, "not an object", t, e, r, n), t
        }, Z.bool = function(t, e, r, n) {
            return null == r && (r = "bool"), Z.nonnull(t, e, r, n), Z.check(t === !0 || t === !1, "is not bool", t, e, r, n), t
        }, Z.string = function(t, e, r, n) {
            return null == r && (r = "string"), Z.nonnull(t, e, r, n), Z.check(Z.is_string(t), "is not a string", t, e, r, n), t
        }, Z.num = function(t, e, r, n) {
            return null == r && (r = "num"), Z.nonnull(t, e, r, n), Z.check("number" == typeof t, "is not numeric", t, e, r, n), t
        }, Z.int = function(t, e, r, n) {
            return null == r && (r = "int"), Z.num(t, e, r, n), Z.check(0 === t % 1, "is not an integer", t, e, r, n), t
        }, Z.uint = function(t, e, r, n) {
            return null == r && (r = "uint"), Z.int(t, e, r, n), Z.check(t >= 0, "is negative", t, e, r, n), t
        }, Z.nullable = function(t) {
            var e, r;
            return r = "nullable(" + t + ")", e = function(e, n, i, o) {
                return null == i && (i = function() {
                    return r
                }), Z.defined(e, n, i, o), null != e && Z.get_T_fn(t)(e, n, i, o), e
            }, e.toString = function() {
                return r
            }, e.coerce = function(e) {
                return null != e ? Z.get_coerce_fn(t)(e) : null
            }, e.fromJSON = function(r) {
                return null != r ? null != t.fromJSON ? t.fromJSON(r) : e.coerce(r) : null
            }, e
        }, Z.array = function(t, e, r, n) {
            return null == r && (r = "array"), Z.nonnull(t, e, r, n), Z.check(Z.is_array(t), "is not an array", t, e, r, n), t
        }, Z.arrayOf = function(t) {
            var e, r;
            return r = "arrayOf(" + t + ")", e = function(e, n, i, o) {
                var s, a, u, l, h;
                for (null == i && (i = r), Z.array(e, n, i, o), u = l = 0, h = e.length; h > l; u = ++l)
                    s = e[u], a = function() {
                        return null != n ? "element " + u + " of " + Z.str(n) : "element " + u
                    }, Z.get_T_fn(t)(s, a, i, o);
                return e
            }, e.toString = function() {
                return r
            }, e.coerce = function(e) {
                var n, i, o, s;
                for (Z.array(e, null, r), s = [], i = 0, o = e.length; o > i; i++)
                    n = e[i], s.push(Z.get_coerce_fn(t)(n));
                return s
            }, e.fromJSON = function(n) {
                var i, o, s, a;
                if (Z.array(n, "fromJSON input", r), null != t.fromJSON) {
                    for (a = [], o = 0, s = n.length; s > o; o++)
                        i = n[o], a.push(t.fromJSON(i));
                    return a
                }
                return e.coerce(n)
            }, e
        }, Z.instance = function(t, e, r, n, i) {
            var o;
            if (!(e instanceof Function))
                throw new Error("Invalid type given: " + e);
            return t instanceof e || (null == n && (n = e.name), Z.check(!1, "got instance of " + (null != t ? null != (o = t.constructor) ? o.name : void 0 : void 0), t, r, n, i)), t
        }, Z.unimplemented = function(t) {
            return function() {
                throw new Error("unimplemented " + t)
            }
        }, Z.startsWith = function(t, e) {
            return 0 === t.lastIndexOf(e, 0)
        }, Z.string_matching = function(t) {
            var e;
            return Z.string(t), Z.check(/^[^].*[$]$/.test(t), "does not start with ^ and end with $", t), e = "does not match regex " + t, function(r, n, i, o) {
                return Z.string(r, n, i, o), Z.check(new RegExp(t).test(r), e, r, n, i, o), r
            }
        }, Z.is_defined = function(t) {
            return "undefined" != typeof t
        }, Z.is_bool = function(t) {
            return t === !0 || t === !1 || t && "object" == typeof t && t.constructor === Boolean
        }, Z.is_number = function(t) {
            return "number" == typeof t || t && "object" == typeof t && t.constructor === Number
        }, Z.is_json_number = function(t) {
            return Z.is_number(t) && !isNaN(t) && isFinite(t)
        }, Z.is_string = function(t) {
            return "string" == typeof t || t && "object" == typeof t && t.constructor === String
        }, Z.is_function = function(t) {
            return "function" == typeof t
        }, Z.is_object = function(t) {
            return null != t && "object" == typeof t
        }, Z.is_array = function(t) {
            return "[object Array]" === Object.prototype.toString.call(t)
        }, Z.is_empty = function(t) {
            return 0 === Object.keys(t).length
        }, Z.is_date = function(t) {
            return "[object Date]" === Object.prototype.toString.call(t)
        }, Z.isUint8Array = function(t) {
            return "[object Uint8Array]" === Object.prototype.toString.call(t)
        }, Z.is_simple_map = function(t) {
            var e, r;
            if (null == t || "object" != typeof t)
                return !1;
            for (e in t)
                if (r = t[e], !Object.prototype.hasOwnProperty.call(t, e))
                    return !1;
            return !0
        }, Z.simple_map = function(t, e, r, n) {
            var i, o;
            null == r && (r = "simple map"), Z.object(t, e, r, n);
            for (i in t)
                o = t[i], Z.check(Object.prototype.hasOwnProperty.call(t, i), function() {
                    return "property " + i + " is inherited"
                }, t, e, r, t);
            return t
        }, Z.simple_typed_map = function(t, e, r) {
            var n, i, o;
            return n = Z.get_coerce_fn(e), i = Z.get_coerce_fn(r), o = function(n, i, o, s) {
                var a, u;
                null == o && (o = t), Z.simple_map(n, i, o, s);
                for (a in n)
                    u = n[a], Z.get_T_fn(e)(a, "property", null, n), Z.get_T_fn(r)(u, function() {
                        return "value of property " + a
                    }, null, n);
                return n
            }, o.coerce = function(e) {
                var r, o, s;
                Z.simple_map(e, null, t), o = {};
                for (r in e)
                    s = e[r], o[n(r)] = i(s);
                return o
            }, o.fromJSON = function(e) {
                var i, o, s;
                Z.simple_map(e, null, t), o = {};
                for (i in e)
                    s = e[i], o[n(i)] = null != r.fromJSON ? r.fromJSON(s) : s;
                return o
            }, o
        }, Z.DS_ID_REGEX = "^[-_a-z0-9]([-_a-z0-9.]{0,62}[-_a-z0-9])?$|^[.][-_a-zA-Z0-9]{1,63}$", Z.dsid = function(t, e, r, n) {
            return null == r && (r = "dsid"), Z.string_matching(Z.DS_ID_REGEX)(t, e, r, n), t
        }, Z.SS_ID_REGEX = "^[-._+/=a-zA-Z0-9]{1,64}$|^:[-._+/=a-zA-Z0-9]{1,63}$", Z.tid = function(t, e, r, n) {
            return null == r && (r = "tid"), Z.string_matching(Z.SS_ID_REGEX)(t, e, r, n), t
        }, Z.rowid = function(t, e, r, n) {
            return null == r && (r = "rowid"), Z.string_matching(Z.SS_ID_REGEX)(t, e, r, n), t
        }, Z.field_name = function(t, e, r, n) {
            return null == r && (r = "field name"), Z.string_matching(Z.SS_ID_REGEX)(t, e, r, n), t
        }, function() {
            var t, e, r;
            r = [];
            for (t in Z)
                e = Z[t], Z.hasOwnProperty(t) ? r.push(function(t) {
                    return e.toString = function() {
                        return "T." + t
                    }
                }(t)) : r.push(void 0);
            return r
        }(), te.struct = ee = {}, ee.define = function(t, e) {
            var r, n, i, o, s, a, u, l, h, c, d, _, p, f, g, y;
            for (Z.string(t, "struct name"), Z.array(e, "fields"), f = [], p = {}, s = g = 0, y = e.length; y > g; s = ++g) {
                i = e[s], Z.array(i, "field", "field descriptor", e), Z.check(2 <= i.length && i.length <= 3, "does not have length 2 or 3", i, "field descriptor"), c = Z.string(i[0], "field name", "field descriptor", e), _ = Z.nonnull(i[1], "field type", "field descriptor", e), d = i.length <= 2 ? {} : Z.nonnull(i[2], "map of field options", "field descriptor", e);
                for (l in d)
                    "init" !== l && "initFn" !== l && Z.fail("unknown option " + l, d, "field options", "field descrptor", e);
                ne.call(d, "init") >= 0 && ne.call(d, "initFn") >= 0 && Z.fail("both 'init' and 'initFn' specified", d, "field options", "field descriptor", e), u = "initFn" in d ? d.initFn : "init" in d ? (a = d.init, function(t) {
                    return function() {
                        return t
                    }
                }(a)) : null, r = {name: c,type: _,initFn: u}, o = "undefined" != typeof G && null !== G ? new G(r) : r, f.push(o), p[c] = o
            }
            return h = "initializer for " + t + " (fields " + function() {
                var t, e, r;
                for (r = [], t = 0, e = f.length; e > t; t++)
                    i = f[t], r.push(i.name);
                return r
            }().join(", ") + ")", n = function(t) {
                var e, r, i;
                Z.defined(t, "x", "initializer");
                for (c in t)
                    e = t[c], t.hasOwnProperty(c) && Z.check(null != p[c], function() {
                        return "has an unexpected field " + c
                    }, t, "initializer");
                for (r = 0, i = f.length; i > r; r++)
                    o = f[r], t[o.name] && !t.hasOwnProperty(o.name) && Z.fail("Has an indirect property " + o.name, t, "initializer"), t.hasOwnProperty(o.name) ? (e = t[o.name], this[o.name] = Z.get_coerce_fn(o.type)(e)) : null != o.initFn ? this[o.name] = o.initFn() : Z.fail("lacks the field " + o.name, t, "initializer");
                return n.Type(this, "initializer", h, this), this
            }, n.Type = function(e, r, i, s) {
                var a, u, l;
                for (Z.defined(e, r, i, s), Z.check(e instanceof n, function() {
                    return "is not an instance of " + t
                }, e, r, i, s), u = 0, l = f.length; l > u; u++)
                    o = f[u], Z.check(e.hasOwnProperty(o.name), function() {
                        return "lacks the field " + o.name
                    }, e, r, i, s), Z.get_T_fn(o.type)(e[o.name], o.name, i, s);
                for (c in e)
                    a = e[c], e.hasOwnProperty(c) && Z.check(null != p[c], "has an unexpected field", c, r, i, s);
                return e
            }, n.coerce = function(t) {
                return t instanceof n ? (n.Type(t), t) : new n(t)
            }, n.prototype.toString = function() {
                var t, e, r, n, i;
                for (e = this, t = [], n = 0, i = f.length; i > n; n++)
                    o = f[n], r = e[o.name], t.push("" + o.name + ": " + (Z.is_object(r) && Z.is_function(r.toString) ? r.toString() : JSON.stringify(r)));
                return "{" + t.join(", ") + "}"
            }, n.prototype.toJSON = function() {
                var t, e, r, n;
                for (t = this, e = function() {
                    return "" + t
                }, r = 0, n = f.length; n > r; r++)
                    o = f[r], Z.get_T_fn(o.type)(this[o.name], o.name, null, e);
                return this
            }, n.fromJSON = function(t) {
                var e, r;
                Z.simple_map(t, "input"), e = {};
                for (l in t)
                    r = t[l], o = p[l], null != o && (_ = o.type, e[l] = null != _.fromJSON ? _.fromJSON(r) : r);
                return new n(e)
            }, n.toString = function() {
                return "struct " + t
            }, n
        }, G = ee.define("StructField", [["name", Z.string], ["type", Z.defined], ["initFn", Z.defined]]), ee.toJSO = function(t) {
            var e, r, n, i;
            if ("object" != typeof t)
                return t;
            if (Z.is_array(t))
                return function() {
                    var r, n, i;
                    for (i = [], r = 0, n = t.length; n > r; r++)
                        e = t[r], i.push(ee.toJSO(e));
                    return i
                }();
            n = {};
            for (r in t)
                i = t[r], t.hasOwnProperty(r) && (n[r] = ee.toJSO(i));
            return n
        }, ee.union_as_list = function(t, e) {
            var r, n, i, o, s, a, u, l, h, c, d;
            for (Z.string(t, "union name"), Z.array(e, "variants"), n = function() {
                throw new Error("Use " + t + ".from_array instead")
            }, l = {}, u = [], h = function(e, r, i) {
                var o;
                return o = ee.define("" + t + "." + e, i), o.prototype.tag = function() {
                    return e
                }, o.prototype.toString = function() {
                    return "" + t + "." + e + "(" + JSON.stringify(this) + ")"
                }, o.prototype.toJSON = function() {
                    var t, n, i, o, s, a;
                    for (t = [e], s = 0, a = r.length; a > s; s++)
                        n = r[s], i = n[0], o = n[1], Z.get_T_fn(o)(this[i], i), t.push(this[i]);
                    return t
                }, o.from_array = function(n) {
                    var i, s, a, u, l, h, c;
                    for (l = "initializer for " + t, Z.array(n, "initializer", l), Z.check(n.length === r.length + 1, "does not have length " + (r.length + 1), n, "initializer", l), Z.check(n[0] === e, "does not have tag " + e, n, "initializer", l), i = {_tag: e}, a = h = 0, c = r.length; c > h; a = ++h)
                        s = r[a], u = s[0], i[u] = n[a + 1];
                    return new o(i)
                }, o.fromJSON = function(t) {
                    return t.length > r.length + 1 && (t = t.slice(0, r.length + 1)), o.from_array(t)
                }, o.coerce = function(t) {
                    return t instanceof o ? (o.Type(t), t) : o.from_array(t)
                }, l[e] = o, n[e] = o
            }, c = 0, d = e.length; d > c; c++)
                i = e[c], Z.array(i, "variant", "variant descriptor", e), Z.check(2 === i.length, "does not have length 2", i, "variant descriptor", e), a = Z.string(i[0], "tag", "tag", e), o = Z.array(i[1], "fields", "variant descriptor", e), s = o.slice(0), s.unshift(["_tag", Z.member([a])]), h(a, o, s), u.push(a);
            return r = "initializer for " + t + " (variants " + u.join(", ") + ")", n.from_array = function(e) {
                var r, n;
                return n = "initializer for " + t, Z.array(e, "initializer", n), Z.check(e.length >= 1, "lacks a tag", e, "initializer", n), r = e[0], Z.string(r, "tag", n, e), Z.member(u)(r), l[r].from_array(e)
            }, n.fromJSON = function(e) {
                var r, n;
                return n = "initializer for " + t, Z.array(e, "initializer", n), Z.check(e.length >= 1, "lacks a tag", e, "initializer", n), r = e[0], Z.string(r, "tag", n, e), Z.member(u)(r), l[r].fromJSON(e)
            }, n.Type = function(e, r, n, i) {
                var o;
                return null == n && (n = "" + t + ".Type"), Z.defined(e, r, n, i), Z.defined(e.tag, "tag", n, i), o = e.tag(), Z.string(o, "tag", "initializer", e), Z.member(u)(o), l[o].Type(e, null, "object of type " + t), e
            }, n.coerce = function(t) {
                var e, r;
                for (r in l)
                    if (e = l[r], t instanceof e)
                        return e.Type(t), t;
                return n.from_array(t)
            }, n.toString = function() {
                return "union " + t
            }, n
        }, te.nonzero_int64_approximate_regex = new RegExp("^-?[1-9][0-9]{0,18}$"), te.int64_max_str = "9223372036854775807", te.int64_min_str = "-9223372036854775808", te.ACL_TID = ":acl", te.ROLE_OWNER = 3e3, te.ROLE_EDITOR = 2e3, te.ROLE_VIEWER = 1e3, te.int64_string_less_than = function(t, e) {
            var r, n, i;
            return t === e ? !1 : (n = "0" === t.charAt(0), i = "0" === e.charAt(0), n && !i ? !0 : i && !n ? !1 : (r = t.length === e.length ? t > e : t.length > e.length, n && i ? r : !r))
        }, te.is_valid_int64_string = function(t) {
            return Z.is_string(t) ? "0" === t ? !0 : te.nonzero_int64_approximate_regex.test(t) ? "-" === t.charAt(0) ? t.length < te.int64_min_str.length || t <= te.int64_min_str : t.length < te.int64_max_str.length || t <= te.int64_max_str : !1 : !1
        }, te.is_wrapped_atomic_field_value = function(t) {
            var e, r, n, i;
            if (!Z.is_simple_map(t))
                return !1;
            if (e = Object.keys(t), 1 !== e.length)
                return !1;
            switch (e[0]) {
                case "B":
                    return Z.is_string(t.B);
                case "N":
                    return "nan" === (n = t.N) || "+inf" === n || "-inf" === n;
                case "I":
                case "T":
                    return r = null != (i = t.I) ? i : t.T, te.is_valid_int64_string(r);
                default:
                    return !1
            }
        }, te.is_atomic_field_value = function(t) {
            return Z.is_bool(t) || Z.is_json_number(t) || Z.is_string(t) || te.is_wrapped_atomic_field_value(t)
        }, te.is_list_value = function(t) {
            var e, r, n;
            if (Z.is_array(t)) {
                for (r = 0, n = t.length; n > r; r++)
                    if (e = t[r], !te.is_atomic_field_value(e))
                        return !1;
                return !0
            }
            return !1
        }, te.is_compound_field_value = function(t) {
            return te.is_atomic_field_value(t) || te.is_list_value(t)
        }, te.atomic_field_value = function(t, e, r, n) {
            return null == r && (r = "atomic field value"), Z.check(te.is_atomic_field_value(t), "is not an atomic field value", t, e, r, n), t
        }, te.list_value = function(t, e, r, n) {
            return null == r && (r = "list value"), Z.arrayOf(te.atomic_field_value)(t, e, r, n), t
        }, te.compound_field_value = function(t, e, r, n) {
            return null == r && (r = "field value"), Z.is_array(t) ? te.list_value(t, e, r, n) : te.atomic_field_value(t, e, r, n)
        }, te.FieldOp = A = ee.union_as_list("FieldOp", [["P", [["value", te.compound_field_value]]], ["D", []], ["LC", []], ["LP", [["at", Z.uint], ["value", te.atomic_field_value]]], ["LI", [["before", Z.uint], ["value", te.atomic_field_value]]], ["LD", [["at", Z.uint]]], ["LM", [["from", Z.uint], ["to", Z.uint]]]]), te.datadict = Z.simple_typed_map("datadict", Z.field_name, te.compound_field_value), te.update_datadict = Z.simple_typed_map("update_datadict", Z.field_name, A), te.Change = n = ee.union_as_list("Change", [["I", [["tid", Z.tid], ["rowid", Z.rowid], ["fields", te.datadict]]], ["U", [["tid", Z.tid], ["rowid", Z.rowid], ["updates", te.update_datadict]]], ["D", [["tid", Z.tid], ["rowid", Z.rowid]]]]), te.Delta = D = ee.define("Delta", [["rev", Z.uint], ["changes", Z.arrayOf(n)], ["nonce", Z.string]]), L = ee.define("ListDatastoresResponseItem", [["dsid", Z.string], ["handle", Z.string], ["rev", Z.uint], ["role", Z.nullable(Z.uint), {init: null}], ["info", Z.nullable(te.datadict), {init: null}]]), te.ListDatastoresResponse = k = ee.define("ListDatastoresResponse", [["token", Z.string], ["datastores", Z.arrayOf(L)]]), U = ee.define("GetSnapshotResponseRow", [["tid", Z.string], ["rowid", Z.string], ["data", te.datadict]]), C = ee.define("GetSnapshotResponse", [["rev", Z.uint], ["role", Z.nullable(Z.uint), {init: null}], ["rows", Z.arrayOf(U)]]), s = ee.define("CreateDatastoreResponse", [["handle", Z.string], ["rev", Z.uint], ["created", Z.bool], ["role", Z.nullable(Z.uint), {init: null}]]), T = ee.define("GetDatastoreResponse", [["handle", Z.nullable(Z.string), {init: null}], ["rev", Z.nullable(Z.uint), {init: null}], ["role", Z.nullable(Z.uint), {init: null}], ["notfound", Z.nullable(Z.string), {init: null}]]), b = ee.define("DeleteDatastoresResponse", [["ok", Z.string]]), X = ee.define("PutDeltaResponse", [["rev", Z.nullable(Z.uint), {init: null}], ["role", Z.nullable(Z.uint), {init: null}], ["conflict", Z.nullable(Z.string), {init: null}], ["notfound", Z.nullable(Z.string), {init: null}], ["access_denied", Z.nullable(Z.string), {init: null}]]), x = ee.define("GetDeltasResponse", [["deltas", Z.nullable(Z.arrayOf(D)), {init: null}], ["role", Z.nullable(Z.uint), {init: null}], ["notfound", Z.nullable(Z.string), {init: null}]]), e = ee.define("AwaitResponseDeltas", [["deltas", Z.simple_typed_map("deltas map", Z.string, x)]]), te.AwaitResponse = t = ee.define("AwaitResponse", [["get_deltas", Z.nullable(e), {init: null}], ["list_datastores", Z.nullable(k), {init: null}]]), r = function() {
        function t() {
            this.min_delay_millis = 500, this.max_delay_millis = 9e4, this.base = 1.5, this._failures = 0, this.log = !1
        }
        return t.prototype.set_log = function(t) {
            this.log = t
        }, t.prototype.set_max_delay_millis = function(t) {
            this.max_delay_millis = t
        }, t.prototype.get_backoff_millis = function() {
            var t, e;
            return this._failures += 1, e = Math.min(this.max_delay_millis, this.min_delay_millis * Math.pow(this.base, this._failures - 1)), t = (.5 + Math.random()) * e, this.log && console.log("get_backoff_millis: failures=" + this._failures + ", target_delay_millis=" + e + ", delay_millis=" + t), t
        }, t.prototype.reset = function() {
            return this._failures = 0
        }, t
    }(), W = function() {
        function t() {
            this.backoff = new r
        }
        var e, n;
        return n = 6e4, e = 0, t.prototype.run = function(t, e, r) {
            var i, o, s, a, u, l, h, c = this;
            return s = null != (l = e.do_retry) ? l : function() {
                return !0
            }, a = null != (h = e.giveup_after_ms) ? h : n, u = Date.now() + a, o = !1, i = function() {
                return o ? void 0 : t(function() {
                    var t, e, n;
                    return t = arguments[0], e = 2 <= arguments.length ? oe.call(arguments, 1) : [], o ? void 0 : t && s(t) ? Date.now() > u ? (console.error("Giving up due to error", t), r(t)) : (n = c.backoff.get_backoff_millis(), console.warn("Retrying in " + n + " ms due to error", t), setTimeout(i, n)) : r.apply(null, [t].concat(oe.call(e)))
                })
            }, i(), function() {
                return o = !0
            }
        }, t
    }(), R = function() {
        function t(t) {
            this.client = t, this._retry = new W
        }
        var e, r;
        return r = 10, e = 2419200, t.prototype._run_with_retries = function(t, e, r) {
            var n;
            return n = {giveup_after_ms: 1e3 * t,do_retry: function(t) {
                var e;
                return 0 === t.status || 500 <= (e = t.status) && 600 > e
            }}, this._retry.run(r, n, e)
        }, t.prototype.delete_db = function(t, e) {
            var n = this;
            return this._run_with_retries(r, e, function(e) {
                return n.client._deleteDatastore(t, function(t, r) {
                    return null != t ? e(t) : e(null, r)
                })
            })
        }, t.prototype.list_dbs = function(t) {
            var r = this;
            return this._run_with_retries(e, t, function(t) {
                return r.client._listDatastores(function(e, r) {
                    return null != e ? t(e) : t(null, r)
                })
            })
        }, t.prototype.get_or_create_db = function(t, e) {
            var n = this;
            return this._run_with_retries(r, e, function(e) {
                return n.client._getOrCreateDatastore(t, function(t, r) {
                    return null != t ? e(t) : e(null, r)
                })
            })
        }, t.prototype.create_db = function(t, e, n) {
            var i = this;
            return this._run_with_retries(r, n, function(r) {
                return i.client._createDatastore(t, e, function(t, e) {
                    return null != t ? r(t) : r(null, e)
                })
            })
        }, t.prototype.get_db = function(t, e) {
            var n = this;
            return this._run_with_retries(r, e, function(e) {
                return n.client._getDatastore(t, function(t, r) {
                    return null != t ? e(t) : e(null, r)
                })
            })
        }, t.prototype.await = function(t, r, n) {
            var i, o = this;
            return i = this._run_with_retries(e, n, function(e) {
                return o.client._datastoreAwait(t, r, function(t, r) {
                    return null != t ? e(t) : e(null, r)
                })
            })
        }, t.prototype.put_delta = function(t, r, n) {
            var i = this;
            return this._run_with_retries(e, n, function(e) {
                return i.client._putDelta(t, r, function(t, r) {
                    return null != t ? e(t) : e(null, r)
                })
            })
        }, t.prototype.get_snapshot = function(t, e) {
            var n = this;
            return this._run_with_retries(r, e, function(e) {
                return n.client._getSnapshot(t, function(t, r) {
                    return null != t ? e(t) : e(null, r)
                })
            })
        }, t
    }(), P = function() {
        function t(t, e) {
            var r, n, i;
            for (Z.assert(t.length === e.length, function() {
                return "" + t.length + " changes, " + e.length + " undo_extras"
            }), this.changes = [], this.undo_extras = [], this._last_simple_mtime_update = null, r = n = 0, i = t.length; i >= 0 ? i > n : n > i; r = i >= 0 ? ++n : --n)
                this.add_change(t[r], e[r])
        }
        var e;
        return e = function(t, e) {
            var r, i, o, s, a;
            switch (s = null, i = null, t.tag()) {
                case "I":
                    s = "D";
                    break;
                case "U":
                    s = "U", i = {};
                    for (o in e)
                        a = e[o], i[o] = null == a ? ["D"] : ["P", a];
                    break;
                case "D":
                    s = "I", i = te.clone(e);
                    break;
                default:
                    throw new Error("Unknown change tag: " + t.tag())
            }
            return r = [s, t.tid, t.rowid], null != i && r.push(i), n.from_array(r)
        }, t._is_simple_mtime_update = function(t) {
            var e, r;
            switch (t.tag()) {
                case "I":
                case "D":
                    return !1;
                case "U":
                    if (":info" !== t.tid || "info" !== t.rowid)
                        return !1;
                    if (r = Object.keys(t.updates), 1 !== r.length)
                        return !1;
                    if ("mtime" !== r[0])
                        return !1;
                    switch (e = t.updates.mtime, e.tag()) {
                        case "P":
                            return !0;
                        case "D":
                        case "LC":
                        case "LP":
                        case "LI":
                        case "LD":
                        case "LM":
                            return !1;
                        default:
                            throw new Error("Unknown field op: " + e.tag())
                    }
                    break;
                default:
                    throw new Error("Unknown change tag: " + t.tag())
            }
        }, t._affects_mtime = function(t) {
            if (":info" !== t.tid || "info" !== t.rowid)
                return !1;
            switch (t.tag()) {
                case "I":
                case "D":
                    return !0;
                case "U":
                    return "mtime" in t.updates ? !0 : !1;
                default:
                    throw new Error("Unknown change tag: " + t.tag())
            }
        }, t.prototype.add_change = function(e, r) {
            return this.changes.push(e), this.undo_extras.push(r), t._affects_mtime(e) && (t._is_simple_mtime_update(e) ? (null != this._last_simple_mtime_update && (this.changes.splice(this._last_simple_mtime_update, 1), this.undo_extras.splice(this._last_simple_mtime_update, 1)), this._last_simple_mtime_update = this.changes.length - 1) : this._last_simple_mtime_update = null), void 0
        }, t.prototype.inverse_changes = function() {
            var t, r, n, i, o, s;
            for (n = [], s = this.changes, r = i = 0, o = s.length; o > i; r = ++i)
                t = s[r], n.push(e(t, this.undo_extras[r]));
            return n.reverse(), n
        }, t
    }(), te.LocalDelta = P, F = 10, B = F, te.make_nonce = function() {
        return te.randomWeb64String(F)
    }, te.value_size = function(t) {
        var e, r, n, i;
        if (Z.is_string(t))
            return S.Util.countUtf8Bytes(t);
        if (Z.is_bool(t))
            return 0;
        if (Z.is_number(t))
            return 0;
        if (Z.is_array(t)) {
            for (e = S.Datastore.List.BASE_ITEM_SIZE * t.length, n = 0, i = t.length; i > n; n++)
                r = t[n], e += te.value_size(r);
            return e
        }
        if ("object" != typeof t)
            throw new Error("Unexpected value: " + t);
        if (null != t.I)
            return 0;
        if (null != t.N)
            return 0;
        if (null != t.B)
            return Math.ceil(3 * t.B.length / 4);
        if (null != t.T)
            return 0;
        throw new Error("Unexpected object: " + JSON.stringify(t))
    }, te.size_difference_for_field_op = function(t, e, r) {
        var n, i, o, s;
        switch (n = t.get(e), r.tag()) {
            case "P":
                return i = r.value, null == n ? S.Datastore.Record.BASE_FIELD_SIZE + te.value_size(i) : te.value_size(i) - te.value_size(n);
            case "D":
                return null != n ? -(S.Datastore.Record.BASE_FIELD_SIZE + te.value_size(n)) : 0;
            case "LC":
                return Y(null == n, "can't create list for field that already exists"), S.Datastore.Record.BASE_FIELD_SIZE;
            case "LP":
                return Y(Z.is_array(n), "LP on non-list"), Y(0 <= (o = r.at) && o < n.length, "bad index for LP"), te.value_size(r.value) - te.value_size(n[r.at]);
            case "LI":
                return (null != n ? 0 : S.Datastore.Record.BASE_FIELD_SIZE) + S.Datastore.List.BASE_ITEM_SIZE + te.value_size(r.value);
            case "LD":
                return Y(Z.is_array(n), "LD on non-list"), Y(0 <= (s = r.at) && s < n.length, "bad index for LD"), -(S.Datastore.List.BASE_ITEM_SIZE + te.value_size(n[r.at]));
            case "LM":
                return 0;
            default:
                throw new Error("unexpected field op type " + r.tag())
        }
    }, te.size_difference_for_change = function(t, e) {
        var r, n, i, o, s, a, u;
        return s = function() {
            var s, l;
            switch (e.tag()) {
                case "I":
                    o = S.Datastore.Record.BASE_RECORD_SIZE, s = e.fields;
                    for (r in s)
                        u = s[r], o += S.Datastore.Record.BASE_FIELD_SIZE + te.value_size(u);
                    return o;
                case "U":
                    i = t.get_record(e.tid, e.rowid), Z.assert(null != i, function() {
                        return "record not found: " + JSON.stringify(e)
                    }), a = 0, l = e.updates;
                    for (r in l)
                        n = l[r], a += te.size_difference_for_field_op(i, r, n);
                    return a;
                case "D":
                    return -t.get_record(e.tid, e.rowid)._size;
                default:
                    throw new Error("unrecognized tag " + e.tag())
            }
        }()
    }, H = function() {
        function t(t, e, r) {
            var n, i;
            this._tid = t, this._rid = e, null == r && (r = {}), this._fields = {}, this._size = S.Datastore.Record.BASE_RECORD_SIZE;
            for (n in r)
                i = r[n], this._fields[n] = te.clone(i), this._size += S.Datastore.Record.BASE_FIELD_SIZE + te.value_size(i)
        }
        return t.prototype.get = function(t) {
            return this._fields[t]
        }, t.prototype.get_all = function() {
            return this._fields
        }, t.prototype.put = function(t, e) {
            return null != e ? this._fields[t] = te.clone(e) : delete this._fields[t], void 0
        }, t.prototype.apply_field_op = function(t, e) {
            var r, n, i, o, s, a, u;
            switch (r = this._fields[t], e.tag()) {
                case "P":
                    this._fields[t] = te.clone(e.value);
                    break;
                case "D":
                    delete this._fields[t];
                    break;
                case "LC":
                    Y(null == r, "can't create list for field that already exists"), this._fields[t] = [];
                    break;
                case "LP":
                    Y(Z.is_array(r), "LP on non-list"), Y(0 <= (i = e.at) && i < r.length, "bad index for LP"), r[e.at] = te.clone(e.value);
                    break;
                case "LI":
                    null != r ? (Y(Z.is_array(r), "LI on non-list"), Y(0 <= (o = e.before) && o <= r.length, "bad index for LI"), r.splice(e.before, 0, te.clone(e.value))) : (Y(0 === e.before, "bad index for LI on nonexistent field"), this._fields[t] = [te.clone(e.value)]);
                    break;
                case "LD":
                    Y(Z.is_array(r), "LD on non-list"), Y(0 <= (s = e.at) && s < r.length, "bad index for LD"), r.splice(e.at, 1);
                    break;
                case "LM":
                    Y(Z.is_array(r), "LM on non-list"), Y(0 <= (a = e.from) && a < r.length, "bad from index for LM"), Y(0 <= (u = e.to) && u < r.length, "bad to index for LM"), n = r[e.from], r.splice(e.from, 1), r.splice(e.to, 0, n);
                    break;
                default:
                    throw new Error("unexpected field op type " + e.tag())
            }
            return void 0
        }, t.prototype.size = function() {
            return this._size
        }, t
    }(), $ = function() {
        function t() {
            this._records = {}
        }
        return t.prototype.get = function(t) {
            return this._records[t]
        }, t.prototype.put = function(t, e) {
            return null != e ? this._records[t] = e : delete this._records[t], void 0
        }, t.prototype.has = function(t) {
            return null != this._records[t]
        }, t.prototype.is_empty = function() {
            var t;
            for (t in this._records)
                return !1;
            return !0
        }, t.prototype.list_record_ids = function() {
            var t, e;
            e = [];
            for (t in this._records)
                e.push(t);
            return e
        }, t
    }(), l = function() {
        function t(t, e) {
            var r, n, i, o, s, a;
            this._tables = {}, this._record_count = 0, this._size = S.Datastore.BASE_DATASTORE_SIZE;
            for (a in e) {
                i = e[a], s = this._get_table(a);
                for (o in i)
                    r = i[o], n = new H(a, o, r), this._check_record_size(t, a, o, n._size), s.put(o, n), this._record_count += 1, this._size += n._size
            }
            this._check_datastore_size(t, this._size), this._changedInfoFields = {}
        }
        return t.from_get_snapshot_resp = function(e) {
            var r, n, i, o, s, a;
            for (r = {}, a = e.rows, i = 0, o = a.length; o > i; i++)
                n = a[i], r[s = n.tid] || (r[s] = {}), r[n.tid][n.rowid] = n.data;
            return new t(!1, r)
        }, t.prototype._size_limit_exceeded = function(t, e) {
            var r;
            if (t)
                throw r = new Error(e), r.code = "SIZE_LIMIT_EXCEEDED", r;
            return console.warn(e), void 0
        }, t.prototype._check_record_size = function(t, e, r, n) {
            return n > S.Datastore.Record.RECORD_SIZE_LIMIT && this._size_limit_exceeded(t, "Record (" + e + ", " + r + ") too large: " + n + " bytes"), void 0
        }, t.prototype._check_datastore_size = function(t, e) {
            return e > S.Datastore.DATASTORE_SIZE_LIMIT && this._size_limit_exceeded(t, "Datastore too large: " + e + " bytes"), void 0
        }, t.prototype._TEST_calculate_size_from_scratch = function() {
            var t, e, r, n, i, o, s, a, u, l, h, c;
            n = 0, l = this._tables;
            for (o in l)
                for (i = l[o], h = i.list_record_ids(), a = 0, u = h.length; u > a; a++) {
                    r = h[a], e = i.get(r), n += S.Datastore.Record.BASE_RECORD_SIZE, c = e.get_all();
                    for (t in c)
                        s = c[t], n += S.Datastore.Record.BASE_FIELD_SIZE + te.value_size(s)
                }
            return n
        }, t.prototype.raw_data = function() {
            var t, e, r, n, i, o, s, a;
            t = {}, s = this._tables;
            for (n in s)
                for (r = s[n], t[n] = {}, a = r.list_record_ids(), i = 0, o = a.length; o > i; i++)
                    e = a[i], t[n][e] = te.clone(r.get(e).get_all());
            return t
        }, t.prototype.get_record = function(t, e) {
            var r;
            return null != (r = this._tables[t]) ? r.get(e) : void 0
        }, t.prototype.clearInfoFields = function() {
            return this._changedInfoFields = {}
        }, t.prototype.updateInfoFieldsFromChange = function(t) {
            var e, r, n, i, o, s, a, u, l;
            switch (Z.assert(":info" === t.tid, function() {
                return "updateInfoField: table must be :info, got " + t.tid
            }), Z.assert("info" === t.rowid, function() {
                return "updateInfoField: row must be info, got " + t.rowid
            }), t.tag()) {
                case "I":
                    o = t.fields, a = [];
                    for (e in o)
                        n = o[e], a.push(this._changedInfoFields[e] = !0);
                    return a;
                case "U":
                    s = t.updates, u = [];
                    for (e in s)
                        i = s[e], u.push(this._changedInfoFields[e] = !0);
                    return u;
                case "D":
                    if (r = this.get_record(":info", "info"), null != r) {
                        l = [];
                        for (e in r.get_all())
                            l.push(this._changedInfoFields[e] = !0);
                        return l
                    }
                    break;
                default:
                    throw new Error("Unknown change tag: " + t.tag())
            }
        }, t.prototype.updateDatastoreInfo = function(t) {
            var e, r;
            t = te.clone(t || {}), e = this.query(":info", "info") || {};
            for (r in this._changedInfoFields)
                r in e ? t[r] = e[r] : delete t[r];
            return t
        }, t.prototype.getLocalInfoData = function() {
            return te.clone(this.query(":info", "info") || {})
        }, t.prototype.apply_change = function(t, e) {
            var r, n, i;
            switch (r = te.size_difference_for_change(this, e), r >= 0 && this._check_datastore_size(t, this._size + r), ":info" === e.tid && "info" === e.rowid && this.updateInfoFieldsFromChange(e), e.tag()) {
                case "I":
                    this._check_record_size(t, e.tid, e.rowid, r), this._record_count += 1, i = this._apply_insert(e);
                    break;
                case "U":
                    n = this.get_record(e.tid, e.rowid), Z.assert(null != n, function() {
                        return "apply_change: record does not exist: " + JSON.stringify(e)
                    }), r >= 0 && this._check_record_size(t, e.tid, e.rowid, n._size + r), i = this._apply_update(n, e), n._size += r;
                    break;
                case "D":
                    this._record_count -= 1, i = this._apply_delete(e);
                    break;
                default:
                    throw new Error("unrecognized tag " + e.tag())
            }
            return this._size += r, i
        }, t.prototype._get_table = function(t) {
            return null == this._tables[t] && (this._tables[t] = new $), this._tables[t]
        }, t.prototype._apply_insert = function(t) {
            var e, r;
            return r = this._get_table(t.tid), Z.assert(!r.has(t.rowid), function() {
                return "_apply_insert: record already exists: " + JSON.stringify(t)
            }), e = new H(t.tid, t.rowid, t.fields), r.put(t.rowid, e), null
        }, t.prototype._apply_update = function(t, e) {
            var r, n, i, o, s, a, u;
            o = {};
            try {
                a = e.updates;
                for (n in a)
                    i = a[n], s = te.clone(null != (u = t.get(n)) ? u : null), t.apply_field_op(n, i), o[n] = s
            } catch (l) {
                r = l;
                for (n in o)
                    s = o[n], t.put(!1, n, s);
                throw r
            }
            return o
        }, t.prototype._apply_delete = function(t) {
            var e, r, n;
            return n = this._get_table(t.tid), Z.assert(n.has(t.rowid), function() {
                return "_apply_delete: record does not exist: " + JSON.stringify(t)
            }), r = n.get(t.rowid), e = te.clone(r.get_all()), n.put(t.rowid, null), n.is_empty() && delete this._tables[t.tid], e
        }, t.prototype.query = function(t, e) {
            var r, n;
            return n = this._tables[t], null == n ? null : (r = n.get(e), null == r ? null : te.clone(r.get_all()))
        }, t.prototype.list_tables = function() {
            var t, e;
            return t = function() {
                var t;
                t = [];
                for (e in this._tables)
                    t.push(e);
                return t
            }.call(this), t.sort(), t
        }, t.prototype.list_rows_for_table = function(t) {
            var e, r;
            return r = this._tables[t], null == r ? [] : (e = r.list_record_ids(), e.sort(), e)
        }, t.prototype.record_count = function() {
            return this._record_count
        }, t.prototype.size = function() {
            return this._size
        }, t
    }(), N = function() {
        function t(t, e, r, n, i, o, s, a) {
            this.dbid = t, this.handle = e, this.role = r, this.datastore_model = n, this.resolver = i, this.sync_state = o, this.flob_client = s, this._dslist_listener = a, this.syncStateChanged = new S.Util.EventSource, this._deleted = !1, this._open = !0, this._put_delta_queue = new J, this._update_mtime_on_change = !0
        }
        return t.fresh_managed_datastore = function(e, r, n, i, o, s, a, u) {
            var l;
            return l = new K(o), new t(e, r, n, i, s, l, a, u)
        }, t.prototype.get_dsid = function() {
            return this.dbid
        }, t.prototype.get_handle = function() {
            return this.handle
        }, t.prototype.get_effective_role = function() {
            return this.role
        }, t.prototype.is_deleted = function() {
            return this._deleted
        }, t.prototype.mark_deleted = function() {
            return this._deleted = !0
        }, t.prototype.open = function() {
            if (this._open)
                throw new Error("Attempt to open datastore multiple times");
            return this._open = !0
        }, t.prototype.close = function() {
            if (!this._open)
                throw new Error("Attempt to close datastore multiple times");
            return this._open = !1
        }, t.prototype.is_closed = function() {
            return !this._open
        }, t.prototype._updateInfoFieldsAfterSync = function() {
            var t, e, r, n, i, o;
            for (this.datastore_model.clearInfoFields(), i = this.sync_state.unsynced_deltas, o = [], r = 0, n = i.length; n > r; r++)
                e = i[r], o.push(function() {
                    var r, n, i, o;
                    for (i = e.changes, o = [], r = 0, n = i.length; n > r; r++)
                        t = i[r], ":info" === t.tid && "info" === t.rowid ? o.push(this.datastore_model.updateInfoFieldsFromChange(t)) : o.push(void 0);
                    return o
                }.call(this));
            return o
        }, t.prototype._should_notify_dslist_listener_for = function(t) {
            var e, r;
            if (e = function(t) {
                    var e;
                    for (e in t)
                        if ("mtime" !== e)
                            return !0;
                    return !1
                }, ":info" !== t.tid || "info" !== t.rowid)
                return !1;
            switch (t.tag()) {
                case "D":
                    if (r = this.datastore_model.get_record(t.tid, t.rowid), null == r)
                        throw new Error("Record not found: " + t.tid + " " + t.rowid);
                    return e(r.get_all());
                case "U":
                    return e(t.updates);
                case "I":
                    return e(t.fields);
                default:
                    throw new Error("unknown change tag: " + t.tag())
            }
        }, t.prototype._rollback_unsynced_deltas = function(t) {
            var e, r, n, i, o, s, a, u, l, h, c, d;
            for (e = {}, s = this.sync_state.unsynced_deltas.slice().reverse(), a = 0, h = s.length; h > a; a++) {
                for (o = s[a], i = o.inverse_changes(), u = 0, c = i.length; c > u; u++)
                    n = i[u], this.datastore_model.apply_change(!1, n);
                if (t)
                    for (l = 0, d = i.length; d > l; l++)
                        r = i[l], r.tid in e || (e[r.tid] = {}), e[r.tid][r.rowid] = !0
            }
            return e
        }, t.prototype._do_sync = function() {
            var t, e, r, n, i, o, s, a, u, l, h, c, d, _, p, f, g, y;
            if (o = this.sync_state.get_server_deltas(), 0 === o.length)
                return {};
            for (i = this.resolver.resolve(this.sync_state.unsynced_deltas, o), n = i.rebased_deltas, t = i.affected_records, s = !1, this._rollback_unsynced_deltas(!1), u = 0, d = o.length; d > u; u++)
                for (r = o[u], g = r.changes, l = 0, _ = g.length; _ > l; l++)
                    e = g[l], s |= this._should_notify_dslist_listener_for(e), this.datastore_model.apply_change(!1, e);
            for (h = 0, p = n.length; p > h; h++)
                for (r = n[h], r.undo_extras = [], y = r.changes, c = 0, f = y.length; f > c; c++)
                    e = y[c], s |= this._should_notify_dslist_listener_for(e), a = this.datastore_model.apply_change(!1, e), r.undo_extras.push(a);
            return this.sync_state.update_unsynced_deltas(n), s && this._dslist_listener(), t
        }, t.prototype._do_put_delta = function() {
            var t, e = this;
            if (!this.sync_state.delta_pending() && (t = this.sync_state.get_delta_to_put(), null != t))
                return this._put_delta_queue.request(function() {
                    return e.flob_client.put_delta(e.handle, t, function(r, n) {
                        return null == r && (null != n.rev && (e.sync_state.put_succeeded(t), e.syncStateChanged.dispatch(null)), null != n.access_denied && (console.log("Write access denied, reverting pending changes. Reason:", n.access_denied), e._affected_records_from_access_denied = e._rollback_unsynced_deltas(!0), e.sync_state.clear_unsynced_deltas(), e.role = te.ROLE_VIEWER, e.syncStateChanged.dispatch(null))), e._put_delta_queue.finish()
                    })
                })
        }, t.prototype._apply_and_queue_local_change = function(t, e) {
            var r, n;
            return r = this._should_notify_dslist_listener_for(e), n = this.datastore_model.apply_change(t, e), this.sync_state.add_unsynced_change(e, n), r && this._dslist_listener(), void 0
        }, t.prototype._clock = function() {
            return new Date
        }, t.prototype._update_mtime = function() {
            var t;
            return this._update_mtime_on_change ? (t = null != this.datastore_model.query(":info", "info") ? n.from_array(["U", ":info", "info", {mtime: ["P", te.toDsValue(this._clock())]}]) : n.from_array(["I", ":info", "info", {mtime: te.toDsValue(this._clock())}]), this._apply_and_queue_local_change(!1, t)) : null
        }, t.prototype.perform_local_change = function(t) {
            return this._apply_and_queue_local_change(!0, t), this._update_mtime(), this.syncStateChanged.dispatch(null)
        }, t.prototype.sync = function() {
            var t;
            return t = this._affected_records_from_access_denied, null != t ? (delete this._affected_records_from_access_denied, t) : (this.has_unfinalized_changes() && this.sync_state.finalize(), t = this._do_sync(), this._do_put_delta(), this._updateInfoFieldsAfterSync(), t)
        }, t.prototype.get_outgoing_delta_count = function() {
            return this.sync_state.unsynced_deltas.length
        }, t.prototype.get_incoming_delta_count = function() {
            return this.sync_state.get_server_deltas().length
        }, t.prototype.has_unfinalized_changes = function() {
            return this.sync_state.has_unfinalized_changes()
        }, t.prototype.receive_server_delta = function(t) {
            return this.sync_state.receive_server_delta(t), this.syncStateChanged.dispatch(null), void 0
        }, t.prototype.query = function(t, e) {
            return this.datastore_model.query(t, e)
        }, t.prototype.list_tables = function() {
            var t;
            return function() {
                var e, r, n, i;
                for (n = this.datastore_model.list_tables(), i = [], e = 0, r = n.length; r > e; e++)
                    t = n[e], ":info" !== t && t !== te.ACL_TID && i.push(t);
                return i
            }.call(this)
        }, t.prototype.list_rows_for_table = function(t) {
            return this.datastore_model.list_rows_for_table(t)
        }, t.prototype.get_record_count = function() {
            return this.datastore_model.record_count()
        }, t.prototype.get_record_size = function(t, e) {
            return this.datastore_model.get_record(t, e).size()
        }, t.prototype.get_size = function() {
            return this.datastore_model.size()
        }, t
    }(), K = function() {
        function t(t) {
            this._server_rev = t, Z.uint(this._server_rev, "_server_rev"), this._pending_delta = null, this._server_deltas = [], this.unsynced_deltas = [], this._last_unsynced_delta_unfinalized = !1
        }
        return t.prototype.get_server_rev = function() {
            return this._server_rev
        }, t.prototype.is_current = function() {
            return 0 === this.unsynced_deltas.length && 0 === this._server_deltas.length
        }, t.prototype.get_server_deltas = function() {
            return this._server_deltas
        }, t.prototype.add_unsynced_change = function(t, e) {
            var r;
            return r = this.unsynced_deltas.length, this._last_unsynced_delta_unfinalized ? this.unsynced_deltas[r - 1].add_change(t, e) : (this.unsynced_deltas.push(new P([t], [e])), this._last_unsynced_delta_unfinalized = !0), void 0
        }, t.prototype._compact_deltas = function() {
            var t, e, r, n, i, o, s, a, u, l, h, c, d, _, p, f;
            if (Y(null == this._pending_delta, "delta pending"), n = this.unsynced_deltas.length, !(1 >= n)) {
                for (s = this._last_unsynced_delta_unfinalized ? this.unsynced_deltas.pop() : null, e = [], o = [], _ = this.unsynced_deltas, a = 0, h = _.length; h > a; a++) {
                    for (r = _[a], p = r.changes, u = 0, c = p.length; c > u; u++)
                        t = p[u], e.push(t);
                    for (f = r.undo_extras, l = 0, d = f.length; d > l; l++)
                        i = f[l], o.push(i)
                }
                return this.unsynced_deltas = [new P(e, o)], null != s && this.unsynced_deltas.push(s), void 0
            }
        }, t.prototype.get_delta_to_put = function() {
            var t, e;
            return Y(null == this._pending_delta, "delta pending"), t = this.unsynced_deltas.length, 0 === t || 1 === t && this._last_unsynced_delta_unfinalized ? null : (this._compact_deltas(), this._last_unsynced_delta_unfinalized && Y(this.unsynced_deltas.length > 1, "the only delta is unfinalized"), e = this.unsynced_deltas[0], this._pending_delta = new D({changes: e.changes.slice(),nonce: te.make_nonce(),rev: this._server_rev}), this._pending_delta)
        }, t.prototype.delta_pending = function() {
            return null != this._pending_delta
        }, t.prototype.has_unfinalized_changes = function() {
            return this._last_unsynced_delta_unfinalized
        }, t.prototype.finalize = function() {
            return this._last_unsynced_delta_unfinalized = !1, void 0
        }, t.prototype.update_unsynced_deltas = function(t) {
            return this.unsynced_deltas = t, this._server_rev += this._server_deltas.length, this._server_deltas = []
        }, t.prototype._is_our_pending = function(t) {
            return null != this._pending_delta && this._pending_delta.nonce === t.nonce
        }, t.prototype._ack = function(t) {
            return Y(this._is_our_pending(t), "not ours"), Y(0 === this._server_deltas.length, "server deltas exist"), this._pending_delta = null, this.unsynced_deltas.shift(), this._server_rev++
        }, t.prototype.put_succeeded = function(t) {
            return this._is_our_pending(t) ? this._ack(t) : void 0
        }, t.prototype.clear_unsynced_deltas = function() {
            return this._pending_delta = null, this.unsynced_deltas = [], this._last_unsynced_delta_unfinalized = !1
        }, t.prototype.receive_server_delta = function(t) {
            var e, r;
            return r = this._server_deltas.length, e = r > 0 ? this._server_deltas[r - 1].rev + 1 : this._server_rev, Y(t.rev <= e, "was expecting rev " + e + ", but got " + t.rev + " instead!"), t.rev < e ? void 0 : (this._is_our_pending(t) ? this._ack(t) : (this._server_deltas.push(t), this._pending_delta = null), void 0)
        }, t
    }(), te.DatastoreModel = l, j = function() {
        function t(t) {
            this.update_manager = t, this.cancelled = !1, this.cancel_fn = null
        }
        return t.prototype.cancel = function() {
            return null != this.cancel_fn && this.cancel_fn(), this.cancelled = !0
        }, t.prototype.poll = function() {
            var t, e = this;
            return t = function() {
                var r;
                if (!e.cancelled)
                    return r = te.clone(e.update_manager._handle_version_map), e.cancel_fn = e.update_manager.flob_client.await(r, e.update_manager._last_dslist_token, function(n, i) {
                        var o, s, a, u, l, h, c, d, _, p;
                        if (e.cancel_fn = null, n)
                            return 0 === n.status ? (console.log("await deltas failed (offline):", n), setTimeout(t, 1e4)) : n.status && 500 <= (d = n.status) && 599 >= d ? (console.log("server error:", n), setTimeout(t, 2e3)) : (console.error("Got error in longpoll:", n), setTimeout(t, 1e4));
                        if (null != i.get_deltas) {
                            _ = i.get_deltas.deltas;
                            for (u in _)
                                if (s = _[u], null != s.notfound)
                                    e.update_manager._data_queue.push({handle: u,notfound: s.notfound}), delete e.update_manager._handle_version_map[u];
                                else if (null != s.deltas) {
                                    for (null != s.role && e.update_manager._data_queue.push({handle: u,role: s.role}), p = s.deltas, h = 0, c = p.length; c > h; h++)
                                        a = p[h], e.update_manager._data_queue.push({handle: u,delta: a});
                                    l = r[u] + s.deltas.length, o = e.update_manager._handle_version_map[u], null != o && (e.update_manager._handle_version_map[u] = Math.max(o, l))
                                }
                        }
                        return null != i.list_datastores && (e.update_manager._last_dslist_token = i.list_datastores.token, e.update_manager._data_queue.push({dslist: i.list_datastores})), setTimeout(t, 0)
                    })
            }, t()
        }, t
    }(), I = function() {
        function t(t) {
            this.flob_client = t, this._data_queue = null, this._handle_version_map = {}, this._last_dslist_token = ".", this._pending_poll = null, this._running = !1
        }
        return t.prototype.run = function(t) {
            return this._data_queue = new o(t), this._running = !0, this._do_longpoll()
        }, t.prototype.stop = function() {
            return this._pending_poll ? this._pending_poll.cancel() : void 0
        }, t.prototype.add_poll = function(t, e) {
            var r, n;
            return Y(this._running, "update manager is not running"), r = this._handle_version_map[t], n = e, null != r && (n = Math.max(e, r)), this._handle_version_map[t] = n, this._do_longpoll()
        }, t.prototype.remove_poll = function(t) {
            return Y(this._running, "update manager is not running"), t in this._handle_version_map ? (delete this._handle_version_map[t], this._do_longpoll()) : void 0
        }, t.prototype._do_longpoll = function() {
            return Y(this._running, "update manager is not running"), this._pending_poll && (this._pending_poll.cancel(), this._pending_poll = null), this._pending_poll = new j(this), this._pending_poll.poll()
        }, t
    }(), z = function() {
        function t(t, e, r, n) {
            this.update_manager = t, this.flob_client = e, this._dslist_listener_server = r, this._dslist_listener_local = n, this.update_manager.run(this._handle_server_update.bind(this)), this._cached_objects = {}, this._handle_to_dsid_map = {}
        }
        return t.prototype.destroy = function() {
            var t;
            for (t in this._cached_objects)
                this._cached_objects[t].close();
            return this.update_manager.stop()
        }, t.prototype.getAllCachedUndeletedDatastoreIDs = function() {
            var t, e;
            return function() {
                var r, n;
                r = this._cached_objects, n = [];
                for (e in r)
                    t = r[e], t.is_deleted() || n.push(e);
                return n
            }.call(this)
        }, t.prototype.getCachedDatastore = function(t) {
            return this._cached_objects[t]
        }, t.prototype._evict = function(t) {
            var e, r;
            return e = this._handle_to_dsid_map[t], null != e ? (delete this._handle_to_dsid_map[t], e in this._cached_objects && (r = this._cached_objects[e], r.mark_deleted(), r.is_closed() && delete this._cached_objects[e]), this.update_manager.remove_poll(t)) : void 0
        }, t.prototype.close = function(t) {
            var e, r;
            if (!(t in this._cached_objects))
                throw new Error("Attempt to close unknown datastore: " + t);
            return e = this._cached_objects[t].get_handle(), r = this._cached_objects[t], r.close(), r.is_deleted() ? delete this._cached_objects[t] : void 0
        }, t.prototype._handle_server_update = function(t, e) {
            var r, n, i;
            return t.dslist ? (this._dslist_listener_server && this._dslist_listener_server(t.dslist), e(null)) : (i = t.handle, r = this._handle_to_dsid_map[i], null == r ? (console.log("unknown handle " + i + " (maybe datastore was evicted)", t, this._handle_to_dsid_map, this._cached_objects), e(null)) : null == t.delta ? (null != t.notfound ? this._evict(i) : null != t.role && null != this._cached_objects[r] && (this._cached_objects[r].role = t.role), e(null)) : (n = t.delta, this._retrieve(r, i, function(t, r) {
                return t ? e(t) : (r.receive_server_delta(n), e(null))
            })))
        }, t.prototype.open = function(t, e, r) {
            return this._cached_objects[t] && this._cached_objects[t].open(), this._retrieve(t, e, r)
        }, t.prototype._retrieve = function(t, e, r) {
            var n, i = this;
            return n = this._cached_objects[t], null != n ? r(null, n) : (this._handle_to_dsid_map[e] = t, this.flob_client.get_snapshot(e, function(n, o) {
                var s, a, u;
                return null != n ? r(n) : null != i._cached_objects[t] ? r(null, i._cached_objects[t]) : (s = l.from_get_snapshot_resp(o), u = new w, a = N.fresh_managed_datastore(t, e, o.role, s, o.rev, u, i.flob_client, i._dslist_listener_local), i.update_manager.add_poll(e, a.sync_state.get_server_rev()), i._cached_objects[t] = a, r(null, a))
            }))
        }, t
    }(), O = function() {
        function t(t) {
            var i, o, s, a, l, h, c, d, _, y, m, v = this;
            for (this.rule_name = null != t ? t : "default", this.precedence = n[this.rule_name], this._transforms = {}, s = 0, h = r.length; h > s; s++)
                o = r[s], this._transforms[o] = {};
            for (m = ["P", "D"], a = 0, c = m.length; c > a; a++)
                for (o = m[a], l = 0, d = e.length; d > l; l++)
                    i = e[l], this._transforms[o][i] = p, this._transforms[i][o] = f;
            for (y = 0, _ = e.length; _ > y; y++)
                i = e[y], "LC" === i ? this._transforms.LC.LC = function() {
                    return [null, null]
                } : (this._transforms.LC[i] = f, this._transforms[i].LC = p);
            this._transforms.P.P = function(t, e) {
                var r;
                return r = v.precedence(t.value, e.value), "left" === r ? [t, null] : [null, e]
            }, this._transforms.P.D = function(t, e) {
                var r;
                return r = v.precedence(t.value, null), "left" === r ? [t, null] : [null, e]
            }, this._transforms.D.P = function(t, e) {
                var r;
                return r = v.precedence(null, e.value), "left" === r ? [t, null] : [null, e]
            }, this._transforms.D.D = function(t, e) {
                var r;
                return r = v.precedence(null, null), "left" === r ? [t, null] : [null, e]
            }, this._transforms.LP.LP = function(t, e) {
                var r;
                return t.at !== e.at ? [t, e] : (r = v.precedence(t.value, e.value), "left" === r ? [t, null] : [null, e])
            }, this._transforms.LP.LI = function(t, e) {
                var r;
                return r = u(t), r.at += e.before <= t.at ? 1 : 0, [r, e]
            }, this._transforms.LP.LD = function(t, e) {
                var r;
                return t.at === e.at ? [null, e] : (r = u(t), r.at -= e.at < t.at ? 1 : 0, [r, e])
            }, this._transforms.LP.LM = function(t, e) {
                var r;
                return r = u(t), t.at === e.from ? r.at = e.to : (r.at -= e.from < r.at ? 1 : 0, r.at += e.to <= r.at ? 1 : 0), [r, e]
            }, this._transforms.LI.LP = g(this._transforms.LP.LI), this._transforms.LI.LI = function(t, e) {
                var r, n, i;
                return i = [u(t), u(e)], r = i[0], n = i[1], t.before < e.before ? n.before += 1 : r.before += 1, [r, n]
            }, this._transforms.LI.LD = function(t, e) {
                var r, n, i;
                return i = [u(t), u(e)], r = i[0], n = i[1], r.before -= e.at < t.before ? 1 : 0, n.at += t.before <= e.at ? 1 : 0, [r, n]
            }, this._transforms.LI.LM = function(t, e) {
                var r, n, i, o;
                return o = [u(t), u(e)], n = o[0], i = o[1], t.before === e.to + 1 && e.from <= e.to ? [t, e] : t.before === e.to && e.from > e.to ? (n.before++, i.from++, [n, i]) : (r = e.from < t.before ? t.before - 1 : t.before, i.from += t.before <= e.from ? 1 : 0, n.before = e.to < r ? r + 1 : r, i.to += r <= e.to ? 1 : 0, [n, i])
            }, this._transforms.LD.LP = g(this._transforms.LP.LD), this._transforms.LD.LI = g(this._transforms.LI.LD), this._transforms.LD.LD = function(t, e) {
                var r, n, i;
                return t.at === e.at ? [null, null] : (i = [u(t), u(e)], r = i[0], n = i[1], t.at < e.at ? n.at -= 1 : r.at -= 1, [r, n])
            }, this._transforms.LD.LM = function(t, e) {
                var r, n, i;
                return t.at === e.from ? (r = u(t), r.at = e.to, [r, null]) : (i = [u(t), u(e)], r = i[0], n = i[1], r.at -= e.from < r.at ? 1 : 0, r.at += e.to <= r.at ? 1 : 0, n.to += n.from < n.to ? 1 : 0, n.from -= t.at < n.from ? 1 : 0, n.to -= t.at < n.to ? 1 : 0, n.to -= n.from < n.to ? 1 : 0, [r, n])
            }, this._transforms.LM.LP = g(this._transforms.LP.LM), this._transforms.LM.LI = function(t, e) {
                var r, n, i, o;
                return o = [u(t), u(e)], n = o[0], i = o[1], e.before === t.to + 1 && t.from <= t.to ? [t, e] : e.before === t.to && t.from > t.to ? (n.from++, n.to++, [n, i]) : (r = t.from < e.before ? e.before - 1 : e.before, n.from += e.before <= t.from ? 1 : 0, i.before = t.to < r ? r + 1 : r, n.to += r <= t.to ? 1 : 0, [n, i])
            }, this._transforms.LM.LD = g(this._transforms.LD.LM), this._transforms.LM.LM = function(t, e) {
                var r, n, i, o, s, a, l, h, c, d, _;
                return t.from === e.from ? t.to === e.to ? [null, null] : e.from === e.to ? [t, e] : (o = u(e), o.from = t.to, [null, o]) : t.to === t.from ? (i = u(t), i.from += (e.to <= t.from) - (e.from < t.from), t.from === e.to && e.from < e.to && i.from--, i.to = i.from, [i, e]) : e.to === e.from ? (o = u(e), o.from += (t.to <= e.from) - (t.from < e.from), o.to = o.from, [t, o]) : (l = [u(t), u(e)], i = l[0], o = l[1], t.to === e.to && t.from > t.to && e.from > e.to ? (i.to++, e.from > t.from ? i.from++ : o.from++, [i, o]) : t.from === e.to && e.from === t.to && t.from < t.to ? (o.from--, i.from++, [i, o]) : t.from > t.to && e.from < e.to && e.to + 1 === t.to ? [t, e] : (h = [t.to, t.from], s = h[0], r = h[1], s += t.from < s ? 1 : 0, s -= e.from < s ? 1 : 0, s += e.to < s ? 1 : 0, r -= e.from < r ? 1 : 0, r += e.to <= r ? 1 : 0, s -= s > r ? 1 : 0, c = [e.to, e.from], a = c[0], n = c[1], a += e.from < a ? 1 : 0, a -= t.from < a ? 1 : 0, a += t.to <= a ? 1 : 0, n -= t.from < n ? 1 : 0, n += t.to <= n ? 1 : 0, a -= a > n ? 1 : 0, d = [s, r], i.to = d[0], i.from = d[1], _ = [a, n], o.to = _[0], o.from = _[1], [i, o]))
            }
        }
        var e, r, n, i, o, s, a, u, l, h, c, d, _, p, f, g, y, m, v;
        for (g = function(t) {
            return Y(null != t), function(e, r) {
                var n, i, o;
                return o = t(r, e), n = o[0], i = o[1], [i, n]
            }
        }, i = ["null", "bool", "num", "str", "blob", "ts", "list"], o = {}, h = m = 0, v = i.length; v > m; h = ++m)
            y = i[h], o[y] = h;
        return l = function(t) {
            if (null == t)
                return "null";
            if (Z.is_bool(t))
                return "bool";
            if (null != t.I || Z.is_number(t))
                return "num";
            if (Z.is_string(t))
                return "str";
            if (null != t.B)
                return "blob";
            if (null != t.T)
                return "ts";
            if (Z.is_array(t))
                return "list";
            throw new Error("Unrecognized value " + t)
        }, _ = function(t) {
            return Z.is_number(t) || null != t.I
        }, s = function(t) {
            return null != t.I ? parseInt(t.I) : t
        }, d = function(t, e) {
            var r, n, i;
            for (r = n = 0, i = t.length; i >= 0 ? i > n : n > i; r = i >= 0 ? ++n : --n) {
                if (r >= e.length)
                    return !1;
                if (c(t[r], e[r]))
                    return !0;
                if (c(e[r], t[r]))
                    return !1
            }
            return e.length > t.length
        }, t._is_less_than = c = function(t, e) {
            var r, n;
            if (r = l(t), n = l(e), r !== n)
                return o[r] < o[n];
            if ("null" === r)
                return !1;
            if ("bool" === r)
                return e && !t;
            if ("num" === r)
                return null != t.I && null != e.I ? te.int64_string_less_than(t.I, e.I) : s(t) < s(e);
            if ("str" === r)
                return e > t;
            if ("blob" === r)
                return t.B < e.B;
            if ("ts" === r)
                return parseInt(t.T, 10) < parseInt(e.T, 10);
            if ("list" === r)
                return d(t, e);
            throw new Error("unknown type " + r)
        }, t._compute_sum = a = function(t, e, r) {
            var n, i, o, s, a, u;
            return n = null != t.I && null != e.I && null != r.I, null != t.I && (t = parseInt(t.I)), null != e.I && (e = parseInt(e.I)), null != r.I && (r = parseInt(r.I)), s = 0x8000000000000000, a = 0x10000000000000000, u = 0xfffffffffffff800, i = e - t, o = r + i, n && (o >= s && (o -= u), -s > o && (o += u), o = {I: "" + o}), o
        }, f = function(t, e) {
            return [null, e]
        }, p = function(t) {
            return [t, null]
        }, r = ["P", "D", "LC", "LP", "LI", "LD", "LM"], e = ["LC", "LP", "LI", "LD", "LM"], t.copy = u = function(t) {
            return A.from_array(JSON.parse(JSON.stringify(t)))
        }, n = {"default": function() {
            return "right"
        },remote: function() {
            return "right"
        },local: function() {
            return "left"
        },min: function(t, e) {
            return c(t, e) ? "left" : "right"
        },max: function(t, e) {
            return c(t, e) ? "right" : "left"
        },sum: function() {
            return "right"
        }}, t.prototype.transform = function(t, e, r) {
            var n, i, o, s, u;
            return null == r && (r = null), "sum" === this.rule_name && "P" === t.tag() && "P" === e.tag() && (null == r && (r = {I: "0"}), _(r) && _(t.value) && _(e.value)) ? (o = a(r, t.value, e.value), n = i = A.from_array(["P", o]), [n, i, e.value]) : (s = this._transforms[t.tag()][e.tag()](t, e), u = function() {
                switch (e.tag()) {
                    case "P":
                        return e.value;
                    case "D":
                        return null;
                    default:
                        return {L: !0}
                }
            }(), s.push(u), s)
        }, t
    }(), te.FieldOpTransformer = O, i = function() {
        function t() {
            this._transform_rules = {}, this._default_transformer = new O
        }
        var e, r, i, o, s, a, u, l;
        for (e = {}, l = ["default", "local", "remote", "min", "max", "sum"], a = 0, u = l.length; u > a; a++)
            i = l[a], e[i] = new O(i);
        return s = function(t) {
            return Y(null != t), function(e, r) {
                var n, i, o;
                return o = t(r, e), n = o[0], i = o[1], [i, n]
            }
        }, r = function(t) {
            return t instanceof Array ? t.slice() : t
        }, o = function(t, e) {
            return t.tid === e.tid && t.rowid === e.rowid
        }, t.is_no_op = function(t) {
            var e, r, n;
            if ("U" !== t.tag())
                return !1;
            n = t.updates;
            for (r in n)
                return e = n[r], !1;
            return !0
        }, t.compact = function(t) {
            var e, r, n, i;
            for (e = [], n = 0, i = t.length; i > n; n++)
                r = t[n], this.is_no_op(r) || e.push(r);
            return e
        }, t.prototype.set_field_transformer = function(t, r, n) {
            var i;
            return null == (i = this._transform_rules)[t] && (i[t] = {}), this._transform_rules[t][r] = e[n]
        }, t.prototype.get_field_transformer = function(t, r) {
            var n;
            return t in this._transform_rules ? null != (n = this._transform_rules[t][r]) ? n : this._default_transformer : e["default"]
        }, t.prototype.transform_ii = function(t, e) {
            var i, s, a;
            return o(t, e) ? (i = function(t) {
                var e, i, o, s, a;
                o = {}, a = t.fields;
                for (i in a)
                    s = a[i], o[i] = A.from_array(["P", r(s)]);
                return e = n.from_array(["U", t.tid, t.rowid, o]), e.undo_extra = {}, e
            }, s = i(t), a = i(e), this.transform_uu(s, a)) : [[t], [e]]
        }, t.prototype.transform_iu = function(t, e) {
            return o(t, e) ? Y(!1, "Couldn't have updated a row that hasn't been inserted yet!") : [[t], [e]]
        }, t.prototype.transform_id = function(t, e) {
            return o(t, e) ? Y(!1, "Couldn't have deleted a row that hasn't been inserted yet!") : [[t], [e]]
        }, t.prototype.transform_ui = s(t.prototype.transform_iu), t.prototype.transform_uu = function(t, e) {
            var r, i, s, a, u, l, h, c, d, _, p, f, g, y, m, v, w, b, D;
            if (!o(t, e))
                return [[t], [e]];
            y = [{}, {}], d = y[0], _ = y[1], c = {}, m = t.updates;
            for (s in m)
                r = m[s], s in e.updates ? (i = e.updates[s], p = null != (w = t.undo_extra[s]) ? w : null, f = this.get_field_transformer(t.tid, s), b = f.transform(r, i, p), a = b[0], u = b[1], g = b[2], null != a && (d[s] = a, c[s] = null != g ? g : null), null != u && (_[s] = u)) : (d[s] = r, c[s] = null != (v = t.undo_extra[s]) ? v : null);
            D = e.updates;
            for (s in D)
                i = D[s], s in t.updates || (_[s] = i);
            return l = n.from_array(["U", t.tid, t.rowid, d]), l.undo_extra = c, h = n.from_array(["U", e.tid, e.rowid, _]), [[l], [h]]
        }, t.prototype.transform_ud = function(t, e) {
            return o(t, e) ? [[], [e]] : [[t], [e]]
        }, t.prototype.transform_di = s(t.prototype.transform_id), t.prototype.transform_du = s(t.prototype.transform_ud), t.prototype.transform_dd = function(t, e) {
            return o(t, e) ? [[], []] : [[t], [e]]
        }, t
    }(), te.ChangeTransformer = i, w = function() {
        function t() {
            this._change_transformer = new i
        }
        return t.prototype.add_resolution_rule = function(t, e, r) {
            return this._change_transformer.set_field_transformer(t, e, r)
        }, t.prototype._transform_one = function(t, e) {
            var r, n, o, s, a;
            return r = function(t) {
                switch (t.tag()) {
                    case "I":
                        return "i";
                    case "U":
                        return "u";
                    case "D":
                        return "d";
                    default:
                        throw new Error("unrecognized op type " + t.tag())
                }
            }, s = "transform_" + r(t) + r(e), a = this._change_transformer[s](t, e), n = a[0], o = a[1], n = i.compact(n), o = i.compact(o), [n, o]
        }, t.prototype._transform_list = function(t, e) {
            var r, n, i, o, s, a, u, l, h, c, d, _, p, f;
            if (0 === t.length)
                return [[], e];
            if (0 === e.length)
                return [t, []];
            for (r = t[0], n = e[0], _ = this._transform_one(r, n), o = _[0], s = _[1], p = this._transform_list(t.slice(1), s), i = p[0], s = p[1], l = 0, c = i.length; c > l; l++)
                a = i[l], o.push(a);
            for (f = this._transform_list(o, e.slice(1)), o = f[0], u = f[1], h = 0, d = u.length; d > h; h++)
                a = u[h], s.push(a);
            return [o, s]
        }, t.prototype._resolve = function(t, e) {
            var r, n, i, o, s, a, u;
            for (o = e.slice(), n = [], s = 0, a = t.length; a > s; s++)
                i = t[s], u = this._transform_list(i, o), r = u[0], o = u[1], n.push(r);
            return [n, o]
        }, t.prototype.resolve = function(t, e) {
            var r, i, o, s, a, u, l, h, c, d, _, p, f, g, y, m, v, w, b, D, S, E, I, A, O, R, T, x, C, U, k;
            for (d = [], y = 0, b = t.length; b > y; y++) {
                for (h = t[y], i = [], C = h.changes, c = m = 0, D = C.length; D > m; c = ++m)
                    s = C[c], u = n.from_array(JSON.parse(JSON.stringify(s))), u.undo_extra = te.clone(h.undo_extras[c]), i.push(u);
                d.push(i)
            }
            for (f = [], v = 0, S = e.length; S > v; v++)
                for (h = e[v], U = h.changes, w = 0, E = U.length; E > w; w++)
                    o = U[w], f.push(o);
            for (k = this._resolve(d, f), _ = k[0], l = k[1], p = [], c = R = 0, I = _.length; I > R; c = ++R) {
                for (a = _[c], g = function() {
                    var t, e, r;
                    for (r = [], e = 0, t = a.length; t > e; e++)
                        s = a[e], r.push(null);
                    return r
                }(), T = 0, A = a.length; A > T; T++)
                    s = a[T], delete s.undo_extra;
                a.length > 0 && p.push(new P(a, g))
            }
            for (r = {}, x = 0, O = l.length; O > x; x++)
                o = l[x], o.tid in r || (r[o.tid] = {}), r[o.tid][o.rowid] = !0;
            return {rebased_deltas: p,affected_records: r}
        }, t
    }(), te.DefaultResolver = w, J = function() {
        function t() {
            this._waiting = [], this._running = !1
        }
        return t.prototype._run_next = function() {
            var t;
            this._running || this._waiting.length > 0 && (t = this._waiting[0], this._waiting.shift(), this._running = !0, t())
        }, t.prototype.request = function(t) {
            return this._waiting.push(t), this._run_next()
        }, t.prototype.finish = function() {
            return this._running = !1, setTimeout(this._run_next.bind(this), 0)
        }, t
    }(), o = function() {
        function t(t) {
            this.consumer = t, this.items = [], this.sync_queue = new J
        }
        return t.prototype.consume = function() {
            var t = this;
            return this.sync_queue.request(function() {
                var e;
                return 0 === t.items.length ? t.sync_queue.finish() : (e = t.items.shift(), t.consumer(e, function(e) {
                    if (e)
                        throw e;
                    return t.sync_queue.finish(), t.consume()
                }))
            })
        }, t.prototype.push = function(t) {
            return this.items.push(t), this.consume()
        }, t.prototype.run = function() {
            return this.consume()
        }, t
    }(), te.clone = function(t) {
        var e, r, n, i, o, s, a;
        if (t instanceof Array) {
            for (a = [], o = 0, s = t.length; s > o; o++)
                e = t[o], a.push(te.clone(e));
            return a
        }
        if (null != t && "object" == typeof t) {
            n = {};
            for (r in t)
                i = t[r], n[r] = te.clone(i);
            return n
        }
        return t
    }, te.WEB64_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_", te.randomElement = function(t) {
        return t[Math.floor(Math.random() * t.length)]
    }, te.randomWeb64String = function(t) {
        var e;
        return function() {
            var r, n;
            for (n = [], e = r = 0; t >= 0 ? t > r : r > t; e = t >= 0 ? ++r : --r)
                n.push(te.randomElement(te.WEB64_ALPHABET));
            return n
        }().join("")
    }, te.uint8ArrayFromBase64String = function(t) {
        var e, r, n, i, o;
        for (t = t.replace(/-/g, "+").replace(/_/g, "/"), e = S.Util.atob(t), n = e.length, i = new Uint8Array(n), r = o = 0; n >= 0 ? n > o : o > n; r = n >= 0 ? ++o : --o)
            i[r] = e.charCodeAt(r);
        return i
    }, te.dbase64FromBase64 = function(t) {
        return t.replace(/[+]/g, "-").replace(/[/]/g, "_").replace(/[\=]+$/g, "")
    }, te.base64StringFromUint8Array = function(t) {
        var e, r, n, i, o;
        for (r = "", i = 0, o = t.length; o > i; i++)
            e = t[i], r += String.fromCharCode(e);
        return n = S.Util.btoa(r), te.dbase64FromBase64(n)
    }, te.INT64_TAG = "dbxInt64", te.isInt64 = function(t) {
        var e;
        return t && "object" == typeof t && t.constructor === Number && isFinite(t) ? (e = t[te.INT64_TAG], !Z.is_string(e) || "0" !== e && !te.nonzero_int64_approximate_regex.test(e) ? !1 : !0) : !1
    }, te.validateInt64 = function(t) {
        var e, r;
        if (!t && "object" == typeof t && t.constructor === Number && isFinite(t))
            throw new Error("Not a finite boxed number: " + t);
        if (r = t[te.INT64_TAG], !Z.is_string(r) || "0" !== r && !te.nonzero_int64_approximate_regex.test(r))
            throw new Error("Missing or invalid tag in int64: " + r);
        if (e = parseInt(r, 10), e !== Number(t))
            throw new Error("Tag in int64 does not match value " + Number(t) + ": " + r);
        return t
    }, te.toDsValue = function(t, e) {
        var r, n;
        if (null == e && (e = !0), null === t || "undefined" == typeof t)
            throw new Error("Bad value: " + t);
        if (Z.is_string(t))
            return t;
        if (Z.is_bool(t))
            return t;
        if (Z.is_number(t)) {
            if (null != t[te.INT64_TAG])
                return te.validateInt64(t), {I: t[te.INT64_TAG]};
            if (isFinite(t))
                return t;
            if (isNaN(t))
                return {N: "nan"};
            if (1 / 0 === Number(t))
                return {N: "+inf"};
            if (Number(t) === -1 / 0)
                return {N: "-inf"};
            throw new Error("Unexpected number: " + t)
        }
        if (Z.is_array(t)) {
            if (e)
                return function() {
                    var e, r, i;
                    for (i = [], e = 0, r = t.length; r > e; e++)
                        n = t[e], i.push(te.toDsValue(n, !1));
                    return i
                }();
            throw new Error("Nested array not allowed: " + JSON.stringify(t))
        }
        if (Z.is_date(t))
            return r = Math.round(t.getTime()), {T: "" + r};
        if (Z.isUint8Array(t))
            return {B: te.base64StringFromUint8Array(t)};
        throw new Error("Unexpected value: " + Z.safe_to_string(t))
    }, te.fromDsValue = function(t, e, r, n) {
        if (Z.is_string(n))
            return n;
        if (Z.is_bool(n))
            return n;
        if (Z.is_number(n))
            return n;
        if (Z.is_array(n))
            return new S.Datastore.List(t, e, r);
        if ("object" != typeof n)
            throw new Error("Unexpected value: " + n);
        if (null != n.I)
            return S.Datastore.int64(n.I);
        if (null == n.N) {
            if (null != n.B)
                return te.uint8ArrayFromBase64String(n.B);
            if (null != n.T)
                return new Date(parseInt(n.T, 10));
            throw new Error("Unexpected object: " + JSON.stringify(n))
        }
        switch (n.N) {
            case "nan":
                return 0 / 0;
            case "+inf":
                return 1 / 0;
            case "-inf":
                return -1 / 0;
            default:
                throw new Error("Unexpected object: " + JSON.stringify(n))
        }
    }, te.matchDsValues = function(t, e) {
        var r, n, i, o, s;
        n = function(t, e) {
            if (null == t)
                throw new Error("Unexpected object: " + t);
            return null == e ? !1 : r(t, e)
        }, r = function(t, e) {
            var r, i, o, s, a, u;
            if (te.toDsValue(t), Z.is_string(t) && Z.is_string(e))
                return String(t) === String(e);
            if (Z.is_bool(t) && Z.is_bool(e))
                return "object" == typeof t && (t = t.valueOf()), "object" == typeof e && (e = e.valueOf()), Boolean(t) === Boolean(e);
            if (Z.is_number(t) && (Z.is_number(e) || null != e.N || null != e.I))
                return e = te.fromDsValue(void 0, void 0, void 0, e), t[te.INT64_TAG] && e[te.INT64_TAG] ? (s = [S.Datastore.int64(t), S.Datastore.int64(e)], t = s[0], e = s[1], String(t[te.INT64_TAG]) === String(e[te.INT64_TAG])) : isNaN(t) && isNaN(e) ? !0 : Number(t) === Number(e);
            if (Z.is_array(t) && Z.is_array(e)) {
                if (t.length !== e.length)
                    return !1;
                for (r = i = 0, a = t.length - 1; a >= 0 ? a >= i : i >= a; r = a >= 0 ? ++i : --i)
                    if (!n(t[r], e[r]))
                        return !1;
                return !0
            }
            if (Z.is_date(t) && (Z.is_date(e) || null != e.T))
                return null != e.T && (e = te.fromDsValue(void 0, void 0, void 0, e)), t - 0 === e - 0;
            if (Z.isUint8Array(t) && (Z.isUint8Array(e) || null != e.B)) {
                if (null != e.B && (e = te.fromDsValue(void 0, void 0, void 0, e)), t.length !== e.length)
                    return !1;
                for (r = o = 0, u = t.length - 1; u >= 0 ? u >= o : o >= u; r = u >= 0 ? ++o : --o)
                    if (t[r] !== e[r])
                        return !1;
                return !0
            }
            return !1
        };
        for (i in t)
            if (s = t[i], o = n(s, e[i]), !o)
                return o;
        return !0
    }, V = function() {
        function t(t) {
            this._datastore = t, this._cache = {}
        }
        return t.prototype.get = function(t, e) {
            return null == this._cache[t] ? null : this._cache[t][e]
        }, t.prototype.getOrCreate = function(t, e) {
            var r;
            return null == this._cache[t] && (this._cache[t] = {}), r = this._cache[t][e], null == r && (r = this._cache[t][e] = new S.Datastore.Record(this._datastore, t, e)), r
        }, t.prototype.remove = function(t, e) {
            return delete this._cache[t][e], Z.is_empty(this._cache[t]) && delete this._cache[t], void 0
        }, t
    }(), E = function() {
        function t() {
            this._registered_handlers = []
        }
        return t.prototype.register = function(t, e) {
            return t.addListener(e), this._registered_handlers.push([t, e]), void 0
        }, t.prototype.unregister_all = function() {
            var t, e, r, n, i, o;
            for (i = this._registered_handlers, r = 0, n = i.length; n > r; r++)
                o = i[r], e = o[0], t = o[1], e.removeListener(t);
            return void 0
        }, t
    }(), S.Datastore.DatastoreInfo = function() {
        function t(t, e, r, n) {
            this._dsid = t, this._handle = e, this._info_record_data = r, this._role = n
        }
        return t.prototype.toString = function() {
            return "Datastore.DatastoreInfo(" + this._dsid + " " + JSON.stringify(this._info_record_data || {}) + " " + this.getEffectiveRole() + ")"
        }, t.prototype.getId = function() {
            return this._dsid
        }, t.prototype.isShareable = function() {
            return "." === this._dsid[0]
        }, t.prototype.getHandle = function() {
            return this._handle
        }, t.prototype.getTitle = function() {
            var t;
            return null == (null != (t = this._info_record_data) ? t.title : void 0) ? null : this._info_record_data.title
        }, t.prototype.getModifiedTime = function() {
            var t;
            return null == (null != (t = this._info_record_data) ? t.mtime : void 0) ? null : this._info_record_data.mtime
        }, t.prototype.getEffectiveRole = function() {
            return this.isShareable() && null != this._role ? S.Datastore._roleFromInt(this._role) : S.Datastore.OWNER
        }, t.prototype.isWritable = function() {
            var t;
            return t = this.getEffectiveRole(), t === S.Datastore.OWNER || t === S.Datastore.EDITOR
        }, t
    }(), S.Datastore.DatastoreListChanged = function() {
        function t(t) {
            this._dsinfos = t
        }
        return t.prototype.toString = function() {
            return "Datastore.DatastoreListChanged(" + this._dsinfos.length + " datastores)"
        }, t.prototype.getDatastoreInfos = function() {
            return this._dsinfos
        }, t
    }(), S.Datastore.impl.EventSourceWithInitialData = function(t) {
        function e(t) {
            this.options = t, e.__super__.constructor.call(this, t), this._have_event = !1, this._last_event = null, this._listenersChanged = new S.Util.EventSource
        }
        return ie(e, t), e.prototype._clearLastEvent = function() {
            return this._have_event = !1, this._last_event = null
        }, e.prototype.addListener = function(t) {
            var r;
            return r = e.__super__.addListener.call(this, t), this._have_event && t(this._last_event), this._listenersChanged.dispatch(this._listeners), r
        }, e.prototype.removeListener = function(t) {
            var r;
            return r = e.__super__.removeListener.call(this, t), this._listenersChanged.dispatch(this._listeners), r
        }, e.prototype.dispatch = function(t) {
            return this._last_event = t, this._have_event = !0, e.__super__.dispatch.call(this, t)
        }, e
    }(S.Util.EventSource), a = "default", S.Datastore.DatastoreManager = function() {
        function t(t) {
            var e = this;
            if (!t.isAuthenticated())
                throw new Error("DatastoreManager requires an authenticated Dropbox.Client!");
            this.datastoreListChanged = new S.Datastore.impl.EventSourceWithInitialData, this._flob_client = new R(t), this._lastListDsServerResponse = null, this._obj_manager = new z(new I(this._flob_client), this._flob_client, function(t) {
                return e._handleRemoteDslistUpdate(t)
            }, function() {
                return e._handleLocalDslistUpdate()
            })
        }
        return t.prototype.datastoreListChanged = null, t.prototype.close = function() {
            return this._obj_manager.destroy()
        }, t.prototype.toString = function() {
            return "Datastore.DatastoreManager()"
        }, t.prototype._dispatchDslistEvent = function() {
            var t;
            return t = this._lastListDsServerResponse || new k({datastores: [],token: "dummy"}), this.datastoreListChanged.dispatch(new S.Datastore.DatastoreListChanged(this._getOverlaidDatastoreInfosFromListResponse(t))), void 0
        }, t.prototype._handleLocalDslistUpdate = function() {
            return this._dispatchDslistEvent(), void 0
        }, t.prototype._handleRemoteDslistUpdate = function(t) {
            return this._lastListDsServerResponse = t, this._dispatchDslistEvent(), void 0
        }, t.prototype._getOverlaidDatastoreInfo = function(t, e) {
            var r, n, i, o, s, a, u, l, h;
            r = this._obj_manager.getCachedDatastore(t), s = (null != e ? e.info : void 0) || {}, o = null == r ? te.clone(s) : null == e || e.rev < r.sync_state.get_server_rev() ? r.datastore_model.getLocalInfoData() : r.datastore_model.updateDatastoreInfo(s);
            for (n in o)
                l = o[n], o[n] = Z.is_array(l) ? function() {
                    var t, e, r;
                    for (r = [], t = 0, e = l.length; e > t; t++)
                        u = l[t], r.push(te.fromDsValue(null, null, null, u));
                    return r
                }() : te.fromDsValue(null, null, null, l);
            return Z.is_empty(o) && (o = null), i = null != (null != e ? e.handle : void 0) ? e.handle : r.get_handle(), a = null != (h = null != e ? e.role : void 0) ? h : te.ROLE_OWNER, new S.Datastore.DatastoreInfo(t, i, o, a)
        }, t.prototype._getOverlaidDatastoreInfosFromListResponse = function(t) {
            var e, r, n, i, o, s, a, u, l, h, c;
            for (k.Type(t), e = this._obj_manager.getAllCachedUndeletedDatastoreIDs(), s = {}, a = 0, l = e.length; l > a; a++)
                i = e[a], s[i] = null;
            for (c = t.datastores, u = 0, h = c.length; h > u; u++)
                n = c[u], s[n.dsid] = n;
            return function() {
                var t;
                t = [];
                for (o in s)
                    r = s[o], t.push(this._getOverlaidDatastoreInfo(o, r));
                return t
            }.call(this)
        }, t.prototype._wrapDatastore = function(t, e) {
            return e && (t._update_mtime(), t.sync()), new S.Datastore(this, t)
        }, t.prototype._getOrCreateDatastoreByDsid = function(t, e) {
            var r = this;
            return this._flob_client.get_or_create_db(t, function(n, i) {
                return null != n ? e(n) : null == i.handle ? e(new Error("get_or_create_datastore failed for " + t)) : r._obj_manager.open(t, i.handle, function(t, n) {
                    return null != t ? e(t) : e(null, r._wrapDatastore(n, i.created))
                })
            }), void 0
        }, t.prototype._createDatastore = function(t, e, r) {
            var n = this;
            return this._flob_client.create_db(t, e, function(e, i) {
                return null != e ? r(e) : null == i.handle ? r(new Error("create_datastore failed for " + t)) : n._obj_manager.open(t, i.handle, function(t, e) {
                    return null != t ? r(t) : r(null, n._wrapDatastore(e, i.created))
                })
            }), void 0
        }, t.prototype._getExistingDatastoreByDsid = function(t, e) {
            var r = this;
            return this._flob_client.get_db(t, function(n, i) {
                return null != n ? e(n) : null == i.handle ? e(new Error("Datastore " + t + " not found or not accessible")) : r._obj_manager.open(t, i.handle, function(t, n) {
                    return null != t ? e(t) : e(null, new S.Datastore(r, n))
                })
            }), void 0
        }, t.prototype.openDefaultDatastore = function(t) {
            return this._getOrCreateDatastoreByDsid(a, t), void 0
        }, t.prototype.openOrCreateDatastore = function(t, e) {
            return this._getOrCreateDatastoreByDsid(t, e), void 0
        }, t.prototype.openDatastore = function(t, e) {
            return this._getExistingDatastoreByDsid(t, e), void 0
        }, t.prototype.createDatastore = function(t) {
            var e, r;
            return r = te.randomWeb64String(Math.ceil(256 / 6)), e = "." + te.dbase64FromBase64(S.Util.sha256(r)), this._createDatastore(e, r, t), void 0
        }, t.prototype.deleteDatastore = function(t, e) {
            var r = this;
            return this._flob_client.get_db(t, function(n, i) {
                return null != n ? e(n) : null == i.handle ? e(new Error("Datastore " + t + " not found or not accessible")) : r._flob_client.delete_db(i.handle, function(t) {
                    return null != t ? e(t) : e(null)
                })
            }), void 0
        }, t.prototype.listDatastores = function(t) {
            var e = this;
            return null != this._lastListDsServerResponse ? t(null, this._getOverlaidDatastoreInfosFromListResponse(this._lastListDsServerResponse)) : (this._flob_client.list_dbs(function(r, n) {
                return null != r ? t(r) : t(null, e._getOverlaidDatastoreInfosFromListResponse(n))
            }), void 0)
        }, t
    }(), S.Datastore.List = function() {
        function t(t, e, r) {
            this._datastore = t, this._record = e, this._field = r
        }
        return t.BASE_ITEM_SIZE = 20, t.prototype.toString = function() {
            return "Datastore.List((" + this._record._tid + ", " + this._record._rid + ", " + this._field + "): " + JSON.stringify(this._array) + ")"
        }, t.prototype._array = function() {
            return this._record._rawFieldValues()[this._field]
        }, t.prototype._checkValid = function() {
            if (this._record._checkNotDeleted(), !Z.is_array(this._array()))
                throw new Error("Attempt to operate on deleted list (" + this._record._tid + ", " + this._record._rid + ", " + this._field + ")")
        }, t.prototype._storeUpdate = function(t) {
            var e;
            return e = {}, e[this._field] = t, this._record._storeUpdate(e), void 0
        }, t.prototype._fixInsertionIndex = function(t) {
            var e, r;
            if (!Z.is_json_number(t))
                throw new RangeError("Index not a number: " + t);
            if (e = this._array().length, r = t >= 0 ? t : e + t, r >= 0 && e >= r)
                return r;
            throw new RangeError("Bad index for list of length " + e + ": " + t)
        }, t.prototype._fixIndex = function(t) {
            var e, r;
            if (r = this._fixInsertionIndex(t), e = this._array().length, e > r)
                return r;
            throw new RangeError("Bad index for list of length " + e + ": " + t)
        }, t.prototype.get = function(t) {
            var e;
            return this._checkValid(), e = te.clone(this._array()[this._fixIndex(t)]), te.fromDsValue(void 0, void 0, void 0, e)
        }, t.prototype.set = function(t, e) {
            return this._checkValid(), t = this._fixIndex(t), this._storeUpdate(["LP", t, te.toDsValue(e, !1)]), void 0
        }, t.prototype.length = function() {
            return this._checkValid(), this._array().length
        }, t.prototype.pop = function() {
            if (this._checkValid(), 0 === this._array().length)
                throw new Error("List is empty");
            return this.remove(this._array.length - 1)
        }, t.prototype.push = function(t) {
            return this._checkValid(), this.insert(this._array().length, t), void 0
        }, t.prototype.shift = function() {
            if (this._checkValid(), 0 === this._array().length)
                throw new Error("List is empty");
            return this.remove(0)
        }, t.prototype.unshift = function(t) {
            return this.insert(0, t), void 0
        }, t.prototype.splice = function() {
            var t, e, r, n, i, o, s, a, u;
            if (n = arguments[0], e = arguments[1], t = 3 <= arguments.length ? oe.call(arguments, 2) : [], this._checkValid(), !Z.is_json_number(e) || 0 > e)
                throw new RangeError("Bad second arg to splice: " + n + ", " + e);
            for (n = this._fixInsertionIndex(n), i = this.slice(n, n + e), r = s = 0; e >= 0 ? e > s : s > e; r = e >= 0 ? ++s : --s)
                this.remove(n);
            for (a = 0, u = t.length; u > a; a++)
                o = t[a], this.insert(n, o), n++;
            return i
        }, t.prototype.move = function(t, e) {
            return this._checkValid(), t = this._fixIndex(t), e = this._fixIndex(e), t === e ? void 0 : (this._storeUpdate(["LM", t, e]), void 0)
        }, t.prototype.remove = function(t) {
            var e;
            return this._checkValid(), t = this._fixIndex(t), e = this.get(t), this._storeUpdate(["LD", t]), e
        }, t.prototype.insert = function(t, e) {
            return this._checkValid(), t = this._fixInsertionIndex(t), this._storeUpdate(["LI", t, te.toDsValue(e, !1)]), void 0
        }, t.prototype.slice = function(t, e) {
            var r;
            return this._checkValid(), function() {
                var n, i, o, s;
                for (o = this._array().slice(t, e), s = [], n = 0, i = o.length; i > n; n++)
                    r = o[n], s.push(te.fromDsValue(void 0, void 0, void 0, r));
                return s
            }.call(this)
        }, t.prototype.toArray = function() {
            var t;
            return this._checkValid(), function() {
                var e, r, n, i;
                for (n = this._array().slice(), i = [], e = 0, r = n.length; r > e; e++)
                    t = n[e], i.push(te.fromDsValue(void 0, void 0, void 0, t));
                return i
            }.call(this)
        }, t
    }(), S.Datastore.Record = function() {
        function t(t, e, r) {
            this._datastore = t, this._tid = e, this._rid = r, this._deleted = !1, this._record_cache = this._datastore._record_cache, this._managed_datastore = this._datastore._managed_datastore
        }
        return t.RECORD_SIZE_LIMIT = 102400, t.BASE_RECORD_SIZE = 100, t.BASE_FIELD_SIZE = 100, t.prototype.get = function(t) {
            var e;
            return this._checkNotDeleted(), e = this._rawFieldValues(), t in e ? te.fromDsValue(this._datastore, this, t, e[t]) : null
        }, t.prototype.set = function(t, e) {
            var r;
            return r = {}, r[t] = e, this.update(r)
        }, t.prototype.getOrCreateList = function(t) {
            var e, r;
            if (this._checkNotDeleted(), r = this._rawFieldValues(), null == r[t])
                e = {}, e[t] = ["LC"], this._storeUpdate(e), r = this._rawFieldValues();
            else if (!Z.is_array(r[t]))
                throw new Error("Can't call getOrCreateList on field " + t + " for record (" + this.tid + ", " + this.rid + "): existing value " + r[t] + " is not a list");
            return te.fromDsValue(this._datastore, this, t, r[t])
        }, t.prototype.getFields = function() {
            var t, e, r, n;
            this._checkNotDeleted(), t = {}, n = this._rawFieldValues();
            for (e in n)
                r = n[e], t[e] = te.fromDsValue(this._datastore, this, e, r);
            return t
        }, t.prototype.getSize = function() {
            return this._managed_datastore.get_record_size(this._tid, this._rid)
        }, t.prototype.update = function(t) {
            var e, r, n;
            this._datastore._checkWritable(), this._checkNotDeleted(), e = {};
            for (r in t)
                n = t[r], null != n ? e[r] = ["P", te.toDsValue(n)] : null != this.get(r) && (e[r] = ["D"]);
            return Z.is_empty(e) || this._storeUpdate(e), this
        }, t.prototype.deleteRecord = function() {
            var t;
            return this._datastore._checkWritable(), this._checkNotDeleted(), this._deleted = !0, this._record_cache.remove(this._tid, this._rid), t = n.from_array(["D", this._tid, this._rid]), this._managed_datastore.perform_local_change(t), this._datastore._recordsChangedLocally([this]), this
        }, t.prototype.has = function(t) {
            var e;
            return this._checkNotDeleted(), e = this._rawFieldValues(), t in e
        }, t.prototype.getId = function() {
            return this._rid
        }, t.prototype.getTable = function() {
            return this._datastore.getTable(this._tid)
        }, t.prototype.isDeleted = function() {
            return this._deleted
        }, t.prototype.toString = function() {
            var t;
            return t = this.isDeleted() ? "deleted" : JSON.stringify(this.getFields()), "Datastore.Record((" + this._tid + ", " + this._rid + "): " + t + ")"
        }, t.prototype._rawFieldValues = function() {
            return this._managed_datastore.query(this._tid, this._rid)
        }, t.prototype._storeUpdate = function(t) {
            var e;
            e = n.from_array(["U", this._tid, this._rid, t]), this._managed_datastore.perform_local_change(e), this._datastore._recordsChangedLocally([this])
        }, t.isValidId = function(t) {
            var e;
            return e = new RegExp(Z.SS_ID_REGEX), Z.is_string(t) && e.test(t)
        }, t.prototype._checkNotDeleted = function() {
            if (this._deleted)
                throw new Error("Attempt to operate on deleted record (" + this._tid + ", " + this._rid + ")")
        }, t
    }(), S.Datastore.RecordsChanged = function() {
        function t(t, e) {
            this._recordsByTable = t, this._local = e
        }
        return t.prototype.toString = function() {
            var t, e, r, n, i, o, s;
            i = 0, r = 0, s = this._recordsByTable;
            for (o in s)
                t = s[o], i += 1, r += t.length;
            return n = "" + i + " " + (1 === i ? "table" : "tables"), e = "" + r + " " + (1 === r ? "record" : "records"), "Datastore.RecordsChanged(" + e + " in " + n + " changed " + (this._local ? "locally" : "remotely") + ")"
        }, t._fromRecordList = function(e, r) {
            var n, i, o, s, a;
            for (i = {}, s = 0, a = e.length; a > s; s++)
                n = e[s], o = n._tid, null == i[o] && (i[o] = []), i[o].push(n);
            return new t(i, r)
        }, t.prototype.affectedRecordsByTable = function() {
            return this._recordsByTable
        }, t.prototype.affectedRecordsForTable = function(t) {
            var e;
            return null != (e = this._recordsByTable[t]) ? e : []
        }, t.prototype.isLocal = function() {
            return this._local
        }, t
    }(), q = S.Datastore.RecordsChanged, S.Datastore.Table = function() {
        function t(t, e) {
            this._datastore = t, this._tid = e, this._record_cache = this._datastore._record_cache, this._managed_datastore = this._datastore._managed_datastore
        }
        return t.prototype.getId = function() {
            return this._tid
        }, t.prototype.get = function(t) {
            var e, r;
            if (!S.Datastore.Record.isValidId(t))
                throw new Error("Invalid record ID: " + t);
            return r = this._record_cache.get(this._tid, t), null != r ? (Y(!r._deleted), r) : (e = this._managed_datastore.query(this._tid, t), null == e ? null : this._record_cache.getOrCreate(this._tid, t))
        }, t.prototype.getOrInsert = function(t, e) {
            var r;
            return this._datastore._checkWritable(), r = this.get(t), r ? r : this._insertWithId(t, e)
        }, t.prototype.insert = function(t) {
            var e;
            return this._datastore._checkWritable(), e = this._datastore._generateRid(), Y(null == this.get(e)), this._insertWithId(e, t)
        }, t.prototype.query = function(t) {
            var e, r, n, i, o, s, a;
            for (o = this._managed_datastore.list_rows_for_table(this._tid), n = [], s = 0, a = o.length; a > s; s++)
                i = o[s], e = this._managed_datastore.query(this._tid, i), (null == t || te.matchDsValues(t, e)) && (r = this.get(i), Y(null != r), n.push(r));
            return n
        }, t.prototype.setResolutionRule = function(t, e) {
            if ("remote" !== e && "local" !== e && "min" !== e && "max" !== e && "sum" !== e)
                throw new Error("" + e + " is not a valid resolution rule. Valid rules are 'remote', 'local', 'min', 'max', and 'sum'.");
            return this._managed_datastore.resolver.add_resolution_rule(this._tid, t, e), this
        }, t.isValidId = function(t) {
            var e;
            return e = new RegExp(Z.SS_ID_REGEX), Z.is_string(t) && e.test(t)
        }, t.prototype.toString = function() {
            return "Datastore.Table(" + this._tid + ")"
        }, t.prototype._insertWithId = function(t, e) {
            var r, i, o, s, a;
            i = {};
            for (o in e)
                a = e[o], i[o] = te.toDsValue(a);
            return r = n.from_array(["I", this._tid, t, i]), this._managed_datastore.perform_local_change(r), s = this._record_cache.getOrCreate(this._tid, t), this._datastore._recordsChangedLocally([s]), s
        }, t
    }(), S.File.ShareUrl = function() {
        function t(t, e) {
            this.url = t.url, this.expiresAt = S.Util.parseDate(t.expires), this.isDirect = e === !0 ? !0 : e === !1 ? !1 : "direct" in t ? t.direct : Date.now() - this.expiresAt <= 864e5, this.isPreview = !this.isDirect, this._json = null
        }
        return t.parse = function(t, e) {
            return t && "object" == typeof t ? new S.File.ShareUrl(t, e) : t
        }, t.prototype.url = null, t.prototype.expiresAt = null, t.prototype.isDirect = null, t.prototype.isPreview = null, t.prototype.json = function() {
            return this._json || (this._json = {url: this.url,expires: this.expiresAt.toUTCString(),direct: this.isDirect})
        }, t
    }(), S.File.CopyReference = function() {
        function t(t) {
            "object" == typeof t ? (this.tag = t.copy_ref, this.expiresAt = S.Util.parseDate(t.expires), this._json = t) : (this.tag = t, this.expiresAt = new Date(1e3 * Math.ceil(Date.now() / 1e3)), this._json = null)
        }
        return t.parse = function(t) {
            return !t || "object" != typeof t && "string" != typeof t ? t : new S.File.CopyReference(t)
        }, t.prototype.tag = null, t.prototype.expiresAt = null, t.prototype.json = function() {
            return this._json || (this._json = {copy_ref: this.tag,expires: this.expiresAt.toUTCString()})
        }, t
    }(), S.File.Stat = function() {
        function t(t) {
            var e, r, n, i;
            switch (this._json = t, this.path = t.path, "/" !== this.path.substring(0, 1) && (this.path = "/" + this.path), e = this.path.length - 1, e >= 0 && "/" === this.path.substring(e) && (this.path = this.path.substring(0, e)), r = this.path.lastIndexOf("/"), this.name = this.path.substring(r + 1), this.isFolder = t.is_dir || !1, this.isFile = !this.isFolder, this.isRemoved = t.is_deleted || !1, this.typeIcon = t.icon, this.modifiedAt = (null != (n = t.modified) ? n.length : void 0) ? S.Util.parseDate(t.modified) : null, this.clientModifiedAt = (null != (i = t.client_mtime) ? i.length : void 0) ? S.Util.parseDate(t.client_mtime) : null, t.root) {
                case "dropbox":
                    this.inAppFolder = !1;
                    break;
                case "app_folder":
                    this.inAppFolder = !0;
                    break;
                default:
                    this.inAppFolder = null
            }
            this.size = t.bytes || 0, this.humanSize = t.size || "", this.hasThumbnail = t.thumb_exists || !1, this.versionTag = t.rev, this.contentHash = t.hash || null, this.mimeType = this.isFolder ? t.mime_type || "inode/directory" : t.mime_type || "application/octet-stream"
        }
        return t.parse = function(t) {
            return t && "object" == typeof t ? new S.File.Stat(t) : t
        }, t.prototype.path = null, t.prototype.name = null, t.prototype.inAppFolder = null, t.prototype.isFolder = null, t.prototype.isFile = null, t.prototype.isRemoved = null, t.prototype.typeIcon = null, t.prototype.versionTag = null, t.prototype.contentHash = null, t.prototype.mimeType = null, t.prototype.size = null, t.prototype.humanSize = null, t.prototype.hasThumbnail = null, t.prototype.modifiedAt = null, t.prototype.clientModifiedAt = null, t.prototype.json = function() {
            return this._json
        }, t
    }(), S.Http.AppInfo = function() {
        function t(t, e) {
            var r;
            this.name = t.name, this._icons = t.icons, r = t.permissions || {}, this.canUseDatastores = !!r.datastores, this.canUseFiles = !!r.files, this.canUseFullDropbox = "full_dropbox" === r.files, this.hasAppFolder = "app_folder" === r.files, this.key = e ? e : t.key || null
        }
        return t.parse = function(t, e) {
            return t ? new S.Http.AppInfo(t, e) : t
        }, t.prototype.name = void 0, t.prototype.key = void 0, t.prototype.canUseDatastores = void 0, t.prototype.canUseFiles = void 0, t.prototype.hasAppFolder = void 0, t.prototype.canUseFullDropbox = void 0, t.prototype.icon = function(t, e) {
            return e || (e = t), this._icons["" + t + "x" + e] || null
        }, t.ICON_SMALL = 64, t.ICON_LARGE = 256, t
    }(), S.Http.PulledChanges = function() {
        function t(t) {
            var e;
            this.blankSlate = t.reset || !1, this.cursorTag = t.cursor, this.shouldPullAgain = t.has_more, this.shouldBackOff = !this.shouldPullAgain, this.changes = t.cursor && t.cursor.length ? function() {
                var r, n, i, o;
                for (i = t.entries, o = [], r = 0, n = i.length; n > r; r++)
                    e = i[r], o.push(S.Http.PulledChange.parse(e));
                return o
            }() : []
        }
        return t.parse = function(t) {
            return t && "object" == typeof t ? new S.Http.PulledChanges(t) : t
        }, t.prototype.blankSlate = void 0, t.prototype.cursorTag = void 0, t.prototype.changes = void 0, t.prototype.shouldPullAgain = void 0, t.prototype.shouldBackOff = void 0, t.prototype.cursor = function() {
            return this.cursorTag
        }, t
    }(), S.Http.PulledChange = function() {
        function t(t) {
            this.path = t[0], this.stat = S.File.Stat.parse(t[1]), this.stat ? this.wasRemoved = !1 : (this.stat = null, this.wasRemoved = !0)
        }
        return t.parse = function(t) {
            return t && "object" == typeof t ? new S.Http.PulledChange(t) : t
        }, t.prototype.path = void 0, t.prototype.wasRemoved = void 0, t.prototype.stat = void 0, t
    }(), S.Http.PollResult = function() {
        function t(t) {
            this.hasChanges = t.changes, this.retryAfter = t.backoff || 0
        }
        return t.parse = function(t) {
            return t ? new S.Http.PollResult(t) : t
        }, t.prototype.hasChanges = void 0, t.prototype.retryAfter = void 0, t
    }(), S.Http.RangeInfo = function() {
        function t(t) {
            var e;
            (e = /^bytes (\d*)-(\d*)\/(.*)$/.exec(t)) ? (this.start = parseInt(e[1]), this.end = parseInt(e[2]), this.size = "*" === e[3] ? null : parseInt(e[3])) : (this.start = 0, this.end = 0, this.size = null)
        }
        return t.parse = function(t) {
            return "string" == typeof t ? new S.Http.RangeInfo(t) : t
        }, t.prototype.start = null, t.prototype.size = null, t.prototype.end = null, t
    }(), S.Http.UploadCursor = function() {
        function t(t) {
            this.replace(t)
        }
        return t.parse = function(t) {
            return !t || "object" != typeof t && "string" != typeof t ? t : new S.Http.UploadCursor(t)
        }, t.prototype.tag = null, t.prototype.offset = null, t.prototype.expiresAt = null, t.prototype.json = function() {
            return this._json || (this._json = {upload_id: this.tag,offset: this.offset,expires: this.expiresAt.toUTCString()})
        }, t.prototype.replace = function(t) {
            return "object" == typeof t ? (this.tag = t.upload_id || null, this.offset = t.offset || 0, this.expiresAt = S.Util.parseDate(t.expires) || Date.now(), this._json = t) : (this.tag = t || null, this.offset = 0, this.expiresAt = new Date(1e3 * Math.floor(Date.now() / 1e3)), this._json = null), this
        }, t
    }(), "function" == typeof S.Env.global.atob && "function" == typeof S.Env.global.btoa ? (S.Util.atob = function(t) {
        return S.Env.global.atob(t)
    }, S.Util.btoa = function(t) {
        return S.Env.global.btoa(t)
    }) : S.Env.global.require && S.Env.global.Buffer ? (S.Util.atob = function(t) {
        var e, r;
        return e = new Buffer(t, "base64"), function() {
            var t, n, i;
            for (i = [], r = t = 0, n = e.length; n >= 0 ? n > t : t > n; r = n >= 0 ? ++t : --t)
                i.push(String.fromCharCode(e[r]));
            return i
        }().join("")
    }, S.Util.btoa = function(t) {
        var e, r;
        return e = new Buffer(function() {
            var e, n, i;
            for (i = [], r = e = 0, n = t.length; n >= 0 ? n > e : e > n; r = n >= 0 ? ++e : --e)
                i.push(t.charCodeAt(r));
            return i
        }()), e.toString("base64")
    }) : !function() {
        var t, e, r;
        return e = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", r = function(t, r, n) {
            var i, o;
            for (o = 3 - r, t <<= 8 * o, i = 3; i >= o; )
                n.push(e.charAt(63 & t >> 6 * i)), i -= 1;
            for (i = r; 3 > i; )
                n.push("="), i += 1;
            return null
        }, t = function(t, e, r) {
            var n, i;
            for (i = 4 - e, t <<= 6 * i, n = 2; n >= i; )
                r.push(String.fromCharCode(255 & t >> 8 * n)), n -= 1;
            return null
        }, S.Util.btoa = function(t) {
            var e, n, i, o, s, a;
            for (o = [], e = 0, n = 0, i = s = 0, a = t.length; a >= 0 ? a > s : s > a; i = a >= 0 ? ++s : --s)
                e = e << 8 | t.charCodeAt(i), n += 1, 3 === n && (r(e, n, o), e = n = 0);
            return n > 0 && r(e, n, o), o.join("")
        }, S.Util.atob = function(r) {
            var n, i, o, s, a, u, l;
            for (a = [], n = 0, o = 0, s = u = 0, l = r.length; (l >= 0 ? l > u : u > l) && (i = r.charAt(s), "=" !== i); s = l >= 0 ? ++u : --u)
                n = n << 6 | e.indexOf(i), o += 1, 4 === o && (t(n, o, a), n = o = 0);
            return o > 0 && t(n, o, a), a.join("")
        }
    }(), function() {
        var t, e, r, n, i, o, s, a, u, l, h;
        if (S.Util.hmac = function(e, n) {
                return t(r(u(e), u(n), e.length, n.length))
            }, S.Util.sha1 = function(e) {
                return t(i(u(e), e.length))
            }, S.Util.sha256 = function(e) {
                return t(o(u(e), e.length))
            }, S.Env.require)
            try {
                e = S.Env.require("crypto"), e.createHmac && e.createHash && (S.Util.hmac = function(t, r) {
                    var n;
                    return n = e.createHmac("sha1", r), n.update(t), n.digest("base64")
                }, S.Util.sha1 = function(t) {
                    var r;
                    return r = e.createHash("sha1"), r.update(t), r.digest("base64")
                }, S.Util.sha256 = function(t) {
                    var r;
                    return r = e.createHash("sha256"), r.update(t), r.digest("base64")
                })
            } catch (c) {
                n = c
            }
        return r = function(t, e, r, n) {
            var o, s, a, u;
            return e.length > 16 && (e = i(e, n)), a = function() {
                var t, r;
                for (r = [], s = t = 0; 16 > t; s = ++t)
                    r.push(909522486 ^ e[s]);
                return r
            }(), u = function() {
                var t, r;
                for (r = [], s = t = 0; 16 > t; s = ++t)
                    r.push(1549556828 ^ e[s]);
                return r
            }(), o = i(a.concat(t), 64 + r), i(u.concat(o), 84)
        }, i = function(t, e) {
            var r, n, i, o, s, a, u, l, h, c, d, _, p, f, g, y, m;
            for (t[e >> 2] |= 1 << 31 - ((3 & e) << 3), t[(e + 8 >> 6 << 4) + 15] = e << 3, g = Array(80), r = 1732584193, i = 4023233417, s = 2562383102, u = 271733878, h = 3285377520, d = 0, p = t.length; p > d; ) {
                for (n = r, o = i, a = s, l = u, c = h, _ = m = 0; 80 > m; _ = ++m)
                    16 > _ ? g[_] = 0 | t[d + _ << 2 >> 2] : (f = (0 | g[_ - 3 << 2 >> 2]) ^ (0 | g[_ - 8 << 2 >> 2]) ^ (0 | g[_ - 14 << 2 >> 2]) ^ (0 | g[_ - 16 << 2 >> 2]), g[_] = f << 1 | f >>> 31), y = 0 | (0 | (r << 5 | r >>> 27) + h) + g[_ << 2 >> 2], y = 20 > _ ? 0 | y + (0 | (i & s | ~i & u) + 1518500249) : 40 > _ ? 0 | y + (0 | (i ^ s ^ u) + 1859775393) : 60 > _ ? 0 | (0 | y + ((i & s | i & u | s & u) - 1894007588)) : 0 | y + (0 | (i ^ s ^ u) - 899497514), h = u, u = s, s = i << 30 | i >>> 2, i = r, r = y;
                r = 0 | n + r, i = 0 | o + i, s = 0 | a + s, u = 0 | l + u, h = 0 | c + h, d = 0 | d + 16
            }
            return [r, i, s, u, h]
        }, o = function(t, e) {
            var r, n, i, o, u, l, h, c, d, _, p, f, g, y, m, v, w, b, D, S, E, I, A, O, R, T, x, C, U, k, L, P;
            for (t[e >> 2] |= 1 << 31 - ((3 & e) << 3), t[(e + 8 >> 6 << 4) + 15] = e << 3, U = Array(80), r = s[0], i = s[1], u = s[2], c = s[3], _ = s[4], f = s[5], y = s[6], S = s[7], I = 0, O = t.length; O > I; ) {
                for (n = r, o = i, l = u, d = c, p = _, g = f, m = y, E = S, A = P = 0; 64 > P; A = ++P)
                    16 > A ? C = U[A] = 0 | t[I + A << 2 >> 2] : (w = 0 | U[A - 15 << 2 >> 2], v = (w << 25 | w >>> 7) ^ (w << 14 | w >>> 18) ^ w >>> 3, D = 0 | U[A - 2 << 2 >> 2], b = (D << 15 | D >>> 17) ^ (D << 13 | D >>> 19) ^ D >>> 10, C = U[A] = 0 | (0 | v + (0 | U[A - 7 << 2 >> 2])) + (0 | b + (0 | U[A - 16 << 2 >> 2]))), h = _ & f ^ ~_ & y, R = r & i ^ r & u ^ i & u, T = (r << 30 | r >>> 2) ^ (r << 19 | r >>> 13) ^ (r << 10 | r >>> 22), x = (_ << 26 | _ >>> 6) ^ (_ << 21 | _ >>> 11) ^ (_ << 7 | _ >>> 25), k = 0 | (0 | (0 | S + x) + (0 | h + C)) + (0 | a[A << 2 >> 2]), L = 0 | T + R, S = y, y = f, f = _, _ = 0 | c + k, c = u, u = i, i = r, r = 0 | k + L;
                r = 0 | n + r, i = 0 | o + i, u = 0 | l + u, c = 0 | d + c, _ = 0 | p + _, f = 0 | g + f, y = 0 | m + y, S = 0 | E + S, I += 16
            }
            return [r, i, u, c, _, f, y, S]
        }, l = function(t) {
            return 0 > t && (t = 4 * (1 << 30) + t), t.toString(16)
        }, s = [], a = [], function() {
            var t, e, r, n, i, o, u;
            for (e = function(t) {
                return 0 | 4294967296 * (t - Math.floor(t))
            }, i = 2, u = [], r = o = 0; 64 > o; r = ++o) {
                for (; ; ) {
                    for (n = !0, t = 2; i >= t * t; ) {
                        if (0 === i % t) {
                            n = !1;
                            break
                        }
                        t += 1
                    }
                    if (n)
                        break;
                    i += 1
                }
                8 > r && (s[r] = e(Math.pow(i, .5))), a[r] = e(Math.pow(i, 1 / 3)), u.push(i += 1)
            }
            return u
        }(), t = function(t) {
            var e, r, n, i, o;
            for (i = "", e = 0, n = 4 * t.length; n > e; )
                r = e, o = (255 & t[r >> 2] >> (3 - (3 & r) << 3)) << 16, r += 1, o |= (255 & t[r >> 2] >> (3 - (3 & r) << 3)) << 8, r += 1, o |= 255 & t[r >> 2] >> (3 - (3 & r) << 3), i += h[63 & o >> 18], i += h[63 & o >> 12], e += 1, i += e >= n ? "=" : h[63 & o >> 6], e += 1, i += e >= n ? "=" : h[63 & o], e += 1;
            return i
        }, h = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", u = function(t) {
            var e, r, n, i, o;
            for (e = [], n = 255, r = i = 0, o = t.length; o >= 0 ? o > i : i > o; r = o >= 0 ? ++i : --i)
                e[r >> 2] |= (t.charCodeAt(r) & n) << (3 - (3 & r) << 3);
            return e
        }
    }(), S.Util.Oauth = function() {
        function t(t) {
            this._id = null, this._secret = null, this._stateParam = null, this._authCode = null, this._token = null, this._tokenKey = null, this._tokenKid = null, this._error = null, this._appHash = null, this._loaded = null, this.setCredentials(t)
        }
        return t.prototype.setCredentials = function(t) {
            if (t.key)
                this._id = t.key;
            else {
                if (!t.token)
                    throw new Error("No API key supplied");
                this._id = null
            }
            return this._secret = t.secret || null, this._appHash = null, this._error = null, this._loaded = !0, this.reset(), t.token ? (this._token = t.token, t.tokenKey && (this._tokenKey = t.tokenKey, this._tokenKid = t.tokenKid)) : t.oauthCode ? this._authCode = t.oauthCode : t.oauthStateParam && (this._stateParam = t.oauthStateParam), this
        }, t.prototype.credentials = function() {
            var t;
            return t = {}, this._id && (t.key = this._id), this._secret && (t.secret = this._secret), null !== this._token ? (t.token = this._token, this._tokenKey && (t.tokenKey = this._tokenKey, t.tokenKid = this._tokenKid)) : null !== this._authCode ? t.oauthCode = this._authCode : null !== this._stateParam && (t.oauthStateParam = this._stateParam), t
        }, t.prototype.step = function() {
            return null !== this._token ? S.Client.DONE : null !== this._authCode ? S.Client.AUTHORIZED : null !== this._stateParam ? this._loaded ? S.Client.PARAM_LOADED : S.Client.PARAM_SET : null !== this._error ? S.Client.ERROR : S.Client.RESET
        }, t.prototype.setAuthStateParam = function(t) {
            if (null === this._id)
                throw new Error("No API key supplied, cannot do authorization");
            return this.reset(), this._loaded = !1, this._stateParam = t, this
        }, t.prototype.checkAuthStateParam = function(t) {
            return this._stateParam === t && null !== this._stateParam
        }, t.prototype.authStateParam = function() {
            return this._stateParam
        }, t.prototype.error = function() {
            return this._error
        }, t.prototype.processRedirectParams = function(t) {
            var e;
            if (t.error) {
                if (null === this._id)
                    throw new Error("No API key supplied, cannot process errors");
                return this.reset(), this._error = new S.AuthError(t), !0
            }
            if (t.code) {
                if (null === this._id)
                    throw new Error("No API key supplied, cannot do Authorization Codes");
                return this.reset(), this._loaded = !1, this._authCode = t.code, !0
            }
            if (e = t.token_type) {
                if (e = e.toLowerCase(), "bearer" !== e && "mac" !== e)
                    throw new Error("Unimplemented token type " + e);
                if (this.reset(), this._loaded = !1, "mac" === e) {
                    if ("hmac-sha-1" !== t.mac_algorithm)
                        throw new Error("Unimplemented MAC algorithms " + t.mac_algorithm);
                    this._tokenKey = t.mac_key, this._tokenKid = t.kid
                }
                return this._token = t.access_token, !0
            }
            return !1
        }, t.prototype.authHeader = function(t, e, r) {
            var n, i;
            return null === this._token ? (i = null === this._secret ? S.Util.btoa("" + this._id + ":") : S.Util.btoa("" + this._id + ":" + this._secret), "Basic " + i) : null === this._tokenKey ? "Bearer " + this._token : (n = this.macParams(t, e, r), "MAC kid=" + n.kid + " ts=" + n.ts + " " + ("access_token=" + this._token + " mac=" + n.mac))
        }, t.prototype.addAuthParams = function(t, e, r) {
            var n;
            return null === this._token ? (r.client_id = this._id, null !== this._secret && (r.client_secret = this._secret)) : (null !== this._tokenKey && (n = this.macParams(t, e, r), r.kid = n.kid, r.ts = n.ts, r.mac = n.mac), r.access_token = this._token), r
        }, t.prototype.authorizeUrlParams = function(t, e) {
            var r;
            if ("token" !== t && "code" !== t)
                throw new Error("Unimplemented /authorize response type " + t);
            return r = {client_id: this._id,state: this._stateParam,response_type: t}, e && (r.redirect_uri = e), r
        }, t.prototype.accessTokenParams = function(t) {
            var e;
            return e = {grant_type: "authorization_code",code: this._authCode}, t && (e.redirect_uri = t), e
        }, t.queryParamsFromUrl = function(t) {
            var e, r, n, i, o, s, a, u, l, h;
            if (i = /^[^?#]+(\?([^\#]*))?(\#(.*))?$/.exec(t), !i)
                return {};
            for (a = i[2] || "", "/" === a.substring(0, 1) && (a = a.substring(1)), e = i[4] || "", r = e.indexOf("?"), -1 !== r && (e = e.substring(r + 1)), "/" === e.substring(0, 1) && (e = e.substring(1)), s = {}, h = a.split("&").concat(e.split("&")), u = 0, l = h.length; l > u; u++)
                n = h[u], o = n.indexOf("="), -1 !== o && (s[decodeURIComponent(n.substring(0, o))] = decodeURIComponent(n.substring(o + 1)));
            return s
        }, t.prototype.macParams = function(t, e, r) {
            var n, i;
            return n = {kid: this._tokenKid,ts: S.Util.Oauth.timestamp()}, i = t.toUpperCase() + "&" + S.Util.Xhr.urlEncodeValue(e) + "&" + S.Util.Xhr.urlEncodeValue(S.Util.Xhr.urlEncode(r)), n.mac = S.Util.hmac(i, this._tokenKey), n
        }, t.prototype.appHash = function() {
            return this._appHash ? this._appHash : this._appHash = S.Util.sha1("oauth2-" + this._id).replace(/[\/+=]/g, "")
        }, t.prototype.reset = function() {
            return this._stateParam = null, this._authCode = null, this._token = null, this._tokenKey = null, this._tokenKid = null, this._error = null, this
        }, t.timestamp = function() {
            return Math.floor(Date.now() / 1e3)
        }, t.randomAuthStateParam = function() {
            return ["oas", Date.now().toString(36), Math.random().toString(36)].join("_")
        }, t
    }(), null == Date.now && (S.Util.Oauth.timestamp = function() {
        return Math.floor((new Date).getTime() / 1e3)
    }), 2274814865e3 === new Date("Fri, 31 Jan 2042 21:01:05 +0000").valueOf() ? S.Util.parseDate = function(t) {
        return new Date(t)
    } : 2274814865e3 === Date.parse("Fri, 31 Jan 2042 21:01:05 +0000") ? S.Util.parseDate = function(t) {
        return new Date(Date.parse(t))
    } : !function() {
        var t, e;
        return e = /^\w+\, (\d+) (\w+) (\d+) (\d+)\:(\d+)\:(\d+) (\+\d+|UTC|GMT)$/, t = {Jan: 0,Feb: 1,Mar: 2,Apr: 3,May: 4,Jun: 5,Jul: 6,Aug: 7,Sep: 8,Oct: 9,Nov: 10,Dec: 11}, S.Util.parseDate = function(r) {
            var n;
            return (n = e.exec(r)) ? new Date(Date.UTC(parseInt(n[3]), t[n[2]], parseInt(n[1]), parseInt(n[4]), parseInt(n[5]), parseInt(n[6]), 0)) : 0 / 0
        }
    }(), S.Util.countUtf8Bytes = function(t) {
        var e, r, n, i, o;
        for (e = 0, n = i = 0, o = t.length; o >= 0 ? o > i : i > o; n = o >= 0 ? ++i : --i)
            r = t.charCodeAt(n), 127 >= r ? e += 1 : 2047 >= r ? e += 2 : r >= 55296 && 57343 >= r ? e += 2 : 65535 >= r ? e += 3 : Y(!1);
        return e
    }, S.Env.global.XMLHttpRequest ? (!S.Env.global.XDomainRequest || "withCredentials" in new XMLHttpRequest ? (y = XMLHttpRequest, g = !1, p = "undefined" != typeof FormData && -1 === navigator.userAgent.indexOf("Firefox")) : (y = XDomainRequest, g = !0, p = !1), f = !0) : (y = S.Env.require("xhr2"), g = !1, p = !1, f = !1), S.Env.global.Uint8Array)
        if (Object.getPrototypeOf ? _ = Object.getPrototypeOf(Object.getPrototypeOf(new Uint8Array(0))).constructor : Object.__proto__ && (_ = new Uint8Array(0).__proto__.__proto__.constructor), S.Env.global.Blob) {
            try {
                !function() {
                    return 2 === new Blob([new Uint8Array(2)]).size ? (v = !0, m = !0) : (m = !1, v = 2 === new Blob([new ArrayBuffer(2)]).size)
                }()
            } catch (se) {
                m = !1, v = !1, S.Env.global.WebKitBlobBuilder && -1 !== navigator.userAgent.indexOf("Android") && (p = !1)
            }
            _ === Object && (m = !1)
        } else
            v = !1, m = !0;
    else
        _ = null, v = !1, m = !1;
    S.Util.Xhr = function() {
        function t(t, e) {
            this.method = t, this.isGet = "GET" === this.method, this.url = e, this.wantHeaders = !1, this.headers = {}, this.params = null, this.body = null, this.preflight = !(this.isGet || "POST" === this.method), this.signed = !1, this.completed = !1, this.responseType = null, this.callback = null, this.xhr = null, this.onError = null
        }
        return t.Request = y, t.ieXdr = g, t.canSendForms = p, t.doesPreflight = f, t.ArrayBufferView = _, t.sendArrayBufferView = m, t.wrapBlob = v, t.prototype.xhr = null, t.prototype.onError = null, t.prototype.setParams = function(t) {
            if (this.signed)
                throw new Error("setParams called after addOauthParams or addOauthHeader");
            if (this.params)
                throw new Error("setParams cannot be called twice");
            return this.params = t, this
        }, t.prototype.setCallback = function(t) {
            return this.callback = t, this
        }, t.prototype.signWithOauth = function(t, e) {
            return S.Util.Xhr.ieXdr ? this.addOauthParams(t) : this.preflight || !S.Util.Xhr.doesPreflight ? this.addOauthHeader(t) : this.isGet && e ? this.addOauthHeader(t) : this.addOauthParams(t)
        }, t.prototype.addOauthParams = function(t) {
            if (this.signed)
                throw new Error("Request already has an OAuth signature");
            return this.params || (this.params = {}), t.addAuthParams(this.method, this.url, this.params), this.signed = !0, this
        }, t.prototype.addOauthHeader = function(t) {
            if (this.signed)
                throw new Error("Request already has an OAuth signature");
            return this.params || (this.params = {}), this.signed = !0, this.setHeader("Authorization", t.authHeader(this.method, this.url, this.params))
        }, t.prototype.setBody = function(t) {
            if (this.isGet)
                throw new Error("setBody cannot be called on GET requests");
            if (null !== this.body)
                throw new Error("Request already has a body");
            return "string" == typeof t || "undefined" != typeof FormData && t instanceof FormData || (this.headers["Content-Type"] = "application/octet-stream", this.preflight = !0), this.body = t, this
        }, t.prototype.setResponseType = function(t) {
            return this.responseType = t, this
        }, t.prototype.setHeader = function(t, e) {
            var r;
            if (this.headers[t])
                throw r = this.headers[t], new Error("HTTP header " + t + " already set to " + r);
            if ("Content-Type" === t)
                throw new Error("Content-Type is automatically computed based on setBody");
            return this.preflight = !0, this.headers[t] = e, this
        }, t.prototype.reportResponseHeaders = function() {
            return this.wantHeaders = !0
        }, t.prototype.setFileField = function(t, e, r, n) {
            var i, o, s, a, u;
            if (null !== this.body)
                throw new Error("Request already has a body");
            if (this.isGet)
                throw new Error("setFileField cannot be called on GET requests");
            if ("object" == typeof r) {
                "undefined" != typeof ArrayBuffer && (r instanceof ArrayBuffer ? S.Util.Xhr.sendArrayBufferView && (r = new Uint8Array(r)) : !S.Util.Xhr.sendArrayBufferView && 0 === r.byteOffset && r.buffer instanceof ArrayBuffer && (r = r.buffer)), n || (n = "application/octet-stream");
                try {
                    r = new Blob([r], {type: n})
                } catch (l) {
                    o = l, window.WebKitBlobBuilder && (a = new WebKitBlobBuilder, a.append(r), (i = a.getBlob(n)) && (r = i))
                }
                "undefined" != typeof File && r instanceof File && (r = new Blob([r], {type: r.type})), u = r instanceof Blob
            } else
                u = !1;
            return u ? (this.body = new FormData, this.body.append(t, r, e)) : (n || (n = "application/octet-stream"), s = this.multipartBoundary(), this.headers["Content-Type"] = "multipart/form-data; boundary=" + s, this.body = ["--", s, "\r\n", 'Content-Disposition: form-data; name="', t, '"; filename="', e, '"\r\n', "Content-Type: ", n, "\r\n", "Content-Transfer-Encoding: binary\r\n\r\n", r, "\r\n", "--", s, "--", "\r\n"].join(""))
        }, t.prototype.multipartBoundary = function() {
            return [Date.now().toString(36), Math.random().toString(36)].join("----")
        }, t.prototype.paramsToUrl = function() {
            var t;
            return this.params && (t = S.Util.Xhr.urlEncode(this.params), 0 !== t.length && (this.url = [this.url, "?", t].join("")), this.params = null), this
        }, t.prototype.paramsToBody = function() {
            if (this.params) {
                if (null !== this.body)
                    throw new Error("Request already has a body");
                if (this.isGet)
                    throw new Error("paramsToBody cannot be called on GET requests");
                this.headers["Content-Type"] = "application/x-www-form-urlencoded", this.body = S.Util.Xhr.urlEncode(this.params), this.params = null
            }
            return this
        }, t.prototype.prepare = function() {
            var t, e, r, n, i = this;
            if (e = S.Util.Xhr.ieXdr, this.isGet || null !== this.body || e ? (this.paramsToUrl(), null !== this.body && "string" == typeof this.body && (this.headers["Content-Type"] = "text/plain; charset=utf8")) : this.paramsToBody(), this.xhr = new S.Util.Xhr.Request, e ? (this.xhr.onload = function() {
                    return i.onXdrLoad()
                }, this.xhr.onerror = function() {
                    return i.onXdrError()
                }, this.xhr.ontimeout = function() {
                    return i.onXdrError()
                }, this.xhr.onprogress = function() {
                }) : this.xhr.onreadystatechange = function() {
                    return i.onReadyStateChange()
                }, this.xhr.open(this.method, this.url, !0), !e) {
                n = this.headers;
                for (t in n)
                    re.call(n, t) && (r = n[t], this.xhr.setRequestHeader(t, r))
            }
            return this.responseType && ("b" === this.responseType ? this.xhr.overrideMimeType && this.xhr.overrideMimeType("text/plain; charset=x-user-defined") : this.xhr.responseType = this.responseType), this
        }, t.prototype.send = function(t) {
            var e, r;
            if (this.callback = t || this.callback, null !== this.body) {
                e = this.body, S.Util.Xhr.sendArrayBufferView ? e instanceof ArrayBuffer && (e = new Uint8Array(e)) : 0 === e.byteOffset && e.buffer instanceof ArrayBuffer && (e = e.buffer);
                try {
                    this.xhr.send(e)
                } catch (n) {
                    if (r = n, S.Util.Xhr.sendArrayBufferView || !S.Util.Xhr.wrapBlob)
                        throw r;
                    e = new Blob([e], {type: "application/octet-stream"}), this.xhr.send(e)
                }
            } else
                this.xhr.send();
            return this
        }, t.urlEncode = function(t) {
            var e, r, n;
            e = [];
            for (r in t)
                n = t[r], e.push(this.urlEncodeValue(r) + "=" + this.urlEncodeValue(n));
            return e.sort().join("&")
        }, t.urlEncodeValue = function(t) {
            return encodeURIComponent(t.toString()).replace(/\!/g, "%21").replace(/'/g, "%27").replace(/\(/g, "%28").replace(/\)/g, "%29").replace(/\*/g, "%2A")
        }, t.urlDecode = function(t) {
            var e, r, n, i, o, s;
            for (r = {}, s = t.split("&"), i = 0, o = s.length; o > i; i++)
                n = s[i], e = n.split("="), r[decodeURIComponent(e[0])] = decodeURIComponent(e[1]);
            return r
        }, t.prototype.onReadyStateChange = function() {
            var t, e, r, n, i, o, s, a, u, l, h, c, d, _, p;
            if (4 !== this.xhr.readyState)
                return !0;
            if (this.completed)
                return !0;
            if (this.completed = !0, this.xhr.status < 200 || this.xhr.status >= 300)
                return e = new S.ApiError(this.xhr, this.method, this.url), this.onError ? this.onError(e, this.callback) : this.callback(e), !0;
            if (this.wantHeaders ? (t = this.xhr.getAllResponseHeaders(), s = t ? S.Util.Xhr.parseResponseHeaders(t) : this.guessResponseHeaders(), h = s["x-dropbox-metadata"]) : (s = void 0, h = this.xhr.getResponseHeader("x-dropbox-metadata")), null != h ? h.length : void 0)
                try {
                    l = JSON.parse(h)
                } catch (f) {
                    if (u = f, o = h.search(/\}\,\s*\{/), -1 !== o)
                        try {
                            h = h.substring(0, o + 1), l = JSON.parse(h)
                        } catch (f) {
                            u = f, l = void 0
                        }
                    else
                        l = void 0
                }
            else
                l = void 0;
            if (this.responseType) {
                if ("b" === this.responseType) {
                    for (i = null != this.xhr.responseText ? this.xhr.responseText : this.xhr.response, r = [], a = _ = 0, p = i.length; p >= 0 ? p > _ : _ > p; a = p >= 0 ? ++_ : --_)
                        r.push(String.fromCharCode(255 & i.charCodeAt(a)));
                    d = r.join(""), this.callback(null, d, l, s)
                } else
                    this.callback(null, this.xhr.response, l, s);
                return !0
            }
            switch (d = null != this.xhr.responseText ? this.xhr.responseText : this.xhr.response, n = this.xhr.getResponseHeader("Content-Type"), n && (c = n.indexOf(";"), -1 !== c && (n = n.substring(0, c))), n) {
                case "application/x-www-form-urlencoded":
                    this.callback(null, S.Util.Xhr.urlDecode(d), l, s);
                    break;
                case "application/json":
                case "text/javascript":
                    this.callback(null, JSON.parse(d), l, s);
                    break;
                default:
                    this.callback(null, d, l, s)
            }
            return !0
        }, t.parseResponseHeaders = function(t) {
            var e, r, n, i, o, s, a, u;
            for (n = {}, r = t.split("\n"), a = 0, u = r.length; u > a; a++)
                i = r[a], e = i.indexOf(":"), o = i.substring(0, e).trim().toLowerCase(), s = i.substring(e + 1).trim(), n[o] = s;
            return n
        }, t.prototype.guessResponseHeaders = function() {
            var t, e, r, n, i, o;
            for (t = {}, o = ["cache-control", "content-language", "content-range", "content-type", "expires", "last-modified", "pragma", "x-dropbox-metadata"], n = 0, i = o.length; i > n; n++)
                e = o[n], r = this.xhr.getResponseHeader(e), r && (t[e] = r);
            return t
        }, t.prototype.onXdrLoad = function() {
            var t, e, r;
            if (this.completed)
                return !0;
            if (this.completed = !0, r = this.xhr.responseText, t = this.wantHeaders ? {"content-type": this.xhr.contentType} : void 0, e = void 0, this.responseType)
                return this.callback(null, r, e, t), !0;
            switch (this.xhr.contentType) {
                case "application/x-www-form-urlencoded":
                    this.callback(null, S.Util.Xhr.urlDecode(r), e, t);
                    break;
                case "application/json":
                case "text/javascript":
                    this.callback(null, JSON.parse(r), e, t);
                    break;
                default:
                    this.callback(null, r, e, t)
            }
            return !0
        }, t.prototype.onXdrError = function() {
            var t;
            return this.completed ? !0 : (this.completed = !0, t = new S.ApiError(this.xhr, this.method, this.url), this.onError ? this.onError(t, this.callback) : this.callback(t), !0)
        }, t
    }(), Q = "X-Dropbox-User-Agent", M = "X-Dropbox-Request-Id", S.DatastoresClient = {_dispatchDatastoreXhr: function(t, e, r, n, i, o) {
        var s, a, l;
        return l = new S.Util.Xhr(t, e), i.setRequestId && (a = "xxxxxxxxxxxxxxxx".replace(/x/g, function() {
            return Math.floor(16 * Math.random()).toString(16)
        }), l.setHeader(M, a)), Y(null == r[Q]), r = te.clone(r), r[Q] = "dropbox-js-datastore-sdk/" + u, l.setParams(r), l.signWithOauth(this._oauth, !1), s = function(t, e) {
            return null != t ? o(t) : o(null, n.fromJSON(e))
        }, i.isLongPoll ? this._dispatchLongPollXhr(l, s) : this._dispatchXhr(l, s), l
    },_listDatastores: function(t) {
        return this._dispatchDatastoreXhr("GET", this._urls.listDbs, {}, k, {}, t)
    },_getOrCreateDatastore: function(t, e) {
        return this._dispatchDatastoreXhr("POST", this._urls.getOrCreateDb, {dsid: t}, s, {}, e)
    },_createDatastore: function(t, e, r) {
        return this._dispatchDatastoreXhr("POST", this._urls.createDb, {dsid: t,key: e}, s, {}, r)
    },_getDatastore: function(t, e) {
        return this._dispatchDatastoreXhr("GET", this._urls.getDb, {dsid: t}, T, {}, e)
    },_deleteDatastore: function(t, e) {
        return this._dispatchDatastoreXhr("POST", this._urls.deleteDb, {handle: t}, b, {setRequestId: !0}, e)
    },_putDelta: function(t, e, r) {
        return this._dispatchDatastoreXhr("POST", this._urls.putDelta, {handle: t,rev: e.rev,nonce: e.nonce,changes: JSON.stringify(e.changes)}, X, {setRequestId: !0}, r)
    },_getSnapshot: function(t, e) {
        return this._dispatchDatastoreXhr("GET", this._urls.getSnapshot, {handle: t}, C, {}, e)
    },_datastoreAwait: function(e, r, n) {
        return this._dispatchDatastoreXhr("POST", this._urls.datastoreAwait, {get_deltas: JSON.stringify({cursors: e}),list_datastores: JSON.stringify({token: r})}, t, {isLongPoll: !0,setRequestId: !0}, n)
    },getDatastoreManager: function() {
        var t, e = this;
        return null == this._datastoreManager && (this._datastoreManager = new S.Datastore.DatastoreManager(this), t = function() {
            return e.authStep === S.Client.SIGNED_OUT ? (e._datastoreManager.close(), e._datastoreManager = null, e.onAuthStepChange.removeListener(t)) : void 0
        }, this.onAuthStepChange.addListener(t)), this._datastoreManager
    }}, function() {
        var t, e, r, n;
        r = S.DatastoresClient, n = [];
        for (e in r)
            t = r[e], n.push(S.Client.prototype[e] = t);
        return n
    }()
}).call(this);
