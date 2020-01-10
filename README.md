# Layout

yarn workspaces

- client
- server

# Deployments

The app will automatically deploy when anything is merged to master and pushed to GitHub.

Server is deployed via github actions (uses serverless framework)
Client is deployed via Netlify watching the Github repo
