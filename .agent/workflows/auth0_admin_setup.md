---
description: How to grant Admin access using Auth0 Dashboard
---

# Granting Admin Access via Auth0

To make a user an ADMIN and ensure the backend gets your email, we need to update the Auth0 Action.

## Step 1: Update the Login Action

1.  Log in to your [Auth0 Dashboard](https://manage.auth0.com).
2.  Navigate to **Actions** > **Library**.
3.  Click on your **Custom** action (likely named `Add User Roles`).
4.  Update the code to the following (this adds both Role and Email):

```javascript
exports.onExecutePostLogin = async (event, api) => {
  // This MUST match your AUTH0_AUDIENCE in backend/.env
  const namespace = 'https://api.esn.com';
  
  // 1. Check for role in app_metadata
  const role = event.user.app_metadata.role || 'USER';
  
  // 2. Add the role to the ID Token and Access Token
  if (role) {
    api.idToken.setCustomClaim(`${namespace}/role`, role);
    api.accessToken.setCustomClaim(`${namespace}/role`, role);
  }

  // 3. Add Email to Access Token (Critical for Backend)
  if (event.user.email) {
    api.accessToken.setCustomClaim(`${namespace}/email`, event.user.email);
  }
};
```

5.  Click **Deploy** (top right).

## Step 2: Verify Action is Active

1.  Navigate to **Actions** > **Flows** > **Login**.
2.  Ensure `Add User Roles` is in the flow.

## Step 3: Assign Admin Role (If not done yet)

1.  Navigate to **User Management** > **Users**.
2.  Click on your user.
3.  Scroll to **Metadata** > **app_metadata**.
4.  Ensure it has:
```json
{
  "role": "ADMIN"
}
```
5.  Click **Save**.

## Step 4: Verify

1.  **Log out** of the application.
2.  **Log back in**.
3.  The "Email is required" error should be gone, and you should be an Admin.
