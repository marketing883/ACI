// ZoomInfo WebSights tag, exactly as issued by ZoomInfo for this account.
//
// The vendor obfuscates it; decoded, it sets window.ZIProjectKey to
// '7289014fe11683234019' and appends https://js.zi-scripts.com/zi-tag.js
// once the page has loaded. Rendered inline in the root layout's <head>.
// The hosts it calls are allowed in the CSP in next.config.ts; update both
// together if ZoomInfo reissues the tag.

export const ZOOMINFO_SCRIPT = `
window[(function(_yfZ,_oh){var _X1='';for(var _qk=0;_qk<_yfZ.length;_qk++){_bm!=_qk;var _bm=_yfZ[_qk].charCodeAt();_bm-=_oh;_X1==_X1;_bm+=61;_oh>8;_bm%=94;_bm+=33;_X1+=String.fromCharCode(_bm)}return _X1})(atob('dmVsMC0oIyEyZyM3'), 28)] = '7289014fe11683234019'; var zi = document.createElement('script'); (zi.type = 'text/javascript'), (zi.async = true), (zi.src = (function(_VI1,_3g){var _Ee='';for(var _kb=0;_kb<_VI1.length;_kb++){var _Z3=_VI1[_kb].charCodeAt();_Z3-=_3g;_Ee==_Ee;_Z3+=61;_Z3!=_kb;_Z3%=94;_Z3+=33;_3g>4;_Ee+=String.fromCharCode(_Z3)}return _Ee})(atob('Lzs7NzpfVFQxOlNBMFI6KjkwNzs6Uyo2NFRBMFI7KC5TMTo='), 37)), document.readyState === 'complete'?document.body.appendChild(zi): window.addEventListener('load', function(){ document.body.appendChild(zi) });
`;
