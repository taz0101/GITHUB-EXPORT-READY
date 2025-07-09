import React, { useState, useEffect } from 'react';
import './App.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [birds, setBirds] = useState([]);
  const [breedingPairs, setBreedingPairs] = useState([]);
  const [breedingRecords, setBreedingRecords] = useState([]);
  const [dashboardData, setDashboardData] = useState(null);
  const [showAddBirdForm, setShowAddBirdForm] = useState(false);
  const [showAddPairForm, setShowAddPairForm] = useState(false);
  const [showAddRecordForm, setShowAddRecordForm] = useState(false);

  // Form states
  const [birdForm, setBirdForm] = useState({
    name: '',
    species: '',
    gender: 'male',
    birth_date: '',
    ring_number: '',
    color_mutation: '',
    notes: ''
  });

  const [pairForm, setPairForm] = useState({
    male_bird_id: '',
    female_bird_id: '',
    pair_name: '',
    pair_date: '',
    notes: ''
  });

  const [recordForm, setRecordForm] = useState({
    breeding_pair_id: '',
    breeding_cycle_number: 1,
    egg_laying_date: '',
    eggs_laid: 0,
    expected_hatch_date: '',
    hatched_count: 0,
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

  const fetchBreedingRecords = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/breeding-records`);
      const data = await response.json();
      setBreedingRecords(data.breeding_records);
    } catch (error) {
      console.error('Error fetching breeding records:', error);
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

  // Load data on component mount
  useEffect(() => {
    fetchBirds();
    fetchBreedingPairs();
    fetchBreedingRecords();
    fetchDashboard();
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
          name: '',
          species: '',
          gender: 'male',
          birth_date: '',
          ring_number: '',
          color_mutation: '',
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

  const handleAddRecord = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${BACKEND_URL}/api/breeding-records`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(recordForm),
      });
      
      if (response.ok) {
        setRecordForm({
          breeding_pair_id: '',
          breeding_cycle_number: 1,
          egg_laying_date: '',
          eggs_laid: 0,
          expected_hatch_date: '',
          hatched_count: 0,
          notes: ''
        });
        setShowAddRecordForm(false);
        fetchBreedingRecords();
        fetchDashboard();
      }
    } catch (error) {
      console.error('Error adding breeding record:', error);
    }
  };

  // Render Dashboard
  const renderDashboard = () => (
    <div className="dashboard">
      <h2 className="text-2xl font-bold mb-6">🦜 Breeding Dashboard</h2>
      
      {dashboardData && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="stat-card">
            <h3 className="text-lg font-semibold text-blue-600">Total Birds</h3>
            <p className="text-3xl font-bold">{dashboardData.stats.total_birds}</p>
          </div>
          <div className="stat-card">
            <h3 className="text-lg font-semibold text-green-600">Active Pairs</h3>
            <p className="text-3xl font-bold">{dashboardData.stats.total_pairs}</p>
          </div>
          <div className="stat-card">
            <h3 className="text-lg font-semibold text-orange-600">Active Breeding</h3>
            <p className="text-3xl font-bold">{dashboardData.stats.active_breeding_records}</p>
          </div>
        </div>
      )}

      <div className="recent-activity">
        <h3 className="text-xl font-bold mb-4">Recent Breeding Activity</h3>
        <div className="space-y-4">
          {dashboardData?.recent_breeding_records?.map((record, index) => (
            <div key={index} className="activity-card">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold">
                    {record.breeding_pair?.pair_name || 'Unknown Pair'}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {record.breeding_pair?.male_bird?.name} × {record.breeding_pair?.female_bird?.name}
                  </p>
                  <p className="text-sm">
                    Eggs: {record.eggs_laid} | Hatched: {record.hatched_count || 0} | 
                    Status: <span className={`status-${record.status}`}>{record.status}</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">
                    Laid: {new Date(record.egg_laying_date).toLocaleDateString()}
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
          <div key={bird.id} className="bird-card">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-lg">{bird.name}</h3>
              <span className={`gender-badge ${bird.gender}`}>
                {bird.gender === 'male' ? '♂' : '♀'}
              </span>
            </div>
            <p className="text-gray-600 mb-2">{bird.species}</p>
            {bird.ring_number && (
              <p className="text-sm text-gray-500">Ring: {bird.ring_number}</p>
            )}
            {bird.color_mutation && (
              <p className="text-sm text-gray-500">Color: {bird.color_mutation}</p>
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

      {/* Add Bird Form Modal */}
      {showAddBirdForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="text-xl font-bold mb-4">Add New Bird</h3>
            <form onSubmit={handleAddBird} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name *</label>
                <input
                  type="text"
                  value={birdForm.name}
                  onChange={(e) => setBirdForm({...birdForm, name: e.target.value})}
                  className="form-input"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Species *</label>
                <input
                  type="text"
                  value={birdForm.species}
                  onChange={(e) => setBirdForm({...birdForm, species: e.target.value})}
                  className="form-input"
                  required
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
                <label className="block text-sm font-medium mb-1">Birth Date</label>
                <input
                  type="date"
                  value={birdForm.birth_date}
                  onChange={(e) => setBirdForm({...birdForm, birth_date: e.target.value})}
                  className="form-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Ring Number</label>
                <input
                  type="text"
                  value={birdForm.ring_number}
                  onChange={(e) => setBirdForm({...birdForm, ring_number: e.target.value})}
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
          <div key={pair.id} className="pair-card">
            <h3 className="font-bold text-lg mb-2">{pair.pair_name}</h3>
            <div className="flex justify-between items-center mb-4">
              <div className="bird-info">
                <p className="font-semibold text-blue-600">♂ {pair.male_bird?.name}</p>
                <p className="text-sm text-gray-600">{pair.male_bird?.species}</p>
              </div>
              <div className="text-center">
                <span className="text-2xl">💕</span>
              </div>
              <div className="bird-info text-right">
                <p className="font-semibold text-pink-600">♀ {pair.female_bird?.name}</p>
                <p className="text-sm text-gray-600">{pair.female_bird?.species}</p>
              </div>
            </div>
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
                    <option key={bird.id} value={bird.id}>{bird.name} - {bird.species}</option>
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
                    <option key={bird.id} value={bird.id}>{bird.name} - {bird.species}</option>
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

  // Render Breeding Records
  const renderBreedingRecords = () => (
    <div className="breeding-records-section">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">🥚 Breeding Records</h2>
        <button 
          onClick={() => setShowAddRecordForm(true)}
          className="btn-primary"
        >
          Add New Record
        </button>
      </div>

      <div className="space-y-4">
        {breedingRecords.map((record) => (
          <div key={record.id} className="record-card">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg">
                  {record.breeding_pair?.pair_name || 'Unknown Pair'}
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  {record.breeding_pair?.male_bird?.name} × {record.breeding_pair?.female_bird?.name}
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm"><strong>Cycle:</strong> #{record.breeding_cycle_number}</p>
                    <p className="text-sm"><strong>Eggs Laid:</strong> {record.eggs_laid}</p>
                    <p className="text-sm"><strong>Hatched:</strong> {record.hatched_count || 0}</p>
                  </div>
                  <div>
                    <p className="text-sm"><strong>Laid Date:</strong> {new Date(record.egg_laying_date).toLocaleDateString()}</p>
                    <p className="text-sm"><strong>Expected Hatch:</strong> {new Date(record.expected_hatch_date).toLocaleDateString()}</p>
                    {record.hatch_success_rate && (
                      <p className="text-sm"><strong>Success Rate:</strong> {record.hatch_success_rate.toFixed(1)}%</p>
                    )}
                  </div>
                </div>
              </div>
              <span className={`status-badge ${record.status}`}>{record.status}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Record Form Modal */}
      {showAddRecordForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="text-xl font-bold mb-4">Add New Breeding Record</h3>
            <form onSubmit={handleAddRecord} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Breeding Pair *</label>
                <select
                  value={recordForm.breeding_pair_id}
                  onChange={(e) => setRecordForm({...recordForm, breeding_pair_id: e.target.value})}
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
                <label className="block text-sm font-medium mb-1">Breeding Cycle Number *</label>
                <input
                  type="number"
                  value={recordForm.breeding_cycle_number}
                  onChange={(e) => setRecordForm({...recordForm, breeding_cycle_number: parseInt(e.target.value)})}
                  className="form-input"
                  min="1"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Egg Laying Date *</label>
                <input
                  type="date"
                  value={recordForm.egg_laying_date}
                  onChange={(e) => setRecordForm({...recordForm, egg_laying_date: e.target.value})}
                  className="form-input"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Eggs Laid *</label>
                <input
                  type="number"
                  value={recordForm.eggs_laid}
                  onChange={(e) => setRecordForm({...recordForm, eggs_laid: parseInt(e.target.value)})}
                  className="form-input"
                  min="0"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Expected Hatch Date *</label>
                <input
                  type="date"
                  value={recordForm.expected_hatch_date}
                  onChange={(e) => setRecordForm({...recordForm, expected_hatch_date: e.target.value})}
                  className="form-input"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Hatched Count</label>
                <input
                  type="number"
                  value={recordForm.hatched_count}
                  onChange={(e) => setRecordForm({...recordForm, hatched_count: parseInt(e.target.value)})}
                  className="form-input"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Notes</label>
                <textarea
                  value={recordForm.notes}
                  onChange={(e) => setRecordForm({...recordForm, notes: e.target.value})}
                  className="form-input"
                  rows="3"
                />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="btn-primary">Add Record</button>
                <button 
                  type="button" 
                  onClick={() => setShowAddRecordForm(false)}
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

  return (
    <div className="app">
      <header className="header">
        <h1 className="text-3xl font-bold">🦜 Parrot Breeding Management</h1>
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
            onClick={() => setActiveTab('records')}
            className={`nav-btn ${activeTab === 'records' ? 'active' : ''}`}
          >
            Breeding Records
          </button>
        </nav>
      </header>

      <main className="main-content">
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'birds' && renderBirds()}
        {activeTab === 'pairs' && renderBreedingPairs()}
        {activeTab === 'records' && renderBreedingRecords()}
      </main>
    </div>
  );
}

export default App;