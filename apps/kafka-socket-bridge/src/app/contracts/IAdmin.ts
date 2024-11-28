import { Admin, Kafka } from 'kafkajs';

export interface IAdmin {
  kafka: Kafka;
  admin: Admin;
  connectAdmin: () => Promise<void>;
  disconnectAdmin: () => Promise<void>;
  listofAllAvailableTopics: () => Promise<string[]>;
}
