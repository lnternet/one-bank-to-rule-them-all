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

Requests to API controllers are rate-limited per client IP address to 10 requests per minute.
Swagger: https://one-bank-to-rule-them-all-api-502428345364.europe-west1.run.app/swagger

### Run Tests

```sh
cd backend
dotnet test
```

## Task

**Task description:** Implement transaction details, shown after clicking on a single transaction in transaction list. How to reach it - log on, select an account from account list, you'll be navigated to transaction list. Transaction details can be implemented using approach of your choice and with design of your choice. Transaction details endpoint is already implemented in API.

Additionally to that, on webside startup load configurations from API endpoint - transaction types and spending categories. On the transaction details screen add a dropdown selector for spending category, sending PATCH HTTP request on selection (note - API endpoint does not exist).

**Requirements:**

- Use React Query when calling API endpoints;
- Transaction Details page should have a "Print" button that would trigger a printing dialog of transaction content. Extra karma if content is formatted as a receipt and includes bank's name/logo.
- Spending categories should be colorful and have icons (use icon library of your choice or static assets).

**For extra mile:** Use `OpenAI` APIs to integrate with `gpt-5.4-mini` LLM to automatically pick spending category from dropdown based on transaction details. User interface should notify user that preselection was done with help of AI. In this case also send a PATCH HTTP request to API. Key is stored in GitHub Actions Secrets named `OPENAI_API_KEY` and is also available as plaintext upon request.
