import os
import django
from django.conf import settings

if not settings.configured:
    settings.configure(
        DEBUG=True,
        DATABASES={
            'default': {
                'ENGINE': 'django.db.backends.sqlite3',
                'NAME': ':memory:',
            }
        },
        INSTALLED_APPS=[
            'django.contrib.contenttypes',
            'django.contrib.auth',
            'django.contrib.admin',
            'rest_framework',
            'rest_framework_simplejwt.token_blacklist',
            'apps.users',
            'apps.students',
            'apps.subjects',
            'apps.timetable',
        ],
        AUTH_USER_MODEL='users.User',
    )
    django.setup()

__file__ = os.path.abspath(__file__)