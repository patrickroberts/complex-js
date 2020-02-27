![complex-js logo](https://raw.githubusercontent.com/patrickroberts/complex-js/assets/logo.png)

## Overview

* [Getting Started](#getting-started)
* [Documentation](#documentation)
* [License](#license)

## Getting Started

To install via [`npm`](https://www.npmjs.com/package/complex-js):

```sh
npm i complex-js moo nearley # peer dependencies for expression parser
```

[Node.js](https://nodejs.org):

```js
const Complex = require('complex-js');
```

ES2015 Module:

```js
import Complex from 'complex-js';
```

Browser:

```html
<script src="https://cdn.jsdelivr.net/combine/npm/moo@0.5.1,npm/nearley@2.19.1,npm/complex-js"></script>
<script>
const { Complex } = window;
</script>
```

[RequireJS](https://requirejs.org/docs/whyamd.html):

```js
requirejs(['complex-js'], function (Complex) {

});
```

## Documentation

API reference available on [github.io](http://patrickroberts.github.io/complex-js/).

## License

Copyright (c) 2020 Patrick Roberts

MIT
