var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// node_modules/unenv/dist/runtime/_internal/utils.mjs
// @__NO_SIDE_EFFECTS__
function createNotImplementedError(name) {
  return new Error(`[unenv] ${name} is not implemented yet!`);
}
__name(createNotImplementedError, "createNotImplementedError");
// @__NO_SIDE_EFFECTS__
function notImplemented(name) {
  const fn = /* @__PURE__ */ __name(() => {
    throw /* @__PURE__ */ createNotImplementedError(name);
  }, "fn");
  return Object.assign(fn, { __unenv__: true });
}
__name(notImplemented, "notImplemented");
// @__NO_SIDE_EFFECTS__
function notImplementedClass(name) {
  return class {
    __unenv__ = true;
    constructor() {
      throw new Error(`[unenv] ${name} is not implemented yet!`);
    }
  };
}
__name(notImplementedClass, "notImplementedClass");

// node_modules/unenv/dist/runtime/node/internal/perf_hooks/performance.mjs
var _timeOrigin = globalThis.performance?.timeOrigin ?? Date.now();
var _performanceNow = globalThis.performance?.now ? globalThis.performance.now.bind(globalThis.performance) : () => Date.now() - _timeOrigin;
var nodeTiming = {
  name: "node",
  entryType: "node",
  startTime: 0,
  duration: 0,
  nodeStart: 0,
  v8Start: 0,
  bootstrapComplete: 0,
  environment: 0,
  loopStart: 0,
  loopExit: 0,
  idleTime: 0,
  uvMetricsInfo: {
    loopCount: 0,
    events: 0,
    eventsWaiting: 0
  },
  detail: void 0,
  toJSON() {
    return this;
  }
};
var PerformanceEntry = class {
  static {
    __name(this, "PerformanceEntry");
  }
  __unenv__ = true;
  detail;
  entryType = "event";
  name;
  startTime;
  constructor(name, options) {
    this.name = name;
    this.startTime = options?.startTime || _performanceNow();
    this.detail = options?.detail;
  }
  get duration() {
    return _performanceNow() - this.startTime;
  }
  toJSON() {
    return {
      name: this.name,
      entryType: this.entryType,
      startTime: this.startTime,
      duration: this.duration,
      detail: this.detail
    };
  }
};
var PerformanceMark = class PerformanceMark2 extends PerformanceEntry {
  static {
    __name(this, "PerformanceMark");
  }
  entryType = "mark";
  constructor() {
    super(...arguments);
  }
  get duration() {
    return 0;
  }
};
var PerformanceMeasure = class extends PerformanceEntry {
  static {
    __name(this, "PerformanceMeasure");
  }
  entryType = "measure";
};
var PerformanceResourceTiming = class extends PerformanceEntry {
  static {
    __name(this, "PerformanceResourceTiming");
  }
  entryType = "resource";
  serverTiming = [];
  connectEnd = 0;
  connectStart = 0;
  decodedBodySize = 0;
  domainLookupEnd = 0;
  domainLookupStart = 0;
  encodedBodySize = 0;
  fetchStart = 0;
  initiatorType = "";
  name = "";
  nextHopProtocol = "";
  redirectEnd = 0;
  redirectStart = 0;
  requestStart = 0;
  responseEnd = 0;
  responseStart = 0;
  secureConnectionStart = 0;
  startTime = 0;
  transferSize = 0;
  workerStart = 0;
  responseStatus = 0;
};
var PerformanceObserverEntryList = class {
  static {
    __name(this, "PerformanceObserverEntryList");
  }
  __unenv__ = true;
  getEntries() {
    return [];
  }
  getEntriesByName(_name, _type) {
    return [];
  }
  getEntriesByType(type) {
    return [];
  }
};
var Performance = class {
  static {
    __name(this, "Performance");
  }
  __unenv__ = true;
  timeOrigin = _timeOrigin;
  eventCounts = /* @__PURE__ */ new Map();
  _entries = [];
  _resourceTimingBufferSize = 0;
  navigation = void 0;
  timing = void 0;
  timerify(_fn, _options) {
    throw createNotImplementedError("Performance.timerify");
  }
  get nodeTiming() {
    return nodeTiming;
  }
  eventLoopUtilization() {
    return {};
  }
  markResourceTiming() {
    return new PerformanceResourceTiming("");
  }
  onresourcetimingbufferfull = null;
  now() {
    if (this.timeOrigin === _timeOrigin) {
      return _performanceNow();
    }
    return Date.now() - this.timeOrigin;
  }
  clearMarks(markName) {
    this._entries = markName ? this._entries.filter((e) => e.name !== markName) : this._entries.filter((e) => e.entryType !== "mark");
  }
  clearMeasures(measureName) {
    this._entries = measureName ? this._entries.filter((e) => e.name !== measureName) : this._entries.filter((e) => e.entryType !== "measure");
  }
  clearResourceTimings() {
    this._entries = this._entries.filter((e) => e.entryType !== "resource" || e.entryType !== "navigation");
  }
  getEntries() {
    return this._entries;
  }
  getEntriesByName(name, type) {
    return this._entries.filter((e) => e.name === name && (!type || e.entryType === type));
  }
  getEntriesByType(type) {
    return this._entries.filter((e) => e.entryType === type);
  }
  mark(name, options) {
    const entry = new PerformanceMark(name, options);
    this._entries.push(entry);
    return entry;
  }
  measure(measureName, startOrMeasureOptions, endMark) {
    let start;
    let end;
    if (typeof startOrMeasureOptions === "string") {
      start = this.getEntriesByName(startOrMeasureOptions, "mark")[0]?.startTime;
      end = this.getEntriesByName(endMark, "mark")[0]?.startTime;
    } else {
      start = Number.parseFloat(startOrMeasureOptions?.start) || this.now();
      end = Number.parseFloat(startOrMeasureOptions?.end) || this.now();
    }
    const entry = new PerformanceMeasure(measureName, {
      startTime: start,
      detail: {
        start,
        end
      }
    });
    this._entries.push(entry);
    return entry;
  }
  setResourceTimingBufferSize(maxSize) {
    this._resourceTimingBufferSize = maxSize;
  }
  addEventListener(type, listener, options) {
    throw createNotImplementedError("Performance.addEventListener");
  }
  removeEventListener(type, listener, options) {
    throw createNotImplementedError("Performance.removeEventListener");
  }
  dispatchEvent(event) {
    throw createNotImplementedError("Performance.dispatchEvent");
  }
  toJSON() {
    return this;
  }
};
var PerformanceObserver = class {
  static {
    __name(this, "PerformanceObserver");
  }
  __unenv__ = true;
  static supportedEntryTypes = [];
  _callback = null;
  constructor(callback) {
    this._callback = callback;
  }
  takeRecords() {
    return [];
  }
  disconnect() {
    throw createNotImplementedError("PerformanceObserver.disconnect");
  }
  observe(options) {
    throw createNotImplementedError("PerformanceObserver.observe");
  }
  bind(fn) {
    return fn;
  }
  runInAsyncScope(fn, thisArg, ...args) {
    return fn.call(thisArg, ...args);
  }
  asyncId() {
    return 0;
  }
  triggerAsyncId() {
    return 0;
  }
  emitDestroy() {
    return this;
  }
};
var performance = globalThis.performance && "addEventListener" in globalThis.performance ? globalThis.performance : new Performance();

// node_modules/@cloudflare/unenv-preset/dist/runtime/polyfill/performance.mjs
if (!("__unenv__" in performance)) {
  const proto = Performance.prototype;
  for (const key of Object.getOwnPropertyNames(proto)) {
    if (key !== "constructor" && !(key in performance)) {
      const desc = Object.getOwnPropertyDescriptor(proto, key);
      if (desc) {
        Object.defineProperty(performance, key, desc);
      }
    }
  }
}
globalThis.performance = performance;
globalThis.Performance = Performance;
globalThis.PerformanceEntry = PerformanceEntry;
globalThis.PerformanceMark = PerformanceMark;
globalThis.PerformanceMeasure = PerformanceMeasure;
globalThis.PerformanceObserver = PerformanceObserver;
globalThis.PerformanceObserverEntryList = PerformanceObserverEntryList;
globalThis.PerformanceResourceTiming = PerformanceResourceTiming;

// node_modules/unenv/dist/runtime/node/console.mjs
import { Writable } from "node:stream";

// node_modules/unenv/dist/runtime/mock/noop.mjs
var noop_default = Object.assign(() => {
}, { __unenv__: true });

// node_modules/unenv/dist/runtime/node/console.mjs
var _console = globalThis.console;
var _ignoreErrors = true;
var _stderr = new Writable();
var _stdout = new Writable();
var log = _console?.log ?? noop_default;
var info = _console?.info ?? log;
var trace = _console?.trace ?? info;
var debug = _console?.debug ?? log;
var table = _console?.table ?? log;
var error = _console?.error ?? log;
var warn = _console?.warn ?? error;
var createTask = _console?.createTask ?? /* @__PURE__ */ notImplemented("console.createTask");
var clear = _console?.clear ?? noop_default;
var count = _console?.count ?? noop_default;
var countReset = _console?.countReset ?? noop_default;
var dir = _console?.dir ?? noop_default;
var dirxml = _console?.dirxml ?? noop_default;
var group = _console?.group ?? noop_default;
var groupEnd = _console?.groupEnd ?? noop_default;
var groupCollapsed = _console?.groupCollapsed ?? noop_default;
var profile = _console?.profile ?? noop_default;
var profileEnd = _console?.profileEnd ?? noop_default;
var time = _console?.time ?? noop_default;
var timeEnd = _console?.timeEnd ?? noop_default;
var timeLog = _console?.timeLog ?? noop_default;
var timeStamp = _console?.timeStamp ?? noop_default;
var Console = _console?.Console ?? /* @__PURE__ */ notImplementedClass("console.Console");
var _times = /* @__PURE__ */ new Map();
var _stdoutErrorHandler = noop_default;
var _stderrErrorHandler = noop_default;

// node_modules/@cloudflare/unenv-preset/dist/runtime/node/console.mjs
var workerdConsole = globalThis["console"];
var {
  assert,
  clear: clear2,
  // @ts-expect-error undocumented public API
  context,
  count: count2,
  countReset: countReset2,
  // @ts-expect-error undocumented public API
  createTask: createTask2,
  debug: debug2,
  dir: dir2,
  dirxml: dirxml2,
  error: error2,
  group: group2,
  groupCollapsed: groupCollapsed2,
  groupEnd: groupEnd2,
  info: info2,
  log: log2,
  profile: profile2,
  profileEnd: profileEnd2,
  table: table2,
  time: time2,
  timeEnd: timeEnd2,
  timeLog: timeLog2,
  timeStamp: timeStamp2,
  trace: trace2,
  warn: warn2
} = workerdConsole;
Object.assign(workerdConsole, {
  Console,
  _ignoreErrors,
  _stderr,
  _stderrErrorHandler,
  _stdout,
  _stdoutErrorHandler,
  _times
});
var console_default = workerdConsole;

// node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-console
globalThis.console = console_default;

// node_modules/unenv/dist/runtime/node/internal/process/hrtime.mjs
var hrtime = /* @__PURE__ */ Object.assign(/* @__PURE__ */ __name(function hrtime2(startTime) {
  const now = Date.now();
  const seconds = Math.trunc(now / 1e3);
  const nanos = now % 1e3 * 1e6;
  if (startTime) {
    let diffSeconds = seconds - startTime[0];
    let diffNanos = nanos - startTime[0];
    if (diffNanos < 0) {
      diffSeconds = diffSeconds - 1;
      diffNanos = 1e9 + diffNanos;
    }
    return [diffSeconds, diffNanos];
  }
  return [seconds, nanos];
}, "hrtime"), { bigint: /* @__PURE__ */ __name(function bigint() {
  return BigInt(Date.now() * 1e6);
}, "bigint") });

// node_modules/unenv/dist/runtime/node/internal/process/process.mjs
import { EventEmitter } from "node:events";

// node_modules/unenv/dist/runtime/node/internal/tty/read-stream.mjs
var ReadStream = class {
  static {
    __name(this, "ReadStream");
  }
  fd;
  isRaw = false;
  isTTY = false;
  constructor(fd) {
    this.fd = fd;
  }
  setRawMode(mode) {
    this.isRaw = mode;
    return this;
  }
};

// node_modules/unenv/dist/runtime/node/internal/tty/write-stream.mjs
var WriteStream = class {
  static {
    __name(this, "WriteStream");
  }
  fd;
  columns = 80;
  rows = 24;
  isTTY = false;
  constructor(fd) {
    this.fd = fd;
  }
  clearLine(dir4, callback) {
    callback && callback();
    return false;
  }
  clearScreenDown(callback) {
    callback && callback();
    return false;
  }
  cursorTo(x, y, callback) {
    callback && typeof callback === "function" && callback();
    return false;
  }
  moveCursor(dx, dy, callback) {
    callback && callback();
    return false;
  }
  getColorDepth(env3) {
    return 1;
  }
  hasColors(count4, env3) {
    return false;
  }
  getWindowSize() {
    return [this.columns, this.rows];
  }
  write(str, encoding, cb) {
    if (str instanceof Uint8Array) {
      str = new TextDecoder().decode(str);
    }
    try {
      console.log(str);
    } catch {
    }
    cb && typeof cb === "function" && cb();
    return false;
  }
};

// node_modules/unenv/dist/runtime/node/internal/process/node-version.mjs
var NODE_VERSION = "22.14.0";

// node_modules/unenv/dist/runtime/node/internal/process/process.mjs
var Process = class _Process extends EventEmitter {
  static {
    __name(this, "Process");
  }
  env;
  hrtime;
  nextTick;
  constructor(impl) {
    super();
    this.env = impl.env;
    this.hrtime = impl.hrtime;
    this.nextTick = impl.nextTick;
    for (const prop of [...Object.getOwnPropertyNames(_Process.prototype), ...Object.getOwnPropertyNames(EventEmitter.prototype)]) {
      const value = this[prop];
      if (typeof value === "function") {
        this[prop] = value.bind(this);
      }
    }
  }
  // --- event emitter ---
  emitWarning(warning, type, code) {
    console.warn(`${code ? `[${code}] ` : ""}${type ? `${type}: ` : ""}${warning}`);
  }
  emit(...args) {
    return super.emit(...args);
  }
  listeners(eventName) {
    return super.listeners(eventName);
  }
  // --- stdio (lazy initializers) ---
  #stdin;
  #stdout;
  #stderr;
  get stdin() {
    return this.#stdin ??= new ReadStream(0);
  }
  get stdout() {
    return this.#stdout ??= new WriteStream(1);
  }
  get stderr() {
    return this.#stderr ??= new WriteStream(2);
  }
  // --- cwd ---
  #cwd = "/";
  chdir(cwd3) {
    this.#cwd = cwd3;
  }
  cwd() {
    return this.#cwd;
  }
  // --- dummy props and getters ---
  arch = "";
  platform = "";
  argv = [];
  argv0 = "";
  execArgv = [];
  execPath = "";
  title = "";
  pid = 200;
  ppid = 100;
  get version() {
    return `v${NODE_VERSION}`;
  }
  get versions() {
    return { node: NODE_VERSION };
  }
  get allowedNodeEnvironmentFlags() {
    return /* @__PURE__ */ new Set();
  }
  get sourceMapsEnabled() {
    return false;
  }
  get debugPort() {
    return 0;
  }
  get throwDeprecation() {
    return false;
  }
  get traceDeprecation() {
    return false;
  }
  get features() {
    return {};
  }
  get release() {
    return {};
  }
  get connected() {
    return false;
  }
  get config() {
    return {};
  }
  get moduleLoadList() {
    return [];
  }
  constrainedMemory() {
    return 0;
  }
  availableMemory() {
    return 0;
  }
  uptime() {
    return 0;
  }
  resourceUsage() {
    return {};
  }
  // --- noop methods ---
  ref() {
  }
  unref() {
  }
  // --- unimplemented methods ---
  umask() {
    throw createNotImplementedError("process.umask");
  }
  getBuiltinModule() {
    return void 0;
  }
  getActiveResourcesInfo() {
    throw createNotImplementedError("process.getActiveResourcesInfo");
  }
  exit() {
    throw createNotImplementedError("process.exit");
  }
  reallyExit() {
    throw createNotImplementedError("process.reallyExit");
  }
  kill() {
    throw createNotImplementedError("process.kill");
  }
  abort() {
    throw createNotImplementedError("process.abort");
  }
  dlopen() {
    throw createNotImplementedError("process.dlopen");
  }
  setSourceMapsEnabled() {
    throw createNotImplementedError("process.setSourceMapsEnabled");
  }
  loadEnvFile() {
    throw createNotImplementedError("process.loadEnvFile");
  }
  disconnect() {
    throw createNotImplementedError("process.disconnect");
  }
  cpuUsage() {
    throw createNotImplementedError("process.cpuUsage");
  }
  setUncaughtExceptionCaptureCallback() {
    throw createNotImplementedError("process.setUncaughtExceptionCaptureCallback");
  }
  hasUncaughtExceptionCaptureCallback() {
    throw createNotImplementedError("process.hasUncaughtExceptionCaptureCallback");
  }
  initgroups() {
    throw createNotImplementedError("process.initgroups");
  }
  openStdin() {
    throw createNotImplementedError("process.openStdin");
  }
  assert() {
    throw createNotImplementedError("process.assert");
  }
  binding() {
    throw createNotImplementedError("process.binding");
  }
  // --- attached interfaces ---
  permission = { has: /* @__PURE__ */ notImplemented("process.permission.has") };
  report = {
    directory: "",
    filename: "",
    signal: "SIGUSR2",
    compact: false,
    reportOnFatalError: false,
    reportOnSignal: false,
    reportOnUncaughtException: false,
    getReport: /* @__PURE__ */ notImplemented("process.report.getReport"),
    writeReport: /* @__PURE__ */ notImplemented("process.report.writeReport")
  };
  finalization = {
    register: /* @__PURE__ */ notImplemented("process.finalization.register"),
    unregister: /* @__PURE__ */ notImplemented("process.finalization.unregister"),
    registerBeforeExit: /* @__PURE__ */ notImplemented("process.finalization.registerBeforeExit")
  };
  memoryUsage = Object.assign(() => ({
    arrayBuffers: 0,
    rss: 0,
    external: 0,
    heapTotal: 0,
    heapUsed: 0
  }), { rss: /* @__PURE__ */ __name(() => 0, "rss") });
  // --- undefined props ---
  mainModule = void 0;
  domain = void 0;
  // optional
  send = void 0;
  exitCode = void 0;
  channel = void 0;
  getegid = void 0;
  geteuid = void 0;
  getgid = void 0;
  getgroups = void 0;
  getuid = void 0;
  setegid = void 0;
  seteuid = void 0;
  setgid = void 0;
  setgroups = void 0;
  setuid = void 0;
  // internals
  _events = void 0;
  _eventsCount = void 0;
  _exiting = void 0;
  _maxListeners = void 0;
  _debugEnd = void 0;
  _debugProcess = void 0;
  _fatalException = void 0;
  _getActiveHandles = void 0;
  _getActiveRequests = void 0;
  _kill = void 0;
  _preload_modules = void 0;
  _rawDebug = void 0;
  _startProfilerIdleNotifier = void 0;
  _stopProfilerIdleNotifier = void 0;
  _tickCallback = void 0;
  _disconnect = void 0;
  _handleQueue = void 0;
  _pendingMessage = void 0;
  _channel = void 0;
  _send = void 0;
  _linkedBinding = void 0;
};

// node_modules/@cloudflare/unenv-preset/dist/runtime/node/process.mjs
var globalProcess = globalThis["process"];
var getBuiltinModule = globalProcess.getBuiltinModule;
var workerdProcess = getBuiltinModule("node:process");
var unenvProcess = new Process({
  env: globalProcess.env,
  hrtime,
  // `nextTick` is available from workerd process v1
  nextTick: workerdProcess.nextTick
});
var { exit, features, platform } = workerdProcess;
var {
  _channel,
  _debugEnd,
  _debugProcess,
  _disconnect,
  _events,
  _eventsCount,
  _exiting,
  _fatalException,
  _getActiveHandles,
  _getActiveRequests,
  _handleQueue,
  _kill,
  _linkedBinding,
  _maxListeners,
  _pendingMessage,
  _preload_modules,
  _rawDebug,
  _send,
  _startProfilerIdleNotifier,
  _stopProfilerIdleNotifier,
  _tickCallback,
  abort,
  addListener,
  allowedNodeEnvironmentFlags,
  arch,
  argv,
  argv0,
  assert: assert2,
  availableMemory,
  binding,
  channel,
  chdir,
  config,
  connected,
  constrainedMemory,
  cpuUsage,
  cwd,
  debugPort,
  disconnect,
  dlopen,
  domain,
  emit,
  emitWarning,
  env,
  eventNames,
  execArgv,
  execPath,
  exitCode,
  finalization,
  getActiveResourcesInfo,
  getegid,
  geteuid,
  getgid,
  getgroups,
  getMaxListeners,
  getuid,
  hasUncaughtExceptionCaptureCallback,
  hrtime: hrtime3,
  initgroups,
  kill,
  listenerCount,
  listeners,
  loadEnvFile,
  mainModule,
  memoryUsage,
  moduleLoadList,
  nextTick,
  off,
  on,
  once,
  openStdin,
  permission,
  pid,
  ppid,
  prependListener,
  prependOnceListener,
  rawListeners,
  reallyExit,
  ref,
  release,
  removeAllListeners,
  removeListener,
  report,
  resourceUsage,
  send,
  setegid,
  seteuid,
  setgid,
  setgroups,
  setMaxListeners,
  setSourceMapsEnabled,
  setuid,
  setUncaughtExceptionCaptureCallback,
  sourceMapsEnabled,
  stderr,
  stdin,
  stdout,
  throwDeprecation,
  title,
  traceDeprecation,
  umask,
  unref,
  uptime,
  version,
  versions
} = unenvProcess;
var _process = {
  abort,
  addListener,
  allowedNodeEnvironmentFlags,
  hasUncaughtExceptionCaptureCallback,
  setUncaughtExceptionCaptureCallback,
  loadEnvFile,
  sourceMapsEnabled,
  arch,
  argv,
  argv0,
  chdir,
  config,
  connected,
  constrainedMemory,
  availableMemory,
  cpuUsage,
  cwd,
  debugPort,
  dlopen,
  disconnect,
  emit,
  emitWarning,
  env,
  eventNames,
  execArgv,
  execPath,
  exit,
  finalization,
  features,
  getBuiltinModule,
  getActiveResourcesInfo,
  getMaxListeners,
  hrtime: hrtime3,
  kill,
  listeners,
  listenerCount,
  memoryUsage,
  nextTick,
  on,
  off,
  once,
  pid,
  platform,
  ppid,
  prependListener,
  prependOnceListener,
  rawListeners,
  release,
  removeAllListeners,
  removeListener,
  report,
  resourceUsage,
  setMaxListeners,
  setSourceMapsEnabled,
  stderr,
  stdin,
  stdout,
  title,
  throwDeprecation,
  traceDeprecation,
  umask,
  uptime,
  version,
  versions,
  // @ts-expect-error old API
  domain,
  initgroups,
  moduleLoadList,
  reallyExit,
  openStdin,
  assert: assert2,
  binding,
  send,
  exitCode,
  channel,
  getegid,
  geteuid,
  getgid,
  getgroups,
  getuid,
  setegid,
  seteuid,
  setgid,
  setgroups,
  setuid,
  permission,
  mainModule,
  _events,
  _eventsCount,
  _exiting,
  _maxListeners,
  _debugEnd,
  _debugProcess,
  _fatalException,
  _getActiveHandles,
  _getActiveRequests,
  _kill,
  _preload_modules,
  _rawDebug,
  _startProfilerIdleNotifier,
  _stopProfilerIdleNotifier,
  _tickCallback,
  _disconnect,
  _handleQueue,
  _pendingMessage,
  _channel,
  _send,
  _linkedBinding
};
var process_default = _process;

// node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-process
globalThis.process = process_default;

// .wrangler/tmp/pages-NFCszS/functionsWorker-0.7116196142911848.mjs
import { Writable as Writable2 } from "node:stream";
import { EventEmitter as EventEmitter2 } from "node:events";
var __defProp2 = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __name2 = /* @__PURE__ */ __name((target, value) => __defProp2(target, "name", { value, configurable: true }), "__name");
var __esm = /* @__PURE__ */ __name((fn, res) => /* @__PURE__ */ __name(function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
}, "__init"), "__esm");
var __export = /* @__PURE__ */ __name((target, all) => {
  for (var name in all)
    __defProp2(target, name, { get: all[name], enumerable: true });
}, "__export");
// @__NO_SIDE_EFFECTS__
function createNotImplementedError2(name) {
  return new Error(`[unenv] ${name} is not implemented yet!`);
}
__name(createNotImplementedError2, "createNotImplementedError");
// @__NO_SIDE_EFFECTS__
function notImplemented2(name) {
  const fn = /* @__PURE__ */ __name2(() => {
    throw /* @__PURE__ */ createNotImplementedError2(name);
  }, "fn");
  return Object.assign(fn, { __unenv__: true });
}
__name(notImplemented2, "notImplemented");
// @__NO_SIDE_EFFECTS__
function notImplementedClass2(name) {
  return class {
    __unenv__ = true;
    constructor() {
      throw new Error(`[unenv] ${name} is not implemented yet!`);
    }
  };
}
__name(notImplementedClass2, "notImplementedClass");
var init_utils = __esm({
  "../node_modules/unenv/dist/runtime/_internal/utils.mjs"() {
    init_functionsRoutes_0_9739269091816841();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    __name2(createNotImplementedError2, "createNotImplementedError");
    __name2(notImplemented2, "notImplemented");
    __name2(notImplementedClass2, "notImplementedClass");
  }
});
var _timeOrigin2;
var _performanceNow2;
var nodeTiming2;
var PerformanceEntry2;
var PerformanceMark3;
var PerformanceMeasure2;
var PerformanceResourceTiming2;
var PerformanceObserverEntryList2;
var Performance2;
var PerformanceObserver2;
var performance2;
var init_performance = __esm({
  "../node_modules/unenv/dist/runtime/node/internal/perf_hooks/performance.mjs"() {
    init_functionsRoutes_0_9739269091816841();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_utils();
    _timeOrigin2 = globalThis.performance?.timeOrigin ?? Date.now();
    _performanceNow2 = globalThis.performance?.now ? globalThis.performance.now.bind(globalThis.performance) : () => Date.now() - _timeOrigin2;
    nodeTiming2 = {
      name: "node",
      entryType: "node",
      startTime: 0,
      duration: 0,
      nodeStart: 0,
      v8Start: 0,
      bootstrapComplete: 0,
      environment: 0,
      loopStart: 0,
      loopExit: 0,
      idleTime: 0,
      uvMetricsInfo: {
        loopCount: 0,
        events: 0,
        eventsWaiting: 0
      },
      detail: void 0,
      toJSON() {
        return this;
      }
    };
    PerformanceEntry2 = class {
      static {
        __name(this, "PerformanceEntry");
      }
      static {
        __name2(this, "PerformanceEntry");
      }
      __unenv__ = true;
      detail;
      entryType = "event";
      name;
      startTime;
      constructor(name, options) {
        this.name = name;
        this.startTime = options?.startTime || _performanceNow2();
        this.detail = options?.detail;
      }
      get duration() {
        return _performanceNow2() - this.startTime;
      }
      toJSON() {
        return {
          name: this.name,
          entryType: this.entryType,
          startTime: this.startTime,
          duration: this.duration,
          detail: this.detail
        };
      }
    };
    PerformanceMark3 = class PerformanceMark2 extends PerformanceEntry2 {
      static {
        __name(this, "PerformanceMark2");
      }
      static {
        __name2(this, "PerformanceMark");
      }
      entryType = "mark";
      constructor() {
        super(...arguments);
      }
      get duration() {
        return 0;
      }
    };
    PerformanceMeasure2 = class extends PerformanceEntry2 {
      static {
        __name(this, "PerformanceMeasure");
      }
      static {
        __name2(this, "PerformanceMeasure");
      }
      entryType = "measure";
    };
    PerformanceResourceTiming2 = class extends PerformanceEntry2 {
      static {
        __name(this, "PerformanceResourceTiming");
      }
      static {
        __name2(this, "PerformanceResourceTiming");
      }
      entryType = "resource";
      serverTiming = [];
      connectEnd = 0;
      connectStart = 0;
      decodedBodySize = 0;
      domainLookupEnd = 0;
      domainLookupStart = 0;
      encodedBodySize = 0;
      fetchStart = 0;
      initiatorType = "";
      name = "";
      nextHopProtocol = "";
      redirectEnd = 0;
      redirectStart = 0;
      requestStart = 0;
      responseEnd = 0;
      responseStart = 0;
      secureConnectionStart = 0;
      startTime = 0;
      transferSize = 0;
      workerStart = 0;
      responseStatus = 0;
    };
    PerformanceObserverEntryList2 = class {
      static {
        __name(this, "PerformanceObserverEntryList");
      }
      static {
        __name2(this, "PerformanceObserverEntryList");
      }
      __unenv__ = true;
      getEntries() {
        return [];
      }
      getEntriesByName(_name, _type) {
        return [];
      }
      getEntriesByType(type) {
        return [];
      }
    };
    Performance2 = class {
      static {
        __name(this, "Performance");
      }
      static {
        __name2(this, "Performance");
      }
      __unenv__ = true;
      timeOrigin = _timeOrigin2;
      eventCounts = /* @__PURE__ */ new Map();
      _entries = [];
      _resourceTimingBufferSize = 0;
      navigation = void 0;
      timing = void 0;
      timerify(_fn, _options) {
        throw /* @__PURE__ */ createNotImplementedError2("Performance.timerify");
      }
      get nodeTiming() {
        return nodeTiming2;
      }
      eventLoopUtilization() {
        return {};
      }
      markResourceTiming() {
        return new PerformanceResourceTiming2("");
      }
      onresourcetimingbufferfull = null;
      now() {
        if (this.timeOrigin === _timeOrigin2) {
          return _performanceNow2();
        }
        return Date.now() - this.timeOrigin;
      }
      clearMarks(markName) {
        this._entries = markName ? this._entries.filter((e) => e.name !== markName) : this._entries.filter((e) => e.entryType !== "mark");
      }
      clearMeasures(measureName) {
        this._entries = measureName ? this._entries.filter((e) => e.name !== measureName) : this._entries.filter((e) => e.entryType !== "measure");
      }
      clearResourceTimings() {
        this._entries = this._entries.filter((e) => e.entryType !== "resource" || e.entryType !== "navigation");
      }
      getEntries() {
        return this._entries;
      }
      getEntriesByName(name, type) {
        return this._entries.filter((e) => e.name === name && (!type || e.entryType === type));
      }
      getEntriesByType(type) {
        return this._entries.filter((e) => e.entryType === type);
      }
      mark(name, options) {
        const entry = new PerformanceMark3(name, options);
        this._entries.push(entry);
        return entry;
      }
      measure(measureName, startOrMeasureOptions, endMark) {
        let start;
        let end;
        if (typeof startOrMeasureOptions === "string") {
          start = this.getEntriesByName(startOrMeasureOptions, "mark")[0]?.startTime;
          end = this.getEntriesByName(endMark, "mark")[0]?.startTime;
        } else {
          start = Number.parseFloat(startOrMeasureOptions?.start) || this.now();
          end = Number.parseFloat(startOrMeasureOptions?.end) || this.now();
        }
        const entry = new PerformanceMeasure2(measureName, {
          startTime: start,
          detail: {
            start,
            end
          }
        });
        this._entries.push(entry);
        return entry;
      }
      setResourceTimingBufferSize(maxSize) {
        this._resourceTimingBufferSize = maxSize;
      }
      addEventListener(type, listener, options) {
        throw /* @__PURE__ */ createNotImplementedError2("Performance.addEventListener");
      }
      removeEventListener(type, listener, options) {
        throw /* @__PURE__ */ createNotImplementedError2("Performance.removeEventListener");
      }
      dispatchEvent(event) {
        throw /* @__PURE__ */ createNotImplementedError2("Performance.dispatchEvent");
      }
      toJSON() {
        return this;
      }
    };
    PerformanceObserver2 = class {
      static {
        __name(this, "PerformanceObserver");
      }
      static {
        __name2(this, "PerformanceObserver");
      }
      __unenv__ = true;
      static supportedEntryTypes = [];
      _callback = null;
      constructor(callback) {
        this._callback = callback;
      }
      takeRecords() {
        return [];
      }
      disconnect() {
        throw /* @__PURE__ */ createNotImplementedError2("PerformanceObserver.disconnect");
      }
      observe(options) {
        throw /* @__PURE__ */ createNotImplementedError2("PerformanceObserver.observe");
      }
      bind(fn) {
        return fn;
      }
      runInAsyncScope(fn, thisArg, ...args) {
        return fn.call(thisArg, ...args);
      }
      asyncId() {
        return 0;
      }
      triggerAsyncId() {
        return 0;
      }
      emitDestroy() {
        return this;
      }
    };
    performance2 = globalThis.performance && "addEventListener" in globalThis.performance ? globalThis.performance : new Performance2();
  }
});
var init_perf_hooks = __esm({
  "../node_modules/unenv/dist/runtime/node/perf_hooks.mjs"() {
    init_functionsRoutes_0_9739269091816841();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_performance();
  }
});
var init_performance2 = __esm({
  "../node_modules/@cloudflare/unenv-preset/dist/runtime/polyfill/performance.mjs"() {
    init_perf_hooks();
    if (!("__unenv__" in performance2)) {
      const proto = Performance2.prototype;
      for (const key of Object.getOwnPropertyNames(proto)) {
        if (key !== "constructor" && !(key in performance2)) {
          const desc = Object.getOwnPropertyDescriptor(proto, key);
          if (desc) {
            Object.defineProperty(performance2, key, desc);
          }
        }
      }
    }
    globalThis.performance = performance2;
    globalThis.Performance = Performance2;
    globalThis.PerformanceEntry = PerformanceEntry2;
    globalThis.PerformanceMark = PerformanceMark3;
    globalThis.PerformanceMeasure = PerformanceMeasure2;
    globalThis.PerformanceObserver = PerformanceObserver2;
    globalThis.PerformanceObserverEntryList = PerformanceObserverEntryList2;
    globalThis.PerformanceResourceTiming = PerformanceResourceTiming2;
  }
});
var noop_default2;
var init_noop = __esm({
  "../node_modules/unenv/dist/runtime/mock/noop.mjs"() {
    init_functionsRoutes_0_9739269091816841();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    noop_default2 = Object.assign(() => {
    }, { __unenv__: true });
  }
});
var _console2;
var _ignoreErrors2;
var _stderr2;
var _stdout2;
var log3;
var info3;
var trace3;
var debug3;
var table3;
var error3;
var warn3;
var createTask3;
var clear3;
var count3;
var countReset3;
var dir3;
var dirxml3;
var group3;
var groupEnd3;
var groupCollapsed3;
var profile3;
var profileEnd3;
var time3;
var timeEnd3;
var timeLog3;
var timeStamp3;
var Console2;
var _times2;
var _stdoutErrorHandler2;
var _stderrErrorHandler2;
var init_console = __esm({
  "../node_modules/unenv/dist/runtime/node/console.mjs"() {
    init_functionsRoutes_0_9739269091816841();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_noop();
    init_utils();
    _console2 = globalThis.console;
    _ignoreErrors2 = true;
    _stderr2 = new Writable2();
    _stdout2 = new Writable2();
    log3 = _console2?.log ?? noop_default2;
    info3 = _console2?.info ?? log3;
    trace3 = _console2?.trace ?? info3;
    debug3 = _console2?.debug ?? log3;
    table3 = _console2?.table ?? log3;
    error3 = _console2?.error ?? log3;
    warn3 = _console2?.warn ?? error3;
    createTask3 = _console2?.createTask ?? /* @__PURE__ */ notImplemented2("console.createTask");
    clear3 = _console2?.clear ?? noop_default2;
    count3 = _console2?.count ?? noop_default2;
    countReset3 = _console2?.countReset ?? noop_default2;
    dir3 = _console2?.dir ?? noop_default2;
    dirxml3 = _console2?.dirxml ?? noop_default2;
    group3 = _console2?.group ?? noop_default2;
    groupEnd3 = _console2?.groupEnd ?? noop_default2;
    groupCollapsed3 = _console2?.groupCollapsed ?? noop_default2;
    profile3 = _console2?.profile ?? noop_default2;
    profileEnd3 = _console2?.profileEnd ?? noop_default2;
    time3 = _console2?.time ?? noop_default2;
    timeEnd3 = _console2?.timeEnd ?? noop_default2;
    timeLog3 = _console2?.timeLog ?? noop_default2;
    timeStamp3 = _console2?.timeStamp ?? noop_default2;
    Console2 = _console2?.Console ?? /* @__PURE__ */ notImplementedClass2("console.Console");
    _times2 = /* @__PURE__ */ new Map();
    _stdoutErrorHandler2 = noop_default2;
    _stderrErrorHandler2 = noop_default2;
  }
});
var workerdConsole2;
var assert3;
var clear22;
var context2;
var count22;
var countReset22;
var createTask22;
var debug22;
var dir22;
var dirxml22;
var error22;
var group22;
var groupCollapsed22;
var groupEnd22;
var info22;
var log22;
var profile22;
var profileEnd22;
var table22;
var time22;
var timeEnd22;
var timeLog22;
var timeStamp22;
var trace22;
var warn22;
var console_default2;
var init_console2 = __esm({
  "../node_modules/@cloudflare/unenv-preset/dist/runtime/node/console.mjs"() {
    init_functionsRoutes_0_9739269091816841();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_console();
    workerdConsole2 = globalThis["console"];
    ({
      assert: assert3,
      clear: clear22,
      context: (
        // @ts-expect-error undocumented public API
        context2
      ),
      count: count22,
      countReset: countReset22,
      createTask: (
        // @ts-expect-error undocumented public API
        createTask22
      ),
      debug: debug22,
      dir: dir22,
      dirxml: dirxml22,
      error: error22,
      group: group22,
      groupCollapsed: groupCollapsed22,
      groupEnd: groupEnd22,
      info: info22,
      log: log22,
      profile: profile22,
      profileEnd: profileEnd22,
      table: table22,
      time: time22,
      timeEnd: timeEnd22,
      timeLog: timeLog22,
      timeStamp: timeStamp22,
      trace: trace22,
      warn: warn22
    } = workerdConsole2);
    Object.assign(workerdConsole2, {
      Console: Console2,
      _ignoreErrors: _ignoreErrors2,
      _stderr: _stderr2,
      _stderrErrorHandler: _stderrErrorHandler2,
      _stdout: _stdout2,
      _stdoutErrorHandler: _stdoutErrorHandler2,
      _times: _times2
    });
    console_default2 = workerdConsole2;
  }
});
var init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console = __esm({
  "../node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-console"() {
    init_console2();
    globalThis.console = console_default2;
  }
});
var hrtime4;
var init_hrtime = __esm({
  "../node_modules/unenv/dist/runtime/node/internal/process/hrtime.mjs"() {
    init_functionsRoutes_0_9739269091816841();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    hrtime4 = /* @__PURE__ */ Object.assign(/* @__PURE__ */ __name2(/* @__PURE__ */ __name(function hrtime22(startTime) {
      const now = Date.now();
      const seconds = Math.trunc(now / 1e3);
      const nanos = now % 1e3 * 1e6;
      if (startTime) {
        let diffSeconds = seconds - startTime[0];
        let diffNanos = nanos - startTime[0];
        if (diffNanos < 0) {
          diffSeconds = diffSeconds - 1;
          diffNanos = 1e9 + diffNanos;
        }
        return [diffSeconds, diffNanos];
      }
      return [seconds, nanos];
    }, "hrtime2"), "hrtime"), { bigint: /* @__PURE__ */ __name2(/* @__PURE__ */ __name(function bigint2() {
      return BigInt(Date.now() * 1e6);
    }, "bigint"), "bigint") });
  }
});
var ReadStream2;
var init_read_stream = __esm({
  "../node_modules/unenv/dist/runtime/node/internal/tty/read-stream.mjs"() {
    init_functionsRoutes_0_9739269091816841();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    ReadStream2 = class {
      static {
        __name(this, "ReadStream");
      }
      static {
        __name2(this, "ReadStream");
      }
      fd;
      isRaw = false;
      isTTY = false;
      constructor(fd) {
        this.fd = fd;
      }
      setRawMode(mode) {
        this.isRaw = mode;
        return this;
      }
    };
  }
});
var WriteStream2;
var init_write_stream = __esm({
  "../node_modules/unenv/dist/runtime/node/internal/tty/write-stream.mjs"() {
    init_functionsRoutes_0_9739269091816841();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    WriteStream2 = class {
      static {
        __name(this, "WriteStream");
      }
      static {
        __name2(this, "WriteStream");
      }
      fd;
      columns = 80;
      rows = 24;
      isTTY = false;
      constructor(fd) {
        this.fd = fd;
      }
      clearLine(dir32, callback) {
        callback && callback();
        return false;
      }
      clearScreenDown(callback) {
        callback && callback();
        return false;
      }
      cursorTo(x, y, callback) {
        callback && typeof callback === "function" && callback();
        return false;
      }
      moveCursor(dx, dy, callback) {
        callback && callback();
        return false;
      }
      getColorDepth(env22) {
        return 1;
      }
      hasColors(count32, env22) {
        return false;
      }
      getWindowSize() {
        return [this.columns, this.rows];
      }
      write(str, encoding, cb) {
        if (str instanceof Uint8Array) {
          str = new TextDecoder().decode(str);
        }
        try {
          console.log(str);
        } catch {
        }
        cb && typeof cb === "function" && cb();
        return false;
      }
    };
  }
});
var init_tty = __esm({
  "../node_modules/unenv/dist/runtime/node/tty.mjs"() {
    init_functionsRoutes_0_9739269091816841();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_read_stream();
    init_write_stream();
  }
});
var NODE_VERSION2;
var init_node_version = __esm({
  "../node_modules/unenv/dist/runtime/node/internal/process/node-version.mjs"() {
    init_functionsRoutes_0_9739269091816841();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    NODE_VERSION2 = "22.14.0";
  }
});
var Process2;
var init_process = __esm({
  "../node_modules/unenv/dist/runtime/node/internal/process/process.mjs"() {
    init_functionsRoutes_0_9739269091816841();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_tty();
    init_utils();
    init_node_version();
    Process2 = class _Process extends EventEmitter2 {
      static {
        __name(this, "_Process");
      }
      static {
        __name2(this, "Process");
      }
      env;
      hrtime;
      nextTick;
      constructor(impl) {
        super();
        this.env = impl.env;
        this.hrtime = impl.hrtime;
        this.nextTick = impl.nextTick;
        for (const prop of [...Object.getOwnPropertyNames(_Process.prototype), ...Object.getOwnPropertyNames(EventEmitter2.prototype)]) {
          const value = this[prop];
          if (typeof value === "function") {
            this[prop] = value.bind(this);
          }
        }
      }
      // --- event emitter ---
      emitWarning(warning, type, code) {
        console.warn(`${code ? `[${code}] ` : ""}${type ? `${type}: ` : ""}${warning}`);
      }
      emit(...args) {
        return super.emit(...args);
      }
      listeners(eventName) {
        return super.listeners(eventName);
      }
      // --- stdio (lazy initializers) ---
      #stdin;
      #stdout;
      #stderr;
      get stdin() {
        return this.#stdin ??= new ReadStream2(0);
      }
      get stdout() {
        return this.#stdout ??= new WriteStream2(1);
      }
      get stderr() {
        return this.#stderr ??= new WriteStream2(2);
      }
      // --- cwd ---
      #cwd = "/";
      chdir(cwd22) {
        this.#cwd = cwd22;
      }
      cwd() {
        return this.#cwd;
      }
      // --- dummy props and getters ---
      arch = "";
      platform = "";
      argv = [];
      argv0 = "";
      execArgv = [];
      execPath = "";
      title = "";
      pid = 200;
      ppid = 100;
      get version() {
        return `v${NODE_VERSION2}`;
      }
      get versions() {
        return { node: NODE_VERSION2 };
      }
      get allowedNodeEnvironmentFlags() {
        return /* @__PURE__ */ new Set();
      }
      get sourceMapsEnabled() {
        return false;
      }
      get debugPort() {
        return 0;
      }
      get throwDeprecation() {
        return false;
      }
      get traceDeprecation() {
        return false;
      }
      get features() {
        return {};
      }
      get release() {
        return {};
      }
      get connected() {
        return false;
      }
      get config() {
        return {};
      }
      get moduleLoadList() {
        return [];
      }
      constrainedMemory() {
        return 0;
      }
      availableMemory() {
        return 0;
      }
      uptime() {
        return 0;
      }
      resourceUsage() {
        return {};
      }
      // --- noop methods ---
      ref() {
      }
      unref() {
      }
      // --- unimplemented methods ---
      umask() {
        throw /* @__PURE__ */ createNotImplementedError2("process.umask");
      }
      getBuiltinModule() {
        return void 0;
      }
      getActiveResourcesInfo() {
        throw /* @__PURE__ */ createNotImplementedError2("process.getActiveResourcesInfo");
      }
      exit() {
        throw /* @__PURE__ */ createNotImplementedError2("process.exit");
      }
      reallyExit() {
        throw /* @__PURE__ */ createNotImplementedError2("process.reallyExit");
      }
      kill() {
        throw /* @__PURE__ */ createNotImplementedError2("process.kill");
      }
      abort() {
        throw /* @__PURE__ */ createNotImplementedError2("process.abort");
      }
      dlopen() {
        throw /* @__PURE__ */ createNotImplementedError2("process.dlopen");
      }
      setSourceMapsEnabled() {
        throw /* @__PURE__ */ createNotImplementedError2("process.setSourceMapsEnabled");
      }
      loadEnvFile() {
        throw /* @__PURE__ */ createNotImplementedError2("process.loadEnvFile");
      }
      disconnect() {
        throw /* @__PURE__ */ createNotImplementedError2("process.disconnect");
      }
      cpuUsage() {
        throw /* @__PURE__ */ createNotImplementedError2("process.cpuUsage");
      }
      setUncaughtExceptionCaptureCallback() {
        throw /* @__PURE__ */ createNotImplementedError2("process.setUncaughtExceptionCaptureCallback");
      }
      hasUncaughtExceptionCaptureCallback() {
        throw /* @__PURE__ */ createNotImplementedError2("process.hasUncaughtExceptionCaptureCallback");
      }
      initgroups() {
        throw /* @__PURE__ */ createNotImplementedError2("process.initgroups");
      }
      openStdin() {
        throw /* @__PURE__ */ createNotImplementedError2("process.openStdin");
      }
      assert() {
        throw /* @__PURE__ */ createNotImplementedError2("process.assert");
      }
      binding() {
        throw /* @__PURE__ */ createNotImplementedError2("process.binding");
      }
      // --- attached interfaces ---
      permission = { has: /* @__PURE__ */ notImplemented2("process.permission.has") };
      report = {
        directory: "",
        filename: "",
        signal: "SIGUSR2",
        compact: false,
        reportOnFatalError: false,
        reportOnSignal: false,
        reportOnUncaughtException: false,
        getReport: /* @__PURE__ */ notImplemented2("process.report.getReport"),
        writeReport: /* @__PURE__ */ notImplemented2("process.report.writeReport")
      };
      finalization = {
        register: /* @__PURE__ */ notImplemented2("process.finalization.register"),
        unregister: /* @__PURE__ */ notImplemented2("process.finalization.unregister"),
        registerBeforeExit: /* @__PURE__ */ notImplemented2("process.finalization.registerBeforeExit")
      };
      memoryUsage = Object.assign(() => ({
        arrayBuffers: 0,
        rss: 0,
        external: 0,
        heapTotal: 0,
        heapUsed: 0
      }), { rss: /* @__PURE__ */ __name2(() => 0, "rss") });
      // --- undefined props ---
      mainModule = void 0;
      domain = void 0;
      // optional
      send = void 0;
      exitCode = void 0;
      channel = void 0;
      getegid = void 0;
      geteuid = void 0;
      getgid = void 0;
      getgroups = void 0;
      getuid = void 0;
      setegid = void 0;
      seteuid = void 0;
      setgid = void 0;
      setgroups = void 0;
      setuid = void 0;
      // internals
      _events = void 0;
      _eventsCount = void 0;
      _exiting = void 0;
      _maxListeners = void 0;
      _debugEnd = void 0;
      _debugProcess = void 0;
      _fatalException = void 0;
      _getActiveHandles = void 0;
      _getActiveRequests = void 0;
      _kill = void 0;
      _preload_modules = void 0;
      _rawDebug = void 0;
      _startProfilerIdleNotifier = void 0;
      _stopProfilerIdleNotifier = void 0;
      _tickCallback = void 0;
      _disconnect = void 0;
      _handleQueue = void 0;
      _pendingMessage = void 0;
      _channel = void 0;
      _send = void 0;
      _linkedBinding = void 0;
    };
  }
});
var globalProcess2;
var getBuiltinModule2;
var workerdProcess2;
var unenvProcess2;
var exit2;
var features2;
var platform2;
var _channel2;
var _debugEnd2;
var _debugProcess2;
var _disconnect2;
var _events2;
var _eventsCount2;
var _exiting2;
var _fatalException2;
var _getActiveHandles2;
var _getActiveRequests2;
var _handleQueue2;
var _kill2;
var _linkedBinding2;
var _maxListeners2;
var _pendingMessage2;
var _preload_modules2;
var _rawDebug2;
var _send2;
var _startProfilerIdleNotifier2;
var _stopProfilerIdleNotifier2;
var _tickCallback2;
var abort2;
var addListener2;
var allowedNodeEnvironmentFlags2;
var arch2;
var argv2;
var argv02;
var assert22;
var availableMemory2;
var binding2;
var channel2;
var chdir2;
var config2;
var connected2;
var constrainedMemory2;
var cpuUsage2;
var cwd2;
var debugPort2;
var disconnect2;
var dlopen2;
var domain2;
var emit2;
var emitWarning2;
var env2;
var eventNames2;
var execArgv2;
var execPath2;
var exitCode2;
var finalization2;
var getActiveResourcesInfo2;
var getegid2;
var geteuid2;
var getgid2;
var getgroups2;
var getMaxListeners2;
var getuid2;
var hasUncaughtExceptionCaptureCallback2;
var hrtime32;
var initgroups2;
var kill2;
var listenerCount2;
var listeners2;
var loadEnvFile2;
var mainModule2;
var memoryUsage2;
var moduleLoadList2;
var nextTick2;
var off2;
var on2;
var once2;
var openStdin2;
var permission2;
var pid2;
var ppid2;
var prependListener2;
var prependOnceListener2;
var rawListeners2;
var reallyExit2;
var ref2;
var release2;
var removeAllListeners2;
var removeListener2;
var report2;
var resourceUsage2;
var send2;
var setegid2;
var seteuid2;
var setgid2;
var setgroups2;
var setMaxListeners2;
var setSourceMapsEnabled2;
var setuid2;
var setUncaughtExceptionCaptureCallback2;
var sourceMapsEnabled2;
var stderr2;
var stdin2;
var stdout2;
var throwDeprecation2;
var title2;
var traceDeprecation2;
var umask2;
var unref2;
var uptime2;
var version2;
var versions2;
var _process2;
var process_default2;
var init_process2 = __esm({
  "../node_modules/@cloudflare/unenv-preset/dist/runtime/node/process.mjs"() {
    init_functionsRoutes_0_9739269091816841();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_hrtime();
    init_process();
    globalProcess2 = globalThis["process"];
    getBuiltinModule2 = globalProcess2.getBuiltinModule;
    workerdProcess2 = getBuiltinModule2("node:process");
    unenvProcess2 = new Process2({
      env: globalProcess2.env,
      hrtime: hrtime4,
      // `nextTick` is available from workerd process v1
      nextTick: workerdProcess2.nextTick
    });
    ({ exit: exit2, features: features2, platform: platform2 } = workerdProcess2);
    ({
      _channel: _channel2,
      _debugEnd: _debugEnd2,
      _debugProcess: _debugProcess2,
      _disconnect: _disconnect2,
      _events: _events2,
      _eventsCount: _eventsCount2,
      _exiting: _exiting2,
      _fatalException: _fatalException2,
      _getActiveHandles: _getActiveHandles2,
      _getActiveRequests: _getActiveRequests2,
      _handleQueue: _handleQueue2,
      _kill: _kill2,
      _linkedBinding: _linkedBinding2,
      _maxListeners: _maxListeners2,
      _pendingMessage: _pendingMessage2,
      _preload_modules: _preload_modules2,
      _rawDebug: _rawDebug2,
      _send: _send2,
      _startProfilerIdleNotifier: _startProfilerIdleNotifier2,
      _stopProfilerIdleNotifier: _stopProfilerIdleNotifier2,
      _tickCallback: _tickCallback2,
      abort: abort2,
      addListener: addListener2,
      allowedNodeEnvironmentFlags: allowedNodeEnvironmentFlags2,
      arch: arch2,
      argv: argv2,
      argv0: argv02,
      assert: assert22,
      availableMemory: availableMemory2,
      binding: binding2,
      channel: channel2,
      chdir: chdir2,
      config: config2,
      connected: connected2,
      constrainedMemory: constrainedMemory2,
      cpuUsage: cpuUsage2,
      cwd: cwd2,
      debugPort: debugPort2,
      disconnect: disconnect2,
      dlopen: dlopen2,
      domain: domain2,
      emit: emit2,
      emitWarning: emitWarning2,
      env: env2,
      eventNames: eventNames2,
      execArgv: execArgv2,
      execPath: execPath2,
      exitCode: exitCode2,
      finalization: finalization2,
      getActiveResourcesInfo: getActiveResourcesInfo2,
      getegid: getegid2,
      geteuid: geteuid2,
      getgid: getgid2,
      getgroups: getgroups2,
      getMaxListeners: getMaxListeners2,
      getuid: getuid2,
      hasUncaughtExceptionCaptureCallback: hasUncaughtExceptionCaptureCallback2,
      hrtime: hrtime32,
      initgroups: initgroups2,
      kill: kill2,
      listenerCount: listenerCount2,
      listeners: listeners2,
      loadEnvFile: loadEnvFile2,
      mainModule: mainModule2,
      memoryUsage: memoryUsage2,
      moduleLoadList: moduleLoadList2,
      nextTick: nextTick2,
      off: off2,
      on: on2,
      once: once2,
      openStdin: openStdin2,
      permission: permission2,
      pid: pid2,
      ppid: ppid2,
      prependListener: prependListener2,
      prependOnceListener: prependOnceListener2,
      rawListeners: rawListeners2,
      reallyExit: reallyExit2,
      ref: ref2,
      release: release2,
      removeAllListeners: removeAllListeners2,
      removeListener: removeListener2,
      report: report2,
      resourceUsage: resourceUsage2,
      send: send2,
      setegid: setegid2,
      seteuid: seteuid2,
      setgid: setgid2,
      setgroups: setgroups2,
      setMaxListeners: setMaxListeners2,
      setSourceMapsEnabled: setSourceMapsEnabled2,
      setuid: setuid2,
      setUncaughtExceptionCaptureCallback: setUncaughtExceptionCaptureCallback2,
      sourceMapsEnabled: sourceMapsEnabled2,
      stderr: stderr2,
      stdin: stdin2,
      stdout: stdout2,
      throwDeprecation: throwDeprecation2,
      title: title2,
      traceDeprecation: traceDeprecation2,
      umask: umask2,
      unref: unref2,
      uptime: uptime2,
      version: version2,
      versions: versions2
    } = unenvProcess2);
    _process2 = {
      abort: abort2,
      addListener: addListener2,
      allowedNodeEnvironmentFlags: allowedNodeEnvironmentFlags2,
      hasUncaughtExceptionCaptureCallback: hasUncaughtExceptionCaptureCallback2,
      setUncaughtExceptionCaptureCallback: setUncaughtExceptionCaptureCallback2,
      loadEnvFile: loadEnvFile2,
      sourceMapsEnabled: sourceMapsEnabled2,
      arch: arch2,
      argv: argv2,
      argv0: argv02,
      chdir: chdir2,
      config: config2,
      connected: connected2,
      constrainedMemory: constrainedMemory2,
      availableMemory: availableMemory2,
      cpuUsage: cpuUsage2,
      cwd: cwd2,
      debugPort: debugPort2,
      dlopen: dlopen2,
      disconnect: disconnect2,
      emit: emit2,
      emitWarning: emitWarning2,
      env: env2,
      eventNames: eventNames2,
      execArgv: execArgv2,
      execPath: execPath2,
      exit: exit2,
      finalization: finalization2,
      features: features2,
      getBuiltinModule: getBuiltinModule2,
      getActiveResourcesInfo: getActiveResourcesInfo2,
      getMaxListeners: getMaxListeners2,
      hrtime: hrtime32,
      kill: kill2,
      listeners: listeners2,
      listenerCount: listenerCount2,
      memoryUsage: memoryUsage2,
      nextTick: nextTick2,
      on: on2,
      off: off2,
      once: once2,
      pid: pid2,
      platform: platform2,
      ppid: ppid2,
      prependListener: prependListener2,
      prependOnceListener: prependOnceListener2,
      rawListeners: rawListeners2,
      release: release2,
      removeAllListeners: removeAllListeners2,
      removeListener: removeListener2,
      report: report2,
      resourceUsage: resourceUsage2,
      setMaxListeners: setMaxListeners2,
      setSourceMapsEnabled: setSourceMapsEnabled2,
      stderr: stderr2,
      stdin: stdin2,
      stdout: stdout2,
      title: title2,
      throwDeprecation: throwDeprecation2,
      traceDeprecation: traceDeprecation2,
      umask: umask2,
      uptime: uptime2,
      version: version2,
      versions: versions2,
      // @ts-expect-error old API
      domain: domain2,
      initgroups: initgroups2,
      moduleLoadList: moduleLoadList2,
      reallyExit: reallyExit2,
      openStdin: openStdin2,
      assert: assert22,
      binding: binding2,
      send: send2,
      exitCode: exitCode2,
      channel: channel2,
      getegid: getegid2,
      geteuid: geteuid2,
      getgid: getgid2,
      getgroups: getgroups2,
      getuid: getuid2,
      setegid: setegid2,
      seteuid: seteuid2,
      setgid: setgid2,
      setgroups: setgroups2,
      setuid: setuid2,
      permission: permission2,
      mainModule: mainModule2,
      _events: _events2,
      _eventsCount: _eventsCount2,
      _exiting: _exiting2,
      _maxListeners: _maxListeners2,
      _debugEnd: _debugEnd2,
      _debugProcess: _debugProcess2,
      _fatalException: _fatalException2,
      _getActiveHandles: _getActiveHandles2,
      _getActiveRequests: _getActiveRequests2,
      _kill: _kill2,
      _preload_modules: _preload_modules2,
      _rawDebug: _rawDebug2,
      _startProfilerIdleNotifier: _startProfilerIdleNotifier2,
      _stopProfilerIdleNotifier: _stopProfilerIdleNotifier2,
      _tickCallback: _tickCallback2,
      _disconnect: _disconnect2,
      _handleQueue: _handleQueue2,
      _pendingMessage: _pendingMessage2,
      _channel: _channel2,
      _send: _send2,
      _linkedBinding: _linkedBinding2
    };
    process_default2 = _process2;
  }
});
var init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process = __esm({
  "../node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-process"() {
    init_process2();
    globalThis.process = process_default2;
  }
});
var ADMIN_KEY;
var json;
var unauthorized;
var onRequestPut;
var onRequestDelete;
var init_id = __esm({
  "api/admin/banners/[id].ts"() {
    init_functionsRoutes_0_9739269091816841();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    ADMIN_KEY = "1663017721@";
    json = /* @__PURE__ */ __name2((data, status = 200) => new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } }), "json");
    unauthorized = /* @__PURE__ */ __name2(() => json({ error: "Unauthorized" }, 401), "unauthorized");
    onRequestPut = /* @__PURE__ */ __name2(async ({ env: env22, request, params }) => {
      if (request.headers.get("x-admin-key") !== ADMIN_KEY) return unauthorized();
      try {
        const existing = await env22.DB.prepare("SELECT * FROM feature_banners WHERE id = ?").bind(params.id).first();
        if (!existing) return json({ error: "Banner not found" }, 404);
        const b = await request.json();
        const m = { ...existing, ...b };
        await env22.DB.prepare(
          'UPDATE feature_banners SET title=?, subtitle=?, description=?, image=?, buttonText=?, bgColor=?, "order"=?, isActive=? WHERE id=?'
        ).bind(m.title || null, m.subtitle || null, m.description || null, m.image || null, m.buttonText || null, m.bgColor || null, m.order ?? 0, m.isActive ? 1 : 0, params.id).run();
        return json({ success: true });
      } catch (e) {
        return json({ error: e.message ?? "Internal error" }, 500);
      }
    }, "onRequestPut");
    onRequestDelete = /* @__PURE__ */ __name2(async ({ env: env22, request, params }) => {
      if (request.headers.get("x-admin-key") !== ADMIN_KEY) return unauthorized();
      try {
        const result = await env22.DB.prepare("DELETE FROM feature_banners WHERE id = ?").bind(params.id).run();
        if (result.meta.changes === 0) return json({ error: "Banner not found" }, 404);
        return json({ success: true });
      } catch (e) {
        return json({ error: e.message ?? "Internal error" }, 500);
      }
    }, "onRequestDelete");
  }
});
var ADMIN_KEY2;
var json2;
var unauthorized2;
var onRequestPut2;
var onRequestDelete2;
var init_id2 = __esm({
  "api/admin/brands/[id].ts"() {
    init_functionsRoutes_0_9739269091816841();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    ADMIN_KEY2 = "1663017721@";
    json2 = /* @__PURE__ */ __name2((data, status = 200) => new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } }), "json");
    unauthorized2 = /* @__PURE__ */ __name2(() => json2({ error: "Unauthorized" }, 401), "unauthorized");
    onRequestPut2 = /* @__PURE__ */ __name2(async ({ env: env22, request, params }) => {
      if (request.headers.get("x-admin-key") !== ADMIN_KEY2) return unauthorized2();
      try {
        const b = await request.json();
        if (!b.name) return json2({ error: "Missing required field: name" }, 400);
        const result = await env22.DB.prepare(
          'UPDATE brands SET name=?, logo=?, "order"=?, isActive=? WHERE id=?'
        ).bind(b.name, b.logo || null, b.order ?? 0, b.isActive ? 1 : 0, params.id).run();
        if (result.meta.changes === 0) return json2({ error: "Brand not found" }, 404);
        return json2({ success: true });
      } catch (e) {
        return json2({ error: e.message ?? "Internal error" }, 500);
      }
    }, "onRequestPut");
    onRequestDelete2 = /* @__PURE__ */ __name2(async ({ env: env22, request, params }) => {
      if (request.headers.get("x-admin-key") !== ADMIN_KEY2) return unauthorized2();
      try {
        const result = await env22.DB.prepare("DELETE FROM brands WHERE id = ?").bind(params.id).run();
        if (result.meta.changes === 0) return json2({ error: "Brand not found" }, 404);
        return json2({ success: true });
      } catch (e) {
        return json2({ error: e.message ?? "Internal error" }, 500);
      }
    }, "onRequestDelete");
  }
});
var ADMIN_KEY3;
var json3;
var unauthorized3;
var onRequestPut3;
var onRequestDelete3;
var init_id3 = __esm({
  "api/admin/categories/[id].ts"() {
    init_functionsRoutes_0_9739269091816841();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    ADMIN_KEY3 = "1663017721@";
    json3 = /* @__PURE__ */ __name2((data, status = 200) => new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } }), "json");
    unauthorized3 = /* @__PURE__ */ __name2(() => json3({ error: "Unauthorized" }, 401), "unauthorized");
    onRequestPut3 = /* @__PURE__ */ __name2(async ({ env: env22, request, params }) => {
      if (request.headers.get("x-admin-key") !== ADMIN_KEY3) return unauthorized3();
      try {
        const b = await request.json();
        if (!b.name) return json3({ error: "Missing required field: name" }, 400);
        const result = await env22.DB.prepare(
          'UPDATE categories SET name=?, "order"=?, isActive=? WHERE id=?'
        ).bind(b.name, b.order ?? 0, b.isActive ? 1 : 0, params.id).run();
        if (result.meta.changes === 0) return json3({ error: "Category not found" }, 404);
        return json3({ success: true });
      } catch (e) {
        return json3({ error: e.message ?? "Internal error" }, 500);
      }
    }, "onRequestPut");
    onRequestDelete3 = /* @__PURE__ */ __name2(async ({ env: env22, request, params }) => {
      if (request.headers.get("x-admin-key") !== ADMIN_KEY3) return unauthorized3();
      try {
        await env22.DB.prepare("DELETE FROM product_categories WHERE category_id = ?").bind(params.id).run();
        const result = await env22.DB.prepare("DELETE FROM categories WHERE id = ?").bind(params.id).run();
        if (result.meta.changes === 0) return json3({ error: "Category not found" }, 404);
        return json3({ success: true });
      } catch (e) {
        return json3({ error: e.message ?? "Internal error" }, 500);
      }
    }, "onRequestDelete");
  }
});
var ADMIN_KEY4;
var json4;
var unauthorized4;
var onRequestPut4;
var onRequestDelete4;
var init_id4 = __esm({
  "api/admin/heroes/[id].ts"() {
    init_functionsRoutes_0_9739269091816841();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    ADMIN_KEY4 = "1663017721@";
    json4 = /* @__PURE__ */ __name2((data, status = 200) => new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } }), "json");
    unauthorized4 = /* @__PURE__ */ __name2(() => json4({ error: "Unauthorized" }, 401), "unauthorized");
    onRequestPut4 = /* @__PURE__ */ __name2(async ({ env: env22, request, params }) => {
      if (request.headers.get("x-admin-key") !== ADMIN_KEY4) return unauthorized4();
      try {
        const existing = await env22.DB.prepare("SELECT * FROM heroes WHERE id = ?").bind(params.id).first();
        if (!existing) return json4({ error: "Hero not found" }, 404);
        const b = await request.json();
        const merged = { ...existing, ...b };
        await env22.DB.prepare(
          'UPDATE heroes SET campaignName=?, category=?, description=?, slogan=?, imageUrl=?, videoUrl=?, ctaText=?, isActive=?, "order"=? WHERE id=?'
        ).bind(merged.campaignName || null, merged.category || null, merged.description || null, merged.slogan || null, merged.imageUrl || null, merged.videoUrl || null, merged.ctaText || "COMPRAR AHORA", merged.isActive ? 1 : 0, merged.order ?? 0, params.id).run();
        return json4({ success: true });
      } catch (e) {
        return json4({ error: e.message ?? "Internal error" }, 500);
      }
    }, "onRequestPut");
    onRequestDelete4 = /* @__PURE__ */ __name2(async ({ env: env22, request, params }) => {
      if (request.headers.get("x-admin-key") !== ADMIN_KEY4) return unauthorized4();
      try {
        const result = await env22.DB.prepare("DELETE FROM heroes WHERE id = ?").bind(params.id).run();
        if (result.meta.changes === 0) return json4({ error: "Hero not found" }, 404);
        return json4({ success: true });
      } catch (e) {
        return json4({ error: e.message ?? "Internal error" }, 500);
      }
    }, "onRequestDelete");
  }
});
var ADMIN_KEY5;
var json5;
var unauthorized5;
var onRequestGet;
var onRequestPut5;
var init_id5 = __esm({
  "api/admin/inventory/[id].ts"() {
    init_functionsRoutes_0_9739269091816841();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    ADMIN_KEY5 = "1663017721@";
    json5 = /* @__PURE__ */ __name2((data, status = 200) => new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } }), "json");
    unauthorized5 = /* @__PURE__ */ __name2(() => json5({ error: "Unauthorized" }, 401), "unauthorized");
    onRequestGet = /* @__PURE__ */ __name2(async ({ env: env22, request, params }) => {
      if (request.headers.get("x-admin-key") !== ADMIN_KEY5) return unauthorized5();
      try {
        const result = await env22.DB.prepare("SELECT size, stock FROM product_inventory WHERE product_id = ? ORDER BY CAST(size AS REAL)").bind(params.id).all();
        return json5(result.results);
      } catch (e) {
        return json5({ error: e.message ?? "Internal error" }, 500);
      }
    }, "onRequestGet");
    onRequestPut5 = /* @__PURE__ */ __name2(async ({ env: env22, request, params }) => {
      if (request.headers.get("x-admin-key") !== ADMIN_KEY5) return unauthorized5();
      try {
        const b = await request.json();
        if (!b.size || typeof b.stock !== "number" || b.stock < 0) {
          return json5({ error: "size y stock (>= 0) son requeridos" }, 400);
        }
        await env22.DB.prepare("UPDATE product_inventory SET stock = ? WHERE product_id = ? AND size = ?").bind(b.stock, params.id, b.size).run();
        return json5({ success: true });
      } catch (e) {
        return json5({ error: e.message ?? "Internal error" }, 500);
      }
    }, "onRequestPut");
  }
});
var ADMIN_KEY6;
var json6;
var unauthorized6;
var onRequestPut6;
var init_id6 = __esm({
  "api/admin/orders/[id].ts"() {
    init_functionsRoutes_0_9739269091816841();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    ADMIN_KEY6 = "1663017721@";
    json6 = /* @__PURE__ */ __name2((data, status = 200) => new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } }), "json");
    unauthorized6 = /* @__PURE__ */ __name2(() => json6({ error: "Unauthorized" }, 401), "unauthorized");
    onRequestPut6 = /* @__PURE__ */ __name2(async ({ env: env22, request, params }) => {
      if (request.headers.get("x-admin-key") !== ADMIN_KEY6) return unauthorized6();
      try {
        const id = Number(params["id"]);
        if (!id) return json6({ error: "ID inv\xE1lido" }, 400);
        const body = await request.json();
        const current = await env22.DB.prepare("SELECT id, status, shipping_status, tracking_number, shipping_notes FROM orders WHERE id = ?").bind(id).first();
        if (!current) return json6({ error: "Orden no encontrada" }, 404);
        const newStatus = body.status ?? current.status;
        const isCancelling = newStatus === "CANCELLED" && current.status !== "CANCELLED";
        await env22.DB.prepare(`
        UPDATE orders
        SET status           = ?,
            shipping_status  = ?,
            tracking_number  = ?,
            shipping_notes   = ?,
            cancelled_at     = ?,
            cancel_reason    = ?,
            updatedAt        = datetime('now')
        WHERE id = ?
      `).bind(
          newStatus,
          body.shipping_status ?? current.shipping_status,
          body.tracking_number !== void 0 ? body.tracking_number || null : current.tracking_number,
          body.shipping_notes !== void 0 ? body.shipping_notes || null : current.shipping_notes,
          isCancelling ? (/* @__PURE__ */ new Date()).toISOString() : null,
          isCancelling ? body.cancel_reason || null : null,
          id
        ).run();
        return json6({ ok: true });
      } catch (e) {
        return json6({ error: e.message ?? "Internal error" }, 500);
      }
    }, "onRequestPut");
  }
});
var ADMIN_KEY7;
var json7;
var unauthorized7;
var onRequestPut7;
var onRequestDelete5;
var init_id7 = __esm({
  "api/admin/products/[id].ts"() {
    init_functionsRoutes_0_9739269091816841();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    ADMIN_KEY7 = "1663017721@";
    json7 = /* @__PURE__ */ __name2((data, status = 200) => new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } }), "json");
    unauthorized7 = /* @__PURE__ */ __name2(() => json7({ error: "Unauthorized" }, 401), "unauthorized");
    onRequestPut7 = /* @__PURE__ */ __name2(async ({ env: env22, request, params }) => {
      if (request.headers.get("x-admin-key") !== ADMIN_KEY7) return unauthorized7();
      try {
        const b = await request.json();
        const price = Number(b.price);
        if (!b.name?.trim() || !Number.isFinite(price) || price <= 0) {
          return json7({ error: "name y price (n\xFAmero entero positivo) son requeridos" }, 400);
        }
        const result = await env22.DB.prepare(
          `UPDATE products SET name=?, model=?, price=?, brand_id=?, gender_id=?,
                           image=?, video=?, isBestSeller=?, isNew=?, badge=?, description=?, sizes=?
       WHERE id=?`
        ).bind(
          b.name.trim(),
          b.model?.trim() || null,
          Math.round(price),
          b.brand_id || null,
          b.gender_id || null,
          b.image || "",
          b.video || "",
          b.isBestSeller ? 1 : 0,
          b.isNew ? 1 : 0,
          b.badge?.trim() || "ORIGINAL",
          b.description || null,
          b.sizes || null,
          params.id
        ).run();
        if (result.meta.changes === 0) return json7({ error: "Producto no encontrado" }, 404);
        await env22.DB.prepare("DELETE FROM product_categories WHERE product_id = ?").bind(params.id).run();
        const categoryIds = Array.isArray(b.category_ids) ? b.category_ids : [];
        for (const cid of categoryIds) {
          if (cid) await env22.DB.prepare(
            "INSERT OR IGNORE INTO product_categories (product_id, category_id) VALUES (?, ?)"
          ).bind(params.id, cid).run();
        }
        await env22.DB.prepare("DELETE FROM product_sports WHERE product_id = ?").bind(params.id).run();
        const sportIds = Array.isArray(b.sport_ids) ? b.sport_ids : [];
        for (const sid of sportIds) {
          if (sid) await env22.DB.prepare(
            "INSERT OR IGNORE INTO product_sports (product_id, sport_id) VALUES (?, ?)"
          ).bind(params.id, sid).run();
        }
        await env22.DB.prepare("DELETE FROM product_images WHERE product_id = ?").bind(params.id).run();
        const gallery = Array.isArray(b.gallery) ? b.gallery : [];
        for (let i = 0; i < gallery.length; i++) {
          if (gallery[i]) {
            await env22.DB.prepare(
              "INSERT INTO product_images (product_id, url, sort_order) VALUES (?, ?, ?)"
            ).bind(params.id, gallery[i], i).run();
          }
        }
        const newSizes = (b.sizes || "").split(",").map((s) => s.trim()).filter(Boolean);
        const existingInv = await env22.DB.prepare("SELECT size FROM product_inventory WHERE product_id = ?").bind(params.id).all();
        const existingSizes = existingInv.results.map((r) => r.size);
        for (const size of newSizes) {
          if (!existingSizes.includes(size)) {
            await env22.DB.prepare(
              "INSERT OR IGNORE INTO product_inventory (product_id, size, stock) VALUES (?, ?, 1)"
            ).bind(params.id, size).run();
          }
        }
        for (const size of existingSizes) {
          if (!newSizes.includes(size)) {
            await env22.DB.prepare(
              "DELETE FROM product_inventory WHERE product_id = ? AND size = ?"
            ).bind(params.id, size).run();
          }
        }
        return json7({ success: true });
      } catch (e) {
        return json7({ error: e.message ?? "Internal error" }, 500);
      }
    }, "onRequestPut");
    onRequestDelete5 = /* @__PURE__ */ __name2(async ({ env: env22, request, params }) => {
      if (request.headers.get("x-admin-key") !== ADMIN_KEY7) return unauthorized7();
      try {
        await env22.DB.prepare("DELETE FROM product_categories WHERE product_id = ?").bind(params.id).run();
        await env22.DB.prepare("DELETE FROM product_sports WHERE product_id = ?").bind(params.id).run();
        const result = await env22.DB.prepare("DELETE FROM products WHERE id = ?").bind(params.id).run();
        if (result.meta.changes === 0) return json7({ error: "Producto no encontrado" }, 404);
        return json7({ success: true });
      } catch (e) {
        return json7({ error: e.message ?? "Internal error" }, 500);
      }
    }, "onRequestDelete");
  }
});
var ADMIN_KEY8;
var json8;
var unauthorized8;
var onRequestPut8;
var onRequestDelete6;
var init_id8 = __esm({
  "api/admin/sports/[id].ts"() {
    init_functionsRoutes_0_9739269091816841();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    ADMIN_KEY8 = "1663017721@";
    json8 = /* @__PURE__ */ __name2((data, status = 200) => new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } }), "json");
    unauthorized8 = /* @__PURE__ */ __name2(() => json8({ error: "Unauthorized" }, 401), "unauthorized");
    onRequestPut8 = /* @__PURE__ */ __name2(async ({ env: env22, request, params }) => {
      if (request.headers.get("x-admin-key") !== ADMIN_KEY8) return unauthorized8();
      try {
        const b = await request.json();
        if (!b.name) {
          return json8({ error: "Missing required field: name" }, 400);
        }
        const result = await env22.DB.prepare(
          'UPDATE sports SET name=?, icon=?, "order"=?, isActive=? WHERE id=?'
        ).bind(b.name, b.icon || null, b.order ?? 0, b.isActive ? 1 : 0, params.id).run();
        if (result.meta.changes === 0) return json8({ error: "Sport not found" }, 404);
        return json8({ success: true });
      } catch (e) {
        return json8({ error: e.message ?? "Internal error" }, 500);
      }
    }, "onRequestPut");
    onRequestDelete6 = /* @__PURE__ */ __name2(async ({ env: env22, request, params }) => {
      if (request.headers.get("x-admin-key") !== ADMIN_KEY8) return unauthorized8();
      try {
        await env22.DB.prepare("DELETE FROM product_sports WHERE sport_id = ?").bind(params.id).run();
        const result = await env22.DB.prepare("DELETE FROM sports WHERE id = ?").bind(params.id).run();
        if (result.meta.changes === 0) return json8({ error: "Sport not found" }, 404);
        return json8({ success: true });
      } catch (e) {
        return json8({ error: e.message ?? "Internal error" }, 500);
      }
    }, "onRequestDelete");
  }
});
var ADMIN_KEY9;
var json9;
var unauthorized9;
var onRequestPut9;
var init_id9 = __esm({
  "api/admin/users/[id].ts"() {
    init_functionsRoutes_0_9739269091816841();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    ADMIN_KEY9 = "1663017721@";
    json9 = /* @__PURE__ */ __name2((data, status = 200) => new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } }), "json");
    unauthorized9 = /* @__PURE__ */ __name2(() => json9({ error: "Unauthorized" }, 401), "unauthorized");
    onRequestPut9 = /* @__PURE__ */ __name2(async ({ env: env22, request, params }) => {
      if (request.headers.get("x-admin-key") !== ADMIN_KEY9) return unauthorized9();
      try {
        const id = Number(params["id"]);
        if (!id) return json9({ error: "ID inv\xE1lido" }, 400);
        const body = await request.json();
        const current = await env22.DB.prepare("SELECT id, email, full_name, phone, address FROM users WHERE id = ?").bind(id).first();
        if (!current) return json9({ error: "Usuario no encontrado" }, 404);
        const newEmail = body.email?.trim() || current.email;
        if (newEmail !== current.email) {
          const conflict = await env22.DB.prepare("SELECT id FROM users WHERE email = ? AND id != ?").bind(newEmail, id).first();
          if (conflict) return json9({ error: "Email ya en uso" }, 409);
        }
        await env22.DB.prepare(`
        UPDATE users
        SET full_name = ?, email = ?, phone = ?, address = ?
        WHERE id = ?
      `).bind(
          body.full_name !== void 0 ? body.full_name || null : current.full_name,
          newEmail,
          body.phone !== void 0 ? body.phone || null : current.phone,
          body.address !== void 0 ? body.address || null : current.address,
          id
        ).run();
        return json9({ ok: true });
      } catch (e) {
        return json9({ error: e.message ?? "Internal error" }, 500);
      }
    }, "onRequestPut");
  }
});
var helpers_exports = {};
__export(helpers_exports, {
  CORS_OPTIONS: /* @__PURE__ */ __name(() => CORS_OPTIONS, "CORS_OPTIONS"),
  JSON_HEADERS: /* @__PURE__ */ __name(() => JSON_HEADERS, "JSON_HEADERS"),
  clearSessionCookie: /* @__PURE__ */ __name(() => clearSessionCookie, "clearSessionCookie"),
  generateToken: /* @__PURE__ */ __name(() => generateToken, "generateToken"),
  getAuthenticatedUser: /* @__PURE__ */ __name(() => getAuthenticatedUser, "getAuthenticatedUser"),
  getTokenFromCookie: /* @__PURE__ */ __name(() => getTokenFromCookie, "getTokenFromCookie"),
  hashPassword: /* @__PURE__ */ __name(() => hashPassword, "hashPassword"),
  jsonErr: /* @__PURE__ */ __name(() => jsonErr, "jsonErr"),
  jsonOk: /* @__PURE__ */ __name(() => jsonOk, "jsonOk"),
  setSessionCookie: /* @__PURE__ */ __name(() => setSessionCookie, "setSessionCookie"),
  verifyPassword: /* @__PURE__ */ __name(() => verifyPassword, "verifyPassword")
});
function setSessionCookie(token) {
  return `${SESSION_COOKIE}=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${SESSION_MAX_AGE}`;
}
__name(setSessionCookie, "setSessionCookie");
function clearSessionCookie() {
  return `${SESSION_COOKIE}=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0`;
}
__name(clearSessionCookie, "clearSessionCookie");
function getTokenFromCookie(request) {
  const cookie = request.headers.get("Cookie") ?? "";
  for (const part of cookie.split(";")) {
    const trimmed = part.trim();
    if (trimmed.startsWith(SESSION_COOKIE + "=")) {
      return trimmed.slice(SESSION_COOKIE.length + 1) || null;
    }
  }
  return null;
}
__name(getTokenFromCookie, "getTokenFromCookie");
function jsonOk(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: JSON_HEADERS });
}
__name(jsonOk, "jsonOk");
function jsonErr(message, status = 400) {
  return new Response(JSON.stringify({ error: message }), { status, headers: JSON_HEADERS });
}
__name(jsonErr, "jsonErr");
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations: 1e5, hash: "SHA-256" },
    keyMaterial,
    256
  );
  const saltHex = Array.from(salt).map((b) => b.toString(16).padStart(2, "0")).join("");
  const hashHex = Array.from(new Uint8Array(bits)).map((b) => b.toString(16).padStart(2, "0")).join("");
  return `${saltHex}:${hashHex}`;
}
__name(hashPassword, "hashPassword");
async function verifyPassword(password, stored) {
  const [saltHex, hashHex] = stored.split(":");
  if (!saltHex || !hashHex) return false;
  const salt = new Uint8Array(saltHex.match(/.{2}/g).map((b) => parseInt(b, 16)));
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations: 1e5, hash: "SHA-256" },
    keyMaterial,
    256
  );
  const computed = Array.from(new Uint8Array(bits)).map((b) => b.toString(16).padStart(2, "0")).join("");
  return computed === hashHex;
}
__name(verifyPassword, "verifyPassword");
function generateToken() {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
}
__name(generateToken, "generateToken");
async function getAuthenticatedUser(request, DB) {
  const auth = request.headers.get("Authorization") ?? "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token) return null;
  const row = await DB.prepare(`
      SELECT u.id, u.email, u.full_name, u.phone, u.region, u.city, u.address, u.createdAt
      FROM user_sessions s
      JOIN users u ON u.id = s.user_id
      WHERE s.token = ?
        AND datetime(s.expires_at) > datetime('now')
    `).bind(token).first();
  return row ?? null;
}
__name(getAuthenticatedUser, "getAuthenticatedUser");
var JSON_HEADERS;
var CORS_OPTIONS;
var SESSION_COOKIE;
var SESSION_MAX_AGE;
var init_helpers = __esm({
  "api/auth/_helpers.ts"() {
    init_functionsRoutes_0_9739269091816841();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    JSON_HEADERS = {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    };
    CORS_OPTIONS = new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization"
      }
    });
    SESSION_COOKIE = "rs_session";
    SESSION_MAX_AGE = 30 * 24 * 60 * 60;
    __name2(setSessionCookie, "setSessionCookie");
    __name2(clearSessionCookie, "clearSessionCookie");
    __name2(getTokenFromCookie, "getTokenFromCookie");
    __name2(jsonOk, "jsonOk");
    __name2(jsonErr, "jsonErr");
    __name2(hashPassword, "hashPassword");
    __name2(verifyPassword, "verifyPassword");
    __name2(generateToken, "generateToken");
    __name2(getAuthenticatedUser, "getAuthenticatedUser");
  }
});
var onRequestOptions;
var onRequestGet2;
var onRequestPost;
var init_id10 = __esm({
  "api/auth/orders/[id].ts"() {
    init_functionsRoutes_0_9739269091816841();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_helpers();
    onRequestOptions = /* @__PURE__ */ __name2(async () => CORS_OPTIONS, "onRequestOptions");
    onRequestGet2 = /* @__PURE__ */ __name2(async ({ env: env22, request, params }) => {
      const user = await getAuthenticatedUser(request, env22.DB);
      if (!user) return jsonErr("No autenticado", 401);
      const id = Number(params["id"]);
      if (!id) return jsonErr("ID inv\xE1lido", 400);
      const order = await env22.DB.prepare(`
      SELECT id, reference, status, shipping_status, tracking_number,
             shipping_notes, total_in_cents, createdAt, updatedAt,
             cancelled_at, cancel_reason
      FROM orders
      WHERE id = ? AND user_id = ?
    `).bind(id, user.id).first();
      if (!order) return jsonErr("Pedido no encontrado", 404);
      const items = await env22.DB.prepare("SELECT * FROM order_items WHERE order_id = ?").bind(order.id).all();
      return jsonOk({ ...order, items: items.results });
    }, "onRequestGet");
    onRequestPost = /* @__PURE__ */ __name2(async ({ env: env22, request, params }) => {
      const user = await getAuthenticatedUser(request, env22.DB);
      if (!user) return jsonErr("No autenticado", 401);
      const id = Number(params["id"]);
      if (!id) return jsonErr("ID inv\xE1lido", 400);
      const order = await env22.DB.prepare("SELECT id, status, user_id FROM orders WHERE id = ? AND user_id = ?").bind(id, user.id).first();
      if (!order) return jsonErr("Pedido no encontrado", 404);
      const cancellable = ["PENDING", "RESERVED"];
      if (!cancellable.includes(order.status)) {
        return jsonErr("Este pedido ya no puede cancelarse", 400);
      }
      await env22.DB.prepare("UPDATE orders SET status = 'CANCELLED', cancelled_at = datetime('now'), cancel_reason = 'Cancelado por el usuario', updatedAt = datetime('now') WHERE id = ?").bind(id).run();
      return jsonOk({ ok: true, message: "Pedido cancelado correctamente" });
    }, "onRequestPost");
  }
});
var ADMIN_KEY10;
var json10;
var unauthorized10;
var onRequestGet3;
var init_analytics = __esm({
  "api/admin/analytics.ts"() {
    init_functionsRoutes_0_9739269091816841();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    ADMIN_KEY10 = "1663017721@";
    json10 = /* @__PURE__ */ __name2((data, status = 200) => new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } }), "json");
    unauthorized10 = /* @__PURE__ */ __name2(() => json10({ error: "Unauthorized" }, 401), "unauthorized");
    onRequestGet3 = /* @__PURE__ */ __name2(async ({ env: env22, request }) => {
      if (request.headers.get("x-admin-key") !== ADMIN_KEY10) return unauthorized10();
      try {
        const [daily, topPages, totals, orderStats] = await Promise.all([
          env22.DB.prepare(`
        SELECT date(created_at) AS day,
               COUNT(*)                          AS views,
               COUNT(DISTINCT session_id)        AS sessions
        FROM pageviews
        WHERE created_at >= datetime('now', '-30 days')
        GROUP BY day
        ORDER BY day ASC
      `).all(),
          env22.DB.prepare(`
        SELECT path, COUNT(*) AS views
        FROM pageviews
        WHERE created_at >= datetime('now', '-30 days')
        GROUP BY path
        ORDER BY views DESC
        LIMIT 10
      `).all(),
          env22.DB.prepare(`
        SELECT
          COUNT(*)                                                                       AS total,
          COUNT(CASE WHEN created_at >= datetime('now', '-1 day')  THEN 1 END)          AS today,
          COUNT(CASE WHEN created_at >= datetime('now', '-7 days') THEN 1 END)          AS week,
          COUNT(DISTINCT CASE WHEN created_at >= datetime('now', '-30 days') THEN session_id END) AS unique_sessions
        FROM pageviews
      `).first(),
          env22.DB.prepare(`
        SELECT
          COUNT(*)                                                                  AS total,
          COUNT(CASE WHEN status = 'APPROVED' THEN 1 END)                          AS approved,
          COUNT(CASE WHEN status = 'PENDING'  THEN 1 END)                          AS pending,
          COUNT(CASE WHEN status = 'DECLINED' THEN 1 END)                          AS declined,
          COUNT(CASE WHEN status = 'CANCELLED' THEN 1 END)                         AS cancelled,
          SUM(CASE WHEN status = 'APPROVED' THEN total_in_cents ELSE 0 END) / 100  AS revenue_cop
        FROM orders
      `).first()
        ]);
        return json10({ daily: daily.results, topPages: topPages.results, totals, orderStats });
      } catch (e) {
        return json10({ error: e.message ?? "Internal error" }, 500);
      }
    }, "onRequestGet");
  }
});
var ADMIN_KEY11;
var json11;
var unauthorized11;
var onRequestGet4;
var onRequestPost2;
var init_banners = __esm({
  "api/admin/banners.ts"() {
    init_functionsRoutes_0_9739269091816841();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    ADMIN_KEY11 = "1663017721@";
    json11 = /* @__PURE__ */ __name2((data, status = 200) => new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } }), "json");
    unauthorized11 = /* @__PURE__ */ __name2(() => json11({ error: "Unauthorized" }, 401), "unauthorized");
    onRequestGet4 = /* @__PURE__ */ __name2(async ({ env: env22, request }) => {
      if (request.headers.get("x-admin-key") !== ADMIN_KEY11) return unauthorized11();
      const result = await env22.DB.prepare('SELECT * FROM feature_banners ORDER BY "order" ASC').all();
      return json11(result.results);
    }, "onRequestGet");
    onRequestPost2 = /* @__PURE__ */ __name2(async ({ env: env22, request }) => {
      if (request.headers.get("x-admin-key") !== ADMIN_KEY11) return unauthorized11();
      try {
        const b = await request.json();
        const result = await env22.DB.prepare(
          'INSERT INTO feature_banners (title, subtitle, description, image, buttonText, bgColor, "order", isActive) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
        ).bind(b.title || null, b.subtitle || null, b.description || null, b.image || null, b.buttonText || null, b.bgColor || null, b.order ?? 0, b.isActive ? 1 : 0).run();
        return json11({ id: result.meta.last_row_id }, 201);
      } catch (e) {
        return json11({ error: e.message ?? "Internal error" }, 500);
      }
    }, "onRequestPost");
  }
});
var ADMIN_KEY12;
var json12;
var unauthorized12;
var onRequestGet5;
var onRequestPost3;
var init_brands = __esm({
  "api/admin/brands.ts"() {
    init_functionsRoutes_0_9739269091816841();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    ADMIN_KEY12 = "1663017721@";
    json12 = /* @__PURE__ */ __name2((data, status = 200) => new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } }), "json");
    unauthorized12 = /* @__PURE__ */ __name2(() => json12({ error: "Unauthorized" }, 401), "unauthorized");
    onRequestGet5 = /* @__PURE__ */ __name2(async ({ env: env22, request }) => {
      if (request.headers.get("x-admin-key") !== ADMIN_KEY12) return unauthorized12();
      try {
        const result = await env22.DB.prepare('SELECT * FROM brands ORDER BY "order" ASC').all();
        return json12(result.results);
      } catch (e) {
        return json12({ error: e.message ?? "Internal error" }, 500);
      }
    }, "onRequestGet");
    onRequestPost3 = /* @__PURE__ */ __name2(async ({ env: env22, request }) => {
      if (request.headers.get("x-admin-key") !== ADMIN_KEY12) return unauthorized12();
      try {
        const b = await request.json();
        if (!b.name) return json12({ error: "Missing required field: name" }, 400);
        const result = await env22.DB.prepare(
          'INSERT INTO brands (name, logo, "order", isActive) VALUES (?, ?, ?, ?)'
        ).bind(b.name, b.logo || null, b.order ?? 0, b.isActive ? 1 : 0).run();
        return json12({ id: result.meta.last_row_id }, 201);
      } catch (e) {
        return json12({ error: e.message ?? "Internal error" }, 500);
      }
    }, "onRequestPost");
  }
});
var ADMIN_KEY13;
var json13;
var unauthorized13;
var onRequestGet6;
var onRequestPost4;
var init_categories = __esm({
  "api/admin/categories.ts"() {
    init_functionsRoutes_0_9739269091816841();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    ADMIN_KEY13 = "1663017721@";
    json13 = /* @__PURE__ */ __name2((data, status = 200) => new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } }), "json");
    unauthorized13 = /* @__PURE__ */ __name2(() => json13({ error: "Unauthorized" }, 401), "unauthorized");
    onRequestGet6 = /* @__PURE__ */ __name2(async ({ env: env22, request }) => {
      if (request.headers.get("x-admin-key") !== ADMIN_KEY13) return unauthorized13();
      try {
        const result = await env22.DB.prepare('SELECT * FROM categories ORDER BY "order" ASC').all();
        return json13(result.results);
      } catch (e) {
        return json13({ error: e.message ?? "Internal error" }, 500);
      }
    }, "onRequestGet");
    onRequestPost4 = /* @__PURE__ */ __name2(async ({ env: env22, request }) => {
      if (request.headers.get("x-admin-key") !== ADMIN_KEY13) return unauthorized13();
      try {
        const b = await request.json();
        if (!b.name) return json13({ error: "Missing required field: name" }, 400);
        const result = await env22.DB.prepare(
          'INSERT INTO categories (name, "order", isActive) VALUES (?, ?, ?)'
        ).bind(b.name, b.order ?? 0, b.isActive !== false ? 1 : 0).run();
        return json13({ id: result.meta.last_row_id }, 201);
      } catch (e) {
        return json13({ error: e.message ?? "Internal error" }, 500);
      }
    }, "onRequestPost");
  }
});
var ADMIN_KEY14;
var json14;
var unauthorized14;
var onRequestGet7;
var init_genders = __esm({
  "api/admin/genders.ts"() {
    init_functionsRoutes_0_9739269091816841();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    ADMIN_KEY14 = "1663017721@";
    json14 = /* @__PURE__ */ __name2((data, status = 200) => new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } }), "json");
    unauthorized14 = /* @__PURE__ */ __name2(() => json14({ error: "Unauthorized" }, 401), "unauthorized");
    onRequestGet7 = /* @__PURE__ */ __name2(async ({ env: env22, request }) => {
      if (request.headers.get("x-admin-key") !== ADMIN_KEY14) return unauthorized14();
      try {
        const result = await env22.DB.prepare('SELECT * FROM genders ORDER BY "order" ASC').all();
        return json14(result.results);
      } catch (e) {
        return json14({ error: e.message ?? "Internal error" }, 500);
      }
    }, "onRequestGet");
  }
});
var ADMIN_KEY15;
var json15;
var unauthorized15;
var onRequestGet8;
var onRequestPost5;
var init_heroes = __esm({
  "api/admin/heroes.ts"() {
    init_functionsRoutes_0_9739269091816841();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    ADMIN_KEY15 = "1663017721@";
    json15 = /* @__PURE__ */ __name2((data, status = 200) => new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } }), "json");
    unauthorized15 = /* @__PURE__ */ __name2(() => json15({ error: "Unauthorized" }, 401), "unauthorized");
    onRequestGet8 = /* @__PURE__ */ __name2(async ({ env: env22, request }) => {
      if (request.headers.get("x-admin-key") !== ADMIN_KEY15) return unauthorized15();
      try {
        const result = await env22.DB.prepare('SELECT * FROM heroes ORDER BY "order" ASC').all();
        return json15(result.results);
      } catch (e) {
        return json15({ error: e.message ?? "Internal error" }, 500);
      }
    }, "onRequestGet");
    onRequestPost5 = /* @__PURE__ */ __name2(async ({ env: env22, request }) => {
      if (request.headers.get("x-admin-key") !== ADMIN_KEY15) return unauthorized15();
      try {
        const b = await request.json();
        const result = await env22.DB.prepare(
          'INSERT INTO heroes (campaignName, category, description, slogan, imageUrl, videoUrl, ctaText, isActive, "order") VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
        ).bind(b.campaignName || null, b.category || null, b.description || null, b.slogan || null, b.imageUrl || null, b.videoUrl || null, b.ctaText || "COMPRAR AHORA", b.isActive ? 1 : 0, b.order ?? 0).run();
        return json15({ id: result.meta.last_row_id }, 201);
      } catch (e) {
        return json15({ error: e.message ?? "Internal error" }, 500);
      }
    }, "onRequestPost");
  }
});
var ADMIN_KEY16;
var json16;
var unauthorized16;
var onRequestGet9;
var init_orders = __esm({
  "api/admin/orders.ts"() {
    init_functionsRoutes_0_9739269091816841();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    ADMIN_KEY16 = "1663017721@";
    json16 = /* @__PURE__ */ __name2((data, status = 200) => new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } }), "json");
    unauthorized16 = /* @__PURE__ */ __name2(() => json16({ error: "Unauthorized" }, 401), "unauthorized");
    onRequestGet9 = /* @__PURE__ */ __name2(async ({ env: env22, request }) => {
      if (request.headers.get("x-admin-key") !== ADMIN_KEY16) return unauthorized16();
      try {
        const url = new URL(request.url);
        const page = Math.max(1, parseInt(url.searchParams.get("page") ?? "1", 10) || 1);
        const limit = Math.min(200, Math.max(1, parseInt(url.searchParams.get("limit") ?? "50", 10) || 50));
        const offset = (page - 1) * limit;
        const dateFrom = url.searchParams.get("dateFrom") ?? "";
        const dateTo = url.searchParams.get("dateTo") ?? "";
        const search = (url.searchParams.get("search") ?? "").trim().toLowerCase();
        const sort = url.searchParams.get("sort") ?? "createdAt";
        const order = url.searchParams.get("order") === "asc" ? "ASC" : "DESC";
        const allowedSorts = {
          createdAt: "o.createdAt",
          total_in_cents: "o.total_in_cents",
          status: "o.status"
        };
        const sortCol = allowedSorts[sort] ?? "o.createdAt";
        const conditions = [];
        const params = [];
        if (dateFrom) {
          conditions.push("o.createdAt >= ?");
          params.push(dateFrom);
        }
        if (dateTo) {
          conditions.push("o.createdAt <= ?");
          params.push(dateTo + "T23:59:59");
        }
        if (search) {
          conditions.push(`(LOWER(o.reference) LIKE ? OR LOWER(u.email) LIKE ? OR LOWER(u.full_name) LIKE ?)`);
          const q = `%${search}%`;
          params.push(q, q, q);
        }
        const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
        const countResult = await env22.DB.prepare(`SELECT COUNT(*) as total FROM orders o LEFT JOIN users u ON u.id = o.user_id ${where}`).bind(...params).first();
        const totalOrders = countResult?.total ?? 0;
        const orders = await env22.DB.prepare(`
        SELECT o.id, o.reference, o.status, o.shipping_status, o.tracking_number,
               o.shipping_notes, o.total_in_cents, o.epayco_refpayco, o.createdAt,
               o.updatedAt, o.cancelled_at, o.cancel_reason,
               u.id   AS user_id,
               u.email AS user_email,
               u.full_name AS user_name,
               u.phone AS user_phone,
               u.region AS user_region,
               u.city AS user_city,
               u.address AS user_address
        FROM orders o
        LEFT JOIN users u ON u.id = o.user_id
        ${where}
        ORDER BY ${sortCol} ${order}
        LIMIT ? OFFSET ?
      `).bind(...params, limit, offset).all();
        if (!orders.results.length) return json16({ items: [], total: 0, page, limit });
        const ids = orders.results.map((o) => o.id);
        const placeholders = ids.map(() => "?").join(",");
        const items = await env22.DB.prepare(`SELECT * FROM order_items WHERE order_id IN (${placeholders})`).bind(...ids).all();
        const byOrder = {};
        for (const item of items.results) {
          if (!byOrder[item.order_id]) byOrder[item.order_id] = [];
          byOrder[item.order_id].push(item);
        }
        return json16({
          items: orders.results.map((o) => ({ ...o, items: byOrder[o.id] ?? [] })),
          total: totalOrders,
          page,
          limit
        });
      } catch (e) {
        return json16({ error: e.message ?? "Internal error" }, 500);
      }
    }, "onRequestGet");
  }
});
var ADMIN_KEY17;
var json17;
var unauthorized17;
var PRODUCT_SELECT;
var onRequestGet10;
var onRequestPost6;
var init_products = __esm({
  "api/admin/products.ts"() {
    init_functionsRoutes_0_9739269091816841();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    ADMIN_KEY17 = "1663017721@";
    json17 = /* @__PURE__ */ __name2((data, status = 200) => new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } }), "json");
    unauthorized17 = /* @__PURE__ */ __name2(() => json17({ error: "Unauthorized" }, 401), "unauthorized");
    PRODUCT_SELECT = `
  SELECT
    p.id, p.name, p.model, p.price, p.image, p.video,
    p.brand_id, p.gender_id,
    p.isBestSeller, p.isNew, p.badge, p.description, p.sizes, p.createdAt,
    b.name AS brand,
    g.name AS gender,
    (SELECT GROUP_CONCAT(c.name, ',')
     FROM product_categories pc JOIN categories c ON c.id = pc.category_id
     WHERE pc.product_id = p.id) AS categories,
    (SELECT GROUP_CONCAT(s.name, ',')
     FROM product_sports ps JOIN sports s ON s.id = ps.sport_id
     WHERE ps.product_id = p.id) AS sports,
    (SELECT GROUP_CONCAT(pc2.category_id, ',')
     FROM product_categories pc2 WHERE pc2.product_id = p.id) AS category_ids,
    (SELECT GROUP_CONCAT(ps2.sport_id, ',')
     FROM product_sports ps2 WHERE ps2.product_id = p.id) AS sport_ids,
    (SELECT GROUP_CONCAT(url, ',')
     FROM (SELECT url FROM product_images WHERE product_id = p.id ORDER BY sort_order ASC)
    ) AS gallery,
    (SELECT COALESCE(SUM(pi.stock), 0) FROM product_inventory pi WHERE pi.product_id = p.id) AS total_stock,
    (SELECT GROUP_CONCAT(pi2.size || ':' || pi2.stock, ',') FROM product_inventory pi2 WHERE pi2.product_id = p.id) AS inventory_raw
  FROM products p
  LEFT JOIN brands  b ON b.id = p.brand_id
  LEFT JOIN genders g ON g.id = p.gender_id
`;
    onRequestGet10 = /* @__PURE__ */ __name2(async ({ env: env22, request }) => {
      if (request.headers.get("x-admin-key") !== ADMIN_KEY17) return unauthorized17();
      try {
        const result = await env22.DB.prepare(`${PRODUCT_SELECT} ORDER BY p.id ASC`).all();
        return json17(result.results);
      } catch (e) {
        return json17({ error: e.message ?? "Internal error" }, 500);
      }
    }, "onRequestGet");
    onRequestPost6 = /* @__PURE__ */ __name2(async ({ env: env22, request }) => {
      if (request.headers.get("x-admin-key") !== ADMIN_KEY17) return unauthorized17();
      try {
        const b = await request.json();
        const price = Number(b.price);
        if (!b.name?.trim() || !Number.isFinite(price) || price <= 0) {
          return json17({ error: "name y price (n\xFAmero entero positivo) son requeridos" }, 400);
        }
        const ins = await env22.DB.prepare(
          `INSERT INTO products (name, model, price, brand_id, gender_id,
                             image, video, isBestSeller, isNew, badge, description, sizes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        ).bind(
          b.name.trim(),
          b.model?.trim() || null,
          Math.round(price),
          b.brand_id || null,
          b.gender_id || null,
          b.image || "",
          b.video || "",
          b.isBestSeller ? 1 : 0,
          b.isNew ? 1 : 0,
          b.badge?.trim() || "ORIGINAL",
          b.description || null,
          b.sizes || null
        ).run();
        const productId = ins.meta.last_row_id;
        const categoryIds = Array.isArray(b.category_ids) ? b.category_ids : [];
        for (const cid of categoryIds) {
          if (cid) await env22.DB.prepare(
            "INSERT OR IGNORE INTO product_categories (product_id, category_id) VALUES (?, ?)"
          ).bind(productId, cid).run();
        }
        const sportIds = Array.isArray(b.sport_ids) ? b.sport_ids : [];
        for (const sid of sportIds) {
          if (sid) await env22.DB.prepare(
            "INSERT OR IGNORE INTO product_sports (product_id, sport_id) VALUES (?, ?)"
          ).bind(productId, sid).run();
        }
        const gallery = Array.isArray(b.gallery) ? b.gallery : [];
        for (let i = 0; i < gallery.length; i++) {
          if (gallery[i]) {
            await env22.DB.prepare(
              "INSERT INTO product_images (product_id, url, sort_order) VALUES (?, ?, ?)"
            ).bind(productId, gallery[i], i).run();
          }
        }
        const sizes = (b.sizes || "").split(",").map((s) => s.trim()).filter(Boolean);
        for (const size of sizes) {
          await env22.DB.prepare(
            "INSERT OR IGNORE INTO product_inventory (product_id, size, stock) VALUES (?, ?, 1)"
          ).bind(productId, size).run();
        }
        return json17({ id: productId }, 201);
      } catch (e) {
        return json17({ error: e.message ?? "Internal error" }, 500);
      }
    }, "onRequestPost");
  }
});
var ADMIN_KEY18;
var json18;
var unauthorized18;
var onRequestGet11;
var onRequestPost7;
var init_sports = __esm({
  "api/admin/sports.ts"() {
    init_functionsRoutes_0_9739269091816841();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    ADMIN_KEY18 = "1663017721@";
    json18 = /* @__PURE__ */ __name2((data, status = 200) => new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } }), "json");
    unauthorized18 = /* @__PURE__ */ __name2(() => json18({ error: "Unauthorized" }, 401), "unauthorized");
    onRequestGet11 = /* @__PURE__ */ __name2(async ({ env: env22, request }) => {
      if (request.headers.get("x-admin-key") !== ADMIN_KEY18) return unauthorized18();
      try {
        const result = await env22.DB.prepare('SELECT * FROM sports ORDER BY "order" ASC').all();
        return json18(result.results);
      } catch (e) {
        return json18({ error: e.message ?? "Internal error" }, 500);
      }
    }, "onRequestGet");
    onRequestPost7 = /* @__PURE__ */ __name2(async ({ env: env22, request }) => {
      if (request.headers.get("x-admin-key") !== ADMIN_KEY18) return unauthorized18();
      try {
        const b = await request.json();
        if (!b.name) {
          return json18({ error: "Missing required field: name" }, 400);
        }
        const result = await env22.DB.prepare(
          'INSERT INTO sports (name, icon, "order", isActive) VALUES (?, ?, ?, ?)'
        ).bind(b.name, b.icon || null, b.order ?? 0, b.isActive ? 1 : 0).run();
        return json18({ id: result.meta.last_row_id }, 201);
      } catch (e) {
        return json18({ error: e.message ?? "Internal error" }, 500);
      }
    }, "onRequestPost");
  }
});
var ADMIN_KEY19;
var json19;
var unauthorized19;
var onRequestPost8;
var onRequestGet12;
var onRequestDelete7;
var init_upload = __esm({
  "api/admin/upload.ts"() {
    init_functionsRoutes_0_9739269091816841();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    ADMIN_KEY19 = "1663017721@";
    json19 = /* @__PURE__ */ __name2((data, status = 200) => new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } }), "json");
    unauthorized19 = /* @__PURE__ */ __name2(() => json19({ error: "Unauthorized" }, 401), "unauthorized");
    onRequestPost8 = /* @__PURE__ */ __name2(async ({ env: env22, request }) => {
      if (request.headers.get("x-admin-key") !== ADMIN_KEY19) return unauthorized19();
      try {
        const formData = await request.formData();
        const entry = formData.get("file");
        if (!entry || typeof entry === "string") return json19({ error: "No file provided" }, 400);
        const file = entry;
        const ext = file.name.split(".").pop()?.toLowerCase() ?? "mp4";
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        const isVideo = file.type.startsWith("video/");
        const folder = isVideo ? "videos" : "images";
        const key = `${folder}/${Date.now()}-${safeName}`;
        const buffer = await file.arrayBuffer();
        await env22.IMAGES.put(key, buffer, { httpMetadata: { contentType: file.type } });
        return json19({ path: `/${key}`, key });
      } catch (e) {
        return json19({ error: e.message ?? "Internal error" }, 500);
      }
    }, "onRequestPost");
    onRequestGet12 = /* @__PURE__ */ __name2(async ({ env: env22, request }) => {
      if (request.headers.get("x-admin-key") !== ADMIN_KEY19) return unauthorized19();
      try {
        const url = new URL(request.url);
        const limit = Math.min(Math.max(parseInt(url.searchParams.get("limit") ?? "24"), 1), 100);
        const cursor = url.searchParams.get("cursor") ?? void 0;
        const list = await env22.IMAGES.list({ prefix: "images/", limit, cursor });
        const items = list.objects.map((o) => ({ key: o.key, path: `/${o.key}`, size: o.size, uploaded: o.uploaded }));
        return json19({ items, nextCursor: list.truncated ? list.cursor : null, hasMore: list.truncated });
      } catch (e) {
        return json19({ error: e.message ?? "Internal error" }, 500);
      }
    }, "onRequestGet");
    onRequestDelete7 = /* @__PURE__ */ __name2(async ({ env: env22, request }) => {
      if (request.headers.get("x-admin-key") !== ADMIN_KEY19) return unauthorized19();
      try {
        const body = await request.json();
        if (!body.key) return json19({ error: "Missing required field: key" }, 400);
        await env22.IMAGES.delete(body.key);
        return json19({ success: true });
      } catch (e) {
        return json19({ error: e.message ?? "Internal error" }, 500);
      }
    }, "onRequestDelete");
  }
});
function resolveContentType(rawCT, pathname) {
  const base = rawCT?.split(";")[0].trim().toLowerCase() ?? "";
  if (base.startsWith("image/")) return base === "image/jpg" ? "image/jpeg" : base;
  if (!base || base === "application/octet-stream" || base === "binary/octet-stream") {
    const ext = pathname.split(".").pop()?.toLowerCase() ?? "";
    return EXT_TO_MIME[ext] ?? null;
  }
  return null;
}
__name(resolveContentType, "resolveContentType");
var ADMIN_KEY20;
var json20;
var unauthorized20;
var EXT_TO_MIME;
var onRequestPost9;
var init_upload_url = __esm({
  "api/admin/upload-url.ts"() {
    init_functionsRoutes_0_9739269091816841();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    ADMIN_KEY20 = "1663017721@";
    json20 = /* @__PURE__ */ __name2((data, status = 200) => new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } }), "json");
    unauthorized20 = /* @__PURE__ */ __name2(() => json20({ error: "Unauthorized" }, 401), "unauthorized");
    EXT_TO_MIME = {
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      webp: "image/webp",
      gif: "image/gif",
      avif: "image/avif",
      bmp: "image/bmp",
      svg: "image/svg+xml"
    };
    __name2(resolveContentType, "resolveContentType");
    onRequestPost9 = /* @__PURE__ */ __name2(async ({ env: env22, request }) => {
      if (request.headers.get("x-admin-key") !== ADMIN_KEY20) return unauthorized20();
      try {
        const body = await request.json();
        const rawUrl = body.url?.trim();
        if (!rawUrl) return json20({ error: "Se requiere el campo url" }, 400);
        let parsedUrl;
        try {
          parsedUrl = new URL(rawUrl);
        } catch {
          return json20({ error: "URL inv\xE1lida" }, 400);
        }
        if (!["http:", "https:"].includes(parsedUrl.protocol)) {
          return json20({ error: "Solo se permiten URLs http/https" }, 400);
        }
        const imageRes = await fetch(rawUrl, {
          headers: { "User-Agent": "Mozilla/5.0 RutaSport-Admin/1.0", "Accept": "image/*,*/*" },
          redirect: "follow"
        });
        if (!imageRes.ok) {
          return json20({ error: `No se pudo descargar la imagen (HTTP ${imageRes.status})` }, 400);
        }
        const rawCT = imageRes.headers.get("content-type");
        const contentType = resolveContentType(rawCT, parsedUrl.pathname);
        if (!contentType) {
          return json20({ error: `No se pudo determinar el tipo de imagen. Content-Type recibido: "${rawCT ?? "ninguno"}"` }, 400);
        }
        const extMap = {
          "image/jpeg": "jpg",
          "image/png": "png",
          "image/webp": "webp",
          "image/gif": "gif",
          "image/avif": "avif",
          "image/bmp": "bmp",
          "image/svg+xml": "svg"
        };
        const ext = extMap[contentType] ?? "jpg";
        const rawName = parsedUrl.pathname.split("/").pop() || `image.${ext}`;
        const safeName = rawName.replace(/[^a-zA-Z0-9._-]/g, "_").replace(/\.[^.]+$/, "") || "image";
        const key = `images/${Date.now()}-${safeName}.${ext}`;
        const buffer = await imageRes.arrayBuffer();
        await env22.IMAGES.put(key, buffer, { httpMetadata: { contentType } });
        return json20({ path: `/${key}`, key });
      } catch (e) {
        return json20({ error: e.message ?? "Internal error" }, 500);
      }
    }, "onRequestPost");
  }
});
var ADMIN_KEY21;
var json21;
var unauthorized21;
var onRequestGet13;
var init_users = __esm({
  "api/admin/users.ts"() {
    init_functionsRoutes_0_9739269091816841();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    ADMIN_KEY21 = "1663017721@";
    json21 = /* @__PURE__ */ __name2((data, status = 200) => new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } }), "json");
    unauthorized21 = /* @__PURE__ */ __name2(() => json21({ error: "Unauthorized" }, 401), "unauthorized");
    onRequestGet13 = /* @__PURE__ */ __name2(async ({ env: env22, request }) => {
      if (request.headers.get("x-admin-key") !== ADMIN_KEY21) return unauthorized21();
      try {
        const users = await env22.DB.prepare(`
        SELECT u.id, u.email, u.full_name, u.phone, u.address, u.createdAt,
               COUNT(o.id) AS order_count
        FROM users u
        LEFT JOIN orders o ON o.user_id = u.id
        GROUP BY u.id
        ORDER BY u.createdAt DESC
      `).all();
        return json21(users.results);
      } catch (e) {
        return json21({ error: e.message ?? "Internal error" }, 500);
      }
    }, "onRequestGet");
  }
});
var ADMIN_KEY22;
var json22;
var unauthorized22;
var onRequestPost10;
var onRequestGet14;
var onRequestDelete8;
var init_videos = __esm({
  "api/admin/videos.ts"() {
    init_functionsRoutes_0_9739269091816841();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    ADMIN_KEY22 = "1663017721@";
    json22 = /* @__PURE__ */ __name2((data, status = 200) => new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } }), "json");
    unauthorized22 = /* @__PURE__ */ __name2(() => json22({ error: "Unauthorized" }, 401), "unauthorized");
    onRequestPost10 = /* @__PURE__ */ __name2(async ({ env: env22, request }) => {
      if (request.headers.get("x-admin-key") !== ADMIN_KEY22) return unauthorized22();
      try {
        const contentType = request.headers.get("content-type") ?? "";
        if (!contentType.startsWith("video/")) return json22({ error: "Solo se permiten archivos de video" }, 400);
        const rawFilename = request.headers.get("x-filename") ?? "video";
        const filename = decodeURIComponent(rawFilename);
        const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, "_");
        const key = `videos/${Date.now()}-${safeName}`;
        const buffer = await request.arrayBuffer();
        if (!buffer.byteLength) return json22({ error: "No file provided" }, 400);
        await env22.IMAGES.put(key, buffer, { httpMetadata: { contentType } });
        return json22({ path: `/${key}`, key });
      } catch (e) {
        return json22({ error: e.message ?? "Internal error" }, 500);
      }
    }, "onRequestPost");
    onRequestGet14 = /* @__PURE__ */ __name2(async ({ env: env22, request }) => {
      if (request.headers.get("x-admin-key") !== ADMIN_KEY22) return unauthorized22();
      try {
        const url = new URL(request.url);
        const limit = Math.min(Math.max(parseInt(url.searchParams.get("limit") ?? "24"), 1), 100);
        const cursor = url.searchParams.get("cursor") ?? void 0;
        const list = await env22.IMAGES.list({ prefix: "videos/", limit, cursor });
        const items = list.objects.map((o) => ({ key: o.key, path: `/${o.key}`, size: o.size, uploaded: o.uploaded }));
        return json22({ items, nextCursor: list.truncated ? list.cursor : null, hasMore: list.truncated });
      } catch (e) {
        return json22({ error: e.message ?? "Internal error" }, 500);
      }
    }, "onRequestGet");
    onRequestDelete8 = /* @__PURE__ */ __name2(async ({ env: env22, request }) => {
      if (request.headers.get("x-admin-key") !== ADMIN_KEY22) return unauthorized22();
      try {
        const body = await request.json();
        if (!body.key) return json22({ error: "Missing required field: key" }, 400);
        await env22.IMAGES.delete(body.key);
        return json22({ success: true });
      } catch (e) {
        return json22({ error: e.message ?? "Internal error" }, 500);
      }
    }, "onRequestDelete");
  }
});
var onRequestOptions2;
var onRequestPost11;
var init_pageview = __esm({
  "api/analytics/pageview.ts"() {
    init_functionsRoutes_0_9739269091816841();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    onRequestOptions2 = /* @__PURE__ */ __name2(async () => new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
      }
    }), "onRequestOptions");
    onRequestPost11 = /* @__PURE__ */ __name2(async ({ env: env22, request }) => {
      try {
        const body = await request.json();
        await env22.DB.prepare("INSERT INTO pageviews (path, referrer, session_id) VALUES (?, ?, ?)").bind(body.path ?? "/", body.referrer ?? null, body.session_id ?? null).run();
        return new Response(null, { status: 204 });
      } catch {
        return new Response(null, { status: 204 });
      }
    }, "onRequestPost");
  }
});
var onRequestOptions3;
var onRequestPost12;
var init_forgot_password = __esm({
  "api/auth/forgot-password.ts"() {
    init_functionsRoutes_0_9739269091816841();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_helpers();
    onRequestOptions3 = /* @__PURE__ */ __name2(async () => CORS_OPTIONS, "onRequestOptions");
    onRequestPost12 = /* @__PURE__ */ __name2(async ({ env: env22, request }) => {
      try {
        const body = await request.json();
        const email = body.email?.trim().toLowerCase();
        if (!email) return jsonErr("Email requerido");
        const row = await env22.DB.prepare("SELECT id, email FROM users WHERE email = ?").bind(email).first();
        if (!row) return jsonErr("Este correo no est\xE1 registrado", 404);
        const token = generateToken();
        const expiresAt = new Date(Date.now() + 36e5).toISOString();
        await env22.DB.prepare("INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES (?, ?, ?)").bind(row.id, token, expiresAt).run();
        const origin = "https://ruta-sport.com";
        const resetLink = `${origin}/recuperar/${token}`;
        const html = `
      <div style="max-width:520px;margin:0 auto;font-family:Arial,sans-serif;background:#050505;color:#fff;padding:40px 30px;border-radius:12px;">
        <div style="text-align:center;margin-bottom:32px;">
          <span style="font-size:26px;font-weight:900;letter-spacing:-.03em;">
            <span style="color:#fff;font-style:italic;">RUTA</span><span style="color:#E31C1C;font-style:italic;">SPORT</span>
          </span>
        </div>
        <h1 style="font-size:22px;font-weight:900;margin:0 0 12px;letter-spacing:-.02em;">Recupera tu acceso</h1>
        <p style="color:rgba(255,255,255,.6);font-size:14px;line-height:1.6;margin:0 0 28px;">
          Recibimos una solicitud para restablecer tu contrase\xF1a.<br>
          Haz clic en el bot\xF3n para crear una nueva:
        </p>
        <div style="text-align:center;margin-bottom:28px;">
          <a href="${resetLink}"
             style="display:inline-block;background:#E31C1C;color:#fff;text-decoration:none;
                    font-weight:900;font-size:13px;letter-spacing:.15em;text-transform:uppercase;
                    padding:14px 36px;border-radius:6px;">
            Restablecer contrase\xF1a
          </a>
        </div>
        <p style="color:rgba(255,255,255,.35);font-size:12px;line-height:1.5;margin:0;">
          Este enlace expira en 1 hora.<br>
          Si no solicitaste este cambio, ignora este mensaje.
        </p>
      </div>
    `;
        if (!env22.RESEND_API_KEY) {
          return jsonErr(
            "Configura RESEND_API_KEY en Cloudflare Pages > Settings > Environment Variables. Obt\xE9n una key gratis en https://resend.com (100 emails/d\xEDa)",
            500
          );
        }
        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${env22.RESEND_API_KEY}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            from: "RutaSport <noreply@ruta-sport.com>",
            to: email,
            subject: "Recuperaci\xF3n de contrase\xF1a \u2014 RutaSport",
            html
          })
        });
        if (!res.ok) {
          const err = await res.text();
          return jsonErr(`Error al enviar email (Resend): ${err}`, 500);
        }
        return jsonOk({ success: true });
      } catch (e) {
        return jsonErr(e.message ?? "Error interno", 500);
      }
    }, "onRequestPost");
  }
});
var onRequestOptions4;
var onRequestPost13;
var init_login = __esm({
  "api/auth/login.ts"() {
    init_functionsRoutes_0_9739269091816841();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_helpers();
    onRequestOptions4 = /* @__PURE__ */ __name2(async () => CORS_OPTIONS, "onRequestOptions");
    onRequestPost13 = /* @__PURE__ */ __name2(async ({ env: env22, request }) => {
      try {
        const body = await request.json();
        const email = body.email?.trim().toLowerCase();
        const password = body.password?.trim();
        if (!email || !password) return jsonErr("Email y contrase\xF1a son requeridos");
        const row = await env22.DB.prepare("SELECT id, email, password_hash, full_name, phone, address, createdAt FROM users WHERE email = ?").bind(email).first();
        if (!row) return jsonErr("Credenciales incorrectas", 401);
        const valid = await verifyPassword(password, row.password_hash);
        if (!valid) return jsonErr("Credenciales incorrectas", 401);
        const token = generateToken();
        const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1e3).toISOString();
        await env22.DB.prepare("INSERT INTO user_sessions (user_id, token, expires_at) VALUES (?, ?, ?)").bind(row.id, token, expiresAt).run();
        const { password_hash: _, ...user } = row;
        return new Response(JSON.stringify({ token, user }), {
          status: 200,
          headers: {
            ...JSON_HEADERS,
            "Set-Cookie": setSessionCookie(token)
          }
        });
      } catch (e) {
        return jsonErr(e.message ?? "Error interno", 500);
      }
    }, "onRequestPost");
  }
});
var onRequestOptions5;
var onRequestPost14;
var init_logout = __esm({
  "api/auth/logout.ts"() {
    init_functionsRoutes_0_9739269091816841();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_helpers();
    onRequestOptions5 = /* @__PURE__ */ __name2(async () => CORS_OPTIONS, "onRequestOptions");
    onRequestPost14 = /* @__PURE__ */ __name2(async ({ env: env22, request }) => {
      try {
        const auth = request.headers.get("Authorization") ?? "";
        const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
        if (token) {
          await env22.DB.prepare("DELETE FROM user_sessions WHERE token = ?").bind(token).run();
        }
        return new Response(JSON.stringify({ message: "Sesi\xF3n cerrada" }), {
          status: 200,
          headers: {
            ...JSON_HEADERS,
            "Set-Cookie": clearSessionCookie()
          }
        });
      } catch (e) {
        return jsonErr(e.message ?? "Error interno", 500);
      }
    }, "onRequestPost");
  }
});
var onRequestOptions6;
var onRequestGet15;
var init_me = __esm({
  "api/auth/me.ts"() {
    init_functionsRoutes_0_9739269091816841();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    onRequestOptions6 = /* @__PURE__ */ __name2(async () => new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization"
      }
    }), "onRequestOptions");
    onRequestGet15 = /* @__PURE__ */ __name2(async ({ env: env22, request }) => {
      try {
        const { getAuthenticatedUser: getAuthenticatedUser2 } = await Promise.resolve().then(() => (init_helpers(), helpers_exports));
        const user = await getAuthenticatedUser2(request, env22.DB);
        if (!user) {
          return new Response(JSON.stringify({ error: "No autenticado" }), {
            status: 401,
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
          });
        }
        return new Response(JSON.stringify({ user }), {
          status: 200,
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
        });
      } catch (e) {
        return new Response(JSON.stringify({ error: e?.message ?? "Error interno", stack: e?.stack ?? "" }), {
          status: 500,
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
        });
      }
    }, "onRequestGet");
  }
});
var onRequestOptions7;
var onRequestGet16;
var init_orders2 = __esm({
  "api/auth/orders.ts"() {
    init_functionsRoutes_0_9739269091816841();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_helpers();
    onRequestOptions7 = /* @__PURE__ */ __name2(async () => CORS_OPTIONS, "onRequestOptions");
    onRequestGet16 = /* @__PURE__ */ __name2(async ({ env: env22, request }) => {
      const user = await getAuthenticatedUser(request, env22.DB);
      if (!user) return jsonErr("No autenticado", 401);
      const orders = await env22.DB.prepare(`
      SELECT id, reference, status, shipping_status, tracking_number,
             shipping_notes, total_in_cents, createdAt, updatedAt
      FROM orders
      WHERE user_id = ?
      ORDER BY createdAt DESC
    `).bind(user.id).all();
      if (!orders.results.length) return jsonOk([]);
      const ids = orders.results.map((o) => o.id);
      const placeholders = ids.map(() => "?").join(",");
      const items = await env22.DB.prepare(`SELECT * FROM order_items WHERE order_id IN (${placeholders})`).bind(...ids).all();
      const byOrder = {};
      for (const item of items.results) {
        if (!byOrder[item.order_id]) byOrder[item.order_id] = [];
        byOrder[item.order_id].push(item);
      }
      return jsonOk(orders.results.map((o) => ({ ...o, items: byOrder[o.id] ?? [] })));
    }, "onRequestGet");
  }
});
var onRequestOptions8;
var onRequestPut10;
var init_password = __esm({
  "api/auth/password.ts"() {
    init_functionsRoutes_0_9739269091816841();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_helpers();
    onRequestOptions8 = /* @__PURE__ */ __name2(async () => CORS_OPTIONS, "onRequestOptions");
    onRequestPut10 = /* @__PURE__ */ __name2(async ({ env: env22, request }) => {
      try {
        const user = await getAuthenticatedUser(request, env22.DB);
        if (!user) return jsonErr("No autenticado", 401);
        const body = await request.json();
        if (!body.current_password || !body.new_password) {
          return jsonErr("Se requieren la contrase\xF1a actual y la nueva");
        }
        if (body.new_password.length < 6) {
          return jsonErr("La nueva contrase\xF1a debe tener al menos 6 caracteres");
        }
        const row = await env22.DB.prepare("SELECT password_hash FROM users WHERE id = ?").bind(user.id).first();
        if (!row) return jsonErr("Usuario no encontrado", 404);
        const valid = await verifyPassword(body.current_password, row.password_hash);
        if (!valid) return jsonErr("La contrase\xF1a actual es incorrecta", 401);
        const newHash = await hashPassword(body.new_password);
        await env22.DB.prepare("UPDATE users SET password_hash = ? WHERE id = ?").bind(newHash, user.id).run();
        await env22.DB.prepare("DELETE FROM user_sessions WHERE user_id = ?").bind(user.id).run();
        return jsonOk({ message: "Contrase\xF1a actualizada. Por favor inicia sesi\xF3n nuevamente." });
      } catch (e) {
        return jsonErr(e.message ?? "Error interno", 500);
      }
    }, "onRequestPut");
  }
});
var onRequestOptions9;
var onRequestGet17;
var onRequestPut11;
var init_profile = __esm({
  "api/auth/profile.ts"() {
    init_functionsRoutes_0_9739269091816841();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_helpers();
    onRequestOptions9 = /* @__PURE__ */ __name2(async () => CORS_OPTIONS, "onRequestOptions");
    onRequestGet17 = /* @__PURE__ */ __name2(async ({ env: env22, request }) => {
      const user = await getAuthenticatedUser(request, env22.DB);
      if (!user) return jsonErr("No autenticado", 401);
      return jsonOk({ user });
    }, "onRequestGet");
    onRequestPut11 = /* @__PURE__ */ __name2(async ({ env: env22, request }) => {
      try {
        const user = await getAuthenticatedUser(request, env22.DB);
        if (!user) return jsonErr("No autenticado", 401);
        const body = await request.json();
        const full_name = body.full_name?.trim() ?? null;
        const phone = body.phone?.trim() ?? null;
        const region = body.region?.trim() ?? null;
        const city = body.city?.trim() ?? null;
        const address = body.address?.trim() ?? null;
        const newEmail = body.email?.trim().toLowerCase();
        if (newEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
          return jsonErr("Email inv\xE1lido");
        }
        if (newEmail && newEmail !== user.email) {
          const taken = await env22.DB.prepare("SELECT id FROM users WHERE email = ? AND id != ?").bind(newEmail, user.id).first();
          if (taken) return jsonErr("Este email ya est\xE1 en uso", 409);
        }
        const updated = await env22.DB.prepare(`
        UPDATE users
        SET full_name = ?, phone = ?, region = ?, city = ?, address = ?, email = COALESCE(?, email)
        WHERE id = ?
        RETURNING id, email, full_name, phone, region, city, address, createdAt
      `).bind(full_name, phone, region, city, address, newEmail ?? null, user.id).first();
        return jsonOk({ user: updated });
      } catch (e) {
        return jsonErr(e.message ?? "Error interno", 500);
      }
    }, "onRequestPut");
  }
});
var onRequestOptions10;
var onRequestPost15;
var init_register = __esm({
  "api/auth/register.ts"() {
    init_functionsRoutes_0_9739269091816841();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_helpers();
    onRequestOptions10 = /* @__PURE__ */ __name2(async () => CORS_OPTIONS, "onRequestOptions");
    onRequestPost15 = /* @__PURE__ */ __name2(async ({ env: env22, request }) => {
      try {
        const body = await request.json();
        const email = body.email?.trim().toLowerCase();
        const password = body.password?.trim();
        const full_name = body.full_name?.trim() || null;
        const phone = body.phone?.trim() || null;
        const region = body.region?.trim() || null;
        const city = body.city?.trim() || null;
        const address = body.address?.trim() || null;
        if (!email || !password) return jsonErr("Email y contrase\xF1a son requeridos");
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return jsonErr("Email inv\xE1lido");
        if (password.length < 6) return jsonErr("La contrase\xF1a debe tener al menos 6 caracteres");
        const existing = await env22.DB.prepare("SELECT id FROM users WHERE email = ?").bind(email).first();
        if (existing) return jsonErr("Este email ya est\xE1 registrado", 409);
        const password_hash = await hashPassword(password);
        const user = await env22.DB.prepare(`
        INSERT INTO users (email, password_hash, full_name, phone, region, city, address)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        RETURNING id, email, full_name, phone, region, city, address, createdAt
      `).bind(email, password_hash, full_name, phone, region, city, address).first();
        if (!user) throw new Error("Error al crear usuario");
        const token = generateToken();
        const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1e3).toISOString();
        await env22.DB.prepare("INSERT INTO user_sessions (user_id, token, expires_at) VALUES (?, ?, ?)").bind(user.id, token, expiresAt).run();
        return new Response(JSON.stringify({ token, user }), {
          status: 201,
          headers: {
            ...JSON_HEADERS,
            "Set-Cookie": setSessionCookie(token)
          }
        });
      } catch (e) {
        return jsonErr(e.message ?? "Error interno", 500);
      }
    }, "onRequestPost");
  }
});
var onRequestOptions11;
var onRequestPost16;
var init_reset_password = __esm({
  "api/auth/reset-password.ts"() {
    init_functionsRoutes_0_9739269091816841();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_helpers();
    onRequestOptions11 = /* @__PURE__ */ __name2(async () => CORS_OPTIONS, "onRequestOptions");
    onRequestPost16 = /* @__PURE__ */ __name2(async ({ env: env22, request }) => {
      try {
        const body = await request.json();
        const { token, password } = body;
        if (!token) return jsonErr("Token requerido");
        if (!password || password.length < 6) return jsonErr("La contrase\xF1a debe tener al menos 6 caracteres");
        const row = await env22.DB.prepare(`
        SELECT id, user_id, expires_at FROM password_reset_tokens
        WHERE token = ? AND used = 0 AND datetime(expires_at) > datetime('now')
      `).bind(token).first();
        if (!row) return jsonErr("Token inv\xE1lido o expirado");
        const { hashPassword: hashPassword2 } = await Promise.resolve().then(() => (init_helpers(), helpers_exports));
        const password_hash = await hashPassword2(password);
        await env22.DB.batch([
          env22.DB.prepare("UPDATE users SET password_hash = ? WHERE id = ?").bind(password_hash, row.user_id),
          env22.DB.prepare("UPDATE password_reset_tokens SET used = 1 WHERE id = ?").bind(row.id)
        ]);
        return jsonOk({ success: true });
      } catch (e) {
        return jsonErr(e.message ?? "Error interno", 500);
      }
    }, "onRequestPost");
  }
});
function mapStatus(epaycoStatus) {
  return STATUS_MAP[epaycoStatus] ?? "ERROR";
}
__name(mapStatus, "mapStatus");
async function sha256hex(text) {
  const data = new TextEncoder().encode(text);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}
__name(sha256hex, "sha256hex");
var EpaycoError;
var EPAYCO_BASE_URL;
var APIFY_URL;
var STATUS_MAP;
var EpaycoService;
var init_epayco_service = __esm({
  "api/epayco/epayco.service.ts"() {
    init_functionsRoutes_0_9739269091816841();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    EpaycoError = class extends Error {
      static {
        __name(this, "EpaycoError");
      }
      constructor(message, code) {
        super(message);
        this.code = code;
        this.name = "EpaycoError";
      }
      static {
        __name2(this, "EpaycoError");
      }
    };
    EPAYCO_BASE_URL = "https://secure.epayco.co";
    APIFY_URL = "https://apify.epayco.co";
    STATUS_MAP = {
      Aceptada: "APPROVED",
      Rechazada: "DECLINED",
      Pendiente: "PENDING"
    };
    __name2(mapStatus, "mapStatus");
    __name2(sha256hex, "sha256hex");
    EpaycoService = class {
      static {
        __name(this, "EpaycoService");
      }
      static {
        __name2(this, "EpaycoService");
      }
      constructor(config22) {
        if (!config22.publicKey) throw new EpaycoError("publicKey es requerida", 100);
        if (!config22.privateKey) throw new EpaycoError("privateKey es requerida", 100);
        if (!config22.customerId) throw new EpaycoError("customerId es requerido", 100);
        this.config = { ...config22, lang: config22.lang ?? "ES" };
      }
      get isTest() {
        return this.config.test;
      }
      async authenticate() {
        const credentials = btoa(`${this.config.publicKey}:${this.config.privateKey}`);
        const resp = await fetch(`${APIFY_URL}/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${credentials}`
          },
          body: JSON.stringify({ public_key: this.config.publicKey })
        });
        if (!resp.ok) {
          const text = await resp.text();
          throw new EpaycoError(`Error de autenticaci\xF3n Apify: ${resp.status} ${text}`, resp.status);
        }
        const json23 = await resp.json();
        if (!json23.token) {
          throw new EpaycoError("Apify no devolvi\xF3 un token");
        }
        return json23.token;
      }
      async createSession(params) {
        const token = await this.authenticate();
        const body = {
          checkout_version: "2",
          name: "RutaSport",
          currency: (params.currency ?? "COP").toUpperCase(),
          amount: String(params.amount),
          description: params.description,
          invoice: params.invoice,
          lang: (this.config.lang ?? "ES").toUpperCase(),
          country: "CO",
          ip: params.ip ?? "0.0.0.0",
          response: params.responseUrl,
          confirmation: params.confirmationUrl,
          test: String(this.config.test).toLowerCase(),
          extra1: params.invoice,
          ...params.billing?.email ? {
            billing: params.billing,
            nameBilling: params.billing.name ?? "",
            emailBilling: params.billing.email
          } : {}
        };
        const resp = await fetch(`${APIFY_URL}/payment/session/create`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(body)
        });
        if (!resp.ok) {
          const text = await resp.text();
          throw new EpaycoError(`Error al crear sesi\xF3n ePayco: ${resp.status} ${text}`, resp.status);
        }
        const json23 = await resp.json();
        if (!json23.success || !json23.data?.sessionId) {
          throw new EpaycoError("ePayco no devolvi\xF3 un sessionId v\xE1lido");
        }
        return { sessionId: json23.data.sessionId };
      }
      async validateTransaction(refPayco) {
        if (!refPayco) throw new EpaycoError("refPayco es requerido");
        const resp = await fetch(
          `${EPAYCO_BASE_URL}/validation/v1/reference/${encodeURIComponent(refPayco)}`,
          { headers: { "Content-Type": "application/json" } }
        );
        if (!resp.ok) {
          throw new EpaycoError(`Error al validar transacci\xF3n: ${resp.status}`, resp.status);
        }
        const json23 = await resp.json();
        if (!json23.success || !json23.data) {
          return {
            status: "ERROR",
            refPayco,
            transactionId: "",
            amount: "0",
            reference: refPayco
          };
        }
        return {
          status: mapStatus(json23.data.x_response),
          refPayco: json23.data.x_ref_payco,
          transactionId: json23.data.x_transaction_id,
          amount: json23.data.x_amount,
          reference: refPayco
        };
      }
      async verifyWebhookSignature(payload) {
        const expected = await sha256hex(
          `${this.config.customerId}^${this.config.publicKey}^${payload.refPayco}^${payload.transactionId}^${payload.amount}^${payload.currency}`
        );
        return expected === payload.signature;
      }
      mapWebhookStatus(epaycoStatus) {
        return mapStatus(epaycoStatus);
      }
      parseWebhookBody(request) {
        const ct = request.headers.get("content-type") ?? "";
        if (ct.includes("application/json")) return request.json();
        return request.text().then((t) => {
          const params = new URLSearchParams(t);
          const obj = {};
          for (const [k, v] of params) obj[k] = v;
          return obj;
        });
      }
    };
  }
});
function getEpaycoService(env22) {
  return new EpaycoService({
    publicKey: env22.EPAYCO_PUBLIC_KEY,
    privateKey: env22.EPAYCO_PRIVATE_KEY,
    customerId: env22.EPAYCO_CUSTOMER_ID,
    test: env22.EPAYCO_TEST !== "false"
  });
}
__name(getEpaycoService, "getEpaycoService");
var headers;
var onRequestOptions12;
var onRequestGet18;
var init_transaction = __esm({
  "api/epayco/transaction.ts"() {
    init_functionsRoutes_0_9739269091816841();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_epayco_service();
    __name2(getEpaycoService, "getEpaycoService");
    headers = {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    };
    onRequestOptions12 = /* @__PURE__ */ __name2(async () => new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
      }
    }), "onRequestOptions");
    onRequestGet18 = /* @__PURE__ */ __name2(async ({ env: env22, request }) => {
      const ref22 = new URL(request.url).searchParams.get("ref");
      if (!ref22) {
        return new Response(JSON.stringify({ error: "ref requerido" }), {
          status: 400,
          headers
        });
      }
      try {
        const epayco = getEpaycoService(env22);
        const tx = await epayco.validateTransaction(ref22);
        return new Response(
          JSON.stringify({
            id: tx.refPayco,
            status: tx.status,
            reference: ref22
          }),
          { headers }
        );
      } catch (e) {
        return new Response(
          JSON.stringify({ error: e.message ?? "Error al validar transacci\xF3n" }),
          { status: 500, headers }
        );
      }
    }, "onRequestGet");
  }
});
function getEpaycoService2(env22) {
  return new EpaycoService({
    publicKey: env22.EPAYCO_PUBLIC_KEY,
    privateKey: env22.EPAYCO_PRIVATE_KEY,
    customerId: env22.EPAYCO_CUSTOMER_ID,
    test: env22.EPAYCO_TEST !== "false"
  });
}
__name(getEpaycoService2, "getEpaycoService2");
var onRequestPost17;
var init_webhook = __esm({
  "api/epayco/webhook.ts"() {
    init_functionsRoutes_0_9739269091816841();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_epayco_service();
    __name2(getEpaycoService2, "getEpaycoService");
    onRequestPost17 = /* @__PURE__ */ __name2(async ({ env: env22, request }) => {
      try {
        const epayco = getEpaycoService2(env22);
        const data = await epayco.parseWebhookBody(request);
        const refPayco = data.x_ref_payco ?? data.ref_payco ?? "";
        const transactionId = data.x_transaction_id ?? "";
        const amount = data.x_amount ?? "";
        const currency = data.x_currency_code ?? "COP";
        const signature = data.x_signature ?? "";
        const response = data.x_response ?? "";
        const extra1 = data.x_extra1 ?? "";
        const isValid = await epayco.verifyWebhookSignature({
          refPayco,
          transactionId,
          amount,
          currency,
          signature,
          response,
          extra1,
          raw: data
        });
        if (!isValid) {
          return new Response("Firma inv\xE1lida", { status: 401 });
        }
        const reference = data.x_id_factura ?? data.x_id_invoice ?? data.x_extra1 ?? "";
        if (!reference) {
          return new Response("Referencia no encontrada", { status: 400 });
        }
        const order = await env22.DB.prepare("SELECT id, status, total_in_cents FROM orders WHERE reference = ?").bind(reference).first();
        if (!order) {
          return new Response("Orden no encontrada", { status: 404 });
        }
        if (order.status === "APPROVED") {
          return new Response("OK", { status: 200 });
        }
        const parsedAmount = parseInt(amount, 10);
        if (parsedAmount !== order.total_in_cents) {
          return new Response("Monto no coincide con la orden", { status: 400 });
        }
        const status = epayco.mapWebhookStatus(response);
        if (status === "APPROVED") {
          const items = await env22.DB.prepare("SELECT product_id, size, quantity FROM order_items WHERE order_id = ?").bind(order.id).all();
          for (const item of items.results) {
            if (!item.size) continue;
            const rawSize = item.size.replace(/^US/i, "");
            await env22.DB.prepare("UPDATE product_inventory SET stock = stock - ? WHERE product_id = ? AND size = ? AND stock >= ?").bind(item.quantity, item.product_id, rawSize, item.quantity).run();
          }
        }
        await env22.DB.prepare("UPDATE orders SET status = ?, epayco_refpayco = ?, updatedAt = datetime('now') WHERE reference = ?").bind(status, refPayco, reference).run();
        return new Response("OK", { status: 200 });
      } catch (e) {
        return new Response(e.message ?? "Error", { status: 500 });
      }
    }, "onRequestPost");
  }
});
var cors;
var QUERY;
var onRequestGet19;
var init_id11 = __esm({
  "api/products/[id].ts"() {
    init_functionsRoutes_0_9739269091816841();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    cors = { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" };
    QUERY = `
  SELECT p.id, p.name, p.model, CAST(p.price AS INTEGER) AS price,
         b.name AS brand, p.brand_id,
         g.name AS gender, p.gender_id,
         p.image, p.video, p.isBestSeller, p.isNew, p.description, p.createdAt,
         (SELECT GROUP_CONCAT(pi2.size, ',')
          FROM (SELECT size FROM product_inventory WHERE product_id = p.id AND stock > 0) pi2
         ) AS sizes,
         (SELECT GROUP_CONCAT(pi3.size || ':' || pi3.stock, ',')
          FROM product_inventory pi3 WHERE pi3.product_id = p.id AND pi3.stock > 0
         ) AS inventory_raw,
         (SELECT GROUP_CONCAT(c.name, ',')
          FROM product_categories pc JOIN categories c ON c.id = pc.category_id
          WHERE pc.product_id = p.id) AS categories,
         (SELECT GROUP_CONCAT(s.name, ',')
          FROM product_sports ps JOIN sports s ON s.id = ps.sport_id
          WHERE ps.product_id = p.id) AS sports,
         (SELECT GROUP_CONCAT(pc2.category_id, ',')
          FROM product_categories pc2 WHERE pc2.product_id = p.id) AS category_ids,
         (SELECT GROUP_CONCAT(ps2.sport_id, ',')
          FROM product_sports ps2 WHERE ps2.product_id = p.id) AS sport_ids,
         (SELECT GROUP_CONCAT(url, ',')
          FROM (SELECT url FROM product_images WHERE product_id = p.id ORDER BY sort_order ASC)
         ) AS gallery
  FROM products p
  LEFT JOIN brands  b ON b.id = p.brand_id
  LEFT JOIN genders g ON g.id = p.gender_id
  WHERE p.id = ?
  GROUP BY p.id
`;
    onRequestGet19 = /* @__PURE__ */ __name2(async ({ env: env22, params }) => {
      try {
        const id = params.id;
        if (!id || isNaN(+id)) {
          return new Response(JSON.stringify({ error: "Invalid id" }), { status: 400, headers: cors });
        }
        const result = await env22.DB.prepare(QUERY).bind(+id).first();
        if (!result) {
          return new Response(JSON.stringify({ error: "Not found" }), { status: 404, headers: cors });
        }
        return new Response(JSON.stringify(result), { headers: cors });
      } catch (e) {
        return new Response(JSON.stringify({ error: e.message ?? "Internal error" }), { status: 500, headers: cors });
      }
    }, "onRequestGet");
  }
});
var corsHeaders;
var onRequestGet20;
var init_banners2 = __esm({
  "api/banners.ts"() {
    init_functionsRoutes_0_9739269091816841();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    corsHeaders = { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" };
    onRequestGet20 = /* @__PURE__ */ __name2(async ({ env: env22 }) => {
      try {
        const result = await env22.DB.prepare(
          'SELECT * FROM feature_banners WHERE isActive = 1 ORDER BY "order" ASC'
        ).all();
        return new Response(JSON.stringify(result.results), { headers: corsHeaders });
      } catch (e) {
        return new Response(JSON.stringify({ error: "Internal server error" }), {
          status: 500,
          headers: corsHeaders
        });
      }
    }, "onRequestGet");
  }
});
var corsHeaders2;
var onRequestGet21;
var init_brands2 = __esm({
  "api/brands.ts"() {
    init_functionsRoutes_0_9739269091816841();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    corsHeaders2 = { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" };
    onRequestGet21 = /* @__PURE__ */ __name2(async ({ env: env22 }) => {
      try {
        const result = await env22.DB.prepare(
          'SELECT * FROM brands WHERE isActive = 1 ORDER BY "order" ASC'
        ).all();
        return new Response(JSON.stringify(result.results), { headers: corsHeaders2 });
      } catch (e) {
        return new Response(JSON.stringify({ error: "Internal server error" }), {
          status: 500,
          headers: corsHeaders2
        });
      }
    }, "onRequestGet");
  }
});
var corsHeaders3;
var onRequestGet22;
var init_categories2 = __esm({
  "api/categories.ts"() {
    init_functionsRoutes_0_9739269091816841();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    corsHeaders3 = { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" };
    onRequestGet22 = /* @__PURE__ */ __name2(async ({ env: env22 }) => {
      try {
        const result = await env22.DB.prepare(
          'SELECT * FROM categories WHERE isActive = 1 ORDER BY "order" ASC'
        ).all();
        return new Response(JSON.stringify(result.results), { headers: corsHeaders3 });
      } catch (e) {
        return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500, headers: corsHeaders3 });
      }
    }, "onRequestGet");
  }
});
var corsHeaders4;
var onRequestGet23;
var init_genders2 = __esm({
  "api/genders.ts"() {
    init_functionsRoutes_0_9739269091816841();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    corsHeaders4 = { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" };
    onRequestGet23 = /* @__PURE__ */ __name2(async ({ env: env22 }) => {
      try {
        const result = await env22.DB.prepare(
          'SELECT * FROM genders ORDER BY "order" ASC'
        ).all();
        return new Response(JSON.stringify(result.results), { headers: corsHeaders4 });
      } catch (e) {
        return new Response(JSON.stringify({ error: "Internal server error" }), {
          status: 500,
          headers: corsHeaders4
        });
      }
    }, "onRequestGet");
  }
});
var corsHeaders5;
var onRequestGet24;
var init_heroes2 = __esm({
  "api/heroes.ts"() {
    init_functionsRoutes_0_9739269091816841();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    corsHeaders5 = { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" };
    onRequestGet24 = /* @__PURE__ */ __name2(async ({ env: env22 }) => {
      try {
        const result = await env22.DB.prepare(
          'SELECT * FROM heroes WHERE isActive = 1 ORDER BY "order" ASC'
        ).all();
        return new Response(JSON.stringify(result.results), { headers: corsHeaders5 });
      } catch (e) {
        return new Response(JSON.stringify({ error: "Internal server error" }), {
          status: 500,
          headers: corsHeaders5
        });
      }
    }, "onRequestGet");
  }
});
function getEpaycoService3(env22) {
  return new EpaycoService({
    publicKey: env22.EPAYCO_PUBLIC_KEY,
    privateKey: env22.EPAYCO_PRIVATE_KEY,
    customerId: env22.EPAYCO_CUSTOMER_ID,
    test: env22.EPAYCO_TEST !== "false"
  });
}
__name(getEpaycoService3, "getEpaycoService3");
var headers2;
var onRequestOptions13;
var onRequestPost18;
var init_orders3 = __esm({
  "api/orders.ts"() {
    init_functionsRoutes_0_9739269091816841();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_epayco_service();
    __name2(getEpaycoService3, "getEpaycoService");
    headers2 = {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    };
    onRequestOptions13 = /* @__PURE__ */ __name2(async () => new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization"
      }
    }), "onRequestOptions");
    onRequestPost18 = /* @__PURE__ */ __name2(async ({ env: env22, request }) => {
      try {
        const body = await request.json();
        if (!body.items?.length) {
          return new Response(JSON.stringify({ error: "Carrito vac\xEDo" }), { status: 400, headers: headers2 });
        }
        let userId = null;
        const authHeader = request.headers.get("Authorization") ?? "";
        const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
        if (token) {
          const session2 = await env22.DB.prepare(`SELECT user_id FROM user_sessions WHERE token = ? AND datetime(expires_at) > datetime('now')`).bind(token).first();
          userId = session2?.user_id ?? null;
        }
        for (const item of body.items) {
          const rawSize = item.size ? item.size.replace(/^US/i, "") : null;
          if (!rawSize) continue;
          const inv = await env22.DB.prepare("SELECT stock FROM product_inventory WHERE product_id = ? AND size = ?").bind(item.productId, rawSize).first();
          if (!inv || inv.stock < item.quantity) {
            return new Response(
              JSON.stringify({
                error: "Sin stock disponible",
                outOfStock: [{
                  productId: item.productId,
                  size: item.size,
                  name: item.name,
                  available: inv?.stock ?? 0
                }]
              }),
              { status: 409, headers: headers2 }
            );
          }
        }
        const totalCOP = body.items.reduce((acc, item) => acc + (Number(item.price) || 0) * item.quantity, 0);
        const reference = `RS-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
        const order = await env22.DB.prepare(`INSERT INTO orders (reference, status, total_in_cents, user_id) VALUES (?, 'RESERVED', ?, ?) RETURNING id`).bind(reference, totalCOP, userId).first();
        if (!order) throw new Error("Error al crear la orden");
        const stmts = body.items.map(
          (item) => env22.DB.prepare(
            `INSERT INTO order_items (order_id, product_id, name, brand, model, size, price, quantity)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
          ).bind(order.id, item.productId, item.name, item.brand ?? null, item.model ?? null, item.size ?? null, Math.round(Number(item.price)), item.quantity)
        );
        await env22.DB.batch(stmts);
        const clientIp = request.headers.get("CF-Connecting-IP") || request.headers.get("x-forwarded-for") || "0.0.0.0";
        const origin = new URL(request.url).origin;
        const epayco = getEpaycoService3(env22);
        let billing;
        if (userId) {
          const user = await env22.DB.prepare("SELECT email, full_name FROM users WHERE id = ?").bind(userId).first();
          if (user) {
            billing = {
              email: user.email,
              ...user.full_name ? { name: user.full_name } : {}
            };
          }
        }
        const session = await epayco.createSession({
          invoice: reference,
          description: `Pedido ${reference}`,
          amount: totalCOP,
          ip: clientIp,
          responseUrl: `${origin}/pago/exitoso`,
          confirmationUrl: `${origin}/api/epayco/webhook`,
          ...billing ? { billing } : {}
        });
        return new Response(
          JSON.stringify({
            orderId: order.id,
            reference,
            totalCOP,
            sessionId: session.sessionId,
            test: epayco.isTest
          }),
          { headers: headers2 }
        );
      } catch (e) {
        return new Response(
          JSON.stringify({ error: e.message ?? "Error interno", name: e.name, stack: e.stack }),
          { status: 500, headers: headers2 }
        );
      }
    }, "onRequestPost");
  }
});
var headers3;
var onRequestGet25;
var init_products2 = __esm({
  "api/products.ts"() {
    init_functionsRoutes_0_9739269091816841();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    headers3 = {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    };
    onRequestGet25 = /* @__PURE__ */ __name2(async ({ env: env22, request }) => {
      try {
        const url = new URL(request.url);
        const gender = url.searchParams.get("gender");
        const bestSeller = url.searchParams.get("bestSeller");
        const isNew = url.searchParams.get("isNew");
        let sql = `
      SELECT
        p.id,
        p.name,
        p.model,
        CAST(p.price AS INTEGER) AS price,
        b.name AS brand,
        p.brand_id,
        g.name AS gender,
        p.gender_id,
        p.image,
        p.isBestSeller,
        p.isNew,
        p.badge,
        p.description,
        (
          SELECT GROUP_CONCAT(pi2.size, ',')
          FROM (
            SELECT size FROM product_inventory
            WHERE product_id = p.id AND stock > 0
          ) pi2
        ) AS sizes,
        (
          SELECT GROUP_CONCAT(pi3.size || ':' || pi3.stock, ',')
          FROM product_inventory pi3
          WHERE pi3.product_id = p.id AND pi3.stock > 0
        ) AS inventory_raw,
        p.createdAt,
        (
          SELECT GROUP_CONCAT(c.name, ',')
          FROM product_categories pc
          JOIN categories c ON c.id = pc.category_id
          WHERE pc.product_id = p.id
        ) AS categories,
        (
          SELECT GROUP_CONCAT(s.name, ',')
          FROM product_sports ps
          JOIN sports s ON s.id = ps.sport_id
          WHERE ps.product_id = p.id
        ) AS sports,
        (
          SELECT GROUP_CONCAT(pc2.category_id, ',')
          FROM product_categories pc2
          WHERE pc2.product_id = p.id
        ) AS category_ids,
        (
          SELECT GROUP_CONCAT(ps2.sport_id, ',')
          FROM product_sports ps2
          WHERE ps2.product_id = p.id
        ) AS sport_ids,
        (
          SELECT GROUP_CONCAT(url, ',')
          FROM (
            SELECT url
            FROM product_images
            WHERE product_id = p.id
            ORDER BY sort_order ASC
          )
        ) AS gallery
      FROM products p
      LEFT JOIN brands b ON b.id = p.brand_id
      LEFT JOIN genders g ON g.id = p.gender_id
      WHERE 1 = 1
    `;
        const binds = [];
        if (gender) {
          sql += ` AND g.name = ?`;
          binds.push(gender);
        }
        if (bestSeller === "true") {
          sql += ` AND p.isBestSeller = 1`;
        }
        if (isNew === "true") {
          sql += ` AND p.isNew = 1`;
        }
        sql += ` ORDER BY p.createdAt DESC`;
        const result = await env22.DB.prepare(sql).bind(...binds).all();
        return new Response(JSON.stringify(result.results), { headers: headers3 });
      } catch (e) {
        return new Response(
          JSON.stringify({ error: e.message ?? "Internal error" }),
          { status: 500, headers: headers3 }
        );
      }
    }, "onRequestGet");
  }
});
var corsHeaders6;
var onRequestGet26;
var init_sports2 = __esm({
  "api/sports.ts"() {
    init_functionsRoutes_0_9739269091816841();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    corsHeaders6 = { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" };
    onRequestGet26 = /* @__PURE__ */ __name2(async ({ env: env22 }) => {
      try {
        const result = await env22.DB.prepare(
          'SELECT * FROM sports WHERE isActive = 1 ORDER BY "order" ASC'
        ).all();
        return new Response(JSON.stringify(result.results), { headers: corsHeaders6 });
      } catch (e) {
        return new Response(JSON.stringify({ error: "Internal server error" }), {
          status: 500,
          headers: corsHeaders6
        });
      }
    }, "onRequestGet");
  }
});
var MIME_TYPES;
var onRequestGet27;
var init_path = __esm({
  "images/[[path]].ts"() {
    init_functionsRoutes_0_9739269091816841();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    MIME_TYPES = {
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      gif: "image/gif",
      webp: "image/webp",
      svg: "image/svg+xml",
      avif: "image/avif"
    };
    onRequestGet27 = /* @__PURE__ */ __name2(async ({ env: env22, params }) => {
      try {
        const pathParts = Array.isArray(params.path) ? params.path : [params.path];
        const key = "images/" + pathParts.join("/");
        const obj = await env22.IMAGES.get(key);
        if (!obj) return new Response("Not found", { status: 404 });
        const headers4 = new Headers();
        obj.writeHttpMetadata(headers4);
        if (!headers4.get("content-type")) {
          const ext = key.split(".").pop()?.toLowerCase() ?? "";
          headers4.set("content-type", MIME_TYPES[ext] ?? "application/octet-stream");
        }
        headers4.set("cache-control", "public, max-age=31536000, immutable");
        return new Response(obj.body, { headers: headers4 });
      } catch (e) {
        return new Response("Internal server error", { status: 500 });
      }
    }, "onRequestGet");
  }
});
var MIMES;
var onRequestGet28;
var init_path2 = __esm({
  "videos/[[path]].ts"() {
    init_functionsRoutes_0_9739269091816841();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    MIMES = {
      mp4: "video/mp4",
      webm: "video/webm",
      mov: "video/quicktime",
      ogg: "video/ogg",
      avi: "video/x-msvideo",
      mkv: "video/x-matroska",
      m4v: "video/x-m4v"
    };
    onRequestGet28 = /* @__PURE__ */ __name2(async ({ env: env22, params, request }) => {
      try {
        const parts = Array.isArray(params.path) ? params.path : [params.path];
        const key = "videos/" + parts.join("/");
        const rangeHeader = request.headers.get("range");
        const obj = rangeHeader ? await env22.IMAGES.get(key, { range: request.headers }) : await env22.IMAGES.get(key);
        if (!obj) return new Response("Not found", { status: 404 });
        const headers4 = new Headers();
        obj.writeHttpMetadata(headers4);
        if (!headers4.get("content-type")) {
          const ext = key.split(".").pop()?.toLowerCase() ?? "";
          headers4.set("content-type", MIMES[ext] ?? "video/mp4");
        }
        headers4.set("accept-ranges", "bytes");
        headers4.set("cache-control", "public, max-age=31536000, immutable");
        if (rangeHeader && obj.range) {
          const r = obj.range;
          const offset = r.offset ?? 0;
          const length = r.length ?? obj.size - offset;
          headers4.set("content-range", `bytes ${offset}-${offset + length - 1}/${obj.size}`);
          headers4.set("content-length", String(length));
          return new Response(obj.body, { status: 206, headers: headers4 });
        }
        headers4.set("content-length", String(obj.size));
        return new Response(obj.body, { headers: headers4 });
      } catch {
        return new Response("Internal server error", { status: 500 });
      }
    }, "onRequestGet");
  }
});
var routes;
var init_functionsRoutes_0_9739269091816841 = __esm({
  "../.wrangler/tmp/pages-NFCszS/functionsRoutes-0.9739269091816841.mjs"() {
    "use strict";
    init_id();
    init_id();
    init_id2();
    init_id2();
    init_id3();
    init_id3();
    init_id4();
    init_id4();
    init_id5();
    init_id5();
    init_id6();
    init_id7();
    init_id7();
    init_id8();
    init_id8();
    init_id9();
    init_id10();
    init_id10();
    init_id10();
    init_analytics();
    init_banners();
    init_banners();
    init_brands();
    init_brands();
    init_categories();
    init_categories();
    init_genders();
    init_heroes();
    init_heroes();
    init_orders();
    init_products();
    init_products();
    init_sports();
    init_sports();
    init_upload();
    init_upload();
    init_upload();
    init_upload_url();
    init_users();
    init_videos();
    init_videos();
    init_videos();
    init_pageview();
    init_pageview();
    init_forgot_password();
    init_forgot_password();
    init_login();
    init_login();
    init_logout();
    init_logout();
    init_me();
    init_me();
    init_orders2();
    init_orders2();
    init_password();
    init_password();
    init_profile();
    init_profile();
    init_profile();
    init_register();
    init_register();
    init_reset_password();
    init_reset_password();
    init_transaction();
    init_transaction();
    init_webhook();
    init_id11();
    init_banners2();
    init_brands2();
    init_categories2();
    init_genders2();
    init_heroes2();
    init_orders3();
    init_orders3();
    init_products2();
    init_sports2();
    init_path();
    init_path2();
    routes = [
      {
        routePath: "/api/admin/banners/:id",
        mountPath: "/api/admin/banners",
        method: "DELETE",
        middlewares: [],
        modules: [onRequestDelete]
      },
      {
        routePath: "/api/admin/banners/:id",
        mountPath: "/api/admin/banners",
        method: "PUT",
        middlewares: [],
        modules: [onRequestPut]
      },
      {
        routePath: "/api/admin/brands/:id",
        mountPath: "/api/admin/brands",
        method: "DELETE",
        middlewares: [],
        modules: [onRequestDelete2]
      },
      {
        routePath: "/api/admin/brands/:id",
        mountPath: "/api/admin/brands",
        method: "PUT",
        middlewares: [],
        modules: [onRequestPut2]
      },
      {
        routePath: "/api/admin/categories/:id",
        mountPath: "/api/admin/categories",
        method: "DELETE",
        middlewares: [],
        modules: [onRequestDelete3]
      },
      {
        routePath: "/api/admin/categories/:id",
        mountPath: "/api/admin/categories",
        method: "PUT",
        middlewares: [],
        modules: [onRequestPut3]
      },
      {
        routePath: "/api/admin/heroes/:id",
        mountPath: "/api/admin/heroes",
        method: "DELETE",
        middlewares: [],
        modules: [onRequestDelete4]
      },
      {
        routePath: "/api/admin/heroes/:id",
        mountPath: "/api/admin/heroes",
        method: "PUT",
        middlewares: [],
        modules: [onRequestPut4]
      },
      {
        routePath: "/api/admin/inventory/:id",
        mountPath: "/api/admin/inventory",
        method: "GET",
        middlewares: [],
        modules: [onRequestGet]
      },
      {
        routePath: "/api/admin/inventory/:id",
        mountPath: "/api/admin/inventory",
        method: "PUT",
        middlewares: [],
        modules: [onRequestPut5]
      },
      {
        routePath: "/api/admin/orders/:id",
        mountPath: "/api/admin/orders",
        method: "PUT",
        middlewares: [],
        modules: [onRequestPut6]
      },
      {
        routePath: "/api/admin/products/:id",
        mountPath: "/api/admin/products",
        method: "DELETE",
        middlewares: [],
        modules: [onRequestDelete5]
      },
      {
        routePath: "/api/admin/products/:id",
        mountPath: "/api/admin/products",
        method: "PUT",
        middlewares: [],
        modules: [onRequestPut7]
      },
      {
        routePath: "/api/admin/sports/:id",
        mountPath: "/api/admin/sports",
        method: "DELETE",
        middlewares: [],
        modules: [onRequestDelete6]
      },
      {
        routePath: "/api/admin/sports/:id",
        mountPath: "/api/admin/sports",
        method: "PUT",
        middlewares: [],
        modules: [onRequestPut8]
      },
      {
        routePath: "/api/admin/users/:id",
        mountPath: "/api/admin/users",
        method: "PUT",
        middlewares: [],
        modules: [onRequestPut9]
      },
      {
        routePath: "/api/auth/orders/:id",
        mountPath: "/api/auth/orders",
        method: "GET",
        middlewares: [],
        modules: [onRequestGet2]
      },
      {
        routePath: "/api/auth/orders/:id",
        mountPath: "/api/auth/orders",
        method: "OPTIONS",
        middlewares: [],
        modules: [onRequestOptions]
      },
      {
        routePath: "/api/auth/orders/:id",
        mountPath: "/api/auth/orders",
        method: "POST",
        middlewares: [],
        modules: [onRequestPost]
      },
      {
        routePath: "/api/admin/analytics",
        mountPath: "/api/admin",
        method: "GET",
        middlewares: [],
        modules: [onRequestGet3]
      },
      {
        routePath: "/api/admin/banners",
        mountPath: "/api/admin",
        method: "GET",
        middlewares: [],
        modules: [onRequestGet4]
      },
      {
        routePath: "/api/admin/banners",
        mountPath: "/api/admin",
        method: "POST",
        middlewares: [],
        modules: [onRequestPost2]
      },
      {
        routePath: "/api/admin/brands",
        mountPath: "/api/admin",
        method: "GET",
        middlewares: [],
        modules: [onRequestGet5]
      },
      {
        routePath: "/api/admin/brands",
        mountPath: "/api/admin",
        method: "POST",
        middlewares: [],
        modules: [onRequestPost3]
      },
      {
        routePath: "/api/admin/categories",
        mountPath: "/api/admin",
        method: "GET",
        middlewares: [],
        modules: [onRequestGet6]
      },
      {
        routePath: "/api/admin/categories",
        mountPath: "/api/admin",
        method: "POST",
        middlewares: [],
        modules: [onRequestPost4]
      },
      {
        routePath: "/api/admin/genders",
        mountPath: "/api/admin",
        method: "GET",
        middlewares: [],
        modules: [onRequestGet7]
      },
      {
        routePath: "/api/admin/heroes",
        mountPath: "/api/admin",
        method: "GET",
        middlewares: [],
        modules: [onRequestGet8]
      },
      {
        routePath: "/api/admin/heroes",
        mountPath: "/api/admin",
        method: "POST",
        middlewares: [],
        modules: [onRequestPost5]
      },
      {
        routePath: "/api/admin/orders",
        mountPath: "/api/admin",
        method: "GET",
        middlewares: [],
        modules: [onRequestGet9]
      },
      {
        routePath: "/api/admin/products",
        mountPath: "/api/admin",
        method: "GET",
        middlewares: [],
        modules: [onRequestGet10]
      },
      {
        routePath: "/api/admin/products",
        mountPath: "/api/admin",
        method: "POST",
        middlewares: [],
        modules: [onRequestPost6]
      },
      {
        routePath: "/api/admin/sports",
        mountPath: "/api/admin",
        method: "GET",
        middlewares: [],
        modules: [onRequestGet11]
      },
      {
        routePath: "/api/admin/sports",
        mountPath: "/api/admin",
        method: "POST",
        middlewares: [],
        modules: [onRequestPost7]
      },
      {
        routePath: "/api/admin/upload",
        mountPath: "/api/admin",
        method: "DELETE",
        middlewares: [],
        modules: [onRequestDelete7]
      },
      {
        routePath: "/api/admin/upload",
        mountPath: "/api/admin",
        method: "GET",
        middlewares: [],
        modules: [onRequestGet12]
      },
      {
        routePath: "/api/admin/upload",
        mountPath: "/api/admin",
        method: "POST",
        middlewares: [],
        modules: [onRequestPost8]
      },
      {
        routePath: "/api/admin/upload-url",
        mountPath: "/api/admin",
        method: "POST",
        middlewares: [],
        modules: [onRequestPost9]
      },
      {
        routePath: "/api/admin/users",
        mountPath: "/api/admin",
        method: "GET",
        middlewares: [],
        modules: [onRequestGet13]
      },
      {
        routePath: "/api/admin/videos",
        mountPath: "/api/admin",
        method: "DELETE",
        middlewares: [],
        modules: [onRequestDelete8]
      },
      {
        routePath: "/api/admin/videos",
        mountPath: "/api/admin",
        method: "GET",
        middlewares: [],
        modules: [onRequestGet14]
      },
      {
        routePath: "/api/admin/videos",
        mountPath: "/api/admin",
        method: "POST",
        middlewares: [],
        modules: [onRequestPost10]
      },
      {
        routePath: "/api/analytics/pageview",
        mountPath: "/api/analytics",
        method: "OPTIONS",
        middlewares: [],
        modules: [onRequestOptions2]
      },
      {
        routePath: "/api/analytics/pageview",
        mountPath: "/api/analytics",
        method: "POST",
        middlewares: [],
        modules: [onRequestPost11]
      },
      {
        routePath: "/api/auth/forgot-password",
        mountPath: "/api/auth",
        method: "OPTIONS",
        middlewares: [],
        modules: [onRequestOptions3]
      },
      {
        routePath: "/api/auth/forgot-password",
        mountPath: "/api/auth",
        method: "POST",
        middlewares: [],
        modules: [onRequestPost12]
      },
      {
        routePath: "/api/auth/login",
        mountPath: "/api/auth",
        method: "OPTIONS",
        middlewares: [],
        modules: [onRequestOptions4]
      },
      {
        routePath: "/api/auth/login",
        mountPath: "/api/auth",
        method: "POST",
        middlewares: [],
        modules: [onRequestPost13]
      },
      {
        routePath: "/api/auth/logout",
        mountPath: "/api/auth",
        method: "OPTIONS",
        middlewares: [],
        modules: [onRequestOptions5]
      },
      {
        routePath: "/api/auth/logout",
        mountPath: "/api/auth",
        method: "POST",
        middlewares: [],
        modules: [onRequestPost14]
      },
      {
        routePath: "/api/auth/me",
        mountPath: "/api/auth",
        method: "GET",
        middlewares: [],
        modules: [onRequestGet15]
      },
      {
        routePath: "/api/auth/me",
        mountPath: "/api/auth",
        method: "OPTIONS",
        middlewares: [],
        modules: [onRequestOptions6]
      },
      {
        routePath: "/api/auth/orders",
        mountPath: "/api/auth",
        method: "GET",
        middlewares: [],
        modules: [onRequestGet16]
      },
      {
        routePath: "/api/auth/orders",
        mountPath: "/api/auth",
        method: "OPTIONS",
        middlewares: [],
        modules: [onRequestOptions7]
      },
      {
        routePath: "/api/auth/password",
        mountPath: "/api/auth",
        method: "OPTIONS",
        middlewares: [],
        modules: [onRequestOptions8]
      },
      {
        routePath: "/api/auth/password",
        mountPath: "/api/auth",
        method: "PUT",
        middlewares: [],
        modules: [onRequestPut10]
      },
      {
        routePath: "/api/auth/profile",
        mountPath: "/api/auth",
        method: "GET",
        middlewares: [],
        modules: [onRequestGet17]
      },
      {
        routePath: "/api/auth/profile",
        mountPath: "/api/auth",
        method: "OPTIONS",
        middlewares: [],
        modules: [onRequestOptions9]
      },
      {
        routePath: "/api/auth/profile",
        mountPath: "/api/auth",
        method: "PUT",
        middlewares: [],
        modules: [onRequestPut11]
      },
      {
        routePath: "/api/auth/register",
        mountPath: "/api/auth",
        method: "OPTIONS",
        middlewares: [],
        modules: [onRequestOptions10]
      },
      {
        routePath: "/api/auth/register",
        mountPath: "/api/auth",
        method: "POST",
        middlewares: [],
        modules: [onRequestPost15]
      },
      {
        routePath: "/api/auth/reset-password",
        mountPath: "/api/auth",
        method: "OPTIONS",
        middlewares: [],
        modules: [onRequestOptions11]
      },
      {
        routePath: "/api/auth/reset-password",
        mountPath: "/api/auth",
        method: "POST",
        middlewares: [],
        modules: [onRequestPost16]
      },
      {
        routePath: "/api/epayco/transaction",
        mountPath: "/api/epayco",
        method: "GET",
        middlewares: [],
        modules: [onRequestGet18]
      },
      {
        routePath: "/api/epayco/transaction",
        mountPath: "/api/epayco",
        method: "OPTIONS",
        middlewares: [],
        modules: [onRequestOptions12]
      },
      {
        routePath: "/api/epayco/webhook",
        mountPath: "/api/epayco",
        method: "POST",
        middlewares: [],
        modules: [onRequestPost17]
      },
      {
        routePath: "/api/products/:id",
        mountPath: "/api/products",
        method: "GET",
        middlewares: [],
        modules: [onRequestGet19]
      },
      {
        routePath: "/api/banners",
        mountPath: "/api",
        method: "GET",
        middlewares: [],
        modules: [onRequestGet20]
      },
      {
        routePath: "/api/brands",
        mountPath: "/api",
        method: "GET",
        middlewares: [],
        modules: [onRequestGet21]
      },
      {
        routePath: "/api/categories",
        mountPath: "/api",
        method: "GET",
        middlewares: [],
        modules: [onRequestGet22]
      },
      {
        routePath: "/api/genders",
        mountPath: "/api",
        method: "GET",
        middlewares: [],
        modules: [onRequestGet23]
      },
      {
        routePath: "/api/heroes",
        mountPath: "/api",
        method: "GET",
        middlewares: [],
        modules: [onRequestGet24]
      },
      {
        routePath: "/api/orders",
        mountPath: "/api",
        method: "OPTIONS",
        middlewares: [],
        modules: [onRequestOptions13]
      },
      {
        routePath: "/api/orders",
        mountPath: "/api",
        method: "POST",
        middlewares: [],
        modules: [onRequestPost18]
      },
      {
        routePath: "/api/products",
        mountPath: "/api",
        method: "GET",
        middlewares: [],
        modules: [onRequestGet25]
      },
      {
        routePath: "/api/sports",
        mountPath: "/api",
        method: "GET",
        middlewares: [],
        modules: [onRequestGet26]
      },
      {
        routePath: "/images/:path*",
        mountPath: "/images",
        method: "GET",
        middlewares: [],
        modules: [onRequestGet27]
      },
      {
        routePath: "/videos/:path*",
        mountPath: "/videos",
        method: "GET",
        middlewares: [],
        modules: [onRequestGet28]
      }
    ];
  }
});
init_functionsRoutes_0_9739269091816841();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
init_functionsRoutes_0_9739269091816841();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
init_functionsRoutes_0_9739269091816841();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
init_functionsRoutes_0_9739269091816841();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
function lexer(str) {
  var tokens = [];
  var i = 0;
  while (i < str.length) {
    var char = str[i];
    if (char === "*" || char === "+" || char === "?") {
      tokens.push({ type: "MODIFIER", index: i, value: str[i++] });
      continue;
    }
    if (char === "\\") {
      tokens.push({ type: "ESCAPED_CHAR", index: i++, value: str[i++] });
      continue;
    }
    if (char === "{") {
      tokens.push({ type: "OPEN", index: i, value: str[i++] });
      continue;
    }
    if (char === "}") {
      tokens.push({ type: "CLOSE", index: i, value: str[i++] });
      continue;
    }
    if (char === ":") {
      var name = "";
      var j = i + 1;
      while (j < str.length) {
        var code = str.charCodeAt(j);
        if (
          // `0-9`
          code >= 48 && code <= 57 || // `A-Z`
          code >= 65 && code <= 90 || // `a-z`
          code >= 97 && code <= 122 || // `_`
          code === 95
        ) {
          name += str[j++];
          continue;
        }
        break;
      }
      if (!name)
        throw new TypeError("Missing parameter name at ".concat(i));
      tokens.push({ type: "NAME", index: i, value: name });
      i = j;
      continue;
    }
    if (char === "(") {
      var count32 = 1;
      var pattern = "";
      var j = i + 1;
      if (str[j] === "?") {
        throw new TypeError('Pattern cannot start with "?" at '.concat(j));
      }
      while (j < str.length) {
        if (str[j] === "\\") {
          pattern += str[j++] + str[j++];
          continue;
        }
        if (str[j] === ")") {
          count32--;
          if (count32 === 0) {
            j++;
            break;
          }
        } else if (str[j] === "(") {
          count32++;
          if (str[j + 1] !== "?") {
            throw new TypeError("Capturing groups are not allowed at ".concat(j));
          }
        }
        pattern += str[j++];
      }
      if (count32)
        throw new TypeError("Unbalanced pattern at ".concat(i));
      if (!pattern)
        throw new TypeError("Missing pattern at ".concat(i));
      tokens.push({ type: "PATTERN", index: i, value: pattern });
      i = j;
      continue;
    }
    tokens.push({ type: "CHAR", index: i, value: str[i++] });
  }
  tokens.push({ type: "END", index: i, value: "" });
  return tokens;
}
__name(lexer, "lexer");
__name2(lexer, "lexer");
function parse(str, options) {
  if (options === void 0) {
    options = {};
  }
  var tokens = lexer(str);
  var _a = options.prefixes, prefixes = _a === void 0 ? "./" : _a, _b = options.delimiter, delimiter = _b === void 0 ? "/#?" : _b;
  var result = [];
  var key = 0;
  var i = 0;
  var path = "";
  var tryConsume = /* @__PURE__ */ __name2(function(type) {
    if (i < tokens.length && tokens[i].type === type)
      return tokens[i++].value;
  }, "tryConsume");
  var mustConsume = /* @__PURE__ */ __name2(function(type) {
    var value2 = tryConsume(type);
    if (value2 !== void 0)
      return value2;
    var _a2 = tokens[i], nextType = _a2.type, index = _a2.index;
    throw new TypeError("Unexpected ".concat(nextType, " at ").concat(index, ", expected ").concat(type));
  }, "mustConsume");
  var consumeText = /* @__PURE__ */ __name2(function() {
    var result2 = "";
    var value2;
    while (value2 = tryConsume("CHAR") || tryConsume("ESCAPED_CHAR")) {
      result2 += value2;
    }
    return result2;
  }, "consumeText");
  var isSafe = /* @__PURE__ */ __name2(function(value2) {
    for (var _i = 0, delimiter_1 = delimiter; _i < delimiter_1.length; _i++) {
      var char2 = delimiter_1[_i];
      if (value2.indexOf(char2) > -1)
        return true;
    }
    return false;
  }, "isSafe");
  var safePattern = /* @__PURE__ */ __name2(function(prefix2) {
    var prev = result[result.length - 1];
    var prevText = prefix2 || (prev && typeof prev === "string" ? prev : "");
    if (prev && !prevText) {
      throw new TypeError('Must have text between two parameters, missing text after "'.concat(prev.name, '"'));
    }
    if (!prevText || isSafe(prevText))
      return "[^".concat(escapeString(delimiter), "]+?");
    return "(?:(?!".concat(escapeString(prevText), ")[^").concat(escapeString(delimiter), "])+?");
  }, "safePattern");
  while (i < tokens.length) {
    var char = tryConsume("CHAR");
    var name = tryConsume("NAME");
    var pattern = tryConsume("PATTERN");
    if (name || pattern) {
      var prefix = char || "";
      if (prefixes.indexOf(prefix) === -1) {
        path += prefix;
        prefix = "";
      }
      if (path) {
        result.push(path);
        path = "";
      }
      result.push({
        name: name || key++,
        prefix,
        suffix: "",
        pattern: pattern || safePattern(prefix),
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    var value = char || tryConsume("ESCAPED_CHAR");
    if (value) {
      path += value;
      continue;
    }
    if (path) {
      result.push(path);
      path = "";
    }
    var open = tryConsume("OPEN");
    if (open) {
      var prefix = consumeText();
      var name_1 = tryConsume("NAME") || "";
      var pattern_1 = tryConsume("PATTERN") || "";
      var suffix = consumeText();
      mustConsume("CLOSE");
      result.push({
        name: name_1 || (pattern_1 ? key++ : ""),
        pattern: name_1 && !pattern_1 ? safePattern(prefix) : pattern_1,
        prefix,
        suffix,
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    mustConsume("END");
  }
  return result;
}
__name(parse, "parse");
__name2(parse, "parse");
function match(str, options) {
  var keys = [];
  var re = pathToRegexp(str, keys, options);
  return regexpToFunction(re, keys, options);
}
__name(match, "match");
__name2(match, "match");
function regexpToFunction(re, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.decode, decode = _a === void 0 ? function(x) {
    return x;
  } : _a;
  return function(pathname) {
    var m = re.exec(pathname);
    if (!m)
      return false;
    var path = m[0], index = m.index;
    var params = /* @__PURE__ */ Object.create(null);
    var _loop_1 = /* @__PURE__ */ __name2(function(i2) {
      if (m[i2] === void 0)
        return "continue";
      var key = keys[i2 - 1];
      if (key.modifier === "*" || key.modifier === "+") {
        params[key.name] = m[i2].split(key.prefix + key.suffix).map(function(value) {
          return decode(value, key);
        });
      } else {
        params[key.name] = decode(m[i2], key);
      }
    }, "_loop_1");
    for (var i = 1; i < m.length; i++) {
      _loop_1(i);
    }
    return { path, index, params };
  };
}
__name(regexpToFunction, "regexpToFunction");
__name2(regexpToFunction, "regexpToFunction");
function escapeString(str) {
  return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
}
__name(escapeString, "escapeString");
__name2(escapeString, "escapeString");
function flags(options) {
  return options && options.sensitive ? "" : "i";
}
__name(flags, "flags");
__name2(flags, "flags");
function regexpToRegexp(path, keys) {
  if (!keys)
    return path;
  var groupsRegex = /\((?:\?<(.*?)>)?(?!\?)/g;
  var index = 0;
  var execResult = groupsRegex.exec(path.source);
  while (execResult) {
    keys.push({
      // Use parenthesized substring match if available, index otherwise
      name: execResult[1] || index++,
      prefix: "",
      suffix: "",
      modifier: "",
      pattern: ""
    });
    execResult = groupsRegex.exec(path.source);
  }
  return path;
}
__name(regexpToRegexp, "regexpToRegexp");
__name2(regexpToRegexp, "regexpToRegexp");
function arrayToRegexp(paths, keys, options) {
  var parts = paths.map(function(path) {
    return pathToRegexp(path, keys, options).source;
  });
  return new RegExp("(?:".concat(parts.join("|"), ")"), flags(options));
}
__name(arrayToRegexp, "arrayToRegexp");
__name2(arrayToRegexp, "arrayToRegexp");
function stringToRegexp(path, keys, options) {
  return tokensToRegexp(parse(path, options), keys, options);
}
__name(stringToRegexp, "stringToRegexp");
__name2(stringToRegexp, "stringToRegexp");
function tokensToRegexp(tokens, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.strict, strict = _a === void 0 ? false : _a, _b = options.start, start = _b === void 0 ? true : _b, _c = options.end, end = _c === void 0 ? true : _c, _d = options.encode, encode = _d === void 0 ? function(x) {
    return x;
  } : _d, _e = options.delimiter, delimiter = _e === void 0 ? "/#?" : _e, _f = options.endsWith, endsWith = _f === void 0 ? "" : _f;
  var endsWithRe = "[".concat(escapeString(endsWith), "]|$");
  var delimiterRe = "[".concat(escapeString(delimiter), "]");
  var route = start ? "^" : "";
  for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
    var token = tokens_1[_i];
    if (typeof token === "string") {
      route += escapeString(encode(token));
    } else {
      var prefix = escapeString(encode(token.prefix));
      var suffix = escapeString(encode(token.suffix));
      if (token.pattern) {
        if (keys)
          keys.push(token);
        if (prefix || suffix) {
          if (token.modifier === "+" || token.modifier === "*") {
            var mod = token.modifier === "*" ? "?" : "";
            route += "(?:".concat(prefix, "((?:").concat(token.pattern, ")(?:").concat(suffix).concat(prefix, "(?:").concat(token.pattern, "))*)").concat(suffix, ")").concat(mod);
          } else {
            route += "(?:".concat(prefix, "(").concat(token.pattern, ")").concat(suffix, ")").concat(token.modifier);
          }
        } else {
          if (token.modifier === "+" || token.modifier === "*") {
            throw new TypeError('Can not repeat "'.concat(token.name, '" without a prefix and suffix'));
          }
          route += "(".concat(token.pattern, ")").concat(token.modifier);
        }
      } else {
        route += "(?:".concat(prefix).concat(suffix, ")").concat(token.modifier);
      }
    }
  }
  if (end) {
    if (!strict)
      route += "".concat(delimiterRe, "?");
    route += !options.endsWith ? "$" : "(?=".concat(endsWithRe, ")");
  } else {
    var endToken = tokens[tokens.length - 1];
    var isEndDelimited = typeof endToken === "string" ? delimiterRe.indexOf(endToken[endToken.length - 1]) > -1 : endToken === void 0;
    if (!strict) {
      route += "(?:".concat(delimiterRe, "(?=").concat(endsWithRe, "))?");
    }
    if (!isEndDelimited) {
      route += "(?=".concat(delimiterRe, "|").concat(endsWithRe, ")");
    }
  }
  return new RegExp(route, flags(options));
}
__name(tokensToRegexp, "tokensToRegexp");
__name2(tokensToRegexp, "tokensToRegexp");
function pathToRegexp(path, keys, options) {
  if (path instanceof RegExp)
    return regexpToRegexp(path, keys);
  if (Array.isArray(path))
    return arrayToRegexp(path, keys, options);
  return stringToRegexp(path, keys, options);
}
__name(pathToRegexp, "pathToRegexp");
__name2(pathToRegexp, "pathToRegexp");
var escapeRegex = /[.+?^${}()|[\]\\]/g;
function* executeRequest(request) {
  const requestPath = new URL(request.url).pathname;
  for (const route of [...routes].reverse()) {
    if (route.method && route.method !== request.method) {
      continue;
    }
    const routeMatcher = match(route.routePath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const mountMatcher = match(route.mountPath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const matchResult = routeMatcher(requestPath);
    const mountMatchResult = mountMatcher(requestPath);
    if (matchResult && mountMatchResult) {
      for (const handler of route.middlewares.flat()) {
        yield {
          handler,
          params: matchResult.params,
          path: mountMatchResult.path
        };
      }
    }
  }
  for (const route of routes) {
    if (route.method && route.method !== request.method) {
      continue;
    }
    const routeMatcher = match(route.routePath.replace(escapeRegex, "\\$&"), {
      end: true
    });
    const mountMatcher = match(route.mountPath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const matchResult = routeMatcher(requestPath);
    const mountMatchResult = mountMatcher(requestPath);
    if (matchResult && mountMatchResult && route.modules.length) {
      for (const handler of route.modules.flat()) {
        yield {
          handler,
          params: matchResult.params,
          path: matchResult.path
        };
      }
      break;
    }
  }
}
__name(executeRequest, "executeRequest");
__name2(executeRequest, "executeRequest");
var pages_template_worker_default = {
  async fetch(originalRequest, env22, workerContext) {
    let request = originalRequest;
    const handlerIterator = executeRequest(request);
    let data = {};
    let isFailOpen = false;
    const next = /* @__PURE__ */ __name2(async (input, init) => {
      if (input !== void 0) {
        let url = input;
        if (typeof input === "string") {
          url = new URL(input, request.url).toString();
        }
        request = new Request(url, init);
      }
      const result = handlerIterator.next();
      if (result.done === false) {
        const { handler, params, path } = result.value;
        const context22 = {
          request: new Request(request.clone()),
          functionPath: path,
          next,
          params,
          get data() {
            return data;
          },
          set data(value) {
            if (typeof value !== "object" || value === null) {
              throw new Error("context.data must be an object");
            }
            data = value;
          },
          env: env22,
          waitUntil: workerContext.waitUntil.bind(workerContext),
          passThroughOnException: /* @__PURE__ */ __name2(() => {
            isFailOpen = true;
          }, "passThroughOnException")
        };
        const response = await handler(context22);
        if (!(response instanceof Response)) {
          throw new Error("Your Pages function should return a Response");
        }
        return cloneResponse(response);
      } else if ("ASSETS") {
        const response = await env22["ASSETS"].fetch(request);
        return cloneResponse(response);
      } else {
        const response = await fetch(request);
        return cloneResponse(response);
      }
    }, "next");
    try {
      return await next();
    } catch (error32) {
      if (isFailOpen) {
        const response = await env22["ASSETS"].fetch(request);
        return cloneResponse(response);
      }
      throw error32;
    }
  }
};
var cloneResponse = /* @__PURE__ */ __name2((response) => (
  // https://fetch.spec.whatwg.org/#null-body-status
  new Response(
    [101, 204, 205, 304].includes(response.status) ? null : response.body,
    response
  )
), "cloneResponse");
init_functionsRoutes_0_9739269091816841();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var drainBody = /* @__PURE__ */ __name2(async (request, env22, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env22);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;
init_functionsRoutes_0_9739269091816841();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
__name2(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name2(async (request, env22, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env22);
  } catch (e) {
    const error32 = reduceError(e);
    return Response.json(error32, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = pages_template_worker_default;
init_functionsRoutes_0_9739269091816841();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
__name2(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env22, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env22, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
__name2(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env22, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env22, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");
__name2(__facade_invoke__, "__facade_invoke__");
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  static {
    __name(this, "___Facade_ScheduledController__");
  }
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  static {
    __name2(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name2(function(request, env22, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env22, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env22, ctx) {
      const dispatcher = /* @__PURE__ */ __name2(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env22, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env22, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
__name2(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name2((request, env22, ctx) => {
      this.env = env22;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name2((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
__name2(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;

// node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody2 = /* @__PURE__ */ __name(async (request, env3, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env3);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default2 = drainBody2;

// node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError2(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError2(e.cause)
  };
}
__name(reduceError2, "reduceError");
var jsonError2 = /* @__PURE__ */ __name(async (request, env3, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env3);
  } catch (e) {
    const error4 = reduceError2(e);
    return Response.json(error4, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default2 = jsonError2;

// .wrangler/tmp/bundle-FRzei6/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__2 = [
  middleware_ensure_req_body_drained_default2,
  middleware_miniflare3_json_error_default2
];
var middleware_insertion_facade_default2 = middleware_loader_entry_default;

// node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__2 = [];
function __facade_register__2(...args) {
  __facade_middleware__2.push(...args.flat());
}
__name(__facade_register__2, "__facade_register__");
function __facade_invokeChain__2(request, env3, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__2(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env3, ctx, middlewareCtx);
}
__name(__facade_invokeChain__2, "__facade_invokeChain__");
function __facade_invoke__2(request, env3, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__2(request, env3, ctx, dispatch, [
    ...__facade_middleware__2,
    finalMiddleware
  ]);
}
__name(__facade_invoke__2, "__facade_invoke__");

// .wrangler/tmp/bundle-FRzei6/middleware-loader.entry.ts
var __Facade_ScheduledController__2 = class ___Facade_ScheduledController__2 {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__2)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler2(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__2 === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__2.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__2) {
    __facade_register__2(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env3, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env3, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env3, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__2(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env3, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__2(request, env3, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler2, "wrapExportedHandler");
function wrapWorkerEntrypoint2(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__2 === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__2.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__2) {
    __facade_register__2(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env3, ctx) => {
      this.env = env3;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__2(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__2(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint2, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY2;
if (typeof middleware_insertion_facade_default2 === "object") {
  WRAPPED_ENTRY2 = wrapExportedHandler2(middleware_insertion_facade_default2);
} else if (typeof middleware_insertion_facade_default2 === "function") {
  WRAPPED_ENTRY2 = wrapWorkerEntrypoint2(middleware_insertion_facade_default2);
}
var middleware_loader_entry_default2 = WRAPPED_ENTRY2;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__2 as __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default2 as default
};
//# sourceMappingURL=functionsWorker-0.7116196142911848.js.map
