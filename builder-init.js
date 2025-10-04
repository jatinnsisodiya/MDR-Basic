// lib/builder.js - Builder.io initialization
import { Builder } from '@builder.io/react';

// Initialize Builder.io with your public key
Builder.init(process.env.BUILDER_PUBLIC_KEY);

// Configure for healthcare compliance
Builder.register('editor.settings', {
  designTokens: {
    colors: [
      { name: 'XDR Critical', value: '#8B0000' },
      { name: 'MDR High', value: '#FF4444' },
      { name: 'Medium Risk', value: '#FF9800' },
      { name: 'Low Risk', value: '#4CAF50' },
      { name: 'Background', value: '#f8f9fa' },
      { name: 'Surface', value: '#ffffff' },
    ],
    spacing: [
      { name: 'xs', value: '0.5rem' },
      { name: 'sm', value: '1rem' },
      { name: 'md', value: '1.5rem' },
      { name: 'lg', value: '2rem' },
      { name: 'xl', value: '3rem' },
    ],
    typography: [
      { name: 'heading-lg', value: '2rem' },
      { name: 'heading-md', value: '1.5rem' },
      { name: 'heading-sm', value: '1.25rem' },
      { name: 'body', value: '1rem' },
      { name: 'caption', value: '0.875rem' },
    ]
  },
  breakpoints: [
    { name: 'Mobile', width: 360 },
    { name: 'Tablet', width: 768 },
    { name: 'Desktop', width: 1200 },
  ],
  privacy: {
    enableHIPAA: true,
    dataEncryption: true,
    accessLogging: true,
  }
});

export default Builder;