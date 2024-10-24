const http = require("http"); // membuat http server
let absensi = [];
let absensiId = 1;

// membuat server
const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`); // Log method dan URL

  if (req.method === "POST" && req.url === "/api/absensi") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      console.log("Received body:", body); // Log body yang diterima
      try {
        const kehadiran = JSON.parse(body);
        kehadiran.absensi_id = absensiId++;
        absensi.push(kehadiran);
        res.writeHead(201, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            message: "Absensi berhasil ditambahkan",
            absensi_id: kehadiran.absensi_id,
          })
        );
      } catch (error) {
        console.error("Error parsing JSON:", error); // Log error jika ada masalah dengan JSON
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Invalid JSON" }));
      }
    });
  } else if (req.method === "GET" && req.url === "/api/absensi") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(absensi));
  } else if (req.method === "GET" && req.url.match(/\/api\/absensi\/\d+/)) {
    const id = parseInt(req.url.split("/")[3]);
    const kehadiran = absensi.find((a) => a.absensi_id === id);
    if (kehadiran) {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(kehadiran));
    } else {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Absensi tidak ditemukan" }));
    }
  } else if (req.method === "PUT" && req.url.match(/\/api\/absensi\/\d+/)) {
    const id = parseInt(req.url.split("/")[3]);
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      try {
        const update = JSON.parse(body);
        const absensiIndex = absensi.findIndex((a) => a.absensi_id === id);
        if (absensiIndex !== -1) {
          absensi[absensiIndex] = { ...absensi[absensiIndex], ...update };
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "Absensi berhasil diperbarui" }));
        } else {
          res.writeHead(404, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "Absensi tidak ditemukan" }));
        }
      } catch (error) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Invalid JSON" }));
      }
    });
  } else if (req.method === "DELETE" && req.url.match(/\/api\/absensi\/\d+/)) {
    const id = parseInt(req.url.split("/")[3]);
    const absensiIndex = absensi.findIndex((a) => a.absensi_id === id);
    if (absensiIndex !== -1) {
      absensi.splice(absensiIndex, 1);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Absensi berhasil dihapus" }));
    } else {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Absensi tidak ditemukan" }));
    }
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Endpoint tidak ditemukan" }));
  }
});

server.listen(3000, () => {
  console.log("Server running on port 3000");
});
