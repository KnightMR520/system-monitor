## Setup

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate      # Linux/macOS
venv\Scripts\activate         # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000

## Frontend

cd frontend
npm install
npm run dev

```
