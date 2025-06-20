/**
 * 🔄 EVENTEMITTER COMPATIBLE NAVIGATEUR
 * Remplacement de Node.js EventEmitter pour la compatibilité client
 * Alternative légère et performante pour les environnements web
 */

// 🎯 TYPES ET INTERFACES
export type EventListener = (...args: any[]) => void;
export type EventMap = Record<string, EventListener[]>;

/**
 * 🔄 EventEmitter compatible navigateur
 * Implémentation légère sans dépendances Node.js
 */
export class BrowserEventEmitter {
  private events: EventMap = {};
  private maxListeners = 10;

  /**
   * 📝 Ajouter un écouteur d'événement
   */
  on(event: string, listener: EventListener): this {
    if (!this.events[event]) {
      this.events[event] = [];
    }

    this.events[event].push(listener);

    // Avertissement si trop d'écouteurs
    if (this.events[event].length > this.maxListeners) {
      console.warn(
        `⚠️ Possible memory leak detected. ${this.events[event].length} listeners added for event "${event}". ` +
        `Use setMaxListeners() to increase limit.`
      );
    }

    return this;
  }

  /**
   * 📝 Ajouter un écouteur d'événement (alias pour on)
   */
  addEventListener(event: string, listener: EventListener): this {
    return this.on(event, listener);
  }

  /**
   * 🔂 Ajouter un écouteur d'événement unique (une seule fois)
   */
  once(event: string, listener: EventListener): this {
    const onceWrapper = (...args: any[]) => {
      this.off(event, onceWrapper);
      listener.apply(this, args);
    };

    return this.on(event, onceWrapper);
  }

  /**
   * 🗑️ Supprimer un écouteur d'événement
   */
  off(event: string, listener?: EventListener): this {
    if (!this.events[event]) {
      return this;
    }

    if (!listener) {
      // Supprimer tous les écouteurs pour cet événement
      delete this.events[event];
      return this;
    }

    // Supprimer un écouteur spécifique
    const index = this.events[event].indexOf(listener);
    if (index > -1) {
      this.events[event].splice(index, 1);
    }

    // Nettoyer si plus d'écouteurs
    if (this.events[event].length === 0) {
      delete this.events[event];
    }

    return this;
  }

  /**
   * 🗑️ Supprimer un écouteur d'événement (alias pour off)
   */
  removeListener(event: string, listener: EventListener): this {
    return this.off(event, listener);
  }

  /**
   * 🗑️ Supprimer tous les écouteurs d'événement (alias pour off)
   */
  removeEventListener(event: string, listener?: EventListener): this {
    return this.off(event, listener);
  }

  /**
   * 🗑️ Supprimer tous les écouteurs
   */
  removeAllListeners(event?: string): this {
    if (event) {
      delete this.events[event];
    } else {
      this.events = {};
    }
    return this;
  }

  /**
   * 📢 Émettre un événement
   */
  emit(event: string, ...args: any[]): boolean {
    const listeners = this.events[event];
    
    if (!listeners || listeners.length === 0) {
      return false;
    }

    // Créer une copie pour éviter les modifications pendant l'itération
    const listenersToCall = [...listeners];

    // Appeler tous les écouteurs
    listenersToCall.forEach(listener => {
      try {
        listener.apply(this, args);
      } catch (error) {
        console.error(`❌ Erreur dans l'écouteur d'événement "${event}":`, error);
        
        // Émettre un événement d'erreur si possible
        if (event !== 'error') {
          this.emit('error', error);
        }
      }
    });

    return true;
  }

  /**
   * 📊 Obtenir les écouteurs pour un événement
   */
  listeners(event: string): EventListener[] {
    return this.events[event] ? [...this.events[event]] : [];
  }

  /**
   * 📊 Obtenir le nombre d'écouteurs pour un événement
   */
  listenerCount(event: string): number {
    return this.events[event] ? this.events[event].length : 0;
  }

  /**
   * 📊 Obtenir tous les noms d'événements
   */
  eventNames(): string[] {
    return Object.keys(this.events);
  }

  /**
   * ⚙️ Définir le nombre maximum d'écouteurs
   */
  setMaxListeners(max: number): this {
    this.maxListeners = max;
    return this;
  }

  /**
   * ⚙️ Obtenir le nombre maximum d'écouteurs
   */
  getMaxListeners(): number {
    return this.maxListeners;
  }

  /**
   * 🔍 Vérifier si un événement a des écouteurs
   */
  hasListeners(event: string): boolean {
    return this.listenerCount(event) > 0;
  }

  /**
   * 🧹 Nettoyer et libérer les ressources
   */
  destroy(): void {
    this.removeAllListeners();
  }

  /**
   * 📊 Obtenir des statistiques sur les événements
   */
  getStats(): {
    totalEvents: number;
    totalListeners: number;
    events: Record<string, number>;
  } {
    const events = this.eventNames();
    const stats = {
      totalEvents: events.length,
      totalListeners: 0,
      events: {} as Record<string, number>
    };

    events.forEach(event => {
      const count = this.listenerCount(event);
      stats.events[event] = count;
      stats.totalListeners += count;
    });

    return stats;
  }

  /**
   * 🔧 Méthode de debug pour afficher l'état
   */
  debug(): void {
    const stats = this.getStats();
    console.log('🔄 BrowserEventEmitter Debug:', {
      maxListeners: this.maxListeners,
      ...stats,
      eventDetails: this.events
    });
  }
}

// 🏭 FACTORY ET UTILITAIRES
export const createEventEmitter = (): BrowserEventEmitter => {
  return new BrowserEventEmitter();
};

// 🎯 EXPORT PAR DÉFAUT
export default BrowserEventEmitter;
