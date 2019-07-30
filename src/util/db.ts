import { Connection, createConnection, getConnectionOptions, AfterInsert, ConnectionOptionsReader } from 'typeorm';
import { ENTITIES } from '@boilerplate/entity';

export namespace DB {

  let connection: Connection;

  export async function getConnection(): Promise<Connection> {
    if (connection) {
      return connection;
    }

    // const connectionOptions = await getConnectionOptions(process.env.DB_PROFILE || 'default');
    const connectionReader = await new ConnectionOptionsReader({ root:'.', configName:'ormconfig.json' });
    const connectionOptions = await connectionReader.get(process.env.DB_PROFILE || 'default');
    Object.assign(connectionOptions, {
      entities: ENTITIES,
    });

    connection = await createConnection(connectionOptions);

    return connection;
  }
}
