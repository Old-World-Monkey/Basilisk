from rest_framework import viewsets, permissions
from .models import TimetableEntry, ExamEntry
from .serializers import TimetableEntrySerializer, ExamEntrySerializer

class TimetableViewSet(viewsets.ModelViewSet):
    queryset = TimetableEntry.objects.select_related('klass', 'subject', 'teacher')
    serializer_class = TimetableEntrySerializer
    
    def get_queryset(self):
        user = self.request.user
        if user.is_teacher():
            return TimetableEntry.objects.filter(teacher=user)
        return TimetableEntry.objects.all()


class ExamEntryViewSet(viewsets.ModelViewSet):
    queryset = ExamEntry.objects.select_related('klass', 'subject', 'teacher')
    serializer_class = ExamEntrySerializer


class MyScheduleViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = TimetableEntrySerializer
    
    def get_queryset(self):
        return TimetableEntry.objects.filter(teacher=self.request.user).select_related('klass', 'subject')