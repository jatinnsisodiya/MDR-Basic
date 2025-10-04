// Enhanced MDR/XDR Pathogen Detection & Management System
class MDRXDRSystem {
    constructor() {
        this.currentModule = 'dashboard';
        this.patients = [
            {
                patientId: "P001", 
                name: "John Doe", 
                age: 65, 
                ward: "ICU", 
                riskScore: 22, 
                riskLevel: "High",
                resistanceType: "MDR",
                xdrRisk: "Medium"
            },
            {
                patientId: "P002", 
                name: "Jane Smith", 
                age: 34, 
                ward: "General", 
                riskScore: 12, 
                riskLevel: "Medium",
                resistanceType: "None",
                xdrRisk: "Low"
            },
            {
                patientId: "P003", 
                name: "Robert Johnson", 
                age: 78, 
                ward: "Isolation", 
                riskScore: 28, 
                riskLevel: "Critical",
                resistanceType: "XDR",
                xdrRisk: "Critical"
            },
            {
                patientId: "P004", 
                name: "Maria Garcia", 
                age: 52, 
                ward: "ICU", 
                riskScore: 26, 
                riskLevel: "Critical",
                resistanceType: "Pre-XDR",
                xdrRisk: "High"
            }
        ];

        this.tests = [
            {
                testId: "T001", 
                patientId: "P001", 
                status: "processing", 
                timeRemaining: 45, 
                result: null,
                resistanceProfile: null,
                startTime: Date.now() - (45 * 60 * 1000)
            },
            {
                testId: "T002", 
                patientId: "P003", 
                status: "completed", 
                result: "positive", 
                mdrDetected: true,
                xdrDetected: true,
                resistanceProfile: {
                    rifampicin: "Resistant",
                    isoniazid: "Resistant", 
                    fluoroquinolones: "Resistant",
                    injectables: "Resistant",
                    pyrazinamide: "Resistant"
                }
            },
            {
                testId: "T003", 
                patientId: "P004", 
                status: "completed", 
                result: "positive", 
                mdrDetected: true,
                xdrDetected: false,
                preXDR: true,
                resistanceProfile: {
                    rifampicin: "Resistant",
                    isoniazid: "Resistant", 
                    fluoroquinolones: "Resistant",
                    injectables: "Sensitive"
                }
            }
        ];

        this.alerts = [
            {
                alertId: "A001", 
                level: 5, 
                type: "XDR OUTBREAK ALERT", 
                patient: "P003", 
                timestamp: new Date(Date.now() - 2 * 60 * 1000),
                acknowledged: false,
                description: "Extensively Drug-Resistant TB detected - Immediate isolation required"
            },
            {
                alertId: "A002", 
                level: 4, 
                type: "Pre-XDR High Risk", 
                patient: "P004", 
                timestamp: new Date(Date.now() - 15 * 60 * 1000),
                acknowledged: false,
                description: "Pre-XDR case with high progression risk"
            },
            {
                alertId: "A003", 
                level: 3, 
                type: "High Risk Assessment", 
                patient: "P001", 
                timestamp: new Date(Date.now() - 30 * 60 * 1000),
                acknowledged: true,
                description: "Patient scored 22 - Enhanced monitoring required"
            }
        ];

        this.zones = [
            {zone: "Isolation Unit", infectionCount: 2, riskLevel: "xdr", xdrCases: 1},
            {zone: "ICU", infectionCount: 3, riskLevel: "high", xdrCases: 0},
            {zone: "General Ward", infectionCount: 1, riskLevel: "medium", xdrCases: 0},
            {zone: "Emergency", infectionCount: 0, riskLevel: "low", xdrCases: 0}
        ];

        this.hygieneData = [
            {department: "Isolation Unit", hygieneCompliance: 95, priority: "Critical"},
            {department: "ICU", hygieneCompliance: 85, priority: "High"},
            {department: "General Ward", hygieneCompliance: 92, priority: "Medium"},
            {department: "Emergency", hygieneCompliance: 78, priority: "Low"}
        ];

        this.riskFactors = {
            age: 0, immunity: 0, locality: 0, nutrition: 0,
            icuDays: 0, mdrHistory: 0, antibiotics: 0, sapsScore: 0
        };

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateTime();
        this.loadDashboard();
        this.startTimers();
        this.updateAlertCount();
        setInterval(() => this.updateTime(), 1000);
        setInterval(() => this.updateTests(), 5000);
        setInterval(() => this.checkXDRProgression(), 30000);
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchModule(e.target.dataset.module);
            });
        });

        // Patient search
        const searchInput = document.getElementById('patientSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filterPatients(e.target.value);
            });
        }

        // Risk factors
        document.querySelectorAll('#risk-assessment select').forEach(select => {
            select.addEventListener('change', () => {
                this.updateRiskCalculation();
            });
        });
    }

    switchModule(moduleId) {
        // Update navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-module="${moduleId}"]`).classList.add('active');

        // Update modules
        document.querySelectorAll('.module').forEach(module => {
            module.classList.remove('active');
        });
        document.getElementById(moduleId).classList.add('active');

        this.currentModule = moduleId;

        // Load module-specific content
        switch(moduleId) {
            case 'dashboard':
                this.loadDashboard();
                break;
            case 'risk-assessment':
                this.loadRiskAssessment();
                break;
            case 'cbnaat':
                this.loadCBNAAT();
                break;
            case 'contact-tracing':
                this.loadContactTracing();
                break;
            case 'heat-map':
                this.loadHeatMap();
                break;
            case 'alerts':
                this.loadAlerts();
                break;
            case 'hygiene':
                this.loadHygiene();
                break;
            case 'reports':
                this.loadReports();
                break;
        }
    }

    updateTime() {
        const now = new Date();
        const timeString = now.toLocaleString('en-IN', {
            timeZone: 'Asia/Kolkata',
            year: 'numeric',
            month: 'short',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });

        const timeElement = document.getElementById('currentTime');
        if (timeElement) {
            timeElement.textContent = timeString;
        }
    }

    updateAlertCount() {
        const activeAlerts = this.alerts.filter(alert => !alert.acknowledged);
        const alertCount = document.querySelector('.alert-count');
        if (alertCount) {
            alertCount.textContent = activeAlerts.length;

            // Add pulsing animation for XDR alerts
            const hasXDRAlert = activeAlerts.some(alert => alert.type.includes('XDR'));
            if (hasXDRAlert) {
                alertCount.style.animation = 'pulse 1s infinite';
                alertCount.style.background = '#8B0000';
            }
        }
    }

    loadDashboard() {
        this.initDashboardCharts();
        this.updateMetrics();
    }

    updateMetrics() {
        // Count XDR cases
        const xdrCases = this.patients.filter(p => p.resistanceType === 'XDR').length;
        const mdrCases = this.patients.filter(p => p.resistanceType === 'MDR' || p.resistanceType === 'Pre-XDR').length;
        const highRiskCases = this.patients.filter(p => p.riskLevel === 'High' || p.riskLevel === 'Critical').length;
        const activeTests = this.tests.filter(t => t.status === 'processing').length;

        // Update metric cards with current data
        const metricCards = document.querySelectorAll('.metric-value');
        if (metricCards.length >= 4) {
            metricCards[0].textContent = xdrCases; // XDR Cases
            metricCards[1].textContent = mdrCases; // MDR Cases  
            metricCards[2].textContent = highRiskCases; // High Risk
            metricCards[3].textContent = activeTests; // Active Tests
        }
    }

    initDashboardCharts() {
        const ctx = document.getElementById('riskDistributionChart');
        if (!ctx) return;

        // Count patients by risk level
        const riskCounts = {
            'Low': this.patients.filter(p => p.riskLevel === 'Low').length,
            'Medium': this.patients.filter(p => p.riskLevel === 'Medium').length,
            'High': this.patients.filter(p => p.riskLevel === 'High').length,
            'Critical': this.patients.filter(p => p.riskLevel === 'Critical').length
        };

        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(riskCounts),
                datasets: [{
                    data: Object.values(riskCounts),
                    backgroundColor: ['#4CAF50', '#FF9800', '#F44336', '#9C27B0'],
                    borderWidth: 2,
                    borderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true
                        }
                    }
                }
            }
        });
    }

    loadRiskAssessment() {
        this.loadPatientList();
        this.updateRiskCalculation();
    }

    loadPatientList() {
        const patientList = document.getElementById('patientList');
        if (!patientList) return;

        patientList.innerHTML = this.patients.map(patient => `
            <div class="patient-item ${patient.resistanceType === 'XDR' ? 'xdr-patient' : ''}" 
                 onclick="selectPatient('${patient.patientId}')">
                <div class="patient-info">
                    <strong>${patient.name}</strong>
                    <span>${patient.patientId} - ${patient.ward}</span>
                    ${patient.resistanceType === 'XDR' ? 
                        '<span class="xdr-badge">XDR</span>' : 
                        patient.resistanceType === 'Pre-XDR' ? 
                        '<span class="pre-xdr-badge">Pre-XDR</span>' : ''}
                </div>
                <div class="patient-risk risk-${patient.riskLevel.toLowerCase()}">
                    ${patient.riskScore}
                </div>
            </div>
        `).join('');
    }

    updateRiskCalculation() {
        const factors = {};
        document.querySelectorAll('#risk-assessment select').forEach(select => {
            factors[select.id] = parseInt(select.value) || 0;
        });

        // Enhanced risk calculation with XDR factors
        const weights = {
            age: 0.05, immunity: 0.15, locality: 0.08, nutrition: 0.10,
            icuDays: 0.12, mdrHistory: 0.20, antibiotics: 0.15, sapsScore: 0.15
        };

        let totalScore = 0;
        Object.entries(factors).forEach(([factor, value]) => {
            totalScore += value * (weights[factor] || 0);
        });

        totalScore = Math.round(totalScore);

        // Determine risk level
        let riskLevel = 'Low';
        let riskClass = 'low';
        if (totalScore > 24) {
            riskLevel = 'Critical';
            riskClass = 'critical';
        } else if (totalScore > 16) {
            riskLevel = 'High';
            riskClass = 'high';
        } else if (totalScore > 8) {
            riskLevel = 'Medium';
            riskClass = 'medium';
        }

        // Check XDR progression risk
        const xdrRisk = this.calculateXDRRisk(factors, totalScore);

        // Update display
        const scoreValue = document.getElementById('scoreValue');
        const riskLevelElement = document.getElementById('riskLevel');
        const scoreCircle = document.querySelector('.score-circle');
        const xdrProgression = document.getElementById('xdrProgression');

        if (scoreValue) scoreValue.textContent = totalScore;
        if (riskLevelElement) {
            riskLevelElement.textContent = riskLevel + ' Risk';
            riskLevelElement.className = `risk-level ${riskClass}`;
        }
        if (scoreCircle) {
            scoreCircle.className = `score-circle ${riskClass}`;
        }

        // Show XDR progression warning
        if (xdrProgression) {
            if (xdrRisk === 'High' || xdrRisk === 'Critical') {
                xdrProgression.style.display = 'block';
                xdrProgression.innerHTML = `
                    <i class="fas fa-skull-crossbones"></i>
                    <span>HIGH XDR PROGRESSION RISK - Enhanced Monitoring Required</span>
                `;
            } else {
                xdrProgression.style.display = 'none';
            }
        }

        this.updateRiskRecommendations(riskLevel, xdrRisk, totalScore);
    }

    calculateXDRRisk(factors, totalScore) {
        // XDR progression risk factors
        let xdrScore = 0;

        // High risk factors for XDR progression
        if (factors.mdrHistory >= 2) xdrScore += 3; // Previous MDR/XDR
        if (factors.antibiotics >= 2) xdrScore += 2; // Multiple antibiotic resistance
        if (factors.immunity >= 2) xdrScore += 2; // Immunocompromised
        if (factors.locality >= 2) xdrScore += 1; // High endemic area
        if (totalScore >= 20) xdrScore += 2; // Overall high risk

        if (xdrScore >= 6) return 'Critical';
        if (xdrScore >= 4) return 'High';
        if (xdrScore >= 2) return 'Medium';
        return 'Low';
    }

    updateRiskRecommendations(riskLevel, xdrRisk, score) {
        const recommendations = document.getElementById('riskRecommendations');
        if (!recommendations) return;

        let content = '<h4>Recommendations:</h4><ul>';

        // Standard recommendations based on risk level
        switch(riskLevel) {
            case 'Critical':
                content += '<li>🚨 Immediate isolation in negative pressure room</li>';
                content += '<li>🧪 Emergency CBNAAT testing within 2 hours</li>';
                content += '<li>📞 Notify infection control team immediately</li>';
                content += '<li>👥 Initiate comprehensive contact tracing</li>';
                break;
            case 'High':
                content += '<li>⚠️ Enhanced monitoring and isolation precautions</li>';
                content += '<li>🧪 Priority CBNAAT testing within 4 hours</li>';
                content += '<li>📋 Document all contacts in past 48 hours</li>';
                break;
            case 'Medium':
                content += '<li>📊 Regular monitoring and assessment</li>';
                content += '<li>🧪 CBNAAT testing if symptoms develop</li>';
                content += '<li>🏥 Consider isolation if clinical suspicion</li>';
                break;
            default:
                content += '<li>📝 Standard monitoring protocols</li>';
                content += '<li>📅 Reassess if condition changes</li>';
        }

        // XDR-specific recommendations
        if (xdrRisk === 'High' || xdrRisk === 'Critical') {
            content += '<li class="xdr-recommendation">💀 <strong>XDR Risk:</strong> Specialized infectious disease consultation</li>';
            content += '<li class="xdr-recommendation">🧬 Extended drug susceptibility testing required</li>';
            content += '<li class="xdr-recommendation">🔒 Maximum containment protocols</li>';
            content += '<li class="xdr-recommendation">📈 Weekly XDR progression monitoring</li>';
        }

        content += '</ul>';
        recommendations.innerHTML = content;
    }

    loadCBNAAT() {
        this.updateTestsGrid();
        this.startTestTimers();
    }

    updateTestsGrid() {
        const testsGrid = document.getElementById('testsGrid');
        if (!testsGrid) return;

        testsGrid.innerHTML = this.tests.map(test => {
            const patient = this.patients.find(p => p.patientId === test.patientId);
            let cardClass = 'test-card';
            let statusIcon = '';
            let statusText = '';
            let progressBar = '';

            if (test.status === 'processing') {
                cardClass += ' processing';
                statusIcon = '<i class="fas fa-spinner fa-spin"></i>';
                statusText = `Processing... ${test.timeRemaining} min remaining`;
                const progress = ((90 - test.timeRemaining) / 90) * 100;
                progressBar = `
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${progress}%"></div>
                    </div>
                `;
            } else if (test.status === 'completed') {
                if (test.xdrDetected) {
                    cardClass += ' xdr-positive';
                    statusIcon = '<i class="fas fa-skull-crossbones"></i>';
                    statusText = 'XDR DETECTED';
                } else if (test.mdrDetected) {
                    cardClass += ' positive';
                    statusIcon = '<i class="fas fa-virus"></i>';
                    statusText = test.preXDR ? 'Pre-XDR DETECTED' : 'MDR DETECTED';
                } else {
                    cardClass += ' completed';
                    statusIcon = '<i class="fas fa-check-circle"></i>';
                    statusText = 'Negative';
                }
            }

            return `
                <div class="${cardClass}">
                    <div class="test-header">
                        <h4>${test.testId}</h4>
                        <span class="test-status">${statusIcon} ${statusText}</span>
                    </div>
                    <div class="test-patient">
                        <strong>${patient ? patient.name : 'Unknown'}</strong>
                        <span>${test.patientId} - ${patient ? patient.ward : 'N/A'}</span>
                    </div>
                    ${progressBar}
                    ${test.resistanceProfile ? this.renderResistanceProfile(test.resistanceProfile, test.xdrDetected) : ''}
                    <div class="test-actions">
                        <button class="btn-small" onclick="viewTestDetails('${test.testId}')">
                            <i class="fas fa-eye"></i> Details
                        </button>
                        ${test.status === 'completed' && (test.mdrDetected || test.xdrDetected) ? 
                            '<button class="btn-small btn-danger" onclick="initiateOutbreakProtocol()"><i class="fas fa-exclamation-triangle"></i> Protocol</button>' 
                            : ''}
                    </div>
                </div>
            `;
        }).join('');
    }

    renderResistanceProfile(profile, isXDR) {
        const title = isXDR ? 'XDR Profile' : 'Resistance Profile';
        const titleClass = isXDR ? 'xdr-profile' : 'resistance-profile';

        return `
            <div class="${titleClass}">
                <h5>${title}:</h5>
                <div class="resistance-grid">
                    ${Object.entries(profile).map(([drug, status]) => `
                        <div class="resistance-item ${status.toLowerCase()}">
                            <span class="drug-name">${drug}</span>
                            <span class="resistance-status">${status}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    startTestTimers() {
        this.tests.forEach(test => {
            if (test.status === 'processing') {
                setInterval(() => {
                    test.timeRemaining = Math.max(0, test.timeRemaining - 1);
                    if (test.timeRemaining === 0) {
                        this.completeTest(test.testId);
                    }
                }, 60000); // Update every minute
            }
        });
    }

    completeTest(testId) {
        const test = this.tests.find(t => t.testId === testId);
        if (!test) return;

        test.status = 'completed';

        // Simulate results
        const outcomes = ['negative', 'positive'];
        const result = outcomes[Math.floor(Math.random() * outcomes.length)];
        test.result = result;

        if (result === 'positive') {
            // Determine if MDR/XDR
            const random = Math.random();
            if (random < 0.15) { // 15% chance of XDR
                test.xdrDetected = true;
                test.mdrDetected = true;
                test.resistanceProfile = {
                    rifampicin: "Resistant",
                    isoniazid: "Resistant",
                    fluoroquinolones: "Resistant", 
                    injectables: "Resistant"
                };
                this.triggerXDRAlert(test.patientId);
            } else if (random < 0.4) { // 25% chance of MDR
                test.mdrDetected = true;
                test.resistanceProfile = {
                    rifampicin: "Resistant",
                    isoniazid: "Resistant"
                };
                this.triggerMDRAlert(test.patientId);
            }
        }

        this.updateTestsGrid();
    }

    triggerXDRAlert(patientId) {
        const alert = {
            alertId: `A${Date.now()}`,
            level: 5,
            type: "XDR OUTBREAK ALERT",
            patient: patientId,
            timestamp: new Date(),
            acknowledged: false,
            description: "Extensively Drug-Resistant TB confirmed - Immediate containment required"
        };

        this.alerts.unshift(alert);
        this.updateAlertCount();

        // Trigger visual and audio alerts
        this.showNotification(alert, true);
    }

    triggerMDRAlert(patientId) {
        const alert = {
            alertId: `A${Date.now()}`,
            level: 4,
            type: "MDR Detection Alert",
            patient: patientId,
            timestamp: new Date(),
            acknowledged: false,
            description: "Multi-Drug Resistant TB confirmed - Enhanced isolation required"
        };

        this.alerts.unshift(alert);
        this.updateAlertCount();
        this.showNotification(alert, false);
    }

    showNotification(alert, isXDR) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${isXDR ? 'xdr-notification' : 'mdr-notification'}`;
        notification.innerHTML = `
            <div class="notification-icon">
                ${isXDR ? '<i class="fas fa-skull-crossbones"></i>' : '<i class="fas fa-virus"></i>'}
            </div>
            <div class="notification-content">
                <strong>${alert.type}</strong>
                <p>${alert.description}</p>
                <small>Patient: ${alert.patient}</small>
            </div>
            <button class="notification-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;

        document.body.appendChild(notification);

        // Auto remove after 10 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 10000);

        // Play alert sound (if available)
        if (isXDR) {
            this.playAlertSound('critical');
        } else {
            this.playAlertSound('high');
        }
    }

    playAlertSound(level) {
        // Create audio context for alert sounds
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            if (level === 'critical') {
                // High-pitched urgent beeping for XDR
                oscillator.frequency.setValueAtTime(1000, audioContext.currentTime);
                gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
                oscillator.start();
                oscillator.stop(audioContext.currentTime + 0.2);

                // Repeat beep
                setTimeout(() => {
                    const osc2 = audioContext.createOscillator();
                    const gain2 = audioContext.createGain();
                    osc2.connect(gain2);
                    gain2.connect(audioContext.destination);
                    osc2.frequency.setValueAtTime(1000, audioContext.currentTime);
                    gain2.gain.setValueAtTime(0.3, audioContext.currentTime);
                    osc2.start();
                    osc2.stop(audioContext.currentTime + 0.2);
                }, 300);
            } else {
                // Lower pitch for regular alerts
                oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
                gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
                oscillator.start();
                oscillator.stop(audioContext.currentTime + 0.5);
            }
        } catch (error) {
            console.log('Audio not supported');
        }
    }

    checkXDRProgression() {
        // Monitor patients for XDR progression
        this.patients.forEach(patient => {
            if (patient.resistanceType === 'Pre-XDR' || patient.resistanceType === 'MDR') {
                const progressionRisk = this.assessXDRProgression(patient);
                if (progressionRisk === 'High') {
                    this.createProgressionAlert(patient);
                }
            }
        });
    }

    assessXDRProgression(patient) {
        // Assess risk of MDR progressing to XDR
        let riskScore = 0;

        if (patient.riskScore >= 20) riskScore += 2;
        if (patient.ward === 'ICU') riskScore += 1;
        if (patient.age >= 65) riskScore += 1;
        if (patient.resistanceType === 'Pre-XDR') riskScore += 3;

        return riskScore >= 4 ? 'High' : riskScore >= 2 ? 'Medium' : 'Low';
    }

    createProgressionAlert(patient) {
        const existingAlert = this.alerts.find(a => 
            a.patient === patient.patientId && 
            a.type.includes('Progression') && 
            !a.acknowledged
        );

        if (existingAlert) return; // Don't duplicate alerts

        const alert = {
            alertId: `A${Date.now()}`,
            level: 4,
            type: "XDR Progression Risk",
            patient: patient.patientId,
            timestamp: new Date(),
            acknowledged: false,
            description: `Patient ${patient.name} showing high risk for XDR progression`
        };

        this.alerts.unshift(alert);
        this.updateAlertCount();
    }

    // Additional module loading methods
    loadContactTracing() {
        // Implement contact tracing visualization
        console.log('Loading contact tracing module...');
    }

    loadHeatMap() {
        // Implement heat map visualization
        console.log('Loading heat map module...');
    }

    loadAlerts() {
        // Implement alerts management
        console.log('Loading alerts module...');
    }

    loadHygiene() {
        // Implement hygiene monitoring
        console.log('Loading hygiene module...');
    }

    loadReports() {
        // Implement reporting dashboard
        console.log('Loading reports module...');
    }

    updateTests() {
        // Update test timers and status
        this.tests.forEach(test => {
            if (test.status === 'processing' && test.timeRemaining > 0) {
                test.timeRemaining = Math.max(0, test.timeRemaining - 1);
            }
        });

        if (this.currentModule === 'cbnaat') {
            this.updateTestsGrid();
        }
    }

    startTimers() {
        // Start various system timers
        setInterval(() => this.updateTests(), 60000); // Update every minute
    }
}

// Global functions for UI interactions
function calculateRisk() {
    window.mdrSystem.updateRiskCalculation();
}

function selectPatient(patientId) {
    const patient = window.mdrSystem.patients.find(p => p.patientId === patientId);
    if (patient) {
        document.getElementById('patientSearch').value = `${patient.name} (${patient.patientId})`;
        // Pre-fill some risk factors based on patient data
        document.getElementById('age').value = patient.age >= 65 ? 2 : patient.age >= 45 ? 1 : 0;
        window.mdrSystem.updateRiskCalculation();
    }
}

function startNewTest() {
    const patientId = prompt('Enter Patient ID for new CBNAAT test:');
    if (patientId) {
        const newTest = {
            testId: `T${Date.now()}`,
            patientId: patientId,
            status: 'processing',
            timeRemaining: 90,
            result: null,
            startTime: Date.now()
        };

        window.mdrSystem.tests.push(newTest);
        window.mdrSystem.updateTestsGrid();
        alert(`New CBNAAT test ${newTest.testId} started for patient ${patientId}`);
    }
}

function refreshTests() {
    window.mdrSystem.updateTestsGrid();
}

function viewTestDetails(testId) {
    const test = window.mdrSystem.tests.find(t => t.testId === testId);
    if (test) {
        alert(`Test Details:\n\nTest ID: ${test.testId}\nPatient: ${test.patientId}\nStatus: ${test.status}\nResult: ${test.result || 'Pending'}`);
    }
}

function initiateOutbreakProtocol() {
    alert('🚨 OUTBREAK PROTOCOL INITIATED\n\n1. Immediate facility lockdown\n2. Contact tracing activated\n3. All staff notified\n4. External health authorities contacted\n5. Enhanced PPE protocols in effect');
}

// Initialize system when page loads
document.addEventListener('DOMContentLoaded', function() {
    window.mdrSystem = new MDRXDRSystem();
});