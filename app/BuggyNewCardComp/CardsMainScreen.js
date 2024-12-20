import React, { useEffect, useState } from 'react';
import CheckboxCard from './CheckboxCard';
import TextCard from './TextCard';
import NumberCard from './TextCard';  // Ensure correct import
import DropdownCard from './DropdownCard';
import FileCard from './FileCard';
import DocumentCard from './DocumentCard';

import { usePermissions } from '../GlobalVariables/PermissionsContext';

const CardRenderer = ({ item, onUpdateSuccess }) => {
  const [isEditable, setIsEditable] = useState(false);
  const { ppmAsstPermissions } = usePermissions();

  useEffect(() => {
    if (ppmAsstPermissions.some((permission) => permission.includes('U'))) {
      setIsEditable(true);
    }
  }, [ppmAsstPermissions]);

  const renderCard = () => {
    switch (item.type) {
      case 'checkbox':
        return <CheckboxCard item={item} onUpdate={onUpdateSuccess} editable={isEditable} />;
      case 'text':
        return <TextCard item={item} onUpdate={onUpdateSuccess} editable={isEditable} />;
      case 'number':
        return <NumberCard item={item} onUpdate={onUpdateSuccess} editable={isEditable} />;
      case 'dropdown':
        return <DropdownCard item={item} onUpdate={onUpdateSuccess} editable={isEditable} />;
      case 'file':
        return <FileCard item={item} onUpdate={onUpdateSuccess} editable={isEditable} />;
      case 'document':
        return <DocumentCard item={item} onUpdate={onUpdateSuccess} editable={isEditable} />;
      default:
        return <Text>Unsupported card type: {item.type}</Text>;
    }
  };

  return <>{renderCard()}</>;
};

export default CardRenderer;
