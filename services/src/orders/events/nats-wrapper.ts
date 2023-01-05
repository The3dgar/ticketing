import nats, { Stan } from 'node-nats-streaming';

interface ConnectInterface {
  clusterId: string;
  clientId: string;
  url: string;
}

class NatsWrapper {
  private _client?: Stan;

  get client() {
    if (!this._client) {
      throw new Error('Cannot access Nats client before connecting');
    }

    return this._client;
  }

  connect({ clientId, clusterId, url }: ConnectInterface) {
    this._client = nats.connect(clusterId, clientId, { url });

    return new Promise<void>((res, rej) => {
      this.client.on('connect', () => {
        console.log('Connected to NATS');
        res();
      });

      this.client.on('error', (error) => {
        rej(error);
      });
    });
  }
}

export const natsWrapper = new NatsWrapper();
