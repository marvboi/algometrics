# 🚀 AlgoMetrics - Algorand Analytics Command Center

A comprehensive real-time analytics dashboard for the Algorand blockchain ecosystem, built for the Algorand Bolt Hackathon.

![AlgoMetrics Dashboard](https://img.shields.io/badge/Status-Live-brightgreen) ![React](https://img.shields.io/badge/React-18.x-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue) ![Vite](https://img.shields.io/badge/Vite-5.x-purple)

## ✨ Features

### 🎯 Core Analytics
- **Real-time Network Monitoring** - Live Algorand network status and metrics
- **Whale Tracker** - Monitor large ALGO holders and their activities
- **Transaction Feed** - Real-time transaction monitoring with advanced filtering
- **Network Charts** - Visual representation of network performance and trends

### 📊 Advanced Analytics
- **DeFi Analytics** - Comprehensive DeFi protocol analysis
- **NFT Analytics** - NFT market trends and collection insights  
- **Bridge Monitor** - Cross-chain bridge activity tracking
- **Ecosystem Map** - Visual representation of the Algorand ecosystem

### 🔔 Smart Alerts System
- **Whale Movement Alerts** - $1M+ transaction notifications
- **Email Notifications** - Powered by Resend API with custom templates
- **Browser Notifications** - Real-time desktop alerts
- **Customizable Thresholds** - Set your own alert parameters

### 🎨 Modern UI/UX
- **Cyber Theme** - Futuristic neon-styled interface (default)
- **Dark Theme** - Professional dark mode option
- **Glass Morphism** - Modern glass card design system
- **Responsive Design** - Works on all device sizes
- **Command Palette** - Quick navigation with keyboard shortcuts (⌘K)

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + Custom Neon Themes
- **Animations**: Framer Motion
- **State Management**: Zustand
- **APIs**: Algorand Indexer, Nodely API, Vestige API, Tinyman API
- **Email Service**: Resend API
- **Icons**: Lucide React

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/marvboi/algometrics.git
   cd algometrics
   ```

2. **Install dependencies**
   ```bash
   cd project
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Configure your `.env` file with:
   ```env
   VITE_ALGORAND_API_TOKEN=your_algorand_api_token
   VITE_RESEND_API_KEY=your_resend_api_key
   VITE_FROM_EMAIL=noreply@yourdomain.com
   VITE_TINYMAN_ENABLED=true
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 📧 Email Alerts Setup

AlgoMetrics supports multiple email service providers:

### Resend (Recommended)
1. Sign up at [resend.com](https://resend.com)
2. Add your domain and verify DNS records
3. Generate an API key
4. Configure in `.env` file

### SendGrid
1. Sign up at [sendgrid.com](https://sendgrid.com)
2. Generate an API key
3. Configure sender authentication
4. Update email service configuration

For detailed setup instructions, see [EMAIL_SETUP.md](project/EMAIL_SETUP.md)

## 🎮 Usage

### Navigation
- **⌘K** - Open command palette
- **Dashboard** - Overview of all metrics
- **Whale Tracker** - Monitor large transactions
- **DeFi Analytics** - DeFi protocol insights
- **Smart Alerts** - Manage notifications
- **Settings** - Configure thresholds and preferences

### Key Features
- **Real-time Data** - All metrics update automatically
- **Whale Alerts** - Get notified of $1M+ transactions
- **Theme Switching** - Toggle between Cyber and Dark themes
- **Export Data** - Download analytics as JSON
- **Portfolio Analysis** - Analyze any Algorand wallet

## 🏗️ Project Structure

```
algometrics/
├── project/                    # Main application
│   ├── src/
│   │   ├── components/        # React components
│   │   │   ├── dashboard/     # Dashboard-specific components
│   │   │   └── ui/           # Reusable UI components
│   │   ├── hooks/            # Custom React hooks
│   │   ├── services/         # API services
│   │   ├── store/            # State management
│   │   └── types/            # TypeScript definitions
│   ├── public/               # Static assets
│   └── package.json          # Dependencies
├── EMAIL_SETUP.md            # Email configuration guide
├── EMAIL_TROUBLESHOOTING.md  # Email troubleshooting
└── README.md                 # This file
```

## 🔧 Configuration

### Alert Thresholds
Configure in Settings or environment variables:
- `VITE_WHALE_MOVEMENT_THRESHOLD` - Minimum ALGO for whale alerts (default: 1,000,000)
- `VITE_NETWORK_CONGESTION_THRESHOLD` - TPS threshold (default: 80)
- `VITE_UNUSUAL_ACTIVITY_THRESHOLD` - Transaction threshold (default: 500)

### API Endpoints
- **Algorand Indexer**: Mainnet indexer for transaction data
- **Nodely API**: Network status and validator information
- **Vestige API**: DeFi protocol data
- **Tinyman API**: DEX analytics

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Netlify
1. Connect repository to Netlify
2. Set build command: `cd project && npm run build`
3. Set publish directory: `project/dist`
4. Configure environment variables

### Manual Deployment
```bash
cd project
npm run build
# Upload dist/ folder to your hosting provider
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🏆 Hackathon Submission

This project was built for the **Algorand Bolt Hackathon** with key innovations in real-time blockchain analytics and whale tracking.

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/marvboi/algometrics/issues)
- **Email**: For email setup issues, see [EMAIL_TROUBLESHOOTING.md](project/EMAIL_TROUBLESHOOTING.md)
- **Documentation**: Check the `/project` folder for detailed guides

## 🌟 Acknowledgments

- Algorand Foundation for the amazing blockchain platform
- Bolt Hackathon organizers
- Open source community for the incredible tools and libraries

---

**Built with ❤️ for the Algorand ecosystem** 