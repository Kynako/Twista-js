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

module.exports = class Twista {
  constructor(env, cryptojs){
    this.CK = env.CK,
    this.CS = env.CS,
    this.AT = env.AT,
    this.AS = env.AS,
    this.rest_base = "https://api.twitter.com/1.1/",
    this.media_base = "https://upload.twitter.com/1.1/",
    this.CryptoJS = cryptojs
  };
  
  // main methods
  async get(endpoint, param){
    return this._queryParamReq(
      "GET", endpoint, param
    );
  };
  
  async post(endpoint, param){
    return this._bodyParamReq(
      "POST", endpoint, param
    );
  };
  
  // .upload_image()
  async upload_image(endpoint, image){
    const opt = {
      method: "POST",
      url: this.media_base + endpoint,
      param: {}
    };
    const r = new Request(opt.url);
    r.method = opt.method;
    r.headers = {
      "Content-Type": "multipart/form-data",
      "Authorization": await this._getAuthHeader(opt)
    };
    r.addImageToMultipart(
      image, "media"
    );
    return r.loadJSON();
  }

  // ._bodyParamReq ... for POST, PUT, PATCH DELETE
  async _bodyParamReq(method, endpoint, param){
    const opt = {
      method: method,
      url: this.rest_base + endpoint,
      param: param
    };
    const r = new Request(opt.url);
    r.method = opt.method;
    r.headers = {
      "Content-Type": "application/x-www-form-urlencoded",
      "Authorization": await this._getAuthHeader(opt)
    };
    r.body = this._encodeBody(opt.param);
    return r.loadJSON();
  };
  
  // ._queryParamReq() ... for GET
  async _queryParamReq(method, endpoint, param){
    const opt = {
      method: method,
      url: this.rest_base + endpoint,
      param: param
    };
    const urlQ = opt.url + "?" + Object.keys(param).map((key)=>{
      return key + "=" + this._rfc3986(param[key]);
    }).join("&");
    const r = new Request(urlQ);
    r.method = opt.method;
    r.headers = {
      "Content-Type": "application/x-www-form-urlencoded",
      "Authorization": await this._getAuthHeader(opt)
    }
    return r.loadJSON();
  };
  
  // ._getAuthHeader(...)
  async _getAuthHeader(opt){
    const oauthBaseParam = {
      oauth_consumer_key: this.CK,
      oauth_token: this.AT,
      oauth_nonce: await this._nonce(),
      oauth_timestamp: this._unix(),
      oauth_signature_method: "HMAC-SHA1",
      oauth_version: "1.0"
    };
    const oauthParam = {
      ...opt.param,
      ...oauthBaseParam
    };
    const signature = await this._generateSignature(
      opt.method,
      opt.url,
      oauthParam,
      this.CS,
      this.AS
    );
    const oauthParamWithSign = {
      ...oauthParam,
      ...{ oauth_signature: signature }
    };
    return "OAuth " + Object.keys(oauthParamWithSign)
      .sort()
      .map((key)=>{
        return `${key}="${this._rfc3986(oauthParamWithSign[key])}"`;
      }).join(", ");
  };
  
  async _generateSignature(method, url, param, CS, AS){
    // debug
    /*
    [
      "## Signable argument ##",
      `method: ${method}`,
      `url: ${url}`,
      `param: ${JSON.stringify(param)}`,
      `CS: ${CS}`,
      `AS: ${AS}`,
      "## ----------------- ##"
    ].map((str)=>{console.log("  > "+str)});
    */
    // signBaseKey
    const signBaseKey = [
      this._rfc3986(CS),
      this._rfc3986(AS)
    ].join("&");
    //console.log(`signBaseKey: ${signBaseKey}`);
    // paramString
    const paramString = Object.keys(param).sort().map((key)=>{
      return this._rfc3986(key) + "=" + this._rfc3986(param[key]);
    }).join('&');
    // signBaseData
    const signBaseData = [
      method.toUpperCase(),
      this._rfc3986(url),
      this._rfc3986(paramString)
    ].join("&");
    //console.log(`signBaseData: ${signBaseData}`);
    const hash = this.CryptoJS.HmacSHA1(
      signBaseData,
      signBaseKey
    );
    return this.CryptoJS.enc.Base64.stringify(hash);
  }
  

  // encodeBody(param)
  _encodeBody(param){
    return Object.keys(param)
      .sort()
      .map((key)=>{
        return this._rfc3986(key) + "=" + this._rfc3986(param[key]);
      }).join("&");
  };

  // _rfc3986(str)
  // MDN Web Docs: encodeURIComponent()
  // https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent
  _rfc3986(str) {
    return encodeURIComponent(str).replace(/[!'()*]/g, function(c) {
      return '%' + c.charCodeAt(0).toString(16);
    });
  };
  
  // _nonce()
  async _nonce(){
    const wv = new WebView();
    wv.loadHTML("<html><head><meta charset='UTF-8'></head></html>");
    const n = await wv.evaluateJavaScript(`
	  const array = new Uint32Array(1);
	  crypto.getRandomValues(array);
	  completion(array[0]);
    `, true
    );
    return n.toString()
  };
  
  // _unix()
  _unix(){
	const date = new Date();
	return Math.floor(date.getTime()/1000);
  };
  
  // pjson()
  _pjson(obj){
    console.log(JSON.stringify(obj, null, 3));
  };
}
