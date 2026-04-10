import React, { createContext, useContext, useReducer } from 'react';

const OrderContext = createContext();

const orderReducer = (state, action) => {
  switch (action.type) {
    case 'SET_ACTIVE_ORDER':
      return { ...state, activeOrderId: action.payload };
    case 'ADD_TO_HISTORY':
      return { ...state, history: [...state.history, action.payload] };
    default:
      return state;
  }
};

export const OrderProvider = ({ children }) => {
  const [state, dispatch] = useReducer(orderReducer, { activeOrderId: null, history: [] });

  const setActiveOrder = (id) => dispatch({ type: 'SET_ACTIVE_ORDER', payload: id });
  const addToHistory = (order) => dispatch({ type: 'ADD_TO_HISTORY', payload: order });

  return (
    <OrderContext.Provider value={{ ...state, setActiveOrder, addToHistory }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => useContext(OrderContext);
