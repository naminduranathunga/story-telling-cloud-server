from pymongo import MongoClient
import chromadb
import get_user_activities as gua
"""
For dev purposes, we will use chromadb to store embeddings of stories instead of mongodb.
"""

mongo_db = gua.create_mongo_connection()
mongo_collection = mongo_db["articles"]

chroma_client = chromadb.PersistentClient(path="chromadb")
collection = chroma_client.get_or_create_collection(name="story_embeddings")

def add_story_to_chromadb(story_id, content):
    collection.add(
        ids=[story_id],
        documents=[content]
    )

def body_to_string(body):
    content = ""
    for item in body:
        if (item['type'] == 'text'):
            content += item['content']
    return content

def add_mongodb_data_to_chromadb():
    mongo_data = mongo_collection.find()

    n = 0
    for doc in mongo_data:
        print("Adding document to chromadb", n)
        n += 1
        doc_id = str(doc['_id'])
        data = body_to_string(doc['body'])
        print(len(data))
        add_story_to_chromadb(doc_id, data)

def test_get_random_story():
    story = collection.query(query_texts=["Hello"], n_results=2)
    print(story)

if __name__ == "__main__":
    test_get_random_story()
    # add_mongodb_data_to_chromadb()
