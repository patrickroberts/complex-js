# Complex.js

Complex.js is a lightweight module that enables Complex mathematics
in JavaScript. It comes with every elementary function and all
mathematical operators. It also includes many utility functions and
common non-analytical functions such as the Complex conjugate, the
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

* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

<a name="download" />
## Download

To install via `npm`, run:

```
npm install complex-js
```

To include this module in the Node.js environment, add the line:

```js
var Complex = require('complex-js');
```

In the browser, simply add the script:

```html
<script type="text/javascript" src="complex.min.js"></script>
```

<a name="functions-vs-operators" />
## Functions vs. Operators

Functions are denoted as `Complex.staticMethod`. For example,
to evaluate the tangent of the imaginary unit, do the following:

```js
console.log(Complex.tan(Complex(0,1)));
```

All functions are static, meaning that they are called directly by
the Complex namespace. Operators are non-static methods, which means
they must be called by an instance of `Complex`. For example, to raise
1+5i to the power of 3*e^((2/3)pi*i), do the following:

```js
console.log(Complex(1,5).cPow(Complex.Polar(3,2/3*Math.PI)));
```

Notice how `cPow` is a method of a `Complex` instance, and not of the
namespace Complex. That's because it is an operator rather than a
function. Non-static methods are denoted as
`Complex.prototype.nonStaticMethod`.


<a name="coordinate-notation" />
## Coordinate Notation

Complex.js supports both cartesian and exponential notation. In order
to declare a Complex number with cartesian coordinates, you can call
the default constructor with the following arguments:

```js
var cartesian_1_plus_5_i = Complex(1,5);
```

Declaring it with the `new` keyword is optional, since the
constructor detects and corrects instantiation automatically.
Optionally, you may supply the absolute value and the argument of the
Complex number as well for the 3rd and 4th parameters, though this is
not recommended. Exponential notation is supported through the
secondary Polar constructor as such:

```js
var exponential_1_e_to_pi_i = Complex.Polar(1,Math.PI);
```

Note that this constructor does not support the `new` keyword and
should never be called with it, as it does so internally.

Similarly, both notations are supported in the toString method.
Simply call `toString()` for exponential (the default),
or `toString(true)` for cartesian notation.

These strings can be used to reconstruct the Complex instances, but
that will be covered in the next section.


<a name="parsing" />
## Parsing Human-Readable Expressions

Complex.js also includes a compiler for human-readable expressions,
which is very useful for constructing functions callable from
JavaScript. Since it supports virtually any common notations and
fully supports order of operations, it's very easy to use. It even
normalizes implied multiplication and non-parenthetical grouping by
default. A simple use-case example is below.

HTML:
```html
<!-- the value is (5+i)^(.00003+10*sin(5i)) -->
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
<script type="text/javascript" src="complex.min.js"></script>
<script type="text/javascript">
	...
</script>
```
JavaScript:
```js
var input = document.getElementById('calc'),
	cart = document.getElementById('ans-cart'),
	expo = document.getElementById('ans-expo');

input.addEventListener('change', function(){
	try {
		var
			//will throw an error if input is invalid
			calc = Complex.parseFunction(input.value),
			//evaluate the compiled function for the answer
			ans = calc();
		//use the toString method
		cart.innerHTML = ans.toString(true);
		expo.innerHTML = ans.toString();
	} catch(error) {
		//if the parser throws an error, clear outputs and alert error
		cart.innerHTML = "";
		expo.innerHTML = "";
		alert(error);
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
var Complex = require("complex-js"),
	param_a = Complex(5,1),
	param_b = Complex(3e-5,0),
	param_c = Complex(0,5),
	// human-readable variable names in expression
	complex_func = "a^(b+10*sin(c))",
	// array of parameters for function is order-dependent
	js_func = Complex.parseFunction(complex_func, ["b","a","c"]),
	// how to pass parameters to compiled function
	output = js_func(param_b, param_a, param_c);

// output cartesian form as string
console.log(output.toString(true));
```

The `Complex.parseFunction` method can also reconstruct a Complex
number from a string created by `Complex.toString`. See below for
a demonstration:

```js
var five_plus_i_str = Complex(5,1).toString(true), //store as cartesian
    five_plus_i = (Complex.parseFunction(five_plus_i_str, []))();

// should log true
console.log(five_plus_i instanceof Complex && five_plus_i.re === 5 && five_plus_i.i === 1);
```

* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

<a name="documentation" />
## Documentation

<h3>[Constructors](#constructors)</h3>

* [`Complex`](#complex)
* [`Polar`](#polar)

<h3>[Non-Static Methods](#non-static)</h3>

* [`toString`](#to-string)
* [`add`](#add)
* [`sub`](#sub)
* [`mult`](#mult)
* [`divBy`](#div-by)
* [`pow`](#pow)
* [`cPow`](#c-pow)
* [`mod`](#mod)

<h3>[Static Methods](#static)</h3>

* [`conj`](#conj)
* [`neg`](#neg)
* [`re`](#re)
* [`im`](#im)
* [`abs`](#abs)
* [`arg`](#arg)
* [`floor`](#floor)
* [`ceil`](#ceil)
* [`round`](#round)
* [`fPart`](#f-part)

<h3>[Mathematical Static Methods](#math)</h3>

* [`exp`](#exp)
* [`log`](#log)
* [`sqrt`](#sqrt)
* [`cbrt`](#cbrt)
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

<h3>[Misc. Static Methods](#misc)</h3>

* [`min`](#min)
* [`max`](#max)
* [`isNaN`](#is-nan)
* [`isFinite`](#is-finite)
* [`formatFunction`](#format-function)
* [`parseFunction`](#parse-function)

<h3>Constants</h3>

For convenience, but also used in many of the trigonometric methods.

* `0` - zero
* `1` - one
* `I` - i
* `-I` - negative i
* `PI` - irrational constant "pi"
* `E` - irrational constant "e"
* `2` - two
* `2I` - two i

* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

<a name="constructors" />
## Constructors

<a name="complex" />
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


<a name="polar" />
### Complex.Polar(abs, arg)

The exponential constructor for instances of the `Complex` class.
**Note** Do not call this constructor with `new`.

__Arguments__

* `abs` - A `Number` specifying the absolute value of the Complex number.
* `arg` - A `Number` specifying the argument of the Complex number.

* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

<a name="non-static" />
## Non-Static Methods

<a name="to-string" />
### Complex.prototype.toString([cartesian])

The `toString` method for the `Complex` class. Outputs to exponential
or cartesian form.

__Arguments__

* `cartesian` - An optional Boolean specifying the output form.
  If truthy, it outputs as cartesian, otherwise it outputs as exponential.


<a name="add" />
### Complex.prototype.add(complex)

Adds two Complex numbers.

__Arguments__

* `complex` - An instance of the `Complex` class to add.


<a name="sub" />
### Complex.prototype.sub(complex)

Subtracts a Complex number from another.

__Arguments__

* `complex` - An instance of the `Complex` class to subtract.


<a name="mult" />
### Complex.prototype.mult(complex)

Multiplies two Complex numbers.

__Arguments__

* `complex` - An instance of the `Complex` class to multiply.


<a name="div-by" />
### Complex.prototype.divBy(complex)

Divides a Complex number from another.

__Arguments__

* `complex` - An instance of the `Complex` class to divide by.


<a name="pow" />
### Complex.prototype.pow(number)

Raises a Complex number to a real power.

__Arguments__

* `number` - A `Number` to raise the Complex number to.


<a name="c-pow" />
### Complex.prototype.cPow(complex)

Raises a Complex number to a Complex power.

__Arguments__

* `complex` - An instance of the `Complex` class to raise by.


<a name="mod" />
### Complex.prototype.mod(complex)

Applies a Complex Modulus to a Complex number by cartesian coordinates.

__Arguments__

* `complex` - An instance of the `Complex` class for the modulus.

* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

<a name="static" />
## Static Methods

<a name="conj" />
### Complex.conj(complex)

Returns the conjugate of `complex`.

__Arguments__

* `complex` - An instance of the `Complex` class to conjugate.


<a name="neg" />
### Complex.neg(complex)

Returns the negative of `complex`.

__Arguments__

* `complex` - An instance of the `Complex` class to negate.


<a name="re" />
### Complex.re(complex)

Returns the real component of `complex` as an instance of Complex.
The real value is stored in the real component of the returned instance.

__Arguments__

* `complex` - An instance of the `Complex` class.


<a name="im" />
### Complex.im(complex)

Returns the imaginary component of `complex` as an instance of Complex.
The imaginary value is stored in the real component of the returned instance.

__Arguments__

* `complex` - An instance of the `Complex` class.


<a name="abs" />
### Complex.abs(complex)

Returns the absolute value of `complex`.
The absolute value is stored in the real component of the returned instance.

__Arguments__

* `complex` - An instance of the `Complex` class.


<a name="arg" />
### Complex.arg(complex)

Returns the argument of `complex`.
The argument is stored in the real component of the returned instance.

__Arguments__

* `complex` - An instance of the `Complex` class.


<a name="floor" />
### Complex.floor(complex)

Rounds down the cartesian components of `complex`.

__Arguments__

* `complex` - An instance of the `Complex` class.


<a name="ceil" />
### Complex.ceil(complex)

Rounds up the cartesian components of `complex`.

__Arguments__

* `complex` - An instance of the `Complex` class.


<a name="round" />
### Complex.round(complex)

Rounds the cartesian components of `complex` to the nearest integers.

__Arguments__

* `complex` - An instance of the `Complex` class.


<a name="f-part" />
### Complex.fPart(complex)

Returns the fractional parts of the cartesian coordinates in `complex`.

__Arguments__

* `complex` - An instance of the `Complex` class.

* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

<a name="math" />
## Mathematical Static Methods

<a name="exp" />
### Complex.exp(complex)

Returns the exponent function of `complex`, i.e. `e^complex`

__Arguments__

* `complex` - An instance of the `Complex` class.


<a name="log" />
### Complex.log(complex)

Returns the natural logarithm of `complex`.

__Arguments__

* `complex` - An instance of the `Complex` class.


<a name="sqrt" />
### Complex.sqrt(complex)

Returns the square root of `complex`.

__Arguments__

* `complex` - An instance of the `Complex` class.


<a name="cbrt" />
### Complex.cbrt(complex)

Returns the cube root of `complex`.

__Arguments__

* `complex` - An instance of the `Complex` class.


<a name="cos" />
### Complex.cos(complex)

Returns the cosine of `complex`.

__Arguments__

* `complex` - An instance of the `Complex` class.


<a name="sin" />
### Complex.sin(complex)

Returns the sine of `complex`.

__Arguments__

* `complex` - An instance of the `Complex` class.


<a name="tan" />
### Complex.tan(complex)

Returns the tangent of `complex`.

__Arguments__

* `complex` - An instance of the `Complex` class.


<a name="sec" />
### Complex.sec(complex)

Returns the secant of `complex`.

__Arguments__

* `complex` - An instance of the `Complex` class.


<a name="csc" />
### Complex.csc(complex)

Returns the cosecant of `complex`.

__Arguments__

* `complex` - An instance of the `Complex` class.


<a name="cot" />
### Complex.cot(complex)

Returns the cotangent of `complex`.

__Arguments__

* `complex` - An instance of the `Complex` class.


<a name="arccos" />
### Complex.arccos(complex)

Returns the arccosine of `complex`.

__Arguments__

* `complex` - An instance of the `Complex` class.


<a name="arcsin" />
### Complex.arcsin(complex)

Returns the arcsine of `complex`.

__Arguments__

* `complex` - An instance of the `Complex` class.


<a name="arctan" />
### Complex.arctan(complex)

Returns the arctangent of `complex`.

__Arguments__

* `complex` - An instance of the `Complex` class.


<a name="arcsec" />
### Complex.arcsec(complex)

Returns the arcsecant of `complex`.

__Arguments__

* `complex` - An instance of the `Complex` class.


<a name="arccsc" />
### Complex.arccsc(complex)

Returns the arccosecant of `complex`.

__Arguments__

* `complex` - An instance of the `Complex` class.


<a name="arccot" />
### Complex.arccot(complex)

Returns the arccotangent of `complex`.

__Arguments__

* `complex` - An instance of the `Complex` class.


<a name="cosh" />
### Complex.cosh(complex)

Returns the hyperbolic cosine of `complex`.

__Arguments__

* `complex` - An instance of the `Complex` class.


<a name="sinh" />
### Complex.sinh(complex)

Returns the hyperbolic sine of `complex`.

__Arguments__

* `complex` - An instance of the `Complex` class.


<a name="tanh" />
### Complex.tanh(complex)

Returns the hyperbolic tangent of `complex`.

__Arguments__

* `complex` - An instance of the `Complex` class.


<a name="sech" />
### Complex.sech(complex)

Returns the hyperbolic secant of `complex`.

__Arguments__

* `complex` - An instance of the `Complex` class.


<a name="csch" />
### Complex.csch(complex)

Returns the hyperbolic cosecant of `complex`.

__Arguments__

* `complex` - An instance of the `Complex` class.


<a name="coth" />
### Complex.coth(complex)

Returns the hyperbolic cotangent of `complex`.

__Arguments__

* `complex` - An instance of the `Complex` class.


<a name="arccosh" />
### Complex.arccosh(complex)

Returns the hyperbolic arccosine of `complex`.

__Arguments__

* `complex` - An instance of the `Complex` class.


<a name="arcsinh" />
### Complex.arcsinh(complex)

Returns the hyperbolic arcsine of `complex`.

__Arguments__

* `complex` - An instance of the `Complex` class.


<a name="arctanh" />
### Complex.arctanh(complex)

Returns the hyperbolic arctangent of `complex`.

__Arguments__

* `complex` - An instance of the `Complex` class.


<a name="arcsech" />
### Complex.arcsech(complex)

Returns the hyperbolic arcsecant of `complex`.

__Arguments__

* `complex` - An instance of the `Complex` class.


<a name="arccsch" />
### Complex.arccsch(complex)

Returns the hyperbolic arccosecant of `complex`.

__Arguments__

* `complex` - An instance of the `Complex` class.


<a name="arccoth" />
### Complex.arccoth(complex)

Returns the hyperbolic arccotangent of `complex`.

__Arguments__

* `complex` - An instance of the `Complex` class.

* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

<a name="misc" />
## Misc. Static Methods

<a name="min" />
### Complex.min(complex_1[, complex_2...])

Returns the first complex instance with the smallest absolute value.

__Arguments__

* `complex_n` - An instance of the `Complex` class.


<a name="max" />
### Complex.max(complex_1[, complex_2...])

Returns the first complex instance with the largest absolute value.

__Arguments__

* `complex_n` - An instance of the `Complex` class.


<a name="is-nan" />
### Complex.isNaN(complex)

Returns a `Boolean`; if any component of `complex` evaluates to `NaN`,
this returns `true`, otherwise `false`.

__Arguments__

* `complex` - An instance of the `Complex` class.


<a name="is-finite" />
### Complex.isFinite(complex)

Returns a `Boolean`; if the absolute value of `complex` is finite,
this returns `true`, otherwise `false`.

__Arguments__

* `complex` - An instance of the `Complex` class.


<a name="format-function" />
### Complex.formatFunction(string)

Returns a sterilized human-readable expression that can be parsed by
[`Complex.parseFunction`](#parse-function) if `string` is a valid math
expression.

__Arguments__

* `string` - A human-readable `String` of a math expression to be sterilized.


<a name="parse-function" />
### Complex.parseFunction(string[, params[, skipFormat]])

Returns a JavaScript function bound with pre-compiled constants parsed
from the human-readable math expression `string`. Optionally, an `Array`
of human-readable parameters may be supplied to parse from the expression.
Lastly, `skipFormat` is an optional `Boolean` that can be specified if
`string` has already been formatted by [`Complex.formatFunction`](#format-function).

__Arguments__

* `string` - A human-readable `String` of a math expression to be compiled.
* `params` - An optional `Array[String]` of human-readable parameters to parse.
* `skipFormat` - An optional `Boolean` to determine whether to skip pre-formatting.
