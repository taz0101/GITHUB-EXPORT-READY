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
  const [showSearchModal, setShowSearchModal] = useState(false);
  
  // Edit states
  const [editingBird, setEditingBird] = useState(null);
  const [editingPair, setEditingPair] = useState(null);
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
    notes: ''
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
    amount: 0,
    date: '',
    category: 'food',
    description: '',
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
          notes: ''
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
          notes: ''
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
        <h2 className="text-2xl font-bold">🔬 Incubators</h2>
        <button 
          onClick={() => setShowAddIncubatorForm(true)}
          className="btn-primary"
        >
          Add New Incubator
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {incubators.map((incubator) => (
          <div key={incubator.id} className="incubator-card">
            <h3 className="font-bold text-lg mb-2">{incubator.name}</h3>
            <div className="space-y-1">
              <p className="text-sm"><strong>Model:</strong> {incubator.model}</p>
              <p className="text-sm"><strong>Capacity:</strong> {incubator.capacity} eggs</p>
              <p className="text-sm"><strong>Temperature:</strong> {incubator.temperature_range}</p>
              <p className="text-sm"><strong>Humidity:</strong> {incubator.humidity_range}</p>
              <p className="text-sm"><strong>Turning:</strong> Every {incubator.turning_interval}h</p>
            </div>
            {incubator.notes && (
              <p className="text-sm text-gray-500 mt-2 italic">{incubator.notes}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  // Render Transactions
  const renderTransactions = () => (
    <div className="transactions-section">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">💰 Financial Transactions</h2>
        <button 
          onClick={() => setShowAddTransactionForm(true)}
          className="btn-primary"
        >
          Add Transaction
        </button>
      </div>

      <div className="space-y-4">
        {transactions.map((transaction) => (
          <div key={transaction.id} className="transaction-card">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold">{transaction.description}</h3>
                <p className="text-sm text-gray-600">{transaction.category}</p>
                <p className="text-sm text-gray-500">{new Date(transaction.date).toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                <p className={`font-bold ${transaction.transaction_type === 'sale' ? 'text-green-600' : transaction.transaction_type === 'purchase' ? 'text-blue-600' : 'text-red-600'}`}>
                  {transaction.transaction_type === 'expense' ? '-' : '+'}${transaction.amount}
                </p>
                <p className="text-sm text-gray-500 capitalize">{transaction.transaction_type}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

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
            onClick={() => setActiveTab('reports')}
            className={`nav-btn ${activeTab === 'reports' ? 'active' : ''}`}
          >
            Reports
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
        {activeTab === 'reports' && renderReports()}
      </main>

      {/* Add Bird Form Modal */}
      {showAddBirdForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="text-xl font-bold mb-4">Add New Bird</h3>
            <form onSubmit={handleAddBird} className="space-y-4">
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
                <datalist id="species-options">
                  <option value="African Grey">African Grey</option>
                  <option value="Cockatiel">Cockatiel</option>
                  <option value="Lovebird">Lovebird</option>
                  <option value="Macaw">Macaw</option>
                  <option value="Conure">Conure</option>
                  <option value="Budgie">Budgie</option>
                  <option value="Cockatoo">Cockatoo</option>
                  <option value="Caique">Caique</option>
                  <option value="Eclectus">Eclectus</option>
                  <option value="Amazon">Amazon</option>
                  <option value="Alexandrine">Alexandrine</option>
                  <option value="Ringneck">Ringneck</option>
                  <option value="Senegal">Senegal</option>
                </datalist>
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
    </div>
  );
}

export default App;