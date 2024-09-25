# Strive AI API (MVP)

Export these environment variables:

```bash
export NODE_NO_WARNINGS=1
export GCLOUD_PROJECT=... # e.g. antler-nordhack24sto-4402
export GCLOUD_LOCATION=europe-west1
export GOOGLE_GENAI_API_KEY=... # get from https://aistudio.google.com/app/apikey
```

## Run locally

```bash
npx genkit start
```

## Deploy to Google Cloud

See <https://firebase.google.com/docs/genkit/cloud-run>

```bash
gcloud run deploy strive-ai-api-mvp --source . --region europe-west1 --allow-unauthenticated
```

> _Warning_: This API requires no authentication.

This outputs a service URL.

## Invoke the flow

```bash
curl -X POST $SERVICE_URL/striveFlow \
-H "Content-Type: application/json" -d '{"data": {
    "role": "Software Engineer",
    "problem": "Always late to meetings."
}}'
```
