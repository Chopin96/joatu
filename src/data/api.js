import * as R from 'ramda'

import { firebase } from './config'
import 'firebase/firestore'
import auth from './auth'

const db = firebase.firestore()
const authFunctions = auth(firebase)

const toFirestore = body => {
  const makeGeoPoint = coords =>
    new firebase.firestore.GeoPoint(coords.latitude, coords.longitude)

  const transformations = {
    coordinates: makeGeoPoint
  }

  return R.evolve(transformations, body)
}

const getCollection = collection => {
  if (typeof collection === 'string') {
    return db.collection(collection)
  } else {
    return db
      .collection(collection.root)
      .doc(collection.ofDocument)
      .collection(collection.subcollection)
  }
}

const getStatement = ({ collection, orderBy }) => {
  let statement = getCollection(collection)
  if (orderBy) {
    statement = statement.orderBy(orderBy)
  }
  return statement
}

// {
//   id: { ...data },
//   ...
// }
export function doGet({ collection, metadata }) {
  const coll = {}
  if (metadata) {
    coll.metadata = metadata
  }

  return getCollection(collection)
    .get()
    .then(querySnapshot => {
      querySnapshot.forEach(doc => {
        coll[doc.id] = doc.data()
      })
      return coll
    })
}

// { data: [
//     { id, ...data },
//     ...
//   ],
//   metadata
// }

export function doGetSorted({ collection, metadata, orderBy }) {
  const coll = { data: [] }
  if (metadata) {
    coll.metadata = metadata
  }

  return getStatement({ collection, orderBy })
    .get()
    .then(querySnapshot => {
      querySnapshot.forEach(doc => {
        coll.data.push({ id: doc.id, ...doc.data() })
      })
      return coll
    })
}

export function doAdd(collection, data, metadata) {
  return getCollection(collection)
    .add(toFirestore(data))
    .then(docRef => ({
      id: docRef.id,
      data,
      metadata
    }))
}

export function doSet(collectionName, id, data) {
  return getCollection(collectionName)
    .doc(id)
    .set(toFirestore(data))
    .then(docRef => ({
      id,
      data
    }))
}

export function doDelete(collectionName, id) {
  return getCollection(collectionName)
    .doc(id)
    .delete()
    .then(() => ({
      id
    }))
}

export function doLogin(provider) {
  switch (provider) {
    case 'facebook':
      return authFunctions.loginWithFacebook().then(result => {
        return {
          id: result.user.uid,
          displayName: result.user.displayName,
          email: result.user.email,
          imgUrl: result.user.photoURL
        }
      })
    default:
      throw Error('Unknown provider ' + provider)
  }
}

export async function addParticipant(projectId, userId) {
  const pathToUser = ['participants', userId].join('.')
  const pathToProject = ['memberProjects', projectId].join('.')

  // TODO Dispatch 2 actions rather than separate here; can then
  // be done in parallel
  const project = await getCollection('projects').doc(projectId)
  await project.update({
    [pathToUser]: true
  })
  const user = await getCollection('users').doc(userId)
  await user.update({
    [pathToProject]: Date.now()
  })

  return {
    projectId,
    userId
  }
}

export async function addRef(data) {
  const { collection, category, fromId, toId, withData } = data
  const path = [category, toId].join('.')

  return getCollection(collection)
    .doc(fromId)
    .update({
      [path]: withData || Date.now()
    })
    .then(() => data)
}

export async function removeRef(data) {
  const { collection, category, fromId, toId } = data
  const path = [category, toId].join('.')

  return getCollection(collection)
    .doc(fromId)
    .update({
      [path]: firebase.firestore.FieldValue.delete()
    })
    .then(() => data)
}

export function doLogout(provider) {
  return authFunctions.logUserOut()
}
