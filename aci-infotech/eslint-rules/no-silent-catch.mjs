/**
 * Custom ESLint rule: copilot/no-silent-catch
 *
 * Flags catch blocks inside Atheros/co-pilot code that do not call `log.*`
 * before returning or that have an empty body. Every failure must be
 * surfaced through the structured logger at src/lib/copilot/logger.ts.
 *
 * Scope (configured in eslint.config.mjs):
 *   - src/lib/copilot/**
 *   - src/components/copilot/**
 *   - src/app/api/copilot/**
 *   - src/app/api/chat/**
 *
 * Whitelisted call names treated as "fail loud":
 *   log.info, log.warn, log.error, log.fatal
 *
 * An allow comment `// copilot-allow-silent-catch: <reason>` on the line
 * immediately preceding the catch clause or anywhere inside the catch
 * body bypasses the rule. The reason must be non-empty.
 */

const ALLOWED_CALL_NAMES = new Set(['log.info', 'log.warn', 'log.error', 'log.fatal']);

/**
 * Walk a CatchClause body and determine whether any statement is a call
 * to one of the allowed log methods. We stay shallow: we do not follow
 * function boundaries; if your catch immediately delegates to a helper,
 * call the helper something obviously-logger-like or use the allow comment.
 */
function bodyCallsLogger(body) {
  if (!body || body.type !== 'BlockStatement') return false;
  for (const stmt of body.body) {
    if (stmt.type === 'ExpressionStatement') {
      const expr = stmt.expression;
      if (expr.type === 'AwaitExpression' && expr.argument.type === 'CallExpression') {
        if (isAllowedCall(expr.argument.callee)) return true;
      }
      if (expr.type === 'CallExpression' && isAllowedCall(expr.callee)) {
        return true;
      }
    }
  }
  return false;
}

function isAllowedCall(callee) {
  if (!callee) return false;
  if (callee.type !== 'MemberExpression') return false;
  const obj = callee.object;
  const prop = callee.property;
  if (!obj || !prop) return false;
  if (obj.type !== 'Identifier') return false;
  if (prop.type !== 'Identifier') return false;
  const name = `${obj.name}.${prop.name}`;
  return ALLOWED_CALL_NAMES.has(name);
}

function hasAllowComment(context, node) {
  const source = context.getSourceCode();
  const commentsBefore = source.getCommentsBefore(node) || [];
  const commentsInside =
    node.body && node.body.type === 'BlockStatement'
      ? source.getCommentsInside(node.body) || []
      : [];
  const all = [...commentsBefore, ...commentsInside];
  return all.some((c) => /copilot-allow-silent-catch\s*:\s*\S+/.test(c.value));
}

const rule = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Catch clauses inside copilot/chat code must call log.info/warn/error/fatal or have an explicit allow comment.',
      recommended: false,
    },
    schema: [],
    messages: {
      emptyCatch:
        'Empty catch clause. Atheros code must call log.error/warn/info or include a `copilot-allow-silent-catch: <reason>` comment.',
      noLogCall:
        'Catch clause does not call log.error/warn/info/fatal. Add a call to the structured logger or a `copilot-allow-silent-catch: <reason>` comment.',
    },
  },
  create(context) {
    return {
      CatchClause(node) {
        if (hasAllowComment(context, node)) return;
        const body = node.body;
        if (!body || body.type !== 'BlockStatement' || body.body.length === 0) {
          context.report({ node, messageId: 'emptyCatch' });
          return;
        }
        if (!bodyCallsLogger(body)) {
          context.report({ node, messageId: 'noLogCall' });
        }
      },
    };
  },
};

export default rule;
