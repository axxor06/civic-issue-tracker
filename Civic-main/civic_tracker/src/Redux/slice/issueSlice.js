import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getAllIssuesAPI } from '../../services/allAPI'

// unresolved first, then most supported, then newest
const byPriority = (a, b) => {
  const aDone = a.status === 'Resolved'
  const bDone = b.status === 'Resolved'
  if (aDone !== bDone) return aDone ? 1 : -1
  const diff = (b.supporters?.length || 0) - (a.supporters?.length || 0)
  if (diff !== 0) return diff
  return new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
}

export const fetchIssues = createAsyncThunk(
  'issues/fetchIssues',
  async (_, { rejectWithValue }) => {
    try {
      const result = await getAllIssuesAPI()
      return result.data
    } catch {
      return rejectWithValue('Unable to load issues. Is json-server running?')
    }
  }
)

const issueSlice = createSlice({
  name: 'issues',
  initialState: {
    allIssues: [],
    loading: false,
    error: '',
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchIssues.pending, (state) => {
      state.loading = true
      state.error = ''
    })
    builder.addCase(fetchIssues.fulfilled, (state, action) => {
      state.allIssues = [...action.payload].sort(byPriority)
      state.loading = false
    })
    builder.addCase(fetchIssues.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload || 'api failed'
    })
  },
})

export default issueSlice.reducer
