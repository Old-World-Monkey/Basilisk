"""
URL configuration for vigil project.
"""
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('apps.users.urls')),
    path('api/timetable/', include('apps.timetable.urls')),
    path('api/students/', include('apps.students.urls')),
    path('api/subjects/', include('apps.subjects.urls')),
]