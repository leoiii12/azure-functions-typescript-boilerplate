import { Connection, createConnection, getConnectionOptions } from 'typeorm';

import { Device, DeviceHistory, GeneralDevice, Role, User } from '@boilerplate/entity';

export namespace DB {

  let connection: Connection;

  export async function getConnection(): Promise<Connection> {
    if (connection) {
      return connection;
    }

    const connectionOptions = await getConnectionOptions('default-dist');

    Object.assign(connectionOptions, {
      entities: [
        DeviceHistory,
        Device,
        GeneralDevice,
        Role,
        User,
      ],
    });

    connection = await createConnection(connectionOptions);

    return connection;
  }

}
