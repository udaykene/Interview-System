import fs from 'fs';
fetch('https://raw.githubusercontent.com/engineer-man/piston/master/packages/java/15.0.2/run')
  .then(res => res.text())
  .then(text => console.log(text));
