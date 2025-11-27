# E-Commerce Frontend (React)

This is the frontend application for the E-Commerce web application, built with React.js and modern web technologies.

## Features

- **Responsive Design**: Mobile-first approach with full responsiveness
- **Modern UI**: Clean and intuitive user interface
- **Authentication**: Complete user authentication flow
- **Product Catalog**: Advanced product browsing and search
- **Shopping Cart**: Persistent cart for both guest and authenticated users
- **Order Management**: Order tracking and history
- **Admin Panel**: Seller and admin dashboards
- **Real-time Updates**: Live cart updates and notifications

## Installation

### Prerequisites
- Node.js 16 or higher
- npm or yarn package manager

### Setup Instructions

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the frontend directory:
   ```env
   REACT_APP_API_URL=http://localhost:8000/api
   ```

4. **Start development server:**
   ```bash
   npm start
   ```

The application will be available at `http://localhost:3000`

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── Auth/           # Authentication components
│   ├── Layout/         # Layout components (Navbar, Footer)
│   ├── Products/       # Product-related components
│   └── UI/             # Generic UI components
├── contexts/           # React contexts for state management
│   ├── AuthContext.js  # Authentication context
│   └── CartContext.js  # Shopping cart context
├── pages/              # Page components
│   ├── Auth/           # Authentication pages
│   ├── Home.js         # Homepage
│   ├── Products.js     # Product listing
│   ├── ProductDetail.js # Product details
│   ├── Cart.js         # Shopping cart
│   ├── Checkout.js     # Checkout process
│   ├── Profile.js      # User profile
│   ├── Orders.js       # Order history
│   ├── SellerDashboard.js # Seller dashboard
│   └── AdminDashboard.js  # Admin dashboard
├── utils/              # Utility functions
│   └── api.js          # API client configuration
├── App.js              # Main application component
└── index.js            # Application entry point
```

## Key Components

### Authentication System
- **Login/Register**: Complete authentication flow
- **Protected Routes**: Route protection based on user roles
- **JWT Token Management**: Automatic token refresh
- **Password Reset**: Email-based password reset

### Product Management
- **Product Cards**: Responsive product display
- **Search & Filter**: Advanced product filtering
- **Product Details**: Detailed product information
- **Image Gallery**: Product image slider
- **Reviews & Ratings**: Product review system

### Shopping Cart
- **Cart Management**: Add, update, remove items
- **Guest Cart**: Cart persistence for non-authenticated users
- **Real-time Updates**: Live cart updates
- **Stock Validation**: Inventory checking

### User Interface
- **Responsive Design**: Mobile-first approach
- **Loading States**: User feedback during operations
- **Error Handling**: Comprehensive error management
- **Toast Notifications**: User-friendly notifications

## State Management

### AuthContext
Manages user authentication state:
- User login/logout
- Profile management
- Role-based permissions
- Token management

### CartContext
Manages shopping cart state:
- Cart items
- Add/remove/update operations
- Guest cart persistence
- Cart calculations

## API Integration

The frontend communicates with the Django backend through a centralized API client:

```javascript
// Example API usage
import { productsAPI } from '../utils/api';

// Get products
const products = await productsAPI.getProducts();

// Add to cart
await cartAPI.addToCart(productId, quantity);
```

## Routing

The application uses React Router for client-side routing:

- `/` - Homepage
- `/products` - Product listing
- `/products/:id` - Product details
- `/cart` - Shopping cart
- `/checkout` - Checkout process
- `/login` - User login
- `/register` - User registration
- `/profile` - User profile
- `/orders` - Order history
- `/seller-dashboard` - Seller dashboard
- `/admin-dashboard` - Admin dashboard

## Styling

The application uses a custom CSS framework with:
- **CSS Grid & Flexbox**: Modern layout techniques
- **Responsive Design**: Mobile-first approach
- **Component-based Styling**: Reusable CSS classes
- **Custom Properties**: CSS variables for theming
- **Utility Classes**: Helper classes for common styles

## Performance Optimizations

- **Code Splitting**: Lazy loading of components
- **Image Optimization**: Optimized product images
- **Caching**: React Query for API response caching
- **Bundle Optimization**: Optimized build process
- **Lazy Loading**: On-demand component loading

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Development

### Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App

### Code Style

The project follows:
- ESLint configuration
- Prettier formatting
- React best practices
- Component composition patterns

## Testing

Run tests with:
```bash
npm test
```

## Building for Production

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Deploy the build folder to your hosting service**

## Environment Variables

```env
REACT_APP_API_URL=http://localhost:8000/api
```

## Deployment

### Static Hosting (Netlify, Vercel)
1. Connect your repository
2. Set build command: `npm run build`
3. Set publish directory: `build`
4. Configure environment variables

### Traditional Hosting
1. Build the application
2. Upload build folder to web server
3. Configure server to serve React app
4. Set up API proxy if needed

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Troubleshooting

### Common Issues

1. **API Connection Issues**
   - Check if backend server is running
   - Verify API URL in environment variables
   - Check CORS configuration

2. **Build Issues**
   - Clear node_modules and reinstall
   - Check Node.js version compatibility
   - Verify all dependencies are installed

3. **Authentication Issues**
   - Check token storage in localStorage
   - Verify JWT token validity
   - Check API authentication endpoints

## Support

For support and questions, please contact the development team or create an issue in the repository.





