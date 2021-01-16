# Twista-js
## OverView
A simple Twitter API liblary for Scriptable.

## Requirement
- [Scriptable](https://scriptable.app/)
- [CryptoJS](https://cryptojs.gitbook.io/docs/)
   - CryptoJS.HmacSHA1()
   - CryptoJS.enc.Base64.stringify()

## Usage
```JavaScript
// Ready
const Twista = importModule('Twista');
const tw = new TwistaJS(
  {
    CK: ConsumerKey,
    CS: ConsumerSecretKey,
    AT: AccessToken,
    AS: AccessTokenSecret
  },
  importModule('crypto-js')
);
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
### `.get(endpoint, param)`
`.get()` sends GET request to endpoint with parameter.

#### Argument
- `endpoint` ... REST API Endpoint.
   - It must end with .json.
- `param` ... Parameter for request body.
   - e.g.) `{screen_name: 'Twitter'}`

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

### `.upload_image(endpoint, image)`
`.upload_image()` uploads image.

#### Argument
- `endpoint` ... REST API Endpoint.
   - It must end with .json.
- `image` ... An `Image` Object
   - e.g.) `Photos.fromLibrary()`, `Image.fromFile()`

#### Return Value
It returns JSON.

## Author
- [Twitter](https://twitter.com/k_melodyline?s=21)

## License
[MIT License](/LICENSE)
