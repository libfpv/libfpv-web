# libfpv-web

The website for [libfpv](https://github.com/hammerill/libfpv): compatible games, features, docs links and support (Patreon, PayPal).

Next.js 14 (App Router) + Tailwind CSS, same stack and look as hammerill.com.

```sh
npm install
npm run dev      # http://localhost:3000
```

- Links (Patreon, PayPal, GitHub, docs): `src/config.ts`. Set `paypal` to enable the PayPal button.
- Games: `src/data/games.ts`. Each game's clip lives in `public/games/<media>.{webm,mp4,jpg}`, made from the mod's GIF:

```sh
ffmpeg -i in.gif -movflags +faststart -pix_fmt yuv420p -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" -c:v libx264 -crf 22 -preset slow -an public/games/NAME.mp4
ffmpeg -i in.gif -c:v libvpx-vp9 -crf 34 -b:v 0 -an -pix_fmt yuv420p public/games/NAME.webm
ffmpeg -ss 1.5 -i in.gif -frames:v 1 -q:v 3 public/games/NAME.jpg
```
