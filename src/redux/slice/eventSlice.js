import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';

// Create Personal Info
export const createEvent = createAsyncThunk(
    'event/createEvent',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('/event', formData);
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const fetchEventById = createAsyncThunk(
    'event/fetchEventById',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/event', formData);
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);


export const updateEvent = createAsyncThunk(
    'event/updateEvent',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.patch('/event', formData);
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);


export const deleteEvent = createAsyncThunk(
    'event/deleteEvent',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.delete('/event', formData);
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);


const Slice = createSlice({
    name: 'event',
    initialState: {
        loading: false,
        success: null,
        error: null,
        data: null,
    },
    reducers: {
        resetEventState: (state) => {
            state.loading = false;
            state.success = null;
            state.error = null;
            state.data = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Create Personal Info
            .addCase(createEvent.pending, (state) => {
                state.loading = true;
                state.success = null;
                state.error = null;
            })
            .addCase(createEvent.fulfilled, (state, action) => {
                state.loading = false;
                state.success = { message: action.payload.message || 'Personal info created successfully' };
                state.data = action.payload;
            })
            .addCase(createEvent.rejected, (state, action) => {
                state.loading = false;
                state.success = null;
                state.error = action.payload;
            })

            // Create Bank Info
            .addCase(createBankInfo.pending, (state) => {
                state.loading = true;
                state.success = null;
                state.error = null;
            })
            .addCase(createBankInfo.fulfilled, (state, action) => {
                state.loading = false;
                state.success = { message: action.payload.message || 'Bank info created successfully' };
                state.bankInfo = action.payload.data;
                state.data = action.payload;
            })
            .addCase(createBankInfo.rejected, (state, action) => {
                state.loading = false;
                state.success = null;
                state.error = action.payload;
            })

            // Create Craft Info
            .addCase(createCraftInfo.pending, (state) => {
                state.loading = true;
                state.success = null;
                state.error = null;
            })
            .addCase(createCraftInfo.fulfilled, (state, action) => {
                state.loading = false;
                state.success = { message: action.payload.message || 'Craft info created successfully' };
                state.craftInfo = action.payload.data;
                state.data = action.payload;
            })
            .addCase(createCraftInfo.rejected, (state, action) => {
                state.loading = false;
                state.success = null;
                state.error = action.payload;
            })

            // Get Personal Info
            .addCase(getPersonalInfo.pending, (state) => {
                state.loading = true;
                state.success = null;
                state.error = null;
            })
            .addCase(getPersonalInfo.fulfilled, (state, action) => {
                state.loading = false;
                state.success = null;
                state.personalInfo = action.payload.data;
                state.data = action.payload;
            })
            .addCase(getPersonalInfo.rejected, (state, action) => {
                state.loading = false;
                state.success = null;
                state.error = action.payload;
            })

            // Update Personal Info
            .addCase(updatePersonalInfo.pending, (state) => {
                state.loading = true;
                state.success = null;
                state.error = null;
            })
            .addCase(updatePersonalInfo.fulfilled, (state, action) => {
                state.loading = false;
                state.success = {
                    message: action.payload.message || 'Personal info updated successfully',
                    source: action.payload.source
                };
                state.personalInfo = action.payload.data;
                state.data = action.payload;
            })
            .addCase(updatePersonalInfo.rejected, (state, action) => {
                state.loading = false;
                state.success = null;
                state.error = action.payload;
            })

            // Get Bank Info
            .addCase(getBankInfo.pending, (state) => {
                state.loading = true;
                state.success = null;
                state.error = null;
            })
            .addCase(getBankInfo.fulfilled, (state, action) => {
                state.loading = false;
                state.success = null;
                state.bankInfo = action.payload.data;
                state.data = action.payload;
            })
            .addCase(getBankInfo.rejected, (state, action) => {
                state.loading = false;
                state.success = null;
                state.error = action.payload;
            })

            // Update Bank Info
            .addCase(updateBankInfo.pending, (state) => {
                state.loading = true;
                state.success = null;
                state.error = null;
            })
            .addCase(updateBankInfo.fulfilled, (state, action) => {
                state.loading = false;
                state.success = {
                    message: action.payload.message || 'Bank info updated successfully',
                    source: action.payload.source
                };
                state.bankInfo = action.payload.data;
                state.data = action.payload;
            })
            .addCase(updateBankInfo.rejected, (state, action) => {
                state.loading = false;
                state.success = null;
                state.error = action.payload;
            })

            // Get Craft Info
            .addCase(getCraftInfo.pending, (state) => {
                state.loading = true;
                state.success = null;
                state.error = null;
            })
            .addCase(getCraftInfo.fulfilled, (state, action) => {
                state.loading = false;
                state.success = null;
                state.craftInfo = action.payload.data;
                state.data = action.payload;
            })
            .addCase(getCraftInfo.rejected, (state, action) => {
                state.loading = false;
                state.success = null;
                state.error = action.payload;
            })

            // Update Craft Info
            .addCase(updateCraftInfo.pending, (state) => {
                state.loading = true;
                state.success = null;
                state.error = null;
            })
            .addCase(updateCraftInfo.fulfilled, (state, action) => {
                state.loading = false;
                state.success = {
                    message: action.payload.message || 'Craft info updated successfully',
                    source: action.payload.source
                };
                state.craftInfo = action.payload.data;
                state.data = action.payload;
            })
            .addCase(updateCraftInfo.rejected, (state, action) => {
                state.loading = false;
                state.success = null;
                state.error = action.payload;
            });
    },
});

export const { resetEventState } = eventSlice.actions;
export default eventSlice.reducer;