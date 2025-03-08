import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  step: 1,
  course: null,
  editDocument: false,
 
}

const documentSlice = createSlice({
  name: "document",
  initialState,
  reducers: {
    setStep: (state, action) => {
      state.step = action.payload
    },
    setDocument: (state, action) => {
      state.document = action.payload
    },
    setEditDocument: (state, action) => {
      state.editDocument = action.payload
    },
    
    resetDocumentState: (state) => {
      state.step = 1
      state.document = null
      state.editDocument = false
    },
  },
})

export const {setStep,  setDocument,  setEditDocument,  resetDocumentState,} = documentSlice.actions
   

export default documentSlice.reducer