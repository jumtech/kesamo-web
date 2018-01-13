# kesamo
kesamo is the best web app for Morning Routine Management.

## How to use
Access https://app.kesamo.tech

## How to develop
### up local server
- `npm run start`

### watch to build
- `npm run watch`

### build
- `npm run build`

### deploy
- `mkdir ../config`
- `touch ../config_web.js`
- write FIREBASE_CONFIG like below in `config_web.js`

```js
const FIREBASE_CONFIG = {
  API_KEY: 'aaaaaa',
  AUTH_DOMAIN: 'example.firebaseapp.com',
  DATABASE_URL: 'https://example.firebaseio.com',
  PROJECT_ID: 'example',
  STORAGE_BUCKET: 'example.appspot.com',
  MESSAGING_SENDER_ID: '0000'
};

export { FIREBASE_CONFIG };
```

- `npm run deploy`