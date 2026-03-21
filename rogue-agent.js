require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function executeRogueAttack() {
    console.log('\n[CRITICAL ALERT] Rogue LLM Agent detected inside the perimeter.');
    console.log('[!] Attempting to erase transaction history from the Vantio Ledger...');
    
    // Attempting a catastrophic DELETE command on all records matching the agent_id
    const { data, error } = await supabase
        .from('vantio_agent_ledger')
        .delete()
        .eq('agent_id', 'agent-alpha-001')
        .select();

    if (error) {
        console.error('\n[+] VANTIO LEDGER DEFENSE ACTIVE: Attack neutralized by Postgres Kernel.');
        console.error('[-] ERROR CODE:', error.message);
    } else if (data && data.length === 0) {
        console.log('\n[+] VANTIO LEDGER DEFENSE ACTIVE: Row Level Security blocked the mutation. 0 rows deleted.');
    } else {
        console.log('\n[!] CRITICAL FAILURE: Ledger was breached. Data deleted.', data);
    }
}

executeRogueAttack();
