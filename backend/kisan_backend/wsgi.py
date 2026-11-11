"""
WSGI config for kisan_backend project.
"""
import os
from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'kisan_backend.settings')

application = get_wsgi_application()
