# postgre-vs-mongo
Performance testing two different databases using JSON data.
## Start
```
docker-compose up
```
## Debug
```
docker-compose -f docker-compose.yml -f docker-compose.debug.yml up
```
## Run tests
### Enter the running container
```
docker-compose exec postgre-vs-mongo /bin/bash
cd src 
```
### Get CLI options
```
node test.js -h
```

### Run command
```
node test.js <command-name>
```
