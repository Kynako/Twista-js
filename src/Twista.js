// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: blue; icon-glyph: feather-alt;
/*!
 * Twista-js
 *
 * Copyright (c) 2021 Kynako
 *
 * This software is released under the MIT license.
 * see https://github.com/Kynako/Twista-js/blob/main/LICENSE
 */
class Twista {
  constructor(env){
    this.CK = env.CK || null;
    this.CS = env.CS || null;
    this.AT = env.AT || null;
    this.AS = env.AS || null;
    this.BT = env.BT || null;
    this.wv = new WebView();
    this.baseUrl = {
      rest: 'https://api.twitter.com/1.1/',
      media: 'https://upload.twitter.com/1.1/'
    };
  };
  
  async requestJson(method, endpoint, param, basename='rest'){
    const raw_url = this.baseUrl[basename] + endpoint;
    const req_url = method == 'GET'
      ? this.baseUrl[basename]
        + endpoint
        + '?'
        + this._buildParamString(param)
      : this.baseUrl[basename] + endpoint;
    let req_body = method == 'GET'
      ? null
      : this._buildParamString(param);
    const r = new Request(req_url);
    const authHeader = await this._getAuthHeader(
      method, raw_url, param
    );
    r.method = method.toUpperCase();
    r.headers = {
      ...authHeader,
      "Content-Type": "application/x-www-form-urlencoded"
    };
    r.body = req_body;
    const json = await r.loadJSON();
    return {
      json: json,
      response: r.response
    }; 
  };
    
  async uploadImage(image,  param={}){
    const req_url = this.baseUrl['media'] + 'media/upload.json';
    const r = new Request(req_url);
    r.method = 'POST';
    const authHeader = await this._getAuthHeader(
      'POST', req_url, param
    );
    r.headers = {
      "Content-Type": "multipart/form-data",
      ...authHeader
    };
    r.addImageToMultipart(image, "media");
    for (key in param){
      r.addParameterToMultipart(key, param[key])
    };
    return r.loadJSON();
  };

  _buildParamString(param){
    return Object.keys(param)
      .sort()
      .map(key=>{
        return this._rfc3986(key) + '=' + this._rfc3986(param[key]);
    }).join('&');
  };
  
  async _getAuthHeader(method, url, param){
    const oauthBaseParam = {
      oauth_consumer_key: this.CK,
      oauth_token: this.AT,
      oauth_nonce: await this._nonce(),
      oauth_timestamp: this._unix(),
      oauth_signature_method: 'HMAC-SHA1',
      oauth_version: '1.0'
    };
    const oauthParam = {
      ...param, ...oauthBaseParam
    };
    const signature = await this._generateSignature(
      method, url, oauthParam
    );
    const oauthParamWithSign = {
      ...oauthParam,
      ...{ oauth_signature: signature }
    };
    const authString = 'OAuth ' + Object.keys(oauthParamWithSign).sort().map(key=>{
      return this._rfc3986(key) + '=' + this._rfc3986(oauthParamWithSign[key]);
    }).join(', ');
    return {'Authorization': authString};
  };
  
  async _generateSignature(method, url, param){
    const signBaseKey = [
      this._rfc3986(this.CS),
      this._rfc3986(this.AS)
    ].join('&');
    const paramString = this._buildParamString(param);
    const signBaseData = [
      this._rfc3986(method),
      this._rfc3986(url),
      this._rfc3986(paramString)
    ].join('&');
    const signature = await this._hmacSha1(
      signBaseData,
      signBaseKey
    );
    return signature;
  };

  async _hmacSha1(base, key){
    const html = `
    <script>
      async function main(BASE, KEY, CALLBACK){
        const te = new TextEncoder('utf-8');
        const cryptoKey = await crypto.subtle.importKey(
          'raw',
          te.encode(KEY),
          {name: 'HMAC', hash: {name: 'SHA-1'}},
          false,
          ['sign']
        );
        const signature = await crypto.subtle.sign(
          'HMAC',
          cryptoKey,
          te.encode(BASE)
        );
        const buff = new Uint8Array(signature);
        const str = btoa(String.fromCharCode(...buff))
        return str;
      };
    </script>
    `;
    const js = `main('${base}', '${key}').then(completion); ''`;
    await this.wv.loadHTML(html);
    const result = await this.wv.evaluateJavaScript(js, true);
    return result;
  };
  // MDN Web Docs: encodeURIComponent()
  // https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent
  _rfc3986(str){
    return encodeURIComponent(str).replace(/[!'()*]/g, function(c) {
      return '%' + c.charCodeAt(0).toString(16);
    });
  };
  
  async _nonce(){
    const wv = new WebView();
    const n = await wv.evaluateJavaScript(`
	  const array = new Uint32Array(1);
	  crypto.getRandomValues(array);
	  completion(array[0]);
    `, true
    );
    return n.toString()
  };
  
  _unix(){
	const date = new Date();
	return Math.floor(date.getTime()/1000);
  };
};

module.exports = Twista;
