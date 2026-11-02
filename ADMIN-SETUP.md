# Fashion Point Admin Panel — feature branch

This is an initial admin scaffold, not yet a production-ready end-to-end integration.

## Configure
1. Create a Supabase project owned by the shop owner or explicitly agree on ownership and billing.
2. Create the owner account in Supabase Auth.
3. Run supabase/schema.sql in Supabase SQL Editor.
4. Use the owner's real Auth user UUID in the final commented INSERT in schema.sql to grant the admin role. Never grant admin rights from browser code.
5. Put the Supabase project URL and public anon/publishable key into admin.js. Never use a service_role/secret key in browser code.
6. Deploy this branch as a Netlify preview and test non-admin denial, login, CRUD, image upload, and mobile layout.

## Important limitation
The public store still uses the hard-coded PRODUCTS array in script.js. Admin edits will not appear in the public catalogue until script.js is connected to the Supabase products table. Do not call this finished until that integration and testing are completed.

Owner handover should include Netlify, Supabase project access, source code, product instructions, backup/billing responsibility, and the agreed support period.
