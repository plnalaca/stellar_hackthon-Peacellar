# Peacellar - Transparent Blockchain Donation Platform

![Peacellar Logo](https://img.shields.io/badge/Peacellar-Transparent%20Donations-purple?style=for-the-badge&logo=stellar)

## 🌟 Project Overview

Peacellar is a revolutionary blockchain-powered donation platform built on Stellar Network that brings complete transparency, accountability, and trust to charitable giving. By leveraging blockchain technology, smart contracts, and real-time tracking, we eliminate the opacity that plagues traditional donation systems. Every donation is recorded on-chain, every milestone is verified, and every impact is measurable. Peacellar transforms charitable giving from a leap of faith into a transparent, verifiable process where donors can see exactly how their contributions create real-world change.

## 💡 Vision Statement

Peacellar envisions a world where charitable giving is completely transparent and trustworthy. By harnessing Stellar blockchain technology, we aim to eliminate donation fraud, increase donor confidence, and maximize the impact of every contribution. Our platform empowers individuals to make informed giving decisions, holds organizations accountable for fund usage, and creates a global community of transparent philanthropy. We believe blockchain technology can revolutionize charitable giving by making it accessible, transparent, and verifiable for everyone - from small individual donors to large organizations. Through Peacellar, we're building the future of trust-based charitable giving.

## ✨ Key Features

### 🔗 Blockchain-Powered Transparency
- **On-Chain Donations**: Every donation recorded permanently on Stellar blockchain
- **Real-Time Tracking**: Monitor donation flow and campaign progress live
- **Claimable Balances**: Secure XLM transfers using Stellar's claimable balance mechanism
- **Transaction Verification**: All transactions visible on Stellar Horizon API

### 💼 Campaign Management
- **Create Campaigns**: Launch donation campaigns with goals and milestones
- **Milestone Tracking**: Set and track project milestones with percentage targets
- **Campaign Dashboard**: Comprehensive analytics and statistics for campaign creators
- **CRUD Operations**: Full create, read, update, delete functionality for campaigns

### 👛 Wallet Integration
- **Freighter Wallet**: Seamless integration with Freighter browser extension
- **Persistent Connection**: Auto-reconnect wallet on page refresh
- **Secure Transactions**: Sign transactions directly from your wallet
- **Multi-Wallet Support**: Ready for additional wallet integrations

### 📊 Analytics & Insights
- **User Dashboard**: Track your donations, campaigns, and impact score
- **Campaign Statistics**: Detailed stats modal for each campaign
- **Donation History**: Complete history of all your contributions
- **Impact Metrics**: Visualize your charitable impact with charts

### 🎨 User Experience
- **Interactive Tutorial**: Step-by-step onboarding for first-time users
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Modern UI**: Clean, intuitive interface with dark theme
- **Real-Time Updates**: No page reloads needed for transaction updates

## 🏗️ Technology Stack

### Frontend
- **React 18**: Modern UI library with hooks
- **Vite 5.4**: Lightning-fast build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework
- **React Router**: Client-side routing
- **Lucide React**: Beautiful icon library

### Blockchain Integration
- **Stellar Testnet**: Blockchain network for transactions
- **@stellar/stellar-sdk**: Official Stellar JavaScript SDK
- **@stellar/freighter-api**: Freighter wallet integration
- **Horizon Server**: Stellar blockchain API

### Smart Contracts (Soroban)
- **Campaign Contract**: Manages campaign lifecycle and milestones
- **Donation Contract**: Handles XLM transfers and tracking
- **Deployed Contract**: `CCZQ3R7BWR2OWX5UNHBSB4JI5PIZ4Y2W4NPVCBQPGERIBZE37GQQ6JND`

### Data Management
- **localStorage**: Client-side campaign data persistence
- **Context API**: Global state management for wallet
- **Horizon API**: Real-time blockchain data fetching

## 🚀 Development Roadmap

### Phase 1: Foundation (✅ Completed)
1. **Blockchain Integration**
   - Connect to Stellar Testnet
   - Implement Freighter wallet integration
   - Set up Horizon API for transaction tracking
   - Deploy Soroban smart contracts

2. **Core Functionality**
   - Campaign creation with milestones
   - Real XLM donation system using claimable balances
   - Transaction signing and verification
   - Campaign listing and detail pages

3. **User Interface**
   - Responsive design with Tailwind CSS
   - Modern dark theme
   - Navigation and routing
   - Campaign cards and layouts

### Phase 2: Enhancement (✅ Completed)
4. **Dashboard & Analytics**
   - User donation history
   - Campaign management (CRUD)
   - Campaign-specific statistics modal
   - Interactive charts and graphs
   - Impact scoring system

5. **User Experience**
   - Interactive onboarding tutorial (4 steps)
   - Persistent wallet connection
   - Loading states and error handling
   - Real-time UI updates without page reloads

### Phase 3: Future Features (🔄 Planned)
6. **Advanced Features**
   - **NFT Certificate Minting**: Unique NFT certificates for each donation as proof of contribution
   - **AI-Powered Campaign Verification**: Automated system to verify campaign authenticity and legitimacy
   - **KYC/Verification System**: Identity verification for campaign creators to prevent fraud
   - **Partner Program**: Partnership system with verified NGOs and charitable organizations
   - **Recurring Donations**: Set up automatic periodic donations with smart contracts
   - **Social Proof**: Special shareable links for donors to showcase their contributions on social media
   - **Multi-language Support**: Turkish and English language options
   - **Search & Filter**: Advanced campaign discovery with filters and search
   - **Email Notifications**: Real-time notifications for donations and milestone updates
   - **Mobile App**: React Native mobile application for iOS and Android

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ installed
- Freighter Wallet browser extension
- Git

### Quick Start

1. **Clone the repository**
```bash
git clone https://github.com/plnalaca/stellar_hackthon-Peacellar.git
cd stellar_hackthon-Peacellar/frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

4. **Open in browser**
Navigate to `http://localhost:5173`

### Required Dependencies
```json
{
  "@stellar/stellar-sdk": "^12.3.0",
  "@stellar/freighter-api": "^6.0.0",
  "react": "^18.3.1",
  "react-router-dom": "^6.28.0",
  "lucide-react": "^0.468.0",
  "tailwindcss": "^3.4.17"
}
```

### Freighter Wallet Setup
1. Install [Freighter Wallet](https://www.freighter.app/) extension
2. Create or import a wallet
3. Switch to Testnet network
4. Get test XLM from [Stellar Laboratory](https://laboratory.stellar.org/#account-creator?network=test)
5. Connect wallet on Peacellar platform

## 📖 How to Use Peacellar

### For Donors 💝

1. **Install Freighter Wallet**
   - Download from [freighter.app](https://www.freighter.app/)
   - Create new wallet or import existing
   - Switch to Testnet network
   - Fund with test XLM

2. **Connect Your Wallet**
   - Click "Connect Wallet" button
   - Approve connection in Freighter popup
   - Your address will be displayed in header

3. **Browse Campaigns**
   - Explore active campaigns on Campaigns page
   - View campaign details, goals, and milestones
   - Check organization information

4. **Make a Donation**
   - Click on campaign to view details
   - Enter donation amount in XLM
   - Sign transaction in Freighter
   - Track your donation on blockchain

5. **Track Your Impact**
   - Visit Dashboard to see donation history
   - View impact score and statistics
   - Monitor campaigns you've supported

### For Campaign Creators 🎯

1. **Connect Wallet**
   - Install and connect Freighter wallet
   - Ensure you have test XLM for transactions

2. **Create Campaign**
   - Navigate to "Create Campaign" page
   - Fill in campaign details:
     - Title and description
     - Organization name
     - Funding goal (in XLM)
     - Add milestones with percentages
   - Submit to blockchain

3. **Manage Campaigns**
   - Access Dashboard to view your campaigns
   - View campaign statistics (click 📊 Stats)
   - Edit campaign details (click ✏️ Edit)
   - Delete campaigns (click 🗑️ Delete)
   - Track donations received in real-time

4. **Monitor Progress**
   - View detailed analytics for each campaign
   - See donation history and donor count
   - Track milestone completion
   - Monitor days active and remaining funds

## 🎓 Interactive Tutorial

First-time users will see a 4-step interactive tutorial explaining:
1. Welcome to Peacellar and platform overview
2. How to install and connect Freighter wallet
3. How to explore and evaluate campaigns
4. How to donate and track your impact

**To replay tutorial:**
- Click "📚 How to Use" button in footer
- Or click "📚 How to Use" on homepage
- Or run in browser console: `localStorage.removeItem('peacellar_tutorial_completed'); location.reload()`
## 🔧 Smart Contract Details

### Campaign Contract ✅ DEPLOYED
- **Contract ID**: `CCZQ3R7BWR2OWX5UNHBSB4JI5PIZ4Y2W4NPVCBQPGERIBZE37GQQ6JND`
- **Network**: Stellar Testnet
- **Explorer**: [View on Stellar Expert](https://stellar.expert/explorer/testnet/contract/CCZQ3R7BWR2OWX5UNHBSB4JI5PIZ4Y2W4NPVCBQPGERIBZE37GQQ6JND)

### Key Functions Implemented
- Campaign creation with milestones
- Donation tracking via claimable balances
- Real-time transaction verification
- Campaign CRUD operations

### Transaction Flow
1. **Donation Transaction**:
   ```
   Operation: createClaimableBalance
   Asset: XLM (native)
   Memo: "Donate:{campaign_id}"
   Network: Testnet
   ```

2. **Campaign Storage**:
   - Currently using localStorage for MVP
   - Ready for full Soroban contract integration
   - Campaign data structure includes: id, creator, title, organization, description, goal, milestones, createdAt

## 🧪 Testing

### Manual Testing
1. Get test XLM from [Stellar Laboratory](https://laboratory.stellar.org/#account-creator?network=test)
2. Connect Freighter wallet on testnet
3. Create a test campaign
4. Make test donations
5. View transactions on [Stellar Expert](https://stellar.expert/explorer/testnet)

### Verified Transactions
- ✅ 5 successful donations recorded on testnet
- ✅ Total donated: 5 XLM
- ✅ All transactions viewable on Horizon API
- ✅ Campaign creation and management working

## 📊 Project Statistics

- **Total Campaigns Created**: 2+
- **Total Donations**: 5
- **Total XLM Donated**: 5 XLM
- **Unique Features**: 15+
- **Development Time**: 3 weeks
- **Lines of Code**: 2000+

## 🔗 Important Links

- **Live Demo**: `http://localhost:5173` (Development)
- **GitHub**: [github.com/plnalaca/stellar_hackthon-Peacellar](https://github.com/plnalaca/stellar_hackthon-Peacellar)
- **Stellar Expert**: [Contract on Testnet](https://stellar.expert/explorer/testnet)
- **Freighter Wallet**: [freighter.app](https://www.freighter.app/)
- **Stellar Network**: [stellar.org](https://stellar.org)

## 🧪 Development Notes

### Current Status
```
✅ Blockchain integration complete
✅ Wallet connection working
✅ Donations functional
✅ Campaign management ready
✅ Dashboard analytics implemented
✅ Interactive tutorial added
✅ Responsive design complete
🔄 NFT certificates (planned)
🔄 Multi-language support (planned)
```
cargo test
```

Run frontend tests:
```bash
npm test
```

## 📸 Screenshots

### Homepage
![Peacellar Homepage](docs/screenshots/homepage.png)
*Clean, modern landing page with call-to-action*
<img width="1700" height="1061" alt="Ekran Resmi 2025-11-23 16 32 29" src="https://github.com/user-attachments/assets/5050907a-a5d3-4f0b-b086-cdc2de10604a" />

### Campaign Browser
![Campaign Browser](docs/screenshots/campaigns.png)
*Browse and filter active campaigns*
<img width="1705" height="1069" alt="Ekran Resmi 2025-11-23 16 32 42" src="https://github.com/user-attachments/assets/7f4c4255-602a-4208-8e71-fed9c66b4582" />

### Dashboard
![User Dashboard](docs/screenshots/dashboard.png)
*Track donations, manage campaigns, view analytics*
<img width="1705" height="1066" alt="Ekran Resmi 2025-11-23 16 33 06" src="https://github.com/user-attachments/assets/9ca9675d-add0-4acb-8461-89d827afbbd9" />

### Interactive Tutorial
![Onboarding Tutorial](docs/screenshots/tutorial.png)
*4-step interactive guide for new users*
![Uploading Ekran Resmi 2025-11-23 16.39.16.png…]()


## 👤 Hakkımda (About Me)

**Name**: Pelin Alaca  
**GitHub**: [@plnalaca](https://github.com/plnalaca)  
**Role**: Solo Developer  
**Competition**: Stellar Blockchain Hackathon 2025

### My Story

As a blockchain enthusiast and developer, I've always been passionate about using technology to create positive social impact. I created Peacellar after witnessing the lack of transparency in traditional charitable organizations, where donors often have no idea how their contributions are actually used.

My vision with Peacellar is to revolutionize charitable giving by leveraging Stellar blockchain's speed, low costs, and transparency. I believe that when donors can see exactly where their money goes and track the impact in real-time, they'll be more motivated to give and organizations will be held accountable.

This project represents weeks of learning Stellar development, implementing Soroban smart contracts, and crafting a user experience that makes blockchain technology accessible to everyone - from tech-savvy developers to everyday donors who just want to help.

Through Peacellar, I hope to demonstrate that blockchain isn't just about cryptocurrency trading - it's a powerful tool for social good that can bring transparency, trust, and accountability to systems that desperately need it.

### Technical Journey

- 🎓 Completed Stellar development course
- 💻 First major blockchain project
- 🚀 Deployed smart contracts to testnet
- 🎨 Built complete full-stack application
- 📊 Implemented real-time blockchain data integration
- 🎯 Created interactive user onboarding

### What I Learned

- Stellar blockchain architecture and Soroban smart contracts
- Wallet integration with Freighter API
- Transaction signing and verification
- Claimable balance operations
- Real-time blockchain data fetching with Horizon API
- Building trust-minimized applications
- Creating intuitive blockchain UX

## 🤝 Contributing

While this is currently a solo hackathon project, contributions and feedback are welcome! 

### How to Contribute
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Areas for Contribution
- NFT certificate implementation
- Multi-language support
- Advanced search/filter features
- Mobile app development
- Documentation improvements
- Bug fixes and optimizations

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Stellar Development Foundation** for the amazing blockchain platform
- **Rise In** for the comprehensive Stellar development course
- **Freighter Team** for the excellent wallet integration
- **Stellar Community** for support and resources

## 🔗 Useful Links

- [Stellar Documentation](https://developers.stellar.org/)
- [Soroban Documentation](https://soroban.stellar.org/)
- [Freighter Wallet](https://www.freighter.app/)
- [Stellar Laboratory](https://laboratory.stellar.org/)
- [Stellar Expert Explorer](https://stellar.expert/)
- [Rise In Course](https://www.risein.com/courses/build-on-stellar)

## 📞 Contact

**Developer**: Pelin Alaca  
**GitHub**: [@plnalaca](https://github.com/plnalaca)  
**Project**: Peacellar - Transparent Blockchain Donations  
**Competition**: Stellar Hackathon 2025

For questions, feedback, or collaboration opportunities, please open an issue or reach out via GitHub.

---

**Note**: This project is deployed on Stellar Testnet for demonstration purposes.
