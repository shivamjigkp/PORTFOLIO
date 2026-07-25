const fs = require('fs');
const path = require('path');

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error('\n❌ Missing SUPABASE_URL and/or SUPABASE_ANON_KEY environment variables.\n   Set them in Vercel → Project Settings → Environment Variables.\n');
  process.exit(1);
}

const outPath = path.join(__dirname, '..', 'src', 'js', 'supabaseClient.js');

const content = `/* AUTO-GENERATED at build time — do not edit by hand, do not commit. */
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

export const supabase = createClient(
  ${JSON.stringify(url)},
  ${JSON.stringify(key)}
);
`;

fs.writeFileSync(outPath, content);
console.log(`✅ Generated ${path.relative(process.cwd(), outPath)}`);