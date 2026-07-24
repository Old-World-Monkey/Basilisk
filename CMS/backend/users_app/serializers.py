from django.contrib.auth import get_user_model
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import Teacher, Class, Student, Subject, Attendance

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "first_name",
            "last_name",
            "email",
            "role",
            "is_approved",
        ]


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    is_approved = serializers.BooleanField(read_only=True)

    class Meta:
        model = User
        fields = [
            "username",
            "first_name",
            "last_name",
            "email",
            "password",
            "role",
            "is_approved",
        ]

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data["username"],
            first_name=validated_data.get("first_name", ""),
            last_name=validated_data.get("last_name", ""),
            email=validated_data["email"],
            password=validated_data["password"],
            role=validated_data["role"],
            is_approved=False,
        )
        return user


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token["role"] = user.role
        token["username"] = user.username
        token["email"] = user.email

        return token

    def validate(self, attrs):
        data = super().validate(attrs)

        if not self.user.is_approved:
            raise serializers.ValidationError(
                {"detail": "Your account is pending admin approval."}
            )

        data["user"] = {
            "id": self.user.id,
            "username": self.user.username,
            "email": self.user.email,
            "role": self.user.role,
        }

        return data


class TeacherSerializer(serializers.ModelSerializer):
    class Meta:
        model = Teacher
        fields = ["id", "name", "email", "subject"]


class ClassSerializer(serializers.ModelSerializer):
    class Meta:
        model = Class
        fields = ["id", "name", "section", "room"]


class StudentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    class_obj = ClassSerializer(read_only=True)
    class_obj_id = serializers.PrimaryKeyRelatedField(
        queryset=Class.objects.all(), source="class_obj", write_only=True, required=False, allow_null=True
    )

    class Meta:
        model = Student
        fields = ["id", "user", "roll_number", "class_obj", "class_obj_id", "admission_date"]


class SubjectSerializer(serializers.ModelSerializer):
    teacher = TeacherSerializer(read_only=True)
    teacher_id = serializers.PrimaryKeyRelatedField(
        queryset=Teacher.objects.all(), source="teacher", write_only=True
    )

    class Meta:
        model = Subject
        fields = ["id", "name", "code", "teacher", "teacher_id"]


class AttendanceSerializer(serializers.ModelSerializer):
    student = StudentSerializer(read_only=True)
    subject = SubjectSerializer(read_only=True)
    student_id = serializers.PrimaryKeyRelatedField(
        queryset=Student.objects.all(), source="student", write_only=True
    )
    subject_id = serializers.PrimaryKeyRelatedField(
        queryset=Subject.objects.all(), source="subject", write_only=True
    )

    class Meta:
        model = Attendance
        fields = ["id", "student", "subject", "date", "status", "created_at", "student_id", "subject_id"]
