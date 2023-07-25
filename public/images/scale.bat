ffmpeg -i portrait.webp -vf scale=480:-1 -c:v libwebp portrait_w480.webp
ffmpeg -i portrait.webp -vf scale=330:-1 -c:v libwebp portrait_w330.webp