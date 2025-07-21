# Disable Email Confirmation in Supabase

## Steps to Disable Email Confirmation:

1. **Go to your Supabase Dashboard**
   - Visit: https://supabase.com/dashboard
   - Select your project: `ljtujpxhwuxarcsxzsds`

2. **Navigate to Authentication Settings**
   - Click on "Authentication" in the left sidebar
   - Click on "Settings" tab

3. **Disable Email Confirmation**
   - Find "Enable email confirmations"
   - **Turn OFF** this setting
   - Click "Save" to apply changes

4. **Update Site URL (Important!)**
   - In the same settings page, find "Site URL"
   - Change it from `http://localhost:3000` to: `https://modev-ahmad.vercel.app`
   - Add this URL to "Redirect URLs" if not already there
   - Click "Save"

## Why This is Needed:

- Currently, users must confirm their email before they can log in
- The confirmation email redirects to `localhost:3000` which doesn't work in production
- Disabling email confirmation allows immediate login after registration
- This matches the expected user experience for your app

## After Making These Changes:

1. **Test Registration**: New users should be able to register and immediately log in
2. **Test Login**: Existing users should be able to log in without email confirmation
3. **No More Email Confirmation**: Users won't receive confirmation emails

## Alternative: Keep Email Confirmation but Fix Redirect

If you want to keep email confirmation:
1. Keep "Enable email confirmations" ON
2. Update "Site URL" to `https://modev-ahmad.vercel.app`
3. Add `https://modev-ahmad.vercel.app` to "Redirect URLs"
4. Users will still need to confirm email, but the redirect will work properly

**Recommendation**: Disable email confirmation for a smoother user experience. 