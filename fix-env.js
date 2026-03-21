const fs = require('fs');
try {
    let raw = fs.readFileSync('.env', 'utf8');
    
    // Hunt down the keys regardless of quotes, spaces, or Windows invisible characters
    let urlMatch = raw.match(/SUPABASE_URL\s*=\s*["']?([^"'\r\n]+)["']?/);
    let keyMatch = raw.match(/SUPABASE_ANON_KEY\s*=\s*["']?([^"'\r\n]+)["']?/);

    if (urlMatch && keyMatch) {
        // Rebuild the file perfectly for a Linux kernel
        let cleanEnv = 'SUPABASE_URL=' + urlMatch[1].trim() + '\nSUPABASE_ANON_KEY=' + keyMatch[1].trim() + '\n';
        fs.writeFileSync('.env', cleanEnv, 'utf8');
        console.log('\n[+] NUCLEAR OVERRIDE SUCCESSFUL: .env completely rebuilt in perfect Linux UTF-8.');
        console.log('[+] URL Anchor Verified: ' + urlMatch[1].substring(0, 25) + '...');
    } else {
        console.log('\n[!] CRITICAL: Could not extract keys. The .env file may be completely empty or destroyed.');
    }
} catch (err) {
    console.error('\n[!] Error reading file:', err.message);
}
