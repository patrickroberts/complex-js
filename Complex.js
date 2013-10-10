/*
//Copyright (c) 2012 Patrick Roberts
//
//Permission is hereby granted, free of charge, to any person
//obtaining a copy of this software and associated documentation
//files (the "Software"), to deal in the Software without restriction,
//including without limitation the rights to use, copy, modify,
//merge, publish, distribute, sublicense, and/or sell copies of the
//Software, and to permit persons to whom the Software is furnished
//to do so, subject to the following conditions:
//
//The above copyright notice and this permission notice shall be
//included in all copies or substantial portions of the Software.
//
//THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
//EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
//OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
//NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
//HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
//WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
//FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
//OTHER DEALINGS IN THE SOFTWARE.
*/

(function (global) {

	// Localize the global Math object
	var Math = global.Math;

	// Math object helper functions for more advanced formulas
	Math.sinh = function (x) {
		return (-Math.exp(-x)+Math.exp(x))/2;
	};

	Math.cosh = function (x) {
		return (Math.exp(-x)+Math.exp(x))/2;
	};

	var floor = function (x) {
				return (x>=0?x-x%1:x-(x%1+1));
			},
			round = function (x) {
				x+=.5;
				return (x>=0?x-x%1:x-(x%1+1));
			},
			ceil = function (x) {
				return (x>=0?x-(x%1+1):x-x%1);
			};

	var PI2 = Math.PI*2;

	// Component constructor for Complex class
	// r:Number (required)
	//		the Real part
	// i:Number (required)
	//		the Imaginary part
	// m:Number (optional)
	//		the Magnitude
	// t:Number (optional)
	//		the Argument
	// Note: when calling this constructor, it
	// 		 is recommended to omit the second
	//		 two arguments, unless they have
	//		 been accurately calculated.
	var Complex = function Complex (r,i,m,t) {
		var invoked = this instanceof Complex,
				self = invoked?this:new Complex;
		self.r = (typeof m==="number"?Math.abs(m):Math.sqrt(r*r+i*i));
		if(typeof t==="number") {
			self.t = (m>=0?t:t+Math.PI)%PI2;
			self.t += (self.t>=0?0:PI2);
		} else {
			self.t = Math.atan2(i, r);
		}
		self.re = r;
		self.i = i;
		if(!invoked) return self;
	};

	// Use for displaying Complex numbers as a string
	// type:Boolean
	// 		if true, the display is a+bi form
	//		if false, the display is r e^(ti) form
	Complex.prototype.toString = function (type) {
		return type?this.re.toPrecision().toUpperCase()+"+"+this.i.toPrecision().toUpperCase()+" i":this.r.toPrecision().toUpperCase()+" e^("+this.t.toPrecision().toUpperCase()+" i)";
	};

	// Exponent function
	Complex.exp = function (c) {
		return c.i==0?Complex["E"].pow(c.re):Complex.Polar(Math.exp(c.re),c.i);
	};

	// Polar constructor for Complex class
	// r:Number (required)
	//		the Magnitude
	// t:Number (required)
	//		the Argument
	Complex.Polar = function (r,t) {
	var self = new Complex; //initializes new instance of Complex without invoking the constructor
		self.re = r*Math.cos(t)
		self.i = r*Math.sin(t);
		self.r = Math.abs(r);
		self.t = (r>=0?t:t+Math.PI)%PI2;
		self.t += (self.t>=0?0:PI2);
		return self;
	};

	// Addition operator
	Complex.prototype.add = function (c) {
		return Complex(this.re+c.re,this.i+c.i);
	};

	// Subtraction operator
	Complex.prototype.sub = function (c) {
		return Complex(this.re-c.re,this.i-c.i);
	};

	// Floor function
	// integerizes the two components separately
	Complex.floor = function (c) {
		return Complex(floor(c.re),floor(c.i));
	};

	// Ceiling function
	// Rounds up the two compenents separately
	Complex.ceil = function (c) {
		return Complex(ceil(c.re),ceil(c.i));
	};

	// Conjugate function
	// Reverses the sign of the imaginary component
	Complex.conj = function (c) {
		return Complex(c.re,-c.i,c.r);
	};

	// Multiplication operator
	Complex.prototype.mult = function (c) {
		return Complex.Polar(this.r*c.r,this.t+c.t);
	};

	// Division operator
	Complex.prototype.divBy = function (c) {
		return Complex.Polar(this.r/c.r,this.t-c.t);
	};

	// Real Power operator
	// z:Number
	//		MUST be a Number, not a Complex
	Complex.prototype.pow = function (z) {
		return Complex.Polar(Math.pow(this.r,z),this.t*z);
	};

	// Square Root function
	Complex.sqrt = function (c) {
		return c.pow(.5);
	};

	// Complex Power operator
	// c:Complex
	//		MUST be a Complex, not a Number
	Complex.prototype.cPow = function (c) {
		return c.i==0?this.pow(c.re):Complex.Polar(Math.pow(this.r*this.r,c.r*Math.cos(c.t)/2)*Math.exp(-c.r*Math.sin(c.t)*this.t),c.r*Math.sin(c.t)*Math.log(this.r*this.r)/2+c.r*Math.cos(c.t)*this.t);
	};

	// Cosine function
	Complex.cos = function (c) {
		var i = Complex["I"];
		return Complex.exp(i.mult(c)).add(Complex.exp(Complex["-I"].mult(c))).divBy(Complex["2"]);
	};

	// Sine function
	Complex.sin = function (c) {
		var i = Complex["I"];
		return Complex.exp(i.mult(c)).sub(Complex.exp(Complex["-I"].mult(c))).divBy(Complex["2I"]);
	};

	// Tangent function
	Complex.tan = function (c) {
		return Complex.sin(c).divBy(Complex.cos(c));
	};

	// Secant function
	Complex.sec = function (c) {
		return Complex.cos(c).pow(-1);
	};

	// Cosecant function
	Complex.csc = function (c) {
		return Complex.sin(c).pow(-1);
	};

	// Cotangent function
	Complex.cot = function (c) {
		return Complex.tan(c).pow(-1);
	};

	// Natural Logarithm function
	Complex.log = function (c) {
		return Complex(Math.log(c.r),c.t+PI2*round(-c.t/PI2));
	};

	// Inverse Sine function
	Complex.arcsin = function (c) {
		var i = Complex["I"]
		return i.mult(Complex.log(Complex["1"].sub(c.pow(2)).pow(.5).sub(i.mult(c))));
	};

	// Inverse Cosine function
	Complex.arccos = function (c) {
		var i = Complex["I"];
		return i.mult(Complex.log(i.mult(Complex["1"].sub(c.pow(2)).pow(.5)).sub(c)));
	};

	// Inverse Tangent function
	Complex.arctan = function (c) {
		var i = Complex["I"];
		return i.mult(Complex.log(i.add(c).divBy(i.sub(c)))).divBy(Complex["2"]);
	};

	// Inverse Secant function
	Complex.arcsec = function (c) {
		return Complex.arccos(c.pow(-1));
	};

	// Inverse Cosecant function
	Complex.arccsc = function (c) {
		return Complex.arcsin(c.pow(-1));
	};

	// Inverse Cotangent function
	Complex.arccot = function (c) {
		var i = Complex["I"];
		return i.mult(Complex.log(c.add(i).divBy(c.sub(i)))).divBy(Complex["2"]);
	};

	// Hyperbolic Sine function
	Complex.sinh = function (c) {
		return Complex.exp(c).sub(Complex.exp(Complex.neg(c))).divBy(Complex["2"]);
	};

	// Hyperbolic Cosine function
	Complex.cosh = function (c) {
		return Complex.exp(c).add(Complex.exp(Complex.neg(c))).divBy(Complex["2"]);
	};

	// Hyperbolic Tangent function
	Complex.tanh = function (c) {
		return Complex.sinh(c).divBy(Complex.cosh(c));
	};

	// Hyperbolic Cosecant function
	Complex.csch = function (c) {
		return Complex.sinh(c).pow(-1);
	};

	// Hyperbolic Secant function
	Complex.sech = function (c) {
		return Complex.cosh(c).pow(-1);
	};

	// Hyperbolic Cotangent function
	Complex.coth = function (c) {
		return Complex.tanh(c).pow(-1);
	};

	// Inverse Hyperbolic Sine function
	Complex.arcsinh = function (c) {
		return Complex.log(c.add(Complex.sqrt(c.pow(2).add(Complex["1"]))));
	};

	// Inverse Hyperbolic Cosine function
	Complex.arccosh = function (c) {
		return Complex.log(c.add(Complex.sqrt(c.pow(2).sub(Complex["1"]))));
	};

	// Inverse Hyperbolic Tangent function
	Complex.arctanh = function (c) {
		return Complex.log(Complex["1"].add(c).divBy(Complex["1"].sub(c))).divBy(Complex["2"]);
	};

	// Inverse Hyperbolic Secant function
	Complex.arcsech = function (c) {
		return Complex.arccosh(c.pow(-1));
	};

	// Inverse Hyperbolic Cosecant function
	Complex.arccsch = function (c) {
		return Complex.arcsinh(c.pow(-1));
	};

	//Inverse Hyperbolic Cotangent function
	Complex.arccoth = function (c) {
		return Complex.arctanh(c.pow(-1));
	};

	// Negative function
	Complex.neg = function (c) {
		return Complex(-c.re,-c.i,c.r);
	};

	// Real function
	// Returns the real value as a Complex
	Complex.re = function (c) {
		return Complex(c.re,0,Math.abs(c.re),c.re<0?Math.PI:0);
	};

	// Imaginary function
	// Returns the imaginary value as a Complex
	// Note that this function stores the 
	// imaginary value in the real component
	Complex.im = function (c) {
		return Complex(c.i,0,Math.abs(c.i),c.i<0?Math.PI:0);
	};

	// Absolute value function
	// Returns the absolute value as a Complex
	Complex.abs = function (c) {
		return Complex(c.r,0,c.r,0);
	};

	// Argument function
	// Returns the argument as a Complex
	Complex.arg = function (c) {
		return Complex(c.t,0,c.t,0);
	};

	// Round function
	// Rounds the components separately
	Complex.round = function (c) {
		return Complex(round(c.re),round(c.i));
	};

	// Fractional Part function
	// Returns the fractional part of each component separately
	Complex.fPart = function (c) {
		return Complex(c.re-floor(c.re),c.i-floor(c.i));
	};

	// Modulus operator
	// Returns the modulus of each component separately
	Complex.prototype.mod = function (c) {
		var modR = this.re%c.re;
		var modI = this.i%c.i;
		return Complex((modR>=0?modR:modR+Math.abs(c.re)), (modI>=0?modI:modI+Math.abs(c.i)));
	};

	// Mininum function
	// Returns the Complex with the smallest magnitude
	Complex.min = function (c1,c2) {
		return Math.min(c1.r,c2.r)==c1.r?c1:c2;
	};

	// Complex expression parser
	// str:String
	//    human-readable Complex math expression
	// args:Array[String]
	//    array of arguments for the expected function,
	//    each index containing the name of the variable
	//    in the human-readable string
	// skipFormat:Boolean
	//    if false or omitted, auto-formats math expression
	//    it is recommended to call Complex.formatFunction
	//    on string passed before calling Complex.parseFunction
	//    with skipFormat set to true
	Complex.parseFunction = function (str, args, skipFormat) {
		with (this) { //set the scope to the context (see below for included variables)
			//generate map of compiled variable names
			var vars = generate(args);
			//make everything lowercase because it's easier
			str = str.toLowerCase();
			//default is to format the human-readable string
			if(!skipFormat) str = formatFunction(str);
			var namespace = new Namespace();
			return new Function (args.map(function (arg) {
				return vars[arg];
			}).join(","), "return "+(function compile (exp) {
				var self = compile,
						str = "",
						i = 0,
						lastObj = 0; //0:function||unary operator,1:binary operator,2:variable||constant
				while(i<exp.length) {
					//although e is a constant, the exponent function is much more efficient than the complex power function
					if(lastObj!=2 && exp.substr(i, 2)!="e^" && exp.substr(i).search(varsExp)==0) { //attempts to parse a variable
						var match = exp.substr(i).match(varsExp)[0],
								name = varsObj[match]||vars[match];
						if(!name) throw '"'+match+'" is not a valid variable.';
						str += name;
						i += match.length;
						lastObj = 2;
						continue;
					}
					if(lastObj!=2 && exp.substr(i).search(funcExp)==0) { //attempts to parse a function
						var match = exp.substr(i).match(funcExp)[0],
								func = funcObj[match],
								//determines functional group to which to apply function
								//the exceptions - and e^ do not simply look for ) to end functional group
								j = match=="-"?nextAddSub(exp,i+match.length):match=="e^"?nextPower(exp,i+match.length):endNest(exp,i+match.length);
						if(!func) { //instead of throwing exception, attempt to resolve by assuming implied multiplication first
							match = match.substr(0, match.length-1); //strips off "(";
							//if this fails it's hopeless
							if(!(varsObj[match]||vars[match])) throw '"'+match+'(" is not a valid function.';
							//since the format function omits checking this, this is a valid exception
							exp = exp.substr(0, i)+match+"*("+exp.substr(i+match.length+1);
							continue;
						}
						str += func=="("?"":func; //ignores extraneous grouping
						i += match.length;
						str += self(exp.substring(i,j))+(func=="("?"":")");
						i = exp[j]==")"?j+1:j;
						lastObj = 2;
						continue;
					}
					if(lastObj==2 && exp.substr(i).search(operExp)==0) { //attempts to parse an operator
						var match = exp.substr(i).match(operExp)[0],
								oper = operObj[match],
								j = nextOperator(match, exp, i+match.length);
						if(!oper) throw '"'+match+'" is not a valid operator.';
						str += oper;
						i += match.length;
						str += self(exp.substring(i,j))+")";
						i = exp[j]==")"?j+1:j;
						lastObj = 2;
						continue;
					}
					if(lastObj!=2 && exp.substr(i).search(numsExp)==0) { //attempts to parse a number
						var match = exp.substr(i).match(numsExp)[0],
								nums = parseFloat(match);
						if(isNaN(nums)) throw '"'+match+'" is not a valid number.';
						str += "this.array["+namespace.addComplex(Complex(nums,0,nums,0))+"]";
						i += match.length;
						lastObj = 2;
						continue;
					}
					throw 'Unexpected character "'+exp.charAt(i)+'".';
				}
				return str;
			})(str)+";").bind(namespace);
		}
	};

	// Create scope of Complex.parseFunction
	Complex.parseFunction = Complex.parseFunction.bind(function () {
		var formExp = /(?:\d[a-z\{\[\(]|[\}\]\)][a-z\d])|(?:[\{\}\[\]]| *[\+\-\*\/\^ %] *)/gi, //matches commonly used unsupported formatting in human-readable expressions
				funcExp = /[a-z]*\(|(?:-|e\^)(?:\(|)/, //matches either as few as zero continuous a-z followed by ( OR -,e^ optionally followed by (
				varsExp = /[a-z]+(?![a-z]*\()/, //matches continuous a-z NOT followed by (
				operExp = /[\+\-\*\/\^ %]/, //matches +,-,*,/,^, ,%
				numsExp = /\d*\.\d*|\d+/, //matches continuous 0-9 containing at most one .
				funcObj = { //maps functions and unary operators to compiled code
					"cos(": "Complex.cos(",
					"sin(": "Complex.sin(",
					"tan(": "Complex.tan(",
					"sec(": "Complex.sec(",
					"csc(": "Complex.csc(",
					"cot(": "Complex.cot(",
					"log(": "Complex.log(",
					"ln(": "Complex.log(",
					"(": "(",
					"e^": "Complex.exp(",
					"e^(": "Complex.exp(",
					"arccos(": "Complex.arccos(",
					"arcsin(": "Complex.arcsin(",
					"arctan(": "Complex.arctan(",
					"arcsec(": "Complex.arcsec(",
					"arccsc(": "Complex.arccsc(",
					"arccot(": "Complex.arccot(",
					"-": "Complex.neg(",
					"-(": "Complex.neg(",
					"cosh(": "Complex.cosh(",
					"sinh(": "Complex.sinh(",
					"tanh(": "Complex.tanh(",
					"sech(": "Complex.sech(",
					"csch(": "Complex.csch(",
					"coth(": "Complex.coth(",
					"re(": "Complex.re(",
					"im(": "Complex.im(",
					"abs(": "Complex.abs(",
					"arg(": "Complex.arg(",
					"int(": "Complex.floor(",
					"floor(": "Complex.floor(",
					"ceil(": "Complex.ceil(",
					"round(": "Complex.round(",
					"fpart(": "Complex.fPart(",
					"ipart(": "Complex.floor(",
					"sqrt(": "Complex.sqrt(",
					"arccosh(": "Complex.arccosh(",
					"arcsinh(": "Complex.arcsinh(",
					"arctanh(": "Complex.arctanh(",
					"arcsech(": "Complex.arcsech(",
					"arccsch(": "Complex.arccsch(",
					"arccoth(": "Complex.arccoth(",
					"exp(": "Complex.exp("
				},
				operObj = { //maps binary operators to compiled code
					"+": ".add(",
					"-": ".sub(",
					"*": ".mult(",
					" ": ".mult(",
					"/": ".divBy(",
					"^": ".cPow(",
					"%": ".mod("
				},
				varsObj = { //maps default variables to compiled code
					"e": "Complex.E",
					"i": "Complex.I",
					"pi": "Complex.PI"
				},
				formatFunction = function (str) { //optionally called before compilation in order to repair unsupported formatting
					var open = /\{|\[/,
							close = /\}|\]/,
							//catches implied multiplication like "3i" or ")x"
							//does NOT edit format "x(" where x is a-z
							//because that form implies a function, not a multiplication
							mult = /\d[a-z\{\[\(]|[\}\]\)][a-z\d]/i,
							trim = /[\+\-\*\/\^%]/;
					return str.replace(formExp, function parse (match) {
						if(mult.test(match)) {
							//recursively calls parser in case of {,[,},]
							return match.charAt(0).replace(formExp, parse)+"*"+match.charAt(1).replace(formExp, parse);
						} else if(open.test(match)) {
							return "(";
						} else if(close.test(match)) {
							return ")";
						} else {
							var i = match.search(trim);
							return match.charAt(i!=-1?i:"*");
						}
					});
				},
				generate = function (args) { //maps the arguments to arbitrarily generated names
					var rmChars = /[^a-z]+/i; //characters to be removed from variable names supplied
					//fix and validate them first
					args = args.map(function (arg) {
						var name = arg.replace(rmChars, "");
						if(!name) throw '"'+arg+'" is an invalid variable name. Only "a" through "z" are accepted within names. "e", "i" and "pi", will be calculated as the constants.';
						return name.toLowerCase();
					});
					var abc = "abcdefghijklmnopqrstuvwxyz", //used to generate compiled variable names
							mod = abc.length,
							map = {},
							str = "",
							j,
							k;
					for(var i=0;i<args.length;i++) {
						j = i;
						do { //forces at least one character to be transcribed
							k = j/mod;
							j = (k-floor(k))*mod; //"digit" index
							str += abc.charAt(j);
							j = floor(k); //leftover
						} while(j>=mod)
						map[args[i]] = str;
						str = "";
					}
					return map;
				},
				endNest = function (str, i) { //returns last index of grouped expression located at i
					var nest = 1;
					while(str[i]=="("?nest++:(str[i]==")"?--nest:i<str.length)) i++;
					return i;
				},
				nextAddSub = function (str, i) { //returns last index of expression to add or subtract located at i based on order of operations
					var nest = 0;
					for(var c=i;c<str.length;c++) {
						if(str[c]=="(") nest++;
						else if(str[c]==")") nest--;
						if(nest<0) return c;
						else if(nest==0) {
							if(str[c]=="+"||(str[c]=="-"&&!operObj[str[c-1]])) return c;
						}
					}
					return str.length;
				},
				nextMultDiv = function (str, i) { //returns last index of expression to multiply or divide located at i based on order of operations
					var nest = 0;
					for(var c=i;c<str.length;c++) {
						if(str[c]=="(") nest++;
						else if(str[c]==")") nest--;
						if(nest<0) return c;
						else if(nest==0) {
							if(str[c]=="+"||(str[c]=="-"&&!operObj[str[c-1]])) return c;
							if(str[c]=="*"||str[c]=="/"||str[c]==" "||str[c]=="%") return c;
						}
					}
					return str.length;
				},
				nextPower = function (str, i) { //returns last index of expression to raise to located at i based on order of operations
					var nest = 0;
					for(var c=i;c<str.length;c++) {
						if(str[c]=="(") nest++;
						else if(str[c]==")") nest--;
						if(nest<0) return c;
						else if(nest==0) {
							if(str[c]=="+"||(str[c]=="-"&&str[c-1]!="^")) return c;
							if(str[c]=="*"||str[c]=="/"||str[c]==" "||str[c]=="%") return c;
							if(str[c]=="^") return c;
						}
					}
					return str.length;
				},
				nextOperator = function (oper, str, i) { //switches operator to determine which order of operations to apply
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
							throw '"'+oper+'" is not a valid operator.';
					}
				},
				Namespace = function () { //instances of this will be bound to each compiled function returned to cache parsed numerical constants
					var self = this;
					self.array = Array.prototype.slice.call(arguments);
					self.addComplex = function (complex) {
						self.array.push(complex);
						return self.array.length-1; //returns index of cached constant to compiler
					};
				};
		Complex.formatFunction = formatFunction; //may need to be called separately for asynchronous user-confirmation
		return { //the actual object being bound to the context of Complex.parseFunction
			funcExp:funcExp,
			varsExp:varsExp,
			operExp:operExp,
			numsExp:numsExp,
			funcObj:funcObj,
			varsObj:varsObj,
			operObj:operObj,
			generate:generate,
			formatFunction:formatFunction,
			endNest:endNest,
			nextAddSub:nextAddSub,
			nextMultDiv:nextMultDiv,
			nextPower:nextPower,
			nextOperator:nextOperator,
			Namespace:Namespace
		};
	}());

	// Constants
	Complex["0"] = Complex(0,0,0,0);
	Complex["1"] = Complex(1,0,1,0);
	Complex["I"] = Complex(0,1,1,Math.PI/2);
	Complex["-I"]= Complex(0,-1,1,3*Math.PI/2);
	Complex["PI"]= Complex(Math.PI,0,Math.PI,0);
	Complex["E"] = Complex(Math.E,0,Math.E,0);
	Complex["2"] = Complex(2,0,2,0);
	Complex["2I"]= Complex(0,2,2,Math.PI/2);

	// Expose the Complex class
	global.Complex = Complex;

})(self);
