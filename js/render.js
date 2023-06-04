let fs = require("fs");
let fse = require("fs-extra");
let ejs = require("ejs");

let site_conf = JSON.parse(fs.readFileSync(process.argv[2]).toString());
let json = JSON.parse(fs.readFileSync(site_conf.pages+"/conf.json").toString());
let _path=site_conf.pages.split("/");

let site_templates=[];
let site_things=[];
let authors=JSON.parse(fs.readFileSync(site_conf.authors).toString());

for (let item in site_conf.types){
    let conf=JSON.parse(fs.readFileSync(site_conf.types[item].conf).toString());
    site_things[item]=conf;
}

for (let item in json){
    let text = fs.readFileSync(`${_path}/${item}`).toString();
    if (json[item].type=="z-static"){
        let file_parent_path=json[item].destination.replace("root",site_conf.publicroot);
        fse.ensureDirSync(file_parent_path);
        fs.writeFile(`${file_parent_path}index.html`,text,()=>{});
    }

    else if (json[item].type=="z-ejs"){
        let content=ejs.render(text,{site_conf,filename:`${_path}/${item}`,all:site_things});
        let file_parent_path=json[item].destination.replace("root",site_conf.publicroot);
        fse.ensureDirSync(file_parent_path);
        fs.writeFile(`${file_parent_path}index.html`,content,()=>{});
    }

    else if (json[item].type=="t-ejs"){
        site_templates[json[item].template]={t:text,p:`${_path}/${item}`};
    }

    else if (json[item].type=="404")
        fs.writeFile(`${site_conf.publicroot}/404.html`,text,()=>{});
}

for (let item in site_things){
    let conf=site_things[item];
    let template=site_templates[site_conf.types[item].template];
    for(let element of conf){
        let author = authors[element.author];
        let blog = element;
        let write_dir=`public/pages/blog/${element.time}/${element.sid}${element.title}/`;
        let content = ejs.render(template.t,{site_conf,filename:template.p,all:site_things,author,blog});
        fse.ensureDirSync(write_dir);
        fs.writeFile(`${write_dir}index.html`,content,(err)=>{if(err)throw err});
    }
}