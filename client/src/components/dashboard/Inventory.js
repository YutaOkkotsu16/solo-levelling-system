// client/src/components/dashboard/Inventory.js
import React, { useContext, useState } from 'react';
import { SystemContext } from '../../contexts/SystemContext';

const Inventory = ({ showNotification }) => {
  const { items, addItem, updateItemQuantity, deleteItem } = useContext(SystemContext);
  const [showNewItemForm, setShowNewItemForm] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    icon: '📦',
    quantity: 1
  });
  
  // Available icons for items
  const availableIcons = [
    '📦', '📚', '💪', '🧠', '⚡', '🔋', '🎯', '🧪', 
    '📊', '🔮', '🛡️', '🧭', '📈', '🔬', '📝'
  ];
  
  // Handle input change for new item form
  const handleInputChange = (e) => {
    setNewItem({
      ...newItem,
      [e.target.name]: e.target.value
    });
  };
  
  // Handle icon selection
  const handleIconSelect = (icon) => {
    setNewItem({
      ...newItem,
      icon
    });
  };
  
  // Handle form submission for new item
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate inputs
    if (!newItem.name) {
      showNotification('Please provide an item name', 'error');
      return;
    }
    
    const result = await addItem(newItem);
    
    if (result.success) {
      // Reset form and hide it
      setNewItem({
        name: '',
        icon: '📦',
        quantity: 1
      });
      setShowNewItemForm(false);
      showNotification('New item added!');
    } else {
      showNotification('Error adding item!', 'error');
    }
  };
  
  // Handle item deletion
  const handleDeleteItem = async (itemId) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      const result = await deleteItem(itemId);
      
      if (result.success) {
        showNotification('Item deleted!');
      } else {
        showNotification('Error deleting item!', 'error');
      }
    }
  };
  
  return (
    <div>
      <div className="inventory-grid">
        {items.map(item => (
          <div key={item._id} className="inventory-item">
            <div className="item-icon">{item.icon}</div>
            <div className="item-name">{item.name}</div>
            <div className="item-quantity">x{item.quantity}</div>
            <div className="item-actions">
              <button 
                className="button small-button delete-button" 
                onClick={() => handleDeleteItem(item._id)}
              >
                &times;
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {showNewItemForm ? (
        <div className="new-item-form">
          <h3>Add New Item</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Item Name</label>
              <input
                type="text"
                name="name"
                value={newItem.name}
                onChange={handleInputChange}
                className="form-input"
                placeholder="e.g. Knowledge Crystal"
              />
            </div>
            
            <div className="form-group">
              <label>Icon</label>
              <div className="icon-selector">
                {availableIcons.map((icon, index) => (
                  <div 
                    key={index}
                    className={`icon-option ${newItem.icon === icon ? 'selected' : ''}`}
                    onClick={() => handleIconSelect(icon)}
                  >
                    {icon}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="form-group">
              <label>Quantity</label>
              <input
                type="number"
                name="quantity"
                value={newItem.quantity}
                onChange={handleInputChange}
                className="form-input"
                min="1"
                max="99"
              />
            </div>
            
            <div className="form-actions">
              <button type="submit" className="button">ADD ITEM</button>
              <button 
                type="button" 
                className="button cancel-button"
                onClick={() => setShowNewItemForm(false)}
              >
                CANCEL
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div style={{ marginTop: '20px' }}>
          <button 
            className="button" 
            onClick={() => setShowNewItemForm(true)}
          >
            ADD ITEM
          </button>
        </div>
      )}
    </div>
  );
};

export default Inventory;
