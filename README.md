# ICP Local Anonymous Canister

This project is designed to facilitate local testing of ICP's Internet Identity, focusing primarily on the interaction with alternative frontend origins.

## Overview

This local server allows developers to test the integration with ICP's Internet Identity by simulating the behavior of a real-world environment. The server provides a static file serving capability and is secured with HTTPS using locally-generated certificates.

## Prerequisites

- Node.js
- `mkcert` tool for generating local certificates ([Installation Guide](https://github.com/FiloSottile/mkcert)).

## Setup

1. Clone the repository:

```bash
git clone https://github.com/uniot-io/icp-anonymous-canister.git
cd icp-anonymous-canister
```

2. Install the required Node.js packages:

```bash
npm install
```

3. Run the server:

```bash
node index.js
```

## Features

- **HTTPS Support**: To mimic a real-world scenario, the server runs on HTTPS protocol. The server will automatically generate the necessary certificates if they do not exist.

- **CORS**: This server has CORS enabled to allow cross-origin requests, which is essential when testing Internet Identity integrations.

- **Static File Serving**: The server serves static files placed in the `./static` directory. This can be useful for testing frontend assets with Internet Identity.

- **Domain Configuration**: The server uses a domain pattern `${principal}.icp0.io`. The `principal` is a unique identifier generated by the `@dfinity/principal` package. The anonymous `2vxsx-fae` Principal ID is used by default. If the domain is not configured locally, the server will provide instructions on how to do so.

## Troubleshooting

1. **Permission denied error**: If you encounter a permission denied error when starting the server, it means you need to grant Node.js the permissions to bind to port 443.

   - **Linux**:
     ```bash
     sudo setcap 'cap_net_bind_service=+ep' $(which node)
     ```

     To revoke this permission later:
     ```bash
     sudo setcap -r $(which node)
     ```

   - **macOS**: You'll need to run your server with elevated privileges using `sudo`.

2. **Local Domain not Configured**: If you get an error indicating that the local domain is not configured, follow the instructions provided by the server output to configure the domain locally.
