npm install -g concurrently;

concurrently "cd backend && yarn start" "ngrok http --url=choice-collie-suitably.ngrok-free.app --pooling-enabled 3000"
