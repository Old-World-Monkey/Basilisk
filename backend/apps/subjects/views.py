from rest_framework import viewsets
from .models import Subject
from .serializers import SubjectSerializer

class SubjectViewSet(viewsets.ModelViewSet):
    queryset = Subject.objects.select_related('teacher')
    serializer_class = SubjectSerializer
    filterset_fields = ['department', 'teacher']
    search_fields = ['name', 'code']