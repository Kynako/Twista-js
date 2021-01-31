# Twista-js
## OverView
A simple Twitter API liblary for Scriptable.

## Requirement
- [Scriptable](https://scriptable.app/)
- [unpkg.js](https://gist.github.com/ZicklePop/603b19dd3b9e09f99030bc24e616ca6c)
- [CryptoJS](https://cryptojs.gitbook.io/docs/)
   - CryptoJS.HmacSHA1()
   - CryptoJS.enc.Base64.stringify()
- [oauth-1.0a.js](https://github.com/ddo/oauth-1.0a)

## Usage
### Initarize
```
// Example Directly Tree
iCloud/Scriptbale
└ modules
  ├ Twista.js
  ├ unpkg.js
  ├ (crypto-js)
  │ └ (crypto-js.js)
  └ (oauth-1.0a)
    └ (oauth-1.0a.js)
// crypto-js and oauth-1.0a will be saved on next step.
```

### Ready
```JavaScript
// libraries
const unpkg = importModule('modules/unpkg');
const OAuth = await unpkg('oauth-1.0a');
const CryptoJS = await unpkg('crypto-js');
const Twista = importModule('modules/Twista');
// environmental variables
const ENV = {
  CK: ConsumerKey,
  CS: ConsumerSecretKey,
  AT: AccessToken,
  AS: AccessTokenSecret
};
// instance
const tw = new Twista(ENV, OAuth, CryptoJS);
```

### Get tweet
```JavaScript
const userData = await tw.get(
  'users/show.json',
  { screen_name: 'Twitter' }
);
console.log(userData);
```

### Post Tweet
```JavaScript
const postTweet = await tw.post(
  'statuses/update.json',
  { status: 'Hello World!!' }
);
console.log(postTweet);
```

### Post Tweet (with Image)
```JavaScript
const image = await Photos.fromLibrary();
const res_image = await tw.upload_image(
  'media/upload.json',
  image
);
const res_tweet = tw.post(
  'statuses/update.json',
  {
    status: 'This is my best photo.', 
    media_ids: res_image.media_id_string
  }
);
console.log(res_tweet);
```

## Reference
### `.get(endpoint, param, basename)`
`.get()` sends GET request to endpoint with parameter.

#### Argument
- `endpoint` ... REST API Endpoint.
   - It must end with .json.
- `param` ... Parameter for request body.
   - e.g.) `{screen_name: 'Twitter'}`
- `basename` ... choose the base of url.
   - `rest` ... `https://api.twitter.com/1.1/`
   - `media` ... `https://upload.twitter.com/1.1/`

#### Return Value
It returns JSON.

---

### `.post(endpoint, param)`
`.post()` sends POST request to endpoint with parameters.

#### Argument
- `endpoint` ... REST API Endpoint.
   - It must end with .json.
- `param` ... Parameter for request body.
   - e.g.) `{status: 'Hello World!!'}`
 
#### Return Value
It refurns JSON.

---

### `.upload_image(endpoint, image, patam)`
`.upload_image()` uploads image.

#### Argument
- `endpoint` ... REST API Endpoint.
   - It must end with .json.
- `image` ... An `Image` Object
   - e.g.) `Photos.fromLibrary()`, `Image.fromFile()`
- `param` ...
#### Return Value
It returns JSON.

## Author
- [Twitter](https://twitter.com/k_melodyline?s=21)

## License
[MIT License](/LICENSE)
