// Clear all authentication data - Run this in browser console

// Step 1: Clear IndexedDB
indexedDB.deleteDatabase('BolBazarAuth').onsuccess = function() {
    console.log('✅ Cleared IndexedDB');
};

// Step 2: Clear sessionStorage
sessionStorage.clear();
console.log('✅ Cleared sessionStorage');

// Step 3: Clear localStorage  
localStorage.clear();
console.log('✅ Cleared localStorage');

console.log('🎉 All authentication data cleared! Now do fresh signup.');
