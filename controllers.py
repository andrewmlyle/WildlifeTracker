"""
This file defines actions, i.e. functions the URLs are mapped into
The @action(path) decorator exposed the function at URL:

    http://127.0.0.1:8000/{app_name}/{path}

If app_name == '_default' then simply

    http://127.0.0.1:8000/{path}

If path == 'index' it can be omitted:

    http://127.0.0.1:8000/

The path follows the bottlepy syntax.

@action.uses('generic.html')  indicates that the action uses the generic.html template
@action.uses(session)         indicates that the action uses the session
@action.uses(db)              indicates that the action uses the db
@action.uses(T)               indicates that the action uses the i18n & pluralization
@action.uses(auth.user)       indicates that the action requires a logged in user
@action.uses(auth)            indicates that the action requires the auth object

session, db, T, auth, and tempates are examples of Fixtures.
Warning: Fixtures MUST be declared with @action.uses({fixtures}) else your app will result in undefined behavior
"""

from py4web import action, request, abort, redirect, URL
from yatl.helpers import A
from .common import db, session, T, cache, auth, logger, authenticated, unauthenticated, flash
from py4web.utils.url_signer import URLSigner
from .models import get_user_email

url_signer = URLSigner(session)


@action('index')
@action.uses(db, auth, 'index.html')
def index():
    return dict(
        # This is the signed URL for the callback.
        load_animal_url=URL('load_animals', signer=url_signer),
        load_sighting_url=URL('load_sightings', signer=url_signer),
        load_user_sightings_url=URL('load_user_sightings', signer=url_signer),
        add_sighting_url=URL('add_sighting', signer=url_signer),
        delete_sighting_url=URL('delete_sighting', signer=url_signer),

    )


@action('load_animals')
@action.uses(url_signer.verify(), db)
def load_animals():
    rows = db(db.animals).select().as_list()
    return dict(rows=rows)


@action('load_sightings')
@action.uses(url_signer.verify(), db)
def load_sightings():
    rows = db(db.sightings).select().as_list()
    return dict(rows=rows)


@action('load_user_sightings')
@action.uses(url_signer.verify(), db)
def load_user_sightings():
    id = request.params.get('id')
    assert id is not None
    rows = db(db.posts.id == id).select().as_list()
    return dict(rows=rows)


@action('delete_sighting')
@action.uses(url_signer.verify(), db)
def delete_sighting():
    id = request.params.get('id')
    assert id is not None
    db(db.sightings.id == id).delete()
    return "ok"

@action('add_sighting', method="POST")
@action.uses(url_signer.verify(), db)
def add_sighting():
    id = db.sightings.update_or_insert(
    	(db.sightings.id == request.json.get('id')),
        animal_id=request.json.get('animal_id'),
        user_id=request.json.get('user_id'),
        latitude=request.json.get('latitude'),
        longitude=request.json.get('longitude'),
    )
    return dict(id=id)

