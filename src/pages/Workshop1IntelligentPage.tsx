/**
 * 🎯 PAGE WORKSHOP 1 INTELLIGENT
 * Wrapper pour l'interface intelligente Workshop 1 avec gestion du profil utilisateur
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, User, Settings, Zap, Brain, Users, Target } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Workshop1IntelligentInterface } from '../modules/training/presentation/components/Workshop1IntelligentInterface';
import { EbiosExpertProfile } from '../infrastructure/a2a/types/AgentCardTypes';

// 🎯 COMPOSANT PRINCIPAL

export const Workshop1IntelligentPage: React.FC = () => {
  const navigate = useNavigate();
  const { sessionId } = useParams();
  const { user } = useAuth();
  
  // 🎯 ÉTAT LOCAL
  const [userProfile, setUserProfile] = useState<EbiosExpertProfile | null>(null);
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [loading, setLoading] = useState(true);

  // 🔄 INITIALISATION DU PROFIL UTILISATEUR
  useEffect(() => {
    initializeUserProfile();
  }, [user]);

  const initializeUserProfile = async () => {
    try {
      setLoading(true);
      
      if (!user) {
        navigate('/login');
        return;
      }

      // Créer un profil par défaut basé sur l'utilisateur connecté
      const defaultProfile: EbiosExpertProfile = {
        id: user.uid,
        name: user.displayName || user.email || 'Utilisateur',
        role: 'Apprenant EBIOS RM',
        experience: {
          ebiosYears: 0,
          totalYears: 1,
          projectsCompleted: 0
        },
        specializations: ['basic_security'],
        certifications: [],
        sector: 'formation',
        organizationType: 'Formation',
        preferredComplexity: 'intermediate',
        learningStyle: 'guided'
      };

      // Vérifier s'il y a un profil sauvegardé
      const savedProfile = localStorage.getItem(`workshop1_profile_${user.uid}`);
      if (savedProfile) {
        try {
          const parsedProfile = JSON.parse(savedProfile);
          setUserProfile(parsedProfile);
        } catch (error) {
          console.warn('Erreur parsing profil sauvegardé:', error);
          setUserProfile(defaultProfile);
        }
      } else {
        setUserProfile(defaultProfile);
        setShowProfileSetup(true);
      }
      
    } catch (error) {
      console.error('Erreur initialisation profil:', error);
    } finally {
      setLoading(false);
    }
  };

  // 🎯 SAUVEGARDE DU PROFIL
  const saveUserProfile = (profile: EbiosExpertProfile) => {
    if (user) {
      localStorage.setItem(`workshop1_profile_${user.uid}`, JSON.stringify(profile));
      setUserProfile(profile);
      setShowProfileSetup(false);
    }
  };

  // 🎯 GESTION DES ÉVÉNEMENTS
  const handleComplete = () => {
    navigate('/training');
  };

  const handleModuleChange = (moduleId: string) => {
    console.log('Module changé:', moduleId);
  };

  // 🎯 RENDU DU SETUP DE PROFIL
  const renderProfileSetup = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* En-tête */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl">
          <h2 className="text-2xl font-bold mb-2">🎯 Configuration de votre profil</h2>
          <p className="text-blue-100">
            Personnalisez votre expérience d'apprentissage Workshop 1
          </p>
        </div>

        {/* Formulaire */}
        <div className="p-6">
          <ProfileSetupForm 
            initialProfile={userProfile!}
            onSave={saveUserProfile}
            onCancel={() => setShowProfileSetup(false)}
          />
        </div>
      </div>
    </div>
  );

  // 🎯 RENDU DE CHARGEMENT
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Initialisation du Workshop 1...</p>
        </div>
      </div>
    );
  }

  // 🎯 RENDU PRINCIPAL
  return (
    <div className="workshop1-intelligent-page">
      {/* Setup de profil */}
      {showProfileSetup && renderProfileSetup()}

      {/* En-tête */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/training')}
              className="flex items-center text-blue-100 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span className="text-sm">Retour Formation</span>
            </button>
            
            <div className="border-l border-blue-300 pl-4">
              <h1 className="text-2xl font-bold mb-1">
                🎯 Workshop 1 - Socle de Sécurité
              </h1>
              <p className="text-blue-100">
                Formation intelligente adaptée à votre niveau d'expertise
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowProfileSetup(true)}
              className="bg-white bg-opacity-20 text-white px-4 py-2 rounded-lg hover:bg-opacity-30 transition-colors flex items-center"
            >
              <User className="w-4 h-4 mr-2" />
              Profil
            </button>
            
            <button
              onClick={() => navigate('/training')}
              className="bg-white bg-opacity-20 text-white px-4 py-2 rounded-lg hover:bg-opacity-30 transition-colors flex items-center"
            >
              <Settings className="w-4 h-4 mr-2" />
              Paramètres
            </button>
          </div>
        </div>

        {/* Informations utilisateur */}
        {userProfile && (
          <div className="mt-4 bg-white bg-opacity-10 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">{userProfile.name}</h3>
                  <p className="text-blue-100 text-sm">{userProfile.role}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-6 text-sm">
                <div className="text-center">
                  <div className="font-semibold">{userProfile.experience.ebiosYears}</div>
                  <div className="text-blue-100">Années EBIOS</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold">{userProfile.specializations.length}</div>
                  <div className="text-blue-100">Spécialisations</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold">{userProfile.preferredComplexity}</div>
                  <div className="text-blue-100">Niveau</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Interface intelligente */}
      {userProfile && (
        <Workshop1IntelligentInterface
          userProfile={userProfile}
          onComplete={handleComplete}
          onModuleChange={handleModuleChange}
        />
      )}
    </div>
  );
};

// 🎯 COMPOSANT DE SETUP DE PROFIL

interface ProfileSetupFormProps {
  initialProfile: EbiosExpertProfile;
  onSave: (profile: EbiosExpertProfile) => void;
  onCancel: () => void;
}

const ProfileSetupForm: React.FC<ProfileSetupFormProps> = ({ 
  initialProfile, 
  onSave, 
  onCancel 
}) => {
  const [profile, setProfile] = useState<EbiosExpertProfile>(initialProfile);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(profile);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Informations de base */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nom complet
        </label>
        <input
          type="text"
          value={profile.name}
          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Rôle / Fonction
        </label>
        <input
          type="text"
          value={profile.role}
          onChange={(e) => setProfile({ ...profile, role: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Ex: RSSI, Analyste Cybersécurité, Consultant..."
        />
      </div>

      {/* Expérience */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Années d'expérience EBIOS RM
          </label>
          <select
            value={profile.experience.ebiosYears}
            onChange={(e) => setProfile({
              ...profile,
              experience: { ...profile.experience, ebiosYears: parseInt(e.target.value) }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value={0}>Débutant (0 an)</option>
            <option value={1}>1-2 ans</option>
            <option value={3}>3-5 ans</option>
            <option value={6}>6-10 ans</option>
            <option value={11}>Plus de 10 ans</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Niveau de complexité préféré
          </label>
          <select
            value={profile.preferredComplexity}
            onChange={(e) => setProfile({
              ...profile,
              preferredComplexity: e.target.value as 'junior' | 'intermediate' | 'senior' | 'expert'
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="junior">Junior - Guidage complet</option>
            <option value="intermediate">Intermédiaire - Équilibré</option>
            <option value="senior">Senior - Autonome</option>
            <option value="expert">Expert - Avancé</option>
          </select>
        </div>
      </div>

      {/* Secteur */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Secteur d'activité
        </label>
        <select
          value={profile.sector}
          onChange={(e) => setProfile({ ...profile, sector: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="formation">Formation</option>
          <option value="santé">Santé</option>
          <option value="finance">Finance</option>
          <option value="industrie">Industrie</option>
          <option value="éducation">Éducation</option>
          <option value="administration">Administration</option>
          <option value="conseil">Conseil</option>
          <option value="autre">Autre</option>
        </select>
      </div>

      {/* Style d'apprentissage */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Style d'apprentissage préféré
        </label>
        <div className="grid grid-cols-2 gap-3">
          {[
            { value: 'guided', label: 'Guidé', icon: Target, desc: 'Étapes structurées' },
            { value: 'analytical', label: 'Analytique', icon: Brain, desc: 'Analyse approfondie' },
            { value: 'collaborative', label: 'Collaboratif', icon: Users, desc: 'Échanges experts' },
            { value: 'interactive', label: 'Interactif', icon: Zap, desc: 'Pratique immédiate' }
          ].map((style) => (
            <label
              key={style.value}
              className={`
                flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all
                ${profile.learningStyle === style.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
                }
              `}
            >
              <input
                type="radio"
                name="learningStyle"
                value={style.value}
                checked={profile.learningStyle === style.value}
                onChange={(e) => setProfile({ ...profile, learningStyle: e.target.value as any })}
                className="sr-only"
              />
              <style.icon className="w-5 h-5 mr-3 text-blue-600" />
              <div>
                <div className="font-medium text-gray-900">{style.label}</div>
                <div className="text-sm text-gray-600">{style.desc}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex space-x-4 pt-4">
        <button
          type="submit"
          className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-medium"
        >
          Commencer Workshop 1
        </button>
        
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Annuler
        </button>
      </div>
    </form>
  );
};

export default Workshop1IntelligentPage;
