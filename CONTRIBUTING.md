# Contributing

## Setup

- Corepack can be used to install pnpm.
- Please use Node.js v20 or higher.

```bash
corepack enable # install pnpm via corepack

git clone https://github.com/<username>/generate-video-dumbnail.git
cd generate-video-dumbnail

pnpm install
pnpm dev # Start the demo server
pnpm test # Run the tests w/ vitest browser mode
pnpm build # Build the library (dist/)
```

## Why is CI not enabled?

Thumbnails can be generated differently in a headless browser compared to a real browser. Therefore, I am not performing CI at the moment. Please run tests locally.
