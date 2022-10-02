_**⚠️ This repo is still a WIP and things are always subject to change. ⚠️**_

## Rain

### Supports

- 💻 Self-hosting!
- 💿 [Almost any database you'd ever want!](#supported-databases)
- 👋 Welcome Messages!
- 🤖 Automatic Role Assignment
  - Including the ability to set separate roles for bots!
- 🗓 Scheduled Messages

### Supported Databases

- 🐘 Postgres
- 🦭 MariaDB (MySQL)
- Ⓜ️ SQL Server
- 🪶 SQLite

### Getting Started

#### Docker

```sh
$ docker run -d \
      --restart=always \
      -e DATABASE_URL="<your-database-url>" \
      -e DISCORD_CLIENT_ID="<your-discord-client-id>" \
      -e DISCORD_TOKEN="<your-discord-token>" \
      --name discord-bot \
      rainbowcafe/rain-bot
```

#### Docker Compose

```yml
version: "3"

services:
  discord-bot:
    image: rainbowcafe/rain-bot:latest
    container_name: discord-bot
    tty: true
    stdin_open: true
    restart: always
    environment:
      DATABASE_URL: "<your-database-url>"
      DISCORD_CLIENT_ID: "<your-discord-client-id>"
      DISCORD_TOKEN: "<your-discord-token>"
```

### Prerequisites

- [NodeJS v16](https://nodejs.org/en/)

### Quick Start

1. Add a `.env` file with the following contents, replacing `<bot-token>` with your Discord Bot's... token.

```.env
DISCORD_TOKEN=<bot-token>
```

2. Run `npm start` or `npm start:debug` (if you're going to use VSCode's Debugger)

3. Verify everything's working!