# AI Cost Optimizer - Frontend

A modern React TypeScript dashboard for monitoring and optimizing AI API costs in real-time.

## 🚀 Features

- **Real-time Dashboard**: Live tracking of AI usage and costs
- **Modern UI**: Clean, professional design inspired by top admin dashboards
- **Interactive Charts**: Beautiful data visualizations using Recharts
- **Budget Management**: Set limits and receive alerts
- **Multi-provider Support**: Works with OpenAI, Anthropic, and more
- **Responsive Design**: Optimized for desktop and mobile
- **TypeScript**: Full type safety and better developer experience

## 🛠️ Technology Stack

- **React 18** - UI Framework
- **TypeScript** - Type Safety
- **Vite** - Build Tool & Dev Server
- **Tailwind CSS** - Styling & Design System
- **React Router** - Client-side Routing
- **Recharts** - Data Visualization
- **Axios** - HTTP Client
- **Headless UI** - Accessible UI Components
- **Heroicons** - Beautiful Icons

## 📦 Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Setup**
   Create a `.env` file in the frontend directory:
   ```env
   VITE_API_URL=http://localhost:8000
   VITE_NODE_ENV=development
   VITE_APP_NAME="AI Cost Optimizer"
   VITE_APP_VERSION="1.0.0"
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

   The application will be available at http://localhost:5173

## 🏗️ Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Layout/         # Layout components (Sidebar, Header)
│   │   └── UI/             # UI primitives (Cards, Buttons, etc.)
│   ├── pages/              # Page components
│   ├── hooks/              # Custom React hooks
│   ├── services/           # API services and utilities
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Utility functions
│   ├── App.tsx             # Main app component with routing
│   ├── main.tsx            # App entry point
│   └── index.css           # Global styles and Tailwind imports
├── public/                 # Static assets
├── package.json            # Dependencies and scripts
├── tailwind.config.js      # Tailwind CSS configuration
├── postcss.config.js       # PostCSS configuration
├── tsconfig.json           # TypeScript configuration
└── vite.config.ts          # Vite configuration
```

## 🎨 Design System

The application follows a modern design system with:

### Colors
- **Primary**: Blue (#3B82F6) - Main brand color
- **Success**: Green (#22C55E) - Positive actions/states
- **Warning**: Yellow (#EAB308) - Caution/alerts
- **Danger**: Red (#EF4444) - Errors/destructive actions
- **Gray**: Various shades for text and backgrounds

### Typography
- **Font**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700

### Components
- **Cards**: Clean white backgrounds with subtle shadows
- **Buttons**: Consistent styling with hover states
- **Forms**: Accessible inputs with proper focus states
- **Charts**: Professional data visualizations

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler check

# Testing (when added)
npm run test         # Run tests
npm run test:coverage # Run tests with coverage
```

## 📱 Features Overview

### Dashboard
- Key metrics overview (cost, requests, tokens)
- Budget status alerts
- Daily cost trends (area chart)
- Model usage breakdown (pie chart)
- Top models and providers tables

### Authentication
- Secure JWT-based authentication
- Protected routes
- Auto-redirect handling
- Remember me functionality

### Navigation
- Responsive sidebar navigation
- Active route highlighting
- User profile section
- Quick actions

### Components

#### MetricCard
```tsx
<MetricCard
  title="Total Cost"
  value="$123.45"
  icon={<CurrencyDollarIcon />}
  change={{ value: 12, type: 'increase', period: 'vs last month' }}
  color="primary"
/>
```

#### Charts
- Area charts for trends
- Pie charts for breakdowns
- Responsive design
- Interactive tooltips

## 🔗 API Integration

The frontend communicates with the backend API through:

- **Authentication**: JWT tokens stored in localStorage
- **API Service**: Centralized axios instance with interceptors
- **Error Handling**: Automatic token refresh and error notifications
- **Loading States**: Proper loading indicators

## 🚦 Routing

- `/` - Redirects to dashboard
- `/login` - Authentication page
- `/dashboard` - Main dashboard (protected)
- `/analytics` - Detailed analytics (protected)
- `/budget` - Budget management (protected)
- `/api-keys` - API key management (protected)
- `/recommendations` - Cost optimization tips (protected)
- `/reports` - Usage reports (protected)
- `/settings` - Account settings (protected)

## 🎯 Key Features Implementation

### Real-time Updates
- Automatic data refresh
- Optimistic UI updates
- Error boundaries

### Responsive Design
- Mobile-first approach
- Flexible grid layouts
- Touch-friendly interactions

### Accessibility
- ARIA labels and roles
- Keyboard navigation
- High contrast support
- Screen reader compatibility

### Performance
- Code splitting
- Lazy loading
- Optimized bundle size
- Efficient re-renders

## 🔒 Security

- XSS protection
- CSRF protection
- Secure token storage
- API request validation

## 🌐 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📈 Performance Optimization

- **Bundle Optimization**: Tree shaking and code splitting
- **Asset Optimization**: Optimized images and fonts
- **Caching**: Proper HTTP caching headers
- **Lazy Loading**: Routes and components loaded on demand

## 🧪 Testing Strategy

Future testing implementation will include:
- Unit tests with Jest and React Testing Library
- Integration tests for API calls
- E2E tests with Cypress
- Visual regression tests

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Environment Variables
Set the following environment variables for production:
- `VITE_API_URL`: Production API URL
- `VITE_NODE_ENV`: "production"

### Hosting Recommendations
- **Vercel**: Optimal for React apps
- **Netlify**: Great for static hosting
- **AWS S3 + CloudFront**: Scalable solution
- **Docker**: For containerized deployments

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**Built with ❤️ for AI cost optimization**
