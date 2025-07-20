# PetPost API

Simple Express.js API for the PetPost pet adoption website.

## Features

- Upload pet images to AWS S3
- Store pet data in JSON file
- REST API endpoints for pets
- CORS enabled for frontend integration

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy environment file:

```bash
copy .env.example .env
```

3. CAWS credentials in `.env`:

```
AWS_ACCESS_KEY_ID=your_aws_access_key_here
AWS_SECRET_ACCESS_KEY=your_aws_secret_key_here
AWS_REGION=us-east-1
S3_BUCKET_NAME=your-petpost-bucket-name
PORT=3001
```

4. Start the server:

```bash
npm start
```

## API Endpoints

- `GET /api/pets` - Get all pets
- `POST /api/pets` - Add new pet (with image upload)
