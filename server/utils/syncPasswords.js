import { supabaseAdmin } from '../config/supabase.js';

const defaultPassword = process.argv[2] || 'Password123!';

async function syncPasswords() {
  console.log(`Starting password sync for all users with password: ${defaultPassword}`);

  const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers();
  if (error) {
    console.error('Failed to list users:', error);
    process.exit(1);
  }

  console.log(`Found ${users.length} users in Supabase Auth.`);

  for (const user of users) {
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(user.id, {
      password: defaultPassword,
      email_confirm: true
    });

    if (updateError) {
      console.error(`❌ Failed to update ${user.email}:`, updateError.message);
    } else {
      console.log(`✅ Updated password & confirmed email for: ${user.email}`);
    }
  }

  console.log('\nAll users are now configured and ready to log in!');
}

syncPasswords();
