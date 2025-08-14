#!/usr/bin/env node
/**
 * 🔍 DIAGNOSTIC PROFOND DES SERVICES EBIOS RM
 * Analyse détaillée des problèmes de connectivité et de démarrage
 */

import { spawn, exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import net from 'net';

const execAsync = promisify(exec);

class ServiceDiagnostic {
  constructor() {
    this.services = [
      { name: 'API Node.js', port: 3000, process: 'node', path: 'api/server.js' },
      { name: 'Python AI', port: 8081, process: 'python', path: 'python-ai-service/app.py' },
      { name: 'Frontend React', port: 5173, process: 'node', path: 'package.json' }
    ];
    this.diagnosticResults = [];
  }

  /**
   * Vérifie si un port est ouvert
   */
  async checkPort(port) {
    return new Promise((resolve) => {
      const socket = new net.Socket();
      
      socket.setTimeout(2000);
      
      socket.on('connect', () => {
        socket.destroy();
        resolve(true);
      });
      
      socket.on('timeout', () => {
        socket.destroy();
        resolve(false);
      });
      
      socket.on('error', () => {
        resolve(false);
      });
      
      socket.connect(port, 'localhost');
    });
  }

  /**
   * Vérifie les processus en cours
   */
  async checkProcesses() {
    console.log('🔍 VÉRIFICATION DES PROCESSUS');
    console.log('-'.repeat(40));

    try {
      // Windows
      const { stdout } = await execAsync('tasklist /FI "IMAGENAME eq node.exe" /FO CSV');
      const nodeProcesses = stdout.split('\n').filter(line => line.includes('node.exe')).length - 1;
      
      console.log(`📊 Processus Node.js actifs: ${nodeProcesses}`);

      // Vérifier Python
      const { stdout: pythonOut } = await execAsync('tasklist /FI "IMAGENAME eq python.exe" /FO CSV');
      const pythonProcesses = pythonOut.split('\n').filter(line => line.includes('python.exe')).length - 1;
      
      console.log(`📊 Processus Python actifs: ${pythonProcesses}`);

      return { nodeProcesses, pythonProcesses };

    } catch (error) {
      console.log(`❌ Erreur vérification processus: ${error.message}`);
      return { nodeProcesses: 0, pythonProcesses: 0 };
    }
  }

  /**
   * Teste la connectivité des ports
   */
  async testPortConnectivity() {
    console.log('\n🔌 TEST CONNECTIVITÉ DES PORTS');
    console.log('-'.repeat(40));

    const portResults = [];

    for (const service of this.services) {
      const isOpen = await this.checkPort(service.port);
      
      console.log(`${isOpen ? '✅' : '❌'} ${service.name} (port ${service.port}): ${isOpen ? 'OUVERT' : 'FERMÉ'}`);
      
      portResults.push({
        service: service.name,
        port: service.port,
        isOpen,
        status: isOpen ? 'accessible' : 'inaccessible'
      });
    }

    return portResults;
  }

  /**
   * Vérifie les fichiers de configuration
   */
  async checkConfigFiles() {
    console.log('\n📋 VÉRIFICATION FICHIERS DE CONFIGURATION');
    console.log('-'.repeat(40));

    const configFiles = [
      { path: 'api/package.json', critical: true },
      { path: 'api/server.js', critical: true },
      { path: 'api/.env', critical: false },
      { path: 'python-ai-service/app.py', critical: true },
      { path: 'python-ai-service/requirements.txt', critical: true },
      { path: 'package.json', critical: true }
    ];

    const configResults = [];

    configFiles.forEach(file => {
      const exists = fs.existsSync(file.path);
      const icon = exists ? '✅' : (file.critical ? '❌' : '⚠️');
      
      console.log(`${icon} ${file.path}: ${exists ? 'Présent' : 'Manquant'}`);
      
      configResults.push({
        path: file.path,
        exists,
        critical: file.critical,
        status: exists ? 'ok' : 'missing'
      });
    });

    return configResults;
  }

  /**
   * Teste les dépendances Node.js
   */
  async checkNodeDependencies() {
    console.log('\n📦 VÉRIFICATION DÉPENDANCES NODE.JS');
    console.log('-'.repeat(40));

    const locations = ['./api', './'];
    const depResults = [];

    for (const location of locations) {
      const nodeModulesPath = `${location}/node_modules`;
      const packageJsonPath = `${location}/package.json`;
      
      if (fs.existsSync(packageJsonPath)) {
        const nodeModulesExists = fs.existsSync(nodeModulesPath);
        
        console.log(`📍 ${location}:`);
        console.log(`   ${nodeModulesExists ? '✅' : '❌'} node_modules: ${nodeModulesExists ? 'Présent' : 'Manquant'}`);
        
        if (nodeModulesExists) {
          try {
            const moduleCount = fs.readdirSync(nodeModulesPath).length;
            console.log(`   📊 Modules installés: ${moduleCount}`);
          } catch (error) {
            console.log(`   ⚠️ Erreur lecture modules: ${error.message}`);
          }
        }

        depResults.push({
          location,
          nodeModulesExists,
          packageJsonExists: true
        });
      }
    }

    return depResults;
  }

  /**
   * Teste les dépendances Python
   */
  async checkPythonDependencies() {
    console.log('\n🐍 VÉRIFICATION DÉPENDANCES PYTHON');
    console.log('-'.repeat(40));

    try {
      // Vérifier Python
      const { stdout: pythonVersion } = await execAsync('python --version');
      console.log(`✅ Python: ${pythonVersion.trim()}`);

      // Vérifier les modules essentiels
      const essentialModules = ['flask', 'flask_cors', 'psycopg2'];
      const moduleResults = [];

      for (const module of essentialModules) {
        try {
          await execAsync(`python -c "import ${module}"`);
          console.log(`✅ Module ${module}: Disponible`);
          moduleResults.push({ module, available: true });
        } catch (error) {
          console.log(`❌ Module ${module}: Manquant`);
          moduleResults.push({ module, available: false });
        }
      }

      return { pythonAvailable: true, modules: moduleResults };

    } catch (error) {
      console.log(`❌ Python: Non disponible (${error.message})`);
      return { pythonAvailable: false, modules: [] };
    }
  }

  /**
   * Analyse les logs d'erreur
   */
  async analyzeLogs() {
    console.log('\n📄 ANALYSE DES LOGS');
    console.log('-'.repeat(40));

    const logFiles = [
      'backend.log',
      'frontend.log',
      'api/server.log',
      'python-ai-service/app.log'
    ];

    const logResults = [];

    logFiles.forEach(logFile => {
      if (fs.existsSync(logFile)) {
        try {
          const content = fs.readFileSync(logFile, 'utf8');
          const lines = content.split('\n');
          const errorLines = lines.filter(line => 
            line.toLowerCase().includes('error') || 
            line.toLowerCase().includes('failed') ||
            line.toLowerCase().includes('exception')
          );

          console.log(`📄 ${logFile}: ${lines.length} lignes, ${errorLines.length} erreurs`);
          
          if (errorLines.length > 0) {
            console.log(`   Dernières erreurs:`);
            errorLines.slice(-3).forEach(error => {
              console.log(`   ⚠️ ${error.substring(0, 80)}...`);
            });
          }

          logResults.push({
            file: logFile,
            totalLines: lines.length,
            errorCount: errorLines.length,
            recentErrors: errorLines.slice(-3)
          });

        } catch (error) {
          console.log(`❌ Erreur lecture ${logFile}: ${error.message}`);
        }
      } else {
        console.log(`⚠️ ${logFile}: Fichier non trouvé`);
      }
    });

    return logResults;
  }

  /**
   * Génère le rapport de diagnostic
   */
  generateDiagnosticReport(results) {
    console.log('\n📊 RAPPORT DE DIAGNOSTIC COMPLET');
    console.log('='.repeat(60));

    const { processes, ports, configs, nodeDeps, pythonDeps, logs } = results;

    // Analyse des problèmes critiques
    const criticalIssues = [];
    
    // Ports fermés
    const closedPorts = ports.filter(p => !p.isOpen);
    if (closedPorts.length > 0) {
      criticalIssues.push(`${closedPorts.length} service(s) inaccessible(s)`);
    }

    // Fichiers critiques manquants
    const missingCritical = configs.filter(c => c.critical && !c.exists);
    if (missingCritical.length > 0) {
      criticalIssues.push(`${missingCritical.length} fichier(s) critique(s) manquant(s)`);
    }

    // Dépendances Python manquantes
    if (!pythonDeps.pythonAvailable) {
      criticalIssues.push('Python non disponible');
    } else {
      const missingPythonModules = pythonDeps.modules.filter(m => !m.available);
      if (missingPythonModules.length > 0) {
        criticalIssues.push(`${missingPythonModules.length} module(s) Python manquant(s)`);
      }
    }

    console.log(`🔴 PROBLÈMES CRITIQUES: ${criticalIssues.length}`);
    criticalIssues.forEach((issue, index) => {
      console.log(`   ${index + 1}. ${issue}`);
    });

    console.log(`\n📈 RÉSUMÉ:`);
    console.log(`   Processus Node.js: ${processes.nodeProcesses}`);
    console.log(`   Processus Python: ${processes.pythonProcesses}`);
    console.log(`   Ports ouverts: ${ports.filter(p => p.isOpen).length}/${ports.length}`);
    console.log(`   Fichiers config OK: ${configs.filter(c => c.exists).length}/${configs.length}`);

    // Recommandations
    console.log(`\n💡 RECOMMANDATIONS PRIORITAIRES:`);
    
    if (closedPorts.length > 0) {
      console.log(`   🔧 Redémarrer les services sur ports fermés`);
    }
    
    if (missingCritical.length > 0) {
      console.log(`   📁 Restaurer les fichiers critiques manquants`);
    }
    
    if (!pythonDeps.pythonAvailable) {
      console.log(`   🐍 Installer/configurer Python`);
    }

    const report = {
      timestamp: new Date().toISOString(),
      criticalIssues: criticalIssues.length,
      summary: {
        nodeProcesses: processes.nodeProcesses,
        pythonProcesses: processes.pythonProcesses,
        openPorts: ports.filter(p => p.isOpen).length,
        totalPorts: ports.length,
        configFilesOK: configs.filter(c => c.exists).length,
        totalConfigFiles: configs.length
      },
      details: results,
      systemHealth: criticalIssues.length === 0 ? 'healthy' : 'critical'
    };

    // Sauvegarder le rapport
    fs.writeFileSync('diagnostic-services-profond.json', JSON.stringify(report, null, 2));
    console.log(`\n📄 Rapport détaillé sauvegardé: diagnostic-services-profond.json`);

    return report;
  }

  /**
   * Exécute le diagnostic complet
   */
  async runCompleteDiagnostic() {
    console.log('🔍 DIAGNOSTIC PROFOND DES SERVICES EBIOS RM');
    console.log('='.repeat(60));

    const processes = await this.checkProcesses();
    const ports = await this.testPortConnectivity();
    const configs = await this.checkConfigFiles();
    const nodeDeps = await this.checkNodeDependencies();
    const pythonDeps = await this.checkPythonDependencies();
    const logs = await this.analyzeLogs();

    const results = { processes, ports, configs, nodeDeps, pythonDeps, logs };
    
    return this.generateDiagnosticReport(results);
  }
}

// Exécution
async function main() {
  try {
    const diagnostic = new ServiceDiagnostic();
    const report = await diagnostic.runCompleteDiagnostic();

    const exitCode = report.systemHealth === 'healthy' ? 0 : 1;
    process.exit(exitCode);

  } catch (error) {
    console.error('💥 ERREUR CRITIQUE:', error.message);
    process.exit(2);
  }
}

main();
