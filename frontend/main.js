const API_PATIENTS = "http://127.0.0.1:8000/patient_info/patient_demog";
const API_ADVERSE = "http://127.0.0.1:8000/patient_info/adverse_event";

const charts = {};

function setStatus(msg, ok=true){
  const el = document.getElementById('status');
  el.textContent = msg;
  el.style.color = ok ? '#e0f2fe' : '#fecaca';
}

function upsertChart(id, cfg){
  const ctx = document.getElementById(id).getContext('2d');
  if(charts[id]){ charts[id].destroy(); }
  charts[id] = new Chart(ctx, cfg);
}

function binAges(ageRows){
  // Convert [{value, count}] into bins ["0-9", "10-19", ...]
  const bins = Array.from({length: 11}, (_,i) => ({ label: `${i*10}-${i*10+9}`, count: 0 }));
  for(const r of ageRows || []){
    const age = Number(r.value);
    const c = Number(r.count) || 0;
    if(Number.isFinite(age)){
      const idx = Math.max(0, Math.min(10, Math.floor(age/10)));
      bins[idx].count += c;
    }
  }
  return bins;
}

function setupTabs(){
  const tabs = document.querySelectorAll('.tab');
  tabs.forEach(btn => {
    btn.addEventListener('click', () => {
      tabs.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const target = btn.dataset.tab;
      document.getElementById('tab-patients').classList.toggle('hidden', target !== 'patients');
      document.getElementById('tab-adverse').classList.toggle('hidden', target !== 'adverse');
      if(target === 'patients') loadPatients();
      else loadAdverse();
    });
  });
}

async function loadPatients(){
  try{
    setStatus('Loading...');
    const res = await fetch(API_PATIENTS);
    if(!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    document.getElementById('totalPatients').textContent = data.total_patient_count ?? '-';

    // Gender pie
    const genders = data.gender_distribution || [];
    upsertChart('genderChart', {
      type: 'pie',
      data: {
        labels: genders.map(g => g.label),
        datasets: [{
          data: genders.map(g => g.count),
          backgroundColor: ['#60a5fa','#f472b6','#34d399','#fbbf24','#a78bfa','#f87171']
        }]
      },
      options: { responsive: true, plugins: { legend: { position: 'bottom' }}}
    });

    // Age histogram (binned in frontend)
    const ageBins = binAges(data.age_distribution || []);
    upsertChart('ageChart', {
      type: 'bar',
      data: {
        labels: ageBins.map(b => b.label),
        datasets: [{ label: 'Patients', data: ageBins.map(b => b.count), backgroundColor: '#22c55e' }]
      },
      options: { scales: { x: { ticks: { autoSkip: true, maxRotation: 0 }}}}
    });

    // Registration trends line
    const trend = (data.registration_trends?.overall) || [];
    upsertChart('regTrendChart', {
      type: 'line',
      data: {
        labels: trend.map(t => t.period),
        datasets: [{ label: 'Registrations', data: trend.map(t => t.count), borderColor: '#0ea5e9', backgroundColor: 'rgba(14,165,233,0.2)', tension: 0.2 }]
      },
      options: { scales: { x: { ticks: { autoSkip: true, maxRotation: 0 }}}}
    });

    // Top cities
    const cities = data.geography?.top_cities || [];
    upsertChart('topCitiesChart', {
      type: 'bar',
      data: {
        labels: cities.map(c => c.city),
        datasets: [{ label: 'Patients', data: cities.map(c => c.count), backgroundColor: '#f97316' }]
      },
      options: { indexAxis: 'y' }
    });

    // Locale breakdown
    const locales = data.geography?.locale_breakdown || [];
    upsertChart('localeChart', {
      type: 'bar',
      data: {
        labels: locales.map(l => l.locale),
        datasets: [{ label: 'Patients', data: locales.map(l => l.count), backgroundColor: '#a78bfa' }]
      }
    });

    // Avg age by country
    const avgAge = data.cross_cutting?.avg_age_by_country || [];
    upsertChart('avgAgeCountryChart', {
      type: 'bar',
      data: {
        labels: avgAge.map(r => r.country),
        datasets: [{ label: 'Avg Age', data: avgAge.map(r => Number(r.avg_age?.toFixed ? r.avg_age.toFixed(1) : r.avg_age)), backgroundColor: '#06b6d4' }]
      }
    });

    // Avg BMI by Marital Status
    const bmi = data.cross_cutting?.avg_bmi_by_marital_status || [];
    upsertChart('bmiMaritalChart', {
      type: 'bar',
      data: {
        labels: bmi.map(r => r.marital_status),
        datasets: [{ label: 'Avg BMI', data: bmi.map(r => Number(r.avg_bmi?.toFixed ? r.avg_bmi.toFixed(1) : r.avg_bmi)), backgroundColor: '#ef4444' }]
      }
    });

    setStatus('Loaded');
  }catch(err){
    console.error(err);
    setStatus(`Error: ${err.message}`, false);
  }
}

async function loadAdverse(){
  try{
    setStatus('Loading adverse events...');
    const res = await fetch(API_ADVERSE);
    if(!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    // KPIs
    document.getElementById('aeTotal').textContent = data.totals?.total_events ?? '-';
    const avgDays = data.totals?.average_time_to_resolution_days;
    document.getElementById('aeAvgResolution').textContent = (typeof avgDays === 'number') ? avgDays.toFixed(2) : '-';
    document.getElementById('aeOngoing').textContent = data.totals?.total_ongoing_events ?? '-';

    // By Type
    const byType = data.distributions?.by_type || [];
    upsertChart('aeTypeChart', {
      type: 'bar',
      data: { labels: byType.map(x => x.label), datasets: [{ label: 'Events', data: byType.map(x => x.count), backgroundColor: '#0ea5e9' }] },
      options: { indexAxis: 'y' }
    });

    // By Severity
    const bySeverity = data.distributions?.by_severity || [];
    upsertChart('aeSeverityChart', {
      type: 'bar',
      data: { labels: bySeverity.map(x => x.label), datasets: [{ label: 'Events', data: bySeverity.map(x => x.count), backgroundColor: '#f97316' }] }
    });

    // Over Time
    const overTime = data.over_time || [];
    upsertChart('aeOverTimeChart', {
      type: 'line',
      data: { labels: overTime.map(x => x.period), datasets: [{ label: 'Events', data: overTime.map(x => x.count), borderColor: '#10b981', backgroundColor: 'rgba(16,185,129,0.2)', tension: 0.2 }] },
      options: { scales: { x: { ticks: { autoSkip: true, maxRotation: 0 }}}}
    });

    // By Location
    const byLocation = data.distributions?.by_location || [];
    upsertChart('aeLocationChart', {
      type: 'bar',
      data: { labels: byLocation.map(x => x.label), datasets: [{ label: 'Events', data: byLocation.map(x => x.count), backgroundColor: '#a78bfa' }] },
      options: { indexAxis: 'y' }
    });

    setStatus('Loaded');
  }catch(err){
    console.error(err);
    setStatus(`Error: ${err.message}`, false);
  }
}

window.addEventListener('DOMContentLoaded', () => { setupTabs(); loadPatients(); });
