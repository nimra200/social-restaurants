python3 -m venv virtenv
source virtenv/bin/activate
pip install -r requirements.txt
./manage.py makemigrations
./manage.py migrate