# Contributing

## Setup

```bash
git clone https://github.com/<username>/generate-video-dumbnail.git
cd generate-video-dumbnail

pnpm install
pnpm dev # Start the demo server
pnpm test # Run the tests w/ vitest browser mode
pnpm build # Build the library (dist/)
```

## Why is CI not enabled?

Thumbnails can be generated differently in a headless browser compared to a real browser. Therefore, I am not performing CI at the moment. Please run tests locally.
