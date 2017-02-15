<h1 style="text-align:center"><img src="https://i.imgur.com/XBOpBt1.png"></h1>

Complex-js is a lightweight module that enables complex mathematics
in JavaScript. It comes with every elementary function and all
mathematical operators. It also includes many utility functions and
common non-analytical functions such as the complex conjugate, the
argument function, the absolute value function and many others.

Lastly, but most importantly, this module contains a compiler to
parse human-readable expressions into native JavaScript functions.
The compiler, accessible from [`Complex.compile`](#compile),
accepts an arbitrary amount of parameters to pass to the function,
specified by their human-readable names. Example usage can be found
below in the section [Parsing Human-Readable Expressions](#parsing).

Although originally written for use in the browser, it can also now
be used within [Node.js](http://nodejs.org).

## Overview

* [Download](#download)
* [Functions vs. Operators](#functions-vs-operators)
* [Coordinate Notation](#coordinate-notation)
* [Parsing Human-Readable Expressions](#parsing)
* [Documentation](#documentation)

<a name="download"></a>
## Download

To install via [`npm`](https://www.npmjs.com/package/complex-js), run:

```
npm install --save complex-js
```

To include this module in the Node.js environment, add the line:

```js
var Complex = require('complex-js');
```

In the browser, use a script tag:

```html
<script type="text/javascript" src="complex.min.js"></script>
```

Complex.js can be included as an AMD module as well, and is available via [`bower`](http://bower.io/seah/?q=complex-js):

```
bower install --save complex-js
```

<a name="functions-vs-operators"></a>
## Functions vs. Operators

Functions are denoted as `Complex.staticMethod`. For example,
to evaluate the tangent of the imaginary unit, do the following:

```js
console.log(Complex.tan(Complex(0, 1)));
```

All functions are static, meaning that they are called directly by
the Complex namespace. Operators are non-static methods, which means
they must be called by an instance of `Complex`. For example, to raise
1+5i to the power of 3 e^(pi i), do the following:

```js
console.log(Complex(1, 5).pow(Complex.Polar(3, Math.PI)));
```

Notice how `pow` is a method of a `Complex` instance, and not of the
namespace Complex. That's because it is an operator rather than a function.
Non-static methods are denoted as `Complex#nonStaticMethod`.
Now you can use symbolic operators as well. These include addition ([`+`](#add)),
subtraction ([`-`](#sub)), multiplication ([`*`](#mul)), division ([`/`](#div)),
modulii ([`%`](#mod)), powers ([`^`](#pow)), and equalities ([`=`](#equ)).
Below is a couple examples.

```js
// 1+5i
var onePlusFiveI = Complex(1, 0)['+'](Complex(0, 5));
// e^(pi i)*3
var negThree = Complex.exp(Complex(0, Math.PI))['*'](Complex(3, 0));
```

<a name="coordinate-notation"></a>
## Coordinate Notation

Complex.js supports both cartesian and polar notation. In order
to declare a Complex number with cartesian coordinates, you can call
the Cartesian constructor with the following arguments:

```js
var onePlusFiveI = Complex.Cartesian(1, 5);
```

Declaring it with the `new` keyword is optional, since the
constructor detects and corrects instantiation automatically.
Polar notation is supported through the Polar constructor as such:

```js
var negOne = Complex.Polar(1, Math.PI);
```

Similarly, both notations are supported in the `Complex#toString` method.
Simply call `toString()` for cartesian (the default),
or `toString(true)` for polar notation.

These strings can be used to reconstruct the Complex instances, but
that will be covered in the next section.

<a name="parsing"></a>
## Parsing Human-Readable Expressions

Complex.js also includes a compiler for human-readable expressions,
which is very useful for constructing functions callable from
JavaScript. Since it supports virtually any common notations and
fully supports order of operations, it's very easy to use. It even
detects implied multiplication and non-parenthetical grouping by
default. A simple use-case example is below.

HTML:
```html
<!DOCTYPE html>
  <head>
    <script type="text/javascript" src="complex.min.js"></script>
  </head>
  <body>
    <div>
      <span>Evaluate:</span>
      <input type="text" id="calc" value="(5+i)^(3e-5+10*sin(5i))"/>
    </div>
    <div>
      <span>Cartesian:</span>
      <span id="ans-cart"></span>
    </div>
    <div>
      <span>Exponential:</span>
      <span id="ans-expo"></span>
    </div>
    <script type="text/javascript">
      ...
    </script>
  </body>
</html>
```
JavaScript:
```js
var input = document.getElementById('calc'),
  cart = document.getElementById('ans-cart'),
  expo = document.getElementById('ans-expo');

input.addEventListener('change', function () {
  try {
        //will throw an error if input is invalid
    var calc = Complex.compile(input.value),
      //evaluate the compiled function for the answer
      ans = calc();

    //use the toString method
    cart.innerHTML = ans.toString();
    expo.innerHTML = ans.toString(true);
  } catch(error) {
    //if the parser throws an error, clear outputs and alert error
    cart.innerHTML = '';
    expo.innerHTML = '';
    alert(error.message);
  }
});
```

Note that the compiler creates a function rather than evaluating the
expression that is compiled immediately. The function returned is
high-performace, since it caches all constant expressions in the string
so that they don't need to be re-evaluated with each call.

The following is an example where the compiler provides parameters
for the compiled function:

```js
// Node.js
var Complex = require('complex-js'),
  paramA = Complex(5, 1),
  paramB = Complex(3e-5, 0),
  paramC = Complex.Polar(5, Math.PI / 2),
  // human-readable variable names in expression
  complexFunc = 'a^(b+10*sin(c))',
  // array of parameters for function is order-dependent
  jsFunc = Complex.compile(complexFunc, ['b', 'a', 'c']),
  // how to pass parameters to compiled function
  output = jsFunc(paramB, paramA, paramC);

// output cartesian form as string
console.log(output.toString());
```

The `Complex.compile` method can also reconstruct a Complex
number from a string created by `Complex.toString`. See below for
a demonstration:

```js
var fivePlusIStr = Complex(5, 1).toString(), //store as cartesian
    fivePlusI = Complex.compile(fivePlusIStr)();

console.log(Complex(5, 1).equals(fivePlusI));
```

<a name="documentation"></a>
## Documentation

### [Constructors](#constructs)

* [`Complex`](#complex)
* [`Cartesian`](#cartesian)
* [`Polar`](#polar)

### [Non-Static Methods](#non-static)

* [`toString`](#to-string)
* [`equals`](#equ)
* [`add`](#add)
* [`subtract`](#sub)
* [`multiply`](#mul)
* [`divide`](#div)
* [`modulo`](#mod)
* [`power`](#pow)

### [Static Methods](#static)

* [`negate`](#neg)
* [`conjugate`](#conj)
* [`normalize`](#norm)
* [`sign`](#sign)
* [`floor`](#floor)
* [`ceil`](#ceil)
* [`round`](#round)
* [`truncate`](#trunc)
* [`fraction`](#frac)
* [`square`](#square)
* [`cube`](#cube)
* [`sqrt`](#sqrt)
* [`cbrt`](#cbrt)
* [`exp`](#exp)
* [`log`](#log)
* [`cos`](#cos)
* [`sin`](#sin)
* [`tan`](#tan)
* [`sec`](#sec)
* [`csc`](#csc)
* [`cot`](#cot)
* [`acos`](#acos)
* [`asin`](#asin)
* [`atan`](#atan)
* [`asec`](#asec)
* [`acsc`](#acsc)
* [`acot`](#acot)
* [`cosh`](#cosh)
* [`sinh`](#sinh)
* [`tanh`](#tanh)
* [`sech`](#sech)
* [`csch`](#csch)
* [`coth`](#coth)
* [`acosh`](#acosh)
* [`asinh`](#asinh)
* [`atanh`](#atanh)
* [`asech`](#asech)
* [`acsch`](#acsch)
* [`acoth`](#acoth)

### [Misc. Methods](#misc)

* [`min`](#min)
* [`max`](#max)
* [`isNaN`](#is-nan)
* [`isFinite`](#is-finite)
* [`isReal`](#is-real)
* [`isImag`](#is-imag)
* [`compile`](#compile)

### Constants

For convenience, but also used in many of the trigonometric methods.

* `Complex.ZERO` - zero
* `Complex.ONE` - one
* `Complex.NEG_ONE` - negative one
* `Complex.I` - i
* `Complex.NEG_I` - negative i
* `Complex.TWO` - two
* `Complex.TWO_I` - two i
* `Complex.PI` - irrational constant "π"
* `Complex.E` - irrational constant "e"

<a name="constructs"></a>
## Constructors

<a name="complex"></a>
### Complex([real = 0[, imag = 0[, abs = Math.sqrt(real * real + imag * imag)[, arg = Math.atan2(real, imag)]]]])

The main constructor for instances of the `Complex` class.
Optionally call with `new`, but not required.

__Arguments__

* `real` - An optional `Number` specifying the real value of the Complex number.
* `imag` - An optional `Number` specifying the imaginary value of the Complex number.
* `abs` - An optional `Number` specifying the absolute value of the Complex number.
  Not recommended unless accurately calculated.
* `arg` - An optional `Number` specifying the argument of the Complex number.
  Not recommended unless accurately calculated.

<a name="cartesian"></a>
### Complex.Cartesian([real = 0[, imag = 0]])

The cartesian constructor for instances of the `Complex` class.
Optionally call with `new`, but not required.

__Arguments__

* `real` - An optional `Number` specifying the real value of the Complex number.
* `imag` - An optional `Number` specifying the imaginary value of the Complex number.

<a name="polar"></a>
### Complex.Polar([abs = 0[, arg = 0]])

The polar constructor for instances of the `Complex` class.
Optionally call with `new`, but not required.

__Arguments__

* `abs` - An optional `Number` specifying the absolute value of the Complex number.
* `arg` - An optional `Number` specifying the argument of the Complex number.


**Note** In order to access the components from an instance,
examine the following demo code, which applies to all three constructors:

```js
var complex = Complex(Math.random()*2-1,Math.random()*2-1);
console.log(
  complex.real, // real part
  complex.imag, // imaginary part
  complex.abs,  // absolute value
  complex.arg   // argument
);
```

<a name="non-static"></a>
## Non-Static Methods

<a name="to-string"></a>
### Complex#toString([polar = false])

The `toString` method for the `Complex` class. Outputs to cartesian
or polar form.

__Arguments__

* `polar` - An optional Boolean specifying the output form.
  If truthy, it outputs as polar, otherwise it outputs as cartesian.

**Examples**

```js
var c1 = Complex(-3,0),
  c2 = Complex(0,-1),
  c3 = Complex(3,4),
  c4 = Complex(-2,-5);

console.log(c1.toString(true));
// "3 e^(3.141592653589793 i)"

console.log(c2.toString());
// "-i"

console.log(c3.toString(true));
// "5 e^(0.9272952180016123 i)"

console.log(c4.toString());
// "-2-5 i"
```


<a name="equ"></a>
### Complex#equals(complex[, maxUlps = 4]), Complex#equ(complex[, maxUlps = 4])

Compares two complex numbers and determines whether they are approximately equal,
taking into consideration truncation error.

__Arguments__

* `complex` - An instance of the `Complex` class to which to compare.
* `maxUlps` - An optional integer representing the difference of units
  in the last place allotted for successful equality.


<a name="add"></a>
### Complex#plus(complex), Complex#add(complex), Complex#\['+'\](complex)

Adds two Complex numbers.

__Arguments__

* `complex` - An instance of the `Complex` class to add.


<a name="sub"></a>
### Complex#subtract(complex), Complex#minus(complex), Complex#sub(complex), Complex#\['-'\](complex)

Subtracts a Complex number from another.

__Arguments__

* `complex` - An instance of the `Complex` class to subtract.


<a name="mul"></a>
### Complex#multiply(complex), Complex#times(complex), Complex#mul(complex), Complex#\['*'\](complex)

Multiplies two Complex numbers.

__Arguments__

* `complex` - An instance of the `Complex` class to multiply.


<a name="div"></a>
### Complex#divide(complex), Complex#div(complex), Complex#\['/'\](complex)

Divides a Complex number by another.

__Arguments__

* `complex` - An instance of the `Complex` class by which to divide.


<a name="mod"></a>
### Complex#modulo(complex), Complex#mod(complex), Complex#\['%'\](complex)

Applies a Complex Modulus to a Complex number by cartesian coordinates.

__Arguments__

* `complex` - An instance of the `Complex` class for the modulus.


<a name="pow"></a>
### Complex#power(complex), Complex#pow(complex), Complex#\['^'\](complex), Complex#\['**'\](complex)

Raises a Complex number to a Complex power.

__Arguments__

* `complex` - An instance of the `Complex` class by which to raise.


<a name="static"></a>
## Static Methods (and non-static counterparts)

<a name="neg"></a>
### Complex.negate(complex), Complex#negate()

Returns the negative of `complex`.

__Arguments__

* `complex` - An instance of the `Complex` class to negate.


<a name="conj"></a>
### Complex.conjugate(complex), Complex#conjugate()

Returns the conjugate of `complex`.

__Arguments__

* `complex` - An instance of the `Complex` class to conjugate.


<a name="norm"></a>
### Complex.normalize(complex), Complex#normalize()

Returns the unit complex number with the same argument as `complex`.
If the magnitude of `complex` is 0, then an instance of `Complex` is
returned with a magnitude of `NaN`.

__Arguments__

* `complex` - An instance of the `Complex` class to normalize.


<a name="sign"></a>
### Complex.sign(complex), Complex#sign()

Calculates the signs of the cartesian components of `complex`.

__Arguments__

* `complex` - An instance of the `Complex` class.


<a name="floor"></a>
### Complex.floor(complex), Complex#floor()

Rounds down the cartesian components of `complex`.

__Arguments__

* `complex` - An instance of the `Complex` class.


<a name="ceil"></a>
### Complex.ceil(complex), Complex#ceil()

Rounds up the cartesian components of `complex`.

__Arguments__

* `complex` - An instance of the `Complex` class.


<a name="round"></a>
### Complex.round(complex), Complex#round()

Rounds the cartesian components of `complex` to the nearest integers.

__Arguments__

* `complex` - An instance of the `Complex` class.


<a name="trunc"></a>
### Complex.truncate(complex), Complex#truncate()

Returns the integer parts of the cartesian components in `complex`.
This floors positive components and ceilings negative components.

__Arguments__

* `complex` - An instance of the `Complex` class.


<a name="frac"></a>
### Complex.fraction(complex), Complex#fraction()

Returns the fractional parts of the cartesian components in `complex`.
This retains the sign of each component.

__Arguments__

* `complex` - An instance of the `Complex` class.


<a name="square"></a>
### Complex.square(complex), Complex#square()

Returns the square of `complex`.

__Arguments__

* `complex` - An instance of the `Complex` class.


<a name="cube"></a>
### Complex.cube(complex), Complex#cube()

Returns the cube of `complex`.

__Arguments__

* `complex` - An instance of the `Complex` class.


<a name="sqrt"></a>
### Complex.sqrt(complex), Complex#sqrt()

Returns the square root of `complex`.

__Arguments__

* `complex` - An instance of the `Complex` class.


<a name="cbrt"></a>
### Complex.cbrt(complex), Complex#cbrt()

Returns the cube root of `complex`.

__Arguments__

* `complex` - An instance of the `Complex` class.


<a name="exp"></a>
### Complex.exp(complex), Complex#exp()

Returns the exponent function of `complex`, i.e. `e^complex`

__Arguments__

* `complex` - An instance of the `Complex` class.


<a name="log"></a>
### Complex.log(complex), Complex#log()

Returns the natural logarithm of `complex`.

__Arguments__

* `complex` - An instance of the `Complex` class.


<a name="cos"></a>
### Complex.cos(complex), Complex#cos()

Returns the cosine of `complex`.

__Arguments__

* `complex` - An instance of the `Complex` class.


<a name="sin"></a>
### Complex.sin(complex), Complex#sin()

Returns the sine of `complex`.

__Arguments__

* `complex` - An instance of the `Complex` class.


<a name="tan"></a>
### Complex.tan(complex), Complex#tan()

Returns the tangent of `complex`.

__Arguments__

* `complex` - An instance of the `Complex` class.


<a name="sec"></a>
### Complex.sec(complex), Complex#sec()

Returns the secant of `complex`.

__Arguments__

* `complex` - An instance of the `Complex` class.


<a name="csc"></a>
### Complex.csc(complex), Complex#csc()

Returns the cosecant of `complex`.

__Arguments__

* `complex` - An instance of the `Complex` class.


<a name="cot"></a>
### Complex.cot(complex), Complex#cot()

Returns the cotangent of `complex`.

__Arguments__

* `complex` - An instance of the `Complex` class.


<a name="acos"></a>
### Complex.acos(complex), Complex#acos()

Returns the acosine of `complex`.

__Arguments__

* `complex` - An instance of the `Complex` class.


<a name="asin"></a>
### Complex.asin(complex), Complex#asin()

Returns the asine of `complex`.

__Arguments__

* `complex` - An instance of the `Complex` class.


<a name="atan"></a>
### Complex.atan(complex), Complex#atan()

Returns the atangent of `complex`.

__Arguments__

* `complex` - An instance of the `Complex` class.


<a name="asec"></a>
### Complex.asec(complex), Complex#asec()

Returns the asecant of `complex`.

__Arguments__

* `complex` - An instance of the `Complex` class.


<a name="acsc"></a>
### Complex.acsc(complex), Complex#acsc()

Returns the acosecant of `complex`.

__Arguments__

* `complex` - An instance of the `Complex` class.


<a name="acot"></a>
### Complex.acot(complex), Complex#acot()

Returns the acotangent of `complex`.

__Arguments__

* `complex` - An instance of the `Complex` class.


<a name="cosh"></a>
### Complex.cosh(complex), Complex#cosh()

Returns the hyperbolic cosine of `complex`.

__Arguments__

* `complex` - An instance of the `Complex` class.


<a name="sinh"></a>
### Complex.sinh(complex), Complex#sinh()

Returns the hyperbolic sine of `complex`.

__Arguments__

* `complex` - An instance of the `Complex` class.


<a name="tanh"></a>
### Complex.tanh(complex), Complex#tanh()

Returns the hyperbolic tangent of `complex`.

__Arguments__

* `complex` - An instance of the `Complex` class.


<a name="sech"></a>
### Complex.sech(complex), Complex#sech()

Returns the hyperbolic secant of `complex`.

__Arguments__

* `complex` - An instance of the `Complex` class.


<a name="csch"></a>
### Complex.csch(complex), Complex#csch()

Returns the hyperbolic cosecant of `complex`.

__Arguments__

* `complex` - An instance of the `Complex` class.


<a name="coth"></a>
### Complex.coth(complex), Complex#coth()

Returns the hyperbolic cotangent of `complex`.

__Arguments__

* `complex` - An instance of the `Complex` class.


<a name="acosh"></a>
### Complex.acosh(complex), Complex#acosh()

Returns the hyperbolic acosine of `complex`.

__Arguments__

* `complex` - An instance of the `Complex` class.


<a name="asinh"></a>
### Complex.asinh(complex), Complex#asinh()

Returns the hyperbolic asine of `complex`.

__Arguments__

* `complex` - An instance of the `Complex` class.


<a name="atanh"></a>
### Complex.atanh(complex), Complex#atanh()

Returns the hyperbolic atangent of `complex`.

__Arguments__

* `complex` - An instance of the `Complex` class.


<a name="asech"></a>
### Complex.asech(complex), Complex#asech()

Returns the hyperbolic asecant of `complex`.

__Arguments__

* `complex` - An instance of the `Complex` class.


<a name="acsch"></a>
### Complex.acsch(complex), Complex#acsch()

Returns the hyperbolic acosecant of `complex`.

__Arguments__

* `complex` - An instance of the `Complex` class.


<a name="acoth"></a>
### Complex.acoth(complex), Complex#acoth()

Returns the hyperbolic acotangent of `complex`.

__Arguments__

* `complex` - An instance of the `Complex` class.

<a name="misc"></a>
## Misc. Static Methods

<a name="min"></a>
### Complex.min(complex_1[, complex_2...])

Returns the first complex instance with the smallest absolute value.

__Arguments__

* `complex_n` - An instance of the `Complex` class.


<a name="max"></a>
### Complex.max(complex_1[, complex_2...])

Returns the first complex instance with the largest absolute value.

__Arguments__

* `complex_n` - An instance of the `Complex` class.


<a name="is-nan"></a>
### Complex.isNaN(complex), Complex#isNaN()

Returns a `Boolean`; if any component of `complex` evaluates to `NaN`,
this returns `true`, otherwise `false`.

__Arguments__

* `complex` - An instance of the `Complex` class.


<a name="is-finite"></a>
### Complex.isFinite(complex), Complex#isFinite()

Returns a `Boolean`; if the absolute value of `complex` is finite,
this returns `true`, otherwise `false`.

__Arguments__

* `complex` - An instance of the `Complex` class.


<a name="is-real"></a>
### Complex.isReal(complex), Complex#isReal()

Returns a `Boolean`; if imaginary component of `complex` is close to `0`,
this returns `true`, otherwise `false`.

__Arguments__

* `complex` - An instance of the `Complex` class.


<a name="is-imag"></a>
### Complex.isImag(complex), Complex#isImag()

Returns a `Boolean`; if real component of `complex` is close to `0`,
this returns `true`, otherwise `false`.

__Arguments__

* `complex` - An instance of the `Complex` class.


<a name="compile"></a>
### Complex.compile(string[, params = []])

Returns a JavaScript function bound with pre-compiled constants parsed
from the human-readable math expression `string`. Optionally, an `Array`
of human-readable parameters may be supplied to parse from the expression.

__Arguments__

* `string` - A human-readable `String` of a math expression to be compiled.
* `params` - An optional `Array[String]` of human-readable parameters to parse.

## License

Copyright (c) 2017 Patrick Roberts

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without restriction,
including without limitation the rights to use, copy, modify,
merge, publish, distribute, sublicense, and/or sell copies of the
Software, and to permit persons to whom the Software is furnished
to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
