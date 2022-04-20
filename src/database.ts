import Redis from 'ioredis';
import {URL} from 'url';
import { config } from './config';
import { logger } from './utils/logger';

let _client: Redis | undefined;

export async function redis(): Promise<Redis> {
    if (_client) {
        return _client;
    }
    
    if (config.redisURL) {
        logger.info('Connecting to production database...');
        const info = new URL(config.redisURL)
        _client = new Redis({
            host: info.hostname,
            port: Number.parseInt(info.port),
            password: info.password
        });
    } else {
        logger.info('Starting in-memory database...');
        const { RedisMemoryServer } = await import('redis-memory-server');
        const redisServer = new RedisMemoryServer();

        await redisServer.start();
        logger.info('Successfully started database!');

        logger.info('Connecting to in-memory database...');
        _client = new Redis({
            port: redisServer.instanceInfoSync?.port,
            host: redisServer.instanceInfoSync?.ip,
        });
    }

    _client.on('connect', () => {
        logger.info('Connection established!');
    })

    _client.on('reconnecting', () => {
        logger.info('Reconnecting to database...');
    })

    _client.on('error', logger.error);

    _client.on('end', () => {
        _client = undefined;
    })

    return _client;
}