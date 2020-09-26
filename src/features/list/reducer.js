import { createSlice } from '@reduxjs/toolkit';

export const reducer = createSlice({
  name: 'list',
  initialState: {
    list: [],
    element: {},
  },
  reducers: {
    getElement: (state, action) => {
      const element = state.list.findIndex(ele => ele.id === action['payload']);
      if (element !== -1) {
        state.element = state.list[element];
      } else {
        alert('Invalid Id supplied!');
      }
    },
    addToTodo: (state, action) => {
      action.payload = {
        ...action.payload,
        id: state.list.length <= 0 ? 1 : ++state.list[state.list.length - 1].id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      state.list = [...state.list, action.payload];
    },
    editToTodo: (state, action) => {
      const element = state.list.findIndex(ele => ele.id === action['payload'].id);
      if (element !== -1) {
        action['payload'].data = {
          ...action['payload'].data,
          id: state.list[element].id,
          updatedAt: new Date().toISOString()
        };
        state.list.splice(element, 1);
        state.list = [...state.list, action['payload'].data];
      } else {
        alert('Invalid Id supplied!');
      }
    },
    deleteFromTodo: (state, action) => {
      const element = state.list.findIndex(ele => ele.id === action['payload']);
      if (element !== -1) {
        state.list.splice(element, 1);
      } else {
        alert('Invalid Id supplied!');
      }
    },
  },
});

export const { getElement, addToTodo, editToTodo, deleteFromTodo } = reducer.actions;

export const selectList = state => state.list.list;
export const selectElement = state => state.list.element;

export default reducer.reducer;
