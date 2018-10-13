import { Connection, createConnection } from 'typeorm';

export namespace DB {

  let connection: Connection;

  export async function getConnection(): Promise<Connection> {
    if (connection) {
      return connection;
    }

    connection = await createConnection('default-dist');

    return connection;
  }

}
