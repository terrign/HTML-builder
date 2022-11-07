const fs = require('fs');
const path = require('path');
const { stdin, stdout } = process;
const output = fs.createWriteStream(path.join(__dirname,'text.txt'));


stdout.write('Please enter text or type "exit" if you want to exit\n')

output.on('data', chunk => output.write(chunk))

stdin.on('data', data => {
    const str = data.toString()
    if (str.trim() == 'exit') {
        stdout.write('Good bye')
        process.exit()
    }
    else output.write(str)  
})



