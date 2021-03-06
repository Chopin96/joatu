import React from 'react'
import PropTypes from 'prop-types'
import Button from 'material-ui/Button'
import { withStyles } from 'material-ui/styles'

const styles = theme => ({
  button: {
    margin: theme.spacing.unit
  }
})

function ButtonJoin(props) {
  const { classes } = props

  return (
    <Button
      className={classes.button}
      onClick={props.handleClick}
      variant="raised"
      color="primary"
      disabled={!props.authenticatedUser}
    >
      I'm in!
    </Button>
  )
}

ButtonJoin.propTypes = {
  authenticatedUser: PropTypes.object
}

export default withStyles(styles)(ButtonJoin)
