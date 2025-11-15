const os = require('bare-os')
const binding = require('./binding')

class App {
  constructor(id, path = os.execPath()) {
    this._handle = binding.app(path, id)
    this._view = Buffer.from(this._handle)
  }

  get path() {
    const path = this._view.subarray(0, 4097)

    return path.subarray(0, path.indexOf(0)).toString()
  }

  get id() {
    const id = this._view.subarray(4097)

    return id.subarray(0, id.indexOf(0)).toString()
  }

  open(arg = null) {
    binding.open(this._handle, arg)
  }
}

exports.App = App

class Platform {
  constructor() {
    this._handle = binding.platform()
    this._view = Buffer.from(this._handle)
  }

  get path() {
    const path = this._view.subarray(0, 4097)

    return path.subarray(0, path.indexOf(0)).toString()
  }

  ready(link) {
    if (typeof link === 'string') link = new Link(link)

    return binding.ready(this._handle, link._handle)
  }

  preflight(link) {
    if (typeof link === 'string') link = new Link(link)

    return binding.preflight(this._handle, link._handle)
  }

  launch(app, link) {
    if (typeof app === 'string') app = new App(app)

    if (link === undefined) link = `pear://${app.id}`

    if (typeof link === 'string') link = new Link(link)

    binding.launch(this._handle, app._handle, link._handle)
  }
}

class Link {
  constructor(input) {
    this._handle = binding.parse(input)
    this._view = Buffer.from(this._handle)
  }

  get id() {
    return this._view.subarray(0, 64)
  }

  get data() {
    const data = result.subarray(65)

    return data.subarray(0, data.indexOf(0))
  }
}

exports.parse = function parse(input, encoding = 'utf8') {
  if (typeof input !== 'string') input = input.toString(encoding)

  return new Link(input)
}

class Lock {
  constructor(dir) {
    this._reset()
    this._dir = null
    this._unlocked = false
    this._handle = binding.lock(dir, this, this._onlock, this._onunlock)
  }

  get dir() {
    return this._dir
  }

  unlock() {
    if (this._unlocked) return Promise.resolve()

    this._reset()
    this._unlocked = true

    binding.unlock(this._handle)

    return this._promise
  }

  [Symbol.asyncDispose]() {
    return this.unlock()
  }

  _reset() {
    const { promise, resolve, reject } = Promise.withResolvers()

    this._promise = promise
    this._resolve = resolve
    this._reject = reject
  }

  _onlock(err, dir) {
    if (err) this._reject(err)
    else this._resolve(dir)
  }

  _onunlock(err) {
    this._handle = null
    if (err) this._reject(err)
    else this._resolve()
  }
}

exports.lock = async function lock(dir = null) {
  const req = new Lock(dir)
  req._dir = await req._promise
  return req
}

class Resolve {
  constructor(dir) {
    this._platform = new Platform()

    const { promise, resolve, reject } = Promise.withResolvers()

    this._promise = promise
    this._resolve = resolve
    this._reject = reject

    this._handle = binding.resolve(dir, this._platform._handle, this, this._onresolve)
  }

  _onresolve(err) {
    if (err) this._reject(err)
    else this._resolve()
  }
}

exports.resolve = async function resolve(dir = null) {
  const req = new Resolve(dir)
  await req._promise
  return req._platform
}
