/// <reference types="node" />

declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: 'development' | 'production' | 'test';
    readonly MONGODB_URI: string;
    readonly DB_NAME: string;
  }
}
