import { configureStore } from '@reduxjs/toolkit'
import issueSlice from './slice/issueSlice'

const store = configureStore({
  reducer: {
    issueReducer: issueSlice,
  },
})

export default store
