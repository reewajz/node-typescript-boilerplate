import 'reflect-metadata';
import amqp, { Connection } from 'amqplib';
import colors from 'chalk';

import express from 'express';
import { AppDataSource } from '@database';
import { createLogger } from '@utils/logger';
import { injectable } from 'tsyringe';
import { ETLStateService } from './services/etl-state.service';
import { ETLStateRepository } from './repositories/etl-state.repositories';

const logger = createLogger('App');

@injectable()
export class App {
  public app: express.Application;
  public env: string;
  public port: string | number;
  private reconnectTimer: NodeJS.Timeout;
  private connection: Connection;

  constructor() {
    this.app = express();
    this.env = process.env.NODE_ENV || 'development';
    this.port = process.env.PORT || 3000;

    this.initializeMiddlewares();
    this.connectToDatabase();
    this.initializeConnection();

    process.on('exit', (code) => {
      if (code !== 0) {
        logger.info(`About to exit with code: ${code}`);
      }
      if (this.connection) {
        this.connection.close();
        logger.info('Connection closed');
      }
      if (this.reconnectTimer) {
        this.reconnectTimer && clearTimeout(this.reconnectTimer);
        logger.info('Reconnect timer cleared');
      }
    });
  }

  public listen() {
    this.app.listen(this.port, () => {
      logger.info(`=================================`);
      logger.info(`🚀 App listening on the port ${this.port}`);
      logger.info(`=================================`);
    });
  }

  public getServer() {
    return this.app;
  }

  private async connectToDatabase() {
    AppDataSource.initialize()
      .then(() => {
        logger.info('Data Source has been initialized!');
      })
      .catch((err) => {
        logger.error(`Error during Data Source initialization: ${err.message}`);
        process.exit(0);
      });
  }

  private async initializeConnection() {
    try {
      this.connection = await this.createConnection(process.env.AMQP_URL);
      await this.createChannelAndConsume(this.connection);
    } catch (error) {
      logger.error(
        `Error while calling connect(amqpUrl) inside initQueueConsumer(): ${error.message}`,
      );
    }
  }

  /**
   * Creates a connection to the AMQP server.
   * @param {string} amqpUrl - The URL of the AMQP server.
   * @returns {Promise<void>} A Promise that resolves when the connection is established.
   */
  private async createConnection(
    amqpUrl: string,
    reconnecting = false,
  ): Promise<Connection> {
    try {
      const connection = await amqp.connect(amqpUrl);
      connection.on('error', (err: Error) => {
        if (err.message.toLowerCase() !== 'connection closing') {
          logger.error(
            `Connection error inside createConnection(): ${err.message}`,
          );
        }
      });
      connection.on('close', () => {
        logger.error(
          'Connection closed inside createConnection() and reconnecting in 5 seconds',
        );
        reconnecting = true;
        this.reconnectTimer = setTimeout(
          () => this.createConnection(amqpUrl, reconnecting),
          5000,
        );
      });
      return connection;
    } catch (error: any) {
      logger.error(
        `Error while creating a amqp connection inside createConnection(): ${error.message}`,
      );
      throw new Error('Failed to create connection inside createConnection()');
    }
  }

  /**
   * Creates a channel for the given connection and sets up a consumer to receive messages from the queue.
   * @param {Connection} amqpConnection - The AMQP connection.
   * @returns {Promise<void>} A Promise that resolves when the channel is created and the consumer is set up.
   */
  private async createChannelAndConsume(connection: Connection): Promise<void> {
    const queueName = process.env.QUEUE_NAME;
    try {
      const channel = await connection.createChannel();
      channel.on('error', (err: any) => {
        logger.error(`[AMQP] channel error for ${queueName}`, err.message);
      });
      channel.on('close', () => {
        logger.info(`[AMQP] channel closed for ${queueName}`);
      });

      await channel.assertQueue(queueName, { durable: true });
      await channel.prefetch(1);
      console.log(`Waiting for messages in queue ${colors.green(queueName)}`);
      await channel.consume(
        queueName,
        (msg: any) => {
          if (msg?.content) {
            try {
              logger.info(
                `Consumer for ${queueName} received message: ${msg.content.toString()}`,
              );
              // this.etlStateService.saveMessageToDatabase(JSON.parse(msg.content.toString()));

              const repo = new ETLStateRepository(AppDataSource);
              repo.createOne(JSON.parse(msg.content));

              channel?.ack(msg);
            } catch (error: any) {
              logger.error(`Error inside message consumer: ${error.message}`);
              channel?.nack(msg);
            }
          }
        },
        { noAck: false },
      );
    } catch (error: any) {
      logger.error(`Error inside createChannelAndConsume(): ${error.message}`);
      throw new Error('Failed inside createChannelAndConsume()');
    }
  }

  private initializeMiddlewares() {
    this.app.use(express.json());
    this.app.disable('x-powered-by');
  }
}
