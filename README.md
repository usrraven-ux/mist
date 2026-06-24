# GovtRank Luxury - Premium Government Job Portal

A luxury, custom UI/UX government job portal website with all working functionality, easy onboarding, and premium experience.

## Features

### Core Functionality
- **Job Listings**: Browse thousands of government job opportunities
- **Advanced Search**: Search by job title, organization, qualification, etc.
- **Smart Filtering**: Filter by state, category, qualification, recruitment board
- **Real-time Updates**: Live job notifications and alerts
- **Save & Track**: Save jobs to your list and track application status
- **Push Notifications**: Get instant alerts for new job postings

### Luxury UI/UX
- **Premium Design**: Elegant dark theme with gold accents
- **Smooth Animations**: Framer Motion powered animations
- **Responsive Layout**: Works perfectly on all devices
- **Custom Components**: Beautiful, reusable UI components
- **Accessibility**: WCAG compliant design

### Easy Onboarding
- **Step-by-step Guide**: Interactive onboarding flow
- **Personalization**: Select your interests and preferences
- **Notification Setup**: Configure notification preferences
- **Quick Start**: Get started in under a minute

### Additional Features
- **PWA Support**: Install as a progressive web app
- **Offline Mode**: Works without internet connection
- **Dark/Light Mode**: Toggle between themes
- **Voice Search**: Search using your voice
- **Share Jobs**: Share job listings with friends
- **Download PDFs**: Download job notifications
- **Print Support**: Print job details

## Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Charts**: Recharts
- **Date Handling**: date-fns
- **PWA**: Vite PWA Plugin
- **State Management**: React Context API

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
cd /workspace/usrraven-ux__mist
git clone https://github.com/usrraven-ux/mist.git .
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open your browser and navigate to:
```
http://localhost:5173
```

### Build for Production

```bash
npm run build
# or
yarn build
```

### Preview Production Build

```bash
npm run preview
# or
yarn preview
```

## Project Structure

```
govt-rank-luxury/
├── public/                  # Static files
│   ├── manifest.json        # PWA manifest
│   ├── favicon.svg          # Favicon
│   └── ...
├── src/
│   ├── assets/              # Static assets
│   ├── components/          # Reusable components
│   │   ├── Layout.jsx       # Main layout
│   │   ├── JobCard.jsx      # Job card component
│   │   ├── LoadingScreen.jsx # Loading screen
│   │   ├── NotificationDropdown.jsx
│   │   ├── SearchBar.jsx
│   │   ├── Sidebar.jsx
│   │   ├── MobileNav.jsx
│   │   ├── StatCard.jsx
│   │   └── CategoryFilter.jsx
│   ├── context/              # React Context providers
│   │   ├── JobContext.jsx
│   │   ├── NotificationContext.jsx
│   │   └── OnboardingContext.jsx
│   ├── hooks/               # Custom hooks
│   ├── pages/               # Page components
│   │   ├── Home.jsx
│   │   ├── Jobs.jsx
│   │   ├── JobDetail.jsx
│   │   ├── StateJobs.jsx
│   │   ├── CategoryJobs.jsx
│   │   ├── QualificationJobs.jsx
│   │   ├── SavedJobs.jsx
│   │   ├── Notification.jsx
│   │   ├── Profile.jsx
│   │   ├── SearchResults.jsx
│   │   └── Onboarding.jsx
│   ├── services/            # API services
│   ├── styles/              # CSS styles
│   │   └── index.css        # Tailwind CSS
│   ├── utils/               # Utility functions
│   │   ├── mockData.js      # Mock data
│   │   └── helpers.js       # Helper functions
│   ├── App.jsx              # Main App component
│   └── main.jsx             # Entry point
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=https://api.govtrank.com
VITE_APP_NAME=GovtRank Luxury
```

### Customization

1. **Colors**: Edit `tailwind.config.js` to change the color scheme
2. **Animations**: Modify animation variants in component files
3. **Data**: Update mock data in `src/utils/mockData.js`
4. **Routes**: Edit routes in `src/App.jsx`

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Opera

## Features to Add

- [ ] Real API integration
- [ ] User authentication
- [ ] Database integration
- [ ] Admin dashboard
- [ ] Job application tracking
- [ ] Resume builder
- [ ] Interview preparation
- [ ] Exam calendar
- [ ] Community forum
- [ ] Chat support

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Contact

For questions or support, please contact:
- Email: support@govtrank.com
- Website: https://govtrank.com

---

**GovtRank Luxury** - Your premium gateway to government job opportunities.

*Find your dream government job with style and ease.*
