# 🚀 StellarAid Deployment Guide

Stellar Testnet'e deploy için adım adım rehber.

## Gereksinimler

### 1. Rust ve Stellar CLI Kurulumu

```bash
# Rust kurulumu
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env

# WASM target ekleme
rustup target add wasm32-unknown-unknown

# Stellar CLI kurulumu
cargo install --locked stellar-cli --features opt
```

### 2. Test Hesabı Oluşturma

```bash
# Yeni bir hesap oluştur
stellar keys generate deployer --network testnet

# Public key'i görüntüle
stellar keys address deployer

# Testnet'ten XLM al (Friendbot)
stellar keys fund deployer --network testnet
```

## Smart Contract Deployment

### 1. Kontratları Build Et

```bash
cd contracts

# Build scriptine izin ver
chmod +x build.sh

# Build
./build.sh
```

### 2. Kontratları Deploy Et

```bash
# Deploy scriptine izin ver
chmod +x deploy.sh

# Deploy
./deploy.sh
```

Bu script:
- Campaign kontratını deploy eder
- Contract ID'yi alır
- Frontend .env dosyasına kaydeder

### 3. Manual Deploy (opsiyonel)

```bash
cd contracts/campaign

# Build
cargo build --target wasm32-unknown-unknown --release

# Optimize (opsiyonel)
stellar contract optimize \
  --wasm target/wasm32-unknown-unknown/release/stellaraid_campaign.wasm

# Deploy
stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/stellaraid_campaign.wasm \
  --source deployer \
  --network testnet
```

### 4. Contract ID'yi Kaydet

Deploy sonrası aldığınız Contract ID'yi kaydedin:

```bash
# Frontend .env dosyasını güncelle
cd ../frontend
echo "VITE_CAMPAIGN_CONTRACT_ID=C..." > .env
```

## Frontend Deployment

### 1. Vercel'e Deploy

```bash
# Vercel CLI kur
npm i -g vercel

# Deploy
cd frontend
vercel

# Production deploy
vercel --prod
```

### 2. Netlify'a Deploy

```bash
# Build
npm run build

# Netlify'ye upload et veya GitHub bağlantısı kur
```

### 3. GitHub Pages'e Deploy

```bash
# package.json'a ekle
"homepage": "https://yourusername.github.io/stellaraid"

# Build ve deploy
npm run build
npx gh-pages -d dist
```

## Environment Variables

Production ortamında şunları ayarlayın:

```
VITE_STELLAR_NETWORK=testnet
VITE_STELLAR_RPC_URL=https://soroban-testnet.stellar.org
VITE_STELLAR_HORIZON_URL=https://horizon-testnet.stellar.org
VITE_CAMPAIGN_CONTRACT_ID=YOUR_CONTRACT_ID
```

## Test Etme

### 1. Local Test

```bash
cd frontend
npm run dev
# http://localhost:5173 adresine gidin
```

### 2. Contract Test

```bash
cd contracts/campaign
cargo test
```

### 3. Integration Test

1. Wallet'ı bağlayın (Passkey ile)
2. Test kampanyası oluşturun
3. Bağış yapın
4. Milestone'ları test edin

## Troubleshooting

### Contract Deploy Hatası

```bash
# RPC bağlantısını kontrol et
stellar network ls

# Account bakiyesini kontrol et
stellar keys fund deployer --network testnet
```

### Frontend Build Hatası

```bash
# Dependencies'i temizle ve yeniden yükle
rm -rf node_modules package-lock.json
npm install
```

### Passkey Çalışmıyor

- HTTPS gereklidir (localhost hariç)
- Modern browser kullanın (Chrome, Edge, Safari)
- WebAuthn desteğini kontrol edin

## Hackathon Submission

### Gerekli Adımlar

1. ✅ GitHub repo oluştur
2. ✅ README.md dosyası hazırla (İngilizce)
3. ✅ Contract'ları testnet'e deploy et
4. ✅ Frontend'i deploy et
5. ✅ Demo video hazırla (opsiyonel ama önerilen)
6. ✅ GitHub repo linkini submit et

### README Checklist

- [ ] Proje açıklaması
- [ ] Kurulum talimatları
- [ ] Kullanım örnekleri
- [ ] Contract adresleri
- [ ] Tech stack
- [ ] Screenshots
- [ ] Demo linki

## Useful Commands

```bash
# Contract bilgilerini görüntüle
stellar contract inspect --id CONTRACT_ID --network testnet

# Account bakiyesi
stellar account balance deployer --network testnet

# Transaction geçmişi
stellar tx list --account ACCOUNT_ID --network testnet

# RPC status
curl https://soroban-testnet.stellar.org/health
```

## Next Steps

1. Contract'ları geliştir (Donation, Governance, NFT)
2. Passkey entegrasyonunu tamamla
3. Real-time blockchain veri entegrasyonu
4. NFT minting ekle
5. Test ve bug fixing
6. Production'a geç

---

**Not**: Bu proje Stellar Testnet için hazırlanmıştır. Mainnet'e geçmeden önce kapsamlı testler yapın.
