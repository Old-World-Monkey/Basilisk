from django.urls import path
from .views import RegisterView, CustomTokenObtainPairView, CustomTokenRefreshView, UserProfileView
from rest_framework_simplejwt.views import TokenBlacklistView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', CustomTokenObtainPairView.as_view(), name='login'),
    path('token/refresh/', CustomTokenRefreshView.as_view(), name='token_refresh'),
    path('logout/', TokenBlacklistView.as_view(), name='logout'),
    path('profile/', UserProfileView.as_view(), name='profile'),
]