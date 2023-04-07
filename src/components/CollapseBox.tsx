import { PlusCircleTwoTone, ExclamationCircleFilled } from '@ant-design/icons';
import {
  Button,
  Divider,
  Input,
  InputRef,
  Space,
  Collapse,
} from 'antd';
import React, { useRef, useState } from 'react';
import styles from './CollapseBox.module.css';
import useMainStore from 'store';
import { shallow } from 'zustand/shallow';

const { Panel } = Collapse;

interface CollapseBoxProps {
  type: 'role' | 'state' | 'process';
  items: string[];
  useStyle?: any;
  addNew?: (type: string, color?: string, label?: string) => void;
}

const CollapseBox: React.FC<CollapseBoxProps> = ({
  items,
  addNew,
  useStyle = {},
  type,
}) => {
  const [name, setName] = useState('');
  const inputRef = useRef<InputRef>(null);
  const [activeRole, roleColors] = useMainStore(state => [state.activeRole, state.roleColors], shallow)

  const onDragStart = (event: any, nodeType: any) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const itemColor = () => {
    return roleColors[activeRole];
  }

  const addNewItem = (
    e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>
  ) => {
    e.preventDefault();
    addNew && addNew(type, '', name);
    setName('');
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  return (
    <Collapse accordion style={{ width: '100%', ...useStyle }} size={'small'} expandIconPosition='end'>
      <Panel header={'Add/Select State'} key="1">
        {items.map((item) => (
          <div
            className={styles.stateItem}
            style={{backgroundColor: itemColor()}}
            onMouseDown={(e) => {
              e.stopPropagation();
            }}
            draggable
            onDragStart={(event) => onDragStart(event, item)}
          >
            {item}
          </div>
        ))}
        <>
          <Divider style={{ margin: '8px 0' }} />
          <Space style={{ padding: '0 8px 4px' }}>
            <Input
              placeholder={`Add New ${type}`}
              ref={inputRef}
              value={name}
              onChange={onNameChange}
            />
              <Button
                shape={"circle"}
                type="text"
                disabled={!name.length}
                // danger={!name.length}
                icon={
                  !name.length ? (
                    <ExclamationCircleFilled
   
                      style={{ fontSize: '20px', color: 'red' }}
                    />
                  ) : (
                    <PlusCircleTwoTone style={{ fontSize: '20px' }} />
                  )
                }
                onClick={addNewItem}
              />
          </Space>
        </>
      </Panel>
    </Collapse>
  );
};

export default CollapseBox;
