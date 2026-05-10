import sys
import os

# Add the project root to the path so we can find the backend module
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from backend.main import app
