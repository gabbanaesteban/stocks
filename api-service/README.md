# API Service


## Requirements

- Node >= 16.x
- Docker

## Installation

```bash
npm ci
```

## Running Tests

Spin up container

```bash
npm run db:test:up
npm run db:test:fresh
```

To run tests, run the following command

```bash
npm test
```

Teardown the container

```bash
npm run db:test:down
```

## Usage/Examples

In order to use the service, you need to spin up all the [services](../README.md).

## Author

[Esteban De la Rosa](https://www.github.com/gabbanaesteban)
