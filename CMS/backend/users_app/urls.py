from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    RegisterView,
    LoginView,
    ProfileView,
    TeacherListCreateView,
    TeacherDetailView,
    ClassListCreateView,
    ClassDetailView,
    SubjectListCreateView,
    SubjectDetailView,
)

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", LoginView.as_view(), name="login"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("profile/", ProfileView.as_view(), name="profile"),
    path("teachers/", TeacherListCreateView.as_view(), name="teacher-list"),
    path("teachers/<int:pk>/", TeacherDetailView.as_view(), name="teacher-detail"),
    path("classes/", ClassListCreateView.as_view(), name="class-list"),
    path("classes/<int:pk>/", ClassDetailView.as_view(), name="class-detail"),
    path("subjects/", SubjectListCreateView.as_view(), name="subject-list"),
    path("subjects/<int:pk>/", SubjectDetailView.as_view(), name="subject-detail"),
]
