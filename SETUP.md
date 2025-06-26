# Setup Guide - Construction Materials Price Aggregator

## Getting Started with Home Depot API Integration

### 1. Get Your SerpAPI Key

1. Visit [SerpAPI](https://serpapi.com/) and create an account
2. Subscribe to the Home Depot Search API plan
3. Copy your API key from the dashboard

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory of your project:

```bash
# SerpAPI Key for Home Depot Search API
NEXT_PUBLIC_SERPAPI_KEY=your_actual_api_key_here
```

**Important:** Replace `your_actual_api_key_here` with your real SerpAPI key.

### 3. Install Dependencies

```bash
npm install
```

### 4. Start the Development Server

```bash
npm run dev
```

### 5. Test the Integration

1. Open your browser to `http://localhost:3000`
2. Select a material type (e.g., Concrete)
3. Enter a quantity and location
4. Click "Search Prices" to see real Home Depot products

## API Features

The integration includes:

- **Real-time product search** from Home Depot US and Canada
- **Price comparison** with sorting options
- **Location-based filtering** using ZIP codes
- **Product details** including ratings, reviews, and delivery options
- **Direct links** to Home Depot product pages

## Supported Material Types

- Concrete (concrete mix)
- Steel (steel rebar)
- Cement
- Wood (lumber)
- Brick (masonry)
- Glass (windows)

## Troubleshooting

### API Key Issues
- Ensure your API key is correctly set in `.env.local`
- Check that you have an active SerpAPI subscription
- Verify the API key has access to Home Depot Search API

### No Results Found
- Try different search terms
- Check your location/ZIP code format
- Ensure the material type is supported

### Rate Limiting
- SerpAPI has rate limits based on your plan
- Consider implementing caching for repeated searches

## Next Steps

1. **Add More Suppliers**: Integrate with Lowe's, Menards, or local suppliers
2. **User Accounts**: Add authentication for contractors
3. **Price Alerts**: Notify users of price drops
4. **Bulk Quotes**: Request quotes for large orders
5. **Mobile App**: Create a native mobile application

## Support

For questions or issues:
- Email: pierre.ggarcia01@gmail.com
- Check the [SerpAPI documentation](https://serpapi.com/docs)
- Review the [Next.js documentation](https://nextjs.org/docs) 