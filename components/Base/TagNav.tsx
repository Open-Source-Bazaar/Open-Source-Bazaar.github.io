import { FC } from 'react';
import { Badge } from 'react-bootstrap';

export interface TagNavProps {
  list: string[];
  onCheck?: (item: string) => void;
}

export const TagNav: FC<TagNavProps> = ({ list, onCheck }) => (
  <div className="d-flex flex-wrap gap-2">
    {list.map(item => (
      <Badge 
        key={item} 
        bg="secondary" 
        className={onCheck ? "cursor-pointer" : ""}
        onClick={() => onCheck?.(item)}
      >
        {item}
      </Badge>
    ))}
  </div>
);