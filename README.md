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

## Deploy

Every push to `main` runs `.github/workflows/deploy.yml`: lint + build, then SSH as `deploy@hammerill.com`, whose key may only run `/usr/local/bin/deploy-libfpv-web` (as `kyrylo`). That checks the commit out in `~/dockers/docker-libfpv` and runs `docker compose up -d --build`. The container listens on `127.0.0.1:3010`, behind `docker-nginx` (`confs/00-libfpv.com.conf`). The Let's Encrypt cert (`libfpv.com`, `www.libfpv.com`, HTTP-01 webroot) renews from `kyrylo`'s crontab. Manual redeploy on the VPS: `./rebuild.sh`.
