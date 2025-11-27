from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from products.models import Category, Brand, Tag, Product, ProductImage, ProductReview
from decimal import Decimal
import random
from datetime import datetime, timedelta

User = get_user_model()


class Command(BaseCommand):
    help = 'Populate the database with sample data'

    def handle(self, *args, **options):
        self.stdout.write('Starting to populate database...')
        
        # Create categories
        categories_data = [
            {'name': 'Electronics', 'description': 'Electronic devices and gadgets'},
            {'name': 'Clothing', 'description': 'Fashion and apparel'},
            {'name': 'Home & Garden', 'description': 'Home improvement and garden supplies'},
            {'name': 'Sports', 'description': 'Sports equipment and accessories'},
            {'name': 'Books', 'description': 'Books and educational materials'},
            {'name': 'Beauty', 'description': 'Beauty and personal care products'},
            {'name': 'Toys', 'description': 'Toys and games for all ages'},
            {'name': 'Automotive', 'description': 'Car parts and automotive accessories'},
        ]
        
        categories = []
        for cat_data in categories_data:
            category, created = Category.objects.get_or_create(
                name=cat_data['name'],
                defaults={'description': cat_data['description']}
            )
            categories.append(category)
            if created:
                self.stdout.write(f'Created category: {category.name}')
        
        # Create brands
        brands_data = [
            {'name': 'Apple', 'description': 'Technology company known for innovative products'},
            {'name': 'Samsung', 'description': 'Global technology leader'},
            {'name': 'Nike', 'description': 'Athletic footwear and apparel'},
            {'name': 'Adidas', 'description': 'Sports and lifestyle brand'},
            {'name': 'Sony', 'description': 'Consumer electronics and entertainment'},
            {'name': 'LG', 'description': 'Electronics and home appliances'},
            {'name': 'Canon', 'description': 'Camera and imaging products'},
            {'name': 'Dell', 'description': 'Computer technology company'},
            {'name': 'HP', 'description': 'Technology and printing solutions'},
            {'name': 'Microsoft', 'description': 'Software and technology company'},
        ]
        
        brands = []
        for brand_data in brands_data:
            brand, created = Brand.objects.get_or_create(
                name=brand_data['name'],
                defaults={'description': brand_data['description']}
            )
            brands.append(brand)
            if created:
                self.stdout.write(f'Created brand: {brand.name}')
        
        # Create tags
        tags_data = [
            {'name': 'Best Seller', 'color': '#ff6b6b'},
            {'name': 'New Arrival', 'color': '#4ecdc4'},
            {'name': 'Sale', 'color': '#45b7d1'},
            {'name': 'Limited Edition', 'color': '#96ceb4'},
            {'name': 'Premium', 'color': '#feca57'},
            {'name': 'Eco-Friendly', 'color': '#48dbfb'},
            {'name': 'Wireless', 'color': '#ff9ff3'},
            {'name': 'Waterproof', 'color': '#54a0ff'},
        ]
        
        tags = []
        for tag_data in tags_data:
            tag, created = Tag.objects.get_or_create(
                name=tag_data['name'],
                defaults={'color': tag_data['color']}
            )
            tags.append(tag)
            if created:
                self.stdout.write(f'Created tag: {tag.name}')
        
        # Create a test user if it doesn't exist
        user, created = User.objects.get_or_create(
            email='test@example.com',
            defaults={
                'first_name': 'Test',
                'last_name': 'User',
                'is_active': True,
                'is_verified': True,
            }
        )
        if created:
            user.set_password('testpass123')
            user.save()
            self.stdout.write('Created test user: test@example.com')
        
        # Create products
        products_data = [
            {
                'title': 'iPhone 15 Pro',
                'description': 'The latest iPhone with advanced camera system and A17 Pro chip',
                'price': Decimal('999.99'),
                'category': 'Electronics',
                'brand': 'Apple',
                'tags': ['Best Seller', 'New Arrival', 'Premium'],
                'stock_quantity': 50,
                'is_featured': True,
            },
            {
                'title': 'Samsung Galaxy S24',
                'description': 'Flagship Android smartphone with AI-powered features',
                'price': Decimal('899.99'),
                'category': 'Electronics',
                'brand': 'Samsung',
                'tags': ['Best Seller', 'Wireless'],
                'stock_quantity': 75,
                'is_featured': True,
            },
            {
                'title': 'Nike Air Max 270',
                'description': 'Comfortable running shoes with Max Air cushioning',
                'price': Decimal('150.00'),
                'category': 'Clothing',
                'brand': 'Nike',
                'tags': ['Best Seller', 'Eco-Friendly'],
                'stock_quantity': 100,
                'is_featured': False,
            },
            {
                'title': 'Sony WH-1000XM5 Headphones',
                'description': 'Industry-leading noise canceling wireless headphones',
                'price': Decimal('399.99'),
                'category': 'Electronics',
                'brand': 'Sony',
                'tags': ['Wireless', 'Premium'],
                'stock_quantity': 30,
                'is_featured': True,
            },
            {
                'title': 'Canon EOS R6 Mark II',
                'description': 'Professional mirrorless camera for photography and videography',
                'price': Decimal('2499.99'),
                'category': 'Electronics',
                'brand': 'Canon',
                'tags': ['Premium', 'New Arrival'],
                'stock_quantity': 15,
                'is_featured': True,
            },
            {
                'title': 'Adidas Ultraboost 22',
                'description': 'High-performance running shoes with energy return',
                'price': Decimal('180.00'),
                'category': 'Clothing',
                'brand': 'Adidas',
                'tags': ['Best Seller'],
                'stock_quantity': 80,
                'is_featured': False,
            },
            {
                'title': 'Dell XPS 13 Laptop',
                'description': 'Ultra-thin laptop with stunning display and long battery life',
                'price': Decimal('1299.99'),
                'category': 'Electronics',
                'brand': 'Dell',
                'tags': ['Premium', 'Wireless'],
                'stock_quantity': 25,
                'is_featured': True,
            },
            {
                'title': 'LG OLED C3 TV',
                'description': '55-inch 4K OLED TV with perfect blacks and infinite contrast',
                'price': Decimal('1499.99'),
                'category': 'Electronics',
                'brand': 'LG',
                'tags': ['Premium', 'New Arrival'],
                'stock_quantity': 20,
                'is_featured': True,
            },
            {
                'title': 'Microsoft Surface Pro 9',
                'description': '2-in-1 tablet and laptop with detachable keyboard',
                'price': Decimal('1099.99'),
                'category': 'Electronics',
                'brand': 'Microsoft',
                'tags': ['Wireless', 'Premium'],
                'stock_quantity': 35,
                'is_featured': False,
            },
            {
                'title': 'HP LaserJet Pro Printer',
                'description': 'Fast and reliable wireless laser printer for home and office',
                'price': Decimal('199.99'),
                'category': 'Electronics',
                'brand': 'HP',
                'tags': ['Wireless', 'Eco-Friendly'],
                'stock_quantity': 60,
                'is_featured': False,
            },
            {
                'title': 'Garden Tool Set',
                'description': 'Complete set of gardening tools for home garden maintenance',
                'price': Decimal('89.99'),
                'category': 'Home & Garden',
                'brand': None,
                'tags': ['Eco-Friendly'],
                'stock_quantity': 45,
                'is_featured': False,
            },
            {
                'title': 'Yoga Mat Premium',
                'description': 'Non-slip yoga mat with carrying strap and alignment lines',
                'price': Decimal('49.99'),
                'category': 'Sports',
                'brand': None,
                'tags': ['Eco-Friendly', 'Premium'],
                'stock_quantity': 90,
                'is_featured': False,
            },
            {
                'title': 'Programming Book Collection',
                'description': 'Complete set of programming books covering Python, JavaScript, and more',
                'price': Decimal('149.99'),
                'category': 'Books',
                'brand': None,
                'tags': ['Best Seller'],
                'stock_quantity': 40,
                'is_featured': False,
            },
            {
                'title': 'Skincare Routine Set',
                'description': 'Complete skincare routine with cleanser, toner, and moisturizer',
                'price': Decimal('79.99'),
                'category': 'Beauty',
                'brand': None,
                'tags': ['Eco-Friendly', 'Premium'],
                'stock_quantity': 70,
                'is_featured': False,
            },
            {
                'title': 'LEGO Creator Set',
                'description': 'Build and rebuild three different models with this creative set',
                'price': Decimal('39.99'),
                'category': 'Toys',
                'brand': None,
                'tags': ['Best Seller'],
                'stock_quantity': 120,
                'is_featured': False,
            },
        ]
        
        created_products = []
        for product_data in products_data:
            # Get category and brand
            category = next(cat for cat in categories if cat.name == product_data['category'])
            brand = next((b for b in brands if b.name == product_data['brand']), None) if product_data['brand'] else None
            
            # Create product
            product, created = Product.objects.get_or_create(
                title=product_data['title'],
                defaults={
                    'description': product_data['description'],
                    'price': product_data['price'],
                    'category': category,
                    'brand': brand,
                    'stock_quantity': product_data['stock_quantity'],
                    'is_featured': product_data['is_featured'],
                    'status': 'approved',
                    'seller': user,
                }
            )
            
            if created:
                # Add tags
                product_tags = [tag for tag in tags if tag.name in product_data['tags']]
                product.tags.set(product_tags)
                
                # Add some random reviews
                for i in range(random.randint(3, 8)):
                    ProductReview.objects.get_or_create(
                        product=product,
                        user=user,
                        defaults={
                            'rating': random.randint(3, 5),
                            'title': f'Great {product.title}!',
                            'comment': f'I really love this {product.title.lower()}. Highly recommended!',
                            'is_verified_purchase': random.choice([True, False]),
                        }
                    )
                
                created_products.append(product)
                self.stdout.write(f'Created product: {product.title}')
        
        # Add some products with discounts
        discount_products = [
            {
                'title': 'iPhone 14 (Refurbished)',
                'description': 'Certified refurbished iPhone 14 in excellent condition',
                'price': Decimal('699.99'),
                'discount_percentage': Decimal('20.00'),
                'discount_start_date': datetime.now(),
                'discount_end_date': datetime.now() + timedelta(days=30),
                'category': 'Electronics',
                'brand': 'Apple',
                'tags': ['Sale', 'Limited Edition'],
                'stock_quantity': 15,
                'is_featured': True,
            },
            {
                'title': 'Samsung Galaxy Buds Pro',
                'description': 'Wireless earbuds with active noise cancellation',
                'price': Decimal('199.99'),
                'discount_percentage': Decimal('25.00'),
                'discount_start_date': datetime.now(),
                'discount_end_date': datetime.now() + timedelta(days=15),
                'category': 'Electronics',
                'brand': 'Samsung',
                'tags': ['Sale', 'Wireless'],
                'stock_quantity': 50,
                'is_featured': False,
            },
        ]
        
        for product_data in discount_products:
            category = next(cat for cat in categories if cat.name == product_data['category'])
            brand = next((b for b in brands if b.name == product_data['brand']), None) if product_data['brand'] else None
            
            product, created = Product.objects.get_or_create(
                title=product_data['title'],
                defaults={
                    'description': product_data['description'],
                    'price': product_data['price'],
                    'discount_percentage': product_data['discount_percentage'],
                    'discount_start_date': product_data['discount_start_date'],
                    'discount_end_date': product_data['discount_end_date'],
                    'category': category,
                    'brand': brand,
                    'stock_quantity': product_data['stock_quantity'],
                    'is_featured': product_data['is_featured'],
                    'status': 'approved',
                    'seller': user,
                }
            )
            
            if created:
                product_tags = [tag for tag in tags if tag.name in product_data['tags']]
                product.tags.set(product_tags)
                created_products.append(product)
                self.stdout.write(f'Created discounted product: {product.title}')
        
        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully populated database with {len(categories)} categories, '
                f'{len(brands)} brands, {len(tags)} tags, and {len(created_products)} products!'
            )
        )
