console.log('Memulai pengujian getParkingRates...');

const path = require('path');
const { apiService } = require(path.resolve(__dirname, '../src/services/api.ts'));
const fetch = require('node-fetch');

async function testGetRates() {
  console.log('Memanggil fungsi getParkingRates...');
  try {
    const rates = await apiService.getParkingRates();
    if (!rates || !rates.data || rates.data.length === 0) {
      console.log('Respons kosong atau tidak ada data tarif.');
    } else {
      console.log('Data Tarif:', JSON.stringify(rates, null, 2));
    }
  } catch (error) {
    console.error('Error fetching rates:', error);
  }
}

async function testParkingRates() {
  try {
    const response = await fetch('http://192.168.8.100:8080/api/v1/cms/parking-rate', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    console.log('✅ API Response Success');
    console.log('📊 Response Data:', JSON.stringify(data, null, 2));
    
    if (data.data && Array.isArray(data.data)) {
      console.log(`\n📋 Found ${data.data.length} parking rates`);
      
      data.data.forEach((rate, index) => {
        console.log(`\n🏷️  Rate ${index + 1}:`);
        console.log(`   ID: ${rate.id}`);
        console.log(`   Description: ${rate.description}`);
        console.log(`   First Hour: Rp ${rate.first_hour_cost}`);
        console.log(`   Subsequent: Rp ${rate.subsequent_hour_cost}`);
        console.log(`   Daily Max: Rp ${rate.daily_max_cost}`);
      });
    } else {
      console.log('⚠️  No parking rates found or invalid data structure');
    }
    
  } catch (error) {
    console.error('❌ Error testing parking rates:', error.message);
  }
}

testGetRates();
testParkingRates();