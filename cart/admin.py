from django.contrib import admin
from .models import Cart, CartItem


@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'session_key', 'total_items', 'total_price', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('user__email', 'session_key')
    ordering = ('-created_at',)
    
    def total_items(self, obj):
        return obj.total_items
    total_items.short_description = 'Total Items'
    
    def total_price(self, obj):
        return f"${obj.total_price:.2f}"
    total_price.short_description = 'Total Price'


@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = ('cart', 'product', 'quantity', 'total_price', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('cart__user__email', 'product__title')
    ordering = ('-created_at',)
    
    def total_price(self, obj):
        return f"${obj.total_price:.2f}"
    total_price.short_description = 'Total Price'





