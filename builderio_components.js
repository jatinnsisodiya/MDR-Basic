// Builder.io Components for MDR/XDR System

// 1. Register Components with Builder.io
import { Builder } from '@builder.io/react';

// Risk Assessment Component
const RiskAssessmentCard = ({ patient, riskScore, riskLevel, xdrRisk }) => {
  return (
    <div className={`risk-card ${riskLevel.toLowerCase()}`}>
      <div className="patient-info">
        <h3>{patient.name}</h3>
        <span>{patient.patientId} - {patient.ward}</span>
      </div>
      <div className="risk-score">
        <div className="score-circle">
          <span className="score-value">{riskScore}</span>
          <span className="score-max">/30</span>
        </div>
        <div className={`risk-level ${riskLevel.toLowerCase()}`}>
          {riskLevel} Risk
        </div>
        {xdrRisk === 'High' && (
          <div className="xdr-warning">
            <i className="fas fa-skull-crossbones"></i>
            HIGH XDR PROGRESSION RISK
          </div>
        )}
      </div>
    </div>
  );
};

// Register with Builder.io
Builder.registerComponent(RiskAssessmentCard, {
  name: 'RiskAssessmentCard',
  inputs: [
    {
      name: 'patient',
      type: 'object',
      subFields: [
        { name: 'name', type: 'string', required: true },
        { name: 'patientId', type: 'string', required: true },
        { name: 'ward', type: 'string', required: true }
      ]
    },
    {
      name: 'riskScore',
      type: 'number',
      defaultValue: 0,
      max: 30,
      min: 0
    },
    {
      name: 'riskLevel',
      type: 'string',
      enum: ['Low', 'Medium', 'High', 'Critical'],
      defaultValue: 'Low'
    },
    {
      name: 'xdrRisk',
      type: 'string',
      enum: ['Low', 'Medium', 'High', 'Critical'],
      defaultValue: 'Low'
    }
  ]
});

// CBNAAT Test Card Component
const CBNAATTestCard = ({ testId, patientName, status, timeRemaining, result, resistanceType }) => {
  const getStatusIcon = () => {
    switch(status) {
      case 'processing': return <i className="fas fa-spinner fa-spin"></i>;
      case 'completed': 
        if (resistanceType === 'XDR') return <i className="fas fa-skull-crossbones"></i>;
        if (resistanceType === 'MDR') return <i className="fas fa-virus"></i>;
        return <i className="fas fa-check-circle"></i>;
      default: return <i className="fas fa-clock"></i>;
    }
  };

  return (
    <div className={`test-card ${status} ${resistanceType?.toLowerCase()}`}>
      <div className="test-header">
        <h4>{testId}</h4>
        <div className="test-status">
          {getStatusIcon()}
          <span>{status === 'processing' ? `${timeRemaining} min left` : result}</span>
        </div>
      </div>
      <div className="test-patient">
        <strong>{patientName}</strong>
      </div>
      {resistanceType && (
        <div className={`resistance-badge ${resistanceType.toLowerCase()}`}>
          {resistanceType}
        </div>
      )}
      {status === 'processing' && (
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{width: `${((90 - timeRemaining) / 90) * 100}%`}}
          ></div>
        </div>
      )}
    </div>
  );
};

Builder.registerComponent(CBNAATTestCard, {
  name: 'CBNAATTestCard',
  inputs: [
    { name: 'testId', type: 'string', required: true },
    { name: 'patientName', type: 'string', required: true },
    { 
      name: 'status', 
      type: 'string', 
      enum: ['pending', 'processing', 'completed'],
      defaultValue: 'pending'
    },
    { name: 'timeRemaining', type: 'number', defaultValue: 90 },
    { name: 'result', type: 'string' },
    { 
      name: 'resistanceType', 
      type: 'string', 
      enum: ['None', 'MDR', 'Pre-XDR', 'XDR'] 
    }
  ]
});

// Alert Card Component
const AlertCard = ({ alertLevel, alertType, patientId, message, timestamp, isXDR }) => {
  const getLevelClass = () => {
    const levels = {
      1: 'standard',
      2: 'enhanced', 
      3: 'high',
      4: 'critical',
      5: 'outbreak'
    };
    return levels[alertLevel] || 'standard';
  };

  return (
    <div className={`alert-card level-${alertLevel} ${isXDR ? 'xdr-alert' : ''}`}>
      <div className="alert-icon">
        {isXDR ? 
          <i className="fas fa-skull-crossbones"></i> : 
          <i className="fas fa-exclamation-triangle"></i>
        }
      </div>
      <div className="alert-content">
        <div className="alert-header">
          <strong className="alert-type">{alertType}</strong>
          <span className="alert-level">Level {alertLevel}</span>
        </div>
        <p className="alert-message">{message}</p>
        <div className="alert-meta">
          <span>Patient: {patientId}</span>
          <span>{new Date(timestamp).toLocaleString()}</span>
        </div>
      </div>
      <div className="alert-actions">
        <button className="btn-acknowledge">Acknowledge</button>
        {alertLevel < 5 && (
          <button className="btn-escalate">Escalate</button>
        )}
      </div>
    </div>
  );
};

Builder.registerComponent(AlertCard, {
  name: 'AlertCard',
  inputs: [
    { 
      name: 'alertLevel', 
      type: 'number', 
      min: 1, 
      max: 5, 
      defaultValue: 1 
    },
    { name: 'alertType', type: 'string', required: true },
    { name: 'patientId', type: 'string', required: true },
    { name: 'message', type: 'string', required: true },
    { name: 'timestamp', type: 'date', defaultValue: new Date() },
    { name: 'isXDR', type: 'boolean', defaultValue: false }
  ]
});

// Metric Card Component
const MetricCard = ({ title, value, icon, trend, riskLevel }) => {
  return (
    <div className={`metric-card ${riskLevel}`}>
      <div className="metric-icon">
        <i className={icon}></i>
      </div>
      <div className="metric-content">
        <h3>{title}</h3>
        <div className="metric-value">{value}</div>
        {trend && (
          <div className={`metric-trend ${trend > 0 ? 'up' : 'down'}`}>
            <i className={`fas fa-arrow-${trend > 0 ? 'up' : 'down'}`}></i>
            {Math.abs(trend)}%
          </div>
        )}
      </div>
    </div>
  );
};

Builder.registerComponent(MetricCard, {
  name: 'MetricCard',
  inputs: [
    { name: 'title', type: 'string', required: true },
    { name: 'value', type: 'string', required: true },
    { name: 'icon', type: 'string', defaultValue: 'fas fa-chart-bar' },
    { name: 'trend', type: 'number' },
    { 
      name: 'riskLevel', 
      type: 'string', 
      enum: ['low', 'medium', 'high', 'critical'],
      defaultValue: 'low'
    }
  ]
});

// Hospital Zone Status Component
const HospitalZoneStatus = ({ zones }) => {
  return (
    <div className="zone-status-container">
      <h3>Hospital Zone Status</h3>
      <div className="zones-grid">
        {zones.map((zone, index) => (
          <div key={index} className={`zone-card ${zone.riskLevel}`}>
            <div className="zone-header">
              <h4>{zone.name}</h4>
              {zone.xdrCases > 0 && (
                <span className="xdr-indicator">
                  <i className="fas fa-skull-crossbones"></i>
                  XDR
                </span>
              )}
            </div>
            <div className="zone-stats">
              <div className="stat">
                <span className="stat-label">Cases:</span>
                <span className="stat-value">{zone.infectionCount}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Risk:</span>
                <span className={`stat-value ${zone.riskLevel}`}>
                  {zone.riskLevel.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

Builder.registerComponent(HospitalZoneStatus, {
  name: 'HospitalZoneStatus',
  inputs: [
    {
      name: 'zones',
      type: 'list',
      subFields: [
        { name: 'name', type: 'string', required: true },
        { name: 'infectionCount', type: 'number', defaultValue: 0 },
        { 
          name: 'riskLevel', 
          type: 'string', 
          enum: ['low', 'medium', 'high', 'critical', 'xdr'],
          defaultValue: 'low'
        },
        { name: 'xdrCases', type: 'number', defaultValue: 0 }
      ]
    }
  ]
});

export {
  RiskAssessmentCard,
  CBNAATTestCard,
  AlertCard,
  MetricCard,
  HospitalZoneStatus
};