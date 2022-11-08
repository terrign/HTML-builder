const fs = require('fs');
const path = require('path');
const fsPromises = require('fs/promises');

//create folder
fs.mkdir(path.join(__dirname, 'project-dist')
       ,(err) => {if(err) console.error(err)})


// merge styles into style.css
fs.readdir(path.join(__dirname,'styles')
          ,{withFileTypes: true}
          ,(err,files) => {
    if (err) console.error(err)
    else files.forEach(file => {
        if (err) console.error(err)
        else {
            if(file.isDirectory() === false && path.extname(file.name) == '.css') {
                const readableStream = fs.createReadStream(path.join(__dirname,'styles',file.name));
                readableStream.on('data', (data) => {
                    fs.appendFile(path.join(__dirname, 'project-dist','style.css')
                                            ,data
                                            ,err => {if (err) console.error(err)})
                });
            }
        }
    })
})


//create assets folder
fs.mkdir(path.join(__dirname, 'project-dist', 'assets')
       ,(err) => {if(err) console.error(err)})

//copy subfolders with files
fs.readdir(path.join(__dirname,'assets')
          ,{withFileTypes: true}
          ,(err,files) => {
    if (err) console.error(err)
    else files.forEach(dir => {
        if(dir.isDirectory()) {
            fs.mkdir(path.join(__dirname, 'project-dist', 'assets', dir.name)
                             ,(err) => {if(err) console.error(err)})
            fs.readdir(path.join(__dirname,'assets',dir.name)
                     ,{withFileTypes: true}
                     ,(err,files) => {
                if (err) console.error(err)
                else files.forEach(file => {
                fs.copyFile(path.join(__dirname,'assets', dir.name, file.name)
                                     ,path.join(__dirname,'project-dist', 'assets', dir.name, file.name)
                                    ,(err) => {if(err) console.error(err)})
                })
            })
        }
    })
})


//replace pseudotags and write Index.html
async function createIndexHtml() {
    await fsPromises.copyFile(path.join(__dirname,'template.html'), path.join(__dirname,'project-dist','index.html'));
    let html = await fsPromises.readFile(path.join(__dirname, 'project-dist', 'index.html'), 'utf8')
    const components = await fsPromises.readdir(path.join(__dirname, 'components'))
    for (let c of components) {
        if(path.extname(path.join(__dirname, 'components', c)).trim() == '.html') {
            const tag = await fsPromises.readFile(path.join(__dirname, 'components', c))
            const pseudoTag = `{{${c.replace('.html','').trim()}}}`
            html = html.replace(pseudoTag, tag)
        } else console.error('Not a html tag')
    }
    await fsPromises.writeFile(path.join(__dirname,'project-dist','index.html'), html)
}
createIndexHtml()








