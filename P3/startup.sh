cd back_end/
pip3 install virtualenv
virtualenv -p `which python3.10` venv
source venv/bin/activate
pip install -r requirements.txt
./manage.py migrate

cd ../restify_frontend/
npm install