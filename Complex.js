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

// Math Library helper functions for more advanced formulas
Math.sinh = function(x)
{	return (-Math.exp(-x)+Math.exp(x))/2;
}

Math.cosh = function(x)
{	return (Math.exp(-x)+Math.exp(x))/2;
}

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
// 		 is recommended to keep the second
//		 two arguments blank, unless they
//		 have been accurately calculated.
function Complex(r,i,m,t)
{	if(this instanceof Complex)
	{	this.r = m==undefined?Math.sqrt(r*r+i*i):m;
		this.t = t==undefined?Math.atan2(i,r):t;
		this.re= r;
		this.i = i;
	}
	else
	{	return new Complex(r,i,m,t);
}	}

// Constants
Complex["0"] = new Complex(0,0,0,0);
Complex["1"] = new Complex(1,0,1,0);
Complex["I"] = new Complex(0,1,1,Math.PI/2);
Complex["PI"]= new Complex(Math.PI,0,Math.PI,0);
Complex["E"] = new Complex(Math.E,0,Math.E,0);

// Use for displaying Complex numbers as a string
// type:Boolean
// 		if true, the display is a+bi form
//		if false, the display is re^(ti) form
Complex.prototype.toString = function(type)
{	return type?this.re.toPrecision().toUpperCase()+"+"+this.i.toPrecision().toUpperCase()+" i":this.r.toPrecision().toUpperCase()+" e^("+this.t.toPrecision().toUpperCase()+" i)";
}

// Exponent function
Complex.exp = function(c)
{	var e = Complex.E;
	return c.i==0?e.pow(c.re):Complex.polar(Math.exp(c.re),c.i);
}

// Polar constructor for Complex class
// r:Number (required)
//		the Magnitude
// t:Number (required)
//		the Argument
Complex.polar = function(r,t)
{	return new Complex(r*Math.cos(t),r*Math.sin(t),Math.abs(r),(t+(Math.abs(r)==r?0:Math.PI))%(Math.PI*2));
}

// Addition operator
Complex.prototype.add = function(c)
{	return new Complex(this.re+c.re,this.i+c.i);
}

// Subtraction operator
Complex.prototype.sub = function(c)
{	return new Complex(this.re-c.re,this.i-c.i);
}

// Floor function
// integerizes the two components separately
Complex.floor = function(c)
{	return new Complex(Math.floor(c.re),Math.floor(c.i));
}

// Ceiling function
// Rounds up the two compenents separately
Complex.ceil = function(c)
{	return new Complex(Math.ceil(c.re),Math.ceil(c.i));
}

// Conjugate function
// Reverses the sign of the imaginary component
Complex.conj = function(c)
{	return new Complex(c.re,-c.i);
}

// Multiplication operator
Complex.prototype.mult = function(c)
{	return Complex.polar(this.r*c.r,this.t+c.t);
}

// Division operator
Complex.prototype.divBy = function(c)
{	return Complex.polar(this.r/c.r,this.t-c.t);
}

// Real Power operator
// z:Number
//		MUST be a Number, not a Complex
Complex.prototype.pow = function(z)
{	return Complex.polar(Math.pow(this.r,z),this.t*z);
}

// Square Root function
Complex.sqrt = function(c)
{	return c.pow(0.5);
}

// Complex Power operator
// c:Complex
//		MUST be a Complex, not a Number
Complex.prototype.cPow = function(c)
{	return c.i==0?this.pow(c.re):Complex.polar(Math.pow(this.r*this.r,c.r*Math.cos(c.t)/2)*Math.exp(-c.r*Math.sin(c.t)*this.t),c.r*Math.sin(c.t)*Math.log(this.r*this.r)/2+c.r*Math.cos(c.t)*this.t);
}

// Cosine function
Complex.cos = function(c)
{	var i = Complex.I;
	return Complex.exp(i.mult(c)).add(Complex.exp(Complex.neg(i).mult(c))).divBy(new Complex(2,0,2,0));
}

// Sine function
Complex.sin = function(c)
{	var i = Complex.I;
	return Complex.exp(i.mult(c)).sub(Complex.exp(Complex.neg(i).mult(c))).divBy(new Complex(0,2,2,Math.PI/2));
}

// Tangent function
Complex.tan = function(c)
{	return Complex.sin(c).divBy(Complex.cos(c));
}

// Secant function
Complex.sec = function(c)
{	return Complex.cos(c).pow(-1);
}

// Cosecant function
Complex.csc = function(c)
{	return Complex.sin(c).pow(-1);
}

// Cotangent function
Complex.cot = function(c)
{	return Complex.tan(c).pow(-1);
}

// Natural Logarithm function
Complex.log = function(c)
{	return new Complex(Math.log(c.r),c.t+2*Math.PI*Math.floor(-c.t/(2*Math.PI)+1/2));
}

// Inverse Sine function
Complex.arcsin = function(c)
{	var i = Complex.I
	return i.mult(Complex.log(Complex["1"].sub(c.pow(2)).pow(0.5).sub(i.mult(c))));
}

// Inverse Cosine function
Complex.arccos = function(c)
{	var i = Complex.I;
	return i.mult(Complex.log(i.mult(Complex["1"].sub(c.pow(2)).pow(0.5)).sub(c)));
}

// Inverse Tangent function
Complex.arctan = function(c)
{	var i = Complex.I;
	return i.mult(Complex.log(i.add(c).divBy(i.sub(c)))).divBy(new Complex(2,0,2,0));
}

// Inverse Secant function
Complex.arcsec = function(c)
{	var i = Complex.I;
	return Complex.arccos(c.pow(-1));
}

// Inverse Cosecant function
Complex.arccsc = function(c)
{	var i = Complex.I;
	return Complex.arcsin(c.pow(-1));
}

// Inverse Cotangent function
Complex.arccot = function(c)
{	var i = Complex.I;
	return i.mult(Complex.log(c.add(i).divBy(c.sub(i)))).divBy(new Complex(2,0,2,0));
}

// Hyperbolic Sine function
Complex.sinh = function(c)
{	return Complex.exp(c).sub(Complex.exp(Complex.neg(c))).divBy(new Complex(2,0,2,0));
}

// Hyperbolic Cosine function
Complex.cosh = function(c)
{	return Complex.exp(c).add(Complex.exp(Complex.neg(c))).divBy(new Complex(2,0,2,0));
}

// Hyperbolic Tangent function
Complex.tanh = function(c)
{	return Complex.sinh(c).divBy(Complex.cosh(c));
}

// Hyperbolic Cosecant function
Complex.csch = function(c)
{	return Complex.sinh(c).pow(-1);
}

// Hyperbolic Secant function
Complex.sech = function(c)
{	return Complex.cosh(c).pow(-1);
}

// Hyperbolic Cotangent function
Complex.coth = function(c)
{	return Complex.tanh(c).pow(-1);
}

// Inverse Hyperbolic Sine function
Complex.arcsinh = function(c)
{	return Complex.log(c.add(Complex.sqrt(c.pow(2).add(Complex["1"]))));
}

// Inverse Hyperbolic Cosine function
Complex.arccosh = function(c)
{	return Complex.log(c.add(Complex.sqrt(c.pow(2).sub(Complex["1"]))));
}

// Inverse Hyperbolic Tangent function
Complex.arctanh = function(c)
{	return Complex.log(Complex["1"].add(c).divBy(Complex["1"].sub(c))).divBy(new Complex(2,0,2,0));
}

// Inverse Hyperbolic Secant function
Complex.arcsech = function(c)
{	return Complex.arccosh(c.pow(-1));
}

// Inverse Hyperbolic Cosecant function
Complex.arccsch = function(c)
{	return Complex.arcsinh(c.pow(-1));
}

//Inverse Hyperbolic Cotangent function
Complex.arccoth = function(c)
{	return Complex.arctanh(c.pow(-1));
}

// Negative function
Complex.neg = function(c)
{	return new Complex(-c.re,-c.i,c.r);
}

// Real function
// Returns the real value as a Complex
Complex.re = function(c)
{	return new Complex(c.re,0,Math.abs(c.re));
}

// Imaginary function
// Returns the imaginary value as a Complex
// Note that this function stores the 
// imaginary value in the real component
Complex.im = function(c)
{	return new Complex(c.i,0,Math.abs(c.i));
}

// Absolute value function
// Returns the absolute value as a Complex
Complex.abs = function(c)
{	return new Complex(c.r,0,c.r,0);
}

// Argument function
// Returns the argument as a Complex
Complex.arg = function(c)
{	return new Complex(c.t,0,c.t,0);
}

// Round function
// Rounds the components separately
Complex.round = function(c)
{	return new Complex(Math.round(c.re),Math.round(c.i));
}

// Fractional Part function
// Returns the fractional part of each component separately
Complex.fPart = function(c)
{	var re = c.re-Math.floor(c.re);
	re = re<0?re+1:re;
	var i = c.i-Math.floor(c.i);
	i = i<0?i+1:i;
	return new Complex(re,i);
}

// Modulus operator
// Returns the modulus of each component separately
Complex.prototype.mod = function(c)
{	return new Complex(this.re%c.re,this.i%c.i);
}

// Locates the index of the next addition or subtraction
// operator that is not nested within another function
String.prototype.nextAddSub = function(i)
{	var nests=0;
	for(c=i;c<this.length;c++)
	{	if(this[c]=="(")
			nests++;
		if(this[c]==")")
			nests--;
		if(nests==0 && (this[c]=="+" || (this[c]=="-" && "+-*/^ ".indexOf(this[Math.max(c-1,0)])==-1))|| nests<0)
			return c;
	}
	return this.length;
}

// Locates the index of the next multiplication or division
// operator that is not nested within another function
String.prototype.nextMultDiv = function(i)
{	var nests=0;
	for(c=i;c<this.length;c++)
	{	if(this[c]=="(")
			nests++;
		if(this[c]==")")
			nests--;
		if(nests==0 &&(this[c]=="*" || this[c]=="/" || this[c]==" ")|| nests<0)
			return c;
	}
	return this.length;
}

// Locates the index of the next power operator
// that is not nested within another function
String.prototype.nextPower = function(i)
{	var nests=0;
	for(c=i;c<this.length;c++)
	{	if(this[c]=="(")
			nests++;
		if(this[c]==")")
			nests--;
		if(nests==0 && this[c]=="^" || nests<0)
			return c;
	}
	return this.length;
}

// Locates the next index of a close parenthesis
// in order to find the end of a function
String.prototype.lastCloseParen = function(i)
{	for(c=this.length-1;c>=i;c--)
	{	if(this[c]==")")
			return c;
	}
	return this.length;
}

// Locates the last index of a digit in a string
// of consecutive digits, then stores the digits
// as a Complex
String.prototype.lastDigit = function(i)
{	var f=parseFloat(this);
	return (isNaN(f)?"":new String(f)).length+i;
}

// Parses a mathematical expression (not an equation)
// and returns the Javascript as a String
// str:String
//		The input (e.g. the mathematical expression)
// closeParen:Boolean
//		wrap the code with a predefined command to
//		make it storable in a function
// last:Number
//		when calling this function, set this value to 0
//		in order for it to parse correctly
// config:Array
//		an Array containing the names of variables that
//		will be passed to the resulting function as
//		arguments
Complex.parseFunction = function parseFunction(str,closeParen,last,config)
{	var vars = ["e","i","pi"];
	vars = (typeof config == "object" && config instanceof Array)?vars.concat(config):vars;
	var functions = ["cos(","sin(","tan(","sec(","csc(","cot(","log(","ln(","(",
					"e^(","arccos(","arcsin(","arctan(","arcsec(","arccsc(","arccot(",
					"-","sinh(","cosh(","tanh(","csch(","sech(","coth(",
					"re(","im(","abs(","arg(","int(","floor(","ceil(","round(",
					"fpart(","ipart(","sqrt(","arcsinh(","arccosh(","arctanh(",
					"arcsech(","arccsch(","arccoth("];
	var operators = ["+","-","*","/","^"," ","%"];
	var digits = ["0","1","2","3","4","5","6","7","8","9","."];
	var close= ")";
	var fStr = closeParen?"var i=Complex.I;var e=Complex.E;var pi=Complex.PI;return ":"";
	var i=0;
	var lastObj = last;
	while(i<str.length)
	{	var skip = false;
		for(var c=0;c<functions.length;c++)
		{	if(str.substr(i,functions[c].length)==functions[c] && lastObj!=2)
			{	i+=functions[c].length;
				var temp = parseFunction(str.substring(i,c==16?str.nextAddSub(i):str.lastCloseParen()),false,c==16?1:0,config);
				switch(c)
				{	case 0:
						fStr+="Complex.cos(";
						break;
					case 1:
						fStr+="Complex.sin(";
						break;
					case 2:
						fStr+="Complex.tan(";
						break;
					case 3:
						fStr+="Complex.sec(";
						break;
					case 4:
						fStr+="Complex.csc(";
						break;
					case 5:
						fStr+="Complex.cot(";
						break;
					case 6:
						fStr+="Complex.log(";
						break;
					case 7:
						fStr+="Complex.log(";
						break;
					case 8:
						fStr+="(";
						break;
					case 9:
						fStr+="Complex.exp(";
						break;
					case 10:
						fStr+="Complex.arccos(";
						break;
					case 11:
						fStr+="Complex.arcsin(";
						break;
					case 12:
						fStr+="Complex.arctan(";
						break;
					case 13:
						fStr+="Complex.arcsec(";
						break;
					case 14:
						fStr+="Complex.arccsc(";
						break;
					case 15:
						fStr+="Complex.arccot(";
						break;
					case 16:
						fStr+="Complex.neg(";
						break;
					case 17:
						fStr+="Complex.sinh(";
						break;
					case 18:
						fStr+="Complex.cosh(";
						break;
					case 19:
						fStr+="Complex.tanh(";
						break;
					case 20:
						fStr+="Complex.csch(";
						break;
					case 21:
						fStr+="Complex.sech(";
						break;
					case 22:
						fStr+="Complex.coth(";
						break;
					case 23:
						fStr+="Complex.re(";
						break;
					case 24:
						fStr+="Complex.im(";
						break;
					case 25:
						fStr+="Complex.abs(";
						break;
					case 26:
						fStr+="Complex.arg(";
						break;
					case 27:
						fStr+="Complex.floor(";
						break;
					case 28:
						fStr+="Complex.floor(";
						break;
					case 29:
						fStr+="Complex.ceil(";
						break;
					case 30:
						fStr+="Complex.round(";
						break;
					case 31:
						fStr+="Complex.fPart(";
						break;
					case 32:
						fStr+="Complex.floor(";
						break;
					case 33:
						fStr+="Complex.sqrt(";
						break;
					case 34:
						fStr+="Complex.arcsinh(";
						break;
					case 35:
						fStr+="Complex.arccosh(";
						break;
					case 36:
						fStr+="Complex.arctanh(";
						break;
					case 37:
						fStr+="Complex.arcsech(";
						break;
					case 38:
						fStr+="Complex.arccsch(";
						break;
					case 39:
						fStr+="Complex.arccoth(";
						break;
				}
				fStr+=temp[0]+")";
				i+=temp[1];
				skip = true;
				lastObj = temp[2];
				break;
		}	}
		if(skip)
			continue;
		for(var c=0;c<operators.length;c++)
		{	if(str.substr(i,1)==operators[c] && lastObj==2)
			{	i++;
				var temp;
				switch(c)
				{	case 0:
						temp = parseFunction(str.substring(i,str.nextAddSub(i)),false,1,config);
						fStr+=".add(";
						break;
					case 1:
						temp = parseFunction(str.substring(i,str.nextAddSub(i)),false,1,config);
						fStr+=".sub(";
						break;
					case 2:
						temp = parseFunction(str.substring(i,Math.min(str.nextMultDiv(i),str.nextAddSub(i))),false,1,config);
						fStr+=".mult(";
						break;
					case 3:
						temp = parseFunction(str.substring(i,Math.min(str.nextMultDiv(i),str.nextAddSub(i))),false,1,config);
						fStr+=".divBy(";
						break;
					case 4:
						temp = parseFunction(str.substring(i,Math.min(str.nextMultDiv(i),str.nextAddSub(i),str.nextPower(i))),false,1,config);
						fStr+=".cPow(";
						break;
					case 5:
						temp = parseFunction(str.substring(i,Math.min(str.nextMultDiv(i),str.nextAddSub(i))),false,1,config);
						fStr+=".mult(";
						break;
					case 6:
						temp = parseFunction(str.substring(i,Math.min(str.nextMultDiv(i),str.nextAddSub(i))),false,1,config);
						fStr+=".mod(";
						break;
				}
				fStr+=temp[0]+")"
				skip = true;
				i+=temp[1];
				lastObj = temp[2];
				break;
		}	}
		if(skip)
			continue;
		for(var c=0;c<vars.length;c++)
		{	if(str.substr(i,vars[c].length)==vars[c] && lastObj!=2)
			{	fStr+=vars[c];
				i+=vars[c].length;
				skip = true;
				lastObj = 2;
				break;
		}	}
		if(skip)
			continue;
		for(var c=0;c<digits.length;c++)
		{	if(str.substr(i,1)==digits[c])
			{	i=str.lastDigit(i);
				var f = parseFloat(str);
				fStr+="new Complex("+f+",0,"+f+",0)";
				skip = true;
				lastObj = 2;
				break;
		}	}
		if(str.substr(i,1)==close)
			return [fStr+(closeParen?";":""),i+(last==0?1:0),lastObj];
		if(!skip)
		{	i++;
			continue;
	}	}
	return closeParen?fStr+";":[fStr,str.length,lastObj];
}