const express = require("express");
const mysql = require("mysql");

const app = express();
const port = 5011;

// Koneksi ke database MySQL
var mydb = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "db_bookstore",
});
mydb.connect();

// Middleware yang digunakan untuk parse data dalam request body (format JSON)
app.use(express.json());
app.get("/", (req, res) => {
  console.log("Akses : /");
  res.send("Homepage Backend Toko Buku");
});

// Memasukkan data buku
app.post("/insert_data_buku", (req, res) => {
  console.log("Akses : /insert_data_buku");
  // Menerima data dari request body
  var kode_buku = req.body.kode_buku;
  var judul = req.body.judul;
  var penulis = req.body.penulis;
  var harga = req.body.harga;
  // Memasukkan data kedalam database
  // Membuat Query dan Values yang akan dieksekusi
  var query_create =
    "INSERT INTO buku (kode_buku, judul, penulis, harga) VALUES (?, ?, ?, ?)";
  var values_create = [kode_buku, judul, penulis, harga];
  // Eksekusi Query
  mydb.query(query_create, values_create, function (err, result, fields) {
    if (err) throw err;
    console.log(result);
    // Membuat respon untuk dikembalikan dalam format JSON
    var response_payload = {
      description: "Berhasil memasukkan data buku",
      mysql_response: result,
    };
    // Mengembalikan respon
    res.json(response_payload);
  });
});

// Melihat data buku
app.get("/get_data_buku", (req, res) => {
  console.log("Akses : /get_data_buku");
  var query_read = "SELECT * FROM buku WHERE 1 = 1 ";
  // Jika terdapat parameter yang digunakan, tambahkan ke query
  if (req.query.kode_buku) {
    query_read += "AND kode_buku = " + mysql.escape(req.query.kode_buku);
  }
  // Eksekusi query
  mydb.query(query_read, function (err, result, fields) {
    if (err) throw err;
    // Membuat respon untuk dikembalikan dalam format JSON
    var response_payload = {
      description: "Berhasil mendapatkan data buku",
      data: result,
    };
    // Mengembalikan respon
    res.json(response_payload);
  });
});

// Mengubah data buku
app.put("/update_data_buku/(:kode_buku)", (req, res) => {
  console.log("Akses : /update_data_buku");
  // Menerima data dari request params dan body
  var kode_buku_awal = req.params.kode_buku;
  var kode_buku_ubah = req.body.kode_buku_ubah;
  var judul = req.body.judul;
  var penulis = req.body.penulis;
  var harga = req.body.harga;
  // Membuat Values yang akan dieksekusi
  var values = `kode_buku = ${mysql.escape(kode_buku_awal)}`;
  if (kode_buku_ubah) {
    values += `, kode_buku = ${mysql.escape(kode_buku_ubah)}`;
  }
  if (judul) {
    values += `, judul = ${mysql.escape(judul)}`;
  }
  if (penulis) {
    values += `, penulis = ${mysql.escape(penulis)}`;
  }
  if (harga) {
    values += `, harga = ${mysql.escape(harga)}`;
  }
  // Membuat Query yang akan dieksekusi
  var query_update = `UPDATE buku SET ${values} WHERE kode_buku = ${mysql.escape(
    kode_buku_awal
  )}`;
  // Eksekusi Query
  mydb.query(query_update, function (err, result, fields) {
    if (err) throw err;
    console.log(result);
    // Membuat respon untuk dikembalikan dalam format JSON
    var response_payload = {
      description: "Berhasil mengubah data buku",
      mysql_response: result,
    };
    // Mengembalikan respon
    res.json(response_payload);
  });
});

// Menghapus data buku
app.delete("/delete_data_buku/(:kode_buku)", (req, res) => {
  console.log("Akses : /delete_data_buku");
  // Menerima data dari request params
  var kode_buku = req.params.kode_buku;
  // Membuat Query yang akan dieksekusi
  var query_delete = `DELETE FROM buku WHERE kode_buku = ${mysql.escape(
    kode_buku
  )}`;
  // Eksekusi Query
  mydb.query(query_delete, function (err, result, fields) {
    if (err) throw err;
    console.log(result);
    // Membuat respon untuk dikembalikan dalam format JSON
    var response_payload = {
      description: "Berhasil menghapus data buku",
      mysql_response: result,
    };
    // Mengembalikan respon
    res.json(response_payload);
  });
});

// Menjalankan server
app.listen(port, () => {
  console.log("Server berjalan pada URL : http://localhost:" + port);
});
