import { Role } from '@boilerplate/entity';

export interface AuthorizedConfig {
  allRoles?: Role[];
  anyRoles?: Role[];
}

export class Authorized {

  private config: AuthorizedConfig;

  private isInRoles(roles: Role[]) {
    if (this.config.allRoles == null) return true;
    if (this.config.allRoles.length === 0) return true;

    return this.config.allRoles.every(r => roles.includes(r));
  }

  private isInAnyRoles(roles: Role[]) {
    if (this.config.anyRoles == null) return true;
    if (this.config.anyRoles.length === 0) return true;

    return this.config.anyRoles.some(r => roles.includes(r));
  }

  public permitted(roles: Role[]) {
    return this.isInRoles(roles) && this.isInAnyRoles(roles);
  }

  static permit(config: AuthorizedConfig): Authorized {
    const authoried = new Authorized();

    authoried.config = config;

    return authoried;
  }

}
