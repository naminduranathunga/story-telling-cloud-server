"""
[
    {
        "story_id": "<STORY_ID>",
        "total_likes": 0,
        "total_comments": 0,
        "total_view_time": 0,
        "importance_score": 0
    }
]
"""

import json
import os
import dotenv
from pymongo import MongoClient
from bson.objectid import ObjectId

# get this file's folder path
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
env_path = os.path.join(BASE_DIR, ".env")
# load environment variables
dotenv.load_dotenv(env_path)

## create mongodb conndection
def create_mongo_connection():
    client = MongoClient(os.getenv("MONGO_DB_CLIET_URI"))
    db = client[os.getenv("MONGO_DB_NAME")]
    return db


def get_weighted_score(likes, comments, views):
    # assume weights are .1, .2, .3
    return likes*.1 + comments * .2 + views * .3


def get_user_suggestions(user_id):
    db = create_mongo_connection()
    collection = db.userinteractions
    user_activities = collection.find({"user_id": ObjectId(user_id)}).sort("created_at", -1).limit(100)

    # extracting story ids
    stories = set()
    reslut_list = []
    for doc in user_activities:
        stories.add(doc["story_id"].__str__())
        reslut_list.append(doc)
    
    stories = list(stories)
    out_stories = []
    for story in stories:
        id = ObjectId(story)
        n_likes = 0
        n_comments = 0
        n_views = 0
        read_time_tmp = 0
        for doc in reslut_list:
            if str(doc["story_id"]) == story:
                if doc["action"] == "read":
                    if read_time_tmp < doc["duration"]:
                        read_time_tmp = doc["duration"]
                else:
                    if read_time_tmp > 0:
                        n_views += read_time_tmp + 1
                        read_time_tmp = 0
                if doc["action"] == "like":
                    n_likes += 1
                elif doc["action"] == "comment":
                    n_comments += 1
        if read_time_tmp > 0:
            n_views += read_time_tmp + 1

        out_stories.append({
            "story_id": story,
            "total_likes": n_likes,
            "total_comments": n_comments,
            "total_view_time": n_views,
            "importance_score": get_weighted_score(n_likes, n_comments, n_views)
        })
    # print(out_stories)
    return out_stories


if __name__ == "__main__":
    get_user_suggestions("666b3d9cf5b5a86e70d71ec7")
    # {user_id: ObjectId("6696d6f87d01989d6cda866d"), story_id: ObjectId("6696d6f87d01989d6cda866d"), created_at: new Date(), action: "like"}
    pass