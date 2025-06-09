// index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Validasi URI
const mongoURI = process.env.MONGODB_URI;
if (!mongoURI) {
  console.error('Error: MONGODB_URI tidak ditemukan di file .env!');
  process.exit(1);
}

// Koneksi ke MongoDB
mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => {
    console.error('MongoDB Error:', err);
    console.error('Mongo URI:', mongoURI);
  });

// SCHEMA DAN MODEL

const orderSchema = new mongoose.Schema({
  name: String,
  phone: String,
  address: String,
  items: [
    {
      name: String,
      qty: Number,
      price: Number
    }
  ],
  quantity: Number,
  notes: String,
  total: Number,
  isCompleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  image: String,
  description: String,
  createdAt: { type: Date, default: Date.now }
});

const Product = mongoose.model('Product', productSchema);

// ROUTES

// --- ORDER ENDPOINTS ---

// Buat Pesanan Baru
app.post('/order', async (req, res) => {
  try {
    const { name, phone, address, items, quantity, notes, total } = req.body;
    const newOrder = new Order({ name, phone, address, items, quantity, notes, total });
    await newOrder.save();
    res.status(201).json({ message: 'Pesanan berhasil disimpan.' });
  } catch (err) {
    res.status(500).json({ error: 'Terjadi kesalahan saat menyimpan pesanan.' });
  }
});

// Ambil Semua Pesanan
app.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Gagal mengambil data pesanan.' });
  }
});

// Tandai Pesanan Selesai / Belum
app.patch('/order/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Pesanan tidak ditemukan.' });

    order.isCompleted = !order.isCompleted;
    await order.save();

    res.json({ message: 'Status pesanan diperbarui.', status: order.isCompleted });
  } catch (err) {
    res.status(500).json({ error: 'Gagal memperbarui status pesanan.' });
  }
});

// --- PRODUCT ENDPOINTS ---

// Ambil Semua Produk
app.get('/products', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Gagal mengambil produk.' });
  }
});

// Tambah Produk
app.post('/product', async (req, res) => {
  try {
    const { name, price, image, description } = req.body;
    const product = new Product({ name, price, image, description });
    await product.save();
    res.status(201).json({ message: 'Produk berhasil ditambahkan.' });
  } catch (err) {
    res.status(500).json({ error: 'Gagal menambahkan produk.' });
  }
});

// Update Produk
app.patch('/product/:id', async (req, res) => {
  try {
    const { name, price, image, description } = req.body;
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { name, price, image, description },
      { new: true }
    );
    res.json({ message: 'Produk diperbarui.', product });
  } catch (err) {
    res.status(500).json({ error: 'Gagal memperbarui produk.' });
  }
});

// Hapus Produk
app.delete('/product/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Produk berhasil dihapus.' });
  } catch (err) {
    res.status(500).json({ error: 'Gagal menghapus produk.' });
  }
});

// JALANKAN SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server berjalan di port ${PORT}`));