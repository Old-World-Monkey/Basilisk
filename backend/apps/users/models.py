from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    TEACHER = 1
    HOD = 2
    ADMIN = 3
    
    ROLE_CHOICES = [
        (TEACHER, 'Teacher'),
        (HOD, 'HOD'),
        (ADMIN, 'Admin'),
    ]
    
    role = models.PositiveSmallIntegerField(choices=ROLE_CHOICES, default=TEACHER)
    department = models.CharField(max_length=100, blank=True, null=True)
    
    def is_teacher(self):
        return self.role == self.TEACHER
    
    def is_hod(self):
        return self.role == self.HOD
    
    def is_admin(self):
        return self.role == self.ADMIN
    
    class Meta:
        verbose_name = 'user'
        verbose_name_plural = 'users'