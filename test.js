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
  platform.preflight('pear://keet')
})

test('open', async (t) => {
  const app = new appling.App('pear://keet', '/Applications/Keet.app/Contents/MacOS/Keet')

  app.open()
})

test('launch', async (t) => {
  const platform = await appling.resolve()

  platform.launch(
    new appling.App('pear://keet', '/Applications/Keet.app/Contents/MacOS/Keet'),
    'pear://keet',
    'Keet'
  )
})
