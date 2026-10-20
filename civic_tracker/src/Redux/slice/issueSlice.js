import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getAllIssuesAPI } from '../../services/allAPI'

export const fetchIssues = createAsyncThunk('issues/fetchIssues', async () => {
  const result = await getAllIssuesAPI()
  return result.data
})

const issueSlice = createSlice({
  name: 'issues',
  initialState: {
    allIssues: [],
    loading: false,
    error: '',
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchIssues.fulfilled, (state, action) => {
      // resolved issues last, then the most supported first
      state.allIssues = [...action.payload].sort((a, b) => {
        if (a.status === 'Resolved' && b.status !== 'Resolved') return 1
        if (a.status !== 'Resolved' && b.status === 'Resolved') return -1

        return (b.supporters?.length || 0) - (a.supporters?.length || 0)
      })
      state.loading = false
      state.error = ''
    })
    builder.addCase(fetchIssues.pending, (state) => {
      state.loading = true
      state.error = ''
    })
    builder.addCase(fetchIssues.rejected, (state) => {
      state.loading = false
      state.error = 'Unable to load issues. Check JSON Server.'
    })
  },
})

export default issueSlice.reducer
