from django.db import models
import enum
from django.contrib.auth.models import AbstractUser

class UserRole(enum.Enum):
    ADMIN = "admin"
    TEACHER = "teacher"
# Create your models here.
class CustomUser(AbstractUser):
    role = models.CharField(
        max_length=20,
        choices=[(tag.value, tag.name.capitalize()) for tag in UserRole],
        default=UserRole.TEACHER.value
    )
    
    email = models.EmailField(unique=True)

    def __str__(self):
        return f"<User id={self.id}, username={self.username}>"