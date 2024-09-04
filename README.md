# OpenSocial

OpenSocial is a social media app built with Next.js and PostgreSQL. The project is published as an advanced example for developers who want to build apps like Hacker News or Reddit.

![OpenSocial](./public/images/open-social.png)

## Key Features

- Login with GitHub and Magic Link (email)
- Post
- Comment
- Reply
- Vote (upvote, downvote)
- Bookmark
- Sort posts
- Search posts
- Update post scores using Cron Jobs
- User score "Karma"
- Dark mode
- Mobile friendly

## Getting Started

1. Clone the repository:

   ```
   git clone https://github.com/komzweb/open-social.git
   cd open-social
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Set up a local PostgreSQL database:

   - Install PostgreSQL if you haven't already.
   - Start the `psql` command line tool:
     ```
     psql -U postgres
     ```
     or
     ```
     psql postgres
     ```
   - Create a new database:
     ```
     CREATE DATABASE open_social_dev;
     ```
   - Exit the `psql` prompt with `\q`.

4. Set up environment variables:

   You can use the following command to create a `.env.local` file:

   ```
   cp .env.local.example .env.local
   ```

   - Replace the `DB_URL` with your own values.
   - You can generate the `AUTH_SECRET` with `npx auth secret`.
   - You can get the `AUTH_GITHUB_ID` and `AUTH_GITHUB_SECRET` by creating an application in the [GitHub Developer Settings](https://github.com/settings/developers).
   - You can get the `AUTH_RESEND_KEY` by creating an account in [Resend](https://resend.com/).
   - Vercel recommends using a random string of at least 16 characters for the `CRON_SECRET` value. You can create one with a password generator like [1Password](https://1password.com/password-generator).
   - You can get the `POSTGRES_*` and `KV_*` environment variables by creating an account in [Vercel](https://vercel.com/).
   - Replace the `EMAIL_FROM` and `EMAIL_SUPPORT` with your own values.

5. Run database migrations:

   ```
   npm run drizzle:generate
   npm run drizzle:migrate
   ```

   If you want to move quickly without migration files during local development, you can use the following command to push the schema to your database:

   ```
   npm run drizzle:push
   ```

6. (Optional) Seed the database with sample data:

   ```
   npm run db:seed
   ```

   This command populates your database with sample users, posts, and comments, which can be helpful during development.

7. Run the development server:

   ```
   npm run dev
   ```

8. Open [http://localhost:3000](http://localhost:3000) in your browser to view the app.

## Customization

Before running the app, you may want to customize some aspects:

- Replace the values in `lib/constants.ts` with your own to customize the application name, organization name, and other global constants.
- Update `app/apple-icon.png`, `app/favicon.ico`, `app/manifest.ts`, and `app/layout.tsx` with your application's metadata and icons.
- Customize authentication email templates in `lib/auth-send-request.ts` to match your branding.

## Cron Jobs

This project uses [Vercel Cron Jobs](https://vercel.com/docs/cron-jobs) to update post scores periodically.

- In the local development environment, post scores are not automatically updated. To manually update post scores, run the following command:
  ```
  curl http://localhost:3000/api/update-post-scores
  ```
- The schedule for the Cron Job in the production environment can be set in the `vercel.json` file. Modify it as needed.

## Tech Stack

- [Next.js](https://nextjs.org/) (App Router)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Auth.js](https://authjs.dev/)
- [Drizzle ORM](https://orm.drizzle.team/) (PostgreSQL)
- [Vercel Postgres](https://vercel.com/storage/postgres)
- [Vercel KV](https://vercel.com/storage/kv)

## Contributing

We welcome contributions to the project. Before submitting a pull request, please check existing issues or create a new one to discuss your proposed changes.

## License

This project is released under the MIT License. See the [LICENSE](LICENSE) file for details.

## Support

X/Twitter: [@komzweb](https://x.com/komzweb).
