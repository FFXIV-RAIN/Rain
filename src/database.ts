import { RedisMemoryServer } from 'redis-memory-server';
import Redis from 'ioredis';

let _client: Redis | undefined;

export async function redis(): Promise<Redis> {
    if (_client) {
        return _client;
    }
    
    if (process.env.REDISTOGO_URL) {
        console.log('Connecting to production REDIS');
        _client = new Redis(process.env.REDISTOGO_URL);
    } else {
        const redisServer = new RedisMemoryServer();

        await redisServer.start();

        _client = new Redis({
            port: redisServer.instanceInfoSync?.port,
            host: redisServer.instanceInfoSync?.ip,
        });
    }

    _client.on('error', console.error);

    _client.on('end', () => {
        _client = undefined;
    })

    return _client;
}