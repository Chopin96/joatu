import firebase from 'firebase'

import { CALL_API } from '../actions'

import {
  create as createDiscussion,
  remove as deleteDiscussion,
  find as findDiscussion,
  FIND_DISCUSSION_SUCCEEDED
} from '../discussion/actions'

export const FETCH_PROJECTS_STARTED = 'FETCH_PROJECTS_STARTED'
export const FETCH_PROJECTS_SUCCEEDED = 'FETCH_PROJECTS_SUCCEEDED'
export const FETCH_PROJECTS_FAILED = 'FETCH_PROJECTS_FAILED'

export const CREATE_PROJECT_STARTED = 'CREATE_PROJECT_STARTED'
export const CREATE_PROJECT_SUCCEEDED = 'CREATE_PROJECT_SUCCEEDED'
export const CREATE_PROJECT_FAILED = 'CREATE_PROJECT_FAILED'

export const UPDATE_PROJECT_STARTED = 'UPDATE_PROJECT_STARTED'
export const UPDATE_PROJECT_SUCCEEDED = 'UPDATE_PROJECT_SUCCEEDED'
export const UPDATE_PROJECT_FAILED = 'UPDATE_PROJECT_FAILED'

export const REMOVE_PROJECT_STARTED = 'REMOVE_PROJECT_STARTED'
export const REMOVE_PROJECT_SUCCEEDED = 'REMOVE_PROJECT_SUCCEEDED'
export const REMOVE_PROJECT_FAILED = 'REMOVE_PROJECT_FAILED'

export const ADD_PARTICIPANT_TO_PROJECT_STARTED =
  'ADD_PARTICIPANT_TO_PROJECT_STARTED'
export const ADD_PARTICIPANT_TO_PROJECT_SUCCEEDED =
  'ADD_PARTICIPANT_TO_PROJECT_SUCCEEDED'
export const ADD_PARTICIPANT_TO_PROJECT_FAILED =
  'ADD_PARTICIPANT_TO_PROJECT_FAILED'

export const APPROVE_PARTICIPANT_STARTED = 'APPROVE_PARTICIPANT_STARTED'
export const APPROVE_PARTICIPANT_SUCCEEDED = 'APPROVE_PARTICIPANT_SUCCEEDED'
export const APPROVE_PARTICIPANT_FAILED = 'APPROVE_PARTICIPANT_FAILED'

export const REMOVE_PARTICIPANT_FROM_PROJECT_STARTED =
  'REMOVE_PARTICIPANT_FROM_PROJECT_STARTED'
export const REMOVE_PARTICIPANT_FROM_PROJECT_SUCCEEDED =
  'REMOVE_PARTICIPANT_FROM_PROJECT_SUCCEEDED'
export const REMOVE_PARTICIPANT_FROM_PROJECT_FAILED =
  'REMOVE_PARTICIPANT_FROM_PROJECT_FAILED'

const doFetchProjects = () => ({
  [CALL_API]: {
    types: [
      FETCH_PROJECTS_STARTED,
      FETCH_PROJECTS_SUCCEEDED,
      FETCH_PROJECTS_FAILED
    ],
    collection: 'projects'
  }
})

export const fetch = () => (dispatch, getState) => {
  return dispatch(doFetchProjects())
}

const doCreateProject = body => ({
  [CALL_API]: {
    types: [
      CREATE_PROJECT_STARTED,
      CREATE_PROJECT_SUCCEEDED,
      CREATE_PROJECT_FAILED
    ],
    collection: 'projects',
    action: 'add',
    body: Object.assign({ isApproved: false }, body)
  }
})

export const create = body => async (dispatch, getState) => {
  const result = await dispatch(doCreateProject(body))

  if (result.type === CREATE_PROJECT_SUCCEEDED) {
    dispatch(
      createDiscussion({
        topic: result.payload.id,
        type: 'project'
      })
    )
  }
}

const doUpdateProject = (id, body) => ({
  [CALL_API]: {
    types: [
      UPDATE_PROJECT_STARTED,
      UPDATE_PROJECT_SUCCEEDED,
      UPDATE_PROJECT_FAILED
    ],
    collection: 'projects',
    action: 'update',
    id,
    body
  }
})

export const update = (id, body) => (dispatch, getState) => {
  return dispatch(doUpdateProject(id, body))
}

const doDeleteProject = id => ({
  [CALL_API]: {
    types: [
      REMOVE_PROJECT_STARTED,
      REMOVE_PROJECT_SUCCEEDED,
      REMOVE_PROJECT_FAILED
    ],
    collection: 'projects',
    action: 'delete',
    id
  }
})

export const remove = id => async (dispatch, getState) => {
  const result = await dispatch(doDeleteProject(id))

  if (result.type === REMOVE_PROJECT_SUCCEEDED) {
    // pass list of where clauses, each is an array of 3
    const discussion = await dispatch(findDiscussion([['topic', '==', id]]))
    if (discussion.type === FIND_DISCUSSION_SUCCEEDED) {
      if (discussion.payload.length !== 1) {
        console.error(
          'Expected exactly 1 discussion, found',
          discussion.payload
        )
      } else {
        return dispatch(deleteDiscussion(discussion.payload[0].id))
      }
    }
  }
  return result
}

export const addParticipantAction = (projectId, userId, participantType) => {
  const pathToUser = [participantType, userId].join('.')

  return {
    [CALL_API]: {
      types: [
        ADD_PARTICIPANT_TO_PROJECT_STARTED,
        ADD_PARTICIPANT_TO_PROJECT_SUCCEEDED,
        ADD_PARTICIPANT_TO_PROJECT_FAILED
      ],
      action: 'update',
      collection: 'projects',
      id: projectId,
      data: { [pathToUser]: true },
      merge: { participantId: userId, participantType }
    }
  }
}

export const addParticipant = (projectId, userId) => (dispatch, getState) => {
  return dispatch(
    addParticipantAction(projectId, userId, 'pendingParticipants')
  )
}

export const removeParticipantAction = (projectId, userId) => {
  const participant = ['participants', userId].join('.')
  const pendingParticipant = ['pendingParticipants', userId].join('.')
  return {
    [CALL_API]: {
      types: [
        REMOVE_PARTICIPANT_FROM_PROJECT_STARTED,
        REMOVE_PARTICIPANT_FROM_PROJECT_SUCCEEDED,
        REMOVE_PARTICIPANT_FROM_PROJECT_FAILED
      ],
      action: 'update',
      collection: 'projects',
      id: projectId,
      data: {
        [participant]: firebase.firestore.FieldValue.delete(),
        [pendingParticipant]: firebase.firestore.FieldValue.delete()
      },
      merge: { participantId: userId }
    }
  }
}

export const removeParticipant = (projectId, userId) => (
  dispatch,
  getState
) => {
  return dispatch(removeParticipantAction(projectId, userId))
}

export const approveParticipant = (projectId, userId) => (
  dispatch,
  getState
) => {
  return dispatch(removeParticipantAction(projectId, userId)).then(
    dispatch(addParticipantAction(projectId, userId, 'participants'))
  )
}
