const fs = require('fs');
// var text2png = require('text2png');
// fs.writeFileSync('out.png', text2png('現在風速', {
//     font: '10px huninn',
//     localFontPath: './fonts/jf-openhuninn-2.0.ttf',
//     localFontName: 'huninn'
// }));
const Canvas = require('canvas');

process.env.FONTCONFIG_PATH = './fonts';
const canvas = Canvas.createCanvas(200, 200);
const ctx = canvas.getContext('2d');
Canvas.registerFont('fonts/jf-openhuninn-2.0.ttf', { family: 'jf-openhuninn-2.0' });

// ctx.font = '25px "jf open 粉圓 1.1"';
ctx.font = 'bold 25px jf-openhuninn-2.0';
// ctx.textAlign = "center";
ctx.fillStyle = "#fff";
ctx.fillText('ABCo;mk;lm', 0, 100);

const buffer = canvas.toBuffer("image/png");
fs.writeFileSync("./out.png", buffer);