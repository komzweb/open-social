import { genUserId, genPostId, genCommentId } from '@/lib/nanoid'
import type { NewUser, NewPost, NewComment } from '@/types'

// Define constants for the number of users, posts, and comments
const NUM_USERS = 10
const NUM_POSTS = 100
const NUM_COMMENTS = 100

// Define the date range for the created dates
const startDate = new Date('2024-04-01')
const endDate = new Date('2024-05-15')

// Function to generate a random date within a specified range
function getRandomDate(start: Date, end: Date) {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime()),
  )
}

// Generate user IDs and user data
const userIds = []
const newUsers: NewUser[] = []

for (let i = 0; i < NUM_USERS; i++) {
  const userId = genUserId()
  const userCreatedAt = getRandomDate(startDate, endDate)
  userIds.push({ id: userId, createdAt: userCreatedAt })
  newUsers.push({
    id: userId,
    name: `User ${i + 1}`,
    username: `user${i + 1}`,
    email: `user${i + 1}@example.com`,
    createdAt: userCreatedAt,
  })
}

const titleTemplates = [
  'Breaking: Latest Updates on {topic}',
  "How to Use {topic}: A Beginner's Guide",
  '{topic} vs {topic}: Which One is Better?',
  "10 Secrets of {topic} You Didn't Know",
  'Mastering {topic}: Pro Tips and Tricks',
  'Why is Everyone Talking About {topic}?',
  'The Future of {topic}: 2025 Outlook',
  'Troubleshooting Common {topic} Issues',
  'Boost Your Productivity with {topic}',
  'Discussion: Do We Really Need {topic}?',
]

const topics = [
  'AI',
  'Machine Learning',
  'Blockchain',
  'Cloud Computing',
  '5G',
  'IoT',
  'Cybersecurity',
  'VR/AR',
  'Quantum Computing',
  'Self-driving Cars',
  'Robotics',
  'Edge Computing',
  'Digital Twins',
  'Big Data',
  'DevOps',
  'Microservices',
  'Containerization',
  'Serverless',
  'Progressive Web Apps',
  'Low-code/No-code Development',
]

// Function to generate a random title
function generateRandomTitle(): string {
  const template =
    titleTemplates[Math.floor(Math.random() * titleTemplates.length)]
  return template.replace(
    /{topic}/g,
    () => topics[Math.floor(Math.random() * topics.length)],
  )
}

// Generate post data
const newPosts: NewPost[] = []

for (let i = 0; i < NUM_POSTS; i++) {
  const author = userIds[i % NUM_USERS]
  newPosts.push({
    id: genPostId(),
    title: generateRandomTitle(),
    url: `https://example.com/post/${i + 1}`,
    content: `This is the content of post number ${i + 1}!`,
    category: i % 3 === 0 ? 'general' : i % 3 === 1 ? 'ask' : 'show',
    authorId: author.id,
    createdAt: getRandomDate(author.createdAt, endDate),
  })
}

// Generate comment data
const newComments: NewComment[] = []

for (let i = 0; i < NUM_COMMENTS; i++) {
  const author = userIds[Math.floor(Math.random() * NUM_USERS)]
  const post = newPosts[Math.floor(Math.random() * NUM_POSTS)]
  newComments.push({
    id: genCommentId(),
    content: `This is comment number ${i + 1}!`,
    authorId: author.id,
    postId: post.id,
    createdAt: getRandomDate(author.createdAt, endDate),
  })
}

export { newUsers, newPosts, newComments }
