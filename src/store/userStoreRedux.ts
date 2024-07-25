import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { CurrentUser } from '@/core/service/user';

import { Permission } from '#/entity';

export interface UserRedux {
  user?: CurrentUser;
  permission: Permission[];
}

const initialState: UserRedux = {
  permission: [],
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state: UserRedux, action: PayloadAction<CurrentUser>) => {
      state.user = action.payload;
    },
    resetUser: (state: UserRedux) => {
      state.user = undefined;
    },
    setPermission: (state: UserRedux, action: PayloadAction<Permission[]>) => {
      state.permission = action.payload;
    },
    resetPermission: (state: UserRedux) => {
      state.permission = [];
    },
    resetAll: (state: UserRedux) => {
      state = {
        permission: [],
      };
    },
  },
});

// Action creators are generated for each case reducer function
export const { setUser, resetUser, setPermission, resetPermission, resetAll } = userSlice.actions;

export default userSlice.reducer;
