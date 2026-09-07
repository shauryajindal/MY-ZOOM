### Why do we have a separate Session model?

A small JWT project can generate an access token and refresh token
without maintaining a Session collection.

We deliberately introduced a Session model because one user can
have multiple independent login sessions:

User
├── Laptop session
├── Phone session
└── Tablet session

This allows us to:
- revoke one device without logging out every device
- track active sessions
- associate a refresh token with a specific login
- implement refresh-token rotation
- support logout-all-devices
- maintain server-side control over authentication sessions




### Why does the refresh token contain sessionId?

A refresh token containing only userId tells us:

"This token belongs to User A."

But User A can have multiple sessions.

Therefore the refresh token contains:

{
  userId,
  sessionId
}

This allows the server to identify the exact session that
the refresh request belongs to.

Laptop → Session S1 → Refresh Token R1
Phone  → Session S2 → Refresh Token R2

Using R1 must affect S1, not S2.




## AuthIdentity — Database Indexing & Uniqueness

AuthIdentity represents an authentication method belonging to a User.

A user may authenticate through different providers, for example:

- password
- Google
- potentially other OAuth providers in the future

Example:

User A
├── password identity
└── Google identity

### Compound Unique Index

```js
authIdentitySchema.index(
  { user: 1, provider: 1 },
  { unique: true }
);