# Twista-js
## INPORTANT!
- This repository is moving to [Kynako/Scriptable](https://github.com/Kynako/Scriptable)
- This repository will be archived soon.

## OverView
A simple Twitter API library for Scriptable.

## Requirement
- [Scriptable](https://scriptable.app/)

## Usage
[Import Twista.scriptable](https://raw.githubusercontent.com/Kynako/Twista-js/main/src/Twista.scriptable)

### Ready
```JavaScript
const Twista = importModule('Twista');
// environmental variables
const ENV = {
  CK: ConsumerKey,
  CS: ConsumerSecretKey,
  AT: AccessToken,
  AS: AccessTokenSecret
};
// instance
const twista = new Twista(ENV);
```

### Get tweet
```JavaScript
const userData = await twista.requestJSON(
  'GET',
  'users/show.json',
  { screen_name: 'Twitter' }
);
console.log(userData);
```

### Post Tweet
```JavaScript
const postTweet = await twista.requestJson(
  'POST'
  'statuses/update.json',
  { status: 'Hello World!!' }
);
console.log(postTweet);
```

### Post Tweet (with Image)
```JavaScript
const image = await Photos.fromLibrary();
const res_upload = await twista.uploadImage(image);
const res_tweet = twista.requestJson(
  'POST',
  'statuses/update.json',
  {
    status: 'This is my best photo.', 
    media_ids: res_image.media_id_string
  }
);
console.log(res_tweet);
```

## Reference
### `twista.requestJson()`
`.requestJson()` sends request to endpoint with parameter.

### Syntax
```javascript
const res = twista.requestJson(
  method,
  endpoint,
  (param),
  (basename)
);
```
#### Argument
- `method` ... Request method.
- `endpoint` ... REST API Endpoint.
   - It must end with .json.
- `param` ... Parameter for request body.
   - e.g.) `{screen_name: 'Twitter'}`
- `basename` ... Option. Choose the base of url. Default is `rest`.
   - `rest` ... `https://api.twitter.com/1.1/`
   - `media` ... `https://upload.twitter.com/1.1/`

#### Return Value
It returns JSON.

---

### `twista.uploadImage()`
`.uploadImage()` uploads an image using `https://media.twitter.com/media/upload.json`.

#### Syntax
```javascript
const res_upload = await twista.uploadImage(
  image,
  (param)
);
```

#### Argument
- `image` ... An `Image` Object
   - e.g.) `Photos.fromLibrary()`, `Image.fromFile()`
- `param` ... Option.
#### Return Value
It returns JSON.

## License
[MIT License](LICENSE)
