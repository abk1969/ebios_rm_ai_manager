/**
 * 🛡️ INTERCEPTEUR DE REQUÊTES SÉCURISÉ
 * Bloque les requêtes non autorisées et les domaines suspects
 */

export class RequestInterceptor {
  private static instance: RequestInterceptor;
  private blockedDomains: Set<string> = new Set();
  private allowedDomains: Set<string> = new Set();
  private isActive = false;
  private debugMode = false;

  private constructor() {
    this.initializeBlockedDomains();
    this.initializeAllowedDomains();
  }

  static getInstance(): RequestInterceptor {
    if (!RequestInterceptor.instance) {
      RequestInterceptor.instance = new RequestInterceptor();
    }
    return RequestInterceptor.instance;
  }

  /**
   * Initialise la liste des domaines bloqués
   */
  private initializeBlockedDomains(): void {
    this.blockedDomains.add('raw.githubusercontent.com');
    this.blockedDomains.add('github.com/Bon-Appetit');
    this.blockedDomains.add('porn-domains');
    // Ajouter d'autres domaines suspects si nécessaire
  }

  /**
   * Initialise la liste des domaines autorisés
   */
  private initializeAllowedDomains(): void {
    // Domaines locaux
    this.allowedDomains.add('localhost');
    this.allowedDomains.add('127.0.0.1');

    // APIs Google/Firebase
    this.allowedDomains.add('api.gemini.google.com');
    this.allowedDomains.add('firestore.googleapis.com');
    this.allowedDomains.add('firebase.googleapis.com');
    this.allowedDomains.add('identitytoolkit.googleapis.com');
    this.allowedDomains.add('securetoken.googleapis.com');
    this.allowedDomains.add('www.googleapis.com');
    this.allowedDomains.add('oauth2.googleapis.com');

    // CDN et ressources
    this.allowedDomains.add('fonts.googleapis.com');
    this.allowedDomains.add('fonts.gstatic.com');
    this.allowedDomains.add('cdn.jsdelivr.net');
    this.allowedDomains.add('unpkg.com');

    // Firebase Hosting et autres services
    this.allowedDomains.add('firebase.google.com');
    this.allowedDomains.add('firebaseapp.com');
    this.allowedDomains.add('web.app');
  }

  /**
   * Active l'intercepteur
   */
  activate(): void {
    if (this.isActive) return;

    // Intercepter fetch
    const originalFetch = window.fetch;
    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      let url: string;

      try {
        if (typeof input === 'string') {
          url = input;
        } else if (input instanceof URL) {
          url = input.toString();
        } else if (input instanceof Request) {
          url = input.url;
        } else {
          url = input.toString();
        }
      } catch (error) {
        // Si on ne peut pas extraire l'URL, laisser passer la requête
        console.warn('🛡️ Impossible d\'extraire l\'URL, requête autorisée:', input);
        return originalFetch(input, init);
      }

      if (this.shouldBlockRequest(url)) {
        console.warn(`🛡️ Requête bloquée: ${url}`);
        throw new Error(`Requête bloquée par l'intercepteur de sécurité: ${url}`);
      }

      if (this.debugMode) {
        console.log(`🛡️ Requête autorisée: ${url}`);
      }

      return originalFetch(input, init);
    };

    // Intercepter XMLHttpRequest
    const originalXHROpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method: string, url: string | URL, ...args: any[]) {
      const urlString = url.toString();
      
      if (RequestInterceptor.getInstance().shouldBlockRequest(urlString)) {
        console.warn(`🛡️ Requête XHR bloquée: ${urlString}`);
        throw new Error(`Requête XHR bloquée par l'intercepteur de sécurité: ${urlString}`);
      }

      return originalXHROpen.call(this, method, url, ...args);
    };

    this.isActive = true;
    console.log('🛡️ Intercepteur de requêtes activé');
  }

  /**
   * Désactive l'intercepteur
   */
  deactivate(): void {
    // Note: En production, il serait mieux de sauvegarder les références originales
    // et les restaurer ici. Pour cette implémentation simple, on se contente
    // de marquer comme inactif.
    this.isActive = false;
    console.log('🛡️ Intercepteur de requêtes désactivé');
  }

  /**
   * Vérifie si une requête doit être bloquée
   */
  private shouldBlockRequest(url: string): boolean {
    try {
      // Vérifier si l'URL est valide
      if (!url || typeof url !== 'string') {
        return false; // Laisser passer si on ne peut pas analyser
      }

      // URLs relatives ou locales - toujours autorisées
      if (url.startsWith('/') || url.startsWith('./') || url.startsWith('../')) {
        return false;
      }

      // URLs data: ou blob: - autorisées
      if (url.startsWith('data:') || url.startsWith('blob:')) {
        return false;
      }

      const urlObj = new URL(url);
      const hostname = urlObj.hostname;

      // Vérifier les domaines explicitement bloqués
      for (const blockedDomain of this.blockedDomains) {
        if (hostname.includes(blockedDomain) || url.includes(blockedDomain)) {
          console.warn(`🛡️ Domaine bloqué détecté: ${hostname} (règle: ${blockedDomain})`);
          return true;
        }
      }

      // Si c'est une requête locale, toujours autoriser
      if (hostname === window.location.hostname ||
          hostname === 'localhost' ||
          hostname === '127.0.0.1' ||
          hostname.startsWith('192.168.') ||
          hostname.startsWith('10.') ||
          hostname.startsWith('172.')) {
        return false;
      }

      // Pour les requêtes externes, vérifier la liste blanche
      const isAllowed = Array.from(this.allowedDomains).some(domain =>
        hostname === domain || hostname.endsWith('.' + domain)
      );

      if (!isAllowed) {
        console.warn(`🛡️ Domaine externe non autorisé: ${hostname}`);
        return true;
      }

      return false;
    } catch (error) {
      // En cas d'erreur de parsing, laisser passer par sécurité
      console.warn(`🛡️ Erreur d'analyse URL, requête autorisée: ${url}`, error);
      return false;
    }
  }

  /**
   * Ajoute un domaine à la liste des bloqués
   */
  addBlockedDomain(domain: string): void {
    this.blockedDomains.add(domain);
    console.log(`🛡️ Domaine ajouté à la liste de blocage: ${domain}`);
  }

  /**
   * Ajoute un domaine à la liste des autorisés
   */
  addAllowedDomain(domain: string): void {
    this.allowedDomains.add(domain);
    console.log(`🛡️ Domaine ajouté à la liste autorisée: ${domain}`);
  }

  /**
   * Active/désactive le mode debug
   */
  setDebugMode(enabled: boolean): void {
    this.debugMode = enabled;
    console.log(`🛡️ Mode debug ${enabled ? 'activé' : 'désactivé'}`);
  }

  /**
   * Obtient les statistiques de blocage
   */
  getStats(): { blockedDomains: string[], allowedDomains: string[], isActive: boolean, debugMode: boolean } {
    return {
      blockedDomains: Array.from(this.blockedDomains),
      allowedDomains: Array.from(this.allowedDomains),
      isActive: this.isActive,
      debugMode: this.debugMode
    };
  }
}

// Instance globale
export const requestInterceptor = RequestInterceptor.getInstance();
