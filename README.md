# Flutter Role Permission

A monorepo demonstrating role-based access control (RBAC) with a NestJS backend and a Flutter app targeting Chrome and Android.

---

## What is Role-Based Access Control?

Role-Based Access Control (RBAC) is a security model where access to features and data is determined by the **role** a user holds, not by who the user is individually.

Instead of assigning permissions to each person one by one, you assign permissions to a role, then assign that role to users. Every user with the same role gets the same set of permissions automatically.

```
User  →  Role  →  Permissions
```

For example:
- An **Admin** can do everything
- A **Manager** can view and edit, but not delete or manage accounts
- A **User** can only read

---

## Why Use RBAC?

Managing access at the individual user level does not scale. Once you have more than a handful of users, it becomes a maintenance problem - every time someone joins, changes teams, or leaves, you have to manually audit and update their access.

RBAC solves this by shifting the question from *"what can this person do?"* to *"what should this role be allowed to do?"*. The role is defined once, and anyone assigned to it inherits those rules.

**Key benefits:**

- **Less maintenance** - change a role's permissions in one place, every user with that role is updated instantly
- **Fewer mistakes** - no more forgetting to revoke access when someone changes teams
- **Clearer auditing** - you can look at a role and immediately know what it can and cannot do
- **Principle of least privilege** - users get only the access they actually need, nothing more

---

## Common Use Cases

**SaaS dashboards** - a free-tier user sees basic stats, a pro user unlocks advanced reports, an admin manages billing and team members.

**Internal tools** - HR can view salary data, managers can approve requests, regular employees can only submit their own.

**Content platforms** - editors can publish, contributors can only draft, viewers can only read.

**E-commerce back-office** - warehouse staff can update stock, support agents can issue refunds, admins can change pricing.

Anywhere you have multiple types of users who need different levels of access, RBAC is the right model.

---

## How It Works in This Project

The backend holds the permission matrix - a map of which role gets which permissions. When a user logs in, the API returns a JWT token along with their role and the list of permissions that role grants.

The Flutter app reads those permissions and uses them to decide what to show. A permission chip is highlighted if the current user has it, and dimmed if they do not. No client-side logic decides what is allowed - the source of truth is always the backend.

```
Login  →  JWT + permissions  →  Flutter renders UI based on what is granted
```

This means if you change a role's permissions on the server, every user with that role sees the change on their next login - no app update needed.

---

## Roles & Permissions

| Permission       | Admin | Manager | User |
|------------------|:-----:|:-------:|:----:|
| view_dashboard   | ✅    | ✅      | ✅   |
| view_reports     | ✅    | ✅      | ✅   |
| view_analytics   | ✅    | ✅      | ❌   |
| edit_content     | ✅    | ✅      | ❌   |
| manage_users     | ✅    | ❌      | ❌   |
| delete_content   | ✅    | ❌      | ❌   |

---

## Test Accounts

| Email              | Password    | Role    |
|--------------------|-------------|---------|
| admin@test.com     | password123 | Admin   |
| manager@test.com   | password123 | Manager |
| user@test.com      | password123 | User    |

---

## Getting Started

**1. Start the backend**
```bash
cd backend
npm install
npm run start:dev
# Runs on http://localhost:3000
```

**2. Run the Flutter app**
```bash
cd app
flutter pub get
flutter run -d chrome
# or
flutter run -d emulator-<id>
```

---

## API Endpoints

| Method | Endpoint                      | Auth   | Description             |
|--------|-------------------------------|--------|-------------------------|
| POST   | `/auth/login`                 | None   | Returns JWT + user info |
| GET    | `/auth/profile`               | Bearer | Current user profile    |
| GET    | `/permissions/my-permissions` | Bearer | Permissions for my role |
| GET    | `/permissions/matrix`         | Bearer | Full role-permission map|

---

## Tech Stack

- **Backend** - NestJS, Passport JWT, bcrypt
- **Frontend** - Flutter, Provider, Material 3 dark theme
