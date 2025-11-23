# 🚀 Quick Start Guide

StellarAid projesini hızlıca çalıştırmak için adım adım rehber.

## 🎯 1. Projeyi Çalıştır (5 dakika)

### Frontend'i Başlat

```bash
# Proje dizinine git
cd stellaraid/frontend

# Bağımlılıkları yükle (ilk seferinde)
npm install

# Development server'ı başlat
npm run dev
```

✅ Tarayıcınızda açın: http://localhost:5173

## 📝 2. Şu Anda Neler Çalışıyor?

✅ **Ana Sayfa**: Modern, responsive tasarım  
✅ **Kampanya Listesi**: Mock verilerle çalışan kampanyalar  
✅ **Kampanya Detayı**: Milestone takibi, bağış formu  
✅ **Kampanya Oluşturma**: Multi-step form  
✅ **Dashboard**: Kullanıcı istatistikleri  
✅ **Wallet Bağlantısı**: Passkey UI hazır

## 🔄 3. Sonraki Adımlar

### A. Smart Contract'ları Deploy Et

```bash
# Rust kurulumu (henüz yoksa)
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Stellar CLI kurulumu
cargo install --locked stellar-cli --features opt

# Test hesabı oluştur
stellar keys generate deployer --network testnet
stellar keys fund deployer --network testnet

# Contract'ları build et
cd contracts
chmod +x build.sh
./build.sh

# Deploy et
chmod +x deploy.sh
./deploy.sh
```

### B. Passkey Entegrasyonunu Tamamla

Şu anda UI hazır, ancak gerçek Passkey entegrasyonu için:

1. `stellar-wallets-kit` paketini kur:
```bash
npm install stellar-wallets-kit
```

2. `WalletContext.jsx` dosyasını güncelle
3. Stellar testnet ile bağlantıyı test et

### C. Backend Bağlantısını Ekle

`src/services/campaign.js` ve `stellar.js` dosyalarındaki TODO'ları tamamla:

- Contract çağrılarını implement et
- Transaction signing ekle
- Real-time veri çekme

## 🎨 4. UI'ı Özelleştir

### Renkler
`tailwind.config.js` dosyasında:
```javascript
colors: {
  stellar: {
    purple: '#7B61FF',  // Ana renk
    blue: '#00C9FF',    // Vurgu rengi
  }
}
```

### Görsel Ekle
`frontend/public/` klasörüne logonuzu ekleyin.

## 📊 5. Test Senaryoları

### Senaryo 1: Kampanya Görüntüleme
1. http://localhost:5173/campaigns adresine git
2. Mock kampanyaları gör
3. Bir kampanyaya tıkla
4. Detayları incele

### Senaryo 2: Kampanya Oluşturma
1. "Create Campaign" butonuna tıkla
2. Form'u doldur
3. Milestone'ları ekle (toplam %100 olmalı)
4. Submit et (şu anda mock)

### Senaryo 3: Bağış Yapma
1. Bir kampanya detayına git
2. "Donate Now" butonuna tıkla
3. Miktar gir
4. Wallet bağlantısını test et

## 🐛 6. Yaygın Sorunlar

### Port zaten kullanımda
```bash
# Farklı port kullan
npm run dev -- --port 3000
```

### Module bulunamıyor
```bash
# node_modules'i temizle
rm -rf node_modules package-lock.json
npm install
```

### Tailwind çalışmıyor
```bash
# Dev server'ı yeniden başlat
# Ctrl+C ile durdur, tekrar npm run dev
```

## 📚 7. Proje Yapısı

```
stellaraid/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # UI bileşenleri
│   │   ├── contexts/        # React contexts (Wallet)
│   │   ├── pages/           # Sayfalar
│   │   ├── services/        # Blockchain servisleri
│   │   └── utils/           # Yardımcı fonksiyonlar
│   ├── package.json
│   └── vite.config.js
│
├── contracts/               # Soroban smart contracts
│   ├── campaign/           # Campaign kontratı
│   ├── build.sh            # Build script
│   └── deploy.sh           # Deploy script
│
├── README.md               # Ana dokümantasyon
├── DEPLOYMENT.md           # Deploy rehberi
└── QUICKSTART.md           # Bu dosya
```

## 🎯 8. Hackathon İçin Öncelikler

### Öncelik 1: Contract Deploy (Bugün)
- [ ] Stellar CLI kur
- [ ] Campaign kontratını deploy et
- [ ] Contract ID'yi kaydet

### Öncelik 2: Frontend-Contract Bağlantısı (Yarın)
- [ ] Contract çağrılarını implement et
- [ ] Transaction signing ekle
- [ ] Test et

### Öncelik 3: Passkey (2. gün)
- [ ] Wallet kit entegrasyonu
- [ ] Test hesabı ile dene

### Öncelik 4: Polish & Demo (Son günler)
- [ ] UI/UX iyileştirmeleri
- [ ] Screenshots ekle
- [ ] Demo video hazırla
- [ ] README'yi güncelle

## 💡 9. Faydalı Linkler

- [Stellar Docs](https://developers.stellar.org/)
- [Soroban Examples](https://developers.stellar.org/docs/build/smart-contracts/example-contracts)
- [Passkey Kit](https://github.com/kalepail/passkey-kit)
- [Rise In Course](https://www.risein.com/courses/build-on-stellar)

## 🤝 10. Yardım Gerekirse

- Discord: Stellar Developer Discord
- Telegram: Rise In Telegram grubu
- GitHub Issues: Sorularınız için issue açın

---

**İyi şanslar! 🌟**

Frontend çalışıyor ve temel yapı hazır. Şimdi contract deployment ve entegrasyon aşamasına geçebilirsiniz!
