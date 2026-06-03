# Social Authentication Setup Guide

To fully enable Google and Facebook sign-in for finBoard, you must configure both identity providers in your Supabase dashboard and the respective developer consoles.

## 1. Configure Supabase Redirect URLs
Before configuring the providers, ensure Supabase knows where to redirect users after successful authentication.

1. Go to your **Supabase Dashboard** -> **Authentication** -> **URL Configuration**.
2. **Site URL**: Ensure your primary site URL is set correctly (e.g., your production URL or `http://localhost:5173` for local development).
3. **Redirect URLs**: Add the following URIs to the allowed list:
   - `http://localhost:5173/**` (for local development)
   - `https://your-production-domain.com/**` (for production)

---

## 2. Google OAuth Setup

### Step 1: Google Cloud Console
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project or select an existing one.
3. Navigate to **APIs & Services** -> **OAuth consent screen** and configure the screen (User Type: External, fill in app name, support email, etc.).
4. Go to **Credentials** -> **Create Credentials** -> **OAuth client ID**.
5. Select **Web application** as the Application type.
6. Under **Authorized redirect URIs**, add your Supabase project's OAuth callback URL. You can find this in your Supabase Dashboard under **Authentication** -> **Providers** -> **Google**. It will look like: `https://<project-ref>.supabase.co/auth/v1/callback`.
7. Click **Create** and copy the **Client ID** and **Client Secret**.

### Step 2: Supabase Dashboard
1. Go to your **Supabase Dashboard** -> **Authentication** -> **Providers**.
2. Select **Google**.
3. Toggle "Enable Google".
4. Paste the **Client ID** and **Client Secret** you obtained from Google.
5. Click **Save**.

---

## 3. Facebook OAuth Setup

### Step 1: Facebook Developers Console
1. Go to the [Facebook Developers portal](https://developers.facebook.com/).
2. Click **Create App** (Select "Authenticate and request data from users with Facebook Login" -> "No, I'm not building a game").
3. Go to **App Settings** -> **Basic** to find your **App ID** and **App Secret**.
4. In the left sidebar, add the product **Facebook Login** -> **Settings**.
5. Under **Valid OAuth Redirect URIs**, add your Supabase project's OAuth callback URL. It will look like: `https://<project-ref>.supabase.co/auth/v1/callback`.
6. Save changes.

### Step 2: Supabase Dashboard
1. Go to your **Supabase Dashboard** -> **Authentication** -> **Providers**.
2. Select **Facebook**.
3. Toggle "Enable Facebook".
4. Paste the **Client ID (App ID)** and **Client Secret (App Secret)** you obtained from Facebook.
5. Click **Save**.

> **Note**: For Facebook login to work in production for public users, you will need to submit your app for review in the Facebook Developers console and switch the app mode from Development to Live.
