import sys
from pathlib import Path

from mangum import Mangum

ROOT = Path(__file__).resolve().parents[2]
BACKEND = ROOT / "backend"

sys.path.insert(0, str(BACKEND))

from app.main import app

handler = Mangum(app)