#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}Starting Auth0 Verification...${NC}"

# 1. Check if backend is running (simple port check)
if lsof -Pi :4000 -sTCP:LISTEN -t >/dev/null ; then
    echo -e "${GREEN}✅ Backend is running on port 4000${NC}"
else
    echo -e "${RED}❌ Backend is NOT running on port 4000. Please start it with 'npm run start:dev' in backend folder.${NC}"
    exit 1
fi

# 2. Test GraphQL Endpoint with a dummy token to trigger Auth0Guard logging
echo -e "\n${GREEN}Testing GraphQL Endpoint with dummy token...${NC}"
RESPONSE=$(curl -s -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer dummy_token_for_logging_test" \
  --data '{"query": "{ hello }"}' \
  http://localhost:4000/graphql)

# We expect an error because the token is invalid, but we want to verify the logs in the backend console.
# The response should contain "Unauthorized" or similar.

if [[ $RESPONSE == *"Unauthorized"* ]] || [[ $RESPONSE == *"Authentication failed"* ]]; then
    echo -e "${GREEN}✅ Auth0Guard correctly rejected invalid token.${NC}"
    echo -e "   Please check backend logs for '❌ Auth0 Guard: Invalid token structure or missing kid' or similar messages."
else
    echo -e "${RED}❌ Unexpected response: $RESPONSE${NC}"
fi

echo -e "\n${GREEN}Verification Complete. Please manually verify the 'Delete Account' flow in the frontend.${NC}"
