from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Category, Brand, Tag, Product, ProductImage, ProductReview, Wishlist

User = get_user_model()


class CategorySerializer(serializers.ModelSerializer):
    """Serializer for Category model"""
    class Meta:
        model = Category
        fields = ['id', 'name', 'description', 'image', 'is_active', 'created_at']


class BrandSerializer(serializers.ModelSerializer):
    """Serializer for Brand model"""
    class Meta:
        model = Brand
        fields = ['id', 'name', 'description', 'logo', 'is_active', 'created_at']


class TagSerializer(serializers.ModelSerializer):
    """Serializer for Tag model"""
    class Meta:
        model = Tag
        fields = ['id', 'name', 'color', 'created_at']


class ProductImageSerializer(serializers.ModelSerializer):
    """Serializer for ProductImage model"""
    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'is_primary', 'alt_text', 'created_at']


class ProductReviewSerializer(serializers.ModelSerializer):
    """Serializer for ProductReview model"""
    user_name = serializers.CharField(source='user.first_name', read_only=True)
    user_last_name = serializers.CharField(source='user.last_name', read_only=True)
    
    class Meta:
        model = ProductReview
        fields = ['id', 'user', 'user_name', 'user_last_name', 'rating', 'title', 
                 'comment', 'is_verified_purchase', 'created_at', 'updated_at']
        read_only_fields = ['user', 'is_verified_purchase']


class ProductSerializer(serializers.ModelSerializer):
    """Serializer for Product model"""
    images = ProductImageSerializer(many=True, read_only=True)
    reviews = ProductReviewSerializer(many=True, read_only=True)
    seller_name = serializers.CharField(source='seller.first_name', read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    brand_name = serializers.CharField(source='brand.name', read_only=True)
    tags_data = TagSerializer(source='tags', many=True, read_only=True)
    discounted_price = serializers.ReadOnlyField()
    is_discount_active = serializers.ReadOnlyField()
    average_rating = serializers.SerializerMethodField()
    review_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Product
        fields = ['id', 'title', 'description', 'price', 'discounted_price', 'stock_quantity',
                 'category', 'category_name', 'brand', 'brand_name', 'seller', 'seller_name',
                 'tags', 'tags_data', 'discount_percentage', 'discount_start_date', 
                 'discount_end_date', 'is_discount_active', 'status', 'is_featured', 
                 'is_active', 'images', 'reviews', 'average_rating', 'review_count',
                 'created_at', 'updated_at']
        read_only_fields = ['seller', 'status']
    
    def get_average_rating(self, obj):
        """Calculate average rating from reviews"""
        reviews = obj.reviews.filter(is_approved=True)
        if reviews.exists():
            return round(sum(review.rating for review in reviews) / reviews.count(), 1)
        return 0
    
    def get_review_count(self, obj):
        """Get count of approved reviews"""
        return obj.reviews.filter(is_approved=True).count()


class ProductListSerializer(serializers.ModelSerializer):
    """Simplified serializer for product listings"""
    primary_image = serializers.SerializerMethodField()
    discounted_price = serializers.ReadOnlyField()
    is_discount_active = serializers.ReadOnlyField()
    average_rating = serializers.SerializerMethodField()
    review_count = serializers.SerializerMethodField()
    category_name = serializers.CharField(source='category.name', read_only=True)
    brand_name = serializers.CharField(source='brand.name', read_only=True)
    
    class Meta:
        model = Product
        fields = ['id', 'title', 'price', 'discounted_price', 'is_discount_active',
                 'stock_quantity', 'category_name', 'brand_name', 'primary_image', 
                 'average_rating', 'review_count', 'is_featured', 'created_at']
    
    def get_primary_image(self, obj):
        """Get primary product image"""
        primary_img = obj.images.filter(is_primary=True).first()
        if primary_img:
            return ProductImageSerializer(primary_img).data
        # Return first image if no primary image
        first_img = obj.images.first()
        if first_img:
            return ProductImageSerializer(first_img).data
        return None
    
    def get_average_rating(self, obj):
        """Calculate average rating from reviews"""
        reviews = obj.reviews.filter(is_approved=True)
        if reviews.exists():
            return round(sum(review.rating for review in reviews) / reviews.count(), 1)
        return 0
    
    def get_review_count(self, obj):
        """Get count of approved reviews"""
        return obj.reviews.filter(is_approved=True).count()


class ProductCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer for creating and updating products"""
    images = ProductImageSerializer(many=True, required=False)
    
    class Meta:
        model = Product
        fields = ['title', 'description', 'price', 'stock_quantity', 'category', 'brand',
                 'tags', 'discount_percentage', 'discount_start_date', 'discount_end_date',
                 'is_featured', 'images']
    
    def create(self, validated_data):
        images_data = validated_data.pop('images', [])
        product = Product.objects.create(**validated_data)
        
        for image_data in images_data:
            ProductImage.objects.create(product=product, **image_data)
        
        return product
    
    def update(self, instance, validated_data):
        images_data = validated_data.pop('images', [])
        
        # Update product fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # Update images if provided
        if images_data:
            # Clear existing images
            instance.images.all().delete()
            # Add new images
            for image_data in images_data:
                ProductImage.objects.create(product=instance, **image_data)
        
        return instance


class WishlistSerializer(serializers.ModelSerializer):
    """Serializer for Wishlist model"""
    product = ProductListSerializer(read_only=True)
    
    class Meta:
        model = Wishlist
        fields = ['id', 'product', 'created_at']


class WishlistCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating wishlist items"""
    class Meta:
        model = Wishlist
        fields = ['product']
    
    def create(self, validated_data):
        user = self.context['request'].user
        product = validated_data['product']
        
        # Check if item already exists in wishlist
        if Wishlist.objects.filter(user=user, product=product).exists():
            raise serializers.ValidationError("Product already in wishlist")
        
        return Wishlist.objects.create(user=user, **validated_data)





