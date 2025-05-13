
// Re-export all functionality from the specialized service modules
export * from './creationService';
export * from './extractionService';
export * from './notificationService';
export * from './premierService';
export * from './queryService';
export * from './statsService';
export * from './statusUtils';
export * from './sampleDataService';

// Initialize sample data
import { loadSampleData } from './sampleDataService';
loadSampleData();
