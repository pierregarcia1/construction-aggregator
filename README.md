
# Construction Materials Price Aggregator

A platform that helps contractors, builders, and homeowners compare prices for construction materials like concrete, steel, wood, brick, glass, cement, and more — across nearby suppliers — saving time and money.

---

## Features

Compare real-time prices from multiple suppliers  
Filter by material type, quantity, and location  
See estimated total cost and delivery options  
Transparent supplier information  
Mobile-friendly design for jobsite use  

---

## MVP Scope

The Minimum Viable Product focuses on:

- Material types: Concrete, Steel, Cement  
- Geographic scope: Local suppliers within a chosen metro area  
- Basic price comparison UI  
- Manual or scraped price data for initial suppliers  

---

## Tech Stack (Planned)

| Layer            | Technology              |
|-----------------|------------------------|
| Frontend        | React or Next.js (TypeScript)  
| Backend         | Node.js + Express or Python (FastAPI)  
| Database        | PostgreSQL + PostGIS (location-based search)  
| APIs / Data     | Supplier-provided APIs, CSV imports, Web Scraping (where permitted)  
| Authentication  | JWT, OAuth (future phase)  
| Hosting         | Vercel, Netlify, or AWS (TBD)  

---

## Project Structure (Example)

```
construction-price-aggregator/
|- client/               # Frontend React app
|- server/               # Backend API
|- scripts/              # Web scraping or data import tools
|- database/             # SQL scripts & schema
|- docs/                 # Architecture diagrams, planning docs
|- README.md
```

---

## Example Usage

**Search Form:**

- Material: `Concrete`  
- Quantity: `5 cubic yards`  
- Location: `Dallas, TX`  

**Results:**

| Supplier        | Price per Yard | Total Price |
|-----------------|----------------|-------------|
| ABC Concrete    | $135           | $675        
| ReadyMix Co.    | $140           | $700        
| Local Supplier X| $150           | $750        

---

## Future Features (Planned)

- Bulk quote request system  
- Price drop alerts  
- Supplier ratings and reviews  
- Contractor subscription for premium features  
- Mobile app version  

---

## Contributing

Interested in collaborating? Contributions are welcome!

1. Fork the repo  
2. Create a feature branch  
3. Commit your changes  
4. Submit a pull request  

---

## License

[MIT License](LICENSE)

---

## Inspiration

Modeled after platforms like **GoodRx**, this project brings price transparency to the fragmented construction materials market.

---

## Contact
For questions, suggestions, or partnership inquiries:  
pierre.ggarcia01@gmail.com