import { connect } from "https://denopkg.com/keroxp/deno-redis/mod.ts";

type Config = {
  hostname: string,
  port: number,
}

export class Connection {
  config: Config;
  redis: any;

  constructor(config: Config) {
    this.config = config;
  }
  
  async connectRedis() {
    this.redis = await connect(this.config);
  }
}