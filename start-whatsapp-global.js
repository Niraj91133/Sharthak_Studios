const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const ENV_PATH = path.join(__dirname, '.env.local');
const PORT = 3001;

// Load Env
const envRaw = fs.readFileSync(ENV_PATH, 'utf8');
const env = {};
envRaw.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) env[key.trim()] = value.trim();
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = supabaseUrl ? createClient(supabaseUrl, supabaseKey) : null;

console.log('🚀 Starting Sharthak Studio WhatsApp System...');

// 1. Start WhatsApp Server
const server = spawn('node', ['whatsapp-server.js'], { stdio: 'inherit' });

async function updateRemoteUrl(url) {
    if (!supabase) return;
    try {
        console.log('📡 Syncing URL with Supabase...');
        const { error } = await supabase
            .from('studio_config')
            .upsert({ id: 'whatsapp_url', value: url });

        if (error) {
            console.log('⚠️ Supabase Sync Error (Table might not exist yet):', error.message);
        } else {
            console.log('✅ Remote URL synced successfully!');
        }
    } catch (err) {
        console.error('❌ Sync Error:', err.message);
    }
}

function startTunnel() {
    console.log('🌉 Opening Global Tunnel...');
    const tunnel = spawn('npx', ['localtunnel', '--port', PORT.toString()]);

    tunnel.stdout.on('data', async (data) => {
        const output = data.toString();
        const urlMatch = output.match(/https?:\/\/[^\s]+/);

        if (urlMatch) {
            const newUrl = urlMatch[0];
            console.log(`✨ NEW GLOBAL URL: ${newUrl}`);

            // 1. Update .env.local
            let envContent = fs.readFileSync(ENV_PATH, 'utf8');
            if (envContent.includes('WHATSAPP_SERVER_URL=')) {
                envContent = envContent.replace(/WHATSAPP_SERVER_URL=.*/, `WHATSAPP_SERVER_URL=${newUrl}`);
            } else {
                envContent += `\nWHATSAPP_SERVER_URL=${newUrl}`;
            }
            fs.writeFileSync(ENV_PATH, envContent);
            console.log('✅ .env.local updated.');

            // 2. Update Supabase
            await updateRemoteUrl(newUrl);
        }
    });

    tunnel.on('close', (code) => {
        console.log('⚠️ Tunnel disconnected. Restarting in 5 seconds...');
        setTimeout(startTunnel, 5000);
    });
}

// 2. Start Tunnel
startTunnel();

// Keep process alive
process.on('SIGINT', () => {
    server.kill();
    process.exit();
});
