import React from 'react';
import ModuleView from './ModuleView';

interface PlaceholderModuleProps {
  onBack: () => void;
  title: string;
  onComplete: () => void; // Keep for type consistency
}

const PlaceholderModule: React.FC<PlaceholderModuleProps> = ({ onBack, title, onComplete }) => {
  // Call onComplete immediately for placeholder modules so they don't block progress
  React.useEffect(() => {
    onComplete();
  }, [onComplete]);

  return (
    <ModuleView title={title} onBack={onBack}>
      <div className="text-center p-8">
        <h3 className="text-2xl font-bold text-brand-dark-blue mb-4">בקרוב...</h3>
        <p className="text-lg text-brand-dark-blue/80">
          תוכן המודול הזה נמצא כעת בפיתוח וישוחרר בקרוב.
        </p>
      </div>
    </ModuleView>
  );
};

export default PlaceholderModule;