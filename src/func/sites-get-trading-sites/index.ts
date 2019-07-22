import { Context } from '@azure/functions';
import { TradingSite, TradingSiteDto } from '@boilerplate/entity';
import { Authorized, DB, Func , InternalServerError } from '@boilerplate/util';

export class GetTradingSiteOutput {
  public counts : number;
  constructor(public sites: TradingSiteDto[]) {
    this.counts = sites.length;
  }
}

export async function getTradingSite(): Promise<GetTradingSiteOutput> {
  try {
    const connection = await DB.getConnection();
    const siteRepository = connection.getRepository(TradingSite);

    const sites = await siteRepository.find();

    return new GetTradingSiteOutput(sites.map(u => TradingSiteDto.from(u)));
  } catch (err) {
    throw new InternalServerError(` -  Get Trading Site Function in ${__filename} - ${err.toString()}`);
  }
}

export async function sitesGetTradingSitesFunc(context: Context) {
  context.res = await Func.runWithoutInput(
    context,
    getTradingSite,
  );
}
