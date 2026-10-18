# CivicTrack

A small civic issue tracker: report local problems, back the ones that matter, and follow what happens next.

React + Vite, Redux Toolkit, axios, json-server.

## Run it

Two folders, like the Resume Builder project: `civic_tracker` (React app) and `civic-server` (json-server backend).

```bash
# terminal 1: backend on http://localhost:3000
cd civic-server
npm install
npm start          # runs: node index.js

# terminal 2: the app
cd civic_tracker
npm install
npm run dev
```

Demo logins are in `civic-server/db.json` (one admin, two users).

## Structure

```
src/
  api/
    axiosInstance.js   axios.create + response interceptor
    apiServices.js     one function every request goes through
  services/
    allAPI.js          one function per CRUD call (register, add/get/update/delete issue...)
  Redux/
    store.js
    slice/issueSlice.js   fetchIssues (createAsyncThunk) + loading / error state
  Components/          Header (hides on scroll), Footer, IssueItem, IssueFilters
  Pages/               Landing, Login, Register, Dashboard, ReportIssue, Profile, AdminDashboard
  utils/               auth (localStorage) and small issue helpers
```

To point the app at a different backend, set `VITE_API_URL` in a `.env` file.
