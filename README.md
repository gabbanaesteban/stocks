# Node.js Challenge

## Description
This project is designed to implement my knowledge of back-end web technologies, specifically in Node.js, REST APIs, and decoupled services (microservices).

[Assignment](GUIDELINES.md)

## Requirements

- Docker
## Running Tests

Each API has its own instruction to be tested in a isolated way.
- [API Service](api-service#running-tests)
- [Stock Service](stock-service#running-tests)
## Usage/Examples

To start the project, just run:

```bash
cp ./api-service/.env.example ./api-service/.env
./up.sh
```

---
**NOTE**

There are two accounts to interact with the service.
- `superuser@jobsity.com`
- `user@jobsity.com`

Both of them have the same password: `test`.

After the service is up and running, you can find the documentation for each API @ `/api-docs`.
- [API Service Docs](http://localhost:3002/api-docs)
- [Stock Service Docs](http://localhost:3001/api-docs)

---
## Author

[Esteban De la Rosa](https://www.github.com/gabbanaesteban)
