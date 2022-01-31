import React, { createContext, useReducer } from "react";
import AppReducer from './AppReducer'
import axios from 'axios';

// Inital state
const initialState = {
    transactions: [],
    error: null,
    loading: true
}

// Create context
export const GlobalContext = createContext(initialState)

// Provider Component 
export const GlobalProvider = ({ children }) => {
    const [state, dispatch] = useReducer(AppReducer, initialState)

    // Actions
    // New Action - GET
    async function getTransactions() {
        try {
            const res = await axios.get('/api/v1/transactions');

            dispatch({
                type: "GET_TRANSACTION",
                payload: res.data.data
            });
        } catch (error) {
            dispatch({
                type: "TRANSACTION_ERROR",
                payload: error.response.data.error
            })
        }
    }

    async function deleteTransaction(id) {
        try {
            await axios.delete(`/api/v1/transactions/${id}`);

            dispatch({
                type: 'DELETE_TRANSACTION',
                payload: id
            })
        } catch (error) {
            dispatch({
                type: "TRANSACTION_ERROR",
                payload: error.response.data.error
            })
        }
    }

    // Actions
    async function addTransaction(transaction) {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        try {
            const res = await axios.post('/api/v1/transactions/', transaction, config);
            
            dispatch({
                type: 'ADD_TRANSACTION',
                payload: res.data.data
            });        
        } catch (error) {
            dispatch({
                type: "TRANSACTION_ERROR",
                payload: error.response.data.error
            })
        }
    }
    
    return (<GlobalContext.Provider value={{
        transactions:state.transactions,
        error: state.error,
        loading: state.loading,
        getTransactions,
        deleteTransaction,
        addTransaction
    }}>
        {children}
    </GlobalContext.Provider>);
}