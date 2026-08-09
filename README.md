# One Bank to Rule Them All

Monorepository for the One Bank to Rule Them All application.

## Structure

- `backend/` - ASP.NET WebAPI backend.
- `frontend/` - React.js frontend.

## Current Status

The frontend has been initialized as a minimal React single page app that builds to static assets for GitHub Pages. The backend has been initialized as an ASP.NET WebAPI project with Swagger and tests.

## Frontend

The frontend lives in `frontend/` and uses Yarn through Corepack.

### Prerequisites

- Node.js 22 or newer.
- Corepack enabled:

```sh
corepack enable
```

### Run Locally

```sh
cd frontend
yarn install
yarn dev
```

The development server prints the local URL after it starts, usually `http://localhost:5173/`.
API calls to `/api` are proxied to the backend at `http://localhost:8080`.
For deployed frontend builds, set the GitHub Actions variable `BACKEND_API_URL` to the Cloud Run service URL.

### Run Tests

```sh
cd frontend
yarn test
```

### Build And Preview

```sh
cd frontend
yarn build
yarn preview
```

The production build is written to `frontend/dist/`.

## Backend

The backend lives in `backend/` and uses ASP.NET WebAPI on .NET 8.

### Run Locally

```sh
cd backend
dotnet restore
dotnet run --project src/OneBankToRuleThemAllAPI.csproj
```

Swagger UI is available in development at `/swagger`.

### API Endpoints

- `GET /api/accounts/{accountId}/transactions` - returns fake account transaction data.

Requests to API controllers are rate-limited per client IP address to 10 requests per minute.

### Run Tests

```sh
cd backend
dotnet test
```

### Deploy To Google Cloud Run

The backend is containerized with `backend/Dockerfile` and deployed by `.github/workflows/deploy-backend-cloud-run.yml`.

Required GitHub repository variables:

- `GCP_PROJECT_ID` - Google Cloud project ID.
- `GCP_REGION` - Cloud Run and Artifact Registry region, for example `us-central1`.
- `CLOUD_RUN_SERVICE_NAME` - Cloud Run service name, for example `one-bank-api`.
- `GCP_ARTIFACT_REGISTRY_REPOSITORY` - Artifact Registry Docker repository name.
- `ALLOWED_ORIGINS` - comma-separated frontend origins allowed by CORS, for example `https://your-github-user.github.io`.

Required GitHub repository secrets:

- `GCP_WORKLOAD_IDENTITY_PROVIDER` - Workload Identity Provider resource name.
- `GCP_SERVICE_ACCOUNT` - deployment service account email.

The workflow builds the Docker image, pushes it to Artifact Registry, and deploys it to Cloud Run on pushes to `main` that change backend files. Swagger is exposed at `/swagger` in the deployed service.
