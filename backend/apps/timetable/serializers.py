from rest_framework import serializers
from .models import TimetableEntry, ExamEntry

class TimetableEntrySerializer(serializers.ModelSerializer):
    klass_name = serializers.StringRelatedField(source='klass')
    subject_name = serializers.StringRelatedField(source='subject')
    teacher_name = serializers.SerializerMethodField()
    
    class Meta:
        model = TimetableEntry
        fields = ['id', 'klass', 'klass_name', 'subject', 'subject_name', 'teacher', 'teacher_name', 'room', 'day_of_week', 'start_time', 'end_time']
    
    def get_teacher_name(self, obj):
        return f"{obj.teacher.first_name} {obj.teacher.last_name}" if obj.teacher else None
    
    def validate(self, data):
        instance = self.instance if self.instance else None
        start_time = data.get('start_time', instance.start_time if instance else None)
        end_time = data.get('end_time', instance.end_time if instance else None)
        day_of_week = data.get('day_of_week', instance.day_of_week if instance else None)
        
        if start_time and end_time and day_of_week:
            overlaps = TimetableEntry.objects.filter(
                day_of_week=day_of_week,
                start_time__lt=end_time,
                end_time__gt=start_time
            ).exclude(pk=instance.pk if instance else None)
            
            room = data.get('room', instance.room if instance else None)
            teacher = data.get('teacher', instance.teacher if instance else None)
            
            if overlaps.filter(room=room).exists():
                raise serializers.ValidationError({'room': 'Room already booked at this time'})
            
            if teacher and overlaps.filter(teacher=teacher).exists():
                raise serializers.ValidationError({'teacher': 'Teacher already assigned at this time'})
        
        if start_time and end_time and start_time >= end_time:
            raise serializers.ValidationError({'end_time': 'End time must be after start time'})
        
        return data


class ExamEntrySerializer(serializers.ModelSerializer):
    klass_name = serializers.StringRelatedField(source='klass')
    subject_name = serializers.StringRelatedField(source='subject')
    teacher_name = serializers.SerializerMethodField()
    
    class Meta:
        model = ExamEntry
        fields = ['id', 'klass', 'klass_name', 'subject', 'subject_name', 'teacher', 'teacher_name', 'room', 'date', 'start_time', 'end_time', 'exam_type']
    
    def get_teacher_name(self, obj):
        return f"{obj.teacher.first_name} {obj.teacher.last_name}" if obj.teacher else None