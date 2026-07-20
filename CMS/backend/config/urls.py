from django.contrib import admin
from django.urls import path, include

from users.views import current_user

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/users', include('users_app.urls'))
]
