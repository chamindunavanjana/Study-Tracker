'use client';
import axios from 'axios';
import React, { createContext, useEffect, useState, useContext } from 'react';
import { useUserContext } from '../context/userContext.js';
import toast from 'react-hot-toast';

const TimetableContext = createContext();
const serverUrl = 'http://localhost:8000';

export const TimetableProvider = ({ children }) => {
    const userID = useUserContext().user._id;

    const [timetables, setTimetable] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch all timetable entries
    const getTimetable = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${serverUrl}/api/timetable`);
            setTimetable(res.data.timetables);
        } catch (error) {
            console.error('Error fetching timetables:', error);
            toast.error('Failed to fetch timetables.');
        } finally {
            setLoading(false);
        }
    };

    // Create a new timetable entry
    const createTimetable = async (timetable) => {
        setLoading(true);
        try {
            const res = await axios.post(`${serverUrl}/api/timetable/create`, timetable);
            setTimetable((prevTimetables) => [...prevTimetables, res.data]);
            toast.success('Timetable entry created successfully');
        } catch (error) {
            console.error('Error creating timetable:', error);
            toast.error('Failed to create timetable entry.');
        } finally {
            setLoading(false);
        }
    };

    // Delete a timetable entry
    const deleteTimetable = async (id) => {
        setLoading(true);
        try {
            await axios.delete(`${serverUrl}/api/timetable/${id}`);
            setTimetable((prevTimetables) =>
                prevTimetables.filter((timetable) => timetable._id !== id)
            );
            toast.success('Timetable entry deleted successfully');
        } catch (error) {
            console.error('Error deleting timetable:', error);
            toast.error('Failed to delete timetable entry.');
        } finally {
            setLoading(false);
        }
    };

    // Handle input changes for forms
    const handleInput = (name) => (e) => {
        if (name === 'setTimetables') {
            setTimetable(e);
        } else {
            setTimetable((prevTimetable) => ({ ...prevTimetable, [name]: e.target.value }));
        }
    };

    useEffect(() => {
        if (userID) {
            getTimetable();
        }
    }, [userID]);

    return (
        <TimetableContext.Provider
            value={{
                timetables,
                setTimetable,
                createTimetable,
                deleteTimetable,
                handleInput,
                setLoading,
                loading,
            }}
        >
            {children}
        </TimetableContext.Provider>
    );
};

export const useTimetableContext = () => {
    return useContext(TimetableContext);
};
