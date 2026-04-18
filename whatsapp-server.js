const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcodeTerminal = require('qrcode-terminal');
const QRCode = require('qrcode');
const express = require('express');
const cors = require('cors');
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Request Logging
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

let lastQR = "";
let isReady = false;

const client = new Client({
    authStrategy: new LocalAuth({
        dataPath: './.wwebjs_auth'
    }),
    puppeteer: {
        headless: true,
        executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

client.on('qr', async (qr) => {
    console.log('--- NEW QR CODE GENERATED ---');
    lastQR = await QRCode.toDataURL(qr); // Save as base64 image
    qrcodeTerminal.generate(qr, { small: true }); // Still print in terminal just in case
});

client.on('ready', () => {
    console.log('✨ WhatsApp Client is READY!');
    isReady = true;
    lastQR = ""; // Clear QR once connected
});

client.on('authenticated', () => {
    console.log('✅ Authenticated successfully');
});

// API Endpoints
app.get('/qr', (req, res) => {
    if (isReady) return res.send({ status: 'ready' });
    if (lastQR) return res.send({ status: 'qr', qr: lastQR });
    res.send({ status: 'loading' });
});

app.post('/send', async (req, res) => {
    const { number, message, pdfBase64, filename } = req.body;
    if (!isReady) return res.status(503).send({ error: 'WhatsApp not ready' });

    try {
        let formattedNumber = number.replace(/\D/g, '');
        if (!formattedNumber.endsWith('@c.us')) {
            formattedNumber += '@c.us';
        }

        // Send Text Message first
        await client.sendMessage(formattedNumber, message);

        // If PDF is provided, send it as media
        if (pdfBase64) {
            const media = new MessageMedia('application/pdf', pdfBase64, filename || 'Quote.pdf');
            await client.sendMessage(formattedNumber, media);
            console.log(`✅ PDF sent to ${formattedNumber}`);
        }

        res.send({ success: true });
    } catch (err) {
        console.error('❌ Send error:', err);
        res.status(500).send({ error: err.message });
    }
});

client.initialize();

app.listen(port, '0.0.0.0', () => {
    console.log(`🚀 WhatsApp API Gateway running at http://0.0.0.0:${port}`);
});
