"""
📚 SERVICE RAG EBIOS RM AVANCÉ
RAG (Retrieval-Augmented Generation) avec LlamaIndex + Pinecone
Point 3.1 - Phase 3: RAG et Base de Connaissances
"""

import asyncio
import logging
import os
from datetime import datetime
from typing import Dict, List, Any, Optional, Tuple
import json

# === DÉSACTIVATION TEMPORAIRE RAG AVANCÉ ===
# LlamaIndex et Pinecone temporairement désactivés pour simplification
LLAMA_INDEX_AVAILABLE = False
PINECONE_AVAILABLE = False

logging.info("🔧 RAG avancé temporairement désactivé - Mode recherche simple activé")

# Classes de fallback pour compatibilité
class Response:
    def __init__(self):
        self.response = ""
        self.source_nodes = []

try:
    from sentence_transformers import SentenceTransformer
    SENTENCE_TRANSFORMERS_AVAILABLE = True
except ImportError:
    SENTENCE_TRANSFORMERS_AVAILABLE = False
    logging.warning("🔧 Sentence-Transformers non disponible pour RAG")

logger = logging.getLogger(__name__)

# === MODÈLES DE DONNÉES ===

class EbiosKnowledgeDocument:
    """Document de connaissance EBIOS RM"""
    def __init__(self):
        self.id = ""
        self.title = ""
        self.content = ""
        self.category = ""  # 'methodology', 'example', 'template', 'guide'
        self.source = ""
        self.metadata = {}
        self.embedding = None
        self.created_at = datetime.now()

class RAGQueryResult:
    """Résultat de requête RAG"""
    def __init__(self):
        self.query = ""
        self.response = ""
        self.confidence = 0.0
        self.sources = []
        self.retrieved_documents = []
        self.context_used = ""
        self.query_timestamp = datetime.now()

# === SERVICE RAG PRINCIPAL ===

class EbiosRAGService:
    """
    Service RAG pour expertise EBIOS RM
    Utilise LlamaIndex pour RAG + Pinecone pour base vectorielle
    """
    
    def __init__(self, config: Optional[Dict[str, Any]] = None):
        self.config = config or {}
        self.vector_index = None
        self.query_engine = None
        self.pinecone_client = None
        self.sentence_model = None
        self.knowledge_base = []
        self.index_name = "ebios-rag-knowledge"
        
        # Initialisation sécurisée
        self._initialize_safely()
    
    def _initialize_safely(self):
        """Initialisation sécurisée du service RAG"""
        logger.info("📚 Initialisation Service RAG EBIOS RM")
        
        # 1. Initialiser Sentence-Transformers pour embeddings
        if SENTENCE_TRANSFORMERS_AVAILABLE:
            self._setup_sentence_transformers()
        
        # 2. Initialiser Pinecone si disponible
        if PINECONE_AVAILABLE:
            self._setup_pinecone()
        
        # 3. Initialiser LlamaIndex
        if LLAMA_INDEX_AVAILABLE:
            self._setup_llama_index()
        
        # 4. Charger la base de connaissances EBIOS RM
        self._load_ebios_knowledge_base()
        
        logger.info(f"✅ Service RAG initialisé - LlamaIndex: {LLAMA_INDEX_AVAILABLE}, Pinecone: {PINECONE_AVAILABLE}")
    
    def _setup_sentence_transformers(self):
        """Configure Sentence-Transformers pour embeddings"""
        try:
            model_name = self.config.get('embedding_model', 'all-MiniLM-L6-v2')
            self.sentence_model = SentenceTransformer(model_name)
            logger.info(f"✅ Sentence-Transformers chargé: {model_name}")
        except Exception as e:
            logger.warning(f"⚠️ Erreur Sentence-Transformers: {e}")
            self.sentence_model = None
    
    def _setup_pinecone(self):
        """Configure Pinecone pour base vectorielle"""
        try:
            # Configuration Pinecone (nécessite une clé API)
            api_key = self.config.get('pinecone_api_key', os.getenv('PINECONE_API_KEY'))
            
            if api_key:
                self.pinecone_client = Pinecone(api_key=api_key)
                
                # Créer l'index si nécessaire
                if self.index_name not in [index.name for index in self.pinecone_client.list_indexes()]:
                    self.pinecone_client.create_index(
                        name=self.index_name,
                        dimension=384,  # Dimension pour all-MiniLM-L6-v2
                        metric='cosine',
                        spec=ServerlessSpec(cloud='aws', region='us-east-1')
                    )
                
                logger.info("✅ Pinecone configuré")
            else:
                logger.warning("⚠️ Clé API Pinecone manquante, mode local activé")
                
        except Exception as e:
            logger.warning(f"⚠️ Erreur Pinecone: {e}")
            self.pinecone_client = None
    
    def _setup_llama_index(self):
        """Configure LlamaIndex pour RAG - DÉSACTIVÉ TEMPORAIREMENT"""
        logger.info("🔧 LlamaIndex désactivé - Mode recherche simple utilisé")
    
    def _load_ebios_knowledge_base(self):
        """Charge la base de connaissances EBIOS RM"""
        # Base de connaissances EBIOS RM intégrée
        ebios_knowledge = [
            {
                "id": "ebios_methodology_overview",
                "title": "Méthodologie EBIOS Risk Manager",
                "content": """
                EBIOS Risk Manager est une méthode d'appréciation et de traitement des risques numériques.
                Elle comprend 5 ateliers :
                1. Atelier 1 : Cadrage et socle de sécurité
                2. Atelier 2 : Sources de risque
                3. Atelier 3 : Scénarios stratégiques
                4. Atelier 4 : Scénarios opérationnels
                5. Atelier 5 : Traitement du risque
                
                L'Atelier 1 définit les valeurs métier, biens essentiels, biens supports et événements redoutés.
                """,
                "category": "methodology",
                "source": "ANSSI - Guide EBIOS Risk Manager"
            },
            {
                "id": "business_values_definition",
                "title": "Définition des Valeurs Métier",
                "content": """
                Les valeurs métier représentent ce qui a de la valeur pour l'organisme et ses parties prenantes.
                Elles peuvent être :
                - Processus métier critiques
                - Missions de service public
                - Réputation et image de marque
                - Conformité réglementaire
                - Avantage concurrentiel
                
                Chaque valeur métier doit être décrite précisément avec ses critères de sécurité.
                """,
                "category": "guide",
                "source": "ANSSI - Guide EBIOS Risk Manager"
            },
            {
                "id": "essential_assets_definition",
                "title": "Définition des Biens Essentiels",
                "content": """
                Les biens essentiels sont les informations ou processus cruciaux pour l'organisme.
                Ils supportent directement les valeurs métier et peuvent être :
                - Informations (données personnelles, secrets industriels, etc.)
                - Processus (processus de production, de décision, etc.)
                - Savoir-faire (compétences clés, expertise, etc.)
                
                Chaque bien essentiel doit être lié à au moins une valeur métier.
                """,
                "category": "guide",
                "source": "ANSSI - Guide EBIOS Risk Manager"
            },
            {
                "id": "supporting_assets_definition",
                "title": "Définition des Biens Supports",
                "content": """
                Les biens supports sont les éléments du système d'information qui portent ou contribuent aux biens essentiels.
                Ils peuvent être :
                - Matériels (serveurs, postes de travail, équipements réseau)
                - Logiciels (systèmes d'exploitation, applications, bases de données)
                - Réseaux (LAN, WAN, Internet)
                - Personnel (utilisateurs, administrateurs)
                - Sites (locaux, centres de données)
                
                Chaque bien support doit être lié à au moins un bien essentiel.
                """,
                "category": "guide",
                "source": "ANSSI - Guide EBIOS Risk Manager"
            },
            {
                "id": "dreaded_events_definition",
                "title": "Définition des Événements Redoutés",
                "content": """
                Les événements redoutés sont les atteintes aux biens essentiels que l'organisme souhaite éviter.
                Ils se caractérisent par :
                - Le bien essentiel impacté
                - Le critère de sécurité affecté (Disponibilité, Intégrité, Confidentialité)
                - L'impact sur les valeurs métier
                - La gravité de l'impact
                
                Exemples : divulgation de données personnelles, altération de données comptables, indisponibilité du système de production.
                """,
                "category": "guide",
                "source": "ANSSI - Guide EBIOS Risk Manager"
            },
            {
                "id": "workshop1_best_practices",
                "title": "Bonnes Pratiques Atelier 1",
                "content": """
                Bonnes pratiques pour l'Atelier 1 EBIOS RM :
                
                1. Impliquer les bonnes parties prenantes (métier, technique, juridique)
                2. Partir des processus métier pour identifier les valeurs métier
                3. Être exhaustif dans l'identification des biens essentiels
                4. Maintenir la cohérence entre valeurs métier et biens essentiels
                5. Documenter précisément chaque élément
                6. Valider avec les responsables métier
                7. Réviser régulièrement le cadrage
                
                L'Atelier 1 est fondamental car il conditionne la qualité de toute l'analyse.
                """,
                "category": "example",
                "source": "Retours d'expérience EBIOS RM"
            }
        ]
        
        # Convertir en objets EbiosKnowledgeDocument
        for item in ebios_knowledge:
            doc = EbiosKnowledgeDocument()
            doc.id = item["id"]
            doc.title = item["title"]
            doc.content = item["content"]
            doc.category = item["category"]
            doc.source = item["source"]
            doc.metadata = {"length": len(item["content"])}
            
            self.knowledge_base.append(doc)
        
        logger.info(f"✅ Base de connaissances chargée: {len(self.knowledge_base)} documents")
    
    async def build_vector_index(self):
        """Construit l'index vectoriel pour RAG - MODE SIMPLIFIÉ"""
        logger.info("🔧 Index vectoriel désactivé - Mode recherche textuelle simple")

        # Marquer comme prêt pour la recherche simple
        self.vector_index = "simple_search_ready"
        self.query_engine = "simple_search_ready"

        return True
    
    async def query_ebios_knowledge(
        self, 
        query: str, 
        context: Optional[Dict[str, Any]] = None
    ) -> RAGQueryResult:
        """
        Interroge la base de connaissances EBIOS RM
        """
        logger.info(f"📚 Requête RAG: {query[:50]}...")
        
        result = RAGQueryResult()
        result.query = query
        
        try:
            # Mode recherche simple uniquement (RAG avancé désactivé)
            response = await self._query_with_similarity_search(query, context)
            result.response = response["response"]
            result.confidence = response["confidence"]
            result.sources = response["sources"]
            result.context_used = response["context"]
            
            logger.info(f"✅ Requête RAG traitée - Confiance: {result.confidence:.2f}")
            return result
            
        except Exception as e:
            logger.error(f"❌ Erreur requête RAG: {e}")
            return self._create_fallback_response(query)
    
    async def _query_with_llama_index(
        self,
        query: str,
        context: Optional[Dict[str, Any]]
    ) -> Any:
        """Requête avec LlamaIndex RAG"""
        # Enrichir la requête avec le contexte
        enriched_query = query
        if context:
            current_step = context.get('current_step', '')
            if current_step:
                enriched_query = f"Dans le contexte de l'étape '{current_step}' d'EBIOS RM: {query}"
        
        # Exécuter la requête RAG
        response = self.query_engine.query(enriched_query)
        return response
    
    async def _query_with_similarity_search(
        self, 
        query: str, 
        context: Optional[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """Recherche par similarité simple (fallback)"""
        # Recherche simple par mots-clés
        query_lower = query.lower()
        relevant_docs = []
        
        for doc in self.knowledge_base:
            score = 0
            content_lower = doc.content.lower()
            title_lower = doc.title.lower()
            
            # Score basé sur la présence de mots-clés
            query_words = query_lower.split()
            for word in query_words:
                if len(word) > 3:  # Ignorer les mots trop courts
                    if word in title_lower:
                        score += 3  # Poids élevé pour le titre
                    if word in content_lower:
                        score += 1  # Poids normal pour le contenu
            
            if score > 0:
                relevant_docs.append((doc, score))
        
        # Trier par score décroissant
        relevant_docs.sort(key=lambda x: x[1], reverse=True)
        
        if relevant_docs:
            # Prendre les 2 meilleurs documents
            best_docs = relevant_docs[:2]
            
            # Construire la réponse
            response_parts = []
            sources = []
            
            for doc, score in best_docs:
                response_parts.append(f"**{doc.title}**\n{doc.content[:300]}...")
                sources.append({
                    "title": doc.title,
                    "source": doc.source,
                    "category": doc.category,
                    "relevance_score": score
                })
            
            response = {
                "response": "\n\n".join(response_parts),
                "confidence": min(0.7, best_docs[0][1] / 10),  # Confiance basée sur le score
                "sources": sources,
                "context": f"Recherche par similarité - {len(best_docs)} documents trouvés"
            }
        else:
            response = {
                "response": "Aucun document pertinent trouvé dans la base de connaissances EBIOS RM.",
                "confidence": 0.1,
                "sources": [],
                "context": "Aucun résultat de recherche"
            }
        
        return response
    
    def _extract_sources_from_response(self, response: Any) -> List[Dict[str, Any]]:
        """Extrait les sources de la réponse LlamaIndex"""
        sources = []
        
        try:
            if hasattr(response, 'source_nodes'):
                for node in response.source_nodes:
                    if hasattr(node, 'metadata'):
                        sources.append({
                            "title": node.metadata.get("title", "Document sans titre"),
                            "source": node.metadata.get("source", "Source inconnue"),
                            "category": node.metadata.get("category", "Non catégorisé"),
                            "score": getattr(node, 'score', 0.0)
                        })
        except Exception as e:
            logger.warning(f"⚠️ Erreur extraction sources: {e}")
        
        return sources
    
    def _create_fallback_response(self, query: str) -> RAGQueryResult:
        """Crée une réponse de fallback"""
        result = RAGQueryResult()
        result.query = query
        result.response = "Service RAG temporairement indisponible. Consultez la documentation EBIOS RM officielle."
        result.confidence = 0.1
        result.sources = []
        result.context_used = "Réponse de fallback"
        
        return result
    
    async def add_knowledge_document(self, document: EbiosKnowledgeDocument) -> bool:
        """Ajoute un document à la base de connaissances"""
        try:
            self.knowledge_base.append(document)
            
            # Reconstruire l'index si nécessaire
            if self.vector_index and LLAMA_INDEX_AVAILABLE:
                await self.build_vector_index()
            
            logger.info(f"✅ Document ajouté: {document.title}")
            return True
            
        except Exception as e:
            logger.error(f"❌ Erreur ajout document: {e}")
            return False
    
    def is_ready(self) -> bool:
        """Vérifie si le service RAG est prêt"""
        return len(self.knowledge_base) > 0
    
    def get_capabilities(self) -> Dict[str, bool]:
        """Retourne les capacités disponibles"""
        return {
            "llama_index_available": False,  # Temporairement désactivé
            "pinecone_available": False,     # Temporairement désactivé
            "sentence_transformers_available": SENTENCE_TRANSFORMERS_AVAILABLE,
            "vector_index_ready": self.vector_index is not None,
            "query_engine_ready": self.query_engine is not None,
            "knowledge_base_loaded": len(self.knowledge_base) > 0,
            "rag_enabled": True,             # RAG simple activé
            "simple_search_mode": True       # Mode recherche simple
        }
    
    def get_knowledge_stats(self) -> Dict[str, Any]:
        """Retourne les statistiques de la base de connaissances"""
        categories = {}
        total_content_length = 0
        
        for doc in self.knowledge_base:
            categories[doc.category] = categories.get(doc.category, 0) + 1
            total_content_length += len(doc.content)
        
        return {
            "total_documents": len(self.knowledge_base),
            "categories": categories,
            "average_content_length": total_content_length // len(self.knowledge_base) if self.knowledge_base else 0,
            "total_content_length": total_content_length
        }

# === FACTORY ===

class EbiosRAGServiceFactory:
    """Factory pour créer le service RAG"""
    
    @staticmethod
    def create(config: Optional[Dict[str, Any]] = None) -> EbiosRAGService:
        """Crée le service RAG de manière sécurisée"""
        try:
            service = EbiosRAGService(config)
            logger.info("✅ Service RAG EBIOS RM créé avec succès")
            return service
        except Exception as e:
            logger.error(f"❌ Erreur création service RAG: {e}")
            return EbiosRAGService({})

# Export principal
__all__ = ['EbiosRAGService', 'EbiosRAGServiceFactory', 'RAGQueryResult', 'EbiosKnowledgeDocument']
