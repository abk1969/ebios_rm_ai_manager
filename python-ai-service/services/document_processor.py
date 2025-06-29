"""
📄 SERVICE DE TRAITEMENT DE DOCUMENTS
Traitement de documents avec Docling pour enrichir la base de connaissances
Point 3.2 - Phase 3: RAG et Base de Connaissances
"""

import asyncio
import logging
import os
from datetime import datetime
from typing import Dict, List, Any, Optional, Union
import json
from pathlib import Path

# === DÉSACTIVATION TEMPORAIRE DOCLING ===
# Docling temporairement désactivé pour simplification
DOCLING_AVAILABLE = False
logging.info("🔧 Docling temporairement désactivé - Mode traitement simple activé")

try:
    from ebios_rag_service import EbiosKnowledgeDocument, EbiosRAGServiceFactory
    RAG_SERVICE_AVAILABLE = True
except ImportError:
    RAG_SERVICE_AVAILABLE = False
    logging.warning("🔧 Service RAG non disponible")

logger = logging.getLogger(__name__)

# === MODÈLES DE DONNÉES ===

class DocumentProcessingResult:
    """Résultat du traitement d'un document"""
    def __init__(self):
        self.success = False
        self.document_id = ""
        self.title = ""
        self.content = ""
        self.metadata = {}
        self.extracted_sections = []
        self.processing_time = 0.0
        self.error_message = ""
        self.timestamp = datetime.now()

class DocumentSection:
    """Section extraite d'un document"""
    def __init__(self):
        self.title = ""
        self.content = ""
        self.level = 0  # Niveau hiérarchique
        self.page_number = 0
        self.section_type = ""  # 'heading', 'paragraph', 'table', 'list'

# === SERVICE PRINCIPAL ===

class DocumentProcessor:
    """
    Service de traitement de documents pour EBIOS RM
    Utilise Docling pour extraire et structurer le contenu
    """
    
    def __init__(self, config: Optional[Dict[str, Any]] = None):
        self.config = config or {}
        self.converter = None
        self.rag_service = None
        self.supported_formats = ['.pdf', '.docx', '.txt', '.md']
        self.processed_documents = {}
        
        # Initialisation sécurisée
        self._initialize_safely()
    
    def _initialize_safely(self):
        """Initialisation sécurisée du processeur de documents"""
        logger.info("📄 Initialisation Processeur de Documents")
        
        # 1. Initialiser Docling si disponible
        if DOCLING_AVAILABLE:
            self._setup_docling()
        
        # 2. Initialiser le service RAG si disponible
        if RAG_SERVICE_AVAILABLE:
            self._setup_rag_integration()
        
        logger.info(f"✅ Processeur initialisé - Docling: {DOCLING_AVAILABLE}, RAG: {RAG_SERVICE_AVAILABLE}")
    
    def _setup_docling(self):
        """Configure Docling pour le traitement de documents"""
        try:
            # Initialiser le convertisseur Docling
            self.converter = DocumentConverter()
            logger.info("✅ Docling configuré")
        except Exception as e:
            logger.warning(f"⚠️ Erreur configuration Docling: {e}")
            self.converter = None
    
    def _setup_rag_integration(self):
        """Configure l'intégration avec le service RAG"""
        try:
            self.rag_service = EbiosRAGServiceFactory.create()
            logger.info("✅ Intégration RAG configurée")
        except Exception as e:
            logger.warning(f"⚠️ Erreur intégration RAG: {e}")
            self.rag_service = None
    
    async def process_document(
        self, 
        file_path: str, 
        document_category: str = "guide",
        auto_add_to_rag: bool = True
    ) -> DocumentProcessingResult:
        """
        Traite un document et l'ajoute optionnellement à la base RAG
        """
        logger.info(f"📄 Traitement document: {file_path}")
        
        result = DocumentProcessingResult()
        start_time = datetime.now()
        
        try:
            # Vérifier que le fichier existe
            if not os.path.exists(file_path):
                result.error_message = f"Fichier non trouvé: {file_path}"
                return result
            
            # Vérifier le format supporté
            file_extension = Path(file_path).suffix.lower()
            if file_extension not in self.supported_formats:
                result.error_message = f"Format non supporté: {file_extension}"
                return result
            
            # Traiter selon la disponibilité de Docling
            if self.converter and DOCLING_AVAILABLE:
                processed_doc = await self._process_with_docling(file_path)
            else:
                processed_doc = await self._process_with_fallback(file_path)
            
            # Remplir le résultat
            result.success = True
            result.document_id = processed_doc["id"]
            result.title = processed_doc["title"]
            result.content = processed_doc["content"]
            result.metadata = processed_doc["metadata"]
            result.extracted_sections = processed_doc["sections"]
            
            # Calculer le temps de traitement
            result.processing_time = (datetime.now() - start_time).total_seconds()
            
            # Ajouter à la base RAG si demandé
            if auto_add_to_rag and self.rag_service:
                await self._add_to_rag_knowledge_base(processed_doc, document_category)
            
            # Sauvegarder dans le cache
            self.processed_documents[result.document_id] = result
            
            logger.info(f"✅ Document traité: {result.title} ({result.processing_time:.2f}s)")
            return result
            
        except Exception as e:
            result.error_message = str(e)
            result.processing_time = (datetime.now() - start_time).total_seconds()
            logger.error(f"❌ Erreur traitement document: {e}")
            return result
    
    async def _process_with_docling(self, file_path: str) -> Dict[str, Any]:
        """Traite un document avec Docling"""
        try:
            # Convertir le document
            conversion_result = self.converter.convert(file_path)
            
            # Extraire le contenu principal
            document = conversion_result.document
            
            # Extraire le titre
            title = self._extract_title_from_docling(document)
            
            # Extraire le contenu textuel
            content = document.export_to_text()
            
            # Extraire les sections structurées
            sections = self._extract_sections_from_docling(document)
            
            # Métadonnées
            metadata = {
                "file_path": file_path,
                "file_size": os.path.getsize(file_path),
                "processing_method": "docling",
                "sections_count": len(sections),
                "content_length": len(content)
            }
            
            return {
                "id": f"doc_{datetime.now().timestamp()}",
                "title": title,
                "content": content,
                "sections": sections,
                "metadata": metadata
            }
            
        except Exception as e:
            logger.error(f"❌ Erreur Docling: {e}")
            # Fallback en cas d'erreur
            return await self._process_with_fallback(file_path)
    
    def _extract_title_from_docling(self, document) -> str:
        """Extrait le titre du document Docling"""
        try:
            # Chercher le premier titre de niveau 1
            for item in document.body.children:
                if hasattr(item, 'label') and item.label == 'title':
                    return item.text
                elif hasattr(item, 'text') and len(item.text) < 100:
                    # Premier texte court comme titre potentiel
                    return item.text
            
            # Fallback : nom du fichier
            return "Document sans titre"
            
        except Exception as e:
            logger.warning(f"⚠️ Erreur extraction titre: {e}")
            return "Document sans titre"
    
    def _extract_sections_from_docling(self, document) -> List[DocumentSection]:
        """Extrait les sections structurées du document Docling"""
        sections = []
        
        try:
            current_section = None
            
            for item in document.body.children:
                section = DocumentSection()
                
                if hasattr(item, 'label'):
                    if item.label in ['title', 'heading']:
                        section.title = item.text
                        section.content = ""
                        section.section_type = "heading"
                        section.level = getattr(item, 'level', 1)
                        current_section = section
                        sections.append(section)
                    
                    elif item.label == 'paragraph':
                        if current_section:
                            current_section.content += f"\n{item.text}"
                        else:
                            section.title = "Contenu"
                            section.content = item.text
                            section.section_type = "paragraph"
                            sections.append(section)
                    
                    elif item.label == 'table':
                        section.title = "Tableau"
                        section.content = str(item)  # Conversion basique
                        section.section_type = "table"
                        sections.append(section)
            
        except Exception as e:
            logger.warning(f"⚠️ Erreur extraction sections: {e}")
        
        return sections
    
    async def _process_with_fallback(self, file_path: str) -> Dict[str, Any]:
        """Traite un document avec méthode de fallback"""
        try:
            file_extension = Path(file_path).suffix.lower()
            
            if file_extension == '.txt':
                content = await self._process_text_file(file_path)
            elif file_extension == '.md':
                content = await self._process_markdown_file(file_path)
            else:
                # Pour PDF et DOCX, extraction basique
                content = await self._process_binary_file_fallback(file_path)
            
            # Titre basé sur le nom du fichier
            title = Path(file_path).stem.replace('_', ' ').replace('-', ' ').title()
            
            # Sections basiques
            sections = self._create_basic_sections(content)
            
            # Métadonnées
            metadata = {
                "file_path": file_path,
                "file_size": os.path.getsize(file_path),
                "processing_method": "fallback",
                "sections_count": len(sections),
                "content_length": len(content)
            }
            
            return {
                "id": f"doc_fallback_{datetime.now().timestamp()}",
                "title": title,
                "content": content,
                "sections": sections,
                "metadata": metadata
            }
            
        except Exception as e:
            logger.error(f"❌ Erreur traitement fallback: {e}")
            raise
    
    async def _process_text_file(self, file_path: str) -> str:
        """Traite un fichier texte"""
        with open(file_path, 'r', encoding='utf-8') as f:
            return f.read()
    
    async def _process_markdown_file(self, file_path: str) -> str:
        """Traite un fichier Markdown"""
        with open(file_path, 'r', encoding='utf-8') as f:
            return f.read()
    
    async def _process_binary_file_fallback(self, file_path: str) -> str:
        """Traitement fallback pour fichiers binaires"""
        # Pour les fichiers PDF/DOCX sans Docling, retourner un placeholder
        return f"Contenu du document {Path(file_path).name} - Traitement avancé nécessite Docling"
    
    def _create_basic_sections(self, content: str) -> List[DocumentSection]:
        """Crée des sections basiques à partir du contenu"""
        sections = []
        
        # Diviser le contenu en paragraphes
        paragraphs = content.split('\n\n')
        
        for i, paragraph in enumerate(paragraphs):
            if paragraph.strip():
                section = DocumentSection()
                section.title = f"Section {i+1}"
                section.content = paragraph.strip()
                section.section_type = "paragraph"
                section.level = 1
                sections.append(section)
        
        return sections
    
    async def _add_to_rag_knowledge_base(
        self, 
        processed_doc: Dict[str, Any], 
        category: str
    ):
        """Ajoute le document traité à la base de connaissances RAG"""
        try:
            # Créer un document de connaissance
            knowledge_doc = EbiosKnowledgeDocument()
            knowledge_doc.id = processed_doc["id"]
            knowledge_doc.title = processed_doc["title"]
            knowledge_doc.content = processed_doc["content"]
            knowledge_doc.category = category
            knowledge_doc.source = f"Document traité: {processed_doc['metadata']['file_path']}"
            knowledge_doc.metadata = processed_doc["metadata"]
            
            # Ajouter au service RAG
            success = await self.rag_service.add_knowledge_document(knowledge_doc)
            
            if success:
                logger.info(f"✅ Document ajouté à la base RAG: {knowledge_doc.title}")
            else:
                logger.warning(f"⚠️ Échec ajout RAG: {knowledge_doc.title}")
                
        except Exception as e:
            logger.error(f"❌ Erreur ajout RAG: {e}")
    
    async def process_directory(
        self, 
        directory_path: str, 
        recursive: bool = True,
        category: str = "guide"
    ) -> List[DocumentProcessingResult]:
        """Traite tous les documents d'un répertoire"""
        results = []
        
        try:
            path = Path(directory_path)
            
            if recursive:
                pattern = "**/*"
            else:
                pattern = "*"
            
            for file_path in path.glob(pattern):
                if file_path.is_file() and file_path.suffix.lower() in self.supported_formats:
                    result = await self.process_document(str(file_path), category)
                    results.append(result)
            
            logger.info(f"✅ Répertoire traité: {len(results)} documents")
            return results
            
        except Exception as e:
            logger.error(f"❌ Erreur traitement répertoire: {e}")
            return results
    
    def get_processing_stats(self) -> Dict[str, Any]:
        """Retourne les statistiques de traitement"""
        total_docs = len(self.processed_documents)
        successful_docs = sum(1 for result in self.processed_documents.values() if result.success)
        
        if total_docs > 0:
            avg_processing_time = sum(
                result.processing_time for result in self.processed_documents.values()
            ) / total_docs
        else:
            avg_processing_time = 0
        
        return {
            "total_documents_processed": total_docs,
            "successful_processing": successful_docs,
            "failed_processing": total_docs - successful_docs,
            "success_rate": (successful_docs / total_docs * 100) if total_docs > 0 else 0,
            "average_processing_time": avg_processing_time,
            "supported_formats": self.supported_formats
        }
    
    def is_ready(self) -> bool:
        """Vérifie si le processeur est prêt"""
        return True  # Toujours prêt grâce au fallback
    
    def get_capabilities(self) -> Dict[str, bool]:
        """Retourne les capacités disponibles"""
        return {
            "docling_available": False,      # Temporairement désactivé
            "rag_integration": RAG_SERVICE_AVAILABLE,
            "converter_ready": False,        # Temporairement désactivé
            "text_processing": True,
            "markdown_processing": True,
            "pdf_processing": False,         # Temporairement désactivé
            "docx_processing": False,        # Temporairement désactivé
            "batch_processing": True,
            "simple_mode": True              # Mode simple activé
        }

# === FACTORY ===

class DocumentProcessorFactory:
    """Factory pour créer le processeur de documents"""
    
    @staticmethod
    def create(config: Optional[Dict[str, Any]] = None) -> DocumentProcessor:
        """Crée le processeur de documents de manière sécurisée"""
        try:
            processor = DocumentProcessor(config)
            logger.info("✅ Processeur de documents créé avec succès")
            return processor
        except Exception as e:
            logger.error(f"❌ Erreur création processeur: {e}")
            return DocumentProcessor({})

# Export principal
__all__ = ['DocumentProcessor', 'DocumentProcessorFactory', 'DocumentProcessingResult', 'DocumentSection']
