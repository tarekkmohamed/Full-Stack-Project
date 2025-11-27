from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register, name='register'),
    path('login/', views.login, name='login'),
    path('verify-email/<uuid:token>/', views.verify_email, name='verify_email'),
    path('password-reset-request/', views.password_reset_request, name='password_reset_request'),
    path('password-reset-confirm/', views.password_reset_confirm, name='password_reset_confirm'),
    path('profile/', views.UserProfileView.as_view(), name='user_profile'),
    path('change-password/', views.change_password, name='change_password'),
    path('user-info/', views.user_info, name='user_info'),
]

