# Delhi Air Clarity - Government Crisis Management System

A comprehensive air quality monitoring dashboard for Delhi, India, featuring real-time data from multiple sources including Google Air Quality API and OpenWeatherMap.

## Features

- **Multi-Source Data Integration**: Real-time air quality data from two sources
  - Google Air Quality API (PM2.5, PM10, NO2, CO, O3, SO2)
  - OpenWeatherMap (PM2.5, PM10, NO2, CO, O3, SO2)
- **Dynamic AQI Cards**: Color-coded air quality indicators with gradient backgrounds
- **Interactive Protection Modals**: Detailed health recommendations and Q&A
- **Source Icons**: Visual indicators for pollutant sources
- **Responsive Design**: Mobile-friendly government-grade interface
- **Real-time Updates**: Auto-refresh every 5 minutes

## Security Features

### API Key Protection
This application implements industry-standard security measures to protect API keys:

1. **Environment Variables**: All API keys are stored in `.env.local` files
2. **Git Ignore**: `.env.local` files are excluded from version control
3. **Client-Side Only**: API keys are only used in the frontend (Vite handles this securely)
4. **No Hardcoding**: No API keys are hardcoded in the source code

### Required Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Google Air Quality API Key
VITE_GOOGLE_AQI_API_KEY=your_google_aqi_api_key_here

# OpenWeatherMap API Key (if using)
VITE_OPENWEATHER_API_KEY=your_openweather_api_key_here
```

## Setup Instructions

### Prerequisites
- Node.js 18+ 
- npm or pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Sandde-Zutshi/delhi-air-clarity-now.git
   cd delhi-air-clarity-now
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Configure environment variables**
   ```bash
   # Create .env.local file
   echo "VITE_GOOGLE_AQI_API_KEY=your_google_aqi_api_key_here" > .env.local
   ```

4. **Start development server**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:8081`

## API Sources

### 1. Google Air Quality API
- **Endpoint**: `https://airquality.googleapis.com/v1/currentConditions:lookup`
- **Data**: PM2.5, PM10, NO2, CO, O3, SO2, AQI
- **Update Frequency**: Real-time
- **Authentication**: API Key required

### 2. OpenWeatherMap
- **Endpoint**: OpenWeatherMap Air Pollution API
- **Data**: PM2.5, PM10, NO2, CO, O3, SO2
- **Update Frequency**: Every 5 minutes
- **Authentication**: API Key required

## Security Best Practices

### For Development
1. Never commit `.env.local` files to version control
2. Use different API keys for development and production
3. Regularly rotate API keys
4. Monitor API usage and set rate limits

### For Production
1. Use environment-specific `.env` files
2. Implement API key rotation
3. Set up monitoring and alerting
4. Use HTTPS for all API calls
5. Consider using a backend proxy for additional security

## Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms
- Ensure environment variables are properly configured
- Set up proper CORS headers if needed
- Configure build settings for Vite

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support or questions:
- Create an issue on GitHub
- Contact: [Your Contact Information]

## Disclaimer

This application is for informational purposes only. Always refer to official government sources for critical air quality decisions.
