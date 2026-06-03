# Supabase Setup Guide

This guide will help you configure a new Supabase project for **finBoard**.

## 1. Create a Supabase Project

1. Go to [database.new](https://database.new) and sign in or create an account.
2. Create a new project. Name it "finBoard" or any name of your choice.
3. Wait a few minutes for the database to provision.

## 2. Configure Environment Variables

1. Go to **Project Settings** (the gear icon on the left).
2. Go to **API**.
3. Under **Project URL**, copy your `URL`.
4. Under **Project API Keys**, copy your `anon` `public` key.
5. In the root of your finBoard project, create a file named `.env` (or copy `.env.example` if it exists).
6. Add the values you copied:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## 3. Configure Authentication

1. In the Supabase dashboard, go to **Authentication** > **Providers**.
2. Make sure **Email** is enabled.
3. If you want to require users to confirm their email before logging in, turn on **Confirm email**.
4. To allow for better development velocity and avoid being temporarily blocked, you may want to configure **Rate Limits** under **Authentication** > **Rate Limits** depending on your needs.

## 4. Set Up Redirect URLs

Redirect URLs tell Supabase where it is allowed to send users after they confirm their email or reset their password.

1. In the Supabase dashboard, go to **Authentication** > **URL Configuration**.
2. Under **Site URL**, set it to your primary URL. For local development, this is:
   ```
   http://localhost:5173/
   ```
3. Under **Redirect URLs**, add any additional paths. For example, for password resets:
   ```
   http://localhost:5173/reset-password
   ```

## 5. Next Steps

- Start the development server using `npm run dev`.
- The application will now securely connect to your Supabase project. If the environment variables are missing, the application will show a configuration error instead of crashing.
