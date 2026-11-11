#!/usr/bin/env bash
# Kisan Suvidha Backend Setup Script
set -e

echo "=================================================="
echo "🌾 KISAN SUVIDHA - DJANGO BACKEND SETUP"
echo "=================================================="

# Check Python version
python3 --version

# Create virtual environment if it does not exist
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment in backend/venv..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "Installing required Python packages..."
pip install --upgrade pip
pip install -r requirements.txt

# Run database migrations
echo "Applying SQLite database migrations..."
python manage.py makemigrations authentication profiles schemes eligibility saved_schemes guidance alerts ai_assistant
python manage.py migrate

# Seed authentic government schemes and alerts
echo "Seeding authentic verified government schemes and alerts..."
python manage.py seed_schemes
python manage.py seed_alerts

echo ""
echo "✅ Backend setup complete!"
echo "Run './run_backend.sh' or 'python manage.py runserver 8000' to start the server."
