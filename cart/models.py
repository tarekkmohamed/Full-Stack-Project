from django.db import models
from django.contrib.auth import get_user_model
from products.models import Product
import uuid

User = get_user_model()


class Cart(models.Model):
    """Shopping cart model"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='carts', null=True, blank=True)
    session_key = models.CharField(max_length=100, null=True, blank=True)  # For guest users
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ['user', 'session_key']
    
    def __str__(self):
        if self.user:
            return f"Cart for {self.user.email}"
        return f"Guest cart {self.session_key}"
    
    @property
    def total_items(self):
        """Get total number of items in cart"""
        return sum(item.quantity for item in self.items.all())
    
    @property
    def total_price(self):
        """Calculate total price of all items in cart"""
        return sum(item.total_price for item in self.items.all())


class CartItem(models.Model):
    """Individual items in shopping cart"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ['cart', 'product']
    
    def __str__(self):
        return f"{self.quantity}x {self.product.title}"
    
    @property
    def total_price(self):
        """Calculate total price for this cart item"""
        return self.product.discounted_price * self.quantity
    
    def clean(self):
        """Validate cart item"""
        from django.core.exceptions import ValidationError
        
        if self.quantity > self.product.stock_quantity:
            raise ValidationError(f"Only {self.product.stock_quantity} items available in stock")
        
        if self.quantity <= 0:
            raise ValidationError("Quantity must be greater than 0")





