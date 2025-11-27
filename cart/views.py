from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from .models import Cart, CartItem
from .serializers import CartSerializer, CartItemSerializer, CartItemCreateUpdateSerializer

User = get_user_model()


def get_or_create_cart(request):
    """Get or create cart for user or guest"""
    if request.user.is_authenticated:
        cart, created = Cart.objects.get_or_create(user=request.user)
    else:
        session_key = request.session.session_key
        if not session_key:
            request.session.create()
            session_key = request.session.session_key
        cart, created = Cart.objects.get_or_create(session_key=session_key)
    
    return cart


class CartView(generics.RetrieveAPIView):
    """Get current user's cart"""
    serializer_class = CartSerializer
    permission_classes = [permissions.AllowAny]
    
    def get_object(self):
        return get_or_create_cart(self.request)


class CartItemCreateView(generics.CreateAPIView):
    """Add item to cart"""
    serializer_class = CartItemCreateUpdateSerializer
    permission_classes = [permissions.AllowAny]
    
    def perform_create(self, serializer):
        cart = get_or_create_cart(self.request)
        product = serializer.validated_data['product']
        quantity = serializer.validated_data['quantity']
        
        # Check if item already exists in cart
        cart_item, created = CartItem.objects.get_or_create(
            cart=cart,
            product=product,
            defaults={'quantity': quantity}
        )
        
        if not created:
            # Update quantity if item already exists
            cart_item.quantity += quantity
            cart_item.save()


class CartItemUpdateView(generics.UpdateAPIView):
    """Update cart item quantity"""
    serializer_class = CartItemCreateUpdateSerializer
    permission_classes = [permissions.AllowAny]
    
    def get_queryset(self):
        cart = get_or_create_cart(self.request)
        return CartItem.objects.filter(cart=cart)


class CartItemDeleteView(generics.DestroyAPIView):
    """Remove item from cart"""
    permission_classes = [permissions.AllowAny]
    
    def get_queryset(self):
        cart = get_or_create_cart(self.request)
        return CartItem.objects.filter(cart=cart)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def add_to_cart(request):
    """Add product to cart"""
    serializer = CartItemCreateUpdateSerializer(data=request.data)
    if serializer.is_valid():
        cart = get_or_create_cart(request)
        product = serializer.validated_data['product']
        quantity = serializer.validated_data['quantity']
        
        # Check if item already exists in cart
        cart_item, created = CartItem.objects.get_or_create(
            cart=cart,
            product=product,
            defaults={'quantity': quantity}
        )
        
        if not created:
            # Update quantity if item already exists
            cart_item.quantity += quantity
            cart_item.save()
        
        return Response({
            'message': 'Item added to cart successfully',
            'cart_item': CartItemSerializer(cart_item).data
        }, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
@permission_classes([permissions.AllowAny])
def update_cart_item(request, item_id):
    """Update cart item quantity"""
    try:
        cart = get_or_create_cart(request)
        cart_item = CartItem.objects.get(id=item_id, cart=cart)
        
        serializer = CartItemCreateUpdateSerializer(cart_item, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'message': 'Cart item updated successfully',
                'cart_item': CartItemSerializer(cart_item).data
            }, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    except CartItem.DoesNotExist:
        return Response({'error': 'Cart item not found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['DELETE'])
@permission_classes([permissions.AllowAny])
def remove_from_cart(request, item_id):
    """Remove item from cart"""
    try:
        cart = get_or_create_cart(request)
        cart_item = CartItem.objects.get(id=item_id, cart=cart)
        cart_item.delete()
        
        return Response({
            'message': 'Item removed from cart successfully'
        }, status=status.HTTP_200_OK)
        
    except CartItem.DoesNotExist:
        return Response({'error': 'Cart item not found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['DELETE'])
@permission_classes([permissions.AllowAny])
def clear_cart(request):
    """Clear all items from cart"""
    cart = get_or_create_cart(request)
    cart.items.all().delete()
    
    return Response({
        'message': 'Cart cleared successfully'
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def cart_summary(request):
    """Get cart summary"""
    cart = get_or_create_cart(request)
    serializer = CartSerializer(cart)
    
    return Response(serializer.data, status=status.HTTP_200_OK)





