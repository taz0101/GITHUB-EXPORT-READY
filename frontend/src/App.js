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
  const [showAddBirdForm, setShowAddBirdForm] = useState(false);
  const [showAddPairForm, setShowAddPairForm] = useState(false);
  const [showAddClutchForm, setShowAddClutchForm] = useState(false);
  const [showAddChickForm, setShowAddChickForm] = useState(false);
  const [showAddTransactionForm, setShowAddTransactionForm] = useState(false);
  const [showAddIncubatorForm, setShowAddIncubatorForm] = useState(false);
  const [showAddArtificialIncubationForm, setShowAddArtificialIncubationForm] = useState(false);
  const [showLicenseForm, setShowLicenseForm] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [mainLicense, setMainLicense] = useState(null);

  // Form states
  const [birdForm, setBirdForm] = useState({
    species: '',
    gender: 'male',
    birth_date: '',
    ring_number: '',
    color_mutation: '',
    license_number: '',
    license_expiry: '',
    notes: ''
  });

  const [pairForm, setPairForm] = useState({
    male_bird_id: '',
    female_bird_id: '',
    pair_name: '',
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

  const [searchForm, setSearchForm] = useState({
    query: '',
    species: '',
    status: '',
    search_type: 'all'
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

  const handleAddPair = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${BACKEND_URL}/api/breeding-pairs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pairForm),
      });
      
      if (response.ok) {
        setPairForm({
          male_bird_id: '',
          female_bird_id: '',
          pair_name: '',
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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="stat-card">
            <h3 className="text-sm font-semibold text-blue-600">Total Birds</h3>
            <p className="text-2xl font-bold">{dashboardData.stats.total_birds}</p>
          </div>
          <div className="stat-card">
            <h3 className="text-sm font-semibold text-green-600">Active Pairs</h3>
            <p className="text-2xl font-bold">{dashboardData.stats.total_pairs}</p>
          </div>
          <div className="stat-card">
            <h3 className="text-sm font-semibold text-orange-600">Active Clutches</h3>
            <p className="text-2xl font-bold">{dashboardData.stats.active_clutches}</p>
          </div>
          <div className="stat-card">
            <h3 className="text-sm font-semibold text-purple-600">Total Chicks</h3>
            <p className="text-2xl font-bold">{dashboardData.stats.total_chicks}</p>
          </div>
          <div className="stat-card">
            <h3 className="text-sm font-semibold text-green-600">Revenue</h3>
            <p className="text-2xl font-bold">${dashboardData.stats.total_revenue}</p>
          </div>
          <div className="stat-card">
            <h3 className="text-sm font-semibold text-red-600">Expenses</h3>
            <p className="text-2xl font-bold">${dashboardData.stats.total_expenses}</p>
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
                    {clutch.breeding_pair?.pair_name || 'Unknown Pair'} - Clutch #{clutch.clutch_number}
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
              <span className={`gender-badge ${bird.gender}`}>
                {bird.gender === 'male' ? '♂' : '♀'}
              </span>
            </div>
            <p className="text-gray-600 mb-2">Ring: {bird.ring_number || 'No Ring'}</p>
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
            <span className={`status-badge ${bird.status}`}>{bird.status}</span>
          </div>
        ))}
      </div>

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
                  <option value="Other">Other</option>
                </select>
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
                <label className="block text-sm font-medium mb-1">Birth Date</label>
                <input
                  type="date"
                  value={birdForm.birth_date}
                  onChange={(e) => setBirdForm({...birdForm, birth_date: e.target.value})}
                  className="form-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Ring Number *</label>
                <input
                  type="text"
                  value={birdForm.ring_number}
                  onChange={(e) => setBirdForm({...birdForm, ring_number: e.target.value})}
                  className="form-input"
                  required
                  placeholder="e.g., 2024-001"
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
            <h3 className="font-bold text-lg mb-2">{pair.pair_name}</h3>
            <div className="flex justify-between items-center mb-4">
              <div className="bird-info">
                <p className="font-semibold text-blue-600">♂ {pair.male_bird?.species}</p>
                <p className="text-sm text-gray-600">Ring: {pair.male_bird?.ring_number || 'No Ring'}</p>
              </div>
              <div className="text-center">
                <span className="text-2xl">💕</span>
              </div>
              <div className="bird-info text-right">
                <p className="font-semibold text-pink-600">♀ {pair.female_bird?.species}</p>
                <p className="text-sm text-gray-600">Ring: {pair.female_bird?.ring_number || 'No Ring'}</p>
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
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500">
                Paired: {new Date(pair.pair_date).toLocaleDateString()}
              </p>
              <span className={`status-badge ${pair.status}`}>{pair.status}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Pair Form Modal */}
      {showAddPairForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="text-xl font-bold mb-4">Create New Breeding Pair</h3>
            <form onSubmit={handleAddPair} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Pair Name *</label>
                <input
                  type="text"
                  value={pairForm.pair_name}
                  onChange={(e) => setPairForm({...pairForm, pair_name: e.target.value})}
                  className="form-input"
                  required
                />
              </div>
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
                    <option key={bird.id} value={bird.id}>{bird.species} - {bird.ring_number || 'No Ring'}</option>
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
                    <option key={bird.id} value={bird.id}>{bird.species} - {bird.ring_number || 'No Ring'}</option>
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
    </div>
  );

  // Render Clutches
  const renderClutches = () => (
    <div className="clutches-section">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">🥚 Clutches</h2>
        <button 
          onClick={() => setShowAddClutchForm(true)}
          className="btn-primary"
        >
          Add New Clutch
        </button>
      </div>

      <div className="space-y-4">
        {clutches.map((clutch) => (
          <div key={clutch.id} className="clutch-card">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg">
                  {clutch.breeding_pair?.pair_name || 'Unknown Pair'} - Clutch #{clutch.clutch_number}
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  {clutch.breeding_pair?.male_bird?.species} × {clutch.breeding_pair?.female_bird?.species}
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm"><strong>Eggs Laid:</strong> {clutch.eggs_laid}</p>
                    <p className="text-sm"><strong>Fertile:</strong> {clutch.fertile_eggs || 'N/A'}</p>
                    <p className="text-sm"><strong>Hatched:</strong> {clutch.hatched_count || 0}</p>
                  </div>
                  <div>
                    <p className="text-sm"><strong>Laid:</strong> {new Date(clutch.egg_laying_date).toLocaleDateString()}</p>
                    <p className="text-sm"><strong>Expected Hatch:</strong> {new Date(clutch.expected_hatch_date).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
              <span className={`status-badge ${clutch.status}`}>{clutch.status}</span>
            </div>
          </div>
        ))}
      </div>

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
                  {breedingPairs.filter(pair => pair.status === 'active').map(pair => (
                    <option key={pair.id} value={pair.id}>{pair.pair_name}</option>
                  ))}
                </select>
              </div>
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
                <label className="block text-sm font-medium mb-1">Egg Laying Date *</label>
                <input
                  type="date"
                  value={clutchForm.egg_laying_date}
                  onChange={(e) => {
                    const selectedPair = breedingPairs.find(p => p.id === clutchForm.breeding_pair_id);
                    const species = selectedPair?.male_bird?.species || 'default';
                    handleLayingDateChange(e.target.value, species);
                  }}
                  className="form-input"
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
                  min="0"
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
                  readOnly
                  style={{backgroundColor: '#f9fafb'}}
                />
                <p className="text-xs text-gray-500 mt-1">Auto-calculated based on species incubation period</p>
              </div>
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
              <div>
                <label className="block text-sm font-medium mb-1">Notes</label>
                <textarea
                  value={clutchForm.notes}
                  onChange={(e) => setClutchForm({...clutchForm, notes: e.target.value})}
                  className="form-input"
                  rows="3"
                />
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

  // Render Chicks
  const renderChicks = () => (
    <div className="chicks-section">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">🐣 Chicks</h2>
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
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-lg">
                Chick #{chick.chick_number}
              </h3>
              {chick.gender && (
                <span className={`gender-badge ${chick.gender}`}>
                  {chick.gender === 'male' ? '♂' : '♀'}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600 mb-2">
              From: {chick.clutch?.breeding_pair?.pair_name || 'Unknown Pair'}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              Parents: {chick.clutch?.breeding_pair?.male_bird?.species} × {chick.clutch?.breeding_pair?.female_bird?.species}
            </p>
            <div className="text-sm space-y-1">
              <p><strong>Hatched:</strong> {new Date(chick.hatch_date).toLocaleDateString()}</p>
              <p><strong>Age:</strong> {chick.age_days} days</p>
              {chick.ring_number && <p><strong>Ring:</strong> {chick.ring_number}</p>}
              {chick.weight > 0 && <p><strong>Weight:</strong> {chick.weight}g</p>}
              {chick.color_mutation && <p><strong>Color:</strong> {chick.color_mutation}</p>}
              {chick.weaning_date && (
                <p><strong>Weaned:</strong> {new Date(chick.weaning_date).toLocaleDateString()}</p>
              )}
            </div>
            <span className={`status-badge ${chick.status}`}>{chick.status}</span>
          </div>
        ))}
      </div>

      {/* Add Chick Form Modal */}
      {showAddChickForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="text-xl font-bold mb-4">Add New Chick</h3>
            <form onSubmit={handleAddChick} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Clutch *</label>
                <select
                  value={chickForm.clutch_id}
                  onChange={(e) => setChickForm({...chickForm, clutch_id: e.target.value})}
                  className="form-input"
                  required
                >
                  <option value="">Select Clutch</option>
                  {clutches.map(clutch => (
                    <option key={clutch.id} value={clutch.id}>
                      {clutch.breeding_pair?.pair_name || 'Unknown'} - Clutch #{clutch.clutch_number}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Chick Number *</label>
                <input
                  type="number"
                  value={chickForm.chick_number}
                  onChange={(e) => setChickForm({...chickForm, chick_number: parseInt(e.target.value)})}
                  className="form-input"
                  min="1"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Hatch Date *</label>
                <input
                  type="date"
                  value={chickForm.hatch_date}
                  onChange={(e) => setChickForm({...chickForm, hatch_date: e.target.value})}
                  className="form-input"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Ring Number</label>
                <input
                  type="text"
                  value={chickForm.ring_number}
                  onChange={(e) => setChickForm({...chickForm, ring_number: e.target.value})}
                  className="form-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Gender</label>
                <select
                  value={chickForm.gender}
                  onChange={(e) => setChickForm({...chickForm, gender: e.target.value})}
                  className="form-input"
                >
                  <option value="">Unknown</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Color Mutation</label>
                <input
                  type="text"
                  value={chickForm.color_mutation}
                  onChange={(e) => setChickForm({...chickForm, color_mutation: e.target.value})}
                  className="form-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Weight (grams)</label>
                <input
                  type="number"
                  value={chickForm.weight}
                  onChange={(e) => setChickForm({...chickForm, weight: parseFloat(e.target.value)})}
                  className="form-input"
                  min="0"
                  step="0.1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Notes</label>
                <textarea
                  value={chickForm.notes}
                  onChange={(e) => setChickForm({...chickForm, notes: e.target.value})}
                  className="form-input"
                  rows="3"
                />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="btn-primary">Add Chick</button>
                <button 
                  type="button" 
                  onClick={() => setShowAddChickForm(false)}
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
          <div key={transaction.id} className={`transaction-card ${transaction.transaction_type}`}>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg capitalize">{transaction.transaction_type}</h3>
                <p className="text-sm text-gray-600 mb-1">{transaction.description}</p>
                <p className="text-sm text-gray-500">Category: {transaction.category}</p>
                {transaction.notes && (
                  <p className="text-sm text-gray-500">Notes: {transaction.notes}</p>
                )}
              </div>
              <div className="text-right">
                <p className={`text-lg font-bold ${transaction.transaction_type === 'sale' ? 'text-green-600' : 'text-red-600'}`}>
                  {transaction.transaction_type === 'sale' ? '+' : '-'}${transaction.amount}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(transaction.date).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Transaction Form Modal */}
      {showAddTransactionForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="text-xl font-bold mb-4">Add New Transaction</h3>
            <form onSubmit={handleAddTransaction} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Transaction Type *</label>
                <select
                  value={transactionForm.transaction_type}
                  onChange={(e) => setTransactionForm({...transactionForm, transaction_type: e.target.value})}
                  className="form-input"
                  required
                >
                  <option value="expense">Expense</option>
                  <option value="purchase">Purchase</option>
                  <option value="sale">Sale</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Amount *</label>
                <input
                  type="number"
                  value={transactionForm.amount}
                  onChange={(e) => setTransactionForm({...transactionForm, amount: parseFloat(e.target.value)})}
                  className="form-input"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Date *</label>
                <input
                  type="date"
                  value={transactionForm.date}
                  onChange={(e) => setTransactionForm({...transactionForm, date: e.target.value})}
                  className="form-input"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Category *</label>
                <select
                  value={transactionForm.category}
                  onChange={(e) => setTransactionForm({...transactionForm, category: e.target.value})}
                  className="form-input"
                  required
                >
                  <option value="food">Food</option>
                  <option value="vet">Veterinary</option>
                  <option value="equipment">Equipment</option>
                  <option value="setup">Setup</option>
                  <option value="bird_purchase">Bird Purchase</option>
                  <option value="bird_sale">Bird Sale</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description *</label>
                <input
                  type="text"
                  value={transactionForm.description}
                  onChange={(e) => setTransactionForm({...transactionForm, description: e.target.value})}
                  className="form-input"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Notes</label>
                <textarea
                  value={transactionForm.notes}
                  onChange={(e) => setTransactionForm({...transactionForm, notes: e.target.value})}
                  className="form-input"
                  rows="3"
                />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="btn-primary">Add Transaction</button>
                <button 
                  type="button" 
                  onClick={() => setShowAddTransactionForm(false)}
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

  // Render Reports
  const renderReports = () => {
    if (!breedingReport) {
      fetchBreedingReport();
      return <div className="loading">Loading reports...</div>;
    }

    return (
      <div className="reports-section">
        <h2 className="text-2xl font-bold mb-6">📊 Breeding Reports</h2>
        
        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="stat-card">
            <h3 className="text-sm font-semibold text-blue-600">Total Clutches</h3>
            <p className="text-2xl font-bold">{breedingReport.summary.total_clutches}</p>
          </div>
          <div className="stat-card">
            <h3 className="text-sm font-semibold text-orange-600">Total Eggs</h3>
            <p className="text-2xl font-bold">{breedingReport.summary.total_eggs}</p>
          </div>
          <div className="stat-card">
            <h3 className="text-sm font-semibold text-green-600">Total Hatched</h3>
            <p className="text-2xl font-bold">{breedingReport.summary.total_hatched}</p>
          </div>
          <div className="stat-card">
            <h3 className="text-sm font-semibold text-purple-600">Success Rate</h3>
            <p className="text-2xl font-bold">{breedingReport.summary.overall_success_rate}%</p>
          </div>
        </div>

        {/* Pair Performance */}
        <div className="pair-performance mb-8">
          <h3 className="text-xl font-bold mb-4">Breeding Pair Performance</h3>
          <div className="space-y-4">
            {breedingReport.pair_performance.map((pair, index) => (
              <div key={index} className="report-card">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-lg">{pair.pair_name}</h4>
                    <p className="text-sm text-gray-600">
                      {pair.male_bird} × {pair.female_bird}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">{pair.success_rate}%</p>
                    <p className="text-sm text-gray-500">Success Rate</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div className="text-center">
                    <p className="text-lg font-bold">{pair.clutches}</p>
                    <p className="text-sm text-gray-500">Clutches</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold">{pair.eggs_laid}</p>
                    <p className="text-sm text-gray-500">Eggs Laid</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold">{pair.hatched}</p>
                    <p className="text-sm text-gray-500">Hatched</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Species Performance */}
        {breedingReport.species_performance && (
          <div className="species-performance">
            <h3 className="text-xl font-bold mb-4">Species Performance</h3>
            <div className="space-y-4">
              {Object.entries(breedingReport.species_performance).map(([species, stats], index) => (
                <div key={index} className="report-card">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-lg">{species}</h4>
                      <p className="text-sm text-gray-600">{stats.pairs} breeding pairs</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-600">{stats.success_rate}%</p>
                      <p className="text-sm text-gray-500">Success Rate</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <div className="text-center">
                      <p className="text-lg font-bold">{stats.clutches}</p>
                      <p className="text-sm text-gray-500">Clutches</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold">{stats.eggs}</p>
                      <p className="text-sm text-gray-500">Eggs</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold">{stats.hatched}</p>
                      <p className="text-sm text-gray-500">Hatched</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="app">
      <header className="header">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">🦜 Parrot Breeding Management</h1>
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
        {activeTab === 'transactions' && renderTransactions()}
        {activeTab === 'reports' && renderReports()}
      </main>

      {/* Notifications */}
      {notifications?.notifications?.length > 0 && (
        <div className="notifications-bar">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold text-red-600">🔔 Active Notifications</h3>
            <span className="badge">{notifications.counts.total}</span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {notifications.notifications.slice(0, 3).map((notification, index) => (
              <div key={index} className={`notification-card ${notification.priority}`}>
                <div className="flex items-start gap-2">
                  <span className="text-lg">
                    {notification.type === 'hatching' ? '🥚' : '📋'}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm">{notification.title}</p>
                    <p className="text-xs text-gray-600 truncate">{notification.message}</p>
                    <p className="text-xs text-gray-500">{notification.details}</p>
                  </div>
                </div>
              </div>
            ))}
            {notifications.notifications.length > 3 && (
              <div className="notification-card">
                <p className="text-sm text-gray-600">
                  +{notifications.notifications.length - 3} more...
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Search Modal */}
      {showSearchModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="text-xl font-bold mb-4">🔍 Advanced Search</h3>
            <form onSubmit={handleSearch} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Search Query</label>
                <input
                  type="text"
                  value={searchForm.query}
                  onChange={(e) => setSearchForm({...searchForm, query: e.target.value})}
                  className="form-input"
                  placeholder="Ring number, species, notes..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Species</label>
                <select
                  value={searchForm.species}
                  onChange={(e) => setSearchForm({...searchForm, species: e.target.value})}
                  className="form-input"
                >
                  <option value="">All Species</option>
                  <option value="African Grey">African Grey</option>
                  <option value="Cockatiel">Cockatiel</option>
                  <option value="Lovebird">Lovebird</option>
                  <option value="Macaw">Macaw</option>
                  <option value="Conure">Conure</option>
                  <option value="Budgie">Budgie</option>
                  <option value="Cockatoo">Cockatoo</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  value={searchForm.status}
                  onChange={(e) => setSearchForm({...searchForm, status: e.target.value})}
                  className="form-input"
                >
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="sold">Sold</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Search In</label>
                <select
                  value={searchForm.search_type}
                  onChange={(e) => setSearchForm({...searchForm, search_type: e.target.value})}
                  className="form-input"
                >
                  <option value="all">All</option>
                  <option value="birds">Birds Only</option>
                  <option value="pairs">Breeding Pairs Only</option>
                  <option value="clutches">Clutches Only</option>
                </select>
              </div>
              <div className="flex gap-2">
                <button type="submit" className="btn-primary">Search</button>
                <button 
                  type="button" 
                  onClick={() => setShowSearchModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>

            {/* Search Results */}
            {searchResults && (
              <div className="search-results mt-6">
                <h4 className="font-semibold mb-3">Search Results</h4>
                
                {searchResults.birds?.length > 0 && (
                  <div className="mb-4">
                    <h5 className="font-medium text-blue-600 mb-2">Birds ({searchResults.birds.length})</h5>
                    <div className="space-y-2">
                      {searchResults.birds.slice(0, 5).map((bird, index) => (
                        <div key={index} className="search-result-item">
                          <span className={`gender-badge ${bird.gender} small`}>
                            {bird.gender === 'male' ? '♂' : '♀'}
                          </span>
                          <span className="font-medium">{bird.species}</span>
                          <span className="text-gray-500">- {bird.ring_number || 'No Ring'}</span>
                          <span className={`status-badge ${bird.status} small`}>{bird.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {searchResults.pairs?.length > 0 && (
                  <div className="mb-4">
                    <h5 className="font-medium text-pink-600 mb-2">Breeding Pairs ({searchResults.pairs.length})</h5>
                    <div className="space-y-2">
                      {searchResults.pairs.slice(0, 5).map((pair, index) => (
                        <div key={index} className="search-result-item">
                          <span className="font-medium">{pair.pair_name}</span>
                          <span className="text-gray-500">
                            - {pair.male_bird?.species} × {pair.female_bird?.species}
                          </span>
                          <span className={`status-badge ${pair.status} small`}>{pair.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {searchResults.clutches?.length > 0 && (
                  <div className="mb-4">
                    <h5 className="font-medium text-orange-600 mb-2">Clutches ({searchResults.clutches.length})</h5>
                    <div className="space-y-2">
                      {searchResults.clutches.slice(0, 5).map((clutch, index) => (
                        <div key={index} className="search-result-item">
                          <span className="font-medium">
                            {clutch.breeding_pair?.pair_name} - Clutch #{clutch.clutch_number}
                          </span>
                          <span className="text-gray-500">
                            - {clutch.eggs_laid} eggs, {clutch.hatched_count || 0} hatched
                          </span>
                          <span className={`status-badge ${clutch.status} small`}>{clutch.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {(!searchResults.birds?.length && !searchResults.pairs?.length && !searchResults.clutches?.length) && (
                  <p className="text-gray-500 text-center py-4">No results found</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
      {showLicenseForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="text-xl font-bold mb-4">
              {mainLicense ? 'Update Main License' : 'Add Main Breeding License'}
            </h3>
            <form onSubmit={handleAddLicense} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">License Number *</label>
                <input
                  type="text"
                  value={licenseForm.license_number}
                  onChange={(e) => setLicenseForm({...licenseForm, license_number: e.target.value})}
                  className="form-input"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">License Type *</label>
                <select
                  value={licenseForm.license_type}
                  onChange={(e) => setLicenseForm({...licenseForm, license_type: e.target.value})}
                  className="form-input"
                  required
                >
                  <option value="breeding">Breeding</option>
                  <option value="commercial">Commercial</option>
                  <option value="import">Import</option>
                  <option value="export">Export</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Issue Date *</label>
                <input
                  type="date"
                  value={licenseForm.issue_date}
                  onChange={(e) => setLicenseForm({...licenseForm, issue_date: e.target.value})}
                  className="form-input"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Expiry Date *</label>
                <input
                  type="date"
                  value={licenseForm.expiry_date}
                  onChange={(e) => setLicenseForm({...licenseForm, expiry_date: e.target.value})}
                  className="form-input"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Issuing Authority *</label>
                <input
                  type="text"
                  value={licenseForm.issuing_authority}
                  onChange={(e) => setLicenseForm({...licenseForm, issuing_authority: e.target.value})}
                  className="form-input"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Notes</label>
                <textarea
                  value={licenseForm.notes}
                  onChange={(e) => setLicenseForm({...licenseForm, notes: e.target.value})}
                  className="form-input"
                  rows="3"
                />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="btn-primary">
                  {mainLicense ? 'Update License' : 'Add License'}
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowLicenseForm(false)}
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