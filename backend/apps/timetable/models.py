from django.db import models
from apps.users.models import User
from apps.students.models import Class
from apps.subjects.models import Subject

class TimetableEntry(models.Model):
    MONDAY = 1
    TUESDAY = 2
    WEDNESDAY = 3
    THURSDAY = 4
    FRIDAY = 5
    SATURDAY = 6
    SUNDAY = 7
    
    DAY_CHOICES = [
        (MONDAY, 'Monday'),
        (TUESDAY, 'Tuesday'),
        (WEDNESDAY, 'Wednesday'),
        (THURSDAY, 'Thursday'),
        (FRIDAY, 'Friday'),
        (SATURDAY, 'Saturday'),
        (SUNDAY, 'Sunday'),
    ]
    
    klass = models.ForeignKey(Class, on_delete=models.CASCADE, related_name='timetable_entries')
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name='timetable_entries')
    teacher = models.ForeignKey(User, on_delete=models.CASCADE, related_name='timetable_entries')
    room = models.CharField(max_length=50)
    day_of_week = models.PositiveIntegerField(choices=DAY_CHOICES)
    start_time = models.TimeField()
    end_time = models.TimeField()
    
    class Meta:
        ordering = ['day_of_week', 'start_time']
        indexes = [
            models.Index(fields=['day_of_week', 'start_time']),
            models.Index(fields=['teacher', 'day_of_week']),
            models.Index(fields=['klass', 'day_of_week']),
        ]
    
    def __str__(self):
        return f"{self.klass} - {self.subject} - {self.get_day_of_week_display()}"
    
    def get_conflict_type(self, room=None, teacher=None):
        from .models import TimetableEntry
        overlaps = TimetableEntry.objects.filter(
            day_of_week=self.day_of_week,
            start_time__lt=self.end_time,
            end_time__gt=self.start_time
        ).exclude(pk=self.pk)
        
        if room and overlaps.filter(room=room).exists():
            return 'room'
        if teacher and overlaps.filter(teacher=teacher).exists():
            return 'teacher'
        return None


class ExamEntry(models.Model):
    MIDTERM = 1
    FINAL = 2
    QUIZ = 3
    PRACTICAL = 4
    
    EXAM_TYPE_CHOICES = [
        (MIDTERM, 'Midterm'),
        (FINAL, 'Final'),
        (QUIZ, 'Quiz'),
        (PRACTICAL, 'Practical'),
    ]
    
    klass = models.ForeignKey(Class, on_delete=models.CASCADE, related_name='exam_entries')
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name='exam_entries')
    teacher = models.ForeignKey(User, on_delete=models.CASCADE, related_name='exam_entries')
    room = models.CharField(max_length=50)
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    exam_type = models.PositiveIntegerField(choices=EXAM_TYPE_CHOICES)
    
    class Meta:
        ordering = ['date', 'start_time']
        indexes = [
            models.Index(fields=['date', 'start_time']),
            models.Index(fields=['klass', 'date']),
        ]
    
    def __str__(self):
        return f"{self.get_exam_type_display()} - {self.subject} - {self.date}"