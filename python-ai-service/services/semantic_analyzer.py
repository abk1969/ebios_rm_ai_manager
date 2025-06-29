"""
🧠 ANALYSEUR SÉMANTIQUE AVANCÉ EBIOS RM
Analyse sémantique avec Transformers + Sentence-Transformers
Point 2.1 - Phase 2: IA Sémantique et Suggestions
"""

import asyncio
import logging
import numpy as np
from datetime import datetime
from typing import Dict, List, Any, Optional, Tuple
import json

# Imports conditionnels pour éviter les erreurs
try:
    from sentence_transformers import SentenceTransformer
    import torch
    TRANSFORMERS_AVAILABLE = True
except ImportError:
    TRANSFORMERS_AVAILABLE = False
    logging.warning("🔧 Transformers non disponible, mode simulation activé")

try:
    from sklearn.metrics.pairwise import cosine_similarity
    from sklearn.cluster import KMeans
    from sklearn.decomposition import PCA
    SKLEARN_AVAILABLE = True
except ImportError:
    SKLEARN_AVAILABLE = False
    logging.warning("🔧 Scikit-learn non disponible, mode simulation activé")

try:
    import networkx as nx
    NETWORKX_AVAILABLE = True
except ImportError:
    NETWORKX_AVAILABLE = False
    logging.warning("🔧 NetworkX non disponible, mode simulation activé")

logger = logging.getLogger(__name__)

# === MODÈLES DE DONNÉES ===

class SemanticAnalysisResult:
    """Résultat d'analyse sémantique"""
    def __init__(self):
        self.similarity_matrix = None
        self.clusters = []
        self.inconsistencies = []
        self.suggestions = []
        self.coherence_score = 0.0
        self.semantic_graph = None
        self.analysis_timestamp = datetime.now()

class EbiosElement:
    """Élément EBIOS RM pour analyse sémantique"""
    def __init__(self, id: str, name: str, description: str, category: str):
        self.id = id
        self.name = name
        self.description = description
        self.category = category
        self.embedding = None
        self.semantic_score = 0.0

# === ANALYSEUR SÉMANTIQUE PRINCIPAL ===

class EbiosSemanticAnalyzer:
    """
    Analyseur sémantique avancé pour EBIOS RM
    Utilise Sentence-Transformers pour l'analyse sémantique
    """
    
    def __init__(self, model_name: str = "all-MiniLM-L6-v2"):
        self.model_name = model_name
        self.sentence_model = None
        self.embeddings_cache = {}
        self.analysis_cache = {}
        
        # Initialisation sécurisée
        self._initialize_safely()
    
    def _initialize_safely(self):
        """Initialisation sécurisée des modèles"""
        logger.info(f"🧠 Initialisation Analyseur Sémantique: {self.model_name}")
        
        if TRANSFORMERS_AVAILABLE:
            try:
                self.sentence_model = SentenceTransformer(self.model_name)
                logger.info("✅ Modèle Sentence-Transformers chargé")
            except Exception as e:
                logger.warning(f"⚠️ Erreur chargement modèle: {e}")
                self.sentence_model = None
        else:
            logger.warning("⚠️ Transformers non disponible, mode simulation")
    
    async def analyze_ebios_elements(
        self, 
        elements: List[Dict[str, Any]],
        analysis_type: str = "comprehensive"
    ) -> SemanticAnalysisResult:
        """
        Analyse sémantique complète des éléments EBIOS RM
        """
        logger.info(f"🧠 Analyse sémantique: {len(elements)} éléments, type: {analysis_type}")
        
        result = SemanticAnalysisResult()
        
        try:
            # 1. Conversion en objets EbiosElement
            ebios_elements = self._convert_to_ebios_elements(elements)
            
            # 2. Génération des embeddings
            await self._generate_embeddings(ebios_elements)
            
            # 3. Analyse de similarité
            if analysis_type in ["comprehensive", "similarity"]:
                result.similarity_matrix = self._compute_similarity_matrix(ebios_elements)
            
            # 4. Clustering sémantique
            if analysis_type in ["comprehensive", "clustering"]:
                result.clusters = self._perform_semantic_clustering(ebios_elements)
            
            # 5. Détection d'incohérences
            if analysis_type in ["comprehensive", "inconsistencies"]:
                result.inconsistencies = self._detect_semantic_inconsistencies(ebios_elements)
            
            # 6. Génération de suggestions
            result.suggestions = self._generate_semantic_suggestions(ebios_elements, result)
            
            # 7. Score de cohérence global
            result.coherence_score = self._compute_coherence_score(ebios_elements, result)
            
            # 8. Graphe sémantique
            if NETWORKX_AVAILABLE and analysis_type == "comprehensive":
                result.semantic_graph = self._build_semantic_graph(ebios_elements, result)
            
            logger.info(f"✅ Analyse sémantique terminée - Score: {result.coherence_score:.2f}")
            return result
            
        except Exception as e:
            logger.error(f"❌ Erreur analyse sémantique: {e}")
            return self._create_fallback_result(elements)
    
    def _convert_to_ebios_elements(self, elements: List[Dict[str, Any]]) -> List[EbiosElement]:
        """Convertit les éléments en objets EbiosElement"""
        ebios_elements = []
        
        for element in elements:
            ebios_element = EbiosElement(
                id=element.get('id', f"elem_{len(ebios_elements)}"),
                name=element.get('name', ''),
                description=element.get('description', ''),
                category=element.get('category', 'unknown')
            )
            ebios_elements.append(ebios_element)
        
        return ebios_elements
    
    async def _generate_embeddings(self, elements: List[EbiosElement]):
        """Génère les embeddings pour chaque élément"""
        if not self.sentence_model:
            # Mode simulation
            for element in elements:
                element.embedding = np.random.rand(384)  # Dimension du modèle MiniLM
            return
        
        try:
            # Préparer les textes pour l'embedding
            texts = []
            for element in elements:
                # Combiner nom et description pour un embedding plus riche
                text = f"{element.name}. {element.description}".strip()
                texts.append(text)
            
            # Générer les embeddings en batch
            embeddings = self.sentence_model.encode(texts, convert_to_numpy=True)
            
            # Assigner les embeddings aux éléments
            for i, element in enumerate(elements):
                element.embedding = embeddings[i]
                
                # Calculer un score sémantique basique
                element.semantic_score = float(np.linalg.norm(embeddings[i]))
            
            logger.info(f"✅ Embeddings générés pour {len(elements)} éléments")
            
        except Exception as e:
            logger.error(f"❌ Erreur génération embeddings: {e}")
            # Fallback avec embeddings aléatoires
            for element in elements:
                element.embedding = np.random.rand(384)
    
    def _compute_similarity_matrix(self, elements: List[EbiosElement]) -> np.ndarray:
        """Calcule la matrice de similarité entre éléments"""
        if not SKLEARN_AVAILABLE or not elements:
            return np.eye(len(elements)) if elements else np.array([])
        
        try:
            # Extraire les embeddings
            embeddings = np.array([elem.embedding for elem in elements])
            
            # Calculer la similarité cosinus
            similarity_matrix = cosine_similarity(embeddings)
            
            logger.info(f"✅ Matrice de similarité calculée: {similarity_matrix.shape}")
            return similarity_matrix
            
        except Exception as e:
            logger.error(f"❌ Erreur calcul similarité: {e}")
            return np.eye(len(elements))
    
    def _perform_semantic_clustering(self, elements: List[EbiosElement]) -> List[Dict[str, Any]]:
        """Effectue un clustering sémantique des éléments"""
        if not SKLEARN_AVAILABLE or len(elements) < 2:
            return []
        
        try:
            # Extraire les embeddings
            embeddings = np.array([elem.embedding for elem in elements])
            
            # Déterminer le nombre optimal de clusters
            n_clusters = min(max(2, len(elements) // 3), 5)
            
            # Effectuer le clustering
            kmeans = KMeans(n_clusters=n_clusters, random_state=42, n_init=10)
            cluster_labels = kmeans.fit_predict(embeddings)
            
            # Organiser les résultats par cluster
            clusters = []
            for cluster_id in range(n_clusters):
                cluster_elements = [
                    elements[i] for i, label in enumerate(cluster_labels) 
                    if label == cluster_id
                ]
                
                if cluster_elements:
                    # Calculer le centroïde du cluster
                    cluster_embeddings = [elem.embedding for elem in cluster_elements]
                    centroid = np.mean(cluster_embeddings, axis=0)
                    
                    # Trouver l'élément le plus représentatif
                    distances = [
                        np.linalg.norm(elem.embedding - centroid) 
                        for elem in cluster_elements
                    ]
                    representative_idx = np.argmin(distances)
                    
                    clusters.append({
                        "cluster_id": cluster_id,
                        "elements": [elem.id for elem in cluster_elements],
                        "representative": cluster_elements[representative_idx].id,
                        "theme": cluster_elements[representative_idx].name,
                        "coherence": float(1.0 - np.mean(distances))
                    })
            
            logger.info(f"✅ Clustering effectué: {len(clusters)} clusters")
            return clusters
            
        except Exception as e:
            logger.error(f"❌ Erreur clustering: {e}")
            return []
    
    def _detect_semantic_inconsistencies(self, elements: List[EbiosElement]) -> List[Dict[str, Any]]:
        """Détecte les incohérences sémantiques"""
        inconsistencies = []
        
        if not elements or len(elements) < 2:
            return inconsistencies
        
        try:
            # Calculer la matrice de similarité
            similarity_matrix = self._compute_similarity_matrix(elements)
            
            # Détecter les éléments avec des similarités anormalement faibles
            for i, element_i in enumerate(elements):
                for j, element_j in enumerate(elements[i+1:], i+1):
                    similarity = similarity_matrix[i][j]
                    
                    # Si deux éléments de même catégorie ont une similarité très faible
                    if (element_i.category == element_j.category and 
                        similarity < 0.3):  # Seuil de similarité
                        
                        inconsistencies.append({
                            "type": "low_similarity_same_category",
                            "element1": element_i.id,
                            "element2": element_j.id,
                            "similarity": float(similarity),
                            "severity": "medium",
                            "description": f"Similarité faible entre éléments de même catégorie: {element_i.name} et {element_j.name}"
                        })
                    
                    # Si deux éléments de catégories différentes ont une similarité très élevée
                    elif (element_i.category != element_j.category and 
                          similarity > 0.8):  # Seuil de similarité élevée
                        
                        inconsistencies.append({
                            "type": "high_similarity_different_category",
                            "element1": element_i.id,
                            "element2": element_j.id,
                            "similarity": float(similarity),
                            "severity": "low",
                            "description": f"Similarité élevée entre éléments de catégories différentes: {element_i.name} et {element_j.name}"
                        })
            
            # Détecter les éléments isolés (faible similarité avec tous les autres)
            for i, element in enumerate(elements):
                avg_similarity = np.mean([
                    similarity_matrix[i][j] for j in range(len(elements)) if i != j
                ])
                
                if avg_similarity < 0.2:  # Seuil d'isolement
                    inconsistencies.append({
                        "type": "isolated_element",
                        "element": element.id,
                        "avg_similarity": float(avg_similarity),
                        "severity": "high",
                        "description": f"Élément isolé sémantiquement: {element.name}"
                    })
            
            logger.info(f"✅ Détection incohérences: {len(inconsistencies)} trouvées")
            return inconsistencies
            
        except Exception as e:
            logger.error(f"❌ Erreur détection incohérences: {e}")
            return []
    
    def _generate_semantic_suggestions(
        self, 
        elements: List[EbiosElement], 
        result: SemanticAnalysisResult
    ) -> List[Dict[str, Any]]:
        """Génère des suggestions d'amélioration sémantique"""
        suggestions = []
        
        try:
            # Suggestions basées sur les clusters
            if result.clusters:
                for cluster in result.clusters:
                    if len(cluster["elements"]) == 1:
                        suggestions.append({
                            "type": "expand_cluster",
                            "priority": "medium",
                            "cluster_id": cluster["cluster_id"],
                            "suggestion": f"Considérez d'ajouter des éléments liés au thème '{cluster['theme']}'",
                            "rationale": "Cluster avec un seul élément détecté"
                        })
            
            # Suggestions basées sur les incohérences
            for inconsistency in result.inconsistencies:
                if inconsistency["type"] == "isolated_element":
                    suggestions.append({
                        "type": "clarify_element",
                        "priority": "high",
                        "element_id": inconsistency["element"],
                        "suggestion": "Clarifiez ou enrichissez la description de cet élément",
                        "rationale": "Élément sémantiquement isolé des autres"
                    })
                
                elif inconsistency["type"] == "low_similarity_same_category":
                    suggestions.append({
                        "type": "harmonize_category",
                        "priority": "medium",
                        "elements": [inconsistency["element1"], inconsistency["element2"]],
                        "suggestion": "Harmonisez le vocabulaire entre ces éléments de même catégorie",
                        "rationale": "Similarité sémantique faible dans la même catégorie"
                    })
            
            # Suggestions générales
            if len(elements) < 3:
                suggestions.append({
                    "type": "add_elements",
                    "priority": "low",
                    "suggestion": "Considérez d'ajouter plus d'éléments pour une analyse plus complète",
                    "rationale": "Nombre d'éléments insuffisant pour une analyse robuste"
                })
            
            logger.info(f"✅ Suggestions générées: {len(suggestions)}")
            return suggestions
            
        except Exception as e:
            logger.error(f"❌ Erreur génération suggestions: {e}")
            return []
    
    def _compute_coherence_score(
        self, 
        elements: List[EbiosElement], 
        result: SemanticAnalysisResult
    ) -> float:
        """Calcule un score de cohérence sémantique global"""
        if not elements:
            return 0.0
        
        try:
            scores = []
            
            # Score basé sur la similarité moyenne
            if result.similarity_matrix is not None and result.similarity_matrix.size > 0:
                # Exclure la diagonale (similarité avec soi-même)
                mask = ~np.eye(result.similarity_matrix.shape[0], dtype=bool)
                avg_similarity = np.mean(result.similarity_matrix[mask])
                scores.append(avg_similarity * 100)
            
            # Score basé sur les clusters
            if result.clusters:
                cluster_coherence = np.mean([cluster["coherence"] for cluster in result.clusters])
                scores.append(cluster_coherence * 100)
            
            # Pénalité pour les incohérences
            inconsistency_penalty = len(result.inconsistencies) * 5
            
            # Score final
            if scores:
                base_score = np.mean(scores)
                final_score = max(0, min(100, base_score - inconsistency_penalty))
            else:
                final_score = 50.0  # Score neutre par défaut
            
            return final_score
            
        except Exception as e:
            logger.error(f"❌ Erreur calcul score cohérence: {e}")
            return 50.0
    
    def _build_semantic_graph(
        self, 
        elements: List[EbiosElement], 
        result: SemanticAnalysisResult
    ) -> Optional[Dict[str, Any]]:
        """Construit un graphe sémantique des relations"""
        if not NETWORKX_AVAILABLE or not elements:
            return None
        
        try:
            G = nx.Graph()
            
            # Ajouter les nœuds
            for element in elements:
                G.add_node(element.id, 
                          name=element.name,
                          category=element.category,
                          semantic_score=element.semantic_score)
            
            # Ajouter les arêtes basées sur la similarité
            if result.similarity_matrix is not None:
                threshold = 0.5  # Seuil de similarité pour créer une arête
                
                for i, element_i in enumerate(elements):
                    for j, element_j in enumerate(elements[i+1:], i+1):
                        similarity = result.similarity_matrix[i][j]
                        
                        if similarity > threshold:
                            G.add_edge(element_i.id, element_j.id, 
                                     weight=float(similarity),
                                     similarity=float(similarity))
            
            # Calculer les métriques du graphe
            graph_metrics = {
                "nodes": G.number_of_nodes(),
                "edges": G.number_of_edges(),
                "density": nx.density(G),
                "connected_components": nx.number_connected_components(G)
            }
            
            # Convertir en format sérialisable
            graph_data = {
                "nodes": [
                    {
                        "id": node,
                        "name": G.nodes[node]["name"],
                        "category": G.nodes[node]["category"],
                        "semantic_score": G.nodes[node]["semantic_score"]
                    }
                    for node in G.nodes()
                ],
                "edges": [
                    {
                        "source": edge[0],
                        "target": edge[1],
                        "weight": G.edges[edge]["weight"],
                        "similarity": G.edges[edge]["similarity"]
                    }
                    for edge in G.edges()
                ],
                "metrics": graph_metrics
            }
            
            logger.info(f"✅ Graphe sémantique construit: {graph_metrics}")
            return graph_data
            
        except Exception as e:
            logger.error(f"❌ Erreur construction graphe: {e}")
            return None
    
    def _create_fallback_result(self, elements: List[Dict[str, Any]]) -> SemanticAnalysisResult:
        """Crée un résultat de fallback en cas d'erreur"""
        result = SemanticAnalysisResult()
        result.coherence_score = 50.0
        result.suggestions = [
            {
                "type": "fallback",
                "priority": "low",
                "suggestion": "Analyse sémantique de base disponible",
                "rationale": "Services avancés temporairement indisponibles"
            }
        ]
        return result
    
    def is_ready(self) -> bool:
        """Vérifie si l'analyseur est prêt"""
        return True  # Toujours prêt grâce au fallback
    
    def get_capabilities(self) -> Dict[str, bool]:
        """Retourne les capacités disponibles"""
        return {
            "transformers_available": TRANSFORMERS_AVAILABLE,
            "sklearn_available": SKLEARN_AVAILABLE,
            "networkx_available": NETWORKX_AVAILABLE,
            "model_loaded": self.sentence_model is not None,
            "semantic_analysis": True,
            "clustering": SKLEARN_AVAILABLE,
            "graph_analysis": NETWORKX_AVAILABLE
        }

# === FACTORY ===

class SemanticAnalyzerFactory:
    """Factory pour créer l'analyseur sémantique"""
    
    @staticmethod
    def create(model_name: str = "all-MiniLM-L6-v2") -> EbiosSemanticAnalyzer:
        """Crée l'analyseur sémantique de manière sécurisée"""
        try:
            analyzer = EbiosSemanticAnalyzer(model_name)
            logger.info("✅ Analyseur sémantique créé avec succès")
            return analyzer
        except Exception as e:
            logger.error(f"❌ Erreur création analyseur sémantique: {e}")
            # Retourner un analyseur minimal
            return EbiosSemanticAnalyzer()

# Export principal
__all__ = ['EbiosSemanticAnalyzer', 'SemanticAnalyzerFactory', 'SemanticAnalysisResult', 'EbiosElement']
