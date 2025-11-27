# E-Commerce Web Application

A full-stack e-commerce web application built with React.js frontend and Django backend, featuring user authentication, product management, shopping cart, order processing, and admin panel.

## Features

### 🔐 Authentication System
- User registration with email verification
- Secure login with JWT tokens
- Password reset functionality
- User profile management
- Role-based access control (Customer, Seller, Admin)

### 🛍️ Product Management
- Product catalog with categories, brands, and tags
- Advanced search and filtering
- Product reviews and ratings
- Image gallery with primary image support
- Discount system with time-based offers
- Stock management
- Seller product management

### 🛒 Shopping Experience
- Shopping cart for both authenticated and guest users
- Wishlist functionality
- Product comparison
- Order tracking
- Order history
- Multiple shipping addresses

### 👨‍💼 Admin Panel
- User management
- Product approval system
- Order management
- Sales analytics
- Category and brand management

### 📱 Responsive Design
- Mobile-first approach
- Fully responsive for desktop, tablet, and mobile
- Modern UI with smooth animations
- Accessibility features

## Tech Stack

### Backend
- **Django 4.2.7** - Web framework
- **Django REST Framework** - API development
- **JWT Authentication** - Secure token-based auth
- **PostgreSQL/SQLite** - Database
- **Pillow** - Image processing
- **Celery** - Background tasks
- **Redis** - Caching and message broker

### Frontend
- **React 18** - UI library
- **React Router** - Client-side routing
- **React Query** - Data fetching and caching
- **React Hook Form** - Form management
- **Axios** - HTTP client
- **React Icons** - Icon library
- **Framer Motion** - Animations
- **Swiper** - Touch slider

## Project Structure

```
Final Project Full Stack/
├── backend/                 # Django backend
│   ├── ecommerce/          # Main Django project
│   ├── accounts/           # User authentication app
│   ├── products/           # Product management app
│   ├── cart/               # Shopping cart app
│   ├── orders/             # Order management app
│   └── requirements.txt    # Python dependencies
├── frontend/               # React frontend
│   ├── public/             # Static files
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── contexts/       # React contexts
│   │   ├── utils/          # Utility functions
│   │   └── App.js          # Main app component
│   └── package.json        # Node dependencies
└── README.md              # Project documentation
```

## Installation & Setup

### Prerequisites
- Python 3.8+
- Node.js 16+
- PostgreSQL (optional, SQLite used by default)

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run migrations:**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

5. **Create superuser:**
   ```bash
   python manage.py createsuperuser
   ```

6. **Start development server:**
   ```bash
   python manage.py runserver
   ```

The backend will be available at `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm start
   ```

The frontend will be available at `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login
- `POST /api/auth/verify-email/<token>/` - Email verification
- `POST /api/auth/password-reset-request/` - Password reset request
- `POST /api/auth/password-reset-confirm/` - Password reset confirmation
- `GET /api/auth/user-info/` - Get user information
- `PUT /api/auth/profile/` - Update user profile
- `POST /api/auth/change-password/` - Change password

### Products
- `GET /api/products/` - List products
- `GET /api/products/<id>/` - Get product details
- `POST /api/products/` - Create product (sellers)
- `PUT /api/products/<id>/` - Update product (sellers)
- `DELETE /api/products/<id>/` - Delete product (sellers)
- `GET /api/products/search/` - Search products
- `GET /api/products/featured/` - Get featured products
- `GET /api/products/categories/` - List categories
- `GET /api/products/brands/` - List brands
- `GET /api/products/tags/` - List tags

### Cart
- `GET /api/cart/` - Get cart
- `POST /api/cart/add/` - Add item to cart
- `PUT /api/cart/update/<item_id>/` - Update cart item
- `DELETE /api/cart/remove/<item_id>/` - Remove cart item
- `DELETE /api/cart/clear/` - Clear cart

### Orders
- `GET /api/orders/` - List orders
- `GET /api/orders/<id>/` - Get order details
- `POST /api/orders/` - Create order
- `PUT /api/orders/<id>/status/` - Update order status
- `GET /api/orders/stats/` - Get order statistics

## Database Models

### User Model
- Custom user model with additional fields
- Email verification system
- Profile management
- Role-based permissions

### Product Model
- Product information and pricing
- Category and brand relationships
- Image gallery support
- Discount system
- Stock management
- Review and rating system

### Order Model
- Order processing and tracking
- Shipping and billing information
- Payment status tracking
- Order item management

### Cart Model
- Shopping cart functionality
- Guest and authenticated user support
- Persistent cart storage

## Features Implementation

### Authentication Flow
1. User registers with email and password
2. Email verification link sent (24-hour validity)
3. User clicks link to verify email
4. User can now login with JWT tokens
5. Tokens automatically refreshed on API calls

### Product Management
1. Sellers can create, update, and delete products
2. Products require admin approval before going live
3. Admin can feature products on homepage
4. Advanced search and filtering capabilities
5. Product reviews and ratings system

### Shopping Cart
1. Persistent cart for both guest and authenticated users
2. Real-time cart updates
3. Stock validation
4. Guest cart converted to user cart on login

### Order Processing
1. Secure checkout process
2. Order status tracking
3. Email notifications
4. Seller and admin order management

## Security Features

- JWT token-based authentication
- Password validation and hashing
- CSRF protection
- CORS configuration
- Input validation and sanitization
- SQL injection prevention
- XSS protection

## Performance Optimizations

- Database query optimization
- Image optimization and resizing
- Caching strategies
- Lazy loading
- Code splitting
- API response pagination

## Deployment

### Backend Deployment
1. Set up production database (PostgreSQL)
2. Configure environment variables
3. Set up static file serving
4. Configure email settings
5. Deploy to cloud platform (Heroku, AWS, etc.)

### Frontend Deployment
1. Build production bundle
2. Configure environment variables
3. Deploy to static hosting (Netlify, Vercel, etc.)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team or create an issue in the repository.

## Future Enhancements

- Multi-language support (Arabic & English)
- Advanced product reviews with images
- Real-time notifications
- Mobile app development
- Payment gateway integration
- Advanced analytics dashboard
- Inventory management system
- Multi-vendor marketplace features





