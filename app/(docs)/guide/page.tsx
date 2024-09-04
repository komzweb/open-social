import type { Metadata } from 'next'
import Link from 'next/link'
import { Pencil } from 'lucide-react'

import { auth } from '@/auth/auth'
import {
  APP_NAME,
  SITE_URL,
  USERS_USERNAME_MIN_LENGTH,
  USERS_USERNAME_MAX_LENGTH,
  USERS_NAME_MAX_LENGTH,
  USERS_BIO_MAX_LENGTH,
  POSTS_TITLE_MIN_LENGTH,
  POSTS_TITLE_MAX_LENGTH,
  POSTS_CONTENT_MAX_LENGTH,
  COMMENTS_CONTENT_MIN_LENGTH,
  COMMENTS_CONTENT_MAX_LENGTH,
  POST_EDIT_LIMIT,
  COMMENT_EDIT_LIMIT,
  DELETED_EMAIL_COOLDOWN_DAYS,
  DAYS_AS_NEW_USER,
  MIN_SCORE_FOR_REGULAR_USER,
  POSTS_TITLE_EDIT_TIME_LIMIT_HOURS,
  ITEMS_DELETION_PENALTY_DAYS,
} from '@/lib/constants'

const metaTitle = 'Guide'
const metaDescription = `Guide for using ${APP_NAME}.`

export const metadata: Metadata = {
  title: metaTitle,
  description: metaDescription,
  openGraph: {
    title: metaTitle,
    description: metaDescription,
    url: `${SITE_URL}/guide`,
  },
}

export default async function GuidePage() {
  const session = await auth()
  const currentUserUsername = session?.user?.username

  return (
    <article>
      <header>
        <h1>Guide</h1>
      </header>
      <section>
        <h2>Account Creation</h2>
        <p>
          Account creation and login can be done on the{' '}
          <Link href="/login">login page</Link>. If you are using it for the
          first time, an account will be created automatically when you log in.
        </p>
        <h3>Username</h3>
        <p>
          Username is a unique account name and is also used in the URL of the
          profile page. You cannot change the username.
        </p>
        <p>
          Only alphanumeric characters and underscores ( _ ) can be used in the
          username.
        </p>
        <p>
          Username can be created in the range of {USERS_USERNAME_MIN_LENGTH} -{' '}
          {USERS_USERNAME_MAX_LENGTH} characters.
        </p>
      </section>
      <section>
        <h2>Profile editing</h2>
        <h3>Name</h3>
        <p>Name can be freely changed. You can use Japanese.</p>
        <p>
          Name can be created in the range of {USERS_NAME_MAX_LENGTH}{' '}
          characters.
        </p>
        <h3>Self-introduction</h3>
        <p>
          Self-introduction can be created in the range of{' '}
          {USERS_BIO_MAX_LENGTH} characters.
        </p>
      </section>
      <section>
        <h2>Account deletion</h2>
        <p>
          Account deletion can be done from the{' '}
          <Link
            href={currentUserUsername ? `/u/${currentUserUsername}` : '/login'}
          >
            profile page
          </Link>
          .
        </p>
        <p>
          If you delete your account, your account information will be deleted,
          but the posts and comments you created will not be deleted. The author
          name will be hidden, but the content will remain in a public state. If
          you want to delete or hide the content, you need to delete it manually
          before deleting your account.
        </p>
        <p>
          After deleting your account, you cannot register a new account with
          the same email address for {DELETED_EMAIL_COOLDOWN_DAYS} days.
        </p>
      </section>
      <section>
        <h2>Post creation</h2>
        <p>
          To create a post, you need to log in. After logging in, you can create
          a post from the
          <span className="mx-1 inline-flex items-center">
            <Pencil className="h-3 w-3" />
          </span>
          icon.
        </p>
        <h3>
          Title<span className="text-xs font-normal">（Required）</span>
        </h3>
        <p>
          The title of the post can be created in the range of{' '}
          {POSTS_TITLE_MIN_LENGTH} - {POSTS_TITLE_MAX_LENGTH} characters. The
          minimum number of characters is set to make the content of the post
          easy to understand at a glance and to suppress fishing posts and spam
          posts.
        </p>
        <h3>
          URL<span className="text-xs font-normal">（Optional）</span>
        </h3>
        <p>
          Specify the original source of the post. It helps other users to check
          the details and reliability of the information by making the source
          clear.
        </p>
        <h3>
          Content<span className="text-xs font-normal">（Optional）</span>
        </h3>
        <p>
          If the post category is &quot;Question&quot; or &quot;Product
          Introduction&quot;, you must enter the content.
        </p>
        <p>
          The content of the post can be created in the range of{' '}
          {POSTS_CONTENT_MAX_LENGTH} characters.
        </p>
        <p>
          You can use <Link href="/markdown">Markdown</Link>.
        </p>
      </section>
      <section>
        <h2>Post editing</h2>
        <p>
          The number of times a post can be edited is {POST_EDIT_LIMIT} times
          per post.
        </p>
        <p>
          Only the post title has an edit limit of{' '}
          {POSTS_TITLE_EDIT_TIME_LIMIT_HOURS} hours since the post was created.
          This is to maintain the consistency of the thread.
        </p>
        <p>
          To ensure transparency, the previous information is published as a
          history.
        </p>
      </section>
      <section>
        <h2>Post deletion</h2>
        <p>
          The result of post deletion is different depending on the following
          conditions:
        </p>
        <ul>
          <li>
            <span className="font-semibold">
              If there is an action from other users (comments, evaluations,
              bookmarks) on the post:
            </span>
            The author name, post URL, and post content will be hidden, and the
            post page will remain in a viewable state.
          </li>
          <li>
            <span className="font-semibold">
              If there is no action from other users (comments, evaluations,
              bookmarks) on the post:
            </span>
            The post will be completely deleted.
          </li>
        </ul>
        <p>
          If you delete a post within {ITEMS_DELETION_PENALTY_DAYS} days and the
          total number of evaluations is positive, the same number of karma as
          the evaluation will be deducted. This is a measure to prevent
          misconduct such as posting false information and getting a lot of
          evaluations and then deleting it (anonymizing it) immediately.
        </p>
      </section>
      <section>
        <h2>Comment/Reply Creation</h2>
        <p>
          Comments and replies can be created in the range of{' '}
          {COMMENTS_CONTENT_MIN_LENGTH} - {COMMENTS_CONTENT_MAX_LENGTH}{' '}
          characters. {APP_NAME} is a place for discussion, so comments and
          replies that are short and have no content, such as greetings and
          replies, are not desirable. A minimum number of characters is provided
          to encourage more useful and constructive discussions.
        </p>
        <p>
          Comments and replies can use <Link href="/markdown">Markdown</Link>.
        </p>
      </section>
      <section>
        <h2>Comment/Reply Editing</h2>
        <p>
          The number of times a comment or reply can be edited is{' '}
          {COMMENT_EDIT_LIMIT} times per comment/reply.
        </p>
        <p>
          To ensure transparency, the previous information is published as a
          history.
        </p>
      </section>
      <section>
        <h2>Comment/Reply Deletion</h2>
        <p>
          The result of comment/reply deletion is different depending on the
          following conditions:
        </p>
        <ul>
          <li>
            <span className="font-semibold">
              If there is an action from other users (comments, evaluations) on
              the comment/reply:
            </span>
            The comment/reply will be hidden.
          </li>
          <li>
            <span className="font-semibold">
              If there is no action from other users (comments, evaluations) on
              the comment/reply:
            </span>
            The comment/reply will be completely deleted.
          </li>
        </ul>
      </section>
      <section>
        <h2>Voting (Evaluation)</h2>
        <p>
          The voting system has a function to naturally eliminate spam and
          inappropriate posts. Posts and comments with low evaluations will not
          stand out, so the overall quality can be maintained.
        </p>
        <p>
          High-evaluation posts and comments are displayed at the top, so they
          can be seen by more users. This makes useful information and valuable
          discussions more noticeable.
        </p>
        <p>
          High-evaluation posts and comments are also added to the author&apos;s
          &quot;karma&quot;, which motivates them. This increases the number of
          high-quality posts and comments, and the community becomes more
          active.
        </p>
        <h3>Voting Rules</h3>
        <ul>
          <li>You can vote for a post or comment only once.</li>
          <li>You cannot vote for your own posts or comments.</li>
          <li>You cannot vote for posts or comments from unknown users.</li>
          <li>
            New users (users who have not created an account for less than{' '}
            {DAYS_AS_NEW_USER} days, or users with less than{' '}
            {MIN_SCORE_FOR_REGULAR_USER} karma) cannot vote for posts or
            comments.
          </li>
        </ul>
      </section>
      <section>
        <h2>Bookmark</h2>
        <p>
          Bookmark is useful when you want to check the details of a post later
          or when you want to track the discussion in the post.
        </p>
        <p>
          Bookmark count is not added to the author&apos;s &quot;karma&quot;.
        </p>
      </section>
    </article>
  )
}
