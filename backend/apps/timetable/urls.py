from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TimetableViewSet, ExamEntryViewSet, MyScheduleView

router = DefaultRouter()
router.register(r'entries', TimetableViewSet)
router.register(r'exams', ExamEntryViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('my-schedule/', MyScheduleView.as_view({'get': 'list'}), name='my-schedule'),
]