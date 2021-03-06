import React from "react"
import classNames from "classnames"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import values from "lodash/values"

import IdeaEditForm from "./idea_edit_form"
import IdeaLiveEditContent from "./idea_live_edit_content"
import ConditionallyDraggableIdeaContent from "./conditionally_draggable_idea_content"
import * as AppPropTypes from "../prop_types"
import styles from "./css_modules/idea.css"
import {
  selectors,
  actions,
} from "../redux"

export const Idea = props => {
  const { idea, currentUser, retroChannel, stage, users, actions } = props
  const classes = classNames(styles.index, {
    [styles.highlighted]: idea.isHighlighted,
  })

  const userIsEditing = idea.inEditState && idea.isLocalEdit

  let content
  if (userIsEditing) {
    content = (<IdeaEditForm
      idea={idea}
      retroChannel={retroChannel}
      currentUser={currentUser}
      stage={stage}
      users={users}
      actions={actions}
    />)
  } else if (idea.liveEditText) {
    content = <IdeaLiveEditContent idea={idea} />
  } else {
    content = <ConditionallyDraggableIdeaContent {...props} />
  }

  return (
    <li className={classes} title={idea.body} key={idea.id}>
      {content}
    </li>
  )
}

Idea.propTypes = {
  idea: AppPropTypes.idea.isRequired,
  retroChannel: AppPropTypes.retroChannel.isRequired,
  currentUser: AppPropTypes.presence.isRequired,
  stage: AppPropTypes.stage.isRequired,
  assignee: AppPropTypes.presence,
  users: AppPropTypes.presences.isRequired,
  actions: AppPropTypes.actions,
}

Idea.defaultProps = {
  actions: {},
  assignee: {},
}

const mapStateToProps = (state, { idea }) => ({
  assignee: selectors.getUserById(state, idea.assignee_id),
  users: values(state.usersById),
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(Idea)
