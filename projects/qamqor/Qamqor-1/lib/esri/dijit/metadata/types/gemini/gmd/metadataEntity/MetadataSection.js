//>>built
require({cache:{"url:esri/dijit/metadata/types/gemini/gmd/metadataEntity/templates/MetadataSection.html":'\x3cdiv data-dojo-attach-point\x3d"containerNode"\x3e\r\n  \x3cdiv data-dojo-type\x3d"esri/dijit/metadata/form/Tabs"\x3e\r\n    \x3c!-- specific for Gemini --\x3e\r\n    \x3cdiv data-dojo-type\x3d"esri/dijit/metadata/types/gemini/gmd/metadataEntity/MetadataIdentifier"\r\n      data-dojo-props\x3d"label:\'${i18nIso.metadataSection.identifier}\'"\x3e\x3c/div\x3e\r\n    \x3cdiv data-dojo-type\x3d"esri/dijit/metadata/types/iso/gmd/metadataEntity/MetadataContact"\r\n      data-dojo-props\x3d"label:\'${i18nIso.metadataSection.contact}\'"\x3e\x3c/div\x3e\r\n    \x3cdiv data-dojo-type\x3d"esri/dijit/metadata/types/iso/gmd/metadataEntity/MetadataDate"\r\n      data-dojo-props\x3d"label:\'${i18nIso.metadataSection.date}\'"\x3e\x3c/div\x3e\r\n    \x3cdiv data-dojo-type\x3d"esri/dijit/metadata/types/iso/gmd/metadataEntity/MetadataStandard"\r\n      data-dojo-props\x3d"label:\'${i18nIso.metadataSection.standard}\'"\x3e\x3c/div\x3e\r\n    \x3cdiv data-dojo-type\x3d"esri/dijit/metadata/types/iso/gmd/metadataEntity/MetadataReference"\r\n      data-dojo-props\x3d"label:\'${i18nIso.metadataSection.reference}\'"\x3e\x3c/div\x3e\r\n  \x3c/div\x3e\r\n\x3c/div\x3e'}});
define("esri/dijit/metadata/types/gemini/gmd/metadataEntity/MetadataSection","dojo/_base/declare dojo/_base/lang dojo/has ../../../../base/Descriptor ../../../../form/Tabs ../metadataEntity/MetadataIdentifier ../../../iso/gmd/metadataEntity/MetadataContact ../../../iso/gmd/metadataEntity/MetadataDate ../../../iso/gmd/metadataEntity/MetadataReference ../../../iso/gmd/metadataEntity/MetadataStandard dojo/text!./templates/MetadataSection.html ../../../../../../kernel".split(" "),function(a,b,c,d,g,h,
k,l,m,n,e,f){a=a(d,{templateString:e});c("extend-esri")&&b.setObject("dijit.metadata.types.gemini.gmd.metadataEntity.MetadataSection",a,f);return a});