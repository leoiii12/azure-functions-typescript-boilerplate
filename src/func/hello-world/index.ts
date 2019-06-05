import { Func } from '@boilerplate/util';

export async function helloWorldFunc(context: any) {
  context.res = await Func.run0(
    context,
    async () => {
      return 'Hello World.';
    },
  );
}
