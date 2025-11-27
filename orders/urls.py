from django.urls import path
from . import views

urlpatterns = [
    path('', views.OrderListCreateView.as_view(), name='order_list_create'),
    path('<uuid:pk>/', views.OrderDetailView.as_view(), name='order_detail'),
    path('<uuid:pk>/status/', views.OrderStatusUpdateView.as_view(), name='order_status_update'),
    path('stats/', views.order_stats, name='order_stats'),
    path('seller-stats/', views.seller_stats, name='seller_stats'),
    path('admin-stats/', views.admin_stats, name='admin_stats'),
    path('shipping-addresses/', views.ShippingAddressListCreateView.as_view(), name='shipping_address_list_create'),
    path('shipping-addresses/<uuid:pk>/', views.ShippingAddressDetailView.as_view(), name='shipping_address_detail'),
]





