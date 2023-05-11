const fs = require('fs');
const path = require('path');
const fp = require('fs/promises');


(async function() {
  try {
    await fp.rm(path.join(__dirname, 'project-dist'), {recursive:true});
  } catch {}
  await fp.mkdir(path.join(__dirname, 'project-dist'), {recursive:true})
    .then(() => {
      createHtml();
      mergeStyles();
      copyAssets();
    });
})();

//replace pseudotags and write Index.html
async function createHtml() {
  await fp.copyFile(path.join(__dirname,'template.html'), path.join(__dirname,'project-dist','index.html'));
  let html = await fp.readFile(path.join(__dirname, 'project-dist', 'index.html'), 'utf8');
  const components = await fp.readdir(path.join(__dirname, 'components'));
  for (let c of components) {
    if(path.extname(path.join(__dirname, 'components', c)).trim() == '.html') {
      const tag = await fp.readFile(path.join(__dirname, 'components', c));
      const pseudoTag = `{{${c.replace('.html','').trim()}}}`;
      html = html.replace(pseudoTag, tag);
    } else console.error('Not a html tag');
  }
  await fp.writeFile(path.join(__dirname,'project-dist','index.html'), html);
}


// merge styles into style.css
async function mergeStyles() {
  fs.access(path.join(__dirname, 'project-dist','style.css'), fs.F_OK, (err) => {
    if (err) return;
    fs.unlink(path.join(__dirname, 'project-dist','style.css'), (err) => {
      if (err) console.error(err);
    });
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
              fs.appendFile(path.join(__dirname, 'project-dist','style.css')
                ,data
                ,err => {if (err) console.error(err);});
            });
          }
        }
      });
    });
}


async function copyAssets() {
  fs.mkdir(path.join(__dirname, 'project-dist', 'assets'), {recursive: true}
    ,(err) => {if(err) console.error(err);});

  fs.readdir(path.join(__dirname,'assets')
    ,{withFileTypes: true}
    ,(err,files) => {
      if (err) console.error(err);
      else files.forEach(dir => {
        if(dir.isDirectory()) {
          fs.mkdir(path.join(__dirname, 'project-dist', 'assets', dir.name), {recursive: true}
            ,(err) => {if(err) console.error(err);});
          fs.readdir(path.join(__dirname,'assets',dir.name)
            ,{withFileTypes: true}
            ,(err,files) => {
              if (err) console.error(err);
              else files.forEach(file => {
                fs.copyFile(path.join(__dirname,'assets', dir.name, file.name)
                  ,path.join(__dirname,'project-dist', 'assets', dir.name, file.name)
                  ,(err) => {if(err) console.error(err);});
              });
            });
        }
      });
    });
}












