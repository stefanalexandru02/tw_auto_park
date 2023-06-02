import cron from 'node-cron';
import { runAll } from './import.js';

console.log("Starting up auto-import service. Import will occur every day at midnight");
cron.schedule('0 0 0 * * *', () => {
    runAll();
    console.log("Auto import executed...");
});