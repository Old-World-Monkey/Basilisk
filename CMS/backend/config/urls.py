from django.contrib import admin
from django.urls import path, include

from users.views import current_user

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('users.urls')),
    path('api/users/me/', current_user, name='current_user'),
]
