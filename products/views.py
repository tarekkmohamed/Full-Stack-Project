from rest_framework import generics, status, permissions, filters
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q, Avg, Count
from .models import Category, Brand, Tag, Product, ProductImage, ProductReview, Wishlist
from .serializers import (
    CategorySerializer, BrandSerializer, TagSerializer, ProductSerializer,
    ProductListSerializer, ProductCreateUpdateSerializer, ProductReviewSerializer,
    WishlistSerializer, WishlistCreateSerializer
)


class CategoryListCreateView(generics.ListCreateAPIView):
    """List and create categories"""
    queryset = Category.objects.filter(is_active=True)
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'created_at']
    ordering = ['name']


class CategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update, or delete a category"""
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class BrandListCreateView(generics.ListCreateAPIView):
    """List and create brands"""
    queryset = Brand.objects.filter(is_active=True)
    serializer_class = BrandSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'created_at']
    ordering = ['name']


class BrandDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update, or delete a brand"""
    queryset = Brand.objects.all()
    serializer_class = BrandSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class TagListCreateView(generics.ListCreateAPIView):
    """List and create tags"""
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name']
    ordering_fields = ['name', 'created_at']
    ordering = ['name']


class ProductListCreateView(generics.ListCreateAPIView):
    """List and create products"""
    queryset = Product.objects.filter(is_active=True, status='approved')
    serializer_class = ProductListSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'brand', 'tags', 'is_featured']
    search_fields = ['title', 'description', 'brand__name', 'tags__name']
    ordering_fields = ['price', 'created_at', 'title']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return ProductCreateUpdateSerializer
        return ProductListSerializer
    
    def perform_create(self, serializer):
        serializer.save(seller=self.request.user)


class ProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update, or delete a product"""
    queryset = Product.objects.all()
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return ProductCreateUpdateSerializer
        return ProductSerializer


class ProductSearchView(generics.ListAPIView):
    """Advanced product search"""
    serializer_class = ProductListSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'brand', 'tags']
    search_fields = ['title', 'description', 'brand__name', 'tags__name']
    ordering_fields = ['price', 'created_at', 'title']
    ordering = ['-created_at']
    
    def get_queryset(self):
        queryset = Product.objects.filter(is_active=True, status='approved')
        
        # Price range filter
        min_price = self.request.query_params.get('min_price')
        max_price = self.request.query_params.get('max_price')
        
        if min_price:
            queryset = queryset.filter(price__gte=min_price)
        if max_price:
            queryset = queryset.filter(price__lte=max_price)
        
        # Rating filter
        min_rating = self.request.query_params.get('min_rating')
        if min_rating:
            queryset = queryset.annotate(
                avg_rating=Avg('reviews__rating', filter=Q(reviews__is_approved=True))
            ).filter(avg_rating__gte=min_rating)
        
        return queryset


class FeaturedProductsView(generics.ListAPIView):
    """Get featured products"""
    queryset = Product.objects.filter(is_active=True, status='approved', is_featured=True)
    serializer_class = ProductListSerializer
    permission_classes = [permissions.AllowAny]
    ordering = ['-created_at']


class ProductReviewListCreateView(generics.ListCreateAPIView):
    """List and create product reviews"""
    serializer_class = ProductReviewSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        product_id = self.kwargs['product_id']
        return ProductReview.objects.filter(product_id=product_id, is_approved=True)
    
    def perform_create(self, serializer):
        product_id = self.kwargs['product_id']
        product = Product.objects.get(id=product_id)
        serializer.save(user=self.request.user, product=product)


class WishlistListCreateView(generics.ListCreateAPIView):
    """List and create wishlist items"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return WishlistCreateSerializer
        return WishlistSerializer
    
    def get_queryset(self):
        return Wishlist.objects.filter(user=self.request.user)


class WishlistDetailView(generics.DestroyAPIView):
    """Remove item from wishlist"""
    queryset = Wishlist.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Wishlist.objects.filter(user=self.request.user)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def toggle_wishlist(request, product_id):
    """Toggle product in wishlist"""
    try:
        product = Product.objects.get(id=product_id)
        wishlist_item, created = Wishlist.objects.get_or_create(
            user=request.user,
            product=product
        )
        
        if created:
            message = "Product added to wishlist"
        else:
            wishlist_item.delete()
            message = "Product removed from wishlist"
        
        return Response({'message': message}, status=status.HTTP_200_OK)
        
    except Product.DoesNotExist:
        return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def product_stats(request, product_id):
    """Get product statistics"""
    try:
        product = Product.objects.get(id=product_id)
        
        # Calculate statistics
        reviews = product.reviews.filter(is_approved=True)
        total_reviews = reviews.count()
        average_rating = reviews.aggregate(avg_rating=Avg('rating'))['avg_rating'] or 0
        
        # Rating distribution
        rating_distribution = {}
        for rating in range(1, 6):
            count = reviews.filter(rating=rating).count()
            rating_distribution[rating] = count
        
        return Response({
            'total_reviews': total_reviews,
            'average_rating': round(average_rating, 1),
            'rating_distribution': rating_distribution
        }, status=status.HTTP_200_OK)
        
    except Product.DoesNotExist:
        return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)





