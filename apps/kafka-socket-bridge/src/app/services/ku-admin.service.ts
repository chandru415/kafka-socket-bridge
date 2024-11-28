import {
  Injectable,
  OnApplicationShutdown,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IAdmin } from '../contracts/IAdmin';
import { AdminRepository } from '../repository/admin-repository';
import { environment } from '../environments/environment';

@Injectable()
export class KuAdminService implements OnModuleInit, OnApplicationShutdown {
  private readonly admins = new Map<string, IAdmin>();

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    const admin = new AdminRepository(environment.kafkaBrokers);
    await admin.connectAdmin();
    this.admins.set('admin', admin);
  }

  async onApplicationShutdown() {
    /** */
    for (const admin of this.admins.values()) {
      await admin.disconnectAdmin();
    }
  }

  async listOfAllAvailableTopics() {
    return await this.admins.get('admin')?.listofAllAvailableTopics();
  }
}
