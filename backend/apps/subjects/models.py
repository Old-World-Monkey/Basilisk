from django.db import models
from apps.users.models import User

class Subject(models.Model):
    name = models.CharField(max_length=200)
    code = models.CharField(max_length=20, unique=True)
    department = models.CharField(max_length=100)
    teacher = models.ForeignKey(User, on_delete=models.SET_NULL, related_name='subjects', null=True, blank=True, limit_choices_to={'role': User.TEACHER})
    
    class Meta:
        ordering = ['code']
        indexes = [
            models.Index(fields=['code']),
            models.Index(fields=['department']),
        ]
    
    def __str__(self):
        return f"{self.code} - {self.name}"