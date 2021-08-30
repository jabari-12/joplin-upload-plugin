const plantumlEncoder = require('plantuml-encoder')
const fs = require("fs")

console.log('start sync read'); //同步读取开始
var noteUpload = fs.readFileSync('test/test.md', 'utf-8'); //date为文本内容
console.log('end sync read');    //同步读取结束

// replace all plantuml
var uml_text = noteUpload.match(/```plantuml([\s\S]*?)```/g);
//var uml_text = noteUpload.match(/```plantuml/g);
if (uml_text != null) {
	for (var i in uml_text) {
		console.log("--------------------------------");
		console.log(uml_text[i]);
		var plant_uml = uml_text[i].replace("```plantuml", "").replace("```", "");
		console.log("--------------------------------");
		console.log(plant_uml);
		var encoded_uml = plantumlEncoder.encode(plant_uml);
		var encode_url = 'http://www.plantuml.com/plantuml/svg/' + encoded_uml;
		noteUpload = noteUpload.replace(uml_text[i], encode_url);
		
		console.log("uml: " + encode_url);
	}
}

console.log("*********************************");
console.log(noteUpload)