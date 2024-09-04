import z from 'zod'
import { ITEM_LIST_MAX_PAGES } from '@/lib/constants'

export const ItemQueryParamsSchema = z.object({
  page: z.coerce.number().min(1).max(ITEM_LIST_MAX_PAGES).optional().default(1),
  search: z.string().trim().max(100).optional().default(''),
  sort: z.enum(['score', 'newest']).optional().default('score'),
  cat: z.enum(['all', 'general', 'ask', 'show']).optional().default('all'),
  vote: z.enum(['all', 'up', 'down']).optional().default('all'),
})
