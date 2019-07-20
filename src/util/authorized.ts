import { UserRole } from '@boilerplate/entity';

export interface AuthorizedConfig {
  allRoles?: UserRole[];
  anyRoles?: UserRole[];
}

export class Authorized {

  private config: AuthorizedConfig;

  private isInRoles(roles: UserRole[]) {
    if (this.config.allRoles == null) return true;
    if (this.config.allRoles.length === 0) return true;

    return this.config.allRoles.every(r => roles.includes(r));
  }

  private isInAnyRoles(roles: UserRole[]) {
    if (this.config.anyRoles == null) return true;
    if (this.config.anyRoles.length === 0) return true;

    return this.config.anyRoles.some(r => roles.includes(r));
  }

  public permitted(roles: UserRole[]) {
    return this.isInRoles(roles) && this.isInAnyRoles(roles);
  }

  static permit(config: AuthorizedConfig): Authorized {
    const authorized = new Authorized();

    authorized.config = config;

    return authorized;
  }

}
