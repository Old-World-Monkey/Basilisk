import pytest
from django.contrib.auth import get_user_model
from apps.students.models import Class, Student
from apps.subjects.models import Subject
from apps.timetable.models import TimetableEntry

User = get_user_model()


@pytest.fixture
def teacher(db):
    return User.objects.create_user(
        username='teacher1',
        email='teacher@test.com',
        password='password123',
        role=User.TEACHER,
        department='Computer Science'
    )


@pytest.fixture
def hod(db):
    return User.objects.create_user(
        username='hod1',
        email='hod@test.com',
        password='password123',
        role=User.HOD,
        department='Computer Science'
    )


@pytest.fixture
def klass(db):
    return Class.objects.create(
        department='Computer Science',
        year=2,
        section_name='A',
        threshold_percent=75
    )


@pytest.fixture
def subject(db, teacher):
    return Subject.objects.create(
        name='Mathematics',
        code='MATH101',
        department='Computer Science',
        teacher=teacher
    )


@pytest.fixture
def student(db, klass):
    return Student.objects.create(
        name='John Doe',
        roll_number='CS2A001',
        email='john@test.com',
        department='Computer Science',
        year=2,
        section='A',
        klass=klass
    )


@pytest.mark.django_db
class TestUserModel:
    def test_create_teacher(self):
        user = User.objects.create_user(username='t1', password='pass', role=User.TEACHER)
        assert user.is_teacher() is True
        assert user.is_hod() is False
        assert user.is_admin() is False

    def test_create_hod(self):
        user = User.objects.create_user(username='h1', password='pass', role=User.HOD)
        assert user.is_hod() is True


@pytest.mark.django_db
class TestTimetableConflictDetection:
    def test_no_conflict_different_times(self, klass, subject, teacher):
        TimetableEntry.objects.create(
            klass=klass, subject=subject, teacher=teacher,
            room='R101', day_of_week=1, start_time='09:00', end_time='10:00'
        )
        entry2 = TimetableEntry(
            klass=klass, subject=subject, teacher=teacher,
            room='R102', day_of_week=1, start_time='11:00', end_time='12:00'
        )
        assert entry2.get_conflict_type(room='R102', teacher=teacher) is None

    def test_room_conflict(self, klass, subject, teacher):
        TimetableEntry.objects.create(
            klass=klass, subject=subject, teacher=teacher,
            room='R101', day_of_week=1, start_time='09:00', end_time='11:00'
        )
        entry2 = TimetableEntry(
            klass=klass, subject=subject, teacher=teacher,
            room='R101', day_of_week=1, start_time='10:00', end_time='11:30'
        )
        assert entry2.get_conflict_type(room='R101', teacher=teacher) == 'room'

    def test_teacher_conflict(self, klass, subject, teacher):
        other_subject = Subject.objects.create(name='Physics', code='PHY101', department='CS')
        TimetableEntry.objects.create(
            klass=klass, subject=subject, teacher=teacher,
            room='R101', day_of_week=1, start_time='09:00', end_time='11:00'
        )
        entry2 = TimetableEntry(
            klass=klass, subject=other_subject, teacher=teacher,
            room='R102', day_of_week=1, start_time='10:00', end_time='11:30'
        )
        assert entry2.get_conflict_type(room='R102', teacher=teacher) == 'teacher'


@pytest.mark.django_db
class TestClassModel:
    def test_unique_constraint(self, klass):
        with pytest.raises(Exception):
            Class.objects.create(department='Computer Science', year=2, section_name='A')