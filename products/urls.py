from django.urls import path
from . import views

urlpatterns = [
    # Categories
    path('categories/', views.CategoryListCreateView.as_view(), name='category_list_create'),
    path('categories/<uuid:pk>/', views.CategoryDetailView.as_view(), name='category_detail'),
    
    # Brands
    path('brands/', views.BrandListCreateView.as_view(), name='brand_list_create'),
    path('brands/<uuid:pk>/', views.BrandDetailView.as_view(), name='brand_detail'),
    
    # Tags
    path('tags/', views.TagListCreateView.as_view(), name='tag_list_create'),
    
    # Products
    path('', views.ProductListCreateView.as_view(), name='product_list_create'),
    path('search/', views.ProductSearchView.as_view(), name='product_search'),
    path('featured/', views.FeaturedProductsView.as_view(), name='featured_products'),
    path('<uuid:pk>/', views.ProductDetailView.as_view(), name='product_detail'),
    path('<uuid:product_id>/stats/', views.product_stats, name='product_stats'),
    
    # Reviews
    path('<uuid:product_id>/reviews/', views.ProductReviewListCreateView.as_view(), name='product_reviews'),
    
    # Wishlist
    path('wishlist/', views.WishlistListCreateView.as_view(), name='wishlist_list_create'),
    path('wishlist/<uuid:pk>/', views.WishlistDetailView.as_view(), name='wishlist_detail'),
    path('wishlist/toggle/<uuid:product_id>/', views.toggle_wishlist, name='toggle_wishlist'),
]





