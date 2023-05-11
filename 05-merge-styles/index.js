const fs = require('fs');
const path = require('path');


fs.unlink(path.join(__dirname, 'project-dist','bundle.css'), (err) => {
  if (err) console.error(err);
});

fs.readdir(path.join(__dirname,'styles')
  ,{withFileTypes: true}
  ,(err,files) => {
    if (err) console.error(err);
    else files.forEach(file => {
      if (err) console.error(err);
      else {
        if(file.isDirectory() === false && path.extname(file.name) == '.css') {
          const readableStream = fs.createReadStream(path.join(__dirname,'styles',file.name));
          readableStream.on('data', (data) => {
            fs.appendFile(path.join(__dirname, 'project-dist','bundle.css')
              ,data
              ,err => {if (err) console.error(err);});
          });
        }
      }
    });
  });





