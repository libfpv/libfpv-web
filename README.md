# libfpv-web

The website for [libfpv](https://github.com/hammerill/libfpv): compatible games, features, docs links and support (Patreon, Buy Me a Coffee).

Next.js 14 (App Router) + Tailwind CSS, same stack and look as hammerill.com.

Node 24 LTS (`.nvmrc`; Next.js 16 needs 20.9+, and Node 27 prereleases break it):

```sh
nvm install && nvm use
npm install
npm run dev      # http://localhost:3000
```

- Links (Patreon, Buy Me a Coffee, GitHub, docs): `src/config.ts`.
- Languages: English, French, Ukrainian, with [next-intl](https://next-intl.dev) as on hammerill.com. All text lives in `dicts/<locale>.json` (`<nbsp></nbsp>` is a non-breaking space, `<b>` is bold); the components only hold structure. The URL never carries the locale: the proxy (`src/proxy.ts`, Next.js 16's name for middleware) picks it from the `NEXT_LOCALE` cookie, set by the language switcher in the header, then from `Accept-Language`, and rewrites to `src/app/[locale]` internally. `/fr` and the like redirect to `/` and set the cookie. To add a language: a new `dicts/<locale>.json` and an entry in `src/navigation.ts`.
- Game pages: `/games` lists them, `/games/<id>` is each game's page (`id` is the mod's code without `-fpv`): downloads, web build, gallery, requirements, keys. Downloads come from the mod's latest GitHub release via `src/lib/releases.ts`; the files are each game's `downloads` in `src/data/games.ts`. Gallery stills go in `public/gallery/<id>/`, listed in the game's `gallery`.
- Games: `src/data/games.ts` (text in `dicts/*.json` under `gameData.<id>`). Each game's clip lives in `public/games/<media>.{webm,mp4,jpg}`, made from the mod's GIF. Clips are 16:9 unless the game sets `aspect` (RDR2's is `4 / 3`); its page, the games list and the gallery then frame it at that shape, and game cards show it whole:

```sh
ffmpeg -i in.gif -movflags +faststart -pix_fmt yuv420p -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" -c:v libx264 -crf 22 -preset slow -an public/games/NAME.mp4
ffmpeg -i in.gif -c:v libvpx-vp9 -crf 34 -b:v 0 -an -pix_fmt yuv420p public/games/NAME.webm
ffmpeg -ss 1.5 -i in.gif -frames:v 1 -q:v 3 public/games/NAME.jpg
```

## Hosted downloads

A game with `hosted: true` in `src/data/games.ts` (RDR2) is distributed only here, not on GitHub. Its release pipeline uploads three files to `<LIBFPV_DOWNLOADS_DIR>/<id>/` (`src/lib/downloads.ts`): the ZIP, `INSTALL.md` and `release.json` (build number, date, mod and libfpv commits, size and SHA-256 of each file). The game's page shows that build, `/games/<id>/install` renders the guide (Markdown, English only, no raw HTML), and the ZIP is at `/downloads/<id>/<file>`. Both pages read the files on every request, so a new build shows without redeploying the site.

- **Locally:** `LIBFPV_DOWNLOADS_DIR` defaults to `data/downloads` (gitignored). Put a build there, for example with rdr2-fpv's `tools/package.sh data/downloads/rdr2`; `npm run dev` then serves the ZIP through `src/app/downloads`.
- **On the VPS:** the folder is `/srv/www/libfpv-downloads` (`LIBFPV_DOWNLOADS` in `~/dockers/docker-libfpv/.env`), mounted read-only into the container. nginx serves only the ZIPs from it, with `Content-Disposition: attachment` and no symlinks (`confs/00-libfpv.com.conf`). Each game's pipeline has its own SSH key for `deploy`, pinned to `rrsync -wo /srv/www/libfpv-downloads/<id>`: it can write that one folder and nothing else.

## Deploy

Every push to `main` runs `.github/workflows/deploy.yml`: lint + build, then SSH as `deploy@hammerill.com`, whose key may only run `/usr/local/bin/deploy-libfpv-web` (as `kyrylo`). That checks the commit out in `~/dockers/docker-libfpv` and runs `docker compose up -d --build`. The container listens on `127.0.0.1:3010`, behind `docker-nginx` (`confs/00-libfpv.com.conf`). The Let's Encrypt cert (`libfpv.com`, `www.libfpv.com`, HTTP-01 webroot) renews from `kyrylo`'s crontab. Manual redeploy on the VPS: `./rebuild.sh`.
