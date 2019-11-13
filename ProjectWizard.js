const fs = require("fs");
const path = require("path");

/*
用于提示选择配置目录

选择Template下的目录，选择完成后，将目标目录拷贝到当前目录

*/

var base = path.join(__dirname, "Template");

var template = "";

var templates = fs.readdirSync(base);
if(!templates.length){
	console.log("no template");
	process.exit(1);
}


function showTemplates(){
	for(var i=0;i<templates.length;i++){
		console.log("["+(i + 1)+"] " + templates[i]);
	}
}

function CopyDirectory(src, dest) {
    if (fs.existsSync(dest) == false) {
        fs.mkdirSync(dest);
    }

    // console.log("src:" + src + ", dest:" + dest); 
	var dirs = fs.readdirSync(src);
    dirs.forEach(function(item){
        var item_path = path.join(src, item);
        var temp = fs.statSync(item_path);
		if (temp.isFile()) { // 是文件
			console.log("copy "+item);       
            fs.copyFileSync(item_path, path.join(dest, item));
        } else if (temp.isDirectory()){ // 是目录            
            CopyDirectory(item_path, path.join(dest, item));
        }
    });
}


//目录已经选择完成
function doInstall(){
	CopyDirectory(path.join(base, template), ".");
	console.log("project init ok");
	process.exit(0);
}


function showSelect(){
	console.log("Select by input number [1-" +  templates.length + "]:");
}



//处理stdin输入
process.stdin.on('data', function(data){
	var sel;	
	try{
		sel = parseInt(data.toString()); 
	}catch(e){
		showSelect();
		return;
	}

	if(sel>0 && sel <= templates.length){
		var seldir = templates[sel - 1];
		console.log("Select: " + seldir);
		template = seldir;
		doInstall();		
	}else{
		showSelect();
	}
});

console.log("==================== Project Wizard ====================");
console.log("  for create code project from template");
console.log(" ");

showTemplates();

showSelect();





