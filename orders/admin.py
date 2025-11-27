from django.contrib import admin
from .models import Order, OrderItem, OrderStatusHistory, ShippingAddress


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ('total_price',)


class OrderStatusHistoryInline(admin.TabularInline):
    model = OrderStatusHistory
    extra = 0
    readonly_fields = ('created_at',)


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('order_number', 'user', 'status', 'payment_status', 'total_amount', 'created_at')
    list_filter = ('status', 'payment_status', 'created_at')
    search_fields = ('order_number', 'user__email', 'user__first_name', 'user__last_name')
    ordering = ('-created_at',)
    inlines = [OrderItemInline, OrderStatusHistoryInline]
    
    fieldsets = (
        ('Order Information', {
            'fields': ('order_number', 'user', 'status', 'payment_status')
        }),
        ('Pricing', {
            'fields': ('subtotal', 'shipping_cost', 'tax_amount', 'total_amount')
        }),
        ('Shipping Information', {
            'fields': ('shipping_first_name', 'shipping_last_name', 'shipping_email', 'shipping_phone',
                      'shipping_address', 'shipping_city', 'shipping_state', 'shipping_country', 'shipping_zip_code')
        }),
        ('Billing Information', {
            'fields': ('billing_first_name', 'billing_last_name', 'billing_email', 'billing_phone',
                      'billing_address', 'billing_city', 'billing_state', 'billing_country', 'billing_zip_code'),
            'classes': ('collapse',)
        }),
        ('Payment Information', {
            'fields': ('payment_method', 'payment_reference'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at', 'shipped_at', 'delivered_at'),
            'classes': ('collapse',)
        }),
    )
    readonly_fields = ('order_number', 'created_at', 'updated_at', 'shipped_at', 'delivered_at')


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ('order', 'product', 'quantity', 'unit_price', 'total_price')
    list_filter = ('order__created_at',)
    search_fields = ('order__order_number', 'product__title')
    ordering = ('-order__created_at',)


@admin.register(OrderStatusHistory)
class OrderStatusHistoryAdmin(admin.ModelAdmin):
    list_display = ('order', 'status', 'updated_by', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('order__order_number', 'updated_by__email')
    ordering = ('-created_at',)


@admin.register(ShippingAddress)
class ShippingAddressAdmin(admin.ModelAdmin):
    list_display = ('user', 'first_name', 'last_name', 'city', 'country', 'is_default', 'created_at')
    list_filter = ('is_default', 'country', 'created_at')
    search_fields = ('user__email', 'first_name', 'last_name', 'city', 'country')
    ordering = ('-created_at',)


