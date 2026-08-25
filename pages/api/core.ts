import { JsonWebTokenError, sign } from 'jsonwebtoken';
import { Context, Middleware, ParameterizedContext } from 'koa';
import JWT from 'koa-jwt';
import { HTTPError } from 'koajax';
import { DataObject } from 'mobx-restful';
import { KoaOption, withKoa } from 'next-ssr-middleware';

import { LarkAppMeta } from '../../models/configuration';

export type JWTContext = ParameterizedContext<
  { jwtOriginalError: JsonWebTokenError } | { user: DataObject }
>;

export const parseJWT = JWT({
  secret: LarkAppMeta.secret,
  cookie: 'token',
  passthrough: true,
});

export const verifyJWT = JWT({ secret: LarkAppMeta.secret, cookie: 'token' });

const RobotToken = sign({ id: 0, name: 'Robot' }, LarkAppMeta.secret);

console.table({ RobotToken });

export const safeAPI: Middleware<any, any> = async (context: Context, next) => {
  try {
    return await next();
  } catch (error) {
    if (!(error instanceof HTTPError)) {
      console.error(error);

      context.status = 400;

      return (context.body = { message: (error as Error).message });
    }
    const { message, response } = error;
    let { body } = response;

    context.status = response.status;
    context.statusMessage = message;

    if (body instanceof ArrayBuffer)
      try {
        body = new TextDecoder().decode(new Uint8Array(body));

        body = JSON.parse(body);
      } catch {
        //
      }
    console.error(JSON.stringify(body, null, 2));

    context.body = body;
  }
};

export const withSafeKoa = <S, C>(...middlewares: Middleware<S, C>[]) =>
  withKoa<S, C>({} as KoaOption, safeAPI, ...middlewares);
