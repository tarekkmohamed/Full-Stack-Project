# E-Commerce Backend (Django)

This is the backend API for the E-Commerce web application, built with Django and Django REST Framework.

## Features

- **User Authentication**: JWT-based authentication with email verification
- **Product Management**: CRUD operations for products, categories, brands, and tags
- **Shopping Cart**: Persistent cart for both authenticated and guest users
- **Order Management**: Complete order processing and tracking system
- **Admin Panel**: Comprehensive admin interface for managing the platform
- **API Documentation**: Well-documented REST API endpoints

## Installation

### Prerequisites
- Python 3.8 or higher
- pip (Python package installer)
- Virtual environment (recommended)

### Setup Instructions

1. **Clone the repository and navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create and activate virtual environment:**
   ```bash
   # Create virtual environment
   python -m venv venv
   
   # Activate virtual environment
   # On Windows:
   venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables:**
   Create a `.env` file in the backend directory with the following variables:
   ```env
   SECRET_KEY=your-secret-key-here
   DEBUG=True
   DATABASE_URL=sqlite:///db.sqlite3
   EMAIL_HOST_USER=your-email@gmail.com
   EMAIL_HOST_PASSWORD=your-app-password
   ```

5. **Run database migrations:**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

6. **Create superuser:**
   ```bash
   python manage.py createsuperuser
   ```

7. **Start development server:**
   ```bash
   python manage.py runserver
   ```

The API will be available at `http://localhost:8000`

## API Endpoints

### Authentication Endpoints
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login
- `POST /api/auth/verify-email/<token>/` - Email verification
- `POST /api/auth/password-reset-request/` - Request password reset
- `POST /api/auth/password-reset-confirm/` - Confirm password reset
- `GET /api/auth/user-info/` - Get current user info
- `PUT /api/auth/profile/` - Update user profile
- `POST /api/auth/change-password/` - Change password

### Product Endpoints
- `GET /api/products/` - List all products
- `GET /api/products/<id>/` - Get product details
- `POST /api/products/` - Create new product (sellers only)
- `PUT /api/products/<id>/` - Update product (sellers only)
- `DELETE /api/products/<id>/` - Delete product (sellers only)
- `GET /api/products/search/` - Search products
- `GET /api/products/featured/` - Get featured products
- `GET /api/products/categories/` - List categories
- `GET /api/products/brands/` - List brands
- `GET /api/products/tags/` - List tags
- `GET /api/products/<id>/reviews/` - Get product reviews
- `POST /api/products/<id>/reviews/` - Create product review

### Cart Endpoints
- `GET /api/cart/` - Get user's cart
- `POST /api/cart/add/` - Add item to cart
- `PUT /api/cart/update/<item_id>/` - Update cart item
- `DELETE /api/cart/remove/<item_id>/` - Remove cart item
- `DELETE /api/cart/clear/` - Clear cart
- `GET /api/cart/summary/` - Get cart summary

### Order Endpoints
- `GET /api/orders/` - List user's orders
- `GET /api/orders/<id>/` - Get order details
- `POST /api/orders/` - Create new order
- `PUT /api/orders/<id>/status/` - Update order status
- `GET /api/orders/stats/` - Get order statistics
- `GET /api/orders/seller-stats/` - Get seller statistics
- `GET /api/orders/admin-stats/` - Get admin statistics

### Wishlist Endpoints
- `GET /api/products/wishlist/` - Get user's wishlist
- `POST /api/products/wishlist/` - Add to wishlist
- `DELETE /api/products/wishlist/<id>/` - Remove from wishlist
- `POST /api/products/wishlist/toggle/<product_id>/` - Toggle wishlist item

## Database Models

### User Model
- Custom user model extending Django's AbstractUser
- Additional fields: mobile_phone, profile_picture, is_verified, is_seller
- Email verification system
- User profile management

### Product Model
- Product information: title, description, price, stock_quantity
- Relationships: category, brand, seller, tags
- Discount system with time-based offers
- Product status and approval system
- Image gallery support

### Order Model
- Order processing and tracking
- Shipping and billing information
- Payment status and method tracking
- Order status history

### Cart Model
- Shopping cart for both authenticated and guest users
- Cart item management
- Persistent storage

## Authentication

The API uses JWT (JSON Web Tokens) for authentication:

1. **Registration**: User registers with email and password
2. **Email Verification**: User must verify email before login
3. **Login**: Returns access and refresh tokens
4. **Token Refresh**: Access tokens are automatically refreshed
5. **Protected Routes**: Most endpoints require authentication

## Permissions

- **Public**: Product listing, search, categories, brands
- **Authenticated**: Cart, orders, profile, wishlist
- **Sellers**: Product management, seller dashboard
- **Admins**: User management, product approval, admin dashboard

## Admin Interface

Access the Django admin interface at `http://localhost:8000/admin/`

Features:
- User management
- Product approval system
- Order management
- Category and brand management
- Analytics and reporting

## Testing

Run tests with:
```bash
python manage.py test
```

## Production Deployment

1. **Set up production database (PostgreSQL recommended)**
2. **Configure environment variables**
3. **Set up static file serving**
4. **Configure email settings**
5. **Set up Redis for caching**
6. **Deploy to cloud platform**

## Environment Variables

```env
SECRET_KEY=your-secret-key
DEBUG=False
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
REDIS_URL=redis://localhost:6379/0
```

## API Documentation

The API follows RESTful conventions and returns JSON responses. All endpoints support:

- Pagination for list endpoints
- Filtering and searching
- Ordering and sorting
- Error handling with appropriate HTTP status codes

## Error Handling

The API returns consistent error responses:

```json
{
  "error": "Error message",
  "details": "Additional error details"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

This project is licensed under the MIT License.





