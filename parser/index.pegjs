/* Copyright (c) 2017 Patrick Roberts */

{
  const Complex = require('../src/complex');

  function isComplex(parameter) {
    return parameter instanceof Complex;
  }

  function cache(value) {
    // look for index of exact match before caching new value
    const index = options.cached.findIndex(cached => cached.equals(value, 0));

    return isComplex(value) ? 'this[' + (index >= 0 ? index : options.cached.push(value) - 1) + ']' : value;
  }

  function getFunction(id, parameters, error) {
    const name = id.toLowerCase();
    const canEval = parameters.every(isComplex);

    if (options.parameters.indexOf(id) >= 0) {
      return id + '(' + parameters.map(cache).join() + ')';
    } else if (Complex.hasOwnProperty(name) && typeof Complex[name] === 'function' && name !== 'constructor') {
      if (Complex[name].length === 1) {
        const parameter = parameters[0];

        return canEval ? parameter[name]() : parameter + '.' + name + '()';
      }

      return canEval ? Complex[name].apply(Complex, parameters) : 'Complex.' + name + '(' + parameters.map(cache).join() + ')';
    }

    error('Expected function but "' + name + '" found.');
  }

  function getValue(id, error) {
    const name = id.toUpperCase();

    if (options.parameters.indexOf(id) >= 0) {
      return id;
    } else if (Complex.hasOwnProperty(name) && isComplex(Complex[name])) {
      return Complex[name];
    }

    error('Expected constant or parameter but "' + id + '" found.');
  }

  function getOperation(left, right, operand) {
    if (isComplex(left) && isComplex(right)) {
      return left[operand](right);
    }

    return cache(left) + '.' + operand + '(' + cache(right) + ')';
  }
}

Expression 'expression'
  = _ result:Shift _ { return cache(result); }

Shift
  = left:Scale _ '+' _ right:NestedShift { return getOperation(getOperation(left, right.left, 'add'), right.right, right.operator); }
  / left:Scale _ '-' _ right:NestedShift { return getOperation(getOperation(left, right.left, 'subtract'), right.right, right.operator); }
  / left:Scale _ '+' _ right:Scale { return getOperation(left, right, 'add'); }
  / left:Scale _ '-' _ right:Scale { return getOperation(left, right, 'subtract'); }
  / Scale

NestedShift
  = left:Scale _ '+' _ right:NestedShift { return {left: getOperation(left, right.left, 'add'), right: right.right, operator: right.operator}; }
  / left:Scale _ '-' _ right:NestedShift { return {left: getOperation(left, right.left, 'subtract'), right: right.right, operator: right.operator}; }
  / left:Scale _ '+' _ right:Scale { return {left, right, operator: 'add'}; }
  / left:Scale _ '-' _ right:Scale { return {left, right, operator: 'subtract'}; }

Scale
  = left:PowerNegate _ right:NestedScale { return getOperation(getOperation(left, right.left, 'multiply'), right.right, right.operator); }
  / left:PowerNegate _ '*' _ right:NestedScaleWithNegate { return getOperation(getOperation(left, right.left, 'multiply'), right.right, right.operator); }
  / left:PowerNegate _ '/' _ right:NestedScaleWithNegate { return getOperation(getOperation(left, right.left, 'divide'), right.right, right.operator); }
  / left:PowerNegate _ '%' _ right:NestedScaleWithNegate { return getOperation(getOperation(left, right.left, 'mod'), right.right, right.operator); }
  / left:PowerNegate _ right:Power { return getOperation(left, right, 'multiply'); }
  / left:PowerNegate _ '*' _ right:PowerNegate { return getOperation(left, right, 'multiply'); }
  / left:PowerNegate _ '/' _ right:PowerNegate { return getOperation(left, right, 'divide'); }
  / left:PowerNegate _ '%' _ right:PowerNegate { return getOperation(left, right, 'mod'); }
  / PowerNegate

NestedScaleWithNegate
  = left:PowerNegate _ right:NestedScale { return {left: getOperation(left, right.left, 'multiply'), right: right.right, operator: right.operator}; }
  / left:PowerNegate _ '*' _ right:NestedScaleWithNegate { return {left: getOperation(left, right.left, 'multiply'), right: right.right, operator: right.operator}; }
  / left:PowerNegate _ '/' _ right:NestedScaleWithNegate { return {left: getOperation(left, right.left, 'divide'), right: right.right, operator: right.operator}; }
  / left:PowerNegate _ '%' _ right:NestedScaleWithNegate { return {left: getOperation(left, right.left, 'mod'), right: right.right, operator: right.operator}; }
  / left:PowerNegate _ right:Power { return {left, right, operator: 'multiply'}; }
  / left:PowerNegate _ '*' _ right:PowerNegate { return {left, right, operator: 'multiply'}; }
  / left:PowerNegate _ '/' _ right:PowerNegate { return {left, right, operator: 'divide'}; }
  / left:PowerNegate _ '%' _ right:PowerNegate { return {left, right, operator: 'mod'}; }

NestedScale
  = left:Power _ right:NestedScale { return {left: getOperation(left, right.left, 'multiply'), right: right.right, operator: right.operator}; }
  / left:Power _ '*' _ right:NestedScaleWithNegate { return {left: getOperation(left, right.left, 'multiply'), right: right.right, operator: right.operator}; }
  / left:Power _ '/' _ right:NestedScaleWithNegate { return {left: getOperation(left, right.left, 'divide'), right: right.right, operator: right.operator}; }
  / left:Power _ '%' _ right:NestedScaleWithNegate { return {left: getOperation(left, right.left, 'mod'), right: right.right, operator: right.operator}; }
  / left:Power _ right:Power { return {left, right, operator: 'multiply'}; }
  / left:Power _ '*' _ right:PowerNegate { return {left, right, operator: 'multiply'}; }
  / left:Power _ '/' _ right:PowerNegate { return {left, right, operator: 'divide'}; }
  / left:Power _ '%' _ right:PowerNegate { return {left, right, operator: 'mod'}; }

PowerNegate
  = left:Group _ ('^' / '**') _ right:PowerNegate { return getOperation(left, right, 'pow'); }
  / '-' _ parameter:PowerNegate { return getFunction('negate', [parameter], error); }
  / Group

Power
  = left:Group _ ('^' / '**') _ right:Power { return getOperation(left, right, 'pow'); }
  / Group

Negate
  = '-' _ parameter:PowerNegate { return getFunction('negate', [parameter], error); }
  / Group

Group
  = '(' _ result:Shift _ ')' { return result; }
  / '[' _ result:Shift _ ']' { return result; }
  / '{' _ result:Shift _ '}' { return result; }
  / Function

Function 'function'
  = id:Identifier _ '(' _ parameters:Comma _ ')' { return getFunction(id, parameters, error); }
  / Value

Comma
  = left:Shift _ ',' _ right:Comma { return [left].concat(right); }
  / result:Shift { return [result]; }

Value
  = id:Identifier { return getValue(id, error); }
  / Number

Identifier 'identifier'
  = [A-Za-z][A-Za-z0-9]* { return text(); }

Number 'number'
  = Float ([Ee] [+-]? Integer)? { return new Complex.Cartesian(+text()); }

Float
  = Integer '.'? Integer?

Integer
  = [0-9]+

_ 'whitespace'
  = [ \t\n\r]*
