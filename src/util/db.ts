import { Connection, createConnection, getConnectionOptions, AfterInsert } from 'typeorm';

import { ENTITIES } from '@boilerplate/entity';

export namespace DB {

  let connection: Connection;

  export async function getConnection(): Promise<Connection> {
    if (connection) {
      return connection;
    }

    const connectionOptions = await getConnectionOptions(process.env.DB_PROFILE || 'default-dist');

    Object.assign(connectionOptions, {
      entities: ENTITIES,
    });

    connection = await createConnection(connectionOptions);

    return connection;
  }

}
