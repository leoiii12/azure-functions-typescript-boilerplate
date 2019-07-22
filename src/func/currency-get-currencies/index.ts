import { Context } from '@azure/functions';
import { Currency, CurrencyDto } from '@boilerplate/entity';
import { Authorized, DB, Func , InternalServerError } from '@boilerplate/util';

export class GetCurrenciesOutput {
  public counts : number;
  constructor(public sites: CurrencyDto[]) {
    this.counts = sites.length;
  }
}

export async function getCurrencies(): Promise<GetCurrenciesOutput> {
  try {
    const connection = await DB.getConnection();
    const currencyRepository = connection.getRepository(Currency);

    const sites = await currencyRepository.find();

    return new GetCurrenciesOutput(sites);
  } catch (err) {
    throw new InternalServerError(` - Get Currency Function in ${__filename} - ${err.toString()}`);
  }
}

export async function currencyGetCurrenciesFunc(context: Context) {
  context.res = await Func.runWithoutInput(
    context,
    getCurrencies,
  );
}
