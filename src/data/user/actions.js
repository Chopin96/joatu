import { CALL_API } from '../actions'
import defaultUserImage from './default_user.png'

export const FETCH_USERS_STARTED = 'FETCH_USERS_STARTED'
export const FETCH_USERS_SUCCEEDED = 'FETCH_USERS_SUCCEEDED'
export const FETCH_USERS_FAILED = 'FETCH_USERS_FAILED'

export const FETCH_USER_STARTED = 'FETCH_USER_STARTED'
export const FETCH_USER_SUCCEEDED = 'FETCH_USER_SUCCEEDED'
export const FETCH_USER_FAILED = 'FETCH_USER_FAILED'

export const CREATE_USER_STARTED = 'CREATE_USER_STARTED'
export const CREATE_USER_SUCCEEDED = 'CREATE_USER_SUCCEEDED'
export const CREATE_USER_FAILED = 'CREATE_USER_FAILED'

export const UPDATE_USER_STARTED = 'UPDATE_USER_STARTED'
export const UPDATE_USER_SUCCEEDED = 'UPDATE_USER_SUCCEEDED'
export const UPDATE_USER_FAILED = 'UPDATE_USER_FAILED'

export const REMOVE_USER_STARTED = 'REMOVE_USER_STARTED'
export const REMOVE_USER_SUCCEEDED = 'REMOVE_USER_SUCCEEDED'
export const REMOVE_USER_FAILED = 'REMOVE_USER_FAILED'

export const SEND_CAPS_STARTED = 'SEND_CAPS_STARTED'
export const SEND_CAPS_SUCCEEDED = 'SEND_CAPS_SUCCEEDED'
export const SEND_CAPS_FAILED = 'SEND_CAPS_FAILED'

const doFetchUsers = () => ({
  [CALL_API]: {
    types: [FETCH_USERS_STARTED, FETCH_USERS_SUCCEEDED, FETCH_USERS_FAILED],
    collection: 'users'
  }
})

export const fetch = () => (dispatch, getState) => {
  return dispatch(doFetchUsers())
}

const doFetchOneUser = userId => ({
  [CALL_API]: {
    types: [FETCH_USER_STARTED, FETCH_USER_SUCCEEDED, FETCH_USER_FAILED],
    collection: 'users',
    id: userId
  }
})

export const fetchOne = userId => (dispatch, getState) => {
  return dispatch(doFetchOneUser(userId))
}

const doCreateUser = body => ({
  [CALL_API]: {
    types: [CREATE_USER_STARTED, CREATE_USER_SUCCEEDED, CREATE_USER_FAILED],
    collection: 'users',
    action: 'set',
    id: body.uid || body.id,
    body: Object.assign(
      {
        imgSrc: defaultUserImage
      },
      body,
      { caps: 0 }
    )
  }
})

export const create = body => (dispatch, getState) => {
  return dispatch(doCreateUser(body))
}

const doUpdateUser = (id, body) => ({
  [CALL_API]: {
    types: [UPDATE_USER_STARTED, UPDATE_USER_SUCCEEDED, UPDATE_USER_FAILED],
    collection: 'users',
    action: 'update',
    id,
    body
  }
})

export const update = (id, body) => (dispatch, getState) => {
  return dispatch(doUpdateUser(id, body))
}

const doDeleteUser = id => ({
  [CALL_API]: {
    types: [REMOVE_USER_STARTED, REMOVE_USER_SUCCEEDED, REMOVE_USER_FAILED],
    collection: 'users',
    action: 'delete',
    id
  }
})

export const remove = id => (dispatch, getState) => {
  return dispatch(doDeleteUser(id))
}

const doSendCaps = body => ({
  [CALL_API]: {
    types: [SEND_CAPS_STARTED, SEND_CAPS_SUCCEEDED, SEND_CAPS_FAILED],
    collection: 'users',
    action: 'sendCaps',
    ...body
  }
})

// {
//   from: userId,
//   to: userId,
//   amount: number
// }
export const sendCaps = ({ from, to, amount }) => (dispatch, getState) => {
  return dispatch(doSendCaps({ from, to, amount }))
}
