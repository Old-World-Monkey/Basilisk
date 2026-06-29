from django.db import models
from apps.users.models import User

class Class(models.Model):
    department = models.CharField(max_length=100)
    year = models.PositiveIntegerField()
    section_name = models.CharField(max_length=10)
    threshold_percent = models.PositiveIntegerField(default=75)
    
    class Meta:
        verbose_name = 'class'
        verbose_name_plural = 'classes'
        unique_together = ['department', 'year', 'section_name']
    
    def __str__(self):
        return f"{self.department} - Year {self.year} - {self.section_name}"


class Student(models.Model):
    name = models.CharField(max_length=200)
    roll_number = models.CharField(max_length=50, unique=True)
    email = models.EmailField(blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    parent_email = models.EmailField(blank=True, null=True)
    parent_phone = models.CharField(max_length=20, blank=True, null=True)
    department = models.CharField(max_length=100)
    year = models.PositiveIntegerField()
    section = models.CharField(max_length=10, blank=True, null=True)
    klass = models.ForeignKey(Class, on_delete=models.CASCADE, related_name='students', db_column='class_id')
    user = models.OneToOneField(User, on_delete=models.SET_NULL, related_name='student_profile', null=True, blank=True)
    
    class Meta:
        ordering = ['roll_number']
        indexes = [
            models.Index(fields=['roll_number']),
            models.Index(fields=['department', 'year']),
        ]
    
    def __str__(self):
        return f"{self.roll_number} - {self.name}"