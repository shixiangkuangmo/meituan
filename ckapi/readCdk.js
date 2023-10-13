const readline = require('readline');
const fs = require('fs');
const events = require('events');

console.log(12);
(async function processLineByLine() {
  try {
    const r1 = readline.createInterface({
      input: fs.createReadStream('./CDK.txt'),
    });
    let rdata1 = fs.readFileSync('./cdk.json', 'utf8');
    let cdkdata = JSON.parse(rdata1);
    var i = 1;
    r1.on('line', line => {
      cdkdata.push(line);
      console.log(line);
      i += 1;
    });
    await events.once(r1, 'close');
    let upcdk = JSON.stringify(cdkdata, null, 2);
    fs.writeFileSync('./cdk.json', upcdk);
    console.log('Reading file line by line with readline done.');
  } catch (err) {
    console.error(err);
  }
})();
