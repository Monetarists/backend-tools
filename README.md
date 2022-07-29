# Monetarist Backend Tools

<div style="text-align:center">

[![Node.js CI](https://github.com/Monetarists/backend-tools/actions/workflows/node.js.yml/badge.svg?branch=main)](https://github.com/filliph/monetarist/actions/workflows/node.js.yml)
[![Node.js CI [develop]](https://github.com/Monetarists/backend-tools/actions/workflows/node.js-develop.yml/badge.svg?branch=develop)](https://github.com/filliph/monetarist/actions/workflows/node.js-develop.yml)
</div>

Backend data for [Monetarist](https://monetarist.app). Uses item data from [XIVAPI](https://github.com/xivapi/ffxiv-datamining) and market data from [Universalis](https://universalis.app/).

## Game Data

You can update your game data from [XIVAPI](https://github.com/xivapi/ffxiv-datamining) to obtain the latest job, recipe and item information.

### Basic use
```
Usage: npm run update-game-data -- [-d ClassJob|Recipe|DataCenter|all]

Options:
      --help     Show help                                             [boolean]
      --version  Show version number                                   [boolean]
  -d, --data                                                    [default: "all"]
```

You can target specific data structures using the examples below.

### Updating only Recipe data

```
npm run update-game-data -- -d Recipe
```

### Updating Recipe and ClassJob data

```
npm run update-game-data -- -d Recipe -d ClassJob
```