# WAQI/AQICN API Setup Guide

## 🚀 Getting Your WAQI Token

### Step 1: Register for WAQI Token
1. Go to [https://aqicn.org/data-platform/token/](https://aqicn.org/data-platform/token/)
2. Click "Register" to create a new account
3. Fill in your details and verify your email
4. Log in to your account

### Step 2: Get Your Token
1. After logging in, you'll see your personal token
2. Copy the token (it looks like: `your_token_here`)

### Step 3: Add Token to Environment
1. Create or edit `.env.local` file in your project root
2. Add your token:
```bash
VITE_WAQI_TOKEN=your_actual_token_here
```

### Step 4: Restart Development Server
```bash
npm run dev
```

## 🔧 API Features

### What WAQI Provides:
- **Real-time AQI data** for Delhi and other cities
- **Station-level monitoring** with 15+ Delhi stations
- **Detailed pollutant data** (PM2.5, PM10, NO2, CO, O3, SO2)
- **Health implications** and caution statements
- **Government-grade accuracy** for Delhi air quality

### Benefits Over OpenWeatherMap:
- **More accurate Delhi data** from local monitoring stations
- **Higher update frequency** (real-time vs hourly)
- **Better coverage** of Delhi-specific air quality issues
- **Detailed health guidance** based on AQI levels

## 📊 Data Quality

### AQI Scale (0-500):
- **0-50**: Good (Green)
- **51-100**: Moderate (Yellow)
- **101-150**: Unhealthy for Sensitive Groups (Orange)
- **151-200**: Unhealthy (Red)
- **201-300**: Very Unhealthy (Purple)
- **301+**: Hazardous (Maroon)

### Pollutant Coverage:
- **PM2.5**: Fine particulate matter
- **PM10**: Coarse particulate matter
- **NO2**: Nitrogen dioxide
- **CO**: Carbon monoxide
- **O3**: Ozone
- **SO2**: Sulfur dioxide

## 🚨 Important Notes

### Rate Limits:
- **Free tier**: 1000 requests/day
- **Paid tier**: Higher limits available

### Fallback:
- If WAQI fails, the app will show an error message
- Consider getting a paid token for production use

### Demo Mode:
- Without a token, the app uses 'demo' mode
- Limited functionality and data accuracy

## 🔍 Testing Your Setup

1. **Check Console**: Look for "Fetching Delhi AQI data from WAQI/AQICN..." messages
2. **Verify Data**: AQI values should be more accurate for Delhi
3. **Check Source**: Data should show "WAQI" as the source
4. **Test Refresh**: Manual refresh should work with WAQI data

## 🆘 Troubleshooting

### Common Issues:
1. **"Invalid token"**: Check your token in `.env.local`
2. **"Rate limit exceeded"**: Wait or upgrade to paid plan
3. **"No data available"**: Check internet connection
4. **"City not found"**: Try different city names

### Support:
- WAQI Documentation: [https://aqicn.org/json-api/doc/](https://aqicn.org/json-api/doc/)
- Token Issues: Contact WAQI support through their website 