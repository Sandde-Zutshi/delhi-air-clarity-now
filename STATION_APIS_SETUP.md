# Delhi Station-Level Air Quality APIs Setup

This document explains how to set up and use the WAQI/AQICN and OpenAQ APIs for Delhi station-level air quality data.

## 🎯 Overview

The app now integrates two powerful APIs for real-time Delhi air quality data:

1. **WAQI/AQICN API** - World Air Quality Index API with station-level data
2. **OpenAQ API** - Open Air Quality data platform with government monitoring stations

## 🔑 API Setup

### 1. WAQI/AQICN API Token

1. Visit [https://aqicn.org/data-platform/token/](https://aqicn.org/data-platform/token/)
2. Sign up for a free account
3. Get your API token
4. Add to your `.env.local` file:

```bash
VITE_WAQI_TOKEN=your_waqi_token_here
```

### 2. OpenAQ API

OpenAQ API is free and doesn't require authentication for basic usage. However, for production use, you may want to register for an API key.

## 📊 Delhi Monitoring Stations

The app includes 15 key Delhi government monitoring stations:

- **ITO** - Central Delhi
- **Anand Vihar** - East Delhi
- **Jahangirpuri** - North Delhi
- **R.K. Puram** - South Delhi
- **Dwarka** - Southwest Delhi
- **Connaught Place** - Central Delhi
- **India Gate** - Central Delhi
- **Lajpat Nagar** - South Delhi
- **Karol Bagh** - Central Delhi
- **Pitampura** - North Delhi
- **Rohini** - North Delhi
- **Mundka** - West Delhi
- **Wazirpur** - North Delhi
- **Bawana** - North Delhi
- **Najafgarh** - Southwest Delhi

## 🚀 Features

### Station-Level Data
- Real-time AQI values for each station
- Individual pollutant measurements (PM2.5, PM10, NO2, O3, CO, SO2)
- Data source attribution (WAQI vs OpenAQ)
- Station type classification (government, research, community)

### Advanced Analytics
- **Worst Affected Areas** - Top 5 stations with highest AQI
- **AQI Level Grouping** - Stations grouped by air quality level
- **Average AQI Calculation** - City-wide average from all stations
- **Real-time Updates** - Auto-refresh every 5 minutes

### Government-Grade Features
- **Station Selection** - Click any station for detailed view
- **Source Verification** - Clear indication of data source
- **Timestamp Tracking** - Last updated times for each station
- **Health Warnings** - Automatic alerts for unhealthy conditions

## 📱 Usage

### Accessing Station Data

1. **Main Dashboard**: Visit `/` for the main Delhi air quality dashboard
2. **Station Details**: Visit `/stations` for comprehensive station-level data

### Station Page Features

- **Overview Tab**: All Delhi monitoring stations
- **Worst Affected Tab**: Top 5 highest AQI stations
- **By AQI Level Tab**: Stations grouped by air quality level
- **Station Details Tab**: Detailed information for selected station

## 🔧 Technical Implementation

### API Integration

```typescript
// Fetch all Delhi stations data
const data = await getDelhiStationsData();

// Get specific station
const station = await getStationData("ITO");

// Get worst affected stations
const worstStations = await getWorstAffectedStations();

// Get stations by AQI level
const unhealthyStations = await getStationsByAQILevel("Unhealthy");
```

### Data Structure

```typescript
interface StationData {
  id: string;
  name: string;
  location: string;
  coordinates: { lat: number; lon: number };
  aqi: number;
  aqiLevel: string;
  pollutants: {
    pm2_5?: number;
    pm10?: number;
    no2?: number;
    co?: number;
    o3?: number;
    so2?: number;
  };
  lastUpdated: Date;
  source: 'WAQI' | 'OpenAQ';
  stationType: 'government' | 'research' | 'community';
}
```

## 🛡️ Error Handling

The app includes robust error handling:

- **API Failures**: Graceful fallback between WAQI and OpenAQ
- **Network Issues**: Automatic retry mechanisms
- **Data Validation**: Checks for valid AQI values
- **Loading States**: Clear loading indicators

## 📈 Data Quality

### WAQI API
- **Coverage**: Global network of monitoring stations
- **Update Frequency**: Real-time (every few minutes)
- **Accuracy**: High-quality government and research data
- **Pollutants**: PM2.5, PM10, NO2, O3, CO, SO2

### OpenAQ API
- **Coverage**: Government monitoring networks
- **Update Frequency**: Near real-time
- **Accuracy**: Official government data
- **Pollutants**: Standard air quality parameters

## 🔄 Data Refresh

- **Auto-refresh**: Every 5 minutes
- **Manual refresh**: Available via refresh button
- **Real-time updates**: Live data from monitoring stations

## 🎨 UI Features

- **Color-coded AQI levels** - Visual indicators for air quality
- **Interactive station cards** - Click for detailed information
- **Source badges** - Clear data source attribution
- **Warning alerts** - Automatic alerts for unhealthy conditions
- **Responsive design** - Works on all device sizes

## 🚨 Health Alerts

The system automatically provides health warnings:

- **AQI > 150**: Unhealthy conditions warning
- **AQI > 200**: Very unhealthy conditions alert
- **AQI > 300**: Hazardous conditions emergency alert

## 📋 Next Steps

1. **Get WAQI Token**: Register at aqicn.org for API access
2. **Test APIs**: Verify data connectivity
3. **Monitor Performance**: Check data refresh rates
4. **Scale Up**: Add more stations as needed

## 🔗 Useful Links

- [WAQI API Documentation](https://aqicn.org/json-api/doc/)
- [OpenAQ API Documentation](https://docs.openaq.org/)
- [Delhi Pollution Control Committee](http://www.dpcc.delhigovt.nic.in/)
- [CPCB Air Quality Data](https://cpcb.nic.in/air-quality-data/)

---

**Note**: This implementation provides government-grade air quality monitoring for Delhi with real-time station-level data from multiple reliable sources. 