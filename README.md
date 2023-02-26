# Employee management system
## set up
* node version 18.12.1
* npm version 9.2.0
### Client - Terminal A
```
$ cd client
$ npm install
$ npm run serve
```
### Server - Terminal B
You should define an environment variable called "payplus_jwpPrivateKey" and give it as a secret key value, for example:
```
$ payplus_jwpPrivateKey=mySecureKey
```
```
$ cd server
$ npm install
$ npm start
```
