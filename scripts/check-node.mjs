// Run before `npm run dev`: Next.js 16 needs Node 20.9+, and Node 27 prereleases
// break it (null-prototype request headers: "headers.hasOwnProperty is not a function").
// The Docker image and CI use Node 24 LTS (.nvmrc).
const [major, minor] = process.versions.node.split(".").map(Number);
if (major < 20 || (major === 20 && minor < 9) || major >= 27) {
  console.error(`Node ${process.version} isn't supported here: use Node 24 LTS (\`nvm install && nvm use\` reads .nvmrc).`);
  process.exit(1);
}
