const fs = require("fs");
const path = require("path");
const cp = require("child_process");
/*
用于提示选择配置目录

选择Template下的目录，选择完成后，将目标目录拷贝到当前目录

*/

var base = path.join(__dirname, "Template");

var template = "";

var current_sels = []; //当前选择项

var configure = []; 

var configure_cur = {};
 
var configure_step = -1; //当前步骤

//加载模板列表
var templates = fs.readdirSync(base);
if(!templates.length){
	console.log("no template");
	process.exit(1);
}

//显示选择项列表
function ShowSelect(arr, resel){	
	if(!resel){
		current_sels = arr;
		for(var i=0;i<current_sels.length;i++){
			console.log("["+(i + 1)+"] " + current_sels[i]);
		}	
	}
	console.log("Plaece select by input number [1-" + current_sels.length + "]");
}

//拷贝目录
function CopyDirectory(src, dest, excl) {
    if (fs.existsSync(dest) == false) {
        fs.mkdirSync(dest);
    }

    // console.log("src:" + src + ", dest:" + dest); 
	var dirs = fs.readdirSync(src);
    dirs.forEach(function(item){
        var item_path = path.join(src, item);
        var temp = fs.statSync(item_path);
		if (temp.isFile()) { // 是文件
			//console.log("copy "+item);    
			if(excl && excl[item]){
				
			}else{
				fs.copyFileSync(item_path, path.join(dest, item));
			}            
        } else if (temp.isDirectory()){ // 是目录            
            CopyDirectory(item_path, path.join(dest, item));
        }
    });
}


//查找目录
function FindDirectory(src, regexp){
	var subfiles = fs.readdirSync(src);
    for(var i=0;i<subfiles.length;i++){
		var item_path = path.join(src, subfiles[i]);
		var temp = fs.statSync(item_path);
		if(regexp.test(item_path)){
			return regexp.exec(item_path)[1];
		}else{
			if(temp.isFile()){
				
			}else{
				var sub = FindDirectory(item_path, regexp);
				if(sub)return sub;
			}
		}
	}
	return null;
}

//加载配置
function LoadConfigure(){
	try{
		var cfgdata = fs.readFileSync(template + "/configure.json");
		var cfg = JSON.parse(cfgdata);	
		configure = cfg;
	}catch(e){
		
	}
}

//执行单次结果
function DoConfigureResult(sel){
	if(configure_cur.save){
		fs.writeFileSync(configure_cur.save, sel);
	}
}

//执行单步配置
function DoConfigureStep(){
	var cfgs = configure[configure_step];
	configure_cur = cfgs;
	console.log("-------------------------------------------");
	if(cfgs.desc)console.log(cfgs.desc);
	if(cfgs.type == "SELECT_DIR"){
		var dir;
		if(cfgs.regexp){
			var reg = new RegExp(cfgs.regexp);
			dir = FindDirectory(".",reg);			
		}else{
			dir = cfgs.dir;
		}		
		var subfiles = fs.readdirSync(dir);
		var subdirs = [];
		for(var i in subfiles){
			if(fs.statSync(dir + "/" + subfiles[i]).isDirectory()){
				subdirs.push(subfiles[i]);
			}
		}
		ShowSelect(subdirs);
	}else{
		throw new Error("unsupport type : " + cfgs.type);
	}
}

//是否有下一步
function HasNextStep(){
	if(configure.length > configure_step){
		return true;
	}
	return false;
}


//拷贝到目标目录
function DoInstall(sel){
	 
	var fromdir = path.join(base, sel);
	template = fromdir;
	console.log("copy files ...");
	excl = {};
	excl["configure.json"] = 1;
	CopyDirectory(fromdir, ".", excl);	
}


//执行下一步
function ProcessResult(selstr){
	if(configure_step < 0 ){
		DoInstall(selstr);
		LoadConfigure();
	}else{
		DoConfigureResult(selstr);
		//DoConfigureStep();	
	}
	configure_step ++;
	if(HasNextStep()){
		DoConfigureStep();
	}else{
		console.log("project init ok");
		process.exit(0);		
	}	
}


//选择之后，验证结果，进入下一步
function AfterSelect(sel){
	if(sel>0 && sel <= current_sels.length){
		var seldir = current_sels[sel - 1];
		console.log("Select: " + seldir);
		ProcessResult(seldir);
	}else{
		ShowSelect(null, true);
	}	
}

//处理stdin输入
process.stdin.on('data', function(data){
	var sel;	
	try{
		sel = parseInt(data.toString()); 
	}catch(e){
		ShowSelect(null, true);
		return;
	}

	AfterSelect(sel);
});

console.log("==================== Project Wizard ====================");
console.log("  for create code project from template");
console.log(" ");

ShowSelect(templates);





