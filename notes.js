const http = require('http');
const url = require('url');

// Array untuk menyimpan catatan
let notes = [];
let noteId = 1;

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    const method = req.method.toUpperCase();

    // CREATE (POST): /api/notes
    if (method === 'POST' && path === '/api/notes') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                const note = JSON.parse(body);
                note.note_id = noteId++;
                note.created_at = new Date().toISOString();
                note.updated_at = note.created_at;
                notes.push(note);

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    message: "Catatan berhasil ditambahkan",
                    note_id: note.note_id
                }));
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Bad Request: Invalid JSON' }));
            }
        });

    // READ (GET): /api/notes
    } else if (method === 'GET' && path === '/api/notes') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(notes));

    // READ by ID (GET): /api/notes/{note_id}
    } else if (method === 'GET' && path.startsWith('/api/notes/')) {
        const id = parseInt(path.split('/')[3]);
        const note = notes.find(n => n.note_id === id);

        if (note) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(note));
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Catatan tidak ditemukan' }));
        }

    // UPDATE (PUT): /api/notes/{note_id}
    } else if (method === 'PUT' && path.startsWith('/api/notes/')) {
        const id = parseInt(path.split('/')[3]);
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                const updatedNote = JSON.parse(body);
                const index = notes.findIndex(n => n.note_id === id);

                if (index !== -1) {
                    notes[index] = { 
                        ...notes[index], 
                        ...updatedNote, 
                        updated_at: new Date().toISOString()
                    };
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Catatan berhasil diperbarui' }));
                } else {
                    res.writeHead(404, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Catatan tidak ditemukan' }));
                }
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Bad Request: Invalid JSON' }));
            }
        });

    // DELETE (DELETE): /api/notes/{note_id}
    } else if (method === 'DELETE' && path.startsWith('/api/notes/')) {
        const id = parseInt(path.split('/')[3]);
        const index = notes.findIndex(n => n.note_id === id);

        if (index !== -1) {
            notes.splice(index, 1);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Catatan berhasil dihapus' }));
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Catatan tidak ditemukan' }));
        }

    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Path tidak ditemukan' }));
    }
});

server.listen(3000, () => {
    console.log('Server running on port 3000');
});
