const https = require('https');
const { JSDOM } = require('jsdom');

const url = 'https://www.natuurbrandrisico.nl/nojavascript.html';

getRiskData = (callback) => {
    https.get(url, (res) => {
        let data = {};
        let html = '';
        res.on('data', (chunk) => {
            html += chunk;
        });

        res.on('end', () => {
            const dom = new JSDOM(html);
            const rows = Array.from(dom.window.document.querySelectorAll('tr'));
            rows.forEach(row => {
                const text = Array.from(row.querySelectorAll('td')).map(cell => cell.textContent.trim())
                data[String(text[0])] = text[1];
            });
            callback(data);
        });

    }).on('error', (error) => {
        console.error(error);
    });
}

const express = require('express');
const app = express();

app.get('/', (req, res) => {
    console.log(req.ip);
    getRiskData((data) => {
        res.send(data);
    });
});

app.listen(3000, () => {
    console.log('Server listening on port 3000');
});
