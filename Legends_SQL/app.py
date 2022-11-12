import os
import pandas as pd
import numpy as np

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session, create_session
from sqlalchemy import create_engine, inspect

from flask import Flask, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy

from sqlalchemy.ext.declarative import declarative_base
# from flask.ext.heroku import Heroku

import json


# Try this way if pd.read_sql_table does not work.
# Base.classes.keys() does not produce anything. Some step beforehand is missing.  Start there.

app = Flask(__name__)

app.debug = False
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///Legends.sqlite"
#app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql+psycopg2://postgres:postgres@localhost:5432/Legends_Temple_Runs"

app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False


db = SQLAlchemy(app)

Base = automap_base()
Base.prepare(db.engine, reflect=True)

inspector = inspect(db.engine)
tables=inspector.get_table_names()

# Samples_Metadata = Base.classes.sample_metadata
# Samples = Base.classes.samples



@app.route("/")
def index():
    return render_template("index.html")

@app.route("/default")
def default():

    conn = db.engine.connect()
    Temple_data_conn=pd.read_sql(f"SELECT * FROM {tables[0]}", conn)
    Temple_data = {
    "episode": Temple_data_conn.episode.values.tolist(),
    "season": Temple_data_conn.season.values.tolist(),
    "name": Temple_data_conn.name.values.tolist(),
    "team": Temple_data_conn.team.values.tolist(),
    "temple_layout": Temple_data_conn.temple_layout.values.tolist(),
    "artifact_location": Temple_data_conn.artifact_location.values.tolist(),
    "artifact_found": Temple_data_conn.artifact_found.values.tolist(),
    "failure_due_to": Temple_data_conn.failure_due_to.values.tolist(),
    "success": Temple_data_conn.success.values.tolist(),
    "solo": Temple_data_conn.solo.values.tolist(),
    "time_left": Temple_data_conn.time_left.values.tolist(),
    "pendants": Temple_data_conn.pendants.values.tolist(),
    "pen_dummy": Temple_data_conn.pen_dummy.values.tolist(),
}

    return jsonify(Temple_data)

@app.route("/season")
def season():

    conn = db.engine.connect()
    Temple_data_conn=pd.read_sql(f"SELECT * FROM {tables[0]}", conn)
    Season_list=Temple_data_conn.season.unique()
    Season_list=list(np.ravel(Season_list))

    return jsonify(Season_list)
    
@app.route("/team")
def team():

    conn = db.engine.connect()
    Temple_data_conn=pd.read_sql(f"SELECT * FROM {tables[0]}", conn)
    Team_list=Temple_data_conn.team.unique()
    Team_list=list(np.ravel(Team_list))

    return jsonify(Team_list)

@app.route("/temple_layout")
def temple_layout():

    conn = db.engine.connect()
    Temple_data_conn=pd.read_sql(f"SELECT * FROM {tables[0]}", conn)
    Layout_list=Temple_data_conn.temple_layout.unique()
    Layout_list=list(np.ravel(Layout_list))

    return jsonify(Layout_list)

# Check this in postgres - convert the pen_dummy variable to a float, int will not process as json.
@app.route("/pendants")
def pendants():

    conn = db.engine.connect()
    Temple_data_conn=pd.read_sql(f"SELECT * FROM {tables[0]}", conn)
    Pendants_list=Temple_data_conn.pen_dummy.unique()
    Pendants_list=list(np.ravel(Pendants_list))

    return jsonify(Pendants_list)

@app.route("/solo")
def solo():

    conn = db.engine.connect()
    Temple_data_conn=pd.read_sql(f"SELECT * FROM {tables[0]}", conn)
    Solo_list=Temple_data_conn.solo.unique()
    Solo_list=list(np.ravel(Solo_list))

    return jsonify(Solo_list)

@app.route("/season/<season>")
def season_metadata(season):

    conn = db.engine.connect()
    Season_data_conn=pd.read_sql(f"SELECT * FROM {tables[0]} WHERE season='{season}'", conn)
    Season_data = {
    "episode": Season_data_conn.episode.values.tolist(),
    "season": Season_data_conn.season.values.tolist(),
    "name": Season_data_conn.name.values.tolist(),
    "team": Season_data_conn.team.values.tolist(),
    "temple_layout": Season_data_conn.temple_layout.values.tolist(),
    "artifact_location": Season_data_conn.artifact_location.values.tolist(),
    "artifact_found": Season_data_conn.artifact_found.values.tolist(),
    "failure_due_to": Season_data_conn.failure_due_to.values.tolist(),
    "success": Season_data_conn.success.values.tolist(),
    "solo": Season_data_conn.solo.values.tolist(),
    "time_left": Season_data_conn.time_left.values.tolist(),
    "pendants": Season_data_conn.pendants.values.tolist(),
    "pen_dummy": Season_data_conn.pen_dummy.values.tolist(),
}

    return jsonify(Season_data)

@app.route("/team/<team>")
def team_metadata(team):

    conn = db.engine.connect()
    Team_data_conn=pd.read_sql(f"SELECT * FROM {tables[0]} WHERE team='{team}'", conn)
    Team_data = {
    "episode": Team_data_conn.episode.values.tolist(),
    "season": Team_data_conn.season.values.tolist(),
    "name": Team_data_conn.name.values.tolist(),
    "team": Team_data_conn.team.values.tolist(),
    "temple_layout": Team_data_conn.temple_layout.values.tolist(),
    "artifact_location": Team_data_conn.artifact_location.values.tolist(),
    "artifact_found": Team_data_conn.artifact_found.values.tolist(),
    "failure_due_to": Team_data_conn.failure_due_to.values.tolist(),
    "success": Team_data_conn.success.values.tolist(),
    "solo": Team_data_conn.solo.values.tolist(),
    "time_left": Team_data_conn.time_left.values.tolist(),
    "pendants": Team_data_conn.pendants.values.tolist(),
    "pen_dummy": Team_data_conn.pen_dummy.values.tolist(),
}

    return jsonify(Team_data)

@app.route("/temple_layout/<temple_layout>")
def temple_layout_metadata(temple_layout):

    conn = db.engine.connect()
    Layout_data_conn=pd.read_sql(f"SELECT * FROM {tables[0]} WHERE temple_layout='{temple_layout}'", conn)
    Layout_data = {
    "episode": Layout_data_conn.episode.values.tolist(),
    "season": Layout_data_conn.season.values.tolist(),
    "name": Layout_data_conn.name.values.tolist(),
    "team": Layout_data_conn.team.values.tolist(),
    "temple_layout": Layout_data_conn.temple_layout.values.tolist(),
    "artifact_location": Layout_data_conn.artifact_location.values.tolist(),
    "artifact_found": Layout_data_conn.artifact_found.values.tolist(),
    "failure_due_to": Layout_data_conn.failure_due_to.values.tolist(),
    "success": Layout_data_conn.success.values.tolist(),
    "solo": Layout_data_conn.solo.values.tolist(),
    "time_left": Layout_data_conn.time_left.values.tolist(),
    "pendants": Layout_data_conn.pendants.values.tolist(),
    "pen_dummy": Layout_data_conn.pen_dummy.values.tolist(),
}

    return jsonify(Layout_data)

@app.route("/pendants/<pendants>")
def pendants_metadata(pendants):

    conn = db.engine.connect()
    Pendants_data_conn=pd.read_sql(f"SELECT * FROM {tables[0]} WHERE pen_dummy='{pendants}'", conn)
    Pendants_data = {
    "episode": Pendants_data_conn.episode.values.tolist(),
    "season": Pendants_data_conn.season.values.tolist(),
    "name": Pendants_data_conn.name.values.tolist(),
    "team": Pendants_data_conn.team.values.tolist(),
    "temple_layout": Pendants_data_conn.temple_layout.values.tolist(),
    "artifact_location": Pendants_data_conn.artifact_location.values.tolist(),
    "artifact_found": Pendants_data_conn.artifact_found.values.tolist(),
    "failure_due_to": Pendants_data_conn.failure_due_to.values.tolist(),
    "success": Pendants_data_conn.success.values.tolist(),
    "solo": Pendants_data_conn.solo.values.tolist(),
    "time_left": Pendants_data_conn.time_left.values.tolist(),
    "pendants": Pendants_data_conn.pendants.values.tolist(),
    "pen_dummy": Pendants_data_conn.pen_dummy.values.tolist(),
}

    return jsonify(Pendants_data)

@app.route("/solo/<solo>")
def solo_metadata(solo):

    conn = db.engine.connect()
    Solo_data_conn=pd.read_sql(f"SELECT * FROM {tables[0]} WHERE solo='{solo}'", conn)
    Solo_data = {
    "episode": Solo_data_conn.episode.values.tolist(),
    "season": Solo_data_conn.season.values.tolist(),
    "name": Solo_data_conn.name.values.tolist(),
    "team": Solo_data_conn.team.values.tolist(),
    "temple_layout": Solo_data_conn.temple_layout.values.tolist(),
    "artifact_location": Solo_data_conn.artifact_location.values.tolist(),
    "artifact_found": Solo_data_conn.artifact_found.values.tolist(),
    "failure_due_to": Solo_data_conn.failure_due_to.values.tolist(),
    "success": Solo_data_conn.success.values.tolist(),
    "solo": Solo_data_conn.solo.values.tolist(),
    "time_left": Solo_data_conn.time_left.values.tolist(),
    "pendants": Solo_data_conn.pendants.values.tolist(),
    "pen_dummy": Solo_data_conn.pen_dummy.values.tolist(),
}

    return jsonify(Solo_data)

if __name__ == "__main__":
    app.run()
