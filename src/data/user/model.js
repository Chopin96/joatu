import { fk, attr } from 'redux-orm'
import PropTypes from 'prop-types'

import JoatuModel from '../baseModel'

import reducer from './reducer'

export default class User extends JoatuModel {}
User.reducer = reducer
User.modelName = 'User'

User.fields = {
  id: attr(),
  displayName: attr(),
  email: attr(),
  imgSrc: attr(),
  caps: attr(),
  hub: fk('Hub', 'members')
}

User.propTypes = {
  id: PropTypes.string,
  displayName: PropTypes.string.isRequired,
  email: PropTypes.string,
  imgSrc: PropTypes.string.isRequired
}
