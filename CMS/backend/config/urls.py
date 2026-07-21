from django.contrib import admin
from django.urls import path, include

from users_app.views import ProfileView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/users/', include('users_app.urls')),
    path('api/auth/', include('users_app.urls')),
    path('api/users/me/', ProfileView.as_view(), name='current_user'),
]
