import { Context } from '@azure/functions';
import { Func } from '@boilerplate/util';

export async function helloWorldFunc(context: Context) {
  context.res = await Func.run0(
    context,
    async () => {
      return 'Hello World.';
    },
  );
}
