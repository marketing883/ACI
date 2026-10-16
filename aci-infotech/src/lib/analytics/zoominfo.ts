// ZoomInfo WebSights tag, gated on marketing consent.
//
// ZoomInfo identifies the visitor's company and sets tracking cookies, so
// it must not run until the visitor opts in to marketing cookies: "Accept
// All" on the cookie banner, or Marketing switched on under Manage
// preferences. The banner stores that choice in localStorage under
// aci_cookie_consent and fires `cookie-consent-updated` when it is saved.
//
// So the gate (1) loads the tag on parse for a returning visitor whose
// stored, unexpired consent includes marketing, and otherwise (2) waits
// for the banner event and loads it only if that choice grants marketing.
// Reject / essential-only never loads it. The tag runs at most once.
//
// ZOOMINFO_TAG is the vendor snippet exactly as issued. Decoded, it sets
// window.ZIProjectKey to '7289014fe11683234019' and appends
// https://js.zi-scripts.com/zi-tag.js once the page has loaded. The hosts
// it calls are allowed in the CSP in next.config.ts; update both together
// if ZoomInfo reissues the tag.

const ZOOMINFO_TAG = `
window[(function(_yfZ,_oh){var _X1='';for(var _qk=0;_qk<_yfZ.length;_qk++){_bm!=_qk;var _bm=_yfZ[_qk].charCodeAt();_bm-=_oh;_X1==_X1;_bm+=61;_oh>8;_bm%=94;_bm+=33;_X1+=String.fromCharCode(_bm)}return _X1})(atob('dmVsMC0oIyEyZyM3'), 28)] = '7289014fe11683234019'; var zi = document.createElement('script'); (zi.type = 'text/javascript'), (zi.async = true), (zi.src = (function(_VI1,_3g){var _Ee='';for(var _kb=0;_kb<_VI1.length;_kb++){var _Z3=_VI1[_kb].charCodeAt();_Z3-=_3g;_Ee==_Ee;_Z3+=61;_Z3!=_kb;_Z3%=94;_Z3+=33;_3g>4;_Ee+=String.fromCharCode(_Z3)}return _Ee})(atob('Lzs7NzpfVFQxOlNBMFI6KjkwNzs6Uyo2NFRBMFI7KC5TMTo='), 37)), document.readyState === 'complete'?document.body.appendChild(zi): window.addEventListener('load', function(){ document.body.appendChild(zi) });
`;

export const ZOOMINFO_SCRIPT = `
(function(){
  var loaded = false;
  function loadZoomInfo(){
    if (loaded) return;
    loaded = true;
    ${ZOOMINFO_TAG}
  }
  function grantsMarketing(c){
    return !!(c && c.preferences && c.preferences.marketing === true &&
      (!c.expiry || new Date(c.expiry) > new Date()));
  }
  try {
    var stored = localStorage.getItem('aci_cookie_consent');
    if (stored && grantsMarketing(JSON.parse(stored))) { loadZoomInfo(); return; }
  } catch (e) {}
  window.addEventListener('cookie-consent-updated', function(ev){
    if (grantsMarketing(ev && ev.detail)) loadZoomInfo();
  });
})();
`;
