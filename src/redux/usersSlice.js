import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { firestore } from "../firebase/firebaseConfig";

export const fetchUsersData = createAsyncThunk(
  "pagination",
  async (thunkAPI, { getState, dispatch }) => {
    try {
      const userCollectionRef = firestore.collection("users");
      const lastDocId = getState().users.lastDocId;

      let usersRef;
      if (!lastDocId) {
        usersRef = await userCollectionRef
          .orderBy("name", "asc")
          .limit(3)
          .get();
      } else {
        const lastDocData = await userCollectionRef.doc(lastDocId).get();
        usersRef = await userCollectionRef
          .orderBy("name", "asc")
          .startAfter(lastDocData.data().name)
          .limit(3)
          .get();
      }

      let usersData = [];
      if (!usersRef.empty) {
        for (let i in usersRef.docs) {
          usersData.push(usersRef.docs[i].data());
        }
        const last = usersRef.docs[usersRef.docs.length - 1].id;
        dispatch(usersLastDocumentId(last));
      } else {
        dispatch(usersNoMoreData(true));
      }
      return usersData;
    } catch (error) {
      return error;
    }
  }
);

export const usersSlice = createSlice({
  name: "users",
  initialState: {
    loading: false,
    usersList: [],
    lastDocId: "",
    dataEndCheck: false,
  },
  reducers: {
    usersLastDocumentId(state, action) {
      state.lastDocId = action.payload;
    },
    usersNoMoreData(state, action) {
      state.dataEndCheck = action.payload;
    },
  },
  extraReducers: {
    [fetchUsersData.pending]: (state, action) => {
      state.loading = true;
    },
    [fetchUsersData.fulfilled]: (state, action) => {
      state.usersList = [...state.usersList, ...action.payload];
      state.loading = false;
    },
    [fetchUsersData.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { usersLastDocumentId, usersNoMoreData } = usersSlice.actions;

export default usersSlice.reducer;
