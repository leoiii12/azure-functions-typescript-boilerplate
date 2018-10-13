import { Function, UserFriendlyError } from '@boilerplate/util';

export async function run(context: any, req: any) {
  context.res = await Function.run(context, async () => {
    if (!req.query.name && !(req.body && req.body.name)) {
      throw new UserFriendlyError('Please pass a name on the query string or in the request body');
    }

    return `Hello ${(req.query.name || req.body.name)}`;
  });
}
