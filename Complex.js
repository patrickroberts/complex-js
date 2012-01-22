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
	return c.i==0?e.pow(c.re):e.cPow(c);
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
{	return new Complex(0.5*Math.cos(c.re)*(Math.exp(-c.i)+Math.exp(c.i)),0.5*Math.sin(c.re)*(Math.exp(-c.i)-Math.exp(c.i)));
}

// Sine function
Complex.sin = function(c)
{	return new Complex(0.5*Math.sin(c.re)*(Math.exp(-c.i)+Math.exp(c.i)),0.5*Math.cos(c.re)*(Math.exp(c.i)-Math.exp(-c.i)));
}

// Tangent function
Complex.tan = function(c)
{	var d = Math.cos(2*c.re)+Math.cosh(2*c.i);
	return new Complex(Math.sin(2*c.re)/d,Math.sinh(2*c.i)/d);
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
	return Complex.neg(i).mult(Complex.log(i.mult(c).add(Complex["1"].sub(c.pow(2)).pow(0.5))));
}

// Inverse Cosine function
Complex.arccos = function(c)
{	var i = Complex.I;
	return Complex.neg(i).mult(Complex.log(c.add(c.pow(2).sub(Complex["1"]).pow(0.5))));
}

// Inverse Tangent function
Complex.arctan = function(c)
{	var i = Complex.I;
	return i.mult(Complex.log(i.add(c).divBy(i.sub(c)))).divBy(new Complex(2,0,2,0));
}

// Inverse Secant function
Complex.arcsec = function(c)
{	var i = Complex.I;
	return Complex.neg(i).mult(Complex.log(c.pow(-1).add(Complex["1"].sub(i.divBy(c.pow(2))).pow(0.5))));
}

// Inverse Cosecant function
Complex.arccsc = function(c)
{	var i = Complex.I;
	return Complex.neg(i).mult(Complex.log(i.divBy(c).add(new Complex(1,0,1,0).sub(new Complex(1,0,1,0).divBy(c.pow(2))).pow(0.5))));
}

// Inverse Cotangent function
Complex.arccot = function(c)
{	var i = Complex.I;
	return i.mult(Complex.log(c.sub(i).divBy(c.add(i)))).divBy(new Complex(2,0,2,0));
}

// Hyperbolic Sine function
Complex.sinh = function(c)
{	return new Complex(Math.cos(c.r*Math.sin(c.t))*Math.sinh(c.r*Math.cos(c.t)),Math.sin(c.r*Math.sin(c.t))*Math.cosh(c.r*Math.cos(c.t)));
}

// Hyperbolic Cosine function
Complex.cosh = function(c)
{	return new Complex(Math.cos(c.r*Math.sin(c.t))*Math.cosh(c.r*Math.cos(c.t)),Math.sin(c.r*Math.sin(c.t))*Math.sinh(c.r*Math.cos(c.t)));
}

// Hyperbolic Tangent function
Complex.tanh = function(c)
{	var d = Math.cos(2*c.r*Math.sin(c.t))+Math.cosh(2*c.r*Math.cos(c.t));
	return new Complex(Math.sinh(2*c.r*Math.cos(c.t))/d,Math.sin(2*c.r*Math.sin(c.t))/d);
}

// Hyperbolic Cosecant function
Complex.csch = function(c)
{	var d = Math.cos(2*c.r*Math.sin(c.t))-Math.cosh(2*c.r*Math.cos(c.t));
	return new Complex(-2*Math.cos(c.r*Math.sin(c.t))*Math.sinh(c.r*Math.cos(c.t))/d,2*Math.sin(c.r*Math.sin(c.t))*Math.cosh(c.r*Math.cos(c.t))/d);
}

// Hyperbolic Secant function
Complex.sech = function(c)
{	var d = Math.cos(2*c.r*Math.sin(c.t))+Math.cosh(2*c.r*Math.cos(c.t));
	return new Complex(2*Math.cos(c.r*Math.sin(c.t))*Math.cosh(c.r*Math.cos(c.t))/d,-2*Math.sin(c.r*Math.sin(c.t))*Math.sinh(c.r*Math.cos(c.t))/d);
}

// Hyperbolic Cotangent function
Complex.coth = function(c)
{	var d = Math.cos(2*c.r*Math.sin(c.t))-Math.cosh(2*c.r*Math.cos(c.t));
	return new Complex(-Math.sinh(2*c.r*Math.cos(c.t))/d,Math.sin(2*c.r*Math.sin(c.t))/d);
}

// Inverse Hyperbolic Sine function
Complex.arcsinh = function(c)
{	return Complex.log(c.sub(Complex.sqrt(Complex["1"].add(c.pow(2)))));
}

// Inverse Hyperbolic Cosine function
Complex.arccosh = function(c)
{	return Complex.log(c.sub(Complex.sqrt(c.pow(2).sub(Complex["1"]))));
}

// Inverse Hyperbolic Tangent function
Complex.arctanh = function(c)
{	return Complex.I.mult(Complex.tan(new Complex(Math.E,0,Math.E,0).mult(new Complex(c.r,0,Math.abs(c.r),0)).mult(new Complex(c.t,0,c.t,0))));
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