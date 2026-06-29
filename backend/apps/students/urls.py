from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ClassViewSet, StudentViewSet

router = DefaultRouter()
router.register(r'', StudentViewSet)
router.register(r'classes', ClassViewSet)

urlpatterns = [
    path('', include(router.urls)),
]