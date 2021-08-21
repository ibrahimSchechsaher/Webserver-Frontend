# Web Application for Heightmap WGAN

The template that we used for our project is found [here](https://github.com/designcourse/threejs-webpack-starter).

## Before starting the WebApp

```bash
# Before you start the WebApp, install tensorflowjs
pip install tensorflowjs

# After the installation, execute the batchfile
genTFjs.bat

# This will generate a tensorflow.js model from our WGAN
# in the static folder called model.json
```

## How to start the WebApp/Setup

Run this followed commands:

```bash
# Install dependencies (only the first time)
npm install

# Run the local server at localhost:8080
npm run dev

# Build for production in the dist/ directory
npm run build
```
