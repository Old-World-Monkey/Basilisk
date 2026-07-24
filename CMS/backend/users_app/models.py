from django.contrib.auth.models import AbstractUser
from django.db import models

class Users(AbstractUser):
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('teacher', 'Teacher'),
        ('student', 'Student'),
        ('staff', 'Staff'),
    ]

    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    email = models.EmailField(unique=True)
    is_approved = models.BooleanField(default=False)

    @property
    def is_admin(self):
        return self.role == "admin"

    @property
    def is_teacher(self):
        return self.role == "teacher"

    @property
    def is_student(self):
        return self.role == "student"

    @property
    def is_staff_member(self):
        return self.role == "staff"

    def __str__(self):
        return self.username


class Teacher(models.Model):
    user = models.OneToOneField(Users, on_delete=models.CASCADE, related_name='teacher_profile', null=True, blank=True)
    name = models.CharField(max_length=100)
    email = models.EmailField()
    subject = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class Class(models.Model):
    name = models.CharField(max_length=100)
    section = models.CharField(max_length=50)
    room = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.name} - {self.section}"


class Student(models.Model):
    user = models.OneToOneField(Users, on_delete=models.CASCADE, related_name='student_profile')
    roll_number = models.CharField(max_length=20, unique=True)
    class_obj = models.ForeignKey(Class, on_delete=models.SET_NULL, null=True, related_name='students')
    admission_date = models.DateField(null=True, blank=True)

    def __str__(self):
        return f"{self.user.get_full_name()} ({self.roll_number})"


class Subject(models.Model):
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=20)
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE, related_name='subjects')

    def __str__(self):
        return f"{self.name} ({self.code})"


class Attendance(models.Model):
    STATUS_CHOICES = [
        ('present', 'Present'),
        ('absent', 'Absent'),
        ('late', 'Late'),
    ]
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='attendance_records')
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name='attendance_records')
    date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['student', 'subject', 'date']

    def __str__(self):
        return f"{self.student} - {self.subject} - {self.date} - {self.status}"
