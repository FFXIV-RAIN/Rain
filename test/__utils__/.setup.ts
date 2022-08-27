jest.mock('../../src/db/models/Guild/Guild');
jest.mock('../../src/db/models/Guild/GuildConfig');
jest.mock('../../src/db/models/modules/AutoRoleConfig');
jest.mock('../../src/db/models/modules/WelcomeConfig');

process.env.DISCORD_TOKEN = '<test-token>';
