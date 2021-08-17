/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/electron-cgi/connection-builder.js":
/*!*********************************************************!*\
  !*** ./node_modules/electron-cgi/connection-builder.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

const { spawn } = __webpack_require__(/*! child_process */ "child_process");
const { Connection } = __webpack_require__(/*! ./connection */ "./node_modules/electron-cgi/connection.js");

exports.ConnectionBuilder = function ConnectionBuilder() {
    var spawnArguments = null;
    this.connectTo = (command, ...args) => {
        spawnArguments = {
            command,
            args
        };
        return this;
    };
    this.build = () => {
        if (!spawnArguments) {
            throw new Error('Use connectTo(pathToExecutable, [arguments]) to specify to which executable to connect');
        }
        const executable = spawn(spawnArguments.command, spawnArguments.args);
 
        if (!executable.pid)
            throw new Error(`Could not start ${spawnArguments.command}. Are you sure you have the right path?`);
 
        executable.on('exit', (code) => {
            if(this.handleOnExit){
                this.handleOnExit(code);
            }
            console.log(`Connection to ${spawnArguments.command} was terminated (code: ${code})`)
        });
        executable.stderr.on('data', data => {
            if(this.handleOnStderr)
            {
                this.handleOnStderr(data);
            }
            process.stdout.write('\x1b[7m'); //invert terminal colors
            process.stdout.write(data);
            process.stdout.write('\x1b[0m'); //reset colors
        });
        return new Connection(executable.stdin, executable.stdout);
    };
        
    this.handleOnStderr = null;
    this.handleOnExit = null;
    this.onStderr = function(handler) {
        this.handleOnStderr = handler
        return this;
    }
    this.onExit = function (handler) {
        this.handleOnExit = handler;
        return this;
    }         
}


/***/ }),

/***/ "./node_modules/electron-cgi/connection.js":
/*!*************************************************!*\
  !*** ./node_modules/electron-cgi/connection.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

const Request = __webpack_require__(/*! ./request */ "./node_modules/electron-cgi/request.js");
const TabSeparatedInputStreamParser = __webpack_require__(/*! ./tab-separated-input-stream-parser */ "./node_modules/electron-cgi/tab-separated-input-stream-parser.js");

/** @param {import('stream').Writable} outStream */
exports.Connection = function Connection(outStream, inStream) {
    const responseHandlersQueue = [];
    const requestHandlersQueue = [];

    const inputStreamParser = new TabSeparatedInputStreamParser();

    inStream.setEncoding('utf8');
    inStream.on('data', (chunk) => {
        inputStreamParser.addPartial(chunk);
    });

    inStream.on('close', () => {
        if (this.onDisconnect) {
            this.onDisconnect();
        }
    });

    inputStreamParser.onResponse(response => {
        const responseIds = responseHandlersQueue.map(r => r.id);
        if (responseIds.indexOf(response.id) !== -1) {
            responseHandlersQueue.splice(responseIds.indexOf(response.id), 1)[0].onResponse(null, response.result);
        }
    });

    inputStreamParser.onError(errorResponse => {
        const responseIds = responseHandlersQueue.map(r => r.id);
        if (responseIds.indexOf(errorResponse.requestId) !== -1) {
            responseHandlersQueue.splice(responseIds.indexOf(errorResponse.requestId), 1)[0].onResponse(JSON.parse(errorResponse.error));
        }
    })

    inputStreamParser.onRequest(request => {
        const requestType = request.type;
        requestHandlersQueue.filter(rh => rh.type === requestType).forEach(handlerContainer => {
            const requestHandler = handlerContainer.onRequest;
            const resultArgs = requestHandler(request.args)
            sendResponse(request.id, resultArgs);
        });
    });

    const sendResponse = (requestId, resultArgs) => {
        if (!outStream.writable) return; //stream was closed    
        outStream.write(`{"type": "RESPONSE", "response": ${JSON.stringify({
            id: requestId,
            result: JSON.stringify(resultArgs === undefined ? null : resultArgs)
        })}}\t`);
    }

    const sendRequest = (request, onResponse) => {
        if (!outStream.writable) return;
        outStream.write(`{"type": "REQUEST", "request": ${JSON.stringify(request)}}\t`);
        if (onResponse) {
            responseHandlersQueue.push({
                id: request.id,
                onResponse
            });
        }
    };

    this.onDisconnect = null;

    this.send = (type, args = {}, onResponse = null) => {
        if (typeof args === 'function' && onResponse === null) { //if there's only one argument and it's a function assume it's the callback
            onResponse = args;
            args = {}
        }
        if (onResponse === null) {
            return new Promise((resolve, reject) => {
                sendRequest(new Request(type, args), (err, result) => {
                    if (err)
                        reject(err)
                    else
                        resolve(result)
                });
            });
        } else {
            sendRequest(new Request(type, args), onResponse);
        }
    };

    this.on = (type, onRequest) => {
        requestHandlersQueue.push({ type, onRequest })
    }

    this.close = () => {
        outStream.end();
    };
}


/***/ }),

/***/ "./node_modules/electron-cgi/index.js":
/*!********************************************!*\
  !*** ./node_modules/electron-cgi/index.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const { ConnectionBuilder } = __webpack_require__(/*! ./connection-builder */ "./node_modules/electron-cgi/connection-builder.js");

module.exports = {
    ConnectionBuilder
};

/***/ }),

/***/ "./node_modules/electron-cgi/request.js":
/*!**********************************************!*\
  !*** ./node_modules/electron-cgi/request.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const uuidv4 = __webpack_require__(/*! uuid/v4 */ "./node_modules/uuid/v4.js");

function Request(type, args) {
    this.type = type;
    this.id = uuidv4();
    this.args = JSON.stringify(args);
}

module.exports = Request;

/***/ }),

/***/ "./node_modules/electron-cgi/tab-separated-input-stream-parser.js":
/*!************************************************************************!*\
  !*** ./node_modules/electron-cgi/tab-separated-input-stream-parser.js ***!
  \************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const { EventEmitter } = __webpack_require__(/*! events */ "events");

function TabSeparatedInputStreamParser() {
    const messageEmitter = new EventEmitter();
    let streamInput = '';

    this.addPartial = streamContent => {        
        streamInput += streamContent;
        while (streamInput.indexOf('\t') !== -1) {
            const messageStr = streamInput.substring(0, streamInput.indexOf('\t'));
            streamInput = streamInput.substring(streamInput.indexOf('\t') + 1);
            let message = null;
            try {
                message = JSON.parse(messageStr);
            } catch (e) {
                throw new Error(`Invalid incoming JSON: ${messageStr}`);
            }
            if (message.type === 'RESPONSE') {
                messageEmitter.emit('response',message.response);
            }else if (message.type === 'REQUEST') {
                messageEmitter.emit('request', message.request);
            }else if (message.type === 'ERROR'){
                messageEmitter.emit('error', message)
            }
        }
    };

    this.onResponse = handleResponseCallback => {
        messageEmitter.on('response', handleResponseCallback);
    };

    this.onError = handleErrorCallback => {
        messageEmitter.on('error', handleErrorCallback);
    };


    this.onRequest = handleRequestCallback => {
        messageEmitter.on('request', handleRequestCallback);
    };
}

module.exports = TabSeparatedInputStreamParser;

/***/ }),

/***/ "./node_modules/uuid/lib/bytesToUuid.js":
/*!**********************************************!*\
  !*** ./node_modules/uuid/lib/bytesToUuid.js ***!
  \**********************************************/
/***/ ((module) => {

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */
var byteToHex = [];
for (var i = 0; i < 256; ++i) {
  byteToHex[i] = (i + 0x100).toString(16).substr(1);
}

function bytesToUuid(buf, offset) {
  var i = offset || 0;
  var bth = byteToHex;
  // join used to fix memory issue caused by concatenation: https://bugs.chromium.org/p/v8/issues/detail?id=3175#c4
  return ([
    bth[buf[i++]], bth[buf[i++]],
    bth[buf[i++]], bth[buf[i++]], '-',
    bth[buf[i++]], bth[buf[i++]], '-',
    bth[buf[i++]], bth[buf[i++]], '-',
    bth[buf[i++]], bth[buf[i++]], '-',
    bth[buf[i++]], bth[buf[i++]],
    bth[buf[i++]], bth[buf[i++]],
    bth[buf[i++]], bth[buf[i++]]
  ]).join('');
}

module.exports = bytesToUuid;


/***/ }),

/***/ "./node_modules/uuid/lib/rng.js":
/*!**************************************!*\
  !*** ./node_modules/uuid/lib/rng.js ***!
  \**************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// Unique ID creation requires a high quality random # generator.  In node.js
// this is pretty straight-forward - we use the crypto API.

var crypto = __webpack_require__(/*! crypto */ "crypto");

module.exports = function nodeRNG() {
  return crypto.randomBytes(16);
};


/***/ }),

/***/ "./node_modules/uuid/v4.js":
/*!*********************************!*\
  !*** ./node_modules/uuid/v4.js ***!
  \*********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var rng = __webpack_require__(/*! ./lib/rng */ "./node_modules/uuid/lib/rng.js");
var bytesToUuid = __webpack_require__(/*! ./lib/bytesToUuid */ "./node_modules/uuid/lib/bytesToUuid.js");

function v4(options, buf, offset) {
  var i = buf && offset || 0;

  if (typeof(options) == 'string') {
    buf = options === 'binary' ? new Array(16) : null;
    options = null;
  }
  options = options || {};

  var rnds = options.random || (options.rng || rng)();

  // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
  rnds[6] = (rnds[6] & 0x0f) | 0x40;
  rnds[8] = (rnds[8] & 0x3f) | 0x80;

  // Copy bytes to buffer, if provided
  if (buf) {
    for (var ii = 0; ii < 16; ++ii) {
      buf[i + ii] = rnds[ii];
    }
  }

  return buf || bytesToUuid(rnds);
}

module.exports = v4;


/***/ }),

/***/ "child_process":
/*!********************************!*\
  !*** external "child_process" ***!
  \********************************/
/***/ ((module) => {

"use strict";
module.exports = require("child_process");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("crypto");

/***/ }),

/***/ "electron":
/*!***************************!*\
  !*** external "electron" ***!
  \***************************/
/***/ ((module) => {

"use strict";
module.exports = require("electron");

/***/ }),

/***/ "events":
/*!*************************!*\
  !*** external "events" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("events");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ }),

/***/ "url":
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("url");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! electron */ "electron");
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(electron__WEBPACK_IMPORTED_MODULE_0__);
var url = __webpack_require__(/*! url */ "url");

var path = __webpack_require__(/*! path */ "path");

var _require = __webpack_require__(/*! electron-cgi */ "./node_modules/electron-cgi/index.js"),
    ConnectionBuilder = _require.ConnectionBuilder;


var window;

var createWindow = function createWindow() {
  window = new electron__WEBPACK_IMPORTED_MODULE_0__.BrowserWindow({
    width: 1600,
    height: 1200,
    backgroundColor: '#121212',
    //'#0A0A0A',
    autoHideMenuBar: true,
    titleBarStyle: "hidden",
    webPreferences: {
      nodeIntegration: true,
      // these two preferences are critical
      contextIsolation: false // to getting data from main to dashboard

    }
  });
  window.loadURL(url.format({
    pathname: path.join(__dirname, "index.html"),
    protocol: "file:",
    slashes: true
  }));
  window.on("closed", function () {
    window = null;
  });
};

electron__WEBPACK_IMPORTED_MODULE_0__.app.on("ready", createWindow);
electron__WEBPACK_IMPORTED_MODULE_0__.app.on("window-all-closed", function () {
  if (process.platform !== "darwin") {
    electron__WEBPACK_IMPORTED_MODULE_0__.app.quit();
  }
});
electron__WEBPACK_IMPORTED_MODULE_0__.app.on("activate", function () {
  if (window === null) {
    createWindow();
  }
}); // C# communication stuff ForzaDataDotNet

var connection = new ConnectionBuilder().connectTo('dotnet', 'run', '--project', 'ForzaCore').build();

connection.onDisconnect = function () {
  console.log("lost");
}; // receive


connection.on('new-data', function (data) {
  // parse data into object
  var dataObj = JSON.parse(data); // send the data from forza to the front-end

  window.webContents.send("new-data-for-dashboard", dataObj); // log this event

  console.log("".concat(dataObj.PositionX, " ... ").concat(dataObj.PositionZ));
});
connection.on('switch-recording-mode', function (data) {
  // parse data into object
  var dataObj = JSON.parse(data); // send the data from forza to the front-end

  window.webContents.send("new-data-for-dashboard", dataObj); // log this event

  console.log("".concat(dataObj.Steer));
}); // send

electron__WEBPACK_IMPORTED_MODULE_0__.ipcMain.on('switch-recording-mode', function (event, arg) {
  connection.send("switch-recording-mode", "", function (response) {});
});
})();

/******/ })()
;
//# sourceMappingURL=main.js.map