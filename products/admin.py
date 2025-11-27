from django.contrib import admin
from .models import Category, Brand, Tag, Product, ProductImage, ProductReview, Wishlist


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'is_active', 'created_at')
    list_filter = ('is_active', 'created_at')
    search_fields = ('name', 'description')
    ordering = ('name',)


@admin.register(Brand)
class BrandAdmin(admin.ModelAdmin):
    list_display = ('name', 'is_active', 'created_at')
    list_filter = ('is_active', 'created_at')
    search_fields = ('name', 'description')
    ordering = ('name',)


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ('name', 'color', 'created_at')
    search_fields = ('name',)
    ordering = ('name',)


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('title', 'seller', 'category', 'brand', 'price', 'stock_quantity', 
                   'status', 'is_featured', 'is_active', 'created_at')
    list_filter = ('status', 'is_featured', 'is_active', 'category', 'brand', 'created_at')
    search_fields = ('title', 'description', 'seller__email', 'seller__first_name')
    ordering = ('-created_at',)
    inlines = [ProductImageInline]
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'description', 'category', 'brand', 'tags')
        }),
        ('Pricing & Stock', {
            'fields': ('price', 'stock_quantity', 'discount_percentage', 
                      'discount_start_date', 'discount_end_date')
        }),
        ('Status & Settings', {
            'fields': ('seller', 'status', 'is_featured', 'is_active')
        }),
    )


@admin.register(ProductImage)
class ProductImageAdmin(admin.ModelAdmin):
    list_display = ('product', 'is_primary', 'alt_text', 'created_at')
    list_filter = ('is_primary', 'created_at')
    search_fields = ('product__title', 'alt_text')


@admin.register(ProductReview)
class ProductReviewAdmin(admin.ModelAdmin):
    list_display = ('product', 'user', 'rating', 'title', 'is_approved', 'created_at')
    list_filter = ('rating', 'is_approved', 'is_verified_purchase', 'created_at')
    search_fields = ('product__title', 'user__email', 'user__first_name', 'title')
    ordering = ('-created_at',)


@admin.register(Wishlist)
class WishlistAdmin(admin.ModelAdmin):
    list_display = ('user', 'product', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('user__email', 'user__first_name', 'product__title')
    ordering = ('-created_at',)





