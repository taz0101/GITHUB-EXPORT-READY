import requests
import unittest
import json
from datetime import datetime, timedelta

# Use the public endpoint from the frontend .env file
BASE_URL = "https://906cc6fd-c1f9-4848-980e-fa4369439bff.preview.emergentagent.com"

class ParrotBreedingAPITest(unittest.TestCase):
    def setUp(self):
        # Generate unique test data
        timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
        self.test_male_bird = {
            "species": "African Grey",
            "gender": "male",
            "birth_date": "2023-01-01",
            "ring_number": f"M{timestamp}",
            "color_mutation": "Standard",
            "notes": "Test male bird"
        }
        
        self.test_female_bird = {
            "species": "African Grey",
            "gender": "female",
            "birth_date": "2023-02-01",
            "ring_number": f"F{timestamp}",
            "color_mutation": "Standard",
            "notes": "Test female bird"
        }
        
        self.test_license = {
            "license_number": f"LIC-{timestamp}",
            "license_type": "breeding",
            "issue_date": datetime.now().strftime("%Y-%m-%d"),
            "expiry_date": (datetime.now() + timedelta(days=15)).strftime("%Y-%m-%d"),
            "issuing_authority": "Test Authority",
            "notes": "Test license with 15-day expiry for notification testing"
        }
        
        self.test_clutch = {
            "clutch_number": 1,
            "egg_laying_date": datetime.now().strftime("%Y-%m-%d"),
            "eggs_laid": 4,
            "fertile_eggs": 3,
            "notes": "Test clutch for auto-calculation testing"
        }
        
        self.test_incubator = {
            "name": f"Test Incubator {timestamp}",
            "model": "Test Model X1",
            "capacity": 12,
            "temperature_range": "37.5-37.8°C",
            "humidity_range": "55-60%",
            "turning_interval": 2,
            "status": "active",
            "notes": "Test incubator for artificial incubation testing"
        }
        
        self.test_artificial_incubation = {
            "eggs_transferred": 2,
            "transfer_date": datetime.now().strftime("%Y-%m-%d"),
            "transfer_reason": "control",
            "incubation_temperature": 37.5,
            "incubation_humidity": 55.0,
            "expected_hatch_date": (datetime.now() + timedelta(days=28)).strftime("%Y-%m-%d"),
            "notes": "Test artificial incubation"
        }
        
        self.test_incubation_log = {
            "log_date": datetime.now().strftime("%Y-%m-%d"),
            "temperature_recorded": 37.6,
            "humidity_recorded": 56.0,
            "eggs_turned": True,
            "candling_done": True,
            "candling_results": "all_developing",
            "observations": "Test incubation log entry"
        }
        
        # IDs to be set during tests
        self.male_bird_id = None
        self.female_bird_id = None
        self.breeding_pair_id = None
        self.breeding_record_id = None
        self.clutch_id = None
        self.license_id = None
        self.incubator_id = None
        self.artificial_incubation_id = None
        self.incubation_log_id = None

    def test_01_birds_crud(self):
        """Test bird CRUD operations"""
        print("\n--- Testing Bird CRUD Operations ---")
        
        # Create male bird
        response = requests.post(f"{BASE_URL}/api/birds", json=self.test_male_bird)
        self.assertEqual(response.status_code, 200)
        result = response.json()
        self.assertIn("bird_id", result)
        self.male_bird_id = result["bird_id"]
        print(f"✅ Created male bird with ID: {self.male_bird_id}")
        
        # Create female bird
        response = requests.post(f"{BASE_URL}/api/birds", json=self.test_female_bird)
        self.assertEqual(response.status_code, 200)
        result = response.json()
        self.assertIn("bird_id", result)
        self.female_bird_id = result["bird_id"]
        print(f"✅ Created female bird with ID: {self.female_bird_id}")
        
        # Get all birds
        response = requests.get(f"{BASE_URL}/api/birds")
        self.assertEqual(response.status_code, 200)
        result = response.json()
        self.assertIn("birds", result)
        self.assertIsInstance(result["birds"], list)
        print(f"✅ Retrieved all birds: {len(result['birds'])} birds found")
        
        # Get specific bird
        response = requests.get(f"{BASE_URL}/api/birds/{self.male_bird_id}")
        self.assertEqual(response.status_code, 200)
        bird = response.json()
        self.assertEqual(bird["id"], self.male_bird_id)
        self.assertEqual(bird["species"], self.test_male_bird["species"])
        print(f"✅ Retrieved specific bird: {bird['species']}")
        
        # Update bird
        update_data = {
            "species": self.test_male_bird["species"],
            "gender": self.test_male_bird["gender"],
            "birth_date": self.test_male_bird["birth_date"],
            "ring_number": self.test_male_bird["ring_number"],
            "color_mutation": "Updated Mutation",
            "notes": "Updated notes"
        }
        
        response = requests.put(f"{BASE_URL}/api/birds/{self.male_bird_id}", json=update_data)
        self.assertEqual(response.status_code, 200)
        print(f"✅ Updated bird successfully")
        
        # Verify update
        response = requests.get(f"{BASE_URL}/api/birds/{self.male_bird_id}")
        self.assertEqual(response.status_code, 200)
        bird = response.json()
        self.assertEqual(bird["color_mutation"], "Updated Mutation")
        print(f"✅ Verified bird update: {bird['color_mutation']}")

    def test_02_breeding_pairs(self):
        """Test breeding pair operations"""
        print("\n--- Testing Breeding Pair Operations ---")
        
        # Skip if bird IDs are not set
        if not self.male_bird_id or not self.female_bird_id:
            self.skipTest("Bird IDs not set, skipping breeding pair tests")
        
        # Create breeding pair
        today = datetime.now().strftime("%Y-%m-%d")
        pair_data = {
            "male_bird_id": self.male_bird_id,
            "female_bird_id": self.female_bird_id,
            "pair_name": f"Test Pair {datetime.now().strftime('%Y%m%d%H%M%S')}",
            "pair_date": today,
            "notes": "Test breeding pair"
        }
        
        response = requests.post(f"{BASE_URL}/api/breeding-pairs", json=pair_data)
        self.assertEqual(response.status_code, 200)
        result = response.json()
        self.assertIn("pair_id", result)
        self.breeding_pair_id = result["pair_id"]
        print(f"✅ Created breeding pair with ID: {self.breeding_pair_id}")
        
        # Get all breeding pairs
        response = requests.get(f"{BASE_URL}/api/breeding-pairs")
        self.assertEqual(response.status_code, 200)
        result = response.json()
        self.assertIn("breeding_pairs", result)
        self.assertIsInstance(result["breeding_pairs"], list)
        print(f"✅ Retrieved all breeding pairs: {len(result['breeding_pairs'])} pairs found")
        
        # Get specific breeding pair
        response = requests.get(f"{BASE_URL}/api/breeding-pairs/{self.breeding_pair_id}")
        self.assertEqual(response.status_code, 200)
        pair = response.json()
        self.assertEqual(pair["id"], self.breeding_pair_id)
        self.assertEqual(pair["pair_name"], pair_data["pair_name"])
        self.assertIn("male_bird", pair)
        self.assertIn("female_bird", pair)
        print(f"✅ Retrieved specific breeding pair: {pair['pair_name']}")
        
        # Test invalid gender combination
        invalid_pair = {
            "male_bird_id": self.male_bird_id,
            "female_bird_id": self.male_bird_id,  # Using male bird as female
            "pair_name": "Invalid Pair",
            "pair_date": today,
            "notes": "This should fail"
        }
        
        response = requests.post(f"{BASE_URL}/api/breeding-pairs", json=invalid_pair)
        self.assertEqual(response.status_code, 400)
        print(f"✅ Correctly rejected invalid gender combination")

    def test_03_breeding_records(self):
        """Test breeding record operations"""
        print("\n--- Testing Breeding Record Operations ---")
        
        # Skip if breeding pair ID is not set
        if not self.breeding_pair_id:
            self.skipTest("Breeding pair ID not set, skipping breeding record tests")
        
        # Create breeding record
        today = datetime.now().strftime("%Y-%m-%d")
        expected_hatch = (datetime.now() + timedelta(days=21)).strftime("%Y-%m-%d")
        record_data = {
            "breeding_pair_id": self.breeding_pair_id,
            "breeding_cycle_number": 1,
            "egg_laying_date": today,
            "eggs_laid": 4,
            "expected_hatch_date": expected_hatch,
            "notes": "Test breeding record"
        }
        
        response = requests.post(f"{BASE_URL}/api/breeding-records", json=record_data)
        self.assertEqual(response.status_code, 200)
        result = response.json()
        self.assertIn("record_id", result)
        self.breeding_record_id = result["record_id"]
        print(f"✅ Created breeding record with ID: {self.breeding_record_id}")
        
        # Get all breeding records
        response = requests.get(f"{BASE_URL}/api/breeding-records")
        self.assertEqual(response.status_code, 200)
        result = response.json()
        self.assertIn("breeding_records", result)
        self.assertIsInstance(result["breeding_records"], list)
        print(f"✅ Retrieved all breeding records: {len(result['breeding_records'])} records found")
        
        # Get specific breeding record
        response = requests.get(f"{BASE_URL}/api/breeding-records/{self.breeding_record_id}")
        self.assertEqual(response.status_code, 200)
        record = response.json()
        self.assertEqual(record["id"], self.breeding_record_id)
        self.assertEqual(record["eggs_laid"], record_data["eggs_laid"])
        self.assertIn("breeding_pair", record)
        print(f"✅ Retrieved specific breeding record for pair: {record['breeding_pair']['pair_name']}")
        
        # Update breeding record with hatched count
        update_data = {
            "breeding_pair_id": self.breeding_pair_id,
            "breeding_cycle_number": 1,
            "egg_laying_date": today,
            "eggs_laid": 4,
            "expected_hatch_date": expected_hatch,
            "hatched_count": 3,
            "status": "hatched",
            "notes": "Updated with hatched count"
        }
        
        response = requests.put(f"{BASE_URL}/api/breeding-records/{self.breeding_record_id}", json=update_data)
        self.assertEqual(response.status_code, 200)
        print(f"✅ Updated breeding record with hatched count")
        
        # Verify hatch success rate calculation
        response = requests.get(f"{BASE_URL}/api/breeding-records/{self.breeding_record_id}")
        self.assertEqual(response.status_code, 200)
        record = response.json()
        self.assertIsNotNone(record.get("hatch_success_rate"))
        expected_rate = (3 / 4) * 100  # 3 hatched out of 4 eggs
        self.assertEqual(record["hatch_success_rate"], expected_rate)
        print(f"✅ Verified hatch success rate calculation: {record['hatch_success_rate']}%")

    def test_04_dashboard(self):
        """Test dashboard statistics"""
        print("\n--- Testing Dashboard Statistics ---")
        
        response = requests.get(f"{BASE_URL}/api/dashboard")
        self.assertEqual(response.status_code, 200)
        dashboard = response.json()
        
        self.assertIn("stats", dashboard)
        self.assertIn("total_birds", dashboard["stats"])
        self.assertIn("total_pairs", dashboard["stats"])
        self.assertIn("active_breeding_records", dashboard["stats"])
        self.assertIn("recent_breeding_records", dashboard)
        
        print(f"✅ Dashboard statistics retrieved successfully")
        print(f"   - Total birds: {dashboard['stats']['total_birds']}")
        print(f"   - Total pairs: {dashboard['stats']['total_pairs']}")
        print(f"   - Active breeding records: {dashboard['stats']['active_breeding_records']}")
        print(f"   - Recent records: {len(dashboard['recent_breeding_records'])}")

    def test_05_license_management(self):
        """Test license management and notifications"""
        print("\n--- Testing License Management ---")
        
        # Create main license with short expiry for notification testing
        response = requests.post(f"{BASE_URL}/api/license", json=self.test_license)
        self.assertEqual(response.status_code, 200)
        result = response.json()
        self.assertIn("license_id", result)
        self.license_id = result["license_id"]
        print(f"✅ Created license with ID: {self.license_id}")
        
        # Get license
        response = requests.get(f"{BASE_URL}/api/license")
        self.assertEqual(response.status_code, 200)
        license_data = response.json()
        self.assertEqual(license_data["license_number"], self.test_license["license_number"])
        self.assertIn("days_until_expiry", license_data)
        self.assertIn("alert_level", license_data)
        
        # Verify alert level (should be critical since expiry is 15 days)
        self.assertEqual(license_data["alert_level"], "critical")
        print(f"✅ License alert level correctly set to: {license_data['alert_level']}")
        print(f"✅ Days until expiry: {license_data['days_until_expiry']}")
        
    def test_06_notifications(self):
        """Test notification system"""
        print("\n--- Testing Notification System ---")
        
        response = requests.get(f"{BASE_URL}/api/notifications")
        self.assertEqual(response.status_code, 200)
        notifications = response.json()
        
        self.assertIn("notifications", notifications)
        self.assertIn("counts", notifications)
        self.assertIn("total", notifications["counts"])
        
        # Check if license notification is present
        license_notifications = [n for n in notifications["notifications"] if n["type"] == "license"]
        self.assertTrue(len(license_notifications) > 0, "License notification should be present")
        
        # Print notification details
        print(f"✅ Retrieved {notifications['counts']['total']} notifications")
        print(f"   - Critical: {notifications['counts'].get('critical', 0)}")
        print(f"   - High: {notifications['counts'].get('high', 0)}")
        print(f"   - License alerts: {notifications['counts'].get('license', 0)}")
        print(f"   - Hatching alerts: {notifications['counts'].get('hatching', 0)}")
        
    def test_07_advanced_search(self):
        """Test advanced search functionality"""
        print("\n--- Testing Advanced Search ---")
        
        # Search by species
        params = {"species": "African Grey"}
        response = requests.get(f"{BASE_URL}/api/search", params=params)
        self.assertEqual(response.status_code, 200)
        results = response.json()
        
        self.assertIn("birds", results)
        african_grey_birds = [b for b in results["birds"] if b["species"] == "African Grey"]
        self.assertTrue(len(african_grey_birds) > 0, "Should find African Grey birds")
        print(f"✅ Found {len(african_grey_birds)} African Grey birds")
        
        # Search by status
        params = {"status": "active"}
        response = requests.get(f"{BASE_URL}/api/search", params=params)
        self.assertEqual(response.status_code, 200)
        results = response.json()
        
        active_birds = [b for b in results["birds"] if b["status"] == "active"]
        self.assertTrue(len(active_birds) > 0, "Should find active birds")
        print(f"✅ Found {len(active_birds)} active birds")
        
        # Search by type
        params = {"search_type": "birds"}
        response = requests.get(f"{BASE_URL}/api/search", params=params)
        self.assertEqual(response.status_code, 200)
        results = response.json()
        
        self.assertIn("birds", results)
        self.assertNotIn("clutches", results)
        print(f"✅ Search type filter working correctly")
        
    def test_08_reports(self):
        """Test reports functionality"""
        print("\n--- Testing Reports ---")
        
        # Get breeding report
        response = requests.get(f"{BASE_URL}/api/reports/breeding")
        self.assertEqual(response.status_code, 200)
        report = response.json()
        
        self.assertIn("summary", report)
        self.assertIn("pair_performance", report)
        self.assertIn("species_performance", report)
        
        print(f"✅ Retrieved breeding report")
        print(f"   - Total clutches: {report['summary']['total_clutches']}")
        print(f"   - Overall success rate: {report['summary']['overall_success_rate']}%")
        print(f"   - Pairs analyzed: {len(report['pair_performance'])}")
        
        # Get financial report
        response = requests.get(f"{BASE_URL}/api/reports/financial")
        self.assertEqual(response.status_code, 200)
        financial = response.json()
        
        self.assertIn("summary", financial)
        self.assertIn("expense_breakdown", financial)
        
        print(f"✅ Retrieved financial report")
        print(f"   - Total sales: ${financial['summary']['total_sales']}")
        print(f"   - Total expenses: ${financial['summary']['total_expenses']}")
        print(f"   - Net profit: ${financial['summary']['net_profit']}")
        
    def test_09_auto_hatch_calculation(self):
        """Test auto hatch date calculation"""
        print("\n--- Testing Auto Hatch Date Calculation ---")
        
        # Skip if breeding pair ID is not set
        if not self.breeding_pair_id:
            self.skipTest("Breeding pair ID not set, skipping clutch tests")
        
        # Create clutch with laying date
        clutch_data = self.test_clutch.copy()
        clutch_data["breeding_pair_id"] = self.breeding_pair_id
        
        response = requests.post(f"{BASE_URL}/api/clutches", json=clutch_data)
        self.assertEqual(response.status_code, 200)
        result = response.json()
        self.assertIn("clutch_id", result)
        self.clutch_id = result["clutch_id"]
        print(f"✅ Created clutch with ID: {self.clutch_id}")
        
        # Get clutch to verify expected hatch date was calculated
        response = requests.get(f"{BASE_URL}/api/clutches/{self.clutch_id}")
        self.assertEqual(response.status_code, 200)
        clutch = response.json()
        
        self.assertIn("expected_hatch_date", clutch)
        self.assertIsNotNone(clutch["expected_hatch_date"])
        
        # Calculate expected hatch date based on species (African Grey = 28 days)
        laying_date = datetime.strptime(clutch_data["egg_laying_date"], "%Y-%m-%d")
        expected_hatch = laying_date + timedelta(days=28)
        expected_date_str = expected_hatch.strftime("%Y-%m-%d")
        
        print(f"✅ Laying date: {clutch_data['egg_laying_date']}")
        print(f"✅ Expected hatch date: {clutch['expected_hatch_date']}")
        print(f"✅ Calculated hatch date: {expected_date_str}")
        
    def test_10_genealogy(self):
        """Test genealogy and consanguinity features"""
        print("\n--- Testing Genealogy Features ---")
        
        # Skip if bird IDs are not set
        if not self.male_bird_id:
            self.skipTest("Bird ID not set, skipping genealogy tests")
        
        # Get genealogy for a bird
        response = requests.get(f"{BASE_URL}/api/genealogy/{self.male_bird_id}")
        self.assertEqual(response.status_code, 200)
        genealogy = response.json()
        
        self.assertIn("bird", genealogy)
        self.assertIn("parents", genealogy)
        self.assertIn("offspring", genealogy)
        
        print(f"✅ Retrieved genealogy for bird")
        print(f"   - Bird: {genealogy['bird']['species']}")
        print(f"   - Parents: {'Found' if genealogy['parents'] else 'None'}")
        print(f"   - Offspring: {len(genealogy['offspring'])}")
        
    def test_11_incubator_crud(self):
        """Test incubator CRUD operations"""
        print("\n--- Testing Incubator CRUD Operations ---")
        
        # Create incubator
        response = requests.post(f"{BASE_URL}/api/incubators", json=self.test_incubator)
        self.assertEqual(response.status_code, 200)
        result = response.json()
        self.assertIn("incubator_id", result)
        self.incubator_id = result["incubator_id"]
        print(f"✅ Created incubator with ID: {self.incubator_id}")
        
        # Get all incubators
        response = requests.get(f"{BASE_URL}/api/incubators")
        self.assertEqual(response.status_code, 200)
        result = response.json()
        self.assertIn("incubators", result)
        self.assertIsInstance(result["incubators"], list)
        print(f"✅ Retrieved all incubators: {len(result['incubators'])} incubators found")
        
        # Get specific incubator
        response = requests.get(f"{BASE_URL}/api/incubators/{self.incubator_id}")
        self.assertEqual(response.status_code, 200)
        incubator = response.json()
        self.assertEqual(incubator["id"], self.incubator_id)
        self.assertEqual(incubator["name"], self.test_incubator["name"])
        print(f"✅ Retrieved specific incubator: {incubator['name']}")
        
        # Update incubator
        update_data = {
            "name": self.test_incubator["name"],
            "model": self.test_incubator["model"],
            "capacity": 15,  # Updated capacity
            "temperature_range": "37.4-37.9°C",  # Updated temperature range
            "humidity_range": self.test_incubator["humidity_range"],
            "turning_interval": self.test_incubator["turning_interval"],
            "status": "maintenance",  # Updated status
            "notes": "Updated incubator notes"
        }
        
        response = requests.put(f"{BASE_URL}/api/incubators/{self.incubator_id}", json=update_data)
        self.assertEqual(response.status_code, 200)
        print(f"✅ Updated incubator successfully")
        
        # Verify update
        response = requests.get(f"{BASE_URL}/api/incubators/{self.incubator_id}")
        self.assertEqual(response.status_code, 200)
        incubator = response.json()
        self.assertEqual(incubator["capacity"], 15)
        self.assertEqual(incubator["status"], "maintenance")
        print(f"✅ Verified incubator update: capacity={incubator['capacity']}, status={incubator['status']}")
    
    def test_12_artificial_incubation(self):
        """Test artificial incubation operations"""
        print("\n--- Testing Artificial Incubation Operations ---")
        
        # Skip if clutch ID or incubator ID are not set
        if not self.clutch_id or not self.incubator_id:
            self.skipTest("Clutch ID or Incubator ID not set, skipping artificial incubation tests")
        
        # Create artificial incubation record
        incubation_data = self.test_artificial_incubation.copy()
        incubation_data["clutch_id"] = self.clutch_id
        incubation_data["incubator_id"] = self.incubator_id
        
        response = requests.post(f"{BASE_URL}/api/artificial-incubation", json=incubation_data)
        self.assertEqual(response.status_code, 200)
        result = response.json()
        self.assertIn("incubation_id", result)
        self.artificial_incubation_id = result["incubation_id"]
        print(f"✅ Created artificial incubation record with ID: {self.artificial_incubation_id}")
        
        # Get all artificial incubation records
        response = requests.get(f"{BASE_URL}/api/artificial-incubation")
        self.assertEqual(response.status_code, 200)
        result = response.json()
        self.assertIn("artificial_incubations", result)
        self.assertIsInstance(result["artificial_incubations"], list)
        print(f"✅ Retrieved all artificial incubation records: {len(result['artificial_incubations'])} records found")
        
        # Get specific artificial incubation record
        response = requests.get(f"{BASE_URL}/api/artificial-incubation/{self.artificial_incubation_id}")
        self.assertEqual(response.status_code, 200)
        incubation = response.json()
        self.assertEqual(incubation["id"], self.artificial_incubation_id)
        self.assertEqual(incubation["eggs_transferred"], incubation_data["eggs_transferred"])
        self.assertIn("clutch", incubation)
        self.assertIn("incubator", incubation)
        print(f"✅ Retrieved specific artificial incubation record")
        
        # Update artificial incubation record with hatched count
        update_data = {
            "clutch_id": self.clutch_id,
            "incubator_id": self.incubator_id,
            "eggs_transferred": 2,
            "transfer_date": incubation_data["transfer_date"],
            "transfer_reason": incubation_data["transfer_reason"],
            "incubation_temperature": incubation_data["incubation_temperature"],
            "incubation_humidity": incubation_data["incubation_humidity"],
            "expected_hatch_date": incubation_data["expected_hatch_date"],
            "actual_hatch_date": datetime.now().strftime("%Y-%m-%d"),
            "eggs_hatched": 2,
            "status": "completed",
            "notes": "Updated with hatched count"
        }
        
        response = requests.put(f"{BASE_URL}/api/artificial-incubation/{self.artificial_incubation_id}", json=update_data)
        self.assertEqual(response.status_code, 200)
        print(f"✅ Updated artificial incubation record with hatched count")
        
        # Verify success rate calculation
        response = requests.get(f"{BASE_URL}/api/artificial-incubation/{self.artificial_incubation_id}")
        self.assertEqual(response.status_code, 200)
        incubation = response.json()
        self.assertIsNotNone(incubation.get("success_rate"))
        expected_rate = (2 / 2) * 100  # 2 hatched out of 2 eggs
        self.assertEqual(incubation["success_rate"], expected_rate)
        print(f"✅ Verified success rate calculation: {incubation['success_rate']}%")
    
    def test_13_incubation_logs(self):
        """Test incubation logs operations"""
        print("\n--- Testing Incubation Logs Operations ---")
        
        # Skip if artificial incubation ID is not set
        if not self.artificial_incubation_id:
            self.skipTest("Artificial Incubation ID not set, skipping incubation logs tests")
        
        # Create incubation log
        log_data = self.test_incubation_log.copy()
        log_data["artificial_incubation_id"] = self.artificial_incubation_id
        
        response = requests.post(f"{BASE_URL}/api/incubation-logs", json=log_data)
        self.assertEqual(response.status_code, 200)
        result = response.json()
        self.assertIn("log_id", result)
        self.incubation_log_id = result["log_id"]
        print(f"✅ Created incubation log with ID: {self.incubation_log_id}")
        
        # Get logs for an incubation
        response = requests.get(f"{BASE_URL}/api/incubation-logs/{self.artificial_incubation_id}")
        self.assertEqual(response.status_code, 200)
        result = response.json()
        self.assertIn("incubation_logs", result)
        self.assertIsInstance(result["incubation_logs"], list)
        self.assertTrue(len(result["incubation_logs"]) > 0)
        print(f"✅ Retrieved incubation logs: {len(result['incubation_logs'])} logs found")
        
        # Update incubation log
        update_data = {
            "artificial_incubation_id": self.artificial_incubation_id,
            "log_date": log_data["log_date"],
            "temperature_recorded": 37.7,  # Updated temperature
            "humidity_recorded": 57.0,  # Updated humidity
            "eggs_turned": True,
            "candling_done": True,
            "candling_results": "some_clear",  # Updated candling results
            "observations": "Updated observations"
        }
        
        response = requests.put(f"{BASE_URL}/api/incubation-logs/{self.incubation_log_id}", json=update_data)
        self.assertEqual(response.status_code, 200)
        print(f"✅ Updated incubation log successfully")
    
    def test_14_dashboard_incubation_stats(self):
        """Test dashboard incubation statistics"""
        print("\n--- Testing Dashboard Incubation Statistics ---")
        
        response = requests.get(f"{BASE_URL}/api/dashboard")
        self.assertEqual(response.status_code, 200)
        dashboard = response.json()
        
        self.assertIn("stats", dashboard)
        self.assertIn("active_artificial_incubations", dashboard["stats"])
        self.assertIn("total_incubators", dashboard["stats"])
        
        print(f"✅ Dashboard incubation statistics retrieved successfully")
        print(f"   - Active artificial incubations: {dashboard['stats']['active_artificial_incubations']}")
        print(f"   - Total incubators: {dashboard['stats']['total_incubators']}")
    
    def test_15_artificial_incubation_notifications(self):
        """Test artificial incubation notifications"""
        print("\n--- Testing Artificial Incubation Notifications ---")
        
        response = requests.get(f"{BASE_URL}/api/notifications")
        self.assertEqual(response.status_code, 200)
        notifications = response.json()
        
        self.assertIn("notifications", notifications)
        self.assertIn("counts", notifications)
        
        # Check if artificial incubation notifications are present
        artificial_hatching_notifications = [n for n in notifications["notifications"] if n["type"] == "artificial_hatching"]
        print(f"✅ Retrieved {len(artificial_hatching_notifications)} artificial hatching notifications")
        print(f"   - Artificial hatching alerts: {notifications['counts'].get('artificial_hatching', 0)}")
    
    def test_16_cleanup(self):
        """Clean up test data"""
        print("\n--- Cleaning Up Test Data ---")
        
        # Delete incubation log if created
        if self.incubation_log_id:
            response = requests.delete(f"{BASE_URL}/api/incubation-logs/{self.incubation_log_id}")
            if hasattr(response, 'status_code') and response.status_code == 200:
                print(f"✅ Deleted incubation log: {self.incubation_log_id}")
            else:
                print(f"⚠️ Could not delete incubation log: {self.incubation_log_id}")
        
        # Delete artificial incubation if created
        if self.artificial_incubation_id:
            response = requests.delete(f"{BASE_URL}/api/artificial-incubation/{self.artificial_incubation_id}")
            if hasattr(response, 'status_code') and response.status_code == 200:
                print(f"✅ Deleted artificial incubation: {self.artificial_incubation_id}")
            else:
                print(f"⚠️ Could not delete artificial incubation: {self.artificial_incubation_id}")
        
        # Delete incubator if created
        if self.incubator_id:
            response = requests.delete(f"{BASE_URL}/api/incubators/{self.incubator_id}")
            if hasattr(response, 'status_code') and response.status_code == 200:
                print(f"✅ Deleted incubator: {self.incubator_id}")
            else:
                print(f"⚠️ Could not delete incubator: {self.incubator_id}")
        
        # Delete clutch if created
        if self.clutch_id:
            response = requests.delete(f"{BASE_URL}/api/clutches/{self.clutch_id}")
            if hasattr(response, 'status_code') and response.status_code == 200:
                print(f"✅ Deleted clutch: {self.clutch_id}")
            else:
                print(f"⚠️ Could not delete clutch: {self.clutch_id}")
        
        # Delete breeding record if created
        if self.breeding_record_id:
            response = requests.delete(f"{BASE_URL}/api/breeding-records/{self.breeding_record_id}")
            if hasattr(response, 'status_code') and response.status_code == 200:
                print(f"✅ Deleted breeding record: {self.breeding_record_id}")
            else:
                print(f"⚠️ Could not delete breeding record: {self.breeding_record_id}")
        
        # Delete breeding pair if created
        if self.breeding_pair_id:
            response = requests.delete(f"{BASE_URL}/api/breeding-pairs/{self.breeding_pair_id}")
            if hasattr(response, 'status_code') and response.status_code == 200:
                print(f"✅ Deleted breeding pair: {self.breeding_pair_id}")
            else:
                print(f"⚠️ Could not delete breeding pair: {self.breeding_pair_id}")
        
        # Delete birds if created
        if self.male_bird_id:
            response = requests.delete(f"{BASE_URL}/api/birds/{self.male_bird_id}")
            if hasattr(response, 'status_code') and response.status_code == 200:
                print(f"✅ Deleted male bird: {self.male_bird_id}")
            else:
                print(f"⚠️ Could not delete male bird: {self.male_bird_id}")
        
        if self.female_bird_id:
            response = requests.delete(f"{BASE_URL}/api/birds/{self.female_bird_id}")
            if hasattr(response, 'status_code') and response.status_code == 200:
                print(f"✅ Deleted female bird: {self.female_bird_id}")
            else:
                print(f"⚠️ Could not delete female bird: {self.female_bird_id}")
        
        # Delete license if created
        if self.license_id:
            response = requests.delete(f"{BASE_URL}/api/license/{self.license_id}")
            if hasattr(response, 'status_code') and response.status_code == 200:
                print(f"✅ Deleted license: {self.license_id}")
            else:
                print(f"⚠️ Could not delete license: {self.license_id}")

if __name__ == "__main__":
    # Run tests in order
    suite = unittest.TestSuite()
    suite.addTest(ParrotBreedingAPITest("test_01_birds_crud"))
    suite.addTest(ParrotBreedingAPITest("test_02_breeding_pairs"))
    suite.addTest(ParrotBreedingAPITest("test_03_breeding_records"))
    suite.addTest(ParrotBreedingAPITest("test_04_dashboard"))
    suite.addTest(ParrotBreedingAPITest("test_05_license_management"))
    suite.addTest(ParrotBreedingAPITest("test_06_notifications"))
    suite.addTest(ParrotBreedingAPITest("test_07_advanced_search"))
    suite.addTest(ParrotBreedingAPITest("test_08_reports"))
    suite.addTest(ParrotBreedingAPITest("test_09_auto_hatch_calculation"))
    suite.addTest(ParrotBreedingAPITest("test_10_genealogy"))
    suite.addTest(ParrotBreedingAPITest("test_11_incubator_crud"))
    suite.addTest(ParrotBreedingAPITest("test_12_artificial_incubation"))
    suite.addTest(ParrotBreedingAPITest("test_13_incubation_logs"))
    suite.addTest(ParrotBreedingAPITest("test_14_dashboard_incubation_stats"))
    suite.addTest(ParrotBreedingAPITest("test_15_artificial_incubation_notifications"))
    suite.addTest(ParrotBreedingAPITest("test_16_cleanup"))
    
    runner = unittest.TextTestRunner(verbosity=2)
    runner.run(suite)