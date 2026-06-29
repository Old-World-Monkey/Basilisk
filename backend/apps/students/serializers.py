from rest_framework import serializers
from .models import Class, Student

class ClassSerializer(serializers.ModelSerializer):
    student_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Class
        fields = ['id', 'department', 'year', 'section_name', 'threshold_percent', 'student_count']
    
    def get_student_count(self, obj):
        return obj.students.count()


class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = ['id', 'name', 'roll_number', 'email', 'phone', 'parent_email', 'parent_phone', 'department', 'year', 'section', 'klass']
    
    def create(self, validated_data):
        klass_id = validated_data.pop('klass').id if isinstance(validated_data.get('klass'), Class) else validated_data.pop('klass')
        validated_data['klass_id'] = klass_id
        return super().create(validated_data)