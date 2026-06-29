from rest_framework import viewsets
from .models import Class, Student
from .serializers import ClassSerializer, StudentSerializer

class ClassViewSet(viewsets.ModelViewSet):
    queryset = Class.objects.all()
    serializer_class = ClassSerializer


class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.select_related('klass')
    serializer_class = StudentSerializer
    filterset_fields = ['klass', 'department', 'year', 'section']
    search_fields = ['name', 'roll_number']