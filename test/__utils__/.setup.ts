jest.mock('../../src/db/models/Guild');
jest.mock('../../src/db/models/GuildConfig');
jest.mock('../../src/db/models/modules/AutoRoleConfig');
jest.mock('../../src/db/models/modules/WelcomeConfig');

process.env.DISCORD_TOKEN = '<test-token>';
