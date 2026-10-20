import apiService from '../api/apiServices'

/* ---------- users ---------- */

// register: add a new user to json-server
export const registerUserAPI = async (userDetails) => {
  return await apiService('POST', '/users', userDetails)
}

// login: get all users and match email + password
export const getAllUsersAPI = async () => {
  return await apiService('GET', '/users', {})
}

// profile: get one user
export const getUserAPI = async (userId) => {
  return await apiService('GET', `/users/${userId}`, {})
}

// profile update (PATCH so password and role are not wiped)
export const updateUserAPI = async (userId, userDetails) => {
  return await apiService('PATCH', `/users/${userId}`, userDetails)
}

/* ---------- issues ---------- */

// report a new issue
export const addIssueAPI = async (issueDetails) => {
  return await apiService('POST', '/issues', issueDetails)
}

// get all issues
export const getAllIssuesAPI = async () => {
  return await apiService('GET', '/issues', {})
}

// update issue (support, status, admin response)
export const updateIssueAPI = async (issueId, issueDetails) => {
  return await apiService('PATCH', `/issues/${issueId}`, issueDetails)
}

// delete issue
export const deleteIssueAPI = async (issueId) => {
  return await apiService('DELETE', `/issues/${issueId}`, {})
}
