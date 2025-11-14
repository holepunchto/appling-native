const binding = require('./binding')

class Platform {
  constructor() {
    this._handle = binding.platform()
    this._view = Buffer.from(this._handle)
  }

  get path() {
    const path = this._view.subarray(0, 4097)

    return path.subarray(0, path.indexOf(0)).toString()
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
    this._handle = binding.lock(dir, this, this._onlock, this._onunlock)
    this._unlocked = false
  }

  unlock() {
    if (this._unlocked) return Promise.resolve()
    this._unlocked = true

    binding.unlock(this._handle)

    return this._promise
  }

  [Symbol.disposeAsync]() {
    return this.unlock()
  }

  _reset() {
    const { promise, resolve, reject } = Promise.withResolvers()

    this._promise = promise
    this._resolve = resolve
    this._reject = reject
  }

  _onlock(err) {
    if (err) this._reject(err)
    else {
      this._resolve()
      this._reset()
    }
  }

  _onunlock(err) {
    this._handle = null
    if (err) this._reject(err)
    else this._resolve()
  }
}

exports.lock = async function lock(dir = null) {
  const req = new Lock(dir)
  await req._promise
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
