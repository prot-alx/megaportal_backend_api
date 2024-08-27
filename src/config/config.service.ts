import { Injectable } from '@nestjs/common';

@Injectable()
export class AppConfigService {
  private readonly config: Record<string, string | number>;

  constructor() {
    this.config = {
      DATABASE_HOST: process.env.DATABASE_HOST || '',
      DATABASE_PORT: parseInt(process.env.DATABASE_PORT || '5432', 10),
      DATABASE_USERNAME: process.env.DATABASE_USERNAME || '',
      DATABASE_PASSWORD: process.env.DATABASE_PASSWORD || '',
      DATABASE_NAME: process.env.DATABASE_NAME || '',
      SECRET_JWT: process.env.SECRET_JWT || '',
      EXPIRE_JWT: parseInt(process.env.EXPIRE_JWT || '3600', 10),
      REFRESH_JWT: process.env.REFRESH_JWT || '',
      REFRESH_EXPIRE_JWT: parseInt(process.env.REFRESH_EXPIRE_JWT || '86400', 10),
      API_PORT: parseInt(process.env.API_PORT, 10),
    };
  }

  get DATABASE_HOST(): string {
    return this.config.DATABASE_HOST as string;
  }

  get DATABASE_PORT(): number {
    return this.config.DATABASE_PORT as number;
  }

  get API_PORT(): number {
    return this.config.API_PORT as number;
  }

  get DATABASE_USERNAME(): string {
    return this.config.DATABASE_USERNAME as string;
  }

  get DATABASE_PASSWORD(): string {
    return this.config.DATABASE_PASSWORD as string;
  }

  get DATABASE_NAME(): string {
    return this.config.DATABASE_NAME as string;
  }

  get SECRET_JWT(): string {
    return this.config.SECRET_JWT as string;
  }

  get EXPIRE_JWT(): number {
    return this.config.EXPIRE_JWT as number;
  }

  get REFRESH_JWT(): string {
    return this.config.REFRESH_JWT as string;
  }

  get REFRESH_EXPIRE_JWT(): number {
    return this.config.REFRESH_EXPIRE_JWT as number;
  }
  
}
