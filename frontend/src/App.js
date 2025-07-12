import React, { useState, useEffect } from 'react';
import './App.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [birds, setBirds] = useState([]);
  const [breedingPairs, setBreedingPairs] = useState([]);
  const [clutches, setClutches] = useState([]);
  const [chicks, setChicks] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [incubators, setIncubators] = useState([]);
  const [artificialIncubations, setArtificialIncubations] = useState([]);
  const [species, setSpecies] = useState([]);
  const [dashboardData, setDashboardData] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [searchResults, setSearchResults] = useState(null);
  const [breedingReport, setBreedingReport] = useState(null);
  
  // Form visibility states
  const [showAddBirdForm, setShowAddBirdForm] = useState(false);
  const [showEditBirdForm, setShowEditBirdForm] = useState(false);
  const [showAddPairForm, setShowAddPairForm] = useState(false);
  const [showEditPairForm, setShowEditPairForm] = useState(false);
  const [showAddClutchForm, setShowAddClutchForm] = useState(false);
  const [showAddChickForm, setShowAddChickForm] = useState(false);
  const [showAddTransactionForm, setShowAddTransactionForm] = useState(false);
  const [showAddIncubatorForm, setShowAddIncubatorForm] = useState(false);
  const [showAddArtificialIncubationForm, setShowAddArtificialIncubationForm] = useState(false);
  const [showLicenseForm, setShowLicenseForm] = useState(false);
  const [showAddSpeciesForm, setShowAddSpeciesForm] = useState(false);
  const [showAddExpenseForm, setShowAddExpenseForm] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  
  // Edit states
  const [editingBird, setEditingBird] = useState(null);
  const [editingPair, setEditingPair] = useState(null);
  const [editingIncubator, setEditingIncubator] = useState(null);
  const [showEditIncubatorForm, setShowEditIncubatorForm] = useState(false);
  const [mainLicense, setMainLicense] = useState(null);

  // Form states
  const [birdForm, setBirdForm] = useState({
    species: '',
    gender: 'male',
    birth_date: '',
    ring_number: '',
    cage_number: '',
    color_mutation: '',
    license_number: '',
    license_expiry: '',
    notes: '',
    // Purchase information
    is_purchased: false,
    purchase_date: '',
    purchase_price: '',
    purchase_currency: 'RM',
    purchase_source: '',
    purchase_notes: ''
  });

  const [pairForm, setPairForm] = useState({
    male_bird_id: '',
    female_bird_id: '',
    pair_date: '',
    license_number: '',
    license_expiry: '',
    notes: ''
  });

  const [clutchForm, setClutchForm] = useState({
    breeding_pair_id: '',
    clutch_number: 1,
    egg_laying_date: '',
    eggs_laid: 0,
    expected_hatch_date: '',
    hatched_count: 0,
    fertile_eggs: 0,
    notes: ''
  });

  const [chickForm, setChickForm] = useState({
    clutch_id: '',
    chick_number: 1,
    hatch_date: '',
    ring_number: '',
    gender: '',
    color_mutation: '',
    weight: 0,
    notes: ''
  });

  const [transactionForm, setTransactionForm] = useState({
    transaction_type: 'expense',
    bird_id: '',
    chick_id: '',
    amount: 0,
    currency: 'RM',
    date: '',
    category: 'food',
    description: '',
    buyer_name: '',
    buyer_contact: '',
    seller_name: '',
    notes: ''
  });

  const [incubatorForm, setIncubatorForm] = useState({
    name: '',
    model: '',
    capacity: 0,
    temperature_range: '',
    humidity_range: '',
    turning_interval: 2,
    notes: ''
  });

  const [artificialIncubationForm, setArtificialIncubationForm] = useState({
    clutch_id: '',
    incubator_id: '',
    eggs_transferred: 0,
    transfer_date: '',
    transfer_reason: 'control',
    incubation_temperature: 37.5,
    incubation_humidity: 55.0,
    expected_hatch_date: '',
    notes: ''
  });

  const [searchForm, setSearchForm] = useState({
    query: '',
    species: '',
    status: '',
    search_type: 'all'
  });

  const [speciesForm, setSpeciesForm] = useState({
    name: '',
    scientific_name: '',
    category: '',
    incubation_period: '',
    clutch_size_min: '',
    clutch_size_max: '',
    maturity_age: '',
    average_lifespan: '',
    notes: ''
  });

  const [expenseForm, setExpenseForm] = useState({
    amount: '',
    currency: 'RM',
    date: new Date().toISOString().split('T')[0], // Today's date
    category: 'food',
    description: '',
    notes: ''
  });

  const [balanceFilter, setBalanceFilter] = useState({
    from_date: '',
    to_date: '',
    currency: 'RM'
  });

  // Daily monitoring states
  const [showDailyMonitoringForm, setShowDailyMonitoringForm] = useState(false);
  const [selectedIncubator, setSelectedIncubator] = useState(null);
  const [dailyMonitoringForm, setDailyMonitoringForm] = useState({
    incubator_id: '',
    date: new Date().toISOString().split('T')[0],
    species_name: '',
    morning_temperature: '',
    morning_humidity: '',
    morning_time: '08:00',
    evening_temperature: '',
    evening_humidity: '',
    evening_time: '19:00',
    notes: ''
  });
  const [monitoringData, setMonitoringData] = useState([]);

  const [licenseForm, setLicenseForm] = useState({
    license_number: '',
    license_type: 'breeding',
    issue_date: '',
    expiry_date: '',
    issuing_authority: '',
    notes: ''
  });

  // Helper function to calculate expected hatch date
  const calculateHatchDate = (layingDate, species = 'default') => {
    const incubationPeriods = {
      'African Grey': 28,
      'Cockatiel': 18,
      'Lovebird': 23,
      'Macaw': 28,
      'Conure': 24,
      'Budgie': 18,
      'Cockatoo': 28,
      'default': 24
    };
    
    const days = incubationPeriods[species] || incubationPeriods['default'];
    const layDate = new Date(layingDate);
    const hatchDate = new Date(layDate);
    hatchDate.setDate(hatchDate.getDate() + days);
    
    return hatchDate.toISOString().split('T')[0];
  };

  // Auto-calculate hatch date when laying date changes
  const handleLayingDateChange = (layingDate, species) => {
    const expectedHatch = calculateHatchDate(layingDate, species);
    setClutchForm({
      ...clutchForm, 
      egg_laying_date: layingDate,
      expected_hatch_date: expectedHatch
    });
  };

  // Helper function to get alert class
  const getAlertClass = (alertLevel) => {
    switch (alertLevel) {
      case 'expired':
        return 'alert-expired';
      case 'critical':
        return 'alert-critical';
      default:
        return '';
    }
  };

  // Fetch data functions
  const fetchBirds = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/birds`);
      const data = await response.json();
      setBirds(data.birds);
    } catch (error) {
      console.error('Error fetching birds:', error);
    }
  };

  const fetchBreedingPairs = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/breeding-pairs`);
      const data = await response.json();
      setBreedingPairs(data.breeding_pairs);
    } catch (error) {
      console.error('Error fetching breeding pairs:', error);
    }
  };

  const fetchClutches = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/clutches`);
      const data = await response.json();
      setClutches(data.clutches);
    } catch (error) {
      console.error('Error fetching clutches:', error);
    }
  };

  const fetchChicks = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/chicks`);
      const data = await response.json();
      setChicks(data.chicks);
    } catch (error) {
      console.error('Error fetching chicks:', error);
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/transactions`);
      const data = await response.json();
      setTransactions(data.transactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const fetchIncubators = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/incubators`);
      const data = await response.json();
      setIncubators(data.incubators);
    } catch (error) {
      console.error('Error fetching incubators:', error);
    }
  };

  const fetchArtificialIncubations = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/artificial-incubation`);
      const data = await response.json();
      setArtificialIncubations(data.artificial_incubations);
    } catch (error) {
      console.error('Error fetching artificial incubations:', error);
    }
  };

  const fetchDashboard = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/dashboard`);
      const data = await response.json();
      setDashboardData(data);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    }
  };

  const fetchSpecies = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/species`);
      const data = await response.json();
      setSpecies(data.species);
    } catch (error) {
      console.error('Error fetching species:', error);
    }
  };

  const fetchMonitoringData = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/daily-monitoring`);
      const data = await response.json();
      setMonitoringData(data.monitoring_entries);
    } catch (error) {
      console.error('Error fetching monitoring data:', error);
    }
  };

  const fetchMainLicense = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/license`);
      const data = await response.json();
      setMainLicense(data);
    } catch (error) {
      console.error('Error fetching main license:', error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/notifications`);
      const data = await response.json();
      setNotifications(data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const fetchBreedingReport = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/reports/breeding`);
      const data = await response.json();
      setBreedingReport(data);
    } catch (error) {
      console.error('Error fetching breeding report:', error);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const params = new URLSearchParams(searchForm);
      const response = await fetch(`${BACKEND_URL}/api/search?${params}`);
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Error searching:', error);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchBirds();
    fetchBreedingPairs();
    fetchClutches();
    fetchChicks();
    fetchTransactions();
    fetchIncubators();
    fetchArtificialIncubations();
    fetchSpecies();
    fetchMonitoringData();
    fetchDashboard();
    fetchMainLicense();
    fetchNotifications();
  }, []);

  // Handle form submissions
  const handleAddBird = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${BACKEND_URL}/api/birds`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(birdForm),
      });
      
      if (response.ok) {
        setBirdForm({
          species: '',
          gender: 'male',
          birth_date: '',
          ring_number: '',
          cage_number: '',
          color_mutation: '',
          license_number: '',
          license_expiry: '',
          notes: '',
          // Purchase information
          is_purchased: false,
          purchase_date: '',
          purchase_price: '',
          purchase_currency: 'RM',
          purchase_source: '',
          purchase_notes: ''
        });
        setShowAddBirdForm(false);
        fetchBirds();
        fetchDashboard();
      }
    } catch (error) {
      console.error('Error adding bird:', error);
    }
  };

  const handleEditBird = (bird) => {
    setEditingBird(bird);
    setBirdForm({
      species: bird.species,
      gender: bird.gender,
      birth_date: bird.birth_date || '',
      ring_number: bird.ring_number || '',
      cage_number: bird.cage_number || '',
      color_mutation: bird.color_mutation || '',
      license_number: bird.license_number || '',
      license_expiry: bird.license_expiry || '',
      notes: bird.notes || ''
    });
    setShowEditBirdForm(true);
  };

  const handleUpdateBird = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${BACKEND_URL}/api/birds/${editingBird.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(birdForm),
      });
      
      if (response.ok) {
        setBirdForm({
          species: '',
          gender: 'male',
          birth_date: '',
          ring_number: '',
          cage_number: '',
          color_mutation: '',
          license_number: '',
          license_expiry: '',
          notes: '',
          // Purchase information
          is_purchased: false,
          purchase_date: '',
          purchase_price: '',
          purchase_currency: 'RM',
          purchase_source: '',
          purchase_notes: ''
        });
        setShowEditBirdForm(false);
        setEditingBird(null);
        fetchBirds();
        fetchDashboard();
      }
    } catch (error) {
      console.error('Error updating bird:', error);
    }
  };

  const handleAddPair = async (e) => {
    e.preventDefault();
    try {
      // Auto-generate pair name based on cage numbers
      const maleBird = birds.find(bird => bird.id === pairForm.male_bird_id);
      const femaleBird = birds.find(bird => bird.id === pairForm.female_bird_id);
      const autoGeneratedName = `Cage ${maleBird?.cage_number || 'Unknown'} × Cage ${femaleBird?.cage_number || 'Unknown'}`;
      
      const pairData = {
        ...pairForm,
        pair_name: autoGeneratedName
      };
      
      const response = await fetch(`${BACKEND_URL}/api/breeding-pairs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pairData),
      });
      
      if (response.ok) {
        setPairForm({
          male_bird_id: '',
          female_bird_id: '',
          pair_date: '',
          license_number: '',
          license_expiry: '',
          notes: ''
        });
        setShowAddPairForm(false);
        fetchBreedingPairs();
        fetchDashboard();
      }
    } catch (error) {
      console.error('Error adding breeding pair:', error);
    }
  };

  const handleEditPair = (pair) => {
    setEditingPair(pair);
    setPairForm({
      male_bird_id: pair.male_bird_id,
      female_bird_id: pair.female_bird_id,
      pair_date: pair.pair_date,
      license_number: pair.license_number || '',
      license_expiry: pair.license_expiry || '',
      notes: pair.notes || ''
    });
    setShowEditPairForm(true);
  };

  const handleUpdatePair = async (e) => {
    e.preventDefault();
    try {
      // Auto-generate pair name based on cage numbers
      const maleBird = birds.find(bird => bird.id === pairForm.male_bird_id);
      const femaleBird = birds.find(bird => bird.id === pairForm.female_bird_id);
      const autoGeneratedName = `Cage ${maleBird?.cage_number || 'Unknown'} × Cage ${femaleBird?.cage_number || 'Unknown'}`;
      
      const pairData = {
        ...pairForm,
        pair_name: autoGeneratedName
      };
      
      const response = await fetch(`${BACKEND_URL}/api/breeding-pairs/${editingPair.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pairData),
      });
      
      if (response.ok) {
        setPairForm({
          male_bird_id: '',
          female_bird_id: '',
          pair_date: '',
          license_number: '',
          license_expiry: '',
          notes: ''
        });
        setShowEditPairForm(false);
        setEditingPair(null);
        fetchBreedingPairs();
        fetchDashboard();
      }
    } catch (error) {
      console.error('Error updating breeding pair:', error);
    }
  };

  const handleAddClutch = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${BACKEND_URL}/api/clutches`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(clutchForm),
      });
      
      if (response.ok) {
        setClutchForm({
          breeding_pair_id: '',
          clutch_number: 1,
          egg_laying_date: '',
          eggs_laid: 0,
          expected_hatch_date: '',
          hatched_count: 0,
          fertile_eggs: 0,
          notes: ''
        });
        setShowAddClutchForm(false);
        fetchClutches();
        fetchDashboard();
      }
    } catch (error) {
      console.error('Error adding clutch:', error);
    }
  };

  const handleAddChick = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${BACKEND_URL}/api/chicks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(chickForm),
      });
      
      if (response.ok) {
        setChickForm({
          clutch_id: '',
          chick_number: 1,
          hatch_date: '',
          ring_number: '',
          gender: '',
          color_mutation: '',
          weight: 0,
          notes: ''
        });
        setShowAddChickForm(false);
        fetchChicks();
        fetchDashboard();
      }
    } catch (error) {
      console.error('Error adding chick:', error);
    }
  };

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${BACKEND_URL}/api/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transactionForm),
      });
      
      if (response.ok) {
        setTransactionForm({
          transaction_type: 'expense',
          amount: 0,
          date: '',
          category: 'food',
          description: '',
          notes: ''
        });
        setShowAddTransactionForm(false);
        fetchTransactions();
        fetchDashboard();
      }
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  const handleAddIncubator = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${BACKEND_URL}/api/incubators`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(incubatorForm),
      });
      
      if (response.ok) {
        setIncubatorForm({
          name: '',
          model: '',
          capacity: 0,
          temperature_range: '',
          humidity_range: '',
          turning_interval: 2,
          notes: ''
        });
        setShowAddIncubatorForm(false);
        fetchIncubators();
        fetchDashboard();
      }
    } catch (error) {
      console.error('Error adding incubator:', error);
    }
  };

  const handleAddArtificialIncubation = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${BACKEND_URL}/api/artificial-incubation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(artificialIncubationForm),
      });
      
      if (response.ok) {
        setArtificialIncubationForm({
          clutch_id: '',
          incubator_id: '',
          eggs_transferred: 0,
          transfer_date: '',
          transfer_reason: 'control',
          incubation_temperature: 37.5,
          incubation_humidity: 55.0,
          expected_hatch_date: '',
          notes: ''
        });
        setShowAddArtificialIncubationForm(false);
        fetchArtificialIncubations();
        fetchDashboard();
      }
    } catch (error) {
      console.error('Error adding artificial incubation:', error);
    }
  };

  const handleAddLicense = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${BACKEND_URL}/api/license`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(licenseForm),
      });
      
      if (response.ok) {
        setLicenseForm({
          license_number: '',
          license_type: 'breeding',
          issue_date: '',
          expiry_date: '',
          issuing_authority: '',
          notes: ''
        });
        setShowLicenseForm(false);
        fetchMainLicense();
        fetchDashboard();
      }
    } catch (error) {
      console.error('Error adding license:', error);
    }
  };

  const handleAddSpecies = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${BACKEND_URL}/api/species`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(speciesForm),
      });
      
      if (response.ok) {
        setSpeciesForm({
          name: '',
          scientific_name: '',
          category: '',
          incubation_period: '',
          clutch_size_min: '',
          clutch_size_max: '',
          maturity_age: '',
          average_lifespan: '',
          notes: ''
        });
        setShowAddSpeciesForm(false);
        fetchSpecies();
      }
    } catch (error) {
      console.error('Error adding species:', error);
    }
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    try {
      const expenseData = {
        transaction_type: 'expense',
        amount: parseFloat(expenseForm.amount),
        currency: expenseForm.currency,
        date: expenseForm.date,
        category: expenseForm.category,
        description: expenseForm.description,
        notes: expenseForm.notes
      };

      const response = await fetch(`${BACKEND_URL}/api/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(expenseData),
      });
      
      if (response.ok) {
        setExpenseForm({
          amount: '',
          currency: 'RM',
          date: new Date().toISOString().split('T')[0],
          category: 'food',
          description: '',
          notes: ''
        });
        setShowAddExpenseForm(false);
        fetchTransactions();
        fetchDashboard();
      }
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  };

  const handleAddDailyMonitoring = async (e) => {
    e.preventDefault();
    try {
      const monitoringData = {
        incubator_id: dailyMonitoringForm.incubator_id,
        date: dailyMonitoringForm.date,
        species_name: dailyMonitoringForm.species_name,
        morning_temperature: parseFloat(dailyMonitoringForm.morning_temperature),
        morning_humidity: parseFloat(dailyMonitoringForm.morning_humidity),
        morning_time: dailyMonitoringForm.morning_time,
        evening_temperature: parseFloat(dailyMonitoringForm.evening_temperature),
        evening_humidity: parseFloat(dailyMonitoringForm.evening_humidity),
        evening_time: dailyMonitoringForm.evening_time,
        notes: dailyMonitoringForm.notes
      };

      const response = await fetch(`${BACKEND_URL}/api/daily-monitoring`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(monitoringData),
      });
      
      if (response.ok) {
        setDailyMonitoringForm({
          incubator_id: '',
          date: new Date().toISOString().split('T')[0],
          species_name: '',
          morning_temperature: '',
          morning_humidity: '',
          morning_time: '08:00',
          evening_temperature: '',
          evening_humidity: '',
          evening_time: '19:00',
          notes: ''
        });
        setShowDailyMonitoringForm(false);
        fetchMonitoringData();
        fetchDashboard();
      }
    } catch (error) {
      console.error('Error adding daily monitoring:', error);
    }
  };

  // Render Dashboard
  const renderDashboard = () => (
    <div className="dashboard">
      <h2 className="text-2xl font-bold mb-6">🦜 Breeding Dashboard</h2>
      
      {/* License Alerts */}
      {dashboardData?.license_alerts?.length > 0 && (
        <div className="license-alerts mb-6">
          <h3 className="text-lg font-semibold mb-3 text-red-600">⚠️ License Alerts</h3>
          {dashboardData.license_alerts.map((alert, index) => (
            <div key={index} className={`alert-card ${getAlertClass(alert.alert_level)}`}>
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold">{alert.name}</h4>
                  <p className="text-sm">License: {alert.license_number}</p>
                  <p className="text-sm">
                    {alert.alert_level === 'expired' ? 'EXPIRED' : `Expires in ${alert.days_until_expiry} days`}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm">{new Date(alert.expiry_date).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {dashboardData && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
          <div className="stat-card">
            <h3 className="text-sm font-semibold text-blue-600">Total Birds</h3>
            <p className="text-2xl font-bold">{dashboardData.stats.total_birds}</p>
          </div>
          <div className="stat-card">
            <h3 className="text-sm font-semibold text-green-600">Active Pairs</h3>
            <p className="text-2xl font-bold">{dashboardData.stats.total_pairs}</p>
          </div>
          <div className="stat-card">
            <h3 className="text-sm font-semibold text-orange-600">Natural Clutches</h3>
            <p className="text-2xl font-bold">{dashboardData.stats.active_clutches}</p>
          </div>
          <div className="stat-card">
            <h3 className="text-sm font-semibold text-purple-600">Total Chicks</h3>
            <p className="text-2xl font-bold">{dashboardData.stats.total_chicks}</p>
          </div>
          <div className="stat-card">
            <h3 className="text-sm font-semibold text-red-600">Artificial Incubations</h3>
            <p className="text-2xl font-bold">{dashboardData.stats.active_artificial_incubations || 0}</p>
          </div>
          <div className="stat-card">
            <h3 className="text-sm font-semibold text-indigo-600">Incubators</h3>
            <p className="text-2xl font-bold">{dashboardData.stats.total_incubators || 0}</p>
          </div>
          <div className="stat-card">
            <h3 className="text-sm font-semibold text-green-600">Revenue</h3>
            <p className="text-2xl font-bold">${dashboardData.stats.total_revenue || 0}</p>
          </div>
          <div className="stat-card">
            <h3 className="text-sm font-semibold text-red-600">Expenses</h3>
            <p className="text-2xl font-bold">${dashboardData.stats.total_expenses || 0}</p>
          </div>
        </div>
      )}

      <div className="recent-activity">
        <h3 className="text-xl font-bold mb-4">Recent Clutches</h3>
        <div className="space-y-4">
          {dashboardData?.recent_clutches?.map((clutch, index) => (
            <div key={index} className="activity-card">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold">
                    {clutch.breeding_pair?.pair_name || `Cage ${clutch.breeding_pair?.male_bird?.cage_number} × Cage ${clutch.breeding_pair?.female_bird?.cage_number}`} - Clutch #{clutch.clutch_number}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {clutch.breeding_pair?.male_bird?.species} × {clutch.breeding_pair?.female_bird?.species}
                  </p>
                  <p className="text-sm">
                    Eggs: {clutch.eggs_laid} | Hatched: {clutch.hatched_count || 0} | 
                    Status: <span className={`status-${clutch.status}`}>{clutch.status}</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">
                    Laid: {new Date(clutch.egg_laying_date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Render Birds
  const renderBirds = () => (
    <div className="birds-section">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">🦜 Birds Registry</h2>
        <button 
          onClick={() => setShowAddBirdForm(true)}
          className="btn-primary"
        >
          Add New Bird
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {birds.map((bird) => (
          <div key={bird.id} className={`bird-card ${getAlertClass(bird.license_alert)}`}>
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-lg">{bird.species}</h3>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handleEditBird(bird)}
                  className="edit-btn"
                  title="Edit Bird"
                >
                  ✏️
                </button>
                <span className={`gender-badge ${bird.gender}`}>
                  {bird.gender === 'male' ? '♂' : '♀'}
                </span>
              </div>
            </div>
            <p className="text-gray-600 mb-2">Cage: {bird.cage_number || 'No Cage'}</p>
            {bird.ring_number && (
              <p className="text-sm text-gray-500">Ring: {bird.ring_number}</p>
            )}
            {bird.color_mutation && (
              <p className="text-sm text-gray-500">Color: {bird.color_mutation}</p>
            )}
            {bird.license_number && (
              <p className="text-sm text-gray-500">License: {bird.license_number}</p>
            )}
            {bird.license_expiry && (
              <p className="text-sm text-gray-500">
                License Expires: {new Date(bird.license_expiry).toLocaleDateString()}
              </p>
            )}
            {bird.license_alert === 'expired' && (
              <p className="text-sm text-red-600 font-bold">LICENSE EXPIRED!</p>
            )}
            {bird.license_alert === 'critical' && (
              <p className="text-sm text-orange-600 font-bold">License expires in {bird.days_until_expiry} days</p>
            )}
            {bird.birth_date && (
              <p className="text-sm text-gray-500">
                Born: {new Date(bird.birth_date).toLocaleDateString()}
              </p>
            )}
            <span className={`status-badge ${bird.status}`}>{bird.status}</span>
          </div>
        ))}
      </div>
    </div>
  );

  // Render Breeding Pairs
  const renderBreedingPairs = () => (
    <div className="breeding-pairs-section">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">💕 Breeding Pairs</h2>
        <button 
          onClick={() => setShowAddPairForm(true)}
          className="btn-primary"
        >
          Create New Pair
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {breedingPairs.map((pair) => (
          <div key={pair.id} className={`pair-card ${getAlertClass(pair.license_alert)}`}>
            <button 
              onClick={() => handleEditPair(pair)}
              className="edit-btn"
              title="Edit Pair"
            >
              ✏️
            </button>
            <h3 className="font-bold text-lg mb-2">
              Cage {pair.male_bird?.cage_number || 'Unknown'} × Cage {pair.female_bird?.cage_number || 'Unknown'}
            </h3>
            <div className="flex justify-between items-center mb-4">
              <div className="bird-info">
                <p className="font-semibold text-blue-600">♂ {pair.male_bird?.species}</p>
                <p className="text-sm text-gray-600">Cage: {pair.male_bird?.cage_number || 'No Cage'}</p>
              </div>
              <div className="text-center">
                <span className="text-2xl">💕</span>
              </div>
              <div className="bird-info text-right">
                <p className="font-semibold text-pink-600">♀ {pair.female_bird?.species}</p>
                <p className="text-sm text-gray-600">Cage: {pair.female_bird?.cage_number || 'No Cage'}</p>
              </div>
            </div>
            {pair.license_number && (
              <p className="text-sm text-gray-500 mb-1">License: {pair.license_number}</p>
            )}
            {pair.license_expiry && (
              <p className="text-sm text-gray-500 mb-1">
                License Expires: {new Date(pair.license_expiry).toLocaleDateString()}
              </p>
            )}
            {pair.license_alert === 'expired' && (
              <p className="text-sm text-red-600 font-bold mb-2">LICENSE EXPIRED!</p>
            )}
            {pair.license_alert === 'critical' && (
              <p className="text-sm text-orange-600 font-bold mb-2">License expires in {pair.days_until_expiry} days</p>
            )}
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm text-gray-500">
                Paired: {new Date(pair.pair_date).toLocaleDateString()}
              </p>
              <span className={`status-badge ${pair.status}`}>{pair.status}</span>
            </div>
            
            {/* Clutch Management Buttons */}
            <div className="mt-4 space-y-2">
              <button 
                className="w-full btn-secondary text-sm"
                onClick={() => {
                  // Set the selected pair for clutch creation
                  setClutchForm(prev => ({ ...prev, breeding_pair_id: pair.id }));
                  setShowAddClutchForm(true);
                }}
              >
                🥚 Add Clutch
              </button>
              
              <div className="flex gap-2">
                <button 
                  className="flex-1 btn-outline text-sm"
                  onClick={() => {
                    // Navigate to clutches tab filtered by this pair
                    setActiveTab('clutches');
                  }}
                >
                  View Clutches
                </button>
                <button 
                  className="flex-1 btn-outline text-sm"
                  onClick={() => {
                    // Navigate to pair details view
                    console.log('View pair details:', pair.id);
                  }}
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Render Clutches
  const renderClutches = () => (
    <div className="clutches-section">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">🥚 Clutches Management</h2>
        <button 
          onClick={() => setShowAddClutchForm(true)}
          className="btn-primary"
        >
          Add New Clutch
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clutches.map((clutch) => (
          <div key={clutch.id} className="clutch-card">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-lg">
                {clutch.breeding_pair?.male_bird?.species} × {clutch.breeding_pair?.female_bird?.species}
              </h3>
              <span className={`status-badge ${clutch.status}`}>{clutch.status}</span>
            </div>
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                Cage {clutch.breeding_pair?.male_bird?.cage_number} × Cage {clutch.breeding_pair?.female_bird?.cage_number}
              </p>
              <p className="text-sm text-gray-600">Clutch #{clutch.clutch_number}</p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Eggs Laid:</span>
                <span className="font-semibold">{clutch.eggs_laid}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Hatched:</span>
                <span className="font-semibold">{clutch.hatched_count || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Fertile:</span>
                <span className="font-semibold">{clutch.fertile_eggs || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Laid Date:</span>
                <span className="text-sm">{new Date(clutch.egg_laying_date).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Expected Hatch:</span>
                <span className="text-sm">{new Date(clutch.expected_hatch_date).toLocaleDateString()}</span>
              </div>
            </div>
            
            <div className="mt-4 space-y-2">
              <button 
                className="w-full btn-secondary text-sm"
                onClick={() => {/* View clutch details */}}
              >
                View Eggs
              </button>
              <button 
                className="w-full btn-secondary text-sm"
                onClick={() => {/* Start artificial incubation */}}
              >
                🔬 Start Artificial Incubation
              </button>
            </div>
            
            {clutch.notes && (
              <p className="text-sm text-gray-500 mt-2 italic">{clutch.notes}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  // Render Chicks
  const renderChicks = () => (
    <div className="chicks-section">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">🐣 Chicks Management</h2>
        <button 
          onClick={() => setShowAddChickForm(true)}
          className="btn-primary"
        >
          Add New Chick
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {chicks.map((chick) => (
          <div key={chick.id} className="chick-card">
            <h3 className="font-bold text-lg mb-2">
              Chick #{chick.chick_number}
            </h3>
            <div className="space-y-1">
              <p className="text-sm"><strong>Ring:</strong> {chick.ring_number || 'Not ringed'}</p>
              <p className="text-sm"><strong>Gender:</strong> {chick.gender || 'Unknown'}</p>
              <p className="text-sm"><strong>Hatched:</strong> {new Date(chick.hatch_date).toLocaleDateString()}</p>
              <p className="text-sm"><strong>Weight:</strong> {chick.weight}g</p>
              {chick.color_mutation && (
                <p className="text-sm"><strong>Color:</strong> {chick.color_mutation}</p>
              )}
            </div>
            {chick.notes && (
              <p className="text-sm text-gray-500 mt-2 italic">{chick.notes}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  // Render Incubators
  const renderIncubators = () => (
    <div className="incubators-section">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">🔬 Incubators & Daily Monitoring</h2>
        <div className="flex gap-2">
          <button 
            onClick={() => setShowDailyMonitoringForm(true)}
            className="btn-secondary"
          >
            📊 Add Daily Reading
          </button>
          <button 
            onClick={() => setShowAddIncubatorForm(true)}
            className="btn-primary"
          >
            Add New Incubator
          </button>
        </div>
      </div>

      {/* Incubators Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {incubators.map((incubator) => {
          // Get latest monitoring data for this incubator
          const latestMonitoring = monitoringData.find(m => m.incubator_id === incubator.id);
          
          return (
            <div key={incubator.id} className="incubator-card bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-lg">{incubator.name}</h3>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {incubator.capacity} eggs
                </span>
              </div>
              
              <div className="space-y-2 mb-4">
                <p className="text-sm"><strong>Model:</strong> {incubator.model}</p>
                <p className="text-sm"><strong>Temperature:</strong> {incubator.temperature_range}</p>
                <p className="text-sm"><strong>Humidity:</strong> {incubator.humidity_range}</p>
                <p className="text-sm"><strong>Turning:</strong> Every {incubator.turning_interval}h</p>
              </div>

              {/* Latest Readings */}
              {latestMonitoring && (
                <div className="bg-gray-50 p-3 rounded-lg mb-3">
                  <p className="text-xs font-semibold text-gray-600 mb-2">Latest Reading ({latestMonitoring.date})</p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-orange-600">🌡️</span> Avg: {latestMonitoring.daily_avg_temperature}°C
                    </div>
                    <div>
                      <span className="text-blue-600">💧</span> Avg: {latestMonitoring.daily_avg_humidity}%
                    </div>
                  </div>
                  {latestMonitoring.species_name && (
                    <p className="text-xs text-gray-500 mt-1">Species: {latestMonitoring.species_name}</p>
                  )}
                </div>
              )}

              <div className="flex gap-2">
                <button 
                  className="btn-outline text-xs flex-1"
                  onClick={() => {
                    setSelectedIncubator(incubator);
                    setDailyMonitoringForm({
                      ...dailyMonitoringForm,
                      incubator_id: incubator.id
                    });
                    setShowDailyMonitoringForm(true);
                  }}
                >
                  📊 Add Reading
                </button>
                <button 
                  className="btn-outline text-xs flex-1"
                  onClick={() => {
                    // View monitoring history
                    console.log('View monitoring history for:', incubator.id);
                  }}
                >
                  📈 History
                </button>
              </div>

              {incubator.notes && (
                <p className="text-sm text-gray-500 mt-2 italic">{incubator.notes}</p>
              )}
            </div>
          );
        })}
      </div>

      {/* Daily Monitoring Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b">
          <h3 className="text-lg font-bold">📊 Daily Monitoring Records</h3>
        </div>
        
        {monitoringData.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr className="text-left text-xs text-gray-600 uppercase tracking-wider">
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Incubator</th>
                  <th className="px-6 py-3">Species</th>
                  <th className="px-6 py-3">Morning</th>
                  <th className="px-6 py-3">Evening</th>
                  <th className="px-6 py-3">Daily Average</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {monitoringData.slice(0, 10).map((monitoring) => (
                  <tr key={monitoring.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {new Date(monitoring.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {monitoring.incubator?.name || 'Unknown'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {monitoring.species_name || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div>🌡️ {monitoring.morning_temperature}°C</div>
                      <div>💧 {monitoring.morning_humidity}%</div>
                      <div className="text-xs text-gray-500">{monitoring.morning_time}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div>🌡️ {monitoring.evening_temperature}°C</div>
                      <div>💧 {monitoring.evening_humidity}%</div>
                      <div className="text-xs text-gray-500">{monitoring.evening_time}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="font-semibold text-orange-600">🌡️ {monitoring.daily_avg_temperature}°C</div>
                      <div className="font-semibold text-blue-600">💧 {monitoring.daily_avg_humidity}%</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex gap-1">
                        <button 
                          className="text-blue-600 hover:text-blue-800 text-xs"
                          onClick={() => {
                            // Edit monitoring entry
                            console.log('Edit monitoring:', monitoring.id);
                          }}
                        >
                          Edit
                        </button>
                        <button 
                          className="text-red-600 hover:text-red-800 text-xs"
                          onClick={() => {
                            // Delete monitoring entry
                            console.log('Delete monitoring:', monitoring.id);
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg">No monitoring data found</p>
            <p className="text-sm">Add daily temperature and humidity readings to track incubator performance</p>
          </div>
        )}
      </div>
    </div>
  );

  // Render Transactions
  const renderTransactions = () => {
    // Group transactions by type
    const sales = transactions.filter(t => t.transaction_type === 'sale');
    const purchases = transactions.filter(t => t.transaction_type === 'purchase');
    const expenses = transactions.filter(t => t.transaction_type === 'expense');
    
    // Calculate totals
    const totalSales = sales.reduce((sum, t) => sum + t.amount, 0);
    const totalPurchases = purchases.reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);
    
    return (
      <div className="transactions-section">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold">💰 Sales & Financial Management</h2>
            <div className="flex gap-6 mt-2 text-sm">
              <span className="text-green-600 font-semibold">
                {sales.length} birds • {(sales[0]?.currency || 'RM')} {totalSales.toFixed(2)}
              </span>
              <span className="text-blue-600 font-semibold">
                Purchases: {(purchases[0]?.currency || 'RM')} {totalPurchases.toFixed(2)}
              </span>
              <span className="text-red-600 font-semibold">
                Expenses: {(expenses[0]?.currency || 'RM')} {totalExpenses.toFixed(2)}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setShowAddTransactionForm(true)}
              className="btn-primary"
            >
              Add Transaction
            </button>
            <button className="btn-outline">
              📊 Reports
            </button>
          </div>
        </div>

        {/* Sales Cards - Enhanced Display */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sales.map((sale) => {
            // Find the bird associated with this sale
            const soldBird = birds.find(b => b.id === sale.bird_id);
            return (
              <div key={sale.id} className="sale-card bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    🦜
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">
                      {soldBird ? `${soldBird.species}` : sale.description}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {soldBird ? `Ring: ${soldBird.ring_number}` : 'Sale Transaction'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600">
                      {sale.currency} {sale.amount.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(sale.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                {sale.buyer_name && (
                  <div className="border-t pt-3 mt-3">
                    <p className="text-sm"><strong>Buyer:</strong> {sale.buyer_name}</p>
                    {sale.buyer_contact && (
                      <p className="text-sm text-gray-600">{sale.buyer_contact}</p>
                    )}
                  </div>
                )}
                
                {sale.notes && (
                  <p className="text-sm text-gray-500 mt-2 italic">{sale.notes}</p>
                )}
                
                <div className="mt-3 flex gap-2">
                  <button className="btn-outline text-xs flex-1">View Details</button>
                  <button className="btn-outline text-xs flex-1">Edit</button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Other Transactions Summary */}
        {(purchases.length > 0 || expenses.length > 0) && (
          <div className="mt-8">
            <h3 className="text-lg font-bold mb-4">Other Transactions</h3>
            <div className="space-y-2">
              {purchases.concat(expenses).map((transaction) => (
                <div key={transaction.id} className="transaction-row bg-gray-50 p-3 rounded flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold">{transaction.description}</h4>
                    <p className="text-sm text-gray-600 capitalize">
                      {transaction.transaction_type} • {transaction.category}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(transaction.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${transaction.transaction_type === 'purchase' ? 'text-blue-600' : 'text-red-600'}`}>
                      -{transaction.currency} {transaction.amount.toFixed(2)}
                    </p>
                    {transaction.seller_name && (
                      <p className="text-xs text-gray-500">From: {transaction.seller_name}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Render Reports
  const renderReports = () => (
    <div className="reports-section">
      <h2 className="text-2xl font-bold mb-6">📊 Reports & Analytics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="report-card">
          <h3 className="font-bold text-lg mb-4">Breeding Report</h3>
          <button 
            onClick={() => {/* Generate breeding report */}}
            className="btn-primary w-full"
          >
            Generate Breeding Report
          </button>
        </div>
        
        <div className="report-card">
          <h3 className="font-bold text-lg mb-4">Financial Report</h3>
          <button 
            onClick={() => {/* Generate financial report */}}
            className="btn-primary w-full"
          >
            Generate Financial Report
          </button>
        </div>
      </div>
    </div>
  );

  // Render Species
  const renderSpecies = () => (
    <div className="species-section">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">🦜 Species Management</h2>
        <div className="flex gap-2">
          <span className="text-sm text-gray-600">{species.length} species</span>
          <button 
            onClick={() => setShowAddSpeciesForm(true)}
            className="btn-primary"
          >
            Add New Species
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {species.map((speciesItem) => (
          <div key={speciesItem.id} className="species-card">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-lg">{speciesItem.name}</h3>
              <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {speciesItem.bird_count || 0} birds
              </span>
            </div>
            
            {speciesItem.scientific_name && (
              <p className="text-sm text-gray-600 italic mb-2">{speciesItem.scientific_name}</p>
            )}
            
            <div className="space-y-1 text-sm">
              {speciesItem.category && (
                <p><strong>Category:</strong> {speciesItem.category}</p>
              )}
              {speciesItem.incubation_period && (
                <p><strong>Incubation:</strong> {speciesItem.incubation_period} days</p>
              )}
              {speciesItem.clutch_size_min && speciesItem.clutch_size_max && (
                <p><strong>Clutch Size:</strong> {speciesItem.clutch_size_min}-{speciesItem.clutch_size_max} eggs</p>
              )}
              {speciesItem.maturity_age && (
                <p><strong>Maturity:</strong> {speciesItem.maturity_age} months</p>
              )}
              {speciesItem.average_lifespan && (
                <p><strong>Lifespan:</strong> {speciesItem.average_lifespan} years</p>
              )}
            </div>
            
            {speciesItem.notes && (
              <p className="text-sm text-gray-500 mt-2 italic">{speciesItem.notes}</p>
            )}
            
            <div className="mt-4 flex gap-2">
              <button 
                className="btn-outline text-xs flex-1"
                onClick={() => {
                  // Navigate to species detail view
                  console.log('View species details:', speciesItem.id);
                }}
              >
                View Details
              </button>
              <button 
                className="btn-outline text-xs flex-1"
                onClick={() => {
                  // Edit species
                  console.log('Edit species:', speciesItem.id);
                }}
              >
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Render Purchases
  const renderPurchases = () => {
    // Filter birds that were purchased (have purchase information)
    const purchasedBirds = birds.filter(bird => bird.purchase_price && bird.purchase_date);
    
    // Calculate totals
    const totalBirds = purchasedBirds.length;
    const totalAmount = purchasedBirds.reduce((sum, bird) => sum + (bird.purchase_price || 0), 0);
    const currency = purchasedBirds[0]?.purchase_currency || 'RM';
    
    // Group by year and month for filtering
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    
    return (
      <div className="purchases-section">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold">🛒 Purchases</h2>
            <div className="text-sm text-gray-600 mt-1">
              {totalBirds} birds • {currency} {totalAmount.toFixed(2)}
            </div>
          </div>
          <div className="flex gap-2">
            <select className="form-input text-sm">
              <option value="">All Years</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
            </select>
            <select className="form-input text-sm">
              <option value="">All Months</option>
              <option value="0">January</option>
              <option value="1">February</option>
              <option value="2">March</option>
              <option value="3">April</option>
              <option value="4">May</option>
              <option value="5">June</option>
              <option value="6">July</option>
              <option value="7">August</option>
              <option value="8">September</option>
              <option value="9">October</option>
              <option value="10">November</option>
              <option value="11">December</option>
            </select>
          </div>
        </div>

        {/* Purchase Summary Stats */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-blue-600">{totalBirds}</p>
              <p className="text-sm text-gray-600">Total Birds</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">{currency} {totalAmount.toFixed(2)}</p>
              <p className="text-sm text-gray-600">Total Spent</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600">
                {totalBirds > 0 ? `${currency} ${(totalAmount / totalBirds).toFixed(2)}` : `${currency} 0.00`}
              </p>
              <p className="text-sm text-gray-600">Average Cost</p>
            </div>
          </div>
        </div>

        {/* Purchased Birds List */}
        <div className="space-y-3">
          {purchasedBirds.map((bird) => (
            <div key={bird.id} className="purchase-bird-card bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
              <div className="flex items-center gap-4">
                {/* Bird Image/Icon */}
                <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center">
                  <div className="text-white text-2xl">🦜</div>
                </div>
                
                {/* Bird Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-lg">{bird.ring_number || `Bird-${bird.id.slice(-4)}`}</h3>
                    <span className={`text-lg ${bird.gender === 'male' ? 'text-blue-500' : 'text-pink-500'}`}>
                      {bird.gender === 'male' ? '♂' : '♀'}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-700">{bird.species}</p>
                  <p className="text-xs text-gray-500">Cage {bird.cage_number || 'Not Set'}</p>
                </div>
                
                {/* Purchase Date */}
                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    {new Date(bird.purchase_date).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-gray-400">Purchase Date</p>
                </div>
                
                {/* Purchase Price */}
                <div className="text-right">
                  <p className="text-lg font-bold text-green-600">
                    {bird.purchase_currency || 'RM'} {bird.purchase_price.toFixed(2)}
                  </p>
                  {bird.purchase_source && (
                    <p className="text-xs text-gray-500">From: {bird.purchase_source}</p>
                  )}
                </div>
                
                {/* Actions */}
                <div className="flex flex-col gap-1">
                  <button 
                    className="btn-outline text-xs px-3 py-1"
                    onClick={() => {
                      // View bird details
                      console.log('View bird details:', bird.id);
                    }}
                  >
                    View
                  </button>
                  <button 
                    className="btn-outline text-xs px-3 py-1"
                    onClick={() => {
                      // Edit purchase info
                      console.log('Edit purchase:', bird.id);
                    }}
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {purchasedBirds.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg">No purchased birds found</p>
            <p className="text-sm">Add birds with purchase information to see them here</p>
          </div>
        )}
      </div>
    );
  };

  // Render Expenses
  const renderExpenses = () => {
    // Filter transactions that are expenses
    const expenses = transactions.filter(t => t.transaction_type === 'expense');
    
    // Calculate totals
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const currency = expenses[0]?.currency || 'RM';
    
    // Group expenses by month for filtering
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    
    // Define expense categories with colors
    const expenseCategories = {
      'food': { name: 'Birds Food', color: 'bg-blue-500', icon: '🍽️' },
      'supplements': { name: 'Supplements', color: 'bg-green-500', icon: '💊' },
      'vet': { name: 'Veterinary', color: 'bg-red-500', icon: '🏥' },
      'equipment': { name: 'Equipment', color: 'bg-purple-500', icon: '🔧' },
      'setup': { name: 'Setup/Housing', color: 'bg-orange-500', icon: '🏠' },
      'utilities': { name: 'Utilities', color: 'bg-yellow-500', icon: '⚡' },
      'maintenance': { name: 'Maintenance', color: 'bg-indigo-500', icon: '🔨' },
      'other': { name: 'Other', color: 'bg-gray-500', icon: '📦' }
    };
    
    // Get category info for an expense
    const getCategoryInfo = (category) => {
      return expenseCategories[category] || expenseCategories['other'];
    };
    
    return (
      <div className="expenses-section">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold">💰 Expenses</h2>
            <div className="text-sm text-gray-600 mt-1">
              {expenses.length} expenses • {currency} {totalExpenses.toFixed(2)}
            </div>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setShowAddExpenseForm(true)}
              className="btn-primary"
            >
              Add Expense
            </button>
            <select className="form-input text-sm">
              <option value="">All Years</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
            </select>
            <select className="form-input text-sm">
              <option value="">All Months</option>
              <option value="0">January</option>
              <option value="1">February</option>
              <option value="2">March</option>
              <option value="3">April</option>
              <option value="4">May</option>
              <option value="5">June</option>
              <option value="6">July</option>
              <option value="7">August</option>
              <option value="8">September</option>
              <option value="9">October</option>
              <option value="10">November</option>
              <option value="11">December</option>
            </select>
          </div>
        </div>

        {/* Expenses Summary Stats */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-red-600">{expenses.length}</p>
              <p className="text-sm text-gray-600">Total Expenses</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-orange-600">{currency} {totalExpenses.toFixed(2)}</p>
              <p className="text-sm text-gray-600">Total Amount</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600">
                {expenses.length > 0 ? `${currency} ${(totalExpenses / expenses.length).toFixed(2)}` : `${currency} 0.00`}
              </p>
              <p className="text-sm text-gray-600">Average Cost</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">
                {currency} {(totalExpenses / 30).toFixed(2)}
              </p>
              <p className="text-sm text-gray-600">Daily Average</p>
            </div>
          </div>
        </div>

        {/* Expenses List */}
        <div className="space-y-3">
          {expenses.map((expense) => {
            const categoryInfo = getCategoryInfo(expense.category);
            return (
              <div key={expense.id} className="expense-card bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                <div className="flex items-center gap-4">
                  {/* Category Icon */}
                  <div className={`w-12 h-12 ${categoryInfo.color} rounded-full flex items-center justify-center`}>
                    <span className="text-white text-xl">{categoryInfo.icon}</span>
                  </div>
                  
                  {/* Expense Info */}
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{categoryInfo.name.toUpperCase()}</h3>
                    <p className="text-sm text-gray-600">{expense.description}</p>
                    {expense.notes && (
                      <p className="text-xs text-gray-500 mt-1">{expense.notes}</p>
                    )}
                  </div>
                  
                  {/* Amount and Date */}
                  <div className="text-right">
                    <p className="text-lg font-bold text-red-600">
                      {expense.currency} {expense.amount.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(expense.date).toLocaleDateString()}
                    </p>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex flex-col gap-1">
                    <button 
                      className="btn-outline text-xs px-3 py-1"
                      onClick={() => {
                        // Edit expense
                        console.log('Edit expense:', expense.id);
                      }}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn-outline text-xs px-3 py-1 text-red-600"
                      onClick={() => {
                        // Delete expense
                        console.log('Delete expense:', expense.id);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {expenses.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg">No expenses found</p>
            <p className="text-sm">Add expense transactions to track your costs</p>
          </div>
        )}
      </div>
    );
  };

  // Render Balance
  const renderBalance = () => {
    // Filter data by date range if provided
    const filterByDate = (item, dateField) => {
      if (!balanceFilter.from_date && !balanceFilter.to_date) return true;
      const itemDate = new Date(item[dateField]);
      const fromDate = balanceFilter.from_date ? new Date(balanceFilter.from_date) : null;
      const toDate = balanceFilter.to_date ? new Date(balanceFilter.to_date) : null;
      
      if (fromDate && itemDate < fromDate) return false;
      if (toDate && itemDate > toDate) return false;
      return true;
    };

    // Calculate expenses (negative)
    const filteredExpenses = transactions
      .filter(t => t.transaction_type === 'expense')
      .filter(t => filterByDate(t, 'date'));
    const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);

    // Calculate bird purchases (negative)
    const filteredPurchases = birds
      .filter(bird => bird.is_purchased && bird.purchase_price && bird.purchase_date)
      .filter(bird => filterByDate(bird, 'purchase_date'));
    const totalPurchases = filteredPurchases.reduce((sum, bird) => sum + (bird.purchase_price || 0), 0);

    // Calculate bird sales (positive) 
    const filteredSales = transactions
      .filter(t => t.transaction_type === 'sale')
      .filter(t => filterByDate(t, 'date'));
    const totalSales = filteredSales.reduce((sum, sale) => sum + sale.amount, 0);

    // Calculate net balance
    const netBalance = totalSales - totalExpenses - totalPurchases;
    
    // Get currency
    const currency = balanceFilter.currency;

    return (
      <div className="balance-section">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">⚖️ Balance</h2>
          <div className="flex gap-2 items-center">
            <span className="text-sm font-medium">From:</span>
            <input
              type="date"
              value={balanceFilter.from_date}
              onChange={(e) => setBalanceFilter({...balanceFilter, from_date: e.target.value})}
              className="form-input text-sm"
            />
            <span className="text-sm font-medium">To:</span>
            <input
              type="date"
              value={balanceFilter.to_date}
              onChange={(e) => setBalanceFilter({...balanceFilter, to_date: e.target.value})}
              className="form-input text-sm"
            />
            <button 
              onClick={() => setBalanceFilter({from_date: '', to_date: '', currency: 'RM'})}
              className="btn-outline text-sm"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Net Balance Summary */}
        <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-lg mb-6 border-l-4 border-blue-500">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">Net Balance</p>
            <p className={`text-4xl font-bold ${netBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {netBalance >= 0 ? '+' : ''}{currency} {netBalance.toFixed(2)}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              {netBalance >= 0 ? 'Profit' : 'Loss'} • {balanceFilter.from_date || 'All time'} to {balanceFilter.to_date || 'Now'}
            </p>
          </div>
        </div>

        {/* Financial Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Sales (Positive) */}
          <div className="balance-card bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xl">💰</span>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-green-800">Bird Sales</h3>
                <p className="text-sm text-green-600">({filteredSales.length})</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-green-600">
                  +{currency} {totalSales.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* Purchases (Negative) */}
          <div className="balance-card bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xl">🛒</span>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-blue-800">Bird Purchases</h3>
                <p className="text-sm text-blue-600">({filteredPurchases.length})</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-blue-600">
                  -{currency} {totalPurchases.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* Expenses (Negative) */}
          <div className="balance-card bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xl">💸</span>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-red-800">Expenses</h3>
                <p className="text-sm text-red-600">({filteredExpenses.length})</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-red-600">
                  -{currency} {totalExpenses.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Financial Summary */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b">
            <h3 className="text-lg font-bold">Financial Summary</h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="font-medium">Bird Sales Revenue</span>
              <span className="text-green-600 font-bold">+{currency} {totalSales.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="font-medium">Bird Purchase Costs</span>
              <span className="text-blue-600 font-bold">-{currency} {totalPurchases.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="font-medium">Operating Expenses</span>
              <span className="text-red-600 font-bold">-{currency} {totalExpenses.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-t-2 border-gray-300">
              <span className="text-lg font-bold">Total Balance</span>
              <span className={`text-xl font-bold ${netBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {netBalance >= 0 ? '+' : ''}{currency} {netBalance.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="stat-card text-center">
            <p className="text-2xl font-bold text-blue-600">{filteredPurchases.length}</p>
            <p className="text-sm text-gray-600">Birds Purchased</p>
          </div>
          <div className="stat-card text-center">
            <p className="text-2xl font-bold text-green-600">{filteredSales.length}</p>
            <p className="text-sm text-gray-600">Birds Sold</p>
          </div>
          <div className="stat-card text-center">
            <p className="text-2xl font-bold text-red-600">{filteredExpenses.length}</p>
            <p className="text-sm text-gray-600">Expense Items</p>
          </div>
          <div className="stat-card text-center">
            <p className="text-2xl font-bold text-purple-600">
              {filteredSales.length > 0 ? `${currency} ${(totalSales / filteredSales.length).toFixed(2)}` : `${currency} 0.00`}
            </p>
            <p className="text-sm text-gray-600">Avg Sale Price</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="app">
      <header className="header">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="company-logo">
              <div className="logo-circle">
                <div className="parrot-head">
                  <div className="parrot-feather"></div>
                  <div className="parrot-eye"></div>
                  <div className="parrot-beak"></div>
                </div>
              </div>
            </div>
            <div>
              <p className="company-name text-2xl font-bold">NEXUS PERROQUET & AVIAN RESEARCH</p>
              <p className="company-subtitle text-sm opacity-90">Breeding Management System</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setShowSearchModal(true)}
              className="btn-secondary"
            >
              🔍 Search
            </button>
            <button 
              onClick={() => setShowLicenseForm(true)}
              className="btn-secondary"
            >
              {mainLicense ? 'Update License' : 'Add License'}
            </button>
            {notifications?.counts?.total > 0 && (
              <div className="notification-badge">
                <span className="text-sm font-bold">{notifications.counts.total}</span>
              </div>
            )}
          </div>
        </div>
        <nav className="nav">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
          >
            Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('birds')}
            className={`nav-btn ${activeTab === 'birds' ? 'active' : ''}`}
          >
            Birds
          </button>
          <button 
            onClick={() => setActiveTab('pairs')}
            className={`nav-btn ${activeTab === 'pairs' ? 'active' : ''}`}
          >
            Breeding Pairs
          </button>
          <button 
            onClick={() => setActiveTab('clutches')}
            className={`nav-btn ${activeTab === 'clutches' ? 'active' : ''}`}
          >
            Clutches
          </button>
          <button 
            onClick={() => setActiveTab('chicks')}
            className={`nav-btn ${activeTab === 'chicks' ? 'active' : ''}`}
          >
            Chicks
          </button>
          <button 
            onClick={() => setActiveTab('incubators')}
            className={`nav-btn ${activeTab === 'incubators' ? 'active' : ''}`}
          >
            Incubators
          </button>
          <button 
            onClick={() => setActiveTab('transactions')}
            className={`nav-btn ${activeTab === 'transactions' ? 'active' : ''}`}
          >
            Transactions
          </button>
          <button 
            onClick={() => setActiveTab('purchases')}
            className={`nav-btn ${activeTab === 'purchases' ? 'active' : ''}`}
          >
            Purchases
          </button>
          <button 
            onClick={() => setActiveTab('expenses')}
            className={`nav-btn ${activeTab === 'expenses' ? 'active' : ''}`}
          >
            Expenses
          </button>
          <button 
            onClick={() => setActiveTab('balance')}
            className={`nav-btn ${activeTab === 'balance' ? 'active' : ''}`}
          >
            Balance
          </button>
          <button 
            onClick={() => setActiveTab('reports')}
            className={`nav-btn ${activeTab === 'reports' ? 'active' : ''}`}
          >
            Reports
          </button>
          <button 
            onClick={() => setActiveTab('species')}
            className={`nav-btn ${activeTab === 'species' ? 'active' : ''}`}
          >
            Species
          </button>
        </nav>
      </header>

      <main className="main-content">
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'birds' && renderBirds()}
        {activeTab === 'pairs' && renderBreedingPairs()}
        {activeTab === 'clutches' && renderClutches()}
        {activeTab === 'chicks' && renderChicks()}
        {activeTab === 'incubators' && renderIncubators()}
        {activeTab === 'transactions' && renderTransactions()}
        {activeTab === 'purchases' && renderPurchases()}
        {activeTab === 'expenses' && renderExpenses()}
        {activeTab === 'balance' && renderBalance()}
        {activeTab === 'reports' && renderReports()}
        {activeTab === 'species' && renderSpecies()}
      </main>

      {/* Add Bird Form Modal */}
      {showAddBirdForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="text-xl font-bold mb-4">Add New Bird</h3>
            <form onSubmit={handleAddBird} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Species *</label>
                <select
                  value={birdForm.species}
                  onChange={(e) => setBirdForm({...birdForm, species: e.target.value})}
                  className="form-input"
                  required
                >
                  <option value="">Select Species</option>
                  {species.map((speciesItem) => (
                    <option key={speciesItem.id} value={speciesItem.name}>
                      {speciesItem.name}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Don't see your species? <button 
                    type="button" 
                    onClick={() => {
                      setShowAddBirdForm(false);
                      setShowAddSpeciesForm(true);
                    }}
                    className="text-blue-600 underline"
                  >
                    Add new species
                  </button>
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Gender *</label>
                <select
                  value={birdForm.gender}
                  onChange={(e) => setBirdForm({...birdForm, gender: e.target.value})}
                  className="form-input"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Cage Number *</label>
                <input
                  type="text"
                  value={birdForm.cage_number}
                  onChange={(e) => setBirdForm({...birdForm, cage_number: e.target.value})}
                  className="form-input"
                  required
                  placeholder="e.g., A-001, Cage-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Ring Number</label>
                <input
                  type="text"
                  value={birdForm.ring_number}
                  onChange={(e) => setBirdForm({...birdForm, ring_number: e.target.value})}
                  className="form-input"
                  placeholder="e.g., 2024-001"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Birth Date</label>
                <input
                  type="date"
                  value={birdForm.birth_date}
                  onChange={(e) => setBirdForm({...birdForm, birth_date: e.target.value})}
                  className="form-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Color Mutation</label>
                <input
                  type="text"
                  value={birdForm.color_mutation}
                  onChange={(e) => setBirdForm({...birdForm, color_mutation: e.target.value})}
                  className="form-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">License Number</label>
                <input
                  type="text"
                  value={birdForm.license_number}
                  onChange={(e) => setBirdForm({...birdForm, license_number: e.target.value})}
                  className="form-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">License Expiry Date</label>
                <input
                  type="date"
                  value={birdForm.license_expiry}
                  onChange={(e) => setBirdForm({...birdForm, license_expiry: e.target.value})}
                  className="form-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Notes</label>
                <textarea
                  value={birdForm.notes}
                  onChange={(e) => setBirdForm({...birdForm, notes: e.target.value})}
                  className="form-input"
                  rows="3"
                />
              </div>
              
              {/* Purchase Information Section */}
              <div className="border-t pt-4 mt-4">
                <div className="flex items-center gap-2 mb-4">
                  <input
                    type="checkbox"
                    id="is_purchased"
                    checked={birdForm.is_purchased}
                    onChange={(e) => setBirdForm({...birdForm, is_purchased: e.target.checked})}
                    className="form-checkbox"
                  />
                  <label htmlFor="is_purchased" className="text-sm font-medium">
                    🛒 This bird was purchased
                  </label>
                </div>
                
                {birdForm.is_purchased && (
                  <div className="space-y-4 bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-800">Purchase Information</h4>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Purchase Date *</label>
                        <input
                          type="date"
                          value={birdForm.purchase_date}
                          onChange={(e) => setBirdForm({...birdForm, purchase_date: e.target.value})}
                          className="form-input"
                          required={birdForm.is_purchased}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Purchase Price *</label>
                        <div className="flex">
                          <select
                            value={birdForm.purchase_currency}
                            onChange={(e) => setBirdForm({...birdForm, purchase_currency: e.target.value})}
                            className="form-input rounded-r-none w-20"
                          >
                            <option value="RM">RM</option>
                            <option value="$">$</option>
                            <option value="€">€</option>
                            <option value="£">£</option>
                          </select>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={birdForm.purchase_price}
                            onChange={(e) => setBirdForm({...birdForm, purchase_price: e.target.value})}
                            className="form-input rounded-l-none flex-1"
                            placeholder="0.00"
                            required={birdForm.is_purchased}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Purchase Source</label>
                      <input
                        type="text"
                        value={birdForm.purchase_source}
                        onChange={(e) => setBirdForm({...birdForm, purchase_source: e.target.value})}
                        className="form-input"
                        placeholder="e.g., Premium Bird Breeder, Pet Store Name"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Purchase Notes</label>
                      <textarea
                        value={birdForm.purchase_notes}
                        onChange={(e) => setBirdForm({...birdForm, purchase_notes: e.target.value})}
                        className="form-input"
                        rows="2"
                        placeholder="Additional notes about the purchase..."
                      />
                    </div>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <button type="submit" className="btn-primary">Add Bird</button>
                <button 
                  type="button" 
                  onClick={() => setShowAddBirdForm(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Bird Form Modal */}
      {showEditBirdForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="text-xl font-bold mb-4">Edit Bird</h3>
            <form onSubmit={handleUpdateBird} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Species *</label>
                <input
                  type="text"
                  value={birdForm.species}
                  onChange={(e) => setBirdForm({...birdForm, species: e.target.value})}
                  className="form-input"
                  required
                  placeholder="Type species name or select from common ones"
                  list="species-options"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Gender *</label>
                <select
                  value={birdForm.gender}
                  onChange={(e) => setBirdForm({...birdForm, gender: e.target.value})}
                  className="form-input"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Cage Number *</label>
                <input
                  type="text"
                  value={birdForm.cage_number}
                  onChange={(e) => setBirdForm({...birdForm, cage_number: e.target.value})}
                  className="form-input"
                  required
                  placeholder="e.g., A-001, Cage-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Ring Number</label>
                <input
                  type="text"
                  value={birdForm.ring_number}
                  onChange={(e) => setBirdForm({...birdForm, ring_number: e.target.value})}
                  className="form-input"
                  placeholder="e.g., 2024-001"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Birth Date</label>
                <input
                  type="date"
                  value={birdForm.birth_date}
                  onChange={(e) => setBirdForm({...birdForm, birth_date: e.target.value})}
                  className="form-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Color Mutation</label>
                <input
                  type="text"
                  value={birdForm.color_mutation}
                  onChange={(e) => setBirdForm({...birdForm, color_mutation: e.target.value})}
                  className="form-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">License Number</label>
                <input
                  type="text"
                  value={birdForm.license_number}
                  onChange={(e) => setBirdForm({...birdForm, license_number: e.target.value})}
                  className="form-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">License Expiry Date</label>
                <input
                  type="date"
                  value={birdForm.license_expiry}
                  onChange={(e) => setBirdForm({...birdForm, license_expiry: e.target.value})}
                  className="form-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Notes</label>
                <textarea
                  value={birdForm.notes}
                  onChange={(e) => setBirdForm({...birdForm, notes: e.target.value})}
                  className="form-input"
                  rows="3"
                />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="btn-primary">Update Bird</button>
                <button 
                  type="button" 
                  onClick={() => {
                    setShowEditBirdForm(false);
                    setEditingBird(null);
                  }}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Pair Form Modal */}
      {showAddPairForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="text-xl font-bold mb-4">Create New Breeding Pair</h3>
            <form onSubmit={handleAddPair} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Male Bird *</label>
                <select
                  value={pairForm.male_bird_id}
                  onChange={(e) => setPairForm({...pairForm, male_bird_id: e.target.value})}
                  className="form-input"
                  required
                >
                  <option value="">Select Male Bird</option>
                  {birds.filter(bird => bird.gender === 'male' && bird.status === 'active').map(bird => (
                    <option key={bird.id} value={bird.id}>{bird.species} - Cage: {bird.cage_number || 'No Cage'}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Female Bird *</label>
                <select
                  value={pairForm.female_bird_id}
                  onChange={(e) => setPairForm({...pairForm, female_bird_id: e.target.value})}
                  className="form-input"
                  required
                >
                  <option value="">Select Female Bird</option>
                  {birds.filter(bird => bird.gender === 'female' && bird.status === 'active').map(bird => (
                    <option key={bird.id} value={bird.id}>{bird.species} - Cage: {bird.cage_number || 'No Cage'}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Pair Date *</label>
                <input
                  type="date"
                  value={pairForm.pair_date}
                  onChange={(e) => setPairForm({...pairForm, pair_date: e.target.value})}
                  className="form-input"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">License Number</label>
                <input
                  type="text"
                  value={pairForm.license_number}
                  onChange={(e) => setPairForm({...pairForm, license_number: e.target.value})}
                  className="form-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">License Expiry Date</label>
                <input
                  type="date"
                  value={pairForm.license_expiry}
                  onChange={(e) => setPairForm({...pairForm, license_expiry: e.target.value})}
                  className="form-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Notes</label>
                <textarea
                  value={pairForm.notes}
                  onChange={(e) => setPairForm({...pairForm, notes: e.target.value})}
                  className="form-input"
                  rows="3"
                />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="btn-primary">Create Pair</button>
                <button 
                  type="button" 
                  onClick={() => setShowAddPairForm(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Pair Form Modal */}
      {showEditPairForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="text-xl font-bold mb-4">Edit Breeding Pair</h3>
            <form onSubmit={handleUpdatePair} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Male Bird *</label>
                <select
                  value={pairForm.male_bird_id}
                  onChange={(e) => setPairForm({...pairForm, male_bird_id: e.target.value})}
                  className="form-input"
                  required
                >
                  <option value="">Select Male Bird</option>
                  {birds.filter(bird => bird.gender === 'male' && bird.status === 'active').map(bird => (
                    <option key={bird.id} value={bird.id}>{bird.species} - Cage: {bird.cage_number || 'No Cage'}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Female Bird *</label>
                <select
                  value={pairForm.female_bird_id}
                  onChange={(e) => setPairForm({...pairForm, female_bird_id: e.target.value})}
                  className="form-input"
                  required
                >
                  <option value="">Select Female Bird</option>
                  {birds.filter(bird => bird.gender === 'female' && bird.status === 'active').map(bird => (
                    <option key={bird.id} value={bird.id}>{bird.species} - Cage: {bird.cage_number || 'No Cage'}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Pair Date *</label>
                <input
                  type="date"
                  value={pairForm.pair_date}
                  onChange={(e) => setPairForm({...pairForm, pair_date: e.target.value})}
                  className="form-input"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">License Number</label>
                <input
                  type="text"
                  value={pairForm.license_number}
                  onChange={(e) => setPairForm({...pairForm, license_number: e.target.value})}
                  className="form-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">License Expiry Date</label>
                <input
                  type="date"
                  value={pairForm.license_expiry}
                  onChange={(e) => setPairForm({...pairForm, license_expiry: e.target.value})}
                  className="form-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Notes</label>
                <textarea
                  value={pairForm.notes}
                  onChange={(e) => setPairForm({...pairForm, notes: e.target.value})}
                  className="form-input"
                  rows="3"
                />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="btn-primary">Update Pair</button>
                <button 
                  type="button" 
                  onClick={() => {
                    setShowEditPairForm(false);
                    setEditingPair(null);
                  }}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Clutch Form Modal */}
      {showAddClutchForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="text-xl font-bold mb-4">Add New Clutch</h3>
            <form onSubmit={handleAddClutch} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Breeding Pair *</label>
                <select
                  value={clutchForm.breeding_pair_id}
                  onChange={(e) => setClutchForm({...clutchForm, breeding_pair_id: e.target.value})}
                  className="form-input"
                  required
                >
                  <option value="">Select Breeding Pair</option>
                  {breedingPairs.map((pair) => (
                    <option key={pair.id} value={pair.id}>
                      Cage {pair.male_bird?.cage_number} × Cage {pair.female_bird?.cage_number} 
                      ({pair.male_bird?.species} × {pair.female_bird?.species})
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Clutch Number *</label>
                  <input
                    type="number"
                    value={clutchForm.clutch_number}
                    onChange={(e) => setClutchForm({...clutchForm, clutch_number: parseInt(e.target.value)})}
                    className="form-input"
                    min="1"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Eggs Laid *</label>
                  <input
                    type="number"
                    value={clutchForm.eggs_laid}
                    onChange={(e) => setClutchForm({...clutchForm, eggs_laid: parseInt(e.target.value)})}
                    className="form-input"
                    min="1"
                    max="12"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Egg Laying Date *</label>
                <input
                  type="date"
                  value={clutchForm.egg_laying_date}
                  onChange={(e) => setClutchForm({...clutchForm, egg_laying_date: e.target.value})}
                  className="form-input"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Expected Hatch Date *</label>
                <input
                  type="date"
                  value={clutchForm.expected_hatch_date}
                  onChange={(e) => setClutchForm({...clutchForm, expected_hatch_date: e.target.value})}
                  className="form-input"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Fertile Eggs</label>
                  <input
                    type="number"
                    value={clutchForm.fertile_eggs}
                    onChange={(e) => setClutchForm({...clutchForm, fertile_eggs: parseInt(e.target.value)})}
                    className="form-input"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Hatched Count</label>
                  <input
                    type="number"
                    value={clutchForm.hatched_count}
                    onChange={(e) => setClutchForm({...clutchForm, hatched_count: parseInt(e.target.value)})}
                    className="form-input"
                    min="0"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Notes</label>
                <textarea
                  value={clutchForm.notes}
                  onChange={(e) => setClutchForm({...clutchForm, notes: e.target.value})}
                  className="form-input"
                  rows="3"
                  placeholder="Any additional notes about this clutch..."
                />
              </div>
              
              {/* Artificial Incubation Option */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="checkbox"
                    id="start_artificial_incubation"
                    className="form-checkbox"
                  />
                  <label htmlFor="start_artificial_incubation" className="text-sm font-medium">
                    🔬 Start Artificial Incubation Now
                  </label>
                </div>
                <p className="text-xs text-gray-600">
                  Check this option to immediately transfer eggs to an incubator for artificial incubation
                </p>
              </div>
              
              <div className="flex gap-2">
                <button type="submit" className="btn-primary">Add Clutch</button>
                <button 
                  type="button" 
                  onClick={() => setShowAddClutchForm(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Species Form Modal */}
      {showAddSpeciesForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="text-xl font-bold mb-4">Add New Species</h3>
            <form onSubmit={handleAddSpecies} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Species Name *</label>
                <input
                  type="text"
                  value={speciesForm.name}
                  onChange={(e) => setSpeciesForm({...speciesForm, name: e.target.value})}
                  className="form-input"
                  required
                  placeholder="e.g., African Grey Parrot"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Scientific Name</label>
                <input
                  type="text"
                  value={speciesForm.scientific_name}
                  onChange={(e) => setSpeciesForm({...speciesForm, scientific_name: e.target.value})}
                  className="form-input"
                  placeholder="e.g., Psittacus erithacus"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select
                  value={speciesForm.category}
                  onChange={(e) => setSpeciesForm({...speciesForm, category: e.target.value})}
                  className="form-input"
                >
                  <option value="">Select Category</option>
                  <option value="Large Parrot">Large Parrot</option>
                  <option value="Medium Parrot">Medium Parrot</option>
                  <option value="Small Parrot">Small Parrot</option>
                  <option value="Cockatoo">Cockatoo</option>
                  <option value="Macaw">Macaw</option>
                  <option value="Conure">Conure</option>
                  <option value="Lovebird">Lovebird</option>
                  <option value="Budgie">Budgie</option>
                  <option value="Finch">Finch</option>
                  <option value="Canary">Canary</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Incubation Period (days)</label>
                  <input
                    type="number"
                    value={speciesForm.incubation_period}
                    onChange={(e) => setSpeciesForm({...speciesForm, incubation_period: e.target.value})}
                    className="form-input"
                    min="1"
                    placeholder="e.g., 28"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Maturity Age (months)</label>
                  <input
                    type="number"
                    value={speciesForm.maturity_age}
                    onChange={(e) => setSpeciesForm({...speciesForm, maturity_age: e.target.value})}
                    className="form-input"
                    min="1"
                    placeholder="e.g., 18"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Min Clutch Size</label>
                  <input
                    type="number"
                    value={speciesForm.clutch_size_min}
                    onChange={(e) => setSpeciesForm({...speciesForm, clutch_size_min: e.target.value})}
                    className="form-input"
                    min="1"
                    placeholder="e.g., 2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Max Clutch Size</label>
                  <input
                    type="number"
                    value={speciesForm.clutch_size_max}
                    onChange={(e) => setSpeciesForm({...speciesForm, clutch_size_max: e.target.value})}
                    className="form-input"
                    min="1"
                    placeholder="e.g., 4"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Average Lifespan (years)</label>
                <input
                  type="number"
                  value={speciesForm.average_lifespan}
                  onChange={(e) => setSpeciesForm({...speciesForm, average_lifespan: e.target.value})}
                  className="form-input"
                  min="1"
                  placeholder="e.g., 50"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Notes</label>
                <textarea
                  value={speciesForm.notes}
                  onChange={(e) => setSpeciesForm({...speciesForm, notes: e.target.value})}
                  className="form-input"
                  rows="3"
                  placeholder="Additional information about this species..."
                />
              </div>
              
              <div className="flex gap-2">
                <button type="submit" className="btn-primary">Add Species</button>
                <button 
                  type="button" 
                  onClick={() => setShowAddSpeciesForm(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Expense Form Modal */}
      {showAddExpenseForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="text-xl font-bold mb-4">Add Expense</h3>
            <form onSubmit={handleAddExpense} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Amount (*)                  </label>
                  <div className="flex">
                    <select
                      value={expenseForm.currency}
                      onChange={(e) => setExpenseForm({...expenseForm, currency: e.target.value})}
                      className="form-input rounded-r-none w-20"
                    >
                      <option value="RM">RM</option>
                      <option value="$">$</option>
                      <option value="€">€</option>
                      <option value="£">£</option>
                    </select>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={expenseForm.amount}
                      onChange={(e) => setExpenseForm({...expenseForm, amount: e.target.value})}
                      className="form-input rounded-l-none flex-1"
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Date (*)</label>
                  <input
                    type="date"
                    value={expenseForm.date}
                    onChange={(e) => setExpenseForm({...expenseForm, date: e.target.value})}
                    className="form-input"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Category (*)</label>
                <select
                  value={expenseForm.category}
                  onChange={(e) => setExpenseForm({...expenseForm, category: e.target.value})}
                  className="form-input"
                  required
                >
                  <option value="">Choose category</option>
                  <option value="food">Birds Food</option>
                  <option value="supplements">Supplements</option>
                  <option value="vet">Veterinary</option>
                  <option value="equipment">Equipment</option>
                  <option value="setup">Setup/Housing</option>
                  <option value="utilities">Utilities</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <input
                  type="text"
                  value={expenseForm.description}
                  onChange={(e) => setExpenseForm({...expenseForm, description: e.target.value})}
                  className="form-input"
                  placeholder="e.g., Premium parrot pellets, Vet consultation"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Comments</label>
                <textarea
                  value={expenseForm.notes}
                  onChange={(e) => setExpenseForm({...expenseForm, notes: e.target.value})}
                  className="form-input"
                  rows="3"
                  placeholder="Additional notes about this expense..."
                  maxLength="500"
                />
                <div className="text-xs text-gray-500 text-right mt-1">
                  {expenseForm.notes.length}/500
                </div>
              </div>
              
              <div className="flex gap-2">
                <button type="submit" className="btn-primary">Add Expense</button>
                <button 
                  type="button" 
                  onClick={() => setShowAddExpenseForm(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Incubator Form Modal */}
      {showAddIncubatorForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="text-xl font-bold mb-4">Add New Incubator</h3>
            <form onSubmit={handleAddIncubator} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Incubator Name *</label>
                <input
                  type="text"
                  value={incubatorForm.name}
                  onChange={(e) => setIncubatorForm({...incubatorForm, name: e.target.value})}
                  className="form-input"
                  required
                  placeholder="e.g., Incubator A, Main Incubator"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Model</label>
                  <input
                    type="text"
                    value={incubatorForm.model}
                    onChange={(e) => setIncubatorForm({...incubatorForm, model: e.target.value})}
                    className="form-input"
                    placeholder="e.g., HovaBator 1588, Brinsea Octagon 20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Capacity (eggs)</label>
                  <input
                    type="number"
                    min="1"
                    value={incubatorForm.capacity}
                    onChange={(e) => setIncubatorForm({...incubatorForm, capacity: parseInt(e.target.value)})}
                    className="form-input"
                    placeholder="e.g., 20"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Temperature Range</label>
                  <input
                    type="text"
                    value={incubatorForm.temperature_range}
                    onChange={(e) => setIncubatorForm({...incubatorForm, temperature_range: e.target.value})}
                    className="form-input"
                    placeholder="e.g., 37.2-37.8°C"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Humidity Range</label>
                  <input
                    type="text"
                    value={incubatorForm.humidity_range}
                    onChange={(e) => setIncubatorForm({...incubatorForm, humidity_range: e.target.value})}
                    className="form-input"
                    placeholder="e.g., 55-65%"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Turning Interval (hours)</label>
                <input
                  type="number"
                  min="1"
                  step="0.5"
                  value={incubatorForm.turning_interval}
                  onChange={(e) => setIncubatorForm({...incubatorForm, turning_interval: parseFloat(e.target.value)})}
                  className="form-input"
                  placeholder="e.g., 2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Notes</label>
                <textarea
                  value={incubatorForm.notes}
                  onChange={(e) => setIncubatorForm({...incubatorForm, notes: e.target.value})}
                  className="form-input"
                  rows="3"
                  placeholder="Additional notes about this incubator..."
                />
              </div>
              
              <div className="flex gap-2">
                <button type="submit" className="btn-primary">Add Incubator</button>
                <button 
                  type="button" 
                  onClick={() => setShowAddIncubatorForm(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Daily Monitoring Form Modal */}
      {showDailyMonitoringForm && (
        <div className="modal-overlay">
          <div className="modal-content max-w-2xl">
            <h3 className="text-xl font-bold mb-4">📊 Daily Monitoring Entry</h3>
            <form onSubmit={handleAddDailyMonitoring} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Incubator *</label>
                  <select
                    value={dailyMonitoringForm.incubator_id}
                    onChange={(e) => setDailyMonitoringForm({...dailyMonitoringForm, incubator_id: e.target.value})}
                    className="form-input"
                    required
                  >
                    <option value="">Select Incubator</option>
                    {incubators.map((incubator) => (
                      <option key={incubator.id} value={incubator.id}>
                        {incubator.name} ({incubator.model})
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Date *</label>
                  <input
                    type="date"
                    value={dailyMonitoringForm.date}
                    onChange={(e) => setDailyMonitoringForm({...dailyMonitoringForm, date: e.target.value})}
                    className="form-input"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Species Name</label>
                <select
                  value={dailyMonitoringForm.species_name}
                  onChange={(e) => setDailyMonitoringForm({...dailyMonitoringForm, species_name: e.target.value})}
                  className="form-input"
                >
                  <option value="">Select Species (Optional)</option>
                  {species.map((speciesItem) => (
                    <option key={speciesItem.id} value={speciesItem.name}>
                      {speciesItem.name}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Morning Readings */}
              <div className="bg-orange-50 p-4 rounded-lg">
                <h4 className="font-medium text-orange-800 mb-3">🌅 Morning Reading</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Time</label>
                    <input
                      type="time"
                      value={dailyMonitoringForm.morning_time}
                      onChange={(e) => setDailyMonitoringForm({...dailyMonitoringForm, morning_time: e.target.value})}
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Temperature (°C) *</label>
                    <input
                      type="number"
                      step="0.1"
                      min="30"
                      max="45"
                      value={dailyMonitoringForm.morning_temperature}
                      onChange={(e) => setDailyMonitoringForm({...dailyMonitoringForm, morning_temperature: e.target.value})}
                      className="form-input"
                      placeholder="37.5"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Humidity (%) *</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="100"
                      value={dailyMonitoringForm.morning_humidity}
                      onChange={(e) => setDailyMonitoringForm({...dailyMonitoringForm, morning_humidity: e.target.value})}
                      className="form-input"
                      placeholder="55.0"
                      required
                    />
                  </div>
                </div>
              </div>
              
              {/* Evening Readings */}
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-medium text-purple-800 mb-3">🌆 Evening Reading</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Time</label>
                    <input
                      type="time"
                      value={dailyMonitoringForm.evening_time}
                      onChange={(e) => setDailyMonitoringForm({...dailyMonitoringForm, evening_time: e.target.value})}
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Temperature (°C) *</label>
                    <input
                      type="number"
                      step="0.1"
                      min="30"
                      max="45"
                      value={dailyMonitoringForm.evening_temperature}
                      onChange={(e) => setDailyMonitoringForm({...dailyMonitoringForm, evening_temperature: e.target.value})}
                      className="form-input"
                      placeholder="37.3"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Humidity (%) *</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="100"
                      value={dailyMonitoringForm.evening_humidity}
                      onChange={(e) => setDailyMonitoringForm({...dailyMonitoringForm, evening_humidity: e.target.value})}
                      className="form-input"
                      placeholder="60.0"
                      required
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Notes</label>
                <textarea
                  value={dailyMonitoringForm.notes}
                  onChange={(e) => setDailyMonitoringForm({...dailyMonitoringForm, notes: e.target.value})}
                  className="form-input"
                  rows="2"
                  placeholder="Any observations, concerns, or maintenance notes..."
                />
              </div>
              
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>📈 Daily averages will be calculated automatically:</strong><br/>
                  • Temperature average from morning and evening readings<br/>
                  • Humidity average from morning and evening readings
                </p>
              </div>
              
              <div className="flex gap-2">
                <button type="submit" className="btn-primary">Add Daily Reading</button>
                <button 
                  type="button" 
                  onClick={() => setShowDailyMonitoringForm(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;