import Redis from 'ioredis';
import {URL} from 'url';

let _client: Redis | undefined;

export async function redis(): Promise<Redis> {
    if (_client) {
        return _client;
    }
    
    if (process.env.REDISTOGO_URL) {
        console.log('Connecting to production database');
        const info = new URL(process.env.REDISTOGO_URL)
        _client = new Redis({
            host: info.hostname,
            port: Number.parseInt(info.port),
            password: info.password
        });
    } else {
        const { RedisMemoryServer } = await import('redis-memory-server');
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