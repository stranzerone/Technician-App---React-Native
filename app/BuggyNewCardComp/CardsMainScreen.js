import React from 'react';
import CheckboxCard from './CheckboxCard';
import TextCard from './TextCard';
import NumberCard from './TextCard';
import DropdownCard from './DropdownCard';
import FileCard from './FileCard';
import DocumentCard from './DocumentCard';

const CardRenderer = ({ item, onUpdate }) => {
  const renderCard = () => {
    switch (item.type) {
      case 'checkbox':
        return <CheckboxCard item={item} onUpdate={onUpdate} />;
      case 'text':
        return <TextCard item={item} onUpdate={onUpdate} />;
      case 'number':
        return <NumberCard item={item} onUpdate={onUpdate} />;
      case 'dropdown':
        return <DropdownCard item={item} onUpdate={onUpdate} />;
      case 'file':
        return <FileCard item={item} onUpdate={onUpdate} />;
      case 'document':
        return <DocumentCard item={item} onUpdate={onUpdate} />;
      default:
        return <Text>Unsupported card type: {item.type}</Text>;
    }
  };

  return <>{renderCard()}</>;
};

export default CardRenderer;
