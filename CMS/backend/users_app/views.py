from django.contrib.auth import get_user_model
from rest_framework import generics, permissions, status
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.decorators import api_view, permission_classes

from .models import Teacher, Class, Student, Subject, Attendance
from .serializers import (
    RegisterSerializer,
    UserSerializer,
    CustomTokenObtainPairSerializer,
    TeacherSerializer,
    ClassSerializer,
    StudentSerializer,
    SubjectSerializer,
    AttendanceSerializer,
)

User = get_user_model()


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer


class LoginView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)


class TeacherListCreateView(generics.ListCreateAPIView):
    queryset = Teacher.objects.all()
    serializer_class = TeacherSerializer
    permission_classes = [permissions.IsAdminUser]


class TeacherDetailView(generics.RetrieveDestroyAPIView):
    queryset = Teacher.objects.all()
    serializer_class = TeacherSerializer
    permission_classes = [permissions.IsAdminUser]


class ClassListCreateView(generics.ListCreateAPIView):
    queryset = Class.objects.all()
    serializer_class = ClassSerializer
    permission_classes = [permissions.IsAdminUser]


class ClassDetailView(generics.RetrieveDestroyAPIView):
    queryset = Class.objects.all()
    serializer_class = ClassSerializer
    permission_classes = [permissions.IsAdminUser]


class StudentListCreateView(generics.ListCreateAPIView):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    permission_classes = [permissions.IsAdminUser]


class StudentDetailView(generics.RetrieveDestroyAPIView):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    permission_classes = [permissions.IsAdminUser]


class SubjectListCreateView(generics.ListCreateAPIView):
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer
    permission_classes = [permissions.IsAdminUser]


class SubjectDetailView(generics.RetrieveDestroyAPIView):
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer
    permission_classes = [permissions.IsAdminUser]


class AttendanceListCreateView(generics.ListCreateAPIView):
    serializer_class = AttendanceSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAdminUser()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user
        if user.is_admin:
            return Attendance.objects.all().select_related('student', 'subject')
        if user.is_teacher:
            return Attendance.objects.filter(subject__teacher__user=user).select_related('student', 'subject')
        if user.is_student:
            try:
                student = user.student_profile
                return Attendance.objects.filter(student=student).select_related('student', 'subject')
            except Student.DoesNotExist:
                return Attendance.objects.none()
        return Attendance.objects.none()


class AttendanceDetailView(generics.RetrieveDestroyAPIView):
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializer
    permission_classes = [permissions.IsAdminUser]


class MyAttendanceView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        if not user.is_student:
            return Response({"detail": "Only students can view their attendance."}, status=403)
        
        try:
            student = user.student_profile
        except Student.DoesNotExist:
            return Response({"detail": "Student profile not found."}, status=404)
        
        attendance = Attendance.objects.filter(student=student).select_related('subject')
        serializer = AttendanceSerializer(attendance, many=True)
        return Response(serializer.data)


class TeacherStudentsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        if not user.is_teacher:
            return Response({"detail": "Only teachers can view their students."}, status=403)
        
        try:
            teacher = user.teacher_profile
        except Teacher.DoesNotExist:
            return Response({"detail": "Teacher profile not found."}, status=404)
        
        students = Student.objects.filter(class_obj__in=Class.objects.all())
        serializer = StudentSerializer(students, many=True)
        return Response(serializer.data)


class PendingUserListView(generics.ListAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAdminUser]

    def get_queryset(self):
        return User.objects.filter(is_approved=False, is_superuser=False)


class ApproveUserView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def post(self, request, pk):
        try:
            user = User.objects.get(pk=pk)
            user.is_approved = True
            user.save()
            return Response({"detail": "User approved."})
        except User.DoesNotExist:
            return Response({"detail": "User not found."}, status=404)


class RejectUserView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def post(self, request, pk):
        try:
            user = User.objects.get(pk=pk)
            user.delete()
            return Response({"detail": "User rejected and removed."})
        except User.DoesNotExist:
            return Response({"detail": "User not found."}, status=404)
