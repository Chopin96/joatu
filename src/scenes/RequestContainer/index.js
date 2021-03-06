import React, { Component } from 'react'
import { connect } from 'react-redux'

import RequestInfo from './components/RequestInfo'
import ButtonStartChat from '../../components/ButtonStartChat'

import { requestActions } from '../../data/actions'

import { authenticatedUser } from '../../data/user/selectors'

import { requestWithId } from '../../data/request/selectors'

class RequestContainer extends Component {
  requestId = () => this.props.match.params.requestId

  render() {
    if (!this.props.request) {
      return null
    }
    return (
      <div>
        <RequestInfo
          authenticatedUser={this.props.authenticatedUser}
          request={this.props.request}
          onDelete={() => this.props.removeRequest(this.requestId())}
        />
        <ButtonStartChat user={this.props.request.owner} />
      </div>
    )
  }
}

function mapStateToProps(state, ownProps) {
  const requestId = ownProps.match.params.requestId

  return {
    authenticatedUser: authenticatedUser(state),
    request: requestWithId(requestId)(state)
  }
}

const mapDispatchToProps = {
  removeRequest: requestActions.remove
}

export default connect(mapStateToProps, mapDispatchToProps)(RequestContainer)
