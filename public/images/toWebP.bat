ffmpeg -i portrait.png -vf scale=-1:741 -c:v libwebp portrait_h741.webp
ffmpeg -i portrait.png -vf scale=480:-1 -c:v libwebp portrait_w480.webp