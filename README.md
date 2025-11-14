# appling-native

<https://github.com/holepunchto/libappling> bindings for Bare.

## API

### `App`

#### `const app = new appling.App(id[, path])`

Construct an application descriptor for the application identified by `id` and an entry point of `path`. If not specified the current executable path is used.

#### `app.path`

The full path to the application.

#### `app.id`

The identifier of the application.

#### `app.open([argument])`

Open the app and pass it an optional argument, such as a `pear://` invite link.

### `Lock`

#### `const lock = await appling.lock([directory])`

Grab a lock on the Pear platform installation at `directory`.

#### `lock.dir`

The full path to the locked platform directory.

#### `await lock.unlock()`

Release and close the lock.

#### `lock[Symbol.asyncDispose]()`

Calls `lock.unlock()`.

### `Link`

#### `const link = appling.parse(input[, encoding])`

Parse `input` as a link. If `input` is a `Buffer` `encoding` may be passed.

#### `link.id`

The ID of the link.

#### `link.data`

The optional data of the link.

### `Platform`

#### `const platform = await appling.resolve([directory])`

Resolve the Pear platform installation at `directory`. If not specified the default location is used. An exception will be thrown if no viable platform installation is found.

#### `platform.path`

The full path to the platform installation.

#### `const result = platform.ready(link)`

Check if the application identified by `link` is ready to launch. `link` may be string a string, in which case it will be parsed first. If `false` is returned preflight should be run.

#### `platform.preflight(link)`

Run preflight for the application identified by `link`.

#### `platform.launch(app, link, name)`

Launch `app` with `link` and a human-readable `name`. This call may or may not return on success.

## License

Apache-2.0
