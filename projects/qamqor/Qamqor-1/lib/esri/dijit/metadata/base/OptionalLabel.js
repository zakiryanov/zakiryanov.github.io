//>>built
require({cache:{"url:esri/dijit/metadata/base/templates/OptionalLabel.html":'\x3cdiv class\x3d"gxeLabelContainer gxeOptionalLabel"\x3e\r\n  \x3cdiv class\x3d"gxeSwitchToggle" title\x3d"${i18nBase.optionalNode.switchTip}"\r\n    data-dojo-attach-point\x3d"switchNode"\r\n    data-dojo-attach-event\x3d"onclick: _onClick"\x3e\r\n  \x3c/div\x3e\r\n  \x3cdiv class\x3d"gxeSwitchLabel" \r\n    data-dojo-attach-point\x3d"labelNode"\r\n    data-dojo-attach-event\x3d"onclick: _onClick"\r\n    \x3e${label}\x3c/div\x3e\r\n\x3c/div\x3e'}});
define("esri/dijit/metadata/base/OptionalLabel","dojo/_base/declare dojo/_base/lang dojo/dom-class dojo/dom-construct dojo/dom-style dojo/has ../../../kernel ./Templated dojo/text!./templates/OptionalLabel.html".split(" "),function(b,d,c,k,l,e,f,g,h){b=b([g],{checkedAttr:"",label:null,templateString:h,postCreate:function(){this.inherited(arguments);null!=this.checkedAttr&&0<this.checkedAttr.length&&this.setChecked(!0)},_onClick:function(){var a=c.contains(this.switchNode,"checked");this.setChecked(!a);
this.onClick(!a)},onClick:function(a){},setChecked:function(a){a?c.add(this.switchNode,"checked"):c.remove(this.switchNode,"checked")}});e("extend-esri")&&d.setObject("dijit.metadata.base.OptionalLabel",b,f);return b});