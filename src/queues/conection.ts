import { config } from '@notifications/config';
import { winstonLogger } from '@efraxpc/jobber-shared';
import { Logger } from 'winston';

import amqp, { Channel, ChannelModel} from 'amqplib';


const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'notificationQueueConnection', 'debug');

async function createConnection(): Promise<Channel | undefined> {
  try {
    const connection: ChannelModel = await amqp.connect(`${config.RABBITMQ_ENDPOINT}`);
    const channel: Channel = await connection.createChannel();
    log.info('Notification server connected to queue successfully...');
    closeConnection(channel, connection);
    return channel;
  } catch (error) {
    log.log('error', 'NotificationService error createConnection() method:', error);
    return undefined;
  }
}

function closeConnection(channel: Channel, connection: ChannelModel): void {
  process.once('SIGINT', async () => {
    await channel.close();
    await connection.close();
  });
}

export { createConnection } ;