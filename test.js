import { createCanvas, loadImage } from 'canvas';
import fs from 'fs';

const zodiac = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricornus', 'Aquarius', 'Pisces'];
for (let z of zodiac) {
    const image = await loadImage(`./public/line-bot/${z}.png`);
    const width = image.width;
    const height = image.height;
    const canvas = createCanvas(width, height);
    const context = canvas.getContext('2d');
    context.drawImage(image, 0, 0);
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < imageData.data.length; i += 4) {
        const r = imageData.data[i];
        const g = imageData.data[i + 1];
        const b = imageData.data[i + 2];
        const a = imageData.data[i + 3];
        if (a > 250) {
            imageData.data[i] = 255;
            imageData.data[i + 1] = 177;
            imageData.data[i + 2] = 27;
            imageData.data[i + 3] = 255;
        } else {
            imageData.data[i] = 255;
            imageData.data[i + 1] = 255;
            imageData.data[i + 2] = 255;
            imageData.data[i + 3] = 0;
        }
    }
    context.putImageData(imageData, 0, 0);
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(`./public/line-bot/${z}.png`, buffer);
}