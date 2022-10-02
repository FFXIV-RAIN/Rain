_**⚠️ This repo is still a WIP and things are always subject to change. ⚠️**_

[![Docker Hub Version](https://img.shields.io/docker/v/rainbowcafe/rain-bot?label=Docker%20Hub%20Version)](https://hub.docker.com/repository/docker/rainbowcafe/rain-bot)

![Coveralls](https://img.shields.io/coveralls/github/rain-cafe-xiv/rain-bot)

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

[_**Want to Contribute?**_](/CONTRIBUTING.md)