import entityReducer from '../entityReducer'

import {
  FETCH_HUBS_SUCCEEDED,
  CREATE_HUB_SUCCEEDED,
  UPDATE_HUB_SUCCEEDED,
  DELETE_HUB_SUCCEEDED
} from './actions'

const hubReducer = entityReducer({
  fetchActionType: FETCH_HUBS_SUCCEEDED,
  createActionType: CREATE_HUB_SUCCEEDED,
  updateActionType: UPDATE_HUB_SUCCEEDED,
  removeActionType: DELETE_HUB_SUCCEEDED
})

export default hubReducer