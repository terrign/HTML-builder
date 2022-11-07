const fs = require('fs');
const path = require('path');

fs.mkdir(path.join(__dirname, 'files-copy')
       ,(err) => {if(err) console.error(err)})

fs.readdir(path.join(__dirname,'files')
          ,{withFileTypes: true}
          ,(err,files) => {
    if (err) console.error(err)
    else files.forEach(file => {
        fs.copyFile(path.join(__dirname,'files', file.name)
                   ,path.join(__dirname,'files-copy', file.name)
                   ,(err) => {if(err) console.error(err)})
    })
})