module.exports = function ({types: t}) {
  return {
    visitor: {
      ExpressionStatement(path) {
        const node = path.node;

        if (
          t.isCallExpression(node.expression) &&
          t.isIdentifier(node.expression.callee) &&
          node.expression.callee.name === '_classCallCheck'
        ) {
          path.replaceWith(t.noop());
        }
      },
      FunctionDeclaration(path) {
        const node = path.node;

        if (
          t.isIdentifier(node.id) &&
          node.id.name === '_classCallCheck'
        ) {
          path.replaceWith(t.noop());
        }
      },
    },
  };
};
