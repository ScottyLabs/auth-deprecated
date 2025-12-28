# Graph

## Overview

This is a project that is a social graph for ScottyLabs.
Currently only used for testing the new auth system.

## Development

### Permission Prerequisite

Follow the instructions in [Governance](https://github.com/ScottyLabs/governance) to add yourself as a [contributor](https://github.com/ScottyLabs/governance/blob/main/docs/contributors.md) and join the [Graph team](https://github.com/ScottyLabs/governance/blob/main/teams/graph.toml) to obtain the necessary permissions.

### Dev Container Setup

Prerequisites: [Docker](https://docs.docker.com/get-docker/) and [Dev Containers Extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers).

1. Clone and open the repository locally in VS Code (or any other IDE that supports Dev Containers).
2. Click on the `Reopen in Container` button that pops up in the bottom left corner of the VS Code window.
   - Or open the command palette and run the command `Dev Containers: Reopen in Container`.
3. Wait for the container to start. It may take a few minutes to install dependencies and run post create script.
4. Start developing by running `bun run dev` in the terminal.
