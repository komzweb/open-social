import { nanoid } from 'nanoid'

export const genUserId = () => {
  return nanoid(16)
}

export const genPostId = () => {
  return nanoid(18)
}

export const genCommentId = () => {
  return nanoid(20)
}

export const genBookmarkId = () => {
  return nanoid(22)
}

export const genVoteId = () => {
  return nanoid(24)
}
