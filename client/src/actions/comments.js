import * as request from 'superagent'
import { baseUrl } from '../constants'
import { logout } from './users'
import { isExpired } from '../jwt'

export const GOT_SELECTED_COMMENTS = 'GOT_SELECTED_COMMENTS'
export const ADD_COMMENT = 'ADD_COMMENT'
export const DELETE_COMMENT = 'DELETE_COMMENT'

export const getSelectedComments = (ticketId) => (dispatch, getState) => {
  request
    .get(`${baseUrl}/tickets/comments/${ticketId}`)
    .then(response => dispatch({
      type: GOT_SELECTED_COMMENTS,
      payload: response.body.comments
    }))
    .catch(err => alert(err))
}

export const createComment = (comment) => (dispatch, getState) => {
  const state = getState()
  const jwt = state.currentUser.jwt
  const isAdmin = state.isAdmin

  if (isExpired(jwt)) return dispatch(logout())

  if(isAdmin) {
  request
  .post(`${baseUrl}/comments`)
  .set('Authorization', `Bearer ${jwt}`)
  .send(comment)
  .then(response => dispatch({
    type: ADD_COMMENT,
    payload: response.body
  }))
  .catch(err => console.error(err))
  } else {
    delete comment.ticket
    const transforemdComment = {...comment, user: { firstName: state.currentUser.user } }
    dispatch({
      type: ADD_COMMENT,
      payload: transforemdComment
    })
  }
}

export const deleteComment = (id) =>  (dispatch, getState) => {
  const state = getState()
  const jwt = state.currentUser.jwt
  const notQuiteAdmin = state.isAdmin === false
  
  if(notQuiteAdmin) {
    dispatch({
      type: DELETE_COMMENT,
      payload: id
    })
  } else {
    request
    .delete(`${baseUrl}/comments/${id}`)
    .set('Authorization', `Bearer ${jwt}`)
    .then(response => dispatch({
      type: DELETE_COMMENT,
      payload: id
    }))
  }
}
