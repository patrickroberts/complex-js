<h1 style="text-align:center"><img src="https://i.imgur.com/XBOpBt1.png"></h1>

Complex-js is a lightweight module that enables complex mathematics
in JavaScript. It comes with every elementary function and all
mathematical operators. It also includes many utility functions and
common non-analytical functions such as the complex conjugate, the
argument function, the absolute value function and many others.

Lastly, but most importantly, this module contains a compiler to
parse human-readable expressions into native JavaScript functions.
The compiler, accessible from [`Complex.parseFunction`](#parse-function),
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

Complex.js can now be included as an AMD module as well, and is available via [`bower`](http://bower.io/search/?q=complex-js):

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
namespace Complex. That's because it is an operator rather than a function in
math. Non-static methods are denoted as `Complex.prototype.nonStaticMethod`.
Now you can use symbolic operators as well. These include addition ([`+`](#add)),
subtraction ([`-`](#sub)), multiplication ([`*`](#mult)), division ([`/`](#div)),
modulii ([`%`](#mod)), powers ([`^`](#pow)), and equalities ([`=`](#equals)).
Below is a couple examples.

```js
// 1+5i
var onePlusFiveI = Complex(1, 0)['+'](Complex(0, 5));
// e^(pi i)*3
var negThree = Complex.exp(Complex(0, Math.PI))['*'](Complex(3, 0));
```

<a name="coordinate-notation"></a>
## Coordinate Notation

Complex.js supports both cartesian and exponential notation. In order
to declare a Complex number with cartesian coordinates, you can call
the default constructor with the following arguments:

```js
var onePlusFiveI = Complex(1, 5);
```

Declaring it with the `new` keyword is optional, since the
constructor detects and corrects instantiation automatically.
Optionally, you may supply the absolute value and the argument of the
Complex number as well for the 3rd and 4th parameters, though this is
not recommended. Exponential notation is supported through the
secondary Polar constructor as such:

```js
var negOne = Complex.Polar(1, Math.PI);
```

Note that this constructor does not support the `new` keyword and
should never be called with it, as it does so internally.

Similarly, both notations are supported in the `Complex.prototype.toString` method.
Simply call `toString()` for exponential (the default),
or `toString(true)` for cartesian notation.

These strings can be used to reconstruct the Complex instances, but
that will be covered in the next section.


<a name="parsing"></a>
## Parsing Human-Readable Expressions

Complex.js also includes a compiler for human-readable expressions,
which is very useful for constructing functions callable from
JavaScript. Since it supports virtually any common notations and
fully supports order of operations, it's very easy to use. It even
normalizes implied multiplication and non-parenthetical grouping by
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
		var calc = Complex.parseFunction(input.value),
			//evaluate the compiled function for the answer
			ans = calc();

		//use the toString method
		cart.innerHTML = ans.toString(true);
		expo.innerHTML = ans.toString();
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
high-performace, since it caches all real-values in the expression
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
	jsFunc = Complex.parseFunction(complexFunc, ['b', 'a', 'c']),
	// how to pass parameters to compiled function
	output = jsFunc(paramB, paramA, paramC);

// output cartesian form as string
console.log(output.toString(true));
// -1.85444755246657E-64+1.5844569641866693E-64 i
```

The `Complex.parseFunction` method can also reconstruct a Complex
number from a string created by `Complex.toString`. See below for
a demonstration:

```js
var fivePlusIStr = Complex(5, 1).toString(true), //store as cartesian
    fivePlusI = (Complex.parseFunction(fivePlusIStr))();

console.log(Complex(5, 1).equals(fivePlusI));
// true
```

<a name="documentation"></a>
## Documentation

### [Constructors](#constructs)

* [`Complex`](#complex)
* [`Polar`](#polar)

### [Non-Static Methods](#non-static)

* [`toString`](#to-string)
* [`equals`](#equals)
* [`re`](#p-re)
* [`im`](#p-im)
* [`abs`](#p-abs)
* [`arg`](#p-arg)
* [`rAdd`](#r-add)
* [`add`](#add)
* [`rSub`](#r-sub)
* [`sub`](#sub)
* [`rMult`](#r-mult)
* [`mult`](#mult)
* [`rDiv`](#r-div)
* [`div`](#div)
* [`rMod`](#r-mod)
* [`mod`](#mod)
* [`rPow`](#r-pow)
* [`pow`](#pow)

### [Static Methods](#static)

* [`neg`](#neg)
* [`re`](#re)
* [`im`](#im)
* [`abs`](#abs)
* [`arg`](#arg)
* [`conj`](#conj)
* [`norm`](#norm)
* [`floor`](#floor)
* [`ceil`](#ceil)
* [`round`](#round)
* [`iPart`](#i-part)
* [`fPart`](#f-part)
* [`square`](#square)
* [`cube`](#cube)
* [`sqrt`](#sqrt)
* [`cbrt`](#cbrt)
* [`exp`](#exp)
* [`log`](#log)
* [`gamma`](#gamma)
* [`fact`](#fact)
* [`cos`](#cos)
* [`sin`](#sin)
* [`tan`](#tan)
* [`sec`](#sec)
* [`csc`](#csc)
* [`cot`](#cot)
* [`arccos`](#arccos)
* [`arcsin`](#arcsin)
* [`arctan`](#arctan)
* [`arcsec`](#arcsec)
* [`arccsc`](#arccsc)
* [`arccot`](#arccot)
* [`cosh`](#cosh)
* [`sinh`](#sinh)
* [`tanh`](#tanh)
* [`sech`](#sech)
* [`csch`](#csch)
* [`coth`](#coth)
* [`arccosh`](#arccosh)
* [`arcsinh`](#arcsinh)
* [`arctanh`](#arctanh)
* [`arcsech`](#arcsech)
* [`arccsch`](#arccsch)
* [`arccoth`](#arccoth)

### [Misc. Methods](#misc)

* [`min`](#min)
* [`max`](#max)
* [`isNaN`](#is-nan)
* [`isFinite`](#is-finite)
* [`formatFunction`](#format-function)
* [`parseFunction`](#parse-function)

### Constants

For convenience, but also used in many of the trigonometric methods.

* `Complex.ZERO` - zero
* `Complex.ONE` - one
* `Complex.I` - i
* `Complex.NEG_I` - negative i
* `Complex.PI` - irrational constant "π"
* `Complex.E` - irrational constant "e"
* `Complex.TWO` - two
* `Complex.TWO_I` - two i

<a name="constructs"></a>
## Constructors

<a name="complex"></a>
### Complex(real, imag[, abs[, arg]])

The cartesian constructor for instances of the `Complex` class.
Optionally call with `new`, but not required.

__Arguments__

* `real` - A `Number` specifying the real value of the Complex number.
* `imag` - A `Number` specifying the imaginary value of the Complex number.
* `abs` - An optional `Number` specifying the absolute value of the Complex number.
  Not recommended unless accurately calculated.
* `arg` - An optional `Number` specifying the argument of the Complex number.
  Not recommended unless accurately calculated.


<a name="polar"></a>
### Complex.Polar(abs, arg)

The exponential constructor for instances of the `Complex` class.
**Note** Do not call this constructor with `new`.

__Arguments__

* `abs` - A `Number` specifying the absolute value of the Complex number.
* `arg` - A `Number` specifying the argument of the Complex number.


**Note** In order to access the components from the instance,
examine the following demo code:

```js
var complex = Complex(Math.random()*2-1,Math.random()*2-1);
console.log(
	complex.real(), // real part
	complex.imag(), // imaginary part
	complex.abs(),  // absolute value
	complex.arg()   // argument
);
```

<a name="non-static"></a>
## Non-Static Methods

<a name="to-string"></a>
### Complex.prototype.toString([cartesian])

The `toString` method for the `Complex` class. Outputs to exponential
or cartesian form.

__Arguments__

* `cartesian` - An optional Boolean specifying the output form.
  If truthy, it outputs as cartesian, otherwise it outputs as exponential.

**Examples**

```js
var c1 = Complex(-3,0),
	c2 = Complex(0,-1),
	c3 = Complex(3,4),
	c4 = Complex(-2,-5);

console.log(c1.toString());
// "3 e^(3.141592653589793 i)"

console.log(c2.toString(true));
// "-i"

console.log(c3.toString());
// "5 e^(0.9272952180016123 i)"

console.log(c4.toString(true));
// "-2-5 i"
```


<a name="equals"></a>
### Complex.prototype.equals(complex)

Compares two complex numbers and determines whether they are approximately equal,
taking into consideration truncation error.

__Arguments__

* `complex` - An instance of the `Complex` class to which to compare.


<a name="p-re"></a>
### Complex.prototype.re(), Complex.prototype.real()

Returns the real component as a `Number`.


<a name="p-im"></a>
### Complex.prototype.im(), Complex.prototype.imag()

Returns the imaginary component as a `Number`.


<a name="p-abs"></a>
### Complex.prototype.abs(), Complex.prototype.mag()

Returns the magnitude as a `Number`.


<a name="p-arg"></a>
### Complex.prototype.arg(), Complex.prototype.angle()

Returns the argument as a `Number`.


<a name="r-add"></a>
### Complex.prototype.rAdd(real)

Adds a Complex number and a `Number`.

__Arguments__

* `real` - A `Number` to add.


<a name="add"></a>
### Complex.prototype.add(complex), Complex.prototype\['+'\](complex)

Adds two Complex numbers.

__Arguments__

* `complex` - An instance of the `Complex` class to add.


<a name="r-sub"></a>
### Complex.prototype.rSub(real)

Subtracts a `Number` from a Complex number.

__Arguments__

* `real` - A `Number` to subtract.


<a name="sub"></a>
### Complex.prototype.sub(complex), Complex.prototype\['-'\](complex)

Subtracts a Complex number from another.

__Arguments__

* `complex` - An instance of the `Complex` class to subtract.


<a name="r-mult"></a>
### Complex.prototype.rMult(real)

Multiplies a Complex number and a `Number`.

__Arguments__

* `real` - A `Number` to multiply.


<a name="mult"></a>
### Complex.prototype.mult(complex), Complex.prototype\['*'\](complex)

Multiplies two Complex numbers.

__Arguments__

* `complex` - An instance of the `Complex` class to multiply.


<a name="r-div"></a>
### Complex.prototype.rDiv(real)

Divides a Complex number by a `Number`.

__Arguments__

* `real` - A `Number` by which to divide.


<a name="div"></a>
### Complex.prototype.div(complex), Complex.prototype\['/'\](complex)

Divides a Complex number by another.

__Arguments__

* `complex` - An instance of the `Complex` class by which to divide.


<a name="r-mod"></a>
### Complex.prototype.rMod(real)

Applies a Real Modulus to a Complex number by cartesian coordinates.

__Arguments__

* `real` - A `Number` to for the modulus.


<a name="mod"></a>
### Complex.prototype.mod(complex), Complex.prototype\['%'\](complex)

Applies a Complex Modulus to a Complex number by cartesian coordinates.

__Arguments__

* `complex` - An instance of the `Complex` class for the modulus.


<a name="r-pow"></a>
### Complex.prototype.rPow(real)

Raises a Complex number to a Real power.

__Arguments__

* `real` - A `Number` by which to raise.


<a name="pow"></a>
### Complex.prototype.pow(complex), Complex.prototype\['^'\](complex)

Raises a Complex number to a Complex power.

__Arguments__

* `complex` - An instance of the `Complex` class by which to raise.


<a name="static"></a>
## Static Methods


<a name="neg"></a>
### Complex.neg(complex)

Returns the negative of `complex`.

__Arguments__

* `complex` - An instance of the `Complex` class to negate.


<a name="re"></a>
### Complex.re(complex)

Returns the real component of `complex` as an instance of Complex.
The real value is stored in the real component of the returned instance.

__Arguments__

* `complex` - An instance of the `Complex` class.


<a name="im"></a>
### Complex.im(complex)

Returns the imaginary component of `complex` as an instance of Complex.
The imaginary value is stored in the real component of the returned instance.

__Arguments__

* `complex` - An instance of the `Complex` class.


<a name="abs"></a>
### Complex.abs(complex)

Returns the absolute value of `complex`.
The absolute value is stored in the real component of the returned instance.

__Arguments__

* `complex` - An instance of the `Complex` class.


<a name="arg"></a>
### Complex.arg(complex)

Returns the argument of `complex`.
The argument is stored in the real component of the returned instance.

__Arguments__

* `complex` - An instance of the `Complex` class.


<a name="conj"></a>
### Complex.conj(complex)

Returns the conjugate of `complex`.

__Arguments__

* `complex` - An instance of the `Complex` class to conjugate.


<a name="norm"></a>
### Complex.norm(complex)

Returns the unit complex number with the same argument as `complex`.
If the magnitude of `complex` is 0, then an instance of `Complex` is
returned with a magnitude of `NaN` and an argument of 0.

__Arguments__

* `complex` - An instance of the `Complex` class to normalize.


<a name="floor"></a>
### Complex.floor(complex)

Rounds down the cartesian components of `complex`.

__Arguments__

* `complex` - An instance of the `Complex` class.


<a name="ceil"></a>
### Complex.ceil(complex)

Rounds up the cartesian components of `complex`.

__Arguments__

* `complex` - An instance of the `Complex` class.


<a name="round"></a>
### Complex.round(complex)

Rounds the cartesian components of `complex` to the nearest integers.

__Arguments__

* `complex` - An instance of the `Complex` class.


<a name="i-part"></a>
### Complex.iPart(complex)

Returns the integer parts of the cartesian coordinates in `complex`.
This floors positive components and ceilings negative components.

__Arguments__

* `complex` - An instance of the `Complex` class.


<a name="f-part"></a>
### Complex.fPart(complex)

Returns the fractional parts of the cartesian coordinates in `complex`.

__Arguments__

* `complex` - An instance of the `Complex` class.


<a name="square"></a>
### Complex.square(complex)

Returns the square of `complex`.

__Arguments__

* `complex` - An instance of the `Complex` class.


<a name="cube"></a>
### Complex.cube(complex)

Returns the cube of `complex`.

__Arguments__

* `complex` - An instance of the `Complex` class.


<a name="sqrt"></a>
### Complex.sqrt(complex)

Returns the square root of `complex`.

__Arguments__

* `complex` - An instance of the `Complex` class.


<a name="cbrt"></a>
### Complex.cbrt(complex)

Returns the cube root of `complex`.

__Arguments__

* `complex` - An instance of the `Complex` class.


<a name="exp"></a>
### Complex.exp(complex)

Returns the exponent function of `complex`, i.e. `e^complex`

__Arguments__

* `complex` - An instance of the `Complex` class.


<a name="log"></a>
### Complex.log(complex)

Returns the natural logarithm of `complex`.

__Arguments__

* `complex` - An instance of the `Complex` class.


<a name="gamma"></a>
### Complex.gamma(complex)

Returns the gamma function of `complex`.
**Note** This function is not guaranteed to be accurate enough
for the `Complex.prototype.equals` method to return true when
compared to expected results.

__Arguments__

* `complex` - An instance of the `Complex` class.


<a name="fact"></a>
### Complex.fact(complex)

Returns the factorial of `complex`.
**Note** This function is not guaranteed to be accurate enough
for the `Complex.prototype.equals` method to return true when
compared to expected results.

__Arguments__

* `complex` - An instance of the `Complex` class.


<a name="cos"></a>
### Complex.cos(complex)

Returns the cosine of `complex`.

__Arguments__

* `complex` - An instance of the `Complex` class.


<a name="sin"></a>
### Complex.sin(complex)

Returns the sine of `complex`.

__Arguments__

* `complex` - An instance of the `Complex` class.


<a name="tan"></a>
### Complex.tan(complex)

Returns the tangent of `complex`.

__Arguments__

* `complex` - An instance of the `Complex` class.


<a name="sec"></a>
### Complex.sec(complex)

Returns the secant of `complex`.

__Arguments__

* `complex` - An instance of the `Complex` class.


<a name="csc"></a>
### Complex.csc(complex)

Returns the cosecant of `complex`.

__Arguments__

* `complex` - An instance of the `Complex` class.


<a name="cot"></a>
### Complex.cot(complex)

Returns the cotangent of `complex`.

__Arguments__

* `complex` - An instance of the `Complex` class.


<a name="arccos"></a>
### Complex.arccos(complex)

Returns the arccosine of `complex`.

__Arguments__

* `complex` - An instance of the `Complex` class.


<a name="arcsin"></a>
### Complex.arcsin(complex)

Returns the arcsine of `complex`.

__Arguments__

* `complex` - An instance of the `Complex` class.


<a name="arctan"></a>
### Complex.arctan(complex)

Returns the arctangent of `complex`.

__Arguments__

* `complex` - An instance of the `Complex` class.


<a name="arcsec"></a>
### Complex.arcsec(complex)

Returns the arcsecant of `complex`.

__Arguments__

* `complex` - An instance of the `Complex` class.


<a name="arccsc"></a>
### Complex.arccsc(complex)

Returns the arccosecant of `complex`.

__Arguments__

* `complex` - An instance of the `Complex` class.


<a name="arccot"></a>
### Complex.arccot(complex)

Returns the arccotangent of `complex`.

__Arguments__

* `complex` - An instance of the `Complex` class.


<a name="cosh"></a>
### Complex.cosh(complex)

Returns the hyperbolic cosine of `complex`.

__Arguments__

* `complex` - An instance of the `Complex` class.


<a name="sinh"></a>
### Complex.sinh(complex)

Returns the hyperbolic sine of `complex`.

__Arguments__

* `complex` - An instance of the `Complex` class.


<a name="tanh"></a>
### Complex.tanh(complex)

Returns the hyperbolic tangent of `complex`.

__Arguments__

* `complex` - An instance of the `Complex` class.


<a name="sech"></a>
### Complex.sech(complex)

Returns the hyperbolic secant of `complex`.

__Arguments__

* `complex` - An instance of the `Complex` class.


<a name="csch"></a>
### Complex.csch(complex)

Returns the hyperbolic cosecant of `complex`.

__Arguments__

* `complex` - An instance of the `Complex` class.


<a name="coth"></a>
### Complex.coth(complex)

Returns the hyperbolic cotangent of `complex`.

__Arguments__

* `complex` - An instance of the `Complex` class.


<a name="arccosh"></a>
### Complex.arccosh(complex)

Returns the hyperbolic arccosine of `complex`.

__Arguments__

* `complex` - An instance of the `Complex` class.


<a name="arcsinh"></a>
### Complex.arcsinh(complex)

Returns the hyperbolic arcsine of `complex`.

__Arguments__

* `complex` - An instance of the `Complex` class.


<a name="arctanh"></a>
### Complex.arctanh(complex)

Returns the hyperbolic arctangent of `complex`.

__Arguments__

* `complex` - An instance of the `Complex` class.


<a name="arcsech"></a>
### Complex.arcsech(complex)

Returns the hyperbolic arcsecant of `complex`.

__Arguments__

* `complex` - An instance of the `Complex` class.


<a name="arccsch"></a>
### Complex.arccsch(complex)

Returns the hyperbolic arccosecant of `complex`.

__Arguments__

* `complex` - An instance of the `Complex` class.


<a name="arccoth"></a>
### Complex.arccoth(complex)

Returns the hyperbolic arccotangent of `complex`.

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
### Complex.isNaN(complex)

Returns a `Boolean`; if any component of `complex` evaluates to `NaN`,
this returns `true`, otherwise `false`.

__Arguments__

* `complex` - An instance of the `Complex` class.


<a name="is-finite"></a>
### Complex.isFinite(complex)

Returns a `Boolean`; if the absolute value of `complex` is finite,
this returns `true`, otherwise `false`.

__Arguments__

* `complex` - An instance of the `Complex` class.


<a name="format-function"></a>
### Complex.formatFunction(string)

Returns a sterilized human-readable expression that can be parsed by
[`Complex.parseFunction`](#parse-function) if `string` is a valid math
expression.

__Arguments__

* `string` - A human-readable `String` of a math expression to be sterilized.


<a name="parse-function"></a>
### Complex.parseFunction(string[, params][, skipFormat])

Returns a JavaScript function bound with pre-compiled constants parsed
from the human-readable math expression `string`. Optionally, an `Array`
of human-readable parameters may be supplied to parse from the expression.
Lastly, `skipFormat` is an optional `Boolean` that can be specified if
`string` has already been formatted by [`Complex.formatFunction`](#format-function).

__Arguments__

* `string` - A human-readable `String` of a math expression to be compiled.
* `params` - An optional `Array[String]` of human-readable parameters to parse.
* `skipFormat` - An optional `Boolean` to determine whether to skip pre-formatting.
