// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: blue; icon-glyph: feather-alt;

/*!
 * Twista-js
 *
 * Copyright (c) ©︎ 2021 Kynako
 *
 * This software is released under the MIT license.
 * see https://github.com/Kynako/Twista-js/blob/main/LICENSE
 */

class Twista {
  constructor(env, OAuth, CryptoJS){
    this.CK = env.CK,
    this.CS = env.CS,
    this.AT = env.AT,
    this.AS = env.AS,
    this.token = {
      key: this.AT,
      secret: this.AS
    },
    this.rest_base = "https://api.twitter.com/1.1/",
    this.media_base = "https://upload.twitter.com/1.1/",
    this.oauth = OAuth({
      consumer: {
        key: this.CK,
        secret: this.CS
      },
      signature_method: 'HMAC-SHA1',
      hash_function(base_string, key){
        return CryptoJS // dp;
          .HmacSHA1(base_string, key) // dp;
          .toString(CryptoJS.enc.Base64);
      } // dp;
    });
  };
  
  get(endpoint, param, basename='rest'){
    let base = this._chooseBaseUrl(basename);
    let url = base + endpoint + '?' + this._buildParamString(param);
    let req_data = {
      url: url,
      method: 'GET',
      data: {}
    };
    let r = new Request(req_data.url);
    r.method = req_data.method;
    r.headers = {...this._getAuthHeader(req_data)};
    return r.loadJSON();
  };
  
  post(endpoint, param, basename='rest'){
    let base = this._chooseBaseUrl(basename);
    let url = base + endpoint;
    let req_data = {
      url: url,
      method: 'POST',
      data: param
    };
    let r = new Request(req_data.url);
    r.method = req_data.method;
    r.headers = {...this._getAuthHeader(req_data)};
    r.body = this._buildParamString(param);
    return r.loadJSON();
  };

  async upload_image(endpoint, image, param){
    let req_data = {
      url: this.media_base + endpoint,
      method: 'POST',
      data: param
    };
    const r = new Request(req_data.url);
    r.method = req_data.method;
    r.headers = {
      "Content-Type": "multipart/form-data",
      ...this._getAuthHeader(req_data)
    };
    r.addImageToMultipart(image, "media");
    for (key in param){
      r.addParameterToMultipart(key, param[key])
    };
    return r.loadJSON();
  };
  
  _buildParamString(param){
    return Object.keys(param).sort().map((k)=>{
      return `${k}=${this._rfc3986(param[k])}`;
    }).join('&');
  };
  
  _chooseBaseUrl(name){
    let errorMessage = `_chooseBaseUrl(name) recieve something other than 'rest', 'media'.`;
    switch (name){
      case 'rest': return this.rest_base; break;
      case 'media': return this.media_base; break;
      default: console.error(errorMessage);
    };
  };
  
  _getAuthHeader(request_data){
    let auth_data = this.oauth.authorize(
      request_data, this.token
    );
    let authHeader = this.oauth.toHeader(auth_data);
    return authHeader;
  };
  // _rfc3986(str)
  // MDN Web Docs: encodeURIComponent()
  // https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent
  _rfc3986(str) {
    return encodeURIComponent(str).replace(/[!'()*]/g, function(c) {
      return '%' + c.charCodeAt(0).toString(16);
    });
  };
  
  _pjson(value){
    return JSON.stringify(value, null, 2);
  };
};

module.exports = Twista;
