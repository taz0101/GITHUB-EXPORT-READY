from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, date, timedelta
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
clutches_collection = db.clutches
chicks_collection = db.chicks
transactions_collection = db.transactions
license_collection = db.license
incubators_collection = db.incubators
artificial_incubation_collection = db.artificial_incubation
incubation_logs_collection = db.incubation_logs

# Pydantic models
class Bird(BaseModel):
    id: Optional[str] = None
    species: str
    gender: str  # "male" or "female"
    birth_date: Optional[str] = None
    ring_number: Optional[str] = None
    color_mutation: Optional[str] = None
    license_number: Optional[str] = None
    license_expiry: Optional[str] = None
    status: str = "active"  # "active", "inactive", "deceased", "sold"
    notes: Optional[str] = None
    created_at: Optional[str] = None

class BreedingPair(BaseModel):
    id: Optional[str] = None
    male_bird_id: str
    female_bird_id: str
    pair_name: str
    pair_date: str
    license_number: Optional[str] = None
    license_expiry: Optional[str] = None
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

class Clutch(BaseModel):
    id: Optional[str] = None
    breeding_pair_id: str
    clutch_number: int
    egg_laying_date: str
    eggs_laid: int
    expected_hatch_date: str
    hatched_count: Optional[int] = None
    fertile_eggs: Optional[int] = None
    status: str = "incubating"  # "incubating", "hatching", "completed", "failed"
    notes: Optional[str] = None
    created_at: Optional[str] = None

class Chick(BaseModel):
    id: Optional[str] = None
    clutch_id: str
    chick_number: int
    hatch_date: str
    ring_number: Optional[str] = None
    gender: Optional[str] = None
    color_mutation: Optional[str] = None
    weight: Optional[float] = None
    status: str = "alive"  # "alive", "deceased", "sold", "kept"
    weaning_date: Optional[str] = None
    notes: Optional[str] = None
    created_at: Optional[str] = None

class Transaction(BaseModel):
    id: Optional[str] = None
    transaction_type: str  # "purchase", "sale", "expense"
    bird_id: Optional[str] = None
    chick_id: Optional[str] = None
    amount: float
    date: str
    category: Optional[str] = None  # "food", "vet", "equipment", "setup", "bird_purchase", "bird_sale"
    description: str
    notes: Optional[str] = None
    created_at: Optional[str] = None

class License(BaseModel):
    id: Optional[str] = None
    license_number: str
    license_type: str = "breeding"
    issue_date: str
    expiry_date: str
    issuing_authority: str
    status: str = "active"  # "active", "expired", "suspended"
    notes: Optional[str] = None
    created_at: Optional[str] = None

# License endpoints
@app.post("/api/license")
async def create_license(license: License):
    license_dict = license.dict()
    license_dict["id"] = str(uuid.uuid4())
    license_dict["created_at"] = datetime.now().isoformat()
    
    result = license_collection.insert_one(license_dict)
    if result.inserted_id:
        return {"message": "License created successfully", "license_id": license_dict["id"]}
    raise HTTPException(status_code=500, detail="Failed to create license")

@app.get("/api/license")
async def get_license():
    license_doc = license_collection.find_one({}, {"_id": 0})
    if license_doc:
        # Check expiry status
        expiry_date = datetime.strptime(license_doc["expiry_date"], "%Y-%m-%d")
        today = datetime.now()
        days_until_expiry = (expiry_date - today).days
        
        license_doc["days_until_expiry"] = days_until_expiry
        license_doc["alert_level"] = "none"
        
        if days_until_expiry < 0:
            license_doc["alert_level"] = "expired"
        elif days_until_expiry <= 30:
            license_doc["alert_level"] = "critical"
        
        return license_doc
    return None

@app.put("/api/license/{license_id}")
async def update_license(license_id: str, license: License):
    license_dict = license.dict()
    license_dict["id"] = license_id
    
    result = license_collection.update_one(
        {"id": license_id}, 
        {"$set": license_dict}
    )
    if result.modified_count:
        return {"message": "License updated successfully"}
    raise HTTPException(status_code=404, detail="License not found")

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
    
    # Check license expiry for each bird
    for bird in birds:
        if bird.get("license_expiry"):
            expiry_date = datetime.strptime(bird["license_expiry"], "%Y-%m-%d")
            today = datetime.now()
            days_until_expiry = (expiry_date - today).days
            
            bird["days_until_expiry"] = days_until_expiry
            bird["license_alert"] = "none"
            
            if days_until_expiry < 0:
                bird["license_alert"] = "expired"
            elif days_until_expiry <= 30:
                bird["license_alert"] = "critical"
    
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
    
    # Enrich with bird details and check license expiry
    for pair in pairs:
        male_bird = birds_collection.find_one({"id": pair["male_bird_id"]}, {"_id": 0})
        female_bird = birds_collection.find_one({"id": pair["female_bird_id"]}, {"_id": 0})
        pair["male_bird"] = male_bird
        pair["female_bird"] = female_bird
        
    # Check pair license expiry
        if pair.get("license_expiry"):
            expiry_date = datetime.strptime(pair["license_expiry"], "%Y-%m-%d")
            today = datetime.now()
            days_until_expiry = (expiry_date - today).days
            
            pair["days_until_expiry"] = days_until_expiry
            pair["license_alert"] = "none"
            
            if days_until_expiry < 0:
                pair["license_alert"] = "expired"
            elif days_until_expiry <= 30:
                pair["license_alert"] = "critical"
    
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

# Clutch endpoints
@app.post("/api/clutches")
async def create_clutch(clutch: Clutch):
    # Check if breeding pair exists
    pair = breeding_pairs_collection.find_one({"id": clutch.breeding_pair_id})
    if not pair:
        raise HTTPException(status_code=404, detail="Breeding pair not found")
    
    clutch_dict = clutch.dict()
    clutch_dict["id"] = str(uuid.uuid4())
    clutch_dict["created_at"] = datetime.now().isoformat()
    
    result = clutches_collection.insert_one(clutch_dict)
    if result.inserted_id:
        return {"message": "Clutch created successfully", "clutch_id": clutch_dict["id"]}
    raise HTTPException(status_code=500, detail="Failed to create clutch")

@app.get("/api/clutches")
async def get_clutches():
    clutches = list(clutches_collection.find({}, {"_id": 0}))
    
    # Enrich with breeding pair details
    for clutch in clutches:
        pair = breeding_pairs_collection.find_one({"id": clutch["breeding_pair_id"]}, {"_id": 0})
        if pair:
            male_bird = birds_collection.find_one({"id": pair["male_bird_id"]}, {"_id": 0})
            female_bird = birds_collection.find_one({"id": pair["female_bird_id"]}, {"_id": 0})
            pair["male_bird"] = male_bird
            pair["female_bird"] = female_bird
        clutch["breeding_pair"] = pair
    
    return {"clutches": clutches}

@app.get("/api/clutches/{clutch_id}")
async def get_clutch(clutch_id: str):
    clutch = clutches_collection.find_one({"id": clutch_id}, {"_id": 0})
    if not clutch:
        raise HTTPException(status_code=404, detail="Clutch not found")
    
    # Enrich with breeding pair details
    pair = breeding_pairs_collection.find_one({"id": clutch["breeding_pair_id"]}, {"_id": 0})
    if pair:
        male_bird = birds_collection.find_one({"id": pair["male_bird_id"]}, {"_id": 0})
        female_bird = birds_collection.find_one({"id": pair["female_bird_id"]}, {"_id": 0})
        pair["male_bird"] = male_bird
        pair["female_bird"] = female_bird
    clutch["breeding_pair"] = pair
    
    return clutch

@app.put("/api/clutches/{clutch_id}")
async def update_clutch(clutch_id: str, clutch: Clutch):
    clutch_dict = clutch.dict()
    clutch_dict["id"] = clutch_id
    
    result = clutches_collection.update_one(
        {"id": clutch_id}, 
        {"$set": clutch_dict}
    )
    if result.modified_count:
        return {"message": "Clutch updated successfully"}
    raise HTTPException(status_code=404, detail="Clutch not found")

# Chick endpoints
@app.post("/api/chicks")
async def create_chick(chick: Chick):
    # Check if clutch exists
    clutch = clutches_collection.find_one({"id": chick.clutch_id})
    if not clutch:
        raise HTTPException(status_code=404, detail="Clutch not found")
    
    chick_dict = chick.dict()
    chick_dict["id"] = str(uuid.uuid4())
    chick_dict["created_at"] = datetime.now().isoformat()
    
    result = chicks_collection.insert_one(chick_dict)
    if result.inserted_id:
        return {"message": "Chick created successfully", "chick_id": chick_dict["id"]}
    raise HTTPException(status_code=500, detail="Failed to create chick")

@app.get("/api/chicks")
async def get_chicks():
    chicks = list(chicks_collection.find({}, {"_id": 0}))
    
    # Enrich with clutch and breeding pair details
    for chick in chicks:
        clutch = clutches_collection.find_one({"id": chick["clutch_id"]}, {"_id": 0})
        if clutch:
            pair = breeding_pairs_collection.find_one({"id": clutch["breeding_pair_id"]}, {"_id": 0})
            if pair:
                male_bird = birds_collection.find_one({"id": pair["male_bird_id"]}, {"_id": 0})
                female_bird = birds_collection.find_one({"id": pair["female_bird_id"]}, {"_id": 0})
                pair["male_bird"] = male_bird
                pair["female_bird"] = female_bird
            clutch["breeding_pair"] = pair
        chick["clutch"] = clutch
        
        # Calculate age in days
        if chick.get("hatch_date"):
            hatch_date = datetime.strptime(chick["hatch_date"], "%Y-%m-%d")
            today = datetime.now()
            age_days = (today - hatch_date).days
            chick["age_days"] = age_days
    
    return {"chicks": chicks}

@app.get("/api/chicks/{chick_id}")
async def get_chick(chick_id: str):
    chick = chicks_collection.find_one({"id": chick_id}, {"_id": 0})
    if not chick:
        raise HTTPException(status_code=404, detail="Chick not found")
    
    # Enrich with clutch and breeding pair details
    clutch = clutches_collection.find_one({"id": chick["clutch_id"]}, {"_id": 0})
    if clutch:
        pair = breeding_pairs_collection.find_one({"id": clutch["breeding_pair_id"]}, {"_id": 0})
        if pair:
            male_bird = birds_collection.find_one({"id": pair["male_bird_id"]}, {"_id": 0})
            female_bird = birds_collection.find_one({"id": pair["female_bird_id"]}, {"_id": 0})
            pair["male_bird"] = male_bird
            pair["female_bird"] = female_bird
        clutch["breeding_pair"] = pair
    chick["clutch"] = clutch
    
    # Calculate age in days
    if chick.get("hatch_date"):
        hatch_date = datetime.strptime(chick["hatch_date"], "%Y-%m-%d")
        today = datetime.now()
        age_days = (today - hatch_date).days
        chick["age_days"] = age_days
    
    return chick

@app.put("/api/chicks/{chick_id}")
async def update_chick(chick_id: str, chick: Chick):
    chick_dict = chick.dict()
    chick_dict["id"] = chick_id
    
    result = chicks_collection.update_one(
        {"id": chick_id}, 
        {"$set": chick_dict}
    )
    if result.modified_count:
        return {"message": "Chick updated successfully"}
    raise HTTPException(status_code=404, detail="Chick not found")

# Transaction endpoints
@app.post("/api/transactions")
async def create_transaction(transaction: Transaction):
    transaction_dict = transaction.dict()
    transaction_dict["id"] = str(uuid.uuid4())
    transaction_dict["created_at"] = datetime.now().isoformat()
    
    result = transactions_collection.insert_one(transaction_dict)
    if result.inserted_id:
        return {"message": "Transaction created successfully", "transaction_id": transaction_dict["id"]}
    raise HTTPException(status_code=500, detail="Failed to create transaction")

@app.get("/api/transactions")
async def get_transactions():
    transactions = list(transactions_collection.find({}, {"_id": 0}))
    return {"transactions": transactions}

@app.get("/api/transactions/{transaction_id}")
async def get_transaction(transaction_id: str):
    transaction = transactions_collection.find_one({"id": transaction_id}, {"_id": 0})
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return transaction

@app.put("/api/transactions/{transaction_id}")
async def update_transaction(transaction_id: str, transaction: Transaction):
    transaction_dict = transaction.dict()
    transaction_dict["id"] = transaction_id
    
    result = transactions_collection.update_one(
        {"id": transaction_id}, 
        {"$set": transaction_dict}
    )
    if result.modified_count:
        return {"message": "Transaction updated successfully"}
    raise HTTPException(status_code=404, detail="Transaction not found")

@app.delete("/api/transactions/{transaction_id}")
async def delete_transaction(transaction_id: str):
    result = transactions_collection.delete_one({"id": transaction_id})
    if result.deleted_count:
        return {"message": "Transaction deleted successfully"}
    raise HTTPException(status_code=404, detail="Transaction not found")

# Breeding record endpoints (kept for backward compatibility)
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

# Reports endpoints
@app.get("/api/reports/breeding")
async def get_breeding_report():
    # Get all clutches and calculate statistics
    clutches = list(clutches_collection.find({}, {"_id": 0}))
    
    total_clutches = len(clutches)
    total_eggs = sum(clutch.get("eggs_laid", 0) for clutch in clutches)
    total_hatched = sum(clutch.get("hatched_count", 0) for clutch in clutches)
    
    overall_success_rate = (total_hatched / total_eggs * 100) if total_eggs > 0 else 0
    
    # Get breeding pairs performance
    pair_stats = []
    pairs = list(breeding_pairs_collection.find({}, {"_id": 0}))
    
    for pair in pairs:
        pair_clutches = [c for c in clutches if c["breeding_pair_id"] == pair["id"]]
        pair_eggs = sum(c.get("eggs_laid", 0) for c in pair_clutches)
        pair_hatched = sum(c.get("hatched_count", 0) for c in pair_clutches)
        pair_success_rate = (pair_hatched / pair_eggs * 100) if pair_eggs > 0 else 0
        
        male_bird = birds_collection.find_one({"id": pair["male_bird_id"]}, {"_id": 0})
        female_bird = birds_collection.find_one({"id": pair["female_bird_id"]}, {"_id": 0})
        
        pair_stats.append({
            "pair_name": pair["pair_name"],
            "male_bird": f"{male_bird['species']} - {male_bird.get('ring_number', 'No Ring')}" if male_bird else "Unknown",
            "female_bird": f"{female_bird['species']} - {female_bird.get('ring_number', 'No Ring')}" if female_bird else "Unknown",
            "clutches": len(pair_clutches),
            "eggs_laid": pair_eggs,
            "hatched": pair_hatched,
            "success_rate": round(pair_success_rate, 2)
        })
    
    # Species performance analysis
    species_stats = {}
    for pair in pairs:
        male_bird = birds_collection.find_one({"id": pair["male_bird_id"]}, {"_id": 0})
        female_bird = birds_collection.find_one({"id": pair["female_bird_id"]}, {"_id": 0})
        
        if male_bird and female_bird:
            species_key = f"{male_bird['species']} × {female_bird['species']}"
            if species_key not in species_stats:
                species_stats[species_key] = {"clutches": 0, "eggs": 0, "hatched": 0, "pairs": 0}
            
            species_stats[species_key]["pairs"] += 1
            pair_clutches = [c for c in clutches if c["breeding_pair_id"] == pair["id"]]
            species_stats[species_key]["clutches"] += len(pair_clutches)
            species_stats[species_key]["eggs"] += sum(c.get("eggs_laid", 0) for c in pair_clutches)
            species_stats[species_key]["hatched"] += sum(c.get("hatched_count", 0) for c in pair_clutches)
    
    # Calculate success rates for species
    for species in species_stats:
        if species_stats[species]["eggs"] > 0:
            species_stats[species]["success_rate"] = round(
                (species_stats[species]["hatched"] / species_stats[species]["eggs"]) * 100, 2
            )
        else:
            species_stats[species]["success_rate"] = 0
    
    return {
        "summary": {
            "total_clutches": total_clutches,
            "total_eggs": total_eggs,
            "total_hatched": total_hatched,
            "overall_success_rate": round(overall_success_rate, 2)
        },
        "pair_performance": pair_stats,
        "species_performance": species_stats
    }

@app.get("/api/genealogy/{bird_id}")
async def get_bird_genealogy(bird_id: str):
    """Get genealogy information for a bird"""
    def get_parents(bird_id):
        # Find clutch this bird came from
        chick = chicks_collection.find_one({"id": bird_id}, {"_id": 0})
        if not chick:
            return None
            
        clutch = clutches_collection.find_one({"id": chick["clutch_id"]}, {"_id": 0})
        if not clutch:
            return None
            
        pair = breeding_pairs_collection.find_one({"id": clutch["breeding_pair_id"]}, {"_id": 0})
        if not pair:
            return None
            
        male_bird = birds_collection.find_one({"id": pair["male_bird_id"]}, {"_id": 0})
        female_bird = birds_collection.find_one({"id": pair["female_bird_id"]}, {"_id": 0})
        
        return {
            "father": male_bird,
            "mother": female_bird,
            "breeding_pair": pair,
            "clutch": clutch
        }
    
    def get_offspring(bird_id):
        # Find all pairs this bird is part of
        pairs = list(breeding_pairs_collection.find({
            "$or": [{"male_bird_id": bird_id}, {"female_bird_id": bird_id}]
        }, {"_id": 0}))
        
        offspring = []
        for pair in pairs:
            clutches = list(clutches_collection.find({"breeding_pair_id": pair["id"]}, {"_id": 0}))
            for clutch in clutches:
                chicks = list(chicks_collection.find({"clutch_id": clutch["id"]}, {"_id": 0}))
                offspring.extend(chicks)
        
        return offspring
    
    bird = birds_collection.find_one({"id": bird_id}, {"_id": 0})
    if not bird:
        raise HTTPException(status_code=404, detail="Bird not found")
    
    parents = get_parents(bird_id)
    offspring = get_offspring(bird_id)
    
    return {
        "bird": bird,
        "parents": parents,
        "offspring": offspring
    }

# Search endpoints
@app.get("/api/search")
async def search_birds_and_pairs(
    query: str = "",
    species: str = "",
    status: str = "",
    search_type: str = "all"  # "birds", "pairs", "all"
):
    """Advanced search for birds and breeding pairs"""
    results = {"birds": [], "pairs": [], "clutches": []}
    
    if search_type in ["birds", "all"]:
        # Build bird search filter
        bird_filter = {}
        if query:
            bird_filter["$or"] = [
                {"species": {"$regex": query, "$options": "i"}},
                {"ring_number": {"$regex": query, "$options": "i"}},
                {"color_mutation": {"$regex": query, "$options": "i"}},
                {"notes": {"$regex": query, "$options": "i"}}
            ]
        if species:
            bird_filter["species"] = species
        if status:
            bird_filter["status"] = status
            
        results["birds"] = list(birds_collection.find(bird_filter, {"_id": 0}))
    
    if search_type in ["pairs", "all"]:
        # Search breeding pairs
        pair_filter = {}
        if query:
            pair_filter["$or"] = [
                {"pair_name": {"$regex": query, "$options": "i"}},
                {"notes": {"$regex": query, "$options": "i"}}
            ]
        if status:
            pair_filter["status"] = status
            
        pairs = list(breeding_pairs_collection.find(pair_filter, {"_id": 0}))
        
        # Enrich with bird details
        for pair in pairs:
            male_bird = birds_collection.find_one({"id": pair["male_bird_id"]}, {"_id": 0})
            female_bird = birds_collection.find_one({"id": pair["female_bird_id"]}, {"_id": 0})
            pair["male_bird"] = male_bird
            pair["female_bird"] = female_bird
            
        results["pairs"] = pairs
    
    # Search clutches if query provided
    if query and search_type in ["clutches", "all"]:
        clutches = list(clutches_collection.find({
            "$or": [
                {"notes": {"$regex": query, "$options": "i"}},
                {"status": {"$regex": query, "$options": "i"}}
            ]
        }, {"_id": 0}))
        
        # Enrich with pair details
        for clutch in clutches:
            pair = breeding_pairs_collection.find_one({"id": clutch["breeding_pair_id"]}, {"_id": 0})
            if pair:
                male_bird = birds_collection.find_one({"id": pair["male_bird_id"]}, {"_id": 0})
                female_bird = birds_collection.find_one({"id": pair["female_bird_id"]}, {"_id": 0})
                pair["male_bird"] = male_bird
                pair["female_bird"] = female_bird
            clutch["breeding_pair"] = pair
            
        results["clutches"] = clutches
    
    return results

@app.get("/api/notifications")
async def get_notifications():
    """Get upcoming hatching notifications and license alerts"""
    notifications = []
    today = datetime.now().date()
    
    # Hatching notifications (eggs due to hatch in next 7 days)
    clutches = list(clutches_collection.find({"status": "incubating"}, {"_id": 0}))
    
    for clutch in clutches:
        expected_hatch = datetime.strptime(clutch["expected_hatch_date"], "%Y-%m-%d").date()
        days_until_hatch = (expected_hatch - today).days
        
        if -1 <= days_until_hatch <= 7:  # Include 1 day overdue
            pair = breeding_pairs_collection.find_one({"id": clutch["breeding_pair_id"]}, {"_id": 0})
            
            notification_type = "overdue" if days_until_hatch < 0 else "due_soon" if days_until_hatch <= 2 else "upcoming"
            
            notifications.append({
                "type": "hatching",
                "priority": "high" if days_until_hatch <= 1 else "medium",
                "title": f"Eggs Due to Hatch",
                "message": f"{pair['pair_name'] if pair else 'Unknown Pair'} - Clutch #{clutch['clutch_number']}",
                "details": f"Expected: {expected_hatch.strftime('%b %d')} ({days_until_hatch} days)",
                "status": notification_type,
                "data": {
                    "clutch_id": clutch["id"],
                    "expected_date": clutch["expected_hatch_date"],
                    "days_until": days_until_hatch
                }
            })
    
    # License expiry notifications
    license_alerts = []
    
    # Check main license
    main_license = license_collection.find_one({}, {"_id": 0})
    if main_license and main_license.get("expiry_date"):
        expiry_date = datetime.strptime(main_license["expiry_date"], "%Y-%m-%d").date()
        days_until_expiry = (expiry_date - today).days
        
        if days_until_expiry <= 30:
            priority = "critical" if days_until_expiry <= 7 else "high" if days_until_expiry <= 30 else "medium"
            notifications.append({
                "type": "license",
                "priority": priority,
                "title": "License Expiring",
                "message": f"Main Breeding License",
                "details": f"Expires: {expiry_date.strftime('%b %d, %Y')} ({days_until_expiry} days)",
                "status": "expired" if days_until_expiry < 0 else "critical",
                "data": {
                    "license_type": "main",
                    "license_number": main_license.get("license_number"),
                    "expiry_date": main_license["expiry_date"],
                    "days_until": days_until_expiry
                }
            })
    
    # Sort notifications by priority and date
    priority_order = {"critical": 0, "high": 1, "medium": 2, "low": 3}
    notifications.sort(key=lambda x: (priority_order.get(x["priority"], 3), x["data"].get("days_until", 999)))
    
    return {
        "notifications": notifications,
        "counts": {
            "total": len(notifications),
            "critical": len([n for n in notifications if n["priority"] == "critical"]),
            "high": len([n for n in notifications if n["priority"] == "high"]),
            "hatching": len([n for n in notifications if n["type"] == "hatching"]),
            "license": len([n for n in notifications if n["type"] == "license"])
        }
    }

@app.get("/api/reports/financial")
async def get_financial_report():
    transactions = list(transactions_collection.find({}, {"_id": 0}))
    
    total_purchases = sum(t["amount"] for t in transactions if t["transaction_type"] == "purchase")
    total_sales = sum(t["amount"] for t in transactions if t["transaction_type"] == "sale")
    total_expenses = sum(t["amount"] for t in transactions if t["transaction_type"] == "expense")
    
    net_profit = total_sales - total_purchases - total_expenses
    
    # Expense breakdown
    expense_categories = {}
    for transaction in transactions:
        if transaction["transaction_type"] == "expense":
            category = transaction.get("category", "Other")
            expense_categories[category] = expense_categories.get(category, 0) + transaction["amount"]
    
    return {
        "summary": {
            "total_purchases": total_purchases,
            "total_sales": total_sales,
            "total_expenses": total_expenses,
            "net_profit": net_profit
        },
        "expense_breakdown": expense_categories
    }

# Dashboard endpoint
@app.get("/api/dashboard")
async def get_dashboard():
    # Get counts
    total_birds = birds_collection.count_documents({"status": "active"})
    total_pairs = breeding_pairs_collection.count_documents({"status": "active"})
    active_clutches = clutches_collection.count_documents({"status": {"$in": ["incubating", "hatching"]}})
    total_chicks = chicks_collection.count_documents({"status": "alive"})
    
    # Get recent clutches
    recent_clutches = list(clutches_collection.find(
        {}, {"_id": 0}
    ).sort("created_at", -1).limit(5))
    
    # Enrich recent clutches with pair details
    for clutch in recent_clutches:
        pair = breeding_pairs_collection.find_one({"id": clutch["breeding_pair_id"]}, {"_id": 0})
        if pair:
            male_bird = birds_collection.find_one({"id": pair["male_bird_id"]}, {"_id": 0})
            female_bird = birds_collection.find_one({"id": pair["female_bird_id"]}, {"_id": 0})
            pair["male_bird"] = male_bird
            pair["female_bird"] = female_bird
        clutch["breeding_pair"] = pair
    
    # Get license alerts
    license_alerts = []
    
    # Check main license
    main_license = await get_license()
    if main_license and main_license.get("alert_level") != "none":
        license_alerts.append({
            "type": "main",
            "name": "Main Breeding License",
            "license_number": main_license.get("license_number"),
            "expiry_date": main_license.get("expiry_date"),
            "days_until_expiry": main_license.get("days_until_expiry"),
            "alert_level": main_license.get("alert_level")
        })
    
    # Check bird licenses
    birds = list(birds_collection.find({"license_expiry": {"$exists": True, "$ne": None}}, {"_id": 0}))
    for bird in birds:
        if bird.get("license_expiry"):
            expiry_date = datetime.strptime(bird["license_expiry"], "%Y-%m-%d")
            today = datetime.now()
            days_until_expiry = (expiry_date - today).days
            
            if days_until_expiry <= 30:
                alert_level = "expired" if days_until_expiry < 0 else "critical"
                license_alerts.append({
                    "type": "bird",
                    "name": f"{bird['species']} - {bird.get('ring_number', 'No Ring')}",
                    "license_number": bird.get("license_number"),
                    "expiry_date": bird["license_expiry"],
                    "days_until_expiry": days_until_expiry,
                    "alert_level": alert_level
                })
    
    # Check pair licenses
    pairs = list(breeding_pairs_collection.find({"license_expiry": {"$exists": True, "$ne": None}}, {"_id": 0}))
    for pair in pairs:
        if pair.get("license_expiry"):
            expiry_date = datetime.strptime(pair["license_expiry"], "%Y-%m-%d")
            today = datetime.now()
            days_until_expiry = (expiry_date - today).days
            
            if days_until_expiry <= 30:
                alert_level = "expired" if days_until_expiry < 0 else "critical"
                license_alerts.append({
                    "type": "pair",
                    "name": pair["pair_name"],
                    "license_number": pair.get("license_number"),
                    "expiry_date": pair["license_expiry"],
                    "days_until_expiry": days_until_expiry,
                    "alert_level": alert_level
                })
    
    # Get financial summary
    transactions = list(transactions_collection.find({}, {"_id": 0}))
    total_revenue = sum(t["amount"] for t in transactions if t["transaction_type"] == "sale")
    total_expenses = sum(t["amount"] for t in transactions if t["transaction_type"] == "expense")
    
    return {
        "stats": {
            "total_birds": total_birds,
            "total_pairs": total_pairs,
            "active_clutches": active_clutches,
            "total_chicks": total_chicks,
            "total_revenue": total_revenue,
            "total_expenses": total_expenses
        },
        "recent_clutches": recent_clutches,
        "license_alerts": license_alerts
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)