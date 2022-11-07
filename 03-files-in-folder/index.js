const fs = require('fs');
const path = require('path');
const {stdout} = process;



fs.readdir(path.join(__dirname,'secret-folder')
          ,{withFileTypes: true}
          ,(err,files) => {
    if (err) console.error(err)
    else files.forEach(file => {
        fs.stat(path.join(__dirname,'secret-folder',file.name)
               ,(err,stats) => {
            if (err) console.error(err)
            else {
                if(file.isDirectory() === false) stdout.write(file.name.replace('.', ' - ') + ' - ' + stats.size + ' b\n')
            }
        })
    })
})
