# MacFAST

## Getting Started

### Installation

First, clone the repository:

```bash
git clone https://github.com/McMaster-FAST/frontend.git
```

Second, install the dependences:

```bash
npm install
# or
yarn install
# or
pnpm install
```

## Environment Configuration

To run this project, you will need to add the following environment variables to your `.env.local` file.

### 1. Set up `.env.local`

Duplicate the sample environment file to create your local configuration:

```bash
cp .env.sample .env.local
```

### 2. Configure Variables

Open `.env.local` and fill in these values:

```bash
# API & Base Configuration
NEXT_PUBLIC_API_URL="http://localhost:8000"
NEXTAUTH_URL="http://localhost:3000"

# NEXTAUTH_SECRET is required by the Auth.js library to handle sessions.
# To generate a secret you can run: openssl rand -base64 32
# Or just set to a random string like "mysecret" for development.
NEXTAUTH_SECRET=

# These are all values that can be found in the teams chat in pinned.
# Note: In the future, these will be provided by UTS.
AUTH_CLIENT_SECRET=
AUTH_CLIENT_ID=
AUTH_ISSUER=
```

### Generating a Secret

If you need to generate a secure `NEXTAUTH_SECRET` value, you can run this command in your terminal:

```bash
openssl rand -base64 32
```

---

## Running the Server

Once the environment variables are set, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

The MacFAST homepage should be viewable at [http://localhost:3000](http://localhost:3000).
