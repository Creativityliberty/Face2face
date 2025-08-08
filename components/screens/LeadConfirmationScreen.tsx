import React from 'react';
import { CheckCircle, User, Mail, Phone, Bell, ExternalLink, RotateCcw } from 'lucide-react';
import { Button } from '../ui/Button';

interface LeadConfirmationScreenProps {
  contactInfo: {
    name: string;
    email: string;
    phone: string;
    subscribed: boolean;
  };
  redirectUrl?: string; 
  onRestartQuiz: () => void;
}

export const LeadConfirmationScreen: React.FC<LeadConfirmationScreenProps> = ({
  contactInfo,
  redirectUrl,
  onRestartQuiz
}) => {
  
  const handleRedirect = () => {
    if (redirectUrl) {
      // Redirect in the same tab
      window.location.href = redirectUrl;
    } else {
      // Redirection par défaut si aucune URL configurée
      window.location.reload();
    }
  };

  // Automatic redirect after 3 seconds if a redirectUrl is provided
  React.useEffect(() => {
    if (!redirectUrl) return;
    const timer = setTimeout(() => {
      try {
        window.location.href = redirectUrl;
      } catch (e) {
        window.open(redirectUrl, '_blank');
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [redirectUrl]);
  return (
    <div className="w-full max-w-md mx-auto animate-slide-in text-center">
      {/* Success Icon */}
      <div className="mb-6">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Merci {contactInfo.name} ! 
        </h2>
        <p className="text-gray-600" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Votre inscription a été confirmée avec succès
        </p>
        {redirectUrl && (
          <p className="text-sm text-gray-500 mt-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Redirection automatique dans 3 secondes...
          </p>
        )}
      </div>

      {/* Confirmation Details */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Détails de votre inscription
        </h3>
        
        <div className="space-y-3 text-left">
          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-gray-500" />
            <span className="text-gray-700" style={{ fontFamily: 'Poppins, sans-serif' }}>
              {contactInfo.name}
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-gray-500" />
            <span className="text-gray-700" style={{ fontFamily: 'Poppins, sans-serif' }}>
              {contactInfo.email}
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            <Phone className="w-5 h-5 text-gray-500" />
            <span className="text-gray-700" style={{ fontFamily: 'Poppins, sans-serif' }}>
              {contactInfo.phone}
            </span>
          </div>
          
          {contactInfo.subscribed && (
            <div className="flex items-center gap-3 bg-green-50 p-2 rounded-lg">
              <Bell className="w-5 h-5 text-green-600" />
              <span className="text-green-700 text-sm" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Abonné aux notifications
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Next Steps */}
      <div className="bg-blue-50 rounded-xl p-6 mb-6">
          <div className="text-sm text-gray-600 mb-6">
            <p className="mb-2">
              <strong>Prochaines étapes :</strong>
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>Vous recevrez vos résultats personnalisés par email</li>
              <li>Consultez votre boîte de réception dans les prochaines minutes</li>
              <li>N'hésitez pas à recommencer le quiz pour explorer d'autres réponses</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleRedirect}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              <ExternalLink className="w-5 h-5" />
              {redirectUrl ? 'Continuer' : 'Terminer'}
            </button>
            
            <button
              onClick={onRestartQuiz}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              <RotateCcw className="w-5 h-5" />
              Recommencer le quiz
            </button>
          </div>
      </div>

      {/* Footer Message */}
      <p className="text-xs text-gray-500 mt-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
        Vous recevrez un email de confirmation dans les prochaines minutes.
        Si vous ne le voyez pas, vérifiez vos spams.
      </p>
    </div>
  );
};
