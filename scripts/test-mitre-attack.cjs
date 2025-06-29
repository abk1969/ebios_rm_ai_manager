#!/usr/bin/env node

/**
 * 🛡️ TEST MITRE ATT&CK - ACCÈS TAXII
 * Script pour tester l'accès aux données MITRE ATT&CK via TAXII
 */

console.log('🛡️ TEST MITRE ATT&CK - ACCÈS TAXII');
console.log('==================================\n');

const https = require('https');

// Configuration TAXII MITRE ATT&CK
const TAXII_CONFIG = {
  url: 'https://attack-taxii.mitre.org/api/v21/',
  collectionId: '1f5f1533-f617-4ca8-9ab4-6a02367fa019',
  userAgent: 'EBIOS-AI-Manager/1.0.0'
};

console.log('📋 Configuration TAXII:');
console.log(`   🌐 URL: ${TAXII_CONFIG.url}`);
console.log(`   📦 Collection ID: ${TAXII_CONFIG.collectionId}`);
console.log('');

/**
 * Effectue une requête HTTPS
 */
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/taxii+json;version=2.1',
        'User-Agent': TAXII_CONFIG.userAgent,
        ...options.headers
      }
    }, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            data: jsonData
          });
        } catch (error) {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            data: data
          });
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Timeout de requête'));
    });
    
    req.end();
  });
}

/**
 * Test de connectivité au serveur TAXII
 */
async function testTaxiiConnectivity() {
  console.log('🔍 Test 1: Connectivité serveur TAXII...');
  
  try {
    const response = await makeRequest(TAXII_CONFIG.url);
    
    if (response.statusCode === 200) {
      console.log('   ✅ Serveur TAXII accessible');
      console.log(`   📊 Statut: ${response.statusCode}`);
      
      if (response.data && response.data.title) {
        console.log(`   📋 Titre: ${response.data.title}`);
      }
      
      if (response.data && response.data.api_roots) {
        console.log(`   🌐 API Roots: ${response.data.api_roots.length} disponibles`);
      }
      
      return true;
    } else {
      console.log(`   ❌ Erreur serveur: ${response.statusCode}`);
      return false;
    }
  } catch (error) {
    console.log(`   ❌ Erreur connectivité: ${error.message}`);
    return false;
  }
}

/**
 * Test d'accès aux collections
 */
async function testCollectionsAccess() {
  console.log('\n🔍 Test 2: Accès aux collections...');
  
  try {
    const collectionsUrl = `${TAXII_CONFIG.url}collections/`;
    const response = await makeRequest(collectionsUrl);
    
    if (response.statusCode === 200) {
      console.log('   ✅ Collections accessibles');
      
      if (response.data && response.data.collections) {
        console.log(`   📦 Nombre de collections: ${response.data.collections.length}`);
        
        // Recherche de la collection Enterprise ATT&CK
        const enterpriseCollection = response.data.collections.find(
          col => col.id === TAXII_CONFIG.collectionId
        );
        
        if (enterpriseCollection) {
          console.log('   ✅ Collection Enterprise ATT&CK trouvée');
          console.log(`   📋 Titre: ${enterpriseCollection.title}`);
          console.log(`   📝 Description: ${enterpriseCollection.description?.substring(0, 100)}...`);
        } else {
          console.log('   ⚠️  Collection Enterprise ATT&CK non trouvée');
        }
      }
      
      return true;
    } else {
      console.log(`   ❌ Erreur accès collections: ${response.statusCode}`);
      return false;
    }
  } catch (error) {
    console.log(`   ❌ Erreur collections: ${error.message}`);
    return false;
  }
}

/**
 * Test d'accès aux objets STIX
 */
async function testStixObjectsAccess() {
  console.log('\n🔍 Test 3: Accès aux objets STIX...');
  
  try {
    const objectsUrl = `${TAXII_CONFIG.url}collections/${TAXII_CONFIG.collectionId}/objects/`;
    const response = await makeRequest(objectsUrl);
    
    if (response.statusCode === 200) {
      console.log('   ✅ Objets STIX accessibles');
      
      if (response.data && response.data.objects) {
        console.log(`   📊 Nombre d'objets: ${response.data.objects.length}`);
        
        // Analyse des types d'objets
        const objectTypes = {};
        response.data.objects.forEach(obj => {
          objectTypes[obj.type] = (objectTypes[obj.type] || 0) + 1;
        });
        
        console.log('   📋 Types d\'objets STIX:');
        Object.entries(objectTypes).forEach(([type, count]) => {
          console.log(`      • ${type}: ${count}`);
        });
        
        // Recherche de techniques d'attaque
        const attackPatterns = response.data.objects.filter(obj => obj.type === 'attack-pattern');
        if (attackPatterns.length > 0) {
          console.log(`   🎯 Techniques d'attaque: ${attackPatterns.length}`);
          
          // Exemple de technique
          const exampleTechnique = attackPatterns[0];
          console.log(`   📝 Exemple - ${exampleTechnique.name} (${exampleTechnique.external_references?.[0]?.external_id})`);
        }
        
        return true;
      }
    } else {
      console.log(`   ❌ Erreur accès objets: ${response.statusCode}`);
      return false;
    }
  } catch (error) {
    console.log(`   ❌ Erreur objets STIX: ${error.message}`);
    return false;
  }
}

/**
 * Test de recherche de techniques spécifiques
 */
async function testSpecificTechniques() {
  console.log('\n🔍 Test 4: Recherche techniques spécifiques...');
  
  const techniquesToFind = ['T1566', 'T1078', 'T1190']; // Phishing, Valid Accounts, Exploit Public-Facing Application
  
  try {
    const objectsUrl = `${TAXII_CONFIG.url}collections/${TAXII_CONFIG.collectionId}/objects/`;
    const response = await makeRequest(objectsUrl);
    
    if (response.statusCode === 200 && response.data && response.data.objects) {
      const attackPatterns = response.data.objects.filter(obj => obj.type === 'attack-pattern');
      
      console.log('   🎯 Recherche de techniques prioritaires:');
      
      techniquesToFind.forEach(techniqueId => {
        const technique = attackPatterns.find(pattern => 
          pattern.external_references?.some(ref => ref.external_id === techniqueId)
        );
        
        if (technique) {
          console.log(`   ✅ ${techniqueId}: ${technique.name}`);
        } else {
          console.log(`   ❌ ${techniqueId}: Non trouvé`);
        }
      });
      
      return true;
    } else {
      console.log('   ❌ Impossible de rechercher les techniques');
      return false;
    }
  } catch (error) {
    console.log(`   ❌ Erreur recherche: ${error.message}`);
    return false;
  }
}

/**
 * Génération de rapport de test
 */
function generateTestReport(results) {
  console.log('\n📊 RAPPORT DE TEST MITRE ATT&CK');
  console.log('===============================');
  
  const totalTests = results.length;
  const passedTests = results.filter(r => r.passed).length;
  const successRate = Math.round((passedTests / totalTests) * 100);
  
  console.log(`📈 Résultats: ${passedTests}/${totalTests} tests réussis (${successRate}%)`);
  
  results.forEach((result, index) => {
    const status = result.passed ? '✅' : '❌';
    console.log(`   ${status} Test ${index + 1}: ${result.name}`);
  });
  
  if (successRate === 100) {
    console.log('\n🎉 TOUS LES TESTS RÉUSSIS !');
    console.log('✅ Accès MITRE ATT&CK via TAXII opérationnel');
    console.log('✅ Données STIX accessibles');
    console.log('✅ Techniques d\'attaque disponibles');
    console.log('✅ Prêt pour intégration dans EBIOS AI Manager');
    
    console.log('\n🚀 PROCHAINES ÉTAPES:');
    console.log('1. Intégrer le service MITRE ATT&CK dans les agents');
    console.log('2. Configurer le cache des données STIX');
    console.log('3. Tester l\'analyse des techniques dans EBIOS RM');
    
  } else if (successRate >= 75) {
    console.log('\n⚠️  TESTS PARTIELLEMENT RÉUSSIS');
    console.log('✅ Connectivité de base fonctionnelle');
    console.log('⚠️  Certaines fonctionnalités peuvent être limitées');
    console.log('💡 Vérifiez la connectivité réseau et les permissions');
    
  } else {
    console.log('\n❌ ÉCHEC DES TESTS');
    console.log('❌ Problème d\'accès aux données MITRE ATT&CK');
    console.log('🔧 Actions correctives nécessaires:');
    console.log('   • Vérifier la connectivité Internet');
    console.log('   • Vérifier les paramètres proxy/firewall');
    console.log('   • Contacter l\'administrateur réseau');
  }
  
  console.log('\n📚 RESSOURCES:');
  console.log('• MITRE ATT&CK: https://attack.mitre.org/');
  console.log('• TAXII 2.1: https://oasis-open.github.io/cti-documentation/');
  console.log('• STIX 2.1: https://docs.oasis-open.org/cti/stix/v2.1/');
}

/**
 * Exécution des tests
 */
async function runTests() {
  const results = [];
  
  try {
    // Test 1: Connectivité
    const connectivity = await testTaxiiConnectivity();
    results.push({ name: 'Connectivité TAXII', passed: connectivity });
    
    // Test 2: Collections
    const collections = await testCollectionsAccess();
    results.push({ name: 'Accès Collections', passed: collections });
    
    // Test 3: Objets STIX
    const stixObjects = await testStixObjectsAccess();
    results.push({ name: 'Objets STIX', passed: stixObjects });
    
    // Test 4: Techniques spécifiques
    const techniques = await testSpecificTechniques();
    results.push({ name: 'Techniques spécifiques', passed: techniques });
    
    // Génération du rapport
    generateTestReport(results);
    
  } catch (error) {
    console.error('\n❌ ERREUR GLOBALE:', error.message);
    process.exit(1);
  }
}

// Lancement des tests
console.log('🚀 Démarrage des tests MITRE ATT&CK...\n');
runTests();
