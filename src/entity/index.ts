import { Device } from './device';
import { DeviceHistory } from './device-history';
import { GeneralDevice } from './general-device';
import { User } from './user';

export * from './device';
export * from './device-history';
export * from './general-device';
export * from './role';
export * from './user';

export const ENTITIES = [Device, DeviceHistory, GeneralDevice, User];