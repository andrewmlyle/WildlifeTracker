"""
This file defines the database models
"""

import datetime
from .common import db, Field, auth
from pydal.validators import *

def get_user_id():
	return auth.current_user.get('id') if auth.current_user else None 

def get_user_email():
    return auth.current_user.get('email') if auth.current_user else None

def get_time():
    return datetime.datetime.utcnow()

db.define_table('animals',
				Field('animal_name'),
                Field('animal_description')
)
db.define_table('sightings',
				Field('animal_id', 'reference animals'),
				Field('user_id', 'reference auth_user'),
				Field('latitude'),
				Field('longitude')
)

db.commit()
