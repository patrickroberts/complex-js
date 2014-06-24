/*
// Copyright (c) 2012 Patrick Roberts
// 
// Permission is hereby granted, free of charge, to any person
// obtaining a copy of this software and associated documentation
// files (the "Software"), to deal in the Software without restriction,
// including without limitation the rights to use, copy, modify,
// merge, publish, distribute, sublicense, and/or sell copies of the
// Software, and to permit persons to whom the Software is furnished
// to do so, subject to the following conditions:
// 
// included in all copies or substantial portions of the Software.
// 
// The above copyright notice and this permission notice shall be
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
// OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
// HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
// WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
// FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
// OTHER DEALINGS IN THE SOFTWARE.
*/
(function () {

	// localize global scope and Math
	var root = this,
		Math = root.Math;

	// Math object helper functions for more advanced formulas
	Math.sinh = function (x) {
		return(-Math.exp(-x) + Math.exp(x)) / 2;
	};

	Math.cosh = function (x) {
		return(Math.exp(-x) + Math.exp(x)) / 2;
	};

	var floor = function (x) {
			return(x >= 0 ? x - x % 1 : x - (x % 1 + 1));
		},
		round = function (x) {
			x += .5;
			return(x >= 0 ? x - x % 1 : x - (x % 1 + 1));
		},
		ceil = function (x) {
			return(x >= 0 ? x - (x % 1 + 1) : x - x % 1);
		},
		PI = Math.PI,
		g = 7,
		index = [],
		p = [
			0.99999999999980993, 676.5203681218851, -1259.1392167224028,
			771.32342877765313, -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7
		]
		.map(function (coef, i) {
			index.push(Complex(i, 0, i, 0));
			return Complex(coef, 0, Math.abs(coef), coef < 0 ? PI : 0);
		}),
		SQRT2PI = Complex(Math.sqrt(2 * PI), 0, Math.sqrt(2 * PI), 0);

	// Component constructor for Complex class
	// r:Number (required)
	// 		the Real part
	// i:Number (required)
	// 		the Imaginary part
	// m:Number (optional)
	// 		the Magnitude
	// t:Number (optional)
	// 		the Argument
	// Note: when calling this constructor, it
	// 		 is recommended to omit the second
	// 		 two arguments, unless they have
	// 		 been accurately calculated.
	function Complex(r, i, m, t) {
		var invoked = this instanceof Complex,
			self = invoked ? this : new Complex(r, i, m, t);
		if(!invoked) return self;
		self.m = (typeof m == "number" ? Math.abs(m) : Math.sqrt(r * r + i * i));
		if(typeof t == "number") {
			self.t = (m >= 0 ? t : t + PI);
		} else {
			self.t = Math.atan2(i, r);
		}
		// limit argument between (-pi,pi]
		self.t = PI - (PI * 3 - (PI - (PI * 3 - self.t) % (PI * 2))) % (PI * 2);
		self.r = r;
		self.i = i;
	}

	// Use for displaying Complex numbers as a string
	// type:Boolean
	// 		if true, the display is a+bi form
	// 		if false or omitted, the display is r e^(ti) form
	Complex.prototype.toString = function (type) {
		return type ? this.r.toPrecision()
			.toUpperCase() + (this.i >= 0 ? "+" : "") + this.i.toPrecision()
			.toUpperCase() + " i" : this.m.toPrecision()
			.toUpperCase() + "*e^(" + this.t.toPrecision()
			.toUpperCase() + "*i)";
	};

	// Exponent function
	Complex.exp = function (c) {
		// formula: e^(a+bi) = e^a e^(bi)
		return c.i == 0 ? Complex["E"].pow(c.r) : Complex.Polar(Math.exp(c.r), c.i);
	};

	// Polar constructor for Complex class
	// r:Number (required)
	// 		the Magnitude
	// t:Number (required)
	// 		the Argument
	Complex.Polar = function (r, t) {
		return new Complex(r * Math.cos(t), r * Math.sin(t), r, t);
	};

	// Addition operator
	Complex.prototype.add = function (c) {
		return Complex(this.r + c.r, this.i + c.i);
	};

	// Subtraction operator
	Complex.prototype.sub = function (c) {
		return Complex(this.r - c.r, this.i - c.i);
	};

	// Floor function
	// integerizes the two components separately
	Complex.floor = function (c) {
		return Complex(floor(c.r), floor(c.i));
	};

	// Ceiling function
	// Rounds up the two compenents separately
	Complex.ceil = function (c) {
		return Complex(ceil(c.r), ceil(c.i));
	};

	// Conjugate function
	// Reverses the sign of the imaginary component
	Complex.conj = function (c) {
		return Complex(c.r, -c.i, c.m, (PI * 2 - c.t) % PI * 2);
	};

	// Multiplication operator
	Complex.prototype.mult = function (c) {
		// formula: r1 e^(t1i) * r2 e^(t2i) = r1r2 e^((t1+t2)i)
		return Complex.Polar(this.m * c.m, this.t + c.t);
	};

	// Division operator
	Complex.prototype.divBy = function (c) {
		// formula: r1 e^(t1i) / (r2 e^(t2i)) = r1/r2 e^((t1-t2)i)
		return Complex.Polar(this.m / c.m, this.t - c.t);
	};

	// Square function
	Complex.square = function (c) {
		// formula: (a+bi)^2 = (a^2-b^2) + (2ab)i
		return Complex(c.r * c.r - c.i * c.i, 2 * c.r * c.i, c.m * c.m, c.t * 2);
	};

	// Cube function
	Complex.cube = function (c) {
		// formula: (a+bi)^3 = (a^3-3ab^2) + (3a^2b-b^3)i
		return Complex(c.r * c.r * c.r - 3 * c.r * c.i * c.i, 3 * c.r * c.r * c.i - c.i * c.i * c.i, c.m * c.m * c.m, c.t * 3);
	};

	// Real Power operator
	// z:Number
	// 		MUST be a Number, not a Complex
	Complex.prototype.pow = function (z) {
		if(z == 2) return Complex.square(this);
		if(z == 3) return Complex.cube(this);
		// formula: (r e^(ti))^(z) = r^z e^(tzi)
		return Complex.Polar(Math.pow(this.m, z), this.t * z);
	};

	// Square Root function
	Complex.sqrt = function (c) {
		return c.pow(.5);
	};

	// Cube Root function
	Complex.cbrt = function (c) {
		return c.pow(1 / 3);
	}

	// Complex Power operator
	// c:Complex
	// 		MUST be a Complex, not a Number
	Complex.prototype.cPow = function (c) {
		// formula: (r e^(ti))^(a+bi) = (r^a e^(-bt)) e^((ln(r)b+at)i)
		return c.i == 0 ? this.pow(c.r) : Complex.Polar(Math.pow(this.m, c.r) * Math.exp(-c.i * this.t), c.i * Math.log(this.m) + c.r * this.t);
	};

	// Gamma function
	Complex.gamma = function (c) {
		if(z.r < .5) return Complex["PI"].divBy(Complex.sin(Complex["PI"].mult(c))
			.mult(Complex.gamma(Complex["1"].sub(c))));
		else {
			var z = c.sub(Complex["1"]),
				x = p[0],
				i;
			for(i = 1; i < g + 2; i++) x = x.add(p[i].divBy(z.add(index[i])));
			var t = z.add(Complex(g + .5, 0, g + .5, 0));
			return SQRT2PI.mult(t.cPow(z.add(Complex(.5, 0, .5, 0))))
				.mult(Complex.exp(Complex.neg(t)))
				.mult(x);
		}
	};

	// Factorial function
	Complex.fact = function (c) {
		return Complex.gamma(c.add(Complex["1"]));
	}

	// Cosine function
	Complex.cos = function (c) {
		// formula: cos(c) = (e^(ci)+e^(-ci))/2
		var ci = c.mult(Complex["I"]);
		return Complex.exp(ci)
			.add(Complex.exp(Complex.neg(ci)))
			.divBy(Complex["2"]);
	};

	// Sine function
	Complex.sin = function (c) {
		// formula: sin(c) = (e^(ci)-e^(-ci))/(2i)
		var ci = c.mult(Complex["I"]);
		return Complex.exp(ci)
			.sub(Complex.exp(Complex.neg(ci)))
			.divBy(Complex["2I"]);
	};

	// Tangent function
	Complex.tan = function (c) {
		// formula: tan(c) = (e^(ci)-e^(-ci))/(i(e^(ci)+e^(-ci)))
		var ci = c.mult(Complex["I"]),
			pex = Complex.exp(ci),
			nex = Complex.exp(Complex.neg(ci));
		return pex.sub(nex)
			.divBy(pex.add(nex)
				.mult(Complex["I"]));
	};

	// Secant function
	Complex.sec = function (c) {
		// formula: sec(c) = 2/(e^(ci)+e^(-ci))
		var ci = c.mult(Complex["I"]);
		return Complex["2"].divBy(Complex.exp(ci)
			.add(Complex.exp(Complex.neg(ci))));
	};

	// Cosecant function
	Complex.csc = function (c) {
		// formula: csc(c) = 2i/(e^(ci)-e^(-ci))
		var ci = c.mult(Complex["I"]);
		return Complex["2I"].divBy(Complex.exp(ci)
			.sub(Complex.exp(Complex.neg(ci))));
	};

	// Cotangent function
	Complex.cot = function (c) {
		// formula: cot(c) = i(e^(ci)+e^(-ci))/(e^(ci)-e^(-ci))
		var ci = c.mult(Complex["I"]),
			pex = Complex.exp(ci),
			nex = Complex.exp(Complex.neg(ci));
		return pex.add(nex)
			.mult(Complex["I"])
			.divBy(pex.sub(nex));
	};

	// Natural Logarithm function
	Complex.log = function (c) {
		// formula: log(r e^(ti)) = log(r)+ti
		return Complex(Math.log(c.m), c.t);
	};

	// Inverse Sine function
	Complex.arcsin = function (c) {
		// formula: arcsin(c) = -i*log(ic+sqrt(1-c^2))
		return Complex["-I"].mult(Complex.log(Complex["I"].mult(c)
			.add(Complex.sqrt(Complex["1"].sub(c.pow(2))))));
	};

	// Inverse Cosine function
	Complex.arccos = function (c) {
		// formula: arccos(c) = i*log(c-i*sqrt(1-c^2))
		return Complex["I"].mult(Complex.log(c.add(Complex["-I"].mult(Complex.sqrt(Complex["1"].sub(c.pow(2)))))));
	};

	// Inverse Tangent function
	Complex.arctan = function (c) {
		// formula: arctan(c) = i/2 log((i+x)/(i-x))
		var i = Complex["I"];
		return i.mult(Complex.log(i.add(c)
				.divBy(i.sub(c))))
			.divBy(Complex["2"]);
	};

	// Inverse Secant function
	Complex.arcsec = function (c) {
		// formula: arcsec(c) = -i*log(1/c+sqrt(1-i/c^2))
		return Complex["-I"].mult(Complex.log(c.pow(-1)
			.add(Complex.sqrt(Complex["1"].sub(Complex["I"].divBy(c.pow(2)))))));
	};

	// Inverse Cosecant function
	Complex.arccsc = function (c) {
		// formula: arccsc(c) = -i*log(i/c+sqrt(1-1/c^2))
		return Complex["-I"].mult(Complex.log(Complex["I"].divBy(c)
			.add(Complex.sqrt(Complex["1"].sub(c.pow(-2))))));
	};

	// Inverse Cotangent function
	Complex.arccot = function (c) {
		// formula: arccot(c) = i/2 log((c-i)/(c+i))
		var i = Complex["I"];
		return i.mult(Complex.log(c.sub(i)
				.divBy(c.add(i))))
			.divBy(Complex["2"]);
	};

	// Hyperbolic Sine function
	Complex.sinh = function (c) {
		// formula: sinh(c) = (e^c-e^-c)/2
		return Complex.exp(c)
			.sub(Complex.exp(Complex.neg(c)))
			.divBy(Complex["2"]);
	};

	// Hyperbolic Cosine function
	Complex.cosh = function (c) {
		// formula: cosh(c) = (e^c+e^-c)/2
		return Complex.exp(c)
			.add(Complex.exp(Complex.neg(c)))
			.divBy(Complex["2"]);
	};

	// Hyperbolic Tangent function
	Complex.tanh = function (c) {
		// formula: tanh(c) = (e^c-e^-c)/(e^c+e^-c)
		var pex = Complex.exp(c),
			nex = Complex.exp(Complex.neg(c));
		return pex.sub(nex)
			.divBy(pex.add(nex));
	};

	// Hyperbolic Cosecant function
	Complex.csch = function (c) {
		// formula: csch(c) = 2/(e^c-e^-c)
		return Complex["2"].divBy(Complex.exp(c)
			.sub(Complex.exp(Complex.neg(c))));
	};

	// Hyperbolic Secant function
	Complex.sech = function (c) {
		// formula: sech(c) = 2/(e^c+e^-c)
		return Complex["2"].divBy(Complex.exp(c)
			.add(Complex.exp(Complex.neg(c))));
	};

	// Hyperbolic Cotangent function
	Complex.coth = function (c) {
		// formula: coth(c) = (e^c+e^-c)/(e^c-e^-c)
		var pex = Complex.exp(c),
			nex = Complex.exp(Complex.neg(c));
		return pex.add(nex)
			.divBy(pex.sub(nex));
	};

	// Inverse Hyperbolic Sine function
	Complex.arcsinh = function (c) {
		// formula: arcsinh(c) = log(c+sqrt(c^2+1))
		return Complex.log(c.add(Complex.sqrt(c.pow(2)
			.add(Complex["1"]))));
	};

	// Inverse Hyperbolic Cosine function
	Complex.arccosh = function (c) {
		// formula: arccosh(c) = log(c+sqrt(c^2-1))
		return Complex.log(c.add(Complex.sqrt(c.pow(2)
			.sub(Complex["1"]))));
	};

	// Inverse Hyperbolic Tangent function
	Complex.arctanh = function (c) {
		// formula: arctanh(c) = 1/2 log((1+c)/(1-c))
		return Complex.log(Complex["1"].add(c)
				.divBy(Complex["1"].sub(c)))
			.divBy(Complex["2"]);
	};

	// Inverse Hyperbolic Secant function
	Complex.arcsech = function (c) {
		// formula: arcsech(c) = log((1+sqrt(1-c^2))/c)
		return Complex.log(Complex["1"].add(Complex.sqrt(Complex["1"].sub(c.pow(2))))
			.divBy(c));
	};

	// Inverse Hyperbolic Cosecant function
	Complex.arccsch = function (c) {
		// formula: arccsch(c) = log((1+sqrt(1+c^2))/c)
		return Complex.log(Complex["1"].add(Complex.sqrt(Complex["1"].add(c.pow(2))))
			.divBy(c));
	};

	// Inverse Hyperbolic Cotangent function
	Complex.arccoth = function (c) {
		// formula: arccoth(c) = 1/2 log((c+1)/(c-1))
		return Complex.log(c.add(Complex["1"])
				.divBy(c.sub(Complex["1"])))
			.divBy(Complex["2"]);
	};

	// Negative function
	Complex.neg = function (c) {
		return Complex(-c.r, -c.i, c.m, c.t + PI);
	};

	// Real function
	// Returns the real value as a Complex
	Complex.re = function (c) {
		return Complex(c.r, 0, Math.abs(c.r), c.r < 0 ? PI : 0);
	};

	// Imaginary function
	// Returns the imaginary value as a Complex
	// Note that this function stores the 
	// imaginary value in the real component
	Complex.im = function (c) {
		return Complex(c.i, 0, Math.abs(c.i), c.i < 0 ? PI : 0);
	};

	// Absolute value function
	// Returns the absolute value as a Complex
	Complex.abs = function (c) {
		return Complex(c.m, 0, c.m, 0);
	};

	// Argument function
	// Returns the argument as a Complex
	Complex.arg = function (c) {
		return Complex(c.t, 0, c.t, 0);
	};

	// Round function
	// Rounds the components separately
	Complex.round = function (c) {
		return Complex(round(c.r), round(c.i));
	};

	// Fractional Part function
	// Returns the fractional part of each component separately
	Complex.fPart = function (c) {
		return Complex(c.r - floor(c.r), c.i - floor(c.i));
	};

	// Modulus operator
	// Returns the modulus of each component separately
	Complex.prototype.mod = function (c) {
		return Complex(c.r === 0 ? 0 : this.r % c.r, c.i === 0 ? 0 : this.i % c.i);
	};

	// Mininum function
	// Returns the Complex with the smallest magnitude
	Complex.min = function () {
		var args = Array.prototype.slice.call(
				arguments
			)
			.map(function (c) {
				return c.m;
			}),
			min = Math.min.apply(Math, args);
		return arguments[args.indexOf(min)];
	};

	// Maximum function
	// Returns the Complex with the largest magnitude
	Complex.max = function () {
		var args = Array.prototype.slice.call(
				arguments
			)
			.map(function (c) {
				return c.m;
			}),
			max = Math.max.apply(Math, args);
		return arguments[args.indexOf(max)];
	}

	// Determines whether the Complex is validly formed or not
	// Returns a Boolean
	Complex.isNaN = function (c) {
		return isNaN(c.r) || isNaN(c.i) || isNaN(c.m) || isNaN(c.t);
	};

	// Determines whether the Complex is finite or not
	// Returns a Boolean
	Complex.isFinite = function (c) {
		return isFinite(c.m);
	};

	// Complex expression parser
	// str:String (required)
	//    human-readable Complex math expression
	// args:Array[String] (optional)
	//    array of arguments for the expected function,
	//    each index containing the name of the variable
	//    in the human-readable string
	// skipFormat:Boolean (optional)
	//    if false or omitted, auto-formats math expression
	//    it is recommended to call Complex.formatFunction
	//    on string passed before calling Complex.parseFunction
	//    with skipFormat set to true
	Complex.parseFunction = function (str, args, skipFormat) {
		with(this) { // set the scope to the context (see below for included variables)
			// generate map of compiled variable names
			var vars = generate(args = args || []);
			// make everything lowercase because it's easier
			str = str.toLowerCase();
			// default is to format the human-readable string
			if(!skipFormat) str = formatFunction(str);
			var namespace = new Namespace();
			// the constructed function being returned
			return new Function(
					// arguments being mapped to compiled names
					args.map(function (arg) {
						return vars[arg];
					})
					.join(","),
					// function body being compiled
					"return " + (function compile(exp) {
						var self = compile,
							str = "",
							i = 0,
							lastObj = 0; // 0:function||unary operator,1:binary operator,2:variable||constant
						while(i < exp.length) {
							// although e is a constant, the exponent function is much more efficient than the complex power function
							if(lastObj != 2 && exp.substr(i, 2) != "e^" && exp.substr(i)
								.search(varsExp) == 0) { // attempts to parse a variable
								var match = exp.substr(i)
									.match(varsExp)[0],
									name = varsObj[match] || vars[match];
								if(!name) throw '"' + match + '" is not a valid variable.';
								str += name;
								i += match.length;
								lastObj = 2;
								continue;
							}
							if(lastObj != 2 && exp.substr(i)
								.search(funcExp) == 0) { // attempts to parse a function
								var match = exp.substr(i)
									.match(funcExp)[0],
									func = funcObj[match],
									// determines functional group to which to apply function
									// the exceptions - and e^ do not simply look for ) to end functional group
									j = match == "-" ? nextAddSub(exp, i + match.length) : match == "e^" ? nextPower(exp, i + match.length) : endNest(exp, i + match.length);
								if(!func) { // instead of throwing exception, attempt to resolve by assuming implied multiplication first
									match = match.substr(0, match.length - 1); // strips off "(";
									// if this fails it's hopeless
									if(!(varsObj[match] || vars[match])) throw '"' + match + '(" is not a valid function.';
									// since the format function omits checking this, this is a valid exception
									exp = exp.substr(0, i) + match + "*(" + exp.substr(i + match.length + 1);
									continue;
								}
								str += func == "(" ? "" : func; // ignores extraneous grouping
								i += match.length;
								str += self(exp.substring(i, j)) + (func == "(" ? "" : ")");
								i = exp[j] == ")" ? j + 1 : j;
								lastObj = 2;
								continue;
							}
							if(lastObj == 2 && exp.substr(i)
								.search(operExp) == 0) { // attempts to parse an operator
								var match = exp.substr(i)
									.match(operExp)[0],
									oper = operObj[match],
									// ensures that nextOperator skips the implicit operator of a float, e.g. the minus in "2e-1"
									num = exp.substr(i + 1)
									.search(numsExp) == 0 && exp.substr(i + 1)
									.match(numsExp)[0],
									j = nextOperator(match, exp, i + match.length + (num ? num.length : 0));
								if(!oper) throw '"' + match + '" is not a valid operator.';
								str += oper;
								i += match.length;
								str += self(exp.substring(i, j)) + ")";
								i = exp[j] == ")" ? j + 1 : j;
								lastObj = 2;
								continue;
							}
							if(lastObj != 2 && exp.substr(i)
								.search(numsExp) == 0) { // attempts to parse a number
								var match = exp.substr(i)
									.match(numsExp)[0],
									nums = parseFloat(match);
								if(isNaN(nums)) throw '"' + match + '" is not a valid number.';
								// adding constant to bound namespace
								str += "this.array[" + namespace.addComplex(Complex(nums, 0, nums, 0)) + "]";
								i += match.length;
								lastObj = 2;
								continue;
							}
							throw 'Unexpected character "' + exp.charAt(i) + '".';
						}
						return str;
					}(str)) + ";"
					// binds namespace for pre-compiled numeric constants from expression
				)
				.bind(namespace);
		}
	};

	// Create scope of Complex.parseFunction
	Complex.parseFunction = Complex.parseFunction.bind(function () {
		var formExp = /(?:\d[a-z\{\[\(]|[\}\]\)][a-z\d])|(?:[\{\}\[\]]| *[\+\-\*\/\^ %] *)/gi, // matches commonly used unsupported formatting in human-readable expressions
			funcExp = /[a-z]*\(|(?:-|e\^)(?:\(|)/, // matches either as few as zero continuous a-z followed by ( OR -,e^ optionally followed by (
			varsExp = /[a-z]+(?![a-z]*\()/, // matches continuous a-z NOT followed by (
			operExp = /[\+\-\*\/\^ %]/, // matches +,-,*,/,^, ,%
			numsExp = /(?:(?:\d*\.\d+|\d+\.\d*)|\d+)(?:e(?:-|)\d+|)/, // matches any positive float
			funcObj = { // maps functions and unary operators to compiled code
				"cos(": "this.Complex.cos(",
				"sin(": "this.Complex.sin(",
				"tan(": "this.Complex.tan(",
				"sec(": "this.Complex.sec(",
				"csc(": "this.Complex.csc(",
				"cot(": "this.Complex.cot(",
				"log(": "this.Complex.log(",
				"ln(": "this.Complex.log(",
				"gamma(": "this.Complex.gamma(",
				"fact(": "this.Complex.fact(",
				"factorial(": "this.Complex.fact(",
				"(": "(",
				"e^": "this.Complex.exp(",
				"e^(": "this.Complex.exp(",
				"arccos(": "this.Complex.arccos(",
				"arcsin(": "this.Complex.arcsin(",
				"arctan(": "this.Complex.arctan(",
				"arcsec(": "this.Complex.arcsec(",
				"arccsc(": "this.Complex.arccsc(",
				"arccot(": "this.Complex.arccot(",
				"acos(": "this.Complex.arccos(",
				"asin(": "this.Complex.arcsin(",
				"atan(": "this.Complex.arctan(",
				"asec(": "this.Complex.arcsec(",
				"acsc(": "this.Complex.arccsc(",
				"acot(": "this.Complex.arccot(",
				"-": "this.Complex.neg(",
				"-(": "this.Complex.neg(",
				"cosh(": "this.Complex.cosh(",
				"sinh(": "this.Complex.sinh(",
				"tanh(": "this.Complex.tanh(",
				"sech(": "this.Complex.sech(",
				"csch(": "this.Complex.csch(",
				"coth(": "this.Complex.coth(",
				"re(": "this.Complex.re(",
				"im(": "this.Complex.im(",
				"abs(": "this.Complex.abs(",
				"arg(": "this.Complex.arg(",
				"conj(": "this.Complex.conj(",
				"int(": "this.Complex.floor(",
				"floor(": "this.Complex.floor(",
				"ceil(": "this.Complex.ceil(",
				"round(": "this.Complex.round(",
				"fpart(": "this.Complex.fPart(",
				"ipart(": "this.Complex.floor(",
				"sqrt(": "this.Complex.sqrt(",
				"cbrt(": "this.Complex.cbrt(",
				"arccosh(": "this.Complex.arccosh(",
				"arcsinh(": "this.Complex.arcsinh(",
				"arctanh(": "this.Complex.arctanh(",
				"arcsech(": "this.Complex.arcsech(",
				"arccsch(": "this.Complex.arccsch(",
				"arccoth(": "this.Complex.arccoth(",
				"arcosh(": "this.Complex.arccosh(",
				"arsinh(": "this.Complex.arcsinh(",
				"artanh(": "this.Complex.arctanh(",
				"arsech(": "this.Complex.arcsech(",
				"arcsch(": "this.Complex.arccsch(",
				"arcoth(": "this.Complex.arccoth(",
				"acosh(": "this.Complex.arccosh(",
				"asinh(": "this.Complex.arcsinh(",
				"atanh(": "this.Complex.arctanh(",
				"asech(": "this.Complex.arcsech(",
				"acsch(": "this.Complex.arccsch(",
				"acoth(": "this.Complex.arccoth(",
				"exp(": "this.Complex.exp("
			},
			operObj = { // maps binary operators to compiled code
				"+": ".add(",
				"-": ".sub(",
				"*": ".mult(",
				" ": ".mult(",
				"/": ".divBy(",
				"^": ".cPow(",
				"%": ".mod("
			},
			varsObj = { // maps default variables to compiled code
				"e": "this.Complex.E",
				"i": "this.Complex.I",
				"pi": "this.Complex.PI"
			},
			formatFunction = function (str) { // optionally called before compilation in order to repair unsupported formatting
				var open = /\{|\[/,
					close = /\}|\]/,
					// catches implied multiplication like "3i" or ")x"
					// does NOT edit format "x(" where x is a-z
					// because that form implies a function, not a multiplication
					mult = /\d[a-z\{\[\(]|[\}\]\)][a-z\d]/i,
					expo = /^\de(?:-|)\d+/i,
					trim = /[\+\-\*\/\^%]/;
				return str.replace(formExp, function parse(match, offset) {
					if(mult.test(match)) {
						// catches exponentially represented floats and omits formatting these
						if(expo.test(str.slice(offset))) return match;
						// recursively calls parser in case of {,[,},]
						return match.charAt(0)
							.replace(formExp, parse) + "*" + match.charAt(1)
							.replace(formExp, parse);
					} else if(open.test(match)) {
						return "(";
					} else if(close.test(match)) {
						return ")";
					} else {
						var i = match.search(trim);
						return match.charAt(i != -1 ? i : "*");
					}
				});
			},
			generate = function (args) { // maps the arguments to arbitrarily generated names
				var rmChars = /[^a-z]+/i; // characters to be removed from variable names supplied
				// fix and validate them first
				args = args.map(function (arg) {
					var name = arg.replace(rmChars, "");
					if(!name) throw '"' + arg + '" is an invalid variable name. Only "a" through "z" are accepted within names. "e", "i" and "pi", will be calculated as the constants.';
					return name.toLowerCase();
				});
				var abc = "abcdefghijklmnopqrstuvwxyz", // used to generate compiled variable names
					mod = abc.length,
					map = {},
					str = "",
					j,
					k;
				for(var i = 0; i < args.length; i++) {
					j = i;
					while(j >= 0) {
						k = j % mod; // "digit" index
						j = j - k;
						str = abc.charAt(k) + str;
						j = j / mod - 1; // leftover
					}
					map[args[i]] = str;
					str = "";
				}
				return map;
			},
			endNest = function (str, i) { // returns last index of grouped expression located at i
				var nest = 1;
				while(str[i] == "(" ? nest++ : (str[i] == ")" ? --nest : i < str.length)) i++;
				return i;
			},
			nextAddSub = function (str, i) { // returns last index of expression to add or subtract located at i based on order of operations
				var nest = 0;
				for(var c = i; c < str.length; c++) {
					if(str[c] == "(") nest++;
					else if(str[c] == ")") nest--;
					if(nest < 0) return c;
					else if(nest == 0) {
						if(str[c] == "+" || (str[c] == "-" && !operObj[str[c - 1]])) return c;
					}
				}
				return str.length;
			},
			nextMultDiv = function (str, i) { // returns last index of expression to multiply or divide located at i based on order of operations
				var nest = 0;
				for(var c = i; c < str.length; c++) {
					if(str[c] == "(") nest++;
					else if(str[c] == ")") nest--;
					if(nest < 0) return c;
					else if(nest == 0) {
						if(str[c] == "+" || (str[c] == "-" && !operObj[str[c - 1]])) return c;
						if(str[c] == "*" || str[c] == "/" || str[c] == " " || str[c] == "%") return c;
					}
				}
				return str.length;
			},
			nextPower = function (str, i) { // returns last index of expression to raise to located at i based on order of operations
				var nest = 0;
				for(var c = i; c < str.length; c++) {
					if(str[c] == "(") nest++;
					else if(str[c] == ")") nest--;
					if(nest < 0) return c;
					else if(nest == 0) {
						if(str[c] == "+" || (str[c] == "-" && str[c - 1] != "^")) return c;
						if(str[c] == "*" || str[c] == "/" || str[c] == " " || str[c] == "%") return c;
						if(str[c] == "^") return c;
					}
				}
				return str.length;
			},
			nextOperator = function (oper, str, i) { // switches operator to determine which order of operations to apply
				switch(oper) {
				case "+":
				case "-":
					return nextAddSub(str, i);
				case "*":
				case "/":
				case " ":
				case "%":
					return nextMultDiv(str, i);
				case "^":
					return nextPower(str, i);
				default:
					throw '"' + oper + '" is not a valid operator.';
				}
			},
			Namespace = function () { // instances of this will be bound to each compiled function returned to cache parsed numerical constants
				var self = this;
				self.array = [];
				self.Complex = Complex;
				self.addComplex = function (complex) {
					self.array.push(complex);
					return self.array.length - 1; // returns index of cached constant to compiler
				};
			};
		Complex.formatFunction = formatFunction; // may need to be called separately for asynchronous user-confirmation
		return { // the actual object being bound to the context of Complex.parseFunction
			funcExp: funcExp,
			varsExp: varsExp,
			operExp: operExp,
			numsExp: numsExp,
			funcObj: funcObj,
			varsObj: varsObj,
			operObj: operObj,
			generate: generate,
			formatFunction: formatFunction,
			endNest: endNest,
			nextAddSub: nextAddSub,
			nextMultDiv: nextMultDiv,
			nextPower: nextPower,
			nextOperator: nextOperator,
			Namespace: Namespace
		};
	}());

	// Constants
	Complex["0"] = Complex(0, 0, 0, 0);
	Complex["1"] = Complex(1, 0, 1, 0);
	Complex["I"] = Complex(0, 1, 1, PI / 2);
	Complex["-I"] = Complex(0, -1, 1, 3 * PI / 2);
	Complex["PI"] = Complex(PI, 0, PI, 0);
	Complex["E"] = Complex(Math.E, 0, Math.E, 0);
	Complex["2"] = Complex(2, 0, 2, 0);
	Complex["2I"] = Complex(0, 2, 2, PI / 2);

	// Expose the Complex class
	if(typeof module !== 'undefined' && module.exports)
	// Node.js
		module.exports = Complex;
	else
	// Browser
		root.Complex = Complex;

})();
