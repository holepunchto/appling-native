const binding = require('./binding')

exports.parse = function parse(input, encoding = 'utf8') {
  if (typeof input !== 'string') input = input.toString(encoding)

  const result = Buffer.from(binding.parse(input))

  const id = result.subarray(0, 64)
  const data = result.subarray(65)

  return {
    id,
    data: data.subarray(0, data.indexOf(0))
  }
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

exports.lock = async function lock(dir) {
  const lock = new Lock(dir)
  await lock._promise
  return lock
}
