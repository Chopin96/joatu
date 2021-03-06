import { CALL_API } from '../data/actions'

import {
  doGet,
  doGetSorted,
  doSet,
  doUpdate,
  doAdd,
  doDelete,
  // These should be embedded
  doLogin,
  doLogout,
  addRef,
  removeRef,
  listenForNewDocuments,
  sendCaps,
  find
} from '../data/api'

const apiMiddleware = store => next => action => {
  const callApi = action[CALL_API]
  if (typeof callApi === 'undefined') {
    return next(action)
  }

  const [requestStartedType, successType, failureType] = callApi.types

  next({ type: requestStartedType })

  const handleResponse = response => {
    return next({
      type: successType,
      payload: response
    })
  }

  const handleError = err => {
    console.log('Error calling API', err)
    return next({
      type: failureType,
      error: err
    })
  }

  // TODO Just pass the entire callApi to each of them, and replace with
  // something like R.call
  if (callApi.action === 'add') {
    return doAdd(callApi)
      .then(handleResponse)
      .catch(handleError)
  } else if (callApi.action === 'update') {
    return doUpdate(callApi)
      .then(handleResponse)
      .catch(handleError)
  } else if (callApi.action === 'set') {
    return doSet(callApi)
      .then(handleResponse)
      .catch(handleError)
  } else if (callApi.action === 'delete') {
    return doDelete(callApi)
      .then(handleResponse)
      .catch(handleError)
  } else if (callApi.action === 'login') {
    return doLogin(callApi.provider)
      .then(handleResponse)
      .catch(handleError)
  } else if (callApi.action === 'logout') {
    return doLogout()
      .then(handleResponse)
      .catch(handleError)
  } else if (callApi.action === 'addRef') {
    return addRef(callApi)
      .then(handleResponse)
      .catch(handleError)
  } else if (callApi.action === 'removeRef') {
    return removeRef(callApi)
      .then(handleResponse)
      .catch(handleError)
  } else if (callApi.action === 'getSorted') {
    return doGetSorted(callApi)
      .then(handleResponse)
      .catch(handleError)
  } else if (callApi.action === 'listen') {
    return listenForNewDocuments(callApi)
  } else if (callApi.action === 'sendCaps') {
    return sendCaps(callApi)
      .then(handleResponse)
      .catch(handleError)
  } else if (callApi.action === 'find') {
    return find(callApi)
      .then(handleResponse)
      .catch(handleError)
  } else {
    return doGet(callApi)
      .then(handleResponse)
      .catch(handleError)
  }
}

export default apiMiddleware
