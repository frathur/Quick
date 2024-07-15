import { create } from 'zustand'

export const useUserStore = create((set) => ({
  isLoggedIn: false,
  setUserState: (isLoggedIn) => set({ isLoggedIn }),
  loggedInUser: '',
  setLoggedInUser: (loggedInUser) => set({ loggedInUser }),
  recipientUser: '',
  setRecipientUser: (recipientUser) => set({ recipientUser }),
}))
