#!/usr/bin/env bash
# Kisan Suvidha Backend Runner
set -e

if [ -d "venv" ]; then
    source venv/bin/activate
fi

echo "Starting Kisan Suvidha Django REST Framework Server on port 8000..."
python manage.py runserver 0.0.0.0:8000
