@preprocessor typescript

@{%
import moo from 'moo';
import { literal, identifier, call, unary, binary } from './expressions';

const join = (data: any[]) => data.join('');
const pick = (idx: number) => (data: any[]) => data[idx];
const empty = () => [];
const array = (...idx: number[]) => (data: any[]) => idx.map(i => data[i]);
const reduce = (acc: number, cur: number) => (data: any[]) => data[acc].concat(data[cur]);
const dispose = () => null;

const lexer = moo.compile({
  WhiteSpace: / +/,
  IdentifierName: /[$A-Z_a-z][$\w]*/,
  DecimalIntegerLiteral: /0|[1-9]\d*/,
  DecimalDigits: /\d+/,
  ExponentPart: /[Ee][+-]?\d+/,
  BinaryIntegerLiteral: /0[Bb][01]+/,
  OctalIntegerLiteral: /0[Oo][0-7]+/,
  HexIntegerLiteral: /0[Xx][\dA-Fa-f]+/,
  // include update punctuators ++ and -- to enforce whitespace between sequential + and - punctuators
  Punctuator: ['(', ')', '[', ']', '.', ',', '+', '-', '*', '%', '**', '++', '--', '<<', '>>', '>>>', '&', '|', '^', '~'],
});

// use interface declaration merging to resolve type mismatch between nearley NearleyToken and moo Token
interface NearleyToken {
  offset: number;
  text: string;
  lineBreaks: number;
  line: number;
  col: number;
}
%}

@lexer lexer

Expression ->
    _ BitwiseORExpression _ {% pick(1) %}

BitwiseORExpression ->
    BitwiseORExpression _ "|" _ BitwiseXORExpression {% binary %}
  | BitwiseXORExpression                             {% id %}

BitwiseXORExpression ->
    BitwiseXORExpression _ "^" _ BitwiseANDExpression {% binary %}
  | BitwiseANDExpression                              {% id %}

BitwiseANDExpression ->
    BitwiseANDExpression _ "&" _ ShiftExpression {% binary %}
  | ShiftExpression                              {% id %}

ShiftExpression ->
    ShiftExpression _ ShiftOperator _ AdditiveExpression {% binary %}
  | AdditiveExpression                                   {% id %}

ShiftOperator ->
    "<<"  {% id %}
  | ">>"  {% id %}
  | ">>>" {% id %}

AdditiveExpression ->
    AdditiveExpression _ AdditiveOperator _ MultiplicativeExpression {% binary %}
  | MultiplicativeExpression                                         {% id %}

AdditiveOperator ->
    "+" {% id %}
  | "-" {% id %}

MultiplicativeExpression ->
    MultiplicativeExpression _ MultiplicativeOperator _ ExponentiationExpression {% binary %}
  | ExponentiationExpression                                                     {% id %}

MultiplicativeOperator ->
    "*" {% id %}
  | "/" {% id %}
  | "%" {% id %}

ExponentiationExpression ->
    LeftHandSideExpression _ "**" _ ExponentiationExpression {% binary %}
  | UnaryExpression                                          {% id %}

UnaryExpression ->
    UnaryOperator _ UnaryExpression {% unary %}
  | LeftHandSideExpression          {% id %}

UnaryOperator ->
    "+" {% id %}
  | "-" {% id %}
  | "~" {% id %}

LeftHandSideExpression ->
    ParenthesizedExpression {% id %}
  | PrimaryExpression       {% id %}

ParenthesizedExpression ->
    "(" _ BitwiseORExpression _ ")" {% pick(2) %}
  | "[" _ BitwiseORExpression _ "]" {% pick(2) %}

PrimaryExpression ->
    CallExpression  {% id %}
  | %IdentifierName {% identifier %}
  | NumericLiteral  {% literal %}

NumericLiteral ->
    DecimalLiteral        {% id %}
  | %BinaryIntegerLiteral {% id %}
  | %OctalIntegerLiteral  {% id %}
  | %HexIntegerLiteral    {% id %}

DecimalLiteral ->
    %DecimalIntegerLiteral "." %DecimalDigits:? %ExponentPart:? {% join %}
  | "." %DecimalDigits %ExponentPart:?                          {% join %}
  | %DecimalIntegerLiteral %ExponentPart:?                      {% join %}

CallExpression ->
    %IdentifierName _ Arguments {% call %}

Arguments ->
    "(" _ ArgumentList _ ")" {% pick(2) %}
  | "(" _ ")"                {% empty %}

ArgumentList ->
    ArgumentList _ "," _ BitwiseORExpression {% reduce(0, 4) %}
  | BitwiseORExpression                      {% array(0) %}

_ ->
    %WhiteSpace:? {% dispose %}
