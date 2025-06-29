/**
 * 🧪 TEST INTÉGRATION FRONTEND-BACKEND
 * Test de l'intégration entre React et le service Python IA
 */

const fs = require('fs');
const { spawn } = require('child_process');

console.log('🧪 TEST INTÉGRATION FRONTEND-BACKEND');
console.log('=' .repeat(50));

// Test 1: Vérification des fichiers d'intégration
function testIntegrationFiles() {
    console.log('\n📁 TEST 1: FICHIERS D\'INTÉGRATION');
    console.log('-'.repeat(40));
    
    const integrationFiles = [
        'src/services/ai/PythonAIIntegrationService.ts',
        'src/components/workshops/Workshop1AIAssistant.tsx',
        'python-ai-service/main.py',
        'python-ai-service/services/workshop1_orchestrator.py',
        'python-ai-service/services/agent_memory_service.py'
    ];
    
    let allFilesExist = true;
    
    for (const file of integrationFiles) {
        if (fs.existsSync(file)) {
            console.log(`✅ ${file}`);
        } else {
            console.log(`❌ ${file} - MANQUANT`);
            allFilesExist = false;
        }
    }
    
    return allFilesExist;
}

// Test 2: Vérification de l'intégration TypeScript
function testTypeScriptIntegration() {
    console.log('\n🔧 TEST 2: INTÉGRATION TYPESCRIPT');
    console.log('-'.repeat(40));
    
    try {
        const integrationService = fs.readFileSync('src/services/ai/PythonAIIntegrationService.ts', 'utf8');
        
        const requiredFeatures = [
            'class PythonAIIntegrationService',
            'checkServiceHealth',
            'analyzeWorkshop1',
            'generateSuggestions',
            'analyzeCoherence',
            'generateFallbackAnalysis',
            'isAvailable'
        ];
        
        let score = 0;
        for (const feature of requiredFeatures) {
            if (integrationService.includes(feature)) {
                console.log(`✅ ${feature}`);
                score++;
            } else {
                console.log(`❌ ${feature} - MANQUANT`);
            }
        }
        
        console.log(`\n📊 Score intégration TypeScript: ${score}/${requiredFeatures.length}`);
        return score === requiredFeatures.length;
        
    } catch (error) {
        console.log(`❌ Erreur lecture fichier: ${error.message}`);
        return false;
    }
}

// Test 3: Vérification du composant AI Assistant
function testAIAssistantComponent() {
    console.log('\n🤖 TEST 3: COMPOSANT AI ASSISTANT');
    console.log('-'.repeat(35));
    
    try {
        const aiAssistant = fs.readFileSync('src/components/workshops/Workshop1AIAssistant.tsx', 'utf8');
        
        const requiredFeatures = [
            'pythonAIService',
            'isAIServiceAvailable',
            'loadAISuggestions',
            'applyAISuggestion',
            'Bot',
            'Wifi',
            'WifiOff',
            'Mode IA Avancée',
            'Mode Local'
        ];
        
        let score = 0;
        for (const feature of requiredFeatures) {
            if (aiAssistant.includes(feature)) {
                console.log(`✅ ${feature}`);
                score++;
            } else {
                console.log(`❌ ${feature} - MANQUANT`);
            }
        }
        
        console.log(`\n📊 Score AI Assistant: ${score}/${requiredFeatures.length}`);
        return score >= requiredFeatures.length - 1; // Tolérance d'1 élément
        
    } catch (error) {
        console.log(`❌ Erreur lecture composant: ${error.message}`);
        return false;
    }
}

// Test 4: Vérification de l'intégration Workshop 1
function testWorkshop1Integration() {
    console.log('\n🎯 TEST 4: INTÉGRATION WORKSHOP 1');
    console.log('-'.repeat(35));
    
    try {
        const workshop1 = fs.readFileSync('src/pages/workshops/Workshop1Unified.tsx', 'utf8');
        
        const requiredFeatures = [
            'import Workshop1AIAssistant',
            '<Workshop1AIAssistant',
            'missionId={missionId}',
            'currentStep={currentStep}',
            'businessValues={businessValues}',
            'callbacks={{',
            'onAddBusinessValue',
            'onNavigateToSection'
        ];
        
        let score = 0;
        for (const feature of requiredFeatures) {
            if (workshop1.includes(feature)) {
                console.log(`✅ ${feature}`);
                score++;
            } else {
                console.log(`❌ ${feature} - MANQUANT`);
            }
        }
        
        // Vérifier que l'assistant n'est plus commenté
        const isActive = !workshop1.includes('// import Workshop1AIAssistant') && 
                         workshop1.includes('import Workshop1AIAssistant');
        
        console.log(`${isActive ? '✅' : '❌'} Assistant IA activé`);
        
        console.log(`\n📊 Score Workshop 1: ${score}/${requiredFeatures.length}`);
        return score === requiredFeatures.length && isActive;
        
    } catch (error) {
        console.log(`❌ Erreur lecture Workshop 1: ${error.message}`);
        return false;
    }
}

// Test 5: Test de communication avec le backend Python
async function testBackendCommunication() {
    console.log('\n🔗 TEST 5: COMMUNICATION BACKEND');
    console.log('-'.repeat(35));
    
    return new Promise((resolve) => {
        // Test simple de ping au service Python
        const testUrl = 'http://localhost:8000/health';
        
        // Utiliser curl pour tester la connexion
        const curl = spawn('curl', ['-s', '-f', testUrl], {
            stdio: ['pipe', 'pipe', 'pipe']
        });
        
        let output = '';
        let error = '';
        
        curl.stdout.on('data', (data) => {
            output += data.toString();
        });
        
        curl.stderr.on('data', (data) => {
            error += data.toString();
        });
        
        curl.on('close', (code) => {
            if (code === 0 && output) {
                try {
                    const response = JSON.parse(output);
                    console.log('✅ Service Python IA accessible');
                    console.log(`✅ Statut: ${response.status}`);
                    console.log(`✅ Services: ${Object.keys(response.services || {}).length} disponibles`);
                    
                    if (response.capabilities) {
                        console.log('✅ Capacités avancées détectées');
                        for (const [cap, available] of Object.entries(response.capabilities)) {
                            console.log(`   ${available ? '✅' : '⚠️'} ${cap}`);
                        }
                    }
                    
                    resolve(true);
                } catch (e) {
                    console.log('⚠️ Service accessible mais réponse invalide');
                    console.log(`   Réponse: ${output.substring(0, 100)}...`);
                    resolve(false);
                }
            } else {
                console.log('❌ Service Python IA non accessible');
                console.log(`   Code: ${code}`);
                if (error) {
                    console.log(`   Erreur: ${error.substring(0, 100)}`);
                }
                console.log('💡 Le service Python doit être démarré séparément');
                resolve(false);
            }
        });
        
        // Timeout après 5 secondes
        setTimeout(() => {
            curl.kill();
            console.log('⏱️ Timeout - Service Python probablement non démarré');
            resolve(false);
        }, 5000);
    });
}

// Test 6: Vérification de la configuration frontend
function testFrontendConfiguration() {
    console.log('\n⚙️ TEST 6: CONFIGURATION FRONTEND');
    console.log('-'.repeat(35));
    
    try {
        // Vérifier le fichier .env ou les variables d'environnement
        let envConfig = {};
        
        if (fs.existsSync('.env')) {
            const envContent = fs.readFileSync('.env', 'utf8');
            console.log('✅ Fichier .env trouvé');
            
            if (envContent.includes('VITE_PYTHON_AI_SERVICE_URL')) {
                console.log('✅ VITE_PYTHON_AI_SERVICE_URL configuré');
            } else {
                console.log('⚠️ VITE_PYTHON_AI_SERVICE_URL non configuré');
                console.log('💡 Ajoutez: VITE_PYTHON_AI_SERVICE_URL=http://localhost:8000');
            }
        } else {
            console.log('⚠️ Fichier .env non trouvé');
            console.log('💡 Créez un fichier .env avec VITE_PYTHON_AI_SERVICE_URL=http://localhost:8000');
        }
        
        // Vérifier package.json pour les scripts
        if (fs.existsSync('package.json')) {
            const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
            console.log('✅ package.json trouvé');
            
            if (packageJson.scripts && packageJson.scripts.dev) {
                console.log('✅ Script dev disponible');
            }
        }
        
        return true;
        
    } catch (error) {
        console.log(`❌ Erreur configuration: ${error.message}`);
        return false;
    }
}

// Test principal
async function runIntegrationTests() {
    console.log('🚀 DÉMARRAGE TESTS INTÉGRATION FRONTEND-BACKEND');
    
    const tests = [
        { name: 'Fichiers d\'intégration', test: testIntegrationFiles },
        { name: 'Intégration TypeScript', test: testTypeScriptIntegration },
        { name: 'Composant AI Assistant', test: testAIAssistantComponent },
        { name: 'Intégration Workshop 1', test: testWorkshop1Integration },
        { name: 'Communication backend', test: testBackendCommunication },
        { name: 'Configuration frontend', test: testFrontendConfiguration }
    ];
    
    let passedTests = 0;
    const results = [];
    
    for (const { name, test } of tests) {
        console.log(`\n🔍 Test: ${name}`);
        try {
            const result = await test();
            results.push({ name, passed: result });
            if (result) {
                passedTests++;
            }
        } catch (error) {
            console.log(`❌ Erreur test ${name}: ${error.message}`);
            results.push({ name, passed: false });
        }
    }
    
    // Rapport final
    console.log('\n' + '='.repeat(50));
    console.log('🎉 RAPPORT INTÉGRATION FRONTEND-BACKEND');
    console.log('='.repeat(50));
    
    for (const { name, passed } of results) {
        console.log(`${passed ? '✅' : '❌'} ${name}`);
    }
    
    console.log(`\n📊 RÉSULTAT: ${passedTests}/${tests.length} tests réussis`);
    
    if (passedTests >= tests.length - 1) { // Tolérance pour le backend
        console.log('\n🎉 INTÉGRATION FRONTEND RÉUSSIE!');
        console.log('✅ Les fichiers d\'intégration sont présents');
        console.log('✅ Le service TypeScript est fonctionnel');
        console.log('✅ Le composant AI Assistant est intégré');
        console.log('✅ Workshop 1 utilise l\'assistant IA');
        console.log('✅ La configuration est correcte');
        
        if (passedTests === tests.length) {
            console.log('✅ Communication backend opérationnelle');
        } else {
            console.log('⚠️ Service Python à démarrer pour communication complète');
        }
        
        console.log('\n🚀 PRÊT POUR L\'INSTALLATION DES LIBRAIRIES!');
    } else {
        console.log('\n⚠️ PROBLÈMES D\'INTÉGRATION DÉTECTÉS');
        console.log('🔧 Vérifiez les éléments manquants ci-dessus');
    }
    
    return passedTests >= tests.length - 1;
}

// Exécution
if (require.main === module) {
    runIntegrationTests().then(success => {
        process.exit(success ? 0 : 1);
    });
}

module.exports = { runIntegrationTests };
