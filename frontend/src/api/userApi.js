import {deleteJson, getJson, postJson, putJson} from "./index";

/**
 * this will create a temporary account during user invite process
 * @param params：{email, is_superuser, expirationDate}
 * @returns {Promise<Response|any>}
 */
export function createUser(params) {
  return postJson('/api/user/invite', params);
}

/**
 * this will verify user's token during first entry process
 * @param token
 * @returns {Promise<Response|any>}
 */
export function verifyFirstEntryUser(token) {
  return postJson('/api/verify/firstEntry', token);
}

/**
 * this will update user's security questions and password during first
 * entry process
 * @param params：{email, newPassword, securityQuestions}
 * @returns {Promise<Response|any>}
 */
export function firstEntryUpdate(params) {
  return putJson('/api/register/firstEntry', params);
}

/**
 * this will fetch the security questions of user during forgot password process
 * @param email
 * @returns {Promise<Response|any>}
 */
export function fetchSecurityQuestionsByEmail(email) {
  return getJson('/api/forgotPassword/securityQuestions/fetch/' + email);
}

/**
 * this will check the answer of the security function during forgot password process
 * @param params:{email, question, answer}
 * @returns {Promise<Response|any>}
 */

export function checkSecurityQuestion(params) {
  return postJson('/api/forgotPassword/securityQuestions/check', params);
}

export function LoginCheckSecurityQuestion(params) {
  return postJson('/api/login/securityQuestions/check', params);
}


/**
 * this will send the verification email during forgot password process
 * @param params: {email}
 * @returns {Promise<Response|any>}
 */
export function sendVerificationEmail(params) {
  return postJson('/api/forgotPassword/sendVerificationEmail', params);
}

/**
 * this will verify user's token during forgot password process
 * @param token
 * @returns {Promise<Response|any>}
 */
export function verifyForgotPasswordUser(token) {
  return postJson('/api/forgotPassword/resetPassword/verify', {token});
}

/**
 * this will save new password during forgot and reset password process
 * @param params: {password, email}
 * @returns {Promise<Response|any>}
 */
export async function forgotPasswordSaveNewPassword(params) {
  return postJson('/api/forgotPassword/resetPassword/saveNewPassword/', params);
}

/**
 * This will verify in the backend whether the token contains correct
 * information of current primary email and new primary email for this user.
 * @param token
 * @returns {Promise<Response|any>}
 */
export async function verifyChangePrimaryEmail(token) {
  return postJson('/api/user/updatePrimaryEmail', {token});
}


/**
 * this will get user information from backend.
 * @param id
 * @returns {Promise<Response|any>}
 */
export function getProfile(id) {
  return getJson('/api/user/profile/' + id + '/');
}

/**
 * this will send the new primary email user intends to change to the backend.
 * @param id
 * @param email
 * @returns {Promise<Response|any>}
 */
export async function updatePrimaryEmail(id, email) {
  return postJson('/api/user/editProfile/updatePrimaryEmail/' + id + '/', {email});
}

/**
 * This will send new profile information for this user to the backend and database.
 * @param id
 * @param params
 * @returns {Promise<*>}
 */
export function updateProfile(uri, params) {
  return postJson('/api/user/profile/' + uri + '/', params);
}

export function updateUser(uri, params) {
  return postJson(`/api/user/updateUser/${uri}/`, params)
}

export function updateSecurityQuestion(uri, params) {
  return postJson('/api/general/profile/' + uri + '/securityQuestions/', params);
}

/**
 * This allows admin to update user form.
 * @param id
 * @param params
 * @returns {Promise<*>}
 */
export function updateUserForm(id, params) {
  return postJson('/api/superuser/user/updateUser/' + id + '/', params);
}

/**
 * This will send new password to backend and database.
 * @param id
 * @param password
 * @returns {Promise<*>}
 */
export async function updatePassword(id, params) {
  return postJson('/api/general/profile/' + id + '/resetPassword/', params);
}

/**
 * This function fetches one single user by id.
 * @param uri
 * @returns {Promise<any>}
 */
export function fetchUser(uri) {
  return getJson('/api/user/' + uri + '/');
}

/**
 * This function fetches all users.
 * @returns {Promise<any>}
 */
export function fetchUsers(orgUri) {
  if (!orgUri)
    return getJson('/api/users/');
  if (orgUri)
    return getJson(`/api/users/${orgUri}`);

}


/**
 * This function deletes one user by id.
 * @param id
 */
export async function deleteUser(id) {
  return deleteJson('/api/superuser/user/' + id + '/');
}
