from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.db.models import Q, Sum, Count
from django.utils import timezone
from .models import Order, OrderItem, OrderStatusHistory, ShippingAddress
from .serializers import (
    OrderSerializer, OrderListSerializer, OrderCreateSerializer,
    OrderStatusUpdateSerializer, ShippingAddressSerializer
)


class OrderListCreateView(generics.ListCreateAPIView):
    """List and create orders"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return OrderCreateSerializer
        return OrderListSerializer
    
    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save()


class OrderDetailView(generics.RetrieveAPIView):
    """Retrieve order details"""
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)


class OrderStatusUpdateView(generics.UpdateAPIView):
    """Update order status (for sellers and admins)"""
    serializer_class = OrderStatusUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        # Sellers can only update orders for their products
        if self.request.user.is_seller:
            return Order.objects.filter(items__product__seller=self.request.user).distinct()
        # Admins can update any order
        elif self.request.user.is_staff:
            return Order.objects.all()
        else:
            return Order.objects.none()
    
    def perform_update(self, serializer):
        order = self.get_object()
        old_status = order.status
        new_status = serializer.validated_data['status']
        note = serializer.validated_data.get('note', '')
        
        # Update order status
        order.status = new_status
        order.save()
        
        # Create status history entry
        OrderStatusHistory.objects.create(
            order=order,
            status=new_status,
            note=note,
            updated_by=self.request.user
        )
        
        # Update timestamps based on status
        if new_status == 'shipped' and not order.shipped_at:
            order.shipped_at = timezone.now()
            order.save()
        elif new_status == 'delivered' and not order.delivered_at:
            order.delivered_at = timezone.now()
            order.save()


class ShippingAddressListCreateView(generics.ListCreateAPIView):
    """List and create shipping addresses"""
    serializer_class = ShippingAddressSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return ShippingAddress.objects.filter(user=self.request.user)


class ShippingAddressDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update, or delete shipping address"""
    serializer_class = ShippingAddressSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return ShippingAddress.objects.filter(user=self.request.user)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def order_stats(request):
    """Get order statistics for user"""
    user = request.user
    
    # Basic stats
    total_orders = Order.objects.filter(user=user).count()
    pending_orders = Order.objects.filter(user=user, status='pending').count()
    processing_orders = Order.objects.filter(user=user, status='processing').count()
    shipped_orders = Order.objects.filter(user=user, status='shipped').count()
    delivered_orders = Order.objects.filter(user=user, status='delivered').count()
    
    # Total spent
    total_spent = Order.objects.filter(
        user=user, 
        payment_status='paid'
    ).aggregate(total=Sum('total_amount'))['total'] or 0
    
    return Response({
        'total_orders': total_orders,
        'pending_orders': pending_orders,
        'processing_orders': processing_orders,
        'shipped_orders': shipped_orders,
        'delivered_orders': delivered_orders,
        'total_spent': float(total_spent)
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def seller_stats(request):
    """Get seller statistics"""
    if not request.user.is_seller:
        return Response({'error': 'Access denied'}, status=status.HTTP_403_FORBIDDEN)
    
    # Orders for seller's products
    seller_orders = Order.objects.filter(items__product__seller=request.user).distinct()
    
    # Basic stats
    total_orders = seller_orders.count()
    pending_orders = seller_orders.filter(status='pending').count()
    processing_orders = seller_orders.filter(status='processing').count()
    shipped_orders = seller_orders.filter(status='shipped').count()
    delivered_orders = seller_orders.filter(status='delivered').count()
    
    # Revenue
    total_revenue = seller_orders.filter(
        payment_status='paid'
    ).aggregate(total=Sum('total_amount'))['total'] or 0
    
    # Products sold
    products_sold = OrderItem.objects.filter(
        product__seller=request.user,
        order__payment_status='paid'
    ).aggregate(total=Sum('quantity'))['total'] or 0
    
    return Response({
        'total_orders': total_orders,
        'pending_orders': pending_orders,
        'processing_orders': processing_orders,
        'shipped_orders': shipped_orders,
        'delivered_orders': delivered_orders,
        'total_revenue': float(total_revenue),
        'products_sold': products_sold
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def admin_stats(request):
    """Get admin statistics"""
    if not request.user.is_staff:
        return Response({'error': 'Access denied'}, status=status.HTTP_403_FORBIDDEN)
    
    # All orders
    all_orders = Order.objects.all()
    
    # Basic stats
    total_orders = all_orders.count()
    pending_orders = all_orders.filter(status='pending').count()
    processing_orders = all_orders.filter(status='processing').count()
    shipped_orders = all_orders.filter(status='shipped').count()
    delivered_orders = all_orders.filter(status='delivered').count()
    cancelled_orders = all_orders.filter(status='cancelled').count()
    
    # Revenue
    total_revenue = all_orders.filter(
        payment_status='paid'
    ).aggregate(total=Sum('total_amount'))['total'] or 0
    
    # Recent orders (last 30 days)
    from datetime import timedelta
    thirty_days_ago = timezone.now() - timedelta(days=30)
    recent_orders = all_orders.filter(created_at__gte=thirty_days_ago).count()
    
    return Response({
        'total_orders': total_orders,
        'pending_orders': pending_orders,
        'processing_orders': processing_orders,
        'shipped_orders': shipped_orders,
        'delivered_orders': delivered_orders,
        'cancelled_orders': cancelled_orders,
        'total_revenue': float(total_revenue),
        'recent_orders': recent_orders
    }, status=status.HTTP_200_OK)





