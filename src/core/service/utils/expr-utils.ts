import dayjs from 'dayjs';
import { Expression, Parser } from 'expr-eval';
import _ from 'lodash';
import numeral from 'numeral';

export interface Expr {
  expression: Expression;
  vars: string[];
  defaults: any;
  evaluate(data: any): any;
}

export const parseExpr = (expression: string): Expr => {
  const parser = new Parser();
  parser.functions._ = _;
  parser.functions.now = () => dayjs();
  parser.functions.dayjs = dayjs;
  parser.functions.Date = Date;
  const expr = parser.parse(expression);
  const vars = expr.variables({
    withMembers: true,
  });
  return {
    vars,
    expression: expr,
    defaults: vars.reduce((acc, propPath) => {
      _.set(acc, propPath, 0);
      return acc;
    }, {}),
    evaluate: (data: any) => {
      const result = expr.evaluate(data);
      if (typeof result === 'number') {
        return numeral(result).value() ? result : 0;
      }
      return result;
    },
  };
};
