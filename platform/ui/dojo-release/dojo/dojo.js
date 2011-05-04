/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/

/*
	This is an optimized version of Dojo, built for deployment and not for
	development. To get sources and documentation, please visit:

		http://dojotoolkit.org
*/

(function(){
var _1=null;
if((_1||(typeof djConfig!="undefined"&&djConfig.scopeMap))&&(typeof window!="undefined")){
var _2="",_3="",_4="",_5={},_6={};
_1=_1||djConfig.scopeMap;
for(var i=0;i<_1.length;i++){
var _7=_1[i];
_2+="var "+_7[0]+" = {}; "+_7[1]+" = "+_7[0]+";"+_7[1]+"._scopeName = '"+_7[1]+"';";
_3+=(i==0?"":",")+_7[0];
_4+=(i==0?"":",")+_7[1];
_5[_7[0]]=_7[1];
_6[_7[1]]=_7[0];
}
eval(_2+"dojo._scopeArgs = ["+_4+"];");
dojo._scopePrefixArgs=_3;
dojo._scopePrefix="(function("+_3+"){";
dojo._scopeSuffix="})("+_4+")";
dojo._scopeMap=_5;
dojo._scopeMapRev=_6;
}
(function(){
if(typeof this["loadFirebugConsole"]=="function"){
this["loadFirebugConsole"]();
}else{
this.console=this.console||{};
var cn=["assert","count","debug","dir","dirxml","error","group","groupEnd","info","profile","profileEnd","time","timeEnd","trace","warn","log"];
var i=0,tn;
while((tn=cn[i++])){
if(!console[tn]){
(function(){
var _8=tn+"";
console[_8]=("log" in console)?function(){
var a=Array.apply({},arguments);
a.unshift(_8+":");
console["log"](a.join(" "));
}:function(){
};
console[_8]._fake=true;
})();
}
}
}
if(typeof dojo=="undefined"){
dojo={_scopeName:"dojo",_scopePrefix:"",_scopePrefixArgs:"",_scopeSuffix:"",_scopeMap:{},_scopeMapRev:{}};
}
var d=dojo;
if(typeof dijit=="undefined"){
dijit={_scopeName:"dijit"};
}
if(typeof dojox=="undefined"){
dojox={_scopeName:"dojox"};
}
if(!d._scopeArgs){
d._scopeArgs=[dojo,dijit,dojox];
}
d.global=this;
d.config={isDebug:false,debugAtAllCosts:false};
var _9=typeof djConfig!="undefined"?djConfig:typeof dojoConfig!="undefined"?dojoConfig:null;
if(_9){
for(var c in _9){
d.config[c]=_9[c];
}
}
dojo.locale=d.config.locale;
var _a="$Rev: 23917 $".match(/\d+/);
dojo.version={major:0,minor:0,patch:0,flag:"dev",revision:_a?+_a[0]:NaN,toString:function(){
with(d.version){
return major+"."+minor+"."+patch+flag+" ("+revision+")";
}
}};
if(typeof OpenAjax!="undefined"){
OpenAjax.hub.registerLibrary(dojo._scopeName,"http://dojotoolkit.org",d.version.toString());
}
var _b,_c,_d={};
for(var i in {toString:1}){
_b=[];
break;
}
dojo._extraNames=_b=_b||["hasOwnProperty","valueOf","isPrototypeOf","propertyIsEnumerable","toLocaleString","toString","constructor"];
_c=_b.length;
dojo._mixin=function(_e,_f){
var _10,s,i;
for(_10 in _f){
s=_f[_10];
if(!(_10 in _e)||(_e[_10]!==s&&(!(_10 in _d)||_d[_10]!==s))){
_e[_10]=s;
}
}
if(_c&&_f){
for(i=0;i<_c;++i){
_10=_b[i];
s=_f[_10];
if(!(_10 in _e)||(_e[_10]!==s&&(!(_10 in _d)||_d[_10]!==s))){
_e[_10]=s;
}
}
}
return _e;
};
dojo.mixin=function(obj,_11){
if(!obj){
obj={};
}
for(var i=1,l=arguments.length;i<l;i++){
d._mixin(obj,arguments[i]);
}
return obj;
};
dojo._getProp=function(_12,_13,_14){
var obj=_14||d.global;
for(var i=0,p;obj&&(p=_12[i]);i++){
if(i==0&&d._scopeMap[p]){
p=d._scopeMap[p];
}
obj=(p in obj?obj[p]:(_13?obj[p]={}:undefined));
}
return obj;
};
dojo.setObject=function(_15,_16,_17){
var _18=_15.split("."),p=_18.pop(),obj=d._getProp(_18,true,_17);
return obj&&p?(obj[p]=_16):undefined;
};
dojo.getObject=function(_19,_1a,_1b){
return d._getProp(_19.split("."),_1a,_1b);
};
dojo.exists=function(_1c,obj){
return d.getObject(_1c,false,obj)!==undefined;
};
dojo["eval"]=function(_1d){
return d.global.eval?d.global.eval(_1d):eval(_1d);
};
d.deprecated=d.experimental=function(){
};
})();
(function(){
var d=dojo,_1e;
d.mixin(d,{_loadedModules:{},_inFlightCount:0,_hasResource:{},_modulePrefixes:{dojo:{name:"dojo",value:"."},doh:{name:"doh",value:"../util/doh"},tests:{name:"tests",value:"tests"}},_moduleHasPrefix:function(_1f){
var mp=d._modulePrefixes;
return !!(mp[_1f]&&mp[_1f].value);
},_getModulePrefix:function(_20){
var mp=d._modulePrefixes;
if(d._moduleHasPrefix(_20)){
return mp[_20].value;
}
return _20;
},_loadedUrls:[],_postLoad:false,_loaders:[],_unloaders:[],_loadNotifying:false});
dojo._loadPath=function(_21,_22,cb){
var uri=((_21.charAt(0)=="/"||_21.match(/^\w+:/))?"":d.baseUrl)+_21;
try{
_1e=_22;
return !_22?d._loadUri(uri,cb):d._loadUriAndCheck(uri,_22,cb);
}
catch(e){
console.error(e);
return false;
}
finally{
_1e=null;
}
};
dojo._loadUri=function(uri,cb){
if(d._loadedUrls[uri]){
return true;
}
d._inFlightCount++;
var _23=d._getText(uri,true);
if(_23){
d._loadedUrls[uri]=true;
d._loadedUrls.push(uri);
if(cb){
_23=/^define\(/.test(_23)?_23:"("+_23+")";
}else{
_23=d._scopePrefix+_23+d._scopeSuffix;
}
if(!d.isIE){
_23+="\r\n//@ sourceURL="+uri;
}
var _24=d["eval"](_23);
if(cb){
cb(_24);
}
}
if(--d._inFlightCount==0&&d._postLoad&&d._loaders.length){
setTimeout(function(){
if(d._inFlightCount==0){
d._callLoaded();
}
},0);
}
return !!_23;
};
dojo._loadUriAndCheck=function(uri,_25,cb){
var ok=false;
try{
ok=d._loadUri(uri,cb);
}
catch(e){
console.error("failed loading "+uri+" with error: "+e);
}
return !!(ok&&d._loadedModules[_25]);
};
dojo.loaded=function(){
d._loadNotifying=true;
d._postLoad=true;
var mll=d._loaders;
d._loaders=[];
for(var x=0;x<mll.length;x++){
mll[x]();
}
d._loadNotifying=false;
if(d._postLoad&&d._inFlightCount==0&&mll.length){
d._callLoaded();
}
};
dojo.unloaded=function(){
var mll=d._unloaders;
while(mll.length){
(mll.pop())();
}
};
d._onto=function(arr,obj,fn){
if(!fn){
arr.push(obj);
}else{
if(fn){
var _26=(typeof fn=="string")?obj[fn]:fn;
arr.push(function(){
_26.call(obj);
});
}
}
};
dojo.ready=dojo.addOnLoad=function(obj,_27){
d._onto(d._loaders,obj,_27);
if(d._postLoad&&d._inFlightCount==0&&!d._loadNotifying){
d._callLoaded();
}
};
var dca=d.config.addOnLoad;
if(dca){
d.addOnLoad[(dca instanceof Array?"apply":"call")](d,dca);
}
dojo._modulesLoaded=function(){
if(d._postLoad){
return;
}
if(d._inFlightCount>0){
console.warn("files still in flight!");
return;
}
d._callLoaded();
};
dojo._callLoaded=function(){
if(typeof setTimeout=="object"||(d.config.useXDomain&&d.isOpera)){
setTimeout(d.isAIR?function(){
d.loaded();
}:d._scopeName+".loaded();",0);
}else{
d.loaded();
}
};
dojo._getModuleSymbols=function(_28){
var _29=_28.split(".");
for(var i=_29.length;i>0;i--){
var _2a=_29.slice(0,i).join(".");
if(i==1&&!d._moduleHasPrefix(_2a)){
_29[0]="../"+_29[0];
}else{
var _2b=d._getModulePrefix(_2a);
if(_2b!=_2a){
_29.splice(0,i,_2b);
break;
}
}
}
return _29;
};
dojo._global_omit_module_check=false;
dojo.loadInit=function(_2c){
_2c();
};
dojo._loadModule=dojo.require=function(_2d,_2e){
_2e=d._global_omit_module_check||_2e;
var _2f=d._loadedModules[_2d];
if(_2f){
return _2f;
}
var _30=d._getModuleSymbols(_2d).join("/")+".js";
var _31=!_2e?_2d:null;
var ok=d._loadPath(_30,_31);
if(!ok&&!_2e){
throw new Error("Could not load '"+_2d+"'; last tried '"+_30+"'");
}
if(!_2e&&!d._isXDomain){
_2f=d._loadedModules[_2d];
if(!_2f){
throw new Error("symbol '"+_2d+"' is not defined after loading '"+_30+"'");
}
}
return _2f;
};
dojo.provide=function(_32){
_32=_32+"";
return (d._loadedModules[_32]=d.getObject(_32,true));
};
dojo.platformRequire=function(_33){
var _34=_33.common||[];
var _35=_34.concat(_33[d._name]||_33["default"]||[]);
for(var x=0;x<_35.length;x++){
var _36=_35[x];
if(_36.constructor==Array){
d._loadModule.apply(d,_36);
}else{
d._loadModule(_36);
}
}
};
dojo.requireIf=function(_37,_38){
if(_37===true){
var _39=[];
for(var i=1;i<arguments.length;i++){
_39.push(arguments[i]);
}
d.require.apply(d,_39);
}
};
dojo.requireAfterIf=d.requireIf;
dojo.registerModulePath=function(_3a,_3b){
d._modulePrefixes[_3a]={name:_3a,value:_3b};
};
dojo.requireLocalization=function(_3c,_3d,_3e,_3f){
d.require("dojo.i18n");
d.i18n._requireLocalization.apply(d.hostenv,arguments);
};
var ore=new RegExp("^(([^:/?#]+):)?(//([^/?#]*))?([^?#]*)(\\?([^#]*))?(#(.*))?$"),ire=new RegExp("^((([^\\[:]+):)?([^@]+)@)?(\\[([^\\]]+)\\]|([^\\[:]*))(:([0-9]+))?$");
dojo._Url=function(){
var n=null,_40=arguments,uri=[_40[0]];
for(var i=1;i<_40.length;i++){
if(!_40[i]){
continue;
}
var _41=new d._Url(_40[i]+""),_42=new d._Url(uri[0]+"");
if(_41.path==""&&!_41.scheme&&!_41.authority&&!_41.query){
if(_41.fragment!=n){
_42.fragment=_41.fragment;
}
_41=_42;
}else{
if(!_41.scheme){
_41.scheme=_42.scheme;
if(!_41.authority){
_41.authority=_42.authority;
if(_41.path.charAt(0)!="/"){
var _43=_42.path.substring(0,_42.path.lastIndexOf("/")+1)+_41.path;
var _44=_43.split("/");
for(var j=0;j<_44.length;j++){
if(_44[j]=="."){
if(j==_44.length-1){
_44[j]="";
}else{
_44.splice(j,1);
j--;
}
}else{
if(j>0&&!(j==1&&_44[0]=="")&&_44[j]==".."&&_44[j-1]!=".."){
if(j==(_44.length-1)){
_44.splice(j,1);
_44[j-1]="";
}else{
_44.splice(j-1,2);
j-=2;
}
}
}
}
_41.path=_44.join("/");
}
}
}
}
uri=[];
if(_41.scheme){
uri.push(_41.scheme,":");
}
if(_41.authority){
uri.push("//",_41.authority);
}
uri.push(_41.path);
if(_41.query){
uri.push("?",_41.query);
}
if(_41.fragment){
uri.push("#",_41.fragment);
}
}
this.uri=uri.join("");
var r=this.uri.match(ore);
this.scheme=r[2]||(r[1]?"":n);
this.authority=r[4]||(r[3]?"":n);
this.path=r[5];
this.query=r[7]||(r[6]?"":n);
this.fragment=r[9]||(r[8]?"":n);
if(this.authority!=n){
r=this.authority.match(ire);
this.user=r[3]||n;
this.password=r[4]||n;
this.host=r[6]||r[7];
this.port=r[9]||n;
}
};
dojo._Url.prototype.toString=function(){
return this.uri;
};
dojo.moduleUrl=function(_45,url){
var loc=d._getModuleSymbols(_45).join("/");
if(!loc){
return null;
}
if(loc.lastIndexOf("/")!=loc.length-1){
loc+="/";
}
var _46=loc.indexOf(":");
if(loc.charAt(0)!="/"&&(_46==-1||_46>loc.indexOf("/"))){
loc=d.baseUrl+loc;
}
return new d._Url(loc,url);
};
})();
if(typeof window!="undefined"){
dojo.isBrowser=true;
dojo._name="browser";
(function(){
var d=dojo;
if(document&&document.getElementsByTagName){
var _47=document.getElementsByTagName("script");
var _48=/dojo(\.xd)?\.js(\W|$)/i;
for(var i=0;i<_47.length;i++){
var src=_47[i].getAttribute("src");
if(!src){
continue;
}
var m=src.match(_48);
if(m){
if(!d.config.baseUrl){
d.config.baseUrl=src.substring(0,m.index);
}
var cfg=(_47[i].getAttribute("djConfig")||_47[i].getAttribute("data-dojo-config"));
if(cfg){
var _49=eval("({ "+cfg+" })");
for(var x in _49){
dojo.config[x]=_49[x];
}
}
break;
}
}
}
d.baseUrl=d.config.baseUrl;
var n=navigator;
var dua=n.userAgent,dav=n.appVersion,tv=parseFloat(dav);
if(dua.indexOf("Opera")>=0){
d.isOpera=tv;
}
if(dua.indexOf("AdobeAIR")>=0){
d.isAIR=1;
}
d.isKhtml=(dav.indexOf("Konqueror")>=0)?tv:0;
d.isWebKit=parseFloat(dua.split("WebKit/")[1])||undefined;
d.isChrome=parseFloat(dua.split("Chrome/")[1])||undefined;
d.isMac=dav.indexOf("Macintosh")>=0;
var _4a=Math.max(dav.indexOf("WebKit"),dav.indexOf("Safari"),0);
if(_4a&&!dojo.isChrome){
d.isSafari=parseFloat(dav.split("Version/")[1]);
if(!d.isSafari||parseFloat(dav.substr(_4a+7))<=419.3){
d.isSafari=2;
}
}
if(dua.indexOf("Gecko")>=0&&!d.isKhtml&&!d.isWebKit){
d.isMozilla=d.isMoz=tv;
}
if(d.isMoz){
d.isFF=parseFloat(dua.split("Firefox/")[1]||dua.split("Minefield/")[1])||undefined;
}
if(document.all&&!d.isOpera){
d.isIE=parseFloat(dav.split("MSIE ")[1])||undefined;
var _4b=document.documentMode;
if(_4b&&_4b!=5&&Math.floor(d.isIE)!=_4b){
d.isIE=_4b;
}
}
if(dojo.isIE&&window.location.protocol==="file:"){
dojo.config.ieForceActiveXXhr=true;
}
d.isQuirks=document.compatMode=="BackCompat";
d.locale=dojo.config.locale||(d.isIE?n.userLanguage:n.language).toLowerCase();
d._XMLHTTP_PROGIDS=["Msxml2.XMLHTTP","Microsoft.XMLHTTP","Msxml2.XMLHTTP.4.0"];
d._xhrObj=function(){
var _4c,_4d;
if(!dojo.isIE||!dojo.config.ieForceActiveXXhr){
try{
_4c=new XMLHttpRequest();
}
catch(e){
}
}
if(!_4c){
for(var i=0;i<3;++i){
var _4e=d._XMLHTTP_PROGIDS[i];
try{
_4c=new ActiveXObject(_4e);
}
catch(e){
_4d=e;
}
if(_4c){
d._XMLHTTP_PROGIDS=[_4e];
break;
}
}
}
if(!_4c){
throw new Error("XMLHTTP not available: "+_4d);
}
return _4c;
};
d._isDocumentOk=function(_4f){
var _50=_4f.status||0;
return (_50>=200&&_50<300)||_50==304||_50==1223||!_50;
};
var _51=window.location+"";
var _52=document.getElementsByTagName("base");
var _53=(_52&&_52.length>0);
d._getText=function(uri,_54){
var _55=d._xhrObj();
if(!_53&&dojo._Url){
uri=(new dojo._Url(_51,uri)).toString();
}
if(d.config.cacheBust){
uri+="";
uri+=(uri.indexOf("?")==-1?"?":"&")+String(d.config.cacheBust).replace(/\W+/g,"");
}
_55.open("GET",uri,false);
try{
_55.send(null);
if(!d._isDocumentOk(_55)){
var err=Error("Unable to load "+uri+" status:"+_55.status);
err.status=_55.status;
err.responseText=_55.responseText;
throw err;
}
}
catch(e){
if(_54){
return null;
}
throw e;
}
return _55.responseText;
};
var _56=window;
var _57=function(_58,fp){
var _59=_56.attachEvent||_56.addEventListener;
_58=_56.attachEvent?_58:_58.substring(2);
_59(_58,function(){
fp.apply(_56,arguments);
},false);
};
d._windowUnloaders=[];
d.windowUnloaded=function(){
var mll=d._windowUnloaders;
while(mll.length){
(mll.pop())();
}
d=null;
};
var _5a=0;
d.addOnWindowUnload=function(obj,_5b){
d._onto(d._windowUnloaders,obj,_5b);
if(!_5a){
_5a=1;
_57("onunload",d.windowUnloaded);
}
};
var _5c=0;
d.addOnUnload=function(obj,_5d){
d._onto(d._unloaders,obj,_5d);
if(!_5c){
_5c=1;
_57("onbeforeunload",dojo.unloaded);
}
};
})();
dojo._initFired=false;
dojo._loadInit=function(e){
if(dojo._scrollIntervalId){
clearInterval(dojo._scrollIntervalId);
dojo._scrollIntervalId=0;
}
if(!dojo._initFired){
dojo._initFired=true;
if(!dojo.config.afterOnLoad&&window.detachEvent){
window.detachEvent("onload",dojo._loadInit);
}
if(dojo._inFlightCount==0){
dojo._modulesLoaded();
}
}
};
if(!dojo.config.afterOnLoad){
if(document.addEventListener){
document.addEventListener("DOMContentLoaded",dojo._loadInit,false);
window.addEventListener("load",dojo._loadInit,false);
}else{
if(window.attachEvent){
window.attachEvent("onload",dojo._loadInit);
if(!dojo.config.skipIeDomLoaded&&self===self.top){
dojo._scrollIntervalId=setInterval(function(){
try{
if(document.body){
document.documentElement.doScroll("left");
dojo._loadInit();
}
}
catch(e){
}
},30);
}
}
}
}
if(dojo.isIE){
try{
(function(){
document.namespaces.add("v","urn:schemas-microsoft-com:vml");
var _5e=["*","group","roundrect","oval","shape","rect","imagedata","path","textpath","text"],i=0,l=1,s=document.createStyleSheet();
if(dojo.isIE>=8){
i=1;
l=_5e.length;
}
for(;i<l;++i){
s.addRule("v\\:"+_5e[i],"behavior:url(#default#VML); display:inline-block");
}
})();
}
catch(e){
}
}
}
(function(){
var mp=dojo.config["modulePaths"];
if(mp){
for(var _5f in mp){
dojo.registerModulePath(_5f,mp[_5f]);
}
}
})();
if(dojo.config.isDebug){
dojo.require("dojo._firebug.firebug");
}
if(dojo.config.debugAtAllCosts){
dojo.require("dojo._base._loader.loader_debug");
dojo.require("dojo.i18n");
}
if(!dojo._hasResource["dojo._base.lang"]){
dojo._hasResource["dojo._base.lang"]=true;
dojo.provide("dojo._base.lang");
(function(){
var d=dojo,_60=Object.prototype.toString;
dojo.isString=function(it){
return (typeof it=="string"||it instanceof String);
};
dojo.isArray=function(it){
return it&&(it instanceof Array||typeof it=="array");
};
dojo.isFunction=function(it){
return _60.call(it)==="[object Function]";
};
dojo.isObject=function(it){
return it!==undefined&&(it===null||typeof it=="object"||d.isArray(it)||d.isFunction(it));
};
dojo.isArrayLike=function(it){
return it&&it!==undefined&&!d.isString(it)&&!d.isFunction(it)&&!(it.tagName&&it.tagName.toLowerCase()=="form")&&(d.isArray(it)||isFinite(it.length));
};
dojo.isAlien=function(it){
return it&&!d.isFunction(it)&&/\{\s*\[native code\]\s*\}/.test(String(it));
};
dojo.extend=function(_61,_62){
for(var i=1,l=arguments.length;i<l;i++){
d._mixin(_61.prototype,arguments[i]);
}
return _61;
};
dojo._hitchArgs=function(_63,_64){
var pre=d._toArray(arguments,2);
var _65=d.isString(_64);
return function(){
var _66=d._toArray(arguments);
var f=_65?(_63||d.global)[_64]:_64;
return f&&f.apply(_63||this,pre.concat(_66));
};
};
dojo.hitch=function(_67,_68){
if(arguments.length>2){
return d._hitchArgs.apply(d,arguments);
}
if(!_68){
_68=_67;
_67=null;
}
if(d.isString(_68)){
_67=_67||d.global;
if(!_67[_68]){
throw (["dojo.hitch: scope[\"",_68,"\"] is null (scope=\"",_67,"\")"].join(""));
}
return function(){
return _67[_68].apply(_67,arguments||[]);
};
}
return !_67?_68:function(){
return _68.apply(_67,arguments||[]);
};
};
dojo.delegate=dojo._delegate=(function(){
function TMP(){
};
return function(obj,_69){
TMP.prototype=obj;
var tmp=new TMP();
TMP.prototype=null;
if(_69){
d._mixin(tmp,_69);
}
return tmp;
};
})();
var _6a=function(obj,_6b,_6c){
return (_6c||[]).concat(Array.prototype.slice.call(obj,_6b||0));
};
var _6d=function(obj,_6e,_6f){
var arr=_6f||[];
for(var x=_6e||0;x<obj.length;x++){
arr.push(obj[x]);
}
return arr;
};
dojo._toArray=d.isIE?function(obj){
return ((obj.item)?_6d:_6a).apply(this,arguments);
}:_6a;
dojo.partial=function(_70){
var arr=[null];
return d.hitch.apply(d,arr.concat(d._toArray(arguments)));
};
var _71=d._extraNames,_72=_71.length,_73={};
dojo.clone=function(o){
if(!o||typeof o!="object"||d.isFunction(o)){
return o;
}
if(o.nodeType&&"cloneNode" in o){
return o.cloneNode(true);
}
if(o instanceof Date){
return new Date(o.getTime());
}
if(o instanceof RegExp){
return new RegExp(o);
}
var r,i,l,s,_74;
if(d.isArray(o)){
r=[];
for(i=0,l=o.length;i<l;++i){
if(i in o){
r.push(d.clone(o[i]));
}
}
}else{
r=o.constructor?new o.constructor():{};
}
for(_74 in o){
s=o[_74];
if(!(_74 in r)||(r[_74]!==s&&(!(_74 in _73)||_73[_74]!==s))){
r[_74]=d.clone(s);
}
}
if(_72){
for(i=0;i<_72;++i){
_74=_71[i];
s=o[_74];
if(!(_74 in r)||(r[_74]!==s&&(!(_74 in _73)||_73[_74]!==s))){
r[_74]=s;
}
}
}
return r;
};
dojo.trim=String.prototype.trim?function(str){
return str.trim();
}:function(str){
return str.replace(/^\s\s*/,"").replace(/\s\s*$/,"");
};
var _75=/\{([^\}]+)\}/g;
dojo.replace=function(_76,map,_77){
return _76.replace(_77||_75,d.isFunction(map)?map:function(_78,k){
return d.getObject(k,false,map);
});
};
})();
}
if(!dojo._hasResource["dojo._base.array"]){
dojo._hasResource["dojo._base.array"]=true;
dojo.provide("dojo._base.array");
(function(){
var _79=function(arr,obj,cb){
return [(typeof arr=="string")?arr.split(""):arr,obj||dojo.global,(typeof cb=="string")?new Function("item","index","array",cb):cb];
};
var _7a=function(_7b,arr,_7c,_7d){
var _7e=_79(arr,_7d,_7c);
arr=_7e[0];
for(var i=0,l=arr.length;i<l;++i){
var _7f=!!_7e[2].call(_7e[1],arr[i],i,arr);
if(_7b^_7f){
return _7f;
}
}
return _7b;
};
dojo.mixin(dojo,{indexOf:function(_80,_81,_82,_83){
var _84=1,end=_80.length||0,i=0;
if(_83){
i=end-1;
_84=end=-1;
}
if(_82!=undefined){
i=_82;
}
if((_83&&i>end)||i<end){
for(;i!=end;i+=_84){
if(_80[i]==_81){
return i;
}
}
}
return -1;
},lastIndexOf:function(_85,_86,_87){
return dojo.indexOf(_85,_86,_87,true);
},forEach:function(arr,_88,_89){
if(!arr||!arr.length){
return;
}
var _8a=_79(arr,_89,_88);
arr=_8a[0];
for(var i=0,l=arr.length;i<l;++i){
_8a[2].call(_8a[1],arr[i],i,arr);
}
},every:function(arr,_8b,_8c){
return _7a(true,arr,_8b,_8c);
},some:function(arr,_8d,_8e){
return _7a(false,arr,_8d,_8e);
},map:function(arr,_8f,_90){
var _91=_79(arr,_90,_8f);
arr=_91[0];
var _92=(arguments[3]?(new arguments[3]()):[]);
for(var i=0,l=arr.length;i<l;++i){
_92.push(_91[2].call(_91[1],arr[i],i,arr));
}
return _92;
},filter:function(arr,_93,_94){
var _95=_79(arr,_94,_93);
arr=_95[0];
var _96=[];
for(var i=0,l=arr.length;i<l;++i){
if(_95[2].call(_95[1],arr[i],i,arr)){
_96.push(arr[i]);
}
}
return _96;
}});
})();
}
if(!dojo._hasResource["dojo._base.declare"]){
dojo._hasResource["dojo._base.declare"]=true;
dojo.provide("dojo._base.declare");
(function(){
var d=dojo,mix=d._mixin,op=Object.prototype,_97=op.toString,_98=new Function,_99=0,_9a="constructor";
function err(msg,cls){
throw new Error("declare"+(cls?" "+cls:"")+": "+msg);
};
function _9b(_9c,_9d){
var _9e=[],_9f=[{cls:0,refs:[]}],_a0={},_a1=1,l=_9c.length,i=0,j,lin,_a2,top,_a3,rec,_a4,_a5;
for(;i<l;++i){
_a2=_9c[i];
if(!_a2){
err("mixin #"+i+" is unknown. Did you use dojo.require to pull it in?",_9d);
}else{
if(_97.call(_a2)!="[object Function]"){
err("mixin #"+i+" is not a callable constructor.",_9d);
}
}
lin=_a2._meta?_a2._meta.bases:[_a2];
top=0;
for(j=lin.length-1;j>=0;--j){
_a3=lin[j].prototype;
if(!_a3.hasOwnProperty("declaredClass")){
_a3.declaredClass="uniqName_"+(_99++);
}
_a4=_a3.declaredClass;
if(!_a0.hasOwnProperty(_a4)){
_a0[_a4]={count:0,refs:[],cls:lin[j]};
++_a1;
}
rec=_a0[_a4];
if(top&&top!==rec){
rec.refs.push(top);
++top.count;
}
top=rec;
}
++top.count;
_9f[0].refs.push(top);
}
while(_9f.length){
top=_9f.pop();
_9e.push(top.cls);
--_a1;
while(_a5=top.refs,_a5.length==1){
top=_a5[0];
if(!top||--top.count){
top=0;
break;
}
_9e.push(top.cls);
--_a1;
}
if(top){
for(i=0,l=_a5.length;i<l;++i){
top=_a5[i];
if(!--top.count){
_9f.push(top);
}
}
}
}
if(_a1){
err("can't build consistent linearization",_9d);
}
_a2=_9c[0];
_9e[0]=_a2?_a2._meta&&_a2===_9e[_9e.length-_a2._meta.bases.length]?_a2._meta.bases.length:1:0;
return _9e;
};
function _a6(_a7,a,f){
var _a8,_a9,_aa,_ab,_ac,_ad,_ae,opf,pos,_af=this._inherited=this._inherited||{};
if(typeof _a7=="string"){
_a8=_a7;
_a7=a;
a=f;
}
f=0;
_ab=_a7.callee;
_a8=_a8||_ab.nom;
if(!_a8){
err("can't deduce a name to call inherited()",this.declaredClass);
}
_ac=this.constructor._meta;
_aa=_ac.bases;
pos=_af.p;
if(_a8!=_9a){
if(_af.c!==_ab){
pos=0;
_ad=_aa[0];
_ac=_ad._meta;
if(_ac.hidden[_a8]!==_ab){
_a9=_ac.chains;
if(_a9&&typeof _a9[_a8]=="string"){
err("calling chained method with inherited: "+_a8,this.declaredClass);
}
do{
_ac=_ad._meta;
_ae=_ad.prototype;
if(_ac&&(_ae[_a8]===_ab&&_ae.hasOwnProperty(_a8)||_ac.hidden[_a8]===_ab)){
break;
}
}while(_ad=_aa[++pos]);
pos=_ad?pos:-1;
}
}
_ad=_aa[++pos];
if(_ad){
_ae=_ad.prototype;
if(_ad._meta&&_ae.hasOwnProperty(_a8)){
f=_ae[_a8];
}else{
opf=op[_a8];
do{
_ae=_ad.prototype;
f=_ae[_a8];
if(f&&(_ad._meta?_ae.hasOwnProperty(_a8):f!==opf)){
break;
}
}while(_ad=_aa[++pos]);
}
}
f=_ad&&f||op[_a8];
}else{
if(_af.c!==_ab){
pos=0;
_ac=_aa[0]._meta;
if(_ac&&_ac.ctor!==_ab){
_a9=_ac.chains;
if(!_a9||_a9.constructor!=="manual"){
err("calling chained constructor with inherited",this.declaredClass);
}
while(_ad=_aa[++pos]){
_ac=_ad._meta;
if(_ac&&_ac.ctor===_ab){
break;
}
}
pos=_ad?pos:-1;
}
}
while(_ad=_aa[++pos]){
_ac=_ad._meta;
f=_ac?_ac.ctor:_ad;
if(f){
break;
}
}
f=_ad&&f;
}
_af.c=f;
_af.p=pos;
if(f){
return a===true?f:f.apply(this,a||_a7);
}
};
function _b0(_b1,_b2){
if(typeof _b1=="string"){
return this.inherited(_b1,_b2,true);
}
return this.inherited(_b1,true);
};
function _b3(cls){
var _b4=this.constructor._meta.bases;
for(var i=0,l=_b4.length;i<l;++i){
if(_b4[i]===cls){
return true;
}
}
return this instanceof cls;
};
function _b5(_b6,_b7){
var _b8,i=0,l=d._extraNames.length;
for(_b8 in _b7){
if(_b8!=_9a&&_b7.hasOwnProperty(_b8)){
_b6[_b8]=_b7[_b8];
}
}
for(;i<l;++i){
_b8=d._extraNames[i];
if(_b8!=_9a&&_b7.hasOwnProperty(_b8)){
_b6[_b8]=_b7[_b8];
}
}
};
function _b9(_ba,_bb){
var _bc,t,i=0,l=d._extraNames.length;
for(_bc in _bb){
t=_bb[_bc];
if((t!==op[_bc]||!(_bc in op))&&_bc!=_9a){
if(_97.call(t)=="[object Function]"){
t.nom=_bc;
}
_ba[_bc]=t;
}
}
for(;i<l;++i){
_bc=d._extraNames[i];
t=_bb[_bc];
if((t!==op[_bc]||!(_bc in op))&&_bc!=_9a){
if(_97.call(t)=="[object Function]"){
t.nom=_bc;
}
_ba[_bc]=t;
}
}
return _ba;
};
function _bd(_be){
_b9(this.prototype,_be);
return this;
};
function _bf(_c0,_c1){
return function(){
var a=arguments,_c2=a,a0=a[0],f,i,m,l=_c0.length,_c3;
if(!(this instanceof a.callee)){
return _c4(a);
}
if(_c1&&(a0&&a0.preamble||this.preamble)){
_c3=new Array(_c0.length);
_c3[0]=a;
for(i=0;;){
a0=a[0];
if(a0){
f=a0.preamble;
if(f){
a=f.apply(this,a)||a;
}
}
f=_c0[i].prototype;
f=f.hasOwnProperty("preamble")&&f.preamble;
if(f){
a=f.apply(this,a)||a;
}
if(++i==l){
break;
}
_c3[i]=a;
}
}
for(i=l-1;i>=0;--i){
f=_c0[i];
m=f._meta;
f=m?m.ctor:f;
if(f){
f.apply(this,_c3?_c3[i]:a);
}
}
f=this.postscript;
if(f){
f.apply(this,_c2);
}
};
};
function _c5(_c6,_c7){
return function(){
var a=arguments,t=a,a0=a[0],f;
if(!(this instanceof a.callee)){
return _c4(a);
}
if(_c7){
if(a0){
f=a0.preamble;
if(f){
t=f.apply(this,t)||t;
}
}
f=this.preamble;
if(f){
f.apply(this,t);
}
}
if(_c6){
_c6.apply(this,a);
}
f=this.postscript;
if(f){
f.apply(this,a);
}
};
};
function _c8(_c9){
return function(){
var a=arguments,i=0,f,m;
if(!(this instanceof a.callee)){
return _c4(a);
}
for(;f=_c9[i];++i){
m=f._meta;
f=m?m.ctor:f;
if(f){
f.apply(this,a);
break;
}
}
f=this.postscript;
if(f){
f.apply(this,a);
}
};
};
function _ca(_cb,_cc,_cd){
return function(){
var b,m,f,i=0,_ce=1;
if(_cd){
i=_cc.length-1;
_ce=-1;
}
for(;b=_cc[i];i+=_ce){
m=b._meta;
f=(m?m.hidden:b.prototype)[_cb];
if(f){
f.apply(this,arguments);
}
}
};
};
function _cf(_d0){
_98.prototype=_d0.prototype;
var t=new _98;
_98.prototype=null;
return t;
};
function _c4(_d1){
var _d2=_d1.callee,t=_cf(_d2);
_d2.apply(t,_d1);
return t;
};
d.declare=function(_d3,_d4,_d5){
if(typeof _d3!="string"){
_d5=_d4;
_d4=_d3;
_d3="";
}
_d5=_d5||{};
var _d6,i,t,_d7,_d8,_d9,_da,_db=1,_dc=_d4;
if(_97.call(_d4)=="[object Array]"){
_d9=_9b(_d4,_d3);
t=_d9[0];
_db=_d9.length-t;
_d4=_d9[_db];
}else{
_d9=[0];
if(_d4){
if(_97.call(_d4)=="[object Function]"){
t=_d4._meta;
_d9=_d9.concat(t?t.bases:_d4);
}else{
err("base class is not a callable constructor.",_d3);
}
}else{
if(_d4!==null){
err("unknown base class. Did you use dojo.require to pull it in?",_d3);
}
}
}
if(_d4){
for(i=_db-1;;--i){
_d6=_cf(_d4);
if(!i){
break;
}
t=_d9[i];
(t._meta?_b5:mix)(_d6,t.prototype);
_d7=new Function;
_d7.superclass=_d4;
_d7.prototype=_d6;
_d4=_d6.constructor=_d7;
}
}else{
_d6={};
}
_b9(_d6,_d5);
t=_d5.constructor;
if(t!==op.constructor){
t.nom=_9a;
_d6.constructor=t;
}
for(i=_db-1;i;--i){
t=_d9[i]._meta;
if(t&&t.chains){
_da=mix(_da||{},t.chains);
}
}
if(_d6["-chains-"]){
_da=mix(_da||{},_d6["-chains-"]);
}
t=!_da||!_da.hasOwnProperty(_9a);
_d9[0]=_d7=(_da&&_da.constructor==="manual")?_c8(_d9):(_d9.length==1?_c5(_d5.constructor,t):_bf(_d9,t));
_d7._meta={bases:_d9,hidden:_d5,chains:_da,parents:_dc,ctor:_d5.constructor};
_d7.superclass=_d4&&_d4.prototype;
_d7.extend=_bd;
_d7.prototype=_d6;
_d6.constructor=_d7;
_d6.getInherited=_b0;
_d6.inherited=_a6;
_d6.isInstanceOf=_b3;
if(_d3){
_d6.declaredClass=_d3;
d.setObject(_d3,_d7);
}
if(_da){
for(_d8 in _da){
if(_d6[_d8]&&typeof _da[_d8]=="string"&&_d8!=_9a){
t=_d6[_d8]=_ca(_d8,_d9,_da[_d8]==="after");
t.nom=_d8;
}
}
}
return _d7;
};
d.safeMixin=_b9;
})();
}
if(!dojo._hasResource["dojo._base.connect"]){
dojo._hasResource["dojo._base.connect"]=true;
dojo.provide("dojo._base.connect");
dojo._listener={getDispatcher:function(){
return function(){
var ap=Array.prototype,c=arguments.callee,ls=c._listeners,t=c.target,r=t&&t.apply(this,arguments),i,lls=[].concat(ls);
for(i in lls){
if(!(i in ap)){
lls[i].apply(this,arguments);
}
}
return r;
};
},add:function(_dd,_de,_df){
_dd=_dd||dojo.global;
var f=_dd[_de];
if(!f||!f._listeners){
var d=dojo._listener.getDispatcher();
d.target=f;
d._listeners=[];
f=_dd[_de]=d;
}
return f._listeners.push(_df);
},remove:function(_e0,_e1,_e2){
var f=(_e0||dojo.global)[_e1];
if(f&&f._listeners&&_e2--){
delete f._listeners[_e2];
}
}};
dojo.connect=function(obj,_e3,_e4,_e5,_e6){
var a=arguments,_e7=[],i=0;
_e7.push(dojo.isString(a[0])?null:a[i++],a[i++]);
var a1=a[i+1];
_e7.push(dojo.isString(a1)||dojo.isFunction(a1)?a[i++]:null,a[i++]);
for(var l=a.length;i<l;i++){
_e7.push(a[i]);
}
return dojo._connect.apply(this,_e7);
};
dojo._connect=function(obj,_e8,_e9,_ea){
var l=dojo._listener,h=l.add(obj,_e8,dojo.hitch(_e9,_ea));
return [obj,_e8,h,l];
};
dojo.disconnect=function(_eb){
if(_eb&&_eb[0]!==undefined){
dojo._disconnect.apply(this,_eb);
delete _eb[0];
}
};
dojo._disconnect=function(obj,_ec,_ed,_ee){
_ee.remove(obj,_ec,_ed);
};
dojo._topics={};
dojo.subscribe=function(_ef,_f0,_f1){
return [_ef,dojo._listener.add(dojo._topics,_ef,dojo.hitch(_f0,_f1))];
};
dojo.unsubscribe=function(_f2){
if(_f2){
dojo._listener.remove(dojo._topics,_f2[0],_f2[1]);
}
};
dojo.publish=function(_f3,_f4){
var f=dojo._topics[_f3];
if(f){
f.apply(this,_f4||[]);
}
};
dojo.connectPublisher=function(_f5,obj,_f6){
var pf=function(){
dojo.publish(_f5,arguments);
};
return _f6?dojo.connect(obj,_f6,pf):dojo.connect(obj,pf);
};
}
if(!dojo._hasResource["dojo._base.Deferred"]){
dojo._hasResource["dojo._base.Deferred"]=true;
dojo.provide("dojo._base.Deferred");
(function(){
var _f7=function(){
};
var _f8=Object.freeze||function(){
};
dojo.Deferred=function(_f9){
var _fa,_fb,_fc,_fd,_fe;
var _ff=(this.promise={});
function _100(_101){
if(_fb){
throw new Error("This deferred has already been resolved");
}
_fa=_101;
_fb=true;
_102();
};
function _102(){
var _103;
while(!_103&&_fe){
var _104=_fe;
_fe=_fe.next;
if((_103=(_104.progress==_f7))){
_fb=false;
}
var func=(_fc?_104.error:_104.resolved);
if(func){
try{
var _105=func(_fa);
if(_105&&typeof _105.then==="function"){
_105.then(dojo.hitch(_104.deferred,"resolve"),dojo.hitch(_104.deferred,"reject"));
continue;
}
var _106=_103&&_105===undefined;
if(_103&&!_106){
_fc=_105 instanceof Error;
}
_104.deferred[_106&&_fc?"reject":"resolve"](_106?_fa:_105);
}
catch(e){
_104.deferred.reject(e);
}
}else{
if(_fc){
_104.deferred.reject(_fa);
}else{
_104.deferred.resolve(_fa);
}
}
}
};
this.resolve=this.callback=function(_107){
this.fired=0;
this.results=[_107,null];
_100(_107);
};
this.reject=this.errback=function(_108){
_fc=true;
this.fired=1;
_100(_108);
this.results=[null,_108];
if(!_108||_108.log!==false){
(dojo.config.deferredOnError||function(x){
console.error(x);
})(_108);
}
};
this.progress=function(_109){
var _10a=_fe;
while(_10a){
var _10b=_10a.progress;
_10b&&_10b(_109);
_10a=_10a.next;
}
};
this.addCallbacks=function(_10c,_10d){
this.then(_10c,_10d,_f7);
return this;
};
this.then=_ff.then=function(_10e,_10f,_110){
var _111=_110==_f7?this:new dojo.Deferred(_ff.cancel);
var _112={resolved:_10e,error:_10f,progress:_110,deferred:_111};
if(_fe){
_fd=_fd.next=_112;
}else{
_fe=_fd=_112;
}
if(_fb){
_102();
}
return _111.promise;
};
var _113=this;
this.cancel=_ff.cancel=function(){
if(!_fb){
var _114=_f9&&_f9(_113);
if(!_fb){
if(!(_114 instanceof Error)){
_114=new Error(_114);
}
_114.log=false;
_113.reject(_114);
}
}
};
_f8(_ff);
};
dojo.extend(dojo.Deferred,{addCallback:function(_115){
return this.addCallbacks(dojo.hitch.apply(dojo,arguments));
},addErrback:function(_116){
return this.addCallbacks(null,dojo.hitch.apply(dojo,arguments));
},addBoth:function(_117){
var _118=dojo.hitch.apply(dojo,arguments);
return this.addCallbacks(_118,_118);
},fired:-1});
})();
dojo.when=function(_119,_11a,_11b,_11c){
if(_119&&typeof _119.then==="function"){
return _119.then(_11a,_11b,_11c);
}
return _11a(_119);
};
}
if(!dojo._hasResource["dojo._base.json"]){
dojo._hasResource["dojo._base.json"]=true;
dojo.provide("dojo._base.json");
dojo.fromJson=function(json){
return eval("("+json+")");
};
dojo._escapeString=function(str){
return ("\""+str.replace(/(["\\])/g,"\\$1")+"\"").replace(/[\f]/g,"\\f").replace(/[\b]/g,"\\b").replace(/[\n]/g,"\\n").replace(/[\t]/g,"\\t").replace(/[\r]/g,"\\r");
};
dojo.toJsonIndentStr="\t";
dojo.toJson=function(it,_11d,_11e){
if(it===undefined){
return "undefined";
}
var _11f=typeof it;
if(_11f=="number"||_11f=="boolean"){
return it+"";
}
if(it===null){
return "null";
}
if(dojo.isString(it)){
return dojo._escapeString(it);
}
var _120=arguments.callee;
var _121;
_11e=_11e||"";
var _122=_11d?_11e+dojo.toJsonIndentStr:"";
var tf=it.__json__||it.json;
if(dojo.isFunction(tf)){
_121=tf.call(it);
if(it!==_121){
return _120(_121,_11d,_122);
}
}
if(it.nodeType&&it.cloneNode){
throw new Error("Can't serialize DOM nodes");
}
var sep=_11d?" ":"";
var _123=_11d?"\n":"";
if(dojo.isArray(it)){
var res=dojo.map(it,function(obj){
var val=_120(obj,_11d,_122);
if(typeof val!="string"){
val="undefined";
}
return _123+_122+val;
});
return "["+res.join(","+sep)+_123+_11e+"]";
}
if(_11f=="function"){
return null;
}
var _124=[],key;
for(key in it){
var _125,val;
if(typeof key=="number"){
_125="\""+key+"\"";
}else{
if(typeof key=="string"){
_125=dojo._escapeString(key);
}else{
continue;
}
}
val=_120(it[key],_11d,_122);
if(typeof val!="string"){
continue;
}
_124.push(_123+_122+_125+":"+sep+val);
}
return "{"+_124.join(","+sep)+_123+_11e+"}";
};
}
if(!dojo._hasResource["dojo._base.Color"]){
dojo._hasResource["dojo._base.Color"]=true;
dojo.provide("dojo._base.Color");
(function(){
var d=dojo;
dojo.Color=function(_126){
if(_126){
this.setColor(_126);
}
};
dojo.Color.named={black:[0,0,0],silver:[192,192,192],gray:[128,128,128],white:[255,255,255],maroon:[128,0,0],red:[255,0,0],purple:[128,0,128],fuchsia:[255,0,255],green:[0,128,0],lime:[0,255,0],olive:[128,128,0],yellow:[255,255,0],navy:[0,0,128],blue:[0,0,255],teal:[0,128,128],aqua:[0,255,255],transparent:d.config.transparentColor||[255,255,255]};
dojo.extend(dojo.Color,{r:255,g:255,b:255,a:1,_set:function(r,g,b,a){
var t=this;
t.r=r;
t.g=g;
t.b=b;
t.a=a;
},setColor:function(_127){
if(d.isString(_127)){
d.colorFromString(_127,this);
}else{
if(d.isArray(_127)){
d.colorFromArray(_127,this);
}else{
this._set(_127.r,_127.g,_127.b,_127.a);
if(!(_127 instanceof d.Color)){
this.sanitize();
}
}
}
return this;
},sanitize:function(){
return this;
},toRgb:function(){
var t=this;
return [t.r,t.g,t.b];
},toRgba:function(){
var t=this;
return [t.r,t.g,t.b,t.a];
},toHex:function(){
var arr=d.map(["r","g","b"],function(x){
var s=this[x].toString(16);
return s.length<2?"0"+s:s;
},this);
return "#"+arr.join("");
},toCss:function(_128){
var t=this,rgb=t.r+", "+t.g+", "+t.b;
return (_128?"rgba("+rgb+", "+t.a:"rgb("+rgb)+")";
},toString:function(){
return this.toCss(true);
}});
dojo.blendColors=function(_129,end,_12a,obj){
var t=obj||new d.Color();
d.forEach(["r","g","b","a"],function(x){
t[x]=_129[x]+(end[x]-_129[x])*_12a;
if(x!="a"){
t[x]=Math.round(t[x]);
}
});
return t.sanitize();
};
dojo.colorFromRgb=function(_12b,obj){
var m=_12b.toLowerCase().match(/^rgba?\(([\s\.,0-9]+)\)/);
return m&&dojo.colorFromArray(m[1].split(/\s*,\s*/),obj);
};
dojo.colorFromHex=function(_12c,obj){
var t=obj||new d.Color(),bits=(_12c.length==4)?4:8,mask=(1<<bits)-1;
_12c=Number("0x"+_12c.substr(1));
if(isNaN(_12c)){
return null;
}
d.forEach(["b","g","r"],function(x){
var c=_12c&mask;
_12c>>=bits;
t[x]=bits==4?17*c:c;
});
t.a=1;
return t;
};
dojo.colorFromArray=function(a,obj){
var t=obj||new d.Color();
t._set(Number(a[0]),Number(a[1]),Number(a[2]),Number(a[3]));
if(isNaN(t.a)){
t.a=1;
}
return t.sanitize();
};
dojo.colorFromString=function(str,obj){
var a=d.Color.named[str];
return a&&d.colorFromArray(a,obj)||d.colorFromRgb(str,obj)||d.colorFromHex(str,obj);
};
})();
}
if(!dojo._hasResource["dojo._base.window"]){
dojo._hasResource["dojo._base.window"]=true;
dojo.provide("dojo._base.window");
dojo.doc=window["document"]||null;
dojo.body=function(){
return dojo.doc.body||dojo.doc.getElementsByTagName("body")[0];
};
dojo.setContext=function(_12d,_12e){
dojo.global=_12d;
dojo.doc=_12e;
};
dojo.withGlobal=function(_12f,_130,_131,_132){
var _133=dojo.global;
try{
dojo.global=_12f;
return dojo.withDoc.call(null,_12f.document,_130,_131,_132);
}
finally{
dojo.global=_133;
}
};
dojo.withDoc=function(_134,_135,_136,_137){
var _138=dojo.doc,_139=dojo._bodyLtr,oldQ=dojo.isQuirks;
try{
dojo.doc=_134;
delete dojo._bodyLtr;
dojo.isQuirks=dojo.doc.compatMode=="BackCompat";
if(_136&&typeof _135=="string"){
_135=_136[_135];
}
return _135.apply(_136,_137||[]);
}
finally{
dojo.doc=_138;
delete dojo._bodyLtr;
if(_139!==undefined){
dojo._bodyLtr=_139;
}
dojo.isQuirks=oldQ;
}
};
}
if(!dojo._hasResource["dojo._base.event"]){
dojo._hasResource["dojo._base.event"]=true;
dojo.provide("dojo._base.event");
(function(){
var del=(dojo._event_listener={add:function(node,name,fp){
if(!node){
return;
}
name=del._normalizeEventName(name);
fp=del._fixCallback(name,fp);
var _13a=name;
if(!dojo.isIE&&(name=="mouseenter"||name=="mouseleave")){
var ofp=fp;
name=(name=="mouseenter")?"mouseover":"mouseout";
fp=function(e){
if(!dojo.isDescendant(e.relatedTarget,node)){
return ofp.call(this,e);
}
};
}
node.addEventListener(name,fp,false);
return fp;
},remove:function(node,_13b,_13c){
if(node){
_13b=del._normalizeEventName(_13b);
if(!dojo.isIE&&(_13b=="mouseenter"||_13b=="mouseleave")){
_13b=(_13b=="mouseenter")?"mouseover":"mouseout";
}
node.removeEventListener(_13b,_13c,false);
}
},_normalizeEventName:function(name){
return name.slice(0,2)=="on"?name.slice(2):name;
},_fixCallback:function(name,fp){
return name!="keypress"?fp:function(e){
return fp.call(this,del._fixEvent(e,this));
};
},_fixEvent:function(evt,_13d){
switch(evt.type){
case "keypress":
del._setKeyChar(evt);
break;
}
return evt;
},_setKeyChar:function(evt){
evt.keyChar=evt.charCode?String.fromCharCode(evt.charCode):"";
evt.charOrCode=evt.keyChar||evt.keyCode;
},_punctMap:{106:42,111:47,186:59,187:43,188:44,189:45,190:46,191:47,192:96,219:91,220:92,221:93,222:39}});
dojo.fixEvent=function(evt,_13e){
return del._fixEvent(evt,_13e);
};
dojo.stopEvent=function(evt){
evt.preventDefault();
evt.stopPropagation();
};
var _13f=dojo._listener;
dojo._connect=function(obj,_140,_141,_142,_143){
var _144=obj&&(obj.nodeType||obj.attachEvent||obj.addEventListener);
var lid=_144?(_143?2:1):0,l=[dojo._listener,del,_13f][lid];
var h=l.add(obj,_140,dojo.hitch(_141,_142));
return [obj,_140,h,lid];
};
dojo._disconnect=function(obj,_145,_146,_147){
([dojo._listener,del,_13f][_147]).remove(obj,_145,_146);
};
dojo.keys={BACKSPACE:8,TAB:9,CLEAR:12,ENTER:13,SHIFT:16,CTRL:17,ALT:18,META:dojo.isSafari?91:224,PAUSE:19,CAPS_LOCK:20,ESCAPE:27,SPACE:32,PAGE_UP:33,PAGE_DOWN:34,END:35,HOME:36,LEFT_ARROW:37,UP_ARROW:38,RIGHT_ARROW:39,DOWN_ARROW:40,INSERT:45,DELETE:46,HELP:47,LEFT_WINDOW:91,RIGHT_WINDOW:92,SELECT:93,NUMPAD_0:96,NUMPAD_1:97,NUMPAD_2:98,NUMPAD_3:99,NUMPAD_4:100,NUMPAD_5:101,NUMPAD_6:102,NUMPAD_7:103,NUMPAD_8:104,NUMPAD_9:105,NUMPAD_MULTIPLY:106,NUMPAD_PLUS:107,NUMPAD_ENTER:108,NUMPAD_MINUS:109,NUMPAD_PERIOD:110,NUMPAD_DIVIDE:111,F1:112,F2:113,F3:114,F4:115,F5:116,F6:117,F7:118,F8:119,F9:120,F10:121,F11:122,F12:123,F13:124,F14:125,F15:126,NUM_LOCK:144,SCROLL_LOCK:145,copyKey:dojo.isMac&&!dojo.isAIR?(dojo.isSafari?91:224):17};
var _148=dojo.isMac?"metaKey":"ctrlKey";
dojo.isCopyKey=function(e){
return e[_148];
};
if(dojo.isIE<9||(dojo.isIE&&dojo.isQuirks)){
dojo.mouseButtons={LEFT:1,MIDDLE:4,RIGHT:2,isButton:function(e,_149){
return e.button&_149;
},isLeft:function(e){
return e.button&1;
},isMiddle:function(e){
return e.button&4;
},isRight:function(e){
return e.button&2;
}};
}else{
dojo.mouseButtons={LEFT:0,MIDDLE:1,RIGHT:2,isButton:function(e,_14a){
return e.button==_14a;
},isLeft:function(e){
return e.button==0;
},isMiddle:function(e){
return e.button==1;
},isRight:function(e){
return e.button==2;
}};
}
if(dojo.isIE){
var _14b=function(e,code){
try{
return (e.keyCode=code);
}
catch(e){
return 0;
}
};
var iel=dojo._listener;
var _14c=(dojo._ieListenersName="_"+dojo._scopeName+"_listeners");
if(!dojo.config._allow_leaks){
_13f=iel=dojo._ie_listener={handlers:[],add:function(_14d,_14e,_14f){
_14d=_14d||dojo.global;
var f=_14d[_14e];
if(!f||!f[_14c]){
var d=dojo._getIeDispatcher();
d.target=f&&(ieh.push(f)-1);
d[_14c]=[];
f=_14d[_14e]=d;
}
return f[_14c].push(ieh.push(_14f)-1);
},remove:function(_150,_151,_152){
var f=(_150||dojo.global)[_151],l=f&&f[_14c];
if(f&&l&&_152--){
delete ieh[l[_152]];
delete l[_152];
}
}};
var ieh=iel.handlers;
}
dojo.mixin(del,{add:function(node,_153,fp){
if(!node){
return;
}
_153=del._normalizeEventName(_153);
if(_153=="onkeypress"){
var kd=node.onkeydown;
if(!kd||!kd[_14c]||!kd._stealthKeydownHandle){
var h=del.add(node,"onkeydown",del._stealthKeyDown);
kd=node.onkeydown;
kd._stealthKeydownHandle=h;
kd._stealthKeydownRefs=1;
}else{
kd._stealthKeydownRefs++;
}
}
return iel.add(node,_153,del._fixCallback(fp));
},remove:function(node,_154,_155){
_154=del._normalizeEventName(_154);
iel.remove(node,_154,_155);
if(_154=="onkeypress"){
var kd=node.onkeydown;
if(--kd._stealthKeydownRefs<=0){
iel.remove(node,"onkeydown",kd._stealthKeydownHandle);
delete kd._stealthKeydownHandle;
}
}
},_normalizeEventName:function(_156){
return _156.slice(0,2)!="on"?"on"+_156:_156;
},_nop:function(){
},_fixEvent:function(evt,_157){
if(!evt){
var w=_157&&(_157.ownerDocument||_157.document||_157).parentWindow||window;
evt=w.event;
}
if(!evt){
return (evt);
}
evt.target=evt.srcElement;
evt.currentTarget=(_157||evt.srcElement);
evt.layerX=evt.offsetX;
evt.layerY=evt.offsetY;
var se=evt.srcElement,doc=(se&&se.ownerDocument)||document;
var _158=((dojo.isIE<6)||(doc["compatMode"]=="BackCompat"))?doc.body:doc.documentElement;
var _159=dojo._getIeDocumentElementOffset();
evt.pageX=evt.clientX+dojo._fixIeBiDiScrollLeft(_158.scrollLeft||0)-_159.x;
evt.pageY=evt.clientY+(_158.scrollTop||0)-_159.y;
if(evt.type=="mouseover"){
evt.relatedTarget=evt.fromElement;
}
if(evt.type=="mouseout"){
evt.relatedTarget=evt.toElement;
}
if(dojo.isIE<9||dojo.isQuirks){
evt.stopPropagation=del._stopPropagation;
evt.preventDefault=del._preventDefault;
}
return del._fixKeys(evt);
},_fixKeys:function(evt){
switch(evt.type){
case "keypress":
var c=("charCode" in evt?evt.charCode:evt.keyCode);
if(c==10){
c=0;
evt.keyCode=13;
}else{
if(c==13||c==27){
c=0;
}else{
if(c==3){
c=99;
}
}
}
evt.charCode=c;
del._setKeyChar(evt);
break;
}
return evt;
},_stealthKeyDown:function(evt){
var kp=evt.currentTarget.onkeypress;
if(!kp||!kp[_14c]){
return;
}
var k=evt.keyCode;
var _15a=k!=13&&k!=32&&k!=27&&(k<48||k>90)&&(k<96||k>111)&&(k<186||k>192)&&(k<219||k>222);
if(_15a||evt.ctrlKey){
var c=_15a?0:k;
if(evt.ctrlKey){
if(k==3||k==13){
return;
}else{
if(c>95&&c<106){
c-=48;
}else{
if((!evt.shiftKey)&&(c>=65&&c<=90)){
c+=32;
}else{
c=del._punctMap[c]||c;
}
}
}
}
var faux=del._synthesizeEvent(evt,{type:"keypress",faux:true,charCode:c});
kp.call(evt.currentTarget,faux);
evt.cancelBubble=faux.cancelBubble;
evt.returnValue=faux.returnValue;
_14b(evt,faux.keyCode);
}
},_stopPropagation:function(){
this.cancelBubble=true;
},_preventDefault:function(){
this.bubbledKeyCode=this.keyCode;
if(this.ctrlKey){
_14b(this,0);
}
this.returnValue=false;
}});
dojo.stopEvent=(dojo.isIE<9||dojo.isQuirks)?function(evt){
evt=evt||window.event;
del._stopPropagation.call(evt);
del._preventDefault.call(evt);
}:dojo.stopEvent;
}
del._synthesizeEvent=function(evt,_15b){
var faux=dojo.mixin({},evt,_15b);
del._setKeyChar(faux);
faux.preventDefault=function(){
evt.preventDefault();
};
faux.stopPropagation=function(){
evt.stopPropagation();
};
return faux;
};
if(dojo.isOpera){
dojo.mixin(del,{_fixEvent:function(evt,_15c){
switch(evt.type){
case "keypress":
var c=evt.which;
if(c==3){
c=99;
}
c=c<41&&!evt.shiftKey?0:c;
if(evt.ctrlKey&&!evt.shiftKey&&c>=65&&c<=90){
c+=32;
}
return del._synthesizeEvent(evt,{charCode:c});
}
return evt;
}});
}
if(dojo.isWebKit){
del._add=del.add;
del._remove=del.remove;
dojo.mixin(del,{add:function(node,_15d,fp){
if(!node){
return;
}
var _15e=del._add(node,_15d,fp);
if(del._normalizeEventName(_15d)=="keypress"){
_15e._stealthKeyDownHandle=del._add(node,"keydown",function(evt){
var k=evt.keyCode;
var _15f=k!=13&&k!=32&&(k<48||k>90)&&(k<96||k>111)&&(k<186||k>192)&&(k<219||k>222);
if(_15f||evt.ctrlKey){
var c=_15f?0:k;
if(evt.ctrlKey){
if(k==3||k==13){
return;
}else{
if(c>95&&c<106){
c-=48;
}else{
if(!evt.shiftKey&&c>=65&&c<=90){
c+=32;
}else{
c=del._punctMap[c]||c;
}
}
}
}
var faux=del._synthesizeEvent(evt,{type:"keypress",faux:true,charCode:c});
fp.call(evt.currentTarget,faux);
}
});
}
return _15e;
},remove:function(node,_160,_161){
if(node){
if(_161._stealthKeyDownHandle){
del._remove(node,"keydown",_161._stealthKeyDownHandle);
}
del._remove(node,_160,_161);
}
},_fixEvent:function(evt,_162){
switch(evt.type){
case "keypress":
if(evt.faux){
return evt;
}
var c=evt.charCode;
c=c>=32?c:0;
return del._synthesizeEvent(evt,{charCode:c,faux:true});
}
return evt;
}});
}
})();
if(dojo.isIE){
dojo._ieDispatcher=function(args,_163){
var ap=Array.prototype,h=dojo._ie_listener.handlers,c=args.callee,ls=c[dojo._ieListenersName],t=h[c.target];
var r=t&&t.apply(_163,args);
var lls=[].concat(ls);
for(var i in lls){
var f=h[lls[i]];
if(!(i in ap)&&f){
f.apply(_163,args);
}
}
return r;
};
dojo._getIeDispatcher=function(){
return new Function(dojo._scopeName+"._ieDispatcher(arguments, this)");
};
dojo._event_listener._fixCallback=function(fp){
var f=dojo._event_listener._fixEvent;
return function(e){
return fp.call(this,f(e,this));
};
};
}
}
if(!dojo._hasResource["dojo._base.html"]){
dojo._hasResource["dojo._base.html"]=true;
dojo.provide("dojo._base.html");
try{
document.execCommand("BackgroundImageCache",false,true);
}
catch(e){
}
if(dojo.isIE){
dojo.byId=function(id,doc){
if(typeof id!="string"){
return id;
}
var _164=doc||dojo.doc,te=_164.getElementById(id);
if(te&&(te.attributes.id.value==id||te.id==id)){
return te;
}else{
var eles=_164.all[id];
if(!eles||eles.nodeName){
eles=[eles];
}
var i=0;
while((te=eles[i++])){
if((te.attributes&&te.attributes.id&&te.attributes.id.value==id)||te.id==id){
return te;
}
}
}
};
}else{
dojo.byId=function(id,doc){
return ((typeof id=="string")?(doc||dojo.doc).getElementById(id):id)||null;
};
}
(function(){
var d=dojo;
var byId=d.byId;
var _165=null,_166;
d.addOnWindowUnload(function(){
_165=null;
});
dojo._destroyElement=dojo.destroy=function(node){
node=byId(node);
try{
var doc=node.ownerDocument;
if(!_165||_166!=doc){
_165=doc.createElement("div");
_166=doc;
}
_165.appendChild(node.parentNode?node.parentNode.removeChild(node):node);
_165.innerHTML="";
}
catch(e){
}
};
dojo.isDescendant=function(node,_167){
try{
node=byId(node);
_167=byId(_167);
while(node){
if(node==_167){
return true;
}
node=node.parentNode;
}
}
catch(e){
}
return false;
};
dojo.setSelectable=function(node,_168){
node=byId(node);
if(d.isMozilla){
node.style.MozUserSelect=_168?"":"none";
}else{
if(d.isKhtml||d.isWebKit){
node.style.KhtmlUserSelect=_168?"auto":"none";
}else{
if(d.isIE){
var v=(node.unselectable=_168?"":"on");
d.query("*",node).forEach("item.unselectable = '"+v+"'");
}
}
}
};
var _169=function(node,ref){
var _16a=ref.parentNode;
if(_16a){
_16a.insertBefore(node,ref);
}
};
var _16b=function(node,ref){
var _16c=ref.parentNode;
if(_16c){
if(_16c.lastChild==ref){
_16c.appendChild(node);
}else{
_16c.insertBefore(node,ref.nextSibling);
}
}
};
dojo.place=function(node,_16d,_16e){
_16d=byId(_16d);
if(typeof node=="string"){
node=/^\s*</.test(node)?d._toDom(node,_16d.ownerDocument):byId(node);
}
if(typeof _16e=="number"){
var cn=_16d.childNodes;
if(!cn.length||cn.length<=_16e){
_16d.appendChild(node);
}else{
_169(node,cn[_16e<0?0:_16e]);
}
}else{
switch(_16e){
case "before":
_169(node,_16d);
break;
case "after":
_16b(node,_16d);
break;
case "replace":
_16d.parentNode.replaceChild(node,_16d);
break;
case "only":
d.empty(_16d);
_16d.appendChild(node);
break;
case "first":
if(_16d.firstChild){
_169(node,_16d.firstChild);
break;
}
default:
_16d.appendChild(node);
}
}
return node;
};
dojo.boxModel="content-box";
if(d.isIE){
d.boxModel=document.compatMode=="BackCompat"?"border-box":"content-box";
}
var gcs;
if(d.isWebKit){
gcs=function(node){
var s;
if(node.nodeType==1){
var dv=node.ownerDocument.defaultView;
s=dv.getComputedStyle(node,null);
if(!s&&node.style){
node.style.display="";
s=dv.getComputedStyle(node,null);
}
}
return s||{};
};
}else{
if(d.isIE){
gcs=function(node){
return node.nodeType==1?node.currentStyle:{};
};
}else{
gcs=function(node){
return node.nodeType==1?node.ownerDocument.defaultView.getComputedStyle(node,null):{};
};
}
}
dojo.getComputedStyle=gcs;
if(!d.isIE){
d._toPixelValue=function(_16f,_170){
return parseFloat(_170)||0;
};
}else{
d._toPixelValue=function(_171,_172){
if(!_172){
return 0;
}
if(_172=="medium"){
return 4;
}
if(_172.slice&&_172.slice(-2)=="px"){
return parseFloat(_172);
}
with(_171){
var _173=style.left;
var _174=runtimeStyle.left;
runtimeStyle.left=currentStyle.left;
try{
style.left=_172;
_172=style.pixelLeft;
}
catch(e){
_172=0;
}
style.left=_173;
runtimeStyle.left=_174;
}
return _172;
};
}
var px=d._toPixelValue;
var astr="DXImageTransform.Microsoft.Alpha";
var af=function(n,f){
try{
return n.filters.item(astr);
}
catch(e){
return f?{}:null;
}
};
dojo._getOpacity=d.isIE?function(node){
try{
return af(node).Opacity/100;
}
catch(e){
return 1;
}
}:function(node){
return gcs(node).opacity;
};
dojo._setOpacity=d.isIE?function(node,_175){
var ov=_175*100,_176=_175==1;
node.style.zoom=_176?"":1;
if(!af(node)){
if(_176){
return _175;
}
node.style.filter+=" progid:"+astr+"(Opacity="+ov+")";
}else{
af(node,1).Opacity=ov;
}
af(node,1).Enabled=!_176;
if(node.nodeName.toLowerCase()=="tr"){
d.query("> td",node).forEach(function(i){
d._setOpacity(i,_175);
});
}
return _175;
}:function(node,_177){
return node.style.opacity=_177;
};
var _178={left:true,top:true};
var _179=/margin|padding|width|height|max|min|offset/;
var _17a=function(node,type,_17b){
type=type.toLowerCase();
if(d.isIE){
if(_17b=="auto"){
if(type=="height"){
return node.offsetHeight;
}
if(type=="width"){
return node.offsetWidth;
}
}
if(type=="fontweight"){
switch(_17b){
case 700:
return "bold";
case 400:
default:
return "normal";
}
}
}
if(!(type in _178)){
_178[type]=_179.test(type);
}
return _178[type]?px(node,_17b):_17b;
};
var _17c=d.isIE?"styleFloat":"cssFloat",_17d={"cssFloat":_17c,"styleFloat":_17c,"float":_17c};
dojo.style=function(node,_17e,_17f){
var n=byId(node),args=arguments.length,op=(_17e=="opacity");
_17e=_17d[_17e]||_17e;
if(args==3){
return op?d._setOpacity(n,_17f):n.style[_17e]=_17f;
}
if(args==2&&op){
return d._getOpacity(n);
}
var s=gcs(n);
if(args==2&&typeof _17e!="string"){
for(var x in _17e){
d.style(node,x,_17e[x]);
}
return s;
}
return (args==1)?s:_17a(n,_17e,s[_17e]||n.style[_17e]);
};
dojo._getPadExtents=function(n,_180){
var s=_180||gcs(n),l=px(n,s.paddingLeft),t=px(n,s.paddingTop);
return {l:l,t:t,w:l+px(n,s.paddingRight),h:t+px(n,s.paddingBottom)};
};
dojo._getBorderExtents=function(n,_181){
var ne="none",s=_181||gcs(n),bl=(s.borderLeftStyle!=ne?px(n,s.borderLeftWidth):0),bt=(s.borderTopStyle!=ne?px(n,s.borderTopWidth):0);
return {l:bl,t:bt,w:bl+(s.borderRightStyle!=ne?px(n,s.borderRightWidth):0),h:bt+(s.borderBottomStyle!=ne?px(n,s.borderBottomWidth):0)};
};
dojo._getPadBorderExtents=function(n,_182){
var s=_182||gcs(n),p=d._getPadExtents(n,s),b=d._getBorderExtents(n,s);
return {l:p.l+b.l,t:p.t+b.t,w:p.w+b.w,h:p.h+b.h};
};
dojo._getMarginExtents=function(n,_183){
var s=_183||gcs(n),l=px(n,s.marginLeft),t=px(n,s.marginTop),r=px(n,s.marginRight),b=px(n,s.marginBottom);
if(d.isWebKit&&(s.position!="absolute")){
r=l;
}
return {l:l,t:t,w:l+r,h:t+b};
};
dojo._getMarginBox=function(node,_184){
var s=_184||gcs(node),me=d._getMarginExtents(node,s);
var l=node.offsetLeft-me.l,t=node.offsetTop-me.t,p=node.parentNode;
if(d.isMoz){
var sl=parseFloat(s.left),st=parseFloat(s.top);
if(!isNaN(sl)&&!isNaN(st)){
l=sl,t=st;
}else{
if(p&&p.style){
var pcs=gcs(p);
if(pcs.overflow!="visible"){
var be=d._getBorderExtents(p,pcs);
l+=be.l,t+=be.t;
}
}
}
}else{
if(d.isOpera||(d.isIE>7&&!d.isQuirks)){
if(p){
be=d._getBorderExtents(p);
l-=be.l;
t-=be.t;
}
}
}
return {l:l,t:t,w:node.offsetWidth+me.w,h:node.offsetHeight+me.h};
};
dojo._getMarginSize=function(node,_185){
node=byId(node);
var me=d._getMarginExtents(node,_185||gcs(node));
var size=node.getBoundingClientRect();
return {w:(size.right-size.left)+me.w,h:(size.bottom-size.top)+me.h};
};
dojo._getContentBox=function(node,_186){
var s=_186||gcs(node),pe=d._getPadExtents(node,s),be=d._getBorderExtents(node,s),w=node.clientWidth,h;
if(!w){
w=node.offsetWidth,h=node.offsetHeight;
}else{
h=node.clientHeight,be.w=be.h=0;
}
if(d.isOpera){
pe.l+=be.l;
pe.t+=be.t;
}
return {l:pe.l,t:pe.t,w:w-pe.w-be.w,h:h-pe.h-be.h};
};
dojo._getBorderBox=function(node,_187){
var s=_187||gcs(node),pe=d._getPadExtents(node,s),cb=d._getContentBox(node,s);
return {l:cb.l-pe.l,t:cb.t-pe.t,w:cb.w+pe.w,h:cb.h+pe.h};
};
dojo._setBox=function(node,l,t,w,h,u){
u=u||"px";
var s=node.style;
if(!isNaN(l)){
s.left=l+u;
}
if(!isNaN(t)){
s.top=t+u;
}
if(w>=0){
s.width=w+u;
}
if(h>=0){
s.height=h+u;
}
};
dojo._isButtonTag=function(node){
return node.tagName=="BUTTON"||node.tagName=="INPUT"&&(node.getAttribute("type")||"").toUpperCase()=="BUTTON";
};
dojo._usesBorderBox=function(node){
var n=node.tagName;
return d.boxModel=="border-box"||n=="TABLE"||d._isButtonTag(node);
};
dojo._setContentSize=function(node,_188,_189,_18a){
if(d._usesBorderBox(node)){
var pb=d._getPadBorderExtents(node,_18a);
if(_188>=0){
_188+=pb.w;
}
if(_189>=0){
_189+=pb.h;
}
}
d._setBox(node,NaN,NaN,_188,_189);
};
dojo._setMarginBox=function(node,_18b,_18c,_18d,_18e,_18f){
var s=_18f||gcs(node),bb=d._usesBorderBox(node),pb=bb?_190:d._getPadBorderExtents(node,s);
if(d.isWebKit){
if(d._isButtonTag(node)){
var ns=node.style;
if(_18d>=0&&!ns.width){
ns.width="4px";
}
if(_18e>=0&&!ns.height){
ns.height="4px";
}
}
}
var mb=d._getMarginExtents(node,s);
if(_18d>=0){
_18d=Math.max(_18d-pb.w-mb.w,0);
}
if(_18e>=0){
_18e=Math.max(_18e-pb.h-mb.h,0);
}
d._setBox(node,_18b,_18c,_18d,_18e);
};
var _190={l:0,t:0,w:0,h:0};
dojo.marginBox=function(node,box){
var n=byId(node),s=gcs(n),b=box;
return !b?d._getMarginBox(n,s):d._setMarginBox(n,b.l,b.t,b.w,b.h,s);
};
dojo.contentBox=function(node,box){
var n=byId(node),s=gcs(n),b=box;
return !b?d._getContentBox(n,s):d._setContentSize(n,b.w,b.h,s);
};
var _191=function(node,prop){
if(!(node=(node||0).parentNode)){
return 0;
}
var val,_192=0,_193=d.body();
while(node&&node.style){
if(gcs(node).position=="fixed"){
return 0;
}
val=node[prop];
if(val){
_192+=val-0;
if(node==_193){
break;
}
}
node=node.parentNode;
}
return _192;
};
dojo._docScroll=function(){
var n=d.global;
return "pageXOffset" in n?{x:n.pageXOffset,y:n.pageYOffset}:(n=d.isQuirks?d.doc.body:d.doc.documentElement,{x:d._fixIeBiDiScrollLeft(n.scrollLeft||0),y:n.scrollTop||0});
};
dojo._isBodyLtr=function(){
return "_bodyLtr" in d?d._bodyLtr:d._bodyLtr=(d.body().dir||d.doc.documentElement.dir||"ltr").toLowerCase()=="ltr";
};
dojo._getIeDocumentElementOffset=function(){
var de=d.doc.documentElement;
if(d.isIE<8){
var r=de.getBoundingClientRect();
var l=r.left,t=r.top;
if(d.isIE<7){
l+=de.clientLeft;
t+=de.clientTop;
}
return {x:l<0?0:l,y:t<0?0:t};
}else{
return {x:0,y:0};
}
};
dojo._fixIeBiDiScrollLeft=function(_194){
var ie=d.isIE;
if(ie&&!d._isBodyLtr()){
var qk=d.isQuirks,de=qk?d.doc.body:d.doc.documentElement;
if(ie==6&&!qk&&d.global.frameElement&&de.scrollHeight>de.clientHeight){
_194+=de.clientLeft;
}
return (ie<8||qk)?(_194+de.clientWidth-de.scrollWidth):-_194;
}
return _194;
};
dojo._abs=dojo.position=function(node,_195){
node=byId(node);
var db=d.body(),dh=db.parentNode,ret=node.getBoundingClientRect();
ret={x:ret.left,y:ret.top,w:ret.right-ret.left,h:ret.bottom-ret.top};
if(d.isIE){
var _196=d._getIeDocumentElementOffset();
ret.x-=_196.x+(d.isQuirks?db.clientLeft+db.offsetLeft:0);
ret.y-=_196.y+(d.isQuirks?db.clientTop+db.offsetTop:0);
}else{
if(d.isFF==3){
var cs=gcs(dh);
ret.x-=px(dh,cs.marginLeft)+px(dh,cs.borderLeftWidth);
ret.y-=px(dh,cs.marginTop)+px(dh,cs.borderTopWidth);
}
}
if(_195){
var _197=d._docScroll();
ret.x+=_197.x;
ret.y+=_197.y;
}
return ret;
};
dojo.coords=function(node,_198){
var n=byId(node),s=gcs(n),mb=d._getMarginBox(n,s);
var abs=d.position(n,_198);
mb.x=abs.x;
mb.y=abs.y;
return mb;
};
var _199={"class":"className","for":"htmlFor",tabindex:"tabIndex",readonly:"readOnly",colspan:"colSpan",frameborder:"frameBorder",rowspan:"rowSpan",valuetype:"valueType"},_19a={classname:"class",htmlfor:"for",tabindex:"tabIndex",readonly:"readOnly"},_19b={innerHTML:1,className:1,htmlFor:d.isIE,value:1};
var _19c=function(name){
return _19a[name.toLowerCase()]||name;
};
var _19d=function(node,name){
var attr=node.getAttributeNode&&node.getAttributeNode(name);
return attr&&attr.specified;
};
dojo.hasAttr=function(node,name){
var lc=name.toLowerCase();
return _19b[_199[lc]||name]||_19d(byId(node),_19a[lc]||name);
};
var _19e={},_19f=0,_1a0=dojo._scopeName+"attrid",_1a1={col:1,colgroup:1,table:1,tbody:1,tfoot:1,thead:1,tr:1,title:1};
dojo.attr=function(node,name,_1a2){
node=byId(node);
var args=arguments.length,prop;
if(args==2&&typeof name!="string"){
for(var x in name){
d.attr(node,x,name[x]);
}
return node;
}
var lc=name.toLowerCase(),_1a3=_199[lc]||name,_1a4=_19b[_1a3],_1a5=_19a[lc]||name;
if(args==3){
do{
if(_1a3=="style"&&typeof _1a2!="string"){
d.style(node,_1a2);
break;
}
if(_1a3=="innerHTML"){
if(d.isIE&&node.tagName.toLowerCase() in _1a1){
d.empty(node);
node.appendChild(d._toDom(_1a2,node.ownerDocument));
}else{
node[_1a3]=_1a2;
}
break;
}
if(d.isFunction(_1a2)){
var _1a6=d.attr(node,_1a0);
if(!_1a6){
_1a6=_19f++;
d.attr(node,_1a0,_1a6);
}
if(!_19e[_1a6]){
_19e[_1a6]={};
}
var h=_19e[_1a6][_1a3];
if(h){
d.disconnect(h);
}else{
try{
delete node[_1a3];
}
catch(e){
}
}
_19e[_1a6][_1a3]=d.connect(node,_1a3,_1a2);
break;
}
if(_1a4||typeof _1a2=="boolean"){
node[_1a3]=_1a2;
break;
}
node.setAttribute(_1a5,_1a2);
}while(false);
return node;
}
_1a2=node[_1a3];
if(_1a4&&typeof _1a2!="undefined"){
return _1a2;
}
if(_1a3!="href"&&(typeof _1a2=="boolean"||d.isFunction(_1a2))){
return _1a2;
}
return _19d(node,_1a5)?node.getAttribute(_1a5):null;
};
dojo.removeAttr=function(node,name){
byId(node).removeAttribute(_19c(name));
};
dojo.getNodeProp=function(node,name){
node=byId(node);
var lc=name.toLowerCase(),_1a7=_199[lc]||name;
if((_1a7 in node)&&_1a7!="href"){
return node[_1a7];
}
var _1a8=_19a[lc]||name;
return _19d(node,_1a8)?node.getAttribute(_1a8):null;
};
dojo.create=function(tag,_1a9,_1aa,pos){
var doc=d.doc;
if(_1aa){
_1aa=byId(_1aa);
doc=_1aa.ownerDocument;
}
if(typeof tag=="string"){
tag=doc.createElement(tag);
}
if(_1a9){
d.attr(tag,_1a9);
}
if(_1aa){
d.place(tag,_1aa,pos);
}
return tag;
};
d.empty=d.isIE?function(node){
node=byId(node);
for(var c;c=node.lastChild;){
d.destroy(c);
}
}:function(node){
byId(node).innerHTML="";
};
var _1ab={option:["select"],tbody:["table"],thead:["table"],tfoot:["table"],tr:["table","tbody"],td:["table","tbody","tr"],th:["table","thead","tr"],legend:["fieldset"],caption:["table"],colgroup:["table"],col:["table","colgroup"],li:["ul"]},_1ac=/<\s*([\w\:]+)/,_1ad={},_1ae=0,_1af="__"+d._scopeName+"ToDomId";
for(var _1b0 in _1ab){
if(_1ab.hasOwnProperty(_1b0)){
var tw=_1ab[_1b0];
tw.pre=_1b0=="option"?"<select multiple=\"multiple\">":"<"+tw.join("><")+">";
tw.post="</"+tw.reverse().join("></")+">";
}
}
d._toDom=function(frag,doc){
doc=doc||d.doc;
var _1b1=doc[_1af];
if(!_1b1){
doc[_1af]=_1b1=++_1ae+"";
_1ad[_1b1]=doc.createElement("div");
}
frag+="";
var _1b2=frag.match(_1ac),tag=_1b2?_1b2[1].toLowerCase():"",_1b3=_1ad[_1b1],wrap,i,fc,df;
if(_1b2&&_1ab[tag]){
wrap=_1ab[tag];
_1b3.innerHTML=wrap.pre+frag+wrap.post;
for(i=wrap.length;i;--i){
_1b3=_1b3.firstChild;
}
}else{
_1b3.innerHTML=frag;
}
if(_1b3.childNodes.length==1){
return _1b3.removeChild(_1b3.firstChild);
}
df=doc.createDocumentFragment();
while(fc=_1b3.firstChild){
df.appendChild(fc);
}
return df;
};
var _1b4="className";
dojo.hasClass=function(node,_1b5){
return ((" "+byId(node)[_1b4]+" ").indexOf(" "+_1b5+" ")>=0);
};
var _1b6=/\s+/,a1=[""],_1b7={},_1b8=function(s){
if(typeof s=="string"||s instanceof String){
if(s.indexOf(" ")<0){
a1[0]=s;
return a1;
}else{
return s.split(_1b6);
}
}
return s||"";
};
dojo.addClass=function(node,_1b9){
node=byId(node);
_1b9=_1b8(_1b9);
var cls=node[_1b4],_1ba;
cls=cls?" "+cls+" ":" ";
_1ba=cls.length;
for(var i=0,len=_1b9.length,c;i<len;++i){
c=_1b9[i];
if(c&&cls.indexOf(" "+c+" ")<0){
cls+=c+" ";
}
}
if(_1ba<cls.length){
node[_1b4]=cls.substr(1,cls.length-2);
}
};
dojo.removeClass=function(node,_1bb){
node=byId(node);
var cls;
if(_1bb!==undefined){
_1bb=_1b8(_1bb);
cls=" "+node[_1b4]+" ";
for(var i=0,len=_1bb.length;i<len;++i){
cls=cls.replace(" "+_1bb[i]+" "," ");
}
cls=d.trim(cls);
}else{
cls="";
}
if(node[_1b4]!=cls){
node[_1b4]=cls;
}
};
dojo.replaceClass=function(node,_1bc,_1bd){
node=byId(node);
_1b7.className=node.className;
dojo.removeClass(_1b7,_1bd);
dojo.addClass(_1b7,_1bc);
if(node.className!==_1b7.className){
node.className=_1b7.className;
}
};
dojo.toggleClass=function(node,_1be,_1bf){
if(_1bf===undefined){
_1bf=!d.hasClass(node,_1be);
}
d[_1bf?"addClass":"removeClass"](node,_1be);
};
})();
}
if(!dojo._hasResource["dojo._base.NodeList"]){
dojo._hasResource["dojo._base.NodeList"]=true;
dojo.provide("dojo._base.NodeList");
(function(){
var d=dojo;
var ap=Array.prototype,aps=ap.slice,apc=ap.concat;
var tnl=function(a,_1c0,_1c1){
if(!a.sort){
a=aps.call(a,0);
}
var ctor=_1c1||this._NodeListCtor||d._NodeListCtor;
a.constructor=ctor;
dojo._mixin(a,ctor.prototype);
a._NodeListCtor=ctor;
return _1c0?a._stash(_1c0):a;
};
var _1c2=function(f,a,o){
a=[0].concat(aps.call(a,0));
o=o||d.global;
return function(node){
a[0]=node;
return f.apply(o,a);
};
};
var _1c3=function(f,o){
return function(){
this.forEach(_1c2(f,arguments,o));
return this;
};
};
var _1c4=function(f,o){
return function(){
return this.map(_1c2(f,arguments,o));
};
};
var _1c5=function(f,o){
return function(){
return this.filter(_1c2(f,arguments,o));
};
};
var _1c6=function(f,g,o){
return function(){
var a=arguments,body=_1c2(f,a,o);
if(g.call(o||d.global,a)){
return this.map(body);
}
this.forEach(body);
return this;
};
};
var _1c7=function(a){
return a.length==1&&(typeof a[0]=="string");
};
var _1c8=function(node){
var p=node.parentNode;
if(p){
p.removeChild(node);
}
};
dojo.NodeList=function(){
return tnl(Array.apply(null,arguments));
};
d._NodeListCtor=d.NodeList;
var nl=d.NodeList,nlp=nl.prototype;
nl._wrap=nlp._wrap=tnl;
nl._adaptAsMap=_1c4;
nl._adaptAsForEach=_1c3;
nl._adaptAsFilter=_1c5;
nl._adaptWithCondition=_1c6;
d.forEach(["slice","splice"],function(name){
var f=ap[name];
nlp[name]=function(){
return this._wrap(f.apply(this,arguments),name=="slice"?this:null);
};
});
d.forEach(["indexOf","lastIndexOf","every","some"],function(name){
var f=d[name];
nlp[name]=function(){
return f.apply(d,[this].concat(aps.call(arguments,0)));
};
});
d.forEach(["attr","style"],function(name){
nlp[name]=_1c6(d[name],_1c7);
});
d.forEach(["connect","addClass","removeClass","replaceClass","toggleClass","empty","removeAttr"],function(name){
nlp[name]=_1c3(d[name]);
});
dojo.extend(dojo.NodeList,{_normalize:function(_1c9,_1ca){
var _1cb=_1c9.parse===true?true:false;
if(typeof _1c9.template=="string"){
var _1cc=_1c9.templateFunc||(dojo.string&&dojo.string.substitute);
_1c9=_1cc?_1cc(_1c9.template,_1c9):_1c9;
}
var type=(typeof _1c9);
if(type=="string"||type=="number"){
_1c9=dojo._toDom(_1c9,(_1ca&&_1ca.ownerDocument));
if(_1c9.nodeType==11){
_1c9=dojo._toArray(_1c9.childNodes);
}else{
_1c9=[_1c9];
}
}else{
if(!dojo.isArrayLike(_1c9)){
_1c9=[_1c9];
}else{
if(!dojo.isArray(_1c9)){
_1c9=dojo._toArray(_1c9);
}
}
}
if(_1cb){
_1c9._runParse=true;
}
return _1c9;
},_cloneNode:function(node){
return node.cloneNode(true);
},_place:function(ary,_1cd,_1ce,_1cf){
if(_1cd.nodeType!=1&&_1ce=="only"){
return;
}
var _1d0=_1cd,_1d1;
var _1d2=ary.length;
for(var i=_1d2-1;i>=0;i--){
var node=(_1cf?this._cloneNode(ary[i]):ary[i]);
if(ary._runParse&&dojo.parser&&dojo.parser.parse){
if(!_1d1){
_1d1=_1d0.ownerDocument.createElement("div");
}
_1d1.appendChild(node);
dojo.parser.parse(_1d1);
node=_1d1.firstChild;
while(_1d1.firstChild){
_1d1.removeChild(_1d1.firstChild);
}
}
if(i==_1d2-1){
dojo.place(node,_1d0,_1ce);
}else{
_1d0.parentNode.insertBefore(node,_1d0);
}
_1d0=node;
}
},_stash:function(_1d3){
this._parent=_1d3;
return this;
},end:function(){
if(this._parent){
return this._parent;
}else{
return new this._NodeListCtor();
}
},concat:function(item){
var t=d.isArray(this)?this:aps.call(this,0),m=d.map(arguments,function(a){
return a&&!d.isArray(a)&&(typeof NodeList!="undefined"&&a.constructor===NodeList||a.constructor===this._NodeListCtor)?aps.call(a,0):a;
});
return this._wrap(apc.apply(t,m),this);
},map:function(func,obj){
return this._wrap(d.map(this,func,obj),this);
},forEach:function(_1d4,_1d5){
d.forEach(this,_1d4,_1d5);
return this;
},coords:_1c4(d.coords),position:_1c4(d.position),place:function(_1d6,_1d7){
var item=d.query(_1d6)[0];
return this.forEach(function(node){
d.place(node,item,_1d7);
});
},orphan:function(_1d8){
return (_1d8?d._filterQueryResult(this,_1d8):this).forEach(_1c8);
},adopt:function(_1d9,_1da){
return d.query(_1d9).place(this[0],_1da)._stash(this);
},query:function(_1db){
if(!_1db){
return this;
}
var ret=this.map(function(node){
return d.query(_1db,node).filter(function(_1dc){
return _1dc!==undefined;
});
});
return this._wrap(apc.apply([],ret),this);
},filter:function(_1dd){
var a=arguments,_1de=this,_1df=0;
if(typeof _1dd=="string"){
_1de=d._filterQueryResult(this,a[0]);
if(a.length==1){
return _1de._stash(this);
}
_1df=1;
}
return this._wrap(d.filter(_1de,a[_1df],a[_1df+1]),this);
},addContent:function(_1e0,_1e1){
_1e0=this._normalize(_1e0,this[0]);
for(var i=0,node;(node=this[i]);i++){
this._place(_1e0,node,_1e1,i>0);
}
return this;
},instantiate:function(_1e2,_1e3){
var c=d.isFunction(_1e2)?_1e2:d.getObject(_1e2);
_1e3=_1e3||{};
return this.forEach(function(node){
new c(_1e3,node);
});
},at:function(){
var t=new this._NodeListCtor();
d.forEach(arguments,function(i){
if(i<0){
i=this.length+i;
}
if(this[i]){
t.push(this[i]);
}
},this);
return t._stash(this);
}});
nl.events=["blur","focus","change","click","error","keydown","keypress","keyup","load","mousedown","mouseenter","mouseleave","mousemove","mouseout","mouseover","mouseup","submit"];
d.forEach(nl.events,function(evt){
var _1e4="on"+evt;
nlp[_1e4]=function(a,b){
return this.connect(_1e4,a,b);
};
});
})();
}
if(!dojo._hasResource["dojo._base.query"]){
dojo._hasResource["dojo._base.query"]=true;
(function(){
var _1e5=function(d){
var trim=d.trim;
var each=d.forEach;
var qlc=(d._NodeListCtor=d.NodeList);
var _1e6=function(){
return d.doc;
};
var _1e7=((d.isWebKit||d.isMozilla)&&((_1e6().compatMode)=="BackCompat"));
var _1e8=!!_1e6().firstChild["children"]?"children":"childNodes";
var _1e9=">~+";
var _1ea=false;
var _1eb=function(){
return true;
};
var _1ec=function(_1ed){
if(_1e9.indexOf(_1ed.slice(-1))>=0){
_1ed+=" * ";
}else{
_1ed+=" ";
}
var ts=function(s,e){
return trim(_1ed.slice(s,e));
};
var _1ee=[];
var _1ef=-1,_1f0=-1,_1f1=-1,_1f2=-1,_1f3=-1,inId=-1,_1f4=-1,lc="",cc="",_1f5;
var x=0,ql=_1ed.length,_1f6=null,_1f7=null;
var _1f8=function(){
if(_1f4>=0){
var tv=(_1f4==x)?null:ts(_1f4,x);
_1f6[(_1e9.indexOf(tv)<0)?"tag":"oper"]=tv;
_1f4=-1;
}
};
var _1f9=function(){
if(inId>=0){
_1f6.id=ts(inId,x).replace(/\\/g,"");
inId=-1;
}
};
var _1fa=function(){
if(_1f3>=0){
_1f6.classes.push(ts(_1f3+1,x).replace(/\\/g,""));
_1f3=-1;
}
};
var _1fb=function(){
_1f9();
_1f8();
_1fa();
};
var _1fc=function(){
_1fb();
if(_1f2>=0){
_1f6.pseudos.push({name:ts(_1f2+1,x)});
}
_1f6.loops=(_1f6.pseudos.length||_1f6.attrs.length||_1f6.classes.length);
_1f6.oquery=_1f6.query=ts(_1f5,x);
_1f6.otag=_1f6.tag=(_1f6["oper"])?null:(_1f6.tag||"*");
if(_1f6.tag){
_1f6.tag=_1f6.tag.toUpperCase();
}
if(_1ee.length&&(_1ee[_1ee.length-1].oper)){
_1f6.infixOper=_1ee.pop();
_1f6.query=_1f6.infixOper.query+" "+_1f6.query;
}
_1ee.push(_1f6);
_1f6=null;
};
for(;lc=cc,cc=_1ed.charAt(x),x<ql;x++){
if(lc=="\\"){
continue;
}
if(!_1f6){
_1f5=x;
_1f6={query:null,pseudos:[],attrs:[],classes:[],tag:null,oper:null,id:null,getTag:function(){
return (_1ea)?this.otag:this.tag;
}};
_1f4=x;
}
if(_1ef>=0){
if(cc=="]"){
if(!_1f7.attr){
_1f7.attr=ts(_1ef+1,x);
}else{
_1f7.matchFor=ts((_1f1||_1ef+1),x);
}
var cmf=_1f7.matchFor;
if(cmf){
if((cmf.charAt(0)=="\"")||(cmf.charAt(0)=="'")){
_1f7.matchFor=cmf.slice(1,-1);
}
}
_1f6.attrs.push(_1f7);
_1f7=null;
_1ef=_1f1=-1;
}else{
if(cc=="="){
var _1fd=("|~^$*".indexOf(lc)>=0)?lc:"";
_1f7.type=_1fd+cc;
_1f7.attr=ts(_1ef+1,x-_1fd.length);
_1f1=x+1;
}
}
}else{
if(_1f0>=0){
if(cc==")"){
if(_1f2>=0){
_1f7.value=ts(_1f0+1,x);
}
_1f2=_1f0=-1;
}
}else{
if(cc=="#"){
_1fb();
inId=x+1;
}else{
if(cc=="."){
_1fb();
_1f3=x;
}else{
if(cc==":"){
_1fb();
_1f2=x;
}else{
if(cc=="["){
_1fb();
_1ef=x;
_1f7={};
}else{
if(cc=="("){
if(_1f2>=0){
_1f7={name:ts(_1f2+1,x),value:null};
_1f6.pseudos.push(_1f7);
}
_1f0=x;
}else{
if((cc==" ")&&(lc!=cc)){
_1fc();
}
}
}
}
}
}
}
}
}
return _1ee;
};
var _1fe=function(_1ff,_200){
if(!_1ff){
return _200;
}
if(!_200){
return _1ff;
}
return function(){
return _1ff.apply(window,arguments)&&_200.apply(window,arguments);
};
};
var _201=function(i,arr){
var r=arr||[];
if(i){
r.push(i);
}
return r;
};
var _202=function(n){
return (1==n.nodeType);
};
var _203="";
var _204=function(elem,attr){
if(!elem){
return _203;
}
if(attr=="class"){
return elem.className||_203;
}
if(attr=="for"){
return elem.htmlFor||_203;
}
if(attr=="style"){
return elem.style.cssText||_203;
}
return (_1ea?elem.getAttribute(attr):elem.getAttribute(attr,2))||_203;
};
var _205={"*=":function(attr,_206){
return function(elem){
return (_204(elem,attr).indexOf(_206)>=0);
};
},"^=":function(attr,_207){
return function(elem){
return (_204(elem,attr).indexOf(_207)==0);
};
},"$=":function(attr,_208){
var tval=" "+_208;
return function(elem){
var ea=" "+_204(elem,attr);
return (ea.lastIndexOf(_208)==(ea.length-_208.length));
};
},"~=":function(attr,_209){
var tval=" "+_209+" ";
return function(elem){
var ea=" "+_204(elem,attr)+" ";
return (ea.indexOf(tval)>=0);
};
},"|=":function(attr,_20a){
var _20b=" "+_20a+"-";
return function(elem){
var ea=" "+_204(elem,attr);
return ((ea==_20a)||(ea.indexOf(_20b)==0));
};
},"=":function(attr,_20c){
return function(elem){
return (_204(elem,attr)==_20c);
};
}};
var _20d=(typeof _1e6().firstChild.nextElementSibling=="undefined");
var _20e=!_20d?"nextElementSibling":"nextSibling";
var _20f=!_20d?"previousElementSibling":"previousSibling";
var _210=(_20d?_202:_1eb);
var _211=function(node){
while(node=node[_20f]){
if(_210(node)){
return false;
}
}
return true;
};
var _212=function(node){
while(node=node[_20e]){
if(_210(node)){
return false;
}
}
return true;
};
var _213=function(node){
var root=node.parentNode;
var i=0,tret=root[_1e8],ci=(node["_i"]||-1),cl=(root["_l"]||-1);
if(!tret){
return -1;
}
var l=tret.length;
if(cl==l&&ci>=0&&cl>=0){
return ci;
}
root["_l"]=l;
ci=-1;
for(var te=root["firstElementChild"]||root["firstChild"];te;te=te[_20e]){
if(_210(te)){
te["_i"]=++i;
if(node===te){
ci=i;
}
}
}
return ci;
};
var _214=function(elem){
return !((_213(elem))%2);
};
var _215=function(elem){
return ((_213(elem))%2);
};
var _216={"checked":function(name,_217){
return function(elem){
return !!("checked" in elem?elem.checked:elem.selected);
};
},"first-child":function(){
return _211;
},"last-child":function(){
return _212;
},"only-child":function(name,_218){
return function(node){
if(!_211(node)){
return false;
}
if(!_212(node)){
return false;
}
return true;
};
},"empty":function(name,_219){
return function(elem){
var cn=elem.childNodes;
var cnl=elem.childNodes.length;
for(var x=cnl-1;x>=0;x--){
var nt=cn[x].nodeType;
if((nt===1)||(nt==3)){
return false;
}
}
return true;
};
},"contains":function(name,_21a){
var cz=_21a.charAt(0);
if(cz=="\""||cz=="'"){
_21a=_21a.slice(1,-1);
}
return function(elem){
return (elem.innerHTML.indexOf(_21a)>=0);
};
},"not":function(name,_21b){
var p=_1ec(_21b)[0];
var _21c={el:1};
if(p.tag!="*"){
_21c.tag=1;
}
if(!p.classes.length){
_21c.classes=1;
}
var ntf=_21d(p,_21c);
return function(elem){
return (!ntf(elem));
};
},"nth-child":function(name,_21e){
var pi=parseInt;
if(_21e=="odd"){
return _215;
}else{
if(_21e=="even"){
return _214;
}
}
if(_21e.indexOf("n")!=-1){
var _21f=_21e.split("n",2);
var pred=_21f[0]?((_21f[0]=="-")?-1:pi(_21f[0])):1;
var idx=_21f[1]?pi(_21f[1]):0;
var lb=0,ub=-1;
if(pred>0){
if(idx<0){
idx=(idx%pred)&&(pred+(idx%pred));
}else{
if(idx>0){
if(idx>=pred){
lb=idx-idx%pred;
}
idx=idx%pred;
}
}
}else{
if(pred<0){
pred*=-1;
if(idx>0){
ub=idx;
idx=idx%pred;
}
}
}
if(pred>0){
return function(elem){
var i=_213(elem);
return (i>=lb)&&(ub<0||i<=ub)&&((i%pred)==idx);
};
}else{
_21e=idx;
}
}
var _220=pi(_21e);
return function(elem){
return (_213(elem)==_220);
};
}};
var _221=(d.isIE<9||(dojo.isIE&&dojo.isQuirks))?function(cond){
var clc=cond.toLowerCase();
if(clc=="class"){
cond="className";
}
return function(elem){
return (_1ea?elem.getAttribute(cond):elem[cond]||elem[clc]);
};
}:function(cond){
return function(elem){
return (elem&&elem.getAttribute&&elem.hasAttribute(cond));
};
};
var _21d=function(_222,_223){
if(!_222){
return _1eb;
}
_223=_223||{};
var ff=null;
if(!("el" in _223)){
ff=_1fe(ff,_202);
}
if(!("tag" in _223)){
if(_222.tag!="*"){
ff=_1fe(ff,function(elem){
return (elem&&(elem.tagName==_222.getTag()));
});
}
}
if(!("classes" in _223)){
each(_222.classes,function(_224,idx,arr){
var re=new RegExp("(?:^|\\s)"+_224+"(?:\\s|$)");
ff=_1fe(ff,function(elem){
return re.test(elem.className);
});
ff.count=idx;
});
}
if(!("pseudos" in _223)){
each(_222.pseudos,function(_225){
var pn=_225.name;
if(_216[pn]){
ff=_1fe(ff,_216[pn](pn,_225.value));
}
});
}
if(!("attrs" in _223)){
each(_222.attrs,function(attr){
var _226;
var a=attr.attr;
if(attr.type&&_205[attr.type]){
_226=_205[attr.type](a,attr.matchFor);
}else{
if(a.length){
_226=_221(a);
}
}
if(_226){
ff=_1fe(ff,_226);
}
});
}
if(!("id" in _223)){
if(_222.id){
ff=_1fe(ff,function(elem){
return (!!elem&&(elem.id==_222.id));
});
}
}
if(!ff){
if(!("default" in _223)){
ff=_1eb;
}
}
return ff;
};
var _227=function(_228){
return function(node,ret,bag){
while(node=node[_20e]){
if(_20d&&(!_202(node))){
continue;
}
if((!bag||_229(node,bag))&&_228(node)){
ret.push(node);
}
break;
}
return ret;
};
};
var _22a=function(_22b){
return function(root,ret,bag){
var te=root[_20e];
while(te){
if(_210(te)){
if(bag&&!_229(te,bag)){
break;
}
if(_22b(te)){
ret.push(te);
}
}
te=te[_20e];
}
return ret;
};
};
var _22c=function(_22d){
_22d=_22d||_1eb;
return function(root,ret,bag){
var te,x=0,tret=root[_1e8];
while(te=tret[x++]){
if(_210(te)&&(!bag||_229(te,bag))&&(_22d(te,x))){
ret.push(te);
}
}
return ret;
};
};
var _22e=function(node,root){
var pn=node.parentNode;
while(pn){
if(pn==root){
break;
}
pn=pn.parentNode;
}
return !!pn;
};
var _22f={};
var _230=function(_231){
var _232=_22f[_231.query];
if(_232){
return _232;
}
var io=_231.infixOper;
var oper=(io?io.oper:"");
var _233=_21d(_231,{el:1});
var qt=_231.tag;
var _234=("*"==qt);
var ecs=_1e6()["getElementsByClassName"];
if(!oper){
if(_231.id){
_233=(!_231.loops&&_234)?_1eb:_21d(_231,{el:1,id:1});
_232=function(root,arr){
var te=d.byId(_231.id,(root.ownerDocument||root));
if(!te||!_233(te)){
return;
}
if(9==root.nodeType){
return _201(te,arr);
}else{
if(_22e(te,root)){
return _201(te,arr);
}
}
};
}else{
if(ecs&&/\{\s*\[native code\]\s*\}/.test(String(ecs))&&_231.classes.length&&!_1e7){
_233=_21d(_231,{el:1,classes:1,id:1});
var _235=_231.classes.join(" ");
_232=function(root,arr,bag){
var ret=_201(0,arr),te,x=0;
var tret=root.getElementsByClassName(_235);
while((te=tret[x++])){
if(_233(te,root)&&_229(te,bag)){
ret.push(te);
}
}
return ret;
};
}else{
if(!_234&&!_231.loops){
_232=function(root,arr,bag){
var ret=_201(0,arr),te,x=0;
var tret=root.getElementsByTagName(_231.getTag());
while((te=tret[x++])){
if(_229(te,bag)){
ret.push(te);
}
}
return ret;
};
}else{
_233=_21d(_231,{el:1,tag:1,id:1});
_232=function(root,arr,bag){
var ret=_201(0,arr),te,x=0;
var tret=root.getElementsByTagName(_231.getTag());
while((te=tret[x++])){
if(_233(te,root)&&_229(te,bag)){
ret.push(te);
}
}
return ret;
};
}
}
}
}else{
var _236={el:1};
if(_234){
_236.tag=1;
}
_233=_21d(_231,_236);
if("+"==oper){
_232=_227(_233);
}else{
if("~"==oper){
_232=_22a(_233);
}else{
if(">"==oper){
_232=_22c(_233);
}
}
}
}
return _22f[_231.query]=_232;
};
var _237=function(root,_238){
var _239=_201(root),qp,x,te,qpl=_238.length,bag,ret;
for(var i=0;i<qpl;i++){
ret=[];
qp=_238[i];
x=_239.length-1;
if(x>0){
bag={};
ret.nozip=true;
}
var gef=_230(qp);
for(var j=0;(te=_239[j]);j++){
gef(te,ret,bag);
}
if(!ret.length){
break;
}
_239=ret;
}
return ret;
};
var _23a={},_23b={};
var _23c=function(_23d){
var _23e=_1ec(trim(_23d));
if(_23e.length==1){
var tef=_230(_23e[0]);
return function(root){
var r=tef(root,new qlc());
if(r){
r.nozip=true;
}
return r;
};
}
return function(root){
return _237(root,_23e);
};
};
var nua=navigator.userAgent;
var wk="WebKit/";
var _23f=(d.isWebKit&&(nua.indexOf(wk)>0)&&(parseFloat(nua.split(wk)[1])>528));
var _240=d.isIE?"commentStrip":"nozip";
var qsa="querySelectorAll";
var _241=(!!_1e6()[qsa]&&(!d.isSafari||(d.isSafari>3.1)||_23f));
var _242=/n\+\d|([^ ])?([>~+])([^ =])?/g;
var _243=function(_244,pre,ch,post){
return ch?(pre?pre+" ":"")+ch+(post?" "+post:""):_244;
};
var _245=function(_246,_247){
_246=_246.replace(_242,_243);
if(_241){
var _248=_23b[_246];
if(_248&&!_247){
return _248;
}
}
var _249=_23a[_246];
if(_249){
return _249;
}
var qcz=_246.charAt(0);
var _24a=(-1==_246.indexOf(" "));
if((_246.indexOf("#")>=0)&&(_24a)){
_247=true;
}
var _24b=(_241&&(!_247)&&(_1e9.indexOf(qcz)==-1)&&(!d.isIE||(_246.indexOf(":")==-1))&&(!(_1e7&&(_246.indexOf(".")>=0)))&&(_246.indexOf(":contains")==-1)&&(_246.indexOf(":checked")==-1)&&(_246.indexOf("|=")==-1));
if(_24b){
var tq=(_1e9.indexOf(_246.charAt(_246.length-1))>=0)?(_246+" *"):_246;
return _23b[_246]=function(root){
try{
if(!((9==root.nodeType)||_24a)){
throw "";
}
var r=root[qsa](tq);
r[_240]=true;
return r;
}
catch(e){
return _245(_246,true)(root);
}
};
}else{
var _24c=_246.split(/\s*,\s*/);
return _23a[_246]=((_24c.length<2)?_23c(_246):function(root){
var _24d=0,ret=[],tp;
while((tp=_24c[_24d++])){
ret=ret.concat(_23c(tp)(root));
}
return ret;
});
}
};
var _24e=0;
var _24f=d.isIE?function(node){
if(_1ea){
return (node.getAttribute("_uid")||node.setAttribute("_uid",++_24e)||_24e);
}else{
return node.uniqueID;
}
}:function(node){
return (node._uid||(node._uid=++_24e));
};
var _229=function(node,bag){
if(!bag){
return 1;
}
var id=_24f(node);
if(!bag[id]){
return bag[id]=1;
}
return 0;
};
var _250="_zipIdx";
var _251=function(arr){
if(arr&&arr.nozip){
return (qlc._wrap)?qlc._wrap(arr):arr;
}
var ret=new qlc();
if(!arr||!arr.length){
return ret;
}
if(arr[0]){
ret.push(arr[0]);
}
if(arr.length<2){
return ret;
}
_24e++;
if(d.isIE&&_1ea){
var _252=_24e+"";
arr[0].setAttribute(_250,_252);
for(var x=1,te;te=arr[x];x++){
if(arr[x].getAttribute(_250)!=_252){
ret.push(te);
}
te.setAttribute(_250,_252);
}
}else{
if(d.isIE&&arr.commentStrip){
try{
for(var x=1,te;te=arr[x];x++){
if(_202(te)){
ret.push(te);
}
}
}
catch(e){
}
}else{
if(arr[0]){
arr[0][_250]=_24e;
}
for(var x=1,te;te=arr[x];x++){
if(arr[x][_250]!=_24e){
ret.push(te);
}
te[_250]=_24e;
}
}
}
return ret;
};
d.query=function(_253,root){
qlc=d._NodeListCtor;
if(!_253){
return new qlc();
}
if(_253.constructor==qlc){
return _253;
}
if(typeof _253!="string"){
return new qlc(_253);
}
if(typeof root=="string"){
root=d.byId(root);
if(!root){
return new qlc();
}
}
root=root||_1e6();
var od=root.ownerDocument||root.documentElement;
_1ea=(root.contentType&&root.contentType=="application/xml")||(d.isOpera&&(root.doctype||od.toString()=="[object XMLDocument]"))||(!!od)&&(d.isIE?od.xml:(root.xmlVersion||od.xmlVersion));
var r=_245(_253)(root);
if(r&&r.nozip&&!qlc._wrap){
return r;
}
return _251(r);
};
d.query.pseudos=_216;
d._filterQueryResult=function(_254,_255,root){
var _256=new d._NodeListCtor(),_257=_1ec(_255),_258=(_257.length==1&&!/[^\w#\.]/.test(_255))?_21d(_257[0]):function(node){
return dojo.query(_255,root).indexOf(node)!=-1;
};
for(var x=0,te;te=_254[x];x++){
if(_258(te)){
_256.push(te);
}
}
return _256;
};
};
var _259=function(){
acme={trim:function(str){
str=str.replace(/^\s+/,"");
for(var i=str.length-1;i>=0;i--){
if(/\S/.test(str.charAt(i))){
str=str.substring(0,i+1);
break;
}
}
return str;
},forEach:function(arr,_25a,_25b){
if(!arr||!arr.length){
return;
}
for(var i=0,l=arr.length;i<l;++i){
_25a.call(_25b||window,arr[i],i,arr);
}
},byId:function(id,doc){
if(typeof id=="string"){
return (doc||document).getElementById(id);
}else{
return id;
}
},doc:document,NodeList:Array};
var n=navigator;
var dua=n.userAgent;
var dav=n.appVersion;
var tv=parseFloat(dav);
acme.isOpera=(dua.indexOf("Opera")>=0)?tv:undefined;
acme.isKhtml=(dav.indexOf("Konqueror")>=0)?tv:undefined;
acme.isWebKit=parseFloat(dua.split("WebKit/")[1])||undefined;
acme.isChrome=parseFloat(dua.split("Chrome/")[1])||undefined;
var _25c=Math.max(dav.indexOf("WebKit"),dav.indexOf("Safari"),0);
if(_25c&&!acme.isChrome){
acme.isSafari=parseFloat(dav.split("Version/")[1]);
if(!acme.isSafari||parseFloat(dav.substr(_25c+7))<=419.3){
acme.isSafari=2;
}
}
if(document.all&&!acme.isOpera){
acme.isIE=parseFloat(dav.split("MSIE ")[1])||undefined;
}
Array._wrap=function(arr){
return arr;
};
return acme;
};
if(this["dojo"]){
dojo.provide("dojo._base.query");
_1e5(this["queryPortability"]||this["acme"]||dojo);
}else{
_1e5(this["queryPortability"]||this["acme"]||_259());
}
})();
}
if(!dojo._hasResource["dojo._base.xhr"]){
dojo._hasResource["dojo._base.xhr"]=true;
dojo.provide("dojo._base.xhr");
(function(){
var _25d=dojo,cfg=_25d.config;
function _25e(obj,name,_25f){
if(_25f===null){
return;
}
var val=obj[name];
if(typeof val=="string"){
obj[name]=[val,_25f];
}else{
if(_25d.isArray(val)){
val.push(_25f);
}else{
obj[name]=_25f;
}
}
};
dojo.fieldToObject=function(_260){
var ret=null;
var item=_25d.byId(_260);
if(item){
var _261=item.name;
var type=(item.type||"").toLowerCase();
if(_261&&type&&!item.disabled){
if(type=="radio"||type=="checkbox"){
if(item.checked){
ret=item.value;
}
}else{
if(item.multiple){
ret=[];
_25d.query("option",item).forEach(function(opt){
if(opt.selected){
ret.push(opt.value);
}
});
}else{
ret=item.value;
}
}
}
}
return ret;
};
dojo.formToObject=function(_262){
var ret={};
var _263="file|submit|image|reset|button|";
_25d.forEach(dojo.byId(_262).elements,function(item){
var _264=item.name;
var type=(item.type||"").toLowerCase();
if(_264&&type&&_263.indexOf(type)==-1&&!item.disabled){
_25e(ret,_264,_25d.fieldToObject(item));
if(type=="image"){
ret[_264+".x"]=ret[_264+".y"]=ret[_264].x=ret[_264].y=0;
}
}
});
return ret;
};
dojo.objectToQuery=function(map){
var enc=encodeURIComponent;
var _265=[];
var _266={};
for(var name in map){
var _267=map[name];
if(_267!=_266[name]){
var _268=enc(name)+"=";
if(_25d.isArray(_267)){
for(var i=0;i<_267.length;i++){
_265.push(_268+enc(_267[i]));
}
}else{
_265.push(_268+enc(_267));
}
}
}
return _265.join("&");
};
dojo.formToQuery=function(_269){
return _25d.objectToQuery(_25d.formToObject(_269));
};
dojo.formToJson=function(_26a,_26b){
return _25d.toJson(_25d.formToObject(_26a),_26b);
};
dojo.queryToObject=function(str){
var ret={};
var qp=str.split("&");
var dec=decodeURIComponent;
_25d.forEach(qp,function(item){
if(item.length){
var _26c=item.split("=");
var name=dec(_26c.shift());
var val=dec(_26c.join("="));
if(typeof ret[name]=="string"){
ret[name]=[ret[name]];
}
if(_25d.isArray(ret[name])){
ret[name].push(val);
}else{
ret[name]=val;
}
}
});
return ret;
};
dojo._blockAsync=false;
var _26d=_25d._contentHandlers=dojo.contentHandlers={text:function(xhr){
return xhr.responseText;
},json:function(xhr){
return _25d.fromJson(xhr.responseText||null);
},"json-comment-filtered":function(xhr){
if(!dojo.config.useCommentedJson){
console.warn("Consider using the standard mimetype:application/json."+" json-commenting can introduce security issues. To"+" decrease the chances of hijacking, use the standard the 'json' handler and"+" prefix your json with: {}&&\n"+"Use djConfig.useCommentedJson=true to turn off this message.");
}
var _26e=xhr.responseText;
var _26f=_26e.indexOf("/*");
var _270=_26e.lastIndexOf("*/");
if(_26f==-1||_270==-1){
throw new Error("JSON was not comment filtered");
}
return _25d.fromJson(_26e.substring(_26f+2,_270));
},javascript:function(xhr){
return _25d.eval(xhr.responseText);
},xml:function(xhr){
var _271=xhr.responseXML;
if(_25d.isIE&&(!_271||!_271.documentElement)){
var ms=function(n){
return "MSXML"+n+".DOMDocument";
};
var dp=["Microsoft.XMLDOM",ms(6),ms(4),ms(3),ms(2)];
_25d.some(dp,function(p){
try{
var dom=new ActiveXObject(p);
dom.async=false;
dom.loadXML(xhr.responseText);
_271=dom;
}
catch(e){
return false;
}
return true;
});
}
return _271;
},"json-comment-optional":function(xhr){
if(xhr.responseText&&/^[^{\[]*\/\*/.test(xhr.responseText)){
return _26d["json-comment-filtered"](xhr);
}else{
return _26d["json"](xhr);
}
}};
dojo._ioSetArgs=function(args,_272,_273,_274){
var _275={args:args,url:args.url};
var _276=null;
if(args.form){
var form=_25d.byId(args.form);
var _277=form.getAttributeNode("action");
_275.url=_275.url||(_277?_277.value:null);
_276=_25d.formToObject(form);
}
var _278=[{}];
if(_276){
_278.push(_276);
}
if(args.content){
_278.push(args.content);
}
if(args.preventCache){
_278.push({"dojo.preventCache":new Date().valueOf()});
}
_275.query=_25d.objectToQuery(_25d.mixin.apply(null,_278));
_275.handleAs=args.handleAs||"text";
var d=new _25d.Deferred(_272);
d.addCallbacks(_273,function(_279){
return _274(_279,d);
});
var ld=args.load;
if(ld&&_25d.isFunction(ld)){
d.addCallback(function(_27a){
return ld.call(args,_27a,_275);
});
}
var err=args.error;
if(err&&_25d.isFunction(err)){
d.addErrback(function(_27b){
return err.call(args,_27b,_275);
});
}
var _27c=args.handle;
if(_27c&&_25d.isFunction(_27c)){
d.addBoth(function(_27d){
return _27c.call(args,_27d,_275);
});
}
if(cfg.ioPublish&&_25d.publish&&_275.args.ioPublish!==false){
d.addCallbacks(function(res){
_25d.publish("/dojo/io/load",[d,res]);
return res;
},function(res){
_25d.publish("/dojo/io/error",[d,res]);
return res;
});
d.addBoth(function(res){
_25d.publish("/dojo/io/done",[d,res]);
return res;
});
}
d.ioArgs=_275;
return d;
};
var _27e=function(dfd){
dfd.canceled=true;
var xhr=dfd.ioArgs.xhr;
var _27f=typeof xhr.abort;
if(_27f=="function"||_27f=="object"||_27f=="unknown"){
xhr.abort();
}
var err=dfd.ioArgs.error;
if(!err){
err=new Error("xhr cancelled");
err.dojoType="cancel";
}
return err;
};
var _280=function(dfd){
var ret=_26d[dfd.ioArgs.handleAs](dfd.ioArgs.xhr);
return ret===undefined?null:ret;
};
var _281=function(_282,dfd){
if(!dfd.ioArgs.args.failOk){
console.error(_282);
}
return _282;
};
var _283=null;
var _284=[];
var _285=0;
var _286=function(dfd){
if(_285<=0){
_285=0;
if(cfg.ioPublish&&_25d.publish&&(!dfd||dfd&&dfd.ioArgs.args.ioPublish!==false)){
_25d.publish("/dojo/io/stop");
}
}
};
var _287=function(){
var now=(new Date()).getTime();
if(!_25d._blockAsync){
for(var i=0,tif;i<_284.length&&(tif=_284[i]);i++){
var dfd=tif.dfd;
var func=function(){
if(!dfd||dfd.canceled||!tif.validCheck(dfd)){
_284.splice(i--,1);
_285-=1;
}else{
if(tif.ioCheck(dfd)){
_284.splice(i--,1);
tif.resHandle(dfd);
_285-=1;
}else{
if(dfd.startTime){
if(dfd.startTime+(dfd.ioArgs.args.timeout||0)<now){
_284.splice(i--,1);
var err=new Error("timeout exceeded");
err.dojoType="timeout";
dfd.errback(err);
dfd.cancel();
_285-=1;
}
}
}
}
};
if(dojo.config.debugAtAllCosts){
func.call(this);
}else{
try{
func.call(this);
}
catch(e){
dfd.errback(e);
}
}
}
}
_286(dfd);
if(!_284.length){
clearInterval(_283);
_283=null;
return;
}
};
dojo._ioCancelAll=function(){
try{
_25d.forEach(_284,function(i){
try{
i.dfd.cancel();
}
catch(e){
}
});
}
catch(e){
}
};
if(_25d.isIE){
_25d.addOnWindowUnload(_25d._ioCancelAll);
}
_25d._ioNotifyStart=function(dfd){
if(cfg.ioPublish&&_25d.publish&&dfd.ioArgs.args.ioPublish!==false){
if(!_285){
_25d.publish("/dojo/io/start");
}
_285+=1;
_25d.publish("/dojo/io/send",[dfd]);
}
};
_25d._ioWatch=function(dfd,_288,_289,_28a){
var args=dfd.ioArgs.args;
if(args.timeout){
dfd.startTime=(new Date()).getTime();
}
_284.push({dfd:dfd,validCheck:_288,ioCheck:_289,resHandle:_28a});
if(!_283){
_283=setInterval(_287,50);
}
if(args.sync){
_287();
}
};
var _28b="application/x-www-form-urlencoded";
var _28c=function(dfd){
return dfd.ioArgs.xhr.readyState;
};
var _28d=function(dfd){
return 4==dfd.ioArgs.xhr.readyState;
};
var _28e=function(dfd){
var xhr=dfd.ioArgs.xhr;
if(_25d._isDocumentOk(xhr)){
dfd.callback(dfd);
}else{
var err=new Error("Unable to load "+dfd.ioArgs.url+" status:"+xhr.status);
err.status=xhr.status;
err.responseText=xhr.responseText;
dfd.errback(err);
}
};
dojo._ioAddQueryToUrl=function(_28f){
if(_28f.query.length){
_28f.url+=(_28f.url.indexOf("?")==-1?"?":"&")+_28f.query;
_28f.query=null;
}
};
dojo.xhr=function(_290,args,_291){
var dfd=_25d._ioSetArgs(args,_27e,_280,_281);
var _292=dfd.ioArgs;
var xhr=_292.xhr=_25d._xhrObj(_292.args);
if(!xhr){
dfd.cancel();
return dfd;
}
if("postData" in args){
_292.query=args.postData;
}else{
if("putData" in args){
_292.query=args.putData;
}else{
if("rawBody" in args){
_292.query=args.rawBody;
}else{
if((arguments.length>2&&!_291)||"POST|PUT".indexOf(_290.toUpperCase())==-1){
_25d._ioAddQueryToUrl(_292);
}
}
}
}
xhr.open(_290,_292.url,args.sync!==true,args.user||undefined,args.password||undefined);
if(args.headers){
for(var hdr in args.headers){
if(hdr.toLowerCase()==="content-type"&&!args.contentType){
args.contentType=args.headers[hdr];
}else{
if(args.headers[hdr]){
xhr.setRequestHeader(hdr,args.headers[hdr]);
}
}
}
}
xhr.setRequestHeader("Content-Type",args.contentType||_28b);
if(!args.headers||!("X-Requested-With" in args.headers)){
xhr.setRequestHeader("X-Requested-With","XMLHttpRequest");
}
_25d._ioNotifyStart(dfd);
if(dojo.config.debugAtAllCosts){
xhr.send(_292.query);
}else{
try{
xhr.send(_292.query);
}
catch(e){
_292.error=e;
dfd.cancel();
}
}
_25d._ioWatch(dfd,_28c,_28d,_28e);
xhr=null;
return dfd;
};
dojo.xhrGet=function(args){
return _25d.xhr("GET",args);
};
dojo.rawXhrPost=dojo.xhrPost=function(args){
return _25d.xhr("POST",args,true);
};
dojo.rawXhrPut=dojo.xhrPut=function(args){
return _25d.xhr("PUT",args,true);
};
dojo.xhrDelete=function(args){
return _25d.xhr("DELETE",args);
};
})();
}
if(!dojo._hasResource["dojo._base.fx"]){
dojo._hasResource["dojo._base.fx"]=true;
dojo.provide("dojo._base.fx");
(function(){
var d=dojo;
var _293=d._mixin;
dojo._Line=function(_294,end){
this.start=_294;
this.end=end;
};
dojo._Line.prototype.getValue=function(n){
return ((this.end-this.start)*n)+this.start;
};
dojo.Animation=function(args){
_293(this,args);
if(d.isArray(this.curve)){
this.curve=new d._Line(this.curve[0],this.curve[1]);
}
};
d._Animation=d.Animation;
d.extend(dojo.Animation,{duration:350,repeat:0,rate:20,_percent:0,_startRepeatCount:0,_getStep:function(){
var _295=this._percent,_296=this.easing;
return _296?_296(_295):_295;
},_fire:function(evt,args){
var a=args||[];
if(this[evt]){
if(d.config.debugAtAllCosts){
this[evt].apply(this,a);
}else{
try{
this[evt].apply(this,a);
}
catch(e){
console.error("exception in animation handler for:",evt);
console.error(e);
}
}
}
return this;
},play:function(_297,_298){
var _299=this;
if(_299._delayTimer){
_299._clearTimer();
}
if(_298){
_299._stopTimer();
_299._active=_299._paused=false;
_299._percent=0;
}else{
if(_299._active&&!_299._paused){
return _299;
}
}
_299._fire("beforeBegin",[_299.node]);
var de=_297||_299.delay,_29a=dojo.hitch(_299,"_play",_298);
if(de>0){
_299._delayTimer=setTimeout(_29a,de);
return _299;
}
_29a();
return _299;
},_play:function(_29b){
var _29c=this;
if(_29c._delayTimer){
_29c._clearTimer();
}
_29c._startTime=new Date().valueOf();
if(_29c._paused){
_29c._startTime-=_29c.duration*_29c._percent;
}
_29c._active=true;
_29c._paused=false;
var _29d=_29c.curve.getValue(_29c._getStep());
if(!_29c._percent){
if(!_29c._startRepeatCount){
_29c._startRepeatCount=_29c.repeat;
}
_29c._fire("onBegin",[_29d]);
}
_29c._fire("onPlay",[_29d]);
_29c._cycle();
return _29c;
},pause:function(){
var _29e=this;
if(_29e._delayTimer){
_29e._clearTimer();
}
_29e._stopTimer();
if(!_29e._active){
return _29e;
}
_29e._paused=true;
_29e._fire("onPause",[_29e.curve.getValue(_29e._getStep())]);
return _29e;
},gotoPercent:function(_29f,_2a0){
var _2a1=this;
_2a1._stopTimer();
_2a1._active=_2a1._paused=true;
_2a1._percent=_29f;
if(_2a0){
_2a1.play();
}
return _2a1;
},stop:function(_2a2){
var _2a3=this;
if(_2a3._delayTimer){
_2a3._clearTimer();
}
if(!_2a3._timer){
return _2a3;
}
_2a3._stopTimer();
if(_2a2){
_2a3._percent=1;
}
_2a3._fire("onStop",[_2a3.curve.getValue(_2a3._getStep())]);
_2a3._active=_2a3._paused=false;
return _2a3;
},status:function(){
if(this._active){
return this._paused?"paused":"playing";
}
return "stopped";
},_cycle:function(){
var _2a4=this;
if(_2a4._active){
var curr=new Date().valueOf();
var step=(curr-_2a4._startTime)/(_2a4.duration);
if(step>=1){
step=1;
}
_2a4._percent=step;
if(_2a4.easing){
step=_2a4.easing(step);
}
_2a4._fire("onAnimate",[_2a4.curve.getValue(step)]);
if(_2a4._percent<1){
_2a4._startTimer();
}else{
_2a4._active=false;
if(_2a4.repeat>0){
_2a4.repeat--;
_2a4.play(null,true);
}else{
if(_2a4.repeat==-1){
_2a4.play(null,true);
}else{
if(_2a4._startRepeatCount){
_2a4.repeat=_2a4._startRepeatCount;
_2a4._startRepeatCount=0;
}
}
}
_2a4._percent=0;
_2a4._fire("onEnd",[_2a4.node]);
!_2a4.repeat&&_2a4._stopTimer();
}
}
return _2a4;
},_clearTimer:function(){
clearTimeout(this._delayTimer);
delete this._delayTimer;
}});
var ctr=0,_2a5=null,_2a6={run:function(){
}};
d.extend(d.Animation,{_startTimer:function(){
if(!this._timer){
this._timer=d.connect(_2a6,"run",this,"_cycle");
ctr++;
}
if(!_2a5){
_2a5=setInterval(d.hitch(_2a6,"run"),this.rate);
}
},_stopTimer:function(){
if(this._timer){
d.disconnect(this._timer);
this._timer=null;
ctr--;
}
if(ctr<=0){
clearInterval(_2a5);
_2a5=null;
ctr=0;
}
}});
var _2a7=d.isIE?function(node){
var ns=node.style;
if(!ns.width.length&&d.style(node,"width")=="auto"){
ns.width="auto";
}
}:function(){
};
dojo._fade=function(args){
args.node=d.byId(args.node);
var _2a8=_293({properties:{}},args),_2a9=(_2a8.properties.opacity={});
_2a9.start=!("start" in _2a8)?function(){
return +d.style(_2a8.node,"opacity")||0;
}:_2a8.start;
_2a9.end=_2a8.end;
var anim=d.animateProperty(_2a8);
d.connect(anim,"beforeBegin",d.partial(_2a7,_2a8.node));
return anim;
};
dojo.fadeIn=function(args){
return d._fade(_293({end:1},args));
};
dojo.fadeOut=function(args){
return d._fade(_293({end:0},args));
};
dojo._defaultEasing=function(n){
return 0.5+((Math.sin((n+1.5)*Math.PI))/2);
};
var _2aa=function(_2ab){
this._properties=_2ab;
for(var p in _2ab){
var prop=_2ab[p];
if(prop.start instanceof d.Color){
prop.tempColor=new d.Color();
}
}
};
_2aa.prototype.getValue=function(r){
var ret={};
for(var p in this._properties){
var prop=this._properties[p],_2ac=prop.start;
if(_2ac instanceof d.Color){
ret[p]=d.blendColors(_2ac,prop.end,r,prop.tempColor).toCss();
}else{
if(!d.isArray(_2ac)){
ret[p]=((prop.end-_2ac)*r)+_2ac+(p!="opacity"?prop.units||"px":0);
}
}
}
return ret;
};
dojo.animateProperty=function(args){
var n=args.node=d.byId(args.node);
if(!args.easing){
args.easing=d._defaultEasing;
}
var anim=new d.Animation(args);
d.connect(anim,"beforeBegin",anim,function(){
var pm={};
for(var p in this.properties){
if(p=="width"||p=="height"){
this.node.display="block";
}
var prop=this.properties[p];
if(d.isFunction(prop)){
prop=prop(n);
}
prop=pm[p]=_293({},(d.isObject(prop)?prop:{end:prop}));
if(d.isFunction(prop.start)){
prop.start=prop.start(n);
}
if(d.isFunction(prop.end)){
prop.end=prop.end(n);
}
var _2ad=(p.toLowerCase().indexOf("color")>=0);
function _2ae(node,p){
var v={height:node.offsetHeight,width:node.offsetWidth}[p];
if(v!==undefined){
return v;
}
v=d.style(node,p);
return (p=="opacity")?+v:(_2ad?v:parseFloat(v));
};
if(!("end" in prop)){
prop.end=_2ae(n,p);
}else{
if(!("start" in prop)){
prop.start=_2ae(n,p);
}
}
if(_2ad){
prop.start=new d.Color(prop.start);
prop.end=new d.Color(prop.end);
}else{
prop.start=(p=="opacity")?+prop.start:parseFloat(prop.start);
}
}
this.curve=new _2aa(pm);
});
d.connect(anim,"onAnimate",d.hitch(d,"style",anim.node));
return anim;
};
dojo.anim=function(node,_2af,_2b0,_2b1,_2b2,_2b3){
return d.animateProperty({node:node,duration:_2b0||d.Animation.prototype.duration,properties:_2af,easing:_2b1,onEnd:_2b2}).play(_2b3||0);
};
})();
}
if(!dojo._hasResource["dojo._base.browser"]){
dojo._hasResource["dojo._base.browser"]=true;
dojo.provide("dojo._base.browser");
dojo.forEach(dojo.config.require,function(i){
dojo["require"](i);
});
}
if(!dojo._hasResource["dojo._base"]){
dojo._hasResource["dojo._base"]=true;
dojo.provide("dojo._base");
}
if(dojo.isBrowser&&(document.readyState==="complete"||dojo.config.afterOnLoad)){
window.setTimeout(dojo._loadInit,100);
}
})();
