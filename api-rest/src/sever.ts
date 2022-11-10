import fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import questionRoutes from './apiService/route';
import env from './config/env';

export default class Server {
  public server: FastifyInstance;

  constructor() {
    this.server = fastify({
      exposeHeadRoutes: true,
      logger: {
        level: 'info',
        transport: {
          target: 'pino-pretty',
        },
      },
    });
    this.setup();
  }

  public listen() {
    this.server.listen({ port: env.port, }, async (err, address) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      console.log(`Server listening at ${address}`);
    });
  }

  private async setup() {
    this.setRouter();
    this.setCoors();
  }

  private async setRouter() {
    const options = { prefix: '/v1', logLevel: 'debug' };
    await this.server.register(questionRoutes, options);
  }

  private setCoors() {
    this.server.register(cors, {
      origin: '*',
      methods: ['POST', 'GET', 'OPTIONS'],
    });
  }
}
