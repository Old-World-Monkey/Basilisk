# BASILISK - College Attendance & Timetable Management Platform

At BASILISK, we combine advanced technology to provide efficient attendance marking, ensuring a safe and accountable environment.

## Tech Stack

- **Backend**: Django 5.x, Django REST Framework, PostgreSQL, Celery, Redis, Django Channels
- **Frontend**: React 18, Vite, TanStack Query, Zustand, Tailwind CSS, Heroicons
- **Notifications**: SendGrid (email), Twilio (SMS), Celery Beat (scheduled tasks)
- **Infrastructure**: Docker, Nginx, AWS/Railway, GitHub Actions

## Project Structure

```
basilisk/
├── backend/                 # Django REST API
│   ├── basilisk/           # Project settings
│   ├── apps/
│   │   ├── users/          # Authentication, roles
│   │   ├── students/       # Student, Class models
│   │   ├── subjects/       # Subject model
│   │   └── timetable/      # TimetableEntry, ExamEntry
│   ├── tests/
│   └── requirements.txt
├── frontend/                # React SPA
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx    # Stats + navigation
│   │   │   ├── Login.jsx        # JWT login form
│   │   │   ├── TimetableView.jsx
│   │   │   ├── StudentsPage.jsx
│   │   │   ├── ReportsPage.jsx
│   │   │   └── SettingsPage.jsx
│   │   ├── components/
│   │   │   └── ProtectedRoute.jsx
│   │   ├── store/
│   │   │   └── authStore.js     # Zustand + JWT
│   │   └── App.jsx
│   └── package.json
└── /
```

## Setup

### Backend

```bash
cd backend
pip install -r requirements.txt
docker compose up -d
python manage.py migrate
python manage.py runserver
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## API Endpoints

### Auth
- `POST /api/auth/login/` - Obtain JWT tokens
- `POST /api/auth/logout/` - Blacklist tokens
- `POST /api/auth/token/refresh/` - Refresh access token

### Users
- `GET/POST /api/users/` - User management

### Students
- `GET/POST /api/students/` - Student management
- `GET/POST /api/students/classes/` - Class management

### Timetable
- `GET/POST /api/timetable/entries/` - Timetable entries with conflict detection
- `GET /api/timetable/my-schedule/` - Teacher's own schedule
- `GET/POST /api/timetable/exams/` - Exam entries

## Frontend Routes

| Path | Role | Description |
|------|------|-------------|
| `/login` | All | Login with JWT credentials |
| `/` | Auth | Dashboard with stats and navigation |
| `/timetable` | Auth | Weekly timetable view |
| `/students` | Teacher, HOD | Student records |
| `/reports` | HOD, Admin | Attendance reports |
| `/settings` | Admin | System configuration |

## Sprint 1 (Completed)

- [x] Django project with JWT authentication
- [x] User model with role-based permissions (Teacher, HOD, Admin)
- [x] Student, Class, Subject, TimetableEntry, ExamEntry models
- [x] Timetable CRUD APIs with conflict detection
- [x] React app scaffold with Vite and Tailwind
- [x] Login screen and protected routes
- [x] Dashboard with role-based navigation and stats
- [x] Timetable view improved UI

## Login Credentials (Development)

| Role | Username | Password |
|------|----------|----------|
| Admin | `admin` | `admin123` |
| Teacher | `teacher` | `teacher123` |
| HOD | `hod` | `hod123` |

Create more users via Django admin at `http://localhost:8000/admin` or API.

## Sprint 2 (Upcoming)

- AttendanceSession and AttendanceRecord models
- Mark attendance UI (present/absent/late with bulk marking)
- Real-time sync via Django Channels WebSockets
- Live attendance dashboard
- 75% shortage threshold detection

## License

MIT