from rest_framework import serializers
from products.serializers import ProductListSerializer
from .models import Cart, CartItem


class CartItemSerializer(serializers.ModelSerializer):
    """Serializer for CartItem model"""
    product = ProductListSerializer(read_only=True)
    total_price = serializers.ReadOnlyField()
    
    class Meta:
        model = CartItem
        fields = ['id', 'product', 'quantity', 'total_price', 'created_at', 'updated_at']


class CartSerializer(serializers.ModelSerializer):
    """Serializer for Cart model"""
    items = CartItemSerializer(many=True, read_only=True)
    total_items = serializers.ReadOnlyField()
    total_price = serializers.ReadOnlyField()
    
    class Meta:
        model = Cart
        fields = ['id', 'items', 'total_items', 'total_price', 'created_at', 'updated_at']


class CartItemCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer for creating and updating cart items"""
    class Meta:
        model = CartItem
        fields = ['product', 'quantity']
    
    def validate_quantity(self, value):
        """Validate quantity against product stock"""
        if value <= 0:
            raise serializers.ValidationError("Quantity must be greater than 0")
        return value
    
    def validate(self, attrs):
        """Validate cart item"""
        product = attrs['product']
        quantity = attrs['quantity']
        
        if quantity > product.stock_quantity:
            raise serializers.ValidationError(
                f"Only {product.stock_quantity} items available in stock"
            )
        
        if not product.is_active or product.status != 'approved':
            raise serializers.ValidationError("Product is not available for purchase")
        
        return attrs





