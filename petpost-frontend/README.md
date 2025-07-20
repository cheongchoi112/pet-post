# PetPost Frontend

React frontend for the PetPost pet adoption website.

## Features

- View list of adoptable pets
- Add new pets with image upload
- Responsive design
- Simple and clean UI

## Setup

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm start
```

3. Make sure the API server is running on `http://localhost:3001`

## Usage

- The app will automatically load pets from the API
- Use the form to add new pets
- Images are uploaded to AWS S3 via the API

## Build for Production

```bash
npm run build
```

## Notes

- Requires the PetPost API to be running
- API URL is configured to `http://localhost:3001/api` by default
