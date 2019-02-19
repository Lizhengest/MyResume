/**
 * Created by 89426 on 2019/1/21.
 */
let fs=require('fs'),
    path=require('path');
//存储当前模块执行所在的绝对路径（而不是__dirname 这是当前文件所在路径）
let dirname=path.resolve();
//mkdir('./路径+文件夹名字',err=>{})
//rmdir(同上)
//readdir('./路径+文件夹名字'，（err，result）=》{})
//readFile('./路径+文件名'，‘utf8’,(err,result)=>{})
//copyFile('./package.json','./less/',(err=>{}))
//unlink('./less/1.less',err=>{})
['mkdir','rmdir','readdir','readFile','copyFile','unlink'].forEach(item=>{
    module.exports[item]=function (pathname,copypath='') {
        console.log(dirname, pathname);
        pathname=path.resolve(dirname,pathname);
        console.log(pathname);
        copypath=path.resolve(dirname,copypath);
        return new Promise((resolve,reject)=>{
           //回调函数
            let arg=[(err,result)=>{
                if(err){
                    reject(err);
                return;
                }
                resolve(result||'');
            }];
            if (item === 'readFile') {
                console.log(pathname);
                //=>非图片或者音视频等富媒体资源设置UTF-8
                if (!/(JPG|JPEG|PNG|GIF|SVG|ICO|BMP|EOT|TTF|WOFF|MP3|MP4|OGG|WAV|M4A|WMV|AVI)$/i.test(pathname)) {
                    arg.unshift('utf8');
                }
            }
            item==='copyFile'?arg.unshift(copypath):null;
            fs[item](pathname,...arg);
        });
    };
});

//fs.writeFile('./路径','haha','utf8',err=>{})
//fs.appendFile('./less/1.less','呵呵','utf8',err=>{})
['writeFile', 'appendFile'].forEach(item=> {
    module.exports[item] = function (pathname, content) {
        pathname = path.resolve(dirname, pathname);
        if (typeof(content) !== 'string') {
            content = JSON.stringify(content);
        }

        return new Promise((resolve, reject)=> {
            fs[item](pathname, content, 'utf8', (err, result) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(result || '');
            });
        });

    }}
    );
