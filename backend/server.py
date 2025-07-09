from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, date
import os
import uuid

app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB connection
MONGO_URL = os.environ.get('MONGO_URL', 'mongodb://localhost:27017/')
client = MongoClient(MONGO_URL)
db = client.parrot_breeding_db

# Collections
birds_collection = db.birds
breeding_pairs_collection = db.breeding_pairs
breeding_records_collection = db.breeding_records

# Pydantic models
class Bird(BaseModel):
    id: Optional[str] = None
    name: str
    species: str
    gender: str  # "male" or "female"
    birth_date: Optional[str] = None
    ring_number: Optional[str] = None
    color_mutation: Optional[str] = None
    status: str = "active"  # "active", "inactive", "deceased"
    notes: Optional[str] = None
    created_at: Optional[str] = None

class BreedingPair(BaseModel):
    id: Optional[str] = None
    male_bird_id: str
    female_bird_id: str
    pair_name: str
    pair_date: str
    status: str = "active"  # "active", "inactive", "separated"
    notes: Optional[str] = None
    created_at: Optional[str] = None

class BreedingRecord(BaseModel):
    id: Optional[str] = None
    breeding_pair_id: str
    breeding_cycle_number: int
    egg_laying_date: str
    eggs_laid: int
    expected_hatch_date: str
    hatched_count: Optional[int] = None
    hatch_success_rate: Optional[float] = None
    notes: Optional[str] = None
    status: str = "incubating"  # "incubating", "hatched", "failed"
    created_at: Optional[str] = None

# Bird endpoints
@app.post("/api/birds")
async def create_bird(bird: Bird):
    bird_dict = bird.dict()
    bird_dict["id"] = str(uuid.uuid4())
    bird_dict["created_at"] = datetime.now().isoformat()
    
    result = birds_collection.insert_one(bird_dict)
    if result.inserted_id:
        return {"message": "Bird created successfully", "bird_id": bird_dict["id"]}
    raise HTTPException(status_code=500, detail="Failed to create bird")

@app.get("/api/birds")
async def get_birds():
    birds = list(birds_collection.find({}, {"_id": 0}))
    return {"birds": birds}

@app.get("/api/birds/{bird_id}")
async def get_bird(bird_id: str):
    bird = birds_collection.find_one({"id": bird_id}, {"_id": 0})
    if not bird:
        raise HTTPException(status_code=404, detail="Bird not found")
    return bird

@app.put("/api/birds/{bird_id}")
async def update_bird(bird_id: str, bird: Bird):
    bird_dict = bird.dict()
    bird_dict["id"] = bird_id
    
    result = birds_collection.update_one(
        {"id": bird_id}, 
        {"$set": bird_dict}
    )
    if result.modified_count:
        return {"message": "Bird updated successfully"}
    raise HTTPException(status_code=404, detail="Bird not found")

@app.delete("/api/birds/{bird_id}")
async def delete_bird(bird_id: str):
    result = birds_collection.delete_one({"id": bird_id})
    if result.deleted_count:
        return {"message": "Bird deleted successfully"}
    raise HTTPException(status_code=404, detail="Bird not found")

# Breeding pair endpoints
@app.post("/api/breeding-pairs")
async def create_breeding_pair(pair: BreedingPair):
    # Check if birds exist and are of correct gender
    male_bird = birds_collection.find_one({"id": pair.male_bird_id})
    female_bird = birds_collection.find_one({"id": pair.female_bird_id})
    
    if not male_bird or not female_bird:
        raise HTTPException(status_code=404, detail="One or both birds not found")
    
    if male_bird["gender"] != "male" or female_bird["gender"] != "female":
        raise HTTPException(status_code=400, detail="Invalid gender combination for breeding pair")
    
    pair_dict = pair.dict()
    pair_dict["id"] = str(uuid.uuid4())
    pair_dict["created_at"] = datetime.now().isoformat()
    
    result = breeding_pairs_collection.insert_one(pair_dict)
    if result.inserted_id:
        return {"message": "Breeding pair created successfully", "pair_id": pair_dict["id"]}
    raise HTTPException(status_code=500, detail="Failed to create breeding pair")

@app.get("/api/breeding-pairs")
async def get_breeding_pairs():
    pairs = list(breeding_pairs_collection.find({}, {"_id": 0}))
    
    # Enrich with bird details
    for pair in pairs:
        male_bird = birds_collection.find_one({"id": pair["male_bird_id"]}, {"_id": 0})
        female_bird = birds_collection.find_one({"id": pair["female_bird_id"]}, {"_id": 0})
        pair["male_bird"] = male_bird
        pair["female_bird"] = female_bird
    
    return {"breeding_pairs": pairs}

@app.get("/api/breeding-pairs/{pair_id}")
async def get_breeding_pair(pair_id: str):
    pair = breeding_pairs_collection.find_one({"id": pair_id}, {"_id": 0})
    if not pair:
        raise HTTPException(status_code=404, detail="Breeding pair not found")
    
    # Enrich with bird details
    male_bird = birds_collection.find_one({"id": pair["male_bird_id"]}, {"_id": 0})
    female_bird = birds_collection.find_one({"id": pair["female_bird_id"]}, {"_id": 0})
    pair["male_bird"] = male_bird
    pair["female_bird"] = female_bird
    
    return pair

@app.put("/api/breeding-pairs/{pair_id}")
async def update_breeding_pair(pair_id: str, pair: BreedingPair):
    pair_dict = pair.dict()
    pair_dict["id"] = pair_id
    
    result = breeding_pairs_collection.update_one(
        {"id": pair_id}, 
        {"$set": pair_dict}
    )
    if result.modified_count:
        return {"message": "Breeding pair updated successfully"}
    raise HTTPException(status_code=404, detail="Breeding pair not found")

# Breeding record endpoints
@app.post("/api/breeding-records")
async def create_breeding_record(record: BreedingRecord):
    # Check if breeding pair exists
    pair = breeding_pairs_collection.find_one({"id": record.breeding_pair_id})
    if not pair:
        raise HTTPException(status_code=404, detail="Breeding pair not found")
    
    record_dict = record.dict()
    record_dict["id"] = str(uuid.uuid4())
    record_dict["created_at"] = datetime.now().isoformat()
    
    result = breeding_records_collection.insert_one(record_dict)
    if result.inserted_id:
        return {"message": "Breeding record created successfully", "record_id": record_dict["id"]}
    raise HTTPException(status_code=500, detail="Failed to create breeding record")

@app.get("/api/breeding-records")
async def get_breeding_records():
    records = list(breeding_records_collection.find({}, {"_id": 0}))
    
    # Enrich with breeding pair details
    for record in records:
        pair = breeding_pairs_collection.find_one({"id": record["breeding_pair_id"]}, {"_id": 0})
        if pair:
            male_bird = birds_collection.find_one({"id": pair["male_bird_id"]}, {"_id": 0})
            female_bird = birds_collection.find_one({"id": pair["female_bird_id"]}, {"_id": 0})
            pair["male_bird"] = male_bird
            pair["female_bird"] = female_bird
        record["breeding_pair"] = pair
    
    return {"breeding_records": records}

@app.get("/api/breeding-records/{record_id}")
async def get_breeding_record(record_id: str):
    record = breeding_records_collection.find_one({"id": record_id}, {"_id": 0})
    if not record:
        raise HTTPException(status_code=404, detail="Breeding record not found")
    
    # Enrich with breeding pair details
    pair = breeding_pairs_collection.find_one({"id": record["breeding_pair_id"]}, {"_id": 0})
    if pair:
        male_bird = birds_collection.find_one({"id": pair["male_bird_id"]}, {"_id": 0})
        female_bird = birds_collection.find_one({"id": pair["female_bird_id"]}, {"_id": 0})
        pair["male_bird"] = male_bird
        pair["female_bird"] = female_bird
    record["breeding_pair"] = pair
    
    return record

@app.put("/api/breeding-records/{record_id}")
async def update_breeding_record(record_id: str, record: BreedingRecord):
    record_dict = record.dict()
    record_dict["id"] = record_id
    
    # Calculate hatch success rate if both eggs_laid and hatched_count are provided
    if record_dict.get("eggs_laid") and record_dict.get("hatched_count") is not None:
        record_dict["hatch_success_rate"] = (record_dict["hatched_count"] / record_dict["eggs_laid"]) * 100
    
    result = breeding_records_collection.update_one(
        {"id": record_id}, 
        {"$set": record_dict}
    )
    if result.modified_count:
        return {"message": "Breeding record updated successfully"}
    raise HTTPException(status_code=404, detail="Breeding record not found")

# Dashboard endpoint
@app.get("/api/dashboard")
async def get_dashboard():
    # Get counts
    total_birds = birds_collection.count_documents({"status": "active"})
    total_pairs = breeding_pairs_collection.count_documents({"status": "active"})
    active_breeding_records = breeding_records_collection.count_documents({"status": "incubating"})
    
    # Get recent breeding records
    recent_records = list(breeding_records_collection.find(
        {}, {"_id": 0}
    ).sort("created_at", -1).limit(5))
    
    # Enrich recent records with pair details
    for record in recent_records:
        pair = breeding_pairs_collection.find_one({"id": record["breeding_pair_id"]}, {"_id": 0})
        if pair:
            male_bird = birds_collection.find_one({"id": pair["male_bird_id"]}, {"_id": 0})
            female_bird = birds_collection.find_one({"id": pair["female_bird_id"]}, {"_id": 0})
            pair["male_bird"] = male_bird
            pair["female_bird"] = female_bird
        record["breeding_pair"] = pair
    
    return {
        "stats": {
            "total_birds": total_birds,
            "total_pairs": total_pairs,
            "active_breeding_records": active_breeding_records
        },
        "recent_breeding_records": recent_records
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)