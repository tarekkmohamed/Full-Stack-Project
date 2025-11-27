from rest_framework import serializers
from django.contrib.auth import get_user_model
from products.serializers import ProductListSerializer
from .models import Order, OrderItem, OrderStatusHistory, ShippingAddress

User = get_user_model()


class OrderItemSerializer(serializers.ModelSerializer):
    """Serializer for OrderItem model"""
    product = ProductListSerializer(read_only=True)
    
    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'quantity', 'unit_price', 'total_price']


class OrderStatusHistorySerializer(serializers.ModelSerializer):
    """Serializer for OrderStatusHistory model"""
    updated_by_name = serializers.CharField(source='updated_by.first_name', read_only=True)
    
    class Meta:
        model = OrderStatusHistory
        fields = ['id', 'status', 'note', 'updated_by_name', 'created_at']


class OrderSerializer(serializers.ModelSerializer):
    """Serializer for Order model"""
    items = OrderItemSerializer(many=True, read_only=True)
    status_history = OrderStatusHistorySerializer(many=True, read_only=True)
    user_name = serializers.CharField(source='user.first_name', read_only=True)
    user_email = serializers.CharField(source='user.email', read_only=True)
    
    class Meta:
        model = Order
        fields = ['id', 'order_number', 'user', 'user_name', 'user_email', 'status', 
                 'payment_status', 'subtotal', 'shipping_cost', 'tax_amount', 'total_amount',
                 'shipping_first_name', 'shipping_last_name', 'shipping_email', 'shipping_phone',
                 'shipping_address', 'shipping_city', 'shipping_state', 'shipping_country', 
                 'shipping_zip_code', 'billing_first_name', 'billing_last_name', 'billing_email',
                 'billing_phone', 'billing_address', 'billing_city', 'billing_state',
                 'billing_country', 'billing_zip_code', 'payment_method', 'payment_reference',
                 'items', 'status_history', 'created_at', 'updated_at', 'shipped_at', 'delivered_at']


class OrderListSerializer(serializers.ModelSerializer):
    """Simplified serializer for order listings"""
    user_name = serializers.CharField(source='user.first_name', read_only=True)
    item_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Order
        fields = ['id', 'order_number', 'user_name', 'status', 'payment_status', 
                 'total_amount', 'item_count', 'created_at']
    
    def get_item_count(self, obj):
        return obj.items.count()


class OrderCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating orders"""
    items = serializers.ListField(write_only=True)
    
    class Meta:
        model = Order
        fields = ['shipping_first_name', 'shipping_last_name', 'shipping_email', 'shipping_phone',
                 'shipping_address', 'shipping_city', 'shipping_state', 'shipping_country',
                 'shipping_zip_code', 'billing_first_name', 'billing_last_name', 'billing_email',
                 'billing_phone', 'billing_address', 'billing_city', 'billing_state',
                 'billing_country', 'billing_zip_code', 'payment_method', 'items']
    
    def validate_items(self, value):
        """Validate order items"""
        if not value:
            raise serializers.ValidationError("Order must have at least one item")
        
        for item in value:
            if 'product_id' not in item or 'quantity' not in item:
                raise serializers.ValidationError("Each item must have product_id and quantity")
            
            if item['quantity'] <= 0:
                raise serializers.ValidationError("Quantity must be greater than 0")
        
        return value
    
    def create(self, validated_data):
        items_data = validated_data.pop('items')
        user = self.context['request'].user
        
        # Calculate totals
        subtotal = 0
        for item_data in items_data:
            from products.models import Product
            product = Product.objects.get(id=item_data['product_id'])
            subtotal += product.discounted_price * item_data['quantity']
        
        # Calculate shipping and tax (simplified)
        shipping_cost = 10.00  # Fixed shipping cost
        tax_amount = subtotal * 0.1  # 10% tax
        total_amount = subtotal + shipping_cost + tax_amount
        
        # Create order
        order = Order.objects.create(
            user=user,
            subtotal=subtotal,
            shipping_cost=shipping_cost,
            tax_amount=tax_amount,
            total_amount=total_amount,
            **validated_data
        )
        
        # Create order items
        for item_data in items_data:
            from products.models import Product
            product = Product.objects.get(id=item_data['product_id'])
            OrderItem.objects.create(
                order=order,
                product=product,
                quantity=item_data['quantity'],
                unit_price=product.discounted_price
            )
            
            # Update product stock
            product.stock_quantity -= item_data['quantity']
            product.save()
        
        # Create initial status history
        OrderStatusHistory.objects.create(
            order=order,
            status='pending',
            note='Order created'
        )
        
        return order


class ShippingAddressSerializer(serializers.ModelSerializer):
    """Serializer for ShippingAddress model"""
    class Meta:
        model = ShippingAddress
        fields = ['id', 'first_name', 'last_name', 'email', 'phone', 'address',
                 'city', 'state', 'country', 'zip_code', 'is_default', 'created_at', 'updated_at']
    
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class OrderStatusUpdateSerializer(serializers.Serializer):
    """Serializer for updating order status"""
    status = serializers.ChoiceField(choices=Order.STATUS_CHOICES)
    note = serializers.CharField(required=False, allow_blank=True)
    
    def validate_status(self, value):
        """Validate status transition"""
        order = self.context['order']
        current_status = order.status
        
        # Define valid status transitions
        valid_transitions = {
            'pending': ['processing', 'cancelled'],
            'processing': ['shipped', 'cancelled'],
            'shipped': ['delivered'],
            'delivered': ['refunded'],
            'cancelled': [],
            'refunded': []
        }
        
        if value not in valid_transitions.get(current_status, []):
            raise serializers.ValidationError(
                f"Cannot change status from {current_status} to {value}"
            )
        
        return value





