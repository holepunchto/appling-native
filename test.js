const test = require('brittle')
const appling = require('.')

test('parse', (t) => {
  console.log(appling.parse('pear://aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/data'))
})

test('lock', async (t) => {
  const lock = await appling.lock('test/fixtures/platform')
  await lock.unlock()
})

test('resolve', async (t) => {
  const platform = await appling.resolve()
  console.log(platform.path)
  console.log(platform.ready('pear://keet'))
})
