import chromadb
import get_user_activities as gua
import json
import argparse
from bson import ObjectId
import os

mongo_db = gua.create_mongo_connection()
mongo_collection = mongo_db["articles"]

# path for this file
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
chromadb_path = os.path.join(BASE_DIR, "chromadb")

### chromadb uri
chroma_client = chromadb.PersistentClient(path=chromadb_path)
collection = chroma_client.get_or_create_collection(name="story_embeddings")


def recommend_stories(user_id):
    data = gua.get_user_suggestions(user_id)

    story_ids = [str(story['story_id']) for story in data]
    record = collection.get(ids=story_ids)
    docs = record['documents']
    if len(docs) == 0:
        print("[]")
        exit()

    # get closer stories
    record = collection.query(query_texts=docs, n_results=50)
    ids = []
    for item in record['ids']:
        ids = ids + item

    # filter and organize
    # ...

    return ids
        


def fetch_documents(story_ids):
    documents = []
    story_ids = [ObjectId(story_id) for story_id in story_ids]
    query = [{
        "$match": {
            "_id": {
               "$in": story_ids
            }
        }
    }, 
    {
        "$lookup": {
            "from": "users",
            "localField": "user_id",
            "foreignField": "_id",
            "as": "user"
        }
    }]

    """
    _id: string,
    user_id: string,
    user_name: string,
    title: string,
    thumbnail: string,
    tags: string,
    likes: number,
    comments_count: number,
    share_count: number,
    """

    documents_f = list(mongo_collection.aggregate(query))
    for document in documents_f:
        print(document)
        exit()
        documents.append({
            "_id": str(document["_id"]),
            "user_id": document["user_id"]["_id"],
            "user_name": document["user_id"]["name"],
            "title": document["title"],
            "likes": document["likes"],
            "comments_count": document["comments_count"],
            "share_count": document["share_count"],
            "tags": document["tags"],
            "thumbnail": document["thumbnail"],
            # "n_views": document["n_views"]
        })
        documents.append(document)
    #for story_id in story_ids:
    #     document = mongo_collection.find_one({"_id": story_id})
    #     if document:
    #         documents.append(document)
    # json_data = json.dumps(documents, cls=MongoJSONEncoder, indent=4)
    json_data = json.dumps(documents, indent=4)
    return json_data



if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument('--user_id', required=True)
    parser.add_argument('--search', default="")
    parser.add_argument('--perPage', default=10)
    parser.add_argument('--page', default=1)

    args = parser.parse_args()

    recommendations = recommend_stories(args.user_id)
    limit = int(args.perPage)
    page = int(args.page)
    start = (page - 1) * limit
    end = start + limit
    # recommended_documents = fetch_documents(recommendations)
    print(json.dumps(recommendations[start:end], indent=4))
